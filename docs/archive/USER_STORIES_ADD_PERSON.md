# 👤 User Stories - Ajout de Personnes

## 🎯 Vue d'Ensemble
Fonctionnalité permettant aux utilisateurs d'ajouter de nouvelles personnes à l'arbre généalogique avec validation, normalisation et détection de doublons.

---

## 📋 User Stories

### **US-001 : Ajout d'une Nouvelle Personne**

**En tant que** utilisateur de GegeDot  
**Je veux** pouvoir ajouter une nouvelle personne à l'arbre généalogique  
**Afin de** enrichir ma base de données familiale

#### **Critères d'Acceptance :**

**✅ CA-001.1 : Formulaire d'Ajout**
- [ ] Un formulaire d'ajout de personne est accessible depuis l'interface
- [ ] Le formulaire contient tous les champs obligatoires et optionnels
- [ ] Les champs sont clairement étiquetés avec des exemples
- [ ] Le formulaire est responsive et accessible

**✅ CA-001.2 : Champs Obligatoires**
- [ ] Prénom (obligatoire, min 2 caractères, max 50)
- [ ] Nom de famille (obligatoire, min 2 caractères, max 50)
- [ ] Date de naissance (obligatoire, format DD/MM/YYYY)
- [ ] Lieu de naissance (obligatoire, min 3 caractères, max 100)

**✅ CA-001.3 : Champs Optionnels**
- [ ] Nom du milieu (optionnel, max 50 caractères)
- [ ] Date de décès (optionnel, format DD/MM/YYYY)
- [ ] Lieu de décès (optionnel, max 100 caractères)
- [ ] Profession (optionnel, max 100 caractères)
- [ ] Date de mariage (optionnel, format DD/MM/YYYY)
- [ ] Lieu de mariage (optionnel, max 100 caractères)
- [ ] Biographie (optionnel, max 1000 caractères)
- [ ] Photo (optionnel, formats JPG/PNG, max 5MB)

**✅ CA-001.4 : Validation des Données**
- [ ] Validation côté client en temps réel
- [ ] Messages d'erreur clairs et contextuels
- [ ] Validation côté serveur pour la sécurité
- [ ] Prévention des injections SQL/XSS

---

### **US-002 : Normalisation des Caractères**

**En tant que** utilisateur de GegeDot  
**Je veux** que les noms soient automatiquement normalisés  
**Afin de** avoir une uniformité dans l'affichage et la recherche

#### **Critères d'Acceptance :**

**✅ CA-002.1 : Normalisation des Noms**
- [ ] Suppression des espaces multiples
- [ ] Capitalisation automatique (Première lettre en majuscule)
- [ ] Suppression des caractères spéciaux non autorisés
- [ ] Gestion des accents et caractères internationaux

**✅ CA-002.2 : Normalisation des Lieux**
- [ ] Capitalisation des noms de lieux
- [ ] Formatage des codes postaux/départements
- [ ] Standardisation des abréviations (ex: "St" → "Saint")

**✅ CA-002.3 : Normalisation des Dates**
- [ ] Conversion automatique vers format ISO (YYYY-MM-DD)
- [ ] Validation des dates cohérentes (naissance < décès)
- [ ] Gestion des dates approximatives (ex: "vers 1850")

**✅ CA-002.4 : Normalisation des Professions**
- [ ] Capitalisation des professions
- [ ] Standardisation des termes (ex: "cultivateur" → "Cultivateur")
- [ ] Gestion des professions au féminin/masculin

---

### **US-003 : Détection et Gestion des Doublons**

**En tant que** utilisateur de GegeDot  
**Je veux** être averti des doublons potentiels  
**Afin de** éviter d'enregistrer la même personne plusieurs fois

#### **Critères d'Acceptance :**

**✅ CA-003.1 : Détection de Doublons**
- [ ] Algorithme de détection basé sur nom + prénom + date de naissance
- [ ] Recherche phonétique pour les noms similaires
- [ ] Comparaison des lieux de naissance
- [ ] Score de similarité configurable (par défaut 85%)

**✅ CA-003.2 : Interface de Gestion des Doublons**
- [ ] Affichage des doublons potentiels avant sauvegarde
- [ ] Comparaison côte à côte des informations
- [ ] Options : "C'est la même personne", "Personnes différentes", "Fusionner"
- [ ] Possibilité de modifier les informations avant validation

**✅ CA-003.3 : Fusion de Doublons**
- [ ] Sélection des informations à conserver
- [ ] Mise à jour automatique des relations
- [ ] Historique des fusions effectuées
- [ ] Possibilité d'annuler une fusion

**✅ CA-003.4 : Validation Manuelle**
- [ ] Interface pour confirmer que ce sont des personnes différentes
- [ ] Ajout de notes explicatives
- [ ] Sauvegarde des décisions pour référence future

