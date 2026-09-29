// app/components/reference/exception/ExceptionHero.jsx
//
// Hero block for an exception page: the inheritance chain (each ancestor
// linked when it has its own page), the standard badges + constructor
// signature via MethodHero, then an exception-specific cheat card
// (raised by / message / quick fix / watch out). Pure render.
//
// The page h1/subtitle are NOT here — they belong to the page itself.

import MethodHero from '@/app/components/reference/method/MethodHero';

export default function ExceptionHero({ method, chain = [] }) {
  const cheat = method.cheat || {};
  const cheatRows = [
    { lbl: 'Raised by', val: cheat.raisedBy },
    { lbl: 'Message',   val: cheat.message },
    { lbl: 'Quick fix', val: cheat.quickFix },
    { lbl: 'Watch out', val: cheat.watchOut },
  ].filter((r) => r.val);

  return (
    <div>
      {chain.length > 0 && (
        <div className="chain" aria-label="Inheritance chain">
          <span className="chain-lbl">Inherits</span>
          {chain.map((c, i) => (
            <span key={c.name} className="chain-step">
              {i > 0 && <span className="chain-arrow">›</span>}
              {c.href && i < chain.length - 1 ? (
                <a className="chain-link" href={c.href}>{c.name}</a>
              ) : (
                <span className={i === chain.length - 1 ? 'chain-self' : 'chain-plain'}>{c.name}</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* badges + hover-explained constructor signature; cheat rendered below */}
      <MethodHero method={{ ...method, cheat: null }} />

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
        .chain { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; margin-bottom: 16px; }
        .chain-lbl { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-right: 4px; }
        .chain-step { display: inline-flex; align-items: center; gap: 6px; }
        .chain-arrow { color: #94a3b8; }
        .chain-link { color: #1B50EE; text-decoration: none; border-bottom: 1px dotted #93a9f0; }
        .chain-link:hover { border-bottom-style: solid; }
        .chain-plain { color: #475569; }
        .chain-self { color: #ffffff; background: #1B50EE; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
        .cheat { background: #f2f6fd; border-left: 3px solid #1B50EE; border-radius: 0 6px 6px 0; padding: 14px 18px; margin: -4px 0 22px; }
        .cheat-row { display: grid; grid-template-columns: 100px 1fr; gap: 12px; margin-bottom: 6px; align-items: baseline; }
        .cheat-row:last-child { margin-bottom: 0; }
        .cheat-lbl { font-size: 10.5px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; }
        .cheat-val { font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #0f172a; }
      `}</style>
    </div>
  );
}
