// // UuidGeneratorTool.jsx — v1
// // UUID (v4 / v7) and ULID generator. Zero deps — uses crypto.randomUUID
// // and handrolls v7 + ULID per spec.

// import { useState, useEffect, useRef, useCallback } from 'react';

// const DEFAULT_EXPLANATIONS = {
//   v4: (
//     <>
//       <p><b>UUID v4</b> is a 128-bit random identifier. The go-to for distributed IDs: no coordination needed, essentially zero collision risk.</p>
//       <p>Uses <code>crypto.randomUUID()</code>, the browser&apos;s cryptographically-secure RNG.</p>
//     </>
//   ),
//   v7: (
//     <>
//       <p><b>UUID v7</b> is time-ordered: the first 48 bits are a Unix millisecond timestamp, so IDs sort naturally by creation time.</p>
//       <p>Better than v4 for database primary keys — no index fragmentation from random inserts. Newer spec, so verify library support before using in production.</p>
//     </>
//   ),
//   ulid: (
//     <>
//       <p><b>ULID</b> is a 26-character time-sortable identifier — 48 bits of Unix ms timestamp + 80 bits of randomness, Crockford base-32 encoded.</p>
//       <p>Same time-ordering benefit as UUID v7, but shorter and URL-safe out of the box.</p>
//     </>
//   ),
// };

// // ---------- UUID v4 (uses browser crypto) ----------
// function generateV4() {
//   if (typeof crypto !== 'undefined' && crypto.randomUUID) {
//     return crypto.randomUUID();
//   }
//   // Fallback if crypto.randomUUID is unavailable (very old browsers)
//   const bytes = new Uint8Array(16);
//   crypto.getRandomValues(bytes);
//   bytes[6] = (bytes[6] & 0x0f) | 0x40;
//   bytes[8] = (bytes[8] & 0x3f) | 0x80;
//   const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
//   return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
// }

// // ---------- UUID v7 (draft, RFC 9562) ----------
// function generateV7(msNow) {
//   // 48 bits timestamp (ms) | 4 bits version | 12 bits rand | 2 bits variant | 62 bits rand
//   const bytes = new Uint8Array(16);
//   crypto.getRandomValues(bytes);

//   // Timestamp — first 48 bits, big-endian
//   let ts = BigInt(msNow);
//   for (let i = 5; i >= 0; i--) {
//     bytes[i] = Number(ts & 0xffn);
//     ts >>= 8n;
//   }
//   // Version 7 in the upper 4 bits of byte 6
//   bytes[6] = (bytes[6] & 0x0f) | 0x70;
//   // Variant 10xx in the upper 2 bits of byte 8
//   bytes[8] = (bytes[8] & 0x3f) | 0x80;

//   const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
//   return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
// }

// // ---------- ULID (Crockford base32) ----------
// const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// function encodeCrockford(bytes, chars) {
//   // Read bytes as one big integer, encode in Crockford base32, right-pad.
//   let bits = '';
//   for (const b of bytes) bits += b.toString(2).padStart(8, '0');
//   // Right-align to a multiple of 5 bits.
//   const padLen = (5 - (bits.length % 5)) % 5;
//   bits = '0'.repeat(padLen) + bits;
//   let out = '';
//   for (let i = 0; i < bits.length; i += 5) {
//     out += ULID_ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
//   }
//   return out.slice(-chars);
// }

// function generateULID(msNow) {
//   // 48 bits (10 chars) timestamp + 80 bits (16 chars) randomness = 26 chars
//   const tsBytes = new Uint8Array(6);
//   let ts = BigInt(msNow);
//   for (let i = 5; i >= 0; i--) {
//     tsBytes[i] = Number(ts & 0xffn);
//     ts >>= 8n;
//   }
//   const randBytes = new Uint8Array(10);
//   crypto.getRandomValues(randBytes);
//   return encodeCrockford(tsBytes, 10) + encodeCrockford(randBytes, 16);
// }

// // ---------- Batch ----------
// function batchGenerate(mode, count) {
//   const now = Date.now();
//   const out = [];
//   for (let i = 0; i < count; i++) {
//     if (mode === 'v4') out.push(generateV4());
//     else if (mode === 'v7') out.push(generateV7(now + i)); // +i to keep time-ordering monotonic across batch
//     else out.push(generateULID(now + i));
//   }
//   return out;
// }

// function formatOne(id, opts) {
//   let s = id;
//   if (opts.mode !== 'ulid') {
//     if (!opts.hyphens) s = s.replace(/-/g, '');
//     if (opts.uppercase) s = s.toUpperCase();
//     if (opts.braces) s = `{${s}}`;
//   } else {
//     // ULID is always uppercase by spec; braces optional
//     if (!opts.uppercase) s = s.toLowerCase();
//     if (opts.braces) s = `{${s}}`;
//   }
//   return s;
// }

// const COUNT_OPTIONS = [1, 10, 100, 1000];

// export default function UuidGeneratorTool({
//   theme = 'light',
//   showThemeToggle = false,
//   showExplanations = false,
//   explanations = null,
// }) {
//   const [mode, setMode] = useState('v4');
//   const [count, setCount] = useState(10);
//   const [hyphens, setHyphens] = useState(true);
//   const [uppercase, setUppercase] = useState(false);
//   const [braces, setBraces] = useState(false);

