﻿using System.ComponentModel.DataAnnotations;

namespace TrackerWebAPI.Models
{
    public class UserDTO
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}