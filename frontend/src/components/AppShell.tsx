import { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
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
    let cancelled = false;
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const loadPersons = () => {
      apiService.getPersons().then((result) => {
        if (!cancelled) setPersons(result);
      }).catch(() => {});
    };

    // Defer non-critical fetch to keep first paint responsive.
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(loadPersons, { timeout: 1200 });
    } else {
      timeoutId = globalThis.setTimeout(loadPersons, 250);
    }

    return () => {
      cancelled = true;
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && idleId !== null) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) globalThis.clearTimeout(timeoutId);
    };
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: colors.paper }}>
        <TopBar />
        <main style={{ flex: 1, overflow: 'hidden', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <EditModeModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onLogin={enterEditMode}
      />
    </FamilyTreeContext.Provider>
  );
}
