import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

function renderChatbot(containerId: string) {
  const container = document.getElementById(containerId);
  if (container) {
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
}

// Expose the render function globally for the embed script
(window as any).renderChatbot = renderChatbot;

// For development, mount directly if not in embed context
if (!document.getElementById('chatbot-embed-root')) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
