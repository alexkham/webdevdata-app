// app/components/reference/exception/Attributes.jsx
//
// Attributes table for an exception page — { name, type, meaning } rows
// (args, errno/filename, name/obj, __cause__, …). Pure render.

export default function Attributes({ attributes = [] }) {
  if (attributes.length === 0) return null;
  return (
    <div>
      <table className="attr-tbl">
        <thead>
          <tr><th>Attribute</th><th>Type</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          {attributes.map((a) => (
            <tr key={a.name}>
              <td className="name">{a.name}</td>
              <td className="type">{a.type}</td>
              <td>{a.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .attr-tbl { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 13px; }
        .attr-tbl th, .attr-tbl td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
        .attr-tbl th { background: #eef2f7; font-size: 10.5px; font-weight: 800; color: #334155; letter-spacing: 0.08em; text-transform: uppercase; }
        .attr-tbl td.name { font-family: ui-monospace, Menlo, monospace; color: #1B50EE; font-weight: 700; white-space: nowrap; }
        .attr-tbl td.type { font-family: ui-monospace, Menlo, monospace; color: #64748b; font-size: 12px; white-space: nowrap; }
      `}</style>
    </div>
  );
}
