using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ElEspirituDeLaTormenta.Server.Models;

public partial class ElEspirituDeLaTormentaDbContext : DbContext
{
    public ElEspirituDeLaTormentaDbContext()
    {
    }

    public ElEspirituDeLaTormentaDbContext(DbContextOptions<ElEspirituDeLaTormentaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Habitaciones> Habitaciones { get; set; }

    public virtual DbSet<Inventario> Inventario { get; set; }

    public virtual DbSet<Objetos> Objetos { get; set; }

    public virtual DbSet<ProgresoPartida> ProgresoPartida { get; set; }

    public virtual DbSet<Puzzles> Puzzles { get; set; }

    public virtual DbSet<PuzzlesResueltos> PuzzlesResueltos { get; set; }

    public virtual DbSet<Usuarios> Usuarios { get; set; }

    public virtual DbSet<PuzzleCamioneta> PuzzleCamioneta { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<PuzzleCamioneta>(entity =>
        {
            entity.ToTable("PuzzleCamioneta");
            entity.HasKey(e => e.Id);
        });



        modelBuilder.Entity<Habitaciones>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Habitaci__3214EC27FB979C4D");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ImagenUrl).HasMaxLength(255);
            entity.Property(e => e.Nombre).HasMaxLength(100);
        });

        modelBuilder.Entity<Inventario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Inventar__3214EC2730058FA5");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Idobjeto).HasColumnName("IDObjeto");
            entity.Property(e => e.Idusuario).HasColumnName("IDUsuario");

            entity.HasOne(d => d.IdobjetoNavigation).WithMany(p => p.Inventario)
                .HasForeignKey(d => d.Idobjeto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Inventario_Objeto");

            entity.HasOne(d => d.IdusuarioNavigation).WithMany(p => p.Inventario)
                .HasForeignKey(d => d.Idusuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Inventario_Usuario");
        });

        modelBuilder.Entity<Objetos>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Objetos__3214EC2799EC1FB7");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Idhabitacion).HasColumnName("IDHabitacion");
            entity.Property(e => e.Nombre).HasMaxLength(100);

            entity.HasOne(d => d.IdhabitacionNavigation).WithMany(p => p.Objetos)
                .HasForeignKey(d => d.Idhabitacion)
                .HasConstraintName("FK_Objetos_Habitaciones");
        });

        modelBuilder.Entity<ProgresoPartida>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Progreso__3214EC27FFDA067A");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.IdhabitacionActual).HasColumnName("IDHabitacionActual");
            entity.Property(e => e.Idusuario).HasColumnName("IDUsuario");

            entity.HasOne(d => d.IdhabitacionActualNavigation).WithMany(p => p.ProgresoPartida)
                .HasForeignKey(d => d.IdhabitacionActual)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Progreso_Habitacion");

            entity.HasOne(d => d.IdusuarioNavigation).WithMany(p => p.ProgresoPartida)
                .HasForeignKey(d => d.Idusuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Progreso_Usuario");
        });

        modelBuilder.Entity<Puzzles>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Puzzles__3214EC27B103455F");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Idhabitacion).HasColumnName("IDHabitacion");
            entity.Property(e => e.Nombre).HasMaxLength(100);

            entity.HasOne(d => d.IdhabitacionNavigation).WithMany(p => p.Puzzles)
                .HasForeignKey(d => d.Idhabitacion)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Puzzles_Habitaciones");
        });

        modelBuilder.Entity<PuzzlesResueltos>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PuzzlesR__3214EC27ACF92500");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.EstaResuelto).HasDefaultValue(true);
            entity.Property(e => e.Idpuzzle).HasColumnName("IDPuzzle");
            entity.Property(e => e.Idusuario).HasColumnName("IDUsuario");

            entity.HasOne(d => d.IdpuzzleNavigation).WithMany(p => p.PuzzlesResueltos)
                .HasForeignKey(d => d.Idpuzzle)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Resueltos_Puzzle");

            entity.HasOne(d => d.IdusuarioNavigation).WithMany(p => p.PuzzlesResueltos)
                .HasForeignKey(d => d.Idusuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Resueltos_Usuario");
        });

        modelBuilder.Entity<Usuarios>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Usuarios__3214EC275610072D");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Contrasenia).HasMaxLength(100);
            entity.Property(e => e.Nombre).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
