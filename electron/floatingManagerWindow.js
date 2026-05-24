import electron from 'electron'
import { getURL, getPreloadPath } from './utils.js'

const { BrowserWindow, screen } = electron

let floatingManagerWindow = null

export function createFloatingManagerWindow() {
  if (floatingManagerWindow && !floatingManagerWindow.isDestroyed()) {
    floatingManagerWindow.focus()
    return floatingManagerWindow
  }

  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  floatingManagerWindow = new BrowserWindow({
    width: 44,
    height: 44,
    x: width - 48,
    y: height - 48,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    type: 'toolbar',
    focusable: true,
    show: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  floatingManagerWindow.loadURL(getURL('floating-manager'))

  floatingManagerWindow.once('ready-to-show', () => {
    floatingManagerWindow.setSkipTaskbar(true)
    floatingManagerWindow.show()
  })

  floatingManagerWindow.on('closed', () => {
    floatingManagerWindow = null
  })

  return floatingManagerWindow
}

export function closeFloatingManagerWindow() {
  if (floatingManagerWindow && !floatingManagerWindow.isDestroyed()) {
    floatingManagerWindow.close()
    floatingManagerWindow = null
  }
}

export function resizeManagerWindow(newWidth) {
  if (floatingManagerWindow && !floatingManagerWindow.isDestroyed()) {
    const [oldX] = floatingManagerWindow.getPosition()
    const [oldW] = floatingManagerWindow.getSize()
    // Anchor to the right: shift x so the right edge stays in place
    const newX = oldX + oldW - newWidth
    floatingManagerWindow.setBounds({ x: newX, width: newWidth })
  }
}

export function resetManagerPosition() {
  if (floatingManagerWindow && !floatingManagerWindow.isDestroyed()) {
    const display = screen.getPrimaryDisplay()
    const { width, height } = display.workAreaSize
    const [w] = floatingManagerWindow.getSize()
    floatingManagerWindow.setPosition(width - w - 4, height - 48)
  }
}