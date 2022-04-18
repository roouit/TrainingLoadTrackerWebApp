#nullable disable
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackerWebAPI.Models;
using TrackerWebAPI.Models.DTO;
using TrackerWebAPI.Services;

namespace TrackerWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public UsersController(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserDTO>> Register(UserRegisterDTO request)
        {
            if (_userService.EmailExists(request.Email))
                return BadRequest("Email is already in use");

            try
            {
                var user = await _userService.Register(request);
                return CreatedAtAction(nameof(GetUser), new { email = user.Email }, user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> Login(UserLoginDTO request)
        {
            if (!_userService.EmailExists(request.Email))
                return Unauthorized("Login information isn't correct");

            var token = await _userService.Login(request, HttpContext);

            if (token == null)
                return Unauthorized("Login information isn't correct");

            return Ok(token);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDTO>> GetUser()
        {
            var userId = _tokenService.GetIdFromIdentity(HttpContext);

            if (userId == null)
                return Forbid("Error when fetching user identity");

            var user = await _userService.GetUser((Guid)userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }

        [HttpPut("Changepassword")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO request)
        {
            var userId = _tokenService.GetIdFromIdentity(HttpContext);

            if (userId == null)
                return Forbid("Error when fetching user identity");

            if (!_userService.UserExists((Guid)userId))
                return Unauthorized("Identity information isn't correct");

            try
            {
                await _userService.ChangePassword((Guid)userId, request);

                return NoContent();
            }
            catch (Exception e)
            {
                if (e.Message == "401")
                    return Unauthorized("Password was not correct");

                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUser(UserUpdateDTO request)
        {
            var userId = _tokenService.GetIdFromIdentity(HttpContext);

            if (userId == null)
                return Forbid("Error when fetching user identity");

            if (!_userService.UserExists((Guid)userId))
                return Unauthorized("Identity information isn't correct");

            try
            {
                await _userService.Update((Guid)userId, request);

                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUser()
        {
            var userId = _tokenService.GetIdFromIdentity(HttpContext);

            if (userId == null)
                return Forbid("Error when fetching user identity");

            if (!_userService.UserExists((Guid)userId))
                return Unauthorized("Identity information isn't correct");

            var isSuccesful = await _userService.DeleteUser((Guid)userId);

            if (!isSuccesful)
                return StatusCode(500, "Deleting user failed");

            return NoContent();
        }
    }
}