---

### **US-004 : Gestion des Relations Familiales**

**En tant que** utilisateur de GegeDot  
**Je veux** pouvoir définir les relations familiales lors de l'ajout  
**Afin de** construire automatiquement l'arbre généalogique

#### **Critères d'Acceptance :**

**✅ CA-004.1 : Sélection des Parents**
- [ ] Recherche et sélection des parents existants
- [ ] Possibilité d'ajouter les parents s'ils n'existent pas
- [ ] Validation de la cohérence des dates (parents > enfants)
- [ ] Gestion des parents inconnus

**✅ CA-004.2 : Sélection du Conjoint**
- [ ] Recherche et sélection du conjoint existant
- [ ] Possibilité d'ajouter le conjoint s'il n'existe pas
- [ ] Validation de la cohérence des dates de mariage
- [ ] Gestion des mariages multiples

**✅ CA-004.3 : Sélection des Enfants**
- [ ] Recherche et sélection des enfants existants
- [ ] Possibilité d'ajouter les enfants s'ils n'existent pas
- [ ] Validation de la cohérence des dates (parents < enfants)
- [ ] Gestion des enfants adoptés

**✅ CA-004.4 : Relations Complexes**
- [ ] Gestion des demi-frères/sœurs
- [ ] Gestion des beaux-parents
- [ ] Gestion des parrains/marraines
- [ ] Relations d'adoption

---

### **US-005 : Sauvegarde et Confirmation**

**En tant que** utilisateur de GegeDot  
**Je veux** avoir une confirmation claire de la sauvegarde  
**Afin de** m'assurer que mes données sont bien enregistrées

#### **Critères d'Acceptance :**

**✅ CA-005.1 : Sauvegarde Sécurisée**
- [ ] Sauvegarde en base de données avec transaction
- [ ] Gestion des erreurs de sauvegarde
- [ ] Rollback en cas d'échec partiel
- [ ] Logs d'audit des modifications

**✅ CA-005.2 : Confirmation Visuelle**
- [ ] Message de succès avec ID de la personne créée
- [ ] Redirection vers la fiche de la personne
- [ ] Mise à jour automatique de l'arbre généalogique
- [ ] Notification de l'ajout dans l'historique

**✅ CA-005.3 : Gestion des Erreurs**
- [ ] Messages d'erreur clairs et actionables
- [ ] Sauvegarde des données en cas d'erreur
- [ ] Possibilité de reprendre l'ajout
- [ ] Support technique en cas de problème

---

## 🎨 Interface Utilisateur

### **Formulaire d'Ajout de Personne**

```html
<!-- Structure du formulaire -->
<form id="addPersonForm">
  <!-- Section Identité -->
  <fieldset>
    <legend>Identité</legend>
    <input type="text" name="firstName" required placeholder="Prénom" />
    <input type="text" name="middleName" placeholder="Nom du milieu" />
    <input type="text" name="lastName" required placeholder="Nom de famille" />
  </fieldset>

  <!-- Section Dates -->
  <fieldset>
    <legend>Dates importantes</legend>
    <input type="date" name="birthDate" required />
    <input type="date" name="deathDate" />
    <input type="date" name="marriageDate" />
  </fieldset>

  <!-- Section Lieux -->
  <fieldset>
    <legend>Lieux</legend>
    <input type="text" name="birthPlace" required placeholder="Lieu de naissance" />
    <input type="text" name="deathPlace" placeholder="Lieu de décès" />
    <input type="text" name="marriagePlace" placeholder="Lieu de mariage" />
  </fieldset>

  <!-- Section Relations -->
  <fieldset>
    <legend>Relations familiales</legend>
    <select name="fatherId" placeholder="Père">
      <option value="">Sélectionner le père</option>
    </select>
    <select name="motherId" placeholder="Mère">
      <option value="">Sélectionner la mère</option>
    </select>
    <select name="spouseId" placeholder="Conjoint">
      <option value="">Sélectionner le conjoint</option>
    </select>
  </fieldset>

  <!-- Section Informations complémentaires -->
  <fieldset>
    <legend>Informations complémentaires</legend>
    <input type="text" name="profession" placeholder="Profession" />
    <textarea name="biography" placeholder="Biographie"></textarea>
    <input type="file" name="photo" accept="image/*" />
  </fieldset>

  <!-- Boutons d'action -->
  <div class="form-actions">
    <button type="button" id="cancelBtn">Annuler</button>
    <button type="button" id="saveDraftBtn">Brouillon</button>
    <button type="submit" id="saveBtn">Enregistrer</button>
  </div>
</form>
```

---

## 🔧 Spécifications Techniques

### **Modèle de Données Étendu**

