"""
demo_run.py
-----------
Live demo of the Antigravity Supervisor MCP.

This script directly uses the AgentManager (the same engine the MCP server
exposes) to spawn a background `agy` agent and have it build something real.

The agent is asked to create a colourful terminal Pomodoro / focus-timer
application inside the "test 1" workspace.  All agent thoughts, tool calls,
and text deltas are streamed to the console in real-time.

Usage:
    python demo_run.py
"""

from __future__ import annotations

import asyncio
import json
import sys
import os
import time
from pathlib import Path

# ── Bootstrap path so we can import manager directly ──────────────────────────
ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))
# Enable UTF-8 output on Windows so ANSI and unicode chars work
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")


from manager import AgentManager
from storage import SQLiteStore

# ── Config ────────────────────────────────────────────────────────────────────
SESSION_ID   = "demo-pomodoro-builder"
WORKSPACE    = str(ROOT / "test 1")
MODEL        = "Gemini 3.6 Flash (Medium)"  # Confirmed slug from `agy models`
RUNNER       = "agy"
TIMEOUT      = 300              # 5 minutes max

# ── ANSI colour helpers ───────────────────────────────────────────────────────
RESET  = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
CYAN   = "\033[96m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
MAGENTA= "\033[95m"
RED    = "\033[91m"
BLUE   = "\033[94m"

def _c(colour: str, text: str) -> str:
    return f"{colour}{text}{RESET}"

def _header(text: str) -> None:
    bar = "-" * 60
    print(f"\n{CYAN}{bar}{RESET}")
    print(f"{BOLD}{CYAN}  {text}{RESET}")
    print(f"{CYAN}{bar}{RESET}\n")

def _log(prefix: str, colour: str, content: str) -> None:
    # Truncate very long content for readability
    display = content if len(content) <= 300 else content[:300] + "…"
    print(f"{colour}[{prefix}]{RESET} {DIM}{display}{RESET}")

# ── Prompt ────────────────────────────────────────────────────────────────────
AGENT_PROMPT = """
You are building a small but impressive Python terminal application.

## Task
Create a **Pomodoro Focus Timer** CLI tool inside the current workspace.

## Requirements
1. **Single file** called `pomodoro.py`.
2. Uses only the Python **standard library** (no pip installs needed).
3. Features:
   - Configurable work session length (default 25 min) and break length (default 5 min).
   - A live **countdown timer** that refreshes in-place using \\r (carriage return).
   - ANSI colour output — work sessions in red/orange, breaks in green.
   - Plays a **terminal bell** (\\a) when each session ends.
   - Tracks and prints total sessions completed ("Pomodoros done: N").
   - Graceful `Ctrl+C` exit with a summary.
4. Add a `README.md` explaining usage with examples.
5. Keep the code clean, well-commented, and Pythonic.

## Deliverables
- `pomodoro.py`
- `README.md`

Start immediately. Write the files now.
"""

# ── Streaming display ─────────────────────────────────────────────────────────

def display_new_messages(messages: list[dict]) -> None:
    """Pretty-print agent messages as they arrive."""
    for msg in messages:
        kind    = msg.get("type", "unknown")
        content = msg.get("content", "")

        if kind == "text":
            if isinstance(content, str) and content.strip():
                _log("TEXT  ", GREEN, content.strip())

        elif kind == "thought":
            text = ""
            if isinstance(content, dict):
                text = content.get("text", content.get("thought", str(content)))
            elif isinstance(content, str):
                text = content
            if text.strip():
                _log("THINK ", MAGENTA, text.strip())

        elif kind == "tool_call":
            name = ""
            if isinstance(content, dict):
                name = content.get("name", content.get("tool_name", ""))
                if not name:
                    name = content.get("step_type", "tool")
            _log("TOOL  ", YELLOW, f"→ {name}")

        elif kind in ("error", "system_error"):
            _log("ERROR ", RED, str(content))

        elif kind == "system_info":
            _log("SYS   ", BLUE, str(content))

        elif kind == "log":
            pass  # suppress raw debug lines

# ── Main ──────────────────────────────────────────────────────────────────────

