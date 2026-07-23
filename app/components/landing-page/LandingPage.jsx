// // app/components/landing-page/LandingPage.jsx
// //
// // Structure-only landing component for one pillar cluster (/tools,
// // /reference, /learn). v2 sidebar design: sticky left sidebar navigation
// // (category anchors with counts + scrollspy + secondary section links),
// // and one cluster stripe per category — sticky editorial widget left,
// // full card grid right.
// //
// // Renders NO h1/h2/p tags and no hardcoded display text. All text comes
// // from catalog data (category labels, counts, page names/descs) or from
// // the page via props:
// //
// //   pillar              — one entry from data/home-catalog.js (v4 shape):
// //                         { id, title, href, blurb, stats, breakdown,
// //                           pages: [{ name, desc, href, category, subCategory }] }
// //   renderClusterWidget — (cluster) => JSX. The page renders its own
// //                         editorial widget content per category (its h2,
// //                         blurb, tips, custom stats). cluster = { id,
// //                         category, count, items }. Fallback: minimal
// //                         data-only widget with no heading tags.
// //   navTitle            — sidebar primary title text (from the page)
// //   secondaryNavTitle   — sidebar secondary title text (from the page)
// //   secondaryLinks      — [{ label, href }] other-section links (from the page)
// //   categoryOrder       — optional array of category labels controlling
// //                         cluster order; unlisted categories follow in
// //                         count-descending order
// //   theme               — 'light' (default) | 'dark' — extend THEMES below
// //
// // Guarded: all array fields fall back to [] so stale catalogs degrade
// // instead of crashing. Requires catalog v4 (category/subCategory fields).

// import React, { useEffect, useMemo, useRef, useState } from 'react';

// const THEMES = {
//   light: {
//     bg: '#ffffff',
//     bgAlt: '#fafafa',
//     surface: '#ffffff',
//     text: '#18181b',
//     textStrong: '#09090b',
//     textMuted: '#52525b',
//     textSubtle: '#71717a',
//     textFaint: '#a1a1aa',
//     border: '#e4e4e7',
//     borderFaint: '#f4f4f5',
//     inputBorder: '#d4d4d8',
//     accent: '#4D4DFF',
//     accentHover: '#3838cc',
//     accentTint: 'rgba(77, 77, 255, 0.08)',
//     accentRing: 'rgba(77, 77, 255, 0.12)',
//     accentShadow: 'rgba(77, 77, 255, 0.08)',
//     cardShadow: '0 1px 2px rgba(0,0,0,0.02)',
//   },
//   dark: {
//     bg: '#09090b',
//     bgAlt: '#141417',
//     surface: '#141417',
//     text: '#e4e4e7',
//     textStrong: '#fafafa',
//     textMuted: '#a1a1aa',
//     textSubtle: '#8b8b93',
//     textFaint: '#71717a',
//     border: '#26262b',
//     borderFaint: '#1c1c21',
//     inputBorder: '#33333a',
//     accent: '#6b6bff',
//     accentHover: '#8a8aff',
//     accentTint: 'rgba(107, 107, 255, 0.14)',
//     accentRing: 'rgba(107, 107, 255, 0.22)',
//     accentShadow: 'rgba(107, 107, 255, 0.18)',
//     cardShadow: '0 1px 2px rgba(0,0,0,0.4)',
//   },
// };

// // Stable anchor id from a category label:
// // "Formatters & Minifiers" → "formatters-minifiers"
// function anchorId(label) {
//   return String(label)
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');
// }

// export default function LandingPage({
//   pillar = {},
//   renderClusterWidget = null,
//   navTitle = '',
//   secondaryNavTitle = '',
//   secondaryLinks = [],
//   categoryOrder = [],
//   theme = 'light',
// }) {
//   const t = THEMES[theme] || THEMES.light;
//   const rootRef = useRef(null);
//   const [currentId, setCurrentId] = useState('');

//   const pages = Array.isArray(pillar.pages) ? pillar.pages : [];
//   const links = Array.isArray(secondaryLinks) ? secondaryLinks : [];
//   const order = Array.isArray(categoryOrder) ? categoryOrder : [];

