# MindMantra - Designing & Prototyping project
Open **index.html** in any browser. No install, no server. Plain HTML5 + CSS3 + small vanilla JavaScript.

## Pages
index (welcome) | home (dashboard + Digital Greenhouse + Tiny Wins) | mood-screen (gradient-map check-in) | voice-vent | campus-pulse | emergency-sos (low-energy mode, no navigation)

## Working vs demo
Working: page links, Tiny Wins tap + sparkle, greenhouse healthy/wilting toggle, tap/drag mood map, six option cards + suggestion, Voice Vent screen states (dawn transition), SOS random exercise (light, 5-4-3-2-1, haptic via phone vibration), Pulse breathing text.
Demo only: all numbers/dots on Campus Pulse (illustrative), Voice Vent (no audio is recorded), greenhouse state (toggle, not saved), no backend/login/database.

## Viva guide
- **:root variables** store the palette; change one colour, every page updates.
- **Flexbox** (.row, .top, .nav, .app column) for rows/columns; **CSS Grid** (.grid2) for 2-column cards.
- **max-width:430px** on .app makes the phone-screen look; the media query adds the rounded frame on desktops.
- **@keyframes** drive floating logo, pulse, breathe, sparkle. **transition** makes hover and wilting smooth.
- **position: sticky** keeps the bottom nav visible. **backdrop-filter** gives the frosted glass cards.
- JS: `querySelector` finds elements, `onclick` handles taps, `classList.toggle` changes state, `setInterval` repeats (waveform, breathing text), `createElement` makes sparkles and dots.
- Nav and logo are built by one function each in script.js so every page stays identical.
