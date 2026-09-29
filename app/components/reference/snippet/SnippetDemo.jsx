// app/components/reference/snippet/SnippetDemo.jsx
//
// Interactive snippet demo: editable inputs fill a small Python program,
// the emulator computes what CPython prints. Several modes (tabs), each with
// its own inputs, snippet and cases. Used by:
//   exception pages — Trigger / Raise / Handle
//   keyword pages   — one tab per syntax form (for, for/else, …)
//
// Wiring contract (method.modes):
//   [{ id, label, blurb, params: [{ name, type, hint, input }],
//      template: 'python code with {$param} placeholders',
//      cases: [{ id, label, values }] }]
//   emulator[mode.id](...args) — args in params order; returns the value of
//   the snippet's final expression, or throws an Error whose name is the
//   Python exception type.
//
// The snippet shown is EXACTLY the code the audit runs through CPython, so
// the output box is what Python prints. An uncaught exception is shown as
// the last line of its traceback.

import { useState } from 'react';
import { coerce, fillSnippet, errorLine, pyReprExact } from '@/utils/demo-coerce';
import CodeBlock from '@/app/components/reference/method/CodeBlock';

function initialValues(mode) {
  const first = (mode.cases && mode.cases[0] && mode.cases[0].values) || {};
  const v = {};
  (mode.params || []).forEach((p) => { v[p.name] = first[p.name] !== undefined ? first[p.name] : ''; });
  return v;
}

