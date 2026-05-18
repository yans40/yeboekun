using System.ComponentModel.DataAnnotations;

namespace Yeboekun.Core.Entities;

public class Relationship
{
    public int Id { get; set; }
    
    public int Person1Id { get; set; }
    public int Person2Id { get; set; }
    
    public RelationshipType RelationshipType { get; set; }
    
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    public string? Notes { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Person Person1 { get; set; } = null!;
    public virtual Person Person2 { get; set; } = null!;
}

public enum RelationshipType
{
    Parent = 1,
    Child = 2,
    Spouse = 3,
    Sibling = 4,
    Grandparent = 5,
    Grandchild = 6,
    Uncle = 7,
    Aunt = 8,
    Cousin = 9,
    StepParent = 10,
    StepChild = 11,
    AdoptedParent = 12,
    AdoptedChild = 13
}
