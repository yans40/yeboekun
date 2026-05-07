import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import RiviereView from '../views/RiviereView';
import { riverViewMock } from '../mocks/riverViewMock';
import type { RiverViewData } from '../types';

// ── Fixtures réduites ─────────────────────────────────────────────────────────

/** Jeu de données minimal : 3 générations, 1 conjoint, 1 enfant. */
const minimalMock: RiverViewData = {
  rootId: 10,
  depth: 2,
  generationRange: { min: -1, max: 1 },
  nodes: [
    // génération -1
    { id: 1, firstName: 'Henri', lastName: 'Morel', birthDate: '1918-09-03', deathDate: '1980-02-14', isAlive: false, gender: 'M', photoUrl: null, generation: -1 },
    { id: 2, firstName: 'Jeanne', lastName: 'Petit', birthDate: '1921-11-28', deathDate: null, isAlive: true, gender: 'F', photoUrl: null, generation: -1 },
    // génération 0 (racine + conjoint)
    { id: 10, firstName: 'Marie', lastName: 'Fontaine', birthDate: '1972-06-15', deathDate: null, isAlive: true, gender: 'F', photoUrl: null, generation: 0 },
    { id: 11, firstName: 'Thomas', lastName: 'Dumont', birthDate: '1970-03-22', deathDate: null, isAlive: true, gender: 'M', photoUrl: null, generation: 0 },
    // génération 1
    { id: 20, firstName: 'Lucas', lastName: 'Dumont', birthDate: '2000-04-12', deathDate: null, isAlive: true, gender: 'M', photoUrl: null, generation: 1 },
  ],
  edges: [
    { sourceId: 1, targetId: 2, type: 'Spouse', startDate: '1945-09-15', endDate: null, isActive: true },
    { sourceId: 1, targetId: 10, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 2, targetId: 10, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 10, targetId: 11, type: 'Spouse', startDate: '1998-09-05', endDate: null, isActive: true },
    { sourceId: 10, targetId: 20, type: 'Parent', startDate: null, endDate: null, isActive: true },
    { sourceId: 11, targetId: 20, type: 'Parent', startDate: null, endDate: null, isActive: true },
  ],
};

// ── Tests : render avec mock complet ─────────────────────────────────────────

describe('RiviereView — render avec riverViewMock', () => {
  it('se monte sans erreur', () => {
    expect(() => render(<RiviereView data={riverViewMock} />)).not.toThrow();
  });

  it('affiche le titre "Vue Rivière"', () => {
    render(<RiviereView data={riverViewMock} />);
    expect(screen.getByText('Vue Rivière')).toBeInTheDocument();
  });

  it("affiche le nombre correct de PersonChip (un par nœud)", () => {
    render(<RiviereView data={riverViewMock} />);
    const chips = screen.getAllByRole('article');
    expect(chips).toHaveLength(riverViewMock.nodes.length);
  });

  it("affiche l'indicateur 'données mockées'", () => {
    render(<RiviereView data={riverViewMock} />);
    expect(screen.getByText(/données mockées/i)).toBeInTheDocument();
  });
});

// ── Tests : groupement par génération ────────────────────────────────────────

describe('RiviereView — groupement par génération', () => {
  it('crée une colonne par génération présente dans generationRange', () => {
    render(<RiviereView data={minimalMock} />);
    // On vérifie les labels des colonnes (aria-label)
    expect(screen.getByLabelText('Génération : Parents')).toBeInTheDocument();
    expect(screen.getByLabelText('Génération : Vous')).toBeInTheDocument();
    expect(screen.getByLabelText('Génération : Enfants')).toBeInTheDocument();
  });

  it('place les nœuds dans les bonnes colonnes', () => {
    render(<RiviereView data={minimalMock} />);

    // Colonne "Parents" doit contenir Henri et Jeanne
    const parentCol = screen.getByLabelText('Génération : Parents');
    expect(within(parentCol).getByText('Henri')).toBeInTheDocument();
    expect(within(parentCol).getByText('Jeanne')).toBeInTheDocument();

    // Colonne "Vous" doit contenir Marie et Thomas
    const rootCol = screen.getByLabelText('Génération : Vous');
    expect(within(rootCol).getByText('Marie')).toBeInTheDocument();
    expect(within(rootCol).getByText('Thomas')).toBeInTheDocument();

    // Colonne "Enfants" doit contenir Lucas
    const childCol = screen.getByLabelText('Génération : Enfants');
    expect(within(childCol).getByText('Lucas')).toBeInTheDocument();
  });

  it('groupe les conjoints dans la même colonne (génération 0)', () => {
    render(<RiviereView data={minimalMock} />);
    const rootCol = screen.getByLabelText('Génération : Vous');
    // Marie et Thomas doivent être tous les deux dans la colonne racine
    const chips = within(rootCol).getAllByRole('article');
    expect(chips).toHaveLength(2);
  });

  it("identifie correctement le nœud racine (isRoot → aria-label 'personne centrale')", () => {
    render(<RiviereView data={minimalMock} />);
    // Seul Marie (id=10=rootId) doit avoir "personne centrale" dans son aria-label
    const rootChip = screen.getByLabelText(/Marie Fontaine.*personne centrale/i);
    expect(rootChip).toBeInTheDocument();
  });

  it('ne double pas un conjoint dans deux groupes différents', () => {
    render(<RiviereView data={minimalMock} />);
    // Thomas ne doit apparaître qu'une fois
    const thomasChips = screen.getAllByRole('article', { name: /Thomas Dumont/i });
    expect(thomasChips).toHaveLength(1);
  });
});

// ── Tests : scroll container ──────────────────────────────────────────────────

describe('RiviereView — scroll', () => {
  it('possède un conteneur de scroll horizontal', () => {
    render(<RiviereView data={minimalMock} />);
    const container = screen.getByTestId('riviere-scroll-container');
    expect(container).toBeInTheDocument();
    // overflowX: auto est défini en inline style
    expect(container).toHaveStyle({ overflowX: 'auto' });
  });
});
