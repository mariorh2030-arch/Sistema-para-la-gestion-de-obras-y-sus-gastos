using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiObras.Data;
using ApiObras.Models;
using ApiObras.DTOs;

namespace ApiObras.Controllers
{
    [ApiController]
    [Route("api/proveedores")]
    public class ProveedorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProveedorController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProveedorDto>>> GetProveedores()
        {
            var proveedor = await _context.Proveedores.ToListAsync();

            var proveedorDto = proveedor.Select(p => new ProveedorDto
            {
                Id = p.Id,
                NombreP = p.NombreP,
                Rfc = p.Rfc
            });
            return Ok(proveedorDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProveedorDto>> GetProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);
            if(proveedor == null) return NotFound();

            return Ok(new ProveedorDto
            {
                Id = proveedor.Id,
                NombreP = proveedor.NombreP,
                Rfc = proveedor.Rfc
            });
        }

        [HttpPost]
        public async Task<ActionResult<ProveedorDto>> PostProveedor(CrearProveedorDto dto)
        {
            var proveedor = new Proveedor
            {
                NombreP = dto.NombreP,
                Rfc = dto.Rfc
            };

            _context.Proveedores.Add(proveedor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProveedor), new {id = proveedor.Id}, new ProveedorDto
            {
                Id = proveedor.Id,
                NombreP = proveedor.NombreP,
                Rfc = proveedor.Rfc
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutProveedor(int id, ActualizarProveedorDto dto)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);
            if(proveedor == null) return NotFound();

            if(dto.NombreP != null) proveedor.NombreP = dto.NombreP;
            if(dto.Rfc !=null) proveedor.Rfc = dto.Rfc;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);
            if(proveedor == null) return NotFound();

            _context.Proveedores.Remove(proveedor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}