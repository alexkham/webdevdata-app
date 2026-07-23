

// // // // ClassicLayout.jsx  ──  v4
// // // // ─────────────────────────────────────────────────────────────
// // // // Change vs v3: tooltip fix.
// // // //
// // // // v3 rendered a per-item .tt <span> and revealed it via
// // // // opacity + hover. That span was clipped twice:
// // // //   (a) .rail-item had overflow:hidden (for label truncation),
// // // //   (b) .left-rail had overflow-y:auto, which forces
// // // //       overflow-x to hidden too — the CSS "overflow-x:visible"
// // // //       hint is silently ignored by every engine.
// // // //
// // // // v4 renders ONE tooltip at the layout root using position:fixed.
// // // // Fixed positioning is relative to the viewport and ignores any
// // // // ancestor's overflow, so no clipping. Rail items just push
// // // // hoverTip state up on mouseenter/focus and clear it on leave/blur.
// // // // Works identically in folded and expanded states.
// // // // ─────────────────────────────────────────────────────────────

// // // import { useState, useRef, useEffect } from 'react';

// // // /* Icon generation — text glyphs for now, swap to SVG later. */
// // // function generateIcon(category, slug) {
// // //   const s = (slug || '').toLowerCase();
// // //   const c = (category || '').toLowerCase();

// // //   if (s.includes('tree'))                             return String.fromCharCode(0x2318);
// // //   if (s.includes('sort'))                             return String.fromCharCode(0x2195);
// // //   if (s.includes('diff'))                             return String.fromCharCode(0x0394);
// // //   if (s.includes('valid'))                            return String.fromCharCode(0x2713);
// // //   if (s.includes('minif'))                            return String.fromCharCode(0x2212);
// // //   if (s.includes('base64'))                           return 'B64';
// // //   if (s.includes('url'))                              return '%';
// // //   if (s.includes('jwt'))                              return 'JWT';
// // //   if (s.includes('regex'))                            return '.*';
// // //   if (s.includes('uuid') || s.includes('ulid'))       return 'ID';
// // //   if (s.includes('hash'))                             return '#';
// // //   if (s.includes('timestamp') || s.includes('epoch')) return String.fromCharCode(0x23F1);
// // //   if (s.startsWith('to-') || s.includes('-to-'))      return String.fromCharCode(0x2192);
// // //   if (s.includes('json'))                             return '{ }';

// // //   const byCategory = {
// // //     json:      '{ }',
// // //     encoder:   '%',
// // //     decoder:   '%',
// // //     formatter: String.fromCharCode(0x2261),
// // //     generator: '#',
// // //     converter: String.fromCharCode(0x2192),
// // //   };
// // //   return byCategory[c] || String.fromCharCode(0x00B7);
// // // }

// // // export default function ClassicLayout({
// // //   theme = 'light',
// // //   initialSidebar = 'folded',
// // //   siblings = [],
// // //   siblingGroups,
// // //   callout,
// // //   sections = [],
// // //   referencePanel = null,
// // //   children,
// // // }) {
// // //   const [folded, setFolded] = useState(initialSidebar === 'folded');
// // //   const [activeSection, setActiveSection] = useState(
// // //     sections.length ? sections[0].id : null
// // //   );

// // //   // Single-tooltip state. Null when nothing hovered; otherwise
// // //   // { title, blurb, top, left } in viewport coordinates.
// // //   const [hoverTip, setHoverTip] = useState(null);

// // //   const manuallyToggled = useRef(false);
// // //   const toolRef         = useRef(null);
// // //   const belowFoldRef    = useRef(null);
// // //   const sectionRefs     = useRef({});

// // //   /* Auto-fold: rail collapses when the below-fold docs ("On this
// // //      page") reach the upper half of the viewport, expands when they
// // //      drop back below it. Plain scroll listener — deterministic, no
// // //      observer/reflow feedback. Manual chevron click disables it. */
// // //   useEffect(() => {
// // //     const onScroll = () => {
// // //       if (manuallyToggled.current) return;
// // //       const el = belowFoldRef.current;
// // //       if (!el) return;
// // //       const top = el.getBoundingClientRect().top;
// // //       setFolded(top < window.innerHeight * 0.5);
// // //     };
// // //     onScroll();
// // //     window.addEventListener('scroll', onScroll, { passive: true });
// // //     window.addEventListener('resize', onScroll, { passive: true });
// // //     return () => {
// // //       window.removeEventListener('scroll', onScroll);
// // //       window.removeEventListener('resize', onScroll);
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!sections.length) return;
// // //     if (typeof IntersectionObserver === 'undefined') return;

// // //     const obs = new IntersectionObserver(
// // //       (entries) => {
// // //         entries.forEach((e) => {
// // //           if (e.isIntersecting) setActiveSection(e.target.id);
// // //         });
// // //       },
// // //       { threshold: 0.1, rootMargin: '-80px 0px -60% 0px' }
// // //     );
// // //     sections.forEach((s) => {
// // //       const el = sectionRefs.current[s.id];
// // //       if (el) obs.observe(el);
// // //     });
// // //     return () => obs.disconnect();
// // //   }, [sections]);

// // //   // Hide the tooltip if the user scrolls — the anchor rect moves,
// // //   // and animating the fixed tooltip along with it would be ugly.
// // //   useEffect(() => {
// // //     if (!hoverTip) return;
// // //     const clear = () => setHoverTip(null);
// // //     window.addEventListener('scroll', clear, { passive: true });
// // //     return () => window.removeEventListener('scroll', clear);
// // //   }, [hoverTip]);

// // //   const toggleChevron = () => {
// // //     manuallyToggled.current = true;
// // //     setFolded((f) => !f);
// // //   };

// // //   const showTip = (e, item) => {
// // //     // Skip on touch devices — no hover, don't want tooltip flashing
// // //     // during scroll-tap. Also cheap perf guard.
// // //     if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
// // //     const rect = e.currentTarget.getBoundingClientRect();
// // //     setHoverTip({
// // //       title: item.title,
// // //       blurb: item.blurb || '',
// // //       top: rect.top + rect.height / 2,
// // //       left: rect.right + 14,
// // //     });
// // //   };
// // //   const hideTip = () => setHoverTip(null);

// // //   const groups      = (siblingGroups && siblingGroups.length)
// // //                         ? siblingGroups
// // //                         : (siblings.length ? [{ heading: null, items: siblings }] : []);
// // //   const hasBelowFold = sections && sections.length > 0;
// // //   const hasLeft      = groups.length > 0;
// // //   const isTerminal   = theme === 'terminal';

// // //   const pageClass =
// // //     'classic' +
// // //     (isTerminal ? ' theme-terminal' : ' theme-light') +
// // //     (hasLeft ? ' has-left' : '') +
// // //     (folded ? ' rail-folded' : ' rail-expanded');

// // //   return (
// // //     <div className={pageClass}>

// // //       <a href="#tool-region" className="skip-link">Skip to tool</a>

// // //       {hasLeft && (
// // //         <aside className="left-rail" aria-label="Related tools">

// // //           <div className="rail-toggle-row">
// // //             <span className="rail-title-mini">Related</span>
// // //             <button
// // //               type="button"
// // //               className="rail-chev"
// // //               onClick={toggleChevron}
// // //               aria-label={folded ? 'Expand sidebar' : 'Collapse sidebar'}
// // //               aria-expanded={!folded}
// // //               title={folded ? 'Expand sidebar' : 'Collapse sidebar'}
// // //             >&lsaquo;</button>
// // //           </div>

// // //           {groups.map((g, gi) => (
// // //             <div className="rail-group" key={gi}>
// // //               {g.heading && <div className="rail-head">{g.heading}</div>}
// // //               <nav>
// // //                 {g.items.map((it) => (
// // //                   <a
// // //                     key={it.slug || it.href}
// // //                     href={it.href}
// // //                     className={`rail-item ${it.active ? 'active' : ''}`}
// // //                     onMouseEnter={(e) => showTip(e, it)}
// // //                     onMouseLeave={hideTip}
// // //                     onFocus={(e) => showTip(e, it)}
// // //                     onBlur={hideTip}
// // //                   >
// // //                     <span className="sym" aria-hidden="true">
// // //                       {generateIcon(it.category, it.slug)}
// // //                     </span>
// // //                     <span className="lbl">{it.title}</span>
// // //                   </a>
// // //                 ))}
// // //               </nav>
// // //             </div>
// // //           ))}
// // //         </aside>
// // //       )}

// // //       <main className="classic-main">

// // //         {callout && (
// // //           <div className="callout">
// // //             <div className="callout-icon" aria-hidden="true">i</div>
// // //             <div>
// // //               {callout.text}
// // //               {callout.jumpTo && (
// // //                 <>
// // //                   {' '}
// // //                   <a className="jump" href={`#${callout.jumpTo}`}>
// // //                     {callout.jumpLabel || 'How to use \u2193'}
// // //                   </a>
// // //                 </>
// // //               )}
// // //             </div>
// // //           </div>
// // //         )}

// // //         <div className={`above-fold ${referencePanel ? 'has-ref' : ''}`}>
// // //           <div className="tool-region" id="tool-region" ref={toolRef}>
// // //             {children}
// // //           </div>
// // //           {referencePanel && (
// // //             <aside className="ref-panel" aria-label="Quick reference">
// // //               {referencePanel}
// // //             </aside>
// // //           )}
// // //         </div>

// // //         {hasBelowFold && (
// // //           <div className="below-fold" ref={belowFoldRef}>

// // //             <aside className="toc-rail" aria-label="On this page">
// // //               <div className="toc-head">On this page</div>
// // //               <nav className="toc-list">
// // //                 {sections.map((s) => (
// // //                   <a
// // //                     key={s.id}
// // //                     href={`#${s.id}`}
// // //                     className={activeSection === s.id ? 'active' : ''}
// // //                   >{s.title}</a>
// // //                 ))}
// // //               </nav>
// // //             </aside>

// // //             <div className="doc-body">
// // //               {sections.map((s) => (
// // //                 <section
// // //                   key={s.id}
// // //                   id={s.id}
// // //                   ref={(el) => { sectionRefs.current[s.id] = el; }}
// // //                   className={`doc doc-${s.kind || 'prose'}`}
// // //                 >
// // //                   <h2>{s.title}</h2>
// // //                   <div className="doc-content">{s.content}</div>
// // //                 </section>
// // //               ))}
// // //             </div>

// // //           </div>
// // //         )}
// // //       </main>

// // //       {/* ── Fixed tooltip layer ──────────────────────────────
// // //           One node, rendered only while hovering. position:fixed
// // //           escapes both .rail-item's overflow:hidden and
// // //           .left-rail's implicit overflow-x clipping. */}
// // //       {hoverTip && (
// // //         <div
// // //           className="fixed-tt"
// // //           role="tooltip"
// // //           style={{
// // //             top:  hoverTip.top,
// // //             left: hoverTip.left,
// // //           }}
// // //         >
// // //           <b>{hoverTip.title}</b>
// // //           {hoverTip.blurb && <span className="tt-blurb">{hoverTip.blurb}</span>}
// // //           <span className="tt-arrow" aria-hidden="true" />
// // //         </div>
// // //       )}

