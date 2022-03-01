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

        public async Task<SessionDTO> Create(SessionCreateDTO request)
        {
            await ValidateCreateRequest(request);
            var session = new Session(request);
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
            var userId = _context.Users
                .Where(u => u.Username == username)
                .Select(u => u.UserId)
                .FirstOrDefault();

            return await _context.Sessions
                .Where(s => s.UserId == userId)
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

        public async Task<SessionDTO> Update(SessionUpdateDTO request)
        {
            var session = await _context.Sessions.FindAsync(request.SessionId);
            session.Rpe = request.Rpe;
            session.Duration = request.Duration;
            session.Date = request.Date;

            await _context.SaveChangesAsync();
            return _mapper.Map<SessionDTO>(session);
        }

        private async Task ValidateCreateRequest(SessionCreateDTO request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                throw new Exception("User with given id wasn't found");
        }
    }
}
