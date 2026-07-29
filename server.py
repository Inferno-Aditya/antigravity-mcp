import json
from mcp.server.fastmcp import FastMCP
from manager import AgentManager

mcp = FastMCP("AntigravitySupervisor")
manager = AgentManager()

@mcp.tool()
async def spawn_agent(session_id: str, workspace_path: str = None) -> str:
    """Spawns a new Antigravity agent worker context. Returns confirmation string."""
    if manager.has_session(session_id):
        return f"Session {session_id} already exists."
    manager.create_session(session_id, workspace_path)
    return f"Session {session_id} initialized."

@mcp.tool()
async def send_message(session_id: str, message: str) -> str:
    """Sends a prompt or instruction to a specific agent worker asynchronously."""
    if not manager.has_session(session_id):
        return f"Error: Session {session_id} does not exist."
    try:
        await manager.send_message(session_id, message)
        return f"Message queued for {session_id}."
    except Exception as e:
        return f"Error: {e}"

@mcp.tool()
def check_inbox(session_id: str) -> str:
    """Retrieves the latest updates (JSON format) from a worker agent since last check."""
    if not manager.has_session(session_id):
        return json.dumps({
            "status": "error",
            "new_messages": [{"type": "error", "content": f"Session {session_id} not found."}]
        })
    
    data = manager.get_inbox(session_id)
    return json.dumps(data)

@mcp.tool()
async def apply_code_fix(filepath: str, target: str, replacement: str) -> str:
    """Applies a direct find-and-replace fix to a file, useful for debugging via MCP."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        if target not in content:
            return f"Error: Target string not found in {filepath}"
            
        new_content = content.replace(target, replacement)
        
        with open(filepath, 'w') as f:
            f.write(new_content)
            
        return f"Successfully applied fix to {filepath}"
    except Exception as e:
        return f"Error applying fix: {e}"

if __name__ == "__main__":
    mcp.run(transport='stdio')
