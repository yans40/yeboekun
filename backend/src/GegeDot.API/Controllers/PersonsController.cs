using AutoMapper;
using GegeDot.Core.Entities;
using GegeDot.Core.Interfaces;
using GegeDot.Services.DTOs;
using GegeDot.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GegeDot.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonsController : ControllerBase
{
    private readonly IPersonService _personService;
    private readonly IDuplicateDetectionService _duplicateDetectionService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<PersonsController> _logger;
    private readonly ITreeTraversalService _treeTraversalService;
    private readonly IRiverViewService _riverViewService;

    public PersonsController(
        IPersonService personService,
        IDuplicateDetectionService duplicateDetectionService,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<PersonsController> logger,
        ITreeTraversalService treeTraversalService,
        IRiverViewService riverViewService)
    {
        _personService = personService;
        _duplicateDetectionService = duplicateDetectionService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _treeTraversalService = treeTraversalService;
        _riverViewService = riverViewService;
    }

    /// <summary>
    /// Récupère toutes les personnes
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonDto>>> GetPersons()
    {
        try
        {
            var persons = await _personService.GetAllPersonsAsync();
            return Ok(persons);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des personnes");
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Récupère une personne par son ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PersonDto>> GetPerson(int id)
    {
        try
        {
            var person = await _personService.GetPersonByIdAsync(id);
            if (person == null)
                return NotFound($"Personne avec l'ID {id} non trouvée");

            return Ok(person);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Récupère une personne avec ses relations
    /// </summary>
    [HttpGet("{id}/relationships")]
    public async Task<ActionResult<PersonDto>> GetPersonWithRelationships(int id)
    {
        try
        {
            var person = await _personService.GetPersonWithRelationshipsAsync(id);
            if (person == null)
                return NotFound($"Personne avec l'ID {id} non trouvée");

            return Ok(person);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de la personne {PersonId} avec relations", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Récupère les enfants d'une personne
    /// </summary>
    [HttpGet("{id}/children")]
    public async Task<ActionResult<IEnumerable<PersonDto>>> GetChildren(int id)
    {
        try
        {
            var children = await _personService.GetChildrenAsync(id);
            return Ok(children);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des enfants de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Récupère les parents d'une personne
    /// </summary>
    [HttpGet("{id}/parents")]
    public async Task<ActionResult<IEnumerable<PersonDto>>> GetParents(int id)
    {
        try
        {
            var parents = await _personService.GetParentsAsync(id);
            return Ok(parents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des parents de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Récupère les frères et sœurs d'une personne
    /// </summary>
    [HttpGet("{id}/siblings")]
    public async Task<ActionResult<IEnumerable<PersonDto>>> GetSiblings(int id)
    {
        try
        {
            var siblings = await _personService.GetSiblingsAsync(id);
            return Ok(siblings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des frères et sœurs de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Recherche des personnes par nom
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<PersonDto>>> SearchPersons([FromQuery] string q)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Le terme de recherche ne peut pas être vide");

            var persons = await _personService.SearchPersonsAsync(q);
            return Ok(persons);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la recherche de personnes avec le terme {SearchTerm}", q);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Vérifie les doublons potentiels avant création
    /// </summary>
    [HttpPost("check-duplicates")]
    public async Task<ActionResult<object>> CheckDuplicates(CreatePersonDto createPersonDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Mapper le DTO vers une entité Person temporaire pour la détection
            var tempPerson = _mapper.Map<Person>(createPersonDto);

            var duplicates = await _duplicateDetectionService.FindDuplicatesAsync(tempPerson);

            return Ok(new
            {
                hasDuplicates = duplicates.Any(),
                duplicates = duplicates,
                count = duplicates.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la vérification des doublons");
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Crée une nouvelle personne
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PersonDto>> CreatePerson(CreatePersonDto createPersonDto)
    {
        try
        {
            // Validation manuelle pour les champs obligatoires
            if (string.IsNullOrWhiteSpace(createPersonDto.FirstName))
            {
                ModelState.AddModelError(nameof(createPersonDto.FirstName), "Le prénom est obligatoire");
            }
            
            if (string.IsNullOrWhiteSpace(createPersonDto.LastName))
            {
                ModelState.AddModelError(nameof(createPersonDto.LastName), "Le nom est obligatoire");
            }
            
            // Validation des dates
            if (createPersonDto.DeathDate.HasValue && createPersonDto.BirthDate.HasValue && 
                createPersonDto.DeathDate.Value < createPersonDto.BirthDate.Value)
            {
                ModelState.AddModelError(nameof(createPersonDto.DeathDate), "La date de décès doit être postérieure à la date de naissance");
            }
            
            if (createPersonDto.IsAlive && createPersonDto.DeathDate.HasValue)
            {
                ModelState.AddModelError(nameof(createPersonDto.DeathDate), "Une personne vivante ne peut pas avoir de date de décès");
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var person = await _personService.CreatePersonAsync(createPersonDto);
            return CreatedAtAction(nameof(GetPerson), new { id = person.Id }, person);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création de la personne");
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Met à jour une personne existante
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePerson(int id, UpdatePersonDto updatePersonDto, [FromQuery] bool force = false)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _personService.PersonExistsAsync(id))
                return NotFound($"Personne avec l'ID {id} non trouvée");

            // Vérifier les doublons avant la mise à jour (en excluant la personne actuelle)
            // Sauf si force=true est spécifié
            if (!force)
            {
                var existingPerson = await _personService.GetPersonByIdAsync(id);
                if (existingPerson == null)
                    return NotFound($"Personne avec l'ID {id} non trouvée");

                // Créer une personne temporaire avec les nouvelles données pour la vérification
                var tempPerson = _mapper.Map<Person>(updatePersonDto);
                tempPerson.Id = id; // Conserver l'ID pour exclure cette personne de la détection

                var duplicates = await _duplicateDetectionService.FindDuplicatesAsync(tempPerson);

                // Si des doublons sont trouvés (en excluant la personne elle-même), retourner un avertissement
                if (duplicates.Any())
                {
                    return Conflict(new
                    {
                        message = "Des doublons potentiels ont été détectés. Voulez-vous continuer quand même ?",
                        hasDuplicates = true,
                        duplicates = duplicates,
                        count = duplicates.Count
                    });
                }
            }

            await _personService.UpdatePersonAsync(id, updatePersonDto);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la mise à jour de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Crée une relation parent-enfant
    /// </summary>
    [HttpPost("{parentId}/children/{childId}")]
    public async Task<IActionResult> CreateParentChildRelationship(int parentId, int childId)
    {
        try
        {
            // Vérifier que les deux personnes existent
            var parentExists = await _unitOfWork.Persons.ExistsAsync(parentId);
            var childExists = await _unitOfWork.Persons.ExistsAsync(childId);
            
            if (!parentExists)
                return NotFound($"Parent avec l'ID {parentId} non trouvé");
            if (!childExists)
                return NotFound($"Enfant avec l'ID {childId} non trouvé");
            
            // Vérifier que la relation n'existe pas déjà
            var relationshipExists = await _unitOfWork.Relationships.RelationshipExistsAsync(
                parentId, 
                childId, 
                RelationshipType.Parent);
            
            if (relationshipExists)
                return Conflict("Cette relation parent-enfant existe déjà");
            
            // Créer la relation
            var relationship = new Relationship
            {
                Person1Id = parentId,
                Person2Id = childId,
                RelationshipType = RelationshipType.Parent,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            
            await _unitOfWork.Relationships.AddAsync(relationship);
            return Ok(new { message = "Relation parent-enfant créée avec succès", relationshipId = relationship.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création de la relation parent-enfant");
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Crée une relation de conjoint entre deux personnes
    /// </summary>
    [HttpPost("{personId}/spouses/{spouseId}")]
    public async Task<IActionResult> CreateSpouseRelationship(int personId, int spouseId, [FromBody] CreateSpouseRelationshipDto? dto = null)
    {
        try
        {
            // Vérifier que les deux personnes existent
            var personExists = await _unitOfWork.Persons.ExistsAsync(personId);
            var spouseExists = await _unitOfWork.Persons.ExistsAsync(spouseId);
            
            if (!personExists)
                return NotFound($"Personne avec l'ID {personId} non trouvée");
            if (!spouseExists)
                return NotFound($"Conjoint avec l'ID {spouseId} non trouvé");
            
            // Vérifier qu'on ne crée pas une relation avec soi-même
            if (personId == spouseId)
                return BadRequest("Une personne ne peut pas être son propre conjoint");
            
            // Vérifier que la relation n'existe pas déjà (dans les deux sens)
            var relationshipExists1 = await _unitOfWork.Relationships.RelationshipExistsAsync(
                personId, 
                spouseId, 
                RelationshipType.Spouse);
            var relationshipExists2 = await _unitOfWork.Relationships.RelationshipExistsAsync(
                spouseId, 
                personId, 
                RelationshipType.Spouse);
            
            if (relationshipExists1 || relationshipExists2)
                return Conflict("Cette relation de conjoint existe déjà");
            
            // Créer la relation dans les deux sens (réciproque)
            // Relation Person1 -> Person2
            var relationship1 = new Relationship
            {
                Person1Id = personId,
                Person2Id = spouseId,
                RelationshipType = RelationshipType.Spouse,
                StartDate = dto?.StartDate,
                EndDate = dto?.EndDate,
                Notes = dto?.Notes,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            
            // Relation Person2 -> Person1 (réciproque)
            var relationship2 = new Relationship
            {
                Person1Id = spouseId,
                Person2Id = personId,
                RelationshipType = RelationshipType.Spouse,
                StartDate = dto?.StartDate,
                EndDate = dto?.EndDate,
                Notes = dto?.Notes,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            
            await _unitOfWork.Relationships.AddAsync(relationship1);
            await _unitOfWork.Relationships.AddAsync(relationship2);
            await _unitOfWork.SaveChangesAsync();
            
            return Ok(new { 
                message = "Relation de conjoint créée avec succès (réciproque)", 
                relationshipId1 = relationship1.Id,
                relationshipId2 = relationship2.Id
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création de la relation de conjoint");
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Récupère tous les conjoints d'une personne (actuels et passés)
    /// </summary>
    [HttpGet("{id}/spouses")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllSpouses(int id)
    {
        try
        {
            var person = await _personService.GetPersonByIdAsync(id);
            if (person == null)
                return NotFound($"Personne avec l'ID {id} non trouvée");

            // Récupérer toutes les relations de la personne
            var relationships = await _unitOfWork.Relationships.GetByPersonIdAsync(id);
            
            // Trouver tous les mariages (Spouse = 3)
            var marriages = relationships
                .Where(r => r.RelationshipType == RelationshipType.Spouse)
                .OrderByDescending(r => r.StartDate ?? DateTime.MinValue)
                .ToList();

            if (!marriages.Any())
                return Ok(new List<object>());

            var spousesList = new List<object>();
            var processedSpouseIds = new HashSet<int>(); // Pour éviter les doublons dus aux relations réciproques
            
            foreach (var marriage in marriages)
            {
                // Déterminer qui est le conjoint
                var spouseId = marriage.Person1Id == id 
                    ? marriage.Person2Id 
                    : marriage.Person1Id;

                // Ignorer si ce conjoint a déjà été traité (évite les doublons des relations réciproques)
                if (processedSpouseIds.Contains(spouseId))
                    continue;

                processedSpouseIds.Add(spouseId);

                // Récupérer le conjoint
                var spouse = await _personService.GetPersonByIdAsync(spouseId);
                if (spouse != null)
                {
                    spousesList.Add(new
                    {
                        spouse = spouse,
                        marriageStartDate = marriage.StartDate,
                        marriageEndDate = marriage.EndDate,
                        isCurrent = marriage.EndDate == null,
                        marriageNotes = marriage.Notes
                    });
                }
            }

            return Ok(spousesList);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des conjoints de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Récupère le conjoint actuel d'une personne
    /// </summary>
    [HttpGet("{id}/spouse")]
    public async Task<ActionResult<PersonDto>> GetCurrentSpouse(int id)
    {
        try
        {
            var person = await _personService.GetPersonByIdAsync(id);
            if (person == null)
                return NotFound($"Personne avec l'ID {id} non trouvée");

            // Récupérer toutes les relations de la personne
            var relationships = await _unitOfWork.Relationships.GetByPersonIdAsync(id);
            
            // Trouver le mariage actuel (Spouse = 3, sans EndDate)
            var currentMarriage = relationships
                .FirstOrDefault(r => r.RelationshipType == RelationshipType.Spouse && r.EndDate == null);

            if (currentMarriage == null)
                return NotFound($"Aucun conjoint actuel trouvé pour la personne {id}");

            // Déterminer qui est le conjoint
            var spouseId = currentMarriage.Person1Id == id 
                ? currentMarriage.Person2Id 
                : currentMarriage.Person1Id;

            // Récupérer le conjoint
            var spouse = await _personService.GetPersonByIdAsync(spouseId);
            if (spouse == null)
                return NotFound($"Conjoint avec l'ID {spouseId} non trouvé");

            return Ok(spouse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération du conjoint de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Récupère l'arbre familial d'une personne (inspiré du repository distant)
    /// </summary>
    [HttpGet("{id}/family")]
    public async Task<ActionResult<FamilyDataDto>> GetFamilyTree(int id)
    {
        try
        {
            var person = await _personService.GetPersonByIdAsync(id);
            if (person == null)
                return NotFound($"Personne avec l'ID {id} non trouvée");

            var children = await _personService.GetChildrenAsync(id);
            var parents = await _personService.GetParentsAsync(id);
            var siblings = await _personService.GetSiblingsAsync(id);

            // Récupérer le conjoint actuel
            PersonDto? spouse = null;
            try
            {
                var spouseResult = await GetCurrentSpouse(id);
                if (spouseResult.Result is OkObjectResult okResult)
                {
                    spouse = okResult.Value as PersonDto;
                }
            }
            catch
            {
                // Pas de conjoint, ce n'est pas grave
            }

            // Calculer les statistiques familiales
            var totalFamilyMembers = 1 + parents.Count() + children.Count() + siblings.Count() + (spouse != null ? 1 : 0);

            var familyData = new FamilyDataDto
            {
                Person = person,
                Parents = parents,
                Children = children,
                Siblings = siblings,
                Spouse = spouse,
                Grandparents = new List<PersonDto>(), // Pas encore implémenté
                Grandchildren = new List<PersonDto>(), // Pas encore implémenté
                TotalFamilyMembers = totalFamilyMembers,
                FamilyStats = new FamilyStatsDto
                {
                    TotalMembers = totalFamilyMembers,
                    ParentsCount = parents.Count(),
                    ChildrenCount = children.Count(),
                    SiblingsCount = siblings.Count(),
                    HasParents = parents.Any(),
                    HasChildren = children.Any(),
                    HasSiblings = siblings.Any(),
                    HasSpouse = spouse != null
                }
            };

            _logger.LogInformation("Arbre familial récupéré pour {PersonName} (ID: {PersonId}) - {TotalMembers} membres",
                person.FullName, id, totalFamilyMembers);

            return Ok(familyData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de l'arbre familial de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Supprime une relation parent-enfant
    /// </summary>
    [HttpDelete("{parentId}/children/{childId}")]
    public async Task<IActionResult> DeleteParentChildRelationship(int parentId, int childId)
    {
        try
        {
            var parentExists = await _unitOfWork.Persons.ExistsAsync(parentId);
            var childExists  = await _unitOfWork.Persons.ExistsAsync(childId);
            if (!parentExists)
                return NotFound($"Parent avec l'ID {parentId} non trouvé");
            if (!childExists)
                return NotFound($"Enfant avec l'ID {childId} non trouvé");

            var relationships = await _unitOfWork.Relationships.GetByPersonIdsAsync(parentId, childId);
            var parentRel = relationships.FirstOrDefault(r =>
                r.Person1Id == parentId && r.Person2Id == childId &&
                r.RelationshipType == RelationshipType.Parent);

            if (parentRel == null)
                return NotFound("Relation parent-enfant introuvable");

            await _unitOfWork.Relationships.DeleteAsync(parentRel.Id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression de la relation parent-enfant");
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Retourne l'arbre généalogique centré sur une personne.
    /// Convention génération : 0 = racine, -1 = parents, -2 = grands-parents, +1 = enfants, +2 = petits-enfants.
    /// </summary>
    /// <param name="id">ID de la personne racine.</param>
    /// <param name="up">Générations d'ascendants (défaut 4, max 8).</param>
    /// <param name="down">Générations de descendants (défaut 2, max 4).</param>
    [HttpGet("{id}/tree")]
    [ProducesResponseType(typeof(PersonTreeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PersonTreeDto>> GetTree(
        int id,
        [FromQuery] int up = 4,
        [FromQuery] int down = 2,
        CancellationToken cancellationToken = default)
    {
        // Clamp des paramètres : on accepte silencieusement les valeurs hors-bornes
        up   = Math.Clamp(up,   0, 8);
        down = Math.Clamp(down, 0, 4);

        try
        {
            var tree = await _treeTraversalService.BuildTreeAsync(id, up, down, cancellationToken);
            if (tree is null)
                return NotFound($"Personne avec l'ID {id} non trouvée");

            _logger.LogInformation(
                "Arbre construit pour la personne {PersonId} — {NodeCount} nœuds (up={Up}, down={Down})",
                id, tree.Nodes.Count, up, down);

            return Ok(tree);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la construction de l'arbre pour la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Retourne les données de la Vue Rivière centrée sur une personne.
    /// Inclut nœuds (avec IsAlive, Gender, PhotoUrl), arêtes Parent et Spouse,
    /// et la plage de générations présentes dans le sous-arbre.
    /// </summary>
    /// <param name="id">ID de la personne racine.</param>
    /// <param name="depth">
    /// Profondeur symétrique (ancêtres et descendants). Défaut 3, max 5.
    /// </param>
    [HttpGet("{id}/river-view")]
    [ProducesResponseType(typeof(RiverViewDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RiverViewDto>> GetRiverView(
        int id,
        [FromQuery] int depth = 3,
        CancellationToken cancellationToken = default)
    {
        depth = Math.Clamp(depth, 1, 5);

        try
        {
            var riverView = await _riverViewService.BuildRiverViewAsync(id, depth, cancellationToken);
            if (riverView is null)
                return NotFound($"Personne avec l'ID {id} non trouvée");

            _logger.LogInformation(
                "Vue Rivière construite pour la personne {PersonId} — {NodeCount} nœuds, {EdgeCount} arêtes (depth={Depth})",
                id, riverView.Nodes.Count, riverView.Edges.Count, depth);

            return Ok(riverView);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la construction de la Vue Rivière pour la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }

    /// <summary>
    /// Supprime une personne
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePerson(int id)
    {
        try
        {
            var deleted = await _personService.DeletePersonAsync(id);
            if (!deleted)
                return NotFound($"Personne avec l'ID {id} non trouvée");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression de la personne {PersonId}", id);
            return StatusCode(500, "Erreur interne du serveur");
        }
    }
}
