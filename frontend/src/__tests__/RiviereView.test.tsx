import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { language: 'fr' },
  }),
}));

jest.mock('../config/featureFlags', () => ({
  VUE_RIVIERE_ENABLED: false,
}));

jest.mock('../hooks/useRiverView', () => ({
  useRiverView: jest.fn(),
}));

jest.mock('../context/FamilyTreeContext', () => ({
  useFamilyTreeContext: jest.fn(),
}));

import RiviereView from '../views/RiviereView';
import { useRiverView } from '../hooks/useRiverView';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import type { RiverViewData } from '../types';

// ── Helpers de cast ───────────────────────────────────────────────────────────

const mockUseRiverView     = useRiverView     as jest.MockedFunction<typeof useRiverView>;
const mockUseFamilyTreeCtx = useFamilyTreeContext as jest.MockedFunction<typeof useFamilyTreeContext>;

beforeEach(() => {
  mockUseRiverView.mockClear();
  mockUseFamilyTreeCtx.mockClear();
});

// ── Fixtures ──────────────────────────────────────────────────────────────────

const ctxWithPerson = {
  persons: [],
  selectedPersonId: 10,
  onPersonSelect: jest.fn(),
  canEdit: false,
  onOpenEditModal: jest.fn(),
  onExitEditMode: jest.fn(),
};

const ctxNoPerson = { ...ctxWithPerson, selectedPersonId: null };

const minimalMock: RiverViewData = {
  rootId: 10,
  depth: 2,
  generationRange: { min: -1, max: 1 },
  nodes: [
    { id: 1,  firstName: 'Henri',  lastName: 'Morel',    birthDate: '1918-09-03', deathDate: '1980-02-14', isAlive: false, gender: 'M', photoUrl: null, generation: -1 },
    { id: 2,  firstName: 'Jeanne', lastName: 'Petit',    birthDate: '1921-11-28', deathDate: null,         isAlive: true,  gender: 'F', photoUrl: null, generation: -1 },
    { id: 10, firstName: 'Marie',  lastName: 'Fontaine', birthDate: '1972-06-15', deathDate: null,         isAlive: true,  gender: 'F', photoUrl: null, generation:  0 },
    { id: 11, firstName: 'Thomas', lastName: 'Dumont',   birthDate: '1970-03-22', deathDate: null,         isAlive: true,  gender: 'M', photoUrl: null, generation:  0 },
    { id: 20, firstName: 'Lucas',  lastName: 'Dumont',   birthDate: '2000-04-12', deathDate: null,         isAlive: true,  gender: 'M', photoUrl: null, generation:  1 },
  ],
  edges: [
    { sourceId: 1,  targetId: 10, type: 'Parent', startDate: null,         endDate: null, isActive: true },
    { sourceId: 2,  targetId: 10, type: 'Parent', startDate: null,         endDate: null, isActive: true },
    { sourceId: 10, targetId: 11, type: 'Spouse', startDate: '1998-09-05', endDate: null, isActive: true },
    { sourceId: 10, targetId: 20, type: 'Parent', startDate: null,         endDate: null, isActive: true },
    { sourceId: 11, targetId: 20, type: 'Parent', startDate: null,         endDate: null, isActive: true },
  ],
};

// ── Tests : pas de sélection ──────────────────────────────────────────────────

describe('RiviereView — aucune personne sélectionnée', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxNoPerson);
    mockUseRiverView.mockReturnValue({ data: null, loading: false, error: null });
  });

  it('affiche le message de non-sélection', () => {
    render(<RiviereView />);
    expect(screen.getByTestId('riviere-no-selection')).toBeInTheDocument();
  });

  it('ne rend pas le scroll container', () => {
    render(<RiviereView />);
    expect(screen.queryByTestId('riviere-scroll-container')).not.toBeInTheDocument();
  });
});

// ── Tests : chargement ────────────────────────────────────────────────────────

describe('RiviereView — chargement en cours', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUseRiverView.mockReturnValue({ data: null, loading: true, error: null });
  });

  it('affiche le spinner de chargement', () => {
    render(<RiviereView />);
    expect(screen.getByTestId('riviere-loading')).toBeInTheDocument();
  });

  it('ne rend pas le scroll container', () => {
    render(<RiviereView />);
    expect(screen.queryByTestId('riviere-scroll-container')).not.toBeInTheDocument();
  });
});

