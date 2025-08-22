Write-Host "Starting AgroMind Grow..." -ForegroundColor Green
Write-Host ""

# Set the local Node.js path
$env:PATH = "$PWD\local-node\node-v22.18.0-win-x64;$env:PATH"

# Check if node_modules exists, if not install dependencies
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start the development server
Write-Host "Starting development server on http://localhost:8080" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
npm run dev
