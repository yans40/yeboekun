using GegeDot.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace GegeDot.Infrastructure.Data;

public class GegeDotContext : DbContext
{
    public GegeDotContext(DbContextOptions<GegeDotContext> options) : base(options)
    {
    }

    public DbSet<Person> Persons { get; set; }
    public DbSet<Relationship> Relationships { get; set; }
    public DbSet<Tree> Trees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Person configuration
        modelBuilder.Entity<Person>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.MiddleName).HasMaxLength(100);
            entity.Property(e => e.BirthPlace).HasMaxLength(200);
            entity.Property(e => e.DeathPlace).HasMaxLength(200);
            entity.Property(e => e.Profession).HasMaxLength(100);
            entity.Property(e => e.MarriagePlace).HasMaxLength(200);
            entity.Property(e => e.DeathStatus).HasMaxLength(50);
            entity.Property(e => e.PhotoUrl).HasMaxLength(500);
            entity.Property(e => e.Gender).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            // Indexes
            entity.HasIndex(e => e.LastName).HasDatabaseName("IX_Persons_LastName");
            entity.HasIndex(e => e.BirthDate).HasDatabaseName("IX_Persons_BirthDate");
            entity.HasIndex(e => new { e.FirstName, e.LastName }).HasDatabaseName("IX_Persons_FullName");
        });

        // Relationship configuration
        modelBuilder.Entity<Relationship>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.RelationshipType).HasConversion<int>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Foreign keys
            entity.HasOne(e => e.Person1)
                  .WithMany(p => p.RelationshipsAsPerson1)
                  .HasForeignKey(e => e.Person1Id)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Person2)
                  .WithMany(p => p.RelationshipsAsPerson2)
                  .HasForeignKey(e => e.Person2Id)
                  .OnDelete(DeleteBehavior.Cascade);

            // Constraints
            entity.ToTable(t =>
            {
                t.HasCheckConstraint("CHK_DifferentPersons", "Person1Id != Person2Id");
                t.HasCheckConstraint("CHK_ValidDateRange", "EndDate IS NULL OR StartDate IS NULL OR EndDate >= StartDate");
            });

            // Indexes
            entity.HasIndex(e => e.Person1Id).HasDatabaseName("IX_Relationships_Person1");
            entity.HasIndex(e => e.Person2Id).HasDatabaseName("IX_Relationships_Person2");
            entity.HasIndex(e => e.RelationshipType).HasDatabaseName("IX_Relationships_Type");
            entity.HasIndex(e => new { e.Person1Id, e.RelationshipType }).HasDatabaseName("IX_Relationships_Person1_Type");
            entity.HasIndex(e => new { e.Person2Id, e.RelationshipType }).HasDatabaseName("IX_Relationships_Person2_Type");
        });

        // Tree configuration
        modelBuilder.Entity<Tree>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            // Foreign key
            entity.HasOne(e => e.RootPerson)
                  .WithMany()
                  .HasForeignKey(e => e.RootPersonId)
                  .OnDelete(DeleteBehavior.SetNull);

            // Index
            entity.HasIndex(e => e.RootPersonId).HasDatabaseName("IX_Trees_RootPerson");
        });
    }
}
