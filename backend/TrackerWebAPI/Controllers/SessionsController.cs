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

        // GET: api/Sessions
        [HttpGet("full")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Session>>> GetFullSessions(string username)
        {
            // TODO: get username from JWT token?
            var sessionList = await _sessionService.GetFullSessions(username);
            return Ok(sessionList);
        }

        // GET: api/Sessions
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SessionDTO>>> GetSessions(string username)
        {
            // TODO: get username from JWT token?
            var sessionList = await _sessionService.GetSessions(username);
            return Ok(sessionList);
        }

        // GET: api/Sessions/5
        [HttpGet("{sessionId}")]
        public async Task<ActionResult<Session>> GetSession(Guid sessionId)
        {
            var session = await _sessionService.GetSession(sessionId);
            if (session == null)
                return NotFound("Session not found");

            return Ok(session);
        }

        // PUT: api/Sessions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutSession(SessionUpdateDTO request)
        {
            var sessionDto = await _sessionService.GetSession(request.SessionId);
            if (sessionDto == null)
                return NotFound("Session not found");

            var session = await _sessionService.Update(request);
            return Ok(session);
        }

        // POST: api/Sessions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

        // DELETE: api/Sessions
        [HttpDelete]
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
