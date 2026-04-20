import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FloatingManagerWidget from './components/FloatingManagerWidget.jsx'
import QuickNotePage from './components/QuickNotePage'


const hash = window.location.hash

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {hash === '#/floating-manager' ? 
    (
      <FloatingManagerWidget />
    ) : 
    hash === '#/quick-note' ? (
      <QuickNotePage />
    ) :
    (
      <App />
    )}
  </StrictMode>,
)
