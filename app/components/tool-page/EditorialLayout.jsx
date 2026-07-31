// // EditorialLayout.jsx  ──  v1
// // ─────────────────────────────────────────────────────────────
// // The C1 editorial pattern. Deliberately spare above the fold.
// //
// // Structure:
// //   centered article (~1000px)
// //     ├── breadcrumb
// //     ├── kicker + serif H1 + serif deck
// //     ├── horizontal sibling pill strip
// //     ├── lede callout
// //     ├── tool (children, rendered vertically)
// //     └── below-fold: sticky TOC (left) + sections
// //
// //   PLUS a floating rail (fixed-position, off-screen by default)
// //   that slides in from the left when the tool scrolls out of view.
// //   Inverted vs. the other layouts: nothing left-of-content until
// //   the user leaves the tool.
// //
// // Editorial-specific:
// //   - Serif type in title and prose (warm palette)
// //   - No left rail above the fold
// //   - Sibling nav appears in TWO places:
// //       * horizontal pill strip above the tool (always visible)
// //       * floating rail on scroll past tool (icon-only + tooltips
// //         by default, expand-to-labels via chevron)
// //
// // `initialSidebar` prop controls the floating rail's expanded state
// // (icon-only vs. labeled), NOT its visibility. Visibility is driven
// // by the tool's viewport intersection.
// // ─────────────────────────────────────────────────────────────

// import { useState, useRef, useEffect } from 'react';

// /* ── Icon generation (same helper, duplicated per file-per-domain rule) ─ */
// function generateIcon(category, slug) {
//   const s = (slug || '').toLowerCase();
//   const c = (category || '').toLowerCase();

//   if (s.includes('tree'))                             return String.fromCharCode(0x2318);
//   if (s.includes('sort'))                             return String.fromCharCode(0x2195);
//   if (s.includes('diff'))                             return String.fromCharCode(0x0394);
//   if (s.includes('valid'))                            return String.fromCharCode(0x2713);
//   if (s.includes('minif'))                            return String.fromCharCode(0x2212);
//   if (s.includes('base64'))                           return 'B64';
//   if (s.includes('url'))                              return '%';
//   if (s.includes('jwt'))                              return 'JWT';
//   if (s.includes('regex'))                            return '.*';
//   if (s.includes('uuid') || s.includes('ulid'))       return 'ID';
//   if (s.includes('hash'))                             return '#';
//   if (s.includes('timestamp') || s.includes('epoch')) return String.fromCharCode(0x23F1);
//   if (s.startsWith('to-') || s.includes('-to-'))      return String.fromCharCode(0x2192);
//   if (s.includes('json'))                             return '{ }';

//   const byCategory = {
//     json:      '{ }',
//     encoder:   '%',
//     decoder:   '%',
//     formatter: String.fromCharCode(0x2261),
//     generator: '#',
//     converter: String.fromCharCode(0x2192),
//   };
//   return byCategory[c] || String.fromCharCode(0x00B7);
// }

// /* ── Component ──────────────────────────────────────────────── */
// export default function EditorialLayout({
//   initialSidebar = 'folded',
//   slug,
//   category,
//   title,
//   subtitle,
//   breadcrumb = [],
//   siblings = [],
//   callout,
//   sections = [],
//   children,
//   /* theme prop accepted for API symmetry; editorial uses its own warm palette */
//   theme,
// }) {
//   /* floating-rail visibility (from observer) and expanded-state (from user) */
//   const [railVisible, setRailVisible] = useState(false);
//   const [railExpanded, setRailExpanded] = useState(initialSidebar === 'expanded');
//   const [activeSection, setActiveSection] = useState(
//     sections.length ? sections[0].id : null
//   );

//   const manuallyToggled = useRef(false);
//   const toolRef         = useRef(null);
//   const sectionRefs     = useRef({});

//   /* Floating rail: appears when tool leaves viewport. */
//   useEffect(() => {
//     if (!toolRef.current) return;
//     if (typeof IntersectionObserver === 'undefined') return;

//     const obs = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           const inView = e.isIntersecting;
//           setRailVisible(!inView);
//           /* When tool comes back into view, collapse rail back to
//              its default (unless user has explicitly expanded it). */
//           if (inView && !manuallyToggled.current) {
//             setRailExpanded(initialSidebar === 'expanded');
//           }
//         });
//       },
//       { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
//     );
//     obs.observe(toolRef.current);
//     return () => obs.disconnect();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* TOC active-section observer */
//   useEffect(() => {
//     if (!sections.length) return;
//     if (typeof IntersectionObserver === 'undefined') return;

//     const obs = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) setActiveSection(e.target.id);
//         });
//       },
//       { threshold: 0.1, rootMargin: '-80px 0px -60% 0px' }
//     );
//     sections.forEach((s) => {
//       const el = sectionRefs.current[s.id];
//       if (el) obs.observe(el);
//     });
//     return () => obs.disconnect();
//   }, [sections]);

//   const toggleChevron = () => {
//     manuallyToggled.current = true;
//     setRailExpanded((e) => !e);
//   };

//   const hasBelowFold = sections && sections.length > 0;

//   return (
//     <div className="editorial">

//       <a href="#tool-region" className="skip-link">Skip to tool</a>

//       <article className="article">

//         {breadcrumb.length > 0 && (
//           <nav className="breadcrumb" aria-label="Breadcrumb">
//             {breadcrumb.map((c, i) => (
//               <span key={i} className="crumb">
//                 {i > 0 && <span className="sep">/</span>}
//                 {c.href
//                   ? <a href={c.href}>{c.label}</a>
//                   : <span className="current">{c.label}</span>}
//               </span>
//             ))}
//           </nav>
//         )}

//         {(category || title) && (
//           <>
//             {category && <div className="kicker">{category} &middot; Tool</div>}
//             {title && <h1 className="title">{title}</h1>}
//             {subtitle && <p className="deck">{subtitle}</p>}
//           </>
//         )}

//         {siblings.length > 0 && (
//           <nav className="sibling-strip" aria-label="Related tools">
//             <span className="strip-lbl">In this family:</span>
//             {siblings.map((it) => (
//               <a
//                 key={it.slug || it.href}
//                 href={it.href}
//                 className={`sib ${it.active ? 'active' : ''}`}
//               >
//                 <span className="sym" aria-hidden="true">
//                   {generateIcon(it.category || category, it.slug)}
//                 </span>
//                 {it.title}
//               </a>
//             ))}
//           </nav>
//         )}

//         {callout && (
//           <blockquote className="lede-callout">
//             {callout.text}
//             {callout.jumpTo && (
//               <>
//                 <br />
//                 <a className="jump" href={`#${callout.jumpTo}`}>
//                   {callout.jumpLabel || 'Read the walk-through \u2193'}
//                 </a>
//               </>
//             )}
//           </blockquote>
//         )}

