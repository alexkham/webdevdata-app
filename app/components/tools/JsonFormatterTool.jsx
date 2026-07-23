// JsonFormatterTool.jsx — JSON Formatter / Validator / Minifier
// Follows the JsonToJsTool pattern: scoped styles + global tooltip block,
// selects wrapped in <span data-tt> so tooltips render on form controls.

import { useState, useEffect, useRef, useCallback } from 'react';

// ---------- built-in explanations (mode-keyed) ----------
const DEFAULT_EXPLANATIONS = {
  format: (
    <>
      <p><b>Format</b> parses your JSON and re-prints it with consistent indentation — one value per line, nesting made visible.</p>
      <p>Invalid input shows a clear error with the line and position instead, so this doubles as a validator.</p>
    </>
  ),
  minify: (
    <>
      <p><b>Minify</b> strips all insignificant whitespace, producing the smallest valid JSON on a single line.</p>
      <p>Use it before shipping payloads or embedding JSON in configs where size matters. The data itself is unchanged.</p>
    </>
  ),
};

// ---------- helpers ----------
function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = sortKeysDeep(value[k]);
    return out;
  }
  return value;
}

function escapeNonAsciiChars(json) {
  return json.replace(/[\u007f-\uffff]/g, (c) =>
    '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
  );
}

function maxDepthOf(value) {
  if (Array.isArray(value)) {
    let m = 0;
    for (const v of value) m = Math.max(m, maxDepthOf(v));
    return 1 + m;
  }
  if (value !== null && typeof value === 'object') {
    let m = 0;
    for (const k of Object.keys(value)) m = Math.max(m, maxDepthOf(value[k]));
    return 1 + m;
  }
  return 0;
}

function describeParseError(e, input) {
  const msg = e.message || String(e);
  const m = msg.match(/position (\d+)/);
  if (m && !/line \d+/.test(msg)) {
    const pos = parseInt(m[1], 10);
    const before = input.slice(0, pos);
    const line = before.split('\n').length;
    const col = pos - before.lastIndexOf('\n');
    return `Invalid JSON: ${msg} (line ${line}, column ${col})`;
  }
  return `Invalid JSON: ${msg}`;
}

// ---------- Samples ----------
// Each sample sets its own mode + input.
const SAMPLES = [
  {
    label: 'Simple object',
    mode: 'format',
    tt: 'A flat object with common types.',
    text: '{"name":"alice","age":30,"active":true,"tags":["admin","dev"]}',
  },
  {
    label: 'Nested + Unicode',
    mode: 'format',
    tt: 'Nested objects, arrays, and non-ASCII strings.',
    text: '{"user":{"name":"José","city":"Tel Aviv","bio":"Café ☕"},"langs":["English","עברית","日本語"],"scores":[[1,2],[3,4]]}',
  },
  {
    label: 'Minified blob',
    mode: 'format',
    tt: 'A single-line API-style response — format it to read it.',
    text: '[{"id":1,"user":{"name":"alice","roles":["admin"]},"active":true},{"id":2,"user":{"name":"bob","roles":["dev","ops"]},"active":false},{"id":3,"user":{"name":"carol","roles":[]},"active":true}]',
  },
  {
    label: 'Invalid JSON',
    mode: 'format',
    tt: 'A trailing comma — see the error display.',
    text: '{\n  "name": "alice",\n  "age": 30,\n}',
  },
];

