const { contextBridge, ipcRenderer } = require('electron')

console.log('PRELOAD LOADED')

contextBridge.exposeInMainWorld('electronAPI', {
  appName: 'FloatNote',
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
  resizeManagerWindow: (width, height) => ipcRenderer.invoke('manager:resize', width, height),

  // create window ipc
  createQuickNoteWindow: () => ipcRenderer.invoke('note:create-window'),
  openFloatingNotePreview: (noteId) => ipcRenderer.invoke('note:open-preview', noteId),

  // sync ipc — returns cleanup function to avoid listener leaks
  onNotesUpdated: (callback) => {
    const handler = (_, notes) => callback(notes)
    ipcRenderer.on('notes-updated', handler)
    return () => ipcRenderer.removeListener('notes-updated', handler)
  },

  // window drag ipc — uses Electron's coordinate system to avoid DPI issues
  startWindowDrag: () => ipcRenderer.invoke('window:start-drag'),
  moveWindowDrag: (dx, dy) => ipcRenderer.send('window:move-drag', dx, dy),

  // startup ipc
  setAutoLaunch: (enabled) => ipcRenderer.invoke('settings:set-autolaunch', enabled),

  // transparent window hit-testing
  setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('window:set-ignore-mouse-events', ignore, options),
})