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

---

## Bundle Size Notes

Electron apps are inherently large because they embed a full Chromium engine. The irreducible minimum is ~200 MB (the Electron binary itself). Here's how this project keeps the **app-specific** portion small:

### Why deps are split the way they are

| Package | Location | Reason |
|---------|----------|--------|
| `react`, `react-dom`, `react-icons` | `devDependencies` | Vite bundles these into `dist/` at build time — they are NOT needed at runtime |
| `@tailwindcss/vite`, `tailwindcss` | `devDependencies` | CSS-only build tool, output is already in `dist/index.css` |
| `electron-store` | `dependencies` | Used by the Electron main process at runtime — must be present in production |

### What was excluded from the installer

- `dxcompiler.dll` (~24 MB) — DirectX shader compiler, only needed for WebGPU apps
- `LICENSES.chromium.html` (~18 MB) — Chromium license text file, not needed at runtime
- `node_modules/**/*` removed from `files` — electron-builder now only auto-includes production `dependencies` (just `electron-store`)

### Size breakdown (Windows, after optimizations)

| Component | Size | Notes |
|-----------|------|-------|
| `FloatNote.exe` (Electron binary) | ~213 MB | Chromium + Node.js — irreducible |
| `app.asar` (your code) | ~5 MB | React app + electron-store only |
| Chromium DLLs + resources | ~60 MB | Irreducible Chromium runtime |
| **Total installed** | **~280 MB** | Down from ~449 MB |

> Further reduction is only possible by switching away from Electron entirely (e.g. Tauri uses the OS WebView instead of bundling Chromium, resulting in ~10 MB installers).
