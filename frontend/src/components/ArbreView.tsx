import { useEffect, useState, useRef } from 'react';
import FanCanvas from './FanCanvas';
import PersonForm from './PersonForm';
import { useFamilyTree } from '../hooks/useFamilyTree';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import { Person, CreatePersonDto, UpdatePersonDto } from '../types';
import apiService from '../services/api';
import { colors, fonts, radius, shadows, spacing } from '../theme/tokens';

type SnackSeverity = 'success' | 'error' | 'info' | 'warning';

const severityStyles: Record<SnackSeverity, { bg: string; border: string; color: string; icon: string }> = {
  success: { bg: '#f0fdf4', border: colors.forest,  color: colors.forest,  icon: '✓' },
  error:   { bg: '#fef2f2', border: colors.rust,    color: colors.rust,    icon: '✕' },
  warning: { bg: '#fffbeb', border: colors.gold,    color: colors.gold,    icon: '!' },
  info:    { bg: '#eff6ff', border: colors.ocean,   color: colors.ocean,   icon: 'i' },
};

export default function ArbreView() {
  const { selectedPersonId, onPersonSelect, canEdit, persons } = useFamilyTreeContext();
  const { familyData, layout, loading, loadFamilyTree, clearTree } = useFamilyTree();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: SnackSeverity }>({
    open: false, message: '', severity: 'info',
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSnackbar = (message: string, severity: SnackSeverity) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSnackbar({ open: true, message, severity });
    timerRef.current = setTimeout(() => setSnackbar(s => ({ ...s, open: false })), 4000);
  };

  const closeSnackbar = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSnackbar(s => ({ ...s, open: false }));
  };

  useEffect(() => {
    if (selectedPersonId !== null) {
      loadFamilyTree(selectedPersonId);
    } else {
      clearTree();
    }
  }, [selectedPersonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePersonEdit = async (personId: number) => {
    try {
      const person = await apiService.getPersonById(personId);
      setEditingPerson(person);
      setFormOpen(true);
    } catch {
      showSnackbar('Impossible de charger les données de la personne', 'error');
    }
  };

  const handleFormSubmit = async (data: CreatePersonDto | UpdatePersonDto, parentIds?: number[]) => {
    try {
      if (editingPerson) {
        await apiService.updatePerson(editingPerson.id, data as UpdatePersonDto);
        showSnackbar('Personne mise à jour', 'success');
      } else {
        const created = await apiService.createPerson(data as CreatePersonDto);
        if (parentIds && parentIds.length > 0) {
          await Promise.all(
            parentIds.map(parentId =>
              apiService.addParentChildRelationship(parentId, created.id)
            )
          );
        }
        showSnackbar('Personne créée', 'success');
      }
      if (selectedPersonId !== null) {
        loadFamilyTree(selectedPersonId);
      }
    } catch {
      showSnackbar(
        editingPerson ? 'La mise à jour a échoué.' : 'La création a échoué. Vérifiez les données saisies.',
        'error'
      );
      throw new Error('submit failed');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingPerson(null);
  };

  const handlePersonDelete = async () => {
    if (!editingPerson) return;
    await apiService.deletePerson(editingPerson.id);
    showSnackbar(`${editingPerson.fullName} supprimé(e)`, 'success');
    if (selectedPersonId === editingPerson.id) {
      onPersonSelect(null);
    } else if (selectedPersonId !== null) {
      loadFamilyTree(selectedPersonId);
    }
    handleFormClose();
  };

  const sty = snackbar.open ? severityStyles[snackbar.severity] : severityStyles.info;

  return (
    <>
      <FanCanvas
        familyData={familyData}
        layout={layout}
        loading={loading}
        onPersonSelect={id => onPersonSelect(id)}
        onPersonEdit={canEdit ? handlePersonEdit : undefined}
      />

      <PersonForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        onDelete={editingPerson ? handlePersonDelete : undefined}
        person={editingPerson}
        persons={persons}
        title={editingPerson ? 'Modifier la personne' : 'Ajouter une personne'}
      />

      {/* Snackbar natif — remplace MUI Snackbar + Alert */}
      <div
        role="alert"
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: spacing[4],
          right: spacing[4],
          zIndex: 1400,
          minWidth: 288,
          maxWidth: 480,
          backgroundColor: sty.bg,
          border: `1px solid ${sty.border}`,
          borderRadius: radius.md,
          boxShadow: shadows.lg,
          padding: `${spacing[3]}px ${spacing[4]}px`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          fontFamily: fonts.sans,
          fontSize: 14,
          color: sty.color,
          pointerEvents: snackbar.open ? 'auto' : 'none',
          opacity: snackbar.open ? 1 : 0,
          transform: snackbar.open ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 225ms ease, transform 225ms ease',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16, lineHeight: 1 }}>{sty.icon}</span>
        <span style={{ flex: 1 }}>{snackbar.message}</span>
        <button
          onClick={closeSnackbar}
          aria-label="Fermer"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: sty.color,
            fontSize: 18,
            lineHeight: 1,
            padding: 0,
            opacity: 0.7,
          }}
        >
          ×
        </button>
      </div>
    </>
  );
}
