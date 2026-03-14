using System;
using System.Collections.Generic;

namespace ElEspirituDeLaTormenta.Server.Models;

public partial class Puzzles
{
    public int Id { get; set; }

    public int Idhabitacion { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public bool Resuelto { get; set; }

    public virtual Habitaciones IdhabitacionNavigation { get; set; } = null!;

    public virtual ICollection<PuzzlesResueltos> PuzzlesResueltos { get; set; } = new List<PuzzlesResueltos>();
}
