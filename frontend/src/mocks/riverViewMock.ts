/**
 * Données mockées pour la Vue Rivière.
 *
 * Arbre centré sur Marie FONTAINE (id 10, generation 0).
 *
 * Générations :
 *   -2 : arrière-grands-parents (1 couple côté paternel, branche asymétrique)
 *   -1 : grands-parents (2 couples)
 *    0 : Marie FONTAINE (racine) + conjoint Thomas DUMONT
 *   +1 : enfants (2)
 *
 * Branches intentionnellement asymétriques :
 *   - côté paternel remonte à génération -2
 *   - côté maternel s'arrête à génération -1
 *   - seul un enfant est marié (conjoint dans génération +1)
 */

import type { RiverViewData } from '../types';

export const riverViewMock: RiverViewData = {
  rootId: 10,
  depth: 3,
  generationRange: { min: -2, max: 1 },

  nodes: [
    // ── Génération -2 (arrière-grands-parents paternels) ─────────────────────
    {
      id: 1,
      firstName: 'Édouard',
      lastName: 'Fontaine',
      birthDate: '1890-03-14',
      deathDate: '1968-11-02',
      isAlive: false,
      gender: 'M',
      photoUrl: null,
      generation: -2,
    },
    {
      id: 2,
      firstName: 'Hortense',
      lastName: 'Marchand',
      birthDate: '1895-07-22',
      deathDate: '1972-04-18',
      isAlive: false,
      gender: 'F',
      photoUrl: null,
      generation: -2,
    },

    // ── Génération -1 (grands-parents) ────────────────────────────────────────
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Fontaine',
      birthDate: '1920-05-10',
      deathDate: '1995-08-30',
      isAlive: false,
      gender: 'M',
      photoUrl: null,
      generation: -1,
    },
    {
      id: 4,
      firstName: 'Suzanne',
      lastName: 'Leroy',
      birthDate: '1923-01-15',
      deathDate: '2001-12-05',
      isAlive: false,
      gender: 'F',
      photoUrl: null,
      generation: -1,
    },
    // Grands-parents maternels (branche courte — pas de génération -2)
    {
      id: 5,
      firstName: 'Henri',
      lastName: 'Morel',
      birthDate: '1918-09-03',
      deathDate: '1980-02-14',
      isAlive: false,
      gender: 'M',
      photoUrl: null,
      generation: -1,
    },
    {
      id: 6,
      firstName: 'Jeanne',
      lastName: 'Petit',
      birthDate: '1921-11-28',
      deathDate: null,
      isAlive: true,
      gender: 'F',
      photoUrl: null,
      generation: -1,
    },

    // ── Génération 0 (racine + conjoint) ─────────────────────────────────────
    {
      id: 10,
      firstName: 'Marie',
      lastName: 'Fontaine',
      birthDate: '1972-06-15',
      deathDate: null,
      isAlive: true,
      gender: 'F',
      photoUrl: null,
      generation: 0,
    },
    {
      id: 11,
      firstName: 'Thomas',
      lastName: 'Dumont',
      birthDate: '1970-03-22',
      deathDate: null,
      isAlive: true,
      gender: 'M',
      photoUrl: null,
      generation: 0,
    },
    // Sœur de Marie (même génération, branche asymétrique)
    {
      id: 12,
      firstName: 'Claire',
      lastName: 'Fontaine',
      birthDate: '1975-09-08',
      deathDate: null,
      isAlive: true,
      gender: 'F',
      photoUrl: null,
      generation: 0,
    },

    // ── Génération +1 (enfants) ───────────────────────────────────────────────
    {
      id: 20,
      firstName: 'Lucas',
      lastName: 'Dumont',
      birthDate: '2000-04-12',
      deathDate: null,
      isAlive: true,
      gender: 'M',
      photoUrl: null,
      generation: 1,
    },
    {
      id: 21,
      firstName: 'Camille',
      lastName: 'Dumont',
      birthDate: '2003-07-19',
      deathDate: null,
      isAlive: true,
      gender: 'F',
      photoUrl: null,
      generation: 1,
    },
  ],

  edges: [
    // Arrière-grands-parents → grand-père paternel
    { sourceId: 1, targetId: 3, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 2, targetId: 3, type: 'Parent', startDate: null, endDate: null, isActive: true },
    // Mariage arrière-grands-parents
    { sourceId: 1, targetId: 2, type: 'Spouse', startDate: '1917-06-10', endDate: null, isActive: true },

    // Mariage grands-parents paternels
    { sourceId: 3, targetId: 4, type: 'Spouse', startDate: '1948-05-20', endDate: null, isActive: true },
    // Mariage grands-parents maternels
    { sourceId: 5, targetId: 6, type: 'Spouse', startDate: '1945-09-15', endDate: null, isActive: true },

    // Parents de Marie (père issu de Robert+Suzanne, mère de Henri+Jeanne)
    // On simplifie : Robert et Suzanne sont les parents paternels (père non représenté — branche condensée)
    // On représente directement : Robert→Marie, Suzanne→Marie, Henri→Marie, Jeanne→Marie
    { sourceId: 3, targetId: 10, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 4, targetId: 10, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 5, targetId: 12, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 6, targetId: 12, type: 'Parent', startDate: null, endDate: null, isActive: true },

    // Fratrie
    { sourceId: 10, targetId: 12, type: 'Sibling', startDate: null, endDate: null, isActive: true },

    // Mariage Marie + Thomas
    { sourceId: 10, targetId: 11, type: 'Spouse', startDate: '1998-09-05', endDate: null, isActive: true },

    // Enfants de Marie + Thomas
    { sourceId: 10, targetId: 20, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 11, targetId: 20, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 10, targetId: 21, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 11, targetId: 21, type: 'Parent', startDate: null, endDate: null, isActive: true },
  ],
};
