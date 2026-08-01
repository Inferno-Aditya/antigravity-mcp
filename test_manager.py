"""
test_manager.py
---------------
Smoke-test for the AgentManager.  Verifies that a session can be created,
a message queued, and responses received.

Usage:
    python test_manager.py
    python test_manager.py --runner claude   # test with Claude Code backend
"""

from __future__ import annotations

import asyncio
import argparse
import json
from manager import AgentManager


async def test(runner: str = "agy") -> None:
    manager = AgentManager()

    session_id = "test_session"

    # Clean up any leftover session from a previous run
    if manager.has_session(session_id):
        manager.kill_agent(session_id)
        manager.sessions.pop(session_id, None)

    manager.create_session(session_id, runner_name=runner)
    print(f"Session created with runner='{runner}'.")

    await manager.send_message(
        session_id,
        "Say hello world and nothing else. Don't use tools.",
    )
    print("Message queued. Waiting for response…")

    # Poll inbox until idle or timeout
    for _ in range(15):
        await asyncio.sleep(2)
        inbox = manager.get_inbox(session_id)
        if inbox and inbox["new_messages"]:
            print("New messages:")
            for msg in inbox["new_messages"]:
                content = msg.get("content", msg.get("name", ""))
                print(f"  [{msg['type']}] {content}")

        if inbox and inbox["status"] in ("idle", "completed", "error"):
            print(f"Agent finished with status: {inbox['status']}")
            break

    # Print token usage
    usage = manager.get_usage()
    per_session = [s for s in usage["per_session"] if s["session_id"] == session_id]
    if per_session:
        u = per_session[0]
        print(
            f"\nToken usage — "
            f"in: {u['input_tokens']}, "
            f"out: {u['output_tokens']}, "
            f"total: {u['total_tokens']}"
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Smoke-test the AgentManager.")
    parser.add_argument(
        "--runner",
        default="agy",
        help="Runner backend to use (default: agy).",
    )
    args = parser.parse_args()
    asyncio.run(test(runner=args.runner))
