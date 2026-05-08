/**
 * Feature flags centralisés.
 *
 * Convention :
 *   - Défaut false en production.
 *   - import.meta.env.DEV active les flags "en cours" automatiquement.
 *   - Pour forcer un flag indépendamment de l'env, override ici explicitement.
 */

/** Vue Rivière (Lot 2) — layout horizontal par génération. */
export const VUE_RIVIERE_ENABLED: boolean = import.meta.env.DEV;

/** Vue Contemplation (Lot 3) — éventail SVG ascendants/descendants. */
export const VUE_CONTEMPLATION_ENABLED: boolean = import.meta.env.DEV;

/** Vue Atelier (Lot 4) — split layout édition de personnes. */
export const VUE_ATELIER_ENABLED: boolean = import.meta.env.DEV;
