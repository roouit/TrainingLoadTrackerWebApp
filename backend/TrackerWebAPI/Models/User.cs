using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    public class User
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        // TODO: Use pw encryption
        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

    }
}
