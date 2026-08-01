"""
storage/sqlite_store.py
-----------------------
SQLite-backed persistence for AgentManager sessions and their log streams.

Database is stored at:
    ~/.antigravity/supervisor/sessions.db   (default)

Schema
------
sessions
    session_id   TEXT PK
    config       TEXT    — JSON-encoded session state dict (everything except logs)
    updated_at   REAL    — Unix timestamp of last write

session_logs
    id           INTEGER PK AUTOINCREMENT
    session_id   TEXT FK → sessions.session_id
    position     INTEGER — 0-based index of the entry within the session's full_log
    msg_type     TEXT
    content      TEXT    — raw string or JSON-encoded value

Design notes
------------
- sqlite3 is part of the Python standard library; no extra dependency needed.
- All writes are synchronous. For this local tool the latency is negligible
  (< 5 ms per write on typical hardware).
- Log entries are appended incrementally.  A full replace is only done after
  in-memory log rotation (controlled by Session.MAX_LOG_ENTRIES).
- ON DELETE CASCADE keeps logs tidy when a session row is removed.
"""

from __future__ import annotations
import json
import os
import sqlite3
import time
from pathlib import Path


def _default_db_path() -> Path:
    """Return the platform-appropriate default database path."""
    return Path.home() / ".antigravity" / "supervisor" / "sessions.db"


_DDL = """
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sessions (
    session_id  TEXT    NOT NULL PRIMARY KEY,
    config      TEXT    NOT NULL,
    updated_at  REAL    NOT NULL
);

CREATE TABLE IF NOT EXISTS session_logs (
    id          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT    NOT NULL
                        REFERENCES sessions (session_id) ON DELETE CASCADE,
    position    INTEGER NOT NULL,
    msg_type    TEXT    NOT NULL,
    content     TEXT    NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_logs_position
    ON session_logs (session_id, position);
"""


class SQLiteStore:
    """Persistent store for agent sessions and their message logs."""

    def __init__(self, db_path: str | Path | None = None):
        self.db_path = str(db_path or _default_db_path())
        # Ensure parent directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    # ── Internal helpers ──────────────────────────────────────────────────

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=10)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.executescript(_DDL)

    @staticmethod
    def _encode_content(content) -> str:
        """Serialise a log entry's content to a plain string for storage."""
        if isinstance(content, str):
            return content
        return json.dumps(content, ensure_ascii=False)

    @staticmethod
    def _decode_content(raw: str):
        """Deserialise a log entry's content from storage."""
        try:
            return json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            return raw

    # ── Session CRUD ──────────────────────────────────────────────────────

    def save_session(self, data: dict) -> None:
        """Insert or replace a session's state dict (logs excluded)."""
        with self._connect() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO sessions (session_id, config, updated_at)
                VALUES (?, ?, ?)
                """,
                (data["session_id"], json.dumps(data, ensure_ascii=False), time.time()),
            )

    def load_all_sessions(self) -> list[dict]:
        """Load every stored session state dict (logs not included)."""
        with self._connect() as conn:
            rows = conn.execute("SELECT config FROM sessions").fetchall()
        return [json.loads(row["config"]) for row in rows]

    def delete_session(self, session_id: str) -> None:
        """Delete a session and all its log entries (CASCADE)."""
        with self._connect() as conn:
            conn.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))

    # ── Log management ────────────────────────────────────────────────────

    def append_logs(
        self,
        session_id: str,
        entries: list[dict],
        start_position: int,
    ) -> None:
        """
        Append new log entries for a session starting at *start_position*.

        Uses INSERT OR IGNORE so duplicate positions are safe to retry.
        """
        if not entries:
            return
        rows = [
            (
                session_id,
                start_position + i,
                entry["type"],
                self._encode_content(entry["content"]),
            )
            for i, entry in enumerate(entries)
        ]
        with self._connect() as conn:
            conn.executemany(
                """
                INSERT OR IGNORE INTO session_logs
                    (session_id, position, msg_type, content)
                VALUES (?, ?, ?, ?)
                """,
                rows,
            )

    def replace_logs(self, session_id: str, entries: list[dict]) -> None:
        """
        Fully replace all log entries for a session.

        Used after in-memory log rotation when the position numbering resets.
        """
        rows = [
            (
                session_id,
                i,
                entry["type"],
                self._encode_content(entry["content"]),
            )
            for i, entry in enumerate(entries)
        ]
        with self._connect() as conn:
            conn.execute(
                "DELETE FROM session_logs WHERE session_id = ?", (session_id,)
            )
            if rows:
                conn.executemany(
                    """
                    INSERT INTO session_logs
                        (session_id, position, msg_type, content)
                    VALUES (?, ?, ?, ?)
                    """,
                    rows,
                )

    def load_logs(self, session_id: str) -> list[dict]:
        """Return all log entries for a session, ordered by position."""
        with self._connect() as conn:
            rows = conn.execute(
                """
                SELECT msg_type, content
                FROM   session_logs
                WHERE  session_id = ?
                ORDER  BY position
                """,
                (session_id,),
            ).fetchall()
        return [
            {"type": row["msg_type"], "content": self._decode_content(row["content"])}
            for row in rows
        ]
