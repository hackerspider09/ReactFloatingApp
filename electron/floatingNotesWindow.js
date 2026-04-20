import electron from 'electron'
import { getSettings, getNotes, saveNotes } from '../src/data/store.js'

const { BrowserWindow, screen } = electron

const floatingWindows = new Map()

export function showFloatingNotes(notes, maxCount) {
  hideFloatingNotes()

  const settings = getSettings()
  const visibleCount = maxCount ?? settings?.maxFloatingNotes ?? 5

  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  const allNotes = getNotes()
  const visibleNotes = allNotes.slice(0, Math.min(visibleCount, 12))

  visibleNotes.forEach((note, index) => {
    const xPos = width - 90
    const yPos = 20 + index * 85
    console.log('creating floating note window for note id:', note.id, 'position:', xPos, yPos)

    const win = new BrowserWindow({
      width: 80,
      height: 70,
      x: xPos,
      y: yPos,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      resizable: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      type: 'toolbar',
      movable: true,
      focusable: true,
      show: true,
      webPreferences: {
        preload: new URL('./preload.js', import.meta.url).pathname,
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    const url = `http://localhost:5173/#/floating-note/${note.id}`
    win.loadURL(url)
    console.log('floating note window loadURL:', url)

    // Update note with position
    note.x = xPos
    note.y = yPos

    win.once('ready-to-show', () => {
      console.log('floating note ready-to-show:', note.id)
      win.show()
      win.setAlwaysOnTop(true)
      win.setSkipTaskbar(true)
    })

    win.on('closed', () => {
      floatingWindows.delete(note.id)
      console.log('floating note window closed:', note.id)
    })

    floatingWindows.set(note.id, win)
  })

  // Save notes with updated positions
  saveNotes(allNotes)
}

export function hideFloatingNotes() {
  floatingWindows.forEach((win) => win.close())
  floatingWindows.clear()
}

export function rearrangeNotes() {
  const display = screen.getPrimaryDisplay()
  const { width } = display.workAreaSize
  
  const allNotes = getNotes()
  
  let index = 0
  floatingWindows.forEach((win, id) => {
    const xPos = width - 90
    const yPos = 20 + index * 85
    win.setPosition(xPos, yPos)
    
    // Update store for persistence
    const note = allNotes.find(n => n.id === id)
    if (note) {
      note.x = xPos
      note.y = yPos
    }
    
    index++
  })
  
  saveNotes(allNotes)
}