// // //       <style jsx>{`
// // //         /* ── Root grid — matches CalculatorFrame ────────────── */
// // //         .classic {
// // //           min-height: 100vh;
// // //           width: 100%;
// // //           max-width: 1700px;
// // //           margin: 0 auto;
// // //           border-top: 1px solid var(--border);
// // //           box-sizing: border-box;
// // //           display: grid;
// // //           grid-template-columns: 1fr;
// // //           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
// // //           font-size: 15px;
// // //           line-height: 1.55;
// // //           color: var(--text);
// // //           background: var(--bg);
// // //           -webkit-font-smoothing: antialiased;
// // //         }
// // //         .classic.has-left {
// // //           grid-template-columns: auto 1fr;
// // //         }

// // //         /* ── Cold blue palette (light) ──────────────────────── */
// // //         .classic.theme-light {
// // //           --bg: #ffffff;
// // //           --surface: #ffffff;
// // //           --surface-alt: #f5f7fb;
// // //           --surface-code: #eff2f8;
// // //           --text: #0f172a;
// // //           --text-strong: #030712;
// // //           --text-muted: #475569;
// // //           --text-subtle: #64748b;
// // //           --border: #cfd6e0;
// // //           --border-strong: #a3b0c6;
// // //           --primary: #1B50EE;
// // //           --primary-hover: #133EBF;
// // //           --primary-bg: #E8EEFB;
// // //           --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
// // //           --site-header-h: 52px;
// // //           --rail-w-open: 240px;
// // //           --rail-w-closed: 56px;
// // //           --ref-w: 340px;
// // //         }
// // //         .classic.theme-terminal {
// // //           --bg: #0A0D14;
// // //           --surface: #101623;
// // //           --surface-alt: #141b2b;
// // //           --surface-code: #0a0e18;
// // //           --text: #d4dae5;
// // //           --text-strong: #ffffff;
// // //           --text-muted: #97a3b8;
// // //           --text-subtle: #6b7891;
// // //           --border: #1e2637;
// // //           --border-strong: #2d3a52;
// // //           --primary: #4D74FF;
// // //           --primary-hover: #6A8BFF;
// // //           --primary-bg: rgba(77,116,255,0.14);
// // //           --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
// // //           --site-header-h: 40px;
// // //           --rail-w-open: 240px;
// // //           --rail-w-closed: 52px;
// // //           --ref-w: 340px;
// // //         }

// // //         /* ── Skip link ──────────────────────────────────────── */
// // //         .skip-link {
// // //           position: absolute;
// // //           left: -9999px;
// // //           top: 8px;
// // //           padding: 8px 14px;
// // //           background: var(--primary);
// // //           color: #fff;
// // //           text-decoration: none;
// // //           border-radius: 6px;
// // //           font-weight: 600;
// // //           z-index: 100;
// // //           border: 1.5px solid var(--primary-hover);
// // //         }
// // //         .skip-link:focus { left: 8px; }

// // //         /* ── Left rail ──────────────────────────────────────── */
// // //         .left-rail {
// // //           width: var(--rail-w-open);
// // //           border-right: 1.5px solid var(--border);
// // //           padding: 14px 12px 40px;
// // //           position: sticky;
// // //           top: var(--site-header-h);
// // //           align-self: start;
// // //           max-height: calc(100vh - var(--site-header-h));
// // //           overflow-y: auto;
// // //           transition: width 0.22s ease, padding 0.22s;
// // //           background: var(--bg);
// // //           box-sizing: border-box;
// // //         }
// // //         .classic.rail-folded .left-rail {
// // //           width: var(--rail-w-closed);
// // //           padding: 14px 4px 40px;
// // //         }

// // //         .rail-toggle-row {
// // //           display: flex;
// // //           align-items: center;
// // //           justify-content: space-between;
// // //           padding: 2px 8px 12px;
// // //           position: sticky;
// // //           top: 0;
// // //           background: var(--bg);
// // //           z-index: 2;
// // //           border-bottom: 1.5px solid var(--border);
// // //           margin-bottom: 10px;
// // //         }
// // //         .classic.rail-folded .rail-toggle-row {
// // //           justify-content: center;
// // //           padding: 2px 0 12px;
// // //         }
// // //         .rail-title-mini {
// // //           font-size: 10.5px;
// // //           font-weight: 700;
// // //           color: var(--text-subtle);
// // //           letter-spacing: 0.09em;
// // //           text-transform: uppercase;
// // //           padding-left: 4px;
// // //         }
// // //         .classic.rail-folded .rail-title-mini { display: none; }

// // //         .rail-chev {
// // //           width: 28px;
// // //           height: 28px;
// // //           display: inline-flex;
// // //           align-items: center;
// // //           justify-content: center;
// // //           border: 1.5px solid var(--border-strong);
// // //           background: var(--surface);
// // //           border-radius: 6px;
// // //           color: var(--text-muted);
// // //           cursor: pointer;
// // //           font-family: var(--font-mono);
// // //           font-size: 14px;
// // //           line-height: 1;
// // //           padding: 0;
// // //           transition: transform 0.2s, border-color 0.15s, color 0.15s, background 0.15s;
// // //         }
// // //         .rail-chev:hover {
// // //           border-color: var(--primary);
// // //           color: var(--primary);
// // //           background: var(--primary-bg);
// // //         }
// // //         .rail-chev:focus-visible {
// // //           outline: 2px solid var(--primary);
// // //           outline-offset: 2px;
// // //         }
// // //         .classic.rail-folded .rail-chev { transform: scaleX(-1); }

// // //         .rail-head {
// // //           padding: 10px 12px 8px;
// // //           color: var(--text-subtle);
// // //           font-size: 11px;
// // //           font-weight: 700;
// // //           letter-spacing: 0.08em;
// // //           text-transform: uppercase;
// // //         }
// // //         .classic.rail-folded .rail-head { display: none; }
// // //         .rail-group + .rail-group { margin-top: 10px; }
// // //         .classic.rail-folded .rail-group + .rail-group {
// // //           padding-top: 10px;
// // //           border-top: 1.5px solid var(--border);
// // //         }

// // //         /* Rail items — cold blue hover, stronger borders.
// // //            Note: NO overflow:hidden here (v3 had it and it clipped
// // //            the old inline tooltip). Label truncation is handled with
// // //            text-overflow:ellipsis on .lbl below. */
// // //         .rail-item {
// // //           display: flex;
// // //           align-items: center;
// // //           gap: 12px;
// // //           padding: 8px 12px;
// // //           border-radius: 7px;
// // //           color: var(--text-muted);
// // //           font-size: 13.5px;
// // //           line-height: 1.35;
// // //           position: relative;
// // //           text-decoration: none;
// // //           border: 1.5px solid transparent;
// // //           transition: background 0.12s, color 0.12s, border-color 0.12s, transform 0.1s;
// // //         }
// // //         .rail-item .sym {
// // //           font-family: var(--font-mono);
// // //           font-size: 12px;
// // //           font-weight: 700;
// // //           color: var(--text-subtle);
// // //           width: 22px;
// // //           text-align: center;
// // //           flex-shrink: 0;
// // //           transition: color 0.12s;
// // //         }
// // //         .rail-item .lbl {
// // //           min-width: 0;
// // //           overflow: hidden;
// // //           text-overflow: ellipsis;
// // //           white-space: nowrap;
// // //         }
// // //         .rail-item:hover {
// // //           background: var(--surface-alt);
// // //           color: var(--text-strong);
// // //           border-color: var(--border);
// // //           transform: translateX(2px);
// // //         }
// // //         .rail-item:hover .sym { color: var(--primary); }
// // //         .rail-item.active {
// // //           background: var(--primary-bg);
// // //           color: var(--primary);
// // //           font-weight: 600;
// // //           border-color: transparent;
// // //         }
// // //         .rail-item.active .sym { color: var(--primary); }
// // //         .rail-item.active::before {
// // //           content: "";
// // //           position: absolute;
// // //           left: -3px;
// // //           top: 8px;
// // //           bottom: 8px;
// // //           width: 3px;
// // //           background: var(--primary);
// // //           border-radius: 0 3px 3px 0;
// // //         }

// // //         .classic.rail-folded .rail-item {
// // //           justify-content: center;
// // //           padding: 10px 0;
// // //           gap: 0;
// // //         }
// // //         .classic.rail-folded .rail-item .lbl { display: none; }
// // //         .classic.rail-folded .rail-item .sym {
// // //           width: auto;
// // //           font-size: 14px;
// // //         }
// // //         .classic.rail-folded .rail-item:hover { transform: none; }
// // //         .classic.rail-folded .rail-item.active::before { top: 4px; bottom: 4px; }

// // //         @media (max-width: 780px) {
// // //           .classic, .classic.has-left {
// // //             grid-template-columns: 1fr;
// // //           }
// // //           .left-rail { display: none; }
// // //         }

// // //         /* ── Fixed tooltip — rendered once at layout root ───── */
// // //         .fixed-tt {
// // //           position: fixed;
// // //           transform: translateY(-50%);
// // //           background: #0f172a;
// // //           color: #fff;
// // //           padding: 10px 14px;
// // //           border-radius: 8px;
// // //           min-width: 180px;
// // //           max-width: 280px;
// // //           font-size: 12.5px;
// // //           line-height: 1.5;
// // //           z-index: 1000;
// // //           box-shadow: 0 8px 24px rgba(15,23,42,0.24);
// // //           pointer-events: none;
// // //           font-weight: 400;
// // //           animation: tt-in 0.14s ease-out;
// // //         }
// // //         .fixed-tt b {
// // //           display: block;
// // //           font-weight: 700;
// // //           font-size: 13px;
// // //           color: #fff;
// // //         }
// // //         .fixed-tt .tt-blurb {
// // //           display: block;
// // //           margin-top: 4px;
// // //           color: #e2e8f0;
// // //         }
// // //         .fixed-tt .tt-arrow {
// // //           position: absolute;
// // //           right: 100%;
// // //           top: 50%;
// // //           transform: translateY(-50%);
// // //           border: 6px solid transparent;
// // //           border-right-color: #0f172a;
// // //         }
// // //         @keyframes tt-in {
// // //           from { opacity: 0; transform: translate(-4px, -50%); }
// // //           to   { opacity: 1; transform: translate(0, -50%); }
// // //         }

// // //         /* ── Main ───────────────────────────────────────────── */
// // //         .classic-main {
// // //           padding: 28px 40px 64px;
// // //           min-width: 0;
// // //         }

// // //         .callout {
// // //           background: var(--primary-bg);
// // //           border: 1.5px solid #C8D4F6;
// // //           border-radius: 12px;
// // //           padding: 14px 18px;
// // //           margin-bottom: 24px;
// // //           font-size: 14px;
// // //           line-height: 1.55;
// // //           display: flex;
// // //           gap: 12px;
// // //           align-items: flex-start;
// // //           color: var(--text);
// // //         }
// // //         .callout-icon {
// // //           width: 22px;
// // //           height: 22px;
// // //           background: var(--primary);
// // //           color: #fff;
// // //           border-radius: 50%;
// // //           display: flex;
// // //           align-items: center;
// // //           justify-content: center;
// // //           font-size: 13px;
// // //           font-weight: 700;
// // //           flex-shrink: 0;
// // //           margin-top: 1px;
// // //           font-style: italic;
// // //           font-family: Georgia, serif;
// // //         }
// // //         .callout .jump {
// // //           color: var(--primary);
// // //           font-weight: 600;
// // //           text-decoration: underline;
// // //           white-space: nowrap;
// // //           margin-left: 4px;
// // //           transition: color 0.12s;
// // //         }
// // //         .callout .jump:hover { color: var(--primary-hover); }