// ── Tests : erreur API ────────────────────────────────────────────────────────

describe('RiviereView — erreur API', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUseRiverView.mockReturnValue({ data: null, loading: false, error: 'Network Error' });
  });

  it("affiche l'indicateur d'erreur", () => {
    render(<RiviereView />);
    expect(screen.getByTestId('riviere-error')).toBeInTheDocument();
  });

  it("inclut le message d'erreur dans le DOM", () => {
    render(<RiviereView />);
    expect(screen.getByTestId('riviere-error')).toHaveTextContent('Network Error');
  });
});

// ── Tests : données disponibles ───────────────────────────────────────────────

describe('RiviereView — données disponibles', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUseRiverView.mockReturnValue({ data: minimalMock, loading: false, error: null });
  });

  it('se monte sans erreur', () => {
    expect(() => render(<RiviereView />)).not.toThrow();
  });

  it('affiche le conteneur de scroll horizontal', () => {
    render(<RiviereView />);
    expect(screen.getByTestId('riviere-scroll-container')).toBeInTheDocument();
  });

  it('ne rend pas le message de non-sélection', () => {
    render(<RiviereView />);
    expect(screen.queryByTestId('riviere-no-selection')).not.toBeInTheDocument();
  });
});

// ── Tests : groupement par génération ────────────────────────────────────────

describe('RiviereView — groupement par génération', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUseRiverView.mockReturnValue({ data: minimalMock, loading: false, error: null });
  });

  it('crée une colonne par génération présente dans generationRange', () => {
    render(<RiviereView />);
    expect(screen.getByLabelText('Génération : Parents')).toBeInTheDocument();
    expect(screen.getByLabelText('Génération : Vous')).toBeInTheDocument();
    expect(screen.getByLabelText('Génération : Enfants')).toBeInTheDocument();
  });

  it('place les nœuds dans les bonnes colonnes', () => {
    render(<RiviereView />);

    const parentCol = screen.getByLabelText('Génération : Parents');
    expect(within(parentCol).getByText('Henri')).toBeInTheDocument();
    expect(within(parentCol).getByText('Jeanne')).toBeInTheDocument();

    const rootCol = screen.getByLabelText('Génération : Vous');
    expect(within(rootCol).getByText('Marie')).toBeInTheDocument();
    expect(within(rootCol).getByText('Thomas')).toBeInTheDocument();

    const childCol = screen.getByLabelText('Génération : Enfants');
    expect(within(childCol).getByText('Lucas')).toBeInTheDocument();
  });

  it('groupe les conjoints dans la même colonne (génération 0)', () => {
    render(<RiviereView />);
    const rootCol = screen.getByLabelText('Génération : Vous');
    const chips = within(rootCol).getAllByRole('article');
    expect(chips).toHaveLength(2);
  });

  it("identifie correctement le nœud racine (aria-label 'personne centrale')", () => {
    render(<RiviereView />);
    const rootChip = screen.getByLabelText(/Marie Fontaine.*personne centrale/i);
    expect(rootChip).toBeInTheDocument();
  });

  it('ne double pas un conjoint dans deux colonnes différentes', () => {
    render(<RiviereView />);
    const thomasChips = screen.getAllByRole('article', { name: /Thomas Dumont/i });
    expect(thomasChips).toHaveLength(1);
  });
});

// ── Tests : scroll container ──────────────────────────────────────────────────

describe('RiviereView — scroll', () => {
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUseRiverView.mockReturnValue({ data: minimalMock, loading: false, error: null });
  });

  it('possède un conteneur de scroll horizontal', () => {
    render(<RiviereView />);
    const container = screen.getByTestId('riviere-scroll-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle({ overflowX: 'auto' });
  });
});

// ── Tests : appel du hook ─────────────────────────────────────────────────────

describe('RiviereView — appel du hook', () => {
  it('appelle useRiverView avec selectedPersonId', () => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson);
    mockUseRiverView.mockReturnValue({ data: null, loading: false, error: null });

    render(<RiviereView />);

    expect(mockUseRiverView).toHaveBeenCalledWith(10);
  });

  it('appelle useRiverView avec null quand aucune personne sélectionnée', () => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxNoPerson);
    mockUseRiverView.mockReturnValue({ data: null, loading: false, error: null });

    render(<RiviereView />);

    expect(mockUseRiverView).toHaveBeenCalledWith(null);
  });
});
