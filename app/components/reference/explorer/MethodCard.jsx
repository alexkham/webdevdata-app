// app/components/reference/explorer/MethodCard.jsx
//
// One function card in the explorer grid. Pure render.
// Shows the signature without the receiver prefix (replace(old, new, ...)).

export default function MethodCard({ name, signature, blurb, href, live }) {
  let shortSig = signature;
  const parenIdx = signature ? signature.indexOf('(') : -1;
  if (parenIdx !== -1) {
    shortSig = signature.slice(0, parenIdx).split('.').pop() + signature.slice(parenIdx);
  }

  return (
    <a className="card" href={href}>
      {live && <span className="live">LIVE</span>}
      <div className="card-name">{name}</div>
      {shortSig && <div className="card-sig">{shortSig}</div>}
      {blurb && <div className="card-blurb">{blurb}</div>}
      <style jsx>{`
        .card { display: block; padding: 10px 12px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 5px; text-decoration: none; color: inherit; transition: border-color 0.12s, background 0.12s; position: relative; }
        .card:hover { border-color: #C8D4F6; background: #f2f6fd; }
        .card-name { font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: #1B50EE; font-weight: 700; margin-bottom: 2px; }
        .card-sig { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; color: #64748b; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-blurb { color: #64748b; font-size: 11.5px; }
        .live { position: absolute; top: 8px; right: 8px; font-size: 8.5px; font-weight: 800; color: #1B50EE; background: #E8EEFB; padding: 2px 5px; border-radius: 3px; letter-spacing: 0.08em; }
      `}</style>
    </a>
  );
}
