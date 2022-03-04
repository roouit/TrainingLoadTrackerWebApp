using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public interface ISessionService
    {
        public Task<SessionDTO> GetSession(Guid sessionId);

        // Created for debugging purposes
        public Task<IEnumerable<Session>> GetFullSessions(string username);

        public Task<IEnumerable<SessionDTO>> GetSessions(string username);

        public Task<SessionDTO> Create(SessionCreateDTO request, string username);

        public Task<SessionDTO> Update(Guid sessionId, SessionUpdateDTO request);

        public Task<bool> DeleteSession(Guid sessionId);
    }
}