//   const [ids, setIds] = useState([]);
//   const [copied, setCopied] = useState(false);

//   const [currentTheme, setCurrentTheme] = useState(theme);

//   const outputRef = useRef([]);

//   useEffect(() => { setCurrentTheme(theme); }, [theme]);
//   useEffect(() => { outputRef.current = ids; }, [ids]);

//   const regenerate = useCallback(() => {
//     setIds(batchGenerate(mode, count));
//   }, [mode, count]);

//   // Auto-generate on any option change or first mount.
//   useEffect(() => {
//     setIds(batchGenerate(mode, count));
//   }, [mode, count]);

//   // Keyboard shortcuts.
//   useEffect(() => {
//     const handler = (e) => {
//       const modKey = e.metaKey || e.ctrlKey;
//       if (!modKey) return;
//       if (e.key === 'Enter') {
//         e.preventDefault();
//         if (outputRef.current && outputRef.current.length > 0) {
//           const text = outputRef.current.map((id) => formatOne(id, { mode, hyphens, uppercase, braces })).join('\n');
//           navigator.clipboard.writeText(text);
//           setCopied(true);
//           setTimeout(() => setCopied(false), 1500);
//         }
//       } else if (e.key === 'r' || e.key === 'R') {
//         e.preventDefault();
//         regenerate();
//       }
//     };
//     window.addEventListener('keydown', handler);
//     return () => window.removeEventListener('keydown', handler);
//   }, [mode, hyphens, uppercase, braces, regenerate]);

//   const handleReset = useCallback(() => {
//     setMode('v4');
//     setCount(10);
//     setHyphens(true);
//     setUppercase(false);
//     setBraces(false);
//   }, []);

//   const outputText = ids.map((id) => formatOne(id, { mode, hyphens, uppercase, braces })).join('\n');

//   const handleCopy = useCallback(() => {
//     if (!outputText) return;
//     navigator.clipboard.writeText(outputText);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   }, [outputText]);

//   const handleDownload = useCallback(() => {
//     if (!outputText) return;
//     const blob = new Blob([outputText], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${mode === 'ulid' ? 'ulids' : 'uuids-' + mode}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   }, [outputText, mode]);

//   const expContent = (() => {
//     const override = explanations && explanations[mode];
//     if (override) {
//       if (typeof override === 'string') {
//         return <div dangerouslySetInnerHTML={{ __html: override }} />;
//       }
//       return override;
//     }
//     return DEFAULT_EXPLANATIONS[mode];
//   })();

//   const outBytes = new Blob([outputText]).size;

//   return (
//     <div className="tool" data-theme={currentTheme}>
//       <div className="top-bar">
//         <div className="tabs" role="tablist">
//           <button
//             role="tab"
//             className={'tab' + (mode === 'v4' ? ' on' : '')}
//             onClick={() => setMode('v4')}
//             data-tt="Random 128-bit UUID (cryptographically secure)"
//           >
//             UUID v4
//           </button>
//           <button
//             role="tab"
//             className={'tab' + (mode === 'v7' ? ' on' : '')}
//             onClick={() => setMode('v7')}
//             data-tt="Time-ordered UUID (RFC 9562)"
//           >
//             UUID v7
//           </button>
//           <button
//             role="tab"
//             className={'tab' + (mode === 'ulid' ? ' on' : '')}
//             onClick={() => setMode('ulid')}
//             data-tt="26-char time-sortable identifier"
//           >
//             ULID
//           </button>
//         </div>

//         <span className="hint">
//           {mode === 'v4' && 'Random 128-bit — no ordering.'}
//           {mode === 'v7' && 'Time-ordered — DB-friendly.'}
//           {mode === 'ulid' && '26 chars, time-sortable, URL-safe.'}
//         </span>

//         <div className="top-actions">
//           {showThemeToggle && (
//             <div className="seg-toggle" role="group">
//               <button
//                 className={'seg-btn' + (currentTheme === 'light' ? ' on' : '')}
//                 onClick={() => setCurrentTheme('light')}
//                 data-tt="Light theme"
//                 aria-label="Light theme"
//               >
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
//                   <circle cx="7" cy="7" r="3"/>
//                   <path d="M7 1v1M7 12v1M1 7h1M12 7h1M2.5 2.5l.7.7M10.8 10.8l.7.7M2.5 11.5l.7-.7M10.8 3.2l.7-.7"/>
//                 </svg>
//               </button>
//               <button
//                 className={'seg-btn' + (currentTheme === 'terminal' ? ' on' : '')}
//                 onClick={() => setCurrentTheme('terminal')}
//                 data-tt="Terminal theme"
//                 aria-label="Terminal theme"
//               >
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
//                   <path d="M11 8a5 5 0 1 1-5-5 4 4 0 0 0 5 5z"/>
//                 </svg>
//               </button>
//             </div>
//           )}

//           <button
//             className="btn-reset"
//             onClick={handleReset}
//             data-tt="Reset all options"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       <div className="opts">
//         <span className="opt-select" data-tt="How many to generate at once">
//           <span className="opt-select-lbl">Count:</span>
//           <select value={count} onChange={(e) => setCount(parseInt(e.target.value, 10))}>
//             {COUNT_OPTIONS.map((n) => (
//               <option key={n} value={n}>{n}</option>
//             ))}
//           </select>
//         </span>

