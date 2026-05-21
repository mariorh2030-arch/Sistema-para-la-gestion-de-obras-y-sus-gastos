using System.ComponentModel.DataAnnotations.Schema;

namespace ApiObras.Models
{
    [Table("Tipos_iva")]
    public class Iva
    {
        public int Id {get; set;}
        public decimal TipoIva {get; set;}
    }
}