//   // ── Build clusters: category → { id, category, count, items } ──
//   const clusters = useMemo(() => {
//     const map = new Map();
//     for (const p of pages) {
//       const key = p.category || '';
//       if (!map.has(key)) map.set(key, []);
//       map.get(key).push(p);
//     }
//     let list = [...map.entries()].map(([category, items]) => ({
//       id: anchorId(category),
//       category,
//       count: items.length,
//       items,
//     }));
//     // Order: explicit categoryOrder first, then count-descending.
//     const rank = new Map(order.map((label, i) => [label, i]));
//     list.sort((a, b) => {
//       const ra = rank.has(a.category) ? rank.get(a.category) : Infinity;
//       const rb = rank.has(b.category) ? rank.get(b.category) : Infinity;
//       if (ra !== rb) return ra - rb;
//       return b.count - a.count;
//     });
//     return list;
//   }, [pages, order]);

//   // Initialize scrollspy target to the first cluster.
//   useEffect(() => {
//     if (clusters.length > 0 && !currentId) setCurrentId(clusters[0].id);
//   }, [clusters, currentId]);

//   // ── Scrollspy: highlight the sidebar item of the visible cluster ──
//   useEffect(() => {
//     if (typeof window === 'undefined' || clusters.length === 0) return undefined;
//     const root = rootRef.current;
//     if (!root) return undefined;

//     const targets = clusters
//       .map((c) => root.querySelector('[data-cluster-id="' + c.id + '"]'))
//       .filter(Boolean);

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
//         if (visible.length > 0) {
//           setCurrentId(visible[0].target.getAttribute('data-cluster-id'));
//         }
//       },
//       { rootMargin: '-15% 0px -65% 0px', threshold: 0 }
//     );
//     targets.forEach((el) => observer.observe(el));
//     return () => observer.disconnect();
//   }, [clusters]);

//   const cssVars = {
//     '--wddl-bg': t.bg,
//     '--wddl-bg-alt': t.bgAlt,
//     '--wddl-surface': t.surface,
//     '--wddl-text': t.text,
//     '--wddl-text-strong': t.textStrong,
//     '--wddl-text-muted': t.textMuted,
//     '--wddl-text-subtle': t.textSubtle,
//     '--wddl-text-faint': t.textFaint,
//     '--wddl-border': t.border,
//     '--wddl-border-faint': t.borderFaint,
//     '--wddl-input-border': t.inputBorder,
//     '--wddl-accent': t.accent,
//     '--wddl-accent-hover': t.accentHover,
//     '--wddl-accent-tint': t.accentTint,
//     '--wddl-accent-ring': t.accentRing,
//     '--wddl-accent-shadow': t.accentShadow,
//     '--wddl-card-shadow': t.cardShadow,
//   };

//   return (
//     <div className="wdd-landing" data-theme={theme} style={cssVars} ref={rootRef}>
//       <div className="wddl-shell">

//         {/* ── SIDEBAR NAVIGATION ── */}
//         <aside className="wddl-sidenav" aria-label={navTitle}>
//           {navTitle && <div className="wddl-sidenav-title">{navTitle}</div>}
//           <ul className="wddl-sidenav-list">
//             {clusters.map((c) => (
//               <li key={c.id}>
//                 <a className={'wddl-nav-item' + (currentId === c.id ? ' wddl-current' : '')} href={'#' + c.id}>
//                   <span>{c.category}</span>
//                   <span className="wddl-nav-n">{c.count}</span>
//                 </a>
//               </li>
//             ))}
//           </ul>

//           {links.length > 0 && (
//             <>
//               <div className="wddl-sidenav-divider"></div>
//               <div className="wddl-pillar-links">
//                 {secondaryNavTitle && (
//                   <div className="wddl-sidenav-title">{secondaryNavTitle}</div>
//                 )}
//                 {links.map((l) => (
//                   <a className="wddl-pillar-link" href={l.href} key={l.href}>
//                     {l.label} <span className="wddl-arr">&rarr;</span>
//                   </a>
//                 ))}
//               </div>
//             </>
//           )}
//         </aside>

//         {/* ── CLUSTERS ── */}
//         <main className="wddl-main">
//           {clusters.map((cluster) => (
//             <div className="wddl-cluster" id={cluster.id} data-cluster-id={cluster.id} key={cluster.id}>

