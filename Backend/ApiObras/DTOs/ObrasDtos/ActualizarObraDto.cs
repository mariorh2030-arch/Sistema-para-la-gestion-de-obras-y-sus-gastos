

namespace ApiObras.DTOs
{
    public class ActualizarObraDto
    {
        public string? NombreObra {get; set;}

        public DateTime? FechaInicio {get; set;}
        public DateTime? FechaCierre {get; set;}
        
        public int? NumTrabajadores {get; set;}
        public decimal? Monto {get; set;}
        public int? PatronalId { get; set; }
    }
}