import json
import os
import sys

def get_possible_config_paths():
    home = os.path.expanduser("~")
    paths = [
        # Antigravity IDE standard config
        os.path.join(home, ".gemini", "config", "mcp.json"),
        # Claude Desktop (Mac)
        os.path.join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json"),
        # Claude Desktop (Windows)
        os.path.join(os.environ.get("APPDATA", ""), "Claude", "claude_desktop_config.json") if os.name == 'nt' else "",
        # Cursor
        os.path.join(home, ".cursor", "mcp.json")
    ]
    return [p for p in paths if p and os.path.exists(p)]

def inject_config():
    current_dir = os.path.abspath(os.path.dirname(__file__))
    server_path = os.path.join(current_dir, "server.py")
    
    if not os.path.exists(server_path):
        print(f"Error: Could not find server.py at {server_path}")
        sys.exit(1)

    target_paths = get_possible_config_paths()
    if not target_paths:
        print("Could not automatically locate an MCP config file (e.g., ~/.gemini/config/mcp.json).")
        user_input = input("Please enter the absolute path to your MCP config JSON file (or press Enter to skip injection): ").strip()
        if not user_input or not os.path.exists(user_input):
            print("Skipping MCP config injection.")
            sys.exit(0)
        target_paths = [user_input]

    for config_path in target_paths:
        try:
            with open(config_path, "r") as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error reading {config_path}: {e}")
            continue

        if "mcpServers" not in data:
            data["mcpServers"] = {}

        data["mcpServers"]["antigravity-supervisor"] = {
            "command": "python",
            "args": [server_path]
        }

        try:
            with open(config_path, "w") as f:
                json.dump(data, f, indent=2)
            print(f"Successfully injected antigravity-supervisor into {config_path}")
        except Exception as e:
            print(f"Error writing to {config_path}: {e}")

if __name__ == "__main__":
    print("Running Antigravity Supervisor MCP Install Helper...")
    inject_config()
