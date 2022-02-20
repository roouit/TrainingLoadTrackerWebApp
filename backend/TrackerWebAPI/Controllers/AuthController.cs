using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrackerWebAPI.Models;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using TrackerWebAPI.Data;
using Microsoft.AspNetCore.Authorization;
using TrackerWebAPI.Services;

namespace VelocityNetAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public static User user = new User();
        //private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        public AuthController(IConfiguration configuration, IUserService userService)
        {
            //_configuration = configuration;
            _userService = userService;
        }

        [HttpPost("Register")]
        public async Task<ActionResult<User>> Register(UserRegister request)
        {
            //CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            if (string.IsNullOrWhiteSpace(request.Username)) return BadRequest("Username was empty");
            if (string.IsNullOrWhiteSpace(request.Password)) return BadRequest("Password was empty");
            if (string.IsNullOrWhiteSpace(request.Email)) return BadRequest("Email was empty");

            var user = await _userService.CreateUser(request);

            if (user == null) return BadRequest("User was null");

            return Ok(user);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login(UserLogin request)
        {
            //search for user
            var user = await _userService.GetUser(request);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            if (!(request.Password == user.Password))
            {
                return BadRequest("Wrong Password");
            }
            //string token = CreateToken(user);
            return Ok();
        }


        //private string CreateToken(User user)
        //{
        //    List<Claim> claims = new List<Claim>
        //    {
        //        new Claim(ClaimTypes.Name, user.Name),
        //        new Claim(ClaimTypes.Role, user.Role),
        //    };
        //    var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:key"]));
        //    var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        //    var token = new JwtSecurityToken(
        //        claims: claims,
        //        expires: DateTime.Now.AddDays(1),
        //        signingCredentials: cred);

        //    var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        //    return jwt;
        //}

        private void CreatePasswordHash(String password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (HMACSHA512 hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        //private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        //{
        //    using (HMACSHA512 hmac = new HMACSHA512(passwordSalt))
        //    {
        //        var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        //        return computedHash.SequenceEqual(passwordHash);
        //    }
        //}

    }
}