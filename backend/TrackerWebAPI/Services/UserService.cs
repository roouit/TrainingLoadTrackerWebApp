using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;

        public UserService(DataContext context, IMapper mapper, IConfiguration configuration, ITokenService tokenService)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _tokenService = tokenService;
        }

        public async Task<string> Login(UserLoginDTO request, HttpContext context)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            return isPasswordValid ? _tokenService.CreateToken(user, context) : null;
        }

        public async Task<UserDTO> Register(UserRegisterDTO request)
        {
            var user = new User(request, BCrypt.Net.BCrypt.HashPassword(request.Password));
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<bool> DeleteUser(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<UserDTO> GetUser(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
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

        public bool EmailExists(string email)
        {
            return _context.Users.Any(user => user.Email == email);
        }

        public Guid GetUserIdForEmail(string email)
        {
            return _context.Users
                .Where(u => u.Email == email)
                .Select(u => u.UserId)
                .FirstOrDefault();
        }
    }
}
