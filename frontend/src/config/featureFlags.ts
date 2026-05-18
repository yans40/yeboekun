/**
 * Feature flags centralisés — tous actifs en production (Lots 2-6 livrés).
 *
 * Convention :
 *   - Défaut true depuis la livraison complète.
 *   - Désactiver explicitement ici si un lot doit être retiré.
 */

/** Vue Rivière (Lot 2) — layout horizontal par génération. */
export const VUE_RIVIERE_ENABLED: boolean = true;

/** Vue Contemplation (Lot 3) — éventail SVG ascendants/descendants. */
export const VUE_CONTEMPLATION_ENABLED: boolean = true;

/** Vue Atelier (Lot 4) — split layout édition de personnes. */
export const VUE_ATELIER_ENABLED: boolean = true;

/** Vue Tableau (Lot 5) — dashboard chiffres clés de l'arbre. */
export const VUE_TABLEAU_ENABLED: boolean = true;

/** Vue Welcome (Lot 6) — nuage de noms interactif post-authentification. */
export const WELCOME_ENABLED: boolean = true;
