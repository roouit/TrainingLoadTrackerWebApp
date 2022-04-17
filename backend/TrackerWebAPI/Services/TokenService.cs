using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string CreateToken(User user, HttpContext context)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.Now.AddDays(60),
                signingCredentials: cred);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        public string? GetEmailFromIdentity(HttpContext context)
        {
            var identity = GetIdentity(context);

            if (identity != null)
                return identity.FindFirst(ClaimTypes.Email)?.Value;

            return null;
        }

        public Guid? GetIdFromIdentity(HttpContext context)
        {
            var identity = GetIdentity(context);

            if (identity != null)
            {
                string? Id = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (Id != null)
                    return Guid.Parse(Id);
            }

            return null;
        }

        private static ClaimsIdentity? GetIdentity(HttpContext context)
        {
            return context.User.Identity as ClaimsIdentity;
        }
    }
}
