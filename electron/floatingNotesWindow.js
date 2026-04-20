import electron from 'electron'
import { getSettings, getNotes, saveNotes } from '../src/data/store.js'
import { getURL, getPreloadPath } from './utils.js'

const { BrowserWindow, screen } = electron

const floatingWindows = new Map()

export function showFloatingNotes(notes, maxCount) {
  const settings = getSettings()
  const visibleCount = maxCount ?? settings?.maxFloatingNotes ?? 5
  const display = screen.getPrimaryDisplay()
  const { width } = display.workAreaSize

  const visibleNotes = notes.slice(0, Math.min(visibleCount, 12))
  const visibleNoteIds = new Set(visibleNotes.map((n) => n.id))

  // 1. Close windows for notes that should no longer be visible
  for (const [id, win] of floatingWindows.entries()) {
    if (!visibleNoteIds.has(id)) {
      win.close()
      floatingWindows.delete(id)
    }
  }

  // 2. Create or update windows for visible notes
  visibleNotes.forEach((note, index) => {
    const xPos = width - 80
    const yPos = 40 + index * 85
    
    // Update position in note object for persistence later
    note.x = xPos
    note.y = yPos

    if (floatingWindows.has(note.id)) {
      // If window already exists, just update position (if changed)
      const win = floatingWindows.get(note.id)
      const currentPos = win.getPosition()
      if (currentPos[0] !== xPos || currentPos[1] !== yPos) {
        win.setPosition(xPos, yPos)
      }
    } else {
      // If window doesn't exist, create it
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
          preload: getPreloadPath(),
          contextIsolation: true,
          nodeIntegration: false,
        },
      })

      const url = getURL(`floating-note/${note.id}`)
      win.loadURL(url)

      win.once('ready-to-show', () => {
        win.show()
        win.setAlwaysOnTop(true)
        win.setSkipTaskbar(true)
      })

      win.on('closed', () => {
        floatingWindows.delete(note.id)
      })

      floatingWindows.set(note.id, win)
    }
  })

  // Save notes with updated positions if needed (we modified the objects in visibleNotes)
  saveNotes(notes)
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