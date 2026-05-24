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

export function resizeManagerWindow(newWidth, newHeight) {
  if (floatingManagerWindow && !floatingManagerWindow.isDestroyed()) {
    const [oldX, oldY] = floatingManagerWindow.getPosition()
    const [oldW, oldH] = floatingManagerWindow.getSize()
    // Anchor bottom-right: gear icon stays at same screen position
    const newX = oldX + oldW - newWidth
    const newY = oldY + oldH - (newHeight || oldH)
    floatingManagerWindow.setBounds({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight || oldH,
    })
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