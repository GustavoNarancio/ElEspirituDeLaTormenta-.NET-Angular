using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElEspirituDeLaTormenta.Server.Models;

namespace ElEspirituDeLaTormenta.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ElEspirituDeLaTormentaDbContext _context;

        public UsuariosController(ElEspirituDeLaTormentaDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                return BadRequest(new { mensaje = "El nombre no puede estar vacío." });
            }

            // Buscamos si ya existe
            var usuarioExistente = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Nombre.ToLower() == request.Nombre.ToLower());

            // ¡NUEVA LÓGICA! Si existe, lo rebotamos.
            if (usuarioExistente != null)
            {
                return BadRequest(new { mensaje = "Ese nombre ya está en uso. Por favor, elegí otro." });
            }

            // Si llegamos acá, es porque no existe. Lo creamos.
            var nuevoUsuario = new Usuarios
            {
                Nombre = request.Nombre,
                Movimientos = 0
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync(); // Se guarda y se le asigna su ID automáticamente

            // --- MAGIA NUEVA: Le damos el Amuleto (ID 1015) automáticamente ---
            var amuletoInicial = new Inventario
            {
                Idusuario = nuevoUsuario.Id,
                Idobjeto = 1015
            };
            _context.Inventario.Add(amuletoInicial);
            await _context.SaveChangesAsync();
            // -----------------------------------------------------------------

            return Ok(new { id = nuevoUsuario.Id, nombre = nuevoUsuario.Nombre });
        }


        public class LoginRequest
        {
            public string Nombre { get; set; }
        }


        [HttpDelete("borrar-partida/{id}")]
        public async Task<IActionResult> BorrarPartida(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();

            // 1. Vaciamos su mochila
            var inventario = _context.Inventario.Where(i => i.Idusuario == id);
            _context.Inventario.RemoveRange(inventario);

            // 2. Reseteamos los puzzles normales
            var puzzles = _context.PuzzlesResueltos.Where(p => p.Idusuario == id);
            _context.PuzzlesResueltos.RemoveRange(puzzles);

            // 3. Reseteamos el puzzle de la camioneta
            var camioneta = _context.PuzzleCamioneta.Where(c => c.IdUsuario == id);
            _context.PuzzleCamioneta.RemoveRange(camioneta);

            // 4. Borramos al usuario
            _context.Usuarios.Remove(usuario);

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Partida eliminada con éxito" });
        }

    }
}