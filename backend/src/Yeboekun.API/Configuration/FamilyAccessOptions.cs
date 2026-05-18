namespace Yeboekun.API.Configuration;

/// <summary>
/// Accès par mot de passe familial partagé (un seul secret, communiqué hors ligne).
/// Actif lorsque <see cref="Password"/> est renseigné et <see cref="Disabled"/> est false.
/// </summary>
public class FamilyAccessOptions
{
    public const string SectionName = "FamilyAccess";

    /// <summary>Mot de passe en clair (fourni via configuration / variables d'environnement uniquement).</summary>
    public string? Password { get; set; }

    /// <summary>Si true, le middleware n'applique aucune restriction (ex. CI, dev local).</summary>
    public bool Disabled { get; set; }

    public bool IsGateActive =>
        !Disabled && !string.IsNullOrWhiteSpace(Password);
}
