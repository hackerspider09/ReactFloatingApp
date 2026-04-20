import electron from 'electron'
import { getURL, getPreloadPath } from './utils.js'

const { BrowserWindow, screen } = electron

let quickNoteWindow = null

export function createQuickNoteWindow() {
  if (quickNoteWindow) {
    quickNoteWindow.focus()
    return
  }

  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  quickNoteWindow = new BrowserWindow({
    width: 550,
    height: 650,
    x: width - 580,
    y: height - 680,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    type: 'toolbar',
    show: false,
    movable: true,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  quickNoteWindow.loadURL(getURL('quick-note'))

  quickNoteWindow.once('ready-to-show', () => {
    quickNoteWindow.show()
  })

  quickNoteWindow.on('closed', () => {
    quickNoteWindow = null
  })
}