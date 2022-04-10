using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public interface IUserService
    {
        public Task<UserDTO> GetUser(string email);

        public Task<User> GetUser(Guid userId);

        public Task<IEnumerable<User>> GetUsers();

        public Task<UserDTO> Register(UserRegisterDTO request);

        public Task<string> Login(UserLoginDTO request, HttpContext context);

        public Task<bool> DeleteUser(string email);

        public bool EmailExists(string email);

        public Guid GetUserIdForEmail(string email);
    }
}
