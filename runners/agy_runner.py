"""
runners/agy_runner.py
---------------------
Runner for the Google Antigravity CLI (`agy`).

This is the default runner.  It wraps the `agy` binary and translates its
stream-json event format into the canonical (kind, payload) pairs used by
the session event loop.

AGY stream-json events of interest:
  {"event": "init",         "conversation_id": "..."}
  {"event": "step_update",  "step_update": {"step_type": "agent_response", "text_delta": "..."}}
  {"event": "step_update",  "step_update": {"step_type": "tool_call", ...}}
  {"event": "step_update",  "step_update": {"step_type": "thought", ...}}
  {"event": "result",       "usage": {"input_tokens": N, "output_tokens": N}}
"""

from __future__ import annotations
from typing import Any
from .base import AgentRunner


class AgyRunner(AgentRunner):
    """Runner for the `google-antigravity` (`agy`) CLI."""

    @property
    def name(self) -> str:
        return "agy"

    def build_command(
        self,
        message: str,
        session: Any,
        json_schema: str | None = None,
    ) -> list[str]:
        cmd = ["agy", "-p", message, "--output-format", "stream-json"]

        if session.workspace_path:
            cmd.extend(["--add-dir", session.workspace_path])
        if session.conversation_id:
            cmd.extend(["--conversation", session.conversation_id])
        if session.model:
            cmd.extend(["--model", session.model])
        if session.agent_type:
            cmd.extend(["--agent", session.agent_type])
        if session.reasoning_effort:
            cmd.extend(["--effort", session.reasoning_effort])
        if session.skip_permissions:
            cmd.append("--dangerously-skip-permissions")
        if session.mode:
            cmd.extend(["--mode", session.mode])
        if json_schema:
            cmd.extend(["--json-schema", json_schema])

        return cmd

    def parse_event(self, data: dict) -> tuple[str, Any]:  # noqa: C901
        event_type = data.get("event")

        # ── Initialisation ────────────────────────────────────────────────
        if event_type == "init":
            return "init", data.get("conversation_id")

        # ── Streaming steps ───────────────────────────────────────────────
        if event_type == "step_update":
            step = data.get("step_update", {})
            step_type = step.get("step_type")

            if step_type == "agent_response" and "text_delta" in step:
                return "text", step["text_delta"]
            if step_type == "tool_call":
                return "tool_call", step
            if step_type == "thought":
                return "thought", step
            return "unknown", None

        # ── Completion / usage ────────────────────────────────────────────
        if event_type == "result":
            raw = data.get("usage") or {}
            return "result", {
                "input_tokens": raw.get("input_tokens", 0),
                "output_tokens": raw.get("output_tokens", 0),
            }

        return "unknown", None
