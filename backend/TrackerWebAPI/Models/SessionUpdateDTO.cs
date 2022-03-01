using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    public class SessionUpdateDTO
    {
        [Required(ErrorMessage = "Session id can't be empty")]
        public Guid SessionId { get; set; }

        [Range(1, 10, ErrorMessage = "Rpe value must be between 1-10")]
        public int Rpe { get; set; }

        [Range(1, 4320, ErrorMessage = "Duration value must be between 1-4320 minutes")]
        public int Duration { get; set; }

        [DataType(DataType.Date, ErrorMessage = "Date value must be valid date")]
        public DateTime Date { get; set; }
    }
}
