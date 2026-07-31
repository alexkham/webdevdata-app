// app/components/reference/method/MethodHero.jsx
//
// Hero block for a method page: meta badges, cheat card, and the signature
// bar with hover-explained parameters. Pure render.
//
// The page h1/subtitle are NOT here — they belong to the page itself.

import { parseSignature } from '@/utils/signature-parser';

export default function MethodHero({ method }) {
  const tokens = parseSignature(method.signature, method.parameters);
  const cheat = method.cheat || {};
  const cheatRows = [
    { lbl: 'Common call', val: cheat.commonCall },
    { lbl: 'Returns',     val: cheat.returns },
    { lbl: 'Replaces',    val: cheat.replaces },
    { lbl: 'Watch out',   val: cheat.watchOut },
  ].filter((r) => r.val);

  return (
    <div className="hero">
      <div className="meta">
        {method.category && <span className="badge cat">{method.category}</span>}
        {method.version && <span className="badge ver">{method.version}</span>}
        {method.hasLiveDemo && <span className="badge live">Live demo</span>}
      </div>

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

      <div className="sig">
        {tokens.map((t, i) => {
          if (t.kind === 'param') {
            return (
              <span key={i} className="sig-param">
                {t.text}
                {t.hint && (
                  <span className="sig-tt">
                    <b>{t.text}</b> — {t.hint.desc}
                    <span className="sig-tt-t">
                      type: {t.hint.type} · {t.hint.required ? 'required' : `default: ${t.hint.default}`}
                    </span>
                  </span>
                )}
              </span>
            );
          }
          if (t.kind === 'name') return <span key={i} className="sig-name">{t.text}</span>;
          if (t.kind === 'prefix') return <span key={i} className="sig-prefix">{t.text}</span>;
          if (t.kind === 'default') return <span key={i} className="sig-def">{t.text}</span>;
          return <span key={i} className="sig-def">{t.text}</span>;
        })}
        {method.returns && <div className="sig-ret">→ {method.returns.type}</div>}
      </div>

      <style jsx>{`
        .meta { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .badge { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.06em; text-transform: uppercase; }
        .badge.cat { color: #1B50EE; background: #E8EEFB; border: 1px solid #C8D4F6; }
        .badge.ver { color: #334155; background: #eef2f7; border: 1px solid #cfd6e0; }
        .badge.live { color: #16a34a; background: #dcfce7; border: 1px solid #86efac; }

        .cheat { background: #f2f6fd; border-left: 3px solid #1B50EE; border-radius: 0 6px 6px 0; padding: 14px 18px; margin-bottom: 20px; }
        .cheat-row { display: grid; grid-template-columns: 100px 1fr; gap: 12px; margin-bottom: 6px; align-items: baseline; }
        .cheat-row:last-child { margin-bottom: 0; }
        .cheat-lbl { font-size: 10.5px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; }
        .cheat-val { font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #0f172a; }

        .sig { background: #0f172a; border-radius: 8px; padding: 18px 20px; margin-bottom: 22px; color: #d4dae5; font-family: ui-monospace, Menlo, monospace; font-size: 15px; line-height: 1.7; }
        .sig-name { color: #4D74FF; font-weight: 700; }
        .sig-prefix { color: #94a3b8; }
        .sig-def { color: #94a3b8; }
        .sig-param { color: #fde68a; cursor: help; text-decoration: underline dotted rgba(253, 230, 138, 0.4); text-underline-offset: 3px; position: relative; }
        .sig-param:hover { color: #fef3c7; }
        .sig-param:hover .sig-tt { display: block; }
        .sig-tt { display: none; position: absolute; top: calc(100% + 8px); left: 0; background: #1e293b; border: 1px solid #334155; border-radius: 5px; padding: 8px 12px; min-width: 220px; z-index: 10; font-size: 12px; line-height: 1.5; color: #e2e8f0; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); font-weight: 400; }
        .sig-tt b { color: #4D74FF; }
        .sig-tt-t { color: #86efac; font-size: 11px; display: block; margin-top: 4px; }
        .sig-ret { margin-top: 8px; font-size: 12px; color: #64748b; }
      `}</style>
    </div>
  );
}
