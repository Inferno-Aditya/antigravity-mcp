"""
runners/claude_runner.py
------------------------
Runner for the Anthropic Claude Code CLI (`claude`).

Supports the `claude` binary available from `npm i -g @anthropic-ai/claude-code`.

Claude Code stream-json event format:
  {"type": "system",    "subtype": "init",    "session_id": "..."}
  {"type": "assistant", "message": {"content": [{"type": "text",     "text": "..."}]}}
  {"type": "assistant", "message": {"content": [{"type": "tool_use", "name": "...", "input": {...}}]}}
  {"type": "result",    "subtype": "success",
   "usage": {"input_tokens": N, "output_tokens": N,
              "cache_read_input_tokens": N, "cache_creation_input_tokens": N}}

NOTE: Claude Code does not support `--add-dir` — the working directory is set
      via the `cwd` argument to subprocess.  It also uses `--resume <session_id>`
      (not `--conversation`) to continue an existing session.

Supported session fields consumed by this runner:
  model                e.g. "claude-opus-4-5", "claude-sonnet-4-5"
  skip_permissions     maps to --dangerously-skip-permissions
  conversation_id      maps to --resume
  (reasoning_effort, agent_type, mode are agy-specific and are silently ignored)
"""

from __future__ import annotations
from typing import Any
from .base import AgentRunner


class ClaudeRunner(AgentRunner):
    """Runner for the Anthropic `claude` CLI (Claude Code)."""

    @property
    def name(self) -> str:
        return "claude"

    def build_command(
        self,
        message: str,
        session: Any,
        json_schema: str | None = None,
    ) -> list[str]:
        cmd = ["claude", "-p", message, "--output-format", "stream-json"]

        # Resume an existing conversation (Claude uses --resume, not --conversation)
        if session.conversation_id:
            cmd.extend(["--resume", session.conversation_id])

        # Model override — Claude model slugs differ from agy's
        if session.model:
            cmd.extend(["--model", session.model])

        # Claude Code also supports --dangerously-skip-permissions
        if session.skip_permissions:
            cmd.append("--dangerously-skip-permissions")

        # JSON schema enforcement — request JSON output mode
        if json_schema:
            # Claude Code does not have a native --json-schema flag.
            # Append schema as a suffix to the message instead.
            # The prompt is already built by the time build_command is called,
            # so we append it to the argv message directly.
            schema_instruction = (
                f"\n\n[OUTPUT FORMAT: Your final response MUST be valid JSON that "
                f"strictly conforms to this schema:\n{json_schema}\n"
                f"Return ONLY the JSON object, no markdown fences.]"
            )
            # Splice schema instruction into the -p message argument
            cmd[cmd.index("-p") + 1] += schema_instruction

        return cmd

    def parse_event(self, data: dict) -> tuple[str, Any]:  # noqa: C901
        event_type = data.get("type")

        # ── Initialisation ────────────────────────────────────────────────
        if event_type == "system" and data.get("subtype") == "init":
            return "init", data.get("session_id")

        # ── Assistant content ─────────────────────────────────────────────
        if event_type == "assistant":
            message = data.get("message", {})
            content_blocks = message.get("content", [])
            for block in content_blocks:
                block_type = block.get("type")
                if block_type == "text":
                    return "text", block.get("text", "")
                if block_type == "tool_use":
                    return "tool_call", {
                        "name": block.get("name"),
                        "input": block.get("input", {}),
                        "id": block.get("id"),
                    }
                if block_type == "thinking":
                    return "thought", {"text": block.get("thinking", "")}
            return "unknown", None

        # ── Completion / usage ────────────────────────────────────────────
        if event_type == "result":
            raw = data.get("usage") or {}
            return "result", {
                # Claude Code uses OpenAI-style names as well as its own
                "input_tokens": (
                    raw.get("input_tokens")
                    or raw.get("prompt_tokens")
                    or 0
                ),
                "output_tokens": (
                    raw.get("output_tokens")
                    or raw.get("completion_tokens")
                    or 0
                ),
            }

        return "unknown", None
