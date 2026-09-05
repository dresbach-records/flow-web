import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppErrorBoundary } from './components/system/AppErrorBoundary';
import OfflineNotice from './components/ui/OfflineNotice';
import InstallAppPrompt from './components/site/InstallAppPrompt';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('FLOW root element not found');

document.documentElement.dataset.theme = 'light';
localStorage.removeItem('flow.theme');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('[FLOW] Service Worker não pôde ser registrado.', error);
    });
  });
}

createRoot(rootElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
      <OfflineNotice />
      <InstallAppPrompt />
    </AppErrorBoundary>
  </React.StrictMode>,
);
