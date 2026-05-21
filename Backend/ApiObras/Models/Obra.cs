using System.ComponentModel.DataAnnotations.Schema;

namespace ApiObras.Models
{
    [Table("obras")]
    public class Obra
    {
        public int Id {get; set;}
        [Column("nombre_obra")]
        public string NombreObra {get; set;} = string.Empty;
        [Column("fecha_inicio")]
        public DateTime? FechaInicio {get; set;}
        [Column("fecha_cierre")]
        public DateTime? FechaCierre {get; set;}
        [Column("num_trabajadores")]
        public int? NumTrabajadores {get; set;}
        [Column("monto")]
        public decimal? Monto {get; set;}
        [Column("patronal_id")]
        public int PatronalId {get; set;}

        public Patronal? Patronal {get; set;}

    }
}