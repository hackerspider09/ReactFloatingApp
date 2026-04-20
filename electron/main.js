import electron from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { getNotes, saveNotes, getSettings, saveSettings } from '../src/data/store.js'

import { createFloatingManagerWindow, closeFloatingManagerWindow } from './floatingManagerWindow.js'
import { createQuickNoteWindow } from './quickNoteWindow.js'
import { showFloatingNotes, hideFloatingNotes } from './floatingNotesWindow.js'
import { createFloatingNotePreviewWindow } from './floatingNotePreviewWindow.js'

const { app, BrowserWindow, ipcMain } = electron

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // console window
  win.webContents.openDevTools()

  win.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
  ipcMain.handle('settings:load', () => {
  return getSettings()
})

ipcMain.handle('settings:save', (_, settings) => {
  saveSettings(settings)
  return true
})


  ipcMain.handle('manager:open-main', () => {
    createWindow()
  })

  let floatingNotesVisible = true

  ipcMain.handle('manager:toggle-visibility', () => {
    const notes = getNotes()
    const settings = getSettings()
    console.log('manager:toggle-visibility called, notes count:', notes.length, 'maxFloatingNotes:', settings?.maxFloatingNotes, 'visible:', floatingNotesVisible)

    if (floatingNotesVisible) {
      hideFloatingNotes()
      floatingNotesVisible = false
      console.log('floating notes hidden')
    } else {
      showFloatingNotes(notes, settings?.maxFloatingNotes)
      floatingNotesVisible = true
      console.log('floating notes shown')
    }

    return floatingNotesVisible
  })

  // Initial show on startup
  const initialNotes = getNotes()
  const initialSettings = getSettings()
  showFloatingNotes(initialNotes, initialSettings?.maxFloatingNotes)

  ipcMain.handle('manager:magnet', () => {
    import('./floatingNotesWindow.js').then(module => {
      module.rearrangeNotes()
    })
  })

  ipcMain.handle('manager:close-widget', () => {
    hideFloatingNotes()
    closeFloatingManagerWindow()
  })

  createFloatingManagerWindow()


  // create note window
  ipcMain.handle('note:create-window', () => {
    createQuickNoteWindow()
  })

  ipcMain.handle('note:open-preview', (_, noteId) => {
    createFloatingNotePreviewWindow(noteId)
  })

  // main app
  ipcMain.handle('notes:load', () => {
    return getNotes()
  })

  ipcMain.handle('notes:save', (_, notes) => {
    saveNotes(notes)
    return true
  })

  createWindow()
})