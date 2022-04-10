using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public interface ISessionService
    {
        public Task<SessionDTO> GetSession(Guid sessionId);

        // Created for debugging purposes
        public Task<IEnumerable<Session>> GetFullSessions(string email);

        public Task<IEnumerable<SessionDTO>> GetSessions(string email);

        public Task<SessionDTO> Create(SessionCreateDTO request, string email);

        public Task<SessionDTO> Update(Guid sessionId, SessionUpdateDTO request);

        public Task<bool> DeleteSession(Guid sessionId);

        public Task<LoadingStatusSnapshotDTO> GetLoadingStatusSnapshot(string email, DateTime snapshotDate);

        public Task<IEnumerable<LoadingStatusSnapshotDTO>> GetLoadingStatusHistory(string email);
    }
}
