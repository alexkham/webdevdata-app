// // // // // app/components/home-page/HomePage.jsx
// // // // //
// // // // // Homepage template. One file, self-contained.
// // // // //
// // // // // Props:
// // // // //   pillars — from data/home-catalog.js (AUTO-GENERATED):
// // // // //     [
// // // // //       {
// // // // //         id, title, href, blurb, cardsTitle, ctaLabel,
// // // // //         stats:     [{ n, label }],
// // // // //         breakdown: [{ label, count }],
// // // // //         cards:     [{ name, desc, href, tag, kicker }]
// // // // //       }
// // // // //     ]
// // // // //   hero    — { title, subtitle, searchPlaceholder } (all optional)
// // // // //   layout  — 'zigzag' (default) | 'stacked'   — extend LAYOUTS below
// // // // //   theme   — 'light' (default) | 'dark'       — extend THEMES below
// // // // //
// // // // // Extensibility model:
// // // // //   - Themes are pure token objects. A theme becomes CSS custom properties
// // // // //     on the root element; all styles read only variables. Adding a theme
// // // // //     = adding one object to THEMES. No style rules change.
// // // // //   - Layouts share the same markup; the root carries data-layout="..."
// // // // //     and layout-specific CSS keys off that attribute. Adding a layout
// // // // //     = registering its id in LAYOUTS and adding a CSS block for
// // // // //     [data-layout='your-id']. If a future layout needs different markup,
// // // // //     branch on `layout` inside the render.

// // // // import React, { useEffect, useRef } from 'react';

// // // // // ─────────────────────────────────────────────────────────────
// // // // // Themes — token objects, applied as CSS variables
// // // // // ─────────────────────────────────────────────────────────────

// // // // const THEMES = {
// // // //   light: {
// // // //     bg: '#ffffff',
// // // //     bgAlt: '#fafafa',
// // // //     surface: '#ffffff',
// // // //     text: '#18181b',
// // // //     textStrong: '#09090b',
// // // //     textMuted: '#52525b',
// // // //     textSubtle: '#71717a',
// // // //     textFaint: '#a1a1aa',
// // // //     border: '#e4e4e7',
// // // //     borderFaint: '#f4f4f5',
// // // //     inputBorder: '#d4d4d8',
// // // //     accent: '#4D4DFF',
// // // //     accentHover: '#3838cc',
// // // //     accentTint: 'rgba(77, 77, 255, 0.08)',
// // // //     accentRing: 'rgba(77, 77, 255, 0.12)',
// // // //     accentShadow: 'rgba(77, 77, 255, 0.10)',
// // // //     kbdBg: '#f4f4f5',
// // // //     ctaText: '#ffffff',
// // // //     cardShadow: '0 1px 2px rgba(0,0,0,0.02)',
// // // //     widgetShadow: '0 2px 8px rgba(0,0,0,0.02)',
// // // //   },
// // // //   dark: {
// // // //     bg: '#09090b',
// // // //     bgAlt: '#101012',
// // // //     surface: '#141417',
// // // //     text: '#e4e4e7',
// // // //     textStrong: '#fafafa',
// // // //     textMuted: '#a1a1aa',
// // // //     textSubtle: '#8b8b93',
// // // //     textFaint: '#71717a',
// // // //     border: '#26262b',
// // // //     borderFaint: '#1c1c21',
// // // //     inputBorder: '#33333a',
// // // //     accent: '#6b6bff',
// // // //     accentHover: '#8a8aff',
// // // //     accentTint: 'rgba(107, 107, 255, 0.14)',
// // // //     accentRing: 'rgba(107, 107, 255, 0.22)',
// // // //     accentShadow: 'rgba(107, 107, 255, 0.18)',
// // // //     kbdBg: '#1c1c21',
// // // //     ctaText: '#ffffff',
// // // //     cardShadow: '0 1px 2px rgba(0,0,0,0.4)',
// // // //     widgetShadow: '0 2px 8px rgba(0,0,0,0.4)',
// // // //   },
// // // // };

// // // // // ─────────────────────────────────────────────────────────────
// // // // // Layouts — registered ids; CSS keys off data-layout
// // // // // ─────────────────────────────────────────────────────────────

// // // // const LAYOUTS = ['zigzag', 'stacked'];

// // // // const HERO_DEFAULTS = {
// // // //   title: 'Everything a web developer looks up.',
// // // //   subtitle: 'Reference, tools, and tutorials. Fast, clean, modern. Zero ads above the fold, ever.',
// // // //   searchPlaceholder: 'Search tools, functions, tutorials...',
// // // // };

// // // // // ─────────────────────────────────────────────────────────────
// // // // // Component
// // // // // ─────────────────────────────────────────────────────────────

// // // // export default function HomePage({
// // // //   pillars = [],
// // // //   hero = {},
// // // //   layout = 'zigzag',
// // // //   theme = 'light',
// // // // }) {
// // // //   const t = THEMES[theme] || THEMES.light;
// // // //   const activeLayout = LAYOUTS.includes(layout) ? layout : 'zigzag';
// // // //   const heroContent = { ...HERO_DEFAULTS, ...hero };
// // // //   const searchRef = useRef(null);

// // // //   // Cmd/Ctrl+K focuses search, Escape blurs it.
// // // //   useEffect(() => {
// // // //     const onKeyDown = (e) => {
// // // //       if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
// // // //         e.preventDefault();
// // // //         if (searchRef.current) searchRef.current.focus();
// // // //       }
// // // //       if (e.key === 'Escape' && searchRef.current === document.activeElement) {
// // // //         searchRef.current.blur();
// // // //       }
// // // //     };
// // // //     window.addEventListener('keydown', onKeyDown);
// // // //     return () => window.removeEventListener('keydown', onKeyDown);
// // // //   }, []);

// // // //   // Theme tokens → CSS variables on the root node.
// // // //   const cssVars = {
// // // //     '--wdd-bg': t.bg,
// // // //     '--wdd-bg-alt': t.bgAlt,
// // // //     '--wdd-surface': t.surface,
// // // //     '--wdd-text': t.text,
// // // //     '--wdd-text-strong': t.textStrong,
// // // //     '--wdd-text-muted': t.textMuted,
// // // //     '--wdd-text-subtle': t.textSubtle,
// // // //     '--wdd-text-faint': t.textFaint,
// // // //     '--wdd-border': t.border,
// // // //     '--wdd-border-faint': t.borderFaint,
// // // //     '--wdd-input-border': t.inputBorder,
// // // //     '--wdd-accent': t.accent,
// // // //     '--wdd-accent-hover': t.accentHover,
// // // //     '--wdd-accent-tint': t.accentTint,
// // // //     '--wdd-accent-ring': t.accentRing,
// // // //     '--wdd-accent-shadow': t.accentShadow,
// // // //     '--wdd-kbd-bg': t.kbdBg,
// // // //     '--wdd-cta-text': t.ctaText,
// // // //     '--wdd-card-shadow': t.cardShadow,
// // // //     '--wdd-widget-shadow': t.widgetShadow,
// // // //   };

// // // //   return (
// // // //     <div className="wdd-home" data-layout={activeLayout} data-theme={theme} style={cssVars}>

// // // //       {/* ── HERO ── */}
// // // //       <main className="wdd-hero-wrap">
// // // //         <div className="wdd-hero">
// // // //           <h1>{heroContent.title}</h1>
// // // //           <p>{heroContent.subtitle}</p>
// // // //           <div className="wdd-search-wrap">
// // // //             <span className="wdd-search-icon" aria-hidden="true">&#8981;</span>
// // // //             <input
// // // //               ref={searchRef}
// // // //               className="wdd-search-input"
// // // //               type="text"
// // // //               placeholder={heroContent.searchPlaceholder}
// // // //               aria-label="Search the site"
// // // //             />
// // // //             <span className="wdd-kbd" aria-hidden="true">&#8984;K</span>
// // // //           </div>
// // // //         </div>
// // // //       </main>

// // // //       {/* ── PILLAR BANDS ── */}
// // // //       {pillars.map((pillar) => (
// // // //         <section className="wdd-band" key={pillar.id}>
// // // //           <div className="wdd-band-inner">

// // // //             <div className="wdd-cat-widget">
// // // //               <div className="wdd-cat-kicker">Category</div>
// // // //               <h2>{pillar.title}</h2>
// // // //               <p className="wdd-cat-blurb">{pillar.blurb}</p>

// // // //               {pillar.stats && pillar.stats.length > 0 && (
// // // //                 <div className="wdd-cat-stats">
// // // //                   {pillar.stats.map((stat) => (
// // // //                     <div className="wdd-stat" key={stat.label}>
// // // //                       <span className="wdd-stat-n">{stat.n}</span>
// // // //                       <span className="wdd-stat-label">{stat.label}</span>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               )}

// // // //               {pillar.breakdown && pillar.breakdown.length > 0 && (
// // // //                 <ul className="wdd-cat-breakdown">
// // // //                   {pillar.breakdown.map((item) => (
// // // //                     <li key={item.label}>
// // // //                       {item.label} <span className="wdd-breakdown-n">{item.count}</span>
// // // //                     </li>
// // // //                   ))}
// // // //                 </ul>
// // // //               )}

// // // //               <a href={pillar.href} className="wdd-cat-cta">
// // // //                 {pillar.ctaLabel} &rarr;
// // // //               </a>
// // // //             </div>

// // // //             <div className="wdd-cards-side">
// // // //               <div className="wdd-cards-title">{pillar.cardsTitle}</div>
// // // //               <div className="wdd-card-grid">
// // // //                 {pillar.cards.map((card) => (
// // // //                   <a href={card.href} className="wdd-card" key={card.href}>
// // // //                     {card.kicker && <div className="wdd-card-kicker">{card.kicker}</div>}
// // // //                     <div className="wdd-card-name">{card.name}</div>
// // // //                     {card.desc && <div className="wdd-card-desc">{card.desc}</div>}
// // // //                     {card.tag && (
// // // //                       <div className="wdd-card-meta">
// // // //                         <span className="wdd-card-tag">{card.tag}</span>
// // // //                       </div>
// // // //                     )}
// // // //                   </a>
// // // //                 ))}
// // // //               </div>
// // // //             </div>

// // // //           </div>
// // // //         </section>
// // // //       ))}

// // // //       <style jsx global>{`
// // // //         .wdd-home {
// // // //           background: var(--wdd-bg);
// // // //           color: var(--wdd-text);
// // // //           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
// // // //           font-size: 15px;
// // // //           line-height: 1.55;
// // // //           -webkit-font-smoothing: antialiased;
// // // //         }
// // // //         .wdd-home a {
// // // //           color: var(--wdd-accent);
// // // //           text-decoration: none;
// // // //         }
// // // //         .wdd-home a:hover {
// // // //           color: var(--wdd-accent-hover);
// // // //         }

// // // //         /* ── HERO ── */
// // // //         .wdd-home .wdd-hero-wrap {
// // // //           max-width: 1240px;
// // // //           margin: 0 auto;
// // // //           padding: 64px 32px 40px;
// // // //         }
// // // //         .wdd-home .wdd-hero {
// // // //           text-align: center;
// // // //           margin-bottom: 40px;
// // // //         }
// // // //         .wdd-home .wdd-hero h1 {
// // // //           font-size: 44px;
// // // //           font-weight: 700;
// // // //           letter-spacing: -0.03em;
// // // //           margin: 0 0 14px;
// // // //           color: var(--wdd-text-strong);
// // // //           line-height: 1.1;
// // // //         }
// // // //         .wdd-home .wdd-hero p {
// // // //           color: var(--wdd-text-muted);
// // // //           font-size: 17px;
// // // //           max-width: 560px;
// // // //           margin: 0 auto;
// // // //         }
// // // //         .wdd-home .wdd-search-wrap {
// // // //           max-width: 640px;
// // // //           margin: 36px auto 0;
// // // //           position: relative;
// // // //         }
// // // //         .wdd-home .wdd-search-input {
// // // //           width: 100%;
// // // //           box-sizing: border-box;
// // // //           background: var(--wdd-surface);
// // // //           border: 1px solid var(--wdd-input-border);
// // // //           color: var(--wdd-text);
// // // //           padding: 16px 20px 16px 48px;
// // // //           font-size: 16px;
// // // //           border-radius: 10px;
// // // //           outline: none;
// // // //           font-family: inherit;
// // // //           box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
// // // //         }
// // // //         .wdd-home .wdd-search-input:focus {
// // // //           border-color: var(--wdd-accent);
// // // //           box-shadow: 0 0 0 3px var(--wdd-accent-ring);
// // // //         }
// // // //         .wdd-home .wdd-search-input::placeholder {
// // // //           color: var(--wdd-text-faint);
// // // //         }
// // // //         .wdd-home .wdd-search-icon {
// // // //           position: absolute;
// // // //           left: 18px;
// // // //           top: 50%;
// // // //           transform: translateY(-50%);
// // // //           color: var(--wdd-text-faint);
// // // //           font-size: 16px;
// // // //         }
// // // //         .wdd-home .wdd-kbd {
// // // //           position: absolute;
// // // //           right: 14px;
// // // //           top: 50%;
// // // //           transform: translateY(-50%);
// // // //           background: var(--wdd-kbd-bg);
// // // //           border: 1px solid var(--wdd-border);
// // // //           padding: 3px 8px;
// // // //           border-radius: 5px;
// // // //           font-family: ui-monospace, monospace;
// // // //           font-size: 12px;
// // // //           color: var(--wdd-text-muted);
// // // //         }

