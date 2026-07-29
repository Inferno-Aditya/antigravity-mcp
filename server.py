import json
from mcp.server.fastmcp import FastMCP
from manager import AgentManager

mcp = FastMCP("antigravity-supervisor")
manager = AgentManager()

@mcp.tool()
def spawn_agent(session_id: str, workspace_path: str = None, 
                model: str = None, agent_type: str = None, 
                reasoning_effort: str = None, skip_permissions: bool = False,
                mode: str = None) -> str:
    """Creates a new agent session. Supports advanced CLI config flags."""
    if manager.has_session(session_id):
        return f"Session {session_id} already exists."
    
    kwargs = {
        "model": model,
        "agent_type": agent_type,
        "reasoning_effort": reasoning_effort,
        "skip_permissions": skip_permissions,
        "mode": mode
    }
    manager.create_session(session_id, workspace_path, kwargs)
    return f"Session {session_id} initialized."

@mcp.tool()
async def send_message(session_id: str, message: str) -> str:
    """Sends a message to an agent session and runs it in the background."""
    try:
        await manager.send_message(session_id, message)
        return f"Message queued for {session_id}."
    except Exception as e:
        return f"Error: {e}"

@mcp.tool()
async def send_message_with_schema(session_id: str, message: str, json_schema: str) -> str:
    """Sends a message to an agent session, forcing the final output to match a strict JSON schema string."""
    try:
        await manager.send_message(session_id, message, json_schema=json_schema)
        return f"Message queued for {session_id} with schema enforcement."
    except Exception as e:
        return f"Error: {e}"

@mcp.tool()
def check_inbox(session_id: str) -> str:
    """Checks the agent's message inbox for new streaming tokens, tool calls, and thoughts."""
    if not manager.has_session(session_id):
        return f"Session {session_id} not found."
    
    data = manager.get_inbox(session_id)
    return json.dumps(data)

@mcp.tool()
def get_agent_status(session_id: str) -> str:
    """Gets the running status of an agent."""
    if not manager.has_session(session_id):
        return f"Session {session_id} not found."
    return json.dumps(manager.get_status(session_id))

@mcp.tool()
def kill_agent(session_id: str) -> str:
    """Forcefully terminates a runaway agent process."""
    if manager.kill_agent(session_id):
        return f"Successfully killed agent {session_id}."
    return f"Agent {session_id} is not currently working or not found."

@mcp.tool()
def list_agents() -> str:
    """Lists all active and historical sessions tracked by the manager."""
    return json.dumps(manager.list_agents())

@mcp.tool()
def get_model_usage() -> str:
    """Returns local usage limits, including 5-hour and weekly tracking logic."""
    return json.dumps(manager.get_usage())

@mcp.tool()
def write_blackboard(key: str, value: str) -> str:
    """Writes a shared value to the global blackboard memory, allowing agents to share code constraints and state."""
    manager.write_blackboard(key, value)
    return f"Successfully wrote {key} to blackboard."

@mcp.tool()
def read_blackboard(key: str) -> str:
    """Reads a shared value from the global blackboard memory."""
    val = manager.read_blackboard(key)
    if val is None:
        return f"Key {key} not found."
    return val

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

@mcp.resource("agy://logs/{session_id}")
def get_agent_logs(session_id: str) -> str:
    """Returns the most recent raw debug log representation of a session."""
    if not manager.has_session(session_id):
        return f"Session {session_id} not found."
    # In a full implementation, we'd read a real .log file on disk. For now, we dump status.
    return f"Logs for {session_id}: Status is {manager.get_status(session_id)}"

if __name__ == "__main__":
    mcp.run(transport='stdio')
