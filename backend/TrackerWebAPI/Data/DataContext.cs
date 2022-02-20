using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TrackerWebAPI.Models;

namespace TrackerWebAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options) { }

        public DbSet<Session> Sessions { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
