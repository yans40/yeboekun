import React, { useState, useEffect, useId } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { CreatePersonDto, UpdatePersonDto, Person, SpouseInfo } from '@/types';
import { apiService } from '@/services/api';
import { colors, fonts, radius, spacing, shadows } from '@/theme/tokens';

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
  /**
   * Mode inline : remplace le Dialog MUI par un div transparent.
   * Utile quand le formulaire est intégré dans un panneau existant (AtelierView).
   * Défaut : false — comportement modale inchangé.
   */
  inline?: boolean;
  /**
   * Callback appelé après une sauvegarde réussie, en remplacement de onClose.
   * Permet au parent de distinguer "l'utilisateur annule" (onClose) de
   * "la sauvegarde a réussi" (onSaved) — utile en mode inline pour ne pas
   * fermer le panneau d'édition après save.
   * Si absent, onClose est appelé après save (comportement rétro-compatible).
   */
  onSaved?: () => void;
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

// ─── CollapsibleSection ───────────────────────────────────────────────────────

/**
 * Section avec en-tête cliquable (chevron) et contenu conditionnellement rendu.
 * Utilise un rendu conditionnel (pas de display:none) pour éviter les refs cassées
 * dans les TextField MUI imbriqués.
 */
interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  /** Identifiant stable côté React 18 — relie le bouton au contenu (WCAG 4.1.3) */
  const uid = useId();
  const contentId = `collapsible-content-${uid.replace(/:/g, '')}`;

  return (
    <div style={{
      border: `1px solid ${colors.line2}`,
      borderRadius: radius.md,
      overflow: 'hidden',
      marginBottom: spacing[3],
    }}>
      {/* En-tête */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={contentId}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${spacing[2]}px ${spacing[3]}px`,
          fontFamily: fonts.sans,
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: colors.ink3,
          backgroundColor: colors.paper2,
          border: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background-color 120ms ease',
        }}
      >
        <span>{title}</span>
        {/* Chevron animé */}
        <span style={{
          fontSize: 10,
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 200ms ease',
          display: 'inline-block',
          color: colors.ink4,
        }}>
          ▾
        </span>
      </button>

      {/* Contenu — rendu conditionnel pour préserver le state des champs */}
      {open && (
        <div
          id={contentId}
          role="region"
          aria-label={title}
          style={{
            padding: `${spacing[3]}px ${spacing[3]}px ${spacing[3]}px`,
            backgroundColor: colors.cream,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// ─── SectionLabel — petit titre de sous-groupe ────────────────────────────────

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    margin: `0 0 ${spacing[1]}px`,
    fontFamily: fonts.sans,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: colors.ink3,
  }}>
    {children}
  </p>
);

// ─── ImmediateNote — note "enregistrement immédiat" ───────────────────────────

const ImmediateNote: React.FC<{ text: string }> = ({ text }) => (
  <span style={{
    display: 'block',
    marginBottom: spacing[2],
    fontFamily: fonts.sans,
    fontSize: '0.75rem',
    color: colors.ink4,
  }}>
    {text}
  </span>
);

// ─── SpouseRow — une ligne conjoint dans la liste ─────────────────────────────

interface SpouseRowProps {
  onRemove: () => void;
  labelConjoint: string;
  labelDates: string;
}

const SpouseRow: React.FC<SpouseRowProps> = ({ onRemove, labelConjoint, labelDates }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing[2]}px ${spacing[3]}px`,
    backgroundColor: colors.paper,
    border: `1px solid ${colors.line2}`,
    borderRadius: radius.md,
    marginBottom: spacing[1],
    boxShadow: shadows.xs,
  }}>
    <div>
      <span style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.ink, fontWeight: 500 }}>
        {labelConjoint}
      </span>
      {labelDates && (
        <span style={{
          display: 'block',
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.ink4,
          marginTop: 2,
        }}>
          {labelDates}
        </span>
      )}
    </div>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Supprimer ${labelConjoint}`}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: colors.rust,
        fontSize: 18,
        lineHeight: 1,
        padding: `0 ${spacing[1]}px`,
        opacity: 0.7,
        flexShrink: 0,
      }}
    >
      ×
    </button>
  </div>
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
  inline = false,
  onSaved,
}) => {
  const { t } = useTranslation();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [parent1Id, setParent1Id] = useState<number | ''>('');
  const [parent2Id, setParent2Id] = useState<number | ''>('');

  // État mode édition — relations existantes
  const [currentParents, setCurrentParents] = useState<Person[]>([]);
  const [currentChildren, setCurrentChildren] = useState<Person[]>([]);
  const [newParentId, setNewParentId] = useState<number | ''>('');
  const [newChildId, setNewChildId] = useState<number | ''>('');

  // ── Conjoints ──────────────────────────────────────────────────────────────
  const [currentSpouses, setCurrentSpouses] = useState<SpouseInfo[]>([]);
  const [newSpouseId, setNewSpouseId] = useState<number | ''>('');
  const [newSpouseStartDate, setNewSpouseStartDate] = useState('');
  const [newSpouseEndDate, setNewSpouseEndDate] = useState('');
  const [spouseError, setSpouseError] = useState<string | null>(null);

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
    setSpouseError(null);
    setConfirmDelete(false);
    setParent1Id('');
    setParent2Id('');
    setNewParentId('');
    setNewChildId('');
    setNewSpouseId('');
    setNewSpouseStartDate('');
    setNewSpouseEndDate('');
    setCurrentParents([]);
    setCurrentChildren([]);
    setCurrentSpouses([]);

    if (!person) return;
    let cancelled = false;
    apiService.getParents(person.id)
      .then(r => { if (!cancelled) setCurrentParents(r); })
      .catch(() => {});
    apiService.getChildren(person.id)
      .then(r => { if (!cancelled) setCurrentChildren(r); })
      .catch(() => {});
    apiService.getSpouses(person.id)
      .then(r => { if (!cancelled) setCurrentSpouses(r); })
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
      // Si onSaved est fourni, l'appeler à la place de onClose (ex : mode édition inline
      // où on veut rester sur la personne éditée après sauvegarde).
      if (onSaved !== undefined) {
        onSaved();
      } else {
        onClose();
      }
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

  // ── Handlers Conjoints ─────────────────────────────────────────────────────

  const handleAddSpouse = async () => {
    if (!person || newSpouseId === '') return;
    setSpouseError(null);
    try {
      await apiService.addSpouse(
        person.id,
        newSpouseId as number,
        newSpouseStartDate || undefined,
        newSpouseEndDate || undefined,
      );
      // Recharger depuis l'API pour avoir la structure SpouseInfo complète
      const updated = await apiService.getSpouses(person.id);
      setCurrentSpouses(updated);
      setNewSpouseId('');
      setNewSpouseStartDate('');
      setNewSpouseEndDate('');
    } catch (error: unknown) {
      // Discrimination fine selon le code HTTP renvoyé par le backend
      const status =
        error !== null &&
        typeof error === 'object' &&
        'response' in error &&
        error.response !== null &&
        typeof error.response === 'object' &&
        'status' in error.response
          ? (error.response as { status: number }).status
          : undefined;

      if (status === 409) {
        setSpouseError(t('form.spouse_add_error_conflict'));
      } else if (status === 400) {
        setSpouseError(t('form.spouse_add_error_dates'));
      } else {
        setSpouseError(t('form.spouse_add_error'));
      }
    }
  };

  const handleRemoveSpouse = async (spouseId: number) => {
    if (!person) return;
    setSpouseError(null);
    try {
      await apiService.removeSpouse(person.id, spouseId);
      setCurrentSpouses(prev => prev.filter(s => s.spouse.id !== spouseId));
    } catch {
      setSpouseError(t('form.spouse_remove_error'));
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

  // ── Helpers d'affichage pour les dates de conjoints ───────────────────────

  const formatSpouseDates = (info: SpouseInfo): string => {
    const start = info.marriageStartDate ? info.marriageStartDate.slice(0, 10) : null;
    const end   = info.marriageEndDate   ? info.marriageEndDate.slice(0, 10)   : null;
    if (start && end)  return `${start} → ${end}`;
    if (start && !end) return `depuis ${start}`;
    return '';
  };

  const formatParentLabel = (p: Person): string => {
    if (p.gender === 'M') return t('form.parent_label_father', { name: p.fullName });
    if (p.gender === 'F') return t('form.parent_label_mother', { name: p.fullName });
    return t('form.parent_label_other', { name: p.fullName });
  };

  // ── Liste des personnes disponibles pour ajouter un conjoint ─────────────
  // Exclut : la personne elle-même + conjoints déjà enregistrés
  const availableSpouses = persons.filter(
    p => person && p.id !== person.id && !currentSpouses.some(s => s.spouse.id === p.id),
  );

  // ── Contenu partagé (identique en mode Dialog et en mode inline) ─────────

  const formContent = (
    <div style={{ padding: '0 4px' }}>
      {/* ── Section Identité ──────────────────────────────────────────────── */}
      <CollapsibleSection title={t('form.section_identity')} defaultOpen={true}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('form.field_firstname')}
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
              label={t('form.field_lastname')}
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
              label={t('form.field_middle_name')}
              value={formData.middleName}
              onChange={handleChange('middleName')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <NativeSelect
              label={t('form.gender')}
              value={formData.gender}
              onChange={handleChange('gender') as any}
            >
              <option value="M">{t('form.gender_male')}</option>
              <option value="F">{t('form.gender_female')}</option>
              <option value="O">{t('form.gender_other')}</option>
            </NativeSelect>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('form.field_photo_url')}
              value={formData.photoUrl}
              onChange={handleChange('photoUrl')}
              placeholder={t('form.field_photo_url_placeholder')}
            />
          </Grid>
        </Grid>
      </CollapsibleSection>

      {/* ── Section Vie ───────────────────────────────────────────────────── */}
      <CollapsibleSection title={t('form.section_life')} defaultOpen={true}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Remplace MUI FormControlLabel + Switch */}
            <NativeSwitch
              id="isAlive-switch"
              checked={formData.isAlive}
              onChange={handleChange('isAlive')}
              label={t('form.field_is_alive')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('form.field_birth_date')}
              type="date"
              value={formData.birthDate}
              onChange={handleChange('birthDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('form.field_death_date')}
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
              label={t('form.field_birth_place')}
              value={formData.birthPlace}
              onChange={handleChange('birthPlace')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('form.field_death_place')}
              value={formData.deathPlace}
              onChange={handleChange('deathPlace')}
              disabled={formData.isAlive}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('form.field_biography')}
              multiline
              rows={4}
              value={formData.biography}
              onChange={handleChange('biography')}
              placeholder={t('form.field_biography_placeholder')}
            />
          </Grid>
        </Grid>
      </CollapsibleSection>

      {/* ── Section Famille — mode création (père/mère initiaux) ─────────── */}
      {!person && persons.length > 0 && (
        <CollapsibleSection title={t('form.section_family')} defaultOpen={false}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <NativeSelect
                label={t('form.father_optional')}
                value={parent1Id}
                onChange={(e) => setParent1Id(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value="">{t('form.none_male')}</option>
                {persons
                  .filter(p => p.gender === 'M' || p.gender === 'O' || p.gender === null)
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
              </NativeSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <NativeSelect
                label={t('form.mother_optional')}
                value={parent2Id}
                onChange={(e) => setParent2Id(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value="">{t('form.none_female')}</option>
                {persons
                  .filter(p => p.gender === 'F' || p.gender === 'O' || p.gender === null)
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
              </NativeSelect>
            </Grid>
          </Grid>
        </CollapsibleSection>
      )}

      {/* ── Section Famille — mode édition (parents + enfants) ───────────── */}
      {person && persons.length > 0 && (
        <CollapsibleSection title={t('form.section_family')} defaultOpen={true}>
          {relationError && (
            <div style={{ marginBottom: spacing[3] }}>
              <NativeAlert onClose={() => setRelationError(null)}>
                {relationError}
              </NativeAlert>
            </div>
          )}

          {/* ── Parents ─────────────────────────────────────────────────── */}
          <SectionLabel>{t('form.subsection_parents')}</SectionLabel>
          <ImmediateNote text={t('form.relations_immediate_note')} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {currentParents.length === 0 && (
              <span style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.ink4 }}>
                {t('form.no_parents')}
              </span>
            )}
            {[...currentParents]
              .sort((a, b) => {
                const order = (g: string | null) => g === 'M' ? 0 : g === 'F' ? 1 : 2;
                return order(a.gender) - order(b.gender);
              })
              .map(p => (
                <NativeChip
                  key={p.id}
                  label={formatParentLabel(p)}
                  onDelete={() => handleRemoveParent(p.id)}
                  colorVariant="primary"
                />
              ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', mb: spacing[3] / 8 }}>
            <div style={{ flex: 1 }}>
              <NativeSelect
                label={t('form.add_parent')}
                value={newParentId}
                onChange={(e) => setNewParentId(e.target.value === '' ? '' : Number(e.target.value))}
                size="small"
              >
                <option value="">{t('form.choose')}</option>
                {persons
                  .filter(p => p.id !== person.id && !currentParents.some(cp => cp.id === p.id))
                  .map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </NativeSelect>
            </div>
            <NativeBtn variant="outlined" size="small" onClick={handleAddParent} disabled={newParentId === ''}>
              {t('form.btn_add')}
            </NativeBtn>
          </Box>

          {/* ── Enfants ──────────────────────────────────────────────────── */}
          <div style={{ marginTop: spacing[4] }}>
            <SectionLabel>{t('form.subsection_children')}</SectionLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {currentChildren.length === 0 && (
                <span style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.ink4 }}>
                  {t('form.no_children')}
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
                  label={t('form.add_child')}
                  value={newChildId}
                  onChange={(e) => setNewChildId(e.target.value === '' ? '' : Number(e.target.value))}
                  size="small"
                >
                  <option value="">{t('form.choose')}</option>
                  {persons
                    .filter(p => p.id !== person.id && !currentChildren.some(cc => cc.id === p.id))
                    .map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                </NativeSelect>
              </div>
              <NativeBtn variant="outlined" size="small" onClick={handleAddChild} disabled={newChildId === ''}>
                {t('form.btn_add')}
              </NativeBtn>
            </Box>
          </div>
        </CollapsibleSection>
      )}

      {/* ── Section Conjoints — mode édition uniquement ───────────────────── */}
      {person && (
        <CollapsibleSection title={t('form.section_spouses')} defaultOpen={true}>
          {spouseError && (
            <div style={{ marginBottom: spacing[3] }}>
              <NativeAlert onClose={() => setSpouseError(null)}>
                {spouseError}
              </NativeAlert>
            </div>
          )}

          <ImmediateNote text={t('form.relations_immediate_note')} />

          {/* Liste des conjoints existants */}
          {currentSpouses.length === 0 && (
            <span style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.ink4, display: 'block', marginBottom: spacing[3] }}>
              {t('form.no_spouses')}
            </span>
          )}
          {currentSpouses.map(info => (
            <SpouseRow
              key={info.spouse.id}
              onRemove={() => handleRemoveSpouse(info.spouse.id)}
              labelConjoint={info.spouse.fullName}
              labelDates={formatSpouseDates(info)}
            />
          ))}

          {/* Formulaire d'ajout d'un conjoint */}
          {persons.length > 0 && (
            <div style={{
              marginTop: spacing[3],
              padding: `${spacing[3]}px`,
              backgroundColor: colors.paper2,
              borderRadius: radius.md,
              border: `1px dashed ${colors.line}`,
            }}>
              <SectionLabel>{t('form.add_spouse')}</SectionLabel>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <NativeSelect
                    label={t('form.add_spouse')}
                    value={newSpouseId}
                    onChange={(e) => setNewSpouseId(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">{t('form.choose')}</option>
                    {availableSpouses.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName}</option>
                    ))}
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('form.spouse_start_date')}
                    type="date"
                    value={newSpouseStartDate}
                    onChange={e => setNewSpouseStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('form.spouse_end_date')}
                    type="date"
                    value={newSpouseEndDate}
                    onChange={e => setNewSpouseEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <NativeBtn
                    type="button"
                    variant="outlined"
                    onClick={handleAddSpouse}
                    disabled={newSpouseId === ''}
                  >
                    {t('form.add_spouse')}
                  </NativeBtn>
                </Grid>
              </Grid>
            </div>
          )}
        </CollapsibleSection>
      )}
    </div>
  );

  const actionsContent = (
    <>
      {/* Delete zone — only in edit mode */}
      <div>
        {person && onDelete && !confirmDelete && (
          <NativeBtn
            color="error"
            onClick={() => setConfirmDelete(true)}
            disabled={loading}
          >
            {t('form.delete')}
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
              {t('form.delete_confirm')}
            </NativeBtn>
            <NativeBtn onClick={() => setConfirmDelete(false)} disabled={loading}>
              {t('form.delete_cancel')}
            </NativeBtn>
          </>
        )}
      </div>

      {/* Save / cancel */}
      <div>
        <NativeBtn onClick={onClose} disabled={loading} style={{ marginRight: spacing[1] }}>
          {t('form.cancel')}
        </NativeBtn>
        <NativeBtn
          type="submit"
          variant="contained"
          disabled={loading}
          style={{ minWidth: 100 }}
        >
          {loading ? t('form.saving') : t('form.save')}
        </NativeBtn>
      </div>
    </>
  );

  // ── Mode inline — wrapper div transparent, pas de Dialog ─────────────────────
  if (inline) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          padding: `${spacing[3]}px ${spacing[4]}px ${spacing[2]}px`,
          borderBottom: `1px solid ${colors.line2}`,
          flexShrink: 0,
        }}>
          <h6 style={{ margin: 0, fontFamily: fonts.serif, fontWeight: 600, fontSize: '1.25rem', color: colors.ink }}>
            {title}
          </h6>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: `${spacing[3]}px ${spacing[3]}px`, overflowY: 'auto', flex: 1 }}>
            {formContent}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: `${spacing[2]}px ${spacing[3]}px`,
            borderTop: `1px solid ${colors.line2}`,
            flexShrink: 0,
          }}>
            {actionsContent}
          </div>
        </form>
      </div>
    );
  }

  // ── Mode Dialog (défaut) — comportement inchangé ──────────────────────────────
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle component="div">
        <h6 style={{ margin: 0, fontFamily: fonts.serif, fontWeight: 600, fontSize: '1.25rem', color: colors.ink }}>
          {title}
        </h6>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {formContent}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          {actionsContent}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PersonForm;
