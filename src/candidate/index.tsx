import React from 'react';
import ReactDOM from 'react-dom/client';
import CandidateApp from './App';
import './styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <CandidateApp />
  </React.StrictMode>
);
