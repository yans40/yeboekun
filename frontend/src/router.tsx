import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PlaceholderView from './components/PlaceholderView';
import { VUE_RIVIERE_ENABLED, VUE_CONTEMPLATION_ENABLED, VUE_ATELIER_ENABLED, VUE_TABLEAU_ENABLED } from './config/featureFlags';

const ArbreView         = lazy(() => import('./components/ArbreView'));
const AdminPage         = lazy(() => import('./components/AdminPage'));
const RiviereView       = lazy(() => import('./views/RiviereView'));
const ContemplationView = lazy(() => import('./views/ContemplationView'));
const AtelierView       = lazy(() => import('./views/AtelierView'));
const TableauView       = lazy(() => import('./views/TableauView'));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/',           element: <ArbreView /> },
      { path: '/arbre',      element: <Navigate to="/" replace /> },
      {
        path: '/tableau',
        element: VUE_TABLEAU_ENABLED
          ? <TableauView />
          : <PlaceholderView name="Tableau" />,
      },
      {
        path: '/contempler',
        element: VUE_CONTEMPLATION_ENABLED
          ? <ContemplationView />
          : <PlaceholderView name="Contempler" />,
      },
      {
        path: '/riviere',
        element: VUE_RIVIERE_ENABLED
          ? <RiviereView />
          : <PlaceholderView name="Rivière" />,
      },
      {
        path: '/atelier',
        element: VUE_ATELIER_ENABLED
          ? <AtelierView />
          : <PlaceholderView name="Atelier" />,
      },
      { path: '/admin',      element: <AdminPage /> },
    ],
  },
]);
