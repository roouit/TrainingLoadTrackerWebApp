namespace TrackerWebAPI.Models.DTO
{
    public class SessionDTO
    {
        public Guid SessionId { get; set; }
        public int Rpe { get; set; }
        public int Duration { get; set; }
        public DateTime Date { get; set; }
    }
}