async def main() -> None:
    _header("Antigravity Supervisor MCP -- Live Demo")
    print(f"  Runner   : {_c(CYAN, RUNNER)}")
    print(f"  Model    : {_c(CYAN, MODEL)}")
    print(f"  Workspace: {_c(CYAN, WORKSPACE)}")
    print(f"  Session  : {_c(CYAN, SESSION_ID)}\n")

    # Use a demo-specific SQLite DB so we don't pollute the production one
    demo_db = ROOT / "test 1" / "demo_sessions.db"
    store   = SQLiteStore(demo_db)
    manager = AgentManager(store=store)

    # Kill any leftover session from a previous demo run
    if manager.has_session(SESSION_ID):
        manager.kill_agent(SESSION_ID)
        manager.sessions.pop(SESSION_ID, None)
        store.delete_session(SESSION_ID)

    # Spawn agent
    manager.create_session(
        SESSION_ID,
        workspace_path=WORKSPACE,
        kwargs={
            "model":            MODEL,
            "skip_permissions": True,
            # Note: Gemini 3.6 Flash uses quality level in the model name itself
            # (e.g. "Gemini 3.6 Flash (Medium)") — no separate --effort flag needed.
        },
        runner_name=RUNNER,
    )
    print(_c(GREEN, "Agent spawned. Sending task...\n"))

    await manager.send_message(SESSION_ID, AGENT_PROMPT)
    start = time.monotonic()

    # ── Stream output while agent works ──────────────────────────────────────
    session  = manager.sessions[SESSION_ID]
    last_dot = time.monotonic()
    dots     = 0

    print(_c(DIM, "Streaming agent output (thoughts, tool calls, text):\n"))

    while True:
        # Drain any new messages
        inbox = manager.get_inbox(SESSION_ID, mode="read")
        if inbox and inbox["new_messages"]:
            display_new_messages(inbox["new_messages"])

        status = session.status
        elapsed = time.monotonic() - start

        # Heartbeat dot every 3 s when agent is quiet
        if time.monotonic() - last_dot > 3:
            print(_c(DIM, f"  ·  [{elapsed:.0f}s elapsed]"), flush=True)
            last_dot = time.monotonic()
            dots += 1

        if status in ("completed", "error", "idle"):
            break

        if elapsed > TIMEOUT:
            print(_c(RED, f"\nTimeout after {TIMEOUT}s."))
            manager.kill_agent(SESSION_ID)
            break

        await asyncio.sleep(1)

    # Final drain
    inbox = manager.get_inbox(SESSION_ID, mode="read")
    if inbox and inbox["new_messages"]:
        display_new_messages(inbox["new_messages"])

    elapsed = time.monotonic() - start
    final_status = session.status

    # ── Summary ───────────────────────────────────────────────────────────────
    _header("Run Complete")
    colour = GREEN if final_status == "completed" else RED
    print(f"  Status   : {_c(colour, final_status.upper())}")
    print(f"  Duration : {_c(CYAN, f'{elapsed:.1f}s')}")

    usage = manager.get_usage()
    per = next((s for s in usage["per_session"] if s["session_id"] == SESSION_ID), None)
    if per:
        print(f"  Tokens   : {_c(CYAN, str(per['total_tokens']))} "
              f"(in={per['input_tokens']}, out={per['output_tokens']})")
    if session.last_error:
        print(f"  Error    : {_c(RED, session.last_error[:200])}")

    # ── Show created files ────────────────────────────────────────────────────
    print(f"\n  Files in {_c(CYAN, 'test 1/')}:")
    ws = Path(WORKSPACE)
    for f in sorted(ws.iterdir()):
        if f.name.startswith("demo_"):
            continue  # skip our own DB
        size = f.stat().st_size if f.is_file() else 0
        icon = "[F]" if f.is_file() else "[D]"
        print(f"    {icon}  {_c(GREEN, f.name)}  {_c(DIM, f'({size:,} bytes)' if f.is_file() else '')}")

    if final_status == "completed":
        print(f"\n{_c(GREEN, 'Demo complete! Run the created app with:')}")
        cmd = 'python "test 1/pomodoro.py"'
        print(f"  {_c(CYAN, cmd)}\n")
    else:
        print(f"\n{_c(YELLOW, 'Agent did not complete cleanly. Check test 1/ for partial output.')}\n")


if __name__ == "__main__":
    # Enable ANSI on Windows
    if sys.platform == "win32":
        os.system("")   # triggers VT100 mode on Windows 10+
    asyncio.run(main())
