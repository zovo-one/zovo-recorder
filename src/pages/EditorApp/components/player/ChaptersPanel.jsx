/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

import React, { useEffect, useState } from "react";
import { getZvrLicenseState } from "../../../../licensing/zvrLicense";

const STORAGE_KEY = "zvrrec.recorder.chapters";

const formatTime = (milliseconds) => {
  const total = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const downloadText = (filename, text, type) => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  chrome.downloads.download({ url, filename }, () => URL.revokeObjectURL(url));
};

const ChaptersPanel = () => {
  const [chapters, setChapters] = useState([]);
  const [licensed, setLicensed] = useState(false);

  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      setChapters(result?.[STORAGE_KEY]?.items || []);
    });
    getZvrLicenseState().then((result) => setLicensed(result.valid === true));
  }, []);

  if (!chapters.length) return null;

  const seek = (offsetMs) => {
    const video = document.querySelector("#plyr-player, .plyr video");
    if (video) video.currentTime = Math.max(0, offsetMs / 1000);
  };

  const requireLicence = () => {
    if (licensed) return true;
    window.open("https://zovo.one/pricing", "_blank");
    return false;
  };

  const exportJson = () => {
    if (!requireLicence()) return;
    downloadText(
      "recording-chapters.json",
      JSON.stringify({ version: 1, chapters }, null, 2),
      "application/json",
    );
  };

  const exportText = () => {
    if (!requireLicence()) return;
    const text = chapters
      .map((chapter) => `${formatTime(chapter.offsetMs)} ${chapter.title}`)
      .join("\n");
    downloadText("recording-chapters.txt", text, "text/plain");
  };

  return (
    <section className="zvrrecChapters">
      <div className="zvrrecChapters__header">
        <div>
          <strong>Auto chapters</strong>
          <span>{chapters.length} tab switch{chapters.length === 1 ? "" : "es"}</span>
        </div>
        <div>
          <button onClick={exportText}>TXT</button>
          <button onClick={exportJson}>JSON</button>
        </div>
      </div>
      <ol>
        {chapters.map((chapter, index) => (
          <li key={`${chapter.offsetMs}-${chapter.tabId}-${index}`}>
            <button onClick={() => seek(chapter.offsetMs)}>
              <time>{formatTime(chapter.offsetMs)}</time>
              <span>{chapter.title}</span>
            </button>
          </li>
        ))}
      </ol>
      {!licensed && <p>Preview is free. Pro exports chapter files.</p>}
    </section>
  );
};

export default ChaptersPanel;
