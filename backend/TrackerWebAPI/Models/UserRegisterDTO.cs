using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    public class UserRegisterDTO
    {
        [Required(ErrorMessage = "Password can't be empty")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters")]
        [MaxLength(55, ErrorMessage = "Maximum length of a password is 55 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Email can't be empty")]
        [EmailAddress(ErrorMessage = "Email address is not valid")]
        [MaxLength(256, ErrorMessage = "Maximum length of an email address is 256 characters")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Acute range can't be empty")]
        [Range(3, 15, ErrorMessage = "Acute range must be between 3-15 days")]
        public int AcuteRange { get; set; }

        [Required(ErrorMessage = "Chronic range can't be empty")]
        [Range(7, 50, ErrorMessage = "Chronic range must be between 7-50 days")]
        public int ChronicRange { get; set; }

        [Required(ErrorMessage = "Calculate method can't be empty")]
        public WorkloadCalculateMethod CalculationMethod { get; set; }
    }
}
