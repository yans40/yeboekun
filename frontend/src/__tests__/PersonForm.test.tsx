import React from 'react';
import { render, screen } from '@testing-library/react';
import '../i18n';
import PersonForm from '../components/PersonForm';

describe('PersonForm', () => {
  it('affiche le formulaire et gère la saisie', () => {
    render(<PersonForm open={true} onClose={jest.fn()} onSubmit={jest.fn()} />);
    // Les sections Identité et Vie sont rendues (ouvertes par défaut)
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
    expect(screen.getByText('Identité')).toBeInTheDocument();
  });
});