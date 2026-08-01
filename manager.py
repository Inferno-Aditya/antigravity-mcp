"""
manager.py
----------
Core orchestration logic for the Antigravity Supervisor MCP.

Key changes from original:
  - Runner abstraction: sessions are backed by any AgentRunner (agy, claude, …)
  - SQLite persistence: sessions and logs survive server restarts
  - Real token counting: parsed from CLI stream-json result events
  - Structured JSON logging: rotating log file + stderr
  - Log rotation: in-memory full_log capped at MAX_LOG_ENTRIES (5 000)
  - Incremental log persistence: only NEW entries are written to SQLite
"""

from __future__ import annotations

import asyncio
import json
import logging
import logging.handlers
import os
from pathlib import Path
from typing import Any

from runners import get_runner, list_runners, AgentRunner
from storage import SQLiteStore

# ── Logging setup ─────────────────────────────────────────────────────────────
_LOG_DIR = Path.home() / ".antigravity" / "supervisor" / "logs"
_LOG_DIR.mkdir(parents=True, exist_ok=True)

_json_fmt = logging.Formatter(
    '{"ts":"%(asctime)s","lvl":"%(levelname)s","name":"%(name)s","msg":%(message)s}'
)
_file_handler = logging.handlers.RotatingFileHandler(
    _LOG_DIR / "supervisor.log",
    maxBytes=5 * 1024 * 1024,   # 5 MB per file
    backupCount=3,
    encoding="utf-8",
)
_file_handler.setFormatter(_json_fmt)

_stderr_handler = logging.StreamHandler()
_stderr_handler.setFormatter(_json_fmt)

logging.basicConfig(level=logging.INFO, handlers=[_file_handler, _stderr_handler])
log = logging.getLogger("antigravity.supervisor")

# ── Constants ─────────────────────────────────────────────────────────────────
MAX_LOG_ENTRIES = 5_000     # In-memory cap per session; oldest entries are rotated out


# ─────────────────────────────────────────────────────────────────────────────
# Session
# ─────────────────────────────────────────────────────────────────────────────