// // // //         /* ── BANDS (shared) ── */
// // // //         .wdd-home .wdd-band {
// // // //           padding: 56px 0;
// // // //           border-top: 1px solid var(--wdd-border);
// // // //         }
// // // //         .wdd-home .wdd-band-inner {
// // // //           max-width: 1240px;
// // // //           margin: 0 auto;
// // // //           padding: 0 32px;
// // // //           display: grid;
// // // //           gap: 48px;
// // // //           align-items: start;
// // // //         }

// // // //         /* ── LAYOUT: zigzag ── */
// // // //         .wdd-home[data-layout='zigzag'] .wdd-band-inner {
// // // //           grid-template-columns: 360px 1fr;
// // // //         }
// // // //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
// // // //           grid-template-columns: 1fr 360px;
// // // //         }
// // // //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
// // // //           order: 2;
// // // //         }
// // // //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
// // // //           order: 1;
// // // //         }
// // // //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) {
// // // //           background: var(--wdd-bg-alt);
// // // //         }

// // // //         /* ── LAYOUT: stacked (widget full-width above cards) ── */
// // // //         .wdd-home[data-layout='stacked'] .wdd-band-inner {
// // // //           grid-template-columns: 1fr;
// // // //           gap: 28px;
// // // //         }
// // // //         .wdd-home[data-layout='stacked'] .wdd-band:nth-of-type(even) {
// // // //           background: var(--wdd-bg-alt);
// // // //         }

// // // //         /* ── WIDGET ── */
// // // //         .wdd-home .wdd-cat-widget {
// // // //           background: var(--wdd-surface);
// // // //           border: 1px solid var(--wdd-border);
// // // //           border-radius: 14px;
// // // //           padding: 32px 30px;
// // // //           box-shadow: var(--wdd-widget-shadow);
// // // //         }
// // // //         .wdd-home .wdd-cat-kicker {
// // // //           font-size: 11px;
// // // //           font-weight: 700;
// // // //           color: var(--wdd-accent);
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.09em;
// // // //           margin-bottom: 10px;
// // // //           display: flex;
// // // //           align-items: center;
// // // //           gap: 10px;
// // // //         }
// // // //         .wdd-home .wdd-cat-kicker::before {
// // // //           content: '';
// // // //           width: 22px;
// // // //           height: 2px;
// // // //           background: var(--wdd-accent);
// // // //           display: inline-block;
// // // //         }
// // // //         .wdd-home .wdd-cat-widget h2 {
// // // //           font-size: 32px;
// // // //           font-weight: 700;
// // // //           color: var(--wdd-text-strong);
// // // //           letter-spacing: -0.025em;
// // // //           margin: 0 0 12px;
// // // //           line-height: 1.1;
// // // //         }
// // // //         .wdd-home .wdd-cat-blurb {
// // // //           color: var(--wdd-text-muted);
// // // //           font-size: 14.5px;
// // // //           line-height: 1.6;
// // // //           margin: 0 0 22px;
// // // //         }
// // // //         .wdd-home .wdd-cat-stats {
// // // //           display: flex;
// // // //           gap: 24px;
// // // //           padding: 16px 0;
// // // //           border-top: 1px solid var(--wdd-border);
// // // //           border-bottom: 1px solid var(--wdd-border);
// // // //           margin-bottom: 20px;
// // // //         }
// // // //         .wdd-home .wdd-stat-n {
// // // //           font-size: 26px;
// // // //           font-weight: 700;
// // // //           color: var(--wdd-accent);
// // // //           line-height: 1;
// // // //           display: block;
// // // //           margin-bottom: 4px;
// // // //         }
// // // //         .wdd-home .wdd-stat-label {
// // // //           font-size: 10.5px;
// // // //           color: var(--wdd-text-subtle);
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.06em;
// // // //         }
// // // //         .wdd-home .wdd-cat-breakdown {
// // // //           list-style: none;
// // // //           margin: 0 0 22px;
// // // //           padding: 0;
// // // //         }
// // // //         .wdd-home .wdd-cat-breakdown li {
// // // //           display: flex;
// // // //           justify-content: space-between;
// // // //           padding: 6px 0;
// // // //           font-size: 13.5px;
// // // //           color: var(--wdd-text);
// // // //           border-bottom: 1px solid var(--wdd-border-faint);
// // // //         }
// // // //         .wdd-home .wdd-cat-breakdown li:last-child {
// // // //           border-bottom: none;
// // // //         }
// // // //         .wdd-home .wdd-breakdown-n {
// // // //           color: var(--wdd-text-faint);
// // // //           font-family: ui-monospace, monospace;
// // // //           font-size: 12px;
// // // //         }
// // // //         .wdd-home .wdd-cat-cta {
// // // //           display: inline-block;
// // // //           background: var(--wdd-accent);
// // // //           color: var(--wdd-cta-text);
// // // //           padding: 11px 22px;
// // // //           border-radius: 8px;
// // // //           font-size: 14px;
// // // //           font-weight: 600;
// // // //         }
// // // //         .wdd-home .wdd-cat-cta:hover {
// // // //           background: var(--wdd-accent-hover);
// // // //           color: var(--wdd-cta-text);
// // // //         }

// // // //         /* ── CARDS ── */
// // // //         .wdd-home .wdd-cards-side {
// // // //           min-width: 0;
// // // //         }
// // // //         .wdd-home .wdd-cards-title {
// // // //           font-size: 11.5px;
// // // //           font-weight: 700;
// // // //           color: var(--wdd-text-subtle);
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.08em;
// // // //           margin-bottom: 16px;
// // // //         }
// // // //         .wdd-home .wdd-card-grid {
// // // //           display: grid;
// // // //           grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
// // // //           gap: 12px;
// // // //         }
// // // //         .wdd-home .wdd-card {
// // // //           background: var(--wdd-surface);
// // // //           border: 1px solid var(--wdd-border);
// // // //           padding: 18px 20px;
// // // //           border-radius: 10px;
// // // //           transition: all 0.15s;
// // // //           display: block;
// // // //           color: inherit;
// // // //           box-shadow: var(--wdd-card-shadow);
// // // //         }
// // // //         .wdd-home .wdd-card:hover {
// // // //           border-color: var(--wdd-accent);
// // // //           transform: translateY(-2px);
// // // //           box-shadow: 0 4px 14px var(--wdd-accent-shadow);
// // // //           color: inherit;
// // // //         }
// // // //         .wdd-home .wdd-card-kicker {
// // // //           font-size: 10px;
// // // //           font-weight: 700;
// // // //           color: var(--wdd-text-subtle);
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.08em;
// // // //           margin-bottom: 6px;
// // // //         }
// // // //         .wdd-home .wdd-card-name {
// // // //           font-weight: 600;
// // // //           font-size: 15px;
// // // //           color: var(--wdd-text-strong);
// // // //           margin-bottom: 6px;
// // // //           line-height: 1.3;
// // // //         }
// // // //         .wdd-home .wdd-card-desc {
// // // //           font-size: 12.5px;
// // // //           color: var(--wdd-text-muted);
// // // //           line-height: 1.55;
// // // //           margin-bottom: 10px;
// // // //         }
// // // //         .wdd-home .wdd-card-meta {
// // // //           display: flex;
// // // //           gap: 8px;
// // // //           align-items: center;
// // // //           font-size: 11.5px;
// // // //           color: var(--wdd-text-subtle);
// // // //           padding-top: 8px;
// // // //           border-top: 1px solid var(--wdd-border-faint);
// // // //         }
// // // //         .wdd-home .wdd-card-tag {
// // // //           background: var(--wdd-accent-tint);
// // // //           color: var(--wdd-accent);
// // // //           padding: 1px 6px;
// // // //           border-radius: 3px;
// // // //           font-weight: 600;
// // // //           font-size: 10px;
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.05em;
// // // //         }

// // // //         /* ── RESPONSIVE ── */
// // // //         @media (max-width: 900px) {
// // // //           .wdd-home .wdd-band-inner,
// // // //           .wdd-home[data-layout='zigzag'] .wdd-band-inner,
// // // //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
// // // //             grid-template-columns: 1fr;
// // // //             gap: 24px;
// // // //           }
// // // //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
// // // //             order: 0;
// // // //           }
// // // //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
// // // //             order: 1;
// // // //           }
// // // //           .wdd-home .wdd-hero h1 {
// // // //             font-size: 32px;
// // // //           }
// // // //         }
// // // //       `}</style>

// // // //     </div>
// // // //   );
// // // // }


// // // // app/components/home-page/HomePage.jsx
// // // //
// // // // Homepage template. One file, self-contained. Renders NO h1/h2 itself —
// // // // heading elements are owned by the page (SEO) and passed in:
// // // //
// // // //   heading             — JSX node for the hero heading, e.g.
// // // //                         <h1 className="wdd-hero-h1">...</h1>
// // // //   renderPillarHeading — (pillar) => JSX node, e.g.
// // // //                         (pillar) => <h2 className="wdd-cat-h2">{pillar.title}</h2>
// // // //
// // // // The component styles the classes (.wdd-hero-h1, .wdd-cat-h2) but never
// // // // decides the tag. If the page passes nothing, non-heading <div> fallbacks
// // // // are rendered so the component alone never emits h1/h2.
// // // //
// // // // Other props:
// // // //   pillars — from data/home-catalog.js (AUTO-GENERATED):
// // // //     [
// // // //       {
// // // //         id, title, href, blurb, cardsTitle, ctaLabel,
// // // //         stats:     [{ n, label }],
// // // //         breakdown: [{ label, count }],
// // // //         cards:     [{ name, desc, href, tag, kicker }]
// // // //       }
// // // //     ]
// // // //   hero    — { subtitle, searchPlaceholder } (optional)
// // // //   layout  — 'zigzag' (default) | 'stacked'   — extend LAYOUTS below
// // // //   theme   — 'light' (default) | 'dark'       — extend THEMES below
// // // //
// // // // Extensibility model:
// // // //   - Themes are pure token objects. A theme becomes CSS custom properties
// // // //     on the root element; all styles read only variables. Adding a theme
// // // //     = adding one object to THEMES. No style rules change.
// // // //   - Layouts share the same markup; the root carries data-layout="..."
// // // //     and layout-specific CSS keys off that attribute. Adding a layout
// // // //     = registering its id in LAYOUTS and adding a CSS block for
// // // //     [data-layout='your-id'].

// // // import React, { useEffect, useRef } from 'react';

// // // // ─────────────────────────────────────────────────────────────
// // // // Themes — token objects, applied as CSS variables
// // // // ─────────────────────────────────────────────────────────────

