using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;

namespace TrackerWebAPI.Services
{
    public class SessionService : ISessionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public SessionService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SessionDTO> Create(SessionCreateDTO request, string username)
        {
            var userId = _context.Users
                .Where(u => u.Username == username)
                .Select(u => u.UserId)
                .FirstOrDefault();

            var session = new Session(request, userId);

            _context.Sessions.Add(session);

            await _context.SaveChangesAsync();
            
            return _mapper.Map<SessionDTO>(session);
        }

        public async Task<bool> DeleteSession(Guid sessionId)
        {
            var session = await _context.Sessions.FirstOrDefaultAsync(s => s.SessionId == sessionId);
            if (session == null)
            {
                return false;
            }

            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Session>> GetFullSessions(string username)
        {
            return await _context.Sessions
                .Where(s => s.UserId == GetUserIdForUsername(username))
                .ToListAsync();
        }

        public async Task<IEnumerable<SessionDTO>> GetSessions(string username)
        {
            var sessionList = await GetFullSessions(username);
            return _mapper.Map<List<SessionDTO>>(sessionList);
        }

        public async Task<SessionDTO> GetSession(Guid sessionId)
        {
            var session = await _context.Sessions.FindAsync(sessionId);
            return _mapper.Map<SessionDTO>(session);
        }

        public async Task<SessionDTO> Update(Guid sessionId, SessionUpdateDTO request)
        {
            var session = await _context.Sessions.FindAsync(sessionId);
            session.Rpe = request.Rpe;
            session.Duration = request.Duration;
            session.Date = request.Date;

            await _context.SaveChangesAsync();
            return _mapper.Map<SessionDTO>(session);
        }

        public async Task<LoadingStatusSnapshotDTO> GetLoadingStatusSnapshot(string username, DateTime snapshotDate)
        {
            var chronicCutoffDate = snapshotDate.AddDays(-28);
            var acuteCutoffDate = snapshotDate.AddDays(-7);
            var userId = GetUserIdForUsername(username);

            var summary = await GetLinearLoadingStatusSnapshot(userId, snapshotDate, chronicCutoffDate, acuteCutoffDate);

            return summary;
        }

        public async Task<IEnumerable<LoadingStatusSnapshotDTO>> GetLoadingStatusHistory(string username)
        {
            var userId = GetUserIdForUsername(username);

            var firstSessionDate = await _context.Sessions
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Date)
                .Select(s => s.Date)
                .FirstAsync();

            var snapshots = new List<LoadingStatusSnapshotDTO>();

            var currentDate = firstSessionDate;

            while (currentDate <= DateTime.Now)
            {
                snapshots.Add(await GetLinearLoadingStatusSnapshot(userId, currentDate, currentDate.AddDays(-28), currentDate.AddDays(-7)));
                currentDate = currentDate.AddDays(1);
            }

            return snapshots;
        }

        private Guid GetUserIdForUsername(string username)
        {
            return _context.Users
                .Where(u => u.Username == username)
                .Select(u => u.UserId)
                .FirstOrDefault();
        }

        /// <summary>
        /// Calculates workload values with Rolling Average method. Each session is equally important in the calculation.
        /// </summary>
        private async Task<LoadingStatusSnapshotDTO> GetLinearLoadingStatusSnapshot(Guid userId, DateTime snapshotDate, DateTime chronicCutoffDate, DateTime acuteCutoffDate)
        {
            var chronicSessions = await _context.Sessions
                .Where(s => s.UserId == userId && s.Date >= chronicCutoffDate && s.Date <= snapshotDate)
                .ToListAsync();

            var chronicLoadAverage = chronicSessions.Select(s => s.Rpe * s.Duration).Sum() / 4;

            var acuteSessions = chronicSessions
                .Where(s => s.Date >= acuteCutoffDate)
                .ToList();

            var acuteLoadAverage = acuteSessions.Select(s => s.Rpe * s.Duration).Sum();

            var ratio = acuteLoadAverage / (float)chronicLoadAverage;

            return new LoadingStatusSnapshotDTO(acuteLoadAverage, chronicLoadAverage, ratio, WorkloadCalculateMethod.RollingAverage, snapshotDate);
        }
    }
}
