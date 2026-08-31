# Upstream baseline

Date: 2026-08-31

Upstream: `alyssaxuu/screenity`
Commit: `e10e375fafa1680de99ca6db36536dd4a1f4f7d4`
Release: 4.6.6

## Untouched source-build result

`npm ci` failed during `patch-package`. The repository contains `fabric+5.3.0.patch` and `fabric+5.5.2.patch`, while the current lockfile installs Fabric 6.9.1. This is an upstream source-release defect and was recorded before any fork changes.

## Untouched runtime result

The official 4.6.6 `build.zip` was loaded in Chrome for Testing. The recording chooser rendered successfully with tab/window/camera inputs and system-audio guidance. Baseline evidence is included with the ready-to-publish release package:

- `evidence/upstream-baseline/popup.light.png`
- `evidence/upstream-baseline/popup.dark.png`

The fork was created only after this runtime baseline was demonstrated. The stale patch files were then removed in the fork so a clean source install could complete.
