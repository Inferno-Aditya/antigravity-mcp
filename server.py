"""
server.py
---------
FastMCP entry point for the Antigravity Supervisor MCP server.

Exposes all orchestration tools and read-only resources to any MCP-compatible
client (Antigravity IDE, Claude Desktop, Cursor, etc.).
"""

from __future__ import annotations

import json
import os
import asyncio
from mcp.server.fastmcp import FastMCP

from manager import AgentManager
from runners import list_runners

mcp = FastMCP("antigravity-supervisor")
manager = AgentManager()


# ─────────────────────────────────────────────────────────────────────────────
# Core Agent Lifecycle Tools
# ─────────────────────────────────────────────────────────────────────────────

@mcp.tool()
def spawn_agent(
    session_id: str,
    workspace_path: str = None,
    model: str = None,
    agent_type: str = None,
    reasoning_effort: str = None,
    skip_permissions: bool = True,
    mode: str = None,
    runner: str = "agy",
) -> str:
    """
    Creates a new background agent session.

    Args:
        session_id:        Unique identifier for this session.
        workspace_path:    Absolute path the agent should operate in.
        model:             Model slug (e.g. 'pro', 'flash' for agy; 'claude-opus-4-5' for claude).
        agent_type:        Specialised agent type (agy-only).
        reasoning_effort:  'low' | 'medium' | 'high' (agy-only).
        skip_permissions:  Skip interactive confirmation prompts (default True for headless use).
        mode:              'plan' (read-only) | 'accept-edits' (immediate execution) (agy-only).
        runner:            CLI backend to use. One of: 'agy' (default), 'claude'.
                           Run get_model_usage() to see available runners.
    """
    if manager.has_session(session_id):
        return f"Session '{session_id}' already exists."

    # Validate runner before creating the session
    available = list_runners()
    if runner not in available:
        return (
            f"Unknown runner '{runner}'. "
            f"Available runners: {available}."
        )

    kwargs = {
        "model": model,
        "agent_type": agent_type,
        "reasoning_effort": reasoning_effort,
        "skip_permissions": skip_permissions,
        "mode": mode,
    }
    manager.create_session(session_id, workspace_path, kwargs, runner_name=runner)
    return f"Session '{session_id}' initialised with runner='{runner}'."


@mcp.tool()
async def send_message(session_id: str, message: str) -> str:
    """Sends a message to an agent session and runs it in the background."""
    try:
        await manager.send_message(session_id, message)
        return f"Message queued for '{session_id}'."
    except Exception as exc:
        return f"Error: {exc}"


@mcp.tool()
async def send_message_with_schema(
    session_id: str, message: str, json_schema: str
) -> str:
    """
    Sends a message to an agent session, forcing the final output to conform
    to the provided JSON schema string.
    """
    try:
        await manager.send_message(session_id, message, json_schema=json_schema)
        return f"Message queued for '{session_id}' with schema enforcement."
    except Exception as exc:
        return f"Error: {exc}"


@mcp.tool()
def check_inbox(session_id: str, mode: str = "read") -> str:
    """
    Checks the agent's message inbox.

    mode:
      'read'  — returns new messages since last read and advances the cursor.
      'peek'  — returns new messages without advancing the cursor.
      'all'   — returns the full message history.
    """
    if not manager.has_session(session_id):
        return f"Session '{session_id}' not found."
    data = manager.get_inbox(session_id, mode=mode)
    return json.dumps(data)


@mcp.tool()
async def wait_for_idle(session_id: str, timeout_seconds: int = 300) -> str:
    """
    Blocks until the agent is no longer working or the timeout is reached.
    Returns the unread messages accumulated during the run.
    """
    if not manager.has_session(session_id):
        return f"Session '{session_id}' not found."

    session = manager.sessions[session_id]
    loop = asyncio.get_event_loop()
    deadline = loop.time() + timeout_seconds

    while session.status == "working":
        if loop.time() > deadline:
            return json.dumps({"status": "timeout", "new_messages": []})
        await asyncio.sleep(2)

    data = manager.get_inbox(session_id, mode="read")
    return json.dumps(data)


