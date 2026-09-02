import React from 'react';
import { createRoot } from 'react-dom/client';
import FlowWeb from './app/FlowWeb';
import AdminApp from './admin/AdminApp';
import './styles.css';
import './app/flow.css';
import './responsive.css';

const root = createRoot(document.getElementById('root')!);
root.render(location.pathname.startsWith('/admin') ? <AdminApp /> : <FlowWeb />);