//         <label className="opt" data-tt="Uppercase letters">
//           <input
//             type="checkbox"
//             checked={uppercase}
//             onChange={(e) => setUppercase(e.target.checked)}
//           />
//           Uppercase
//         </label>

//         {mode !== 'ulid' && (
//           <label className="opt" data-tt="Include hyphens between segments">
//             <input
//               type="checkbox"
//               checked={hyphens}
//               onChange={(e) => setHyphens(e.target.checked)}
//             />
//             Hyphens
//           </label>
//         )}

//         <label className="opt" data-tt="Wrap each ID in braces { ... }">
//           <input
//             type="checkbox"
//             checked={braces}
//             onChange={(e) => setBraces(e.target.checked)}
//           />
//           Braces
//         </label>

//         <button
//           className="btn-regen"
//           onClick={regenerate}
//           data-tt="Generate a new batch (Cmd/Ctrl+R)"
//         >
//           ↻ Regenerate
//         </button>
//       </div>

//       <div className={'body' + (showExplanations ? ' with-exp' : '')}>
//         <div className="pane">
//           <div className="lbl">
//             <span>Generated {mode === 'ulid' ? 'ULIDs' : `UUID ${mode}s`} ({ids.length})</span>
//             <div className="lbl-actions">
//               <button
//                 className="btn-in-lbl"
//                 onClick={handleCopy}
//                 disabled={ids.length === 0}
//                 data-tt="Copy all to clipboard"
//                 data-tt-pos="above"
//               >
//                 {copied ? 'Copied' : 'Copy all'}
//               </button>
//               <button
//                 className="btn-in-lbl muted"
//                 onClick={handleDownload}
//                 disabled={ids.length === 0}
//                 data-tt="Save as .txt file"
//                 data-tt-pos="above"
//               >
//                 Download
//               </button>
//             </div>
//           </div>
//           <div className="out">
//             {outputText || <span style={{ color: 'var(--text-input-placeholder)' }}>Click Regenerate to produce IDs.</span>}
//           </div>
//         </div>

//         {showExplanations && (
//           <div className="exp">
//             <div className="exp-hdr">About this mode</div>
//             <div className="exp-body">{expContent}</div>
//           </div>
//         )}
//       </div>

//       <div className="stats">
//         <span>Generated: <b>{ids.length}</b></span>
//         <span>Total: <b>{outBytes}</b> bytes</span>
//         <span>Each: <b>{ids.length > 0 ? Math.round(outBytes / ids.length) : 0}</b> bytes</span>
//       </div>

//       <style jsx>{`
//         .tool {
//           --bg: #ffffff;
//           --surface: #ffffff;
//           --surface-alt: #f5f7fb;
//           --surface-code: #eff2f8;
//           --hdr-bg: #eef2f7;
//           --hdr-bg-subtle: #f2f6fd;
//           --text: #0f172a;
//           --text-muted: #475569;
//           --text-subtle: #64748b;
//           --text-label: #334155;
//           --text-input-placeholder: #94a3b8;
//           --border: #cfd6e0;
//           --border-strong: #a3b0c6;
//           --border-subtle: #e4e4e7;
//           --border-thin: #f1f5f9;
//           --primary: #1B50EE;
//           --primary-hover: #133EBF;
//           --primary-bg: #E8EEFB;
//           --primary-bg-hover: #d5e0f9;
//           --primary-border: #C8D4F6;
//           --error: #b91c1c;
//           --error-bg: #fef2f2;
//           --stats-bg: #eef2f7;

//           background: var(--surface);
//           color: var(--text);
//           min-height: 550px;
//           display: flex;
//           flex-direction: column;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
//         }
//         .tool[data-theme="terminal"] {
//           --bg: #0A0D14;
//           --surface: #101623;
//           --surface-alt: #141b2b;
//           --surface-code: #0a0e18;
//           --hdr-bg: #182236;
//           --hdr-bg-subtle: rgba(77,116,255,0.08);
//           --text: #d4dae5;
//           --text-muted: #97a3b8;
//           --text-subtle: #6b7891;
//           --text-label: #c1cad9;
//           --text-input-placeholder: #4b5875;
//           --border: #1e2637;
//           --border-strong: #2d3a52;
//           --border-subtle: #1e2637;
//           --border-thin: #131a28;
//           --primary: #4D74FF;
//           --primary-hover: #6A8BFF;
//           --primary-bg: rgba(77,116,255,0.14);
//           --primary-bg-hover: rgba(77,116,255,0.22);
//           --primary-border: rgba(77,116,255,0.35);
//           --error: #f87171;
//           --error-bg: rgba(248,113,113,0.1);
//           --stats-bg: #131a28;
//           background: var(--bg);
//         }

