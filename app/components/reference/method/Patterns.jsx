// app/components/reference/method/Patterns.jsx
//
// Common patterns — list of { name, desc, code } cards. Pure render.

import CodeBlock from './CodeBlock';

export default function Patterns({ patterns = [] }) {
  if (patterns.length === 0) return null;
  return (
    <div>
      {patterns.map((p) => (
        <div className="pattern" key={p.name}>
          <div className="pattern-name">{p.name}</div>
          <div className="pattern-desc">{p.desc}</div>
          <CodeBlock code={p.code} />
        </div>
      ))}
      <style jsx>{`
        .pattern { border: 1px solid #e4e4e7; border-radius: 6px; padding: 14px 16px; margin-bottom: 12px; }
        .pattern-name { font-size: 13.5px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .pattern-desc { font-size: 12.5px; color: #64748b; margin-bottom: 10px; }
      `}</style>
    </div>
  );
}