// // //         /* ── Above the fold ─────────────────────────────────── */
// // //         .above-fold { margin-bottom: 48px; }
// // //         .above-fold.has-ref {
// // //           display: grid;
// // //           grid-template-columns: minmax(0, 1fr) var(--ref-w);
// // //           gap: 24px;
// // //         }
// // //         @media (max-width: 1160px) {
// // //           .above-fold.has-ref { grid-template-columns: 1fr; }
// // //         }
// // //         .tool-region {
// // //           min-width: 0;
// // //           border: 1.5px solid var(--border-strong);
// // //           border-radius: 16px;
// // //           background: var(--surface);
// // //           box-shadow: 0 4px 20px rgba(15,23,42,0.06);
// // //           overflow: hidden;
// // //         }
// // //         .ref-panel {
// // //           display: flex;
// // //           flex-direction: column;
// // //           gap: 16px;
// // //           min-width: 0;
// // //         }

// // //         /* ── Below the fold ─────────────────────────────────── */
// // //         .below-fold {
// // //           display: grid;
// // //           grid-template-columns: 220px minmax(0, 1fr);
// // //           gap: 48px;
// // //           padding-top: 28px;
// // //           border-top: 1.5px solid var(--border);
// // //         }
// // //         @media (max-width: 900px) {
// // //           .below-fold { grid-template-columns: 1fr; }
// // //           .toc-rail { display: none; }
// // //         }
// // //         .toc-rail {
// // //           position: sticky;
// // //           top: calc(var(--site-header-h) + 24px);
// // //           align-self: start;
// // //           padding: 4px 0;
// // //         }
// // //         .toc-head {
// // //           color: var(--text-subtle);
// // //           font-size: 11px;
// // //           font-weight: 700;
// // //           letter-spacing: 0.08em;
// // //           text-transform: uppercase;
// // //           padding: 4px 10px 10px;
// // //         }
// // //         .toc-list { display: flex; flex-direction: column; }
// // //         .toc-list a {
// // //           display: flex;
// // //           align-items: center;
// // //           gap: 10px;
// // //           padding: 7px 12px;
// // //           color: var(--text-muted);
// // //           font-size: 13px;
// // //           border-left: 2px solid transparent;
// // //           text-decoration: none;
// // //           transition: color 0.12s, background 0.12s, border-left-color 0.12s;
// // //         }
// // //         .toc-list a:hover {
// // //           color: var(--primary);
// // //           background: var(--surface-alt);
// // //         }
// // //         .toc-list a.active {
// // //           color: var(--primary);
// // //           border-left-color: var(--primary);
// // //           font-weight: 600;
// // //           background: var(--primary-bg);
// // //         }

// // //         .doc {
// // //           padding: 24px 0 12px;
// // //           scroll-margin-top: calc(var(--site-header-h) + 24px);
// // //         }
// // //         .doc + .doc {
// // //           border-top: 1.5px solid var(--border);
// // //           margin-top: 20px;
// // //         }
// // //         .doc h2 {
// // //           font-size: 22px;
// // //           font-weight: 700;
// // //           color: var(--text-strong);
// // //           letter-spacing: -0.01em;
// // //           margin: 0 0 14px;
// // //         }
// // //         .doc-content { color: var(--text); max-width: 780px; }
// // //         .doc-content :global(p) {
// // //           color: var(--text-muted);
// // //           margin: 0 0 14px;
// // //           font-size: 15px;
// // //           line-height: 1.7;
// // //         }
// // //         .doc-content :global(ul),
// // //         .doc-content :global(ol) {
// // //           margin: 8px 0 16px 22px;
// // //           color: var(--text-muted);
// // //           font-size: 15px;
// // //         }
// // //         .doc-content :global(li) {
// // //           margin-bottom: 6px;
// // //           line-height: 1.65;
// // //         }
// // //         .doc-content :global(code) {
// // //           background: var(--surface-code);
// // //           padding: 2px 7px;
// // //           border-radius: 5px;
// // //           font-family: var(--font-mono);
// // //           font-size: 13px;
// // //           color: var(--primary);
// // //           border: 1px solid var(--border);
// // //         }
// // //         .doc-content :global(strong) { color: var(--text-strong); font-weight: 700; }
// // //         .doc-content :global(a) {
// // //           color: var(--primary);
// // //           text-decoration: underline;
// // //           transition: color 0.12s;
// // //         }
// // //         .doc-content :global(a:hover) { color: var(--primary-hover); }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }


// // // ClassicLayout.jsx  ──  v6
// // // ─────────────────────────────────────────────────────────────
// // // Changes vs v4:
// // //   Auto-fold override no longer disables scroll behavior
// // //   permanently after a chevron click.
// // //
// // //   Old behavior: manuallyToggled=true on first click, all
// // //   future scroll-driven fold changes silently ignored for
// // //   the rest of the session.
// // //
// // //   New behavior: the click still overrides auto-fold
// // //   immediately (so the rail doesn't snap back on the next
// // //   scroll tick), but the override releases as soon as the
// // //   auto-fold's target agrees with the current (post-click)
// // //   state. From that point on, scroll-driven auto-fold
// // //   resumes on further threshold crossings.
// // //
// // //   Example flow:
// // //     - Rail folded (auto, past trigger).
// // //     - User clicks chevron → rail expands, override active.
// // //     - User scrolls back above the trigger → auto now wants
// // //       expanded, matches current state → override releases.
// // //     - Further scroll folds and expands normally.
// // //
// // //   Renamed manuallyToggled → overrideActive to reflect the
// // //   new semantics.
// // //
// // // Prior notes (v4): fixed tooltip clipping by rendering one
// // // tooltip at the layout root with position:fixed.
// // // ─────────────────────────────────────────────────────────────

// // import { useState, useRef, useEffect } from 'react';

// // /* Icon generation — text glyphs for now, swap to SVG later. */
// // function generateIcon(category, slug) {
// //   const s = (slug || '').toLowerCase();
// //   const c = (category || '').toLowerCase();

// //   if (s.includes('tree'))                             return String.fromCharCode(0x2318);
// //   if (s.includes('sort'))                             return String.fromCharCode(0x2195);
// //   if (s.includes('diff'))                             return String.fromCharCode(0x0394);
// //   if (s.includes('valid'))                            return String.fromCharCode(0x2713);
// //   if (s.includes('minif'))                            return String.fromCharCode(0x2212);
// //   if (s.includes('base64'))                           return 'B64';
// //   if (s.includes('url'))                              return '%';
// //   if (s.includes('jwt'))                              return 'JWT';
// //   if (s.includes('regex'))                            return '.*';
// //   if (s.includes('uuid') || s.includes('ulid'))       return 'ID';
// //   if (s.includes('hash'))                             return '#';
// //   if (s.includes('timestamp') || s.includes('epoch')) return String.fromCharCode(0x23F1);
// //   if (s.startsWith('to-') || s.includes('-to-'))      return String.fromCharCode(0x2192);
// //   if (s.includes('json'))                             return '{ }';

// //   const byCategory = {
// //     json:      '{ }',
// //     encoder:   '%',
// //     decoder:   '%',
// //     formatter: String.fromCharCode(0x2261),
// //     generator: '#',
// //     converter: String.fromCharCode(0x2192),
// //   };
// //   return byCategory[c] || String.fromCharCode(0x00B7);
// // }

// // export default function ClassicLayout({
// //   theme = 'light',
// //   initialSidebar = 'folded',
// //   siblings = [],
// //   siblingGroups,
// //   callout,
// //   sections = [],
// //   referencePanel = null,
// //   children,
// // }) {
// //   const [folded, setFolded] = useState(initialSidebar === 'folded');
// //   const [activeSection, setActiveSection] = useState(
// //     sections.length ? sections[0].id : null
// //   );

// //   // Single-tooltip state. Null when nothing hovered; otherwise
// //   // { title, blurb, top, left } in viewport coordinates.
// //   const [hoverTip, setHoverTip] = useState(null);

// //   // Mirror `folded` into a ref so the scroll listener (which
// //   // subscribes once, with an empty deps array) always reads the
// //   // current value without needing to re-subscribe.
// //   const foldedRef = useRef(folded);
// //   useEffect(() => { foldedRef.current = folded; }, [folded]);

// //   // Override flag. Set true on chevron click. Cleared inside the
// //   // scroll handler as soon as auto-fold's target matches the
// //   // current folded state — at that moment auto and manual agree
// //   // and there's nothing left to override.
// //   const overrideActive = useRef(false);

// //   const toolRef      = useRef(null);
// //   const belowFoldRef = useRef(null);
// //   const sectionRefs  = useRef({});

// //   /* Auto-fold: rail collapses when the below-fold docs ("On this
// //      page") reach the upper half of the viewport, expands when they
// //      drop back below it. Plain scroll listener — deterministic, no
// //      observer/reflow feedback. Chevron click sets a temporary
// //      override that releases when auto agrees with the click. */
// //   useEffect(() => {
// //     const onScroll = () => {
// //       const el = belowFoldRef.current;
// //       if (!el) return;
// //       const top = el.getBoundingClientRect().top;
// //       const wantFolded = top < window.innerHeight * 0.5;

// //       if (overrideActive.current) {
// //         // Release the override the moment scroll position produces
// //         // the same target as the user's manual choice. Auto-fold
// //         // then resumes on subsequent threshold crossings.
// //         if (wantFolded === foldedRef.current) {
// //           overrideActive.current = false;
// //         }
// //         return;
// //       }

// //       // No override — apply auto behavior. Guard against redundant
// //       // setState calls to keep re-renders minimal during scroll.
// //       if (wantFolded !== foldedRef.current) {
// //         setFolded(wantFolded);
// //       }
// //     };
// //     onScroll();
// //     window.addEventListener('scroll', onScroll, { passive: true });
// //     window.addEventListener('resize', onScroll, { passive: true });
// //     return () => {
// //       window.removeEventListener('scroll', onScroll);
// //       window.removeEventListener('resize', onScroll);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (!sections.length) return;
// //     if (typeof IntersectionObserver === 'undefined') return;

// //     const obs = new IntersectionObserver(
// //       (entries) => {
// //         entries.forEach((e) => {
// //           if (e.isIntersecting) setActiveSection(e.target.id);
// //         });
// //       },
// //       { threshold: 0.1, rootMargin: '-80px 0px -60% 0px' }
// //     );
// //     sections.forEach((s) => {
// //       const el = sectionRefs.current[s.id];
// //       if (el) obs.observe(el);
// //     });
// //     return () => obs.disconnect();
// //   }, [sections]);

