using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    public class UserRegister
    {
        [Required(ErrorMessage = "Username can't be empty")]
        [MinLength(2, ErrorMessage = "Username must have at least 2 characters")]
        [MaxLength(128, ErrorMessage = "Maximum length of a username is 128 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password can't be empty")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters")]
        [MaxLength(55, ErrorMessage = "Maximum length of a password is 55 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Email can't be empty")]
        [EmailAddress(ErrorMessage = "Email address is not valid")]
        [MaxLength(256, ErrorMessage = "Maximum length of an email address is 256 characters")]
        public string Email { get; set; }

        [MaxLength(128, ErrorMessage = "Maximum length of a first name is 128 characters")]
        public string FirstName { get; set; }

        [MaxLength(128, ErrorMessage = "Maximum length of a last name is 128 characters")]
        public string LastName { get; set; }
    }
}
