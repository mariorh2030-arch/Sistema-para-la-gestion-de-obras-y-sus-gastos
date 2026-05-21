using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiObras.Data;
using ApiObras.Models;
using ApiObras.DTOs;
using System.IO;


namespace ApiObras.Controllers
{
    [ApiController]
    [Route("api/facturas")]

    public class FacturaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FacturaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FacturaDto>>> GetFacturas()
        {
            var facturas = await _context.Facturas
            .Where(f => f.activo)
            .Include(f => f.Proveedor)
            .Include(f => f.Obra)
            .Include(f => f.Pago)
            .OrderBy(f => f.FechaEmision)
            .Select(f => new FacturaDto
            {
                Id = f.Id,
                FechaEmision = f.FechaEmision,
                FolioFiscal = f.FolioFiscal,
                Descripcion = f.Descripcion,
                Importe = f.Importe,
                MontoIva = f.MontoIva,
                Total = f.Total,
                TipoIvaId = f.TipoIvaId,
                ProveedorId = f.ProveedorId,
                ObraId = f.ObraId,
                TipoPagoId = f.TipoPagoId,


                NombreProveedor = f.Proveedor != null ? f.Proveedor.NombreP : "Sin proveedor",
                NombreObra = f.Obra != null ? f.Obra.NombreObra : "Sin obra",
                TipoPago = f.Pago != null ? f.Pago.TipoPago : "Sin método"
            }).ToListAsync();
                return Ok(facturas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FacturaDto>> GetFactura(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.ArchivosFacturas)
                .FirstOrDefaultAsync(f => f.Id == id);
            
            if(factura == null) return NotFound();

            var dto = new FacturaDetalleDto
            {
                Id = factura.Id,
                FechaEmision = factura.FechaEmision,
                FolioFiscal = factura.FolioFiscal,
                Descripcion = factura.Descripcion,
                Importe = factura.Importe,
                MontoIva = factura.MontoIva,
                Total = factura.Total,

                TipoIvaId = factura.TipoIvaId,
                ProveedorId = factura.ProveedorId,
                ObraId = factura.ObraId,
                TipoPagoId = factura.TipoPagoId,

                Archivos = factura.ArchivosFacturas.Select(a => new ArchivoDto
                {
                    NombreArchivo = a.NombreArchivo,
                    RutaArchivo = a.RutaArchivo,
                    TipoArchivo = a.TipoArchivo
                }).ToList()
            };
            return Ok(dto);
        }

        [HttpGet("resumen-mes")]
        public async Task<ActionResult> GetResumenMes([FromQuery] int mes, [FromQuery] int año)
        {
            var reultado = await _context.Facturas
                .Where(f => f.FechaEmision.Month == mes && f.FechaEmision.Year == año)
                .GroupBy(f => 1)
                .Select(g => new
                {
                    TotalGeneral = g.Sum(f => f.Total)
                })
                .FirstOrDefaultAsync();
            return Ok(reultado ?? new {TotalGeneral = 0m});
        }
        [HttpGet("gastos-obras")]
        public async Task<ActionResult> GetGastosObras([FromQuery] int mes, [FromQuery] int año)
        {
            var resultado = await _context.Facturas
                .Include(f => f.Obra) 
                .Where(f => f.FechaEmision.Month == mes && f.FechaEmision.Year == año)
                .GroupBy(f => new { f.ObraId, f.Obra!.NombreObra })
                .Select(g => new
                {
                    ObraId = g.Key.ObraId,
                    NombreObra = g.Key.NombreObra,
                    TotalGastos = g.Sum(f => f.Total)
                })
                .ToListAsync();
            return Ok(resultado);
        }

        [HttpGet("gastos-tasa")]
        public async Task<ActionResult> GetGastosTasa([FromQuery] int mes, [FromQuery] int año)
        {
            var resultado = await _context.Facturas
                .Include(f => f.Iva)
                .Where(f => f.FechaEmision.Month == mes && f.FechaEmision.Year == año)
                .GroupBy(f => new { f.TipoIvaId, f.Iva!.TipoIva })
                .Select(g => new
                {
                    TipoIvaId = g.Key.TipoIvaId,
                    TasaIva = g.Key.TipoIva,
                    TotalGastos = g.Sum(f => f.Total)
                })
                .ToListAsync();
            return Ok(resultado);
        }

