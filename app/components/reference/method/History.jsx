// app/components/reference/method/History.jsx
//
// Version history timeline. Pure render.

export default function History({ history = [] }) {
  if (history.length === 0) return null;
  return (
    <div>
      {history.map((h) => (
        <div className="vh-item" key={h.version}>
          <div className="vh-ver">{h.version}</div>
          <div className="vh-note">{h.note}</div>
        </div>
      ))}
      <style jsx>{`
        .vh-item { display: grid; grid-template-columns: 90px 1fr; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .vh-item:last-child { border-bottom: none; }
        .vh-ver { font-family: ui-monospace, Menlo, monospace; font-weight: 700; color: #1B50EE; font-size: 12px; }
        .vh-note { color: #334155; }
      `}</style>
    </div>
  );
}
