namespace TrackerWebAPI.Models
{
    public enum WorkloadCalculateMethod
    {
        RollingAverage,
        ExponentiallyWeightedMovingAverage
    }

    public class LoadingStatusSnapshotDTO
    {
        public LoadingStatusSnapshotDTO(int acute, int chronic, float ratio, WorkloadCalculateMethod method, DateTime snapshotDate, int dailyLoad)
        {
            Method = method;
            Acute = acute;
            Chronic = chronic;
            Ratio = ratio;
            SnapshotDate = snapshotDate;
            DailyLoad = dailyLoad;
        }
        public WorkloadCalculateMethod Method { get; set; }
        public DateTime SnapshotDate { get; set; }
        public int Acute { get; set; }
        public int Chronic { get; set; }
        public float Ratio { get; set; }
        public int DailyLoad { get; set; }
    }
}
