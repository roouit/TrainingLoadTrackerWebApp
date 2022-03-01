using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public interface IUserService
    {
        public Task<UserDTO> GetUser(string username);

        public Task<User> GetUser(Guid userId);

        public Task<IEnumerable<User>> GetUsers();

        public Task<UserDTO> Register(UserRegisterDTO request);

        public Task<UserDTO> Login(UserLoginDTO request);

        public Task<bool> DeleteUser(Guid userId);

        public bool UserExists(string username);

        public bool EmailExists(string email);
    }
}