//         .top-bar {
//           padding: 12px 16px;
//           background: var(--hdr-bg);
//           border-bottom: 1px solid var(--border);
//           display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
//         }
//         .tabs {
//           display: flex; gap: 4px; padding: 3px;
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-radius: 6px;
//         }
//         .tab {
//           padding: 6px 16px;
//           font-size: 12.5px; font-weight: 700;
//           color: var(--text-muted);
//           background: transparent; border: none; border-radius: 4px;
//           cursor: pointer; letter-spacing: 0.02em;
//         }
//         .tab.on {
//           background: var(--primary); color: #ffffff;
//           box-shadow: 0 1px 2px rgba(15,23,42,0.12);
//         }
//         .hint {
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 12px; color: var(--text-label);
//           font-weight: 600; letter-spacing: 0.02em;
//         }
//         .top-actions {
//           margin-left: auto;
//           display: flex; gap: 8px; align-items: center;
//         }
//         .seg-toggle {
//           display: flex; gap: 2px; padding: 2px;
//           background: var(--surface);
//           border: 1px solid var(--border-strong);
//           border-radius: 5px;
//         }
//         .seg-btn {
//           width: 26px; height: 26px;
//           display: flex; align-items: center; justify-content: center;
//           background: transparent; border: none; border-radius: 3px;
//           cursor: pointer; color: var(--text-muted);
//         }
//         .seg-btn.on { background: var(--primary); color: #ffffff; }
//         .btn-reset {
//           padding: 5px 12px;
//           font-size: 11.5px; font-weight: 700;
//           color: var(--text-muted);
//           background: var(--surface);
//           border: 1px solid var(--border-strong);
//           border-radius: 5px;
//           cursor: pointer;
//           letter-spacing: 0.06em; text-transform: uppercase;
//         }
//         .btn-reset:hover { color: var(--error); border-color: var(--error); }

//         .opts {
//           padding: 10px 16px;
//           background: var(--hdr-bg-subtle);
//           border-bottom: 1px solid var(--border-subtle);
//           border-left: 3px solid var(--primary);
//           display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
//           min-height: 40px;
//         }
//         .opt {
//           display: flex; align-items: center; gap: 6px;
//           font-size: 12.5px; color: var(--text-label);
//           font-weight: 600; cursor: pointer; user-select: none;
//         }
//         .opt input { margin: 0; accent-color: var(--primary); width: 14px; height: 14px; }
//         .opt-select { display: inline-flex; align-items: center; gap: 8px; }
//         .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
//         .opt-select select {
//           padding: 4px 8px;
//           font-size: 12px; font-family: ui-monospace, Menlo, monospace;
//           background: var(--surface); color: var(--text);
//           border: 1px solid var(--border-strong); border-radius: 4px;
//           cursor: pointer;
//         }
//         .btn-regen {
//           margin-left: auto;
//           padding: 6px 14px;
//           font-size: 12px; font-weight: 700;
//           color: #ffffff;
//           background: var(--primary);
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//           letter-spacing: 0.02em;
//         }
//         .btn-regen:hover { background: var(--primary-hover); }

//         .body {
//           display: grid;
//           flex: 1;
//           min-height: 0;
//           margin-top: 12px;
//           grid-template-columns: 1fr;
//         }
//         .body.with-exp { grid-template-columns: minmax(0, 1fr) 300px; }

//         .pane {
//           background: var(--surface);
//           display: flex; flex-direction: column; min-height: 340px;
//         }
//         .lbl {
//           font-size: 11.5px; font-weight: 800;
//           color: var(--text-label);
//           letter-spacing: 0.08em; text-transform: uppercase;
//           padding: 10px 16px 10px 13px;
//           border-bottom: 1px solid var(--border-subtle);
//           background: var(--hdr-bg-subtle);
//           border-left: 3px solid var(--primary);
//           display: flex; align-items: center; justify-content: space-between; gap: 8px;
//           min-height: 40px;
//         }
//         .lbl-actions { display: flex; gap: 6px; }
//         .btn-in-lbl {
//           padding: 3px 10px;
//           font-size: 10.5px; font-weight: 700;
//           background: var(--surface); color: var(--primary);
//           border: 1px solid var(--primary-border); border-radius: 4px;
//           letter-spacing: 0.06em; text-transform: uppercase;
//           cursor: pointer;
//         }
//         .btn-in-lbl:disabled { opacity: 0.4; cursor: not-allowed; }
//         .btn-in-lbl.muted { color: var(--text-muted); border-color: var(--border); }

//         .out {
//           flex: 1;
//           border: none; outline: none;
//           padding: 14px 16px;
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 13px; line-height: 1.7;
//           color: var(--text);
//           background: transparent;
//           white-space: pre-wrap;
//           word-break: break-all;
//           overflow-y: auto;
//           user-select: all;
//           min-height: 260px;
//         }

//         .exp {
//           border-left: 1px solid var(--border);
//           background: var(--surface-alt);
//           display: flex; flex-direction: column;
//         }
//         .exp-hdr {
//           font-size: 11.5px; font-weight: 800;
//           color: var(--text-label);
//           letter-spacing: 0.08em; text-transform: uppercase;
//           padding: 10px 16px 10px 13px;
//           border-bottom: 1px solid var(--border-subtle);
//           background: var(--hdr-bg-subtle);
//           border-left: 3px solid var(--primary);
//           min-height: 40px;
//           display: flex; align-items: center;
//         }
//         .exp-body {
//           padding: 16px;
//           font-size: 13px; line-height: 1.6;
//           color: var(--text-muted);
//           flex: 1;
//         }
//         .exp-body :global(p) { margin: 0 0 12px; }
//         .exp-body :global(p:last-child) { margin-bottom: 0; }
//         .exp-body :global(code) {
//           background: var(--surface-code);
//           padding: 1px 6px;
//           border-radius: 4px;
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 12px; color: var(--primary);
//           border: 1px solid var(--border);
//         }

