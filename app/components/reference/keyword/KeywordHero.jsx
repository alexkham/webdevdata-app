// app/components/reference/keyword/KeywordHero.jsx
//
// Hero block for a keyword page: meta badges, the syntax forms (one code
// block per form — for, for/else, …) and a keyword cheat card
// (use for / result / pairs with / watch out). Pure render.
//
// The page h1/subtitle are NOT here — they belong to the page itself.

import CodeBlock from '@/app/components/reference/method/CodeBlock';

export default function KeywordHero({ method }) {
  const cheat = method.cheat || {};
  const cheatRows = [
    { lbl: 'Use for',    val: cheat.useFor },
    { lbl: 'Result',     val: cheat.result },
    { lbl: 'Pairs with', val: cheat.pairsWith },
    { lbl: 'Watch out',  val: cheat.watchOut },
  ].filter((r) => r.val);
  const forms = method.syntax || [];

  return (
    <div className="hero">
      <div className="meta">
        {method.category && <span className="badge cat">{method.category}</span>}
        {method.version && <span className="badge ver">{method.version}</span>}
        {method.hasLiveDemo && <span className="badge live">Live demo</span>}
      </div>

      {forms.length > 0 && (
        <div className={`forms ${forms.length > 1 ? 'multi' : ''}`}>
          {forms.map((f) => (
            <div className="form" key={f.label}>
              <div className="form-lbl">{f.label}</div>
              <CodeBlock code={f.code} />
            </div>
          ))}
        </div>
      )}

      {cheatRows.length > 0 && (
        <div className="cheat">
          {cheatRows.map((r) => (
            <div className="cheat-row" key={r.lbl}>
              <div className="cheat-lbl">{r.lbl}</div>
              <div className="cheat-val">{r.val}</div>
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

        .forms { display: grid; gap: 12px; margin-bottom: 20px; }
        .forms.multi { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
        .form-lbl { font-size: 10.5px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }

        .cheat { background: #f2f6fd; border-left: 3px solid #1B50EE; border-radius: 0 6px 6px 0; padding: 14px 18px; margin-bottom: 22px; }
        .cheat-row { display: grid; grid-template-columns: 100px 1fr; gap: 12px; margin-bottom: 6px; align-items: baseline; }
        .cheat-row:last-child { margin-bottom: 0; }
        .cheat-lbl { font-size: 10.5px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; }
        .cheat-val { font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #0f172a; }
      `}</style>
    </div>
  );
}