// //   // Hide the tooltip if the user scrolls — the anchor rect moves,
// //   // and animating the fixed tooltip along with it would be ugly.
// //   useEffect(() => {
// //     if (!hoverTip) return;
// //     const clear = () => setHoverTip(null);
// //     window.addEventListener('scroll', clear, { passive: true });
// //     return () => window.removeEventListener('scroll', clear);
// //   }, [hoverTip]);

// //   const toggleChevron = () => {
// //     overrideActive.current = true;
// //     setFolded((f) => !f);
// //   };

// //   const showTip = (e, item) => {
// //     // Skip on touch devices — no hover, don't want tooltip flashing
// //     // during scroll-tap. Also cheap perf guard.
// //     if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
// //     const rect = e.currentTarget.getBoundingClientRect();
// //     setHoverTip({
// //       title: item.title,
// //       blurb: item.blurb || '',
// //       top: rect.top + rect.height / 2,
// //       left: rect.right + 14,
// //     });
// //   };
// //   const hideTip = () => setHoverTip(null);

// //   const groups      = (siblingGroups && siblingGroups.length)
// //                         ? siblingGroups
// //                         : (siblings.length ? [{ heading: null, items: siblings }] : []);
// //   const hasBelowFold = sections && sections.length > 0;
// //   const hasLeft      = groups.length > 0;
// //   const isTerminal   = theme === 'terminal';

// //   const pageClass =
// //     'classic' +
// //     (isTerminal ? ' theme-terminal' : ' theme-light') +
// //     (hasLeft ? ' has-left' : '') +
// //     (folded ? ' rail-folded' : ' rail-expanded');

// //   return (
// //     <div className={pageClass}>

// //       <a href="#tool-region" className="skip-link">Skip to tool</a>

// //       {hasLeft && (
// //         <aside className="left-rail" aria-label="Related tools">

// //           <div className="rail-toggle-row">
// //             <span className="rail-title-mini">Related</span>
// //             <button
// //               type="button"
// //               className="rail-chev"
// //               onClick={toggleChevron}
// //               aria-label={folded ? 'Expand sidebar' : 'Collapse sidebar'}
// //               aria-expanded={!folded}
// //               title={folded ? 'Expand sidebar' : 'Collapse sidebar'}
// //             >&lsaquo;</button>
// //           </div>

// //           {groups.map((g, gi) => (
// //             <div className="rail-group" key={gi}>
// //               {g.heading && <div className="rail-head">{g.heading}</div>}
// //               <nav>
// //                 {g.items.map((it) => (
// //                   <a
// //                     key={it.slug || it.href}
// //                     href={it.href}
// //                     className={`rail-item ${it.active ? 'active' : ''}`}
// //                     onMouseEnter={(e) => showTip(e, it)}
// //                     onMouseLeave={hideTip}
// //                     onFocus={(e) => showTip(e, it)}
// //                     onBlur={hideTip}
// //                   >
// //                     <span className="sym" aria-hidden="true">
// //                       {generateIcon(it.category, it.slug)}
// //                     </span>
// //                     <span className="lbl">{it.title}</span>
// //                   </a>
// //                 ))}
// //               </nav>
// //             </div>
// //           ))}
// //         </aside>
// //       )}

// //       <main className="classic-main">

// //         {callout && (
// //           <div className="callout">
// //             <div className="callout-icon" aria-hidden="true">i</div>
// //             <div>
// //               {callout.text}
// //               {callout.jumpTo && (
// //                 <>
// //                   {' '}
// //                   <a className="jump" href={`#${callout.jumpTo}`}>
// //                     {callout.jumpLabel || 'How to use \u2193'}
// //                   </a>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         <div className={`above-fold ${referencePanel ? 'has-ref' : ''}`}>
// //           <div className="tool-region" id="tool-region" ref={toolRef}>
// //             {children}
// //           </div>
// //           {referencePanel && (
// //             <aside className="ref-panel" aria-label="Quick reference">
// //               {referencePanel}
// //             </aside>
// //           )}
// //         </div>

// //         {hasBelowFold && (
// //           <div className="below-fold" ref={belowFoldRef}>

// //             <aside className="toc-rail" aria-label="On this page">
// //               <div className="toc-head">On this page</div>
// //               <nav className="toc-list">
// //                 {sections.map((s) => (
// //                   <a
// //                     key={s.id}
// //                     href={`#${s.id}`}
// //                     className={activeSection === s.id ? 'active' : ''}
// //                   >{s.title}</a>
// //                 ))}
// //               </nav>
// //             </aside>

// //             <div className="doc-body">
// //               {sections.map((s) => (
// //                 <section
// //                   key={s.id}
// //                   id={s.id}
// //                   ref={(el) => { sectionRefs.current[s.id] = el; }}
// //                   className={`doc doc-${s.kind || 'prose'}`}
// //                 >
// //                   <h2>{s.title}</h2>
// //                   <div className="doc-content">{s.content}</div>
// //                 </section>
// //               ))}
// //             </div>

// //           </div>
// //         )}
// //       </main>

// //       {/* ── Fixed tooltip layer ──────────────────────────────
// //           One node, rendered only while hovering. position:fixed
// //           escapes both .rail-item's overflow:hidden and
// //           .left-rail's implicit overflow-x clipping. */}
// //       {hoverTip && (
// //         <div
// //           className="fixed-tt"
// //           role="tooltip"
// //           style={{
// //             top:  hoverTip.top,
// //             left: hoverTip.left,
// //           }}
// //         >
// //           <b>{hoverTip.title}</b>
// //           {hoverTip.blurb && <span className="tt-blurb">{hoverTip.blurb}</span>}
// //           <span className="tt-arrow" aria-hidden="true" />
// //         </div>
// //       )}

// //       <style jsx>{`
// //         /* ── Root grid — matches CalculatorFrame ────────────── */
// //         .classic {
// //           min-height: 100vh;
// //           width: 100%;
// //           max-width: 1700px;
// //           margin: 0 auto;
// //           border-top: 1px solid var(--border);
// //           box-sizing: border-box;
// //           display: grid;
// //           grid-template-columns: 1fr;
// //           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
// //           font-size: 15px;
// //           line-height: 1.55;
// //           color: var(--text);
// //           background: var(--bg);
// //           -webkit-font-smoothing: antialiased;
// //         }
// //         .classic.has-left {
// //           grid-template-columns: auto 1fr;
// //         }

// //         /* ── Cold blue palette (light) ──────────────────────── */
// //         .classic.theme-light {
// //           --bg: #ffffff;
// //           --surface: #ffffff;
// //           --surface-alt: #f5f7fb;
// //           --surface-code: #eff2f8;
// //           --text: #0f172a;
// //           --text-strong: #030712;
// //           --text-muted: #475569;
// //           --text-subtle: #64748b;
// //           --border: #cfd6e0;
// //           --border-strong: #a3b0c6;
// //           --primary: #1B50EE;
// //           --primary-hover: #133EBF;
// //           --primary-bg: #E8EEFB;
// //           --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
// //           --site-header-h: 52px;
// //           --rail-w-open: 240px;
// //           --rail-w-closed: 56px;
// //           --ref-w: 340px;
// //         }
// //         .classic.theme-terminal {
// //           --bg: #0A0D14;
// //           --surface: #101623;
// //           --surface-alt: #141b2b;
// //           --surface-code: #0a0e18;
// //           --text: #d4dae5;
// //           --text-strong: #ffffff;
// //           --text-muted: #97a3b8;
// //           --text-subtle: #6b7891;
// //           --border: #1e2637;
// //           --border-strong: #2d3a52;
// //           --primary: #4D74FF;
// //           --primary-hover: #6A8BFF;
// //           --primary-bg: rgba(77,116,255,0.14);
// //           --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
// //           --site-header-h: 40px;
// //           --rail-w-open: 240px;
// //           --rail-w-closed: 52px;
// //           --ref-w: 340px;
// //         }

// //         /* ── Skip link ──────────────────────────────────────── */
// //         .skip-link {
// //           position: absolute;
// //           left: -9999px;
// //           top: 8px;
// //           padding: 8px 14px;
// //           background: var(--primary);
// //           color: #fff;
// //           text-decoration: none;
// //           border-radius: 6px;
// //           font-weight: 600;
// //           z-index: 100;
// //           border: 1.5px solid var(--primary-hover);
// //         }
// //         .skip-link:focus { left: 8px; }

// //         /* ── Left rail ──────────────────────────────────────── */
// //         .left-rail {
// //           width: var(--rail-w-open);
// //           border-right: 1.5px solid var(--border);
// //           padding: 14px 12px 40px;
// //           position: sticky;
// //           top: var(--site-header-h);
// //           align-self: start;
// //           max-height: calc(100vh - var(--site-header-h));
// //           overflow-y: auto;
// //           transition: width 0.22s ease, padding 0.22s;
// //           background: var(--bg);
// //           box-sizing: border-box;
// //         }
// //         .classic.rail-folded .left-rail {
// //           width: var(--rail-w-closed);
// //           padding: 14px 4px 40px;
// //         }

// //         .rail-toggle-row {
// //           display: flex;
// //           align-items: center;
// //           justify-content: space-between;
// //           padding: 2px 8px 12px;
// //           position: sticky;
// //           top: 0;
// //           background: var(--bg);
// //           z-index: 2;
// //           border-bottom: 1.5px solid var(--border);
// //           margin-bottom: 10px;
// //         }
// //         .classic.rail-folded .rail-toggle-row {
// //           justify-content: center;
// //           padding: 2px 0 12px;
// //         }
// //         .rail-title-mini {
// //           font-size: 10.5px;
// //           font-weight: 700;
// //           color: var(--text-subtle);
// //           letter-spacing: 0.09em;
// //           text-transform: uppercase;
// //           padding-left: 4px;
// //         }
// //         .classic.rail-folded .rail-title-mini { display: none; }

// //         .rail-chev {
// //           width: 28px;
// //           height: 28px;
// //           display: inline-flex;
// //           align-items: center;
// //           justify-content: center;
// //           border: 1.5px solid var(--border-strong);
// //           background: var(--surface);
// //           border-radius: 6px;
// //           color: var(--text-muted);
// //           cursor: pointer;
// //           font-family: var(--font-mono);
// //           font-size: 14px;
// //           line-height: 1;
// //           padding: 0;
// //           transition: transform 0.2s, border-color 0.15s, color 0.15s, background 0.15s;
// //         }
// //         .rail-chev:hover {
// //           border-color: var(--primary);
// //           color: var(--primary);
// //           background: var(--primary-bg);
// //         }
// //         .rail-chev:focus-visible {
// //           outline: 2px solid var(--primary);
// //           outline-offset: 2px;
// //         }
// //         .classic.rail-folded .rail-chev { transform: scaleX(-1); }

// //         .rail-head {
// //           padding: 10px 12px 8px;
// //           color: var(--text-subtle);
// //           font-size: 11px;
// //           font-weight: 700;
// //           letter-spacing: 0.08em;
// //           text-transform: uppercase;
// //         }
// //         .classic.rail-folded .rail-head { display: none; }
// //         .rail-group + .rail-group { margin-top: 10px; }
// //         .classic.rail-folded .rail-group + .rail-group {
// //           padding-top: 10px;
// //           border-top: 1.5px solid var(--border);
// //         }