// // // const THEMES = {
// // //   light: {
// // //     bg: '#ffffff',
// // //     bgAlt: '#fafafa',
// // //     surface: '#ffffff',
// // //     text: '#18181b',
// // //     textStrong: '#09090b',
// // //     textMuted: '#52525b',
// // //     textSubtle: '#71717a',
// // //     textFaint: '#a1a1aa',
// // //     border: '#e4e4e7',
// // //     borderFaint: '#f4f4f5',
// // //     inputBorder: '#d4d4d8',
// // //     accent: '#4D4DFF',
// // //     accentHover: '#3838cc',
// // //     accentTint: 'rgba(77, 77, 255, 0.08)',
// // //     accentRing: 'rgba(77, 77, 255, 0.12)',
// // //     accentShadow: 'rgba(77, 77, 255, 0.10)',
// // //     kbdBg: '#f4f4f5',
// // //     ctaText: '#ffffff',
// // //     cardShadow: '0 1px 2px rgba(0,0,0,0.02)',
// // //     widgetShadow: '0 2px 8px rgba(0,0,0,0.02)',
// // //   },
// // //   dark: {
// // //     bg: '#09090b',
// // //     bgAlt: '#101012',
// // //     surface: '#141417',
// // //     text: '#e4e4e7',
// // //     textStrong: '#fafafa',
// // //     textMuted: '#a1a1aa',
// // //     textSubtle: '#8b8b93',
// // //     textFaint: '#71717a',
// // //     border: '#26262b',
// // //     borderFaint: '#1c1c21',
// // //     inputBorder: '#33333a',
// // //     accent: '#6b6bff',
// // //     accentHover: '#8a8aff',
// // //     accentTint: 'rgba(107, 107, 255, 0.14)',
// // //     accentRing: 'rgba(107, 107, 255, 0.22)',
// // //     accentShadow: 'rgba(107, 107, 255, 0.18)',
// // //     kbdBg: '#1c1c21',
// // //     ctaText: '#ffffff',
// // //     cardShadow: '0 1px 2px rgba(0,0,0,0.4)',
// // //     widgetShadow: '0 2px 8px rgba(0,0,0,0.4)',
// // //   },
// // // };

// // // // ─────────────────────────────────────────────────────────────
// // // // Layouts — registered ids; CSS keys off data-layout
// // // // ─────────────────────────────────────────────────────────────

// // // const LAYOUTS = ['zigzag', 'stacked'];

// // // const HERO_DEFAULTS = {
// // //   subtitle: 'Reference, tools, and tutorials. Fast, clean, modern. Zero ads above the fold, ever.',
// // //   searchPlaceholder: 'Search tools, functions, tutorials...',
// // // };

// // // // ─────────────────────────────────────────────────────────────
// // // // Component
// // // // ─────────────────────────────────────────────────────────────

// // // export default function HomePage({
// // //   pillars = [],
// // //   hero = {},
// // //   heading = null,
// // //   renderPillarHeading = null,
// // //   layout = 'zigzag',
// // //   theme = 'light',
// // // }) {
// // //   const t = THEMES[theme] || THEMES.light;
// // //   const activeLayout = LAYOUTS.includes(layout) ? layout : 'zigzag';
// // //   const heroContent = { ...HERO_DEFAULTS, ...hero };
// // //   const searchRef = useRef(null);

// // //   // Cmd/Ctrl+K focuses search, Escape blurs it.
// // //   useEffect(() => {
// // //     const onKeyDown = (e) => {
// // //       if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
// // //         e.preventDefault();
// // //         if (searchRef.current) searchRef.current.focus();
// // //       }
// // //       if (e.key === 'Escape' && searchRef.current === document.activeElement) {
// // //         searchRef.current.blur();
// // //       }
// // //     };
// // //     window.addEventListener('keydown', onKeyDown);
// // //     return () => window.removeEventListener('keydown', onKeyDown);
// // //   }, []);

// // //   // Theme tokens → CSS variables on the root node.
// // //   const cssVars = {
// // //     '--wdd-bg': t.bg,
// // //     '--wdd-bg-alt': t.bgAlt,
// // //     '--wdd-surface': t.surface,
// // //     '--wdd-text': t.text,
// // //     '--wdd-text-strong': t.textStrong,
// // //     '--wdd-text-muted': t.textMuted,
// // //     '--wdd-text-subtle': t.textSubtle,
// // //     '--wdd-text-faint': t.textFaint,
// // //     '--wdd-border': t.border,
// // //     '--wdd-border-faint': t.borderFaint,
// // //     '--wdd-input-border': t.inputBorder,
// // //     '--wdd-accent': t.accent,
// // //     '--wdd-accent-hover': t.accentHover,
// // //     '--wdd-accent-tint': t.accentTint,
// // //     '--wdd-accent-ring': t.accentRing,
// // //     '--wdd-accent-shadow': t.accentShadow,
// // //     '--wdd-kbd-bg': t.kbdBg,
// // //     '--wdd-cta-text': t.ctaText,
// // //     '--wdd-card-shadow': t.cardShadow,
// // //     '--wdd-widget-shadow': t.widgetShadow,
// // //   };

// // //   return (
// // //     <div className="wdd-home" data-layout={activeLayout} data-theme={theme} style={cssVars}>

// // //       {/* ── HERO ── */}
// // //       <div className="wdd-hero-wrap">
// // //         <div className="wdd-hero">
// // //           {heading || <div className="wdd-hero-h1">WebDevData</div>}
// // //           <p className="wdd-hero-sub">{heroContent.subtitle}</p>
// // //           <div className="wdd-search-wrap">
// // //             <span className="wdd-search-icon" aria-hidden="true">&#8981;</span>
// // //             <input
// // //               ref={searchRef}
// // //               className="wdd-search-input"
// // //               type="text"
// // //               placeholder={heroContent.searchPlaceholder}
// // //               aria-label="Search the site"
// // //             />
// // //             <span className="wdd-kbd" aria-hidden="true">&#8984;K</span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* ── PILLAR BANDS ── */}
// // //       {pillars.map((pillar) => (
// // //         <section className="wdd-band" key={pillar.id}>
// // //           <div className="wdd-band-inner">

// // //             <div className="wdd-cat-widget">
// // //               <div className="wdd-cat-kicker">Category</div>
// // //               {renderPillarHeading
// // //                 ? renderPillarHeading(pillar)
// // //                 : <div className="wdd-cat-h2">{pillar.title}</div>}
// // //               <p className="wdd-cat-blurb">{pillar.blurb}</p>

// // //               {pillar.stats && pillar.stats.length > 0 && (
// // //                 <div className="wdd-cat-stats">
// // //                   {pillar.stats.map((stat) => (
// // //                     <div className="wdd-stat" key={stat.label}>
// // //                       <span className="wdd-stat-n">{stat.n}</span>
// // //                       <span className="wdd-stat-label">{stat.label}</span>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}

// // //               {pillar.breakdown && pillar.breakdown.length > 0 && (
// // //                 <ul className="wdd-cat-breakdown">
// // //                   {pillar.breakdown.map((item) => (
// // //                     <li key={item.label}>
// // //                       {item.label} <span className="wdd-breakdown-n">{item.count}</span>
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               )}

// // //               <a href={pillar.href} className="wdd-cat-cta">
// // //                 {pillar.ctaLabel} &rarr;
// // //               </a>
// // //             </div>

// // //             <div className="wdd-cards-side">
// // //               <div className="wdd-cards-title">{pillar.cardsTitle}</div>
// // //               <div className="wdd-card-grid">
// // //                 {pillar.cards.map((card) => (
// // //                   <a href={card.href} className="wdd-card" key={card.href}>
// // //                     {card.kicker && <div className="wdd-card-kicker">{card.kicker}</div>}
// // //                     <div className="wdd-card-name">{card.name}</div>
// // //                     {card.desc && <div className="wdd-card-desc">{card.desc}</div>}
// // //                     {card.tag && (
// // //                       <div className="wdd-card-meta">
// // //                         <span className="wdd-card-tag">{card.tag}</span>
// // //                       </div>
// // //                     )}
// // //                   </a>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //           </div>
// // //         </section>
// // //       ))}

// // //       <style jsx global>{`
// // //         .wdd-home {
// // //           background: var(--wdd-bg);
// // //           color: var(--wdd-text);
// // //           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
// // //           font-size: 15px;
// // //           line-height: 1.55;
// // //           -webkit-font-smoothing: antialiased;
// // //         }
// // //         .wdd-home a {
// // //           color: var(--wdd-accent);
// // //           text-decoration: none;
// // //         }
// // //         .wdd-home a:hover {
// // //           color: var(--wdd-accent-hover);
// // //         }

// // //         /* ── HERO ── */
// // //         .wdd-home .wdd-hero-wrap {
// // //           max-width: 1240px;
// // //           margin: 0 auto;
// // //           padding: 64px 32px 40px;
// // //         }
// // //         .wdd-home .wdd-hero {
// // //           text-align: center;
// // //           margin-bottom: 40px;
// // //         }
// // //         .wdd-home .wdd-hero-h1 {
// // //           font-size: 44px;
// // //           font-weight: 700;
// // //           letter-spacing: -0.03em;
// // //           margin: 0 0 14px;
// // //           color: var(--wdd-text-strong);
// // //           line-height: 1.1;
// // //         }
// // //         .wdd-home .wdd-hero-sub {
// // //           color: var(--wdd-text-muted);
// // //           font-size: 17px;
// // //           max-width: 560px;
// // //           margin: 0 auto;
// // //         }
// // //         .wdd-home .wdd-search-wrap {
// // //           max-width: 640px;
// // //           margin: 36px auto 0;
// // //           position: relative;
// // //         }
// // //         .wdd-home .wdd-search-input {
// // //           width: 100%;
// // //           box-sizing: border-box;
// // //           background: var(--wdd-surface);
// // //           border: 1px solid var(--wdd-input-border);
// // //           color: var(--wdd-text);
// // //           padding: 16px 20px 16px 48px;
// // //           font-size: 16px;
// // //           border-radius: 10px;
// // //           outline: none;
// // //           font-family: inherit;
// // //           box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
// // //         }
// // //         .wdd-home .wdd-search-input:focus {
// // //           border-color: var(--wdd-accent);
// // //           box-shadow: 0 0 0 3px var(--wdd-accent-ring);
// // //         }
// // //         .wdd-home .wdd-search-input::placeholder {
// // //           color: var(--wdd-text-faint);
// // //         }
// // //         .wdd-home .wdd-search-icon {
// // //           position: absolute;
// // //           left: 18px;
// // //           top: 50%;
// // //           transform: translateY(-50%);
// // //           color: var(--wdd-text-faint);
// // //           font-size: 16px;
// // //         }
// // //         .wdd-home .wdd-kbd {
// // //           position: absolute;
// // //           right: 14px;
// // //           top: 50%;
// // //           transform: translateY(-50%);
// // //           background: var(--wdd-kbd-bg);
// // //           border: 1px solid var(--wdd-border);
// // //           padding: 3px 8px;
// // //           border-radius: 5px;
// // //           font-family: ui-monospace, monospace;
// // //           font-size: 12px;
// // //           color: var(--wdd-text-muted);
// // //         }

// // //         /* ── BANDS (shared) ── */
// // //         .wdd-home .wdd-band {
// // //           padding: 56px 0;
// // //           border-top: 1px solid var(--wdd-border);
// // //         }
// // //         .wdd-home .wdd-band-inner {
// // //           max-width: 1240px;
// // //           margin: 0 auto;
// // //           padding: 0 32px;
// // //           display: grid;
// // //           gap: 48px;
// // //           align-items: start;
// // //         }

// // //         /* ── LAYOUT: zigzag ── */
// // //         .wdd-home[data-layout='zigzag'] .wdd-band-inner {
// // //           grid-template-columns: 360px 1fr;
// // //         }
// // //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
// // //           grid-template-columns: 1fr 360px;
// // //         }
// // //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
// // //           order: 2;
// // //         }
// // //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
// // //           order: 1;
// // //         }
// // //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) {
// // //           background: var(--wdd-bg-alt);
// // //         }

// // //         /* ── LAYOUT: stacked (widget full-width above cards) ── */
// // //         .wdd-home[data-layout='stacked'] .wdd-band-inner {
// // //           grid-template-columns: 1fr;
// // //           gap: 28px;
// // //         }
// // //         .wdd-home[data-layout='stacked'] .wdd-band:nth-of-type(even) {
// // //           background: var(--wdd-bg-alt);
// // //         }

