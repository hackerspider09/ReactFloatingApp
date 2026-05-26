# FloatNote — Developer Guide

## Running Locally (Development)

```bash
npm install
npm run dev
```

This starts the Vite dev server and Electron together with hot-reload.

---

## Building & Releasing

Releases are handled by **GitHub Actions** — you cannot build Windows installers locally on a Linux machine (or vice versa for certain formats). Push your changes and trigger the workflow.

### Trigger a Release

1. Go to **GitHub → Actions → Build and Release**
2. Click **Run workflow**
3. Enter the version in `v1.0.0` format (e.g. `v1.2.0`)
4. Click **Run workflow**

The version you enter is automatically stamped into `package.json` during the build, so the output files will be named accordingly.

---

## Release Artifacts

### Windows

| File | Format | How to use |
|------|--------|------------|
| `FloatNote Setup 1.0.0.exe` | NSIS Installer | Double-click → follow installer → launch from Start Menu / Desktop |

> **Why only the installer?** Electron on Windows is NOT a single portable `.exe`. It needs `icudtl.dat`, `ffmpeg.dll`, and ~50 other Chromium DLLs alongside it. The NSIS installer bundles and installs all of these correctly. Running a bare `FloatNote.exe` without its companion files causes the `Invalid file descriptor to ICU data received` error.

---

### Linux (enable in workflow to produce)

| File | Format | How to use |
|------|--------|------------|
| `FloatNote-1.0.0.AppImage` | AppImage | `chmod +x FloatNote*.AppImage` then double-click or run directly — no install needed |
| `floatnote_1.0.0_amd64.deb` | Debian package | `sudo dpkg -i floatnote_*.deb` — installs system-wide with desktop entry |

> **AppImage** is fully portable (bundles everything). Works on any modern Linux distro without installing.  
> **deb** integrates with the system (appears in app launcher, can be uninstalled via `apt remove floatnote`).

---

## Enabling Linux Builds

The Linux build job is already written in the workflow — just uncomment it:

```yaml
# build-linux:        ← remove the # from this and all lines below it
#   runs-on: ubuntu-latest
#   ...
```

File: [`.github/workflows/build-and-release.yaml`](.github/workflows/build-and-release.yaml)

---

## Build Targets (electron-builder config in `package.json`)

| Platform | Target | Output |
|----------|--------|--------|
| Windows  | `nsis` | `FloatNote Setup x.x.x.exe` |
| Linux    | `AppImage` | `FloatNote-x.x.x.AppImage` |
| Linux    | `deb` | `floatnote_x.x.x_amd64.deb` |

---

## Project Structure

```
.
├── electron/          # Electron main process (Node.js)
│   ├── main.js        # App entry point, IPC handlers
│   ├── preload.cjs    # Secure bridge between renderer & main
│   └── utils.js       # URL/path helpers
├── src/               # React renderer (UI)
├── public/            # Static assets
├── build/             # Icons used by electron-builder
│   ├── icon.ico       # Windows icon
│   └── icon.png       # Linux icon
├── dist/              # Vite build output (generated)
├── release/           # electron-builder output (generated)
└── .github/workflows/ # CI/CD pipelines
```
