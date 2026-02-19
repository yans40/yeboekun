namespace GegeDot.Services.DTOs;

public class RelationshipDto
{
    public int Id { get; set; }
    public int Person1Id { get; set; }
    public int Person2Id { get; set; }
    public string Person1Name { get; set; } = string.Empty;
    public string Person2Name { get; set; } = string.Empty;
    public int RelationshipType { get; set; }
    public string RelationshipTypeName { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
}

public class CreateRelationshipDto
{
    public int Person1Id { get; set; }
    public int Person2Id { get; set; }
    public int RelationshipType { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateRelationshipDto
{
    public int RelationshipType { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateSpouseRelationshipDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Notes { get; set; }
}
