// app/components/reference/method/Pitfalls.jsx
//
// Pitfalls — bug/fix pairs with code and outputs, red-accented cards.
// Renders the wrong/fix data recorded in the content file.

import CodeBlock from './CodeBlock';

// One side of a pair — pitfall-local helper, not exported.
function RunnerSide({ side, tone }) {
  return (
    <div>
      <div className={`g-lbl ${tone}`}>{side.label}</div>
      <div className="g-code"><CodeBlock code={side.code} /></div>
      <div className={`g-out ${tone}`}>{side.output}</div>
      <style jsx>{`
        .g-lbl { font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px; }
        .g-lbl.bad { color: #b91c1c; }
        .g-lbl.good { color: #15803d; }
        .g-code { margin: 6px 0; }
        .g-out { font-family: ui-monospace, Menlo, monospace; font-size: 12px; padding: 8px 10px; border-radius: 4px; margin-bottom: 6px; }
        .g-out.bad { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .g-out.good { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
      `}</style>
    </div>
  );
}

export default function Pitfalls({ pitfalls = [] }) {
  if (pitfalls.length === 0) return null;
  return (
    <div>
      {pitfalls.map((p, i) => (
        <div className="pitfall" key={p.name}>
          <div className="pitfall-name">{i + 1}. {p.name}</div>
          <div className="pitfall-desc">{p.desc}</div>
          <div className="pitfall-run">
            <RunnerSide side={p.wrong} tone="bad" />
            <RunnerSide side={p.fix} tone="good" />
          </div>
        </div>
      ))}
      <style jsx>{`
        .pitfall { border: 1px solid #fecaca; border-left: 3px solid #dc2626; border-radius: 0 6px 6px 0; padding: 14px 16px; margin-bottom: 12px; background: #fefefe; }
        .pitfall-name { font-size: 13.5px; font-weight: 700; color: #991b1b; margin-bottom: 4px; }
        .pitfall-desc { font-size: 12.5px; color: #475569; margin-bottom: 10px; }
        .pitfall-run { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 700px) {
          .pitfall-run { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
