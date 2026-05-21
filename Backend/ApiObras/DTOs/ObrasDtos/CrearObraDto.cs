

using System.ComponentModel.DataAnnotations;

namespace ApiObras.DTOs
{
    public class CrearObraDto
    {
        [Required]
        [MaxLength(100)]
        public string NombreObra {get; set;} = string.Empty;

        [Required]
        public DateTime FechaInicio {get; set;}

        [Required]
        public DateTime FechaCierre {get; set;}

        public int NumTrabajadores {get; set;}

        public decimal Monto {get; set;}
        public int PatronalId {get; set;}
    }
}