# Team Memory - Pomodoro CLI Task

## Completed Deliverables
- `pomodoro.py`: Single-file Pomodoro Focus Timer CLI application built using Python standard library.
  - Configurable work/break session lengths via CLI arguments.
  - Live countdown timer with carriage return (`\r`) in-place refresh and visual progress bar.
  - ANSI colored output (Work in red, breaks in green/cyan).
  - Terminal bell alerts (`\a`) on session end.
  - Tracking & display of completed sessions ("Pomodoros done: N").
  - Graceful `Ctrl+C` interrupt handling with a session summary (focus time, elapsed time).
  - Robust UTF-8 encoding support for Windows terminals.
- `README.md`: Complete documentation with quick start, CLI parameters, and usage examples.
