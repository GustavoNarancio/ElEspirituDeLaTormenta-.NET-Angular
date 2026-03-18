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
        // Buscamos en la tabla Objetos los que tengan el ID de esta habitación
        var objetos = await _context.Objetos
            .Where(o => o.Idhabitacion == id)
            .ToListAsync();

        return Ok(objetos);
    }


    [HttpGet("{id}/puzzles")]
    public async Task<ActionResult<IEnumerable<Puzzles>>> GetPuzzlesPorHabitacion(int id)
    {
        return await _context.Puzzles.Where(p => p.Idhabitacion == id).ToListAsync();
    }

}