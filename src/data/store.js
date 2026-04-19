import Store from 'electron-store'

const store = new Store({
  name: 'floating-notes',
  defaults: {
    notes: [],
  },
})

export function getNotes() {
  return store.get('notes')
}

export function saveNotes(notes) {
  store.set('notes', notes)
}