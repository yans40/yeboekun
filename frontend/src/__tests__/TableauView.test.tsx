/**
 * Tests de TableauView.
 *
 * Stratégie :
 *   - Mock de useStats pour contrôler les états loading/error/data.
 *   - Mock de useFamilyTreeContext pour fournir persons et selectedPersonId.
 *   - Mock de useRecentPersons pour contrôler l'historique récent.
 *   - Mock de react-router-dom (useNavigate) pour vérifier la navigation.
 *   - Mock de react-i18next (t retourne la clé).
 *   - Les composants internes (StatCard, RecentCard, DuplicateAlert) sont testés
 *     via leurs data-testid sans dépendance au rendu SVG interne.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (!opts) return key;
      return key.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) =>
        opts[k] !== undefined ? String(opts[k]) : `{{${k}}}`,
      );
    },
    i18n: { language: 'fr' },
  }),
}));

// useStats : contrôlé par chaque test.
jest.mock('../hooks/useStats', () => ({
  useStats: jest.fn(),
}));

// useRecentPersons : contrôlé par chaque test.
jest.mock('../hooks/useRecentPersons', () => ({
  useRecentPersons: jest.fn(),
}));

// useFamilyTreeContext : contexte minimal fourni par chaque test.
jest.mock('../context/FamilyTreeContext', () => ({
  useFamilyTreeContext: jest.fn(),
}));

// react-router-dom : on ne teste pas la navigation réelle, seulement l'appel.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// ── Imports après mocks ───────────────────────────────────────────────────────

import TableauView from '../views/TableauView';
import { useStats }             from '../hooks/useStats';
import { useRecentPersons }     from '../hooks/useRecentPersons';
import { useFamilyTreeContext }  from '../context/FamilyTreeContext';
import type { StatsDto, RecentPerson } from '../types';

// ── Helpers de cast ───────────────────────────────────────────────────────────

const mockUseStats           = useStats           as jest.MockedFunction<typeof useStats>;
const mockUseRecentPersons   = useRecentPersons   as jest.MockedFunction<typeof useRecentPersons>;
const mockUseFamilyTreeCtx   = useFamilyTreeContext as jest.MockedFunction<typeof useFamilyTreeContext>;

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FULL_STATS: StatsDto = {
  personCount: 13,
  generationSpan: 4,
  livingCount: 4,
  deceasedCount: 9,
  completenessPercent: 85,
  duplicateSuggestionCount: 2,
};

const STATS_NO_DUPLICATES: StatsDto = {
  ...FULL_STATS,
  duplicateSuggestionCount: 0,
};

const STATS_NULL_DUPLICATES: StatsDto = {
  ...FULL_STATS,
  duplicateSuggestionCount: null,
};

const CTX_DEFAULT = {
  persons: [],
  selectedPersonId: null,
  onPersonSelect: jest.fn(),
  canEdit: false,
  onOpenEditModal: jest.fn(),
  onExitEditMode: jest.fn(),
};

const RECENT_EMPTY: RecentPerson[] = [];

const RECENT_TWO: RecentPerson[] = [
  { id: 1, firstName: 'Alice', lastName: 'Martin',  timestamp: 2000 },
  { id: 2, firstName: 'Bob',   lastName: 'Dupont',  timestamp: 1000 },
];

const mockAddRecentPerson   = jest.fn();
const mockClearRecentPersons = jest.fn();

// ── Helper renderDefault ──────────────────────────────────────────────────────

function setupDefaults(
  statsState: { data: StatsDto | null; loading: boolean; error: string | null },
  recentPersons: RecentPerson[] = RECENT_EMPTY,
) {
  mockUseStats.mockReturnValue(statsState);
  mockUseRecentPersons.mockReturnValue({
    recentPersons,
    addRecentPerson:   mockAddRecentPerson,
    clearRecentPersons: mockClearRecentPersons,
  });
  mockUseFamilyTreeCtx.mockReturnValue(CTX_DEFAULT);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockClear();
});

// ── Tests : état "chargement" ─────────────────────────────────────────────────

describe('TableauView — chargement en cours', () => {
  beforeEach(() => {
    setupDefaults({ data: null, loading: true, error: null });
  });

  it('affiche le spinner de chargement', () => {
    render(<TableauView />);
    expect(screen.getByTestId('tableau-loading')).toBeInTheDocument();
  });

  it('ne rend pas la grille principale', () => {
    render(<TableauView />);
    expect(screen.queryByTestId('tableau-view')).not.toBeInTheDocument();
  });
});

// ── Tests : état "erreur" ─────────────────────────────────────────────────────

describe('TableauView — erreur API', () => {
  beforeEach(() => {
    setupDefaults({ data: null, loading: false, error: 'Network Error' });
  });

  it("affiche l'indicateur d'erreur", () => {
    render(<TableauView />);
    expect(screen.getByTestId('tableau-error')).toBeInTheDocument();
  });

  it("inclut le message d'erreur dans le DOM", () => {
    render(<TableauView />);
    expect(screen.getByTestId('tableau-error')).toHaveTextContent('Network Error');
  });

  it('ne rend pas la grille principale', () => {
    render(<TableauView />);
    expect(screen.queryByTestId('tableau-view')).not.toBeInTheDocument();
  });
});

// ── Tests : données disponibles — rendu principal ─────────────────────────────

describe('TableauView — données disponibles', () => {
  beforeEach(() => {
    setupDefaults({ data: FULL_STATS, loading: false, error: null });
  });

  it('rend la vue principale', () => {
    render(<TableauView />);
    expect(screen.getByTestId('tableau-view')).toBeInTheDocument();
  });

  it('rend exactement 4 StatCards', () => {
    render(<TableauView />);
    expect(screen.getAllByTestId('stat-card')).toHaveLength(4);
  });

  it('rend l\'en-tête avec le titre', () => {
    render(<TableauView />);
    expect(screen.getByTestId('tableau-header')).toBeInTheDocument();
    // t('tableau.title') retourne la clé dans le mock
    expect(screen.getByText('tableau.title')).toBeInTheDocument();
  });

  it('ne rend pas le spinner', () => {
    render(<TableauView />);
    expect(screen.queryByTestId('tableau-loading')).not.toBeInTheDocument();
  });

  it('ne rend pas l\'indicateur d\'erreur', () => {
    render(<TableauView />);
    expect(screen.queryByTestId('tableau-error')).not.toBeInTheDocument();
  });
});

// ── Tests : DuplicateAlert ────────────────────────────────────────────────────

describe('TableauView — DuplicateAlert', () => {
  it('affiche DuplicateAlert si duplicateSuggestionCount > 0', () => {
    setupDefaults({ data: FULL_STATS, loading: false, error: null });
    render(<TableauView />);
    expect(screen.getByTestId('duplicate-alert')).toBeInTheDocument();
  });

  it('masque DuplicateAlert si duplicateSuggestionCount === 0', () => {
    setupDefaults({ data: STATS_NO_DUPLICATES, loading: false, error: null });
    render(<TableauView />);
    expect(screen.queryByTestId('duplicate-alert')).not.toBeInTheDocument();
  });

  it('masque DuplicateAlert si duplicateSuggestionCount === null', () => {
    setupDefaults({ data: STATS_NULL_DUPLICATES, loading: false, error: null });
    render(<TableauView />);
    expect(screen.queryByTestId('duplicate-alert')).not.toBeInTheDocument();
  });

  it('inclut le compte dans le texte de l\'alerte', () => {
    setupDefaults({ data: FULL_STATS, loading: false, error: null });
    render(<TableauView />);
    // Le mock t() retourne la clé brute — vérifier la clé dans le rendu.
    const alert = screen.getByTestId('duplicate-alert');
    expect(alert).toHaveTextContent('tableau.duplicate_alert');
  });
});

// ── Tests : RecentCard — liste vide ──────────────────────────────────────────

describe('TableauView — RecentCard liste vide', () => {
  beforeEach(() => {
    setupDefaults({ data: FULL_STATS, loading: false, error: null }, RECENT_EMPTY);
  });

  it('rend RecentCard', () => {
    render(<TableauView />);
    expect(screen.getByTestId('recent-card')).toBeInTheDocument();
  });

  it('affiche le message vide si aucune consultation', () => {
    render(<TableauView />);
    expect(screen.getByTestId('recent-empty')).toBeInTheDocument();
  });

  it('n\'affiche aucun recent-item', () => {
    render(<TableauView />);
    expect(screen.queryAllByTestId('recent-item')).toHaveLength(0);
  });
});

// ── Tests : RecentCard — liste avec 2 personnes ───────────────────────────────

describe('TableauView — RecentCard avec 2 personnes', () => {
  beforeEach(() => {
    setupDefaults({ data: FULL_STATS, loading: false, error: null }, RECENT_TWO);
  });

  it('affiche 2 recent-items', () => {
    render(<TableauView />);
    expect(screen.getAllByTestId('recent-item')).toHaveLength(2);
  });

  it('n\'affiche pas le message vide', () => {
    render(<TableauView />);
    expect(screen.queryByTestId('recent-empty')).not.toBeInTheDocument();
  });

  it('affiche les noms des personnes récentes', () => {
    render(<TableauView />);
    expect(screen.getByText('Alice Martin')).toBeInTheDocument();
    expect(screen.getByText('Bob Dupont')).toBeInTheDocument();
  });
});

// ── Tests : navigation depuis RecentCard ──────────────────────────────────────

describe('TableauView — navigation RecentCard', () => {
  beforeEach(() => {
    setupDefaults({ data: FULL_STATS, loading: false, error: null }, RECENT_TWO);
  });

  it('appelle onPersonSelect et navigate("/") au clic sur un item récent', () => {
    const onPersonSelect = jest.fn();
    mockUseFamilyTreeCtx.mockReturnValue({ ...CTX_DEFAULT, onPersonSelect });

    render(<TableauView />);
    fireEvent.click(screen.getByText('Alice Martin'));

    expect(onPersonSelect).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

// ── Tests : synchronisation selectedPersonId → addRecentPerson ────────────────

describe('TableauView — synchronisation historique récent', () => {
  it('appelle addRecentPerson quand selectedPersonId change vers une personne connue', () => {
    const persons = [
      { id: 42, firstName: 'Marie', lastName: 'Curie', gender: 'F' as const,
        isAlive: false, fullName: 'Marie Curie', createdAt: '', updatedAt: '' },
    ];
    mockUseStats.mockReturnValue({ data: FULL_STATS, loading: false, error: null });
    mockUseRecentPersons.mockReturnValue({
      recentPersons: RECENT_EMPTY,
      addRecentPerson: mockAddRecentPerson,
      clearRecentPersons: mockClearRecentPersons,
    });
    mockUseFamilyTreeCtx.mockReturnValue({
      ...CTX_DEFAULT,
      persons,
      selectedPersonId: 42,
    });

    render(<TableauView />);

    expect(mockAddRecentPerson).toHaveBeenCalledWith({
      id: 42,
      firstName: 'Marie',
      lastName: 'Curie',
    });
  });

  it('n\'appelle pas addRecentPerson si selectedPersonId est null', () => {
    setupDefaults({ data: FULL_STATS, loading: false, error: null });
    // CTX_DEFAULT a selectedPersonId: null
    render(<TableauView />);
    expect(mockAddRecentPerson).not.toHaveBeenCalled();
  });
});
