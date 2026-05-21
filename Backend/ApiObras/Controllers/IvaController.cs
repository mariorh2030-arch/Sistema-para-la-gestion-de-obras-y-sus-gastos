
using ApiObras.Data;
using ApiObras.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiObras.Controllers
{
    [ApiController]
    [Route("api/ivas")]
    public class IvaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public IvaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IvaDto>>> GetIvas()
        {
            var ivas = await _context.Ivas.ToListAsync();

            var ivaDto = ivas.Select(i => new IvaDto
            {
                Id = i.Id,
                TipoIva = i.TipoIva
            });
            return Ok(ivaDto);
        }
    }
}