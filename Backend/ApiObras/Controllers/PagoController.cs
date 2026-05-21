using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiObras.Data;
using ApiObras.Models;
using ApiObras.DTOs;

namespace ApiObras.Controllers
{
    [ApiController]
    [Route("api/metodo-pago")]
    public class PagoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PagoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PagoDto>>> GetPagos()
        {
            var pagos = await _context.Pagos.ToListAsync();

            var pagoDto = pagos.Select(p => new PagoDto
            {
                Id = p.Id,
                TipoPago = p.TipoPago
            });
            return Ok(pagoDto);
        }
    }
}