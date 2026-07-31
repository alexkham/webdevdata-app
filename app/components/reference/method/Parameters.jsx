// app/components/reference/method/Parameters.jsx
//
// Parameters table + return value. Pure render.

export default function Parameters({ parameters = [], returns = null }) {
  if (parameters.length === 0 && !returns) return null;
  return (
    <div>
      {parameters.length > 0 && (
        <table className="params-tbl">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            {parameters.map((p) => (
              <tr key={p.name}>
                <td className="name">{p.name}</td>
                <td className="type">{p.type}</td>
                <td className={`req ${p.required ? 'yes' : ''}`}>
                  {p.required ? 'yes' : 'no'}
                  {!p.required && p.default !== null && p.default !== undefined && (
                    <em className="def"> ({p.default})</em>
                  )}
                </td>
                <td>{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {returns && (
        <>
          <h3>Return value</h3>
          <p><code>{returns.type}</code> — {returns.desc}</p>
        </>
      )}
      <style jsx>{`
        .params-tbl { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
        .params-tbl th, .params-tbl td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
        .params-tbl th { background: #eef2f7; font-size: 10.5px; font-weight: 800; color: #334155; letter-spacing: 0.08em; text-transform: uppercase; }
        .params-tbl td.name { font-family: ui-monospace, Menlo, monospace; color: #1B50EE; font-weight: 700; width: 90px; }
        .params-tbl td.type { font-family: ui-monospace, Menlo, monospace; color: #64748b; font-size: 12px; width: 100px; }
        .params-tbl td.req { width: 90px; font-size: 12px; color: #64748b; }
        .params-tbl td.req.yes { color: #b91c1c; font-weight: 700; }
        .def { color: #94a3b8; }
        h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 20px 0 8px; }
        p { margin: 0 0 12px; color: #334155; font-size: 13.5px; }
        code { font-family: ui-monospace, Menlo, monospace; background: #f1f5f9; padding: 1px 5px; border-radius: 3px; font-size: 12.5px; }
      `}</style>
    </div>
  );
}
