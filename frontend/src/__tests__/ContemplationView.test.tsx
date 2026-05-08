/**
 * Tests de ContemplationView.
 *
 * Stratégie :
 *   - Mock de usePersonTree pour contrôler les états loading/error/data.
 *   - Mock de useFamilyTreeContext pour fournir selectedPersonId.
 *   - Mock de react-i18next (t retourne la clé, comportement prévisible).
 *   - FanCanvasV2 est testé via son data-testid, pas par son rendu SVG interne.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mocks ────────────────────────────────────────────────────────────────────

// react-i18next : t retourne la clé, useTranslation ne fait pas de requête réseau.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      // Interpolation simple : remplace {{foo}} par la valeur de opts.foo
      if (!opts) return key;
      return key.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) =>
        opts[k] !== undefined ? String(opts[k]) : `{{${k}}}`,
      );
    },
    i18n: { language: 'fr' },
  }),
}));

// usePersonTree : contrôlé par chaque test via mockReturnValue.
jest.mock('../hooks/usePersonTree', () => ({
  usePersonTree: jest.fn(),
}));

// useFamilyTreeContext : contrôlé par chaque test.
jest.mock('../context/FamilyTreeContext', () => ({
  useFamilyTreeContext: jest.fn(),
}));

import ContemplationView from '../views/ContemplationView';
import { usePersonTree } from '../hooks/usePersonTree';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import type { PersonTreeDto } from '../types';

// ── Helpers de cast ──────────────────────────────────────────────────────────

const mockUsePersonTree   = usePersonTree   as jest.MockedFunction<typeof usePersonTree>;
const mockUseFamilyTreeCtx = useFamilyTreeContext as jest.MockedFunction<typeof useFamilyTreeContext>;

// ── Fixtures ─────────────────────────────────────────────────────────────────

/** Contexte minimal : personne sélectionnée. */
const ctxWithPerson = {
  persons: [],
  selectedPersonId: 42,
  onPersonSelect: jest.fn(),
  canEdit: false,
  onOpenEditModal: jest.fn(),
  onExitEditMode: jest.fn(),
};

/** Contexte sans sélection. */
const ctxNoPerson = {
  ...ctxWithPerson,
  selectedPersonId: null,
};

/** Données d'arbre minimales : ego seul. */
const minimalTree: PersonTreeDto = {
  rootId: 42,
  nodes: [
    {
      id: 42,
      firstName: 'Marie',
      lastName: 'Curie',
      birthDate: '1867-11-07',
      deathDate: '1934-07-04',
      gender: 'F',
      photoUrl: null,
      generation: 0,
      parentIds: [],
      childIds: [],
    },
  ],
};

/** Données avec un parent et un enfant. */
const treeWithRelatives: PersonTreeDto = {
  rootId: 1,
  nodes: [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      birthDate: '1950-03-15',
      deathDate: null,
      gender: 'M',
      photoUrl: null,
      generation: 0,
      parentIds: [2],
      childIds: [3],
    },
    {
      id: 2,
      firstName: 'Pierre',
      lastName: 'Dupont',
      birthDate: '1920-08-22',
      deathDate: '1998-04-10',
      gender: 'M',
      photoUrl: null,
      generation: -1,
      parentIds: [],
      childIds: [1],
    },
    {
      id: 3,
      firstName: 'Sophie',
      lastName: 'Dupont',
      birthDate: '1980-06-30',
      deathDate: null,
      gender: 'F',
      photoUrl: null,
      generation: 1,
      parentIds: [1],
      childIds: [],
    },
  ],
};

// ── Tests : état "pas de sélection" ──────────────────────────────────────────

