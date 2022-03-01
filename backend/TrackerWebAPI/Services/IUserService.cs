using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public interface IUserService
    {
        public Task<UserDTO> GetUser(string username);

        public Task<User> GetUser(Guid userId);

        public Task<IEnumerable<User>> GetUsers();

        public Task<UserDTO> Register(UserRegisterDTO request);

        public Task<string> Login(UserLoginDTO request);

        public Task<bool> DeleteUser(string username);

        public bool UserExists(string username);

        public bool EmailExists(string email);
    }
}
