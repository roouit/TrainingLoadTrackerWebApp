using AutoMapper;

namespace TrackerWebAPI.Models
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<User, UserDTO>();
            CreateMap<Session, SessionDTO>();
        }
    }
}
