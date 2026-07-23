// HtmlMinifierTool.jsx — v1
// HTML minifier using html-minifier-terser (browser-friendly, maintained).
// html-minifier itself is deprecated and pulls Node-only deps.
//
// Requires: `npm i html-minifier-terser`
// (The old package.json has "html-minifier": "^4.0.0" — that one is deprecated
//  and won't run cleanly in the browser. Install the -terser fork.)

import { useState, useEffect, useRef, useCallback } from 'react';

const OP = 'minify';

const DEFAULT_EXPLANATIONS = {
  minify: (
    <>
      <p><b>Minify</b> strips whitespace, comments, and redundant syntax from HTML.</p>
      <p>Uses <code>html-minifier-terser</code>, the maintained fork of the classic <code>html-minifier</code>. Can also inline-minify <code>&lt;style&gt;</code> and <code>&lt;script&gt;</code> content.</p>
    </>
  ),
};

const SAMPLES = [
  {
    label: 'Simple page',
    tt: 'A minimal HTML doc with whitespace and comments.',
    text: `<!DOCTYPE html>
<html>
  <head>
    <title>Hello</title>
    <!-- head content -->
  </head>
  <body>
    <h1>Hello, world</h1>
    <p>This is a paragraph.</p>
  </body>
</html>`,
  },
  {
    label: 'With inline CSS',
    tt: 'HTML with a <style> tag — good with "Minify CSS" on.',
    text: `<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #fff;
    }
    .box {
      border: 1px solid #ccc;
      padding: 10px;
    }
  </style>
</head>
<body>
  <div class="box">Content</div>
</body>
</html>`,
  },
  {
    label: 'With inline JS',
    tt: 'HTML with a <script> tag — good with "Minify JS" on.',
    text: `<html>
<body>
  <div id="app"></div>
  <script>
    // This is a comment
    function greet(name) {
      const message = 'Hello, ' + name;
      console.log(message);
      return message;
    }
    greet('world');
  </script>
</body>
</html>`,
  },
  {
    label: 'Attribute-heavy',
    tt: 'Verbose attributes — quotes get removed where safe.',
    text: `<div class="container" id="main" data-value="42" data-enabled="true">
  <p style="color: red;">Text</p>
  <input type="text" value="" disabled="disabled" />
</div>`,
  },
];

