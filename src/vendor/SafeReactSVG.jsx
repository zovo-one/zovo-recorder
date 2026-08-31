/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

import React, { useEffect, useRef, useState } from "react";

// MV3-safe replacement for react-svg. The upstream package includes an
// optional script evaluator even when evalScripts="never"; Chrome Web Store
// policy scanners correctly reject that dead code. This component preserves
// local inline-SVG styling while stripping executable SVG content.
export const ReactSVG = ({
  src,
  fallback = null,
  loading = null,
  beforeInjection,
  afterInjection,
  onError,
  evalScripts: _evalScripts,
  renumerateIRIElements: _renumerateIRIElements,
  useRequestCache: _useRequestCache,
  httpRequestWithCredentials: _httpRequestWithCredentials,
  ...wrapperProps
}) => {
  const [markup, setMarkup] = useState("");
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setMarkup("");
    setError(null);

    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load SVG: ${response.status}`);
        return response.text();
      })
      .then((text) => {
        const documentNode = new DOMParser().parseFromString(
          text,
          "image/svg+xml",
        );
        if (documentNode.querySelector("parsererror")) {
          throw new Error("Unable to parse SVG");
        }
        const svg = documentNode.documentElement;
        svg.querySelectorAll("script, foreignObject").forEach((node) => node.remove());
        svg.querySelectorAll("*").forEach((node) => {
          [...node.attributes].forEach((attribute) => {
            const name = attribute.name.toLowerCase();
            const value = attribute.value.trim().toLowerCase();
            if (name.startsWith("on") || value.startsWith("javascript:")) {
              node.removeAttribute(attribute.name);
            }
          });
        });
        beforeInjection?.(svg);
        setMarkup(svg.outerHTML);
      })
      .catch((loadError) => {
        if (loadError.name === "AbortError") return;
        setError(loadError);
        onError?.(loadError);
      });

    return () => controller.abort();
  }, [src, beforeInjection, onError]);

  useEffect(() => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (svg) afterInjection?.(svg);
  }, [markup, afterInjection]);

  if (error) return fallback;

  return (
    <div
      {...wrapperProps}
      ref={wrapperRef}
      dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
    >
      {!markup ? loading : null}
    </div>
  );
};

export default ReactSVG;
