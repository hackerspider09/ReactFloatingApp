import electron from 'electron'

const { BrowserWindow, screen } = electron

const floatingWindows = new Map()

export function showFloatingNotes(notes, maxCount = 5) {
  hideFloatingNotes()

  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  const visibleNotes = notes.slice(0, Math.min(maxCount, 12))

  visibleNotes.forEach((note, index) => {
    const win = new BrowserWindow({
      width: 90,
      height: 90,
      x: width - 110,
      y: height - 220 - index * 100,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      resizable: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      movable: true,
      webPreferences: {
        preload: new URL('./preload.js', import.meta.url).pathname,
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    win.loadURL(`http://localhost:5173/#/floating-note/${note.id}`)

    win.on('closed', () => {
      floatingWindows.delete(note.id)
    })

    floatingWindows.set(note.id, win)
  })
}

export function hideFloatingNotes() {
  floatingWindows.forEach((win) => win.close())
  floatingWindows.clear()
}