class Session:
    """
    Represents a single background agent process managed by the supervisor.

    Lifecycle:
        idle  →  working  →  completed | error
    """

    def __init__(
        self,
        session_id: str,
        workspace_path: str | None = None,
        model: str | None = None,
        agent_type: str | None = None,
        reasoning_effort: str | None = None,
        skip_permissions: bool = True,
        mode: str | None = None,
        runner_name: str = "agy",
    ):
        self.session_id = session_id
        self.workspace_path = workspace_path
        self.model = model
        self.agent_type = agent_type
        self.reasoning_effort = reasoning_effort
        self.skip_permissions = skip_permissions
        self.mode = mode
        self.runner_name = runner_name

        self.conversation_id: str | None = None
        self.full_log: list[dict] = []
        self.read_cursor: int = 0
        self.total_messages_produced: int = 0
        self.last_error: str | None = None
        self.status: str = "idle"
        self.lock = asyncio.Lock()
        self.process: asyncio.subprocess.Process | None = None

        # Token accounting (populated from stream result events)
        self.total_input_tokens: int = 0
        self.total_output_tokens: int = 0

        # Persistence tracking
        self._persist_cursor: int = 0   # how many log entries have been saved to DB
        self._log_rotated: bool = False  # triggers full log replace instead of append

        # Optional callback invoked after significant state changes
        self.on_state_change: Any = None  # Callable[[], None] | None

        self.runner: AgentRunner = get_runner(runner_name)

    # ── Logging ───────────────────────────────────────────────────────────

    def _append_log(self, msg_type: str, content: Any) -> None:
        if len(self.full_log) >= MAX_LOG_ENTRIES:
            # Drop oldest quarter to make room
            drop = MAX_LOG_ENTRIES // 4
            self.full_log = self.full_log[drop:]
            self.read_cursor = max(0, self.read_cursor - drop)
            self._persist_cursor = max(0, self._persist_cursor - drop)
            self._log_rotated = True
            self._append_log(
                "system_info",
                f"Log rotated: {drop} oldest entries dropped to stay within {MAX_LOG_ENTRIES}-entry cap.",
            )
            return

        self.full_log.append({"type": msg_type, "content": content})
        self.total_messages_produced += 1

    # ── Async send/run ────────────────────────────────────────────────────

    async def send_message(self, message: str, json_schema: str | None = None) -> None:
        async with self.lock:
            if self.status == "working":
                raise RuntimeError("Agent is already working on a message.")
            self.status = "working"
            self.last_error = None
            asyncio.create_task(self._run(message, json_schema))

    async def _run(self, message: str, json_schema: str | None = None) -> None:  # noqa: C901
        try:
            cmd = self.runner.build_command(message, self, json_schema)

            log.info(json.dumps({
                "event": "agent_start",
                "session_id": self.session_id,
                "runner": self.runner_name,
                "model": self.model or "default",
            }))

            self.process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=self.workspace_path,
            )

            # Stream stdout line-by-line
            while True:
                raw = await self.process.stdout.readline()
                if not raw:
                    break
                line = raw.decode("utf-8", errors="replace").strip()
                if not line:
                    continue

                try:
                    data = json.loads(line)
                    kind, payload = self.runner.parse_event(data)

                    if kind == "init":
                        if payload and not self.conversation_id:
                            self.conversation_id = payload
                    elif kind == "text":
                        self._append_log("text", payload)
                    elif kind == "tool_call":
                        self._append_log("tool_call", payload)
                    elif kind == "thought":
                        self._append_log("thought", payload)
                    elif kind == "result":
                        # Parse real token usage
                        if isinstance(payload, dict):
                            self.total_input_tokens += (
                                payload.get("input_tokens")
                                or payload.get("prompt_tokens")
                                or payload.get("total_input_tokens")
                                or 0
                            )
                            self.total_output_tokens += (
                                payload.get("output_tokens")
                                or payload.get("completion_tokens")
                                or payload.get("total_output_tokens")
                                or 0
                            )
                    # kind == "unknown" → silently skip

                except json.JSONDecodeError:
                    # Non-JSON line — treat as a raw debug log
                    self._append_log("log", line)

            await self.process.wait()

            if self.process.returncode not in (0, None):
                stderr_bytes = await self.process.stderr.read()
                self.last_error = stderr_bytes.decode("utf-8", errors="replace")
                self._append_log("error", self.last_error)
                self.status = "error"
                log.error(json.dumps({
                    "event": "agent_error",
                    "session_id": self.session_id,
                    "returncode": self.process.returncode,
                    "error_snippet": self.last_error[:300],
                }))
            else:
                self.status = "completed"
                log.info(json.dumps({
                    "event": "agent_complete",
                    "session_id": self.session_id,
                    "input_tokens": self.total_input_tokens,
                    "output_tokens": self.total_output_tokens,
                }))

        except asyncio.CancelledError:
            self.last_error = "Agent task was forcefully killed."
            self._append_log("system_error", self.last_error)
            self.status = "error"

        except Exception as exc:  # noqa: BLE001
            self.last_error = str(exc)
            self._append_log("system_error", self.last_error)
            self.status = "error"
            log.exception(json.dumps({
                "event": "agent_exception",
                "session_id": self.session_id,
                "error": str(exc),
            }))

        finally:
            if self.status == "working":
                self.status = "idle"
            self.process = None
            if callable(self.on_state_change):
                self.on_state_change()

    # ── Inbox ─────────────────────────────────────────────────────────────

    def get_inbox_since_cursor(self, mode: str = "read") -> dict:
        if mode == "all":
            return {"status": self.status, "new_messages": list(self.full_log)}

        messages = self.full_log[self.read_cursor :]
        if mode == "read":
            self.read_cursor = len(self.full_log)
        elif mode == "clear":
            self.read_cursor = len(self.full_log)
            messages = []

        return {"status": self.status, "new_messages": messages}

    # ── Control ───────────────────────────────────────────────────────────

    def kill(self) -> bool:
        if self.process and self.process.returncode is None:
            self.process.terminate()
            self.status = "error"
            self.last_error = "Killed by supervisor"
            log.warning(json.dumps({
                "event": "agent_killed",
                "session_id": self.session_id,
            }))
            if callable(self.on_state_change):
                self.on_state_change()
            return True
        return False

    # ── Serialisation ─────────────────────────────────────────────────────

    def to_dict(self) -> dict:
        """Serialise session metadata (logs excluded) for SQLite storage."""
        return {
            "session_id": self.session_id,
            "workspace_path": self.workspace_path,
            "model": self.model,
            "agent_type": self.agent_type,
            "reasoning_effort": self.reasoning_effort,
            "skip_permissions": self.skip_permissions,
            "mode": self.mode,
            "runner_name": self.runner_name,
            "conversation_id": self.conversation_id,
            "status": self.status,
            "last_error": self.last_error,
            "read_cursor": self.read_cursor,
            "total_messages_produced": self.total_messages_produced,
            "total_input_tokens": self.total_input_tokens,
            "total_output_tokens": self.total_output_tokens,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "Session":
        """Rehydrate a Session from its serialised metadata dict."""
        s = cls(
            session_id=d["session_id"],
            workspace_path=d.get("workspace_path"),
            model=d.get("model"),
            agent_type=d.get("agent_type"),
            reasoning_effort=d.get("reasoning_effort"),
            skip_permissions=d.get("skip_permissions", True),
            mode=d.get("mode"),
            runner_name=d.get("runner_name", "agy"),
        )
        s.conversation_id = d.get("conversation_id")
        s.last_error = d.get("last_error")
        s.read_cursor = d.get("read_cursor", 0)
        s.total_messages_produced = d.get("total_messages_produced", 0)
        s.total_input_tokens = d.get("total_input_tokens", 0)
        s.total_output_tokens = d.get("total_output_tokens", 0)

        # If the server crashed mid-task, mark the session as idle so it can
        # be messaged again without being stuck in "working" forever.
        raw_status = d.get("status", "idle")
        s.status = "idle" if raw_status == "working" else raw_status

        return s


# ─────────────────────────────────────────────────────────────────────────────
# AgentManager
# ─────────────────────────────────────────────────────────────────────────────

class AgentManager:
    """
    Orchestrates all agent sessions.

    Responsibilities:
      - Create / destroy / list sessions
      - Route messages to the correct session
      - Persist session state to SQLite (crash-safe)
      - Aggregate usage metrics across sessions
      - Enforce workspace boundary checks
    """

    def __init__(self, store: SQLiteStore | None = None):
        self.store: SQLiteStore = store or SQLiteStore()
        self.sessions: dict[str, Session] = {}
        self._rehydrate_sessions()

    # ── Startup ───────────────────────────────────────────────────────────

    def _rehydrate_sessions(self) -> None:
        """Load sessions persisted by a previous server run."""
        stored = self.store.load_all_sessions()
        for data in stored:
            try:
                session = Session.from_dict(data)
                session.full_log = self.store.load_logs(session.session_id)
                session.read_cursor = min(session.read_cursor, len(session.full_log))
                session._persist_cursor = len(session.full_log)
                session.on_state_change = lambda s=session: self._persist_session(s)
                self.sessions[session.session_id] = session
            except Exception as exc:  # noqa: BLE001
                log.error(json.dumps({
                    "event": "rehydration_error",
                    "session_id": data.get("session_id"),
                    "error": str(exc),
                }))

        if stored:
            log.info(json.dumps({
                "event": "sessions_rehydrated",
                "count": len(self.sessions),
            }))

    # ── Persistence ───────────────────────────────────────────────────────

    def _persist_session(self, session: Session) -> None:
        """Save session state + any new log entries to SQLite."""
        try:
            self.store.save_session(session.to_dict())

            new_entries = session.full_log[session._persist_cursor :]
            if session._log_rotated:
                # Full replace after rotation (positions renumbered)
                self.store.replace_logs(session.session_id, session.full_log)
                session._log_rotated = False
            elif new_entries:
                self.store.append_logs(
                    session.session_id, new_entries, session._persist_cursor
                )
            session._persist_cursor = len(session.full_log)

        except Exception as exc:  # noqa: BLE001
            log.error(json.dumps({
                "event": "persist_error",
                "session_id": session.session_id,
                "error": str(exc),
            }))

    # ── Session lifecycle ─────────────────────────────────────────────────

    def has_session(self, session_id: str) -> bool:
        return session_id in self.sessions

    def create_session(
        self,
        session_id: str,
        workspace_path: str | None = None,
        kwargs: dict | None = None,
        runner_name: str = "agy",
    ) -> Session:
        if kwargs is None:
            kwargs = {}
        session = Session(
            session_id, workspace_path, runner_name=runner_name, **kwargs
        )
        session.on_state_change = lambda s=session: self._persist_session(s)
        self.sessions[session_id] = session
        self._persist_session(session)
        log.info(json.dumps({
            "event": "session_created",
            "session_id": session_id,
            "runner": runner_name,
            "model": kwargs.get("model", "default"),
        }))
        return session

    # ── Messaging ─────────────────────────────────────────────────────────

    async def send_message(
        self,
        session_id: str,
        message: str,
        json_schema: str | None = None,
    ) -> None:
        session = self.sessions.get(session_id)
        if session is None:
            raise KeyError(f"Session '{session_id}' not found.")

        # Augment message with workspace context + shared memory note
        if session.workspace_path:
            try:
                contents = os.listdir(session.workspace_path)
                dir_listing = ", ".join(contents)
            except OSError:
                dir_listing = "Unreadable directory"

            message += (
                f"\n\n[SYSTEM NOTE: Your workspace is {session.workspace_path}. "
                f"Current contents: {dir_listing}. "
                f"You are part of a multi-agent team. A shared memory file exists at "
                f"{os.path.join(session.workspace_path, 'TEAM_MEMORY.md')}. "
                f"Use your file reading/writing tools to read from and write to this "
                f"file to sync with other agents.]"
            )

        await session.send_message(message, json_schema)
        self._persist_session(session)

    # ── Inbox / status ────────────────────────────────────────────────────

    def get_inbox(self, session_id: str, mode: str = "read") -> dict | None:
        session = self.sessions.get(session_id)
        if session is None:
            return None
        result = session.get_inbox_since_cursor(mode)
        if mode == "read":
            self._persist_session(session)   # save updated cursor
        return result

    def get_status(self, session_id: str) -> dict | None:
        session = self.sessions.get(session_id)
        if session is None:
            return None
        return {
            "status": session.status,
            "runner": session.runner_name,
            "conversation_id": session.conversation_id,
            "total_messages_produced": session.total_messages_produced,
            "last_error": session.last_error,
            "token_usage": {
                "input_tokens": session.total_input_tokens,
                "output_tokens": session.total_output_tokens,
                "total_tokens": session.total_input_tokens + session.total_output_tokens,
            },
        }

    def kill_agent(self, session_id: str) -> bool:
        session = self.sessions.get(session_id)
        if session:
            return session.kill()
        return False

    def list_agents(self) -> list[dict]:
        return [
            {
                "session_id": sid,
                "status": s.status,
                "runner": s.runner_name,
                "model": s.model or "default",
                "workspace": s.workspace_path,
            }
            for sid, s in self.sessions.items()
        ]

    # ── Usage ─────────────────────────────────────────────────────────────

    def get_usage(self) -> dict:
        """
        Return aggregated real token usage across all sessions.

        Token counts are parsed from the CLI's stream-json result events.
        Sessions that produce no result event (e.g. they errored before
        finishing) will show 0 tokens.
        """
        total_in = sum(s.total_input_tokens for s in self.sessions.values())
        total_out = sum(s.total_output_tokens for s in self.sessions.values())
        total_msgs = sum(s.total_messages_produced for s in self.sessions.values())

        per_session = [
            {
                "session_id": sid,
                "runner": s.runner_name,
                "model": s.model or "default",
                "status": s.status,
                "input_tokens": s.total_input_tokens,
                "output_tokens": s.total_output_tokens,
                "total_tokens": s.total_input_tokens + s.total_output_tokens,
                "messages_produced": s.total_messages_produced,
            }
            for sid, s in self.sessions.items()
        ]

        return {
            "aggregate": {
                "total_input_tokens": total_in,
                "total_output_tokens": total_out,
                "total_tokens": total_in + total_out,
                "total_messages": total_msgs,
                "active_sessions": sum(
                    1 for s in self.sessions.values() if s.status == "working"
                ),
                "total_sessions": len(self.sessions),
            },
            "per_session": per_session,
            "available_runners": list_runners(),
            "note": (
                "Token counts are parsed from the CLI's stream-json result events. "
                "Values will be 0 for sessions whose runner does not emit usage data."
            ),
        }

    # ── Workspace helpers ─────────────────────────────────────────────────

    def get_all_workspaces(self) -> set[str]:
        """Return the set of real absolute workspace paths for all sessions."""
        result: set[str] = set()
        for s in self.sessions.values():
            if s.workspace_path:
                try:
                    result.add(os.path.realpath(s.workspace_path))
                except OSError:
                    pass
        return result
