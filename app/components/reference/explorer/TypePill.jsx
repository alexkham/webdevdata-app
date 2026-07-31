// app/components/reference/explorer/TypePill.jsx
//
// Type-explorer pill for the language landing. Pure render.

export default function TypePill({ name, count, href }) {
  return (
    <a className="type" href={href}>
      <span className="type-name">{name}</span>
      <span className="type-n">{count}</span>
      <style jsx>{`
        .type { display: inline-flex; align-items: baseline; gap: 6px; padding: 7px 12px; background: #ffffff; border: 1px solid #C8D4F6; border-radius: 6px; text-decoration: none; font-family: ui-monospace, Menlo, monospace; transition: all 0.12s; }
        .type:hover { background: #E8EEFB; border-color: #1B50EE; }
        .type-name { font-size: 12.5px; color: #1B50EE; font-weight: 700; }
        .type-n { font-size: 10.5px; color: #64748b; font-weight: 600; }
      `}</style>
    </a>
  );
}
