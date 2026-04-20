import Store from 'electron-store'

const store = new Store({
  name: 'floating-notes',
  defaults: {
    notes: [],
    settings: {
      maxFloatingNotes: 5,
    },
  },
})

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