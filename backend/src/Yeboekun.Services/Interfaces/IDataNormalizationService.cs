namespace Yeboekun.Services.Interfaces;

/// <summary>
/// Service de normalisation des données pour assurer l'uniformité
/// </summary>
public interface IDataNormalizationService
{
    /// <summary>
    /// Normalise un nom (suppression espaces multiples, capitalisation)
    /// </summary>
    string NormalizeName(string? name);
    
    /// <summary>
    /// Normalise un lieu (capitalisation, gestion des abréviations)
    /// </summary>
    string NormalizePlace(string? place);
    
    /// <summary>
    /// Normalise une date (conversion vers format ISO, gestion des formats multiples)
    /// </summary>
    DateTime? NormalizeDate(string? dateString);
    
    /// <summary>
    /// Normalise une profession (capitalisation, standardisation)
    /// </summary>
    string NormalizeProfession(string? profession);
}