//         <div className="tool-region" id="tool-region" ref={toolRef}>
//           {children}
//         </div>

//         {hasBelowFold && (
//           <div className="below-fold">

//             <aside className="toc-rail" aria-label="Sections">
//               <div className="toc-head">Sections</div>
//               <nav className="toc-list">
//                 {sections.map((s) => (
//                   <a
//                     key={s.id}
//                     href={`#${s.id}`}
//                     className={activeSection === s.id ? 'active' : ''}
//                   >{s.title}</a>
//                 ))}
//               </nav>
//             </aside>

//             <div className="doc-body">
//               {sections.map((s) => (
//                 <section
//                   key={s.id}
//                   id={s.id}
//                   ref={(el) => { sectionRefs.current[s.id] = el; }}
//                   className={`piece piece-${s.kind || 'prose'}`}
//                 >
//                   <h2>{s.title}</h2>
//                   <div className="doc-content">{s.content}</div>
//                 </section>
//               ))}
//             </div>

//           </div>
//         )}
//       </article>

//       {siblings.length > 0 && (
//         <aside
//           className={`float-rail ${railVisible ? 'visible' : ''} ${railExpanded ? 'expanded' : 'collapsed'}`}
//           aria-label="Related tools"
//           aria-hidden={!railVisible}
//         >
//           <div className="fr-head">
//             <span className="fr-title">
//               {category ? `${category} tools` : 'Related'}
//             </span>
//             <button
//               type="button"
//               className="fr-chev"
//               onClick={toggleChevron}
//               aria-label={railExpanded ? 'Collapse rail' : 'Expand rail'}
//               aria-expanded={railExpanded}
//               title={railExpanded ? 'Collapse rail' : 'Expand rail'}
//               tabIndex={railVisible ? 0 : -1}
//             >&lsaquo;</button>
//           </div>

//           <nav>
//             {siblings.map((it) => (
//               <a
//                 key={it.slug || it.href}
//                 href={it.href}
//                 className={`fr-item ${it.active ? 'active' : ''}`}
//                 tabIndex={railVisible ? 0 : -1}
//               >
//                 <span className="sym" aria-hidden="true">
//                   {generateIcon(it.category || category, it.slug)}
//                 </span>
//                 <span className="lbl">{it.title}</span>
//                 {it.blurb && (
//                   <span className="tt">
//                     <b>{it.title}</b>{it.blurb}
//                   </span>
//                 )}
//               </a>
//             ))}
//           </nav>
//         </aside>
//       )}

//       <style jsx>{`
//         /* ── Editorial palette (warm, distinct from Classic) ─ */
//         .editorial {
//           min-height: 100vh;
//           background: var(--bg);
//           color: var(--text);
//           -webkit-font-smoothing: antialiased;

//           --bg: #fbfaf7;
//           --surface: #ffffff;
//           --surface-alt: #f5f4ef;
//           --surface-code: #eeece5;
//           --text: #1c1a17;
//           --text-strong: #09090b;
//           --text-muted: #52514c;
//           --text-subtle: #78766f;
//           --border: #e5e3dc;
//           --border-strong: #cfccc2;
//           --primary: #4D4DFF;
//           --primary-hover: #3838cc;
//           --primary-bg: #eef0ff;

//           --font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
//           --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
//           --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
//           --site-header-h: 52px;

//           font-family: var(--font-ui);
//           font-size: 16px;
//           line-height: 1.6;
//         }

//         .skip-link {
//           position: absolute;
//           left: -9999px;
//           top: 8px;
//           padding: 8px 12px;
//           background: var(--primary);
//           color: #fff;
//           text-decoration: none;
//           border-radius: 4px;
//           z-index: 100;
//         }
//         .skip-link:focus { left: 8px; }

//         /* ── Article (centered column) ──────────────────────── */
//         .article {
//           max-width: 1000px;
//           margin: 0 auto;
//           padding: 40px 32px 24px;
//         }
//         @media (max-width: 700px) {
//           .article { padding: 24px 20px 20px; }
//         }

//         .breadcrumb {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           color: var(--text-subtle);
//           font-size: 13px;
//           margin-bottom: 32px;
//           flex-wrap: wrap;
//         }
//         .crumb { display: inline-flex; align-items: center; gap: 6px; }
//         .breadcrumb a { color: var(--text-subtle); text-decoration: none; }
//         .breadcrumb a:hover { color: var(--primary); }
//         .breadcrumb .sep { color: var(--border-strong); }
//         .breadcrumb .current { color: var(--text); font-weight: 500; }

//         .kicker {
//           font-family: var(--font-ui);
//           font-size: 11.5px;
//           letter-spacing: 0.14em;
//           text-transform: uppercase;
//           color: var(--primary);
//           font-weight: 700;
//           margin-bottom: 12px;
//         }
//         .title {
//           font-family: var(--font-serif);
//           font-size: 48px;
//           font-weight: 700;
//           color: var(--text-strong);
//           letter-spacing: -0.02em;
//           line-height: 1.08;
//           margin: 0 0 14px;
//           max-width: 720px;
//         }
//         @media (max-width: 700px) {
//           .title { font-size: 34px; }
//         }
//         .deck {
//           font-family: var(--font-serif);
//           font-size: 21px;
//           line-height: 1.5;
//           color: var(--text-muted);
//           font-weight: 400;
//           font-style: italic;
//           max-width: 680px;
//           margin: 0 0 28px;
//         }

//         /* ── Sibling pill strip ─────────────────────────────── */
//         .sibling-strip {
//           display: flex;
//           gap: 4px;
//           margin-bottom: 36px;
//           overflow-x: auto;
//           padding-bottom: 6px;
//           border-bottom: 1px solid var(--border);
//           align-items: center;
//         }
//         .sibling-strip::-webkit-scrollbar { height: 3px; }
//         .sibling-strip::-webkit-scrollbar-thumb {
//           background: var(--border-strong);
//           border-radius: 999px;
//         }
//         .strip-lbl {
//           font-size: 11px;
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           color: var(--text-subtle);
//           font-weight: 600;
//           padding: 8px 8px 8px 0;
//           flex-shrink: 0;
//         }
//         .sib {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 8px 14px;
//           border-radius: 999px;
//           color: var(--text-muted);
//           font-size: 13.5px;
//           font-weight: 500;
//           flex-shrink: 0;
//           white-space: nowrap;
//           border: 1px solid transparent;
//           text-decoration: none;
//         }
//         .sib .sym {
//           font-family: var(--font-mono);
//           font-size: 11px;
//           color: var(--text-subtle);
//         }
//         .sib:hover {
//           background: var(--surface);
//           color: var(--text-strong);
//           border-color: var(--border);
//         }
//         .sib.active {
//           background: var(--text-strong);
//           color: #fff;
//           border-color: var(--text-strong);
//         }
//         .sib.active .sym { color: rgba(255,255,255,0.7); }