//               <div className="wddl-cluster-widget">
//                 {renderClusterWidget ? (
//                   renderClusterWidget(cluster)
//                 ) : (
//                   <>
//                     <div className="wddl-widget-title">{cluster.category}</div>
//                     <div className="wddl-widget-stats">
//                       <div className="wddl-wstat">
//                         <span className="wddl-wstat-n">{cluster.count}</span>
//                         <span className="wddl-wstat-label">Pages</span>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="wddl-cluster-agg">
//                 <div className="wddl-agg-title">
//                   <span>{cluster.category}</span>
//                   <span className="wddl-agg-count">{cluster.count}</span>
//                 </div>
//                 <div className="wddl-tools-grid">
//                   {cluster.items.map((p) => (
//                     <a href={p.href} className="wddl-tool" key={p.href}>
//                       <div className="wddl-tool-name">
//                         <span>{p.name}</span>
//                         {p.subCategory && (
//                           <span className="wddl-tool-badge">{p.subCategory}</span>
//                         )}
//                       </div>
//                       {p.desc && <div className="wddl-tool-desc">{p.desc}</div>}
//                     </a>
//                   ))}
//                 </div>
//               </div>

//             </div>
//           ))}
//         </main>

//       </div>

//       <style jsx global>{`
//         .wdd-landing {
//           background: var(--wddl-bg);
//           color: var(--wddl-text);
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
//           font-size: 15px;
//           line-height: 1.55;
//           -webkit-font-smoothing: antialiased;
//         }
//         .wdd-landing a {
//           color: var(--wddl-accent);
//           text-decoration: none;
//         }
//         .wdd-landing a:hover {
//           color: var(--wddl-accent-hover);
//         }

//         .wdd-landing .wddl-shell {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 24px 32px 64px;
//           display: grid;
//           grid-template-columns: 200px 1fr;
//           gap: 40px;
//           align-items: start;
//         }

//         /* ── SIDEBAR ── */
//         .wdd-landing .wddl-sidenav {
//           position: sticky;
//           top: 20px;
//         }
//         .wdd-landing .wddl-sidenav-title {
//           font-size: 10.5px;
//           font-weight: 700;
//           color: var(--wddl-text-subtle);
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           margin-bottom: 10px;
//           padding-left: 12px;
//         }
//         .wdd-landing .wddl-sidenav-list {
//           list-style: none;
//           margin: 0;
//           padding: 0;
//         }
//         .wdd-landing .wddl-sidenav-list li {
//           margin-bottom: 2px;
//         }
//         .wdd-landing .wddl-nav-item {
//           display: flex;
//           justify-content: space-between;
//           align-items: baseline;
//           padding: 7px 12px;
//           border-radius: 7px;
//           border-left: 2px solid transparent;
//           font-size: 13.5px;
//           font-weight: 500;
//           color: var(--wddl-text-muted);
//         }
//         .wdd-landing .wddl-nav-item:hover {
//           color: var(--wddl-text-strong);
//           background: var(--wddl-border-faint);
//         }
//         .wdd-landing .wddl-nav-item.wddl-current {
//           color: var(--wddl-accent);
//           background: var(--wddl-accent-tint);
//           border-left-color: var(--wddl-accent);
//           border-radius: 0 7px 7px 0;
//           font-weight: 600;
//         }
//         .wdd-landing .wddl-nav-n {
//           font-family: ui-monospace, monospace;
//           font-size: 11px;
//           color: var(--wddl-text-faint);
//         }
//         .wdd-landing .wddl-nav-item.wddl-current .wddl-nav-n {
//           color: var(--wddl-accent);
//         }
//         .wdd-landing .wddl-sidenav-divider {
//           border-top: 1px solid var(--wddl-border);
//           margin: 16px 0;
//         }
//         .wdd-landing .wddl-pillar-link {
//           display: block;
//           padding: 6px 12px;
//           font-size: 13px;
//           color: var(--wddl-text-subtle);
//           border-radius: 7px;
//         }
//         .wdd-landing .wddl-pillar-link:hover {
//           color: var(--wddl-text-strong);
//           background: var(--wddl-border-faint);
//         }
//         .wdd-landing .wddl-arr {
//           color: var(--wddl-text-faint);
//           font-size: 11px;
//         }

//         /* ── MAIN ── */
//         .wdd-landing .wddl-main {
//           min-width: 0;
//         }

//         /* ── CLUSTER ── */
//         .wdd-landing .wddl-cluster {
//           display: grid;
//           grid-template-columns: 320px 1fr;
//           gap: 40px;
//           margin-bottom: 48px;
//           padding-bottom: 48px;
//           border-bottom: 1px solid var(--wddl-border);
//           align-items: start;
//           scroll-margin-top: 24px;
//         }
//         .wdd-landing .wddl-cluster:last-child {
//           border-bottom: none;
//           padding-bottom: 0;
//           margin-bottom: 0;
//         }