// // //         /* ── WIDGET ── */
// // //         .wdd-home .wdd-cat-widget {
// // //           background: var(--wdd-surface);
// // //           border: 1px solid var(--wdd-border);
// // //           border-radius: 14px;
// // //           padding: 32px 30px;
// // //           box-shadow: var(--wdd-widget-shadow);
// // //         }
// // //         .wdd-home .wdd-cat-kicker {
// // //           font-size: 11px;
// // //           font-weight: 700;
// // //           color: var(--wdd-accent);
// // //           text-transform: uppercase;
// // //           letter-spacing: 0.09em;
// // //           margin-bottom: 10px;
// // //           display: flex;
// // //           align-items: center;
// // //           gap: 10px;
// // //         }
// // //         .wdd-home .wdd-cat-kicker::before {
// // //           content: '';
// // //           width: 22px;
// // //           height: 2px;
// // //           background: var(--wdd-accent);
// // //           display: inline-block;
// // //         }
// // //         .wdd-home .wdd-cat-h2 {
// // //           font-size: 32px;
// // //           font-weight: 700;
// // //           color: var(--wdd-text-strong);
// // //           letter-spacing: -0.025em;
// // //           margin: 0 0 12px;
// // //           line-height: 1.1;
// // //         }
// // //         .wdd-home .wdd-cat-blurb {
// // //           color: var(--wdd-text-muted);
// // //           font-size: 14.5px;
// // //           line-height: 1.6;
// // //           margin: 0 0 22px;
// // //         }
// // //         .wdd-home .wdd-cat-stats {
// // //           display: flex;
// // //           gap: 24px;
// // //           padding: 16px 0;
// // //           border-top: 1px solid var(--wdd-border);
// // //           border-bottom: 1px solid var(--wdd-border);
// // //           margin-bottom: 20px;
// // //         }
// // //         .wdd-home .wdd-stat-n {
// // //           font-size: 26px;
// // //           font-weight: 700;
// // //           color: var(--wdd-accent);
// // //           line-height: 1;
// // //           display: block;
// // //           margin-bottom: 4px;
// // //         }
// // //         .wdd-home .wdd-stat-label {
// // //           font-size: 10.5px;
// // //           color: var(--wdd-text-subtle);
// // //           text-transform: uppercase;
// // //           letter-spacing: 0.06em;
// // //         }
// // //         .wdd-home .wdd-cat-breakdown {
// // //           list-style: none;
// // //           margin: 0 0 22px;
// // //           padding: 0;
// // //         }
// // //         .wdd-home .wdd-cat-breakdown li {
// // //           display: flex;
// // //           justify-content: space-between;
// // //           padding: 6px 0;
// // //           font-size: 13.5px;
// // //           color: var(--wdd-text);
// // //           border-bottom: 1px solid var(--wdd-border-faint);
// // //         }
// // //         .wdd-home .wdd-cat-breakdown li:last-child {
// // //           border-bottom: none;
// // //         }
// // //         .wdd-home .wdd-breakdown-n {
// // //           color: var(--wdd-text-faint);
// // //           font-family: ui-monospace, monospace;
// // //           font-size: 12px;
// // //         }
// // //         .wdd-home .wdd-cat-cta {
// // //           display: inline-block;
// // //           background: var(--wdd-accent);
// // //           color: var(--wdd-cta-text);
// // //           padding: 11px 22px;
// // //           border-radius: 8px;
// // //           font-size: 14px;
// // //           font-weight: 600;
// // //         }
// // //         .wdd-home .wdd-cat-cta:hover {
// // //           background: var(--wdd-accent-hover);
// // //           color: var(--wdd-cta-text);
// // //         }

// // //         /* ── CARDS ── */
// // //         .wdd-home .wdd-cards-side {
// // //           min-width: 0;
// // //         }
// // //         .wdd-home .wdd-cards-title {
// // //           font-size: 11.5px;
// // //           font-weight: 700;
// // //           color: var(--wdd-text-subtle);
// // //           text-transform: uppercase;
// // //           letter-spacing: 0.08em;
// // //           margin-bottom: 16px;
// // //         }
// // //         .wdd-home .wdd-card-grid {
// // //           display: grid;
// // //           grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
// // //           gap: 12px;
// // //         }
// // //         .wdd-home .wdd-card {
// // //           background: var(--wdd-surface);
// // //           border: 1px solid var(--wdd-border);
// // //           padding: 18px 20px;
// // //           border-radius: 10px;
// // //           transition: all 0.15s;
// // //           display: block;
// // //           color: inherit;
// // //           box-shadow: var(--wdd-card-shadow);
// // //         }
// // //         .wdd-home .wdd-card:hover {
// // //           border-color: var(--wdd-accent);
// // //           transform: translateY(-2px);
// // //           box-shadow: 0 4px 14px var(--wdd-accent-shadow);
// // //           color: inherit;
// // //         }
// // //         .wdd-home .wdd-card-kicker {
// // //           font-size: 10px;
// // //           font-weight: 700;
// // //           color: var(--wdd-text-subtle);
// // //           text-transform: uppercase;
// // //           letter-spacing: 0.08em;
// // //           margin-bottom: 6px;
// // //         }
// // //         .wdd-home .wdd-card-name {
// // //           font-weight: 600;
// // //           font-size: 15px;
// // //           color: var(--wdd-text-strong);
// // //           margin-bottom: 6px;
// // //           line-height: 1.3;
// // //         }
// // //         .wdd-home .wdd-card-desc {
// // //           font-size: 12.5px;
// // //           color: var(--wdd-text-muted);
// // //           line-height: 1.55;
// // //           margin-bottom: 10px;
// // //         }
// // //         .wdd-home .wdd-card-meta {
// // //           display: flex;
// // //           gap: 8px;
// // //           align-items: center;
// // //           font-size: 11.5px;
// // //           color: var(--wdd-text-subtle);
// // //           padding-top: 8px;
// // //           border-top: 1px solid var(--wdd-border-faint);
// // //         }
// // //         .wdd-home .wdd-card-tag {
// // //           background: var(--wdd-accent-tint);
// // //           color: var(--wdd-accent);
// // //           padding: 1px 6px;
// // //           border-radius: 3px;
// // //           font-weight: 600;
// // //           font-size: 10px;
// // //           text-transform: uppercase;
// // //           letter-spacing: 0.05em;
// // //         }

// // //         /* ── RESPONSIVE ── */
// // //         @media (max-width: 900px) {
// // //           .wdd-home .wdd-band-inner,
// // //           .wdd-home[data-layout='zigzag'] .wdd-band-inner,
// // //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
// // //             grid-template-columns: 1fr;
// // //             gap: 24px;
// // //           }
// // //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
// // //             order: 0;
// // //           }
// // //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
// // //             order: 1;
// // //           }
// // //           .wdd-home .wdd-hero-h1 {
// // //             font-size: 32px;
// // //           }
// // //         }
// // //       `}</style>

// // //     </div>
// // //   );
// // // }


// // // app/components/home-page/HomePage.jsx
// // //
// // // Structure-only homepage component. Renders the search box and the pillar
// // // bands from dynamic catalog data. Contains NO h1/h2/p content tags and no
// // // hardcoded text — all text on screen comes either from the page (which
// // // renders its own h1/paragraphs above this component) or from the catalog
// // // data passed in as props.
// // //
// // // Props:
// // //   pillars — from data/home-catalog.js (AUTO-GENERATED):
// // //     [
// // //       {
// // //         id, title, href, blurb, cardsTitle, ctaLabel,
// // //         stats:     [{ n, label }],
// // //         breakdown: [{ label, count }],
// // //         cards:     [{ name, desc, href, tag, kicker }]
// // //       }
// // //     ]
// // //   searchPlaceholder — string for the search input (from the page)
// // //   layout  — 'zigzag' (default) | 'stacked'   — extend LAYOUTS below
// // //   theme   — 'light' (default) | 'dark'       — extend THEMES below
// // //
// // // Extensibility model:
// // //   - Themes are pure token objects. A theme becomes CSS custom properties
// // //     on the root element; all styles read only variables. Adding a theme
// // //     = adding one object to THEMES. No style rules change.
// // //   - Layouts share the same markup; the root carries data-layout="..."
// // //     and layout-specific CSS keys off that attribute. Adding a layout
// // //     = registering its id in LAYOUTS and adding a CSS block for
// // //     [data-layout='your-id'].

// // import React, { useEffect, useRef } from 'react';

// // // ─────────────────────────────────────────────────────────────
// // // Themes — token objects, applied as CSS variables
// // // ─────────────────────────────────────────────────────────────

// // const THEMES = {
// //   light: {
// //     bg: '#ffffff',
// //     bgAlt: '#fafafa',
// //     surface: '#ffffff',
// //     text: '#18181b',
// //     textStrong: '#09090b',
// //     textMuted: '#52525b',
// //     textSubtle: '#71717a',
// //     textFaint: '#a1a1aa',
// //     border: '#e4e4e7',
// //     borderFaint: '#f4f4f5',
// //     inputBorder: '#d4d4d8',
// //     accent: '#4D4DFF',
// //     accentHover: '#3838cc',
// //     accentTint: 'rgba(77, 77, 255, 0.08)',
// //     accentRing: 'rgba(77, 77, 255, 0.12)',
// //     accentShadow: 'rgba(77, 77, 255, 0.10)',
// //     kbdBg: '#f4f4f5',
// //     ctaText: '#ffffff',
// //     cardShadow: '0 1px 2px rgba(0,0,0,0.02)',
// //     widgetShadow: '0 2px 8px rgba(0,0,0,0.02)',
// //   },
// //   dark: {
// //     bg: '#09090b',
// //     bgAlt: '#101012',
// //     surface: '#141417',
// //     text: '#e4e4e7',
// //     textStrong: '#fafafa',
// //     textMuted: '#a1a1aa',
// //     textSubtle: '#8b8b93',
// //     textFaint: '#71717a',
// //     border: '#26262b',
// //     borderFaint: '#1c1c21',
// //     inputBorder: '#33333a',
// //     accent: '#6b6bff',
// //     accentHover: '#8a8aff',
// //     accentTint: 'rgba(107, 107, 255, 0.14)',
// //     accentRing: 'rgba(107, 107, 255, 0.22)',
// //     accentShadow: 'rgba(107, 107, 255, 0.18)',
// //     kbdBg: '#1c1c21',
// //     ctaText: '#ffffff',
// //     cardShadow: '0 1px 2px rgba(0,0,0,0.4)',
// //     widgetShadow: '0 2px 8px rgba(0,0,0,0.4)',
// //   },
// // };

// // // ─────────────────────────────────────────────────────────────
// // // Layouts — registered ids; CSS keys off data-layout
// // // ─────────────────────────────────────────────────────────────

// // const LAYOUTS = ['zigzag', 'stacked'];

// // // ─────────────────────────────────────────────────────────────
// // // Component
// // // ─────────────────────────────────────────────────────────────

// // export default function HomePage({
// //   pillars = [],
// //   searchPlaceholder = '',
// //   layout = 'zigzag',
// //   theme = 'light',
// // }) {
// //   const t = THEMES[theme] || THEMES.light;
// //   const activeLayout = LAYOUTS.includes(layout) ? layout : 'zigzag';
// //   const searchRef = useRef(null);

// //   // Cmd/Ctrl+K focuses search, Escape blurs it.
// //   useEffect(() => {
// //     const onKeyDown = (e) => {
// //       if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
// //         e.preventDefault();
// //         if (searchRef.current) searchRef.current.focus();
// //       }
// //       if (e.key === 'Escape' && searchRef.current === document.activeElement) {
// //         searchRef.current.blur();
// //       }
// //     };
// //     window.addEventListener('keydown', onKeyDown);
// //     return () => window.removeEventListener('keydown', onKeyDown);
// //   }, []);

// //   // Theme tokens → CSS variables on the root node.
// //   const cssVars = {
// //     '--wdd-bg': t.bg,
// //     '--wdd-bg-alt': t.bgAlt,
// //     '--wdd-surface': t.surface,
// //     '--wdd-text': t.text,
// //     '--wdd-text-strong': t.textStrong,
// //     '--wdd-text-muted': t.textMuted,
// //     '--wdd-text-subtle': t.textSubtle,
// //     '--wdd-text-faint': t.textFaint,
// //     '--wdd-border': t.border,
// //     '--wdd-border-faint': t.borderFaint,
// //     '--wdd-input-border': t.inputBorder,
// //     '--wdd-accent': t.accent,
// //     '--wdd-accent-hover': t.accentHover,
// //     '--wdd-accent-tint': t.accentTint,
// //     '--wdd-accent-ring': t.accentRing,
// //     '--wdd-accent-shadow': t.accentShadow,
// //     '--wdd-kbd-bg': t.kbdBg,
// //     '--wdd-cta-text': t.ctaText,
// //     '--wdd-card-shadow': t.cardShadow,
// //     '--wdd-widget-shadow': t.widgetShadow,
// //   };

// //   return (
// //     <div className="wdd-home" data-layout={activeLayout} data-theme={theme} style={cssVars}>

// //       {/* ── SEARCH ── */}
// //       <div className="wdd-search-section">
// //         <div className="wdd-search-wrap">
// //           <span className="wdd-search-icon" aria-hidden="true">&#8981;</span>
// //           <input
// //             ref={searchRef}
// //             className="wdd-search-input"
// //             type="text"
// //             placeholder={searchPlaceholder}
// //             aria-label="Search the site"
// //           />
// //           <span className="wdd-kbd" aria-hidden="true">&#8984;K</span>
// //         </div>
// //       </div>