// //         /* Rail items — cold blue hover, stronger borders.
// //            Note: NO overflow:hidden here (v3 had it and it clipped
// //            the old inline tooltip). Label truncation is handled with
// //            text-overflow:ellipsis on .lbl below. */
// //         .rail-item {
// //           display: flex;
// //           align-items: center;
// //           gap: 12px;
// //           padding: 8px 12px;
// //           border-radius: 7px;
// //           color: var(--text-muted);
// //           font-size: 13.5px;
// //           line-height: 1.35;
// //           position: relative;
// //           text-decoration: none;
// //           border: 1.5px solid transparent;
// //           transition: background 0.12s, color 0.12s, border-color 0.12s, transform 0.1s;
// //         }
// //         .rail-item .sym {
// //           font-family: var(--font-mono);
// //           font-size: 12px;
// //           font-weight: 700;
// //           color: var(--text-subtle);
// //           width: 22px;
// //           text-align: center;
// //           flex-shrink: 0;
// //           transition: color 0.12s;
// //         }
// //         .rail-item .lbl {
// //           min-width: 0;
// //           overflow: hidden;
// //           text-overflow: ellipsis;
// //           white-space: nowrap;
// //         }
// //         .rail-item:hover {
// //           background: var(--surface-alt);
// //           color: var(--text-strong);
// //           border-color: var(--border);
// //           transform: translateX(2px);
// //         }
// //         .rail-item:hover .sym { color: var(--primary); }
// //         .rail-item.active {
// //           background: var(--primary-bg);
// //           color: var(--primary);
// //           font-weight: 600;
// //           border-color: transparent;
// //         }
// //         .rail-item.active .sym { color: var(--primary); }
// //         .rail-item.active::before {
// //           content: "";
// //           position: absolute;
// //           left: -3px;
// //           top: 8px;
// //           bottom: 8px;
// //           width: 3px;
// //           background: var(--primary);
// //           border-radius: 0 3px 3px 0;
// //         }

// //         .classic.rail-folded .rail-item {
// //           justify-content: center;
// //           padding: 10px 0;
// //           gap: 0;
// //         }
// //         .classic.rail-folded .rail-item .lbl { display: none; }
// //         .classic.rail-folded .rail-item .sym {
// //           width: auto;
// //           font-size: 14px;
// //         }
// //         .classic.rail-folded .rail-item:hover { transform: none; }
// //         .classic.rail-folded .rail-item.active::before { top: 4px; bottom: 4px; }

// //         @media (max-width: 780px) {
// //           .classic, .classic.has-left {
// //             grid-template-columns: 1fr;
// //           }
// //           .left-rail { display: none; }
// //         }

// //         /* ── Fixed tooltip — rendered once at layout root ───── */
// //         .fixed-tt {
// //           position: fixed;
// //           transform: translateY(-50%);
// //           background: #0f172a;
// //           color: #fff;
// //           padding: 10px 14px;
// //           border-radius: 8px;
// //           min-width: 180px;
// //           max-width: 280px;
// //           font-size: 12.5px;
// //           line-height: 1.5;
// //           z-index: 1000;
// //           box-shadow: 0 8px 24px rgba(15,23,42,0.24);
// //           pointer-events: none;
// //           font-weight: 400;
// //           animation: tt-in 0.14s ease-out;
// //         }
// //         .fixed-tt b {
// //           display: block;
// //           font-weight: 700;
// //           font-size: 13px;
// //           color: #fff;
// //         }
// //         .fixed-tt .tt-blurb {
// //           display: block;
// //           margin-top: 4px;
// //           color: #e2e8f0;
// //         }
// //         .fixed-tt .tt-arrow {
// //           position: absolute;
// //           right: 100%;
// //           top: 50%;
// //           transform: translateY(-50%);
// //           border: 6px solid transparent;
// //           border-right-color: #0f172a;
// //         }
// //         @keyframes tt-in {
// //           from { opacity: 0; transform: translate(-4px, -50%); }
// //           to   { opacity: 1; transform: translate(0, -50%); }
// //         }

// //         /* ── Main ───────────────────────────────────────────── */
// //         .classic-main {
// //           padding: 28px 40px 64px;
// //           min-width: 0;
// //         }

// //         .callout {
// //           background: var(--primary-bg);
// //           border: 1.5px solid #C8D4F6;
// //           border-radius: 12px;
// //           padding: 14px 18px;
// //           margin-bottom: 24px;
// //           font-size: 14px;
// //           line-height: 1.55;
// //           display: flex;
// //           gap: 12px;
// //           align-items: flex-start;
// //           color: var(--text);
// //         }
// //         .callout-icon {
// //           width: 22px;
// //           height: 22px;
// //           background: var(--primary);
// //           color: #fff;
// //           border-radius: 50%;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-size: 13px;
// //           font-weight: 700;
// //           flex-shrink: 0;
// //           margin-top: 1px;
// //           font-style: italic;
// //           font-family: Georgia, serif;
// //         }
// //         .callout .jump {
// //           color: var(--primary);
// //           font-weight: 600;
// //           text-decoration: underline;
// //           white-space: nowrap;
// //           margin-left: 4px;
// //           transition: color 0.12s;
// //         }
// //         .callout .jump:hover { color: var(--primary-hover); }

// //         /* ── Above the fold ─────────────────────────────────── */
// //         .above-fold { margin-bottom: 48px; }
// //         .above-fold.has-ref {
// //           display: grid;
// //           grid-template-columns: minmax(0, 1fr) var(--ref-w);
// //           gap: 24px;
// //         }
// //         @media (max-width: 1160px) {
// //           .above-fold.has-ref { grid-template-columns: 1fr; }
// //         }
// //         .tool-region {
// //           min-width: 0;
// //           border: 1.5px solid var(--border-strong);
// //           border-radius: 16px;
// //           background: var(--surface);
// //           box-shadow: 0 4px 20px rgba(15,23,42,0.06);
// //           overflow: hidden;
// //         }
// //         .ref-panel {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 16px;
// //           min-width: 0;
// //         }

// //         /* ── Below the fold ─────────────────────────────────── */
// //         .below-fold {
// //           display: grid;
// //           grid-template-columns: 220px minmax(0, 1fr);
// //           gap: 48px;
// //           padding-top: 28px;
// //           border-top: 1.5px solid var(--border);
// //         }
// //         @media (max-width: 900px) {
// //           .below-fold { grid-template-columns: 1fr; }
// //           .toc-rail { display: none; }
// //         }
// //         .toc-rail {
// //           position: sticky;
// //           top: calc(var(--site-header-h) + 24px);
// //           align-self: start;
// //           padding: 4px 0;
// //         }
// //         .toc-head {
// //           color: var(--text-subtle);
// //           font-size: 11px;
// //           font-weight: 700;
// //           letter-spacing: 0.08em;
// //           text-transform: uppercase;
// //           padding: 4px 10px 10px;
// //         }
// //         .toc-list { display: flex; flex-direction: column; }
// //         .toc-list a {
// //           display: flex;
// //           align-items: center;
// //           gap: 10px;
// //           padding: 7px 12px;
// //           color: var(--text-muted);
// //           font-size: 13px;
// //           border-left: 2px solid transparent;
// //           text-decoration: none;
// //           transition: color 0.12s, background 0.12s, border-left-color 0.12s;
// //         }
// //         .toc-list a:hover {
// //           color: var(--primary);
// //           background: var(--surface-alt);
// //         }
// //         .toc-list a.active {
// //           color: var(--primary);
// //           border-left-color: var(--primary);
// //           font-weight: 600;
// //           background: var(--primary-bg);
// //         }

// //         .doc {
// //           padding: 24px 0 12px;
// //           scroll-margin-top: calc(var(--site-header-h) + 24px);
// //         }
// //         .doc + .doc {
// //           border-top: 1.5px solid var(--border);
// //           margin-top: 20px;
// //         }
// //         .doc h2 {
// //           font-size: 22px;
// //           font-weight: 700;
// //           color: var(--text-strong);
// //           letter-spacing: -0.01em;
// //           margin: 0 0 14px;
// //         }
// //         .doc-content { color: var(--text); max-width: 780px; }
// //         .doc-content :global(p) {
// //           color: var(--text-muted);
// //           margin: 0 0 14px;
// //           font-size: 15px;
// //           line-height: 1.7;
// //         }
// //         .doc-content :global(ul),
// //         .doc-content :global(ol) {
// //           margin: 8px 0 16px 22px;
// //           color: var(--text-muted);
// //           font-size: 15px;
// //         }
// //         .doc-content :global(li) {
// //           margin-bottom: 6px;
// //           line-height: 1.65;
// //         }
// //         .doc-content :global(code) {
// //           background: var(--surface-code);
// //           padding: 2px 7px;
// //           border-radius: 5px;
// //           font-family: var(--font-mono);
// //           font-size: 13px;
// //           color: var(--primary);
// //           border: 1px solid var(--border);
// //         }
// //         .doc-content :global(strong) { color: var(--text-strong); font-weight: 700; }
// //         .doc-content :global(a) {
// //           color: var(--primary);
// //           text-decoration: underline;
// //           transition: color 0.12s;
// //         }
// //         .doc-content :global(a:hover) { color: var(--primary-hover); }
// //       `}</style>
// //     </div>
// //   );
// // }


// // ClassicLayout.jsx  ── v7
// // ─────────────────────────────────────────────────────────────
// // Change vs v6: callout now supports multiple jump links.
// //
// // New shape:
// //   callout: {
// //     text,
// //     jumps: [ { to: 'how', label: 'How to use ↓' },
// //              { to: 'shortcuts', label: 'Shortcuts ↓' } ],
// //   }
// //
// // Backward compat: if `jumps` is absent but `jumpTo` is present,
// // it's normalized to a single-item array. Existing pages keep
// // working without changes.
// //
// // Links are separated visually by a small centered dot.
// // ─────────────────────────────────────────────────────────────

// import { useState, useRef, useEffect } from 'react';

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

// // Normalize callout jump links into a single array shape.
// // Supports:
// //   • callout.jumps = [ { to, label }, ... ]           (preferred)
// //   • callout.jumpTo + callout.jumpLabel (single link) (legacy)
// function normalizeJumps(callout) {
//   if (!callout) return [];
//   if (Array.isArray(callout.jumps)) return callout.jumps;
//   if (callout.jumpTo) return [{ to: callout.jumpTo, label: callout.jumpLabel || 'How to use \u2193' }];
//   return [];
// }

// export default function ClassicLayout({
//   theme = 'light',
//   initialSidebar = 'folded',
//   siblings = [],
//   siblingGroups,
//   callout,
//   sections = [],
//   referencePanel = null,
//   children,
// }) {
//   const [folded, setFolded] = useState(initialSidebar === 'folded');
//   const [activeSection, setActiveSection] = useState(
//     sections.length ? sections[0].id : null
//   );
//   const [hoverTip, setHoverTip] = useState(null);

//   const foldedRef = useRef(folded);
//   useEffect(() => { foldedRef.current = folded; }, [folded]);

//   const overrideActive = useRef(false);

//   const toolRef      = useRef(null);
//   const belowFoldRef = useRef(null);
//   const sectionRefs  = useRef({});

//   useEffect(() => {
//     const onScroll = () => {
//       const el = belowFoldRef.current;
//       if (!el) return;
//       const top = el.getBoundingClientRect().top;
//       const wantFolded = top < window.innerHeight * 0.5;