//         /* Widget shell — the page fills the inside via renderClusterWidget.
//            These classes are available for the page's widget markup. */
//         .wdd-landing .wddl-cluster-widget {
//           background: var(--wddl-bg-alt);
//           border: 1px solid var(--wddl-border);
//           border-radius: 10px;
//           padding: 22px 24px;
//           position: sticky;
//           top: 20px;
//         }
//         .wdd-landing .wddl-widget-kicker {
//           font-size: 10.5px;
//           font-weight: 700;
//           color: var(--wddl-accent);
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           margin-bottom: 8px;
//         }
//         .wdd-landing .wddl-widget-title,
//         .wdd-landing .wddl-cluster-widget h2 {
//           font-size: 24px;
//           font-weight: 700;
//           color: var(--wddl-text-strong);
//           letter-spacing: -0.02em;
//           margin: 0 0 12px;
//           line-height: 1.15;
//         }
//         .wdd-landing .wddl-widget-blurb {
//           color: var(--wddl-text-muted);
//           font-size: 13px;
//           line-height: 1.6;
//           margin: 0 0 14px;
//         }
//         .wdd-landing .wddl-widget-blurb code {
//           background: var(--wddl-surface);
//           border: 1px solid var(--wddl-border);
//           padding: 1px 5px;
//           border-radius: 3px;
//           font-family: ui-monospace, monospace;
//           font-size: 12px;
//           color: var(--wddl-accent);
//         }
//         .wdd-landing .wddl-widget-stats {
//           display: flex;
//           gap: 18px;
//           padding: 12px 0;
//           border-top: 1px solid var(--wddl-border);
//           border-bottom: 1px solid var(--wddl-border);
//           margin-bottom: 14px;
//         }
//         .wdd-landing .wddl-wstat-n {
//           font-size: 18px;
//           font-weight: 700;
//           color: var(--wddl-accent);
//           line-height: 1;
//           display: block;
//           margin-bottom: 3px;
//         }
//         .wdd-landing .wddl-wstat-label {
//           font-size: 10px;
//           color: var(--wddl-text-subtle);
//           text-transform: uppercase;
//           letter-spacing: 0.05em;
//         }
//         .wdd-landing .wddl-widget-note {
//           font-size: 12.5px;
//           color: var(--wddl-text-muted);
//           padding-top: 12px;
//           border-top: 1px dashed var(--wddl-input-border);
//           line-height: 1.55;
//         }
//         .wdd-landing .wddl-widget-note strong {
//           color: var(--wddl-text);
//         }

//         /* ── CARD GRID ── */
//         .wdd-landing .wddl-cluster-agg {
//           min-width: 0;
//         }
//         .wdd-landing .wddl-agg-title {
//           font-size: 10.5px;
//           font-weight: 700;
//           color: var(--wddl-text-subtle);
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           margin-bottom: 12px;
//           display: flex;
//           justify-content: space-between;
//           align-items: baseline;
//         }
//         .wdd-landing .wddl-agg-count {
//           color: var(--wddl-accent);
//           font-weight: 700;
//         }
//         .wdd-landing .wddl-tools-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
//           gap: 10px;
//         }
//         .wdd-landing .wddl-tool {
//           background: var(--wddl-surface);
//           border: 1px solid var(--wddl-border);
//           padding: 14px 16px;
//           border-radius: 8px;
//           display: block;
//           color: inherit;
//           transition: all 0.12s;
//           box-shadow: var(--wddl-card-shadow);
//         }
//         .wdd-landing .wddl-tool:hover {
//           border-color: var(--wddl-accent);
//           box-shadow: 0 2px 6px var(--wddl-accent-shadow);
//           color: inherit;
//         }
//         .wdd-landing .wddl-tool-name {
//           font-weight: 600;
//           font-size: 14px;
//           color: var(--wddl-text-strong);
//           margin-bottom: 3px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 8px;
//         }
//         .wdd-landing .wddl-tool-badge {
//           font-size: 9.5px;
//           font-weight: 600;
//           color: var(--wddl-accent);
//           background: var(--wddl-accent-tint);
//           padding: 1px 6px;
//           border-radius: 3px;
//           text-transform: uppercase;
//           letter-spacing: 0.05em;
//           flex-shrink: 0;
//         }
//         .wdd-landing .wddl-tool-desc {
//           font-size: 12px;
//           color: var(--wddl-text-muted);
//           line-height: 1.5;
//         }

