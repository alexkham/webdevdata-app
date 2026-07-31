// app/components/reference/frame/TabbedReferenceLayout.jsx
//
// Tabs variant ("tabs" layout, per the approved py-replace-full-tabs mockup):
// three-column shell.
//
//   left rail   sibling method links (monospace list)
//   main        children (hero) + sticky tab bar + one visible panel
//   right rail  "Try in a tool" + "Official docs" cards

import { useRef, useState } from 'react';

// Right-rail card — layout-local helper, not exported.
function RailCard({ heading, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="ref-card">
      <div className="ref-card-hdr">{heading}</div>
      {items.map((it) => (
        <a
          key={it.href}
          className="ref-item"
          href={it.href}
          target={it.external ? '_blank' : undefined}
          rel={it.external ? 'noopener noreferrer' : undefined}
        >
          <div className="ref-item-name">{it.name}</div>
          {it.meta && <div className="ref-item-meta">{it.meta}</div>}
        </a>
      ))}
      <style jsx>{`
        .ref-card { border: 1px solid #e4e4e7; border-radius: 6px; padding: 14px; margin-bottom: 12px; background: #ffffff; }
        .ref-card-hdr { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .ref-item { display: block; padding: 6px 0; border-bottom: 1px solid #f1f5f9; text-decoration: none; }
        .ref-item:last-child { border-bottom: none; }
        .ref-item-name { font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #1B50EE; font-weight: 700; }
        .ref-item-meta { font-size: 11px; color: #64748b; margin-top: 1px; }
      `}</style>
    </div>
  );
}

export default function TabbedReferenceLayout({ siblings, siblingsTitle, sections, rail, children }) {
  const [activeId, setActiveId] = useState(sections.length > 0 ? sections[0].id : null);
  const tabsRef = useRef(null);

  const selectTab = (id) => {
    setActiveId(id);
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };

  const active = sections.find((s) => s.id === activeId) || sections[0] || null;
  const railItems = rail || {};

  return (
    <div className="ref-grid">
      <aside className="rail-l">
        <div className="rail-hdr">{siblingsTitle}</div>
        <div className="rail-list">
          {(siblings || []).map((s) => (
            <a key={s.href} href={s.href} className={s.active ? 'on' : ''}>
              {s.title}
            </a>
          ))}
        </div>
      </aside>

      <main className="ref-main">
        {children}

        <div className="tabs" ref={tabsRef}>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`tab ${activeId === s.id ? 'on' : ''}`}
              onClick={() => selectTab(s.id)}
            >
              {s.label}
              {typeof s.count === 'number' && <span className="tab-count">{s.count}</span>}
            </button>
          ))}
        </div>

        {active && (
          <div className="panel">
            <h2>{active.label}</h2>
            {active.content}
          </div>
        )}
      </main>

      <aside className="rail-r">
        <RailCard heading="Try in a tool" items={railItems.tryInTool} />
        {railItems.officialDocs && (
          <RailCard
            heading="Official docs"
            items={[{ name: railItems.officialDocs.label, href: railItems.officialDocs.href, meta: `${railItems.officialDocs.meta} ↗`, external: true }]}
          />
        )}
      </aside>

      <style jsx>{`
        .ref-grid { display: grid; grid-template-columns: 200px 1fr 220px; gap: 28px; align-items: start; }
        .rail-l, .rail-r { position: sticky; top: 80px; max-height: calc(100vh - 100px); overflow-y: auto; }
        .rail-l { border-right: 1px solid #f1f5f9; padding-right: 16px; }
        .rail-hdr { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .rail-list { display: flex; flex-direction: column; gap: 3px; }
        .rail-list a { font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #334155; text-decoration: none; padding: 4px 8px; border-left: 2px solid transparent; border-radius: 0 3px 3px 0; }
        .rail-list a.on { color: #1B50EE; font-weight: 700; border-left-color: #1B50EE; background: #f2f6fd; }
        .rail-list a:hover { color: #1B50EE; background: #f8fafd; }
        .ref-main { min-width: 0; }
        .tabs { position: sticky; top: 60px; z-index: 20; background: #ffffff; display: flex; gap: 2px; border-bottom: 1px solid #e4e4e7; margin-bottom: 24px; overflow-x: auto; padding-top: 8px; }
        .tab { padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #64748b; background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; letter-spacing: 0.03em; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
        .tab:hover { color: #1B50EE; }
        .tab.on { color: #1B50EE; border-bottom-color: #1B50EE; }
        .tab-count { font-family: ui-monospace, Menlo, monospace; font-size: 10px; font-weight: 700; color: #64748b; background: #eef2f7; padding: 1px 5px; border-radius: 3px; }
        .tab.on .tab-count { color: #1B50EE; background: #E8EEFB; }
        .panel { min-height: 400px; }
        .panel h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px; letter-spacing: -0.01em; }
        @media (max-width: 1100px) {
          .ref-grid { grid-template-columns: 1fr; }
          .rail-l, .rail-r { position: static; max-height: none; border-right: none; padding-right: 0; }
        }
      `}</style>
    </div>
  );
}
