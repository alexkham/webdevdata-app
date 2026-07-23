// WorkspaceLayout.jsx  ──  v1
// ─────────────────────────────────────────────────────────────
// The C2 workspace pattern. Different structural pattern from
// ClassicLayout — the tool is not one thing, it's a set of
// operations that share an input.
//
// Structure:
//   ├── dark icon dock  — sibling tools (other tools on the site),
//   │                     narrow by default with tooltips, expands
//   │                     via chevron
//   └── work area
//       ├── tab strip   — operations for THIS tool, grouped
//       ├── children    — the actual tool (owns the split panes,
//       │                 reads activeOp to decide what to render)
//       └── docs strip  — below-fold docs, scoped to activeOp
//
// Distinction:
//   - siblings   → dock items (Base64, Regex, etc.)
//   - operations → tab strip (Format, Tree, Validate…)
//   - activeOp   → controlled by page OR managed by frame.
//                  If both `activeOp` and `onOpChange` are provided,
//                  frame is controlled. Otherwise uncontrolled with
//                  `defaultOp` as initial value.
//
// The tool child gets `activeOp` via render-function children, or
// can read it from the DOM via a data attribute. Simplest interface
// is render-function children:
//
//   <WorkspaceLayout operations={ops}>
//     {({ activeOp }) => <MyTool op={activeOp} />}
//   </WorkspaceLayout>
//
// Both plain children and function children are supported.
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';

/* ── Icon generation (same helper as ClassicLayout, duplicated
      here per the "self-contained files" rule) ────────────── */
