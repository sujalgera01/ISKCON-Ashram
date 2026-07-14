import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Make React globally available (required for JSX in this setup)
window.React = React;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)