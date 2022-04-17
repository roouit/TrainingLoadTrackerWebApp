using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models.DTO
{
    public class UserUpdateDTO
    {
        [EmailAddress(ErrorMessage = "Email address is not valid")]
        [MaxLength(256, ErrorMessage = "Maximum length of an email address is 256 characters")]
        public string? Email { get; set; }

        [Range(3, 15, ErrorMessage = "Acute range must be between 3-15 days")]
        public int? AcuteRange { get; set; }

        [Range(7, 50, ErrorMessage = "Chronic range must be between 7-50 days")]
        public int? ChronicRange { get; set; }

        [EnumDataType(typeof(WorkloadCalculateMethod))]
        public WorkloadCalculateMethod? CalculationMethod { get; set; }
    }
}
