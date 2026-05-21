using System.ComponentModel.DataAnnotations;

namespace ApiObras.DTOs
{
    public class CrearProveedorDto
    {
        [Required]
        [MaxLength(100)]
        public string NombreP {get; set;} = string.Empty;
        [Required]
        [MaxLength(50)]
        public string Rfc {get; set;} = string.Empty;
        
    }
}