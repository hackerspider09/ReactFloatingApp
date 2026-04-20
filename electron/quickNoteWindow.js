import electron from 'electron'

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
    width: 520,
    height: 520,
    x: width - 560,
    y: height - 620,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    movable: true,
    webPreferences: {
      preload: new URL('./preload.js', import.meta.url).pathname,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  quickNoteWindow.loadURL('http://localhost:5173/#/quick-note')
  quickNoteWindow.webContents.openDevTools({ mode: 'detach' })

  quickNoteWindow.once('ready-to-show', () => {
    quickNoteWindow.show()
  })

  quickNoteWindow.on('closed', () => {
    quickNoteWindow = null
  })
}