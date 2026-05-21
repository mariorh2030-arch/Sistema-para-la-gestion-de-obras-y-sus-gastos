using Microsoft.EntityFrameworkCore;
using ApiObras.Models;

namespace ApiObras.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Proveedor> Proveedores {get; set;}
        public DbSet<Patronal> Patronales {get; set;}
        public DbSet<Iva> Ivas {get; set;}
        public DbSet<Pago> Pagos {get; set;}
        public DbSet<Obra> Obras {get; set;}
        public DbSet<Factura> Facturas {get; set;}
        public DbSet<Usuario> Usuarios {get; set;}
        public DbSet<ArchivosFactura> ArchivosFacturas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Relaciones entre tablas

            // relacion obra con numeros patronales
            modelBuilder.Entity<Obra>()
                .HasOne(o => o.Patronal)
                .WithMany()
                .HasForeignKey(o => o.PatronalId)
                .OnDelete(DeleteBehavior.Restrict);

            //relacion factura con obras
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Obra)
                .WithMany()
                .HasForeignKey(f => f.ObraId)
                .OnDelete(DeleteBehavior.SetNull);
            
            //relacion de factura con proveedor
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Proveedor)
                .WithMany()
                .HasForeignKey(f => f.ProveedorId)
                .OnDelete(DeleteBehavior.Restrict);
            
            //relacion de factura con tipo de iva
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Iva)
                .WithMany()
                .HasForeignKey(f => f.TipoIvaId)
                .OnDelete(DeleteBehavior.Restrict);
            
            //relacion de factura con tipo de pago
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Pago)
                .WithMany()
                .HasForeignKey(f => f.TipoPagoId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // indices

            //indice de fecha de emision
            modelBuilder.Entity<Factura>()
                .HasIndex(f => f.FechaEmision);

            //indice unico de folio fiscal
            modelBuilder.Entity<Factura>()
                .HasIndex(f => f.FolioFiscal)
                .IsUnique();
            
            //indice para encontrar proveedor
            modelBuilder.Entity<Factura>()
                .HasIndex(f => f.ProveedorId);
            
            
            
            //relación de factura con archivos de factura
            modelBuilder.Entity<Factura>()
                .HasMany(f => f.ArchivosFacturas)
                .WithOne(a => a.Factura)
                .HasForeignKey(a => a.FacturaId)
                .OnDelete(DeleteBehavior.Cascade);

            //indice para buscar proveedores
            modelBuilder.Entity<Proveedor>()
                .HasIndex(p => p.NombreP);
        }
    }
}