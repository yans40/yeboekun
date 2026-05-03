import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonChip from '../components/PersonChip';
import type { RiverViewNode } from '../types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const nodeBase: RiverViewNode = {
  id: 10,
  firstName: 'Marie',
  lastName: 'Fontaine',
  birthDate: '1972-06-15',
  deathDate: null,
  isAlive: true,
  gender: 'F',
  photoUrl: null,
  generation: 0,
};

const nodeDecede: RiverViewNode = {
  id: 3,
  firstName: 'Robert',
  lastName: 'Fontaine',
  birthDate: '1920-05-10',
  deathDate: '1995-08-30',
  isAlive: false,
  gender: 'M',
  photoUrl: null,
  generation: -1,
};

const nodeOther: RiverViewNode = {
  id: 99,
  firstName: 'Alex',
  lastName: 'Beauchamp-Delacroix',
  birthDate: null,
  deathDate: null,
  isAlive: true,
  gender: 'Other',
  photoUrl: null,
  generation: 1,
};

// ── Tests : render basique ─────────────────────────────────────────────────────

describe('PersonChip — render basique', () => {
  it('affiche le prénom', () => {
    render(<PersonChip node={nodeBase} />);
    expect(screen.getByText('Marie')).toBeInTheDocument();
  });

  it('affiche le nom de famille', () => {
    render(<PersonChip node={nodeBase} />);
    expect(screen.getByText('Fontaine')).toBeInTheDocument();
  });

  it("affiche l'année de naissance", () => {
    render(<PersonChip node={nodeBase} />);
    expect(screen.getByText(/1972/)).toBeInTheDocument();
  });

  it("affiche ? quand birthDate est null", () => {
    render(<PersonChip node={nodeOther} />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('abrège un nom de famille long (> 10 caractères)', () => {
    render(<PersonChip node={nodeOther} />);
    // "Beauchamp-Delacroix" (19 chars) → slice(0,9) + '.' = "Beauchamp."
    expect(screen.getByText('Beauchamp.')).toBeInTheDocument();
  });

  it("affiche l'année de décès pour une personne décédée", () => {
    render(<PersonChip node={nodeDecede} />);
    expect(screen.getByText(/1920/)).toBeInTheDocument();
    expect(screen.getByText(/1995/)).toBeInTheDocument();
  });
});

// ── Tests : prop isRoot ───────────────────────────────────────────────────────

describe('PersonChip — prop isRoot', () => {
  it("n'applique pas le style racine par défaut", () => {
    render(<PersonChip node={nodeBase} />);
    const article = screen.getByRole('article');
    // L'aria-label ne doit pas contenir "personne centrale" par défaut
    expect(article).not.toHaveAccessibleName(/personne centrale/i);
  });

  it('applique le label "personne centrale" quand isRoot=true', () => {
    render(<PersonChip node={nodeBase} isRoot />);
    const article = screen.getByRole('article');
    expect(article).toHaveAccessibleName(/personne centrale/i);
  });
});

// ── Tests : accessibilité ─────────────────────────────────────────────────────

describe('PersonChip — accessibilité', () => {
  it('possède role="article"', () => {
    render(<PersonChip node={nodeBase} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('possède un aria-label informatif (prénom + nom)', () => {
    render(<PersonChip node={nodeBase} />);
    const article = screen.getByRole('article');
    expect(article).toHaveAccessibleName(/Marie Fontaine/i);
  });

  it("inclut l'année de naissance dans l'aria-label", () => {
    render(<PersonChip node={nodeBase} />);
    expect(screen.getByRole('article')).toHaveAccessibleName(/1972/);
  });

  it("inclut 'décédé' dans l'aria-label pour une personne décédée", () => {
    render(<PersonChip node={nodeDecede} />);
    expect(screen.getByRole('article')).toHaveAccessibleName(/décédé/i);
  });

  it('est focusable et cliquable au clavier (Enter) quand onClick est fourni', () => {
    const handleClick = jest.fn();
    render(<PersonChip node={nodeBase} onClick={handleClick} />);
    const article = screen.getByRole('article');
    article.focus();
    fireEvent.keyDown(article, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith(nodeBase.id);
  });

  it('est focusable et cliquable au clavier (Space) quand onClick est fourni', () => {
    const handleClick = jest.fn();
    render(<PersonChip node={nodeBase} onClick={handleClick} />);
    const article = screen.getByRole('article');
    fireEvent.keyDown(article, { key: ' ' });
    expect(handleClick).toHaveBeenCalledWith(nodeBase.id);
  });

  it('appelle onClick avec le bon id au clic souris', () => {
    const handleClick = jest.fn();
    render(<PersonChip node={nodeBase} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith(nodeBase.id);
  });

  it("n'est pas focusable sans onClick", () => {
    render(<PersonChip node={nodeBase} />);
    const article = screen.getByRole('article');
    expect(article).not.toHaveAttribute('tabindex');
  });
});
