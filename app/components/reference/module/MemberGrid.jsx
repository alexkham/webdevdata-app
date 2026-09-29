// app/components/reference/module/MemberGrid.jsx
//
// A module hub's members, grouped (Functions / Classes / Exceptions /
// Constants), each a card linking to its member page. Pure render; groups
// and labels come from the page.

import MethodCard from '@/app/components/reference/explorer/MethodCard';

export default function MemberGrid({ groups = [] }) {
  const shown = groups.filter((g) => g.items.length > 0);
  if (shown.length === 0) return null;
  return (
    <div>
      {shown.map((g) => (
        <div className="group" key={g.key}>
          <div className="group-hdr">
            <span className="group-name">{g.label}</span>
            <span className="group-count">{g.items.length}</span>
          </div>
          <div className="grid">
            {g.items.map((m) => (
              <MethodCard
                key={m.href}
                name={m.name}
                signature={m.signature}
                blurb={m.blurb}
                href={m.href}
                live={m.hasLiveDemo}
              />
            ))}
          </div>
        </div>
      ))}
      <style jsx>{`
        .group { margin-bottom: 18px; }
        .group-hdr { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
        .group-name { font-size: 11px; font-weight: 800; color: #334155; letter-spacing: 0.08em; text-transform: uppercase; }
        .group-count { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; font-weight: 700; color: #64748b; background: #eef2f7; padding: 1px 6px; border-radius: 3px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
      `}</style>
    </div>
  );
}
