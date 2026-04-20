# Floating Notes

A lightweight, cross-platform desktop application for floating sticky notes. Notes appear as small widgets on your desktop that you can click to preview, edit, or delete. Manage all your notes from a clean dashboard interface.

## Features

- **Floating Note Widgets** — Small, always-on-top note widgets on your desktop
- **Quick Note Creation** — Create notes from the floating widget without opening the main app
- **Note Preview** — Click any floating note to see a full preview with edit/delete options
- **Multiple Preview Windows** — Open several note previews simultaneously
- **Real-time Sync** — All windows stay in sync (dashboard, widgets, previews)
- **Launch on Startup** — Optionally start with your OS
- **Delete Confirmation** — Optional confirmation prompt before deleting
- **No Admin Permissions** — Installs to user directory, no elevated privileges needed

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v22 or later
- npm (comes with Node.js)

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

```bash
npm run dev
```

This starts both the Vite dev server and the Electron app concurrently.

---

## Building for Distribution

### Build for Linux

```bash
npm run dist:linux
```

**Output** (in `release/` directory):
- `Floating Notes-1.0.0.AppImage` — Portable, no installation required
- `floating-notes_1.0.0_amd64.deb` — Debian/Ubuntu package

### Build for Windows

```bash
npm run dist:win
```

**Output** (in `release/` directory):
- `Floating Notes Setup 1.0.0.exe` — NSIS installer (user-level, no admin needed)

### Build for All Platforms

```bash
npm run dist:all
```

> **Note**: Cross-compilation has limitations. Building Windows packages from Linux requires Wine. Building macOS packages requires a macOS machine.

---

## Installation Guide

### Linux

#### AppImage (Recommended — No Installation)

1. Download the `.AppImage` file from the releases.
2. Make it executable:
   ```bash
   chmod +x "Floating Notes-1.0.0.AppImage"
   ```
3. Run it:
   ```bash
   ./"Floating Notes-1.0.0.AppImage"
   ```

#### Debian/Ubuntu (.deb)

1. Download the `.deb` file.
2. Install it:
   ```bash
   sudo dpkg -i floating-notes_1.0.0_amd64.deb
   ```
3. Launch from your application menu or run:
   ```bash
   floating-notes
   ```

### Windows

1. Download the `Floating Notes Setup 1.0.0.exe` installer.
2. Run the installer — it does **not** require administrator privileges.
3. Choose your installation directory (defaults to user AppData).
4. Launch from the Start Menu or Desktop shortcut.

---

## Configuration

All settings are accessible from the **Settings** page in the main dashboard:

| Setting | Description | Default |
|---|---|---|
| Max Floating Notes | Number of floating widgets on desktop | 5 |
| Delete Confirmation | Show prompt before deleting a note | Off |
| Launch on Startup | Auto-start with your operating system | Off |

---

## Uninstallation

### Linux

#### AppImage
Simply delete the `.AppImage` file. To also remove app data:
```bash
rm -rf ~/.config/floating-notes
```

#### Debian/Ubuntu (.deb)
```bash
sudo dpkg -r floating-notes
# Remove app data
rm -rf ~/.config/floating-notes
```

### Windows

1. Open **Settings → Apps → Installed Apps**.
2. Find **Floating Notes** and click **Uninstall**.
3. To also remove app data, delete:
   ```
   %APPDATA%\floating-notes
   ```

---

## Data Storage

The app uses `electron-store` to persist notes and settings as JSON files. No external database is required.

| OS | Data Location |
|---|---|
| **Linux** | `~/.config/floating-notes/` |
| **Windows** | `%APPDATA%\floating-notes\` |

Inside this directory you'll find:
- `floating-notes.json` — All your notes and settings

> **Tip**: You can back up or transfer your notes by copying this file.

---

## Tech Stack

- **Electron** — Cross-platform desktop framework
- **React** — UI framework
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling
- **electron-store** — Persistent settings and notes storage
- **electron-builder** — Packaging and distribution
