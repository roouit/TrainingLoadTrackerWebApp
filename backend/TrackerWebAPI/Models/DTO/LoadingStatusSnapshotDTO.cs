namespace TrackerWebAPI.Models.DTO
{
    public enum WorkloadCalculateMethod
    {
        RollingAverage,
        ExponentiallyWeightedMovingAverage
    }

    public class LoadingStatusSnapshotDTO
    {
        public LoadingStatusSnapshotDTO(double acute, double chronic, double ratio, WorkloadCalculateMethod method, DateTime snapshotDate, int dailyLoad)
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
        public double Acute { get; set; }
        public double Chronic { get; set; }
        public double Ratio { get; set; }
        public int DailyLoad { get; set; }
    }
}
