import electron from 'electron'
import { getNotes } from '../src/data/store.js'

const { BrowserWindow, screen } = electron

let floatingNotePreviewWindow = null

export function createFloatingNotePreviewWindow(noteId) {
  if (floatingNotePreviewWindow) {
    floatingNotePreviewWindow.focus()
    return
  }

  const notes = getNotes()
  const note = notes.find((n) => n.id === noteId)
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  const windowWidth = 520
  const windowHeight = 550
  const x = note?.x
    ? Math.max(note.x - windowWidth - 12, 12)
    : Math.max(width - windowWidth - 12, 12)
  const y = note?.y ?? 100

  floatingNotePreviewWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x,
    y,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    movable: true,
    show: false,
    webPreferences: {
      preload: new URL('./preload.js', import.meta.url).pathname,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  floatingNotePreviewWindow.loadURL(`http://localhost:5173/#/floating-note-preview/${noteId}`)

  floatingNotePreviewWindow.once('ready-to-show', () => {
    floatingNotePreviewWindow.show()
    floatingNotePreviewWindow.setAlwaysOnTop(true)
    floatingNotePreviewWindow.setSkipTaskbar(true)
  })

  floatingNotePreviewWindow.on('closed', () => {
    floatingNotePreviewWindow = null
  })
}
