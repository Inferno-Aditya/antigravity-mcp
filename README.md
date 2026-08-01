<div align="center">
  <h1>🚀 Antigravity Supervisor MCP</h1>
  <p><strong>A powerful Model Context Protocol (MCP) server for orchestrating headless, autonomous AI agents.</strong></p>
  
  [![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
  [![MCP](https://img.shields.io/badge/MCP-Ready-success.svg)](https://modelcontextprotocol.io/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)
</div>

---

## 📖 Overview

**Antigravity Supervisor MCP** is a sophisticated local server built on the Model Context Protocol. It acts as an orchestration layer, allowing high-level AI models to spawn, manage, and interact with background subagents (powered by the `agy` CLI). By providing a seamless asynchronous interface, it empowers LLMs to delegate complex, multi-step tasks to specialized background workers without being blocked.

## ✨ Key Features

- **🤖 Agent Orchestration**: Dynamically spawn background agents (`spawn_agent`) with configurable models, reasoning efforts, and workspace paths.
- **📩 Asynchronous Messaging**: Send tasks to agents (`send_message`) and enforce output structures via JSON schemas (`send_message_with_schema`).
- **⏳ Smart Synchronization**: Avoid fragile polling loops by leveraging `wait_for_idle` to block until a background agent finishes its task.
- **📊 Usage Tracking**: Built-in quota simulation for 5-hour and weekly limits to manage local API boundaries (`get_model_usage`).
- **🩺 Surgical Debugging**: Apply exact string replacements directly to files bypassing the agent if necessary (`apply_code_fix`).
- **🧠 Implicit Team Memory**: Automatically injects workspace awareness and shared blackboard instructions (`TEAM_MEMORY.md`) so agents can collaborate natively.
- **📡 Read-Only Streams**: Access raw `stdout`/`stderr` logs and full message histories via native MCP resources (`agy://logs/{session_id}`).

---

## 🏗️ System Architecture

The project is structured into three main components:

1. **`server.py`**: The FastMCP server entry point. It exposes all the tools and resources to the MCP client.
2. **`manager.py` (`AgentManager`)**: The core logic handler. It manages concurrent agent sessions, spawns subprocesses for the `agy` CLI, reads standard output asynchronously, and maintains conversation states and message inboxes.
3. **`sync_schemas.py`**: A utility script that generates static JSON schemas for all MCP tools, facilitating lazy-loading or integration into specific IDEs.

### Tech Stack
- **Framework**: `mcp` (FastMCP)
- **Agent CLI**: `google-antigravity` (`agy` binary)
- **Language**: Python 3.9+ (utilizing `asyncio` for non-blocking IO)

---

## 🛠️ Available Tools & Resources

The Supervisor provides a comprehensive suite of tools and resources for AI models to use:

### Core Agent Lifecycle Tools
- **`spawn_agent`**: Creates a new background agent session tracking memory and state. Supports configurations like `workspace_path`, `model`, `agent_type`, and `reasoning_effort`.
- **`wait_for_idle`**: Blocks and waits until the target agent is no longer "working", saving orchestrators from having to build fragile polling loops.
- **`send_message`**: Sends a prompt or instruction to a specific agent session.
- **`send_message_with_schema`**: Forces the agent to output its final response adhering perfectly to a provided JSON schema.
- **`check_inbox`**: Checks the specified session's persistent message log for new streaming tokens, tool calls, and thoughts.
- **`get_agent_status`**: Returns the running status of an agent (`idle`, `working`, `error`).
- **`kill_agent`**: Forcefully terminates a runaway or hanging agent process.
- **`list_agents`**: Lists all active and historical sessions tracked by the MCP supervisor.

### Introspection & System Tools
- **`get_model_usage`**: Returns local usage statistics for spawned agents, simulating and tracking 5-hour and weekly boundaries.
- **`apply_code_fix`**: A surgical debugging tool that directly overwrites a string in a file bypassing the agent. Used when an autonomous agent struggles with exact line replacement.

### MCP Resources (Read-Only Streams)
- **`agy://logs/{session_id}`**: Exposes raw stdout/stderr background logs.
- **`agy://inbox/{session_id}`**: Exposes the full message history array.

### Implicit Team Memory (Blackboard)
Whenever an agent is spawned with a `workspace_path`, the MCP server automatically injects a hidden system instruction into every prompt directing agents to use a shared `TEAM_MEMORY.md` file. AI models controlling this MCP **do not** need to call specific blackboard read/write tools; agents natively use their file-editing tools to persist architectural decisions and shared state.

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.9 or higher installed on your system.
- The `google-antigravity` package installed globally or in your environment (providing the `agy` CLI).
- A compatible MCP client (like Claude Desktop, cursor, or the Antigravity IDE).

### 1-Click Installation
The fastest way to install the MCP server and automatically inject it into your IDE configuration is to use our setup scripts:

**For Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/Inferno-Aditya/antigravity-mcp/main/install.ps1 | iex
```

**For Mac/Linux (Bash):**
```bash
curl -sSL https://raw.githubusercontent.com/Inferno-Aditya/antigravity-mcp/main/install.sh | bash
```

### Manual Installation
If you prefer to set up manually:
1. **Clone the repository**
```bash
git clone https://github.com/Inferno-Aditya/antigravity-mcp.git
cd antigravity-mcp
```

### 2. Install dependencies
Install the required packages using `pip`:
```bash
pip install -r requirements.txt
```

### 3. Generate Tool Schemas (Optional)
If your MCP client requires static JSON schemas:
```bash
python sync_schemas.py
```
*(This will generate schemas into your local `~/.gemini/antigravity/mcp/antigravity-supervisor` directory).*

### 4. Run the Server
The server runs over standard input/output (`stdio`), making it ready for MCP clients:
```bash
python server.py
```

### 5. Enabling the Orchestrator Skill
This repository includes a native Antigravity Skill located in `.agents/mcp_orchestrator/SKILL.md`. This skill transforms any LLM into a Principal Architect that will refuse to write code directly and instead properly delegate tasks to headless agents via this MCP.

To use the skill in your own projects:
1. Copy the `.agents` folder from this repository into the root of your target project.
2. In your Antigravity IDE or chat, simply tell the model: *"Use the MCP Orchestrator Architect skill to build my project."* 
3. The agent will instantly load the correct schema, constraints, and instructions without you needing to write a massive prompt!

---

## 💻 Usage & Configuration

To use the Supervisor in your MCP client, configure it to run `server.py`. 

### Example Configuration (JSON)
```json
{
  "mcpServers": {
    "antigravity-supervisor": {
      "command": "python",
      "args": ["/absolute/path/to/antigravity-supervisor/server.py"]
    }
  }
}
```

### Example AI Workflow
Once connected, an orchestrator AI can perform workflows like this:
1. `spawn_agent(session_id="task-1", workspace_path="/path/to/project", model="pro")`
2. `send_message(session_id="task-1", message="Refactor the authentication module.")`
3. `wait_for_idle(session_id="task-1")`
4. Inspect the inbox and agent status to verify completion.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
