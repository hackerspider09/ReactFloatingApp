const { contextBridge, ipcRenderer } = require('electron')

console.log('PRELOAD LOADED')

contextBridge.exposeInMainWorld('electronAPI', {
  appName: 'Floating Notes',
  loadNotes: () => ipcRenderer.invoke('notes:load'),
  saveNotes: (notes) => ipcRenderer.invoke('notes:save', notes),
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

  // manager ipc
  openManagerWindow: () => ipcRenderer.invoke('manager:open-main'),
  toggleNotesVisibility: () => ipcRenderer.invoke('manager:toggle-visibility'),
  magnetNotes: () => ipcRenderer.invoke('manager:magnet'),
  closeFloatingManager: () => ipcRenderer.invoke('manager:close-widget'),
  openFloatingManager: () => ipcRenderer.invoke('manager:open-widget'),

  // create window ipc
  createQuickNoteWindow: () => ipcRenderer.invoke('note:create-window'),
  openFloatingNotePreview: (noteId) => ipcRenderer.invoke('note:open-preview', noteId),

})