//         /* ── Lede callout ───────────────────────────────────── */
//         .lede-callout {
//           font-family: var(--font-serif);
//           font-size: 16.5px;
//           color: var(--text);
//           line-height: 1.6;
//           padding: 16px 20px;
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-left: 3px solid var(--primary);
//           border-radius: 4px;
//           margin: 0 0 32px;
//           max-width: 780px;
//         }
//         .lede-callout .jump {
//           display: inline-block;
//           margin-top: 6px;
//           font-family: var(--font-ui);
//           font-size: 13px;
//           color: var(--primary);
//           font-weight: 600;
//           font-style: normal;
//           text-decoration: none;
//         }
//         .lede-callout .jump:hover { color: var(--primary-hover); }

//         /* ── Tool region ────────────────────────────────────── */
//         .tool-region { margin-bottom: 40px; }

//         /* ── Below fold ─────────────────────────────────────── */
//         .below-fold {
//           display: grid;
//           grid-template-columns: 180px minmax(0, 1fr);
//           gap: 48px;
//           margin-top: 24px;
//           padding-top: 20px;
//           border-top: 1px solid var(--border);
//         }
//         @media (max-width: 900px) {
//           .below-fold { grid-template-columns: 1fr; gap: 20px; }
//           .toc-rail { display: none; }
//         }
//         .toc-rail {
//           position: sticky;
//           top: calc(var(--site-header-h) + 20px);
//           align-self: start;
//           padding: 4px 0;
//         }
//         .toc-head {
//           color: var(--text-subtle);
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           padding: 0 4px 12px;
//         }
//         .toc-list { display: flex; flex-direction: column; }
//         .toc-list a {
//           display: block;
//           padding: 5px 4px 5px 10px;
//           color: var(--text-muted);
//           font-size: 13px;
//           border-left: 2px solid transparent;
//           text-decoration: none;
//         }
//         .toc-list a:hover { color: var(--primary); }
//         .toc-list a.active {
//           color: var(--primary);
//           border-left-color: var(--primary);
//           font-weight: 600;
//         }

//         .piece {
//           padding: 24px 0 8px;
//           scroll-margin-top: calc(var(--site-header-h) + 20px);
//         }
//         .piece + .piece {
//           border-top: 1px solid var(--border);
//           margin-top: 20px;
//         }
//         .piece h2 {
//           font-family: var(--font-serif);
//           font-size: 28px;
//           font-weight: 700;
//           color: var(--text-strong);
//           letter-spacing: -0.015em;
//           margin: 0 0 14px;
//           line-height: 1.2;
//         }
//         .doc-content { max-width: 640px; }
//         /* Editorial prose uses the serif for prose too */
//         .doc-content :global(p) {
//           font-family: var(--font-serif);
//           color: #2c2a26;
//           margin: 0 0 14px;
//           font-size: 17px;
//           line-height: 1.65;
//         }
//         .doc-content :global(ul),
//         .doc-content :global(ol) {
//           font-family: var(--font-serif);
//           margin: 8px 0 16px 24px;
//           color: #2c2a26;
//           font-size: 17px;
//         }
//         .doc-content :global(li) {
//           margin-bottom: 6px;
//           line-height: 1.6;
//         }
//         .doc-content :global(code) {
//           font-family: var(--font-mono);
//           background: var(--surface-alt);
//           padding: 1px 6px;
//           border-radius: 4px;
//           font-size: 14.5px;
//           color: var(--primary);
//         }
//         .doc-content :global(strong) { color: var(--text-strong); }

//         /* ── Floating rail ──────────────────────────────────── */
//         .float-rail {
//           position: fixed;
//           left: 12px;
//           top: 50%;
//           transform: translateY(-50%) translateX(-140%);
//           background: #fff;
//           border: 1px solid var(--border);
//           border-radius: 14px;
//           box-shadow: 0 8px 30px rgba(15,23,42,0.08);
//           padding: 8px 6px;
//           width: 52px;
//           z-index: 25;
//           transition: transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1),
//                       width 0.22s ease;
//         }
//         .float-rail.visible {
//           transform: translateY(-50%) translateX(0);
//         }
//         .float-rail.expanded { width: 232px; }

//         @media (max-width: 900px) {
//           .float-rail { display: none; }
//         }

//         .fr-head {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 4px 8px 8px;
//           border-bottom: 1px solid var(--border);
//           margin-bottom: 6px;
//         }
//         .fr-title {
//           font-size: 10.5px;
//           color: var(--text-subtle);
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.09em;
//           display: none;
//         }
//         .float-rail.expanded .fr-title { display: block; }

//         .fr-chev {
//           width: 24px;
//           height: 24px;
//           background: var(--surface-alt);
//           border: 1px solid var(--border);
//           border-radius: 6px;
//           color: var(--text-muted);
//           cursor: pointer;
//           font-family: var(--font-mono);
//           font-size: 12px;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           padding: 0;
//           transition: transform 0.2s, border-color 0.15s;
//         }
//         .fr-chev:hover {
//           border-color: var(--primary);
//           color: var(--primary);
//         }
//         .fr-chev:focus-visible {
//           outline: 2px solid var(--primary);
//           outline-offset: 2px;
//         }
//         .float-rail.expanded .fr-chev { transform: scaleX(-1); }

//         .fr-item {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 7px 10px;
//           border-radius: 6px;
//           color: var(--text-muted);
//           font-size: 13px;
//           white-space: nowrap;
//           position: relative;
//           text-decoration: none;
//         }
//         .fr-item:hover {
//           background: var(--surface-alt);
//           color: var(--text-strong);
//         }
//         .fr-item.active {
//           background: var(--primary-bg);
//           color: var(--primary);
//           font-weight: 600;
//         }
//         .fr-item .sym {
//           font-family: var(--font-mono);
//           font-size: 11.5px;
//           color: var(--text-subtle);
//           width: 20px;
//           text-align: center;
//           flex-shrink: 0;
//         }
//         .fr-item.active .sym { color: var(--primary); }
//         .fr-item .lbl { display: none; }
//         .float-rail.expanded .fr-item .lbl { display: inline; }

//         .float-rail.collapsed .fr-item {
//           justify-content: center;
//           padding: 8px 0;
//           gap: 0;
//         }
//         .float-rail.collapsed .fr-item .sym {
//           width: auto;
//           font-size: 13px;
//         }

