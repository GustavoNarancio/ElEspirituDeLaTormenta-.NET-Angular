using System;
using System.Collections.Generic;

namespace ElEspirituDeLaTormenta.Server.Models;

public partial class Inventario
{
    public int Id { get; set; }

    public int Idusuario { get; set; }

    public int Idobjeto { get; set; }

    public virtual Objetos IdobjetoNavigation { get; set; } = null!;

    public virtual Usuarios IdusuarioNavigation { get; set; } = null!;
}
