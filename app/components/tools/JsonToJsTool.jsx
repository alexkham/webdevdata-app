// JsonToJsTool.jsx — v2
// Fixes over v1:
//  - Wraps <select> in a <span data-tt> so tooltips render (pseudo-elements
//    don't paint on form controls in most browsers).
//  - Tooltip CSS moved from `:global(...)` inside scoped <style jsx> to a
//    dedicated <style jsx global> block — bulletproof across styled-jsx versions.

import { useState, useEffect, useRef, useCallback } from 'react';

// ---------- reserved words (cannot be used as unquoted keys safely) ----------
const RESERVED = new Set([
  'break','case','catch','class','const','continue','debugger','default',
  'delete','do','else','export','extends','false','finally','for','function',
  'if','import','in','instanceof','new','null','return','super','switch',
  'this','throw','true','try','typeof','var','void','while','with','yield',
  'let','static','enum','await','implements','interface','package','private',
  'protected','public',
]);
const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const isValidJsIdent = (k) => IDENT_RE.test(k) && !RESERVED.has(k);

// ---------- built-in explanations (mode-keyed) ----------
const DEFAULT_EXPLANATIONS = {
  'json-to-js': (
    <>
      <p><b>JSON &rarr; JS</b> turns a JSON string into a JavaScript object literal you can paste into code.</p>
      <p>Keys that are valid JS identifiers get unquoted; keys with spaces, digits at the start, or dashes stay quoted. String quotes become the style you pick.</p>
    </>
  ),
  'js-to-json': (
    <>
      <p><b>JS &rarr; JSON</b> takes a JavaScript object literal and produces valid JSON.</p>
      <p>Unquoted keys get quoted, single quotes become double quotes, trailing commas are removed, and JS-only values (<code>undefined</code>, functions) are rejected as invalid JSON.</p>
    </>
  ),
};

// ---------- JSON -> JS conversion ----------
function jsonToJs(input, opts) {
  const parsed = JSON.parse(input);
  const indent = opts.indent === 'tab' ? '\t' : ' '.repeat(opts.indent);
  const q = opts.quotes === 'single' ? "'" : '"';
  const trailingComma = opts.trailingComma;
  const unquoteKeys = opts.unquoteKeys;

  const encodeString = (s) => {
    const escaped = s
      .replace(/\\/g, '\\\\')
      .replace(new RegExp(q, 'g'), '\\' + q)
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return q + escaped + q;
  };

  const encodeKey = (k) => {
    if (unquoteKeys && isValidJsIdent(k)) return k;
    return encodeString(k);
  };

  const walk = (val, depth) => {
    const pad = indent.repeat(depth);
    const padInner = indent.repeat(depth + 1);

    if (val === null) return 'null';
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'number') return Number.isFinite(val) ? String(val) : 'null';
    if (typeof val === 'string') return encodeString(val);

    if (Array.isArray(val)) {
      if (val.length === 0) return '[]';
      const items = val.map((v) => padInner + walk(v, depth + 1));
      const tail = trailingComma ? ',' : '';
      return '[\n' + items.join(',\n') + tail + '\n' + pad + ']';
    }

    if (typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return '{}';
      const items = keys.map((k) => padInner + encodeKey(k) + ': ' + walk(val[k], depth + 1));
      const tail = trailingComma ? ',' : '';
      return '{\n' + items.join(',\n') + tail + '\n' + pad + '}';
    }

    return 'null';
  };

  const body = walk(parsed, 0);
  return opts.constPrefix ? `const data = ${body};` : body;
}

