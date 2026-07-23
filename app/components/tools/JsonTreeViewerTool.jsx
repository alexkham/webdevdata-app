// JsonTreeViewerTool.jsx — v1
// JSON tree viewer with live parse, path-based expansion, search, expand/collapse-all.
// Single-mode tool per WebDevData tool-component-guide-v2.

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const OP = 'view';

const DEFAULT_EXPLANATIONS = {
  view: (
    <>
      <p><b>Tree View</b> renders JSON as a hierarchical, collapsible tree — keys, values, and structure at a glance.</p>
      <p>Node paths are unique, so two keys named <code>id</code> at different depths expand independently. Search highlights matching keys and values.</p>
    </>
  ),
};

const SAMPLES = [
  {
    label: 'API response',
    tt: 'Typical REST API list response.',
    text: `{
  "status": "ok",
  "count": 3,
  "users": [
    {"id": 1, "name": "alice", "roles": ["admin", "editor"]},
    {"id": 2, "name": "bob", "roles": ["viewer"]},
    {"id": 3, "name": "carol", "roles": ["admin"]}
  ]
}`,
  },
  {
    label: 'Deep nest',
    tt: 'Deeply nested config-style structure.',
    text: `{
  "app": {
    "name": "webdevdata",
    "server": {
      "host": "localhost",
      "port": 3000,
      "tls": {"enabled": true, "cert": "/etc/ssl/site.pem"}
    },
    "features": {"analytics": false, "cache": {"ttl": 3600, "size": "10MB"}}
  }
}`,
  },
  {
    label: 'Mixed types',
    tt: 'One of every JSON primitive.',
    text: `{
  "string": "hello",
  "number": 42.5,
  "boolean_true": true,
  "boolean_false": false,
  "null_value": null,
  "array": [1, "two", false, null],
  "object": {"nested": true}
}`,
  },
  {
    label: 'Large-ish',
    tt: 'A larger structure to test performance.',
    text: JSON.stringify({
      products: Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1,
        sku: `SKU-${1000 + i}`,
        name: `Product ${i + 1}`,
        price: 9.99 + i,
        inStock: i % 3 !== 0,
        tags: ['tag-' + (i % 5), 'tag-' + (i % 3)],
      })),
      meta: { total: 20, page: 1 },
    }, null, 2),
  },
];

// ---------- tree helpers ----------

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

function collectAllPaths(node, prefix, out) {
  out.push(prefix);
  const t = typeOf(node);
  if (t === 'object' || t === 'array') {
    if (t === 'array') {
      node.forEach((v, i) => collectAllPaths(v, prefix + '.' + i, out));
    } else {
      Object.keys(node).forEach((k) => collectAllPaths(node[k], prefix + '.' + k, out));
    }
  }
}

function computeStats(node) {
  let keys = 0;
  let maxDepth = 0;
  const walk = (n, d) => {
    if (d > maxDepth) maxDepth = d;
    const t = typeOf(n);
    if (t === 'object') {
      const ks = Object.keys(n);
      keys += ks.length;
      ks.forEach((k) => walk(n[k], d + 1));
    } else if (t === 'array') {
      n.forEach((v) => walk(v, d + 1));
    }
  };
  walk(node, 0);
  return { keys, maxDepth };
}

function nodeMatchesSearch(node, key, needle) {
  if (!needle) return true;
  const q = needle.toLowerCase();
  if (key !== null && String(key).toLowerCase().includes(q)) return true;
  const t = typeOf(node);
  if (t === 'string' || t === 'number' || t === 'boolean' || t === 'null') {
    return String(node).toLowerCase().includes(q);
  }
  return false;
}

function subtreeHasMatch(node, key, needle) {
  if (nodeMatchesSearch(node, key, needle)) return true;
  const t = typeOf(node);
  if (t === 'array') {
    return node.some((v, i) => subtreeHasMatch(v, i, needle));
  }
  if (t === 'object') {
    return Object.keys(node).some((k) => subtreeHasMatch(node[k], k, needle));
  }
  return false;
}

// ---------- component ----------