//         .stats {
//           padding: 10px 16px;
//           background: var(--stats-bg);
//           border-top: 1px solid var(--border);
//           display: flex; gap: 24px;
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 11.5px; color: var(--text-muted);
//           flex-wrap: wrap;
//         }
//         .stats b { color: var(--primary); font-weight: 700; }
//       `}</style>

//       <style jsx global>{`
//         [data-tt] { position: relative; }
//         [data-tt]::after {
//           content: attr(data-tt);
//           position: absolute;
//           top: calc(100% + 8px); left: 50%;
//           transform: translateX(-50%);
//           background: #0f172a; color: #ffffff;
//           padding: 5px 10px; border-radius: 5px;
//           font-size: 11px; font-weight: 500;
//           font-family: -apple-system, "Segoe UI", system-ui, sans-serif;
//           letter-spacing: 0.01em;
//           white-space: nowrap; z-index: 100;
//           pointer-events: none; opacity: 0;
//           transition: opacity 0.12s ease 0.35s;
//           box-shadow: 0 6px 20px rgba(0,0,0,0.18);
//         }
//         [data-tt]::before {
//           content: '';
//           position: absolute;
//           top: 100%; left: 50%;
//           transform: translateX(-50%);
//           border: 4px solid transparent;
//           border-bottom-color: #0f172a;
//           z-index: 100; pointer-events: none; opacity: 0;
//           transition: opacity 0.12s ease 0.35s;
//         }
//         [data-tt]:hover::after, [data-tt]:hover::before { opacity: 1; }
//         [data-tt-pos="above"]::after { top: auto; bottom: calc(100% + 8px); }
//         [data-tt-pos="above"]::before {
//           top: auto; bottom: 100%;
//           border-bottom-color: transparent;
//           border-top-color: #0f172a;
//         }
//       `}</style>
//     </div>
//   );
// }


// UuidGeneratorTool.jsx — v2
// Diff vs v1: default count changed from 10 to 1.
// UUID (v4 / v7) and ULID generator. Zero deps — uses crypto.randomUUID
// and handrolls v7 + ULID per spec.

import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_EXPLANATIONS = {
  v4: (
    <>
      <p><b>UUID v4</b> is a 128-bit random identifier. The go-to for distributed IDs: no coordination needed, essentially zero collision risk.</p>
      <p>Uses <code>crypto.randomUUID()</code>, the browser&apos;s cryptographically-secure RNG.</p>
    </>
  ),
  v7: (
    <>
      <p><b>UUID v7</b> is time-ordered: the first 48 bits are a Unix millisecond timestamp, so IDs sort naturally by creation time.</p>
      <p>Better than v4 for database primary keys — no index fragmentation from random inserts. Newer spec, so verify library support before using in production.</p>
    </>
  ),
  ulid: (
    <>
      <p><b>ULID</b> is a 26-character time-sortable identifier — 48 bits of Unix ms timestamp + 80 bits of randomness, Crockford base-32 encoded.</p>
      <p>Same time-ordering benefit as UUID v7, but shorter and URL-safe out of the box.</p>
    </>
  ),
};

// ---------- UUID v4 (uses browser crypto) ----------
function generateV4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback if crypto.randomUUID is unavailable (very old browsers)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

