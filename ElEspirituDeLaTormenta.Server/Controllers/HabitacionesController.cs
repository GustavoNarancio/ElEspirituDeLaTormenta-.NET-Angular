using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElEspirituDeLaTormenta.Server.Models;

namespace ElEspirituDeLaTormenta.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HabitacionesController : ControllerBase
    {
        private readonly ElEspirituDeLaTormentaDbContext _context;

        public HabitacionesController(ElEspirituDeLaTormentaDbContext context)
        {
            _context = context;
        }

        [HttpGet("test")]
        public string GetTest()
        {
            return "El servidor de .NET está vivo";
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Habitaciones>>> GetHabitaciones()
        {
            return await _context.Habitaciones.ToListAsync();
        }

        // RECIBIMOS EL ID DEL USUARIO POR LA URL
        [HttpGet("{id}/objetos")]
        public async Task<ActionResult<IEnumerable<Objetos>>> GetObjetosPorHabitacion(int id, [FromQuery] int idUsuario)
        {
            var objetos = await _context.Objetos
                .Where(o => o.Idhabitacion == id &&
                            !_context.Inventario.Any(inv => inv.Idusuario == idUsuario && inv.Idobjeto == o.Id))
                .ToListAsync();

            return Ok(objetos);
        }

        // RECIBIMOS EL ID DEL USUARIO POR LA URL
        [HttpGet("{id}/puzzles")]
        public async Task<IActionResult> GetPuzzlesPorHabitacion(int id, [FromQuery] int idUsuario)
        {
            var puzzles = await _context.Puzzles
                .Where(p => p.Idhabitacion == id)
                .Select(p => new
                {
                    p.Id,
                    p.Idhabitacion,
                    p.Nombre,
                    p.Descripcion,
                    Resuelto = _context.PuzzlesResueltos
                        .Where(pr => pr.Idpuzzle == p.Id && pr.Idusuario == idUsuario)
                        .Select(pr => pr.EstaResuelto)
                        .FirstOrDefault(),
                    Roto = _context.PuzzlesResueltos
                        .Where(pr => pr.Idpuzzle == p.Id && pr.Idusuario == idUsuario)
                        .Select(pr => pr.EstaRoto)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(puzzles);
        }

        [HttpPost("guardar-objeto")]
        public async Task<IActionResult> GuardarEnInventario([FromBody] InventarioRequest request)
        {
            var cantidadItems = await _context.Inventario.CountAsync(i => i.Idusuario == request.IdUsuario);

            if (cantidadItems >= 5)
            {
                return BadRequest(new { errorType = "MOCHILA_LLENA", mensaje = "Ya no tengo espacio en la mochila" });
            }

            bool yaLoTiene = _context.Inventario
                .Any(i => i.Idusuario == request.IdUsuario && i.Idobjeto == request.IdObjeto);

            if (yaLoTiene)
            {
                return BadRequest(new { mensaje = "Ya tenés este objeto en tu inventario." });
            }

            var nuevoItem = new Inventario { Idusuario = request.IdUsuario, Idobjeto = request.IdObjeto };
            _context.Inventario.Add(nuevoItem);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Objeto guardado con éxito" });
        }

        // AGREGAMOS EL ID AL REQUEST
        public class InventarioRequest
        {
            public int IdUsuario { get; set; }
            public int IdObjeto { get; set; }
        }

        [HttpGet("~/api/usuarios/{idUsuario}/inventario")]
        public async Task<IActionResult> GetInventarioUsuario(int idUsuario)
        {
            var objetosEnMochila = await _context.Inventario
                .Where(inv => inv.Idusuario == idUsuario)
                .Join(_context.Objetos,
                      inv => inv.Idobjeto,
                      obj => obj.Id,
                      (inv, obj) => obj)
                .ToListAsync();

            return Ok(objetosEnMochila);
        }

        [HttpDelete("~/api/usuarios/{idUsuario}/inventario/{idObjeto}")]
        public async Task<IActionResult> EliminarDelInventario(int idUsuario, int idObjeto)
        {
            var item = await _context.Inventario
                .FirstOrDefaultAsync(i => i.Idusuario == idUsuario && i.Idobjeto == idObjeto);

            if (item != null)
            {
                _context.Inventario.Remove(item);
                await _context.SaveChangesAsync();
            }

            return Ok(new { mensaje = "Objeto devuelto con éxito" });
        }

        [HttpPost("~/api/puzzles/{idPuzzle}/intentar")]
        public async Task<IActionResult> IntentarResolverPuzzle(int idPuzzle, [FromBody] PuzzleIntentoRequest request)
        {
            var puzzleBase = await _context.Puzzles.FindAsync(idPuzzle);
            if (puzzleBase == null) return NotFound("Puzzle no encontrado");

            var estadoPuzzle = await _context.PuzzlesResueltos
                .FirstOrDefaultAsync(pr => pr.Idpuzzle == idPuzzle && pr.Idusuario == request.IdUsuario);

            if (estadoPuzzle == null)
            {
                estadoPuzzle = new PuzzlesResueltos { Idpuzzle = idPuzzle, Idusuario = request.IdUsuario, EstaResuelto = false, EstaRoto = false };
                _context.PuzzlesResueltos.Add(estadoPuzzle);
            }

            if (estadoPuzzle.EstaRoto)
                return BadRequest(new { mensaje = "La caja está totalmente derretida y negra. Ya no funciona." });

            if (estadoPuzzle.EstaResuelto)
                return Ok(new { mensaje = "El puzzle ya está resuelto. La corriente fluye perfectamente." });

            var obj1 = await _context.Objetos.FindAsync(request.IdsFusibles[0]);
            var obj2 = await _context.Objetos.FindAsync(request.IdsFusibles[1]);
            var obj3 = await _context.Objetos.FindAsync(request.IdsFusibles[2]);
            var obj4 = await _context.Objetos.FindAsync(request.IdsFusibles[3]);

            bool esCorrecto =
                obj1 != null && obj1.Nombre.ToLower().Contains("marron") &&
                obj2 != null && obj2.Nombre.ToLower().Contains("verde") &&
                obj3 != null && obj3.Nombre.ToLower().Contains("rojo") &&
                obj4 != null && obj4.Nombre.ToLower().Contains("azul");

            if (esCorrecto)
            {
                estadoPuzzle.EstaResuelto = true;
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Encajo la última pieza en su lugar. La chapa oxidada vibra levemente bajo mis dedos y un zumbido constante y grave comienza a recorrer el interior de la pared. La tensión se estabiliza. El sistema acaba de recuperar la corriente." });
            }
            else
            {
                estadoPuzzle.EstaRoto = true;
                await _context.SaveChangesAsync();
                return BadRequest(new { mensaje = "Inserto el último fusible. Un destello cegador estalla desde la caja acompañado de un fuerte estallido seco. El humo y el olor a cobre quemado me golpean la cara al instante. Destrocé el sistema por completo." });
            }
        }

        // AGREGAMOS EL ID AL REQUEST
        public class PuzzleIntentoRequest
        {
            public int IdUsuario { get; set; }
            public List<int> IdsFusibles { get; set; }
        }


        [HttpPost("~/api/puzzles/{idPuzzle}/intentar-caja")]
        public async Task<IActionResult> IntentarCajaSeguridad(int idPuzzle, [FromBody] CajaIntentoRequest request, [FromQuery] bool esUltimoIntento = false)
        {
            var puzzleBase = await _context.Puzzles.FindAsync(idPuzzle);
            if (puzzleBase == null) return NotFound("Puzzle no encontrado");

            var estadoPuzzle = await _context.PuzzlesResueltos
                .FirstOrDefaultAsync(pr => pr.Idpuzzle == idPuzzle && pr.Idusuario == request.IdUsuario);

            if (estadoPuzzle == null)
            {
                estadoPuzzle = new PuzzlesResueltos { Idpuzzle = idPuzzle, Idusuario = request.IdUsuario, EstaResuelto = false, EstaRoto = false };
                _context.PuzzlesResueltos.Add(estadoPuzzle);
            }

            if (estadoPuzzle.EstaRoto)
                return BadRequest(new { mensaje = "puse la combinacion incorrecta y ahora la caja se trabó" });

            if (estadoPuzzle.EstaResuelto)
                return Ok(new { mensaje = "La caja ya está abierta." });

            string combinacionCorrecta = "2113";
            string combinacionIngresada = string.Join("", request.Digitos);

            if (combinacionIngresada == combinacionCorrecta)
            {
                estadoPuzzle.EstaResuelto = true;
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "La caja fuerte se abre con un leve chasquido metálico; en su interior, descansa una llave antigua de aspecto robusto." });
            }
            else
            {
                if (esUltimoIntento)
                {
                    estadoPuzzle.EstaRoto = true;
                    await _context.SaveChangesAsync();
                    return BadRequest(new { mensaje = "Giro el dial hasta el último número, pero en lugar de abrirse, escucho un golpe seco en el interior. El mecanismo de seguridad acaba de saltar. Puse la combinación incorrecta y la perilla quedó completamente trabada." });
                }
                else
                {
                    return BadRequest(new { mensaje = "Error de combinación." });
                }
            }
        }

        // AGREGAMOS EL ID AL REQUEST
        public class CajaIntentoRequest
        {
            public int IdUsuario { get; set; }
            public List<int> Digitos { get; set; }
        }

        [HttpPost("~/api/puzzles/{idPuzzle}/intentar-llave")]
        public async Task<IActionResult> IntentarConLlave(int idPuzzle, [FromBody] LlaveIntentoRequest request)
        {
            var puzzleBase = await _context.Puzzles.FindAsync(idPuzzle);
            if (puzzleBase == null) return NotFound("Puzzle no encontrado");

            var estadoPuzzle = await _context.PuzzlesResueltos
                .FirstOrDefaultAsync(pr => pr.Idpuzzle == idPuzzle && pr.Idusuario == request.IdUsuario);

            if (estadoPuzzle == null)
            {
                estadoPuzzle = new PuzzlesResueltos { Idpuzzle = idPuzzle, Idusuario = request.IdUsuario, EstaResuelto = false, EstaRoto = false };
                _context.PuzzlesResueltos.Add(estadoPuzzle);
            }

            if (estadoPuzzle.EstaResuelto)
                return Ok(new { mensaje = "La puerta ya está abierta." });

            bool esCorrecto = false;
            string mensajeExito = "";

            switch (idPuzzle)
            {
                case 3:
                    if (request.IdObjeto == 19)
                    {
                        esCorrecto = true;
                        mensajeExito = "Deslizo la vieja llave en la cerradura. Encaja a la perfección. Giro con firmeza y el pestillo se destraba con un golpe seco. La puerta se abre lentamente.";
                    }
                    break;

                case 4:
                    if (request.IdObjeto == 1)
                    {
                        esCorrecto = true;
                        mensajeExito = "Levanto el hacha de dos manos. Cuesta manejarla, pero fijo la vista en esa traba oxidada. Tomo distancia, la levanto por encima de mi hombro y acierto el golpe.|| El impacto me hace vibrar los brazos, pero el metal estalla en pedazos con un chasquido. El enorme candado cae inútilmente al suelo por su propio peso. El camino está libre.";
                    }
                    break;
            }

            if (esCorrecto)
            {
                estadoPuzzle.EstaResuelto = true;
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = mensajeExito });
            }
            else
            {
                return BadRequest(new { mensaje = "No puedo abrir la puerta con eso." });
            }
        }

        // AGREGAMOS EL ID AL REQUEST
        public class LlaveIntentoRequest
        {
            public int IdUsuario { get; set; }
            public int IdObjeto { get; set; }
        }

        [HttpGet("~/api/puzzles/camioneta/estado/{idUsuario}")]
        public async Task<IActionResult> GetEstadoCamioneta(int idUsuario)
        {
            var estado = await _context.PuzzleCamioneta
                .FirstOrDefaultAsync(c => c.IdUsuario == idUsuario);

            if (estado == null)
            {
                var rng = new Random();
                estado = new PuzzleCamioneta
                {
                    IdUsuario = idUsuario,
                    TipoFalla = rng.Next(1, 4),
                    Resuelto = false,
                    Roto = false
                };
                _context.PuzzleCamioneta.Add(estado);
                await _context.SaveChangesAsync();
            }

            string texto = estado.TipoFalla switch
            {
                1 => "Girás la llave. El tablero apenas se ilumina, débil, como si le faltara energía. El motor intenta reaccionar, pero todo se apaga casi de inmediato.",
                2 => "Girás la llave… pero no pasa nada. El tablero permanece apagado y el silencio es total. Es como si el auto no estuviera recibiendo energía.",
                3 => "Girás la llave. El motor responde de forma irregular: intenta arrancar, se detiene… y se escucha un golpe seco, repetitivo.",
                _ => "La camioneta no arranca."
            };

            return Ok(new CamionetaEstadoDto
            {
                TipoFalla = estado.TipoFalla,
                TextoInicial = texto,
                Resuelto = estado.Resuelto,
                Roto = estado.Roto
            });
        }

        [HttpPost("~/api/puzzles/camioneta/intentar-reparar")]
        public async Task<IActionResult> IntentarRepararCamioneta([FromBody] IntentoReparacionRequest request)
        {
            var estado = await _context.PuzzleCamioneta
                .FirstOrDefaultAsync(c => c.IdUsuario == request.IdUsuario);

            if (estado == null) return NotFound("No se encontró un estado inicial para esta camioneta.");
            if (estado.Resuelto || estado.Roto) return BadRequest(new { mensaje = "Ya no podés interactuar con este vehículo." });

            bool esCorrecto = false;
            string mensajeResultado = "";

            if (estado.TipoFalla == 1 && request.IdObjeto == 25) esCorrecto = true;
            else if (estado.TipoFalla == 2 && request.IdObjeto == 26) esCorrecto = true;
            else if (estado.TipoFalla == 3 && request.IdObjeto == 27) esCorrecto = true;

            if (esCorrecto)
            {
                estado.Resuelto = true;
                mensajeResultado = estado.TipoFalla switch
                {
                    1 => "Colocás la batería nueva y ajustás los bornes con cuidado. Al girar la llave, el motor responde de inmediato… y arranca. Era eso.",
                    2 => "Revisás la caja y reemplazás el fusible dañado. Al girar la llave, el tablero vuelve a la vida de golpe y el motor arranca sin problemas.",
                    3 => "Forzás el acceso y ajustás el mecanismo con la llave de tubo. Probás de nuevo y el motor gira con firmeza... finalmente arranca.",
                    _ => "¡Arrancó!"
                };
            }
            else
            {
                estado.Roto = true;
                mensajeResultado = request.IdObjeto switch
                {
                    25 => "Desconectás la batería y colocás la nueva, pero algo no se siente bien.\r\nAl ajustar los bornes, una chispa salta de forma inesperada.\r\nCuando intentás arrancar, no hay respuesta… ni siquiera un intento.\r\nEl sistema eléctrico parece haber quedado completamente muerto\r\n",
                    26 => "Revisás la caja de fusibles y encontrás uno dañado.\r\nComparás con otro similar y colocás uno que parece coincidir… aunque el amperaje no es exactamente el mismo.\r\nEl tablero parpadea una vez… y se apaga por completo.\r\nAlgo se dañó en el circuito\r\n",
                    27 => "Manipulás el motor con la llave de tubo. Sentís que algo cede... demasiado. Al intentar arrancar, el motor ya no responde en absoluto.",
                    _ => "Hiciste algo mal y la camioneta se terminó de romper."
                };
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = esCorrecto, mensaje = mensajeResultado });
        }

        public class CamionetaEstadoDto
        {
            public int TipoFalla { get; set; }
            public string TextoInicial { get; set; } = string.Empty;
            public bool Resuelto { get; set; }
            public bool Roto { get; set; }
        }

        // AGREGAMOS EL ID AL REQUEST
        public class IntentoReparacionRequest
        {
            public int IdUsuario { get; set; }
            public int IdObjeto { get; set; }
        }

        [HttpPost("~/api/puzzles/{idPuzzle}/intentar-sotano")]
        public async Task<IActionResult> IntentarPuzzleSotano(int idPuzzle, [FromBody] SotanoIntentoRequest request)
        {
            var puzzleBase = await _context.Puzzles.FindAsync(idPuzzle);
            if (puzzleBase == null) return NotFound("Puzzle no encontrado");

            var estadoPuzzle = await _context.PuzzlesResueltos
                .FirstOrDefaultAsync(pr => pr.Idpuzzle == idPuzzle && pr.Idusuario == request.IdUsuario);

            if (estadoPuzzle == null)
            {
                estadoPuzzle = new PuzzlesResueltos { Idpuzzle = idPuzzle, Idusuario = request.IdUsuario, EstaResuelto = false, EstaRoto = false };
                _context.PuzzlesResueltos.Add(estadoPuzzle);
            }

            if (estadoPuzzle.EstaRoto)
                return BadRequest(new { mensaje = "Las piezas de piedra están atascadas. El mecanismo se rompió." });

            if (estadoPuzzle.EstaResuelto)
                return Ok(new { mensaje = "La puerta ya está abierta." });

            var combinacionCorrecta = new List<string> { "Matias", "Carla", "Nico", "Lucas" };
            bool esCorrecto = request.Nombres.SequenceEqual(combinacionCorrecta);

            if (esCorrecto)
            {
                estadoPuzzle.EstaResuelto = true;
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Al colocar la ultima pieza se escuha un ruido atronador, como grandes placas de piedra moviendose lentamente y raspandose entre si. La puerta se abre muy suavemente y se deja ver en su interior otra habitacion" });
            }
            else
            {
                estadoPuzzle.EstaRoto = true;
                await _context.SaveChangesAsync();
                return BadRequest(new { mensaje = "Las placas de piedra crujen entre si, se escucha como el mecanismo se traba por completo. La cerradura mágica se bloqueó para siempre." });
            }
        }

        // AGREGAMOS EL ID AL REQUEST
        public class SotanoIntentoRequest
        {
            public int IdUsuario { get; set; }
            public List<string> Nombres { get; set; }
        }


        [HttpGet("{id}/movimientos")]
        public async Task<ActionResult<int>> GetMovimientos(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound("Usuario no encontrado");
            }

            return Ok(usuario.Movimientos);
        }

        [HttpPut("{id}/movimientos")]
        public async Task<IActionResult> ActualizarMovimientos(int id, [FromBody] int nuevosMovimientos)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound("Usuario no encontrado");
            }

            usuario.Movimientos = nuevosMovimientos;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}