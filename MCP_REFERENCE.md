# Antigravity Supervisor MCP Reference

This document outlines the available tools, resources, and implicit behaviors of the `antigravity-supervisor` MCP server. AI models can use this reference to properly orchestrate headless agents.

## Core Agent Lifecycle Tools

### `spawn_agent`
Creates a new background agent session tracking memory and state.
- **Parameters**:
  - `session_id` (str): Unique identifier for the agent session.
  - `workspace_path` (str, optional): The absolute path to the directory the agent should operate in.
  - `model` (str, optional): The Gemini model to use (e.g., `pro`, `flash`, `flash_lite`).
  - `agent_type` (str, optional): Specialized agent type to spawn.
  - `reasoning_effort` (str, optional): Sets reasoning strictness (`low`, `medium`, `high`).
  - `skip_permissions` (bool, optional): If `True`, the agent bypasses terminal permission prompts.
  - `mode` (str, optional): Set to `plan` for read-only planning, or `accept-edits` for immediate execution.

### `send_message`
Sends a prompt or instruction to a specific agent session.
- **Parameters**:
  - `session_id` (str): The target agent session.
  - `message` (str): The prompt for the agent.

### `send_message_with_schema`
Forces the agent to output its final response adhering perfectly to a provided JSON schema.
- **Parameters**:
  - `session_id` (str): The target agent session.
  - `message` (str): The prompt for the agent.
  - `json_schema` (str): The JSON schema string that the output must conform to.

### `check_inbox`
Checks the specified session's inbox for streaming tokens, tool execution logs, and thoughts.
- **Parameters**:
  - `session_id` (str): The target agent session.
- **Returns**: A JSON string containing `status` (`idle`, `working`) and a list of new messages.

### `get_agent_status`
Returns the running status of an agent (`idle`, `working`, `error`).
- **Parameters**: `session_id` (str)

### `kill_agent`
Forcefully terminates a runaway or hanging agent process.
- **Parameters**: `session_id` (str)

### `list_agents`
Lists all active and historical sessions tracked by the MCP supervisor.

---

## Introspection & System Tools

### `get_model_usage`
Returns the local usage statistics for spawned agents. Since the CLI does not expose live billing quotas directly, this simulates and tracks the **5-hour** and **weekly** boundaries locally.
- **Returns**: A JSON payload detailing `stats`, `limits`, and `remaining` allowances.

### `apply_code_fix`
A surgical debugging tool that directly overwrites a string in a file bypassing the agent. Used when an autonomous agent struggles with exact line replacement.
- **Parameters**:
  - `filepath` (str): Absolute path to the file.
  - `target` (str): The exact string to replace.
  - `replacement` (str): The new string to insert.

---

## MCP Resources (Read-Only Streams)

- **`agy://logs/{session_id}`**: Exposes raw stdout/stderr background logs.
- **`agy://inbox/{session_id}`**: Exposes the full message history array.

---

## Implicit Features

### Implicit Team Memory (Blackboard)
Whenever an agent is spawned with a `workspace_path`, the MCP server automatically injects a hidden system instruction into every prompt:
> *[SYSTEM NOTE: You are part of a multi-agent team. A shared memory file exists at `TEAM_MEMORY.md`. Use your file reading/writing tools to read from and write to this file to sync with other agents.]*

AI models controlling this MCP **do not** need to call specific blackboard read/write tools. Spawned agents will natively use their own file-editing tools to persist architectural decisions, limits, and shared state in `TEAM_MEMORY.md`.
