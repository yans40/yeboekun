using AutoMapper;
using Yeboekun.Core.Entities;
using Yeboekun.Core.Interfaces;
using Yeboekun.Services.DTOs;
using Yeboekun.Services.Interfaces;

namespace Yeboekun.Services.Services;

public class PersonService : IPersonService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IDataNormalizationService _normalizationService;

    public PersonService(
        IUnitOfWork unitOfWork, 
        IMapper mapper,
        IDataNormalizationService normalizationService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _normalizationService = normalizationService;
    }

    public async Task<IEnumerable<PersonDto>> GetAllPersonsAsync()
    {
        var persons = await _unitOfWork.Persons.GetAllAsync();
        return _mapper.Map<IEnumerable<PersonDto>>(persons);
    }

    public async Task<PersonDto?> GetPersonByIdAsync(int id)
    {
        var person = await _unitOfWork.Persons.GetByIdAsync(id);
        return person != null ? _mapper.Map<PersonDto>(person) : null;
    }

    public async Task<PersonDto?> GetPersonWithRelationshipsAsync(int id)
    {
        var person = await _unitOfWork.Persons.GetByIdWithRelationshipsAsync(id);
        return person != null ? _mapper.Map<PersonDto>(person) : null;
    }

    public async Task<IEnumerable<PersonDto>> GetChildrenAsync(int personId)
    {
        var children = await _unitOfWork.Persons.GetChildrenAsync(personId);
        return _mapper.Map<IEnumerable<PersonDto>>(children);
    }

    public async Task<IEnumerable<PersonDto>> GetParentsAsync(int personId)
    {
        var parents = await _unitOfWork.Persons.GetParentsAsync(personId);
        return _mapper.Map<IEnumerable<PersonDto>>(parents);
    }

    public async Task<IEnumerable<PersonDto>> GetSiblingsAsync(int personId)
    {
        var siblings = await _unitOfWork.Persons.GetSiblingsAsync(personId);
        return _mapper.Map<IEnumerable<PersonDto>>(siblings);
    }

    public async Task<IEnumerable<PersonDto>> SearchPersonsAsync(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return await GetAllPersonsAsync();

        var persons = await _unitOfWork.Persons.SearchByNameAsync(searchTerm);
        return _mapper.Map<IEnumerable<PersonDto>>(persons);
    }

    public async Task<PersonDto> CreatePersonAsync(CreatePersonDto createPersonDto)
    {
        // Normaliser les données avant création
        var normalizedDto = NormalizePersonDto(createPersonDto);
        
        var person = _mapper.Map<Person>(normalizedDto);
        person.CreatedAt = DateTime.UtcNow;
        person.UpdatedAt = DateTime.UtcNow;
        
        var createdPerson = await _unitOfWork.Persons.AddAsync(person);
        
        // Créer les relations parent-enfant si des parents sont spécifiés
        if (normalizedDto.Parent1Id.HasValue || normalizedDto.Parent2Id.HasValue)
        {
            // Créer la relation avec le premier parent (Parent1Id = parent, Person2Id = enfant)
            if (normalizedDto.Parent1Id.HasValue)
            {
                // Vérifier que le parent existe
                var parent1Exists = await _unitOfWork.Persons.ExistsAsync(normalizedDto.Parent1Id.Value);
                if (!parent1Exists)
                    throw new ArgumentException($"Parent avec l'ID {normalizedDto.Parent1Id.Value} n'existe pas");
                
                // Vérifier que la relation n'existe pas déjà
                var relationshipExists = await _unitOfWork.Relationships.RelationshipExistsAsync(
                    normalizedDto.Parent1Id.Value, 
                    createdPerson.Id, 
                    RelationshipType.Parent);
                
                if (!relationshipExists)
                {
                    var relationship1 = new Relationship
                    {
                        Person1Id = normalizedDto.Parent1Id.Value,
                        Person2Id = createdPerson.Id,
                        RelationshipType = RelationshipType.Parent,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _unitOfWork.Relationships.AddAsync(relationship1);
                }
            }
            
            // Créer la relation avec le deuxième parent
            if (normalizedDto.Parent2Id.HasValue)
            {
                // Vérifier que le parent existe
                var parent2Exists = await _unitOfWork.Persons.ExistsAsync(normalizedDto.Parent2Id.Value);
                if (!parent2Exists)
                    throw new ArgumentException($"Parent avec l'ID {normalizedDto.Parent2Id.Value} n'existe pas");
                
                // Vérifier que la relation n'existe pas déjà
                var relationshipExists = await _unitOfWork.Relationships.RelationshipExistsAsync(
                    normalizedDto.Parent2Id.Value, 
                    createdPerson.Id, 
                    RelationshipType.Parent);
                
                if (!relationshipExists)
                {
                    var relationship2 = new Relationship
                    {
                        Person1Id = normalizedDto.Parent2Id.Value,
                        Person2Id = createdPerson.Id,
                        RelationshipType = RelationshipType.Parent,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _unitOfWork.Relationships.AddAsync(relationship2);
                }
            }
        }
        
        return _mapper.Map<PersonDto>(createdPerson);
    }

    public async Task<PersonDto> UpdatePersonAsync(int id, UpdatePersonDto updatePersonDto)
    {
        var existingPerson = await _unitOfWork.Persons.GetByIdAsync(id);
        if (existingPerson == null)
            throw new ArgumentException($"Person with ID {id} not found");

        // Normaliser les données avant mise à jour
        var normalizedDto = NormalizeUpdatePersonDto(updatePersonDto);
        
        _mapper.Map(normalizedDto, existingPerson);
        existingPerson.UpdatedAt = DateTime.UtcNow;
        
        var updatedPerson = await _unitOfWork.Persons.UpdateAsync(existingPerson);
        return _mapper.Map<PersonDto>(updatedPerson);
    }

    /// <summary>
    /// Normalise les données d'un CreatePersonDto
    /// </summary>
    private CreatePersonDto NormalizePersonDto(CreatePersonDto dto)
    {
        return new CreatePersonDto
        {
            FirstName = _normalizationService.NormalizeName(dto.FirstName),
            LastName = _normalizationService.NormalizeName(dto.LastName),
            MiddleName = _normalizationService.NormalizeName(dto.MiddleName),
            BirthPlace = _normalizationService.NormalizePlace(dto.BirthPlace),
            DeathPlace = _normalizationService.NormalizePlace(dto.DeathPlace),
            MarriagePlace = _normalizationService.NormalizePlace(dto.MarriagePlace),
            Profession = _normalizationService.NormalizeProfession(dto.Profession),
            BirthDate = dto.BirthDate,
            DeathDate = dto.DeathDate,
            MarriageDate = dto.MarriageDate,
            PhotoUrl = dto.PhotoUrl,
            Biography = dto.Biography,
            Gender = dto.Gender,
            IsAlive = dto.IsAlive,
            DeathStatus = dto.DeathStatus,
            Parent1Id = dto.Parent1Id,
            Parent2Id = dto.Parent2Id
        };
    }

    /// <summary>
    /// Normalise les données d'un UpdatePersonDto
    /// </summary>
    private UpdatePersonDto NormalizeUpdatePersonDto(UpdatePersonDto dto)
    {
        return new UpdatePersonDto
        {
            FirstName = _normalizationService.NormalizeName(dto.FirstName),
            LastName = _normalizationService.NormalizeName(dto.LastName),
            MiddleName = _normalizationService.NormalizeName(dto.MiddleName),
            BirthPlace = _normalizationService.NormalizePlace(dto.BirthPlace),
            DeathPlace = _normalizationService.NormalizePlace(dto.DeathPlace),
            MarriagePlace = _normalizationService.NormalizePlace(dto.MarriagePlace),
            Profession = _normalizationService.NormalizeProfession(dto.Profession),
            BirthDate = dto.BirthDate,
            DeathDate = dto.DeathDate,
            MarriageDate = dto.MarriageDate,
            PhotoUrl = dto.PhotoUrl,
            Biography = dto.Biography,
            Gender = dto.Gender,
            IsAlive = dto.IsAlive,
            DeathStatus = dto.DeathStatus
        };
    }

    public async Task<bool> DeletePersonAsync(int id)
    {
        return await _unitOfWork.Persons.DeleteAsync(id);
    }

    public async Task<bool> PersonExistsAsync(int id)
    {
        return await _unitOfWork.Persons.ExistsAsync(id);
    }
}
