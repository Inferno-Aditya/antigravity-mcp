"""
sync_schemas.py
---------------
Generates static JSON schema files for all MCP tools into the Antigravity IDE's
expected MCP schema directory.

Run this once after cloning, or whenever the tool signatures change:
    python sync_schemas.py

The output directory is resolved from the environment:
  1. AGY_MCP_SCHEMA_DIR environment variable (highest priority — use in CI or
     non-standard installs)
  2. Platform default:
       Windows  → %USERPROFILE%\\.gemini\\antigravity\\mcp\\antigravity-supervisor
       macOS    → ~/Library/Application Support/antigravity/mcp/antigravity-supervisor
       Linux    → ~/.config/antigravity/mcp/antigravity-supervisor
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path


# ── Schema directory resolution ───────────────────────────────────────────────

def _resolve_schema_dir() -> Path:
    env_override = os.environ.get("AGY_MCP_SCHEMA_DIR")
    if env_override:
        return Path(env_override)

    home = Path.home()
    if sys.platform == "win32":
        return home / ".gemini" / "antigravity" / "mcp" / "antigravity-supervisor"
    elif sys.platform == "darwin":
        return (
            home / "Library" / "Application Support"
            / "antigravity" / "mcp" / "antigravity-supervisor"
        )
    else:
        # Linux / other POSIX
        xdg_config = Path(os.environ.get("XDG_CONFIG_HOME", home / ".config"))
        return xdg_config / "antigravity" / "mcp" / "antigravity-supervisor"


SCHEMA_DIR = _resolve_schema_dir()

# ── Tool schemas ──────────────────────────────────────────────────────────────

schemas = {
    "spawn_agent": {
        "name": "spawn_agent",
        "description": (
            "Creates a new background agent session. "
            "Use the 'runner' parameter to choose the CLI backend "
            "('agy' for Antigravity/Gemini, 'claude' for Claude Code)."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "session_id":        {"type": "string",  "description": "Unique session identifier."},
                "workspace_path":    {"type": "string",  "default": None, "description": "Absolute path for the agent's working directory."},
                "model":             {"type": "string",  "default": None, "description": "Model slug (e.g. 'pro', 'flash' for agy; 'claude-opus-4-5' for claude)."},
                "agent_type":        {"type": "string",  "default": None, "description": "Specialised agent type (agy-only)."},
                "reasoning_effort":  {"type": "string",  "default": None, "description": "'low' | 'medium' | 'high' (agy-only)."},
                "skip_permissions":  {"type": "boolean", "default": True,  "description": "Skip interactive confirmation prompts for headless use."},
                "mode":              {"type": "string",  "default": None, "description": "'plan' | 'accept-edits' (agy-only)."},
                "runner":            {"type": "string",  "default": "agy", "description": "CLI backend: 'agy' (default) or 'claude'."},
            },
            "required": ["session_id"],
        },
    },
    "send_message": {
        "name": "send_message",
        "description": "Sends a message to an agent session and runs it in the background.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
                "message":    {"type": "string"},
            },
            "required": ["session_id", "message"],
        },
    },
    "send_message_with_schema": {
        "name": "send_message_with_schema",
        "description": "Sends a message to an agent session, forcing the final output to conform to a JSON schema string.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id":  {"type": "string"},
                "message":     {"type": "string"},
                "json_schema": {"type": "string"},
            },
            "required": ["session_id", "message", "json_schema"],
        },
    },
    "check_inbox": {
        "name": "check_inbox",
        "description": "Checks the agent's message inbox. mode: 'read' (advances cursor), 'peek' (no advance), 'all' (full history).",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
                "mode":       {"type": "string", "default": "read"},
            },
            "required": ["session_id"],
        },
    },
    "wait_for_idle": {
        "name": "wait_for_idle",
        "description": "Blocks until the agent is no longer working or the timeout is reached. Returns unread messages.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id":      {"type": "string"},
                "timeout_seconds": {"type": "integer", "default": 300},
            },
            "required": ["session_id"],
        },
    },
    "get_agent_status": {
        "name": "get_agent_status",
        "description": "Returns the agent's status (idle/working/completed/error), diagnostics, and real token usage.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
            },
            "required": ["session_id"],
        },
    },
    "kill_agent": {
        "name": "kill_agent",
        "description": "Forcefully terminates a runaway agent process.",
        "parameters": {
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
            },
            "required": ["session_id"],
        },
    },
    "list_agents": {
        "name": "list_agents",
        "description": "Lists all active and historical sessions tracked by the supervisor.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    "get_model_usage": {
        "name": "get_model_usage",
        "description": (
            "Returns real token usage (parsed from CLI stream events) aggregated "
            "across all sessions, plus the list of available runner backends."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    "apply_code_fix": {
        "name": "apply_code_fix",
        "description": (
            "Applies a surgical find-and-replace (first occurrence only) to a file. "
            "The filepath must be inside a registered session workspace."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "filepath":    {"type": "string", "description": "Absolute path to the target file."},
                "target":      {"type": "string", "description": "Exact string to replace."},
                "replacement": {"type": "string", "description": "Replacement string."},
            },
            "required": ["filepath", "target", "replacement"],
        },
    },
}


# ── Write schemas ─────────────────────────────────────────────────────────────

def main() -> None:
    SCHEMA_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Writing schemas to: {SCHEMA_DIR}\n")

    for tool_name, schema in schemas.items():
        filepath = SCHEMA_DIR / f"{tool_name}.json"
        filepath.write_text(json.dumps(schema, indent=2), encoding="utf-8")
        print(f"  [OK]  {tool_name}.json")

    print(f"\nDone — {len(schemas)} schemas written.")
    print(
        "\nTip: set the AGY_MCP_SCHEMA_DIR environment variable to override "
        "the output directory on any platform."
    )


if __name__ == "__main__":
    main()
