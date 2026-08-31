/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

import React, { useContext } from "react";
import { contentStateContext } from "../../context/ContentState";

const POSITIONS = ["custom", "top-left", "top-right", "bottom-left", "bottom-right"];
const SHAPES = ["circle", "rounded", "square"];

const CameraPresetControls = () => {
  const [contentState, setContentState] = useContext(contentStateContext);

  const update = (patch) => {
    setContentState((previous) => ({
      ...previous,
      ...patch,
      cameraPresetTick: (previous.cameraPresetTick || 0) + 1,
    }));
    chrome.storage.local.set({
      "zvrrec.recorder.cameraPreset": {
        shape: patch.cameraShape || contentState.cameraShape || "circle",
        position:
          patch.cameraPositionPreset ||
          contentState.cameraPositionPreset ||
          "custom",
      },
    });
  };

  return (
    <div className="zvrrecCameraPresets" aria-label="Webcam presets">
      <select
        aria-label="Webcam shape"
        onChange={(event) => update({ cameraShape: event.target.value })}
        value={contentState.cameraShape || "circle"}
      >
        {SHAPES.map((shape) => (
          <option key={shape} value={shape}>{shape}</option>
        ))}
      </select>
      <select
        aria-label="Webcam position"
        onChange={(event) => update({ cameraPositionPreset: event.target.value })}
        value={contentState.cameraPositionPreset || "custom"}
      >
        {POSITIONS.map((position) => (
          <option key={position} value={position}>{position.replace("-", " ")}</option>
        ))}
      </select>
    </div>
  );
};

export default CameraPresetControls;
