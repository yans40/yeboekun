import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar,
  Alert,
} from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import AppSidebar from './components/AppSidebar';
import FanCanvas from './components/FanCanvas';
import PersonForm from './components/PersonForm';
import AdminLoginModal from './components/AdminLoginModal';
import { useFamilyTree } from './hooks/useFamilyTree';
import { useAdmin } from './hooks/useAdmin';
import { Person, CreatePersonDto, UpdatePersonDto } from './types';
import apiService from './services/api';

const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32' },
    secondary: { main: '#1976D2' },
    background: { default: '#F7F9FC' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

type SnackSeverity = 'success' | 'error' | 'info' | 'warning';

function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: SnackSeverity }>({
    open: false, message: '', severity: 'info',
  });

  const { familyData, layout, loading, loadFamilyTree, clearTree } = useFamilyTree();
  const { isAdmin, login, logout } = useAdmin();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // ── Load all persons on mount ───────────────────────────────────────────────
  useEffect(() => {
    loadPersons();
  }, []);

  // ── Reload tree when selection changes ─────────────────────────────────────
  useEffect(() => {
    if (selectedPersonId !== null) {
      loadFamilyTree(selectedPersonId);
    } else {
      clearTree();
    }
  }, [selectedPersonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPersons = async () => {
    try {
      const data = await apiService.getPersons();
      setPersons(data);
    } catch {
      showSnackbar('Impossible de charger la liste des personnes. Vérifiez votre connexion.', 'error');
    }
  };

  const showSnackbar = (message: string, severity: SnackSeverity) =>
    setSnackbar({ open: true, message, severity });

  // ── Person selection from sidebar or canvas ─────────────────────────────────
  const handlePersonSelect = (personId: number) => {
    setSelectedPersonId(personId);
  };

  // ── Edit: fetch full person then open form ──────────────────────────────────
  const handlePersonEdit = async (personId: number) => {
    try {
      const person = await apiService.getPersonById(personId);
      setEditingPerson(person);
      setFormOpen(true);
    } catch {
      showSnackbar('Impossible de charger les données de la personne', 'error');
    }
  };

  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleFormSubmit = async (data: CreatePersonDto | UpdatePersonDto, parentIds?: number[]) => {
    try {
      if (editingPerson) {
        await apiService.updatePerson(editingPerson.id, data as UpdatePersonDto);
        showSnackbar('Personne mise à jour', 'success');
      } else {
        const created = await apiService.createPerson(data as CreatePersonDto);
        // Créer les relations parent → enfant
        if (parentIds && parentIds.length > 0) {
          await Promise.all(
            parentIds.map(parentId =>
              apiService.createRelationship({
                person1Id: parentId,
                person2Id: created.id,
                relationshipType: 1, // Parent
                isActive: true,
              })
            )
          );
        }
        showSnackbar('Personne créée', 'success');
      }
      await loadPersons();
      // Refresh tree if a person in the current view was modified
      if (selectedPersonId !== null) {
        loadFamilyTree(selectedPersonId);
      }
    } catch {
      showSnackbar(editingPerson ? 'La mise à jour a échoué.' : 'La création a échoué. Vérifiez les données saisies.', 'error');
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
    await loadPersons();
    if (selectedPersonId === editingPerson.id) {
      setSelectedPersonId(null);
    } else if (selectedPersonId !== null) {
      loadFamilyTree(selectedPersonId);
    }
  };

  // ── Compute sidebar stats from layout ───────────────────────────────────────
  const ancestorCount = layout
    ? layout.positions.filter(p => p.level > 0).length
    : undefined;
  const generationDepth = layout
    ? Math.max(0, ...layout.positions.map(p => p.level)) + 1
    : undefined;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <ErrorBoundary>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#F7F9FC' }}>
          {/* Sidebar */}
          <AppSidebar
            persons={persons}
            selectedPersonId={selectedPersonId}
            onPersonSelect={handlePersonSelect}
            onAddPerson={() => { setEditingPerson(null); setFormOpen(true); }}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(c => !c)}
            ancestorCount={ancestorCount}
            generationDepth={generationDepth}
            isAdmin={isAdmin}
            onAdminLogin={() => setAdminModalOpen(true)}
            onAdminLogout={logout}
          />

          {/* Main canvas area */}
          <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <FanCanvas
              familyData={familyData}
              layout={layout}
              loading={loading}
              onPersonSelect={handlePersonSelect}
              onPersonEdit={isAdmin ? handlePersonEdit : undefined}
            />
          </main>
        </div>
      </ErrorBoundary>

      {/* Admin login modal */}
      <AdminLoginModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onLogin={login}
      />

      {/* Person form modal */}
      <PersonForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        onDelete={editingPerson ? handlePersonDelete : undefined}
        person={editingPerson}
        persons={persons}
        title={editingPerson ? 'Modifier la personne' : 'Ajouter une personne'}
      />

      {/* Snackbar */}
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
    </ThemeProvider>
  );
}

export default App;
