
namespace ApiObras.DTOs
{
    public class ObraDto
    {
        public int Id {get; set;}

        public string NombreObra {get; set;} = string.Empty;
        public DateTime? FechaInicio {get; set;}
        public DateTime? FechaCierre {get; set;}
        public int? NumTrabajadores {get; set;}
        public decimal? Monto {get; set;}
        public int? PatronalId {get; set;}
        public string? NumeroPatronal { get; set; }
    }
}