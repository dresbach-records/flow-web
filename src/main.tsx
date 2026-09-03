import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('FLOW root element not found');

document.documentElement.dataset.theme = localStorage.getItem('flow.theme') ?? 'light';
if ('serviceWorker' in navigator) window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