```csharp
public class Person
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime? DeathDate { get; set; }
    public DateTime? MarriageDate { get; set; }
    public string BirthPlace { get; set; }
    public string DeathPlace { get; set; }
    public string MarriagePlace { get; set; }
    public string Profession { get; set; }
    public string Biography { get; set; }
    public string PhotoUrl { get; set; }
    public bool IsAlive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Relations
    public int? FatherId { get; set; }
    public Person Father { get; set; }
    public int? MotherId { get; set; }
    public Person Mother { get; set; }
    public int? SpouseId { get; set; }
    public Person Spouse { get; set; }
    
    public List<Person> Children { get; set; }
    public List<Relationship> Relationships { get; set; }
}
```

### **Service de Normalisation**

```csharp
public class DataNormalizationService
{
    public string NormalizeName(string name)
    {
        if (string.IsNullOrEmpty(name)) return string.Empty;
        
        return name.Trim()
                  .ToLowerInvariant()
                  .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                  .Select(word => char.ToUpper(word[0]) + word.Substring(1))
                  .Aggregate((a, b) => $"{a} {b}");
    }
    
    public string NormalizePlace(string place)
    {
        if (string.IsNullOrEmpty(place)) return string.Empty;
        
        // Normalisation des lieux avec gestion des abréviations
        var normalized = place.Trim()
                             .ToLowerInvariant()
                             .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                             .Select(word => NormalizePlaceWord(word))
                             .Aggregate((a, b) => $"{a} {b}");
        
        return normalized;
    }
    
    private string NormalizePlaceWord(string word)
    {
        // Gestion des abréviations communes
        var abbreviations = new Dictionary<string, string>
        {
            { "st", "Saint" },
            { "ste", "Sainte" },
            { "st-", "Saint-" },
            { "ste-", "Sainte-" }
        };
        
        if (abbreviations.ContainsKey(word.ToLower()))
        {
            return abbreviations[word.ToLower()];
        }
        
        return char.ToUpper(word[0]) + word.Substring(1);
    }
    
    public DateTime? NormalizeDate(string dateString)
    {
        if (string.IsNullOrEmpty(dateString)) return null;
        
        // Gestion des formats multiples
        var formats = new[] { 
            "dd/MM/yyyy", 
            "dd-MM-yyyy", 
            "yyyy-MM-dd",
            "dd/MM/yy",
            "MM/yyyy",
            "yyyy"
        };
        
        foreach (var format in formats)
        {
            if (DateTime.TryParseExact(dateString, format, null, 
                DateTimeStyles.None, out DateTime result))
            {
                return result;
            }
        }
        
        // Gestion des dates approximatives
        if (dateString.ToLower().Contains("vers") || dateString.ToLower().Contains("environ"))
        {
            var yearMatch = System.Text.RegularExpressions.Regex.Match(dateString, @"\d{4}");
            if (yearMatch.Success && int.TryParse(yearMatch.Value, out int year))
            {
                return new DateTime(year, 1, 1);
            }
        }
        
        return null;
    }
    
    public string NormalizeProfession(string profession)
    {
        if (string.IsNullOrEmpty(profession)) return string.Empty;
        
        return profession.Trim()
                        .ToLowerInvariant()
                        .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                        .Select(word => char.ToUpper(word[0]) + word.Substring(1))
                        .Aggregate((a, b) => $"{a} {b}");
    }
}
```

### **Service de Détection de Doublons**