//       if (overrideActive.current) {
//         if (wantFolded === foldedRef.current) {
//           overrideActive.current = false;
//         }
//         return;
//       }

//       if (wantFolded !== foldedRef.current) {
//         setFolded(wantFolded);
//       }
//     };
//     onScroll();
//     window.addEventListener('scroll', onScroll, { passive: true });
//     window.addEventListener('resize', onScroll, { passive: true });
//     return () => {
//       window.removeEventListener('scroll', onScroll);
//       window.removeEventListener('resize', onScroll);
//     };
//   }, []);

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

//   useEffect(() => {
//     if (!hoverTip) return;
//     const clear = () => setHoverTip(null);
//     window.addEventListener('scroll', clear, { passive: true });
//     return () => window.removeEventListener('scroll', clear);
//   }, [hoverTip]);

//   const toggleChevron = () => {
//     overrideActive.current = true;
//     setFolded((f) => !f);
//   };

//   const showTip = (e, item) => {
//     if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     setHoverTip({
//       title: item.title,
//       blurb: item.blurb || '',
//       top: rect.top + rect.height / 2,
//       left: rect.right + 14,
//     });
//   };
//   const hideTip = () => setHoverTip(null);

//   const groups      = (siblingGroups && siblingGroups.length)
//                         ? siblingGroups
//                         : (siblings.length ? [{ heading: null, items: siblings }] : []);
//   const hasBelowFold = sections && sections.length > 0;
//   const hasLeft      = groups.length > 0;
//   const isTerminal   = theme === 'terminal';
//   const jumps        = normalizeJumps(callout);

//   const pageClass =
//     'classic' +
//     (isTerminal ? ' theme-terminal' : ' theme-light') +
//     (hasLeft ? ' has-left' : '') +
//     (folded ? ' rail-folded' : ' rail-expanded');

//   return (
//     <div className={pageClass}>

//       <a href="#tool-region" className="skip-link">Skip to tool</a>

//       {hasLeft && (
//         <aside className="left-rail" aria-label="Related tools">

//           <div className="rail-toggle-row">
//             <span className="rail-title-mini">Related</span>
//             <button
//               type="button"
//               className="rail-chev"
//               onClick={toggleChevron}
//               aria-label={folded ? 'Expand sidebar' : 'Collapse sidebar'}
//               aria-expanded={!folded}
//               title={folded ? 'Expand sidebar' : 'Collapse sidebar'}
//             >&lsaquo;</button>
//           </div>

//           {groups.map((g, gi) => (
//             <div className="rail-group" key={gi}>
//               {g.heading && <div className="rail-head">{g.heading}</div>}
//               <nav>
//                 {g.items.map((it) => (
//                   <a
//                     key={it.slug || it.href}
//                     href={it.href}
//                     className={`rail-item ${it.active ? 'active' : ''}`}
//                     onMouseEnter={(e) => showTip(e, it)}
//                     onMouseLeave={hideTip}
//                     onFocus={(e) => showTip(e, it)}
//                     onBlur={hideTip}
//                   >
//                     <span className="sym" aria-hidden="true">
//                       {generateIcon(it.category, it.slug)}
//                     </span>
//                     <span className="lbl">{it.title}</span>
//                   </a>
//                 ))}
//               </nav>
//             </div>
//           ))}
//         </aside>
//       )}

//       <main className="classic-main">

//         {callout && (
//           <div className="callout">
//             <div className="callout-icon" aria-hidden="true">i</div>
//             <div>
//               {callout.text}
//               {jumps.length > 0 && (
//                 <>
//                   {' '}
//                   {jumps.map((j, i) => (
//                     <span key={j.to}>
//                       {i > 0 && <span className="jump-sep">&middot;</span>}
//                       <a className="jump" href={`#${j.to}`}>{j.label}</a>
//                     </span>
//                   ))}
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         <div className={`above-fold ${referencePanel ? 'has-ref' : ''}`}>
//           <div className="tool-region" id="tool-region" ref={toolRef}>
//             {children}
//           </div>
//           {referencePanel && (
//             <aside className="ref-panel" aria-label="Quick reference">
//               {referencePanel}
//             </aside>
//           )}
//         </div>

//         {hasBelowFold && (
//           <div className="below-fold" ref={belowFoldRef}>

//             <aside className="toc-rail" aria-label="On this page">
//               <div className="toc-head">On this page</div>
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
//                   className={`doc doc-${s.kind || 'prose'}`}
//                 >
//                   <h2>{s.title}</h2>
//                   <div className="doc-content">{s.content}</div>
//                 </section>
//               ))}
//             </div>

//           </div>
//         )}
//       </main>

//       {hoverTip && (
//         <div
//           className="fixed-tt"
//           role="tooltip"
//           style={{
//             top:  hoverTip.top,
//             left: hoverTip.left,
//           }}
//         >
//           <b>{hoverTip.title}</b>
//           {hoverTip.blurb && <span className="tt-blurb">{hoverTip.blurb}</span>}
//           <span className="tt-arrow" aria-hidden="true" />
//         </div>
//       )}

//       <style jsx>{`
//         .classic {
//           min-height: 100vh;
//           width: 100%;
//           max-width: 1700px;
//           margin: 0 auto;
//           border-top: 1px solid var(--border);
//           box-sizing: border-box;
//           display: grid;
//           grid-template-columns: 1fr;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
//           font-size: 15px;
//           line-height: 1.55;
//           color: var(--text);
//           background: var(--bg);
//           -webkit-font-smoothing: antialiased;
//         }
//         .classic.has-left {
//           grid-template-columns: auto 1fr;
//         }

//         .classic.theme-light {
//           --bg: #ffffff;
//           --surface: #ffffff;
//           --surface-alt: #f5f7fb;
//           --surface-code: #eff2f8;
//           --text: #0f172a;
//           --text-strong: #030712;
//           --text-muted: #475569;
//           --text-subtle: #64748b;
//           --border: #cfd6e0;
//           --border-strong: #a3b0c6;
//           --primary: #1B50EE;
//           --primary-hover: #133EBF;
//           --primary-bg: #E8EEFB;
//           --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
//           --site-header-h: 52px;
//           --rail-w-open: 240px;
//           --rail-w-closed: 56px;
//           --ref-w: 340px;
//         }
//         .classic.theme-terminal {
//           --bg: #0A0D14;
//           --surface: #101623;
//           --surface-alt: #141b2b;
//           --surface-code: #0a0e18;
//           --text: #d4dae5;
//           --text-strong: #ffffff;
//           --text-muted: #97a3b8;
//           --text-subtle: #6b7891;
//           --border: #1e2637;
//           --border-strong: #2d3a52;
//           --primary: #4D74FF;
//           --primary-hover: #6A8BFF;
//           --primary-bg: rgba(77,116,255,0.14);
//           --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
//           --site-header-h: 40px;
//           --rail-w-open: 240px;
//           --rail-w-closed: 52px;
//           --ref-w: 340px;
//         }

//         .skip-link {
//           position: absolute;
//           left: -9999px;
//           top: 8px;
//           padding: 8px 14px;
//           background: var(--primary);
//           color: #fff;
//           text-decoration: none;
//           border-radius: 6px;
//           font-weight: 600;
//           z-index: 100;
//           border: 1.5px solid var(--primary-hover);
//         }
//         .skip-link:focus { left: 8px; }

//         .left-rail {
//           width: var(--rail-w-open);
//           border-right: 1.5px solid var(--border);
//           padding: 14px 12px 40px;
//           position: sticky;
//           top: var(--site-header-h);
//           align-self: start;
//           max-height: calc(100vh - var(--site-header-h));
//           overflow-y: auto;
//           transition: width 0.22s ease, padding 0.22s;
//           background: var(--bg);
//           box-sizing: border-box;
//         }
//         .classic.rail-folded .left-rail {
//           width: var(--rail-w-closed);
//           padding: 14px 4px 40px;
//         }

//         .rail-toggle-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 2px 8px 12px;
//           position: sticky;
//           top: 0;
//           background: var(--bg);
//           z-index: 2;
//           border-bottom: 1.5px solid var(--border);
//           margin-bottom: 10px;
//         }
//         .classic.rail-folded .rail-toggle-row {
//           justify-content: center;
//           padding: 2px 0 12px;
//         }
//         .rail-title-mini {
//           font-size: 10.5px;
//           font-weight: 700;
//           color: var(--text-subtle);
//           letter-spacing: 0.09em;
//           text-transform: uppercase;
//           padding-left: 4px;
//         }
//         .classic.rail-folded .rail-title-mini { display: none; }

//         .rail-chev {
//           width: 28px;
//           height: 28px;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           border: 1.5px solid var(--border-strong);
//           background: var(--surface);
//           border-radius: 6px;
//           color: var(--text-muted);
//           cursor: pointer;
//           font-family: var(--font-mono);
//           font-size: 14px;
//           line-height: 1;
//           padding: 0;
//           transition: transform 0.2s, border-color 0.15s, color 0.15s, background 0.15s;
//         }
//         .rail-chev:hover {
//           border-color: var(--primary);
//           color: var(--primary);
//           background: var(--primary-bg);
//         }
//         .rail-chev:focus-visible {
//           outline: 2px solid var(--primary);
//           outline-offset: 2px;
//         }
//         .classic.rail-folded .rail-chev { transform: scaleX(-1); }

//         .rail-head {
//           padding: 10px 12px 8px;
//           color: var(--text-subtle);
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//         }
//         .classic.rail-folded .rail-head { display: none; }
//         .rail-group + .rail-group { margin-top: 10px; }
//         .classic.rail-folded .rail-group + .rail-group {
//           padding-top: 10px;
//           border-top: 1.5px solid var(--border);
//         }

//         .rail-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 8px 12px;
//           border-radius: 7px;
//           color: var(--text-muted);
//           font-size: 13.5px;
//           line-height: 1.35;
//           position: relative;
//           text-decoration: none;
//           border: 1.5px solid transparent;
//           transition: background 0.12s, color 0.12s, border-color 0.12s, transform 0.1s;
//         }
//         .rail-item .sym {
//           font-family: var(--font-mono);
//           font-size: 12px;
//           font-weight: 700;
//           color: var(--text-subtle);
//           width: 22px;
//           text-align: center;
//           flex-shrink: 0;
//           transition: color 0.12s;
//         }
//         .rail-item .lbl {
//           min-width: 0;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }
//         .rail-item:hover {
//           background: var(--surface-alt);
//           color: var(--text-strong);
//           border-color: var(--border);
//           transform: translateX(2px);
//         }
//         .rail-item:hover .sym { color: var(--primary); }
//         .rail-item.active {
//           background: var(--primary-bg);
//           color: var(--primary);
//           font-weight: 600;
//           border-color: transparent;
//         }
//         .rail-item.active .sym { color: var(--primary); }
//         .rail-item.active::before {
//           content: "";
//           position: absolute;
//           left: -3px;
//           top: 8px;
//           bottom: 8px;
//           width: 3px;
//           background: var(--primary);
//           border-radius: 0 3px 3px 0;
//         }

