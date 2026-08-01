Write-Host "🚀 Installing Antigravity Supervisor MCP..." -ForegroundColor Cyan

$InstallDir = Join-Path $HOME "antigravity-supervisor"
$RepoUrl = "https://github.com/Inferno-Aditya/antigravity-mcp.git"

# 1. Download or Update Repository
if (Test-Path $InstallDir) {
    Write-Host "📦 Directory exists. Updating repository..." -ForegroundColor Yellow
    Set-Location $InstallDir
    try {
        git pull origin main
    } catch {
        Write-Host "❌ Error updating repository." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "📦 Cloning repository to $InstallDir..." -ForegroundColor Yellow
    try {
        git clone $RepoUrl $InstallDir
        Set-Location $InstallDir
    } catch {
        Write-Host "❌ Error cloning repository." -ForegroundColor Red
        exit 1
    }
}

# 2. Install dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
try {
    pip install -r requirements.txt
} catch {
    Write-Host "❌ Error: pip failed. Please ensure Python is installed and in your PATH." -ForegroundColor Red
    exit 1
}

# 3. Generate schemas
Write-Host "⚙️ Generating static JSON schemas..." -ForegroundColor Yellow
try {
    python sync_schemas.py
} catch {
    Write-Host "❌ Error generating schemas." -ForegroundColor Red
    exit 1
}

# 4. Inject Config
Write-Host "💉 Injecting MCP Server into IDE configuration..." -ForegroundColor Yellow
try {
    python install_helper.py
} catch {
    Write-Host "❌ Error injecting config." -ForegroundColor Red
    exit 1
}

# 5. Success
Write-Host "✅ Installation complete! The Orchestrator Skill is ready to use." -ForegroundColor Green
Write-Host "👉 Note: You must restart your Antigravity IDE or Claude Desktop for the new MCP to load." -ForegroundColor Magenta