export default function HtmlMinifierTool({
  theme = 'light',
  showThemeToggle = false,
  showOrientationToggle = true,
  initialOrientation = 'horizontal',
  showExplanations = false,
  explanations = null,
}) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // options
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [removeComments, setRemoveComments] = useState(true);
  const [removeAttrQuotes, setRemoveAttrQuotes] = useState(true);
  const [removeEmptyAttrs, setRemoveEmptyAttrs] = useState(true);
  const [minifyCSS, setMinifyCSS] = useState(true);
  const [minifyJS, setMinifyJS] = useState(true);

  const [currentTheme, setCurrentTheme] = useState(theme);
  const [orientation, setOrientation] = useState(initialOrientation);

  const inputRef = useRef(null);
  const outputRef = useRef('');
  const errorRef = useRef('');
  const minifierRef = useRef(null);

  useEffect(() => { setCurrentTheme(theme); }, [theme]);
  useEffect(() => { outputRef.current = output; }, [output]);
  useEffect(() => { errorRef.current = error; }, [error]);

  const ensureMinifier = async () => {
    if (!minifierRef.current) {
      const mod = await import('html-minifier-terser');
      minifierRef.current = mod.minify || mod.default?.minify || mod;
    }
    return minifierRef.current;
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setBusy(false);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setBusy(true);
        const minify = await ensureMinifier();
        const result = await minify(input, {
          collapseWhitespace,
          removeComments,
          removeAttributeQuotes: removeAttrQuotes,
          removeEmptyAttributes: removeEmptyAttrs,
          minifyCSS,
          minifyJS,
          conservativeCollapse: false,
          keepClosingSlash: true,
        });
        if (cancelled) return;
        setOutput(result || '');
        setError('');
      } catch (e) {
        if (cancelled) return;
        setOutput('');
        setError((e && e.message) || String(e));
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, collapseWhitespace, removeComments, removeAttrQuotes, removeEmptyAttrs, minifyCSS, minifyJS]);

  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (outputRef.current && !errorRef.current) {
          navigator.clipboard.writeText(outputRef.current);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleReset = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setCollapseWhitespace(true);
    setRemoveComments(true);
    setRemoveAttrQuotes(true);
    setRemoveEmptyAttrs(true);
    setMinifyCSS(true);
    setMinifyJS(true);
  }, []);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output]);

  const loadSample = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const expContent = (() => {
    const override = explanations && explanations[OP];
    if (override) {
      if (typeof override === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: override }} />;
      }
      return override;
    }
    return DEFAULT_EXPLANATIONS[OP];
  })();

  const inBytes = new Blob([input]).size;
  const outBytes = new Blob([output]).size;
  const savedBytes = inBytes - outBytes;
  const savedPct = inBytes > 0 ? Math.round((savedBytes / inBytes) * 100) : 0;

  return (
    <div className="tool" data-theme={currentTheme}>
      <div className="top-bar">
        <span className="hint">Paste HTML, get minified output.</span>

        <div className="top-actions">
          {showOrientationToggle && (
            <div className="seg-toggle" role="group">
              <button
                className={'seg-btn' + (orientation === 'horizontal' ? ' on' : '')}
                onClick={() => setOrientation('horizontal')}
                data-tt="Side-by-side panes"
                aria-label="Horizontal layout"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="8" y="2" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              <button
                className={'seg-btn' + (orientation === 'vertical' ? ' on' : '')}
                onClick={() => setOrientation('vertical')}
                data-tt="Stacked panes"
                aria-label="Vertical layout"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="2" y="8" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          )}

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
            data-tt="Clear input, output, and reset all options"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="opts">
        <label className="opt" data-tt="Collapse runs of whitespace to a single space">
          <input
            type="checkbox"
            checked={collapseWhitespace}
            onChange={(e) => setCollapseWhitespace(e.target.checked)}
          />
          Collapse whitespace
        </label>

        <label className="opt" data-tt="Remove HTML comments">
          <input
            type="checkbox"
            checked={removeComments}
            onChange={(e) => setRemoveComments(e.target.checked)}
          />
          Remove comments
        </label>

        <label className="opt" data-tt="Remove quotes around attribute values where safe">
          <input
            type="checkbox"
            checked={removeAttrQuotes}
            onChange={(e) => setRemoveAttrQuotes(e.target.checked)}
          />
          Unquote attrs
        </label>

        <label className="opt" data-tt="Drop attributes with empty values (class='')">
          <input
            type="checkbox"
            checked={removeEmptyAttrs}
            onChange={(e) => setRemoveEmptyAttrs(e.target.checked)}
          />
          Remove empty attrs
        </label>

        <label className="opt" data-tt="Minify content inside <style> tags">
          <input
            type="checkbox"
            checked={minifyCSS}
            onChange={(e) => setMinifyCSS(e.target.checked)}
          />
          Minify <code>CSS</code>
        </label>

        <label className="opt" data-tt="Minify content inside <script> tags">
          <input
            type="checkbox"
            checked={minifyJS}
            onChange={(e) => setMinifyJS(e.target.checked)}
          />
          Minify <code>JS</code>
        </label>
      </div>

      <div className="samples">
        <span className="samples-lbl">Samples:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            className="sample"
            onClick={() => loadSample(s.text)}
            data-tt={s.tt}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={'body' + (showExplanations ? ' with-exp' : '')}>
        <div className={'panes ' + orientation}>
          <div className="pane">
            <div className="lbl">
              <span>HTML Input</span>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste HTML here"
              spellCheck={false}
            />
          </div>
          <div className="pane">
            <div className="lbl">
              <span>Minified Output {busy && <em className="busy">minifying…</em>}</span>
              <div className="lbl-actions">
                <button
                  className="btn-in-lbl"
                  onClick={handleCopy}
                  disabled={!output || !!error}
                  data-tt="Copy output to clipboard"
                  data-tt-pos="above"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  className="btn-in-lbl muted"
                  onClick={handleDownload}
                  disabled={!output || !!error}
                  data-tt="Save output as minified.html"
                  data-tt-pos="above"
                >
                  Download
                </button>
              </div>
            </div>
            <div className={'out' + (error ? ' err' : '')}>
              {error || output || <span style={{ color: 'var(--text-input-placeholder)' }}>Minified output will appear here.</span>}
            </div>
          </div>
        </div>

        {showExplanations && (
          <div className="exp">
            <div className="exp-hdr">About this tool</div>
            <div className="exp-body">{expContent}</div>
          </div>
        )}
      </div>

      <div className="stats">
        <span>Input: <b>{inBytes}</b> bytes</span>
        <span>Output: <b>{outBytes}</b> bytes</span>
        <span>Saved: <b>{savedBytes > 0 ? savedBytes : 0}</b> bytes &middot; <b>{savedPct > 0 ? savedPct : 0}%</b></span>
        {error && <span style={{ color: 'var(--error)' }}>Error</span>}
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
        }
        .opt {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: var(--text-label);
          font-weight: 600; cursor: pointer; user-select: none;
        }
        .opt input { margin: 0; accent-color: var(--primary); width: 14px; height: 14px; }
        .opt code {
          background: var(--surface-code);
          padding: 1px 5px;
          border-radius: 3px;
          font-size: 11.5px;
          color: var(--primary);
          border: 1px solid var(--border);
        }

        .samples {
          padding: 10px 16px;
          background: var(--surface);
          border-bottom: 1px solid var(--border-subtle);
          display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
        }
        .samples-lbl {
          font-size: 11px; font-weight: 700;
          color: var(--text-subtle);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .sample {
          padding: 5px 12px;
          font-size: 12px; font-weight: 500;
          color: var(--primary);
          background: var(--primary-bg);
          border: 1px solid var(--primary-border); border-radius: 5px;
          cursor: pointer;
        }
        .sample:hover { background: var(--primary-bg-hover); }

        .body {
          display: grid;
          flex: 1;
          min-height: 0;
          margin-top: 12px;
          grid-template-columns: 1fr;
        }
        .body.with-exp { grid-template-columns: minmax(0, 1fr) 300px; }

        .panes {
          display: grid;
          gap: 1px;
          background: var(--border);
          min-height: 340px;
        }
        .panes.horizontal { grid-template-columns: 1fr 1fr; }
        .panes.vertical { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }

        .pane {
          background: var(--surface);
          display: flex; flex-direction: column; min-height: 0;
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
        .busy {
          font-style: normal;
          font-weight: 600;
          color: var(--primary);
          font-size: 10.5px;
          margin-left: 8px;
          text-transform: none;
          letter-spacing: 0;
        }
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

        textarea, .out {
          flex: 1;
          border: none; outline: none;
          padding: 14px 16px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px; line-height: 1.6;
          color: var(--text);
          background: transparent;
          resize: none;
          white-space: pre-wrap;
          word-break: break-all;
          overflow-y: auto;
          margin: 0;
          min-height: 200px;
        }
        textarea::placeholder { color: var(--text-input-placeholder); }
        .out.err { color: var(--error); background: var(--error-bg); white-space: pre-wrap; }

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