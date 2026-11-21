import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { AudioProvider } from './context/AudioContext.jsx';
import { QuestProvider } from './context/QuestContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AudioProvider>
        <QuestProvider>
          <App />
        </QuestProvider>
      </AudioProvider>
    </AuthProvider>
  </React.StrictMode>
);
