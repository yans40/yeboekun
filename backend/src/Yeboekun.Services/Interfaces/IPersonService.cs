using Yeboekun.Services.DTOs;

namespace Yeboekun.Services.Interfaces;

public interface IPersonService
{
    Task<IEnumerable<PersonDto>> GetAllPersonsAsync();
    Task<PersonDto?> GetPersonByIdAsync(int id);
    Task<PersonDto?> GetPersonWithRelationshipsAsync(int id);
    Task<IEnumerable<PersonDto>> GetChildrenAsync(int personId);
    Task<IEnumerable<PersonDto>> GetParentsAsync(int personId);
    Task<IEnumerable<PersonDto>> GetSiblingsAsync(int personId);
    Task<IEnumerable<PersonDto>> SearchPersonsAsync(string searchTerm);
    Task<PersonDto> CreatePersonAsync(CreatePersonDto createPersonDto);
    Task<PersonDto> UpdatePersonAsync(int id, UpdatePersonDto updatePersonDto);
    Task<bool> DeletePersonAsync(int id);
    Task<bool> PersonExistsAsync(int id);
}
