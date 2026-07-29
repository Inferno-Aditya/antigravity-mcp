import json
import os

SCHEMA_DIR = r"C:\Users\adity\.gemini\antigravity\mcp\antigravity-supervisor"

schemas = {
    "spawn_agent": {
        "name": "spawn_agent",
        "description": "Creates a new agent session. Supports advanced CLI config flags.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
                "workspace_path": {"type": "string", "default": None},
                "model": {"type": "string", "default": None},
                "agent_type": {"type": "string", "default": None},
                "reasoning_effort": {"type": "string", "default": None},
                "skip_permissions": {"type": "boolean", "default": True},
                "mode": {"type": "string", "default": None}
            },
            "required": ["session_id"]
        }
    },
    "send_message": {
        "name": "send_message",
        "description": "Sends a message to an agent session and runs it in the background.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
                "message": {"type": "string"}
            },
            "required": ["session_id", "message"]
        }
    },
    "send_message_with_schema": {
        "name": "send_message_with_schema",
        "description": "Sends a message to an agent session, forcing the final output to match a strict JSON schema string.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
                "message": {"type": "string"},
                "json_schema": {"type": "string"}
            },
            "required": ["session_id", "message", "json_schema"]
        }
    },
    "check_inbox": {
        "name": "check_inbox",
        "description": "Checks the agent's message inbox. mode can be 'read' (advances cursor), 'peek' (reads without advancing), or 'all' (full history).",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
                "mode": {"type": "string", "default": "read"}
            },
            "required": ["session_id"]
        }
    },
    "wait_for_idle": {
        "name": "wait_for_idle",
        "description": "Blocks until the agent is no longer working or the timeout is reached. Returns the unread messages in the inbox.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
                "timeout_seconds": {"type": "integer", "default": 300}
            },
            "required": ["session_id"]
        }
    },
    "get_agent_status": {
        "name": "get_agent_status",
        "description": "Gets the running status of an agent (idle, working, completed, error) and its diagnostics.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"}
            },
            "required": ["session_id"]
        }
    },
    "kill_agent": {
        "name": "kill_agent",
        "description": "Forcefully terminates a runaway agent process.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"}
            },
            "required": ["session_id"]
        }
    },
    "list_agents": {
        "name": "list_agents",
        "description": "Lists all active and historical sessions tracked by the manager.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    "get_model_usage": {
        "name": "get_model_usage",
        "description": "Returns local usage limits, including 5-hour and weekly tracking logic.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    "apply_code_fix": {
        "name": "apply_code_fix",
        "description": "Applies a direct find-and-replace fix to a file, useful for debugging via MCP.",
        "parameters": {
            "type": "object",
            "properties": {
                "filepath": {"type": "string"},
                "target": {"type": "string"},
                "replacement": {"type": "string"}
            },
            "required": ["filepath", "target", "replacement"]
        }
    }
}

os.makedirs(SCHEMA_DIR, exist_ok=True)
for tool_name, schema in schemas.items():
    filepath = os.path.join(SCHEMA_DIR, f"{tool_name}.json")
    with open(filepath, 'w') as f:
        json.dump(schema, f, indent=2)
    print(f"Wrote schema for {tool_name}")

print("Schema generation complete.")
