using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;
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
            ValidateRegisterRequest(request);
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

        public bool EmailExists(string email)
        {
            return _context.Users.Any(user => user.Email == email);
        }

        private void ValidateRegisterRequest(UserRegister request)
        {
            // Username can contain basic Latin letters (including åÅäÄöÖ), digits
            // and symbols -_ (symbols can't be the first character)
            var usernameRegex = @"^[a-zA-Z0-9äÄöÖåÅ]{1}[a-zA-Z0-9_äÄöÖåÅ-]+$";

            // This supports most of special characters
            var nameRegex = @"^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$";

            if (!Regex.Match(request.Username, usernameRegex).Success)
                throw new Exception("Username is not valid");

            if (request.FirstName != null && !string.IsNullOrWhiteSpace(request.FirstName) && !Regex.Match(request.FirstName, nameRegex).Success)
                throw new Exception("First name is not valid");

            if (request.LastName != null && !string.IsNullOrWhiteSpace(request.LastName) && !Regex.Match(request.LastName, nameRegex).Success)
                throw new Exception("Last name is not valid");
        }
    }
}
