
namespace ApiObras.DTOs
{
    public class CrearFacturaDto
    {
        public DateTime FechaEmision { get; set; }
        public string FolioFiscal {get; set;} = string.Empty;
        public string Descripcion {get; set;} = string.Empty;
        public decimal Importe {get; set;}

        public int TipoIvaId {get; set;}
        public int ProveedorId {get; set;}
        public int ObraId {get; set;}
        public int TipoPagoId {get; set;}
    }
}