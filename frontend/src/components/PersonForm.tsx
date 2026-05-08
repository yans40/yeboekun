import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { CreatePersonDto, UpdatePersonDto, Person } from '@/types';
import { apiService } from '@/services/api';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

// ─── NativeSelect ─────────────────────────────────────────────────────────────
interface NativeSelectProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
  children: React.ReactNode;
}
const NativeSelect: React.FC<NativeSelectProps> = ({ label, value, onChange, disabled, size = 'medium', children }) => {
  const isSmall = size === 'small';
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <label style={{
        display: 'block',
        marginBottom: 4,
        fontFamily: fonts.sans,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 500,
        color: colors.ink3,
        letterSpacing: '0.03em',
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '100%',
          padding: isSmall ? '5px 28px 5px 8px' : '10px 32px 10px 12px',
          fontFamily: fonts.sans,
          fontSize: isSmall ? 13 : 14,
          color: disabled ? colors.ink4 : colors.ink,
          backgroundColor: disabled ? colors.paper2 : colors.cream,
          border: `1px solid ${colors.line}`,
          borderRadius: radius.sm,
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          lineHeight: 1.5,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </select>
      {/* Chevron */}
      <span style={{
        position: 'absolute',
        right: isSmall ? 8 : 10,
        bottom: isSmall ? 6 : 11,
        pointerEvents: 'none',
        color: colors.ink3,
        fontSize: 10,
        lineHeight: 1,
      }}>▾</span>
    </div>
  );
};

interface PersonFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (person: CreatePersonDto | UpdatePersonDto, parentIds?: number[]) => Promise<void>;
  onDelete?: () => Promise<void>;
  person?: Person | null;
  persons?: Person[];   // liste pour les selects père/mère (mode création)
  title?: string;
}

// ─── NativeButton ─────────────────────────────────────────────────────────────

type BtnVariant = 'contained' | 'outlined' | 'text';

interface NativeBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  color?: 'primary' | 'error';
  size?: 'small' | 'medium';
}

const NativeBtn: React.FC<NativeBtnProps> = ({ variant = 'text', color = 'primary', size = 'medium', style, children, ...rest }) => {
  const accent = color === 'error' ? colors.rust : colors.ocean;
  const isSmall = size === 'small';

  const base: React.CSSProperties = {
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        isSmall ? `${spacing[1]}px ${spacing[2]}px` : `${spacing[2]}px ${spacing[4]}px`,
    fontFamily:     fonts.sans,
    fontSize:       isSmall ? 12 : 14,
    fontWeight:     500,
    borderRadius:   radius.sm,
    cursor:         'pointer',
    transition:     'background 150ms ease, opacity 150ms ease',
    lineHeight:     1.5,
    whiteSpace:     'nowrap',
  };

  const variants: Record<BtnVariant, React.CSSProperties> = {
    contained: { backgroundColor: accent, color: colors.cream, border: 'none' },
    outlined:  { backgroundColor: 'transparent', color: accent, border: `1px solid ${accent}` },
    text:      { backgroundColor: 'transparent', color: accent, border: 'none' },
  };

  const disabledStyle: React.CSSProperties = rest.disabled
    ? { opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' }
    : {};

  return (
    <button {...rest} style={{ ...base, ...variants[variant], ...disabledStyle, ...style }}>
      {children}
    </button>
  );
};

// ─── Sous-composants natifs ───────────────────────────────────────────────────

/** Remplace MUI Alert severity="error" */
const NativeAlert: React.FC<{ children: React.ReactNode; onClose?: () => void }> = ({ children, onClose }) => (
  <div
    role="alert"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing[2],
      padding: `${spacing[2]}px ${spacing[3]}px`,
      backgroundColor: '#fef2f2',
      border: `1px solid ${colors.rust}`,
      borderRadius: radius.md,
      color: colors.rust,
      fontFamily: fonts.sans,
      fontSize: 14,
    }}
  >
    <span style={{ fontWeight: 700, flexShrink: 0 }}>✕</span>
    <span style={{ flex: 1 }}>{children}</span>
    {onClose && (
      <button
        onClick={onClose}
        aria-label="Fermer"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: colors.rust,
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
          opacity: 0.7,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    )}
  </div>
);