        [HttpPost]
        public async Task<ActionResult<FacturaDto>> PostFactura(CrearFacturaDto dto)
        {
            if (await _context.Facturas.AnyAsync(f => f.FolioFiscal == dto.FolioFiscal))
            {
                return BadRequest("El folio ya existe");
            }

            var iva = await _context.Ivas.FindAsync(dto.TipoIvaId);
            if (iva == null)
            {
                return BadRequest("El tipo de IVA no existe");
            }

            var factura = new Factura
            {
                FechaEmision = dto.FechaEmision,
                FolioFiscal = dto.FolioFiscal,
                Descripcion = dto.Descripcion,
                Importe = dto.Importe,
                TipoIvaId = dto.TipoIvaId,
                ProveedorId = dto.ProveedorId,
                ObraId = dto.ObraId,
                TipoPagoId = dto.TipoPagoId,
                MontoIva = dto.Importe * iva.TipoIva / 100
            };
            factura.Total = factura.Importe + factura.MontoIva;

            _context.Facturas.Add(factura);
            await _context.SaveChangesAsync();

            var facturaDto = new FacturaDto
            {
                Id = factura.Id,
                FechaEmision = factura.FechaEmision,
                FolioFiscal = factura.FolioFiscal,
                Descripcion = factura.Descripcion,
                Importe = factura.Importe,
                MontoIva = factura.MontoIva,
                Total = factura.Total,
                TipoIvaId = factura.TipoIvaId,
                ProveedorId = factura.ProveedorId,
                ObraId = factura.ObraId
            };

            return CreatedAtAction(nameof(GetFactura), new { id = factura.Id }, facturaDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutFactura(int id, ActualizarFacturaDto dto)
        {
            var factura = await _context.Facturas.FindAsync(id);

            if (factura == null)
                return NotFound();

            if(dto.FolioFiscal != null && dto.FolioFiscal != factura.FolioFiscal)
            {
                var existe = await _context.Facturas
                    .AnyAsync(f => f.FolioFiscal == dto.FolioFiscal);

                if(existe)
                    return BadRequest("El folio ya existe");

                factura.FolioFiscal = dto.FolioFiscal;
            }

            if (dto.FechaEmision.HasValue) factura.FechaEmision = dto.FechaEmision.Value;
            if (dto.Descripcion != null) factura.Descripcion = dto.Descripcion;

            bool recalcular = false;

            if (dto.Importe.HasValue)
            {
                factura.Importe = dto.Importe.Value;
                recalcular = true;
            }

            if (dto.TipoIvaId.HasValue)
            {
                factura.TipoIvaId = dto.TipoIvaId.Value;
                recalcular = true;
            }

            if (recalcular)
            {
                var iva = await _context.Ivas.FindAsync(factura.TipoIvaId);

                if (iva == null)
                    return BadRequest("El tipo de IVA no existe");

                factura.MontoIva = factura.Importe * iva.TipoIva / 100;
                factura.Total = factura.Importe + factura.MontoIva;
            }

            if (dto.ProveedorId.HasValue) factura.ProveedorId = dto.ProveedorId.Value;
            if (dto.ObraId.HasValue) factura.ObraId = dto.ObraId.Value;
            if (dto.TipoPagoId.HasValue) factura.TipoPagoId = dto.TipoPagoId.Value;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFactura(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.ArchivosFacturas)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (factura == null)
                return NotFound();

            if (factura.ArchivosFacturas.Any())
            {
                _context.ArchivosFacturas.RemoveRange(factura.ArchivosFacturas);
            }

            _context.Facturas.Remove(factura);

            var facturaDir = Path.Combine("wwwroot", "facturas", id.ToString());
            if (Directory.Exists(facturaDir))
            {
                Directory.Delete(facturaDir, true);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