```csharp
public class DuplicateDetectionService
{
    private readonly double _similarityThreshold = 0.85;
    
    public List<DuplicateCandidate> FindDuplicates(Person newPerson)
    {
        var candidates = new List<DuplicateCandidate>();
        
        // Recherche par nom exact
        var exactMatches = SearchExactMatches(newPerson);
        candidates.AddRange(exactMatches);
        
        // Recherche phonétique
        var phoneticMatches = SearchPhoneticMatches(newPerson);
        candidates.AddRange(phoneticMatches);
        
        // Recherche par similarité
        var similarMatches = SearchSimilarMatches(newPerson);
        candidates.AddRange(similarMatches);
        
        return candidates
            .GroupBy(c => c.PersonId)
            .Select(g => g.OrderByDescending(c => c.SimilarityScore).First())
            .OrderByDescending(c => c.SimilarityScore)
            .ToList();
    }
    
    public bool IsDuplicate(Person person1, Person person2, double threshold = 0.85)
    {
        var score = CalculateSimilarityScore(person1, person2);
        return score >= threshold;
    }
    
    private double CalculateSimilarityScore(Person p1, Person p2)
    {
        var nameScore = CalculateNameSimilarity(p1, p2);
        var dateScore = CalculateDateSimilarity(p1, p2);
        var placeScore = CalculatePlaceSimilarity(p1, p2);
        
        return (nameScore * 0.5) + (dateScore * 0.3) + (placeScore * 0.2);
    }
    
    private double CalculateNameSimilarity(Person p1, Person p2)
    {
        var fullName1 = $"{p1.FirstName} {p1.LastName}".ToLowerInvariant();
        var fullName2 = $"{p2.FirstName} {p2.LastName}".ToLowerInvariant();
        
        // Similarité de Levenshtein
        var distance = LevenshteinDistance(fullName1, fullName2);
        var maxLength = Math.Max(fullName1.Length, fullName2.Length);
        
        return maxLength == 0 ? 1.0 : 1.0 - (double)distance / maxLength;
    }
    
    private double CalculateDateSimilarity(Person p1, Person p2)
    {
        if (!p1.BirthDate.HasValue || !p2.BirthDate.HasValue)
            return 0.0;
        
        var diff = Math.Abs((p1.BirthDate.Value - p2.BirthDate.Value).TotalDays);
        
        // Tolérance de 30 jours
        if (diff <= 30) return 1.0;
        if (diff <= 365) return 0.8;
        if (diff <= 3650) return 0.5;
        
        return 0.0;
    }
    
    private double CalculatePlaceSimilarity(Person p1, Person p2)
    {
        if (string.IsNullOrEmpty(p1.BirthPlace) || string.IsNullOrEmpty(p2.BirthPlace))
            return 0.0;
        
        var place1 = p1.BirthPlace.ToLowerInvariant();
        var place2 = p2.BirthPlace.ToLowerInvariant();
        
        if (place1 == place2) return 1.0;
        
        // Similarité phonétique pour les lieux
        var distance = LevenshteinDistance(place1, place2);
        var maxLength = Math.Max(place1.Length, place2.Length);
        
        return maxLength == 0 ? 1.0 : 1.0 - (double)distance / maxLength;
    }
    
    private int LevenshteinDistance(string s1, string s2)
    {
        var matrix = new int[s1.Length + 1, s2.Length + 1];
        
        for (int i = 0; i <= s1.Length; i++)
            matrix[i, 0] = i;
        
        for (int j = 0; j <= s2.Length; j++)
            matrix[0, j] = j;
        
        for (int i = 1; i <= s1.Length; i++)
        {
            for (int j = 1; j <= s2.Length; j++)
            {
                var cost = s1[i - 1] == s2[j - 1] ? 0 : 1;
                matrix[i, j] = Math.Min(
                    Math.Min(matrix[i - 1, j] + 1, matrix[i, j - 1] + 1),
                    matrix[i - 1, j - 1] + cost);
            }
        }
        
        return matrix[s1.Length, s2.Length];
    }
}

public class DuplicateCandidate
{
    public int PersonId { get; set; }
    public string FullName { get; set; }
    public DateTime? BirthDate { get; set; }
    public string BirthPlace { get; set; }
    public double SimilarityScore { get; set; }
    public string MatchReason { get; set; }
}
```

---

## 📊 Métriques de Succès

### **Performance**
- [ ] Ajout d'une personne < 2 secondes
- [ ] Détection de doublons < 1 seconde
- [ ] Normalisation des données < 500ms
- [ ] Sauvegarde en base < 1 seconde

### **Qualité**
- [ ] 0% de doublons non détectés
- [ ] 100% des données normalisées
- [ ] 0% d'erreurs de validation
- [ ] 100% des relations cohérentes

### **UX**
- [ ] Formulaire intuitif et guidé
- [ ] Messages d'erreur clairs
- [ ] Sauvegarde des brouillons
- [ ] Confirmation visuelle

---

## 🚀 Plan d'Implémentation

### **Phase 1 : Modèle de Données**
- [ ] Extension du modèle Person
- [ ] Migration de base de données
- [ ] Services de normalisation

### **Phase 2 : Interface Utilisateur**
- [ ] Formulaire d'ajout
- [ ] Validation côté client
- [ ] Gestion des erreurs

### **Phase 3 : Logique Métier**
- [ ] Détection de doublons
- [ ] Normalisation des données
- [ ] Gestion des relations

### **Phase 4 : Tests et Optimisation**
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Optimisation des performances

---

## 🎯 Intégration avec la Phase Delta

Cette fonctionnalité s'intègre parfaitement avec les objectifs de la Phase Delta :

1. **Vue Éventail Professionnelle** : Les nouvelles données enrichies (profession, mariage) alimenteront la vue éventail
2. **Relations Complexes** : La gestion des relations familiales prépare le terrain pour les relations complexes
3. **Recherche Avancée** : Les données normalisées permettront une recherche plus efficace
4. **Export et Partage** : Les données structurées faciliteront les exports

Cette fonctionnalité sera un pilier de la Phase Delta ! 🎯




