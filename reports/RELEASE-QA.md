# Release QA — Zovo Recorder 1.0.0

Date: 2026-08-31

## Passed gates

- Production build with `SUPABASE_ANON_KEY` enforced at compile time.
- Unit tests: 5/5 passed, including exact key-shape and `valid: true`-only grant behavior.
- Chrome runtime smoke: setup rendered, CTA opened the practice recorder, content script mounted, recorder panel opened, zero captured runtime errors.
- Compliance scanner: CLEAN, zero violations across 61 reviewer-facing files.
- Secret scanner: no forbidden secrets; no privileged Supabase credential shipped.
- Fleet design constraints: 3 reviewer-visible brand tokens and zero residual `zovo-` namespace tokens.
- Fleet divergence scanner: `ready: true`, zero blockers; the broad-host warning is justified in `store-listing/permissions.md` because recorder controls must mount on the page selected by the user.
- Design review: 9.2/10 from each of three independent critics; no blocker or major issue remained.

## Visual evidence

- `store-assets/01-setup-1280x800.png`
- `store-assets/02-recorder-1280x800.png`
- `evidence/design/options.light.png`
- `evidence/design/options.dark.png`

## Publication boundary

The package is prepared as a Chrome Web Store draft. It has not been submitted or published to the Chrome Web Store.
