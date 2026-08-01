"""
runners/base.py
---------------
Abstract base class for Antigravity Supervisor agent runners.

A "runner" encapsulates the CLI-specific logic for a single AI coding agent
backend (agy, claude, etc.).  Every runner must implement two methods:

  build_command(message, session, json_schema) -> list[str]
      Build the full subprocess argv list for the given session and message.

  parse_event(data) -> (kind, payload)
      Translate one parsed stream-json line into a canonical (kind, payload)
      pair consumed by the session loop.

Canonical kinds:
  "init"       payload = str  conversation/session ID from the backend
  "text"       payload = str  incremental text delta
  "tool_call"  payload = dict tool call data
  "thought"    payload = dict thinking/reasoning block
  "result"     payload = dict usage stats  {"input_tokens": N, "output_tokens": N}
  "unknown"    payload = None  event can be safely ignored
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any


class AgentRunner(ABC):
    """Abstract base for all CLI-backed agent runners."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Unique slug used to select this runner (e.g. 'agy', 'claude')."""
        ...

    @abstractmethod
    def build_command(
        self,
        message: str,
        session: Any,
        json_schema: str | None = None,
    ) -> list[str]:
        """
        Build the full subprocess command list.

        Args:
            message:     The prompt text (already augmented with workspace context).
            session:     The Session object (carries model, workspace_path, etc.).
            json_schema: Optional JSON schema string the agent must conform to.

        Returns:
            List of strings suitable for asyncio.create_subprocess_exec(*cmd).
        """
        ...

    @abstractmethod
    def parse_event(self, data: dict) -> tuple[str, Any]:
        """
        Parse a decoded JSON event dict from the agent's stdout stream.

        Returns:
            (kind, payload) — see module docstring for canonical kind values.
        """
        ...
