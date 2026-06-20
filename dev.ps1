# Kilai local dev — starts API server + Vite frontend concurrently
# Usage: .\dev.ps1
# Requires: DATABASE_URL set in your shell (or .env file loaded before running)
#
# Ports:
#   API server  → http://localhost:3001
#   Frontend    → http://localhost:5173  (proxies /api to 3001)

$env:NODE_ENV  = "development"
$env:LOG_LEVEL = "info"

# ── API server ────────────────────────────────────────────────────────────────
$env:PORT      = "3001"
$env:BASE_PATH = "/api"

Write-Host ""
Write-Host "  Kilai dev" -ForegroundColor Green
Write-Host "  API server  → http://localhost:3001" -ForegroundColor Cyan
Write-Host "  Frontend    → http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

if (-not $env:DATABASE_URL) {
    Write-Host "  WARNING: DATABASE_URL not set — API returns 503 for /trays and /varieties" -ForegroundColor Yellow
    Write-Host "  Set it before running: `$env:DATABASE_URL = 'postgresql://user:pass@localhost:5432/kilai'" -ForegroundColor Yellow
    Write-Host ""
}

$apiJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:NODE_ENV  = "development"
    $env:PORT      = "3001"
    $env:BASE_PATH = "/api"
    $env:DATABASE_URL = $using:env:DATABASE_URL
    pnpm --filter @workspace/api-server dev
}

# ── Frontend ──────────────────────────────────────────────────────────────────
$env:PORT      = "5173"
$env:BASE_PATH = "/"
$env:API_PORT  = "3001"

# Stream API job output in background while Vite runs in the foreground
$null = Register-ObjectEvent -InputObject $apiJob -EventName StateChanged -Action {
    if ($Event.Sender.State -in 'Failed','Completed') {
        Write-Host "[api-server] process exited" -ForegroundColor Red
    }
}

try {
    pnpm --filter @workspace/kilai dev
} finally {
    Stop-Job  $apiJob
    Remove-Job $apiJob -Force
}
