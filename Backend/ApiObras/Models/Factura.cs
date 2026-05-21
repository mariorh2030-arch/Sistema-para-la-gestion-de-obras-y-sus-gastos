using System.ComponentModel.DataAnnotations.Schema;

namespace ApiObras.Models
{
    [Table("facturas")]

    public class Factura
    {
        public int Id {get; set;}
        public DateTime FechaEmision {get; set;}
        public string FolioFiscal {get; set;} = string.Empty;
        public string Descripcion {get; set;} = string.Empty;
        public decimal Importe {get; set;}
        
        public bool activo {get; set;} = true;
        public decimal MontoIva {get; set;}
        public decimal Total {get; set;}

        public int TipoIvaId {get; set;}
        public int ProveedorId {get; set;}
        public int TipoPagoId {get; set;}
        public int ObraId {get; set;}

        public Proveedor? Proveedor {get; set;}
        public Obra? Obra {get; set;}
        public Iva? Iva {get; set;}
        public Pago? Pago {get; set;}

        public List<ArchivosFactura> ArchivosFacturas { get; set; } = new List<ArchivosFactura>();

    }
}