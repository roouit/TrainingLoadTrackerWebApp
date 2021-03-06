#nullable disable
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackerWebAPI.Models.DTO;
using TrackerWebAPI.Services;

namespace TrackerWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        private readonly ITokenService _tokenService;

        public SessionsController(ISessionService sessionService, ITokenService tokenService)
        {
            _sessionService = sessionService;
            _tokenService = tokenService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<SessionDTO>>> GetSessions()
        {
            var userId = _tokenService.GetIdFromIdentity(HttpContext);

            if (userId == null)
                return Forbid("Error when fetching user identity");

            var sessionList = await _sessionService.GetSessions((Guid)userId);
            return Ok(sessionList);
        }

        [HttpGet("{sessionId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SessionDTO>> GetSession(Guid sessionId)
        {
            var session = await _sessionService.GetSession(sessionId);
            if (session == null)
                return NotFound("Session not found");

            return Ok(session);
        }

        [HttpPut("{sessionId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutSession(Guid sessionId, SessionUpdateDTO request)
        {
            try
            {
                var sessionDto = await _sessionService.GetSession(sessionId);
                if (sessionDto == null)
                    return NotFound("Session not found");

                await _sessionService.Update(sessionId, request);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<SessionDTO>> Create(SessionCreateDTO request)
        {
            try
            {
                var userId = _tokenService.GetIdFromIdentity(HttpContext);

                if (userId == null)
                    return Forbid("Error when fetching user identity");

                var session = await _sessionService.Create(request, (Guid)userId);
                return CreatedAtAction(nameof(GetSession), new { sessionId = session.SessionId }, session);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{sessionId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteSession(Guid sessionId)
        {
            var isSuccessful = await _sessionService.DeleteSession(sessionId);
            if (!isSuccessful)
            {
                return NotFound("Session not found");
            }

            return NoContent();
        }

        [HttpGet("analytics/current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LoadingStatusSnapshotDTO>> GetCurrentLoadingStatus()
        {
            try
            {
                var userId = _tokenService.GetIdFromIdentity(HttpContext);

                if (userId == null)
                    return Forbid("Error when fetching user identity");

                var summary = await _sessionService.GetLoadingStatusSnapshot((Guid)userId, DateTime.Now.Date);

                return Ok(summary);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("analytics/history")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<LoadingStatusSnapshotDTO>>> GetCombinedAnalytics()
        {
            try
            {
                var userId = _tokenService.GetIdFromIdentity(HttpContext);

                if (userId == null)
                    return Forbid("Error when fetching user identity");

                var summary = await _sessionService.GetLoadingStatusHistory((Guid)userId);

                return Ok(summary);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
