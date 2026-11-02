# T-Minus Lock Screen

A deadline you can see from the lock screen. Set the target, the plan builds
itself backward from it, and the count runs live.

**Live:** https://tminus-lockscreen.vercel.app/

Two lock screens, two ways of reading a deadline:

- `/` — **T-Minus**: the digit version. `T−21 DAYS` plus a live `HH:MM:SS`.
- `/calendar/` — **Days Left**: the tear-off version. The days left are squares
  you count, not a number you read. Risograph on newsprint.
- `/line/` — **Line 10H**: for a deadline with no date. The stops are fixed,
  the arrival time isn't. Transit diagram.

## What it does

- Live countdown — `T−21 DAYS` plus `HH:MM:SS`, ticking every second
- Set any deadline; four checkpoints are generated backward across the run,
  the last one holding a day of buffer
- Checkpoints are renameable and show `done / next / ahead` automatically
- Your deadline is remembered in `localStorage`
- The panel is phone-shaped with the top and bottom left clear, so a
  screenshot works as a lock screen wallpaper without the system clock or
  the camera and torch buttons covering anything

## Built for

Handshake AI Skills Studio, November 2026 challenge —
*Your Deadline, Your Design: Create a Countdown Lock Screen*.
The default target is the challenge deadline itself: Nov 23 2026, 23:59 PT.

## Stack

One file. No build step, no dependencies. HTML, CSS and vanilla JavaScript,
with IBM Plex Mono and IBM Plex Sans from Google Fonts.