// //       {/* ── PILLAR BANDS ── */}
// //       {pillars.map((pillar) => (
// //         <section className="wdd-band" key={pillar.id}>
// //           <div className="wdd-band-inner">

// //             <div className="wdd-cat-widget">
// //               <div className="wdd-cat-title">{pillar.title}</div>
// //               <div className="wdd-cat-blurb">{pillar.blurb}</div>

// //               {pillar.stats && pillar.stats.length > 0 && (
// //                 <div className="wdd-cat-stats">
// //                   {pillar.stats.map((stat) => (
// //                     <div className="wdd-stat" key={stat.label}>
// //                       <span className="wdd-stat-n">{stat.n}</span>
// //                       <span className="wdd-stat-label">{stat.label}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}

// //               {pillar.breakdown && pillar.breakdown.length > 0 && (
// //                 <ul className="wdd-cat-breakdown">
// //                   {pillar.breakdown.map((item) => (
// //                     <li key={item.label}>
// //                       {item.label} <span className="wdd-breakdown-n">{item.count}</span>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               )}

// //               <a href={pillar.href} className="wdd-cat-cta">
// //                 {pillar.ctaLabel} &rarr;
// //               </a>
// //             </div>

// //             <div className="wdd-cards-side">
// //               <div className="wdd-cards-title">{pillar.cardsTitle}</div>
// //               <div className="wdd-card-grid">
// //                 {pillar.cards.map((card) => (
// //                   <a href={card.href} className="wdd-card" key={card.href}>
// //                     {card.kicker && <div className="wdd-card-kicker">{card.kicker}</div>}
// //                     <div className="wdd-card-name">{card.name}</div>
// //                     {card.desc && <div className="wdd-card-desc">{card.desc}</div>}
// //                     {card.tag && (
// //                       <div className="wdd-card-meta">
// //                         <span className="wdd-card-tag">{card.tag}</span>
// //                       </div>
// //                     )}
// //                   </a>
// //                 ))}
// //               </div>
// //             </div>

// //           </div>
// //         </section>
// //       ))}

// //       <style jsx global>{`
// //         .wdd-home {
// //           background: var(--wdd-bg);
// //           color: var(--wdd-text);
// //           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
// //           font-size: 15px;
// //           line-height: 1.55;
// //           -webkit-font-smoothing: antialiased;
// //         }
// //         .wdd-home a {
// //           color: var(--wdd-accent);
// //           text-decoration: none;
// //         }
// //         .wdd-home a:hover {
// //           color: var(--wdd-accent-hover);
// //         }

// //         /* ── SEARCH ── */
// //         .wdd-home .wdd-search-section {
// //           max-width: 1240px;
// //           margin: 0 auto;
// //           padding: 0 32px 40px;
// //         }
// //         .wdd-home .wdd-search-wrap {
// //           max-width: 640px;
// //           margin: 36px auto 0;
// //           position: relative;
// //         }
// //         .wdd-home .wdd-search-input {
// //           width: 100%;
// //           box-sizing: border-box;
// //           background: var(--wdd-surface);
// //           border: 1px solid var(--wdd-input-border);
// //           color: var(--wdd-text);
// //           padding: 16px 20px 16px 48px;
// //           font-size: 16px;
// //           border-radius: 10px;
// //           outline: none;
// //           font-family: inherit;
// //           box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
// //         }
// //         .wdd-home .wdd-search-input:focus {
// //           border-color: var(--wdd-accent);
// //           box-shadow: 0 0 0 3px var(--wdd-accent-ring);
// //         }
// //         .wdd-home .wdd-search-input::placeholder {
// //           color: var(--wdd-text-faint);
// //         }
// //         .wdd-home .wdd-search-icon {
// //           position: absolute;
// //           left: 18px;
// //           top: 50%;
// //           transform: translateY(-50%);
// //           color: var(--wdd-text-faint);
// //           font-size: 16px;
// //         }
// //         .wdd-home .wdd-kbd {
// //           position: absolute;
// //           right: 14px;
// //           top: 50%;
// //           transform: translateY(-50%);
// //           background: var(--wdd-kbd-bg);
// //           border: 1px solid var(--wdd-border);
// //           padding: 3px 8px;
// //           border-radius: 5px;
// //           font-family: ui-monospace, monospace;
// //           font-size: 12px;
// //           color: var(--wdd-text-muted);
// //         }

// //         /* ── BANDS (shared) ── */
// //         .wdd-home .wdd-band {
// //           padding: 56px 0;
// //           border-top: 1px solid var(--wdd-border);
// //         }
// //         .wdd-home .wdd-band-inner {
// //           max-width: 1240px;
// //           margin: 0 auto;
// //           padding: 0 32px;
// //           display: grid;
// //           gap: 48px;
// //           align-items: start;
// //         }

// //         /* ── LAYOUT: zigzag ── */
// //         .wdd-home[data-layout='zigzag'] .wdd-band-inner {
// //           grid-template-columns: 360px 1fr;
// //         }
// //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
// //           grid-template-columns: 1fr 360px;
// //         }
// //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
// //           order: 2;
// //         }
// //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
// //           order: 1;
// //         }
// //         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) {
// //           background: var(--wdd-bg-alt);
// //         }

// //         /* ── LAYOUT: stacked (widget full-width above cards) ── */
// //         .wdd-home[data-layout='stacked'] .wdd-band-inner {
// //           grid-template-columns: 1fr;
// //           gap: 28px;
// //         }
// //         .wdd-home[data-layout='stacked'] .wdd-band:nth-of-type(even) {
// //           background: var(--wdd-bg-alt);
// //         }

// //         /* ── WIDGET ── */
// //         .wdd-home .wdd-cat-widget {
// //           background: var(--wdd-surface);
// //           border: 1px solid var(--wdd-border);
// //           border-radius: 14px;
// //           padding: 32px 30px;
// //           box-shadow: var(--wdd-widget-shadow);
// //         }
// //         .wdd-home .wdd-cat-title {
// //           font-size: 32px;
// //           font-weight: 700;
// //           color: var(--wdd-text-strong);
// //           letter-spacing: -0.025em;
// //           margin: 0 0 12px;
// //           line-height: 1.1;
// //         }
// //         .wdd-home .wdd-cat-blurb {
// //           color: var(--wdd-text-muted);
// //           font-size: 14.5px;
// //           line-height: 1.6;
// //           margin: 0 0 22px;
// //         }
// //         .wdd-home .wdd-cat-stats {
// //           display: flex;
// //           gap: 24px;
// //           padding: 16px 0;
// //           border-top: 1px solid var(--wdd-border);
// //           border-bottom: 1px solid var(--wdd-border);
// //           margin-bottom: 20px;
// //         }
// //         .wdd-home .wdd-stat-n {
// //           font-size: 26px;
// //           font-weight: 700;
// //           color: var(--wdd-accent);
// //           line-height: 1;
// //           display: block;
// //           margin-bottom: 4px;
// //         }
// //         .wdd-home .wdd-stat-label {
// //           font-size: 10.5px;
// //           color: var(--wdd-text-subtle);
// //           text-transform: uppercase;
// //           letter-spacing: 0.06em;
// //         }
// //         .wdd-home .wdd-cat-breakdown {
// //           list-style: none;
// //           margin: 0 0 22px;
// //           padding: 0;
// //         }
// //         .wdd-home .wdd-cat-breakdown li {
// //           display: flex;
// //           justify-content: space-between;
// //           padding: 6px 0;
// //           font-size: 13.5px;
// //           color: var(--wdd-text);
// //           border-bottom: 1px solid var(--wdd-border-faint);
// //         }
// //         .wdd-home .wdd-cat-breakdown li:last-child {
// //           border-bottom: none;
// //         }
// //         .wdd-home .wdd-breakdown-n {
// //           color: var(--wdd-text-faint);
// //           font-family: ui-monospace, monospace;
// //           font-size: 12px;
// //         }
// //         .wdd-home .wdd-cat-cta {
// //           display: inline-block;
// //           background: var(--wdd-accent);
// //           color: var(--wdd-cta-text);
// //           padding: 11px 22px;
// //           border-radius: 8px;
// //           font-size: 14px;
// //           font-weight: 600;
// //         }
// //         .wdd-home .wdd-cat-cta:hover {
// //           background: var(--wdd-accent-hover);
// //           color: var(--wdd-cta-text);
// //         }

// //         /* ── CARDS ── */
// //         .wdd-home .wdd-cards-side {
// //           min-width: 0;
// //         }
// //         .wdd-home .wdd-cards-title {
// //           font-size: 11.5px;
// //           font-weight: 700;
// //           color: var(--wdd-text-subtle);
// //           text-transform: uppercase;
// //           letter-spacing: 0.08em;
// //           margin-bottom: 16px;
// //         }
// //         .wdd-home .wdd-card-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
// //           gap: 12px;
// //         }
// //         .wdd-home .wdd-card {
// //           background: var(--wdd-surface);
// //           border: 1px solid var(--wdd-border);
// //           padding: 18px 20px;
// //           border-radius: 10px;
// //           transition: all 0.15s;
// //           display: block;
// //           color: inherit;
// //           box-shadow: var(--wdd-card-shadow);
// //         }
// //         .wdd-home .wdd-card:hover {
// //           border-color: var(--wdd-accent);
// //           transform: translateY(-2px);
// //           box-shadow: 0 4px 14px var(--wdd-accent-shadow);
// //           color: inherit;
// //         }
// //         .wdd-home .wdd-card-kicker {
// //           font-size: 10px;
// //           font-weight: 700;
// //           color: var(--wdd-text-subtle);
// //           text-transform: uppercase;
// //           letter-spacing: 0.08em;
// //           margin-bottom: 6px;
// //         }
// //         .wdd-home .wdd-card-name {
// //           font-weight: 600;
// //           font-size: 15px;
// //           color: var(--wdd-text-strong);
// //           margin-bottom: 6px;
// //           line-height: 1.3;
// //         }
// //         .wdd-home .wdd-card-desc {
// //           font-size: 12.5px;
// //           color: var(--wdd-text-muted);
// //           line-height: 1.55;
// //           margin-bottom: 10px;
// //         }
// //         .wdd-home .wdd-card-meta {
// //           display: flex;
// //           gap: 8px;
// //           align-items: center;
// //           font-size: 11.5px;
// //           color: var(--wdd-text-subtle);
// //           padding-top: 8px;
// //           border-top: 1px solid var(--wdd-border-faint);
// //         }
// //         .wdd-home .wdd-card-tag {
// //           background: var(--wdd-accent-tint);
// //           color: var(--wdd-accent);
// //           padding: 1px 6px;
// //           border-radius: 3px;
// //           font-weight: 600;
// //           font-size: 10px;
// //           text-transform: uppercase;
// //           letter-spacing: 0.05em;
// //         }

// //         /* ── RESPONSIVE ── */
// //         @media (max-width: 900px) {
// //           .wdd-home .wdd-band-inner,
// //           .wdd-home[data-layout='zigzag'] .wdd-band-inner,
// //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
// //             grid-template-columns: 1fr;
// //             gap: 24px;
// //           }
// //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
// //             order: 0;
// //           }
// //           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
// //             order: 1;
// //           }
// //         }
// //       `}</style>

// //     </div>
// //   );
// // }

// // app/components/home-page/HomePage.jsx
// //
// // Structure-only homepage component. Receives the COMPLETE page list per
// // pillar and renders all of it — no data is dropped. UX handles volume via
// // progressive disclosure:
// //
// //   - The first `featuredCount` pages of a band render as rich cards.
// //   - The remaining pages render inside a collapsible, scrollable, compact
// //     link list grouped by sub-category ("Show all N pages").
// //   - A live filter input inside each band searches across ALL pages of
// //     that pillar instantly; while filtering, the full matched list is
// //     shown regardless of the collapsed state.
// //
// // Contains NO h1/h2/p tags and no hardcoded display text — all text comes
// // from the catalog data or from the page via props.
// //
// // Props:
// //   pillars — from data/home-catalog.js (AUTO-GENERATED):
// //     [
// //       {
// //         id, title, href, blurb, ctaLabel,
// //         stats:     [{ n, label }],
// //         breakdown: [{ label, count }],
// //         pages:     [{ name, desc, href, sub }]     // complete
// //       }
// //     ]
// //   searchPlaceholder — string for the global search input (from the page)
// //   featuredCount     — how many rich cards per band (presentation only,
// //                       default 6; the rest are still rendered in the list)
// //   layout  — 'zigzag' (default) | 'stacked'   — extend LAYOUTS below
// //   theme   — 'light' (default) | 'dark'       — extend THEMES below

