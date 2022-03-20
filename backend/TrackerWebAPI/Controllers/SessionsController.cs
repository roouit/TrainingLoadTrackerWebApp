#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;
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

        [HttpGet("debug/full")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Session>>> GetFullSessions(string username)
        {
            // TODO: get username from JWT token?
            var sessionList = await _sessionService.GetFullSessions(username);
            return Ok(sessionList);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<SessionDTO>>> GetSessions()
        {
            var username = _tokenService.GetUsernameFromIdentity(HttpContext);

            if (string.IsNullOrWhiteSpace(username))
                return Forbid("Error when fetching user identity");

            var sessionList = await _sessionService.GetSessions(username);
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
            var sessionDto = await _sessionService.GetSession(sessionId);
            if (sessionDto == null)
                return NotFound("Session not found");

            await _sessionService.Update(sessionId, request);
            return NoContent();
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<SessionDTO>> Create(SessionCreateDTO request)
        {
            try
            {
                var username = _tokenService.GetUsernameFromIdentity(HttpContext);

                if (string.IsNullOrWhiteSpace(username))
                    return Forbid("Error when fetching user identity");

                var session = await _sessionService.Create(request, username);
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

        [HttpGet("loadsummary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LoadSummaryDTO>> GetLoadSummary()
        {
            try
            {
                var username = _tokenService.GetUsernameFromIdentity(HttpContext);

                var summary = await _sessionService.GetLoadSummary(username);

                return Ok(summary);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
