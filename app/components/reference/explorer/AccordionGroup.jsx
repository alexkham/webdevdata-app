// app/components/reference/explorer/AccordionGroup.jsx
//
// Category-grouped accordion for the explorer. Open/closed state lives
// here; `forceOpen` (e.g. while searching) overrides it without losing it.

import { useState } from 'react';

export default function AccordionGroup({
  catLabel,
  title,
  count,
  liveCount,
  blurb,
  defaultOpen = false,
  forceOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = forceOpen || open;

  return (
    <div className={`group ${isOpen ? 'open' : ''}`}>
      <button type="button" className="group-hdr" onClick={() => setOpen(!open)} aria-expanded={isOpen}>
        <div className="group-title">
          <span className="cat">{catLabel}</span> <span>{title}</span>
        </div>
        <div className="group-meta">
          <span><b>{count}</b> functions</span>
          {typeof liveCount === 'number' && <span><b>{liveCount}</b> live</span>}
          <span className="chev" />
        </div>
      </button>
      {isOpen && (
        <div className="group-body">
          {blurb && <p className="group-blurb">{blurb}</p>}
          <div className="cards">{children}</div>
        </div>
      )}
      <style jsx>{`
        .group { margin-bottom: 10px; border: 1px solid #e4e4e7; border-radius: 6px; overflow: hidden; }
        .group.open { border-color: #C8D4F6; }
        .group-hdr { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #ffffff; cursor: pointer; border: none; border-left: 3px solid transparent; transition: background 0.12s, border-color 0.12s; }
        .group.open .group-hdr { background: #f2f6fd; border-left-color: #1B50EE; }
        .group-hdr:hover { background: #f8fafd; }
        .group-title { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; color: #0f172a; }
        .group-title .cat { font-size: 10.5px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; }
        .group.open .group-title .cat { color: #1B50EE; }
        .group-meta { display: flex; align-items: center; gap: 12px; font-size: 11.5px; color: #64748b; font-family: ui-monospace, Menlo, monospace; }
        .group-meta b { color: #1B50EE; font-weight: 700; }
        .chev { width: 12px; height: 12px; border-right: 2px solid #94a3b8; border-bottom: 2px solid #94a3b8; transform: rotate(-45deg); transition: transform 0.15s; }
        .group.open .chev { transform: rotate(45deg); border-color: #1B50EE; }
        .group-body { padding: 12px 16px 16px; border-top: 1px solid #f1f5f9; background: #fafbfc; }
        .group-blurb { color: #475569; font-size: 12.5px; margin: 0 0 12px; line-height: 1.55; max-width: 640px; }
        .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        @media (max-width: 720px) {
          .cards { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
