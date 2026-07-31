// app/components/reference/frame/ClassicReferenceLayout.jsx
//
// Default reference layout ("sidebar" / left-nav variant, per the approved
// py-replace-full-leftnav mockup): three-column shell.
//
//   left rail   "On this page" anchor nav with scrollspy
//   main        children (hero) + all sections stacked, each with an
//               anchored h2
//   right rail  sibling links + "Try in a tool" + "Official docs" cards

import { useEffect, useState } from 'react';

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

export default function ClassicReferenceLayout({ siblings, siblingsTitle, sections, rail, children }) {
  const [activeId, setActiveId] = useState(sections.length > 0 ? sections[0].id : null);

  // Scrollspy: highlight the nav entry of the section nearest the top.
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(`ref-sec-${s.id}`))
      .filter(Boolean);
    if (els.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id.replace(/^ref-sec-/, ''));
        }
      },
      { rootMargin: '0px 0px -60% 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const jump = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(`ref-sec-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  };

  const siblingItems = (siblings || []).map((s) => ({
    name: s.title,
    href: s.href,
    meta: null,
  }));

  const railItems = rail || {};

  return (
    <div className="ref-grid">
      <aside className="rail-l">
        <div className="rail-hdr">On this page</div>
        <nav className="section-nav">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#ref-sec-${s.id}`}
              className={activeId === s.id ? 'on' : ''}
              onClick={(e) => jump(e, s.id)}
            >
              {s.label}
              {typeof s.count === 'number' && <span className="n">{s.count}</span>}
            </a>
          ))}
        </nav>
      </aside>

      <main className="ref-main">
        {children}
        {sections.map((s) => (
          <section key={s.id} id={`ref-sec-${s.id}`} className="ref-section">
            <h2>{s.label}</h2>
            {s.content}
          </section>
        ))}
      </main>

      <aside className="rail-r">
        <RailCard heading={siblingsTitle} items={siblingItems} />
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
        .section-nav { display: flex; flex-direction: column; gap: 3px; }
        .section-nav a { display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #334155; text-decoration: none; padding: 5px 8px; border-left: 2px solid transparent; border-radius: 0 3px 3px 0; }
        .section-nav a.on { color: #1B50EE; font-weight: 700; border-left-color: #1B50EE; background: #f2f6fd; }
        .section-nav a:hover { color: #1B50EE; background: #f8fafd; }
        .section-nav .n { font-family: ui-monospace, Menlo, monospace; font-size: 10px; font-weight: 700; color: #64748b; background: #eef2f7; padding: 1px 5px; border-radius: 3px; }
        .section-nav a.on .n { color: #1B50EE; background: #E8EEFB; }
        .ref-main { min-width: 0; }
        .ref-section { margin-bottom: 36px; scroll-margin-top: 80px; }
        .ref-section h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px; letter-spacing: -0.01em; }
        @media (max-width: 1100px) {
          .ref-grid { grid-template-columns: 1fr; }
          .rail-l, .rail-r { position: static; max-height: none; border-right: none; padding-right: 0; }
        }
      `}</style>
    </div>
  );
}
