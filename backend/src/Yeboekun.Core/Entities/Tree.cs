using System.ComponentModel.DataAnnotations;

namespace Yeboekun.Core.Entities;

public class Tree
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public int? RootPersonId { get; set; }
    
    public bool IsPublic { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Person? RootPerson { get; set; }
}
