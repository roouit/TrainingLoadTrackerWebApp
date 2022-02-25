namespace TrackerWebAPI.Models
{
    public class Session
    {
        public Guid Id { get; set; }
        public int Rpe { get; set; }
        public int Duration { get; set; }
        public DateTime Date { get; set; }
    }
}
