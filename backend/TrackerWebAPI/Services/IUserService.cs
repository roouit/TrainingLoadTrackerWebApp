using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public interface IUserService
    {
        public Task<User> GetUser(UserLogin request);

        public Task<User> CreateUser(UserRegister request);
        public bool DeleteUser(int id);
    }
}