function generateIcon(category, slug) {
  const s = (slug || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (s.includes('tree'))                             return String.fromCharCode(0x2318);
  if (s.includes('sort'))                             return String.fromCharCode(0x2195);
  if (s.includes('diff'))                             return String.fromCharCode(0x0394);
  if (s.includes('valid'))                            return String.fromCharCode(0x2713);
  if (s.includes('minif'))                            return String.fromCharCode(0x2212);
  if (s.includes('base64'))                           return 'B64';
  if (s.includes('url'))                              return '%';
  if (s.includes('jwt'))                              return 'JWT';
  if (s.includes('regex'))                            return '.*';
  if (s.includes('uuid') || s.includes('ulid'))       return 'ID';
  if (s.includes('hash'))                             return '#';
  if (s.includes('timestamp') || s.includes('epoch')) return String.fromCharCode(0x23F1);
  if (s.startsWith('to-') || s.includes('-to-'))      return String.fromCharCode(0x2192);
  if (s.includes('json'))                             return '{ }';

  const byCategory = {
    json:      '{ }',
    encoder:   '%',
    decoder:   '%',
    formatter: String.fromCharCode(0x2261),
    generator: '#',
    converter: String.fromCharCode(0x2192),
  };
  return byCategory[c] || String.fromCharCode(0x00B7);
}

/* ── Component ──────────────────────────────────────────────── */
export default function WorkspaceLayout({
  initialSidebar = 'folded',
  slug,
  category,
  title,
  subtitle,
  breadcrumb = [],
  siblings = [],
  siblingGroups,
  operations = [],
  activeOp: activeOpProp,
  defaultOp,
  onOpChange,
  callout,
  sections = [],
  children,
  /* theme prop accepted for API symmetry; workspace is always dark-ish */
  theme,
}) {
  const [dockExpanded, setDockExpanded] = useState(initialSidebar === 'expanded');
  const [internalOp, setInternalOp] = useState(
    defaultOp || (operations[0] ? operations[0].id : null)
  );
  const [activeSection, setActiveSection] = useState(
    sections.length ? sections[0].id : null
  );

  const manuallyToggled = useRef(false);
  const toolRef         = useRef(null);
  const sectionRefs     = useRef({});

  /* Controlled vs uncontrolled operation state */
  const isControlled = activeOpProp !== undefined;
  const activeOp     = isControlled ? activeOpProp : internalOp;
  const handleOpChange = (opId) => {
    if (!isControlled) setInternalOp(opId);
    if (onOpChange) onOpChange(opId);
  };

  /* Auto-observer: dock only auto-changes if user hasn't touched it. */
  useEffect(() => {
    if (!toolRef.current) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (manuallyToggled.current) return;
        entries.forEach((e) => setDockExpanded(false));
      },
      { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
    );
    obs.observe(toolRef.current);
    return () => obs.disconnect();
  }, []);

  /* TOC active-section observer */
  useEffect(() => {
    if (!sections.length) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.1, rootMargin: '-80px 0px -60% 0px' }
    );
    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  const toggleChevron = () => {
    manuallyToggled.current = true;
    setDockExpanded((d) => !d);
  };

  /* Group operations by their `group` field for the tab strip. */
  const opsByGroup = operations.reduce((acc, op) => {
    const g = op.group || 'Actions';
    if (!acc[g]) acc[g] = [];
    acc[g].push(op);
    return acc;
  }, {});
  const opGroupNames = Object.keys(opsByGroup);

  /* Siblings for the dock */
  const dockGroups = (siblingGroups && siblingGroups.length)
    ? siblingGroups
    : (siblings.length ? [{ heading: category, items: siblings }] : []);

  /* Support both plain children and render-function children. */
  const renderedChildren = typeof children === 'function'
    ? children({ activeOp, setActiveOp: handleOpChange })
    : children;

  const activeOpMeta = operations.find((o) => o.id === activeOp) || {};

  return (
    <div className="workspace">

      <a href="#tool-region" className="skip-link">Skip to tool</a>

      <div className={`shell ${dockExpanded ? 'dock-open' : 'dock-closed'}`}>

        {dockGroups.length > 0 && (
          <aside className="dock" aria-label="Other tools">

            <div className="dock-toggle-row">
              <span className="dock-brand">webdev<span className="accent">data</span></span>
              <button
                type="button"
                className="dock-chev"
                onClick={toggleChevron}
                aria-label={dockExpanded ? 'Collapse dock' : 'Expand dock'}
                aria-expanded={dockExpanded}
                title={dockExpanded ? 'Collapse dock' : 'Expand dock'}
              >&lsaquo;</button>
            </div>

            {dockGroups.map((g, gi) => (
              <div className="dock-group" key={gi}>
                {g.heading && <div className="dock-head">{g.heading}</div>}
                {g.items.map((it) => (
                  <a
                    key={it.slug || it.href}
                    href={it.href}
                    className={`d-item ${it.active ? 'active' : ''}`}
                  >
                    <span className="icon" aria-hidden="true">
                      {generateIcon(it.category || category, it.slug)}
                    </span>
                    <span className="lbl">{it.title}</span>
                    {it.blurb && (
                      <span className="tt">
                        <b>{it.title}</b>{it.blurb}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            ))}
          </aside>
        )}

        <div className="work">

          {(breadcrumb.length > 0 || title) && (
            <div className="work-head">
              {breadcrumb.length > 0 && (
                <nav className="breadcrumb" aria-label="Breadcrumb">
                  {breadcrumb.map((c, i) => (
                    <span key={i} className="crumb">
                      {i > 0 && <span className="sep">/</span>}
                      {c.href
                        ? <a href={c.href}>{c.label}</a>
                        : <span className="current">{c.label}</span>}
                    </span>
                  ))}
                </nav>
              )}
              {title && (
                <div className="page-head">
                  <h1>{title}</h1>
                  {subtitle && <p className="sub">{subtitle}</p>}
                </div>
              )}
              {callout && (
                <div className="callout">
                  {callout.text}
                  {callout.jumpTo && (
                    <>
                      {' '}
                      <a className="jump" href={`#${callout.jumpTo}`}>
                        {callout.jumpLabel || 'Docs \u2193'}
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {operations.length > 0 && (
            <div className="tab-strip" role="tablist" aria-label="Operations">
              {opGroupNames.map((gname, gi) => (
                <span key={gname}>
                  <span className="tab divider">{gname}</span>
                  {opsByGroup[gname].map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      role="tab"
                      aria-selected={activeOp === op.id}
                      className={`tab ${activeOp === op.id ? 'active' : ''}`}
                      onClick={() => handleOpChange(op.id)}
                    >
                      {op.symbol && <span className="sym">{op.symbol}</span>}
                      {op.label}
                    </button>
                  ))}
                </span>
              ))}
            </div>
          )}

          <div className="tool-region" id="tool-region" ref={toolRef}>
            {renderedChildren}
          </div>

          {sections.length > 0 && (
            <div className="docs-strip">

              <div className="docs-header">
                <h2>{title || 'Documentation'}</h2>
                {activeOpMeta.label && (
                  <span className="active-op-badge">{activeOpMeta.label}</span>
                )}
                <span className="docs-sub">Docs scoped to the active operation.</span>
              </div>

              <div className="docs-body">
                <aside className="toc-rail" aria-label="On this operation">
                  <div className="toc-head">On this op</div>
                  <nav className="toc-list">
                    {sections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={activeSection === s.id ? 'active' : ''}
                      >{s.title}</a>
                    ))}
                  </nav>
                </aside>

                <div className="doc-content-col">
                  {sections.map((s) => (
                    <section
                      key={s.id}
                      id={s.id}
                      ref={(el) => { sectionRefs.current[s.id] = el; }}
                      className={`doc doc-${s.kind || 'prose'}`}
                    >
                      <h3>{s.title}</h3>
                      <div className="doc-content">{s.content}</div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* ── Theme tokens ───────────────────────────────────── */
        .workspace {
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.55;
          color: #18181b;
          background: #fff;
          -webkit-font-smoothing: antialiased;

          --bg: #ffffff;
          --surface: #ffffff;
          --surface-alt: #fafafa;
          --surface-code: #f4f4f5;
          --text: #18181b;
          --text-strong: #09090b;
          --text-muted: #52525b;
          --text-subtle: #71717a;
          --border: #e4e4e7;
          --border-strong: #d4d4d8;
          --primary: #4D4DFF;
          --primary-hover: #3838cc;
          --primary-bg: #eef0ff;

          --dock-bg: #1a1a20;
          --dock-fg: #a1a1aa;
          --dock-fg-strong: #ffffff;

          --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
          --dock-w-open: 240px;
          --dock-w-closed: 56px;
        }

        .skip-link {
          position: absolute;
          left: -9999px;
          top: 8px;
          padding: 8px 12px;
          background: var(--primary);
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
          z-index: 100;
        }
        .skip-link:focus { left: 8px; }

        .shell {
          display: grid;
          grid-template-columns: var(--dock-w-closed) minmax(0, 1fr);
          min-height: 100vh;
          transition: grid-template-columns 0.22s ease;
        }
        .shell.dock-open {
          grid-template-columns: var(--dock-w-open) minmax(0, 1fr);
        }
        @media (max-width: 780px) {
          .shell, .shell.dock-open { grid-template-columns: 1fr; }
          .dock { display: none; }
        }

        /* ── Dock ───────────────────────────────────────────── */
        .dock {
          background: var(--dock-bg);
          color: var(--dock-fg);
          padding: 8px 4px;
          overflow-y: auto;
          overflow-x: hidden;
          transition: padding 0.22s;
          position: sticky;
          top: 0;
          height: 100vh;
        }
        .shell.dock-open .dock { padding: 8px 8px; }

        .dock-toggle-row {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 0 12px;
        }
        .shell.dock-open .dock-toggle-row {
          justify-content: space-between;
          padding: 4px 8px 12px;
        }
        .dock-brand {
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          display: none;
          letter-spacing: -0.005em;
        }
        .dock-brand .accent { color: #7c7cff; }
        .shell.dock-open .dock-brand { display: block; }

        .dock-chev {
          width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          border-radius: 6px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 0;
          transition: transform 0.2s;
        }
        .dock-chev:hover {
          border-color: rgba(255,255,255,0.35);
          color: #fff;
        }
        .dock-chev:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .shell.dock-open .dock-chev { transform: scaleX(-1); }

        .dock-group + .dock-group {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .dock-head {
          padding: 8px 12px 6px;
          color: rgba(255,255,255,0.4);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: none;
        }
        .shell.dock-open .dock-head { display: block; }

        .d-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          justify-content: center;
          border-radius: 6px;
          color: var(--dock-fg);
          font-size: 13px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-decoration: none;
        }
        .shell.dock-open .d-item {
          justify-content: flex-start;
          padding: 8px 10px;
        }
        .d-item .icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.06);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: rgba(255,255,255,0.75);
          flex-shrink: 0;
        }
        .d-item .lbl { display: none; }
        .shell.dock-open .d-item .lbl { display: inline; }
        .d-item:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        .d-item:hover .icon {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        .d-item.active { color: #fff; }
        .d-item.active .icon {
          background: var(--primary);
          color: #fff;
        }

        /* Tooltip: only when dock is closed and viewport ≥ 900px */
        .d-item .tt {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: #000;
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          min-width: 200px;
          max-width: 260px;
          font-size: 12px;
          line-height: 1.5;
          margin-left: 10px;
          z-index: 40;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          opacity: 0;
          pointer-events: none;
          white-space: normal;
          font-weight: 400;
          transition: opacity 0.12s;
          display: none;
        }
        .d-item .tt b {
          display: block;
          font-weight: 700;
          margin-bottom: 2px;
          color: #fff;
          font-size: 12.5px;
        }
        .d-item .tt::before {
          content: "";
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #000;
        }
        @media (min-width: 900px) {
          .shell.dock-closed .d-item .tt { display: block; }
          .shell.dock-closed .d-item:hover .tt,
          .shell.dock-closed .d-item:focus-visible .tt {
            opacity: 1;
          }
        }

        /* ── Work area ──────────────────────────────────────── */
        .work {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .work-head {
          padding: 20px 24px 16px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-subtle);
          font-size: 12.5px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .crumb { display: inline-flex; align-items: center; gap: 6px; }
        .breadcrumb a { color: var(--text-subtle); text-decoration: none; }
        .breadcrumb a:hover { color: var(--primary); }
        .breadcrumb .sep { color: var(--border-strong); }
        .breadcrumb .current { color: var(--text); font-weight: 500; }

        .page-head { margin-bottom: 10px; }
        .page-head h1 {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-strong);
          letter-spacing: -0.01em;
          line-height: 1.2;
          margin: 0;
        }
        .page-head .sub {
          color: var(--text-muted);
          font-size: 13px;
          margin: 4px 0 0;
        }

        .callout {
          background: var(--primary-bg);
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
          line-height: 1.5;
          color: var(--text);
        }
        .callout .jump {
          color: var(--primary);
          font-weight: 600;
          text-decoration: underline;
          white-space: nowrap;
          margin-left: 4px;
        }

        /* ── Tab strip ──────────────────────────────────────── */
        .tab-strip {
          background: var(--surface-alt);
          border-bottom: 1px solid var(--border);
          padding: 6px 12px 0;
          display: flex;
          gap: 2px;
          overflow-x: auto;
          flex-shrink: 0;
        }
        .tab-strip > span { display: contents; }
        .tab {
          padding: 8px 14px;
          font-size: 13px;
          color: var(--text-muted);
          border: 1px solid transparent;
          border-bottom: none;
          border-radius: 6px 6px 0 0;
          cursor: pointer;
          background: transparent;
          font-family: inherit;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          margin-bottom: -1px;
        }
        .tab .sym {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-subtle);
        }
        .tab:hover {
          color: var(--text-strong);
          background: rgba(255,255,255,0.5);
        }
        .tab.active {
          background: #fff;
          border-color: var(--border);
          color: var(--primary);
          font-weight: 600;
        }
        .tab.active .sym { color: var(--primary); }
        .tab.divider {
          padding: 8px 4px 8px 8px;
          color: var(--text-subtle);
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: default;
          font-weight: 600;
          pointer-events: none;
        }

        /* ── Tool region ────────────────────────────────────── */
        .tool-region {
          background: #fff;
        }

        /* ── Docs strip ─────────────────────────────────────── */
        .docs-strip {
          background: var(--surface);
          border-top: 2px solid var(--border);
          padding: 24px 24px 60px;
        }
        .docs-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .docs-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-strong);
          letter-spacing: -0.01em;
          margin: 0;
        }
        .active-op-badge {
          font-family: var(--font-mono);
          font-size: 12px;
          background: var(--primary-bg);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        .docs-sub {
          color: var(--text-muted);
          font-size: 13px;
          margin-left: auto;
        }

        .docs-body {
          display: grid;
          grid-template-columns: 200px minmax(0, 1fr);
          gap: 40px;
        }
        @media (max-width: 900px) {
          .docs-body { grid-template-columns: 1fr; }
          .toc-rail { display: none; }
        }
        .toc-rail {
          position: sticky;
          top: 24px;
          align-self: start;
        }
        .toc-head {
          color: var(--text-subtle);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px 10px;
        }
        .toc-list { display: flex; flex-direction: column; }
        .toc-list a {
          display: flex;
          align-items: center;
          padding: 5px 10px;
          color: var(--text-muted);
          font-size: 13px;
          border-left: 2px solid transparent;
          text-decoration: none;
        }
        .toc-list a:hover { color: var(--primary); }
        .toc-list a.active {
          color: var(--primary);
          border-left-color: var(--primary);
          background: var(--primary-bg);
          font-weight: 600;
        }

        .doc {
          padding: 14px 0 12px;
          scroll-margin-top: 20px;
          max-width: 720px;
        }
        .doc + .doc {
          border-top: 1px solid var(--border);
          margin-top: 20px;
        }
        .doc h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-strong);
          letter-spacing: -0.01em;
          margin: 0 0 10px;
        }
        .doc-content { color: var(--text); }
        .doc-content :global(p) {
          color: var(--text-muted);
          margin: 0 0 12px;
          font-size: 14px;
          line-height: 1.65;
        }
        .doc-content :global(ul),
        .doc-content :global(ol) {
          margin: 6px 0 14px 20px;
          color: var(--text-muted);
          font-size: 14px;
        }
        .doc-content :global(li) {
          margin-bottom: 4px;
          line-height: 1.6;
        }
        .doc-content :global(code) {
          background: var(--surface-code);
          padding: 1px 6px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--primary);
        }
        .doc-content :global(strong) { color: var(--text-strong); }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Mock data + Demo wrapper for standalone view.
   ══════════════════════════════════════════════════════════════ */

const MOCK_SIBLINGS = [
  { slug: 'json-workspace', title: 'JSON',    blurb: 'Format, tree, validate, minify & convert JSON.', href: '/json-workspace', active: true, category: 'json' },
  { slug: 'base64',         title: 'Base64',  blurb: 'Encode / decode strings & binary.',              href: '/base64',           category: 'encoder' },
  { slug: 'url-encoder',    title: 'URL',     blurb: 'Percent-encode / decode URL components.',        href: '/url-encoder',      category: 'encoder' },
  { slug: 'jwt-decoder',    title: 'JWT',     blurb: 'Inspect JSON Web Token header & payload.',       href: '/jwt-decoder',      category: 'encoder' },
  { slug: 'sql-formatter',  title: 'SQL',     blurb: 'Beautify SQL across dialects.',                  href: '/sql-formatter',    category: 'formatter' },
  { slug: 'xml-formatter',  title: 'XML',     blurb: 'Format & validate XML.',                         href: '/xml-formatter',    category: 'formatter' },
  { slug: 'uuid',           title: 'UUID',    blurb: 'Bulk-generate unique identifiers.',              href: '/uuid',             category: 'generator' },
  { slug: 'hash',           title: 'Hash',    blurb: 'MD5, SHA-1, SHA-256, SHA-512.',                  href: '/hash',             category: 'generator' },
];

const MOCK_OPERATIONS = [
  { id: 'format',   label: 'Format',     group: 'Read' },
  { id: 'tree',     label: 'Tree',       group: 'Read' },
  { id: 'validate', label: 'Validate',   group: 'Read' },
  { id: 'minify',   label: 'Minify',     group: 'Transform' },
  { id: 'sort',     label: 'Sort keys',  group: 'Transform' },
  { id: 'diff',     label: 'Diff',       group: 'Transform' },
  { id: 'to-js',    label: 'JavaScript', group: 'Convert to' },
  { id: 'to-yaml',  label: 'YAML',       group: 'Convert to' },
  { id: 'to-xml',   label: 'XML',        group: 'Convert to' },
];

const MOCK_SECTIONS = [
  { id: 'what',      title: 'What this op does',
    content: <p>Parses the input and re-emits it with configurable indentation. Under the hood: <code>JSON.stringify(JSON.parse(input), null, 2)</code>, with a lenient pre-parser that repairs common malformations.</p> },
  { id: 'shortcuts', title: 'Shortcuts',
    content: <p><code>&#8984;K</code> focuses input. <code>&#8984;&#9166;</code> runs the active op. <code>&#8984;]</code> / <code>&#8984;[</code> jump between tabs. Your input persists across every tab.</p> },
  { id: 'faq',       title: 'FAQ',
    content: (
      <>
        <p><strong>Does my input persist when I switch tabs?</strong> Yes. The input pane is shared across every operation.</p>
        <p><strong>Does anything get sent to a server?</strong> No. Every operation runs in your browser.</p>
      </>
    ) },
];

const MOCK_PROPS = {
  slug: 'json-workspace',
  category: 'json',
  title: 'JSON Workspace',
  subtitle: 'One input, every JSON operation.',
  breadcrumb: [
    { href: '/tools',      label: 'Tools' },
    { href: '/tools/json', label: 'JSON' },
    {                      label: 'Workspace' },
  ],
  siblings: MOCK_SIBLINGS,
  operations: MOCK_OPERATIONS,
  callout: {
    text: (
      <>
        <strong>Paste JSON once, tab through every operation.</strong> Input persists; only the output changes.
      </>
    ),
    jumpTo: 'what',
    jumpLabel: 'Docs \u2193',
  },
  sections: MOCK_SECTIONS,
};

/* Mock tool: receives activeOp via render-function children.
   Shows the shared-input / swappable-output pattern. */
function MockWorkspaceTool({ op }) {
  const opLabel = op ? op.charAt(0).toUpperCase() + op.slice(1) : 'Format';

  return (
    <div className="mock-workspace">
      <div className="pane-wrap">
        <div className="pane-head">
          <span>Input &middot; shared</span>
          <span className="status">&#10003; Valid JSON &middot; 2 keys</span>
        </div>
        <textarea
          className="pane"
          spellCheck="false"
          defaultValue={`{"user":{"name":"Alex","roles":["admin","editor"],"active":true},"meta":{"version":2,"cached":false}}`}
        />
      </div>

      <div className="pane-wrap">
        <div className="pane-head">
          <span>Output</span>
          <span className="op-badge">{opLabel.toUpperCase()}</span>
        </div>
        <pre className="pane">{`{
  "user": {
    "name": "Alex",
    "roles": [
      "admin",
      "editor"
    ],
    "active": true
  },
  "meta": {
    "version": 2,
    "cached": false
  }
}`}</pre>
      </div>

      <style jsx>{`
        .mock-workspace {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 420px;
          background: #fff;
        }
        @media (max-width: 800px) {
          .mock-workspace {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
          }
        }
        .pane-wrap {
          display: flex;
          flex-direction: column;
          min-width: 0;
          border-right: 1px solid #e4e4e7;
        }
        .pane-wrap:last-child { border-right: none; }
        @media (max-width: 800px) {
          .pane-wrap {
            border-right: none;
            border-bottom: 1px solid #e4e4e7;
          }
          .pane-wrap:last-child { border-bottom: none; }
        }
        .pane-head {
          padding: 8px 14px;
          background: #fafafa;
          border-bottom: 1px solid #e4e4e7;
          font-size: 11.5px;
          color: #71717a;
          font-family: ui-monospace, Menlo, monospace;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .status {
          color: #4D4DFF;
          font-family: ui-monospace, Menlo, monospace;
          text-transform: none;
          letter-spacing: 0;
          font-size: 12px;
        }
        .op-badge {
          background: #4D4DFF;
          color: #fff;
          padding: 2px 8px;
          border-radius: 3px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 10.5px;
          text-transform: none;
          letter-spacing: 0;
          font-weight: 600;
        }
        .pane {
          flex: 1;
          padding: 14px 16px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12.5px;
          line-height: 1.65;
          color: #18181b;
          background: #fff;
          white-space: pre;
          overflow: auto;
          border: none;
          outline: none;
          resize: none;
          width: 100%;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

/* Standalone demo. */
export function Demo() {
  return (
    <WorkspaceLayout {...MOCK_PROPS}>
      {({ activeOp }) => <MockWorkspaceTool op={activeOp} />}
    </WorkspaceLayout>
  );
}