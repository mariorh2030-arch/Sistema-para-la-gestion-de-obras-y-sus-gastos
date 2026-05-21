
using System.ComponentModel.DataAnnotations;

namespace ApiObras.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email {get; set;} = string.Empty;

        [Required]
        public string Password {get; set;} = string.Empty;
    }
}