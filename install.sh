#!/usr/bin/env bash
set -e

echo "🚀 Installing Antigravity Supervisor MCP..."

# 1. Install dependencies
if command -v pip &> /dev/null; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
elif command -v pip3 &> /dev/null; then
    echo "📦 Installing Python dependencies..."
    pip3 install -r requirements.txt
else
    echo "❌ Error: pip could not be found. Please install Python and pip."
    exit 1
fi

# 2. Generate schemas
echo "⚙️ Generating static JSON schemas..."
if command -v python &> /dev/null; then
    python sync_schemas.py
else
    python3 sync_schemas.py
fi

# 3. Inject Config
echo "💉 Injecting MCP Server into IDE configuration..."
if command -v python &> /dev/null; then
    python install_helper.py
else
    python3 install_helper.py
fi

# 4. Success
echo "✅ Installation complete! The Orchestrator Skill is ready to use."
echo "👉 Note: You must restart your Antigravity IDE or Claude Desktop for the new MCP to load."
