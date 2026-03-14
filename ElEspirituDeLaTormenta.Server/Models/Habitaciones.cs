using System;
using System.Collections.Generic;

namespace ElEspirituDeLaTormenta.Server.Models;

public partial class Habitaciones
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string Descripcion { get; set; } = null!;

    public string? ImagenUrl { get; set; }

    public virtual ICollection<Objetos> Objetos { get; set; } = new List<Objetos>();

    public virtual ICollection<ProgresoPartida> ProgresoPartida { get; set; } = new List<ProgresoPartida>();

    public virtual ICollection<Puzzles> Puzzles { get; set; } = new List<Puzzles>();
}
