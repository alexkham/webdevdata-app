// app/components/reference/method/WhenToUse.jsx
//
// Use / avoid decision columns. Pure render.

export default function WhenToUse({ when }) {
  if (!when || (!when.use && !when.avoid)) return null;
  return (
    <div className="decision">
      <div className="dec-col dec-yes">
        <div className="dec-hdr">Use it</div>
        <ul>
          {(when.use || []).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div className="dec-col dec-no">
        <div className="dec-hdr">Reach for something else</div>
        <ul>
          {(when.avoid || []).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <style jsx>{`
        .decision { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .dec-col { padding: 14px 16px; }
        .dec-yes { background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 3px solid #16a34a; border-radius: 0 6px 6px 0; }
        .dec-no { background: #fef2f2; border: 1px solid #fecaca; border-left: 3px solid #dc2626; border-radius: 0 6px 6px 0; }
        .dec-hdr { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
        .dec-yes .dec-hdr { color: #15803d; }
        .dec-no .dec-hdr { color: #991b1b; }
        ul { list-style: none; padding: 0; margin: 0; }
        li { padding: 5px 0; font-size: 13px; color: #334155; border-bottom: 1px solid rgba(0, 0, 0, 0.04); }
        li:last-child { border-bottom: none; }
        @media (max-width: 700px) {
          .decision { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
