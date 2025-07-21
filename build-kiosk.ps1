# Build script for Kiosk App
Write-Host "Building Tauri Kiosk App for Mapos..." -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
pnpm tauri build

Write-Host "Build completed! The executable can be found in src-tauri/target/release/" -ForegroundColor Green
Write-Host "To run in development mode, use: pnpm tauri dev" -ForegroundColor Cyan
