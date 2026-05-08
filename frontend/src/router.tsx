import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PlaceholderView from './components/PlaceholderView';
import { VUE_RIVIERE_ENABLED, VUE_CONTEMPLATION_ENABLED } from './config/featureFlags';
import { riverViewMock } from './mocks/riverViewMock';

const ArbreView        = lazy(() => import('./components/ArbreView'));
const AdminPage        = lazy(() => import('./components/AdminPage'));
const RiviereView      = lazy(() => import('./views/RiviereView'));
const ContemplationView = lazy(() => import('./views/ContemplationView'));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/',           element: <ArbreView /> },
      { path: '/arbre',      element: <Navigate to="/" replace /> },
      { path: '/tableau',    element: <PlaceholderView name="Tableau" /> },
      {
        path: '/contempler',
        element: VUE_CONTEMPLATION_ENABLED
          ? <ContemplationView />
          : <PlaceholderView name="Contempler" />,
      },
      {
        path: '/riviere',
        element: VUE_RIVIERE_ENABLED
          ? <RiviereView data={riverViewMock} />
          : <PlaceholderView name="Rivière" />,
      },
      { path: '/atelier/:id',element: <PlaceholderView name="Atelier" /> },
      { path: '/admin',      element: <AdminPage /> },
    ],
  },
]);
