
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiObras.Models
{
    [Table("proveedores")]
    public class Proveedor
    {
        public int Id {get; set;}
        [Column("Nombre_P")]
        public string NombreP {get; set;} = string.Empty;
        [Column("rfc")]
        public string Rfc {get; set;} = string.Empty;

    }
}