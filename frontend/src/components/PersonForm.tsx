import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { CreatePersonDto, UpdatePersonDto, Person } from '@/types';

interface PersonFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (person: CreatePersonDto | UpdatePersonDto, parentIds?: number[]) => Promise<void>;
  onDelete?: () => Promise<void>;
  person?: Person | null;
  persons?: Person[];   // liste pour les selects père/mère (mode création)
  title?: string;
}

const PersonForm: React.FC<PersonFormProps> = ({
  open,
  onClose,
  onSubmit,
  onDelete,
  person,
  persons = [],
  title = 'Ajouter une personne',
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [parent1Id, setParent1Id] = useState<number | ''>('');
  const [parent2Id, setParent2Id] = useState<number | ''>('');
  const [formData, setFormData] = useState<CreatePersonDto>({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    deathPlace: '',
    photoUrl: '',
    biography: '',
    gender: 'M',
    isAlive: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (person) {
      setFormData({
        firstName: person.firstName,
        lastName: person.lastName,
        middleName: person.middleName || '',
        birthDate: person.birthDate ? person.birthDate.split('T')[0] : '',
        deathDate: person.deathDate ? person.deathDate.split('T')[0] : '',
        birthPlace: person.birthPlace || '',
        deathPlace: person.deathPlace || '',
        photoUrl: person.photoUrl || '',
        biography: person.biography || '',
        gender: person.gender ?? 'M',
        isAlive: person.isAlive,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        birthDate: '',
        deathDate: '',
        birthPlace: '',
        deathPlace: '',
        photoUrl: '',
        biography: '',
        gender: 'M',
        isAlive: true,
      });
    }
    setErrors({});
    setConfirmDelete(false);
    setParent1Id('');
    setParent2Id('');
  }, [person, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (formData.birthDate && formData.deathDate) {
      const birthDate = new Date(formData.birthDate);
      const deathDate = new Date(formData.deathDate);
      if (deathDate <= birthDate) {
        newErrors.deathDate = 'La date de décès doit être postérieure à la date de naissance';
      }
    }

    if (formData.deathDate && formData.isAlive) {
      newErrors.deathDate = 'Une personne vivante ne peut pas avoir de date de décès';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName?.trim() || undefined,
        birthPlace: formData.birthPlace?.trim() || undefined,
        deathPlace: formData.deathPlace?.trim() || undefined,
        photoUrl: formData.photoUrl?.trim() || undefined,
        biography: formData.biography?.trim() || undefined,
        birthDate: formData.birthDate || undefined,
        deathDate: formData.deathDate || undefined,
      };

      const parentIds: number[] = [];
      if (!person) {
        if (parent1Id !== '') parentIds.push(parent1Id as number);
        if (parent2Id !== '') parentIds.push(parent2Id as number);
      }
      await onSubmit(submitData, parentIds.length > 0 ? parentIds : undefined);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreatePersonDto) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom *"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom *"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom de famille"
                value={formData.middleName}
                onChange={handleChange('middleName')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={handleChange('gender')}
                  label="Genre"
                >
                  <MenuItem value="M">Homme</MenuItem>
                  <MenuItem value="F">Femme</MenuItem>
                  <MenuItem value="O">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={formData.birthDate}
                onChange={handleChange('birthDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de décès"
                type="date"
                value={formData.deathDate}
                onChange={handleChange('deathDate')}
                InputLabelProps={{ shrink: true }}
                error={!!errors.deathDate}
                helperText={errors.deathDate}
                disabled={formData.isAlive}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lieu de naissance"
                value={formData.birthPlace}
                onChange={handleChange('birthPlace')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lieu de décès"
                value={formData.deathPlace}
                onChange={handleChange('deathPlace')}
                disabled={formData.isAlive}
              />
            </Grid>

            {/* Père / Mère — mode création uniquement */}
            {!person && persons.length > 0 && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Père (optionnel)</InputLabel>
                    <Select
                      value={parent1Id}
                      onChange={(e) => setParent1Id(e.target.value as number | '')}
                      label="Père (optionnel)"
                    >
                      <MenuItem value=""><em>Aucun</em></MenuItem>
                      {persons
                        .filter(p => p.gender === 'M' || p.gender === 'O' || p.gender === null)
                        .map(p => (
                          <MenuItem key={p.id} value={p.id}>{p.fullName}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Mère (optionnel)</InputLabel>
                    <Select
                      value={parent2Id}
                      onChange={(e) => setParent2Id(e.target.value as number | '')}
                      label="Mère (optionnel)"
                    >
                      <MenuItem value=""><em>Aucune</em></MenuItem>
                      {persons
                        .filter(p => p.gender === 'F' || p.gender === 'O' || p.gender === null)
                        .map(p => (
                          <MenuItem key={p.id} value={p.id}>{p.fullName}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la photo"
                value={formData.photoUrl}
                onChange={handleChange('photoUrl')}
                placeholder="https://example.com/photo.jpg"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biographie"
                multiline
                rows={4}
                value={formData.biography}
                onChange={handleChange('biography')}
                placeholder="Racontez l'histoire de cette personne..."
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAlive}
                    onChange={handleChange('isAlive')}
                    color="primary"
                  />
                }
                label="Personne vivante"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          {/* Delete zone — only in edit mode */}
          <div>
            {person && onDelete && !confirmDelete && (
              <Button
                color="error"
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
              >
                Supprimer
              </Button>
            )}
            {person && onDelete && confirmDelete && (
              <>
                <Button
                  color="error"
                  variant="contained"
                  onClick={async () => { await onDelete(); onClose(); }}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  Confirmer la suppression
                </Button>
                <Button onClick={() => setConfirmDelete(false)} disabled={loading}>
                  Annuler
                </Button>
              </>
            )}
          </div>

          {/* Save / cancel */}
          <div>
            <Button onClick={onClose} disabled={loading} sx={{ mr: 1 }}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PersonForm;
