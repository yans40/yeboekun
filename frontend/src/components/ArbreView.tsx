import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import FanCanvas from './FanCanvas';
import PersonForm from './PersonForm';
import { useFamilyTree } from '../hooks/useFamilyTree';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import { Person, CreatePersonDto, UpdatePersonDto } from '../types';
import apiService from '../services/api';

type SnackSeverity = 'success' | 'error' | 'info' | 'warning';

export default function ArbreView() {
  const { selectedPersonId, onPersonSelect, canEdit } = useFamilyTreeContext();
  const { familyData, layout, loading, loadFamilyTree, clearTree } = useFamilyTree();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: SnackSeverity }>({
    open: false, message: '', severity: 'info',
  });

  const showSnackbar = (message: string, severity: SnackSeverity) =>
    setSnackbar({ open: true, message, severity });

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
        persons={[]}
        title={editingPerson ? 'Modifier la personne' : 'Ajouter une personne'}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
