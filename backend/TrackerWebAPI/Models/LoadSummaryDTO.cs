namespace TrackerWebAPI.Models
{
    public enum WorkloadCalculateMethod
    {
        RollingAverage,
        ExponentiallyWeightedMovingAverage
    }

    public class LoadSummaryDTO
    {
        public LoadSummaryDTO(int acute, int chronic, float ratio, WorkloadCalculateMethod method)
        {
            Method = method;
            Acute = acute;
            Chronic = chronic;
            Ratio = ratio;
        }
        public WorkloadCalculateMethod Method { get; set; }
        public int Acute { get; set; }
        public int Chronic { get; set; }
        public float Ratio { get; set; }
    }
}
