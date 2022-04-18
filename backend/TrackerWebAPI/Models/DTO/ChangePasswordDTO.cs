using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models.DTO
{
    public class ChangePasswordDTO
    {
        [Required(ErrorMessage = "Current password can't be empty")]
        public string CurrentPassword { get; set; }

        [Required(ErrorMessage = "New password can't be empty")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters")]
        [MaxLength(55, ErrorMessage = "Maximum length of a password is 55 characters")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Repeated password can't be empty")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters")]
        [MaxLength(55, ErrorMessage = "Maximum length of a password is 55 characters")]
        public string NewPasswordAgain { get; set; }
    }    
}
