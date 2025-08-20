import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ElevenLabs Proxy будет инициализироваться только при необходимости в голосовых интервью

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
); 