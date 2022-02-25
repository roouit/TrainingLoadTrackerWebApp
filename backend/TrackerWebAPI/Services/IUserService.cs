using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public interface IUserService
    {
        public Task<User> GetUser(string username);

        public Task<User> GetUser(Guid id);

        public Task<User> Register(UserRegister request);

        public Task<User> Login(UserLogin request);

        public Task<bool> DeleteUser(Guid id);

        public bool UserExists(string username);
    }
}
