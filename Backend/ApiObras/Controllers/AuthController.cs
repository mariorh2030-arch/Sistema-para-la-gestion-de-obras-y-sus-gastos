using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiObras.Data;
using ApiObras.Models;
using ApiObras.DTOs;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace ApiObras.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController: ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            //Valida que lis campos del login no esten vacios
            if(string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                return BadRequest("El correo y la contraseña son requeridos");

            // Buscar al usuario por su email
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email.ToLower() == loginDto.Email.ToLower());

            //valida si el usuario existe
            if(usuario == null)
                return Unauthorized("El correo o la contraseña son incorrectos");

            //Valida si la contraseña es igual al de la bd
            if (usuario.PasswordHash != loginDto.Password)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            var token = GenerateJwtToken(usuario);

            // Genera el token para la autentificacion
            return Ok(new
            {
                success = true,
                token = token,
                user = new
                {
                    usuario.Id,
                    usuario.Email,
                    usuario.Nombre,
                    usuario.Apellido,
                    usuario.Rol
                }
            });  
        }
        private string GenerateJwtToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key no configurada")));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}