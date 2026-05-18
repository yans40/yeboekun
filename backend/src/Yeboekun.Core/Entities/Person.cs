using System.ComponentModel.DataAnnotations;

namespace Yeboekun.Core.Entities;

public class Person
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? MiddleName { get; set; }
    
    public DateTime? BirthDate { get; set; }
    public DateTime? DeathDate { get; set; }
    
    [MaxLength(200)]
    public string? BirthPlace { get; set; }
    
    [MaxLength(200)]
    public string? DeathPlace { get; set; }
    
    [MaxLength(100)]
    public string? Profession { get; set; }
    
    public DateTime? MarriageDate { get; set; }
    
    [MaxLength(200)]
    public string? MarriagePlace { get; set; }
    
    [MaxLength(50)]
    public string? DeathStatus { get; set; } // "Mort en Mer", "Décédé", etc.
    
    [MaxLength(500)]
    public string? PhotoUrl { get; set; }
    
    public string? Biography { get; set; }
    
    public Gender Gender { get; set; } = Gender.Male;
    
    public bool IsAlive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<Relationship> RelationshipsAsPerson1 { get; set; } = new List<Relationship>();
    public virtual ICollection<Relationship> RelationshipsAsPerson2 { get; set; } = new List<Relationship>();
    
    // Computed properties
    public string FullName => $"{FirstName} {LastName}";
    public int? Age => BirthDate.HasValue ? 
        (DeathDate?.Year ?? DateTime.Now.Year) - BirthDate.Value.Year : null;
}

public enum Gender
{
    Male = 'M',
    Female = 'F',
    Other = 'O'
}
