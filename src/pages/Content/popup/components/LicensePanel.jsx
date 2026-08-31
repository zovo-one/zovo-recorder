/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

import React, { useEffect, useState } from "react";
import {
  activateZvrLicense,
  getZvrLicenseState,
  normalizeZvrLicenseKey,
} from "../../../../licensing/zvrLicense";

const LicensePanel = () => {
  const [key, setKey] = useState("");
  const [state, setState] = useState({ loading: true, valid: false });

  useEffect(() => {
    let mounted = true;
    getZvrLicenseState().then((result) => {
      if (mounted) setState({ loading: false, valid: result.valid === true });
    });
    return () => {
      mounted = false;
    };
  }, []);

  const activate = async () => {
    if (!normalizeZvrLicenseKey(key)) {
      setState({ loading: false, valid: false, error: "shape" });
      return;
    }
    setState({ loading: true, valid: false });
    const result = await activateZvrLicense(key);
    setState({ loading: false, valid: result.valid === true, error: result.error });
  };

  const status = state.valid
    ? "Licence active — lifetime and Pro grants are accepted."
    : state.error === "shape"
      ? "Use the format shown in your purchase email."
      : state.error
        ? "Could not verify that key. Check your connection and try again."
        : "Verify once, then use paid conveniences offline on this device.";

  return (
    <section className="zvrrecLicense" aria-label="Licence">
      <div className="zvrrecLicense__heading">
        <span>Recorder Pro</span>
        <span className={state.valid ? "is-active" : ""}>
          {state.valid ? "Active" : "Optional"}
        </span>
      </div>
      <p>{status}</p>
      {!state.valid && (
        <div className="zvrrecLicense__form">
          <input
            aria-label="Licence key"
            autoComplete="off"
            inputMode="text"
            maxLength={64}
            onChange={(event) => setKey(event.target.value.toUpperCase())}
            onKeyDown={(event) => event.key === "Enter" && activate()}
            placeholder="ZOVO-AB12-CD34-EF56-GH78"
            value={key}
          />
          <button disabled={state.loading} onClick={activate} type="button">
            {state.loading ? "Checking…" : "Activate"}
          </button>
        </div>
      )}
      <button
        className="zvrrecLicense__pricing"
        onClick={() => window.open("https://zovo.one/pricing", "_blank")}
        type="button"
      >
        See pricing
      </button>
    </section>
  );
};

export default LicensePanel;
