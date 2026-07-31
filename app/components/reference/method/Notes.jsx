// app/components/reference/method/Notes.jsx
//
// Implementation notes — key/value list. Pure render.

const LABELS = {
  complexity: 'Complexity',
  return:     'Return',
  cpython:    'CPython impl',
  memory:     'Memory',
  threadSafe: 'Thread-safe',
};

export default function Notes({ notes }) {
  if (!notes) return null;
  const rows = Object.entries(notes).filter(([, v]) => v);
  if (rows.length === 0) return null;
  return (
    <div className="notes">
      {rows.map(([key, val]) => (
        <div className="notes-row" key={key}>
          <div className="notes-lbl">{LABELS[key] || key}</div>
          <div className="notes-val">{val}</div>
        </div>
      ))}
      <style jsx>{`
        .notes { background: #f8fafd; border: 1px solid #e4e4e7; border-radius: 6px; padding: 14px 16px; margin-bottom: 12px; }
        .notes-row { display: grid; grid-template-columns: 130px 1fr; gap: 12px; padding: 4px 0; font-size: 12.5px; }
        .notes-lbl { font-size: 10.5px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; align-self: center; }
        .notes-val { color: #334155; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; }
      `}</style>
    </div>
  );
}
