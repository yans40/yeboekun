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