@mcp.tool()
def get_agent_status(session_id: str) -> str:
    """
    Returns the running status of an agent and its diagnostics, including
    real token usage parsed from the CLI stream.
    """
    if not manager.has_session(session_id):
        return f"Session '{session_id}' not found."
    return json.dumps(manager.get_status(session_id))


@mcp.tool()
def kill_agent(session_id: str) -> str:
    """Forcefully terminates a runaway agent process."""
    if manager.kill_agent(session_id):
        return f"Successfully killed agent '{session_id}'."
    return f"Agent '{session_id}' is not currently working or was not found."


@mcp.tool()
def list_agents() -> str:
    """Lists all active and historical sessions tracked by the supervisor."""
    return json.dumps(manager.list_agents())


# ─────────────────────────────────────────────────────────────────────────────
# Introspection & System Tools
# ─────────────────────────────────────────────────────────────────────────────

@mcp.tool()
def get_model_usage() -> str:
    """
    Returns real token usage aggregated across all sessions.
    Token counts are parsed from each CLI's stream-json result events.
    Also lists all available runner backends.
    """
    return json.dumps(manager.get_usage())


@mcp.tool()
async def apply_code_fix(filepath: str, target: str, replacement: str) -> str:
    """
    Applies a surgical find-and-replace to a file.

    Safety: the filepath must resolve to a location inside one of the
    registered session workspaces.  Paths outside known workspaces are
    rejected to prevent accidental overwrites of system or user files.

    Only the FIRST occurrence of 'target' is replaced.
    """
    try:
        abs_filepath = os.path.realpath(filepath)

        # ── Workspace boundary check ──────────────────────────────────────
        workspaces = manager.get_all_workspaces()
        if workspaces:
            in_workspace = any(
                abs_filepath.startswith(ws + os.sep) or abs_filepath == ws
                for ws in workspaces
            )
            if not in_workspace:
                return (
                    f"Access denied: '{abs_filepath}' is outside all registered "
                    f"session workspaces.\n"
                    f"Registered workspaces: {sorted(workspaces)}\n"
                    f"Spawn an agent with the correct workspace_path first."
                )
        # If no workspaces are registered yet, fall through (best-effort).

        # ── Apply fix ─────────────────────────────────────────────────────
        with open(abs_filepath, "r", encoding="utf-8") as fh:
            content = fh.read()

        if target not in content:
            return f"Error: target string not found in '{abs_filepath}'."

        # Replace only the FIRST occurrence for safety
        new_content = content.replace(target, replacement, 1)

        with open(abs_filepath, "w", encoding="utf-8") as fh:
            fh.write(new_content)

        return f"Successfully applied fix to '{abs_filepath}'."

    except OSError as exc:
        return f"File error: {exc}"
    except Exception as exc:  # noqa: BLE001
        return f"Unexpected error applying fix: {exc}"


# ─────────────────────────────────────────────────────────────────────────────
# MCP Resources (Read-Only Streams)
# ─────────────────────────────────────────────────────────────────────────────

@mcp.resource("agy://logs/{session_id}")
def get_agent_logs(session_id: str) -> str:
    """Returns the raw full log stream for a session (stdout/stderr from agent)."""
    if not manager.has_session(session_id):
        return f"Session '{session_id}' not found."
    return json.dumps(manager.sessions[session_id].full_log, indent=2)


@mcp.resource("agy://inbox/{session_id}")
def get_agent_inbox(session_id: str) -> str:
    """Returns the full message history array for a session (non-destructive peek)."""
    if not manager.has_session(session_id):
        return f"Session '{session_id}' not found."
    data = manager.get_inbox(session_id, mode="all")
    return json.dumps(data, indent=2)


# ─────────────────────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    mcp.run(transport="stdio")