// import React, { useEffect, useMemo, useRef, useState } from 'react';

// // ─────────────────────────────────────────────────────────────
// // Themes — token objects, applied as CSS variables
// // ─────────────────────────────────────────────────────────────

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
//     accentShadow: 'rgba(77, 77, 255, 0.10)',
//     kbdBg: '#f4f4f5',
//     ctaText: '#ffffff',
//     cardShadow: '0 1px 2px rgba(0,0,0,0.02)',
//     widgetShadow: '0 2px 8px rgba(0,0,0,0.02)',
//   },
//   dark: {
//     bg: '#09090b',
//     bgAlt: '#101012',
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
//     kbdBg: '#1c1c21',
//     ctaText: '#ffffff',
//     cardShadow: '0 1px 2px rgba(0,0,0,0.4)',
//     widgetShadow: '0 2px 8px rgba(0,0,0,0.4)',
//   },
// };

// const LAYOUTS = ['zigzag', 'stacked'];

// // ─────────────────────────────────────────────────────────────
// // Band — one pillar stripe with disclosure + filter
// // ─────────────────────────────────────────────────────────────

// function Band({ pillar, featuredCount }) {
//   const [expanded, setExpanded] = useState(false);
//   const [query, setQuery] = useState('');

//   const featured = pillar.pages.slice(0, featuredCount);
//   const rest = pillar.pages.slice(featuredCount);

//   const filtering = query.trim().length > 0;

//   const matches = useMemo(() => {
//     if (!filtering) return null;
//     const q = query.trim().toLowerCase();
//     return pillar.pages.filter(
//       (p) =>
//         p.name.toLowerCase().includes(q) ||
//         (p.desc && p.desc.toLowerCase().includes(q)) ||
//         (p.sub && p.sub.toLowerCase().includes(q))
//     );
//   }, [filtering, query, pillar.pages]);

//   // Group a page list by sub-category, preserving order.
//   const grouped = (list) => {
//     const map = new Map();
//     for (const p of list) {
//       const key = p.sub || '';
//       if (!map.has(key)) map.set(key, []);
//       map.get(key).push(p);
//     }
//     return [...map.entries()];
//   };

//   const listToShow = filtering ? matches : expanded ? rest : null;

//   return (
//     <section className="wdd-band">
//       <div className="wdd-band-inner">

//         <div className="wdd-cat-widget">
//           <div className="wdd-cat-title">{pillar.title}</div>
//           <div className="wdd-cat-blurb">{pillar.blurb}</div>

//           {pillar.stats && pillar.stats.length > 0 && (
//             <div className="wdd-cat-stats">
//               {pillar.stats.map((stat) => (
//                 <div className="wdd-stat" key={stat.label}>
//                   <span className="wdd-stat-n">{stat.n}</span>
//                   <span className="wdd-stat-label">{stat.label}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           {pillar.breakdown && pillar.breakdown.length > 0 && (
//             <ul className="wdd-cat-breakdown">
//               {pillar.breakdown.map((item) => (
//                 <li key={item.label}>
//                   {item.label} <span className="wdd-breakdown-n">{item.count}</span>
//                 </li>
//               ))}
//             </ul>
//           )}

//           <a href={pillar.href} className="wdd-cat-cta">
//             {pillar.ctaLabel} &rarr;
//           </a>
//         </div>

//         <div className="wdd-cards-side">

//           {/* Band toolbar: filter across ALL pages of the pillar */}
//           <div className="wdd-band-toolbar">
//             <input
//               className="wdd-band-filter"
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder={`Filter ${pillar.pages.length} pages...`}
//               aria-label={`Filter pages in ${pillar.title}`}
//             />
//             {filtering && (
//               <span className="wdd-band-filter-count">
//                 {matches.length} / {pillar.pages.length}
//               </span>
//             )}
//           </div>

//           {/* Featured rich cards (hidden while filtering) */}
//           {!filtering && (
//             <div className="wdd-card-grid">
//               {featured.map((card) => (
//                 <a href={card.href} className="wdd-card" key={card.href}>
//                   {card.sub && <div className="wdd-card-kicker">{card.sub}</div>}
//                   <div className="wdd-card-name">{card.name}</div>
//                   {card.desc && <div className="wdd-card-desc">{card.desc}</div>}
//                 </a>
//               ))}
//             </div>
//           )}

//           {/* Disclosure toggle for the remainder */}
//           {!filtering && rest.length > 0 && (
//             <button
//               type="button"
//               className="wdd-expand-btn"
//               onClick={() => setExpanded((v) => !v)}
//               aria-expanded={expanded}
//             >
//               {expanded
//                 ? `Hide ${rest.length} pages`
//                 : `Show all ${pillar.pages.length} pages`}
//             </button>
//           )}

//           {/* Compact grouped list: expanded remainder, or filter results */}
//           {listToShow && listToShow.length > 0 && (
//             <div className="wdd-list-panel" role="list">
//               {grouped(listToShow).map(([sub, items]) => (
//                 <div className="wdd-list-group" key={sub || 'general'}>
//                   {sub && (
//                     <div className="wdd-list-group-label">
//                       {sub} <span className="wdd-list-group-n">{items.length}</span>
//                     </div>
//                   )}
//                   <ul className="wdd-list">
//                     {items.map((p) => (
//                       <li key={p.href} role="listitem">
//                         <a href={p.href} className="wdd-list-row">
//                           <span className="wdd-list-name">{p.name}</span>
//                           {p.desc && <span className="wdd-list-desc">{p.desc}</span>}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           )}

//           {filtering && matches.length === 0 && (
//             <div className="wdd-list-empty">0 / {pillar.pages.length}</div>
//           )}

//         </div>
//       </div>
//     </section>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // Component
// // ─────────────────────────────────────────────────────────────

// export default function HomePage({
//   pillars = [],
//   searchPlaceholder = '',
//   featuredCount = 6,
//   layout = 'zigzag',
//   theme = 'light',
// }) {
//   const t = THEMES[theme] || THEMES.light;
//   const activeLayout = LAYOUTS.includes(layout) ? layout : 'zigzag';
//   const searchRef = useRef(null);

//   useEffect(() => {
//     const onKeyDown = (e) => {
//       if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
//         e.preventDefault();
//         if (searchRef.current) searchRef.current.focus();
//       }
//       if (e.key === 'Escape' && searchRef.current === document.activeElement) {
//         searchRef.current.blur();
//       }
//     };
//     window.addEventListener('keydown', onKeyDown);
//     return () => window.removeEventListener('keydown', onKeyDown);
//   }, []);

//   const cssVars = {
//     '--wdd-bg': t.bg,
//     '--wdd-bg-alt': t.bgAlt,
//     '--wdd-surface': t.surface,
//     '--wdd-text': t.text,
//     '--wdd-text-strong': t.textStrong,
//     '--wdd-text-muted': t.textMuted,
//     '--wdd-text-subtle': t.textSubtle,
//     '--wdd-text-faint': t.textFaint,
//     '--wdd-border': t.border,
//     '--wdd-border-faint': t.borderFaint,
//     '--wdd-input-border': t.inputBorder,
//     '--wdd-accent': t.accent,
//     '--wdd-accent-hover': t.accentHover,
//     '--wdd-accent-tint': t.accentTint,
//     '--wdd-accent-ring': t.accentRing,
//     '--wdd-accent-shadow': t.accentShadow,
//     '--wdd-kbd-bg': t.kbdBg,
//     '--wdd-cta-text': t.ctaText,
//     '--wdd-card-shadow': t.cardShadow,
//     '--wdd-widget-shadow': t.widgetShadow,
//   };

//   return (
//     <div className="wdd-home" data-layout={activeLayout} data-theme={theme} style={cssVars}>

//       {/* ── GLOBAL SEARCH ── */}
//       <div className="wdd-search-section">
//         <div className="wdd-search-wrap">
//           <span className="wdd-search-icon" aria-hidden="true">&#8981;</span>
//           <input
//             ref={searchRef}
//             className="wdd-search-input"
//             type="text"
//             placeholder={searchPlaceholder}
//             aria-label="Search the site"
//           />
//           <span className="wdd-kbd" aria-hidden="true">&#8984;K</span>
//         </div>
//       </div>

//       {/* ── PILLAR BANDS ── */}
//       {pillars.map((pillar) => (
//         <Band pillar={pillar} featuredCount={featuredCount} key={pillar.id} />
//       ))}

//       <style jsx global>{`
//         .wdd-home {
//           background: var(--wdd-bg);
//           color: var(--wdd-text);
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
//           font-size: 15px;
//           line-height: 1.55;
//           -webkit-font-smoothing: antialiased;
//         }
//         .wdd-home a {
//           color: var(--wdd-accent);
//           text-decoration: none;
//         }
//         .wdd-home a:hover {
//           color: var(--wdd-accent-hover);
//         }

//         /* ── GLOBAL SEARCH ── */
//         .wdd-home .wdd-search-section {
//           max-width: 1240px;
//           margin: 0 auto;
//           padding: 0 32px 40px;
//         }
//         .wdd-home .wdd-search-wrap {
//           max-width: 640px;
//           margin: 36px auto 0;
//           position: relative;
//         }
//         .wdd-home .wdd-search-input {
//           width: 100%;
//           box-sizing: border-box;
//           background: var(--wdd-surface);
//           border: 1px solid var(--wdd-input-border);
//           color: var(--wdd-text);
//           padding: 16px 20px 16px 48px;
//           font-size: 16px;
//           border-radius: 10px;
//           outline: none;
//           font-family: inherit;
//           box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
//         }
//         .wdd-home .wdd-search-input:focus {
//           border-color: var(--wdd-accent);
//           box-shadow: 0 0 0 3px var(--wdd-accent-ring);
//         }
//         .wdd-home .wdd-search-input::placeholder {
//           color: var(--wdd-text-faint);
//         }
//         .wdd-home .wdd-search-icon {
//           position: absolute;
//           left: 18px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: var(--wdd-text-faint);
//           font-size: 16px;
//         }
//         .wdd-home .wdd-kbd {
//           position: absolute;
//           right: 14px;
//           top: 50%;
//           transform: translateY(-50%);
//           background: var(--wdd-kbd-bg);
//           border: 1px solid var(--wdd-border);
//           padding: 3px 8px;
//           border-radius: 5px;
//           font-family: ui-monospace, monospace;
//           font-size: 12px;
//           color: var(--wdd-text-muted);
//         }

//         /* ── BANDS (shared) ── */
//         .wdd-home .wdd-band {
//           padding: 56px 0;
//           border-top: 1px solid var(--wdd-border);
//         }
//         .wdd-home .wdd-band-inner {
//           max-width: 1240px;
//           margin: 0 auto;
//           padding: 0 32px;
//           display: grid;
//           gap: 48px;
//           align-items: start;
//         }

//         /* ── LAYOUT: zigzag ── */
//         .wdd-home[data-layout='zigzag'] .wdd-band-inner {
//           grid-template-columns: 360px 1fr;
//         }
//         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
//           grid-template-columns: 1fr 360px;
//         }
//         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
//           order: 2;
//         }
//         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
//           order: 1;
//         }
//         .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) {
//           background: var(--wdd-bg-alt);
//         }

//         /* ── LAYOUT: stacked ── */
//         .wdd-home[data-layout='stacked'] .wdd-band-inner {
//           grid-template-columns: 1fr;
//           gap: 28px;
//         }
//         .wdd-home[data-layout='stacked'] .wdd-band:nth-of-type(even) {
//           background: var(--wdd-bg-alt);
//         }

