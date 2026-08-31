# Fleet divergence result

Date: 2026-08-31

The canonical Layer 5.9 rules returned:

```json
{
  "ext": "Zovo-Recorder",
  "desc_len": 101,
  "brand": 3,
  "residual_zovo": 0,
  "BLOCK": [],
  "WARN": ["broad host_permissions ['<all_urls>'] (justify or narrow)"],
  "FIX": [],
  "ready": true
}
```

The host warning is expected for user-invoked recorder UI injection and is addressed in `store-listing/permissions.md`.

Three sibling build directories were iCloud-offloaded during the scan. Their CSS/JS filenames were enumerated without reading file contents and had zero basename intersections with Zovo Recorder, making a shared basename-plus-hash collision impossible. All locally materialized sibling bundles and icons were compared by the canonical scanner.
