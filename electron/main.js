import electron from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { getNotes, saveNotes, getSettings, saveSettings } from '../src/data/store.js'
import { getURL, getPreloadPath } from './utils.js'

import { createFloatingManagerWindow, closeFloatingManagerWindow, resetManagerPosition, resizeManagerWindow } from './floatingManagerWindow.js'
import { createQuickNoteWindow } from './quickNoteWindow.js'
import { showFloatingNotes, hideFloatingNotes } from './floatingNotesWindow.js'
import { createFloatingNotePreviewWindow } from './floatingNotePreviewWindow.js'

const { app, BrowserWindow, ipcMain } = electron

let mainWindow = null

// Check if launched with --hidden (autostart mode: widget only, no main window)
const isHiddenStart = process.argv.includes('--hidden')

// Prevent multiple instances — focus existing window instead
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    } else {
      // Main window doesn't exist (e.g. widget-only mode), create it
      createWindow()
    }
  })
}

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus()
    return
  }
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(app.getAppPath(), 'build', 'icon.png'),
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.loadURL(getURL())

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Autostart helper — manages ~/.config/autostart/floatnote.desktop
async function setupAutostart(enabled) {
  if (process.platform === 'linux') {
    const { default: fs } = await import('fs')
    const { default: os } = await import('os')

    const autostartDir = path.join(os.homedir(), '.config', 'autostart')
    const autostartFile = path.join(autostartDir, 'floatnote.desktop')
    const systemDesktopFile = '/usr/share/applications/floatnote.desktop'

    if (enabled) {
      // Ensure autostart directory exists
      if (!fs.existsSync(autostartDir)) {
        fs.mkdirSync(autostartDir, { recursive: true })
      }

      if (fs.existsSync(systemDesktopFile)) {
        // Read system .desktop file and add --hidden flag
        let content = fs.readFileSync(systemDesktopFile, 'utf-8')
        // Add --hidden to the Exec line so autostart only shows widget
        content = content.replace(/^(Exec=.+?)(\s*%U)?$/m, '$1 --hidden$2')
        fs.writeFileSync(autostartFile, content)
      } else {
        // Fallback: create a .desktop file with --hidden
        const desktopContent = `[Desktop Entry]\nName=FloatNote\nExec=${process.execPath} --hidden %U\nTerminal=false\nType=Application\nIcon=floatnote\nStartupWMClass=FloatNote\nComment=A floating sticky notes desktop application\nCategories=Utility;\n`
        fs.writeFileSync(autostartFile, desktopContent)
      }
      console.log('Autostart enabled:', autostartFile)
    } else {
      // Remove the autostart entry
      if (fs.existsSync(autostartFile)) {
        fs.unlinkSync(autostartFile)
        console.log('Autostart disabled:', autostartFile)
      }
    }
  } else {
    // Windows: Electron's built-in API works fine
    app.setLoginItemSettings({ openAtLogin: enabled })
  }
}

app.whenReady().then(() => {
  ipcMain.handle('settings:load', () => {
    return getSettings()
  })

  ipcMain.handle('settings:save', (_, settings) => {
    saveSettings(settings)
    return true
  })

  ipcMain.handle('settings:set-autolaunch', async (_, enabled) => {
    await setupAutostart(enabled)
    return true
  })


  ipcMain.handle('manager:open-main', () => {
    createWindow()
  })

  let floatingNotesVisible = true

  ipcMain.handle('manager:toggle-visibility', () => {
    const notes = getNotes()
    const settings = getSettings()
    console.log('manager:toggle-visibility called, notes count:', notes.length, 'maxFloatingNotes:', settings?.maxFloatingNotes, 'visible:', floatingNotesVisible)

    if (floatingNotesVisible) {
      hideFloatingNotes()
      floatingNotesVisible = false
      console.log('floating notes hidden')
    } else {
      showFloatingNotes(notes, settings?.maxFloatingNotes)
      floatingNotesVisible = true
      console.log('floating notes shown')
    }

    return floatingNotesVisible
  })

  // Auto-setup autostart on first run
  const initialSettings = getSettings()
  if (initialSettings?.launchOnStartup) {
    setupAutostart(true).catch(err => console.error('Auto-setup autostart failed:', err))
  }

  // Initial show on startup
  const initialNotes = getNotes()
  showFloatingNotes(initialNotes, initialSettings?.maxFloatingNotes)

  ipcMain.handle('manager:magnet', () => {
    import('./floatingNotesWindow.js').then(module => {
      module.rearrangeNotes()
    })
    resetManagerPosition()
  })

  ipcMain.handle('manager:close-widget', () => {
    hideFloatingNotes()
    floatingNotesVisible = false
    closeFloatingManagerWindow()
  })

  ipcMain.handle('manager:open-widget', () => {
    createFloatingManagerWindow()
    
    // Auto-restore notes if they were hidden by closing the manager
    const notes = getNotes()
    const settings = getSettings()
    showFloatingNotes(notes, settings?.maxFloatingNotes)
    floatingNotesVisible = true
  })

  ipcMain.handle('manager:resize', (_, width, height) => {
    resizeManagerWindow(width, height)
  })

  createFloatingManagerWindow()

  // Window drag IPC — uses Electron's coordinate system (avoids DPI scaling bugs)
  const dragStartPositions = new Map()

  ipcMain.handle('window:start-drag', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win && !win.isDestroyed()) {
      const [x, y] = win.getPosition()
      dragStartPositions.set(win.id, { x, y })
      return { x, y }
    }
    return null
  })

  ipcMain.on('window:move-drag', (event, dx, dy) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win && !win.isDestroyed() && dragStartPositions.has(win.id)) {
      const start = dragStartPositions.get(win.id)
      win.setPosition(Math.round(start.x + dx), Math.round(start.y + dy))
    }
  })


  // create note window
  ipcMain.handle('note:create-window', () => {
    createQuickNoteWindow()
  })

  ipcMain.handle('note:open-preview', (_, noteId) => {
    createFloatingNotePreviewWindow(noteId)
  })

  // main app
  ipcMain.handle('notes:load', () => {
    return getNotes()
  })

  ipcMain.handle('notes:save', (event, notes) => {
    saveNotes(notes)

    // Broadcast to all other windows except the sender (optional, but let's do all for simplicity)
    BrowserWindow.getAllWindows().forEach((win) => {
      // Don't send to the window that just sent the save request to avoid loop if not handled
      if (win.webContents !== event.sender) {
        win.webContents.send('notes-updated', notes)
      }
    })

    if (floatingNotesVisible) {
      const settings = getSettings()
      showFloatingNotes(notes, settings?.maxFloatingNotes)
    }
    return true
  })

  // Only create main window if NOT in hidden/autostart mode
  if (!isHiddenStart) {
    createWindow()
  }
})