using System;
using System.Collections.Generic;

namespace ElEspirituDeLaTormenta.Server.Models;

public partial class Objetos
{
    public int Id { get; set; }

    public int? Idhabitacion { get; set; }

    public string Nombre { get; set; } = null!;

    public string Descripcion { get; set; } = null!;

    public bool EsAgarrable { get; set; }

    public virtual Habitaciones? IdhabitacionNavigation { get; set; }

    public virtual ICollection<Inventario> Inventario { get; set; } = new List<Inventario>();
}
