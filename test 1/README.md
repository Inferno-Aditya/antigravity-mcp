# 🍅 Pomodoro Focus Timer CLI

A lightweight, elegant, and customizable **Pomodoro Focus Timer** CLI tool built entirely using the Python standard library — zero external dependencies (`pip` installs) required!

---

## 🌟 Features

- **Standard Library Only**: Pure Python 3 — no external packages required.
- **In-Place Live Timer**: Updates continuously in terminal using carriage return (`\r`) with a visual progress bar.
- **ANSI Color Coding**:
  - 🔴 **Work Sessions**: Vibrant red/orange highlighting.
  - 🟢 **Short Breaks**: Refreshing green output.
  - 🔵 **Long Breaks**: Calm cyan highlighting.
- **Audible Bell Alert**: Triggers standard terminal bell sound (`\a`) on session completion.
- **Session Tracking**: Tracks and displays `"Pomodoros done: N"` after every work period.
- **Customizable Intervals**: Configurable work, break, long break durations, and cycle counts.
- **Graceful Control**: Press `Ctrl+C` at any time to exit and display a complete summary of completed focus time.

---

## 🚀 Quick Start

Ensure you have **Python 3.6+** installed.

Run with default settings (25 min work, 5 min break):

```bash
python pomodoro.py
```

---

## ⚙️ Options & Usage

```
usage: pomodoro.py [-h] [-w WORK] [-b BREAK_TIME] [-l LONG_BREAK] [-c CYCLES] [-r ROUNDS] [-a]

A sleek, lightweight Pomodoro Focus Timer CLI built with standard Python library.

options:
  -h, --help            show this help message and exit
  -w WORK, --work WORK  Work session length in minutes (default: 25.0)
  -b BREAK_TIME, --break-time BREAK_TIME
                        Short break session length in minutes (default: 5.0)
  -l LONG_BREAK, --long-break LONG_BREAK
                        Long break session length in minutes (default: 15.0)
  -c CYCLES, --cycles CYCLES
                        Number of work sessions before a long break (default: 4)
  -r ROUNDS, --rounds ROUNDS
                        Total number of work sessions to run (default: continuous)
  -a, --auto-start      Automatically transition between work and break sessions without prompting
```

---

## 💡 Examples

### 1. Custom Work & Break Durations
Run a **50-minute work session** followed by a **10-minute break**:

```bash
python pomodoro.py -w 50 -b 10
```

### 2. Fast Demo / Testing Mode
Test the timer with **0.1 min (6 sec) work** and **0.05 min (3 sec) breaks**:

```bash
python pomodoro.py -w 0.1 -b 0.05
```

### 3. Auto-Start Mode
Run automatically without waiting for `[Enter]` between transitions:

```bash
python pomodoro.py -w 25 -b 5 --auto-start
```

### 4. Limit Total Sessions
Set a target of 4 Pomodoros before auto-stopping:

```bash
python pomodoro.py -w 25 -b 5 -r 4
```

---

## ⌨️ Controls

- `Ctrl+C`: Gracefully exit the current session and print the final stats summary.
