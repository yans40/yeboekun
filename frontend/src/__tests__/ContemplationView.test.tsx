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
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { PersonTreeDto, PersonTreeNodeDto } from '../types';

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

// featureFlags : VUE_CONTEMPLATION_ENABLED=false pour simuler le comportement prod.
jest.mock('../config/featureFlags', () => ({
  VUE_CONTEMPLATION_ENABLED: false,
}));

// FanCanvasV2 : mock léger qui conserve data-testid="fan-canvas-v2" (tests existants)
// ET expose un bouton "trigger-sector-click" pour simuler onSectorClick.
//
// Contrainte Babel-Jest : la factory jest.mock s'exécute dans un scope isolé.
// Seuls les objets de la liste blanche sont accessibles (global, globalThis, require, etc.).
// On évite toute annotation TypeScript dans la factory (Babel les parse aussi).
// La prop onSectorClick est stockée dans global.__mockFanSectorClick (nom autorisé
// car Babel-Jest autorise les accès à `global` dans la factory).
jest.mock('../components/FanCanvasV2', () => {
  const React = require('react');
  return {
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: function MockFanCanvasV2(props) {
      global.__mockFanSectorClick = props.onSectorClick;
      return React.createElement(
        'div',
        { 'data-testid': 'fan-canvas-v2' },
        React.createElement(
          'button',
          {
            'data-testid': 'trigger-sector-click',
            onClick: function () {
              if (global.__mockFanSectorClick) {
                global.__mockFanSectorClick({
                  id: 99,
                  firstName: 'Ancêtre',
                  lastName: 'Test',
                  birthDate: '1900-01-01',
                  deathDate: '1970-06-15',
                  gender: 'M',
                  photoUrl: null,
                  generation: -1,
                  parentIds: [],
                  childIds: [],
                });
              }
            },
          },
          'trigger',
        ),
      );
    },
  };
});

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

// ── Tests : interactions v4 hybride ──────────────────────────────────────────

describe('interactions v4 hybride', () => {
  /**
   * Setup commun : ego id=42 "Marie Curie", avec un nœud ancêtre id=2.
   * Le mock FanCanvasV2 expose un bouton "trigger-sector-click" qui appelle
   * onSectorClick avec { id:99, generation:-1, ... } (nœud différent de l'ego).
   */
  beforeEach(() => {
    mockUseFamilyTreeCtx.mockReturnValue(ctxWithPerson); // selectedPersonId=42
    mockUsePersonTree.mockReturnValue({ data: minimalTree, loading: false, error: null });
  });

  it('focus-bar masquée au départ (max-height 0px)', () => {
    render(<ContemplationView />);
    const bar = screen.getByTestId('contemplation-focus-bar');
    // hasFocus=false au départ : egoId === selectedPersonId
    expect(bar).toHaveStyle('max-height: 0');
  });

  it('focus-bar visible après recentrage sur un ancêtre (max-height 56px)', async () => {
    render(<ContemplationView />);

    // Étape 1 : ouvrir le panneau en simulant un clic secteur
    fireEvent.click(screen.getByTestId('trigger-sector-click'));

    // Étape 2 : cliquer "Faire d'elle le centre" → egoId passe à 99
    const recenterBtn = await screen.findByTestId('contemplation-recenter-btn');
    fireEvent.click(recenterBtn);

    // Maintenant egoId(99) !== selectedPersonId(42) → focus-bar visible
    const bar = screen.getByTestId('contemplation-focus-bar');
    expect(bar).toHaveStyle('max-height: 56px');
  });

  it('bouton retour réinitialise egoId → focus-bar masquée', async () => {
    render(<ContemplationView />);

    // Déclencher recentrage
    fireEvent.click(screen.getByTestId('trigger-sector-click'));
    const recenterBtn = await screen.findByTestId('contemplation-recenter-btn');
    fireEvent.click(recenterBtn);

    // Vérifier que la focus-bar est visible
    expect(screen.getByTestId('contemplation-focus-bar')).toHaveStyle('max-height: 56px');

    // Cliquer retour → egoId revient à selectedPersonId (42)
    fireEvent.click(screen.getByTestId('contemplation-return-btn'));
    expect(screen.getByTestId('contemplation-focus-bar')).toHaveStyle('max-height: 0');
  });

  it('panneau fermé par le bouton ×', async () => {
    render(<ContemplationView />);

    // Ouvrir le panneau
    fireEvent.click(screen.getByTestId('trigger-sector-click'));
    // Le panneau doit être visible (translateX 0 → style transform non-360)
    const panel = screen.getByTestId('contemplation-detail-panel');
    expect(panel).toHaveStyle('transform: translateX(0)');

    // Fermer via ×
    // aria-label utilisé par le mock t() → renvoie la clé "contemplation.panel_close_aria"
    const closeBtn = screen.getByRole('button', { name: 'contemplation.panel_close_aria' });
    fireEvent.click(closeBtn);

    // Panneau retourné à translateX(360px)
    expect(panel).toHaveStyle('transform: translateX(360px)');
  });

  it('panneau fermé par la touche Escape', async () => {
    render(<ContemplationView />);

    // Ouvrir le panneau
    fireEvent.click(screen.getByTestId('trigger-sector-click'));
    const panel = screen.getByTestId('contemplation-detail-panel');
    expect(panel).toHaveStyle('transform: translateX(0)');

    // Déclencher Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Panneau fermé
    expect(panel).toHaveStyle('transform: translateX(360px)');
  });

  it('bouton recentrer absent si selectedNode.id === egoId', async () => {
    // Contexte : l'ego est id=99 (même id que le nœud injecté par trigger-sector-click)
    const treeWithEgo99: PersonTreeDto = {
      rootId: 99,
      nodes: [
        {
          id: 99,
          firstName: 'Ancêtre',
          lastName: 'Test',
          birthDate: '1900-01-01',
          deathDate: '1970-06-15',
          gender: 'M',
          photoUrl: null,
          generation: 0,
          parentIds: [],
          childIds: [],
        },
      ],
    };
    mockUseFamilyTreeCtx.mockReturnValue({ ...ctxWithPerson, selectedPersonId: 99 });
    mockUsePersonTree.mockReturnValue({ data: treeWithEgo99, loading: false, error: null });

    render(<ContemplationView />);

    // Ouvrir le panneau avec le nœud id=99 (même que egoId=99)
    fireEvent.click(screen.getByTestId('trigger-sector-click'));

    // Le bouton recentrer ne doit pas être présent (condition selectedNode.id !== egoId)
    expect(screen.queryByTestId('contemplation-recenter-btn')).not.toBeInTheDocument();
  });
});