describe('ContemplationView — aucune personne sélectionnée', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxNoPerson);
    mockUsePersonTree.mockReturnValue({ data: null, loading: false, error: null });
  });

  it('affiche le message de non-sélection', () => {
    render(<ContemplationView />);
    expect(screen.getByTestId('contemplation-no-selection')).toBeInTheDocument();
  });

  it('ne rend pas le canvas éventail', () => {
    render(<ContemplationView />);
    expect(screen.queryByTestId('fan-canvas-v2')).not.toBeInTheDocument();
  });

  it('ne rend pas le spinner de chargement', () => {
    render(<ContemplationView />);
    expect(screen.queryByTestId('contemplation-loading')).not.toBeInTheDocument();
  });
});

// ── Tests : état "chargement" ─────────────────────────────────────────────────

describe('ContemplationView — chargement en cours', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUsePersonTree.mockReturnValue({ data: null, loading: true, error: null });
  });

  it('affiche le spinner de chargement', () => {
    render(<ContemplationView />);
    expect(screen.getByTestId('contemplation-loading')).toBeInTheDocument();
  });

  it('ne rend pas le canvas éventail', () => {
    render(<ContemplationView />);
    expect(screen.queryByTestId('fan-canvas-v2')).not.toBeInTheDocument();
  });
});

// ── Tests : état "erreur" ─────────────────────────────────────────────────────

describe('ContemplationView — erreur API', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUsePersonTree.mockReturnValue({ data: null, loading: false, error: 'Network Error' });
  });

  it("affiche l'indicateur d'erreur", () => {
    render(<ContemplationView />);
    expect(screen.getByTestId('contemplation-error')).toBeInTheDocument();
  });

  it("inclut le message d'erreur dans le DOM", () => {
    render(<ContemplationView />);
    expect(screen.getByTestId('contemplation-error')).toHaveTextContent('Network Error');
  });

  it('ne rend pas le canvas éventail', () => {
    render(<ContemplationView />);
    expect(screen.queryByTestId('fan-canvas-v2')).not.toBeInTheDocument();
  });
});

// ── Tests : état "données chargées" ──────────────────────────────────────────

describe('ContemplationView — données disponibles', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUsePersonTree.mockReturnValue({ data: minimalTree, loading: false, error: null });
  });

  it('rend le canvas éventail', () => {
    render(<ContemplationView />);
    expect(screen.getByTestId('contemplation-view')).toBeInTheDocument();
    expect(screen.getByTestId('fan-canvas-v2')).toBeInTheDocument();
  });

  it('ne rend pas le spinner', () => {
    render(<ContemplationView />);
    expect(screen.queryByTestId('contemplation-loading')).not.toBeInTheDocument();
  });

  it('ne rend pas le message de non-sélection', () => {
    render(<ContemplationView />);
    expect(screen.queryByTestId('contemplation-no-selection')).not.toBeInTheDocument();
  });
});

// ── Tests : appel du hook avec les bons paramètres ───────────────────────────

describe('ContemplationView — appel du hook', () => {
  it('appelle usePersonTree avec selectedPersonId et { up:5, down:2 }', () => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUsePersonTree.mockReturnValue({ data: null, loading: false, error: null });

    render(<ContemplationView />);

    expect(mockUsePersonTree).toHaveBeenCalledWith(42, { up: 5, down: 2 });
  });

  it('appelle usePersonTree avec null quand aucune personne sélectionnée', () => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxNoPerson);
    mockUsePersonTree.mockReturnValue({ data: null, loading: false, error: null });

    render(<ContemplationView />);

    expect(mockUsePersonTree).toHaveBeenCalledWith(null, { up: 5, down: 2 });
  });
});

// ── Tests : arbre avec relations ──────────────────────────────────────────────

describe('ContemplationView — arbre avec ascendants et descendants', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue({ ...ctxWithPerson, selectedPersonId: 1 });
    mockUsePersonTree.mockReturnValue({ data: treeWithRelatives, loading: false, error: null });
  });

  it('se monte sans erreur avec un arbre à 3 nœuds', () => {
    expect(() => render(<ContemplationView />)).not.toThrow();
  });

  it('rend le canvas éventail', () => {
    render(<ContemplationView />);
    expect(screen.getByTestId('fan-canvas-v2')).toBeInTheDocument();
  });
});
