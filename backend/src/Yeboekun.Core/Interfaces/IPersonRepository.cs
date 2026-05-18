using Yeboekun.Core.Entities;

namespace Yeboekun.Core.Interfaces;

public interface IPersonRepository
{
    Task<IEnumerable<Person>> GetAllAsync();
    Task<Person?> GetByIdAsync(int id);
    Task<Person?> GetByIdWithRelationshipsAsync(int id);
    Task<IEnumerable<Person>> GetChildrenAsync(int personId);
    Task<IEnumerable<Person>> GetParentsAsync(int personId);
    Task<IEnumerable<Person>> GetSiblingsAsync(int personId);
    Task<IEnumerable<Person>> SearchByNameAsync(string searchTerm);
    Task<Person> AddAsync(Person person);
    Task<Person> UpdateAsync(Person person);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);

    // --- Méthodes batch pour la traversée d'arbre (BFS niveau par niveau) ---

    /// <summary>
    /// Pour chaque ID dans <paramref name="personIds"/>, retourne la liste de ses parents
    /// (Person1Id quand Type=Parent et Person2Id est dans la liste).
    /// Une seule requête SQL avec WHERE Person2Id IN (...).
    /// </summary>
    Task<Dictionary<int, List<int>>> GetParentIdsBatchAsync(
        IEnumerable<int> personIds,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Pour chaque ID dans <paramref name="personIds"/>, retourne la liste de ses enfants
    /// (Person2Id quand Type=Parent et Person1Id est dans la liste).
    /// Une seule requête SQL avec WHERE Person1Id IN (...).
    /// </summary>
    Task<Dictionary<int, List<int>>> GetChildIdsBatchAsync(
        IEnumerable<int> personIds,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Charge les personnes dont l'ID est dans <paramref name="ids"/> en une seule requête.
    /// </summary>
    Task<List<Person>> GetPersonsByIdsAsync(
        IEnumerable<int> ids,
        CancellationToken cancellationToken = default);

    // --- Agrégats statistiques (COUNT SQL — aucun chargement en mémoire) ---

    /// <summary>
    /// Retourne les compteurs globaux de la table Persons en une passe SQL par compteur.
    /// Aucun enregistrement n'est chargé en mémoire.
    /// </summary>
    Task<PersonStatsAggregate> GetStatsAggregateAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Résultat des compteurs agrégés sur la table Persons.
/// Calculé côté SQL via des COUNT indexés.
/// </summary>
public sealed record PersonStatsAggregate(
    int PersonCount,
    int LivingCount,
    int DeceasedCount,
    int CompleteCount
);
