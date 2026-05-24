import Store from 'electron-store'
import { SAMPLE_NOTES } from './notesData.js'

const store = new Store({
  name: 'floatnote',
  defaults: {
    notes: [],
    settings: {
      maxFloatingNotes: 5,
      launchOnStartup: true,
    },
  },
})

// First-run initialization — seed the welcome note from notesData.js
// We use a separate flag because electron-store defaults get overridden
// the moment saveNotes() is called (even with [])
if (!store.get('_initialized')) {
  store.set('notes', [SAMPLE_NOTES[0]])
  store.set('_initialized', true)
}

export function getNotes() {
  return store.get('notes')
}

export function saveNotes(notes) {
  store.set('notes', notes)
}

export function getSettings() {
  return store.get('settings')
}

export function saveSettings(settings) {
  store.set('settings', settings)
}