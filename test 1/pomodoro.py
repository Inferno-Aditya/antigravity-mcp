#!/usr/bin/env python3
"""
Pomodoro Focus Timer CLI

A lightweight, elegant command-line Pomodoro timer written using only the Python standard library.
Features live in-place countdown timers, progress bars, ANSI color output, terminal bells,
and graceful exit summaries.
"""

import argparse
import os
import sys
import time

# Enable UTF-8 encoding for standard output on Windows and legacy environments
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Enable ANSI escape sequences on Windows terminals
if sys.platform == "win32":
    os.system("")

# ANSI Escape Sequences for Colors and Formatting
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
CLEAR_LINE = "\033[K"


def format_time(seconds: float) -> str:
    """Format seconds into MM:SS string."""
    seconds = max(0, int(seconds))
    mins, secs = divmod(seconds, 60)
    return f"{mins:02d}:{secs:02d}"


def format_duration(seconds: float) -> str:
    """Format duration in seconds into human-readable hours, minutes, and seconds."""
    total_seconds = int(seconds)
    hours, remainder = divmod(total_seconds, 3600)
    mins, secs = divmod(remainder, 60)
    if hours > 0:
        return f"{hours}h {mins}m {secs}s"
    elif mins > 0:
        return f"{mins}m {secs}s"
    else:
        return f"{secs}s"


def render_progress_bar(current: float, total: float, width: int = 25) -> str:
    """Generate a visual progress bar string."""
    if total <= 0:
        progress = 1.0
    else:
        progress = min(1.0, max(0.0, current / total))
    filled_length = int(width * progress)
    bar = "█" * filled_length + "░" * (width - filled_length)
    percentage = int(progress * 100)
    return f"[{bar}] {percentage:3d}%"


def play_bell(count: int = 3):
    """Play the terminal bell sound multiple times."""
    for _ in range(count):
        sys.stdout.write("\a")
        sys.stdout.flush()
        time.sleep(0.2)


def countdown(duration_minutes: float, session_title: str, color: str) -> bool:
    """
    Runs a live countdown timer refreshing in-place using carriage returns.
    Returns True when completed naturally.
    """
    total_seconds = duration_minutes * 60.0
    start_time = time.time()
    end_time = start_time + total_seconds

    print(f"\n{color}{BOLD}=== Starting {session_title} ({duration_minutes:g} min) ==={RESET}")

    try:
        while True:
            now = time.time()
            remaining = end_time - now
            elapsed = total_seconds - remaining

            if remaining <= 0:
                bar = render_progress_bar(total_seconds, total_seconds)
                sys.stdout.write(
                    f"\r{color}{session_title} | 00:00 / {format_time(total_seconds)} {bar}{RESET}{CLEAR_LINE}"
                )
                sys.stdout.flush()
                print()  # Newline after timer completion
                return True

            bar = render_progress_bar(elapsed, total_seconds)
            time_str = format_time(remaining)
            total_str = format_time(total_seconds)

            sys.stdout.write(
                f"\r{color}{session_title} | {BOLD}{time_str}{RESET}{color} / {total_str} {bar}{RESET}{CLEAR_LINE}"
            )
            sys.stdout.flush()
            time.sleep(0.2)

    except KeyboardInterrupt:
        print()  # Ensure clean newline on interrupt
        raise


def run_pomodoro_app(args):
    """Main execution loop for managing work and break sessions."""
    completed_sessions = 0
    total_focus_seconds = 0.0
    start_timestamp = time.time()

    print(f"{BOLD}{CYAN}=========================================={RESET}")
    print(f"{BOLD}{CYAN}       🍅 POMODORO FOCUS TIMER CLI        {RESET}")
    print(f"{BOLD}{CYAN}=========================================={RESET}")
    print(
        f"{DIM}Work: {args.work}m | Short Break: {args.break_time}m | Long Break: {args.long_break}m | Cycles: {args.cycles}{RESET}\n"
    )

    try:
        session_num = 1
        while True:
            if args.rounds and completed_sessions >= args.rounds:
                print(f"\n{BOLD}{GREEN}🎉 Target rounds completed! Great job!{RESET}")
                break

            # --- WORK SESSION ---
            work_title = f"🍅 Work Session #{session_num}"
            session_start = time.time()

            countdown(args.work, work_title, RED)

            completed_sessions += 1
            session_duration = time.time() - session_start
            total_focus_seconds += session_duration

            play_bell(3)
            print(f"{BOLD}{GREEN}✔ {work_title} complete! (Pomodoros done: {completed_sessions}){RESET}")

            # Determine break type
            if completed_sessions % args.cycles == 0:
                break_title = "☕ Long Break"
                break_duration = args.long_break
                break_color = CYAN
            else:
                break_title = "☕ Short Break"
                break_duration = args.break_time
                break_color = GREEN

            if not args.auto_start:
                try:
                    input(f"\n{YELLOW}Press [Enter] to start {break_title} ({break_duration:g} min)...{RESET}")
                except (KeyboardInterrupt, EOFError):
                    print()
                    break

            countdown(break_duration, break_title, break_color)
            play_bell(2)
            print(f"{BOLD}{CYAN}✔ {break_title} finished! Time to get back to focus.{RESET}")

            if not args.auto_start:
                try:
                    input(f"\n{YELLOW}Press [Enter] to start Work Session #{session_num + 1}...{RESET}")
                except (KeyboardInterrupt, EOFError):
                    print()
                    break

            session_num += 1

    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}⚠ Session interrupted by user (Ctrl+C).{RESET}")
    finally:
        total_time_elapsed = time.time() - start_timestamp
        print(f"\n{BOLD}{CYAN}=========================================={RESET}")
        print(f"{BOLD}{CYAN}           📊 SESSION SUMMARY            {RESET}")
        print(f"{BOLD}{CYAN}=========================================={RESET}")
        print(f" 🍅 Pomodoros done      : {BOLD}{completed_sessions}{RESET}")
        print(f" ⏱  Total Focus Time    : {BOLD}{format_duration(total_focus_seconds)}{RESET}")
        print(f" ⏳ Total Session Time  : {BOLD}{format_duration(total_time_elapsed)}{RESET}")
        print(f"{BOLD}{CYAN}=========================================={RESET}")
        print(f"{DIM}Keep up the great momentum! Goodbye! 👋{RESET}\n")


def main():
    parser = argparse.ArgumentParser(
        description="A sleek, lightweight Pomodoro Focus Timer CLI built with standard Python library.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "-w",
        "--work",
        type=float,
        default=25.0,
        help="Work session length in minutes",
    )
    parser.add_argument(
        "-b",
        "--break-time",
        type=float,
        default=5.0,
        dest="break_time",
        help="Short break session length in minutes",
    )
    parser.add_argument(
        "-l",
        "--long-break",
        type=float,
        default=15.0,
        help="Long break session length in minutes",
    )
    parser.add_argument(
        "-c",
        "--cycles",
        type=int,
        default=4,
        help="Number of work sessions before a long break",
    )
    parser.add_argument(
        "-r",
        "--rounds",
        type=int,
        default=None,
        help="Total number of work sessions to run (default: continuous)",
    )
    parser.add_argument(
        "-a",
        "--auto-start",
        action="store_true",
        help="Automatically transition between work and break sessions without prompting",
    )

    args = parser.parse_args()

    if args.work <= 0 or args.break_time <= 0 or args.long_break <= 0:
        print(f"{RED}Error: Session durations must be positive numbers.{RESET}", file=sys.stderr)
        sys.exit(1)

    run_pomodoro_app(args)


if __name__ == "__main__":
    main()
