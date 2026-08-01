# Antigravity Supervisor MCP — Reference

This document describes the tools, resources, and implicit behaviours of the
`antigravity-supervisor` MCP server after the v2 refactor.

---

## Supported Runner Backends

The server supports multiple AI coding agent CLIs through its **runner abstraction layer**.

| Runner | CLI binary | Notes |
|--------|-----------|-------|
| `agy` *(default)* | `google-antigravity` | Full feature support: `agent_type`, `reasoning_effort`, `mode`. |
| `claude` | `@anthropic-ai/claude-code` | Install via `npm i -g @anthropic-ai/claude-code`. |

Pass `runner="claude"` (or any registered name) to `spawn_agent` to select the backend.
Call `get_model_usage()` to see all available runners at runtime.

Third-party runners can be registered programmatically:
```python
from runners import register_runner
from my_pkg import MyRunner
register_runner(MyRunner())
```

---

## Core Agent Lifecycle Tools

### `spawn_agent`
Creates a new background agent session.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `session_id` | str | **required** | Unique identifier for the session. |
| `workspace_path` | str | `None` | Absolute path the agent should operate in. |
| `model` | str | `None` | Model slug (`pro`, `flash` for agy; `claude-opus-4-5` for claude). |
| `agent_type` | str | `None` | Specialised agent type (agy-only). |
| `reasoning_effort` | str | `None` | `low` \| `medium` \| `high` (agy-only). |
| `skip_permissions` | bool | `True` | Bypass interactive prompts for headless agents. |
| `mode` | str | `None` | `plan` (read-only) \| `accept-edits` (immediate) (agy-only). |
| `runner` | str | `"agy"` | CLI backend to use. See table above. |

### `wait_for_idle`
Blocks until the target agent finishes its current task or the timeout expires.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `session_id` | str | **required** | Target session. |
| `timeout_seconds` | int | `300` | Maximum wait time in seconds. |

**Returns** — JSON object with `status` and `new_messages` (unread inbox entries).

### `send_message`
Sends a prompt to an agent. The workspace listing and `TEAM_MEMORY.md` note are injected automatically.

| Parameter | Type | Description |
|-----------|------|-------------|
| `session_id` | str | Target session. |
| `message` | str | Prompt text. |

### `send_message_with_schema`
Forces the agent's final response to conform to a JSON schema.

| Parameter | Type | Description |
|-----------|------|-------------|
| `session_id` | str | Target session. |
| `message` | str | Prompt text. |
| `json_schema` | str | JSON schema string the output must conform to. |

### `check_inbox`
Returns messages from the agent's persistent log.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `session_id` | str | **required** | Target session. |
| `mode` | str | `"read"` | `read` (advances cursor) \| `peek` (no advance) \| `all` (full history). |

**Returns** — JSON with `status` and `new_messages`.

### `get_agent_status`
Returns the full status and diagnostics for a session, including **real token usage** parsed from the CLI's stream-json result events.

```json
{
  "status": "completed",
  "runner": "agy",
  "conversation_id": "abc-123",
  "total_messages_produced": 42,
  "last_error": null,
  "token_usage": {
    "input_tokens": 1200,
    "output_tokens": 350,
    "total_tokens": 1550
  }
}
```

### `kill_agent`
Forcefully terminates a hanging agent process.

| Parameter | Type | Description |
|-----------|------|-------------|
| `session_id` | str | Target session. |

### `list_agents`
Lists all tracked sessions with their status, runner, model, and workspace.

---

## Introspection & System Tools

### `get_model_usage`
Returns **real token counts** aggregated from all sessions' stream-json result events.
Also returns the list of available runner backends.

> **Note:** Token counts will be `0` for sessions whose runner CLI does not emit
> usage data in its result events.

### `apply_code_fix`
A surgical find-and-replace (first occurrence only) for a file.

| Parameter | Type | Description |
|-----------|------|-------------|
| `filepath` | str | Absolute path to the target file. |
| `target` | str | Exact string to find. |
| `replacement` | str | Replacement string. |

> **Safety:** The filepath is validated against all registered session workspaces.
> Paths outside any known workspace are rejected. Spawn an agent with the correct
> `workspace_path` before calling this tool.

---

## MCP Resources (Read-Only Streams)

| URI | Description |
|-----|-------------|
| `agy://logs/{session_id}` | Raw stdout/stderr log stream (full history). |
| `agy://inbox/{session_id}` | Full message history (non-destructive peek). |

---

## Implicit Features

### Team Memory (Blackboard)
Whenever an agent is spawned with a `workspace_path`, every message sent to it is
automatically augmented with a system note:

> *[SYSTEM NOTE: Your workspace is `/path/to/project`. Current contents: …
> A shared memory file exists at `TEAM_MEMORY.md`. Use your file tools to read
> from and write to this file to sync with other agents.]*

Agents coordinate architecture, shared variables, and constraints via this file
autonomously.

### Session Persistence
All session state and message logs are persisted to SQLite at:
```
~/.antigravity/supervisor/sessions.db
```
Sessions survive server restarts. Agents that were `working` when the server
crashed are automatically reset to `idle` on rehydration.

### Log Rotation
Each session's in-memory log is capped at **5 000 entries**. When the cap is
reached, the oldest 25 % of entries are dropped and a `system_info` entry is
appended. Rotation events are also flushed to the SQLite store.

### Structured Logging
The server writes structured JSON logs to a rotating file:
```
~/.antigravity/supervisor/logs/supervisor.log
```
Log files rotate at 5 MB and up to 3 backups are kept.

---

## Schema Directory

Run `python sync_schemas.py` to (re)generate static JSON schemas for all tools
into the IDE's expected schema directory.

The directory is resolved automatically by platform:

| Platform | Default path |
|----------|-------------|
| Windows | `%USERPROFILE%\.gemini\antigravity\mcp\antigravity-supervisor` |
| macOS | `~/Library/Application Support/antigravity/mcp/antigravity-supervisor` |
| Linux | `~/.config/antigravity/mcp/antigravity-supervisor` |

Override with the `AGY_MCP_SCHEMA_DIR` environment variable.
