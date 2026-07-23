// JsMinifierTool.jsx — v1
// JavaScript minifier using terser (dynamic-imported on first use).
// Single-mode tool per WebDevData tool-component-guide-v2.
//
// Requires: `npm i terser`

import { useState, useEffect, useRef, useCallback } from 'react';

const OP = 'minify';

const DEFAULT_EXPLANATIONS = {
  minify: (
    <>
      <p><b>Minify</b> strips whitespace, comments, and unused code, and (optionally) renames variables to shorter names.</p>
      <p>Uses <code>terser</code> — the standard JavaScript minifier that ships with webpack, Rollup, esbuild&apos;s legacy fallback, and every major bundler.</p>
    </>
  ),
};

const SAMPLES = [
  {
    label: 'Simple',
    tt: 'A short function with comments and whitespace.',
    text: `// Adds two numbers
function add(a, b) {
  // Return the sum
  return a + b;
}

const result = add(2, 3);
console.log(result);`,
  },
  {
    label: 'Class',
    tt: 'ES6 class with methods.',
    text: `class Counter {
  constructor(start = 0) {
    this.count = start;
  }

  increment() {
    this.count += 1;
    return this.count;
  }

  reset() {
    this.count = 0;
  }
}

const c = new Counter(10);
c.increment();
c.increment();
console.log(c.count);`,
  },
  {
    label: 'Async / arrow',
    tt: 'Modern async and arrow functions.',
    text: `const fetchUser = async (id) => {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};

const users = await Promise.all([1, 2, 3].map(fetchUser));
console.log(users);`,
  },
  {
    label: 'Debug-heavy',
    tt: 'console.log and debugger statements — good with drop-console / drop-debugger.',
    text: `function process(items) {
  console.log('Processing', items.length, 'items');
  debugger;

  return items
    .filter((x) => {
      console.log('Filtering', x);
      return x > 0;
    })
    .map((x) => x * 2);
}

process([1, -2, 3, -4, 5]);`,
  },
];

export default function JsMinifierTool({
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
  const [mangle, setMangle] = useState(true);
  const [compress, setCompress] = useState(true);
  const [dropConsole, setDropConsole] = useState(false);
  const [dropDebugger, setDropDebugger] = useState(false);
  const [comments, setComments] = useState('none'); // 'none' | 'important' | 'all'
  const [target, setTarget] = useState('esnext'); // 'es5' | 'es2015' | 'es2020' | 'esnext'

  const [currentTheme, setCurrentTheme] = useState(theme);
  const [orientation, setOrientation] = useState(initialOrientation);

  const inputRef = useRef(null);
  const outputRef = useRef('');
  const errorRef = useRef('');
  const terserRef = useRef(null);

  useEffect(() => { setCurrentTheme(theme); }, [theme]);
  useEffect(() => { outputRef.current = output; }, [output]);
  useEffect(() => { errorRef.current = error; }, [error]);

  const ensureTerser = async () => {
    if (!terserRef.current) {
      terserRef.current = await import('terser');
    }
    return terserRef.current;
  };

  // Live minify (debounced 300ms)
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
        const { minify } = await ensureTerser();

        const opts = {
          mangle,
          compress: compress ? {
            drop_console: dropConsole,
            drop_debugger: dropDebugger,
          } : false,
          format: {
            comments: comments === 'none' ? false : (comments === 'important' ? 'some' : 'all'),
          },
          ecma: target === 'es5' ? 5 : target === 'es2015' ? 2015 : target === 'es2020' ? 2020 : 2020,
        };

        const result = await minify(input, opts);
        if (cancelled) return;
        setOutput(result.code || '');
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
  }, [input, mangle, compress, dropConsole, dropDebugger, comments, target]);

  // Keyboard shortcuts
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
    setMangle(true);
    setCompress(true);
    setDropConsole(false);
    setDropDebugger(false);
    setComments('none');
    setTarget('esnext');
  }, []);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.js';
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

  // Stats
  const inBytes = new Blob([input]).size;
  const outBytes = new Blob([output]).size;
  const savedBytes = inBytes - outBytes;
  const savedPct = inBytes > 0 ? Math.round((savedBytes / inBytes) * 100) : 0;

  return (
    <div className="tool" data-theme={currentTheme}>
      {/* top bar */}
      <div className="top-bar">
        <span className="hint">
          Paste JavaScript, get minified output. Terser under the hood.
        </span>

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

      {/* options row */}
      <div className="opts">
        <label className="opt" data-tt="Rename variables to short names (safe within scope)">
          <input
            type="checkbox"
            checked={mangle}
            onChange={(e) => setMangle(e.target.checked)}
          />
          Mangle names
        </label>

        <label className="opt" data-tt="Compress expressions and remove dead code">
          <input
            type="checkbox"
            checked={compress}
            onChange={(e) => setCompress(e.target.checked)}
          />
          Compress
        </label>

        <label className="opt" data-tt="Remove all console.* calls">
          <input
            type="checkbox"
            checked={dropConsole}
            onChange={(e) => setDropConsole(e.target.checked)}
            disabled={!compress}
          />
          Drop <code>console</code>
        </label>

        <label className="opt" data-tt="Remove all debugger statements">
          <input
            type="checkbox"
            checked={dropDebugger}
            onChange={(e) => setDropDebugger(e.target.checked)}
            disabled={!compress}
          />
          Drop <code>debugger</code>
        </label>

        <span className="opt-select" data-tt="Which comments to preserve in the output">
          <span className="opt-select-lbl">Comments:</span>
          <select value={comments} onChange={(e) => setComments(e.target.value)}>
            <option value="none">None</option>
            <option value="important">Important (/*! ... */)</option>
            <option value="all">All</option>
          </select>
        </span>

        <span className="opt-select" data-tt="ECMAScript version to target">
          <span className="opt-select-lbl">Target:</span>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="es5">ES5</option>
            <option value="es2015">ES2015</option>
            <option value="es2020">ES2020</option>
            <option value="esnext">Latest</option>
          </select>
        </span>
      </div>

      {/* samples row */}
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

      {/* body */}
      <div className={'body' + (showExplanations ? ' with-exp' : '')}>
        <div className={'panes ' + orientation}>
          <div className="pane">
            <div className="lbl">
              <span>JavaScript Input</span>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JavaScript here — e.g. function add(a, b) { return a + b; }"
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
                  data-tt="Save output as minified.js"
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

      {/* stats */}
      <div className="stats">
        <span>Input: <b>{inBytes}</b> bytes</span>
        <span>Output: <b>{outBytes}</b> bytes</span>
        <span>Saved: <b>{savedBytes > 0 ? savedBytes : 0}</b> bytes &middot; <b>{savedPct > 0 ? savedPct : 0}%</b></span>
        {error && <span style={{ color: 'var(--error)' }}>Error</span>}
      </div>

      {/* ── Scoped component styles ─────────────────────────── */}
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
        .opt-select { display: inline-flex; align-items: center; gap: 8px; }
        .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
        .opt-select select {
          padding: 4px 8px;
          font-size: 12px; font-family: ui-monospace, Menlo, monospace;
          background: var(--surface); color: var(--text);
          border: 1px solid var(--border-strong); border-radius: 4px;
          cursor: pointer;
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

      {/* ── Global tooltip CSS ─────────────────────────────── */}
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