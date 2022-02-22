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

        [HttpPost("Register")]
        public async Task<ActionResult<User>> Register(UserRegister request)
        {
            var user = await _userService.Register(request);
            return user;
        }

        [HttpGet("Login")]
        public async Task<ActionResult<User>> Login(UserLogin request)
        {
            var user = await _userService.Login(request);
            return user;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/single
        [HttpGet("single")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _userService.GetUser(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // DELETE: api/Users
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var isSuccesful = await _userService.DeleteUser(id);
            if (!isSuccesful)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
