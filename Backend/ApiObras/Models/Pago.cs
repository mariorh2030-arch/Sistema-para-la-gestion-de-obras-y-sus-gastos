using System.ComponentModel.DataAnnotations.Schema;

namespace ApiObras.Models
{
    [Table("tipos_pago")]
    public class Pago
    {
        public int Id {get; set;}
        public string TipoPago{ get; set;} = string.Empty;
    }
}