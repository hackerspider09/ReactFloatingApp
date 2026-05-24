# FloatNote — Build & Testing Guide

How to build, test, and verify FloatNote works correctly on Linux and Windows.

---

## Build Commands

| Command | What it does |
|---|---|
| `npm run dist:linux` | Builds Vite + packages AppImage & .deb |
| `npm run dist:win` | Builds Vite + packages Windows .exe installer |
| `npm run dist:all` | Builds for both Linux and Windows |

> **Common mistake**: Don't run `npm run build dist:linux`. The correct command is `npm run dist:linux` (no space between `build` and the platform). The `dist:*` scripts already run `vite build` internally.

Output files go to the `release/` directory.

---

## Testing the Built App

### Linux

#### AppImage

```bash
cd release/
chmod +x FloatNote-1.0.0.AppImage
./FloatNote-1.0.0.AppImage
```

If you get a sandbox error, run with `--no-sandbox`:

```bash
./FloatNote-1.0.0.AppImage --no-sandbox
```

#### .deb Package

```bash
sudo dpkg -i release/floatnote_1.0.0_amd64.deb
floatnote
```

After installing the `.deb`, FloatNote appears in your application menu.

### Windows

1. Go to `release/` and run `FloatNote Setup 1.0.0.exe`
2. The installer does NOT need admin permissions — it installs to `%LOCALAPPDATA%\Programs\FloatNote\`
3. After install, launch from the Start Menu shortcut or desktop shortcut

---

## How Startup (Auto-Launch) Works

FloatNote has a **"Launch on Startup"** toggle in **Settings**. Here's what happens on each OS when you enable it:

### Under the Hood

The app calls Electron's built-in API:

```js
app.setLoginItemSettings({ openAtLogin: true })
```

This is a native Electron API — no third-party packages needed. Electron handles the OS-specific details automatically.

### Linux Behavior

When you enable "Launch on Startup":
- Electron creates a `.desktop` file in `~/.config/autostart/`
- The file name matches your app name (e.g., `floatnote.desktop`)
- This is the standard [XDG Autostart](https://specifications.freedesktop.org/autostart-spec/latest/) mechanism

**To verify it's registered:**

```bash
ls ~/.config/autostart/
cat ~/.config/autostart/floatnote.desktop
```

You should see something like:

```ini
[Desktop Entry]
Type=Application
Name=FloatNote
Exec=/path/to/FloatNote-1.0.0.AppImage
```

**To manually remove it:**

```bash
rm ~/.config/autostart/floatnote.desktop
```

> **Note**: For AppImage, the `Exec` path points to wherever the AppImage file is located. If you move the AppImage after enabling startup, auto-launch will break — you'll need to toggle it off and on again from Settings.

> **Note**: For `.deb` installs, the `Exec` path points to the system-installed binary (usually `/usr/bin/floatnote` or `/opt/FloatNote/floatnote`), so moving files isn't an issue.

### Windows Behavior

When you enable "Launch on Startup":
- Electron adds an entry to the Windows Registry under:
  ```
  HKCU\Software\Microsoft\Windows\CurrentVersion\Run
  ```
- The registry key name is your app name (`FloatNote`)
- The value is the full path to the installed `.exe`

**To verify it's registered:**

1. Press `Win + R`, type `regedit`, press Enter
2. Navigate to `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run`
3. Look for a `FloatNote` entry — its value should be the path to the exe

Or from PowerShell:

```powershell
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" | Select-Object FloatNote
```

**To manually remove it:**

```powershell
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "FloatNote"
```

> **Note**: Since the app installs per-user (`HKCU`, not `HKLM`), no admin privileges are needed for startup registration.

---

## How to Test Startup Works After Building

### Quick Test (Without Rebooting)

1. Build and install the app (`npm run dist:linux` or `npm run dist:win`)
2. Launch the app
3. Go to **Settings → Launch on Startup** and toggle it **ON**
4. Verify the startup entry was created:
   - **Linux**: Check `~/.config/autostart/` for the `.desktop` file
   - **Windows**: Check the registry key (see above)
5. Close the app completely
6. Run the startup entry manually to confirm it launches:
   - **Linux**: `gtk-launch floatnote` or run the `Exec` command from the `.desktop` file
   - **Windows**: Double-click the exe path from the registry value

### Full Test (With Reboot)

1. Follow steps 1-4 above
2. Reboot your machine
3. After login, FloatNote should appear automatically:
   - The floating manager widget should be visible at the bottom-right
   - Floating note widgets should appear on the right edge of your screen
4. To disable: Open Settings and toggle "Launch on Startup" **OFF**

---

## Troubleshooting

### Linux: Sandbox Error on Launch

```
The SUID sandbox helper binary was found, but is not configured correctly
```

**Fix**: Run with `--no-sandbox` flag, or fix sandbox permissions:

```bash
sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```

For packaged AppImage, use `--no-sandbox` as the AppImage extracts to a temp directory.

### Linux: App Doesn't Start on Boot

- Check if `.desktop` file exists in `~/.config/autostart/`
- Check if the `Exec` path in the `.desktop` file is still valid
- For AppImage: make sure you haven't moved the AppImage file after enabling startup

### Windows: IPC Errors

If you see IPC-related errors in the packaged Windows build, the preload script may not be loading. Ensure:
- The preload file is `preload.cjs` (not `.js`) — since `package.json` has `"type": "module"`, `.js` files are treated as ESM, but preload scripts must be CommonJS
- The `electron/preload.cjs` file is included in the `build.files` array in `package.json`

### Windows: App Doesn't Start on Boot

- Check the registry entry exists (see Windows Behavior section above)
- If the app was uninstalled and reinstalled to a different path, the old registry entry may point to a stale path — toggle startup off and on again

### Data Location

If you need to inspect or reset app data:

| OS | Path |
|---|---|
| Linux | `~/.config/floatnote/floatnote.json` |
| Windows | `%APPDATA%\floatnote\floatnote.json` |
