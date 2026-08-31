/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

export const CHAPTERS_STORAGE_KEY = "zvrrec.recorder.chapters";
const MAX_CHAPTERS = 200;

const safePage = (tab) => {
  let page = "";
  try {
    const parsed = new URL(tab?.url || "");
    page = `${parsed.origin}${parsed.pathname}`;
  } catch {
    page = "";
  }
  return {
    tabId: tab?.id ?? null,
    title: String(tab?.title || "Untitled tab").slice(0, 160),
    page: page.slice(0, 500),
  };
};

export async function captureActivatedTabChapter(tab, timing) {
  if (!timing?.recordingStartTime || !tab) return;
  if (String(tab.url || "").startsWith(chrome.runtime.getURL(""))) return;

  const now = Date.now();
  const basePaused = timing.totalPausedMs || 0;
  const extraPaused =
    timing.paused && timing.pausedAt
      ? Math.max(0, now - timing.pausedAt)
      : 0;
  const offsetMs = Math.max(
    0,
    now - timing.recordingStartTime - basePaused - extraPaused,
  );
  const existing = await chrome.storage.local.get([CHAPTERS_STORAGE_KEY]);
  const record = existing?.[CHAPTERS_STORAGE_KEY];
  const items =
    record?.startedAt === timing.recordingStartTime && Array.isArray(record.items)
      ? record.items.slice(0, MAX_CHAPTERS)
      : [];
  const page = safePage(tab);
  const last = items[items.length - 1];
  if (last?.tabId === page.tabId) return;

  items.push({
    ...page,
    offsetMs: Math.round(offsetMs / 100) * 100,
  });
  await chrome.storage.local.set({
    [CHAPTERS_STORAGE_KEY]: {
      startedAt: timing.recordingStartTime,
      updatedAt: now,
      items: items.slice(-MAX_CHAPTERS),
    },
  });
}
