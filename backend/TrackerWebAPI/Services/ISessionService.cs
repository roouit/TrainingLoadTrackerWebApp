using TrackerWebAPI.Models;
using TrackerWebAPI.Models.DTO;

namespace TrackerWebAPI.Services
{
    public interface ISessionService
    {
        public Task<SessionDTO> GetSession(Guid sessionId);

        // Created for debugging purposes
        public Task<IEnumerable<Session>> GetFullSessions(Guid userId);

        public Task<IEnumerable<SessionDTO>> GetSessions(Guid userId);

        public Task<SessionDTO> Create(SessionCreateDTO request, Guid userId);

        public Task<SessionDTO> Update(Guid sessionId, SessionUpdateDTO request);

        public Task<bool> DeleteSession(Guid sessionId);

        public Task<LoadingStatusSnapshotDTO> GetLoadingStatusSnapshot(Guid userId, DateTime snapshotDate);

        public Task<IEnumerable<LoadingStatusSnapshotDTO>> GetLoadingStatusHistory(Guid userId);
    }
}