//         /* Tooltip only when collapsed */
//         .fr-item .tt {
//           position: absolute;
//           left: 100%;
//           top: 50%;
//           transform: translateY(-50%);
//           background: #18181b;
//           color: #fff;
//           padding: 8px 12px;
//           border-radius: 6px;
//           min-width: 200px;
//           max-width: 240px;
//           font-size: 12px;
//           line-height: 1.5;
//           margin-left: 12px;
//           z-index: 40;
//           box-shadow: 0 4px 14px rgba(0,0,0,0.18);
//           opacity: 0;
//           pointer-events: none;
//           white-space: normal;
//           font-weight: 400;
//           font-family: var(--font-ui);
//           transition: opacity 0.12s ease;
//           display: none;
//         }
//         .fr-item .tt b {
//           display: block;
//           font-weight: 700;
//           font-size: 12.5px;
//           margin-bottom: 2px;
//           color: #fff;
//         }
//         .fr-item .tt::before {
//           content: "";
//           position: absolute;
//           right: 100%;
//           top: 50%;
//           transform: translateY(-50%);
//           border: 5px solid transparent;
//           border-right-color: #18181b;
//         }
//         .float-rail.collapsed .fr-item .tt { display: block; }
//         .float-rail.collapsed .fr-item:hover .tt,
//         .float-rail.collapsed .fr-item:focus-visible .tt {
//           opacity: 1;
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════════
//    Mock data + Demo wrapper for standalone view.
//    ══════════════════════════════════════════════════════════════ */

// const MOCK_SIBLINGS = [
//   { slug: 'json-formatter',     title: 'Formatter',     blurb: 'Parse, validate & indent JSON.',   href: '/json-formatter',     active: true, category: 'json' },
//   { slug: 'json-tree-viewer',   title: 'Tree Viewer',   blurb: 'Interactive collapsible tree.',    href: '/json-tree-viewer',                 category: 'json' },
//   { slug: 'json-validator',     title: 'Validator',     blurb: 'Check validity, pinpoint errors.', href: '/json-validator',                   category: 'json' },
//   { slug: 'json-minifier',      title: 'Minifier',      blurb: 'Collapse to a single line.',       href: '/json-minifier',                    category: 'json' },
//   { slug: 'json-diff',          title: 'Diff Checker',  blurb: 'Compare two JSON documents.',      href: '/json-diff',                        category: 'json' },
//   { slug: 'json-sort-keys',     title: 'Sort Keys',     blurb: 'Alphabetize keys recursively.',    href: '/json-sort-keys',                   category: 'json' },
//   { slug: 'json-to-javascript', title: 'To JavaScript', blurb: 'Convert to JS object literal.',    href: '/json-to-javascript',               category: 'json' },
//   { slug: 'json-to-yaml',       title: 'To YAML',       blurb: 'Convert JSON to YAML.',            href: '/json-to-yaml',                     category: 'json' },
// ];

// const MOCK_SECTIONS = [
//   {
//     id: 'how',
//     title: 'How to use this tool',
//     content: (
//       <>
//         <p>The Formatter accepts any JSON input, valid or malformed, and produces a clean, indented output. The interaction is deliberately spare: paste, glance at the status line, and copy. There is no signup, no cookie banner, and no server round-trip.</p>
//         <p>The input pane, above, is where you paste. The output pane, below, refreshes as you type &mdash; typically within about 120 milliseconds even for inputs in the tens of megabytes.</p>
//       </>
//     ),
//   },
//   {
//     id: 'accepts',
//     title: 'What the parser accepts',
//     content: (
//       <>
//         <p>Strict RFC 8259 JSON, of course. But the parser also repairs several common malformations before it gives up: single-quoted keys, unquoted keys, trailing commas, JSONP wrappers, and NDJSON streams are all handled silently.</p>
//       </>
//     ),
//   },
//   {
//     id: 'shortcuts',
//     title: 'Keyboard shortcuts',
//     content: (
//       <>
//         <p>Every button in the tool has a matching keystroke. The idea is that once you know the pattern, you never touch the mouse.</p>
//         <ul>
//           <li><code>&#8984;K</code> &mdash; focus the input pane.</li>
//           <li><code>&#8984;&#9166;</code> &mdash; format the current input.</li>
//           <li><code>&#8984;M</code> &mdash; minify to a single line.</li>
//           <li><code>&#8984;&#8679;C</code> &mdash; copy output to clipboard.</li>
//         </ul>
//       </>
//     ),
//   },
//   {
//     id: 'faq',
//     title: 'Frequently asked',
//     content: (
//       <>
//         <p><strong>Does my JSON get sent to a server?</strong> No. Every operation runs in your browser using native JavaScript.</p>
//         <p><strong>What&apos;s the maximum input size?</strong> Practically limited by your browser&apos;s memory. Inputs up to ~50 MB format smoothly on a modern laptop.</p>
//       </>
//     ),
//   },
// ];

// const MOCK_PROPS = {
//   slug: 'json-formatter',
//   category: 'JSON',
//   title: 'JSON Formatter',
//   subtitle: 'Format, validate, and inspect JSON. Everything client-side, sub-500 ms, deep-linkable.',
//   breadcrumb: [
//     { href: '/',            label: 'Home' },
//     { href: '/tools',       label: 'Tools' },
//     { href: '/tools/json',  label: 'JSON' },
//     {                       label: 'Formatter' },
//   ],
//   siblings: MOCK_SIBLINGS,
//   callout: {
//     text: (
//       <>
//         <strong>Paste JSON above, get formatted output below.</strong> Errors are highlighted with exact line and column. Every operation runs in your browser &mdash; nothing is uploaded.
//       </>
//     ),
//     jumpTo: 'how',
//     jumpLabel: 'Read the walk-through \u2193',
//   },
//   sections: MOCK_SECTIONS,
// };

// /* Vertical tool for the editorial layout. Input on top, transform
//    bar (with directional arrows) in the middle, output on the bottom. */
// function MockEditorialTool() {
//   return (
//     <div className="mock-vtool">

//       <div className="lbl">
//         <span>Input</span>
//         <span className="status">&#10003; Valid JSON &middot; 2 keys &middot; 187 bytes</span>
//       </div>
//       <textarea
//         className="pane"
//         spellCheck="false"
//         defaultValue={`{"user":{"name":"Alex","roles":["admin","editor"],"active":true},"meta":{"version":2}}`}
//       />

//       <div className="transform-bar">
//         <button>Format</button>
//         <button>Sort keys</button>
//         <button>Minify</button>
//         <button>Tree view</button>
//         <button className="primary">Copy output</button>
//       </div>

//       <div className="lbl">
//         <span>Output</span>
//         <span>2-space indent</span>
//       </div>
//       <pre className="pane">{`{
//   "user": {
//     "name": "Alex",
//     "roles": [
//       "admin",
//       "editor"
//     ],
//     "active": true
//   },
//   "meta": {
//     "version": 2
//   }
// }`}</pre>

