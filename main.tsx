// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';

// ⚡️ FINAL FIX: Corrected import path to './App' (no .tsx extension) ⚡️
import App from './App';

// Import your global CSS file for styling
import './index.css';

// This mounts the application to the <div id="root"> element in index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element with id 'root'. Check index.html.");
}