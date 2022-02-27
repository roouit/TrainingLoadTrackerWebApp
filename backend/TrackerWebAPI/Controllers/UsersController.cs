#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;
using TrackerWebAPI.Services;

namespace TrackerWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IUserService _userService;

        public UsersController(DataContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        // POST: api/Users/Register
        [HttpPost("Register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<User>> Register(UserRegister request)
        {
            if (_userService.UserExists(request.Username))
                return BadRequest("Username is already taken");

            if (_userService.EmailExists(request.Email))
                return BadRequest("Email is already in use");

            try
            {
                var user = await _userService.Register(request);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // POST: api/Users/Login
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> Login(UserLogin request)
        {
            if (!_userService.UserExists(request.Username))
                return NotFound("User not found");

            var user = await _userService.Login(request);
            if (user == null)
                return Unauthorized("Password didn't match");

            return Ok(user);
        }

        // GET: api/Users
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/single
        [HttpGet("single")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _userService.GetUser(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }

        // DELETE: api/Users
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var isSuccesful = await _userService.DeleteUser(id);
            if (!isSuccesful)
            {
                return NotFound("User not found");
            }

            return NoContent();
        }
    }
}
