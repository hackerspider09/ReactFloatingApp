const { contextBridge, ipcRenderer } = require('electron')

console.log('PRELOAD LOADED')

contextBridge.exposeInMainWorld('electronAPI', {
  appName: 'Floating Notes',
  loadNotes: () => ipcRenderer.invoke('notes:load'),
  saveNotes: (notes) => ipcRenderer.invoke('notes:save', notes),

  openManagerWindow: () => ipcRenderer.invoke('manager:open-main'),
  toggleNotesVisibility: () => ipcRenderer.invoke('manager:toggle-visibility'),
  magnetNotes: () => ipcRenderer.invoke('manager:magnet'),
  closeFloatingManager: () => ipcRenderer.invoke('manager:close-widget'),
})