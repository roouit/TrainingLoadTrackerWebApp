﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UserService(DataContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<string> Login(UserLoginDTO request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            return isPasswordValid ? CreateToken(user) : null;
        }

        public async Task<UserDTO> Register(UserRegisterDTO request)
        {
            ValidateRegisterRequest(request);
            var user = new User(request, BCrypt.Net.BCrypt.HashPassword(request.Password));
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<bool> DeleteUser(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<UserDTO> GetUser(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<User> GetUser(Guid userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: "http://localhost:7286",
                audience: "http://localhost:7286",
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: cred);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public bool UserExists(string username)
        {
            return _context.Users.Any(user => user.Username == username);
        }

        public bool EmailExists(string email)
        {
            return _context.Users.Any(user => user.Email == email);
        }

        private void ValidateRegisterRequest(UserRegisterDTO request)
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
