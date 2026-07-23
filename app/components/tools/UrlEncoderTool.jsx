// UrlEncoderTool.jsx — v1
// URL encoder / decoder with three encoding modes:
//  - component: encodeURIComponent (default) — escapes reserved chars
//  - uri: encodeURI — preserves URL structure (:, /, ?, #, [], @, etc.)
//  - form: application/x-www-form-urlencoded — spaces become '+'

import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_EXPLANATIONS = {
  encode: (
    <>
      <p><b>Encode</b> converts characters that aren&apos;t safe in URLs into percent-escaped form (<code>%20</code>, <code>%3F</code>, etc.).</p>
      <p><em>Component</em> escapes everything not a URL-safe char; <em>URI</em> preserves URL structure; <em>Form</em> uses <code>+</code> for spaces.</p>
    </>
  ),
  decode: (
    <>
      <p><b>Decode</b> converts percent-escapes back into characters.</p>
      <p><em>Component</em> / <em>URI</em> use standard decoding; <em>Form</em> also converts <code>+</code> back into spaces.</p>
    </>
  ),
};

const SAMPLES = {
  encode: [
    {
      label: 'Query param',
      tt: 'A value that needs component encoding.',
      text: 'hello world & goodbye',
    },
    {
      label: 'Full URL',
      tt: 'A URL where structure should be preserved — use URI mode.',
      text: 'https://example.com/search?q=hello world&lang=en',
    },
    {
      label: 'Special chars',
      tt: 'Characters that reserve encoding: space, ?, &, =, /, +.',
      text: 'a b?c&d=e/f+g',
    },
    {
      label: 'Unicode',
      tt: 'Non-ASCII characters — always percent-escaped.',
      text: 'café résumé — 100% pure',
    },
  ],
  decode: [
    {
      label: 'Encoded value',
      tt: 'A component-encoded query value.',
      text: 'hello%20world%20%26%20goodbye',
    },
    {
      label: 'Encoded URL',
      tt: 'A URL that was encoded whole.',
      text: 'https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello',
    },
    {
      label: 'Form-encoded',
      tt: 'Uses + for spaces — needs Form mode.',
      text: 'first+name=alice&last+name=smith',
    },
    {
      label: 'Unicode',
      tt: 'Percent-encoded UTF-8 bytes.',
      text: 'caf%C3%A9%20r%C3%A9sum%C3%A9',
    },
  ],
};

function encodeText(input, mode) {
  if (mode === 'component') return encodeURIComponent(input);
  if (mode === 'uri') return encodeURI(input);
  // form: encodeURIComponent + turn %20 into +
  return encodeURIComponent(input).replace(/%20/g, '+');
}

function decodeText(input, mode) {
  const prepped = mode === 'form' ? input.replace(/\+/g, ' ') : input;
  return decodeURIComponent(prepped);
}

export default function UrlEncoderTool({
  theme = 'light',
  showThemeToggle = false,
  showOrientationToggle = true,
  initialOrientation = 'horizontal',
  showExplanations = false,
  explanations = null,
}) {
  const [mode, setMode] = useState('encode'); // 'encode' | 'decode'
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [encoding, setEncoding] = useState('component'); // 'component' | 'uri' | 'form'

  const [currentTheme, setCurrentTheme] = useState(theme);
  const [orientation, setOrientation] = useState(initialOrientation);

  const inputRef = useRef(null);
  const outputRef = useRef('');
  const errorRef = useRef('');

  useEffect(() => { setCurrentTheme(theme); }, [theme]);
  useEffect(() => { outputRef.current = output; }, [output]);
  useEffect(() => { errorRef.current = error; }, [error]);

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const result = mode === 'encode'
        ? encodeText(input, encoding)
        : decodeText(input, encoding);
      setOutput(result);
      setError('');
    } catch (e) {
      setOutput('');
      setError((e && e.message) || String(e));
    }
  }, [input, mode, encoding]);

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
        setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleReset = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setMode('encode');
    setEncoding('component');
  }, []);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const filename = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output, mode]);

  const loadSample = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const inputLabel = mode === 'encode' ? 'Text / URL Input' : 'Encoded Input';
  const outputLabel = mode === 'encode' ? 'Encoded Output' : 'Decoded Output';
  const inputPlaceholder = mode === 'encode'
    ? 'Paste text or URL to encode'
    : 'Paste percent-encoded text to decode';

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

  const inBytes = new Blob([input]).size;
  const outBytes = new Blob([output]).size;

  return (
    <div className="tool" data-theme={currentTheme}>
      <div className="top-bar">
        <div className="tabs" role="tablist">
          <button
            role="tab"
            className={'tab' + (mode === 'encode' ? ' on' : '')}
            onClick={() => setMode('encode')}
            data-tt="Text → percent-encoded"
          >
            Encode
          </button>
          <button
            role="tab"
            className={'tab' + (mode === 'decode' ? ' on' : '')}
            onClick={() => setMode('decode')}
            data-tt="Percent-encoded → text"
          >
            Decode
          </button>
        </div>

        <span className="hint">
          {mode === 'encode' ? 'Text or URL → percent-escaped.' : 'Percent-escaped → text.'}
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

      <div className="opts">
        <span className="opt-select" data-tt="Which encoding scheme to use">
          <span className="opt-select-lbl">Mode:</span>
          <select value={encoding} onChange={(e) => setEncoding(e.target.value)}>
            <option value="component">Component (encodeURIComponent)</option>
            <option value="uri">URI (encodeURI, preserve structure)</option>
            <option value="form">Form (spaces as +)</option>
          </select>
        </span>
        <span className="opt-note">
          {encoding === 'component' && 'Escapes everything reserved. Use for query values, path segments.'}
          {encoding === 'uri' && 'Preserves : / ? # [ ] @ ! $ & \' ( ) * + , ; = — use for a full URL.'}
          {encoding === 'form' && 'application/x-www-form-urlencoded — spaces become +.'}
        </span>
      </div>

      <div className="samples">
        <span className="samples-lbl">Samples:</span>
        {SAMPLES[mode].map((s) => (
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
                  data-tt="Save output as file"
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

      <div className="stats">
        <span>Input: <b>{input.length}</b> chars &middot; <b>{inBytes}</b> bytes</span>
        <span>Output: <b>{output.length}</b> chars &middot; <b>{outBytes}</b> bytes</span>
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
        .opt-note {
          font-size: 12px;
          color: var(--text-muted);
          font-style: italic;
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