//         /* ── RESPONSIVE ── */
//         @media (max-width: 1100px) {
//           .wdd-landing .wddl-cluster {
//             grid-template-columns: 280px 1fr;
//             gap: 28px;
//           }
//         }
//         @media (max-width: 960px) {
//           .wdd-landing .wddl-shell {
//             grid-template-columns: 1fr;
//             gap: 0;
//           }
//           .wdd-landing .wddl-sidenav {
//             top: 0;
//             background: var(--wddl-bg);
//             z-index: 10;
//             padding: 10px 0;
//             border-bottom: 1px solid var(--wddl-border);
//             margin-bottom: 24px;
//           }
//           .wdd-landing .wddl-sidenav-title,
//           .wdd-landing .wddl-sidenav-divider,
//           .wdd-landing .wddl-pillar-links {
//             display: none;
//           }
//           .wdd-landing .wddl-sidenav-list {
//             display: flex;
//             gap: 8px;
//             overflow-x: auto;
//             -webkit-overflow-scrolling: touch;
//             scrollbar-width: none;
//           }
//           .wdd-landing .wddl-sidenav-list::-webkit-scrollbar {
//             display: none;
//           }
//           .wdd-landing .wddl-sidenav-list li {
//             margin-bottom: 0;
//             flex-shrink: 0;
//           }
//           .wdd-landing .wddl-nav-item {
//             border: 1px solid var(--wddl-border);
//             border-radius: 999px;
//             padding: 6px 14px;
//             gap: 8px;
//             white-space: nowrap;
//           }
//           .wdd-landing .wddl-nav-item.wddl-current {
//             border-color: var(--wddl-accent);
//             border-left-color: var(--wddl-accent);
//             border-radius: 999px;
//           }
//         }
//         @media (max-width: 800px) {
//           .wdd-landing .wddl-cluster {
//             grid-template-columns: 1fr;
//             gap: 24px;
//           }
//           .wdd-landing .wddl-cluster-widget {
//             position: static;
//           }
//         }
//       `}</style>

//     </div>
//   );
// }


// app/components/landing-page/LandingPage.jsx
//
// Structure-only landing component for one pillar cluster (/tools,
// /reference, /learn). v2 sidebar design: sticky left sidebar navigation
// (category anchors with counts + scrollspy + secondary section links),
// and one cluster stripe per category — sticky editorial widget left,
// full card grid right.
//
// Renders NO h1/h2/p tags and no hardcoded display text. All text comes
// from catalog data (category labels, counts, page names/descs) or from
// the page via props:
//
//   pillar              — one entry from data/home-catalog.js (v4 shape):
//                         { id, title, href, blurb, stats, breakdown,
//                           pages: [{ name, desc, href, category, subCategory }] }
//   renderClusterWidget — (cluster) => JSX. The page renders its own
//                         editorial widget content per category (its h2,
//                         blurb, tips, custom stats). cluster = { id,
//                         category, count, items }. Fallback: minimal
//                         data-only widget with no heading tags.
//   navTitle            — sidebar primary title text (from the page)
//   secondaryNavTitle   — sidebar secondary title text (from the page)
//   secondaryLinks      — [{ label, href }] other-section links (from the page)
//   categoryOrder       — optional array of category labels controlling
//                         cluster order; unlisted categories follow in
//                         count-descending order
//   stickyOffset        — CSS length for how far below the viewport top the
//                         sticky sidebar and cluster widgets pin, e.g.
//                         '90px' to clear a fixed site header. Default '20px'.
//   theme               — 'light' (default) | 'dark' — extend THEMES below
//
// Guarded: all array fields fall back to [] so stale catalogs degrade
// instead of crashing. Requires catalog v4 (category/subCategory fields).

import React, { useEffect, useMemo, useRef, useState } from 'react';

const THEMES = {
  light: {
    bg: '#ffffff',
    bgAlt: '#fafafa',
    surface: '#ffffff',
    text: '#18181b',
    textStrong: '#09090b',
    textMuted: '#52525b',
    textSubtle: '#71717a',
    textFaint: '#a1a1aa',
    border: '#e4e4e7',
    borderFaint: '#f4f4f5',
    inputBorder: '#d4d4d8',
    accent: '#4D4DFF',
    accentHover: '#3838cc',
    accentTint: 'rgba(77, 77, 255, 0.08)',
    accentRing: 'rgba(77, 77, 255, 0.12)',
    accentShadow: 'rgba(77, 77, 255, 0.08)',
    cardShadow: '0 1px 2px rgba(0,0,0,0.02)',
  },
  dark: {
    bg: '#09090b',
    bgAlt: '#141417',
    surface: '#141417',
    text: '#e4e4e7',
    textStrong: '#fafafa',
    textMuted: '#a1a1aa',
    textSubtle: '#8b8b93',
    textFaint: '#71717a',
    border: '#26262b',
    borderFaint: '#1c1c21',
    inputBorder: '#33333a',
    accent: '#6b6bff',
    accentHover: '#8a8aff',
    accentTint: 'rgba(107, 107, 255, 0.14)',
    accentRing: 'rgba(107, 107, 255, 0.22)',
    accentShadow: 'rgba(107, 107, 255, 0.18)',
    cardShadow: '0 1px 2px rgba(0,0,0,0.4)',
  },
};

