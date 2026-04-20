import electron from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { getNotes, saveNotes, getSettings, saveSettings } from '../src/data/store.js'
import { getURL, getPreloadPath } from './utils.js'

import { createFloatingManagerWindow, closeFloatingManagerWindow } from './floatingManagerWindow.js'
import { createQuickNoteWindow } from './quickNoteWindow.js'
import { showFloatingNotes, hideFloatingNotes } from './floatingNotesWindow.js'
import { createFloatingNotePreviewWindow } from './floatingNotePreviewWindow.js'

const { app, BrowserWindow, ipcMain } = electron

let mainWindow = null

// Prevent multiple instances — focus existing window instead
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus()
    return
  }
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.loadURL(getURL())

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  ipcMain.handle('settings:load', () => {
    return getSettings()
  })

  ipcMain.handle('settings:save', (_, settings) => {
    saveSettings(settings)
    return true
  })

  ipcMain.handle('settings:set-autolaunch', (_, enabled) => {
    app.setLoginItemSettings({ openAtLogin: enabled })
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
    floatingNotesVisible = false
    closeFloatingManagerWindow()
  })

  ipcMain.handle('manager:open-widget', () => {
    createFloatingManagerWindow()
    
    // Auto-restore notes if they were hidden by closing the manager
    const notes = getNotes()
    const settings = getSettings()
    showFloatingNotes(notes, settings?.maxFloatingNotes)
    floatingNotesVisible = true
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

  ipcMain.handle('notes:save', (event, notes) => {
    saveNotes(notes)

    // Broadcast to all other windows except the sender (optional, but let's do all for simplicity)
    BrowserWindow.getAllWindows().forEach((win) => {
      // Don't send to the window that just sent the save request to avoid loop if not handled
      if (win.webContents !== event.sender) {
        win.webContents.send('notes-updated', notes)
      }
    })

    if (floatingNotesVisible) {
      const settings = getSettings()
      showFloatingNotes(notes, settings?.maxFloatingNotes)
    }
    return true
  })

  createWindow()
})