import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PlaceholderView from './components/PlaceholderView';

const ArbreView  = lazy(() => import('./components/ArbreView'));
const AdminPage  = lazy(() => import('./components/AdminPage'));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/',           element: <ArbreView /> },
      { path: '/arbre',      element: <Navigate to="/" replace /> },
      { path: '/tableau',    element: <PlaceholderView name="Tableau" /> },
      { path: '/contempler', element: <PlaceholderView name="Contempler" /> },
      { path: '/riviere',    element: <PlaceholderView name="Rivière" /> },
      { path: '/atelier/:id',element: <PlaceholderView name="Atelier" /> },
      { path: '/admin',      element: <AdminPage /> },
    ],
  },
]);
