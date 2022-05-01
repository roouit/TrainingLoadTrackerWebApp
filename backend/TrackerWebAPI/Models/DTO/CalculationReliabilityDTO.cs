namespace TrackerWebAPI.Models.DTO
{
    public class CalculationReliabilityDTO
    {
        public CalculationReliabilityDTO(bool reliable)
        {
            Reliable = reliable;
        }

        public bool Reliable { get; set; }
    }
}
