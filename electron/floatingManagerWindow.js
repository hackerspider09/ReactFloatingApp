import electron from 'electron'

const { BrowserWindow, screen } = electron

let floatingManagerWindow = null

export function createFloatingManagerWindow() {
  if (floatingManagerWindow) {
    floatingManagerWindow.focus()
    return floatingManagerWindow
  }

  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  floatingManagerWindow = new BrowserWindow({
    width: 320,
    height: 110,
    x: width - 340,
    y: height - 120,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    // type: 'toolbar',
    focusable: true,
    show: false,
    movable: true,
    hasShadow: true,
    webPreferences: {
      preload: new URL('./preload.js', import.meta.url).pathname,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

floatingManagerWindow.loadURL('http://localhost:5173/#/floating-manager')

floatingManagerWindow.once('ready-to-show', () => {
  floatingManagerWindow.setSkipTaskbar(true)
  floatingManagerWindow.show()
})

  return floatingManagerWindow
}

export function closeFloatingManagerWindow() {
  if (floatingManagerWindow) {
    floatingManagerWindow.close()
    floatingManagerWindow = null
  }
}