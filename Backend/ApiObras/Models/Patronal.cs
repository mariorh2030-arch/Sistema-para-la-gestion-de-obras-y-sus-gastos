using System.ComponentModel.DataAnnotations.Schema;

namespace ApiObras.Models 
{
    [Table("numeros_patronales")]
    public class Patronal
    {
        public int Id {get; set;}
        public string Numero_Patronal {get; set;} = string.Empty;
    }
}