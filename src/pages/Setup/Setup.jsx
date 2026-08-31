/* SPDX-License-Identifier: GPL-3.0-only
 * Copyright (C) 2026 Zovo
 */

import React, { useEffect } from "react";

const featureCards = [
  ["01", "Capture", "Tab, window, region, webcam, microphone, and system audio."],
  ["02", "Shape", "Trim the take, annotate key moments, and arrange your camera."],
  ["03", "Share", "Export polished WebM, GIF, or chapter markers on your terms."],
];

const Setup = () => {
  const darkMode = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const openPracticeRecorder = () => {
    try {
      chrome.tabs.create({ url: chrome.runtime.getURL("playground.html") });
    } catch (_) {}
  };
  useEffect(() => {
    // Headless Chrome can retain a stale compositor tile when an extension
    // page is revisited after a color-scheme change. Force one clean paint;
    // this also makes live theme changes deterministic on slower machines.
    const timer = window.setTimeout(() => {
      const root = document.querySelector(".zvrSetup");
      if (!root) return;
      root.style.visibility = "hidden";
      void root.offsetHeight;
      window.requestAnimationFrame(() => {
        root.style.visibility = "visible";
      });
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <main className={`zvrSetup${darkMode ? " zvrSetup--dark" : ""}`}>
      <div className="zvrSetup__glow zvrSetup__glow--one" />
      <div className="zvrSetup__glow zvrSetup__glow--two" />
      <header className="zvrSetup__header">
        <div className="zvrSetup__brand">
          <img src={chrome.runtime.getURL("assets/brand/recorder-mark.svg")} />
          <span>Zovo Recorder</span>
        </div>
        <span className="zvrSetup__privacy">Local-first recording</span>
      </header>

      <section className="zvrSetup__hero">
        <div className="zvrSetup__copy">
          <span className="zvrSetup__eyebrow">
            A clearer recording workflow
          </span>
          <h1>Record the idea.<br /><em>Shape the story.</em></h1>
          <p>
            A private capture studio with a focused editor—built for product
            walkthroughs, lessons, and thoughtful async updates.
          </p>

          <div className="zvrSetup__action">
            <div className="zvrSetup__actionIcon" aria-hidden="true">
              ⌁
            </div>
            <div>
              <strong>
                Ready for a practice run?
              </strong>
              <span>
                Test capture on a safe practice canvas, then pin the toolbar icon for daily use.
              </span>
            </div>
            <button type="button" onClick={openPracticeRecorder}>
              Try the recorder
            </button>
          </div>
        </div>

        <div className="zvrSetup__stage" aria-label="Recording workflow preview">
          <div className="zvrSetup__window">
            <div className="zvrSetup__windowBar">
              <i /><i /><i />
              <span>product-walkthrough.webm</span>
            </div>
            <div className="zvrSetup__canvas">
              <div className="zvrSetup__captureFrame"><b>REC</b><span>02:14</span></div>
              <div className="zvrSetup__play">▶</div>
              <div className="zvrSetup__camera" />
              <div className="zvrSetup__note">Launch flow</div>
            </div>
            <div className="zvrSetup__timeline"><span /><span /><span /><span /><i /></div>
          </div>
          <svg
            className="zvrSetup__darkArt"
            viewBox="0 0 560 420"
            role="img"
            aria-label="Recorder editor with annotation, webcam, and timeline"
          >
            <defs>
              <linearGradient id="zvrSetupPlay" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#635bff" />
                <stop offset="1" stopColor="#817aff" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="558" height="418" rx="26" fill="#1a1830" stroke="#46415f" />
            <circle cx="24" cy="25" r="5" fill="#ff725e" /><circle cx="42" cy="25" r="5" fill="#67627d" /><circle cx="60" cy="25" r="5" fill="#67627d" />
            <text x="80" y="30" fill="#b9b5cb" fontSize="12">product-walkthrough.webm</text>
            <rect x="1" y="50" width="558" height="300" fill="#2d2952" />
            <rect x="28" y="78" width="504" height="244" rx="17" fill="none" stroke="#746cff" strokeDasharray="4 4" />
            <text x="45" y="104" fill="#ff725e" fontSize="12" fontWeight="700">REC</text>
            <text x="80" y="104" fill="#fff" fontSize="12" fontWeight="700">02:14</text>
            <rect x="238" y="154" width="84" height="84" rx="25" fill="url(#zvrSetupPlay)" />
            <path d="M270 177l29 19-29 19z" fill="#fff" />
            <rect x="54" y="258" width="102" height="38" rx="11" fill="#ff725e22" stroke="#ff806d" transform="rotate(-3 54 258)" />
            <text x="73" y="282" fill="#fff" fontSize="12">Launch flow</text>
            <circle cx="470" cy="270" r="42" fill="#ff8d7c" stroke="#fff" strokeWidth="5" />
            <rect x="18" y="369" width="126" height="30" rx="6" fill="#3b3757" /><rect x="151" y="369" width="126" height="30" rx="6" fill="#5148b7" /><rect x="284" y="369" width="126" height="30" rx="6" fill="#3b3757" /><rect x="417" y="369" width="125" height="30" rx="6" fill="#3b3757" />
            <rect x="270" y="360" width="3" height="48" fill="#ff725e" />
          </svg>
          <div className="zvrSetup__chapter">
            <small>AUTO CHAPTER</small>
            <strong>02:14 · Product page</strong>
          </div>
        </div>
      </section>

      <section className="zvrSetup__features">
        {featureCards.map(([number, title, body]) => (
          <article key={number}>
            <span>{number}</span>
            <div><h2>{title}</h2><p>{body}</p></div>
          </article>
        ))}
      </section>

      <footer>
        <span><b>⌥ ⇧ G</b> Keyboard shortcut · start recording</span>
        <a href="https://zovo.one" target="_blank" rel="noreferrer">zovo.one ↗</a>
      </footer>

      <style>{`
        :root { color-scheme: light dark; }
        * { box-sizing: border-box; }
        body { margin: 0; min-width: 760px; background: #f7f6fb; }
        .zvrSetup { --ink:#17152c; --muted:#68657b; --paper:#fff; --line:#dedbea; --violet:#635bff; --coral:#ff725e; min-height:100vh; overflow:hidden; position:relative; padding:28px clamp(32px,6vw,88px) 32px; color:var(--ink); background:radial-gradient(circle at 50% -20%,#fff 0,#f7f6fb 46%,#f0eef7 100%); font-family:'Satoshi-Medium',Inter,system-ui,sans-serif; }
        .zvrSetup__glow { position:absolute; border-radius:999px; filter:blur(2px); opacity:.44; pointer-events:none; }
        .zvrSetup__glow--one { width:320px; height:320px; right:-120px; top:90px; background:radial-gradient(circle,#8a83ff55,transparent 68%); }
        .zvrSetup__glow--two { width:260px; height:260px; left:-120px; bottom:40px; background:radial-gradient(circle,#ff8c7b44,transparent 68%); }
        .zvrSetup__header,.zvrSetup footer { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; max-width:1180px; margin:auto; }
        .zvrSetup__brand { display:flex; align-items:center; gap:11px; font-family:'Satoshi-Bold',sans-serif; font-size:16px; letter-spacing:-.25px; }
        .zvrSetup__brand img { width:36px; height:36px; border-radius:10px; box-shadow:0 7px 18px #17152c26; }
        .zvrSetup__privacy,.zvrSetup__eyebrow { color:var(--violet); background:#eceaff; border:1px solid #dcd8ff; border-radius:999px; padding:7px 12px; font-size:11px; font-family:'Satoshi-Bold',sans-serif; letter-spacing:.08em; text-transform:uppercase; }
        .zvrSetup__hero { position:relative; z-index:1; display:grid; grid-template-columns:minmax(310px,.78fr) minmax(400px,1.22fr); align-items:center; gap:clamp(42px,7vw,96px); max-width:1180px; margin:clamp(58px,8vh,96px) auto 52px; }
        .zvrSetup__copy h1 { margin:22px 0 18px; font:700 clamp(42px,5.2vw,72px)/.98 'Satoshi-Bold',sans-serif; letter-spacing:-.055em; }
        .zvrSetup__copy h1 em { color:var(--violet); font-style:normal; }
        .zvrSetup__copy>p { max-width:510px; color:var(--muted); font-size:17px; line-height:1.55; }
        .zvrSetup__action { display:grid; grid-template-columns:42px 1fr; gap:14px; align-items:center; margin-top:28px; padding:16px; max-width:520px; background:var(--paper); border:1px solid var(--line); border-radius:18px; box-shadow:0 18px 44px #2d275914; }
        .zvrSetup__actionIcon { display:grid; place-items:center; flex:0 0 42px; height:42px; border-radius:13px; color:#fff; font-size:22px; background:linear-gradient(145deg,var(--violet),var(--coral)); }
        .zvrSetup__action strong,.zvrSetup__action span { display:block; }
        .zvrSetup__action strong { font-family:'Satoshi-Bold',sans-serif; font-size:14px; }
        .zvrSetup__action span { color:var(--muted); margin-top:3px; font-size:12px; line-height:1.4; }
        .zvrSetup__action button { grid-column:1/-1; width:100%; border:0; border-radius:11px; padding:11px 14px; color:#fff; background:var(--violet); font:700 12px/1 'Satoshi-Bold',sans-serif; letter-spacing:.01em; cursor:pointer; box-shadow:0 8px 20px #635bff38; }
        .zvrSetup__action button:hover { background:#554de8; }
        .zvrSetup__action button:focus-visible { outline:3px solid #ff725e66; outline-offset:2px; }
        .zvrSetup__stage { position:relative; padding:28px 0 36px; }
        .zvrSetup__darkArt { display:none; width:100%; height:auto; filter:drop-shadow(0 35px 50px #0005); }
        .zvrSetup__window { position:relative; overflow:hidden; background:#1a1830; border:1px solid #ffffff20; border-radius:25px; box-shadow:0 35px 80px #2d275933,0 2px 8px #17152c33; }
        .zvrSetup__windowBar { display:flex; align-items:center; gap:7px; height:46px; padding:0 16px; color:#a7a3bd; font-size:11px; border-bottom:1px solid #ffffff12; }
        .zvrSetup__windowBar i { width:8px;height:8px;border-radius:50%;background:#504d67; }
        .zvrSetup__windowBar i:first-child { background:var(--coral); }
        .zvrSetup__windowBar span { margin-left:7px; }
        .zvrSetup__canvas { position:relative; display:grid; place-items:center; height:290px; background:linear-gradient(145deg,#302c57,#24213f); }
        .zvrSetup__canvas:before { content:''; position:absolute; inset:24px; border:1px dashed #918aff88; border-radius:16px; }
        .zvrSetup__captureFrame { position:absolute; left:38px; top:36px; display:flex; gap:9px; align-items:center; color:#fff; font-size:11px; }
        .zvrSetup__captureFrame b { color:var(--coral); letter-spacing:.1em; }
        .zvrSetup__play { display:grid;place-items:center;width:72px;height:72px;border-radius:24px;color:#fff;padding-left:5px;background:linear-gradient(145deg,var(--violet),#817aff);box-shadow:0 18px 36px #635bff66;font-size:23px; }
        .zvrSetup__camera { position:absolute; right:38px; bottom:32px; width:76px;height:76px;border-radius:50%;border:4px solid #fff;background:linear-gradient(145deg,#ffb5a9,var(--coral));box-shadow:0 10px 25px #0005; }
        .zvrSetup__note { position:absolute;left:48px;bottom:51px;padding:9px 13px;border:1px solid #ff8f7e;color:#fff;background:#ff725e33;border-radius:10px;font-size:11px;transform:rotate(-3deg); }
        .zvrSetup__timeline { position:relative;display:flex;gap:5px;height:54px;padding:14px;background:#12101f; }
        .zvrSetup__timeline span { flex:1;border-radius:5px;background:#393553; }
        .zvrSetup__timeline span:nth-child(2) { background:#635bff99; }
        .zvrSetup__timeline i { position:absolute;left:43%;top:8px;width:2px;height:38px;background:var(--coral);box-shadow:0 0 0 3px #ff725e33; }
        .zvrSetup__chapter { position:absolute;right:8px;bottom:2px;display:flex;flex-direction:column;padding:13px 17px;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:14px;box-shadow:0 17px 34px #2d275928; }
        .zvrSetup__chapter small { color:var(--coral);font:700 9px/1 'Satoshi-Bold',sans-serif;letter-spacing:.12em; }
        .zvrSetup__chapter strong { margin-top:6px;font-size:12px; }
        .zvrSetup__features { position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:1180px;margin:0 auto 30px; }
        .zvrSetup__features article { display:flex;gap:14px;padding:18px 19px;background:#ffffff8c;border:1px solid var(--line);border-radius:17px;backdrop-filter:blur(12px); }
        .zvrSetup__features article>span { color:var(--coral);font:700 11px/1 'Satoshi-Bold',sans-serif; }
        .zvrSetup__features h2 { margin:-2px 0 4px;font:700 15px/1.2 'Satoshi-Bold',sans-serif; }
        .zvrSetup__features p { margin:0;color:var(--muted);font-size:12px;line-height:1.45; }
        .zvrSetup footer { color:var(--muted);font-size:12px; }
        .zvrSetup footer>span { padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--muted); }
        .zvrSetup footer b { color:var(--ink);margin-right:6px; }
        .zvrSetup footer a { color:var(--violet);text-decoration:none;font-family:'Satoshi-Bold',sans-serif; }
        .zvrSetup--dark { --ink:#f7f5ff;--muted:#c0bdd1;--paper:#242139;--line:#474260;background:radial-gradient(circle at 50% -20%,#302c4b 0,#171522 48%,#100f18 100%); }
        .zvrSetup--dark .zvrSetup__privacy,.zvrSetup--dark .zvrSetup__eyebrow{background:#332e67;border-color:#4a438d;color:#b6b1ff}.zvrSetup--dark .zvrSetup__features article{background:#242139b8}.zvrSetup--dark .zvrSetup__action{box-shadow:0 18px 44px #0004}.zvrSetup--dark .zvrSetup__chapter{box-shadow:0 17px 34px #0005}
        .zvrSetup--dark .zvrSetup__window { display:none; }
        .zvrSetup--dark .zvrSetup__darkArt { display:block; }
        @media (max-width:900px) { .zvrSetup__hero{grid-template-columns:1fr;margin-top:45px}.zvrSetup__stage{display:none}.zvrSetup__features{grid-template-columns:1fr}.zvrSetup__copy{max-width:650px}.zvrSetup__privacy{display:none} }
      `}</style>
    </main>
  );
};

export default Setup;
