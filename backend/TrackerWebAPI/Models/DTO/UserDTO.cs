using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models.DTO
{
    public class UserDTO
    {
        public string Email { get; set; }

        public int AcuteRange { get; set; }

        public int ChronicRange { get; set; }

        public WorkloadCalculateMethod CalculationMethod { get; set; }
    }
}
