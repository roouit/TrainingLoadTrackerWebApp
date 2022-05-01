using TrackerWebAPI.Models;
using TrackerWebAPI.Models.DTO;

namespace TrackerWebAPI.Services
{
    public interface IUserService
    {
        public Task<UserDTO> GetUser(string email);

        public Task<UserDTO> GetUser(Guid userId);

        public Task<CalculationReliabilityDTO> GetCalculationReliability(Guid userId);

        public Task<IEnumerable<User>> GetUsers();

        public Task<UserDTO> Register(UserRegisterDTO request);

        public Task<string> Login(UserLoginDTO request, HttpContext context);

        public Task ChangePassword(Guid userId, ChangePasswordDTO request);

        public Task<bool> DeleteUser(Guid userId);

        public Task Update(Guid userId, UserUpdateDTO request);

        public bool EmailExists(string email);

        public bool UserExists(Guid userId);

        public Guid GetUserIdForEmail(string email);
    }
}
