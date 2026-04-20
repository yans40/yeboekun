import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditModeModal from '../components/EditModeModal';

const onClose = jest.fn();
const onLogin = jest.fn();

const renderModal = (open = true) =>
  render(<EditModeModal open={open} onClose={onClose} onLogin={onLogin} />);

describe('EditModeModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders password field when open', () => {
    renderModal();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderModal(false);
    expect(screen.queryByLabelText(/mot de passe/i)).not.toBeInTheDocument();
  });

  it('calls onLogin with typed password on submit', () => {
    onLogin.mockReturnValue(true);
    renderModal();

    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /connexion/i }));

    expect(onLogin).toHaveBeenCalledWith('secret');
  });

  it('shows error message when onLogin returns false', () => {
    onLogin.mockReturnValue(false);
    renderModal();

    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /connexion/i }));

    expect(screen.getByText(/mot de passe incorrect/i)).toBeInTheDocument();
  });

  it('calls onClose on successful login', () => {
    onLogin.mockReturnValue(true);
    renderModal();

    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /connexion/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on cancel without login', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(onClose).toHaveBeenCalled();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('submits the form when triggered', () => {
    onLogin.mockReturnValue(true);
    renderModal();

    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'secret' } });
    fireEvent.submit(screen.getByRole('button', { name: /connexion/i }).closest('form')!);

    expect(onLogin).toHaveBeenCalledWith('secret');
  });
});