//       <style jsx>{`
//         .mock-vtool {
//           background: #ffffff;
//           border: 1.5px solid #cfccc2;
//           border-radius: 12px;
//           overflow: hidden;
//           box-shadow: 0 4px 20px rgba(15,23,42,0.04);
//         }
//         .lbl {
//           padding: 8px 16px;
//           background: #f5f4ef;
//           border-bottom: 1px solid #e5e3dc;
//           font-size: 11px;
//           color: #78766f;
//           font-family: ui-monospace, Menlo, monospace;
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           display: flex;
//           justify-content: space-between;
//         }
//         .lbl .status {
//           color: #4D4DFF;
//           text-transform: none;
//           letter-spacing: 0;
//           font-size: 12px;
//         }
//         .pane {
//           padding: 16px 20px;
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 13px;
//           line-height: 1.7;
//           color: #1c1a17;
//           background: #fff;
//           white-space: pre;
//           overflow: auto;
//           border: none;
//           outline: none;
//           resize: none;
//           width: 100%;
//           min-height: 180px;
//           max-height: 300px;
//           margin: 0;
//           box-sizing: border-box;
//         }

//         .transform-bar {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 8px;
//           padding: 14px 16px;
//           background: #f5f4ef;
//           border-top: 1px solid #e5e3dc;
//           border-bottom: 1px solid #e5e3dc;
//           flex-wrap: wrap;
//           position: relative;
//         }
//         .transform-bar::before,
//         .transform-bar::after {
//           content: "\u2193";
//           position: absolute;
//           color: #4D4DFF;
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 18px;
//           font-weight: 700;
//         }
//         .transform-bar::before { left: 24px; }
//         .transform-bar::after  { right: 24px; }
//         @media (max-width: 600px) {
//           .transform-bar::before, .transform-bar::after { display: none; }
//         }

//         .transform-bar button {
//           background: #fff;
//           border: 1px solid #cfccc2;
//           color: #1c1a17;
//           padding: 6px 14px;
//           border-radius: 6px;
//           font-size: 13px;
//           cursor: pointer;
//           font-family: inherit;
//           font-weight: 500;
//         }
//         .transform-bar button:hover {
//           border-color: #4D4DFF;
//           color: #4D4DFF;
//         }
//         .transform-bar button.primary {
//           background: #4D4DFF;
//           border-color: #4D4DFF;
//           color: #fff;
//         }
//         .transform-bar button.primary:hover {
//           background: #3838cc;
//         }
//       `}</style>
//     </div>
//   );
// }

// /* Minimal site header for standalone view. */
// function MockSiteHeader() {
//   return (
//     <header className="mock-header">
//       <a href="/" className="mock-logo">webdev<span>data</span></a>
//       <nav className="mock-nav">
//         <a href="/tools" className="active">Tools</a>
//         <a href="/reference">Reference</a>
//         <a href="/learn">Learn</a>
//       </nav>

//       <style jsx>{`
//         .mock-header {
//           position: sticky;
//           top: 0;
//           z-index: 30;
//           background: rgba(251,250,247,0.94);
//           backdrop-filter: saturate(180%) blur(8px);
//           border-bottom: 1px solid #e5e3dc;
//           height: 52px;
//           display: flex;
//           align-items: center;
//           padding: 0 32px;
//           gap: 32px;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
//         }
//         .mock-logo {
//           font-weight: 700;
//           font-size: 16px;
//           color: #09090b;
//           font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
//           letter-spacing: -0.01em;
//           text-decoration: none;
//         }
//         .mock-logo span { color: #4D4DFF; }
//         .mock-nav { display: flex; gap: 22px; margin-left: 8px; }
//         .mock-nav a {
//           color: #52514c;
//           font-size: 14px;
//           font-weight: 500;
//           text-decoration: none;
//         }
//         .mock-nav a.active { color: #09090b; }
//         .mock-nav a:hover { color: #09090b; }
//       `}</style>
//     </header>
//   );
// }

// /* Standalone demo. */
// export function Demo() {
//   return (
//     <>
//       <MockSiteHeader />
//       <EditorialLayout {...MOCK_PROPS}>
//         <MockEditorialTool />
//       </EditorialLayout>
//     </>
//   );
// }


// EditorialLayout.jsx  ──  v1
// ─────────────────────────────────────────────────────────────
// The C1 editorial pattern. Deliberately spare above the fold.
//
// Structure:
//   centered article (~1000px)
//     ├── breadcrumb
//     ├── kicker + serif H1 + serif deck
//     ├── horizontal sibling pill strip
//     ├── lede callout
//     ├── tool (children, rendered vertically)
//     └── below-fold: sticky TOC (left) + sections
//
//   PLUS a floating rail (fixed-position, off-screen by default)
//   that slides in from the left when the tool scrolls out of view.
//   Inverted vs. the other layouts: nothing left-of-content until
//   the user leaves the tool.
//
// Editorial-specific:
//   - Serif type in title and prose (warm palette)
//   - No left rail above the fold
//   - Sibling nav appears in TWO places:
//       * horizontal pill strip above the tool (always visible)
//       * floating rail on scroll past tool (icon-only + tooltips
//         by default, expand-to-labels via chevron)
//
// `initialSidebar` prop controls the floating rail's expanded state
// (icon-only vs. labeled), NOT its visibility. Visibility is driven
// by the tool's viewport intersection.
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

