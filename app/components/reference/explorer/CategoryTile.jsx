// app/components/reference/explorer/CategoryTile.jsx
//
// Section tile for the language landing. Live tiles link; planned tiles
// ("SOON" / "LATER") render as inert cards. Pure render.

export default function CategoryTile({ name, badge, blurb, count, href }) {
  const live = Boolean(href);
  const body = (
    <>
      <div className="cat-name">
        {name} <span className="cat-badge">{badge}</span>
      </div>
      <div className="cat-blurb">{blurb}</div>
      <div className="cat-count">{count}</div>
      <style jsx>{`
        .cat-name { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; }
        .cat-badge { font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; padding: 2px 6px; border-radius: 3px; color: ${live ? '#1B50EE' : '#64748b'}; background: ${live ? '#E8EEFB' : '#eef2f7'}; }
        .cat-blurb { color: #64748b; font-size: 12.5px; line-height: 1.5; margin-bottom: 10px; min-height: 34px; }
        .cat-count { font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; color: ${live ? '#1B50EE' : '#94a3b8'}; font-weight: 700; }
      `}</style>
    </>
  );

  if (live) {
    return (
      <a className="cat on" href={href}>
        {body}
        <style jsx>{`
          .cat { display: block; padding: 18px 18px 20px; background: #f8fafd; border: 1px solid #e4e4e7; border-radius: 8px; text-decoration: none; color: inherit; border-left: 3px solid #1B50EE; transition: all 0.15s; }
          .cat:hover { border-color: #C8D4F6; border-left-color: #1B50EE; background: #f2f6fd; }
        `}</style>
      </a>
    );
  }
  return (
    <div className="cat soon">
      {body}
      <style jsx>{`
        .cat { display: block; padding: 18px 18px 20px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; color: inherit; border-left: 3px solid transparent; opacity: 0.55; cursor: default; }
      `}</style>
    </div>
  );
}
