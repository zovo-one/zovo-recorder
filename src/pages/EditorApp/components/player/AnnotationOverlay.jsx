/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ContentStateContext } from "../../context/ContentState";

const AnnotationOverlay = ({ host }) => {
  const [contentState] = useContext(ContentStateContext);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const video = document.querySelector("#plyr-player, .plyr video");
    if (!video) return undefined;
    const update = () => setTime(video.currentTime || 0);
    video.addEventListener("timeupdate", update);
    video.addEventListener("seeking", update);
    update();
    return () => {
      video.removeEventListener("timeupdate", update);
      video.removeEventListener("seeking", update);
    };
  }, [host]);

  if (!host) return null;
  const active = (contentState.annotations || []).filter(
    (item) => time >= item.start && time <= item.start + item.duration,
  );

  return createPortal(
    <div className="zvrrecAnnotationOverlay" aria-hidden="true">
      {active.map((item) => (
        <div
          className={`zvrrecAnnotation zvrrecAnnotation--${item.kind}`}
          key={item.id}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            "--annotation-color": item.color || "#635bff",
          }}
        >
          {item.kind === "text" ? item.text : null}
        </div>
      ))}
    </div>,
    host,
  );
};

export default AnnotationOverlay;
