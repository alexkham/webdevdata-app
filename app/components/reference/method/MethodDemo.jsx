// app/components/reference/method/MethodDemo.jsx
//
// Interactive live demo. Receives the emulator as a prop and calls it on
// every input change. Sub-parts (case tabs, form, output) live inline —
// they are not reused elsewhere.
//
// Wiring contract:
//   method.demoParams — form fields, in emulator-argument order
//                       [{ name, type, hint, input: 'text'|'number' }]
//   method.cases      — seed values keyed by param name
//   emulator(...args) — args in demoParams order; throws like Python would

import { useMemo, useState } from 'react';
import { pyRepr } from '@/utils/code-highlight';

// Turn the raw form value into the emulator argument. Input kinds:
//   'text'         string as-is
//   'text-or-none' empty string → null (Python None default)
//   'number'       int, NaN → -1
//   'csv'          comma-separated items → list of trimmed strings
//   'kv'           "a: 1, b: 2" pairs → dict of string values
function coerce(raw, param) {
  const s = String(raw);
  switch (param.input) {
    case 'number': {
      const n = parseInt(s, 10);
      return Number.isNaN(n) ? -1 : n;
    }
    case 'text-or-none':
      return s === '' ? null : s;
    case 'csv':
      return s.trim() === '' ? [] : s.split(',').map((x) => x.trim());
    case 'kv': {
      const obj = {};
      if (s.trim() === '') return obj;
      s.split(',').forEach((pair) => {
        const idx = pair.indexOf(':');
        if (idx === -1) return;
        obj[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
      });
      return obj;
    }
    default:
      return s;
  }
}

export default function MethodDemo({ method, emulator }) {
  const demoParams = method.demoParams || [];
  const cases = method.cases || [];
  const defaults = cases.length > 0 ? cases[0].values : {};

  const [activeCase, setActiveCase] = useState(cases.length > 0 ? cases[0].id : null);
  const [values, setValues] = useState(() => {
    const v = {};
    demoParams.forEach((p) => { v[p.name] = defaults[p.name] !== undefined ? defaults[p.name] : ''; });
    return v;
  });
  const [copied, setCopied] = useState(false);

  const byName = useMemo(
    () => new Map((method.parameters || []).map((p) => [p.name, p])),
    [method.parameters]
  );

  const args = demoParams.map((p) => coerce(values[p.name], p));

  // Call preview: receiver.method(arg, ...) — trailing args that equal the
  // declared parameter default are omitted, the way you would write the call.
  const callParts = demoParams.slice(1).map((p, i) => ({
    text: typeof args[i + 1] === 'number' ? String(args[i + 1]) : pyRepr(args[i + 1]),
    isDefault: (() => {
      const decl = byName.get(p.name);
      if (!decl || decl.required) return false;
      if (args[i + 1] === null) return decl.default === 'None';
      return String(args[i + 1]) === String(decl.default);
    })(),
  }));
  let lastShown = callParts.length - 1;
  while (lastShown >= 0 && callParts[lastShown].isDefault) lastShown -= 1;
  const shownArgs = callParts.slice(0, lastShown + 1).map((p) => p.text);

  const methodName = method.name.includes('.') ? method.name.split('.').pop() : method.name;
  const callText = `${pyRepr(args[0])}.${methodName}(${shownArgs.join(', ')})`;

  let output;
  let failed = false;
  try {
    output = pyRepr(emulator(...args));
  } catch (e) {
    failed = true;
    output = `${e.name || 'Error'}: ${e.message}`;
  }

  const applyCase = (c) => {
    setActiveCase(c.id);
    const v = {};
    demoParams.forEach((p) => { v[p.name] = c.values[p.name] !== undefined ? c.values[p.name] : ''; });
    setValues(v);
  };

  const onInput = (name, raw) => {
    setActiveCase(null);
    setValues((prev) => ({ ...prev, [name]: raw }));
  };

  const copyCall = async () => {
    try {
      await navigator.clipboard.writeText(callText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  if (!emulator) return null;

  return (
    <div>
      <div className="demo">
        <div className="demo-top">
          <span className="demo-title">Live evaluation</span>
          <button type="button" className="demo-copy" onClick={copyCall}>
            {copied ? 'Copied!' : 'Copy as call'}
          </button>
        </div>

        {cases.length > 0 && (
          <div className="demo-cases">
            <span className="demo-cases-lbl">Try:</span>
            {cases.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`case-btn ${activeCase === c.id ? 'on' : ''}`}
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
            {demoParams.map((p) => (
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
            <div className="demo-panel-lbl">Output</div>
            <div className="out-call">{callText}</div>
            <div className={`out-val ${failed ? 'err' : ''}`}>{output}</div>
          </div>
        </div>
      </div>

      {method.demoExplainer && <p className="demo-explainer">{method.demoExplainer}</p>}

      <style jsx>{`
        .demo { border: 1px solid #cfd6e0; border-radius: 8px; overflow: hidden; margin-bottom: 12px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04); }
        .demo-top { padding: 10px 14px; background: #eef2f7; border-bottom: 1px solid #cfd6e0; display: flex; gap: 10px; align-items: center; }
        .demo-title { font-size: 11px; font-weight: 800; color: #334155; letter-spacing: 0.08em; text-transform: uppercase; }
        .demo-copy { margin-left: auto; padding: 4px 10px; font-size: 10.5px; font-weight: 700; color: #1B50EE; background: #ffffff; border: 1px solid #C8D4F6; border-radius: 4px; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; }
        .demo-cases { padding: 10px 14px; background: #f2f6fd; border-bottom: 1px solid #e4e4e7; border-left: 3px solid #1B50EE; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
        .demo-cases-lbl { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-right: 4px; }
        .case-btn { padding: 4px 10px; font-size: 11.5px; font-weight: 600; color: #1B50EE; background: #ffffff; border: 1px solid #C8D4F6; border-radius: 4px; cursor: pointer; font-family: ui-monospace, Menlo, monospace; }
        .case-btn:hover { background: #E8EEFB; }
        .case-btn.on { background: #1B50EE; color: #ffffff; border-color: #1B50EE; }
        .demo-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; }
        .demo-in { padding: 16px 18px; border-right: 1px solid #e4e4e7; display: flex; flex-direction: column; gap: 12px; }
        .demo-out { padding: 16px 18px; background: #f8fafd; display: flex; flex-direction: column; }
        .demo-panel-lbl { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .param { display: flex; flex-direction: column; gap: 3px; }
        .param-hdr { display: flex; align-items: baseline; gap: 8px; }
        .param-name { font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: #1B50EE; font-weight: 700; }
        .param-type { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; color: #94a3b8; font-weight: 600; }
        .param-hint { font-size: 11px; color: #64748b; margin-left: auto; }
        .param input { padding: 7px 10px; font-family: ui-monospace, Menlo, monospace; font-size: 13px; background: #ffffff; color: #0f172a; border: 1px solid #a3b0c6; border-radius: 4px; outline: none; }
        .param input:focus { border-color: #1B50EE; box-shadow: 0 0 0 3px rgba(27, 80, 238, 0.12); }
        .out-call { font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: #64748b; margin-bottom: 8px; padding: 8px 10px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 4px; word-break: break-all; }
        .out-val { flex: 1; font-family: ui-monospace, Menlo, monospace; font-size: 14px; color: #0f172a; padding: 12px 14px; background: #ffffff; border: 1px solid #cfd6e0; border-radius: 4px; white-space: pre-wrap; word-break: break-all; }
        .out-val.err { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
        .demo-explainer { font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 0; }
        @media (max-width: 700px) {
          .demo-body { grid-template-columns: 1fr; }
          .demo-in { border-right: none; border-bottom: 1px solid #e4e4e7; }
        }
      `}</style>
    </div>
  );
}