// ---------- UUID v7 (draft, RFC 9562) ----------
function generateV7(msNow) {
  // 48 bits timestamp (ms) | 4 bits version | 12 bits rand | 2 bits variant | 62 bits rand
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Timestamp — first 48 bits, big-endian
  let ts = BigInt(msNow);
  for (let i = 5; i >= 0; i--) {
    bytes[i] = Number(ts & 0xffn);
    ts >>= 8n;
  }
  // Version 7 in the upper 4 bits of byte 6
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Variant 10xx in the upper 2 bits of byte 8
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

// ---------- ULID (Crockford base32) ----------
const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function encodeCrockford(bytes, chars) {
  // Read bytes as one big integer, encode in Crockford base32, right-pad.
  let bits = '';
  for (const b of bytes) bits += b.toString(2).padStart(8, '0');
  // Right-align to a multiple of 5 bits.
  const padLen = (5 - (bits.length % 5)) % 5;
  bits = '0'.repeat(padLen) + bits;
  let out = '';
  for (let i = 0; i < bits.length; i += 5) {
    out += ULID_ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  }
  return out.slice(-chars);
}

function generateULID(msNow) {
  // 48 bits (10 chars) timestamp + 80 bits (16 chars) randomness = 26 chars
  const tsBytes = new Uint8Array(6);
  let ts = BigInt(msNow);
  for (let i = 5; i >= 0; i--) {
    tsBytes[i] = Number(ts & 0xffn);
    ts >>= 8n;
  }
  const randBytes = new Uint8Array(10);
  crypto.getRandomValues(randBytes);
  return encodeCrockford(tsBytes, 10) + encodeCrockford(randBytes, 16);
}

// ---------- Batch ----------
function batchGenerate(mode, count) {
  const now = Date.now();
  const out = [];
  for (let i = 0; i < count; i++) {
    if (mode === 'v4') out.push(generateV4());
    else if (mode === 'v7') out.push(generateV7(now + i)); // +i to keep time-ordering monotonic across batch
    else out.push(generateULID(now + i));
  }
  return out;
}

function formatOne(id, opts) {
  let s = id;
  if (opts.mode !== 'ulid') {
    if (!opts.hyphens) s = s.replace(/-/g, '');
    if (opts.uppercase) s = s.toUpperCase();
    if (opts.braces) s = `{${s}}`;
  } else {
    // ULID is always uppercase by spec; braces optional
    if (!opts.uppercase) s = s.toLowerCase();
    if (opts.braces) s = `{${s}}`;
  }
  return s;
}

const COUNT_OPTIONS = [1, 10, 100, 1000];

export default function UuidGeneratorTool({
  theme = 'light',
  showThemeToggle = false,
  showExplanations = false,
  explanations = null,
}) {
  const [mode, setMode] = useState('v4');
  const [count, setCount] = useState(1);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(false);

  const [ids, setIds] = useState([]);
  const [copied, setCopied] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(theme);

  const outputRef = useRef([]);

  useEffect(() => { setCurrentTheme(theme); }, [theme]);
  useEffect(() => { outputRef.current = ids; }, [ids]);

  const regenerate = useCallback(() => {
    setIds(batchGenerate(mode, count));
  }, [mode, count]);

  // Auto-generate on any option change or first mount.
  useEffect(() => {
    setIds(batchGenerate(mode, count));
  }, [mode, count]);

  // Keyboard shortcuts.
  useEffect(() => {
    const handler = (e) => {
      const modKey = e.metaKey || e.ctrlKey;
      if (!modKey) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        if (outputRef.current && outputRef.current.length > 0) {
          const text = outputRef.current.map((id) => formatOne(id, { mode, hyphens, uppercase, braces })).join('\n');
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        regenerate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mode, hyphens, uppercase, braces, regenerate]);

  const handleReset = useCallback(() => {
    setMode('v4');
    setCount(1);
    setHyphens(true);
    setUppercase(false);
    setBraces(false);
  }, []);

  const outputText = ids.map((id) => formatOne(id, { mode, hyphens, uppercase, braces })).join('\n');

  const handleCopy = useCallback(() => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [outputText]);

  const handleDownload = useCallback(() => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'ulid' ? 'ulids' : 'uuids-' + mode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [outputText, mode]);

  const expContent = (() => {
    const override = explanations && explanations[mode];
    if (override) {
      if (typeof override === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: override }} />;
      }
      return override;
    }
    return DEFAULT_EXPLANATIONS[mode];
  })();

  const outBytes = new Blob([outputText]).size;

  return (
    <div className="tool" data-theme={currentTheme}>
      <div className="top-bar">
        <div className="tabs" role="tablist">
          <button
            role="tab"
            className={'tab' + (mode === 'v4' ? ' on' : '')}
            onClick={() => setMode('v4')}
            data-tt="Random 128-bit UUID (cryptographically secure)"
          >
            UUID v4
          </button>
          <button
            role="tab"
            className={'tab' + (mode === 'v7' ? ' on' : '')}
            onClick={() => setMode('v7')}
            data-tt="Time-ordered UUID (RFC 9562)"
          >
            UUID v7
          </button>
          <button
            role="tab"
            className={'tab' + (mode === 'ulid' ? ' on' : '')}
            onClick={() => setMode('ulid')}
            data-tt="26-char time-sortable identifier"
          >
            ULID
          </button>
        </div>

        <span className="hint">
          {mode === 'v4' && 'Random 128-bit — no ordering.'}
          {mode === 'v7' && 'Time-ordered — DB-friendly.'}
          {mode === 'ulid' && '26 chars, time-sortable, URL-safe.'}
        </span>

        <div className="top-actions">
          {showThemeToggle && (
            <div className="seg-toggle" role="group">
              <button
                className={'seg-btn' + (currentTheme === 'light' ? ' on' : '')}
                onClick={() => setCurrentTheme('light')}
                data-tt="Light theme"
                aria-label="Light theme"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="7" cy="7" r="3"/>
                  <path d="M7 1v1M7 12v1M1 7h1M12 7h1M2.5 2.5l.7.7M10.8 10.8l.7.7M2.5 11.5l.7-.7M10.8 3.2l.7-.7"/>
                </svg>
              </button>
              <button
                className={'seg-btn' + (currentTheme === 'terminal' ? ' on' : '')}
                onClick={() => setCurrentTheme('terminal')}
                data-tt="Terminal theme"
                aria-label="Terminal theme"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 8a5 5 0 1 1-5-5 4 4 0 0 0 5 5z"/>
                </svg>
              </button>
            </div>
          )}

          <button
            className="btn-reset"
            onClick={handleReset}
            data-tt="Reset all options"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="opts">
        <span className="opt-select" data-tt="How many to generate at once">
          <span className="opt-select-lbl">Count:</span>
          <select value={count} onChange={(e) => setCount(parseInt(e.target.value, 10))}>
            {COUNT_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </span>

        <label className="opt" data-tt="Uppercase letters">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
          />
          Uppercase
        </label>

        {mode !== 'ulid' && (
          <label className="opt" data-tt="Include hyphens between segments">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
            />
            Hyphens
          </label>
        )}

        <label className="opt" data-tt="Wrap each ID in braces { ... }">
          <input
            type="checkbox"
            checked={braces}
            onChange={(e) => setBraces(e.target.checked)}
          />
          Braces
        </label>

        <button
          className="btn-regen"
          onClick={regenerate}
          data-tt="Generate a new batch (Cmd/Ctrl+R)"
        >
          ↻ Regenerate
        </button>
      </div>

      <div className={'body' + (showExplanations ? ' with-exp' : '')}>
        <div className="pane">
          <div className="lbl">
            <span>Generated {mode === 'ulid' ? 'ULIDs' : `UUID ${mode}s`} ({ids.length})</span>
            <div className="lbl-actions">
              <button
                className="btn-in-lbl"
                onClick={handleCopy}
                disabled={ids.length === 0}
                data-tt="Copy all to clipboard"
                data-tt-pos="above"
              >
                {copied ? 'Copied' : 'Copy all'}
              </button>
              <button
                className="btn-in-lbl muted"
                onClick={handleDownload}
                disabled={ids.length === 0}
                data-tt="Save as .txt file"
                data-tt-pos="above"
              >
                Download
              </button>
            </div>
          </div>
          <div className="out">
            {outputText || <span style={{ color: 'var(--text-input-placeholder)' }}>Click Regenerate to produce IDs.</span>}
          </div>
        </div>

        {showExplanations && (
          <div className="exp">
            <div className="exp-hdr">About this mode</div>
            <div className="exp-body">{expContent}</div>
          </div>
        )}
      </div>

      <div className="stats">
        <span>Generated: <b>{ids.length}</b></span>
        <span>Total: <b>{outBytes}</b> bytes</span>
        <span>Each: <b>{ids.length > 0 ? Math.round(outBytes / ids.length) : 0}</b> bytes</span>
      </div>

      <style jsx>{`
        .tool {
          --bg: #ffffff;
          --surface: #ffffff;
          --surface-alt: #f5f7fb;
          --surface-code: #eff2f8;
          --hdr-bg: #eef2f7;
          --hdr-bg-subtle: #f2f6fd;
          --text: #0f172a;
          --text-muted: #475569;
          --text-subtle: #64748b;
          --text-label: #334155;
          --text-input-placeholder: #94a3b8;
          --border: #cfd6e0;
          --border-strong: #a3b0c6;
          --border-subtle: #e4e4e7;
          --border-thin: #f1f5f9;
          --primary: #1B50EE;
          --primary-hover: #133EBF;
          --primary-bg: #E8EEFB;
          --primary-bg-hover: #d5e0f9;
          --primary-border: #C8D4F6;
          --error: #b91c1c;
          --error-bg: #fef2f2;
          --stats-bg: #eef2f7;

          background: var(--surface);
          color: var(--text);
          min-height: 550px;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        }
        .tool[data-theme="terminal"] {
          --bg: #0A0D14;
          --surface: #101623;
          --surface-alt: #141b2b;
          --surface-code: #0a0e18;
          --hdr-bg: #182236;
          --hdr-bg-subtle: rgba(77,116,255,0.08);
          --text: #d4dae5;
          --text-muted: #97a3b8;
          --text-subtle: #6b7891;
          --text-label: #c1cad9;
          --text-input-placeholder: #4b5875;
          --border: #1e2637;
          --border-strong: #2d3a52;
          --border-subtle: #1e2637;
          --border-thin: #131a28;
          --primary: #4D74FF;
          --primary-hover: #6A8BFF;
          --primary-bg: rgba(77,116,255,0.14);
          --primary-bg-hover: rgba(77,116,255,0.22);
          --primary-border: rgba(77,116,255,0.35);
          --error: #f87171;
          --error-bg: rgba(248,113,113,0.1);
          --stats-bg: #131a28;
          background: var(--bg);
        }

        .top-bar {
          padding: 12px 16px;
          background: var(--hdr-bg);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .tabs {
          display: flex; gap: 4px; padding: 3px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
        }
        .tab {
          padding: 6px 16px;
          font-size: 12.5px; font-weight: 700;
          color: var(--text-muted);
          background: transparent; border: none; border-radius: 4px;
          cursor: pointer; letter-spacing: 0.02em;
        }
        .tab.on {
          background: var(--primary); color: #ffffff;
          box-shadow: 0 1px 2px rgba(15,23,42,0.12);
        }
        .hint {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px; color: var(--text-label);
          font-weight: 600; letter-spacing: 0.02em;
        }
        .top-actions {
          margin-left: auto;
          display: flex; gap: 8px; align-items: center;
        }
        .seg-toggle {
          display: flex; gap: 2px; padding: 2px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: 5px;
        }
        .seg-btn {
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; border-radius: 3px;
          cursor: pointer; color: var(--text-muted);
        }
        .seg-btn.on { background: var(--primary); color: #ffffff; }
        .btn-reset {
          padding: 5px 12px;
          font-size: 11.5px; font-weight: 700;
          color: var(--text-muted);
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: 5px;
          cursor: pointer;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .btn-reset:hover { color: var(--error); border-color: var(--error); }

        .opts {
          padding: 10px 16px;
          background: var(--hdr-bg-subtle);
          border-bottom: 1px solid var(--border-subtle);
          border-left: 3px solid var(--primary);
          display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
          min-height: 40px;
        }
        .opt {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: var(--text-label);
          font-weight: 600; cursor: pointer; user-select: none;
        }
        .opt input { margin: 0; accent-color: var(--primary); width: 14px; height: 14px; }
        .opt-select { display: inline-flex; align-items: center; gap: 8px; }
        .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
        .opt-select select {
          padding: 4px 8px;
          font-size: 12px; font-family: ui-monospace, Menlo, monospace;
          background: var(--surface); color: var(--text);
          border: 1px solid var(--border-strong); border-radius: 4px;
          cursor: pointer;
        }
        .btn-regen {
          margin-left: auto;
          padding: 6px 14px;
          font-size: 12px; font-weight: 700;
          color: #ffffff;
          background: var(--primary);
          border: none;
          border-radius: 5px;
          cursor: pointer;
          letter-spacing: 0.02em;
        }
        .btn-regen:hover { background: var(--primary-hover); }

        .body {
          display: grid;
          flex: 1;
          min-height: 0;
          margin-top: 12px;
          grid-template-columns: 1fr;
        }
        .body.with-exp { grid-template-columns: minmax(0, 1fr) 300px; }

        .pane {
          background: var(--surface);
          display: flex; flex-direction: column; min-height: 340px;
        }
        .lbl {
          font-size: 11.5px; font-weight: 800;
          color: var(--text-label);
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 10px 16px 10px 13px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--hdr-bg-subtle);
          border-left: 3px solid var(--primary);
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          min-height: 40px;
        }
        .lbl-actions { display: flex; gap: 6px; }
        .btn-in-lbl {
          padding: 3px 10px;
          font-size: 10.5px; font-weight: 700;
          background: var(--surface); color: var(--primary);
          border: 1px solid var(--primary-border); border-radius: 4px;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer;
        }
        .btn-in-lbl:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-in-lbl.muted { color: var(--text-muted); border-color: var(--border); }

        .out {
          flex: 1;
          border: none; outline: none;
          padding: 14px 16px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px; line-height: 1.7;
          color: var(--text);
          background: transparent;
          white-space: pre-wrap;
          word-break: break-all;
          overflow-y: auto;
          user-select: all;
          min-height: 260px;
        }

        .exp {
          border-left: 1px solid var(--border);
          background: var(--surface-alt);
          display: flex; flex-direction: column;
        }
        .exp-hdr {
          font-size: 11.5px; font-weight: 800;
          color: var(--text-label);
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 10px 16px 10px 13px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--hdr-bg-subtle);
          border-left: 3px solid var(--primary);
          min-height: 40px;
          display: flex; align-items: center;
        }
        .exp-body {
          padding: 16px;
          font-size: 13px; line-height: 1.6;
          color: var(--text-muted);
          flex: 1;
        }
        .exp-body :global(p) { margin: 0 0 12px; }
        .exp-body :global(p:last-child) { margin-bottom: 0; }
        .exp-body :global(code) {
          background: var(--surface-code);
          padding: 1px 6px;
          border-radius: 4px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px; color: var(--primary);
          border: 1px solid var(--border);
        }

        .stats {
          padding: 10px 16px;
          background: var(--stats-bg);
          border-top: 1px solid var(--border);
          display: flex; gap: 24px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 11.5px; color: var(--text-muted);
          flex-wrap: wrap;
        }
        .stats b { color: var(--primary); font-weight: 700; }
      `}</style>

      <style jsx global>{`
        [data-tt] { position: relative; }
        [data-tt]::after {
          content: attr(data-tt);
          position: absolute;
          top: calc(100% + 8px); left: 50%;
          transform: translateX(-50%);
          background: #0f172a; color: #ffffff;
          padding: 5px 10px; border-radius: 5px;
          font-size: 11px; font-weight: 500;
          font-family: -apple-system, "Segoe UI", system-ui, sans-serif;
          letter-spacing: 0.01em;
          white-space: nowrap; z-index: 100;
          pointer-events: none; opacity: 0;
          transition: opacity 0.12s ease 0.35s;
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
        }
        [data-tt]::before {
          content: '';
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-bottom-color: #0f172a;
          z-index: 100; pointer-events: none; opacity: 0;
          transition: opacity 0.12s ease 0.35s;
        }
        [data-tt]:hover::after, [data-tt]:hover::before { opacity: 1; }
        [data-tt-pos="above"]::after { top: auto; bottom: calc(100% + 8px); }
        [data-tt-pos="above"]::before {
          top: auto; bottom: 100%;
          border-bottom-color: transparent;
          border-top-color: #0f172a;
        }
      `}</style>
    </div>
  );
}