# T-Minus Lock Screen

A deadline you can see from the lock screen. Set the target, the plan builds
itself backward from it, and the count runs live.

**Live:** https://krishna8758.github.io/tminus-lockscreen/

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
