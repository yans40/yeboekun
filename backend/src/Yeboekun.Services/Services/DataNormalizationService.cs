using Yeboekun.Services.Interfaces;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Yeboekun.Services.Services;

/// <summary>
/// Service de normalisation des données pour assurer l'uniformité
/// </summary>
public class DataNormalizationService : IDataNormalizationService
{
    private readonly Dictionary<string, string> _placeAbbreviations = new()
    {
        { "st", "Saint" },
        { "ste", "Sainte" },
        { "st-", "Saint-" },
        { "ste-", "Sainte-" },
        { "st.", "Saint" },
        { "ste.", "Sainte" }
    };

    /// <summary>
    /// Normalise un nom (suppression espaces multiples, capitalisation)
    /// </summary>
    public string NormalizeName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return string.Empty;

        // Supprimer les espaces multiples et trim
        var normalized = Regex.Replace(name.Trim(), @"\s+", " ");

        // Capitalisation : Première lettre de chaque mot en majuscule
        var textInfo = CultureInfo.InvariantCulture.TextInfo;
        normalized = textInfo.ToTitleCase(normalized.ToLowerInvariant());

        return normalized;
    }

    /// <summary>
    /// Normalise un lieu (capitalisation, gestion des abréviations)
    /// </summary>
    public string NormalizePlace(string? place)
    {
        if (string.IsNullOrWhiteSpace(place))
            return string.Empty;

        var normalized = place.Trim();

        // Gérer les abréviations communes
        foreach (var abbreviation in _placeAbbreviations)
        {
            var regex = new Regex($@"\b{Regex.Escape(abbreviation.Key)}\b", RegexOptions.IgnoreCase);
            normalized = regex.Replace(normalized, abbreviation.Value);
        }

        // Capitalisation : Première lettre de chaque mot en majuscule
        var textInfo = CultureInfo.InvariantCulture.TextInfo;
        normalized = textInfo.ToTitleCase(normalized.ToLowerInvariant());

        return normalized;
    }

    /// <summary>
    /// Normalise une date (conversion vers format ISO, gestion des formats multiples)
    /// </summary>
    public DateTime? NormalizeDate(string? dateString)
    {
        if (string.IsNullOrWhiteSpace(dateString))
            return null;

        var trimmed = dateString.Trim();

        // Formats de date supportés
        var formats = new[]
        {
            "dd/MM/yyyy",
            "dd-MM-yyyy",
            "yyyy-MM-dd",
            "dd/MM/yy",
            "MM/yyyy",
            "yyyy",
            "dd MMM yyyy",
            "dd MMMM yyyy"
        };

        // Essayer de parser avec les formats standards
        foreach (var format in formats)
        {
            if (DateTime.TryParseExact(trimmed, format, CultureInfo.InvariantCulture,
                DateTimeStyles.None, out DateTime result))
            {
                return result;
            }
        }

        // Essayer un parsing libre
        if (DateTime.TryParse(trimmed, CultureInfo.InvariantCulture,
            DateTimeStyles.None, out DateTime parsedDate))
        {
            return parsedDate;
        }

        // Gestion des dates approximatives (ex: "vers 1850", "environ 1920")
        if (trimmed.ToLowerInvariant().Contains("vers") ||
            trimmed.ToLowerInvariant().Contains("environ") ||
            trimmed.ToLowerInvariant().Contains("circa"))
        {
            var yearMatch = Regex.Match(trimmed, @"\d{4}");
            if (yearMatch.Success && int.TryParse(yearMatch.Value, out int year))
            {
                // Retourner le 1er janvier de l'année trouvée
                return new DateTime(year, 1, 1);
            }
        }

        return null;
    }

    /// <summary>
    /// Normalise une profession (capitalisation, standardisation)
    /// </summary>
    public string NormalizeProfession(string? profession)
    {
        if (string.IsNullOrWhiteSpace(profession))
            return string.Empty;

        var normalized = profession.Trim();

        // Supprimer les espaces multiples
        normalized = Regex.Replace(normalized, @"\s+", " ");

        // Capitalisation : Première lettre de chaque mot en majuscule
        var textInfo = CultureInfo.InvariantCulture.TextInfo;
        normalized = textInfo.ToTitleCase(normalized.ToLowerInvariant());

        return normalized;
    }
}
