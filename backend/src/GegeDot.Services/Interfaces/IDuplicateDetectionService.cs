using GegeDot.Core.Entities;

namespace GegeDot.Services.Interfaces;

/// <summary>
/// Service de détection de doublons pour éviter les enregistrements multiples
/// </summary>
public interface IDuplicateDetectionService
{
    /// <summary>
    /// Trouve les doublons potentiels pour une personne
    /// </summary>
    Task<List<DuplicateCandidate>> FindDuplicatesAsync(Person person);
    
    /// <summary>
    /// Vérifie si deux personnes sont des doublons
    /// </summary>
    bool IsDuplicate(Person person1, Person person2, double threshold = 0.85);
    
    /// <summary>
    /// Calcule le score de similarité entre deux personnes
    /// </summary>
    double CalculateSimilarityScore(Person person1, Person person2);
}

/// <summary>
/// Candidat doublon avec score de similarité
/// </summary>
public class DuplicateCandidate
{
    public int PersonId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string? BirthPlace { get; set; }
    public double SimilarityScore { get; set; }
    public string MatchReason { get; set; } = string.Empty;
}