/** Remplace MUI Chip avec onDelete */
interface NativeChipProps {
  label: string;
  onDelete?: () => void;
  colorVariant?: 'primary' | 'secondary';
}
const NativeChip: React.FC<NativeChipProps> = ({ label, onDelete, colorVariant = 'primary' }) => {
  const borderColor = colorVariant === 'secondary' ? colors.sepiaLt : colors.ocean;
  const textColor   = colorVariant === 'secondary' ? colors.sepia   : colors.ocean;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[1],
        padding: `2px ${spacing[2]}px`,
        border: `1px solid ${borderColor}`,
        borderRadius: radius.pill,
        fontSize: 12,
        fontFamily: fonts.sans,
        color: textColor,
        backgroundColor: 'transparent',
        lineHeight: '20px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {onDelete && (
        <button
          onClick={onDelete}
          aria-label={`Supprimer ${label}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: textColor,
            fontSize: 14,
            lineHeight: 1,
            padding: 0,
            opacity: 0.7,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
};

/** Remplace MUI Switch */
const NativeSwitch: React.FC<{
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  label: string;
}> = ({ checked, onChange, id, label }) => (
  <label
    htmlFor={id}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing[2],
      cursor: 'pointer',
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.ink2,
      userSelect: 'none',
    }}
  >
    <span
      style={{
        position: 'relative',
        width: 36,
        height: 20,
        display: 'inline-block',
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
      />
      {/* Track */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius.pill,
          backgroundColor: checked ? colors.ocean : colors.line,
          transition: 'background-color 200ms ease',
        }}
      />
      {/* Thumb */}
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          transition: 'left 200ms ease',
        }}
      />
    </span>
    {label}
  </label>
);

// ─── PersonForm ───────────────────────────────────────────────────────────────

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

  // État mode édition — relations existantes
  const [currentParents, setCurrentParents] = useState<Person[]>([]);
  const [currentChildren, setCurrentChildren] = useState<Person[]>([]);
  const [newParentId, setNewParentId] = useState<number | ''>('');
  const [newChildId, setNewChildId] = useState<number | ''>('');

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
  const [relationError, setRelationError] = useState<string | null>(null);

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
    setRelationError(null);
    setConfirmDelete(false);
    setParent1Id('');
    setParent2Id('');
    setNewParentId('');
    setNewChildId('');
    setCurrentParents([]);
    setCurrentChildren([]);

    if (!person) return;
    let cancelled = false;
    apiService.getParents(person.id)
      .then(r => { if (!cancelled) setCurrentParents(r); })
      .catch(() => {});
    apiService.getChildren(person.id)
      .then(r => { if (!cancelled) setCurrentChildren(r); })
      .catch(() => {});
    return () => { cancelled = true; };
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

  const handleAddParent = async () => {
    if (!person || newParentId === '') return;
    setRelationError(null);
    try {
      await apiService.addParentChildRelationship(newParentId as number, person.id);
      const added = persons.find(p => p.id === newParentId);
      if (added) setCurrentParents(prev => [...prev, added]);
      setNewParentId('');
    } catch {
      setRelationError('Impossible d\'ajouter ce parent. La relation existe peut-être déjà.');
    }
  };

  const handleRemoveParent = async (parentId: number) => {
    if (!person) return;
    setRelationError(null);
    try {
      await apiService.deleteParentChildRelationship(parentId, person.id);
      setCurrentParents(prev => prev.filter(p => p.id !== parentId));
    } catch {
      setRelationError('Impossible de supprimer ce parent.');
    }
  };

  const handleAddChild = async () => {
    if (!person || newChildId === '') return;
    setRelationError(null);
    try {
      await apiService.addParentChildRelationship(person.id, newChildId as number);
      const added = persons.find(p => p.id === newChildId);
      if (added) setCurrentChildren(prev => [...prev, added]);
      setNewChildId('');
    } catch {
      setRelationError('Impossible d\'ajouter cet enfant. La relation existe peut-être déjà.');
    }
  };

  const handleRemoveChild = async (childId: number) => {
    if (!person) return;
    setRelationError(null);
    try {
      await apiService.deleteParentChildRelationship(person.id, childId);
      setCurrentChildren(prev => prev.filter(c => c.id !== childId));
    } catch {
      setRelationError('Impossible de supprimer cet enfant.');
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
      <DialogTitle component="div">
        <h6 style={{ margin: 0, fontFamily: fonts.serif, fontWeight: 600, fontSize: '1.25rem', color: colors.ink }}>
          {title}
        </h6>
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
              <NativeSelect
                label="Genre"
                value={formData.gender}
                onChange={handleChange('gender') as any}
              >
                <option value="M">Homme</option>
                <option value="F">Femme</option>
                <option value="O">Autre</option>
              </NativeSelect>
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
                  <NativeSelect
                    label="Père (optionnel)"
                    value={parent1Id}
                    onChange={(e) => setParent1Id(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">Aucun</option>
                    {persons
                      .filter(p => p.gender === 'M' || p.gender === 'O' || p.gender === null)
                      .map(p => (
                        <option key={p.id} value={p.id}>{p.fullName}</option>
                      ))}
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NativeSelect
                    label="Mère (optionnel)"
                    value={parent2Id}
                    onChange={(e) => setParent2Id(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">Aucune</option>
                    {persons
                      .filter(p => p.gender === 'F' || p.gender === 'O' || p.gender === null)
                      .map(p => (
                        <option key={p.id} value={p.id}>{p.fullName}</option>
                      ))}
                  </NativeSelect>
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
              {/* Remplace MUI FormControlLabel + Switch */}
              <NativeSwitch
                id="isAlive-switch"
                checked={formData.isAlive}
                onChange={handleChange('isAlive')}
                label="Personne vivante"
              />
            </Grid>

            {/* Relations familiales — mode édition */}
            {person && persons.length > 0 && (
              <>
                {relationError && (
                  <Grid item xs={12}>
                    <NativeAlert onClose={() => setRelationError(null)}>
                      {relationError}
                    </NativeAlert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  {/* Remplace MUI Typography subtitle2 */}
                  <p style={{
                    margin: `0 0 ${spacing[1]}px`,
                    fontFamily: fonts.sans,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: colors.ink3,
                  }}>
                    Parents
                  </p>
                  {/* Remplace MUI Typography caption */}
                  <span style={{
                    display: 'block',
                    marginBottom: spacing[2],
                    fontFamily: fonts.sans,
                    fontSize: '0.75rem',
                    color: colors.ink4,
                  }}>
                    Les ajouts et suppressions sont enregistrés immédiatement.
                  </span>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {currentParents.length === 0 && (
                      <span style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.ink4 }}>
                        Aucun parent enregistré
                      </span>
                    )}
                    {[...currentParents]
                      .sort((a, b) => {
                        const order = (g: string | null) => g === 'M' ? 0 : g === 'F' ? 1 : 2;
                        return order(a.gender) - order(b.gender);
                      })
                      .map(p => {
                        const parentLabel = p.gender === 'M' ? 'Père' : p.gender === 'F' ? 'Mère' : 'Parent';
                        return (
                          <NativeChip
                            key={p.id}
                            label={`${parentLabel} : ${p.fullName}`}
                            onDelete={() => handleRemoveParent(p.id)}
                            colorVariant="primary"
                          />
                        );
                      })}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <NativeSelect
                        label="Ajouter un parent"
                        value={newParentId}
                        onChange={(e) => setNewParentId(e.target.value === '' ? '' : Number(e.target.value))}
                        size="small"
                      >
                        <option value="">Choisir...</option>
                        {persons
                          .filter(p => p.id !== person.id && !currentParents.some(cp => cp.id === p.id))
                          .map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                      </NativeSelect>
                    </div>
                    <NativeBtn variant="outlined" size="small" onClick={handleAddParent} disabled={newParentId === ''}>
                      Ajouter
                    </NativeBtn>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  {/* Remplace MUI Typography subtitle2 */}
                  <p style={{
                    margin: `0 0 ${spacing[2]}px`,
                    fontFamily: fonts.sans,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: colors.ink3,
                  }}>
                    Enfants
                  </p>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {currentChildren.length === 0 && (
                      <span style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.ink4 }}>
                        Aucun enfant enregistré
                      </span>
                    )}
                    {currentChildren.map(c => (
                      <NativeChip
                        key={c.id}
                        label={c.fullName}
                        onDelete={() => handleRemoveChild(c.id)}
                        colorVariant="secondary"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <NativeSelect
                        label="Ajouter un enfant"
                        value={newChildId}
                        onChange={(e) => setNewChildId(e.target.value === '' ? '' : Number(e.target.value))}
                        size="small"
                      >
                        <option value="">Choisir...</option>
                        {persons
                          .filter(p => p.id !== person.id && !currentChildren.some(cc => cc.id === p.id))
                          .map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                      </NativeSelect>
                    </div>
                    <NativeBtn variant="outlined" size="small" onClick={handleAddChild} disabled={newChildId === ''}>
                      Ajouter
                    </NativeBtn>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          {/* Delete zone — only in edit mode */}
          <div>
            {person && onDelete && !confirmDelete && (
              <NativeBtn
                color="error"
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
              >
                Supprimer
              </NativeBtn>
            )}
            {person && onDelete && confirmDelete && (
              <>
                <NativeBtn
                  color="error"
                  variant="contained"
                  onClick={async () => { await onDelete(); onClose(); }}
                  disabled={loading}
                  style={{ marginRight: spacing[1] }}
                >
                  Confirmer la suppression
                </NativeBtn>
                <NativeBtn onClick={() => setConfirmDelete(false)} disabled={loading}>
                  Annuler
                </NativeBtn>
              </>
            )}
          </div>

          {/* Save / cancel */}
          <div>
            <NativeBtn onClick={onClose} disabled={loading} style={{ marginRight: spacing[1] }}>
              Annuler
            </NativeBtn>
            <NativeBtn
              type="submit"
              variant="contained"
              disabled={loading}
              style={{ minWidth: 100 }}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </NativeBtn>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PersonForm;
