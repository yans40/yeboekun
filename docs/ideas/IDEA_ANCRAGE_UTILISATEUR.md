# Idée à développer — Ancrage de l'utilisateur dans l'arbre

**Statut** : brainstorm posé le 2026-05-03, à reprendre.
**Pour le repo** : à déplacer dans `docs/ideas/IDEA_ANCRAGE_UTILISATEUR.md` puis ajouter au backlog.

---

## L'idée en une ligne

À la première entrée dans Yeboekun, l'app demande *"qui es-tu dans cette famille ?"*. Une fois identifié, la vue par défaut est calée sur la personne — l'utilisateur devient le point d'ancrage de sa propre exploration, puis navigue librement.

## Pourquoi c'est fort

- **Alignement avec le sens du nom** : Yeboekun = *"nous avons un socle commun"*. L'ancrage personnel matérialise ce socle — l'arbre n'est plus un objet d'étude abstrait, c'est ton positionnement dans une lignée.
- **Engagement émotionnel immédiat** : la première vue n'est plus la racine la plus ancienne (souvent vide d'émotion), c'est toi, avec tes proches autour. La motivation pour creuser vient toute seule.
- **Ré-utilisation des données existantes** : la sélection de personne existe déjà via l'AppSidebar / shell-14. C'est une promotion d'un mécanisme existant en geste produit central, pas un développement neuf.

## Questions à trancher (pour la reprise)

