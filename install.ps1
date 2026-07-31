Write-Host "🚀 Installing Antigravity Supervisor MCP..." -ForegroundColor Cyan

# 1. Install dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
try {
    pip install -r requirements.txt
} catch {
    Write-Host "❌ Error: pip failed. Please ensure Python is installed and in your PATH." -ForegroundColor Red
    exit 1
}

# 2. Generate schemas
Write-Host "⚙️ Generating static JSON schemas..." -ForegroundColor Yellow
try {
    python sync_schemas.py
} catch {
    Write-Host "❌ Error generating schemas." -ForegroundColor Red
    exit 1
}

# 3. Inject Config
Write-Host "💉 Injecting MCP Server into IDE configuration..." -ForegroundColor Yellow
try {
    python install_helper.py
} catch {
    Write-Host "❌ Error injecting config." -ForegroundColor Red
    exit 1
}

# 4. Success
Write-Host "✅ Installation complete! The Orchestrator Skill is ready to use." -ForegroundColor Green
Write-Host "👉 Note: You must restart your Antigravity IDE or Claude Desktop for the new MCP to load." -ForegroundColor Magenta
