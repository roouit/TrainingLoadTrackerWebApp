using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    public class UserRegister
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}
