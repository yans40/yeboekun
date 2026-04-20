import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ open, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const ok = onLogin(password);
    if (ok) {
      setPassword('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Mode édition</DialogTitle>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Mot de passe incorrect
            </Alert>
          )}
          <TextField
            autoFocus
            label="Mot de passe"
            type="password"
            fullWidth
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit" variant="contained">Connexion</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminLoginModal;