//         /* ── WIDGET ── */
//         .wdd-home .wdd-cat-widget {
//           background: var(--wdd-surface);
//           border: 1px solid var(--wdd-border);
//           border-radius: 14px;
//           padding: 32px 30px;
//           box-shadow: var(--wdd-widget-shadow);
//         }
//         .wdd-home .wdd-cat-title {
//           font-size: 32px;
//           font-weight: 700;
//           color: var(--wdd-text-strong);
//           letter-spacing: -0.025em;
//           margin: 0 0 12px;
//           line-height: 1.1;
//         }
//         .wdd-home .wdd-cat-blurb {
//           color: var(--wdd-text-muted);
//           font-size: 14.5px;
//           line-height: 1.6;
//           margin: 0 0 22px;
//         }
//         .wdd-home .wdd-cat-stats {
//           display: flex;
//           gap: 24px;
//           padding: 16px 0;
//           border-top: 1px solid var(--wdd-border);
//           border-bottom: 1px solid var(--wdd-border);
//           margin-bottom: 20px;
//         }
//         .wdd-home .wdd-stat-n {
//           font-size: 26px;
//           font-weight: 700;
//           color: var(--wdd-accent);
//           line-height: 1;
//           display: block;
//           margin-bottom: 4px;
//         }
//         .wdd-home .wdd-stat-label {
//           font-size: 10.5px;
//           color: var(--wdd-text-subtle);
//           text-transform: uppercase;
//           letter-spacing: 0.06em;
//         }
//         .wdd-home .wdd-cat-breakdown {
//           list-style: none;
//           margin: 0 0 22px;
//           padding: 0;
//         }
//         .wdd-home .wdd-cat-breakdown li {
//           display: flex;
//           justify-content: space-between;
//           padding: 6px 0;
//           font-size: 13.5px;
//           color: var(--wdd-text);
//           border-bottom: 1px solid var(--wdd-border-faint);
//         }
//         .wdd-home .wdd-cat-breakdown li:last-child {
//           border-bottom: none;
//         }
//         .wdd-home .wdd-breakdown-n {
//           color: var(--wdd-text-faint);
//           font-family: ui-monospace, monospace;
//           font-size: 12px;
//         }
//         .wdd-home .wdd-cat-cta {
//           display: inline-block;
//           background: var(--wdd-accent);
//           color: var(--wdd-cta-text);
//           padding: 11px 22px;
//           border-radius: 8px;
//           font-size: 14px;
//           font-weight: 600;
//         }
//         .wdd-home .wdd-cat-cta:hover {
//           background: var(--wdd-accent-hover);
//           color: var(--wdd-cta-text);
//         }

//         /* ── BAND TOOLBAR ── */
//         .wdd-home .wdd-band-toolbar {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 16px;
//         }
//         .wdd-home .wdd-band-filter {
//           flex: 1;
//           box-sizing: border-box;
//           background: var(--wdd-surface);
//           border: 1px solid var(--wdd-input-border);
//           color: var(--wdd-text);
//           padding: 9px 14px;
//           font-size: 13.5px;
//           border-radius: 8px;
//           outline: none;
//           font-family: inherit;
//         }
//         .wdd-home .wdd-band-filter:focus {
//           border-color: var(--wdd-accent);
//           box-shadow: 0 0 0 3px var(--wdd-accent-ring);
//         }
//         .wdd-home .wdd-band-filter::placeholder {
//           color: var(--wdd-text-faint);
//         }
//         .wdd-home .wdd-band-filter-count {
//           font-family: ui-monospace, monospace;
//           font-size: 12px;
//           color: var(--wdd-text-subtle);
//           white-space: nowrap;
//         }

//         /* ── FEATURED CARDS ── */
//         .wdd-home .wdd-cards-side {
//           min-width: 0;
//         }
//         .wdd-home .wdd-card-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
//           gap: 12px;
//         }
//         .wdd-home .wdd-card {
//           background: var(--wdd-surface);
//           border: 1px solid var(--wdd-border);
//           padding: 18px 20px;
//           border-radius: 10px;
//           transition: all 0.15s;
//           display: block;
//           color: inherit;
//           box-shadow: var(--wdd-card-shadow);
//         }
//         .wdd-home .wdd-card:hover {
//           border-color: var(--wdd-accent);
//           transform: translateY(-2px);
//           box-shadow: 0 4px 14px var(--wdd-accent-shadow);
//           color: inherit;
//         }
//         .wdd-home .wdd-card-kicker {
//           font-size: 10px;
//           font-weight: 700;
//           color: var(--wdd-text-subtle);
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           margin-bottom: 6px;
//         }
//         .wdd-home .wdd-card-name {
//           font-weight: 600;
//           font-size: 15px;
//           color: var(--wdd-text-strong);
//           margin-bottom: 6px;
//           line-height: 1.3;
//         }
//         .wdd-home .wdd-card-desc {
//           font-size: 12.5px;
//           color: var(--wdd-text-muted);
//           line-height: 1.55;
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }

//         /* ── EXPAND BUTTON ── */
//         .wdd-home .wdd-expand-btn {
//           display: block;
//           width: 100%;
//           margin-top: 14px;
//           background: var(--wdd-surface);
//           border: 1px dashed var(--wdd-input-border);
//           color: var(--wdd-accent);
//           padding: 10px 16px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 600;
//           font-family: inherit;
//           cursor: pointer;
//           transition: all 0.15s;
//         }
//         .wdd-home .wdd-expand-btn:hover {
//           border-color: var(--wdd-accent);
//           background: var(--wdd-accent-tint);
//         }

//         /* ── COMPACT GROUPED LIST ── */
//         .wdd-home .wdd-list-panel {
//           margin-top: 14px;
//           border: 1px solid var(--wdd-border);
//           border-radius: 10px;
//           background: var(--wdd-surface);
//           max-height: 520px;
//           overflow-y: auto;
//           padding: 6px 0;
//         }
//         .wdd-home .wdd-list-group-label {
//           position: sticky;
//           top: 0;
//           background: var(--wdd-surface);
//           font-size: 10.5px;
//           font-weight: 700;
//           color: var(--wdd-text-subtle);
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           padding: 10px 18px 6px;
//           border-bottom: 1px solid var(--wdd-border-faint);
//           display: flex;
//           justify-content: space-between;
//         }
//         .wdd-home .wdd-list-group-n {
//           font-family: ui-monospace, monospace;
//           color: var(--wdd-text-faint);
//         }
//         .wdd-home .wdd-list {
//           list-style: none;
//           margin: 0;
//           padding: 0;
//         }
//         .wdd-home .wdd-list-row {
//           display: flex;
//           align-items: baseline;
//           gap: 12px;
//           padding: 7px 18px;
//           color: inherit;
//           border-bottom: 1px solid var(--wdd-border-faint);
//         }
//         .wdd-home .wdd-list li:last-child .wdd-list-row {
//           border-bottom: none;
//         }
//         .wdd-home .wdd-list-row:hover {
//           background: var(--wdd-accent-tint);
//           color: inherit;
//         }
//         .wdd-home .wdd-list-name {
//           font-weight: 600;
//           font-size: 13.5px;
//           color: var(--wdd-text-strong);
//           white-space: nowrap;
//         }
//         .wdd-home .wdd-list-desc {
//           font-size: 12.5px;
//           color: var(--wdd-text-muted);
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//           min-width: 0;
//         }
//         .wdd-home .wdd-list-empty {
//           margin-top: 14px;
//           padding: 18px;
//           text-align: center;
//           font-family: ui-monospace, monospace;
//           font-size: 12px;
//           color: var(--wdd-text-subtle);
//           border: 1px dashed var(--wdd-border);
//           border-radius: 10px;
//         }

//         /* ── RESPONSIVE ── */
//         @media (max-width: 900px) {
//           .wdd-home .wdd-band-inner,
//           .wdd-home[data-layout='zigzag'] .wdd-band-inner,
//           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
//             grid-template-columns: 1fr;
//             gap: 24px;
//           }
//           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
//             order: 0;
//           }
//           .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
//             order: 1;
//           }
//         }
//       `}</style>

//     </div>
//   );
// }


// app/components/home-page/HomePage.jsx
//
// Structure-only homepage component. Receives the COMPLETE page list per
// pillar and renders all of it — no data is dropped. UX handles volume via
// progressive disclosure:
//
//   - The first `featuredCount` pages of a band render as rich cards.
//   - The remaining pages render inside a collapsible, scrollable, compact
//     link list grouped by sub-category ("Show all N pages").
//   - A live filter input inside each band searches across ALL pages of
//     that pillar instantly; while filtering, the full matched list is
//     shown regardless of the collapsed state.
//
// Contains NO h1/h2/p tags and no hardcoded display text — all text comes
// from the catalog data or from the page via props.
//
// Guarded against stale/partial catalog data: every array field falls back
// to [] so a mismatched data/home-catalog.js degrades instead of crashing.
// If bands render empty, regenerate the catalog with the current
// generate-home-catalog.mjs (it must emit `pages` per pillar).
//
// Props:
//   pillars — from data/home-catalog.js (AUTO-GENERATED):
//     [
//       {
//         id, title, href, blurb, ctaLabel,
//         stats:     [{ n, label }],
//         breakdown: [{ label, count }],
//         pages:     [{ name, desc, href, sub }]     // complete
//       }
//     ]
//   searchPlaceholder — string for the global search input (from the page)
//   featuredCount     — how many rich cards per band (presentation only,
//                       default 6; the rest are still rendered in the list)
//   layout  — 'zigzag' (default) | 'stacked'   — extend LAYOUTS below
//   theme   — 'light' (default) | 'dark'       — extend THEMES below