export default function JsonTreeViewerTool({
  theme = 'light',
  showThemeToggle = false,
  showExplanations = false,
  explanations = null,
}) {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const [expanded, setExpanded] = useState(new Set(['root']));

  const [currentTheme, setCurrentTheme] = useState(theme);

  const inputRef = useRef(null);
  const parsedRef = useRef(null);
  const errorRef = useRef('');

  useEffect(() => { setCurrentTheme(theme); }, [theme]);
  useEffect(() => { parsedRef.current = parsed; }, [parsed]);
  useEffect(() => { errorRef.current = error; }, [error]);

  // Live parse (debounced 200ms)
  useEffect(() => {
    if (!input.trim()) {
      setParsed(null);
      setError('');
      return;
    }
    const timer = setTimeout(() => {
      try {
        const p = JSON.parse(input);
        setParsed(p);
        setError('');
      } catch (e) {
        setParsed(null);
        setError((e && e.message) || String(e));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [input]);

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
        if (parsedRef.current !== null && !errorRef.current) {
          navigator.clipboard.writeText(JSON.stringify(parsedRef.current, null, 2));
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
    setParsed(null);
    setError('');
    setSearch('');
    setExpanded(new Set(['root']));
  }, []);

  const handleCopy = useCallback(() => {
    if (parsed === null || error) return;
    navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [parsed, error]);

  const handleDownload = useCallback(() => {
    if (parsed === null || error) return;
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [parsed, error]);

  const handleExpandAll = useCallback(() => {
    if (parsed === null) return;
    const out = [];
    collectAllPaths(parsed, 'root', out);
    setExpanded(new Set(out));
  }, [parsed]);

  const handleCollapseAll = useCallback(() => {
    setExpanded(new Set(['root']));
  }, []);

  const togglePath = useCallback((path) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

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
  const stats = useMemo(() => {
    if (parsed === null) return { keys: 0, maxDepth: 0 };
    return computeStats(parsed);
  }, [parsed]);

  // ---------- render tree ----------
  const renderValue = (v) => {
    const t = typeOf(v);
    if (t === 'string') return <span className={'v v-string'}>&quot;{v}&quot;</span>;
    if (t === 'number') return <span className={'v v-number'}>{v}</span>;
    if (t === 'boolean') return <span className={'v v-boolean'}>{String(v)}</span>;
    if (t === 'null') return <span className={'v v-null'}>null</span>;
    return null;
  };

  const highlight = (text, needle) => {
    if (!needle) return text;
    const s = String(text);
    const q = needle.toLowerCase();
    const idx = s.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {s.slice(0, idx)}
        <mark className="hl">{s.slice(idx, idx + needle.length)}</mark>
        {s.slice(idx + needle.length)}
      </>
    );
  };

  const renderNode = (node, key, path, depth) => {
    const t = typeOf(node);
    const isContainer = t === 'object' || t === 'array';
    const isExpanded = expanded.has(path);
    const matches = subtreeHasMatch(node, key, search);
    const dim = search && !matches;

    if (!isContainer) {
      return (
        <div key={path} className={'tree-row' + (dim ? ' dim' : '')} style={{ paddingLeft: depth * 16 + 12 }}>
          <span className="tree-toggle" />
          {key !== null && <span className={'k'}>{highlight(key, search)}<span className="colon">:</span> </span>}
          {t === 'string'
            ? <span className={'v v-string'}>&quot;{highlight(node, search)}&quot;</span>
            : renderValue(node)
          }
        </div>
      );
    }

    const entries = t === 'array'
      ? node.map((v, i) => [i, v])
      : Object.entries(node);
    const open = t === 'array' ? '[' : '{';
    const close = t === 'array' ? ']' : '}';

    return (
      <div key={path} className={dim ? 'dim' : ''}>
        <div
          className="tree-row clickable"
          style={{ paddingLeft: depth * 16 + 12 }}
          onClick={() => togglePath(path)}
        >
          <span className={'tree-toggle on'}>{isExpanded ? '▾' : '▸'}</span>
          {key !== null && <span className={'k'}>{highlight(key, search)}<span className="colon">:</span> </span>}
          <span className="bracket">{open}</span>
          {!isExpanded && (
            <span className="preview">
              <span className="count">{entries.length}</span>
              <span className="bracket">{close}</span>
            </span>
          )}
        </div>
        {isExpanded && (
          <>
            {entries.map(([k, v]) => renderNode(v, k, path + '.' + k, depth + 1))}
            <div className="tree-row" style={{ paddingLeft: depth * 16 + 12 }}>
              <span className="tree-toggle" />
              <span className="bracket">{close}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="tool" data-theme={currentTheme}>
      {/* top bar */}
      <div className="top-bar">
        <span className="hint">Paste JSON, get a live interactive tree.</span>

        <div className="top-actions">
          {parsed !== null && (
            <div className="seg-toggle" role="group">
              <button
                className="seg-btn"
                onClick={handleExpandAll}
                data-tt="Expand all nodes"
                aria-label="Expand all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 5l3 3 3-3M4 9l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="seg-btn"
                onClick={handleCollapseAll}
                data-tt="Collapse all nodes"
                aria-label="Collapse all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 8l3-3 3 3M4 4l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
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
            data-tt="Clear input and reset all state"
          >
            Reset
          </button>
        </div>
      </div>

      {/* options row (search) */}
      <div className="opts">
        <span className="opt-search" data-tt="Filter tree: highlights matching keys and values, dims the rest">
          <span className="opt-select-lbl">Search:</span>
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="key or value"
          />
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
        <div className="panes">
          <div className="pane">
            <div className="lbl">
              <span>JSON Input</span>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JSON here"
              spellCheck={false}
            />
          </div>
          <div className="pane">
            <div className="lbl">
              <span>Tree View</span>
              <div className="lbl-actions">
                <button
                  className="btn-in-lbl"
                  onClick={handleCopy}
                  disabled={parsed === null || !!error}
                  data-tt="Copy the formatted JSON to clipboard"
                  data-tt-pos="above"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  className="btn-in-lbl muted"
                  onClick={handleDownload}
                  disabled={parsed === null || !!error}
                  data-tt="Save as data.json"
                  data-tt-pos="above"
                >
                  Download
                </button>
              </div>
            </div>
            <div className={'out' + (error ? ' err' : '')}>
              {error
                ? error
                : parsed !== null
                  ? <div className="tree">{renderNode(parsed, null, 'root', 0)}</div>
                  : <span style={{ color: 'var(--text-input-placeholder)' }}>Tree will appear here.</span>
              }
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
        <span>Keys: <b>{stats.keys}</b></span>
        <span>Max depth: <b>{stats.maxDepth}</b></span>
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
          --v-string: #16a34a;
          --v-number: #7c3aed;
          --v-boolean: #0891b2;
          --v-null: #94a3b8;
          --k-color: #334155;
          --bracket: #64748b;
          --hl-bg: #fef08a;

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
          --v-string: #34d399;
          --v-number: #a78bfa;
          --v-boolean: #22d3ee;
          --v-null: #6b7891;
          --k-color: #c1cad9;
          --bracket: #97a3b8;
          --hl-bg: rgba(250,204,21,0.35);
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
        .seg-btn:hover:not(.on) { background: var(--primary-bg); color: var(--primary); }
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
        .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
        .opt-search { display: inline-flex; align-items: center; gap: 8px; flex: 1; max-width: 420px; }
        .search-input {
          flex: 1;
          padding: 5px 10px;
          font-size: 12.5px;
          font-family: ui-monospace, Menlo, monospace;
          color: var(--text);
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: 4px;
          outline: none;
        }
        .search-input:focus { border-color: var(--primary); }
        .search-input::placeholder { color: var(--text-input-placeholder); }

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
          grid-template-columns: 1fr 1fr;
          min-height: 340px;
        }

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
          overflow: auto;
          margin: 0;
          min-height: 200px;
        }
        textarea { white-space: pre-wrap; word-break: break-all; }
        textarea::placeholder { color: var(--text-input-placeholder); }
        .out { padding: 12px 0; }
        .out.err { color: var(--error); background: var(--error-bg); padding: 14px 16px; white-space: pre-wrap; }

        /* ── Tree ─────────────────────────────────────────────── */
        .tree {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px;
          line-height: 1.55;
        }
        .tree :global(.tree-row) {
          padding: 1px 12px 1px 0;
          white-space: nowrap;
          user-select: text;
        }
        .tree :global(.tree-row.clickable) {
          cursor: pointer;
        }
        .tree :global(.tree-row.clickable:hover) {
          background: var(--primary-bg);
        }
        .tree :global(.tree-toggle) {
          display: inline-block;
          width: 14px;
          color: var(--primary);
          font-size: 10px;
          text-align: center;
          user-select: none;
        }
        .tree :global(.k) {
          color: var(--k-color);
          font-weight: 600;
        }
        .tree :global(.colon) {
          color: var(--bracket);
          font-weight: 500;
        }
        .tree :global(.bracket) {
          color: var(--bracket);
          font-weight: 700;
        }
        .tree :global(.preview) {
          color: var(--text-subtle);
          margin-left: 4px;
        }
        .tree :global(.count) {
          color: var(--text-subtle);
          font-style: italic;
          margin-right: 4px;
        }
        .tree :global(.count::before) { content: '('; }
        .tree :global(.count::after) { content: ')'; }
        .tree :global(.v-string) { color: var(--v-string); }
        .tree :global(.v-number) { color: var(--v-number); }
        .tree :global(.v-boolean) { color: var(--v-boolean); font-weight: 600; }
        .tree :global(.v-null) { color: var(--v-null); font-style: italic; }
        .tree :global(.dim) { opacity: 0.25; }
        .tree :global(.hl) {
          background: var(--hl-bg);
          color: inherit;
          padding: 0 1px;
          border-radius: 2px;
        }

        /* ── Explanations ─────────────────────────────────────── */
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