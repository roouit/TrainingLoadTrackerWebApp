using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    public class User
    {
        public User()
        {

        }
        public User(UserRegister request, string passwordHash)
        {
            Id = Guid.NewGuid();
            Username = request.Username;
            PasswordHash = passwordHash;
            Email = request.Email;
            FirstName = request.FirstName;
            LastName = request.LastName;
        }
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

    }
}
