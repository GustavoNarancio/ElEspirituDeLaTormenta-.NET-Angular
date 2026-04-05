using System;
using System.Collections.Generic;

namespace ElEspirituDeLaTormenta.Server.Models;

public partial class Usuarios
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string Contrasenia { get; set; } = null!;

    public int Movimientos { get; set; } // Agregamos esta línea

    public virtual ICollection<Inventario> Inventario { get; set; } = new List<Inventario>();

    public virtual ICollection<ProgresoPartida> ProgresoPartida { get; set; } = new List<ProgresoPartida>();

    public virtual ICollection<PuzzlesResueltos> PuzzlesResueltos { get; set; } = new List<PuzzlesResueltos>();
}
