// app/components/reference/explorer/LanguageCard.jsx
//
// One language cluster on the /reference pillar landing: widget header
// (kicker, name, blurb, stats) + sample cards grid + browse-all link.
// Pure render.

export default function LanguageCard({ id, title, blurb, count, liveCount, samples, browseHref }) {
  return (
    <section className="cluster" id={id}>
      <div className="widget">
        <div className="widget-kicker">Language</div>
        <div className="widget-name">{title}</div>
        <p className="widget-blurb">{blurb}</p>
        <div className="widget-stats">
          <span><b>{count}</b> {count === 1 ? 'function' : 'functions'}</span>
          <span><b>{liveCount}</b> with live demo</span>
        </div>
      </div>
      {samples.length > 0 && (
        <div className="cards">
          {samples.map((s) => (
            <a className="card" key={s.href} href={s.href}>
              <div className="card-name">{s.name}</div>
              <div className="card-blurb">{s.blurb}</div>
            </a>
          ))}
        </div>
      )}
      <a className="browse-all" href={browseHref}>Browse all {count} →</a>
      <style jsx>{`
        .cluster { margin-bottom: 40px; }
        .widget { background: #f2f6fd; border-left: 3px solid #1B50EE; padding: 18px 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px; }
        .widget-kicker { font-size: 11px; font-weight: 800; color: #1B50EE; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
        .widget-name { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
        .widget-blurb { color: #475569; font-size: 13.5px; margin: 0 0 12px; line-height: 1.6; max-width: 640px; }
        .widget-stats { display: flex; gap: 24px; font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #64748b; }
        .widget-stats b { color: #1B50EE; font-weight: 700; }
        .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px; }
        .card { border: 1px solid #e4e4e7; border-radius: 6px; padding: 12px 14px; text-decoration: none; color: inherit; background: #ffffff; transition: border-color 0.12s; }
        .card:hover { border-color: #C8D4F6; background: #f8fafd; }
        .card-name { font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #1B50EE; font-weight: 700; margin-bottom: 3px; }
        .card-blurb { color: #64748b; font-size: 12px; }
        .browse-all { display: inline-block; color: #1B50EE; font-size: 12.5px; font-weight: 700; text-decoration: none; letter-spacing: 0.04em; text-transform: uppercase; margin-top: 4px; }
        .browse-all:hover { color: #133EBF; }
        @media (max-width: 720px) {
          .cards { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
