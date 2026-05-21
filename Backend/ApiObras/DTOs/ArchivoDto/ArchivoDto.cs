namespace ApiObras.DTOs
{
    public class ArchivoDto
    {
        public int Id { get; set; }
        public string NombreArchivo { get; set; } = string.Empty;
        public string RutaArchivo { get; set; } = string.Empty;
        public string TipoArchivo { get; set; } = string.Empty;
    }
}