# Development script for Kiosk App
Write-Host "Starting Tauri Kiosk App in development mode..." -ForegroundColor Green

# Install dependencies if not already installed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pnpm install
}

# Start development server
Write-Host "Starting development server..." -ForegroundColor Yellow
pnpm tauri dev