/* ── Icon generation (same helper, duplicated per file-per-domain rule) ─ */
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
export default function EditorialLayout({
  initialSidebar = 'folded',
  slug,
  category,
  title,
  subtitle,
  breadcrumb = [],
  siblings = [],
  callout,
  sections = [],
  children,
  /* theme prop accepted for API symmetry; editorial uses its own warm palette */
  theme,
}) {
  /* floating-rail visibility (from observer) and expanded-state (from user) */
  const [railVisible, setRailVisible] = useState(false);
  const [railExpanded, setRailExpanded] = useState(initialSidebar === 'expanded');
  const [activeSection, setActiveSection] = useState(
    sections.length ? sections[0].id : null
  );

  const manuallyToggled = useRef(false);
  const toolRef         = useRef(null);
  const sectionRefs     = useRef({});

  /* Floating rail: appears when tool leaves viewport. */
  useEffect(() => {
    if (!toolRef.current) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const inView = e.isIntersecting;
          setRailVisible(!inView);
          /* When tool comes back into view, collapse rail back to
             its default (unless user has explicitly expanded it). */
          if (inView && !manuallyToggled.current) {
            setRailExpanded(initialSidebar === 'expanded');
          }
        });
      },
      { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
    );
    obs.observe(toolRef.current);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setRailExpanded((e) => !e);
  };

  const hasBelowFold = sections && sections.length > 0;

  return (
    <div className="editorial">

      <a href="#tool-region" className="skip-link">Skip to tool</a>

      <article className="article">

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

        {(category || title) && (
          <>
            {category && <div className="kicker">{category} &middot; Tool</div>}
            {title && <h1 className="title">{title}</h1>}
            {subtitle && <p className="deck">{subtitle}</p>}
          </>
        )}

        {siblings.length > 0 && (
          <nav className="sibling-strip" aria-label="Related tools">
            <span className="strip-lbl">In this family:</span>
            {siblings.map((it) => (
              <a
                key={it.slug || it.href}
                href={it.href}
                className={`sib ${it.active ? 'active' : ''}`}
              >
                <span className="sym" aria-hidden="true">
                  {generateIcon(it.category || category, it.slug)}
                </span>
                {it.title}
              </a>
            ))}
          </nav>
        )}

        {callout && (
          <blockquote className="lede-callout">
            {callout.text}
            {callout.jumpTo && (
              <>
                <br />
                <a className="jump" href={`#${callout.jumpTo}`}>
                  {callout.jumpLabel || 'Read the walk-through \u2193'}
                </a>
              </>
            )}
          </blockquote>
        )}

        <div className="tool-region" id="tool-region" ref={toolRef}>
          {children}
        </div>

        {hasBelowFold && (
          <div className="below-fold">

            <aside className="toc-rail" aria-label="Sections">
              <div className="toc-head">Sections</div>
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

            <div className="doc-body">
              {sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  ref={(el) => { sectionRefs.current[s.id] = el; }}
                  className={`piece piece-${s.kind || 'prose'}`}
                >
                  <h2>{s.title}</h2>
                  <div className="doc-content">{s.content}</div>
                </section>
              ))}
            </div>

          </div>
        )}
      </article>

      {siblings.length > 0 && (
        <aside
          className={`float-rail ${railVisible ? 'visible' : ''} ${railExpanded ? 'expanded' : 'collapsed'}`}
          aria-label="Related tools"
          aria-hidden={!railVisible}
        >
          <div className="fr-head">
            <span className="fr-title">
              {category ? `${category} tools` : 'Related'}
            </span>
            <button
              type="button"
              className="fr-chev"
              onClick={toggleChevron}
              aria-label={railExpanded ? 'Collapse rail' : 'Expand rail'}
              aria-expanded={railExpanded}
              title={railExpanded ? 'Collapse rail' : 'Expand rail'}
              tabIndex={railVisible ? 0 : -1}
            >&lsaquo;</button>
          </div>

          <nav>
            {siblings.map((it) => (
              <a
                key={it.slug || it.href}
                href={it.href}
                className={`fr-item ${it.active ? 'active' : ''}`}
                tabIndex={railVisible ? 0 : -1}
              >
                <span className="sym" aria-hidden="true">
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
          </nav>
        </aside>
      )}

      <style jsx>{`
        /* ── Editorial palette (warm, distinct from Classic) ─ */
        .editorial {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;

          --bg: #fbfaf7;
          --surface: #ffffff;
          --surface-alt: #f5f4ef;
          --surface-code: #eeece5;
          --text: #1c1a17;
          --text-strong: #09090b;
          --text-muted: #52514c;
          --text-subtle: #78766f;
          --border: #e5e3dc;
          --border-strong: #cfccc2;
          --primary: #4D4DFF;
          --primary-hover: #3838cc;
          --primary-bg: #eef0ff;

          --font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
          --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
          --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
          --site-header-h: 52px;

          font-family: var(--font-ui);
          font-size: 16px;
          line-height: 1.6;
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

        /* ── Article (centered column) ──────────────────────── */
        .article {
          padding: 40px 32px 24px;
        }
        @media (max-width: 700px) {
          .article { padding: 24px 20px 20px; }
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-subtle);
          font-size: 13px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .crumb { display: inline-flex; align-items: center; gap: 6px; }
        .breadcrumb a { color: var(--text-subtle); text-decoration: none; }
        .breadcrumb a:hover { color: var(--primary); }
        .breadcrumb .sep { color: var(--border-strong); }
        .breadcrumb .current { color: var(--text); font-weight: 500; }

        .kicker {
          font-family: var(--font-ui);
          font-size: 11.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--primary);
          font-weight: 700;
          margin-bottom: 12px;
        }
        .title {
          font-family: var(--font-serif);
          font-size: 48px;
          font-weight: 700;
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.08;
          margin: 0 0 14px;
          max-width: 720px;
        }
        @media (max-width: 700px) {
          .title { font-size: 34px; }
        }
        .deck {
          font-family: var(--font-serif);
          font-size: 21px;
          line-height: 1.5;
          color: var(--text-muted);
          font-weight: 400;
          font-style: italic;
          max-width: 680px;
          margin: 0 0 28px;
        }

        /* ── Sibling pill strip ─────────────────────────────── */
        .sibling-strip {
          display: flex;
          gap: 4px;
          margin-bottom: 36px;
          overflow-x: auto;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border);
          align-items: center;
        }
        .sibling-strip::-webkit-scrollbar { height: 3px; }
        .sibling-strip::-webkit-scrollbar-thumb {
          background: var(--border-strong);
          border-radius: 999px;
        }
        .strip-lbl {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-subtle);
          font-weight: 600;
          padding: 8px 8px 8px 0;
          flex-shrink: 0;
        }
        .sib {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          color: var(--text-muted);
          font-size: 13.5px;
          font-weight: 500;
          flex-shrink: 0;
          white-space: nowrap;
          border: 1px solid transparent;
          text-decoration: none;
        }
        .sib .sym {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-subtle);
        }
        .sib:hover {
          background: var(--surface);
          color: var(--text-strong);
          border-color: var(--border);
        }
        .sib.active {
          background: var(--text-strong);
          color: #fff;
          border-color: var(--text-strong);
        }
        .sib.active .sym { color: rgba(255,255,255,0.7); }

        /* ── Lede callout ───────────────────────────────────── */
        .lede-callout {
          font-family: var(--font-serif);
          font-size: 16.5px;
          color: var(--text);
          line-height: 1.6;
          padding: 16px 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 3px solid var(--primary);
          border-radius: 4px;
          margin: 0 0 32px;
          max-width: 780px;
        }
        .lede-callout .jump {
          display: inline-block;
          margin-top: 6px;
          font-family: var(--font-ui);
          font-size: 13px;
          color: var(--primary);
          font-weight: 600;
          font-style: normal;
          text-decoration: none;
        }
        .lede-callout .jump:hover { color: var(--primary-hover); }

        /* ── Tool region ────────────────────────────────────── */
        .tool-region { margin-bottom: 40px; }

        /* ── Below fold ─────────────────────────────────────── */
        .below-fold {
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr);
          gap: 48px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }
        @media (max-width: 900px) {
          .below-fold { grid-template-columns: 1fr; gap: 20px; }
          .toc-rail { display: none; }
        }
        .toc-rail {
          position: sticky;
          top: calc(var(--site-header-h) + 20px);
          align-self: start;
          padding: 4px 0;
        }
        .toc-head {
          color: var(--text-subtle);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0 4px 12px;
        }
        .toc-list { display: flex; flex-direction: column; }
        .toc-list a {
          display: block;
          padding: 5px 4px 5px 10px;
          color: var(--text-muted);
          font-size: 13px;
          border-left: 2px solid transparent;
          text-decoration: none;
        }
        .toc-list a:hover { color: var(--primary); }
        .toc-list a.active {
          color: var(--primary);
          border-left-color: var(--primary);
          font-weight: 600;
        }

        .piece {
          padding: 24px 0 8px;
          scroll-margin-top: calc(var(--site-header-h) + 20px);
        }
        .piece + .piece {
          border-top: 1px solid var(--border);
          margin-top: 20px;
        }
        .piece h2 {
          font-family: var(--font-serif);
          font-size: 28px;
          font-weight: 700;
          color: var(--text-strong);
          letter-spacing: -0.015em;
          margin: 0 0 14px;
          line-height: 1.2;
        }
        .doc-content { max-width: 640px; }
        /* Editorial prose uses the serif for prose too */
        .doc-content :global(p) {
          font-family: var(--font-serif);
          color: #2c2a26;
          margin: 0 0 14px;
          font-size: 17px;
          line-height: 1.65;
        }
        .doc-content :global(ul),
        .doc-content :global(ol) {
          font-family: var(--font-serif);
          margin: 8px 0 16px 24px;
          color: #2c2a26;
          font-size: 17px;
        }
        .doc-content :global(li) {
          margin-bottom: 6px;
          line-height: 1.6;
        }
        .doc-content :global(code) {
          font-family: var(--font-mono);
          background: var(--surface-alt);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 14.5px;
          color: var(--primary);
        }
        .doc-content :global(strong) { color: var(--text-strong); }

        /* ── Floating rail ──────────────────────────────────── */
        .float-rail {
          position: fixed;
          left: 12px;
          top: 50%;
          transform: translateY(-50%) translateX(-140%);
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: 0 8px 30px rgba(15,23,42,0.08);
          padding: 8px 6px;
          width: 52px;
          z-index: 25;
          transition: transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1),
                      width 0.22s ease;
        }
        .float-rail.visible {
          transform: translateY(-50%) translateX(0);
        }
        .float-rail.expanded { width: 232px; }

        @media (max-width: 900px) {
          .float-rail { display: none; }
        }

        .fr-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 8px 8px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 6px;
        }
        .fr-title {
          font-size: 10.5px;
          color: var(--text-subtle);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          display: none;
        }
        .float-rail.expanded .fr-title { display: block; }

        .fr-chev {
          width: 24px;
          height: 24px;
          background: var(--surface-alt);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-muted);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: transform 0.2s, border-color 0.15s;
        }
        .fr-chev:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .fr-chev:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .float-rail.expanded .fr-chev { transform: scaleX(-1); }

        .fr-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          border-radius: 6px;
          color: var(--text-muted);
          font-size: 13px;
          white-space: nowrap;
          position: relative;
          text-decoration: none;
        }
        .fr-item:hover {
          background: var(--surface-alt);
          color: var(--text-strong);
        }
        .fr-item.active {
          background: var(--primary-bg);
          color: var(--primary);
          font-weight: 600;
        }
        .fr-item .sym {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--text-subtle);
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .fr-item.active .sym { color: var(--primary); }
        .fr-item .lbl { display: none; }
        .float-rail.expanded .fr-item .lbl { display: inline; }

        .float-rail.collapsed .fr-item {
          justify-content: center;
          padding: 8px 0;
          gap: 0;
        }
        .float-rail.collapsed .fr-item .sym {
          width: auto;
          font-size: 13px;
        }

        /* Tooltip only when collapsed */
        .fr-item .tt {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: #18181b;
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          min-width: 200px;
          max-width: 240px;
          font-size: 12px;
          line-height: 1.5;
          margin-left: 12px;
          z-index: 40;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          opacity: 0;
          pointer-events: none;
          white-space: normal;
          font-weight: 400;
          font-family: var(--font-ui);
          transition: opacity 0.12s ease;
          display: none;
        }
        .fr-item .tt b {
          display: block;
          font-weight: 700;
          font-size: 12.5px;
          margin-bottom: 2px;
          color: #fff;
        }
        .fr-item .tt::before {
          content: "";
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #18181b;
        }
        .float-rail.collapsed .fr-item .tt { display: block; }
        .float-rail.collapsed .fr-item:hover .tt,
        .float-rail.collapsed .fr-item:focus-visible .tt {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Mock data + Demo wrapper for standalone view.
   ══════════════════════════════════════════════════════════════ */

const MOCK_SIBLINGS = [
  { slug: 'json-formatter',     title: 'Formatter',     blurb: 'Parse, validate & indent JSON.',   href: '/json-formatter',     active: true, category: 'json' },
  { slug: 'json-tree-viewer',   title: 'Tree Viewer',   blurb: 'Interactive collapsible tree.',    href: '/json-tree-viewer',                 category: 'json' },
  { slug: 'json-validator',     title: 'Validator',     blurb: 'Check validity, pinpoint errors.', href: '/json-validator',                   category: 'json' },
  { slug: 'json-minifier',      title: 'Minifier',      blurb: 'Collapse to a single line.',       href: '/json-minifier',                    category: 'json' },
  { slug: 'json-diff',          title: 'Diff Checker',  blurb: 'Compare two JSON documents.',      href: '/json-diff',                        category: 'json' },
  { slug: 'json-sort-keys',     title: 'Sort Keys',     blurb: 'Alphabetize keys recursively.',    href: '/json-sort-keys',                   category: 'json' },
  { slug: 'json-to-javascript', title: 'To JavaScript', blurb: 'Convert to JS object literal.',    href: '/json-to-javascript',               category: 'json' },
  { slug: 'json-to-yaml',       title: 'To YAML',       blurb: 'Convert JSON to YAML.',            href: '/json-to-yaml',                     category: 'json' },
];

const MOCK_SECTIONS = [
  {
    id: 'how',
    title: 'How to use this tool',
    content: (
      <>
        <p>The Formatter accepts any JSON input, valid or malformed, and produces a clean, indented output. The interaction is deliberately spare: paste, glance at the status line, and copy. There is no signup, no cookie banner, and no server round-trip.</p>
        <p>The input pane, above, is where you paste. The output pane, below, refreshes as you type &mdash; typically within about 120 milliseconds even for inputs in the tens of megabytes.</p>
      </>
    ),
  },
  {
    id: 'accepts',
    title: 'What the parser accepts',
    content: (
      <>
        <p>Strict RFC 8259 JSON, of course. But the parser also repairs several common malformations before it gives up: single-quoted keys, unquoted keys, trailing commas, JSONP wrappers, and NDJSON streams are all handled silently.</p>
      </>
    ),
  },
  {
    id: 'shortcuts',
    title: 'Keyboard shortcuts',
    content: (
      <>
        <p>Every button in the tool has a matching keystroke. The idea is that once you know the pattern, you never touch the mouse.</p>
        <ul>
          <li><code>&#8984;K</code> &mdash; focus the input pane.</li>
          <li><code>&#8984;&#9166;</code> &mdash; format the current input.</li>
          <li><code>&#8984;M</code> &mdash; minify to a single line.</li>
          <li><code>&#8984;&#8679;C</code> &mdash; copy output to clipboard.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'faq',
    title: 'Frequently asked',
    content: (
      <>
        <p><strong>Does my JSON get sent to a server?</strong> No. Every operation runs in your browser using native JavaScript.</p>
        <p><strong>What&apos;s the maximum input size?</strong> Practically limited by your browser&apos;s memory. Inputs up to ~50 MB format smoothly on a modern laptop.</p>
      </>
    ),
  },
];

const MOCK_PROPS = {
  slug: 'json-formatter',
  category: 'JSON',
  title: 'JSON Formatter',
  subtitle: 'Format, validate, and inspect JSON. Everything client-side, sub-500 ms, deep-linkable.',
  breadcrumb: [
    { href: '/',            label: 'Home' },
    { href: '/tools',       label: 'Tools' },
    { href: '/tools/json',  label: 'JSON' },
    {                       label: 'Formatter' },
  ],
  siblings: MOCK_SIBLINGS,
  callout: {
    text: (
      <>
        <strong>Paste JSON above, get formatted output below.</strong> Errors are highlighted with exact line and column. Every operation runs in your browser &mdash; nothing is uploaded.
      </>
    ),
    jumpTo: 'how',
    jumpLabel: 'Read the walk-through \u2193',
  },
  sections: MOCK_SECTIONS,
};

/* Vertical tool for the editorial layout. Input on top, transform
   bar (with directional arrows) in the middle, output on the bottom. */
function MockEditorialTool() {
  return (
    <div className="mock-vtool">

      <div className="lbl">
        <span>Input</span>
        <span className="status">&#10003; Valid JSON &middot; 2 keys &middot; 187 bytes</span>
      </div>
      <textarea
        className="pane"
        spellCheck="false"
        defaultValue={`{"user":{"name":"Alex","roles":["admin","editor"],"active":true},"meta":{"version":2}}`}
      />

      <div className="transform-bar">
        <button>Format</button>
        <button>Sort keys</button>
        <button>Minify</button>
        <button>Tree view</button>
        <button className="primary">Copy output</button>
      </div>

      <div className="lbl">
        <span>Output</span>
        <span>2-space indent</span>
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
    "version": 2
  }
}`}</pre>

      <style jsx>{`
        .mock-vtool {
          background: #ffffff;
          border: 1.5px solid #cfccc2;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15,23,42,0.04);
        }
        .lbl {
          padding: 8px 16px;
          background: #f5f4ef;
          border-bottom: 1px solid #e5e3dc;
          font-size: 11px;
          color: #78766f;
          font-family: ui-monospace, Menlo, monospace;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: flex;
          justify-content: space-between;
        }
        .lbl .status {
          color: #4D4DFF;
          text-transform: none;
          letter-spacing: 0;
          font-size: 12px;
        }
        .pane {
          padding: 16px 20px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px;
          line-height: 1.7;
          color: #1c1a17;
          background: #fff;
          white-space: pre;
          overflow: auto;
          border: none;
          outline: none;
          resize: none;
          width: 100%;
          min-height: 180px;
          max-height: 300px;
          margin: 0;
          box-sizing: border-box;
        }

        .transform-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 14px 16px;
          background: #f5f4ef;
          border-top: 1px solid #e5e3dc;
          border-bottom: 1px solid #e5e3dc;
          flex-wrap: wrap;
          position: relative;
        }
        .transform-bar::before,
        .transform-bar::after {
          content: "\u2193";
          position: absolute;
          color: #4D4DFF;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 18px;
          font-weight: 700;
        }
        .transform-bar::before { left: 24px; }
        .transform-bar::after  { right: 24px; }
        @media (max-width: 600px) {
          .transform-bar::before, .transform-bar::after { display: none; }
        }

        .transform-bar button {
          background: #fff;
          border: 1px solid #cfccc2;
          color: #1c1a17;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 500;
        }
        .transform-bar button:hover {
          border-color: #4D4DFF;
          color: #4D4DFF;
        }
        .transform-bar button.primary {
          background: #4D4DFF;
          border-color: #4D4DFF;
          color: #fff;
        }
        .transform-bar button.primary:hover {
          background: #3838cc;
        }
      `}</style>
    </div>
  );
}

/* Minimal site header for standalone view. */
function MockSiteHeader() {
  return (
    <header className="mock-header">
      <Link href="/" className="mock-logo">webdev<span>data</span></Link>
      <nav className="mock-nav">
        <Link href="/tools" className="active">Tools</Link>
        <Link href="/reference">Reference</Link>
        <a href="/learn">Learn</a>
      </nav>

      <style jsx>{`
        .mock-header {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(251,250,247,0.94);
          backdrop-filter: saturate(180%) blur(8px);
          border-bottom: 1px solid #e5e3dc;
          height: 52px;
          display: flex;
          align-items: center;
          padding: 0 32px;
          gap: 32px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        }
        .mock-logo {
          font-weight: 700;
          font-size: 16px;
          color: #09090b;
          font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
          letter-spacing: -0.01em;
          text-decoration: none;
        }
        .mock-logo span { color: #4D4DFF; }
        .mock-nav { display: flex; gap: 22px; margin-left: 8px; }
        .mock-nav a {
          color: #52514c;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
        }
        .mock-nav a.active { color: #09090b; }
        .mock-nav a:hover { color: #09090b; }
      `}</style>
    </header>
  );
}

/* Standalone demo. */
export function Demo() {
  return (
    <>
      <MockSiteHeader />
      <EditorialLayout {...MOCK_PROPS}>
        <MockEditorialTool />
      </EditorialLayout>
    </>
  );
}