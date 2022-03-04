#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;
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
            if (_userService.UserExists(request.Username))
                return BadRequest("Username is already taken");

            if (_userService.EmailExists(request.Email))
                return BadRequest("Email is already in use");

            try
            {
                var user = await _userService.Register(request);
                return CreatedAtAction(nameof(GetUser), new { username = user.Username }, user);
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
            if (!_userService.UserExists(request.Username))
                return Unauthorized("Login information isn't correct");

            var token = await _userService.Login(request, HttpContext);

            if (token == null)
                return Unauthorized("Login information isn't correct");

            return Ok(token);
        }

        [HttpGet("debug/full")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var userList = await _userService.GetUsers();
            return Ok(userList);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDTO>> GetUser()
        {
            var username = _tokenService.GetUsernameFromIdentity(HttpContext);

            if (string.IsNullOrWhiteSpace(username))
                return Forbid("Error when fetching user identity");

            var user = await _userService.GetUser(username);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUser()
        {
            var username = _tokenService.GetUsernameFromIdentity(HttpContext);

            if (string.IsNullOrWhiteSpace(username))
                return Forbid("Error when fetching user identity");

            var isSuccesful = await _userService.DeleteUser(username);

            if (!isSuccesful)
                return NotFound("User not found");

            return NoContent();
        }
    }
}
