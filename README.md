# Zovo Recorder

Private, local-first screen recording for Chrome with a full post-capture editor.

Zovo Recorder is a modified fork of [Screenity](https://github.com/alyssaxuu/screenity), originally created by Alyssa X and contributors. It retains Screenity's proven recording, recovery, trim/crop, audio, GIF, WebM, and MP4 foundations while adding a distinct Zovo workflow and reliability work.

## What changed

- A post-capture annotation track for timed text, boxes, and arrows, with annotated WebM export.
- Automatic chapter markers from tab switches, with preview and TXT/JSON export.
- Persisted webcam shape and corner-position presets in both tab and region recording.
- Clear GIF and WebM export surfaces alongside the upstream trim/crop editor.
- A local-first first-run studio, original icon system, purple/coral visual language, and a unique `zvrrec` DOM/storage namespace.
- A license verifier that accepts only the documented key shape and unlocks paid capabilities only when the verification service returns `valid: true`.
- Production-build enforcement for `SUPABASE_ANON_KEY`.
- Removal of the stale Fabric 5 patch files that prevented the current Fabric 6 dependency tree from installing.
- Reduced review solicitation and legacy cloud/identity exposure in the store build.

See [CHANGES-ZOVO-RECORDER.md](./CHANGES-ZOVO-RECORDER.md) for the detailed change record and [reports/UPSTREAM-BASELINE.md](./reports/UPSTREAM-BASELINE.md) for the untouched-upstream build/runtime baseline.

## Build

Requirements: Node.js 20.19 or newer, npm, and a public Supabase anonymous key for the license endpoint.

```bash
npm ci
cp .env.example .env
# set SUPABASE_ANON_KEY in .env
npm run build
```

Load the generated `build/` directory from `chrome://extensions` with Developer mode enabled.

The build refuses to emit a production paid tier if `SUPABASE_ANON_KEY` is absent. The anonymous key is intentionally public client configuration; never place a Supabase `service_role` or secret key in `.env`.

## Tests and release gates

```bash
npm run test:unit
npm run check:i18n
python3 path/to/compliance-scan.py build
```

The corresponding-source repository is [github.com/theluckystrike/zovo-recorder](https://github.com/theluckystrike/zovo-recorder).

## License and paid-use notice

The complete fork is licensed under GNU GPL version 3. See [LICENSE](./LICENSE). The original project, its history, and its copyright attribution remain available through the upstream repository and this repository's Git history.

Paid verification grants usage rights for the packaged paid capabilities; it is not a technical restriction on the GPL source. Anyone may inspect, modify, rebuild, and redistribute the complete corresponding source under GPL-3.0, including changing feature defaults, provided the license terms are followed.

Third-party component notices remain in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
