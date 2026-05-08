import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './theme/fonts.css';
import App from './App';

axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
