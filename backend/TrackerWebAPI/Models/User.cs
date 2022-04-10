using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    [Index(nameof(PasswordHash), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        public User()
        {

        }
        public User(UserRegisterDTO request, string passwordHash)
        {
            UserId = Guid.NewGuid();
            PasswordHash = passwordHash;
            Email = request.Email;
            AcuteRange = request.AcuteRange;
            ChronicRange = request.ChronicRange;
            CalculationMethod = request.CalculationMethod;
        }

        [Required]
        [Key]
        public Guid UserId { get; set; }

        [Required]
        [MinLength(59)]
        [MaxLength(60)]
        public string PasswordHash { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }

        [Required]
        [Range(3, 15)]
        public int AcuteRange { get; set; }

        [Required]
        [Range(7, 50)]
        public int ChronicRange { get; set; }

        [Required]
        public WorkloadCalculateMethod CalculationMethod { get; set; }

        public virtual ICollection<Session> Sessions { get; set; }
    }
}
