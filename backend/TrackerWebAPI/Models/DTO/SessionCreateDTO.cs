using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models.DTO
{
    public class SessionCreateDTO
    {
        [Required(ErrorMessage = "Rpe value can't be empty")]
        [Range(1, 10, ErrorMessage = "Rpe value must be between 1-10")]
        public int Rpe { get; set; }

        [Required(ErrorMessage = "Duration value can't be empty")]
        [Range(1, 1000000, ErrorMessage = "Duration value must be between 1-1000000 minutes")]
        public int Duration { get; set; }

        [Required(ErrorMessage = "Date value can't be empty")]
        [DataType(DataType.Date, ErrorMessage = "Date value must be valid date")]
        public DateTime Date { get; set; }
    }
}
