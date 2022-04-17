using AutoMapper;
using TrackerWebAPI.Models.DTO;

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
