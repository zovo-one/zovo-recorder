/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

import React, { useContext, useEffect, useState } from "react";
import { ContentStateContext } from "../../context/ContentState";
import { getZvrLicenseState } from "../../../../licensing/zvrLicense";
import { exportAnnotatedWebm } from "../../utils/exportAnnotatedWebm";

const AnnotationPanel = () => {
  const [contentState, setContentState] = useContext(ContentStateContext);
  const [kind, setKind] = useState("text");
  const [text, setText] = useState("Key point");
  const [duration, setDuration] = useState(5);
  const [x, setX] = useState(12);
  const [y, setY] = useState(12);
  const [licensed, setLicensed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getZvrLicenseState().then((result) => setLicensed(result.valid === true));
  }, []);

  const add = () => {
    const video = document.querySelector("#plyr-player, .plyr video");
    const start = Math.max(0, Number(video?.currentTime || 0));
    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      kind,
      text: kind === "text" ? text.trim().slice(0, 120) || "Note" : "",
      start,
      duration: Math.max(1, Math.min(60, Number(duration) || 5)),
      x: Math.max(2, Math.min(90, Number(x) || 12)),
      y: Math.max(2, Math.min(85, Number(y) || 12)),
      color: "#635bff",
    };
    setContentState((previous) => ({
      ...previous,
      annotations: [...(previous.annotations || []), item],
    }));
  };

  const remove = (id) =>
    setContentState((previous) => ({
      ...previous,
      annotations: (previous.annotations || []).filter((item) => item.id !== id),
    }));

  const exportVideo = async () => {
    if (!licensed) {
      window.open("https://zovo.one/pricing", "_blank");
      return;
    }
    const source = contentState.blob || contentState.webm || contentState.rawBlob;
    if (!source || !(contentState.annotations || []).length || exporting) return;
    setExporting(true);
    setProgress(0);
    setError("");
    try {
      const result = await exportAnnotatedWebm(
        source,
        contentState.annotations,
        setProgress,
      );
      const url = URL.createObjectURL(result);
      chrome.downloads.download(
        { url, filename: "recording-annotated.webm" },
        () => URL.revokeObjectURL(url),
      );
    } catch (exportError) {
      console.error("Annotated WebM export failed", exportError);
      setError("Export failed. Keep this editor open and try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="zvrrecAnnotations">
      <div className="zvrrecAnnotations__title">
        <strong>Post-capture annotations</strong>
        <span>Appear for {duration}s from the playhead</span>
      </div>
      <div className="zvrrecAnnotations__controls">
        <select value={kind} onChange={(event) => setKind(event.target.value)}>
          <option value="text">Text note</option>
          <option value="box">Focus box</option>
          <option value="arrow">Arrow</option>
        </select>
        {kind === "text" && (
          <input
            aria-label="Annotation text"
            maxLength={120}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        )}
        <label>
          X
          <input type="range" min="2" max="90" value={x} onChange={(event) => setX(event.target.value)} />
        </label>
        <label>
          Y
          <input type="range" min="2" max="85" value={y} onChange={(event) => setY(event.target.value)} />
        </label>
        <label>
          Seconds
          <input type="number" min="1" max="60" value={duration} onChange={(event) => setDuration(event.target.value)} />
        </label>
        <button onClick={add}>Add at playhead</button>
      </div>
      {(contentState.annotations || []).length > 0 && (
        <ul>
          {contentState.annotations.map((item) => (
            <li key={item.id}>
              <span>{item.kind} · {item.start.toFixed(1)}s</span>
              <button onClick={() => remove(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button
        className="zvrrecAnnotations__export"
        disabled={exporting || !(contentState.annotations || []).length}
        onClick={exportVideo}
      >
        {exporting
          ? `Rendering annotated WebM… ${progress}%`
          : licensed
            ? "Export annotated WebM"
            : "Unlock annotated export"}
      </button>
      {error && <p role="alert">{error}</p>}
    </section>
  );
};

export default AnnotationPanel;
