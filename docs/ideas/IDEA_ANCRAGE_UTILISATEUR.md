# Idée à développer — Ancrage de l'utilisateur dans l'arbre

**Statut** : cadrage produit — brainstorm 2026-05-03, **cadrage 2026-05-08**, **flux d’entrée acté 2026-05-09**, **priorisation Gate vs nuage actée 2026-05-09**, **densité nuage renforcée (PO) 2026-05-09**.
**Emplacement** : `docs/ideas/IDEA_ANCRAGE_UTILISATEUR.md` (source de vérité idée).
**Suite** : après validation PO — ajouter **Lot 6 — Ancrage et identité** dans `docs/roadmap/IMPLEMENTATION_ROADMAP.md` (après Lot 5), puis ticket GitHub / QA Lot 6.

---

## Décision produit — Flux d’entrée (2026-05-09) — **actée**

Le **gate** (mot de passe famille / seuil technique) est **court** : pas de paragraphes sur la page pour les **retours** (~90 % du trafic avec cookie valide — ils ne revoient pas l’écran). Le **discours** d’invitation (« demande à un proche », etc.) appartient à **l’onboarding hors ligne** (SMS, mail, conversation), pas au mur de la page d’entrée.

### Gate — 5 éléments visibles

1. Wordmark Yeboekun (Y Sankofa)  
2. Tagline : *La mémoire des liens*  
3. Headline unique : *Cet arbre vous attend* (seul ton narratif court sur cette vue)  
4. Champ *Mot de passe familial*  
5. Bouton *Continuer*  

En bas : lien **très discret** (`ink4`) *« ? Besoin du mot de passe »* → ouvre une **couche d’aide** (dialog) pour les **rares** premiers visiteurs — sans polluer la lecture courante.

### Après auth OK (parcours à construire — Lot 6 / onboarding in-app)

Ce n’est **pas** sur le gate : écran d’accueil *« Qui es-tu ? »*, **trois portes** (te rattacher, te présenter, explorer visiteur), mini-galerie, copy type *« Cet arbre attend ta place »*. **Skip** si utilisateur déjà identifié (retour).

Schéma cible :

```
Gate (5 éléments) → Auth OK → Accueil ancrage (qui es-tu ? / 3 portes) → Vue principale ancrée
                                      ↑
                         skip si retour + déjà identifié
```

### Technique vs UX

Le choix **mot de passe partagé** vs **auth nominative** (Ada / backend) **ne bloque pas** cette spec UX : le gate reste un **seuil** ; la narration riche vit **après** le seuil.

---

## Priorisation Gate vs nuage interactif (2026-05-09) — **actée**

**Décision PO** : prioriser la **deuxième option** — livrer le **gate sobre** tôt (enveloppe **~3 jours max** pour la couche seuil ; déjà engagé côté produit), continuer **Lots 1–5** normalement sans bloquer la roadmap UI ; le **nuage de noms** (interaction riche post-auth) est **Lot 6** avec le temps qu’il mérite.

**Alternative non retenue pour l’instant** : un seul mega-lot « tout-en-un » (gate + nuage + ancrage + fallback non identifié) — **cohérent narrativement** mais **risque de qualité** sur le nuage sous pression.

---

## Nuage de noms interactif — note technique & UX (cible **Lot 6**)

Interaction **post-seuil**, distincte du gate. Mérite une enveloppe dédiée ; ne pas la fusionner précipitamment avec Foundation.

### Faisabilité technique

- **Stack** : React + **Framer Motion** (compatible MUI) **ou** variante plus légère : CSS + **custom properties** `--mouse-x` / `--mouse-y` mises à jour en JS ; chaque nom réagit via proximité (`calc`, distance).
- **Perf** : acceptable jusqu’à **~100** noms en **rendu naïf** ; au-delà → **virtualisation** ou **culling** (n’afficher que les plus proches d’un ego putatif). Voir **densité** ci-dessous : la cible produit peut **forcer** ces techniques plus tôt.

### Densité des noms — préférence PO (**plus dense**, 2026-05-09)

Le nuage post-auth ne doit **pas** rester clairsemé : il faut **davantage de noms visibles en même temps** pour que la scène paraisse vivante et « famille », pas trois étiquettes isolées.

**Conséquences Lot 6 (à budget dans l’enveloppe)** :

| Levier | Détail |
|--------|--------|
| **Visuel** | Tailles de base **plus petites**, **chevauchements légers** acceptés (la lecture se fait par **illumination au curseur** / focus), éventuellement **strates** (profondeur, flou, opacité décroissante) pour **tasser** sans bouillir la carte. |
| **Perf** | Dès que le nombre de candidats dépasse la zone confortable en brute force, **culling + virtualisation** = **chemin par défaut** (viewport + marge, anneaux autour de l’ego putatif, ou fenêtre glissante). |
| **Qualité** | Éviter la bouillie : hiérarchie (proches plus nets), **pas** multiplication aveugle si ça casse la lisibilité — la densité est un **objectif**, pas une overdose au pixel près. |
| **Mobile** | Si la densité desktop ne tient pas : **grille** plus fournie, ou **liste complémentaire** au nuage pour ne pas sacrifier le touch. |

