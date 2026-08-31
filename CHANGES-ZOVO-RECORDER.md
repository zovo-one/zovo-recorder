# Changes from Screenity

Zovo Recorder 1.0.0 is based on Screenity commit `e10e375fafa1680de99ca6db36536dd4a1f4f7d4` (upstream version 4.6.6, 2026-08-18).

## Functional additions

- Timed post-capture text, box, and arrow annotations with live preview and WebM rendering.
- Automatic chapter capture when the active tab changes, pause-aware timing, privacy-trimmed URLs, and TXT/JSON export.
- Webcam circle, rounded, and square shapes with custom or four-corner placement presets.
- License activation/status UI backed by the Zovo verification endpoint.
- First-run practice workflow and original Zovo Recorder artwork.

## Reliability and packaging changes

- Preserved upstream fixes for encoder fallback, false watchdog stops, output recovery, region capture startup, system-audio guidance, and crop/export handling.
- Removed obsolete Fabric 5 patch-package inputs that fail against the locked Fabric 6.9.1 dependency.
- Added production build failure when the public Supabase anonymous key is absent.
- Added explicit compiler termination after a completed emit to prevent a lingering Node handle.
- Removed OAuth identity permission and disabled the legacy store-review destination.
- Namespaced DOM, messages, bundles, chunks, and storage with `zvrrec` / `zvr-rec` identifiers.

## Visual and product changes

- Replaced upstream logos and icons with an original capture-frame/play mark.
- Replaced the upstream blue system with ink, violet, and coral tokens.
- Added a responsive light/dark setup studio with a working practice-recorder action.
- Kept the Chrome Web Store title human and concise; search terms live in the description.

All changes are distributed under GPL-3.0 together with the complete corresponding source.
