namespace ApiObras.DTOs
{
    public class ActualizarFacturaDto
    {
        public DateTime? FechaEmision { get; set; }
        public string? FolioFiscal { get; set; }
        public string? Descripcion { get; set; }
        public decimal? Importe { get; set; }
        public decimal? MontoIva { get; set; }
        public decimal? Total { get; set; }

        public int? TipoIvaId { get; set; }
        public int? TipoPagoId { get; set; }
        public int? ProveedorId { get; set; }
        public int? ObraId { get; set; }
    }
}