export default function SnippetDemo({ modes = [], emulator, explainer }) {
  const [modeId, setModeId] = useState(modes.length > 0 ? modes[0].id : null);
  const [state, setState] = useState(() => {
    const s = {};
    modes.forEach((m) => {
      s[m.id] = { caseId: m.cases && m.cases[0] ? m.cases[0].id : null, values: initialValues(m) };
    });
    return s;
  });
  const [copied, setCopied] = useState(false);

  if (!emulator || modes.length === 0) return null;
  const mode = modes.find((m) => m.id === modeId) || modes[0];
  const params = mode.params || [];
  const { caseId, values } = state[mode.id];

  const args = params.map((p) => coerce(values[p.name], p));
  const code = fillSnippet(mode.template, params, args);

  let output;
  let failed = false;
  try {
    output = pyReprExact(emulator[mode.id](...args));
  } catch (e) {
    failed = true;
    output = errorLine(e);
  }

  const applyCase = (c) => {
    const v = {};
    params.forEach((p) => { v[p.name] = c.values[p.name] !== undefined ? c.values[p.name] : ''; });
    setState((prev) => ({ ...prev, [mode.id]: { caseId: c.id, values: v } }));
  };

  const onInput = (name, raw) => {
    setState((prev) => ({
      ...prev,
      [mode.id]: { caseId: null, values: { ...prev[mode.id].values, [name]: raw } },
    }));
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  return (
    <div>
      <div className="demo">
        <div className="demo-top">
          <span className="demo-title">Live evaluation</span>
          {modes.length > 1 && (
            <div className="modes" role="tablist">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={m.id === mode.id}
                  className={`mode-btn ${m.id === mode.id ? 'on' : ''}`}
                  onClick={() => setModeId(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
          <button type="button" className="demo-copy" onClick={copyCode}>
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>

        {mode.blurb && <div className="mode-blurb">{mode.blurb}</div>}

        {mode.cases && mode.cases.length > 0 && (
          <div className="demo-cases">
            <span className="demo-cases-lbl">Try:</span>
            {mode.cases.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`case-btn ${caseId === c.id ? 'on' : ''}`}
                onClick={() => applyCase(c)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="demo-body">
          <div className="demo-in">
            <div className="demo-panel-lbl">Inputs</div>
            {params.map((p) => (
              <div className="param" key={p.name}>
                <div className="param-hdr">
                  <span className="param-name">{p.name}</span>
                  <span className="param-type">{p.type}</span>
                  {p.hint && <span className="param-hint">{p.hint}</span>}
                </div>
                <input
                  type={p.input === 'number' ? 'number' : 'text'}
                  value={values[p.name]}
                  onChange={(e) => onInput(p.name, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="demo-out">
            <div className="demo-panel-lbl">Code</div>
            <CodeBlock code={code} />
            <div className="demo-panel-lbl out-lbl">{failed ? 'Uncaught exception' : 'Result'}</div>
            <div className={`out-val ${failed ? 'err' : ''}`}>{output}</div>
          </div>
        </div>
      </div>

      {explainer && <p className="demo-explainer">{explainer}</p>}

      <style jsx>{`
        .demo { border: 1px solid #cfd6e0; border-radius: 8px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04); }
        .demo-top { padding: 8px 14px; background: #eef2f7; border-bottom: 1px solid #cfd6e0; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .demo-title { font-size: 11px; font-weight: 800; color: #334155; letter-spacing: 0.08em; text-transform: uppercase; }
        .modes { display: flex; gap: 2px; background: #ffffff; border: 1px solid #C8D4F6; border-radius: 5px; padding: 2px; }
        .mode-btn { padding: 4px 12px; font-size: 11.5px; font-weight: 700; color: #334155; background: transparent; border: none; border-radius: 3px; cursor: pointer; }
        .mode-btn:hover { color: #1B50EE; }
        .mode-btn.on { background: #1B50EE; color: #ffffff; }
        .demo-copy { margin-left: auto; padding: 4px 10px; font-size: 10.5px; font-weight: 700; color: #1B50EE; background: #ffffff; border: 1px solid #C8D4F6; border-radius: 4px; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; }
        .mode-blurb { padding: 10px 14px 0; font-size: 13px; color: #334155; }
        .demo-cases { padding: 10px 14px; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; border-bottom: 1px solid #e4e4e7; }
        .demo-cases-lbl { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-right: 4px; }
        .case-btn { padding: 4px 10px; font-size: 11.5px; font-weight: 600; color: #1B50EE; background: #ffffff; border: 1px solid #C8D4F6; border-radius: 4px; cursor: pointer; font-family: ui-monospace, Menlo, monospace; }
        .case-btn:hover { background: #E8EEFB; }
        .case-btn.on { background: #1B50EE; color: #ffffff; border-color: #1B50EE; }
        .demo-body { display: grid; grid-template-columns: 2fr 3fr; }
        .demo-in { padding: 16px 18px; border-right: 1px solid #e4e4e7; display: flex; flex-direction: column; gap: 12px; }
        .demo-out { padding: 16px 18px; background: #f8fafd; display: flex; flex-direction: column; min-width: 0; }
        .demo-panel-lbl { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .out-lbl { margin-top: 12px; }
        .param { display: flex; flex-direction: column; gap: 3px; }
        .param-hdr { display: flex; align-items: baseline; gap: 8px; }
        .param-name { font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: #1B50EE; font-weight: 700; }
        .param-type { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; color: #94a3b8; font-weight: 600; }
        .param-hint { font-size: 11px; color: #64748b; margin-left: auto; }
        .param input { padding: 7px 10px; font-family: ui-monospace, Menlo, monospace; font-size: 13px; background: #ffffff; color: #0f172a; border: 1px solid #a3b0c6; border-radius: 4px; outline: none; }
        .param input:focus { border-color: #1B50EE; box-shadow: 0 0 0 3px rgba(27, 80, 238, 0.12); }
        .out-val { font-family: ui-monospace, Menlo, monospace; font-size: 13.5px; color: #0f172a; padding: 12px 14px; background: #ffffff; border: 1px solid #cfd6e0; border-radius: 4px; white-space: pre-wrap; word-break: break-word; }
        .out-val.err { color: #fca5a5; background: #1e1b2e; border-color: #3f2a3a; }
        .demo-explainer { font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 0; }
        @media (max-width: 760px) {
          .demo-body { grid-template-columns: 1fr; }
          .demo-in { border-right: none; border-bottom: 1px solid #e4e4e7; }
        }
      `}</style>
    </div>
  );
}
