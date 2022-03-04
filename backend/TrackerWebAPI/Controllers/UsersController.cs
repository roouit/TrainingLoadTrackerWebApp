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

        public UsersController(IUserService userService)
        {
            _userService = userService;
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> Login(UserLoginDTO request)
        {
            if (!_userService.UserExists(request.Username))
                return NotFound("User not found");

            var token = await _userService.Login(request);
            if (token == null)
                return Unauthorized("Password didn't match");

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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDTO>> GetUser()
        {
            var username = GetUsernameFromIdentity();
            if (string.IsNullOrWhiteSpace(username))
                return NotFound("Error when fetching user identity");

            var user = await _userService.GetUser(username);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUser()
        {
            var username = GetUsernameFromIdentity();
            if (string.IsNullOrWhiteSpace(username))
                return NotFound("Error when fetching user identity");

            var isSuccesful = await _userService.DeleteUser(username);
            if (!isSuccesful)
                return NotFound("User not found");

            return NoContent();
        }

        private string GetUsernameFromIdentity()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null)
                return string.Empty;

            return identity.FindFirst(ClaimTypes.Name).Value;
        }
    }
}