//         .classic.rail-folded .rail-item {
//           justify-content: center;
//           padding: 10px 0;
//           gap: 0;
//         }
//         .classic.rail-folded .rail-item .lbl { display: none; }
//         .classic.rail-folded .rail-item .sym {
//           width: auto;
//           font-size: 14px;
//         }
//         .classic.rail-folded .rail-item:hover { transform: none; }
//         .classic.rail-folded .rail-item.active::before { top: 4px; bottom: 4px; }

//         @media (max-width: 780px) {
//           .classic, .classic.has-left {
//             grid-template-columns: 1fr;
//           }
//           .left-rail { display: none; }
//         }

//         .fixed-tt {
//           position: fixed;
//           transform: translateY(-50%);
//           background: #0f172a;
//           color: #fff;
//           padding: 10px 14px;
//           border-radius: 8px;
//           min-width: 180px;
//           max-width: 280px;
//           font-size: 12.5px;
//           line-height: 1.5;
//           z-index: 1000;
//           box-shadow: 0 8px 24px rgba(15,23,42,0.24);
//           pointer-events: none;
//           font-weight: 400;
//           animation: tt-in 0.14s ease-out;
//         }
//         .fixed-tt b {
//           display: block;
//           font-weight: 700;
//           font-size: 13px;
//           color: #fff;
//         }
//         .fixed-tt .tt-blurb {
//           display: block;
//           margin-top: 4px;
//           color: #e2e8f0;
//         }
//         .fixed-tt .tt-arrow {
//           position: absolute;
//           right: 100%;
//           top: 50%;
//           transform: translateY(-50%);
//           border: 6px solid transparent;
//           border-right-color: #0f172a;
//         }
//         @keyframes tt-in {
//           from { opacity: 0; transform: translate(-4px, -50%); }
//           to   { opacity: 1; transform: translate(0, -50%); }
//         }

//         .classic-main {
//           padding: 28px 40px 64px;
//           min-width: 0;
//         }

//         .callout {
//           background: var(--primary-bg);
//           border: 1.5px solid #C8D4F6;
//           border-radius: 12px;
//           padding: 14px 18px;
//           margin-bottom: 24px;
//           font-size: 14px;
//           line-height: 1.55;
//           display: flex;
//           gap: 12px;
//           align-items: flex-start;
//           color: var(--text);
//         }
//         .callout-icon {
//           width: 22px;
//           height: 22px;
//           background: var(--primary);
//           color: #fff;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 13px;
//           font-weight: 700;
//           flex-shrink: 0;
//           margin-top: 1px;
//           font-style: italic;
//           font-family: Georgia, serif;
//         }
//         .callout .jump {
//           color: var(--primary);
//           font-weight: 600;
//           text-decoration: underline;
//           white-space: nowrap;
//           transition: color 0.12s;
//         }
//         .callout .jump:hover { color: var(--primary-hover); }
//         .callout .jump-sep {
//           color: var(--text-subtle);
//           margin: 0 8px;
//           font-weight: 700;
//         }

//         .above-fold { margin-bottom: 48px; }
//         .above-fold.has-ref {
//           display: grid;
//           grid-template-columns: minmax(0, 1fr) var(--ref-w);
//           gap: 24px;
//         }
//         @media (max-width: 1160px) {
//           .above-fold.has-ref { grid-template-columns: 1fr; }
//         }
//         .tool-region {
//           min-width: 0;
//           border: 1.5px solid var(--border-strong);
//           border-radius: 16px;
//           background: var(--surface);
//           box-shadow: 0 4px 20px rgba(15,23,42,0.06);
//           overflow: hidden;
//         }
//         .ref-panel {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//           min-width: 0;
//         }

//         .below-fold {
//           display: grid;
//           grid-template-columns: 220px minmax(0, 1fr);
//           gap: 48px;
//           padding-top: 28px;
//           border-top: 1.5px solid var(--border);
//         }
//         @media (max-width: 900px) {
//           .below-fold { grid-template-columns: 1fr; }
//           .toc-rail { display: none; }
//         }
//         .toc-rail {
//           position: sticky;
//           top: calc(var(--site-header-h) + 24px);
//           align-self: start;
//           padding: 4px 0;
//         }
//         .toc-head {
//           color: var(--text-subtle);
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           padding: 4px 10px 10px;
//         }
//         .toc-list { display: flex; flex-direction: column; }
//         .toc-list a {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 7px 12px;
//           color: var(--text-muted);
//           font-size: 13px;
//           border-left: 2px solid transparent;
//           text-decoration: none;
//           transition: color 0.12s, background 0.12s, border-left-color 0.12s;
//         }
//         .toc-list a:hover {
//           color: var(--primary);
//           background: var(--surface-alt);
//         }
//         .toc-list a.active {
//           color: var(--primary);
//           border-left-color: var(--primary);
//           font-weight: 600;
//           background: var(--primary-bg);
//         }

//         .doc {
//           padding: 24px 0 12px;
//           scroll-margin-top: calc(var(--site-header-h) + 24px);
//         }
//         .doc + .doc {
//           border-top: 1.5px solid var(--border);
//           margin-top: 20px;
//         }
//         .doc h2 {
//           font-size: 22px;
//           font-weight: 700;
//           color: var(--text-strong);
//           letter-spacing: -0.01em;
//           margin: 0 0 14px;
//         }
//         .doc-content { color: var(--text); max-width: 780px; }
//         .doc-content :global(p) {
//           color: var(--text-muted);
//           margin: 0 0 14px;
//           font-size: 15px;
//           line-height: 1.7;
//         }
//         .doc-content :global(ul),
//         .doc-content :global(ol) {
//           margin: 8px 0 16px 22px;
//           color: var(--text-muted);
//           font-size: 15px;
//         }
//         .doc-content :global(li) {
//           margin-bottom: 6px;
//           line-height: 1.65;
//         }
//         .doc-content :global(code) {
//           background: var(--surface-code);
//           padding: 2px 7px;
//           border-radius: 5px;
//           font-family: var(--font-mono);
//           font-size: 13px;
//           color: var(--primary);
//           border: 1px solid var(--border);
//         }
//         .doc-content :global(strong) { color: var(--text-strong); font-weight: 700; }
//         .doc-content :global(a) {
//           color: var(--primary);
//           text-decoration: underline;
//           transition: color 0.12s;
//         }
//         .doc-content :global(a:hover) { color: var(--primary-hover); }
//       `}</style>
//     </div>
//   );
// }

// ClassicLayout.jsx  ── v9
// ─────────────────────────────────────────────────────────────
// Change vs v8: back-to-top is per-section, not a floating button.
// Each section renders a small "↑ Back to top" link at the end
// of its content, right-aligned. Clicking it scrolls to the
// tool region.
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';

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

function normalizeJumps(callout) {
  if (!callout) return [];
  if (Array.isArray(callout.jumps)) return callout.jumps;
  if (callout.jumpTo) return [{ to: callout.jumpTo, label: callout.jumpLabel || 'How to use \u2193' }];
  return [];
}

