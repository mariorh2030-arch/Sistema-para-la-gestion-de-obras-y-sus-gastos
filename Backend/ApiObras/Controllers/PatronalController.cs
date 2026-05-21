using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiObras.Data;
using ApiObras.Models;
using ApiObras.DTOs;

namespace ApiObras.Controllers
{
    [ApiController]
    [Route("api/patronal")]
    public class PatronalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatronalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatronalDto>>> GetNumber()
        {
            var Numero_Patronal = await _context.Patronales.ToListAsync();

            var PatronalDto = Numero_Patronal.Select( n => new PatronalDto
            {
                Id = n.Id,
                Numeros_Patronales = n.Numero_Patronal
            });

            return Ok(PatronalDto);
        }
    }
}