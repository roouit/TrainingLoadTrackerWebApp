using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    [Index(nameof(Username), IsUnique = true)]
    [Index(nameof(PasswordHash), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
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
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(128)]
        public string Username { get; set; }

        [Required]
        [MinLength(59)]
        [MaxLength(60)]
        public string PasswordHash { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }

        [MaxLength(128)]
        public string FirstName { get; set; }

        [MaxLength(128)]
        public string LastName { get; set; }

    }
}