// ---------- component ----------
export default function JsonFormatterTool({
  theme = 'light',
  showThemeToggle = false,
  showOrientationToggle = true,
  initialOrientation = 'horizontal',
  showExplanations = false,
  explanations = null,
}) {
  const [mode, setMode] = useState('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [escapeNonAscii, setEscapeNonAscii] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(theme);
  const [orientation, setOrientation] = useState(initialOrientation);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const outputRef = useRef('');
  const errorRef = useRef('');

  useEffect(() => { setCurrentTheme(theme); }, [theme]);
  useEffect(() => { outputRef.current = output; }, [output]);
  useEffect(() => { errorRef.current = error; }, [error]);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setMeta(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const value = sortKeys ? sortKeysDeep(parsed) : parsed;
      const space = mode === 'format'
        ? (indent === 'tab' ? '\t' : ' '.repeat(indent))
        : undefined;
      let result = JSON.stringify(value, null, space);
      if (escapeNonAscii) result = escapeNonAsciiChars(result);
      setOutput(result);
      setError('');

      let topCount = null;
      let topKind = null;
      if (Array.isArray(parsed)) {
        topCount = parsed.length;
        topKind = 'items';
      } else if (parsed !== null && typeof parsed === 'object') {
        topCount = Object.keys(parsed).length;
        topKind = 'keys';
      }
      setMeta({ topCount, topKind, depth: maxDepthOf(parsed) });
    } catch (e) {
      setOutput('');
      setMeta(null);
      setError(describeParseError(e, input));
    }
  }, [input, mode, indent, sortKeys, escapeNonAscii]);

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
      } else if (e.key === '/') {
        e.preventDefault();
        setMode((m) => (m === 'format' ? 'minify' : 'format'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleReset = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setMeta(null);
    setMode('format');
    setIndent(2);
    setSortKeys(false);
    setEscapeNonAscii(false);
  }, []);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const filename = mode === 'format' ? 'formatted.json' : 'minified.json';
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output, mode]);

  const loadSample = (s) => {
    setMode(s.mode);
    setInput(s.text);
    inputRef.current?.focus();
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMode('format');
      setInput(String(reader.result));
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const inputLabel = 'JSON Input';
  const outputLabel = mode === 'format' ? 'Formatted Output' : 'Minified Output';
  const inputPlaceholder = mode === 'format'
    ? 'Paste JSON here — e.g. {"name":"alice","age":30}'
    : 'Paste JSON here — whitespace will be stripped.';

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

  const inputBytes = new Blob([input]).size;
  const outputBytes = new Blob([output]).size;
  const delta = output && inputBytes > 0
    ? ((outputBytes - inputBytes) / inputBytes) * 100
    : null;

  return (
    <div className="tool" data-theme={currentTheme}>
      {/* top bar */}
      <div className="top-bar">
        <div className="tabs" role="tablist">
          <button
            role="tab"
            className={'tab' + (mode === 'format' ? ' on' : '')}
            onClick={() => setMode('format')}
            data-tt="Pretty-print JSON with indentation"
          >
            Format
          </button>
          <button
            role="tab"
            className={'tab' + (mode === 'minify' ? ' on' : '')}
            onClick={() => setMode('minify')}
            data-tt="Strip whitespace to a single line"
          >
            Minify
          </button>
        </div>

        <span className="hint">
          {mode === 'format' ? 'Paste JSON, get clean, readable output.' : 'Paste JSON, get a compact single line.'}
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
        {mode === 'format' && (
          <span className="opt-select" data-tt="Spaces or tabs used to indent the output">
            <span className="opt-select-lbl">Indent:</span>
            <select
              value={indent}
              onChange={(e) => {
                const v = e.target.value;
                setIndent(v === 'tab' ? 'tab' : parseInt(v, 10));
              }}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </span>
        )}

        <label className="opt" data-tt="Recursively sort object keys alphabetically">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
          />
          Sort keys A&rarr;Z
        </label>

        <label className="opt" data-tt="Output non-ASCII characters as \uXXXX escapes">
          <input
            type="checkbox"
            checked={escapeNonAscii}
            onChange={(e) => setEscapeNonAscii(e.target.checked)}
          />
          Escape non-ASCII
        </label>
      </div>

      {/* samples row */}
      <div className="samples">
        <span className="samples-lbl">Samples:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            className="sample"
            onClick={() => loadSample(s)}
            data-tt={s.tt}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* file drop */}
      <div
        className={'drop' + (dragOver ? ' dragover' : '')}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        data-tt="Drop a JSON file to load and format it"
      >
        Drop a JSON file here to format it, or click to browse
      </div>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
      />

      {/* body */}
      <div className={'body' + (showExplanations ? ' with-exp' : '')}>
        <div className={'panes ' + orientation}>
          <div className="pane">
            <div className="lbl">
              <span>{inputLabel}</span>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              spellCheck={false}
            />
          </div>
          <div className="pane">
            <div className="lbl">
              <span>{outputLabel}</span>
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
                  data-tt="Save output as a .json file"
                  data-tt-pos="above"
                >
                  Download
                </button>
              </div>
            </div>
            <div className={'out' + (error ? ' err' : '')}>
              {error || output || <span style={{ color: 'var(--text-input-placeholder)' }}>Output will appear here.</span>}
            </div>
          </div>
        </div>

        {showExplanations && (
          <div className="exp">
            <div className="exp-hdr">About this mode</div>
            <div className="exp-body">{expContent}</div>
          </div>
        )}
      </div>

      {/* stats */}
      <div className="stats">
        <span>Input: <b>{input.length}</b> chars &middot; <b>{inputBytes}</b> bytes</span>
        <span>Output: <b>{output.length}</b> chars</span>
        {delta !== null && (
          <span>&Delta; <b>{(delta >= 0 ? '+' : '') + delta.toFixed(1)}%</b></span>
        )}
        {meta && meta.topKind && (
          <span>Top level: <b>{meta.topCount}</b> {meta.topKind}</span>
        )}
        {meta && (
          <span>Depth: <b>{meta.depth}</b></span>
        )}
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
        .body.with-exp {
          grid-template-columns: minmax(0, 1fr) 300px;
        }

        .panes {
          display: grid;
          gap: 1px;
          background: var(--border);
          min-height: 340px;
        }
        .panes.horizontal { grid-template-columns: 1fr 1fr; }
        .panes.vertical   { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }

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
        .exp-body :global(a) {
          color: var(--primary); font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid var(--primary-border);
        }
        .exp-body :global(a:hover) { border-bottom-color: var(--primary); }
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

        /* ── Tool-specific: file drop ───────────────────────── */
        .drop {
          border: 2px dashed var(--border-strong);
          background: var(--surface-alt);
          margin: 12px 16px 0;
          border-radius: 8px;
          padding: 14px;
          text-align: center;
          color: var(--text-muted); font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .drop:hover, .drop.dragover {
          border-color: var(--primary);
          background: var(--primary-bg);
          color: var(--primary);
        }
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
        [data-tt-pos="above"]::after {
          top: auto; bottom: calc(100% + 8px);
        }
        [data-tt-pos="above"]::before {
          top: auto; bottom: 100%;
          border-bottom-color: transparent;
          border-top-color: #0f172a;
        }
      `}</style>
    </div>
  );
}
