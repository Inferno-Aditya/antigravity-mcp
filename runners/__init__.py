"""
runners/__init__.py
-------------------
Runner registry — maps runner name slugs to concrete AgentRunner instances.

Usage:
    from runners import get_runner, list_runners

    runner = get_runner("agy")    # default
    runner = get_runner("claude") # Anthropic Claude Code CLI
"""

from __future__ import annotations
from .agy_runner import AgyRunner
from .claude_runner import ClaudeRunner
from .base import AgentRunner

# ── Registry ──────────────────────────────────────────────────────────────────
# Instantiated once at import time; runners are stateless so singletons are fine.
_REGISTRY: dict[str, AgentRunner] = {
    "agy": AgyRunner(),
    "claude": ClaudeRunner(),
}

DEFAULT_RUNNER = "agy"


def get_runner(name: str = DEFAULT_RUNNER) -> AgentRunner:
    """
    Return the runner for the given name.

    Raises:
        ValueError if the name is not registered.
    """
    runner = _REGISTRY.get(name)
    if runner is None:
        available = list(_REGISTRY.keys())
        raise ValueError(
            f"Unknown runner '{name}'. "
            f"Available runners: {available}. "
            f"Default is '{DEFAULT_RUNNER}'."
        )
    return runner


def list_runners() -> list[str]:
    """Return a sorted list of registered runner names."""
    return sorted(_REGISTRY.keys())


def register_runner(runner: AgentRunner) -> None:
    """
    Register a custom runner at runtime.

    This allows third-party code to add new runners without modifying this
    package.  The runner's .name property is used as the registry key.

    Example::

        from runners import register_runner
        from my_pkg.gemini_runner import GeminiRunner
        register_runner(GeminiRunner())
    """
    _REGISTRY[runner.name] = runner


__all__ = [
    "AgentRunner",
    "AgyRunner",
    "ClaudeRunner",
    "get_runner",
    "list_runners",
    "register_runner",
    "DEFAULT_RUNNER",
]
