namespace ApiObras.DTOs
{
    public class FacturaDto
    {
        public int Id {get; set;}
        public DateTime FechaEmision {get; set;}
        public string FolioFiscal {get; set;} = string.Empty;
        public string Descripcion {get; set;} = string.Empty;
        public decimal Importe {get; set;}
        public decimal MontoIva {get; set;}
        public decimal Total {get; set;}
        public int? TipoIvaId {get; set;}
        public int? ProveedorId {get; set;}
        public int? ObraId {get; set;}
        public int? TipoPagoId {get; set;}

         public string? NombreProveedor { get; set; }  
        public string? NombreObra { get; set; }        
        public string? TipoPago { get; set; }
    }
}