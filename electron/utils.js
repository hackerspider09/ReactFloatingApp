import { app } from 'electron'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Returns the correct URL for a given hash route.
 * In development, uses the Vite dev server.
 * In production, uses the built index.html file.
 * @param {string} [hash] - The hash route (e.g., 'floating-manager', 'floating-note/123')
 * @returns {string} The full URL to load
 */
export function getURL(hash) {
  if (isDev) {
    return hash ? `http://localhost:5173/#/${hash}` : 'http://localhost:5173'
  }

  const indexPath = path.join(app.getAppPath(), 'dist', 'index.html')
  return hash ? `file://${indexPath}#/${hash}` : `file://${indexPath}`
}

/**
 * Returns the absolute path to preload.js.
 * Works in both development and production (asar) environments.
 * @returns {string}
 */
export function getPreloadPath() {
  return path.join(app.getAppPath(), 'electron', 'preload.js')
}
