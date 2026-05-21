using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiObras.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        public int Id {get; set;}

        [Required]
        [EmailAddress]
        [MaxLength(150)]

        
        public string Email {get; set;} = string.Empty;

        [Required]
        public string PasswordHash {get; set;} = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Nombre {get; set;} = string.Empty;

        [MaxLength(100)] 
        public string Apellido {get; set;} = string.Empty;

        [MaxLength(100)]
        public string Rol {get; set;} = string.Empty;

        // public Boolean Activo {get; set;} = true;
        // [Column("fecha_creacion")]
        // public DateTime FechaCreacion {get; set;} = DateTime.UtcNow;

    }
}