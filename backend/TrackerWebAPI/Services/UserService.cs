using Microsoft.EntityFrameworkCore;
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

        public async Task<User> CreateUser(UserRegister request)
        {
            var user = new User();
            user.Username = request.Username;
            user.Password = request.Password;
            user.Email = request.Email;
            user.FirstName = !string.IsNullOrWhiteSpace(request.FirstName) ? request.FirstName : "";
            user.LastName = !string.IsNullOrWhiteSpace(request.LastName) ? request.LastName : "";
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public bool DeleteUser(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<User> GetUser(UserLogin request)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        }
    }
}
