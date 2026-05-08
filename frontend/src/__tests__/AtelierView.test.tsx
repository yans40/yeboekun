/**
 * Tests de AtelierView.
 *
 * Stratégie :
 *   - Mock de apiService.getPersons pour contrôler la liste.
 *   - Mock de PersonForm (stub data-testid="person-form-mock") — on ne teste pas
 *     le formulaire ici, seulement l'orchestration de la vue split.
 *   - Mock de react-i18next (t retourne la clé).
 *   - Pas de mock de useFamilyTreeContext : AtelierView gère sa propre liste.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'fr' },
  }),
}));

// PersonForm stubbé — on vérifie uniquement sa présence et sa prop `inline`.
// Note : PersonForm.tsx utilise `export default`, donc le mock doit exposer
// la fonction directement sur la clé `default` de l'objet retourné par jest.mock.
// L'usage de `__esModule: true` + `default` est nécessaire pour les modules ES.
jest.mock('../components/PersonForm', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => (
    <div
      data-testid="person-form-mock"
      data-inline={String(props.inline)}
      data-person-id={props.person?.id ?? 'none'}
      data-title={props.title ?? ''}
    />
  ),
}));

// apiService — mocké pour contrôler les données sans réseau.
jest.mock('../services/api', () => ({
  apiService: {
    getPersons: jest.fn(),
    createPerson: jest.fn(),
    updatePerson: jest.fn(),
    deletePerson: jest.fn(),
    getPersonById: jest.fn(),
    addParentChildRelationship: jest.fn(),
  },
}));

import AtelierView from '../views/AtelierView';
import { apiService } from '../services/api';
import type { Person } from '../types';

// ── Helpers de cast ───────────────────────────────────────────────────────────

const mockGetPersons = apiService.getPersons as jest.MockedFunction<typeof apiService.getPersons>;

// ── Fixtures ──────────────────────────────────────────────────────────────────

/** Fabrique une Person minimale valide. */
function makePerson(id: number, firstName: string, lastName: string): Person {
  return {
    id,
    firstName,
    lastName,
    gender: 'M',
    isAlive: true,
    fullName: `${firstName} ${lastName}`,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
}

const ALICE   = makePerson(1, 'Alice',   'Martin');
const BOB     = makePerson(2, 'Bob',     'Dupont');
const CHARLIE = makePerson(3, 'Charlie', 'Arnaud');

// ── Tests : liste vide ────────────────────────────────────────────────────────

describe('AtelierView — aucune personne dans la liste', () => {
  beforeEach(() => {
    mockGetPersons.mockResolvedValue([]);
  });

  it('affiche le message no-selection après chargement', async () => {
    render(<AtelierView />);
    await waitFor(() => {
      expect(screen.getByTestId('atelier-no-selection')).toBeInTheDocument();
    });
  });

  it('ne rend pas PersonForm si rien n\'est sélectionné', async () => {
    render(<AtelierView />);
    await waitFor(() => screen.getByTestId('atelier-no-selection'));
    expect(screen.queryByTestId('person-form-mock')).not.toBeInTheDocument();
  });
});

// ── Tests : sélection d'une personne ─────────────────────────────────────────

describe('AtelierView — sélection d\'une personne', () => {
  beforeEach(() => {
    mockGetPersons.mockResolvedValue([ALICE, BOB]);
  });

  it('affiche PersonForm inline quand on clique sur un item', async () => {
    render(<AtelierView />);
    // Attendre que la liste soit chargée
    await waitFor(() => screen.getByText('Alice Martin'));
    fireEvent.click(screen.getByText('Alice Martin'));

    expect(screen.getByTestId('person-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('person-form-mock')).toHaveAttribute('data-inline', 'true');
    expect(screen.getByTestId('person-form-mock')).toHaveAttribute('data-person-id', '1');
  });

  it('masque le message no-selection quand une personne est sélectionnée', async () => {
    render(<AtelierView />);
    await waitFor(() => screen.getByText('Alice Martin'));
    fireEvent.click(screen.getByText('Alice Martin'));

    expect(screen.queryByTestId('atelier-no-selection')).not.toBeInTheDocument();
  });
});

// ── Tests : mode création ─────────────────────────────────────────────────────

describe('AtelierView — mode création', () => {
  beforeEach(() => {
    mockGetPersons.mockResolvedValue([ALICE, BOB]);
  });

  it('affiche PersonForm inline en cliquant sur "+ Nouvelle personne"', async () => {
    render(<AtelierView />);
    await waitFor(() => screen.getByText('Alice Martin'));

    // Le bouton contient la clé i18n "atelier.new_person"
    const newBtn = screen.getByText('atelier.new_person');
    fireEvent.click(newBtn);

    expect(screen.getByTestId('person-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('person-form-mock')).toHaveAttribute('data-inline', 'true');
    // En mode création, pas de person passée (data-person-id="none")
    expect(screen.getByTestId('person-form-mock')).toHaveAttribute('data-person-id', 'none');
  });

  it('masque le message no-selection en mode création', async () => {
    render(<AtelierView />);
    await waitFor(() => screen.getByText('Alice Martin'));
    fireEvent.click(screen.getByText('atelier.new_person'));

    expect(screen.queryByTestId('atelier-no-selection')).not.toBeInTheDocument();
  });
});

// ── Tests : tri alphabétique ──────────────────────────────────────────────────

describe('AtelierView — tri alphabétique de la liste', () => {
  beforeEach(() => {
    // Personnes dans l'ordre inverse (Charlie, Bob, Alice) pour vérifier le tri
    mockGetPersons.mockResolvedValue([CHARLIE, BOB, ALICE]);
  });

  it('affiche les personnes triées par lastName dans le DOM', async () => {
    render(<AtelierView />);
    await waitFor(() => screen.getByText('Alice Martin'));

    // Récupérer les items de liste dans l'ordre DOM
    const items = screen.getAllByRole('button', { name: /Martin|Dupont|Arnaud/ });

    // Arnaud < Dupont < Martin (alphabétique)
    expect(items[0]).toHaveTextContent('Charlie Arnaud');
    expect(items[1]).toHaveTextContent('Bob Dupont');
    expect(items[2]).toHaveTextContent('Alice Martin');
  });
});
