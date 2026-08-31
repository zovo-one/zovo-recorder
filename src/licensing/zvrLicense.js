/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 *
 * Zovo Recorder licence verification.
 *
 * This GPL-3.0 gate is a distribution convenience, not a technical
 * restriction. Anyone may rebuild the complete corresponding source with
 * different feature defaults.
 */

export const ZVR_LICENSE_KEY_RE =
  /^ZOVO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

const VERIFY_URL =
  "https://zgubxqomnbmxgbdhvwja.supabase.co/functions/v1/verify-extension-license";
const EXTENSION_KEY = "recorder";
const STORAGE_KEY = "zvrrec.recorder.license";
const VERIFY_TIMEOUT_MS = 8000;
const ANON_KEY =
  typeof __ZVR_REC_SUPABASE_ANON_KEY__ === "string"
    ? __ZVR_REC_SUPABASE_ANON_KEY__
    : "";

const storageGet = (key) =>
  new Promise((resolve) => {
    try {
      chrome.storage.local.get([key], (result) => resolve(result?.[key]));
    } catch (_) {
      resolve(undefined);
    }
  });

const storageSet = (value) =>
  new Promise((resolve) => {
    try {
      chrome.storage.local.set(value, () =>
        resolve(!chrome.runtime.lastError),
      );
    } catch (_) {
      resolve(false);
    }
  });

export function normalizeZvrLicenseKey(raw) {
  if (typeof raw !== "string" || raw.length > 64) return null;
  const normalized = raw.trim().toUpperCase();
  return ZVR_LICENSE_KEY_RE.test(normalized) ? normalized : null;
}

export async function getZvrLicenseState() {
  const record = await storageGet(STORAGE_KEY);
  if (!record || record.valid !== true) return { valid: false };
  if (!normalizeZvrLicenseKey(record.key)) return { valid: false };
  if (!Number.isFinite(record.activatedAt)) return { valid: false };
  return { valid: true, activatedAt: record.activatedAt };
}

export async function activateZvrLicense(raw, options = {}) {
  const key = normalizeZvrLicenseKey(raw);
  const anonKey = options.anonKey || ANON_KEY;
  const fetchImpl = options.fetchImpl || fetch;
  if (!key) return { valid: false, error: "shape" };
  if (!anonKey) return { valid: false, error: "configuration" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  try {
    const response = await fetchImpl(VERIFY_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ license_key: key, extension: EXTENSION_KEY }),
      signal: controller.signal,
    });
    if (!response.ok) return { valid: false, error: "rejected" };
    const verdict = await response.json().catch(() => null);
    if (!verdict || verdict.valid !== true) {
      return { valid: false, error: "rejected" };
    }

    // valid:true is the only grant. Never gate on tier === "pro": lifetime
    // purchases are valid and must remain unlocked.
    const stored = await storageSet({
      [STORAGE_KEY]: {
        key,
        valid: true,
        serverTier:
          typeof verdict.tier === "string" ? verdict.tier : "unspecified",
        activatedAt: Date.now(),
      },
    });
    return stored
      ? { valid: true }
      : { valid: false, error: "storage" };
  } catch (error) {
    return {
      valid: false,
      error: error?.name === "AbortError" ? "timeout" : "offline",
    };
  } finally {
    clearTimeout(timer);
  }
}

export { STORAGE_KEY as ZVR_LICENSE_STORAGE_KEY };
