using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TrackerWebAPI.Models
{
    public class Session
    {
        [Required]
        [Key]
        public Guid SessionId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public virtual User User { get; set; }

        [Required]
        [Range(1,10)]
        public int Rpe { get; set; }

        [Required]
        [Range(1, 4320)]
        public int Duration { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
    }
}
