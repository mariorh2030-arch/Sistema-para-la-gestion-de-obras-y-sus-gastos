using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiObras.Data;
using ApiObras.Models;
using ApiObras.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;


namespace ApiObras.Controllers
{
    [ApiController]
    [Route("api/controller")]
    public class ObrasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ObrasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ObraDto>>> GetObras()
        {
            var obras = await _context.Obras
                .Include(o => o.Patronal)
                .ToListAsync();

            var obrasDto = obras.Select(o => new ObraDto
            {
                Id = o.Id,
                NombreObra = o.NombreObra,
                FechaInicio = o.FechaInicio,
                FechaCierre = o.FechaCierre,
                NumTrabajadores = o.NumTrabajadores,
                Monto = o.Monto,
                PatronalId = o.PatronalId,
                NumeroPatronal = o.Patronal?.Numero_Patronal
            });

            return Ok(obrasDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ObraDto>> GetObra(int id)
        {
            var obra = await _context.Obras.FindAsync(id);
            if(obra == null) return NotFound();

            return Ok(new ObraDto
            {
                Id= obra.Id,
                NombreObra = obra.NombreObra,
                FechaInicio = obra.FechaInicio,
                FechaCierre = obra.FechaCierre,
                NumTrabajadores = obra.NumTrabajadores,
                Monto = obra.Monto,
                PatronalId = obra.PatronalId
            });
        }

        [HttpPost]
        public async Task<ActionResult<ObraDto>> PostObras( CrearObraDto dto)
        {
            var obra = new Obra
            {
                NombreObra = dto.NombreObra,
                FechaInicio = dto.FechaInicio,
                FechaCierre = dto.FechaCierre,
                NumTrabajadores = dto.NumTrabajadores,
                Monto = dto.Monto,
                PatronalId = dto.PatronalId
            };

            _context.Obras.Add(obra);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetObra), new {id = obra.Id}, new ObraDto
            {
                Id= obra.Id,
                NombreObra = obra.NombreObra,
                FechaInicio = obra.FechaInicio,
                FechaCierre = obra.FechaCierre,
                NumTrabajadores = obra.NumTrabajadores,
                Monto = obra.Monto,
                PatronalId = obra.PatronalId
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutObra(int id, ActualizarObraDto dto)
        {
            var obra = await _context.Obras.FindAsync(id);
            if(obra == null) return NotFound();

            if(dto.NombreObra != null ) obra.NombreObra = dto.NombreObra;
            if(dto.FechaInicio.HasValue) obra.FechaInicio = dto.FechaInicio;
            if(dto.FechaCierre.HasValue) obra.FechaCierre = dto.FechaCierre;
            if(dto.NumTrabajadores.HasValue) obra.NumTrabajadores = dto.NumTrabajadores;
            if(dto.Monto.HasValue) obra.Monto = dto.Monto;
            if(dto.PatronalId.HasValue) obra.PatronalId = dto.PatronalId.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteObras(int id)
        {
            var obra = await _context.Obras.FindAsync(id);
            if(obra == null) return NotFound();

            _context.Obras.Remove(obra);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}