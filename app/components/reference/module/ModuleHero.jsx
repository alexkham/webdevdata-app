// app/components/reference/module/ModuleHero.jsx
//
// Hero block for a stdlib module hub: badges, the import forms (one code
// block) and a module-facts card (source, C accelerator, …). Pure render.
//
// The page h1/subtitle are NOT here — they belong to the page itself.

import CodeBlock from '@/app/components/reference/method/CodeBlock';

export default function ModuleHero({ method }) {
  const imp = method.imports || [];
  const facts = method.facts || [];
  return (
    <div className="hero">
      <div className="meta">
        {method.category && <span className="badge cat">{method.category}</span>}
        {method.version && <span className="badge ver">{method.version}</span>}
        {method.hasLiveDemo && <span className="badge live">Live demo</span>}
      </div>

      {imp.length > 0 && (
        <div className="imports">
          <div className="lbl">Import</div>
          <CodeBlock code={imp.join('\n')} />
        </div>
      )}

      {facts.length > 0 && (
        <div className="facts">
          {facts.map((f) => (
            <div className="fact" key={f.label}>
              <div className="fact-lbl">{f.label}</div>
              <div className="fact-val">{f.value}</div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .meta { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .badge { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.06em; text-transform: uppercase; }
        .badge.cat { color: #1B50EE; background: #E8EEFB; border: 1px solid #C8D4F6; }
        .badge.ver { color: #334155; background: #eef2f7; border: 1px solid #cfd6e0; }
        .badge.live { color: #16a34a; background: #dcfce7; border: 1px solid #86efac; }
        .imports { margin-bottom: 18px; }
        .lbl { font-size: 10.5px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
        .facts { background: #f2f6fd; border-left: 3px solid #1B50EE; border-radius: 0 6px 6px 0; padding: 14px 18px; margin-bottom: 22px; }
        .fact { display: grid; grid-template-columns: 120px 1fr; gap: 12px; margin-bottom: 6px; align-items: baseline; }
        .fact:last-child { margin-bottom: 0; }
        .fact-lbl { font-size: 10.5px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; }
        .fact-val { font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #0f172a; }
      `}</style>
    </div>
  );
}