import React, { useEffect, useMemo, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// Themes — token objects, applied as CSS variables
// ─────────────────────────────────────────────────────────────

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
    accentShadow: 'rgba(77, 77, 255, 0.10)',
    kbdBg: '#f4f4f5',
    ctaText: '#ffffff',
    cardShadow: '0 1px 2px rgba(0,0,0,0.02)',
    widgetShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  dark: {
    bg: '#09090b',
    bgAlt: '#101012',
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
    kbdBg: '#1c1c21',
    ctaText: '#ffffff',
    cardShadow: '0 1px 2px rgba(0,0,0,0.4)',
    widgetShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
};

const LAYOUTS = ['zigzag', 'stacked'];

// ─────────────────────────────────────────────────────────────
// Band — one pillar stripe with disclosure + filter
// ─────────────────────────────────────────────────────────────

function Band({ pillar, featuredCount }) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');

  // Guard: stale catalogs may lack `pages` — degrade, don't crash.
  const pages = Array.isArray(pillar.pages) ? pillar.pages : [];
  const stats = Array.isArray(pillar.stats) ? pillar.stats : [];
  const breakdown = Array.isArray(pillar.breakdown) ? pillar.breakdown : [];

  const featured = pages.slice(0, featuredCount);
  const rest = pages.slice(featuredCount);

  const filtering = query.trim().length > 0;

  const matches = useMemo(() => {
    if (!filtering) return null;
    const q = query.trim().toLowerCase();
    return pages.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.desc && p.desc.toLowerCase().includes(q)) ||
        (p.sub && p.sub.toLowerCase().includes(q))
    );
  }, [filtering, query, pages]);

  // Group a page list by sub-category, preserving order.
  const grouped = (list) => {
    const map = new Map();
    for (const p of list) {
      const key = p.sub || '';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    return [...map.entries()];
  };

  const listToShow = filtering ? matches : expanded ? rest : null;

  return (
    <section className="wdd-band">
      <div className="wdd-band-inner">

        <div className="wdd-cat-widget">
          <div className="wdd-cat-title">{pillar.title}</div>
          <div className="wdd-cat-blurb">{pillar.blurb}</div>

          {stats.length > 0 && (
            <div className="wdd-cat-stats">
              {stats.map((stat) => (
                <div className="wdd-stat" key={stat.label}>
                  <span className="wdd-stat-n">{stat.n}</span>
                  <span className="wdd-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {breakdown.length > 0 && (
            <ul className="wdd-cat-breakdown">
              {breakdown.map((item) => (
                <li key={item.label}>
                  {item.label} <span className="wdd-breakdown-n">{item.count}</span>
                </li>
              ))}
            </ul>
          )}

          <a href={pillar.href} className="wdd-cat-cta">
            {pillar.ctaLabel} &rarr;
          </a>
        </div>

        <div className="wdd-cards-side">

          {/* Band toolbar: filter across ALL pages of the pillar */}
          <div className="wdd-band-toolbar">
            <input
              className="wdd-band-filter"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Filter ${pages.length} pages...`}
              aria-label={`Filter pages in ${pillar.title}`}
            />
            {filtering && (
              <span className="wdd-band-filter-count">
                {matches.length} / {pages.length}
              </span>
            )}
          </div>

          {/* Featured rich cards (hidden while filtering) */}
          {!filtering && (
            <div className="wdd-card-grid">
              {featured.map((card) => (
                <a href={card.href} className="wdd-card" key={card.href}>
                  {card.sub && <div className="wdd-card-kicker">{card.sub}</div>}
                  <div className="wdd-card-name">{card.name}</div>
                  {card.desc && <div className="wdd-card-desc">{card.desc}</div>}
                </a>
              ))}
            </div>
          )}

          {/* Disclosure toggle for the remainder */}
          {!filtering && rest.length > 0 && (
            <button
              type="button"
              className="wdd-expand-btn"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded
                ? `Hide ${rest.length} pages`
                : `Show all ${pages.length} pages`}
            </button>
          )}

          {/* Compact grouped list: expanded remainder, or filter results */}
          {listToShow && listToShow.length > 0 && (
            <div className="wdd-list-panel" role="list">
              {grouped(listToShow).map(([sub, items]) => (
                <div className="wdd-list-group" key={sub || 'general'}>
                  {sub && (
                    <div className="wdd-list-group-label">
                      {sub} <span className="wdd-list-group-n">{items.length}</span>
                    </div>
                  )}
                  <ul className="wdd-list">
                    {items.map((p) => (
                      <li key={p.href} role="listitem">
                        <a href={p.href} className="wdd-list-row">
                          <span className="wdd-list-name">{p.name}</span>
                          {p.desc && <span className="wdd-list-desc">{p.desc}</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {filtering && matches.length === 0 && (
            <div className="wdd-list-empty">0 / {pages.length}</div>
          )}

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function HomePage({
  pillars = [],
  searchPlaceholder = '',
  featuredCount = 6,
  layout = 'zigzag',
  theme = 'light',
}) {
  const t = THEMES[theme] || THEMES.light;
  const activeLayout = LAYOUTS.includes(layout) ? layout : 'zigzag';
  const searchRef = useRef(null);

  const safePillars = Array.isArray(pillars) ? pillars : [];

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchRef.current) searchRef.current.focus();
      }
      if (e.key === 'Escape' && searchRef.current === document.activeElement) {
        searchRef.current.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const cssVars = {
    '--wdd-bg': t.bg,
    '--wdd-bg-alt': t.bgAlt,
    '--wdd-surface': t.surface,
    '--wdd-text': t.text,
    '--wdd-text-strong': t.textStrong,
    '--wdd-text-muted': t.textMuted,
    '--wdd-text-subtle': t.textSubtle,
    '--wdd-text-faint': t.textFaint,
    '--wdd-border': t.border,
    '--wdd-border-faint': t.borderFaint,
    '--wdd-input-border': t.inputBorder,
    '--wdd-accent': t.accent,
    '--wdd-accent-hover': t.accentHover,
    '--wdd-accent-tint': t.accentTint,
    '--wdd-accent-ring': t.accentRing,
    '--wdd-accent-shadow': t.accentShadow,
    '--wdd-kbd-bg': t.kbdBg,
    '--wdd-cta-text': t.ctaText,
    '--wdd-card-shadow': t.cardShadow,
    '--wdd-widget-shadow': t.widgetShadow,
  };

  return (
    <div className="wdd-home" data-layout={activeLayout} data-theme={theme} style={cssVars}>

      {/* ── GLOBAL SEARCH ── */}
      <div className="wdd-search-section">
        <div className="wdd-search-wrap">
          <span className="wdd-search-icon" aria-hidden="true">&#8981;</span>
          <input
            ref={searchRef}
            className="wdd-search-input"
            type="text"
            placeholder={searchPlaceholder}
            aria-label="Search the site"
          />
          <span className="wdd-kbd" aria-hidden="true">&#8984;K</span>
        </div>
      </div>

      {/* ── PILLAR BANDS ── */}
      {safePillars.map((pillar) => (
        <Band pillar={pillar} featuredCount={featuredCount} key={pillar.id} />
      ))}

      <style jsx global>{`
        .wdd-home {
          background: var(--wdd-bg);
          color: var(--wdd-text);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .wdd-home a {
          color: var(--wdd-accent);
          text-decoration: none;
        }
        .wdd-home a:hover {
          color: var(--wdd-accent-hover);
        }

        /* ── GLOBAL SEARCH ── */
        .wdd-home .wdd-search-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 32px 40px;
        }
        .wdd-home .wdd-search-wrap {
          max-width: 640px;
          margin: 36px auto 0;
          position: relative;
        }
        .wdd-home .wdd-search-input {
          width: 100%;
          box-sizing: border-box;
          background: var(--wdd-surface);
          border: 1px solid var(--wdd-input-border);
          color: var(--wdd-text);
          padding: 16px 20px 16px 48px;
          font-size: 16px;
          border-radius: 10px;
          outline: none;
          font-family: inherit;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }
        .wdd-home .wdd-search-input:focus {
          border-color: var(--wdd-accent);
          box-shadow: 0 0 0 3px var(--wdd-accent-ring);
        }
        .wdd-home .wdd-search-input::placeholder {
          color: var(--wdd-text-faint);
        }
        .wdd-home .wdd-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--wdd-text-faint);
          font-size: 16px;
        }
        .wdd-home .wdd-kbd {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--wdd-kbd-bg);
          border: 1px solid var(--wdd-border);
          padding: 3px 8px;
          border-radius: 5px;
          font-family: ui-monospace, monospace;
          font-size: 12px;
          color: var(--wdd-text-muted);
        }

        /* ── BANDS (shared) ── */
        .wdd-home .wdd-band {
          padding: 56px 0;
          border-top: 1px solid var(--wdd-border);
        }
        .wdd-home .wdd-band-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          gap: 48px;
          align-items: start;
        }

        /* ── LAYOUT: zigzag ── */
        .wdd-home[data-layout='zigzag'] .wdd-band-inner {
          grid-template-columns: 360px 1fr;
        }
        .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
          grid-template-columns: 1fr 360px;
        }
        .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
          order: 2;
        }
        .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
          order: 1;
        }
        .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) {
          background: var(--wdd-bg-alt);
        }

        /* ── LAYOUT: stacked ── */
        .wdd-home[data-layout='stacked'] .wdd-band-inner {
          grid-template-columns: 1fr;
          gap: 28px;
        }
        .wdd-home[data-layout='stacked'] .wdd-band:nth-of-type(even) {
          background: var(--wdd-bg-alt);
        }

        /* ── WIDGET ── */
        .wdd-home .wdd-cat-widget {
          background: var(--wdd-surface);
          border: 1px solid var(--wdd-border);
          border-radius: 14px;
          padding: 32px 30px;
          box-shadow: var(--wdd-widget-shadow);
        }
        .wdd-home .wdd-cat-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--wdd-text-strong);
          letter-spacing: -0.025em;
          margin: 0 0 12px;
          line-height: 1.1;
        }
        .wdd-home .wdd-cat-blurb {
          color: var(--wdd-text-muted);
          font-size: 14.5px;
          line-height: 1.6;
          margin: 0 0 22px;
        }
        .wdd-home .wdd-cat-stats {
          display: flex;
          gap: 24px;
          padding: 16px 0;
          border-top: 1px solid var(--wdd-border);
          border-bottom: 1px solid var(--wdd-border);
          margin-bottom: 20px;
        }
        .wdd-home .wdd-stat-n {
          font-size: 26px;
          font-weight: 700;
          color: var(--wdd-accent);
          line-height: 1;
          display: block;
          margin-bottom: 4px;
        }
        .wdd-home .wdd-stat-label {
          font-size: 10.5px;
          color: var(--wdd-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .wdd-home .wdd-cat-breakdown {
          list-style: none;
          margin: 0 0 22px;
          padding: 0;
        }
        .wdd-home .wdd-cat-breakdown li {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 13.5px;
          color: var(--wdd-text);
          border-bottom: 1px solid var(--wdd-border-faint);
        }
        .wdd-home .wdd-cat-breakdown li:last-child {
          border-bottom: none;
        }
        .wdd-home .wdd-breakdown-n {
          color: var(--wdd-text-faint);
          font-family: ui-monospace, monospace;
          font-size: 12px;
        }
        .wdd-home .wdd-cat-cta {
          display: inline-block;
          background: var(--wdd-accent);
          color: var(--wdd-cta-text);
          padding: 11px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
        }
        .wdd-home .wdd-cat-cta:hover {
          background: var(--wdd-accent-hover);
          color: var(--wdd-cta-text);
        }

        /* ── BAND TOOLBAR ── */
        .wdd-home .wdd-band-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .wdd-home .wdd-band-filter {
          flex: 1;
          box-sizing: border-box;
          background: var(--wdd-surface);
          border: 1px solid var(--wdd-input-border);
          color: var(--wdd-text);
          padding: 9px 14px;
          font-size: 13.5px;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
        }
        .wdd-home .wdd-band-filter:focus {
          border-color: var(--wdd-accent);
          box-shadow: 0 0 0 3px var(--wdd-accent-ring);
        }
        .wdd-home .wdd-band-filter::placeholder {
          color: var(--wdd-text-faint);
        }
        .wdd-home .wdd-band-filter-count {
          font-family: ui-monospace, monospace;
          font-size: 12px;
          color: var(--wdd-text-subtle);
          white-space: nowrap;
        }

        /* ── FEATURED CARDS ── */
        .wdd-home .wdd-cards-side {
          min-width: 0;
        }
        .wdd-home .wdd-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }
        .wdd-home .wdd-card {
          background: var(--wdd-surface);
          border: 1px solid var(--wdd-border);
          padding: 18px 20px;
          border-radius: 10px;
          transition: all 0.15s;
          display: block;
          color: inherit;
          box-shadow: var(--wdd-card-shadow);
        }
        .wdd-home .wdd-card:hover {
          border-color: var(--wdd-accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px var(--wdd-accent-shadow);
          color: inherit;
        }
        .wdd-home .wdd-card-kicker {
          font-size: 10px;
          font-weight: 700;
          color: var(--wdd-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }
        .wdd-home .wdd-card-name {
          font-weight: 600;
          font-size: 15px;
          color: var(--wdd-text-strong);
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .wdd-home .wdd-card-desc {
          font-size: 12.5px;
          color: var(--wdd-text-muted);
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── EXPAND BUTTON ── */
        .wdd-home .wdd-expand-btn {
          display: block;
          width: 100%;
          margin-top: 14px;
          background: var(--wdd-surface);
          border: 1px dashed var(--wdd-input-border);
          color: var(--wdd-accent);
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
        }
        .wdd-home .wdd-expand-btn:hover {
          border-color: var(--wdd-accent);
          background: var(--wdd-accent-tint);
        }

        /* ── COMPACT GROUPED LIST ── */
        .wdd-home .wdd-list-panel {
          margin-top: 14px;
          border: 1px solid var(--wdd-border);
          border-radius: 10px;
          background: var(--wdd-surface);
          max-height: 520px;
          overflow-y: auto;
          padding: 6px 0;
        }
        .wdd-home .wdd-list-group-label {
          position: sticky;
          top: 0;
          background: var(--wdd-surface);
          font-size: 10.5px;
          font-weight: 700;
          color: var(--wdd-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 10px 18px 6px;
          border-bottom: 1px solid var(--wdd-border-faint);
          display: flex;
          justify-content: space-between;
        }
        .wdd-home .wdd-list-group-n {
          font-family: ui-monospace, monospace;
          color: var(--wdd-text-faint);
        }
        .wdd-home .wdd-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .wdd-home .wdd-list-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 7px 18px;
          color: inherit;
          border-bottom: 1px solid var(--wdd-border-faint);
        }
        .wdd-home .wdd-list li:last-child .wdd-list-row {
          border-bottom: none;
        }
        .wdd-home .wdd-list-row:hover {
          background: var(--wdd-accent-tint);
          color: inherit;
        }
        .wdd-home .wdd-list-name {
          font-weight: 600;
          font-size: 13.5px;
          color: var(--wdd-text-strong);
          white-space: nowrap;
        }
        .wdd-home .wdd-list-desc {
          font-size: 12.5px;
          color: var(--wdd-text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .wdd-home .wdd-list-empty {
          margin-top: 14px;
          padding: 18px;
          text-align: center;
          font-family: ui-monospace, monospace;
          font-size: 12px;
          color: var(--wdd-text-subtle);
          border: 1px dashed var(--wdd-border);
          border-radius: 10px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .wdd-home .wdd-band-inner,
          .wdd-home[data-layout='zigzag'] .wdd-band-inner,
          .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-band-inner {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cat-widget {
            order: 0;
          }
          .wdd-home[data-layout='zigzag'] .wdd-band:nth-of-type(even) .wdd-cards-side {
            order: 1;
          }
        }
      `}</style>

    </div>
  );
}