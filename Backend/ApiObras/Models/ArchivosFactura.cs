

using System.ComponentModel.DataAnnotations.Schema;

namespace ApiObras.Models
{
    [Table("archivos_facturas")]
    public class ArchivosFactura
    {
        public int Id { get; set; }
        public string NombreArchivo { get; set; } = string.Empty;
        public string RutaArchivo { get; set; } = string.Empty;
        public string TipoArchivo { get; set; } = string.Empty;
        public int FacturaId { get; set; }

        public Factura? Factura { get; set; }
    }
}