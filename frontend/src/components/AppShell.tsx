import { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import NavRail from './NavRail';
import TopBar from './TopBar';
import EditModeModal from './EditModeModal';
import { FamilyTreeContext } from '../context/FamilyTreeContext';
import { useEditMode } from '../hooks/useEditMode';
import { Person } from '../types';
import apiService from '../services/api';
import { colors } from '../theme/tokens';

export default function AppShell() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { canEdit, enterEditMode, exitEditMode } = useEditMode();

  useEffect(() => {
    apiService.getPersons().then(setPersons).catch(() => {});
  }, []);

  const handlePersonSelect = (id: number | null) => setSelectedPersonId(id);

  return (
    <FamilyTreeContext.Provider value={{
      persons,
      selectedPersonId,
      onPersonSelect: handlePersonSelect,
      canEdit,
      onOpenEditModal: () => setEditModalOpen(true),
      onExitEditMode: exitEditMode,
    }}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: colors.paper }}>
        <NavRail />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar />
          <main style={{ flex: 1, overflow: 'hidden' }}>
            <ErrorBoundary>
              <Suspense fallback={null}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>

      <EditModeModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onLogin={enterEditMode}
      />
    </FamilyTreeContext.Provider>
  );
}
