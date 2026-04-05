using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElEspirituDeLaTormenta.Server.Models // Asegurate de que el namespace sea igual al de tus otras clases
{
    [Table("PuzzleCamioneta")] // Esto le dice a EF que busque exactamente este nombre en SQL
    public partial class PuzzleCamioneta
    {
        [Key] // Marca el ID como Primary Key
        public int Id { get; set; }

        public int IdUsuario { get; set; }

        public int TipoFalla { get; set; }

        public bool Resuelto { get; set; }

        public bool Roto { get; set; }

        // Si querés que EF reconozca la relación con la clase Usuarios:
        [ForeignKey("IdUsuario")]
        public virtual Usuarios? UsuarioNavigation { get; set; }
    }
}