import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { AppProvider } from './state/AppProvider';
import { demoClient } from './data/demoClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider client={demoClient}><App /></AppProvider>
  </StrictMode>,
);
