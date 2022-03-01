#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackerWebAPI.Data;
using TrackerWebAPI.Models;
using TrackerWebAPI.Services;

namespace TrackerWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;

        public SessionsController(ISessionService sessionService)
        {
            _sessionService = sessionService;
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
        public async Task<ActionResult<IEnumerable<SessionDTO>>> GetSessions(string username)
        {
            // TODO: get username from JWT token?
            var sessionList = await _sessionService.GetSessions(username);
            return Ok(sessionList);
        }

        // Is this endpoint needed? Sessions are fetched in batches 
        [HttpGet("{sessionId}")]
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

            var session = await _sessionService.Update(sessionId, request);
            return NoContent();
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SessionDTO>> Create(SessionCreateDTO request)
        {
            try
            {
                var session = await _sessionService.Create(request);
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
            var isSuccesful = await _sessionService.DeleteSession(sessionId);
            if (!isSuccesful)
            {
                return NotFound("Session not found");
            }

            return NoContent();
        }
    }
}