export default function ClassicLayout({
  theme = 'light',
  initialSidebar = 'folded',
  siblings = [],
  siblingGroups,
  callout,
  sections = [],
  referencePanel = null,
  children,
}) {
  const [folded, setFolded] = useState(initialSidebar === 'folded');
  const [activeSection, setActiveSection] = useState(
    sections.length ? sections[0].id : null
  );
  const [hoverTip, setHoverTip] = useState(null);

  const foldedRef = useRef(folded);
  useEffect(() => { foldedRef.current = folded; }, [folded]);

  const overrideActive = useRef(false);

  const toolRef      = useRef(null);
  const belowFoldRef = useRef(null);
  const sectionRefs  = useRef({});

  useEffect(() => {
    const onScroll = () => {
      const el = belowFoldRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const wantFolded = top < window.innerHeight * 0.5;

      if (overrideActive.current) {
        if (wantFolded === foldedRef.current) {
          overrideActive.current = false;
        }
        return;
      }

      if (wantFolded !== foldedRef.current) {
        setFolded(wantFolded);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

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

  useEffect(() => {
    if (!hoverTip) return;
    const clear = () => setHoverTip(null);
    window.addEventListener('scroll', clear, { passive: true });
    return () => window.removeEventListener('scroll', clear);
  }, [hoverTip]);

  const toggleChevron = () => {
    overrideActive.current = true;
    setFolded((f) => !f);
  };

  const showTip = (e, item) => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverTip({
      title: item.title,
      blurb: item.blurb || '',
      top: rect.top + rect.height / 2,
      left: rect.right + 14,
    });
  };
  const hideTip = () => setHoverTip(null);

  const handleBackToTop = (e) => {
    e.preventDefault();
    const el = document.getElementById('tool-region');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const groups      = (siblingGroups && siblingGroups.length)
                        ? siblingGroups
                        : (siblings.length ? [{ heading: null, items: siblings }] : []);
  const hasBelowFold = sections && sections.length > 0;
  const hasLeft      = groups.length > 0;
  const isTerminal   = theme === 'terminal';
  const jumps        = normalizeJumps(callout);

  const pageClass =
    'classic' +
    (isTerminal ? ' theme-terminal' : ' theme-light') +
    (hasLeft ? ' has-left' : '') +
    (folded ? ' rail-folded' : ' rail-expanded');

  return (
    <div className={pageClass}>

      <a href="#tool-region" className="skip-link">Skip to tool</a>

      {hasLeft && (
        <aside className="left-rail" aria-label="Related tools">

          <div className="rail-toggle-row">
            <span className="rail-title-mini">Related</span>
            <button
              type="button"
              className="rail-chev"
              onClick={toggleChevron}
              aria-label={folded ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!folded}
              title={folded ? 'Expand sidebar' : 'Collapse sidebar'}
            >&lsaquo;</button>
          </div>

          {groups.map((g, gi) => (
            <div className="rail-group" key={gi}>
              {g.heading && <div className="rail-head">{g.heading}</div>}
              <nav>
                {g.items.map((it) => (
                  <a
                    key={it.slug || it.href}
                    href={it.href}
                    className={`rail-item ${it.active ? 'active' : ''}`}
                    onMouseEnter={(e) => showTip(e, it)}
                    onMouseLeave={hideTip}
                    onFocus={(e) => showTip(e, it)}
                    onBlur={hideTip}
                  >
                    <span className="sym" aria-hidden="true">
                      {generateIcon(it.category, it.slug)}
                    </span>
                    <span className="lbl">{it.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </aside>
      )}

      <main className="classic-main">

        {callout && (
          <div className="callout">
            <div className="callout-icon" aria-hidden="true">i</div>
            <div>
              {callout.text}
              {jumps.length > 0 && (
                <>
                  {' '}
                  {jumps.map((j, i) => (
                    <span key={j.to}>
                      {i > 0 && <span className="jump-sep">&middot;</span>}
                      <a className="jump" href={`#${j.to}`}>{j.label}</a>
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        <div className={`above-fold ${referencePanel ? 'has-ref' : ''}`}>
          <div className="tool-region" id="tool-region" ref={toolRef}>
            {children}
          </div>
          {referencePanel && (
            <aside className="ref-panel" aria-label="Quick reference">
              {referencePanel}
            </aside>
          )}
        </div>

        {hasBelowFold && (
          <div className="below-fold" ref={belowFoldRef}>

            <aside className="toc-rail" aria-label="On this page">
              <div className="toc-head">On this page</div>
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
                  className={`doc doc-${s.kind || 'prose'}`}
                >
                  <h2>{s.title}</h2>
                  <div className="doc-content">{s.content}</div>
                  <div className="back-to-top-row">
                    <a
                      href="#tool-region"
                      className="back-to-top-link"
                      onClick={handleBackToTop}
                    >
                      <span aria-hidden="true">&uarr;</span> Back to top
                    </a>
                  </div>
                </section>
              ))}
            </div>

          </div>
        )}
      </main>

      {hoverTip && (
        <div
          className="fixed-tt"
          role="tooltip"
          style={{
            top:  hoverTip.top,
            left: hoverTip.left,
          }}
        >
          <b>{hoverTip.title}</b>
          {hoverTip.blurb && <span className="tt-blurb">{hoverTip.blurb}</span>}
          <span className="tt-arrow" aria-hidden="true" />
        </div>
      )}

      <style jsx>{`
        .classic {
          min-height: 100vh;
          width: 100%;
          max-width: 1700px;
          margin: 0 auto;
          border-top: 1px solid var(--border);
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.55;
          color: var(--text);
          background: var(--bg);
          -webkit-font-smoothing: antialiased;
        }
        .classic.has-left {
          grid-template-columns: auto 1fr;
        }

        .classic.theme-light {
          --bg: #ffffff;
          --surface: #ffffff;
          --surface-alt: #f5f7fb;
          --surface-code: #eff2f8;
          --text: #0f172a;
          --text-strong: #030712;
          --text-muted: #475569;
          --text-subtle: #64748b;
          --border: #cfd6e0;
          --border-strong: #a3b0c6;
          --primary: #1B50EE;
          --primary-hover: #133EBF;
          --primary-bg: #E8EEFB;
          --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
          --site-header-h: 52px;
          --rail-w-open: 240px;
          --rail-w-closed: 56px;
          --ref-w: 340px;
        }
        .classic.theme-terminal {
          --bg: #0A0D14;
          --surface: #101623;
          --surface-alt: #141b2b;
          --surface-code: #0a0e18;
          --text: #d4dae5;
          --text-strong: #ffffff;
          --text-muted: #97a3b8;
          --text-subtle: #6b7891;
          --border: #1e2637;
          --border-strong: #2d3a52;
          --primary: #4D74FF;
          --primary-hover: #6A8BFF;
          --primary-bg: rgba(77,116,255,0.14);
          --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
          --site-header-h: 40px;
          --rail-w-open: 240px;
          --rail-w-closed: 52px;
          --ref-w: 340px;
        }

        .skip-link {
          position: absolute;
          left: -9999px;
          top: 8px;
          padding: 8px 14px;
          background: var(--primary);
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          z-index: 100;
          border: 1.5px solid var(--primary-hover);
        }
        .skip-link:focus { left: 8px; }

        .left-rail {
          width: var(--rail-w-open);
          border-right: 1.5px solid var(--border);
          padding: 14px 12px 40px;
          position: sticky;
          top: var(--site-header-h);
          align-self: start;
          max-height: calc(100vh - var(--site-header-h));
          overflow-y: auto;
          transition: width 0.22s ease, padding 0.22s;
          background: var(--bg);
          box-sizing: border-box;
        }
        .classic.rail-folded .left-rail {
          width: var(--rail-w-closed);
          padding: 14px 4px 40px;
        }

        .rail-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px 8px 12px;
          position: sticky;
          top: 0;
          background: var(--bg);
          z-index: 2;
          border-bottom: 1.5px solid var(--border);
          margin-bottom: 10px;
        }
        .classic.rail-folded .rail-toggle-row {
          justify-content: center;
          padding: 2px 0 12px;
        }
        .rail-title-mini {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-subtle);
          letter-spacing: 0.09em;
          text-transform: uppercase;
          padding-left: 4px;
        }
        .classic.rail-folded .rail-title-mini { display: none; }

        .rail-chev {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--border-strong);
          background: var(--surface);
          border-radius: 6px;
          color: var(--text-muted);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1;
          padding: 0;
          transition: transform 0.2s, border-color 0.15s, color 0.15s, background 0.15s;
        }
        .rail-chev:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-bg);
        }
        .rail-chev:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .classic.rail-folded .rail-chev { transform: scaleX(-1); }

        .rail-head {
          padding: 10px 12px 8px;
          color: var(--text-subtle);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .classic.rail-folded .rail-head { display: none; }
        .rail-group + .rail-group { margin-top: 10px; }
        .classic.rail-folded .rail-group + .rail-group {
          padding-top: 10px;
          border-top: 1.5px solid var(--border);
        }

        .rail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 7px;
          color: var(--text-muted);
          font-size: 13.5px;
          line-height: 1.35;
          position: relative;
          text-decoration: none;
          border: 1.5px solid transparent;
          transition: background 0.12s, color 0.12s, border-color 0.12s, transform 0.1s;
        }
        .rail-item .sym {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          color: var(--text-subtle);
          width: 22px;
          text-align: center;
          flex-shrink: 0;
          transition: color 0.12s;
        }
        .rail-item .lbl {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rail-item:hover {
          background: var(--surface-alt);
          color: var(--text-strong);
          border-color: var(--border);
          transform: translateX(2px);
        }
        .rail-item:hover .sym { color: var(--primary); }
        .rail-item.active {
          background: var(--primary-bg);
          color: var(--primary);
          font-weight: 600;
          border-color: transparent;
        }
        .rail-item.active .sym { color: var(--primary); }
        .rail-item.active::before {
          content: "";
          position: absolute;
          left: -3px;
          top: 8px;
          bottom: 8px;
          width: 3px;
          background: var(--primary);
          border-radius: 0 3px 3px 0;
        }

        .classic.rail-folded .rail-item {
          justify-content: center;
          padding: 10px 0;
          gap: 0;
        }
        .classic.rail-folded .rail-item .lbl { display: none; }
        .classic.rail-folded .rail-item .sym {
          width: auto;
          font-size: 14px;
        }
        .classic.rail-folded .rail-item:hover { transform: none; }
        .classic.rail-folded .rail-item.active::before { top: 4px; bottom: 4px; }

        @media (max-width: 780px) {
          .classic, .classic.has-left {
            grid-template-columns: 1fr;
          }
          .left-rail { display: none; }
        }

        .fixed-tt {
          position: fixed;
          transform: translateY(-50%);
          background: #0f172a;
          color: #fff;
          padding: 10px 14px;
          border-radius: 8px;
          min-width: 180px;
          max-width: 280px;
          font-size: 12.5px;
          line-height: 1.5;
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(15,23,42,0.24);
          pointer-events: none;
          font-weight: 400;
          animation: tt-in 0.14s ease-out;
        }
        .fixed-tt b {
          display: block;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
        }
        .fixed-tt .tt-blurb {
          display: block;
          margin-top: 4px;
          color: #e2e8f0;
        }
        .fixed-tt .tt-arrow {
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-right-color: #0f172a;
        }
        @keyframes tt-in {
          from { opacity: 0; transform: translate(-4px, -50%); }
          to   { opacity: 1; transform: translate(0, -50%); }
        }

        .classic-main {
          padding: 28px 40px 64px;
          min-width: 0;
        }

        .callout {
          background: var(--primary-bg);
          border: 1.5px solid #C8D4F6;
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 24px;
          font-size: 14px;
          line-height: 1.55;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          color: var(--text);
        }
        .callout-icon {
          width: 22px;
          height: 22px;
          background: var(--primary);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 1px;
          font-style: italic;
          font-family: Georgia, serif;
        }
        .callout .jump {
          color: var(--primary);
          font-weight: 600;
          text-decoration: underline;
          white-space: nowrap;
          transition: color 0.12s;
        }
        .callout .jump:hover { color: var(--primary-hover); }
        .callout .jump-sep {
          color: var(--text-subtle);
          margin: 0 8px;
          font-weight: 700;
        }

        .above-fold { margin-bottom: 48px; }
        .above-fold.has-ref {
          display: grid;
          grid-template-columns: minmax(0, 1fr) var(--ref-w);
          gap: 24px;
        }
        @media (max-width: 1160px) {
          .above-fold.has-ref { grid-template-columns: 1fr; }
        }
        .tool-region {
          min-width: 0;
          border: 1.5px solid var(--border-strong);
          border-radius: 16px;
          background: var(--surface);
          box-shadow: 0 4px 20px rgba(15,23,42,0.06);
          overflow: hidden;
          scroll-margin-top: calc(var(--site-header-h) + 20px);
        }
        .ref-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .below-fold {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 48px;
          padding-top: 28px;
          border-top: 1.5px solid var(--border);
        }
        @media (max-width: 900px) {
          .below-fold { grid-template-columns: 1fr; }
          .toc-rail { display: none; }
        }
        .toc-rail {
          position: sticky;
          top: calc(var(--site-header-h) + 24px);
          align-self: start;
          padding: 4px 0;
        }
        .toc-head {
          color: var(--text-subtle);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px 10px;
        }
        .toc-list { display: flex; flex-direction: column; }
        .toc-list a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 12px;
          color: var(--text-muted);
          font-size: 13px;
          border-left: 2px solid transparent;
          text-decoration: none;
          transition: color 0.12s, background 0.12s, border-left-color 0.12s;
        }
        .toc-list a:hover {
          color: var(--primary);
          background: var(--surface-alt);
        }
        .toc-list a.active {
          color: var(--primary);
          border-left-color: var(--primary);
          font-weight: 600;
          background: var(--primary-bg);
        }

        .doc {
          padding: 24px 0 12px;
          scroll-margin-top: calc(var(--site-header-h) + 24px);
        }
        .doc + .doc {
          border-top: 1.5px solid var(--border);
          margin-top: 20px;
        }
        .doc h2 {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-strong);
          letter-spacing: -0.01em;
          margin: 0 0 14px;
        }
        .doc-content { color: var(--text); max-width: 780px; }
        .doc-content :global(p) {
          color: var(--text-muted);
          margin: 0 0 14px;
          font-size: 15px;
          line-height: 1.7;
        }
        .doc-content :global(ul),
        .doc-content :global(ol) {
          margin: 8px 0 16px 22px;
          color: var(--text-muted);
          font-size: 15px;
        }
        .doc-content :global(li) {
          margin-bottom: 6px;
          line-height: 1.65;
        }
        .doc-content :global(code) {
          background: var(--surface-code);
          padding: 2px 7px;
          border-radius: 5px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--primary);
          border: 1px solid var(--border);
        }
        .doc-content :global(strong) { color: var(--text-strong); font-weight: 700; }
        .doc-content :global(a) {
          color: var(--primary);
          text-decoration: underline;
          transition: color 0.12s;
        }
        .doc-content :global(a:hover) { color: var(--primary-hover); }

        .back-to-top-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }
        .back-to-top-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface);
          transition: color 0.12s, border-color 0.12s, background 0.12s;
        }
        .back-to-top-link:hover {
          color: var(--primary);
          border-color: var(--primary);
          background: var(--primary-bg);
        }
      `}</style>
    </div>
  );
}