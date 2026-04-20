import electron from 'electron'
import { getNotes } from '../src/data/store.js'
import { getURL, getPreloadPath } from './utils.js'

const { BrowserWindow, screen } = electron

const previewWindows = new Map()

export function createFloatingNotePreviewWindow(noteId) {
  if (previewWindows.has(noteId)) {
    previewWindows.get(noteId).focus()
    return
  }

  const notes = getNotes()
  const note = notes.find((n) => n.id === noteId)
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  const windowWidth = 520
  const windowHeight = 650
  const x = note?.x
    ? Math.max(note.x - windowWidth - 12, 12)
    : Math.max(width - windowWidth - 12, 12)
  const y = note?.y ?? 100

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x,
    y,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    type: 'toolbar',
    focusable: true,
    show: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  previewWindows.set(noteId, win)

  win.loadURL(getURL(`floating-note-preview/${noteId}`))

  win.once('ready-to-show', () => {
    win.show()
    win.setAlwaysOnTop(true)
    win.setSkipTaskbar(true)
  })

  win.on('closed', () => {
    previewWindows.delete(noteId)
  })
}
