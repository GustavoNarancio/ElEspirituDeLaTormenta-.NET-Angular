using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElEspirituDeLaTormenta.Server.Models; 

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

    [HttpGet("{id}/objetos")]
    public async Task<ActionResult<IEnumerable<Objetos>>> GetObjetosPorHabitacion(int id)
    {
        // Por ahora forzamos el usuario 1 (hasta que hagamos el login)
        int idUsuarioActual = 1;

        // Buscamos los que tengan el ID de esta habitación 
        // Y que NO existan en la tabla Inventario para este usuario
        var objetos = await _context.Objetos
            .Where(o => o.Idhabitacion == id &&
                        !_context.Inventario.Any(inv => inv.Idusuario == idUsuarioActual && inv.Idobjeto == o.Id))
            .ToListAsync();

        return Ok(objetos);
    }


    [HttpGet("{id}/puzzles")]
    public async Task<ActionResult<IEnumerable<Puzzles>>> GetPuzzlesPorHabitacion(int id)
    {
        // Buscamos en la tabla Puzzles los que coincidan con el ID de la habitación
        var puzzles = await _context.Puzzles
            .Where(p => p.Idhabitacion == id)
            .ToListAsync();

        return Ok(puzzles);
    }

    [HttpPost("guardar-objeto")]
    public async Task<IActionResult> GuardarEnInventario([FromBody] InventarioRequest request)
    {
        int idUsuarioActual = 1; // Nuestro usuario de prueba

        // 1. VERIFICAMOS: ¿Ya existe este vínculo en la tabla Inventario?
        bool yaLoTiene = _context.Inventario
            .Any(i => i.Idusuario == idUsuarioActual && i.Idobjeto == request.IdObjeto);

        // Si ya lo tiene, devolvemos un error avisando
        if (yaLoTiene)
        {
            return BadRequest(new { mensaje = "Ya tenés este objeto en tu inventario." });
        }

        // 2. Si NO lo tiene, entonces sí lo guardamos
        var nuevoItem = new Inventario
        {
            Idusuario = idUsuarioActual,
            Idobjeto = request.IdObjeto
        };

        _context.Inventario.Add(nuevoItem);
        await _context.SaveChangesAsync();

        return Ok(new { mensaje = "Objeto guardado con éxito" });
    }


    // Ese palito (~) y la barra le dicen a .NET que use la ruta exacta, sin importar en qué controlador esté.
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
        // Buscamos el registro exacto en la tabla Inventario
        var item = await _context.Inventario
            .FirstOrDefaultAsync(i => i.Idusuario == idUsuario && i.Idobjeto == idObjeto);

        if (item != null)
        {
            _context.Inventario.Remove(item); // Lo borramos
            await _context.SaveChangesAsync(); // Guardamos cambios
        }

        return Ok(new { mensaje = "Objeto devuelto con éxito" });
    }


    // Clase auxiliar para recibir el dato desde Angular
    public class InventarioRequest
    {
        public int IdObjeto { get; set; }
    }
}