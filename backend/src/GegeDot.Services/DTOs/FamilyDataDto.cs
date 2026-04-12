namespace GegeDot.Services.DTOs;

public class FamilyStatsDto
{
    public int TotalMembers { get; set; }
    public int ParentsCount { get; set; }
    public int ChildrenCount { get; set; }
    public int SiblingsCount { get; set; }
    public bool HasParents { get; set; }
    public bool HasChildren { get; set; }
    public bool HasSiblings { get; set; }
    public bool HasSpouse { get; set; }
}

public class FamilyDataDto
{
    public PersonDto Person { get; set; } = null!;
    public IEnumerable<PersonDto> Parents { get; set; } = new List<PersonDto>();
    public IEnumerable<PersonDto> Children { get; set; } = new List<PersonDto>();
    public IEnumerable<PersonDto> Siblings { get; set; } = new List<PersonDto>();
    public PersonDto? Spouse { get; set; }
    public IEnumerable<PersonDto> Grandparents { get; set; } = new List<PersonDto>();
    public IEnumerable<PersonDto> Grandchildren { get; set; } = new List<PersonDto>();
    public int TotalFamilyMembers { get; set; }
    public FamilyStatsDto FamilyStats { get; set; } = null!;
}
