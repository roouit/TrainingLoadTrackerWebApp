using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public interface ITokenService
    {
        public string CreateToken(User user, HttpContext context);

        public string? GetEmailFromIdentity(HttpContext context);

        public Guid? GetIdFromIdentity(HttpContext context);
    }
}
