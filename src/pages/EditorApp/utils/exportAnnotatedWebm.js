/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

const pickMimeType = () => {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
};

const drawArrow = (context, x, y, width, color, scale) => {
  const endX = x + width;
  const head = Math.max(12, 18 * scale);
  context.strokeStyle = color;
  context.lineWidth = Math.max(4, 6 * scale);
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(endX, y);
  context.lineTo(endX - head, y - head * 0.65);
  context.moveTo(endX, y);
  context.lineTo(endX - head, y + head * 0.65);
  context.stroke();
};

export const drawAnnotations = (context, annotations, time, width, height) => {
  const scale = Math.max(0.6, width / 1280);
  for (const item of annotations) {
    if (time < item.start || time > item.start + item.duration) continue;
    const x = (item.x / 100) * width;
    const y = (item.y / 100) * height;
    const color = item.color || "#635bff";
    if (item.kind === "text") {
      const fontSize = Math.max(18, 30 * scale);
      context.font = `700 ${fontSize}px system-ui, sans-serif`;
      context.textBaseline = "top";
      const padding = 10 * scale;
      const text = String(item.text || "Note").slice(0, 120);
      const metrics = context.measureText(text);
      context.fillStyle = "rgba(17, 20, 35, 0.82)";
      context.fillRect(
        x - padding,
        y - padding,
        metrics.width + padding * 2,
        fontSize + padding * 2,
      );
      context.fillStyle = "#fff";
      context.fillText(text, x, y);
    } else if (item.kind === "box") {
      context.strokeStyle = color;
      context.lineWidth = Math.max(4, 6 * scale);
      context.strokeRect(x, y, width * 0.32, height * 0.26);
    } else {
      drawArrow(context, x, y, width * 0.28, color, scale);
    }
  }
};

export async function exportAnnotatedWebm(sourceBlob, annotations, onProgress) {
  if (!(sourceBlob instanceof Blob) || sourceBlob.size === 0) {
    throw new Error("No recording is available to annotate.");
  }

  const sourceUrl = URL.createObjectURL(sourceBlob);
  const video = document.createElement("video");
  video.src = sourceUrl;
  video.preload = "auto";
  video.playsInline = true;
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = resolve;
    video.onerror = () => reject(new Error("Could not decode the recording."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, video.videoWidth || 1280);
  canvas.height = Math.max(2, video.videoHeight || 720);
  const context = canvas.getContext("2d", { alpha: false });
  const canvasStream = canvas.captureStream(30);
  const outputStream = new MediaStream(canvasStream.getVideoTracks());
  const sourceStream = video.captureStream?.();
  sourceStream?.getAudioTracks().forEach((track) => outputStream.addTrack(track));

  const chunks = [];
  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(
    outputStream,
    mimeType ? { mimeType, videoBitsPerSecond: 7_000_000 } : undefined,
  );
  recorder.ondataavailable = (event) => {
    if (event.data?.size) chunks.push(event.data);
  };

  let frameId = null;
  const render = () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    drawAnnotations(
      context,
      annotations,
      video.currentTime,
      canvas.width,
      canvas.height,
    );
    onProgress?.(
      video.duration > 0
        ? Math.min(99, Math.round((video.currentTime / video.duration) * 100))
        : 0,
    );
    if (!video.ended && !video.paused) frameId = requestAnimationFrame(render);
  };

  const complete = new Promise((resolve, reject) => {
    recorder.onerror = () => reject(new Error("Annotated export failed."));
    recorder.onstop = () =>
      resolve(new Blob(chunks, { type: mimeType || "video/webm" }));
  });

  try {
    recorder.start(1000);
    await video.play();
    render();
    await new Promise((resolve) => {
      video.onended = resolve;
    });
    recorder.stop();
    const result = await complete;
    onProgress?.(100);
    return result;
  } finally {
    if (frameId) cancelAnimationFrame(frameId);
    video.pause();
    outputStream.getTracks().forEach((track) => track.stop());
    sourceStream?.getTracks().forEach((track) => track.stop());
    URL.revokeObjectURL(sourceUrl);
  }
}
