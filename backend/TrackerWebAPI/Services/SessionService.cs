using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;
using TrackerWebAPI.Models.DTO;

namespace TrackerWebAPI.Services
{
    public class SessionService : ISessionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public SessionService(DataContext context, IMapper mapper, IUserService userService)
        {
            _context = context;
            _mapper = mapper;
            _userService = userService;
        }

        #region Session CRUD

        public async Task<SessionDTO> Create(SessionCreateDTO request, Guid userId)
        {
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

        public async Task<IEnumerable<Session>> GetFullSessions(Guid userId)
        {
            return await _context.Sessions
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<SessionDTO>> GetSessions(Guid userId)
        {
            var sessionList = await GetFullSessions(userId);
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
            if (session == null) throw new ArgumentNullException(nameof(session));
            session.Rpe = request.Rpe;
            session.Duration = request.Duration;
            session.Date = request.Date;

            await _context.SaveChangesAsync();
            return _mapper.Map<SessionDTO>(session);
        }

        #endregion

        #region Analytics

        public async Task<LoadingStatusSnapshotDTO> GetLoadingStatusSnapshot(Guid userId, DateTime snapshotDate)
        {
            var allSessions = await _context.Sessions
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Date)
                .ToListAsync();

            var user = await _userService.GetUser(userId);

            var firstSessionDate = allSessions.First().Date;
            var range = (snapshotDate - firstSessionDate).Days;
            var acute = Math.Min((int)Math.Round(range / 2.0), user.AcuteRange);
            var chronic = Math.Min(range, user.ChronicRange);
            var minChronic = 7;

            if (user.CalculationMethod == WorkloadCalculateMethod.ExponentiallyWeightedMovingAverage)
            {
                if (user.ChronicRange <= range)
                {
                    return GetEWMALoadingStatusSnapshot(snapshotDate, user.ChronicRange, user.AcuteRange, allSessions);
                }

                return GetEWMALoadingStatusSnapshot(snapshotDate, Math.Max(minChronic, range), acute, allSessions);
            }

            return GetRALoadingStatusSnapshot(snapshotDate, chronic == 0 ? 1 : chronic, acute == 0 ? 1 : acute, allSessions);
        }

        public async Task<IEnumerable<LoadingStatusSnapshotDTO>> GetLoadingStatusHistory(Guid userId)
        {
            var allSessions = await _context.Sessions
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Date)
                .ToListAsync();

            var user = await _userService.GetUser(userId);
            var firstSessionDate = allSessions.First().Date;
            var minChronic = 7;
            var snapshots = new List<LoadingStatusSnapshotDTO>();

            // Initialize values for history loop
            var currentDate = firstSessionDate;
            var range = (currentDate - firstSessionDate).Days;
            var chronic = Math.Min(range, user.ChronicRange);
            var acute = Math.Min((int)Math.Round(range / 2.0), user.AcuteRange);
            
            // Loop over all dates between first session and today
            while (currentDate <= DateTime.Now.Date)
            {
                if (user.CalculationMethod == WorkloadCalculateMethod.ExponentiallyWeightedMovingAverage)
                {
                    if (user.ChronicRange <= range)
                    {
                        snapshots.Add(GetEWMALoadingStatusSnapshot(currentDate, user.ChronicRange, user.AcuteRange, allSessions));
                    }
                    else
                    {
                        snapshots.Add(GetEWMALoadingStatusSnapshot(currentDate, Math.Max(minChronic, range), acute, allSessions));
                    }
                }
                else
                {
                    snapshots.Add(GetRALoadingStatusSnapshot(currentDate, chronic == 0 ? 1 : chronic, acute == 0 ? 1 : acute, allSessions));
                }

                // Update loop values
                currentDate = currentDate.AddDays(1);
                range++;
                chronic = Math.Min(range, user.ChronicRange);
                acute = Math.Min((int)Math.Round(range / 2.0), user.AcuteRange);
            }

            return snapshots;
        }

        /// <summary>
        /// Calculates workload values with Rolling Average method. Each session is equally important in the calculation.
        /// </summary>
        private static LoadingStatusSnapshotDTO GetRALoadingStatusSnapshot(DateTime snapshotDate, int chronicCutoff, int acuteCutoff, IEnumerable<Session> sessions)
        {
            var chronicCutoffDate = snapshotDate.AddDays(-chronicCutoff);
            var acuteCutoffDate = snapshotDate.AddDays(-acuteCutoff);

            var chronicSessions = sessions
                .Where(s => s.Date >= chronicCutoffDate && s.Date <= snapshotDate)
                .ToList();

            var acuteSessions = chronicSessions
                .Where(s => s.Date >= acuteCutoffDate)
                .ToList();

            var chronicLoadAverage = chronicSessions.Select(s => s.Rpe * s.Duration).Sum() / chronicCutoff;

            var acuteLoadAverage = acuteSessions.Select(s => s.Rpe * s.Duration).Sum() / acuteCutoff;

            var ratio = acuteLoadAverage / (float)chronicLoadAverage;

            var dailyLoad = chronicSessions
                .Where(s => s.Date == snapshotDate)
                .Select(s => s.Rpe * s.Duration)
                .FirstOrDefault(0);

            return new LoadingStatusSnapshotDTO(acuteLoadAverage, chronicLoadAverage, ratio, WorkloadCalculateMethod.RollingAverage, snapshotDate, dailyLoad);
        }

        private static LoadingStatusSnapshotDTO GetEWMALoadingStatusSnapshot(DateTime snapshotDate, int chronicCutoff, int acuteCutoff, IEnumerable<Session> sessions)
        {
            var chronicCutoffDate = snapshotDate.AddDays(-chronicCutoff);
            var acuteCutoffDate = snapshotDate.AddDays(-acuteCutoff);

            var chronicSessions = sessions
                .Where(s => s.Date >= chronicCutoffDate && s.Date <= snapshotDate)
                .ToList();

            var acuteSessions = chronicSessions
                .Where(s => s.Date >= acuteCutoffDate)
                .ToList();

            // Initial load is 0, if no training on cutoff date
            // TODO: Using 0 is probably not good, find the next oldest load?
            var initialChronicLoad = chronicSessions
                .Where(s => s.Date == chronicCutoffDate)
                .Select(s => s.Rpe * s.Duration * (2.0 / (chronicCutoff + 1.0)))
                .FirstOrDefault(0);

            var chronicEWMAs = CalculateEWMA(chronicSessions, initialChronicLoad, chronicCutoffDate, snapshotDate, chronicCutoff);

            // Chronic load affects the initial acute load
            var initialAcuteLoad = chronicEWMAs[acuteCutoffDate];

            var acuteEWMAs = CalculateEWMA(acuteSessions, initialAcuteLoad, acuteCutoffDate, snapshotDate, acuteCutoff);

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

        #endregion
    }
}
