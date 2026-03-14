using System;
using System.Collections.Generic;

namespace ElEspirituDeLaTormenta.Server.Models;

public partial class ProgresoPartida
{
    public int Id { get; set; }

    public int Idusuario { get; set; }

    public int IdhabitacionActual { get; set; }

    public int ContadorDeAcciones { get; set; }

    public virtual Habitaciones IdhabitacionActualNavigation { get; set; } = null!;

    public virtual Usuarios IdusuarioNavigation { get; set; } = null!;
}
