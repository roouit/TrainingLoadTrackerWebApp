using Microsoft.EntityFrameworkCore;
using System.Text;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;

        public UserService(DataContext context)
        {
            _context = context;
        }

        public async Task<User> Login(UserLogin request)
        {
            var user = await GetUser(request.Username);
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            return isPasswordValid ? user : null;
        }

        public async Task<User> Register(UserRegister request)
        {
            var user = new User(request, BCrypt.Net.BCrypt.HashPassword(request.Password));
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<User> GetUser(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User> GetUser(Guid id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
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

        public bool UserExists(string username)
        {
            return _context.Users.Any(user => user.Username == username);
        }
    }
}
