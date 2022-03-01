﻿using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    public class Session
    {
        public Session()
        {

        }
        public Session(SessionCreateDTO request)
        {
            SessionId = Guid.NewGuid();
            UserId = request.UserId;
            Rpe = request.Rpe;
            Duration = request.Duration;
            Date = request.Date;
        }
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