// Stable anchor id from a category label:
// "Formatters & Minifiers" → "formatters-minifiers"
function anchorId(label) {
  return String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function LandingPage({
  pillar = {},
  renderClusterWidget = null,
  navTitle = '',
  secondaryNavTitle = '',
  secondaryLinks = [],
  categoryOrder = [],
  stickyOffset = '20px',
  theme = 'light',
}) {
  const t = THEMES[theme] || THEMES.light;
  const rootRef = useRef(null);
  const [currentId, setCurrentId] = useState('');

  const pages = Array.isArray(pillar.pages) ? pillar.pages : [];
  const links = Array.isArray(secondaryLinks) ? secondaryLinks : [];
  const order = Array.isArray(categoryOrder) ? categoryOrder : [];

  // ── Build clusters: category → { id, category, count, items } ──
  const clusters = useMemo(() => {
    const map = new Map();
    for (const p of pages) {
      const key = p.category || '';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    let list = [...map.entries()].map(([category, items]) => ({
      id: anchorId(category),
      category,
      count: items.length,
      items,
    }));
    // Order: explicit categoryOrder first, then count-descending.
    const rank = new Map(order.map((label, i) => [label, i]));
    list.sort((a, b) => {
      const ra = rank.has(a.category) ? rank.get(a.category) : Infinity;
      const rb = rank.has(b.category) ? rank.get(b.category) : Infinity;
      if (ra !== rb) return ra - rb;
      return b.count - a.count;
    });
    return list;
  }, [pages, order]);

  // Initialize scrollspy target to the first cluster.
  useEffect(() => {
    if (clusters.length > 0 && !currentId) setCurrentId(clusters[0].id);
  }, [clusters, currentId]);

  // ── Scrollspy: highlight the sidebar item of the visible cluster ──
  useEffect(() => {
    if (typeof window === 'undefined' || clusters.length === 0) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const targets = clusters
      .map((c) => root.querySelector('[data-cluster-id="' + c.id + '"]'))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setCurrentId(visible[0].target.getAttribute('data-cluster-id'));
        }
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [clusters]);

  const cssVars = {
    '--wddl-bg': t.bg,
    '--wddl-bg-alt': t.bgAlt,
    '--wddl-surface': t.surface,
    '--wddl-text': t.text,
    '--wddl-text-strong': t.textStrong,
    '--wddl-text-muted': t.textMuted,
    '--wddl-text-subtle': t.textSubtle,
    '--wddl-text-faint': t.textFaint,
    '--wddl-border': t.border,
    '--wddl-border-faint': t.borderFaint,
    '--wddl-input-border': t.inputBorder,
    '--wddl-accent': t.accent,
    '--wddl-accent-hover': t.accentHover,
    '--wddl-accent-tint': t.accentTint,
    '--wddl-accent-ring': t.accentRing,
    '--wddl-accent-shadow': t.accentShadow,
    '--wddl-card-shadow': t.cardShadow,
    '--wddl-sticky-top': stickyOffset,
  };

  return (
    <div className="wdd-landing" data-theme={theme} style={cssVars} ref={rootRef}>
      <div className="wddl-shell">

        {/* ── SIDEBAR NAVIGATION ── */}
        <aside className="wddl-sidenav" aria-label={navTitle}>
          {navTitle && <div className="wddl-sidenav-title">{navTitle}</div>}
          <ul className="wddl-sidenav-list">
            {clusters.map((c) => (
              <li key={c.id}>
                <a className={'wddl-nav-item' + (currentId === c.id ? ' wddl-current' : '')} href={'#' + c.id}>
                  <span>{c.category}</span>
                  <span className="wddl-nav-n">{c.count}</span>
                </a>
              </li>
            ))}
          </ul>

          {links.length > 0 && (
            <>
              <div className="wddl-sidenav-divider"></div>
              <div className="wddl-pillar-links">
                {secondaryNavTitle && (
                  <div className="wddl-sidenav-title">{secondaryNavTitle}</div>
                )}
                {links.map((l) => (
                  <a className="wddl-pillar-link" href={l.href} key={l.href}>
                    {l.label} <span className="wddl-arr">&rarr;</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* ── CLUSTERS ── */}
        <main className="wddl-main">
          {clusters.map((cluster) => (
            <div className="wddl-cluster" id={cluster.id} data-cluster-id={cluster.id} key={cluster.id}>

              <div className="wddl-cluster-widget">
                {(renderClusterWidget && renderClusterWidget(cluster)) || (
                  <>
                    <div className="wddl-widget-title">{cluster.category}</div>
                    <div className="wddl-widget-stats">
                      <div className="wddl-wstat">
                        <span className="wddl-wstat-n">{cluster.count}</span>
                        <span className="wddl-wstat-label">Pages</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="wddl-cluster-agg">
                <div className="wddl-agg-title">
                  <span>{cluster.category}</span>
                  <span className="wddl-agg-count">{cluster.count}</span>
                </div>
                <div className="wddl-tools-grid">
                  {cluster.items.map((p) => (
                    <a href={p.href} className="wddl-tool" key={p.href}>
                      <div className="wddl-tool-name">
                        <span>{p.name}</span>
                        {p.subCategory && (
                          <span className="wddl-tool-badge">{p.subCategory}</span>
                        )}
                      </div>
                      {p.desc && <div className="wddl-tool-desc">{p.desc}</div>}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </main>

      </div>

      <style jsx global>{`
        .wdd-landing {
          background: var(--wddl-bg);
          color: var(--wddl-text);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .wdd-landing a {
          color: var(--wddl-accent);
          text-decoration: none;
        }
        .wdd-landing a:hover {
          color: var(--wddl-accent-hover);
        }

        .wdd-landing .wddl-shell {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 32px 64px;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 40px;
          align-items: start;
        }

        /* ── SIDEBAR ── */
        .wdd-landing .wddl-sidenav {
          position: sticky;
          top: var(--wddl-sticky-top);
        }
        .wdd-landing .wddl-sidenav-title {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--wddl-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
          padding-left: 12px;
        }
        .wdd-landing .wddl-sidenav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .wdd-landing .wddl-sidenav-list li {
          margin-bottom: 2px;
        }
        .wdd-landing .wddl-nav-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 7px 12px;
          border-radius: 7px;
          border-left: 2px solid transparent;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--wddl-text-muted);
        }
        .wdd-landing .wddl-nav-item:hover {
          color: var(--wddl-text-strong);
          background: var(--wddl-border-faint);
        }
        .wdd-landing .wddl-nav-item.wddl-current {
          color: var(--wddl-accent);
          background: var(--wddl-accent-tint);
          border-left-color: var(--wddl-accent);
          border-radius: 0 7px 7px 0;
          font-weight: 600;
        }
        .wdd-landing .wddl-nav-n {
          font-family: ui-monospace, monospace;
          font-size: 11px;
          color: var(--wddl-text-faint);
        }
        .wdd-landing .wddl-nav-item.wddl-current .wddl-nav-n {
          color: var(--wddl-accent);
        }
        .wdd-landing .wddl-sidenav-divider {
          border-top: 1px solid var(--wddl-border);
          margin: 16px 0;
        }
        .wdd-landing .wddl-pillar-link {
          display: block;
          padding: 6px 12px;
          font-size: 13px;
          color: var(--wddl-text-subtle);
          border-radius: 7px;
        }
        .wdd-landing .wddl-pillar-link:hover {
          color: var(--wddl-text-strong);
          background: var(--wddl-border-faint);
        }
        .wdd-landing .wddl-arr {
          color: var(--wddl-text-faint);
          font-size: 11px;
        }

        /* ── MAIN ── */
        .wdd-landing .wddl-main {
          min-width: 0;
        }

        /* ── CLUSTER ── */
        .wdd-landing .wddl-cluster {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
          margin-bottom: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid var(--wddl-border);
          align-items: start;
          scroll-margin-top: calc(var(--wddl-sticky-top) + 4px);
        }
        .wdd-landing .wddl-cluster:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        /* Widget shell — the page fills the inside via renderClusterWidget.
           These classes are available for the page's widget markup. */
        .wdd-landing .wddl-cluster-widget {
          background: var(--wddl-bg-alt);
          border: 1px solid var(--wddl-border);
          border-radius: 10px;
          padding: 22px 24px;
          position: sticky;
          top: var(--wddl-sticky-top);
        }
        .wdd-landing .wddl-widget-kicker {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--wddl-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .wdd-landing .wddl-widget-title,
        .wdd-landing .wddl-cluster-widget h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--wddl-text-strong);
          letter-spacing: -0.02em;
          margin: 0 0 12px;
          line-height: 1.15;
        }
        .wdd-landing .wddl-widget-blurb {
          color: var(--wddl-text-muted);
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 14px;
        }
        .wdd-landing .wddl-widget-blurb code {
          background: var(--wddl-surface);
          border: 1px solid var(--wddl-border);
          padding: 1px 5px;
          border-radius: 3px;
          font-family: ui-monospace, monospace;
          font-size: 12px;
          color: var(--wddl-accent);
        }
        .wdd-landing .wddl-widget-stats {
          display: flex;
          gap: 18px;
          padding: 12px 0;
          border-top: 1px solid var(--wddl-border);
          border-bottom: 1px solid var(--wddl-border);
          margin-bottom: 14px;
        }
        .wdd-landing .wddl-wstat-n {
          font-size: 18px;
          font-weight: 700;
          color: var(--wddl-accent);
          line-height: 1;
          display: block;
          margin-bottom: 3px;
        }
        .wdd-landing .wddl-wstat-label {
          font-size: 10px;
          color: var(--wddl-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .wdd-landing .wddl-widget-note {
          font-size: 12.5px;
          color: var(--wddl-text-muted);
          padding-top: 12px;
          border-top: 1px dashed var(--wddl-input-border);
          line-height: 1.55;
        }
        .wdd-landing .wddl-widget-note strong {
          color: var(--wddl-text);
        }

        /* ── CARD GRID ── */
        .wdd-landing .wddl-cluster-agg {
          min-width: 0;
        }
        .wdd-landing .wddl-agg-title {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--wddl-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .wdd-landing .wddl-agg-count {
          color: var(--wddl-accent);
          font-weight: 700;
        }
        .wdd-landing .wddl-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 10px;
        }
        .wdd-landing .wddl-tool {
          background: var(--wddl-surface);
          border: 1px solid var(--wddl-border);
          padding: 14px 16px;
          border-radius: 8px;
          display: block;
          color: inherit;
          transition: all 0.12s;
          box-shadow: var(--wddl-card-shadow);
        }
        .wdd-landing .wddl-tool:hover {
          border-color: var(--wddl-accent);
          box-shadow: 0 2px 6px var(--wddl-accent-shadow);
          color: inherit;
        }
        .wdd-landing .wddl-tool-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--wddl-text-strong);
          margin-bottom: 3px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .wdd-landing .wddl-tool-badge {
          font-size: 9.5px;
          font-weight: 600;
          color: var(--wddl-accent);
          background: var(--wddl-accent-tint);
          padding: 1px 6px;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .wdd-landing .wddl-tool-desc {
          font-size: 12px;
          color: var(--wddl-text-muted);
          line-height: 1.5;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .wdd-landing .wddl-cluster {
            grid-template-columns: 280px 1fr;
            gap: 28px;
          }
        }
        @media (max-width: 960px) {
          .wdd-landing .wddl-shell {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .wdd-landing .wddl-sidenav {
            top: 0;
            background: var(--wddl-bg);
            z-index: 10;
            padding: 10px 0;
            border-bottom: 1px solid var(--wddl-border);
            margin-bottom: 24px;
          }
          .wdd-landing .wddl-sidenav-title,
          .wdd-landing .wddl-sidenav-divider,
          .wdd-landing .wddl-pillar-links {
            display: none;
          }
          .wdd-landing .wddl-sidenav-list {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .wdd-landing .wddl-sidenav-list::-webkit-scrollbar {
            display: none;
          }
          .wdd-landing .wddl-sidenav-list li {
            margin-bottom: 0;
            flex-shrink: 0;
          }
          .wdd-landing .wddl-nav-item {
            border: 1px solid var(--wddl-border);
            border-radius: 999px;
            padding: 6px 14px;
            gap: 8px;
            white-space: nowrap;
          }
          .wdd-landing .wddl-nav-item.wddl-current {
            border-color: var(--wddl-accent);
            border-left-color: var(--wddl-accent);
            border-radius: 999px;
          }
        }
        @media (max-width: 800px) {
          .wdd-landing .wddl-cluster {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .wdd-landing .wddl-cluster-widget {
            position: static;
          }
        }
      `}</style>

    </div>
  );
}