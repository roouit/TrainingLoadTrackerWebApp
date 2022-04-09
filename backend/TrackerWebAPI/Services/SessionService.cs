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

            var summary = await GetEWMALoadingStatusSnapshot(userId, snapshotDate, chronicCutoffDate, acuteCutoffDate);

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

            while (currentDate <= DateTime.Now.Date)
            {
                // TODO: Must be refactored so that sessions are fetched here once and correct part is injected to this method
                snapshots.Add(await GetEWMALoadingStatusSnapshot(userId, currentDate, currentDate.AddDays(-28), currentDate.AddDays(-7)));
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
        private async Task<LoadingStatusSnapshotDTO> GetRALoadingStatusSnapshot(Guid userId, DateTime snapshotDate, DateTime chronicCutoffDate, DateTime acuteCutoffDate)
        {
            var chronicSessions = await _context.Sessions
                .Where(s => s.UserId == userId && s.Date >= chronicCutoffDate && s.Date <= snapshotDate)
                .ToListAsync();

            var chronicLoadAverage = chronicSessions.Select(s => s.Rpe * s.Duration).Sum() / 28;

            var acuteSessions = chronicSessions
                .Where(s => s.Date >= acuteCutoffDate)
                .ToList();

            var acuteLoadAverage = acuteSessions.Select(s => s.Rpe * s.Duration).Sum() / 7;

            var ratio = acuteLoadAverage / (float)chronicLoadAverage;

            var dailyLoad = chronicSessions
                .Where(s => s.Date == snapshotDate)
                .Select(s => s.Rpe * s.Duration)
                .FirstOrDefault(0);

            return new LoadingStatusSnapshotDTO(acuteLoadAverage, chronicLoadAverage, ratio, WorkloadCalculateMethod.RollingAverage, snapshotDate, dailyLoad);
        }

        private async Task<LoadingStatusSnapshotDTO> GetEWMALoadingStatusSnapshot(Guid userId, DateTime snapshotDate, DateTime chronicCutoffDate, DateTime acuteCutoffDate)
        {
            var chronicSessions = await _context.Sessions
                .Where(s => s.UserId == userId && s.Date >= chronicCutoffDate && s.Date <= snapshotDate)
                .ToListAsync();

            var acuteSessions = chronicSessions
                .Where(s => s.Date >= acuteCutoffDate)
                .ToList();

            // Initial load is 0, if no training on cutoff date
            // TODO: Using 0 is probably not good, find the next oldest load?
            var initialChronicLoad = chronicSessions
                .Where(s => s.Date == chronicCutoffDate)
                .Select(s => s.Rpe * s.Duration * (2.0 / (28.0 + 1.0)))
                .FirstOrDefault(0);

            var chronicEWMAs = CalculateEWMA(chronicSessions, initialChronicLoad, chronicCutoffDate, snapshotDate, 28);

            // Chronic load affects the initial acute load
            var initialAcuteLoad = chronicEWMAs[acuteCutoffDate];

            var acuteEWMAs = CalculateEWMA(acuteSessions, initialAcuteLoad, acuteCutoffDate, snapshotDate, 7);

            var ratio = acuteEWMAs[snapshotDate] / chronicEWMAs[snapshotDate];

            var dailyLoad = acuteSessions
                .Where(s => s.Date == snapshotDate)
                .Select(s => s.Rpe * s.Duration)
                .FirstOrDefault(0);

            return new LoadingStatusSnapshotDTO(acuteEWMAs[snapshotDate], chronicEWMAs[snapshotDate], ratio, WorkloadCalculateMethod.ExponentiallyWeightedMovingAverage, snapshotDate, dailyLoad);
        }

        private static Dictionary<DateTime, double> CalculateEWMA(IEnumerable<Session> sessions, double initialEWMA, DateTime start, DateTime end, int lambdaConstant)
        {
            var dict = new Dictionary<DateTime, double>()
            {
                { start, initialEWMA }
            };
            var lambda = 2.0 / (lambdaConstant + 1.0);
            var previousEWMA = initialEWMA;
            var currentDate = start.AddDays(1);
            
            while (true)
            {
                var nextLoad = sessions
                    .Where(s => s.Date == currentDate)
                    .Select(s => s.Rpe * s.Duration)
                    .FirstOrDefault(0);

                previousEWMA = nextLoad * lambda + ((1 - lambda) * previousEWMA);

                dict.Add(currentDate, previousEWMA);

                currentDate = currentDate.AddDays(1);

                if (currentDate > end)
                {
                    return dict;
                }
            }
        }
    }
}
