# 🤝 Guide de Contribution - GegeDot

Merci de votre intérêt à contribuer à GegeDot ! Ce guide vous aidera à comprendre comment contribuer efficacement au projet.

## 🎯 Comment Contribuer

### 1. Signaler un Bug
- Utilisez l'onglet "Issues" sur GitHub
- Utilisez le template "Bug Report"
- Incluez des étapes pour reproduire le problème
- Ajoutez des captures d'écran si nécessaire

### 2. Proposer une Nouvelle Fonctionnalité
- Utilisez l'onglet "Issues" sur GitHub
- Utilisez le template "Feature Request"
- Décrivez clairement la fonctionnalité souhaitée
- Expliquez pourquoi elle serait utile

### 3. Contribuer au Code
- Fork le repository
- Créez une branche pour votre fonctionnalité
- Faites vos modifications
- Ajoutez des tests
- Soumettez une Pull Request

## 🛠️ Configuration de l'Environnement de Développement

### Prérequis
- .NET 8 SDK
- Node.js 18+
- MySQL 8.0+
- Docker (optionnel)
- Git

### Installation
```bash
# 1. Fork et cloner le repository
git clone https://github.com/votre-username/gegeDot.git
cd gegeDot

# 2. Configurer le backend
cd backend
dotnet restore
dotnet build

# 3. Configurer le frontend
cd ../frontend
npm install
npm run build

# 4. Démarrer avec Docker (recommandé)
cd ..
docker-compose up -d
```

### Tests
```bash
# Backend
cd backend
dotnet test

# Frontend
cd frontend
npm test

# Tests d'intégration
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📋 Standards de Code

### Backend (.NET)
- Utilisez C# 12 et .NET 8
- Suivez les conventions de nommage C#
- Ajoutez des commentaires XML pour les APIs publiques
- Utilisez async/await pour les opérations asynchrones
- Écrivez des tests unitaires pour chaque nouvelle fonctionnalité

```csharp
/// <summary>
/// Récupère une personne par son ID
/// </summary>
/// <param name="id">L'ID de la personne</param>
/// <returns>La personne correspondante</returns>
public async Task<PersonDto?> GetPersonByIdAsync(int id)
{
    // Implementation
}
```

### Frontend (React/TypeScript)
- Utilisez TypeScript strict
- Suivez les conventions React
- Utilisez des composants fonctionnels avec hooks
- Ajoutez des PropTypes ou utilisez TypeScript
- Écrivez des tests pour les composants

```typescript
interface PersonCardProps {
  person: Person;
  onEdit?: (person: Person) => void;
  onDelete?: (person: Person) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onEdit, onDelete }) => {
  // Implementation
};
```

### Base de Données
- Utilisez des migrations Entity Framework
- Ajoutez des index pour les performances
- Documentez les changements de schéma
- Testez les migrations

## 🧪 Tests

### Tests Unitaires
- Couverture de code minimum : 80%
- Testez les cas d'erreur
- Utilisez des mocks pour les dépendances
- Nommez les tests de manière descriptive

```csharp
[Fact]
public async Task GetPersonByIdAsync_WithValidId_ShouldReturnPerson()
{
    // Arrange
    var person = new Person { Id = 1, FirstName = "Jean" };
    _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(person);

    // Act
    var result = await _personService.GetPersonByIdAsync(1);

    // Assert
    result.Should().NotBeNull();
    result.FirstName.Should().Be("Jean");
}
```

### Tests d'Intégration
- Testez les endpoints API
- Vérifiez l'intégration avec la base de données
- Testez les flux complets

### Tests E2E
- Testez les scénarios utilisateur complets
- Utilisez Cypress ou Playwright
- Testez sur différents navigateurs

## 📝 Documentation

### Code
- Documentez les APIs publiques
- Ajoutez des commentaires pour la logique complexe
- Maintenez le README à jour

### API
- Utilisez Swagger/OpenAPI
- Documentez les endpoints
- Ajoutez des exemples de requêtes/réponses

### Base de Données
- Documentez les changements de schéma
- Maintenez le diagramme ER à jour
- Documentez les requêtes complexes

## 🔄 Workflow Git

### Branches
- `main` : Branche principale (production)
- `develop` : Branche de développement
- `feature/nom-fonctionnalite` : Nouvelles fonctionnalités
- `bugfix/nom-bug` : Corrections de bugs
- `hotfix/nom-urgence` : Corrections urgentes

### Commits
Utilisez des messages de commit clairs :
```
feat: ajouter la recherche de personnes
fix: corriger l'erreur de validation des dates
docs: mettre à jour la documentation API
test: ajouter des tests pour PersonService
refactor: simplifier la logique de validation
```

### Pull Requests
1. Créez une branche depuis `develop`
2. Faites vos modifications
3. Ajoutez des tests
4. Mettez à jour la documentation
5. Créez une Pull Request
6. Attendez la review

## 📋 Checklist pour les Pull Requests

### Code
- [ ] Code conforme aux standards
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de warnings de compilation
- [ ] Tests passent

### Fonctionnalité
- [ ] Fonctionnalité testée manuellement
- [ ] Cas d'erreur gérés
- [ ] Performance acceptable
- [ ] Compatible avec les versions existantes

### Documentation
- [ ] README mis à jour si nécessaire
- [ ] Documentation API mise à jour
- [ ] Changelog mis à jour
- [ ] Commentaires ajoutés

## 🐛 Signaler des Bugs

### Informations Requises
- Version de l'application
- Système d'exploitation
- Navigateur (pour le frontend)
- Étapes pour reproduire
- Comportement attendu vs observé
- Logs d'erreur
- Captures d'écran

### Template de Bug Report
```markdown
## Description
Description claire du bug

## Étapes pour Reproduire
1. Aller à...
2. Cliquer sur...
3. Voir l'erreur

## Comportement Attendu
Ce qui devrait se passer

## Comportement Observé
Ce qui se passe réellement

## Environnement
- OS: Windows 10
- Navigateur: Chrome 120
- Version: 1.0.0

## Logs
```
Erreur détaillée ici
```
```

## 💡 Proposer des Fonctionnalités

### Template de Feature Request
```markdown
## Résumé
Description courte de la fonctionnalité

## Motivation
Pourquoi cette fonctionnalité serait-elle utile ?

## Description Détaillée
Description complète de la fonctionnalité

## Alternatives
Autres solutions considérées

## Impact
- Impact sur l'utilisateur
- Impact sur les performances
- Impact sur la sécurité
```

## 🏷️ Labels et Milestones

### Labels
- `bug` : Bug report
- `enhancement` : Nouvelle fonctionnalité
- `documentation` : Amélioration de la documentation
- `good first issue` : Bon pour les débutants
- `help wanted` : Aide demandée
- `priority: high` : Priorité élevée
- `priority: low` : Priorité faible

### Milestones
- `v1.1.0` : Prochaine version mineure
- `v2.0.0` : Prochaine version majeure
- `Backlog` : Fonctionnalités futures

## 🎉 Reconnaissance

Les contributeurs sont reconnus dans :
- Le fichier CONTRIBUTORS.md
- Les releases GitHub
- La documentation

## 📞 Support

### Questions
- Utilisez les Discussions GitHub
- Posez des questions dans les Issues
- Rejoignez notre communauté

### Contact
- Email : [votre-email]
- Twitter : [@votre-twitter]
- LinkedIn : [votre-linkedin]

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous la licence MIT.

---

Merci de contribuer à GegeDot ! 🚀