### Trois risques à anticiper

| Risque | Mitigation |
|--------|------------|
| **Discoverabilité** (sans mouvement souris, rien ne bouge) | Hint subtil sous le titre du type *« Promenez le regard pour reconnaître les visages »*, ou **drift ambient** ultra-lent signalant que la scène est « vivante ». |
| **Accessibilité** (hover = exclusion) | Navigation **Tab** (focus nom à nom), respect **`prefers-reduced-motion`**, pas seulement la souris. |
| **Mobile** (pas de hover) | **Grille calme** ou **spotlight au touch** (le doigt comme curseur). |

### Direction Yeboekun (ton)

- Noms en **Cormorant Italic**, **opacity** base ~**0.4** (`ink4`), tailles **variées** (hiérarchie + **densité** : les plus petits permettent de **remplir** la toile sans tout égaler).
- **Drift ambient** très lent (ordre **1–2 px/s**), opacity qui oscille doucement — *poussières d’étoiles*, pas confettis.
- **Titre fixe** au centre : *« Qui voulez-vous retrouver ? »* en serif large.
- **Proximité curseur** (&lt; **100 px**) : le nom **s’illumine** (opacity **1**, `ink`), **micro-italique** à côté (*« votre tante ? »*, *« votre cousin germain ? »* — relation dérivée d’un ego putatif).
- **Clic** sur un nom → mini-menu : *« C’est moi »* / *« Le voir dans l’arbre »* / *« Je le connais, ancrez-moi près de lui »*.
- **Skip** discret en bas : *« Je préfère explorer librement »*.

---

## Cadrage proposé (2026-05-08) — à valider par le PO

Objectif : donner des **défauts** pour débloquer l’écriture du Lot 6 sans rouvrir les décisions déjà actées (ex. shell-14 = sélecteur personne dans la TopBar).

### Prérequis backend (état repo au 2026-05-08)

- Aucune couche **auth utilisateur** (ASP.NET Identity / `User` métier) repérée dans le backend actuel.
- **Conséquence** : l’ancrage **V1** doit reposer sur **persistance navigateur** (`localStorage` ou `sessionStorage`) + éventuel **mode « cette session seulement »** pour poste partagé. Le lien **User ↔ Person** reste un **V2** dépendant d’un chantier auth.

### Décisions recommandées (proposition)

| Thème | Proposition | Notes |
|--------|-------------|--------|
| **Identification** | **A** en V1 (liste / sélecteur existant), **B** en V1.5 ou V2 (recherche + autocomplete), **C** (« créer / se présenter ») en **sous-lot** après file admin + notifications | A réutilise shell-14 ; C aligné sur la section « utilisateur non identifié » |
| **Persistance** | `localStorage` pour ancrage stable + entrée **« oublier sur cet appareil »** + option **session seulement** | Jusqu’à auth serveur |
| **Vue par défaut une fois ancré** | **Arbre vertical** centré sur la personne ancrée (Lots 1–2) ; **éventail** centré sur l’utilisateur en **Lot 3+** quand la perf / API le permettent | Cohérent avec la roadmap actuelle |
| **Point d’entrée produit** | Écran **Tableau** (`/tableau`) ou **première visite** globale : question *« Qui es-tu dans cette famille ? »* | Tableau = accueil naturel (déjà noté dans l’idée initiale) |
| **Mode visiteur + sortie** | Conserver les principes déjà rédigés : *« ce n’est pas moi »*, *vue libre*, ancrage réversible | Pas une identité système |

### Critères d’acceptation Lot 6 (brouillon)

1. **Nuage** : **densité élevée** de noms simultanés (cf. *Densité des noms*) — rendu **peuplé** sur desktop, pas un nuage à trois étiquettes.
2. **Première visite** : si aucun ancrage stocké, l’utilisateur voit un flux d’accueil (pas un message d’échec) menant à la sélection d’une personne ou aux trois portes (voir section *non identifié*).
3. **Visite suivante** : restauration de l’ancrage depuis le stockage choisi ; possibilité de **changer** / **effacer** l’ancrage.
4. **Utilisateur absent de l’arbre** : copy **« pas encore »** ; les trois portes accessibles ; aucun libellé type *introuvable* / *non identifié*.
5. **Non-régression** : navigation existante (shell, arbre, admin) inchangée pour qui ignore l’ancrage ou choisit *vue libre*.
6. **Auth V2** (hors scope Lot 6 minimal si non prêt) : synchronisation serveur du lien User ↔ Person documentée en dette / Lot futur.

### Ordre de travail suggéré (quand le Lot 6 sera planifié)

1. UX + copy : flux première visite + trois portes + mini-galerie.
2. Front : persistance clé(s), intégration sélecteur / routing « personne par défaut ».
3. Back (si **Te présenter**) : file de demandes + notification admin — **sous-PR** si trop lourd.
4. Heuristique « personne d’entrée » pour explorateur sans ancrage (stats / profondeur / récence — à trancher avec les données disponibles).

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
