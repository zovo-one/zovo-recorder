/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const extensionPath = path.resolve(process.argv[2] || "build");
const outputPath = path.resolve(process.argv[3] || "reports/runtime-smoke");
const chromePath = process.env.ZVR_RECORDER_CHROME_PATH || chromium.executablePath();

await mkdir(outputPath, { recursive: true });
const profilePath = await mkdtemp(path.join(tmpdir(), "zvrrec-runtime-"));
const errors = [];
const server = createServer((_request, response) => {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(`<!doctype html><html><head><title>Recorder test page</title></head>
    <body style="font:20px system-ui;padding:64px;background:#f4f2fb;color:#17152c">
      <h1>Runtime capture surface</h1><p>This local page verifies the packaged content script and recorder panel.</p>
    </body></html>`);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;

let context;
try {
  context = await chromium.launchPersistentContext(profilePath, {
    executablePath: chromePath,
    headless: true,
    viewport: { width: 1280, height: 800 },
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      "--headless=new",
    ],
  });

  const worker =
    context.serviceWorkers()[0] ||
    (await context.waitForEvent("serviceworker", { timeout: 20_000 }));
  const extensionId = new URL(worker.url()).host;
  worker.on("console", (message) => {
    if (message.type() === "error") errors.push(`worker: ${message.text()}`);
  });

  const setup = await context.newPage();
  setup.on("pageerror", (error) => errors.push(`setup: ${error.message}`));
  await setup.goto(`chrome-extension://${extensionId}/setup.html`);
  await setup.getByRole("heading", { name: /Record the idea/i }).waitFor();
  await setup.screenshot({ path: path.join(outputPath, "store-setup-1280x800.png") });

  const newPagePromise = context.waitForEvent("page");
  await setup.getByRole("button", { name: "Try the recorder" }).click();
  const playground = await newPagePromise;
  await playground.waitForLoadState("domcontentloaded");
  assert.equal(new URL(playground.url()).pathname, "/playground.html");

  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(`content: ${error.message}`));
  const targetUrl = `http://127.0.0.1:${port}/`;
  await page.goto(targetUrl);
  await page.locator("#zvrrec-ui").waitFor({
    state: "attached",
    timeout: 20_000,
  });

  const delivery = await worker.evaluate(async (url) => {
    const tabs = await chrome.tabs.query({});
    const tab = tabs.find((candidate) => candidate.url === url);
    if (!tab?.id) return { ok: false, reason: "target-tab-not-found" };
    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "toggle-popup",
      });
      return { ok: true, response };
    } catch (error) {
      return { ok: false, reason: String(error) };
    }
  }, targetUrl);
  assert.equal(delivery.ok, true, delivery.reason);

  await page.waitForFunction(() => {
    const visibleText = (node) => {
      const parts = [];
      for (const child of node?.querySelectorAll?.("button,label,h1,h2,h3,p,span") || []) {
        const box = child.getBoundingClientRect();
        if (box.width && box.height) parts.push(child.innerText || "");
      }
      for (const child of node?.querySelectorAll?.("*") || []) {
        if (child.shadowRoot) parts.push(visibleText(child.shadowRoot));
      }
      return parts.join(" ");
    };
    return /start recording/i.test(visibleText(document.querySelector("#zvrrec-ui")));
  });
  const panelText = await page.locator("#zvrrec-ui").evaluate((root) => {
    const visibleText = (node) => {
      const parts = [];
      for (const child of node?.querySelectorAll?.("button,label,h1,h2,h3,p,span") || []) {
        const box = child.getBoundingClientRect();
        if (box.width && box.height) parts.push(child.innerText || "");
      }
      for (const child of node?.querySelectorAll?.("*") || []) {
        if (child.shadowRoot) parts.push(visibleText(child.shadowRoot));
      }
      return parts.join(" ");
    };
    return visibleText(root).replace(/\s+/g, " ").trim();
  });
  assert.match(panelText, /start recording/i);
  await page.screenshot({ path: path.join(outputPath, "store-recorder-1280x800.png") });

  const report = {
    extensionId,
    setupRendered: true,
    setupCtaOpenedPlayground: true,
    contentScriptMounted: true,
    popupMessageDelivered: true,
    popupTextSample: panelText.slice(0, 240),
    runtimeErrors: errors,
  };
  await writeFile(
    path.join(outputPath, "report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await context?.close();
  await new Promise((resolve) => server.close(resolve));
  await rm(profilePath, { recursive: true, force: true });
}
