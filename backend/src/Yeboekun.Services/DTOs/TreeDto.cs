namespace Yeboekun.Services.DTOs;

public class TreeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? RootPersonId { get; set; }
    public string? RootPersonName { get; set; }
    public bool IsPublic { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateTreeDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? RootPersonId { get; set; }
    public bool IsPublic { get; set; } = false;
}

public class UpdateTreeDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? RootPersonId { get; set; }
    public bool IsPublic { get; set; } = false;
}
