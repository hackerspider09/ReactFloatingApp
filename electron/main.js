import electron from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { getNotes, saveNotes, getSettings, saveSettings } from '../src/data/store.js'

import { createFloatingManagerWindow, closeFloatingManagerWindow } from './floatingManagerWindow.js'
import { createQuickNoteWindow } from './quickNoteWindow.js'

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

  ipcMain.handle('manager:toggle-visibility', () => {
    console.log('toggle note visibility later')
  })

  ipcMain.handle('manager:magnet', () => {
    console.log('magnet/rearrange notes later')
  })

  ipcMain.handle('manager:close-widget', () => {
    closeFloatingManagerWindow()
  })

  createFloatingManagerWindow()


  // create note window
  ipcMain.handle('note:create-window', () => {
    createQuickNoteWindow()
  })

  
  // main app
  ipcMain.handle('notes:load', () => {
    
    // electron store clear ~/.config/ElectronFloatingNote/config.json or below
    // saveNotes([])
    // return []
    
    const notes = getNotes()
    console.log('loaded notes:', notes)
    return notes
  })

  ipcMain.handle('notes:save', (_, notes) => {
    console.log('notes received in main process:', notes)

    saveNotes(notes)

    console.log('notes saved')

    return true
  })

  createWindow()
})