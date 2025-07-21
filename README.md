# App Mapos Kiosk Application

A Tauri-based kiosk application that displays https://app.mapos.com.tr in fullscreen mode with automated printing capabilities.

## Features

- **Kiosk Mode**: Runs in fullscreen without window decorations
- **Always on Top**: Prevents other applications from covering the window
- **Skip Taskbar**: Doesn't appear in the taskbar for a cleaner kiosk experience
- **Automated Printing**: Handles print requests without user intervention
- **External URL Loading**: Loads the Mapos application directly from the web

## Prerequisites

- Node.js (v16 or later)
- pnpm
- Rust (for Tauri)
- Windows (as configured)

## Quick Start

### Development Mode
```bash
# Run the PowerShell script
.\dev-kiosk.ps1

# Or manually:
pnpm install
pnpm tauri dev
```

### Production Build
```bash
# Run the PowerShell script
.\build-kiosk.ps1

# Or manually:
pnpm install
pnpm tauri build
```

## Configuration

The application is configured to:
- Open in fullscreen kiosk mode
- Load https://app.mapos.com.tr
- Enable automated printing
- Prevent window closing (can be modified in `src-tauri/src/lib.rs`)

### Customizing the URL
To change the target URL, modify the `src` attribute in `src/App.tsx`:
```tsx
<iframe src="https://your-new-url.com" ... />
```

### Kiosk Settings
Kiosk behavior can be adjusted in `src-tauri/tauri.conf.json`:
- `fullscreen`: true/false
- `decorations`: true/false (window borders)
- `alwaysOnTop`: true/false
- `skipTaskbar`: true/false

## Build Output

After building, the executable will be located in:
```
src-tauri/target/release/appmapos.exe
```

## Printing

The application includes:
- Automatic print handling without dialogs
- Print shortcuts (Ctrl+P) override
- Cross-frame printing support

## Security Notes

- The application disables CSP (Content Security Policy) to allow iframe loading
- External URL loading is permitted for the target domain
- Shell access is enabled for potential future features

## Troubleshooting

1. **CORS Issues**: The iframe may have CORS restrictions, but the application will still function
2. **Print Permissions**: On first run, the browser may request print permissions
3. **Fullscreen**: If fullscreen doesn't work, check display driver settings

## File Structure

```
src/
  App.tsx          # Main React component with kiosk logic
  App.css          # Kiosk-specific styles
  main.tsx         # React entry point

src-tauri/
  src/
    lib.rs         # Rust backend with kiosk commands
    main.rs        # Application entry point
  tauri.conf.json  # Tauri configuration
  Cargo.toml       # Rust dependencies
```

## Scripts

- `dev-kiosk.ps1`: Start development server
- `build-kiosk.ps1`: Build production executable
- `pnpm tauri dev`: Manual development start
- `pnpm tauri build`: Manual production build
