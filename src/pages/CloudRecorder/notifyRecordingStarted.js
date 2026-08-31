const API_BASE = process.env.ZVR_RECORDER_API_BASE_URL;

// Tells app-web a capture is running so its auto-render sweep skips
// this project. Scheduling hint only, so failures stay silent.
export const notifyRecordingStarted = (projectId) => {
  if (!projectId || !API_BASE) return;
  (async () => {
    try {
      const { zvrrecToken } = await chrome.storage.local.get([
        "zvrrecToken",
      ]);
      await fetch(`${API_BASE}/videos/${projectId}/recording-started/`, {
        method: "POST",
        headers: zvrrecToken
          ? { Authorization: `Bearer ${zvrrecToken}` }
          : {},
      });
    } catch {}
  })();
};
