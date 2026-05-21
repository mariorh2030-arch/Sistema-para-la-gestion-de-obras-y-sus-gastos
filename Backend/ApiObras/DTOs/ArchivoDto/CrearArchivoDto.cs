
namespace ApiObras.DTOs
{
    public class CrearArchivoDto
    {
        public IFormFile Archivo {get; set;} = null!;
        public string TipoArchivo {get; set;} = string.Empty;

    }
}