// ---------- JS -> JSON conversion ----------
function jsToJson(input, opts) {
  let src = input.trim();
  src = src.replace(/^\s*(?:const|let|var)\s+[A-Za-z_$][A-Za-z0-9_$]*\s*=\s*/, '');
  src = src.replace(/;\s*$/, '');

  let i = 0;
  const n = src.length;

  const err = (msg) => {
    const line = src.slice(0, i).split('\n').length;
    const col = i - src.lastIndexOf('\n', i - 1);
    throw new Error(`${msg} at line ${line}, col ${col}`);
  };

  const skipWs = () => {
    while (i < n) {
      const c = src[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue; }
      if (c === '/' && src[i + 1] === '/') {
        while (i < n && src[i] !== '\n') i++;
        continue;
      }
      if (c === '/' && src[i + 1] === '*') {
        i += 2;
        while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
      break;
    }
  };

  const parseString = () => {
    const quote = src[i];
    i++;
    let out = '';
    while (i < n) {
      const c = src[i];
      if (c === '\\') {
        const next = src[i + 1];
        if (next === quote) { out += quote; i += 2; continue; }
        if (next === '\\') { out += '\\'; i += 2; continue; }
        if (next === '/') { out += '/'; i += 2; continue; }
        if (next === 'n') { out += '\n'; i += 2; continue; }
        if (next === 'r') { out += '\r'; i += 2; continue; }
        if (next === 't') { out += '\t'; i += 2; continue; }
        if (next === 'b') { out += '\b'; i += 2; continue; }
        if (next === 'f') { out += '\f'; i += 2; continue; }
        if (next === 'u') {
          const hex = src.slice(i + 2, i + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) err('Invalid unicode escape');
          out += String.fromCharCode(parseInt(hex, 16));
          i += 6;
          continue;
        }
        out += next;
        i += 2;
        continue;
      }
      if (c === quote) { i++; return out; }
      out += c;
      i++;
    }
    err('Unterminated string');
  };

  const parseNumber = () => {
    const start = i;
    if (src[i] === '-' || src[i] === '+') i++;
    while (i < n && /[0-9.eE+\-]/.test(src[i])) i++;
    const raw = src.slice(start, i);
    const num = Number(raw);
    if (!Number.isFinite(num)) err(`Invalid number: ${raw}`);
    return num;
  };

  const parseIdent = () => {
    const start = i;
    while (i < n && /[A-Za-z0-9_$]/.test(src[i])) i++;
    return src.slice(start, i);
  };

  const parseValue = () => {
    skipWs();
    const c = src[i];
    if (c === '{') return parseObject();
    if (c === '[') return parseArray();
    if (c === '"' || c === "'") return parseString();
    if (c === '-' || c === '+' || (c >= '0' && c <= '9')) return parseNumber();

    const ident = parseIdent();
    if (ident === 'true') return true;
    if (ident === 'false') return false;
    if (ident === 'null') return null;
    if (ident === 'undefined') err('undefined is not valid JSON');
    if (ident === 'NaN' || ident === 'Infinity') err(`${ident} is not valid JSON`);
    if (!ident) err(`Unexpected character: ${c}`);
    err(`Unexpected identifier: ${ident}`);
  };

  const parseObject = () => {
    i++;
    const obj = {};
    skipWs();
    if (src[i] === '}') { i++; return obj; }
    while (i < n) {
      skipWs();
      let key;
      if (src[i] === '"' || src[i] === "'") {
        key = parseString();
      } else {
        key = parseIdent();
        if (!key) err('Expected key');
      }
      skipWs();
      if (src[i] !== ':') err(`Expected ':' after key "${key}"`);
      i++;
      const val = parseValue();
      obj[key] = val;
      skipWs();
      if (src[i] === ',') { i++; skipWs(); if (src[i] === '}') { i++; return obj; } continue; }
      if (src[i] === '}') { i++; return obj; }
      err(`Expected ',' or '}' in object`);
    }
    err('Unterminated object');
  };

  const parseArray = () => {
    i++;
    const arr = [];
    skipWs();
    if (src[i] === ']') { i++; return arr; }
    while (i < n) {
      arr.push(parseValue());
      skipWs();
      if (src[i] === ',') { i++; skipWs(); if (src[i] === ']') { i++; return arr; } continue; }
      if (src[i] === ']') { i++; return arr; }
      err(`Expected ',' or ']' in array`);
    }
    err('Unterminated array');
  };

  const result = parseValue();
  skipWs();
  if (i < n) err('Unexpected trailing content');
  const indent = opts.indent === 'tab' ? '\t' : ' '.repeat(opts.indent);
  return JSON.stringify(result, null, indent);
}

// ---------- Samples ----------
const SAMPLES = {
  'json-to-js': [
    {
      label: 'Simple',
      tt: 'A flat object with common types.',
      text: '{"name":"alice","age":30,"active":true,"tags":["admin","dev"]}',
    },
    {
      label: 'Nested',
      tt: 'Deeper structure with nested objects and arrays.',
      text: '{"user":{"id":42,"profile":{"city":"Tel Aviv","country":"IL"}},"scores":[10,20,30]}',
    },
    {
      label: 'Array of objects',
      tt: 'Typical API list response.',
      text: '[{"id":1,"title":"first"},{"id":2,"title":"second"},{"id":3,"title":"third"}]',
    },
    {
      label: 'Tricky keys',
      tt: 'Keys with spaces, digits, and reserved words — must stay quoted.',
      text: '{"first name":"alice","123id":1,"class":"admin","normal":true}',
    },
  ],
  'js-to-json': [
    {
      label: 'Simple',
      tt: 'JS object with unquoted keys and single quotes.',
      text: "{name: 'alice', age: 30, active: true, tags: ['admin', 'dev']}",
    },
    {
      label: 'With comments',
      tt: 'JS-style comments — stripped on convert.',
      text: "// user record\n{\n  name: 'alice',  // first name only\n  /* age at signup */\n  age: 30,\n}",
    },
    {
      label: 'const prefix',
      tt: 'A full JS declaration — prefix is stripped.',
      text: "const user = {\n  id: 42,\n  profile: {\n    city: 'Tel Aviv',\n    country: 'IL',\n  },\n};",
    },
    {
      label: 'Trailing commas',
      tt: 'Trailing commas are legal in JS, invalid in JSON — removed.',
      text: "{\n  items: [\n    'a',\n    'b',\n    'c',\n  ],\n  count: 3,\n}",
    },
  ],
};

// ---------- component ----------
export default function JsonToJsTool({
  theme = 'light',
  showThemeToggle = false,
  showOrientationToggle = true,
  initialOrientation = 'horizontal',
  showExplanations = false,
  explanations = null,
}) {
  const [mode, setMode] = useState('json-to-js');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [indent, setIndent] = useState(2);
  const [quotes, setQuotes] = useState('single');
  const [unquoteKeys, setUnquoteKeys] = useState(true);
  const [trailingComma, setTrailingComma] = useState(false);
  const [constPrefix, setConstPrefix] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(theme);
  const [orientation, setOrientation] = useState(initialOrientation);

  const inputRef = useRef(null);
  const outputRef = useRef('');
  const errorRef = useRef('');

  useEffect(() => { setCurrentTheme(theme); }, [theme]);
  useEffect(() => { outputRef.current = output; }, [output]);
  useEffect(() => { errorRef.current = error; }, [error]);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const opts = { indent, quotes, unquoteKeys, trailingComma, constPrefix };
      const result = mode === 'json-to-js' ? jsonToJs(input, opts) : jsToJson(input, opts);
      setOutput(result);
      setError('');
    } catch (e) {
      setOutput('');
      setError(e.message || String(e));
    }
  }, [input, mode, indent, quotes, unquoteKeys, trailingComma, constPrefix]);

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
        setMode((m) => (m === 'json-to-js' ? 'js-to-json' : 'json-to-js'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleReset = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setMode('json-to-js');
    setIndent(2);
    setQuotes('single');
    setUnquoteKeys(true);
    setTrailingComma(false);
    setConstPrefix(false);
  }, []);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const filename = mode === 'json-to-js' ? 'converted.js' : 'converted.json';
    const mime = mode === 'json-to-js' ? 'text/javascript' : 'application/json';
    const blob = new Blob([output], { type: mime });
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

  const inputLabel = mode === 'json-to-js' ? 'JSON Input' : 'JavaScript Object';
  const outputLabel = mode === 'json-to-js' ? 'JavaScript Output' : 'JSON Output';
  const inputPlaceholder = mode === 'json-to-js'
    ? 'Paste JSON here — e.g. {"name":"alice","age":30}'
    : "Paste a JS object literal here — e.g. { name: 'alice', age: 30 }";

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

  return (
    <div className="tool" data-theme={currentTheme}>
      {/* top bar */}
      <div className="top-bar">
        <div className="tabs" role="tablist">
          <button
            role="tab"
            className={'tab' + (mode === 'json-to-js' ? ' on' : '')}
            onClick={() => setMode('json-to-js')}
            data-tt="Convert JSON to a JS object literal"
          >
            JSON &rarr; JS
          </button>
          <button
            role="tab"
            className={'tab' + (mode === 'js-to-json' ? ' on' : '')}
            onClick={() => setMode('js-to-json')}
            data-tt="Convert JS object literal to JSON"
          >
            JS &rarr; JSON
          </button>
        </div>

        <span className="hint">
          {mode === 'json-to-js' ? 'Paste JSON, get a JavaScript object literal.' : 'Paste a JS object, get valid JSON.'}
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
        {/* Selects wrapped so tooltip pseudo-elements render on the wrapper, not the select. */}
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

        {mode === 'json-to-js' && (
          <>
            <span className="opt-select" data-tt="String quote style in the output">
              <span className="opt-select-lbl">Quotes:</span>
              <select
                value={quotes}
                onChange={(e) => setQuotes(e.target.value)}
              >
                <option value="single">Single &apos;&apos;</option>
                <option value="double">Double &quot;&quot;</option>
              </select>
            </span>

            <label className="opt" data-tt="Unquote keys that are valid JS identifiers">
              <input
                type="checkbox"
                checked={unquoteKeys}
                onChange={(e) => setUnquoteKeys(e.target.checked)}
              />
              Unquote keys
            </label>

            <label className="opt" data-tt="Add trailing commas after last items">
              <input
                type="checkbox"
                checked={trailingComma}
                onChange={(e) => setTrailingComma(e.target.checked)}
              />
              Trailing commas
            </label>

            <label className="opt" data-tt="Prefix output with `const data = `">
              <input
                type="checkbox"
                checked={constPrefix}
                onChange={(e) => setConstPrefix(e.target.checked)}
              />
              <code>const</code> prefix
            </label>
          </>
        )}
      </div>

      {/* samples row */}
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
                  data-tt="Save output as text file"
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
        <span>Output: <b>{output.length}</b> chars &middot; <b>{outputBytes}</b> bytes</span>
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