import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FloatingManagerWidget from './components/FloatingManagerWidget.jsx'
import QuickNotePage from './components/QuickNotePage'
import FloatingNoteWidget from './components/FloatingNoteWidget.jsx'
import FloatingNotePreview from './components/FloatingNotePreview.jsx'

const hash = window.location.hash

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {hash === '#/floating-manager' ? (
      <FloatingManagerWidget />
    ) : hash.startsWith('#/floating-note-preview/') ? (
      <FloatingNotePreview />
    ) : hash.startsWith('#/floating-note/') ? (
      <FloatingNoteWidget />
    ) : hash === '#/quick-note' ? (
      <QuickNotePage />
    ) : (
      <App />
    )}
  </StrictMode>,
)
