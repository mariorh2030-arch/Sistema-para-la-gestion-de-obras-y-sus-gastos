
using Microsoft.AspNetCore.Mvc;
using ApiObras.Data;
using ApiObras.Models;
using ApiObras.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ApiObras.Controllers
{
    [ApiController]
    [Route("api/archivos")]
    public class ArchivosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArchivosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{facturaId}")]
        public async Task<ActionResult<IEnumerable<ArchivoDto>>> GetArchivos(int facturaId)
        {
            var archivos = await _context.ArchivosFacturas
                .Where(a => a.FacturaId == facturaId)
                .Select(a => new ArchivoDto
                {
                    Id = a.Id,
                    NombreArchivo = a.NombreArchivo,
                    RutaArchivo = a.RutaArchivo,
                    TipoArchivo = a.TipoArchivo
                }).ToListAsync();

            return Ok(archivos);
        }
        [HttpPost("{id}")]
        public async Task<ActionResult> SubirArchivo(int id, [FromForm] CrearArchivoDto dto)
        {
            var archivo = dto.Archivo;
            if(archivo == null || archivo.Length == 0)
                return BadRequest("No se ha seleccionado ningún archivo.");
            
            if(archivo.Length > 1048576) // 1 MB
                return BadRequest("El archivo excede el tamaño máximo permitido de 1 MB.");
            
            var extensionesPermitidas = new[] {".pdf", ".jpg", ".jpeg", ".png", ".webp"};
            var extension = Path.GetExtension(archivo.FileName).ToLower();

            if(!extensionesPermitidas.Contains(extension))
                return BadRequest("El archivo debe ser pdf, jpg, jpeg, png o webp");

            var subcarpeta = dto.TipoArchivo == "pdf" ? "pdfs" : "comprobantes";
            var carpeta = Path.Combine("wwwroot", "facturas", id.ToString(), subcarpeta);
            Directory.CreateDirectory(carpeta);

            var nombreArchivo = Guid.NewGuid().ToString() + extension;
            var rutaArchivo = Path.Combine(carpeta, nombreArchivo);

            using(var stream = new FileStream(rutaArchivo, FileMode.Create))
            {
                await archivo.CopyToAsync(stream);
            }

            var tipoArchivoReal = extension.TrimStart('.');
            if (tipoArchivoReal == "jpeg")
            {
                tipoArchivoReal = "jpg";
            }

            // Aquí se guarda la ruta en la BD y se vincula con la factura
            var ArchivoFactura = new ArchivosFactura
            {
                FacturaId = id,
                RutaArchivo = $"/facturas/{id}/{subcarpeta}/{nombreArchivo}",
                NombreArchivo = archivo.FileName,
                TipoArchivo = tipoArchivoReal
            };
            
            _context.ArchivosFacturas.Add(ArchivoFactura);
            await _context.SaveChangesAsync();

            return Ok(new ArchivoDto
            {
                Id = ArchivoFactura.Id,
                NombreArchivo = ArchivoFactura.NombreArchivo,
                RutaArchivo = ArchivoFactura.RutaArchivo,
                TipoArchivo = ArchivoFactura.TipoArchivo
            });
        }


    }
}