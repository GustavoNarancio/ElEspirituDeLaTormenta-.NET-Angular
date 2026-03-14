using System;
using System.Collections.Generic;

namespace ElEspirituDeLaTormenta.Server.Models;

public partial class PuzzlesResueltos
{
    public int Id { get; set; }

    public int Idusuario { get; set; }

    public int Idpuzzle { get; set; }

    public bool EstaResuelto { get; set; }

    public virtual Puzzles IdpuzzleNavigation { get; set; } = null!;

    public virtual Usuarios IdusuarioNavigation { get; set; } = null!;
}
