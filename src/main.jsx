// src/main.jsx
import React from 'react' // Import React
import ReactDOM from 'react-dom/client'
import App from './pages/BookingPage.jsx'

// Bind React to the window object so BookingPage can find it globally
window.React = React; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)