### Identification
- **A** — Sélection dans la liste existante des personnes (le plus simple).
- **B** — Recherche libre par nom + autocomplete.
- **C** — Création de soi à la volée si on n'est pas dans l'arbre (le plus engageant mais bloque tant que la personne n'est pas validée par un admin).

### Persistance
- Une fois (cookie/localStorage) puis l'app se rappelle.
- À chaque session (utile si plusieurs utilisateurs partagent un poste).
- Lié à un compte authentifié — dépend de l'existence d'une vraie auth côté backend (à vérifier avec Ada).

### Vue par défaut une fois ancré
- **Lot 1 / 2** : arbre vertical avec l'utilisateur en bas, ascendants au-dessus. Naturel, lecture immédiate, peu de risque.
- **Lot 3+** : éventail centré sur l'utilisateur, ascendants en arc, descendants éventuels en miroir. Plus spectaculaire, plus exigeant techniquement (cf. risque API bidirectionnelle déjà identifié).

### Mode visiteur
Bouton *"ce n'est pas moi"* / *"explorer comme quelqu'un d'autre"* — permettre à un ami, un conjoint, un chercheur de regarder l'arbre depuis le point d'ancrage d'une autre personne sans se substituer à elle. À traiter comme un mode parallèle, pas comme un changement d'identité.

### Sortie de l'ancrage
L'ancrage est un point de départ, pas une prison. Bouton discret *"vue libre"* ou *"recentrer"* pour basculer entre :
- vue ancrée sur soi (par défaut)
- vue libre (pan/zoom partout)
- vue ancrée sur quelqu'un d'autre (mode visiteur)

## Impact sur la roadmap

À placer dans le **Lot 4 — Atelier ou Lot 5 — Tableau** au plus tôt, parce que :
- Le Lot 1 (foundation) ne touche pas la logique de sélection, donc l'ancrage n'a pas sa place là.
- Le Lot 2 (Rivière) et le Lot 3 (Contemplation) ne dépendent pas de l'ancrage personnel.
- Le Lot 5 (Tableau) est l'écran d'accueil naturel — c'est là que la question *"qui es-tu ?"* a le plus de sens à être posée.

Alternative : un **Lot 6 dédié "Ancrage et identité"** entre les Lots 5 et le backlog Album/Pistes. Probablement la bonne option pour ne pas surcharger Tableau.

## Pré-requis backend (à valider avec Ada)

- Existe-t-il une notion d'utilisateur authentifié distinct de l'admin ?
- Si oui, peut-on lier un `User` à un `Person.Id` (auto-référence dans l'arbre) ?
- Si non, c'est un chantier d'auth à part entière (Lot prioritaire avant ancrage).

## Inspirations à creuser

- **23andMe / Ancestry** : ils ancrent sur l'utilisateur par défaut mais leur UX est lourde et payante.
- **Family Search (LDS)** : ancrage explicite dès l'inscription, modèle gratuit.
- **MyHeritage** : la fonction *"vous êtes ici"* sur la carte des origines.

À étudier surtout la **transition de l'ancrage à la navigation libre** — c'est le moment-clé où ces apps perdent souvent l'utilisateur.

## Pour la reprise

1. Re-lire ce fichier.
2. Trancher : **identification A/B/C**, **persistance**, **vue par défaut**.
3. Demander à Ada le pré-requis backend (lien User ↔ Person).
4. Si feu vert, écrire le ticket "Lot 6 — Ancrage de l'utilisateur" et l'ajouter à `IMPLEMENTATION_ROADMAP.md` après le Lot 5.

---

## Cas de l'utilisateur non identifié

Quand l'identification échoue, **ne jamais dire "non identifié" ou "introuvable"** — ces mots cassent la promesse Yeboekun. Reformuler comme une invitation à entrer, pas un échec. Mot-clé : **"pas encore"** (porte un futur, pas une fermeture).

### Principe : trois portes, jamais une seule

1. **Te rattacher à quelqu'un que tu connais** — l'utilisateur choisit un proche connu dans l'arbre, la vue s'ancre sur cette personne. Ancrage par procuration. Probablement la meilleure option pour la majorité des cas (un parent, un cousin, une grand-mère).
2. **Te présenter pour être inscrit** — mini-formulaire (prénom, nom, date approximative, lien supposé), envoyé en demande d'inscription au mainteneur de l'arbre. Acte de présence asynchrone : *je suis là, je veux y être*.
3. **Explorer en visiteur** — mode lecture libre, mais avec un point d'entrée intelligent : la personne la plus connectée, la plus récente, ou la branche la plus profonde — pas la racine vide alphabétique.

### Détail qui change tout

Au-dessus des trois portes, afficher une **mini-galerie de 4-5 visages** (silhouettes anonymisées si pas de photos) avec leurs noms tirés de l'arbre. Texte : *"Voici quelques personnes qui t'attendent peut-être."* L'effet *"je reconnais ce nom !"* transforme l'inconnu en visite émotionnelle dès l'écran d'accueil.

### Pistes de copy à tester

- *"Tu n'apparais pas encore dans cet arbre. Cela peut s'arranger."*
- *"Cet arbre attend ta place. Trois façons d'y entrer :"*
- *"Tu n'es pas (encore) inscrit. Mais l'arbre est ouvert."*

### Anti-patterns à éviter

- Modale plein écran avec mur de texte ("Pour des raisons de sécurité...").
- Bouton "Skip" qui jette dans le vide. Explorer est une porte parmi trois, pas une fuite.
- *"Créer un compte"* à ce stade — c'est une question d'identité familiale, pas d'authentification système. Distinction cruciale.

### Pré-requis fonctionnels

- L'option "Te rattacher" suppose un mode visiteur ancré sur quelqu'un d'autre (déjà mentionné en mode visiteur plus haut). Cohérent.
- L'option "Te présenter" suppose une **file de demandes** côté admin et une notification — chantier backend non négligeable, à cadrer avec Ada.
- L'option "Explorer en visiteur" est triviale techniquement mais demande une heuristique de "personne d'entrée" intelligente.

### Impact roadmap

Cette branche du flux d'ancrage est un **sous-chantier du Lot 6 Ancrage**, à traiter dans la même PR ou la PR suivante. Ne pas livrer Lot 6 sans avoir traité ce cas, sinon on a une UX cassante pour quiconque n'est pas dans la liste.

---

*Idée notée par le PO le 2026-05-03 en fin de session, à reprendre à froid.*
