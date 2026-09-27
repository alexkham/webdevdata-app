// pages/reference/javascript/index.jsx
//
// /reference/javascript — language landing. Hero + console card, section
// tiles, browse-by-type pills, featured strip, cross-pillar cards. Counts
// come from the generated javascript-rollup; only editorial copy lives here.
//
// Mirrors pages/reference/python/index.jsx.

import Head from 'next/head';
import Link from 'next/link';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import CategoryTile from '@/app/components/reference/explorer/CategoryTile';
import TypePill from '@/app/components/reference/explorer/TypePill';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';
const METHODS_PATH = '/reference/javascript/methods';

// Editorial featured picks — resolved against the generated catalog in
// getStaticProps, so a missing slug silently drops instead of dead-linking.
const FEATURED_PICKS = [
  { category: 'methods', slug: 'array-map' },
  { category: 'methods', slug: 'array-filter' },
  { category: 'methods', slug: 'array-reduce' },
  { category: 'methods', slug: 'array-sort' },
  { category: 'methods', slug: 'array-slice' },
  { category: 'methods', slug: 'array-splice' },
];

export async function getStaticProps() {
  const { javascriptRollup } = require('@/data/generated/javascript-rollup');
  const { javascriptMethodsCatalog } = require('@/data/generated/javascript-methods-catalog');

  const catalogs = {
    methods: javascriptMethodsCatalog.items,
  };
  const featured = FEATURED_PICKS
    .map((pick) => {
      const m = (catalogs[pick.category] || []).find((x) => x.slug === pick.slug);
      return m
        ? { name: m.name, live: m.hasLiveDemo, href: `/reference/javascript/${pick.category}/${m.slug}` }
        : null;
    })
    .filter(Boolean);

  const seoData = {
    title:       `JavaScript Reference — Methods & Live Demos | ${SITE_NAME}`,
    description: 'JavaScript reference with live in-browser demos: Array, String, Object, Number, Map, Set, Promise, Date and the global functions — signatures, examples, pitfalls.',
    name:        'JavaScript',
    subtitle:    'Methods on the built-in objects, each with a live demo that runs the real thing in your browser. No console, no scratch file.',
    url:         '/reference/javascript',
    keywords:    'javascript reference, javascript methods, array methods, string methods, javascript live demo',
    breadcrumb: [
      { label: 'Home',       href: '/' },
      { label: 'Reference',  href: '/reference' },
      { label: 'JavaScript', href: '/reference/javascript' },
    ],
  };

  const schemas = {
    breadcrumb: {
      '@context':      'https://schema.org',
      '@type':         'BreadcrumbList',
      itemListElement: seoData.breadcrumb.map((crumb, i) => ({
        '@type':  'ListItem',
        position: i + 1,
        name:     crumb.label,
        item:     `${SITE_URL}${crumb.href}`,
      })),
    },
  };

  return {
    props: {
      seoData,
      schemas,
      featured,
      rollup: {
        total:     javascriptRollup.total,
        liveTotal: javascriptRollup.liveTotal,
        types:     javascriptRollup.types,
      },
    },
  };
}

export default function JavaScriptReferencePage({ seoData, schemas, rollup, featured }) {
  const canonical = `${SITE_URL}${seoData.url}`;
  const ogImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords"    content={seoData.keywords} />
        <meta name="viewport"    content="width=device-width, initial-scale=1" />
        <link rel="canonical"    href={canonical} />

        <meta property="og:title"       content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url"         content={canonical} />
        <meta property="og:type"        content="website" />
        <meta property="og:site_name"   content={SITE_NAME} />
        <meta property="og:image"       content={ogImage} />

        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image"       content={ogImage} />

        <meta name="robots" content="index, follow" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      </Head>

      <div className="ref-page">
        <Breadcrumb />

        <section className="hero">
          <div>
            <h1>{seoData.name} <span className="js-badge">ES2024</span></h1>
            <p className="hero-lede">{seoData.subtitle}</p>
            <div className="hero-stats">
              <span><b>{rollup.total}</b> {rollup.total === 1 ? 'method' : 'methods'}</span>
              <span><b>{rollup.liveTotal}</b> live {rollup.liveTotal === 1 ? 'demo' : 'demos'}</span>
            </div>
          </div>

          <div className="repl" aria-hidden="true">
            <div><span className="p">&gt;</span> [<span className="b">1</span>, <span className="b">2</span>, <span className="b">3</span>].<span className="n">map</span>(<span className="r">x</span> =&gt; <span className="r">x</span> * <span className="b">2</span>)</div>
            <div><span className="c">{'//'} [2, 4, 6]</span></div>
            <div className="repl-gap"><span className="p">&gt;</span> <span className="s">&apos;a,b,c&apos;</span>.<span className="n">split</span>(<span className="s">&apos;,&apos;</span>)</div>
            <div><span className="c">{'//'} [&apos;a&apos;, &apos;b&apos;, &apos;c&apos;]</span></div>
            <div className="repl-gap"><span className="p">&gt;</span> [<span className="b">3</span>, <span className="b">1</span>, <span className="b">2</span>].<span className="n">toSorted</span>()</div>
            <div><span className="c">{'//'} [1, 2, 3]</span></div>
          </div>
        </section>

        <div className="section-hdr">Sections</div>
        <div className="cats">
          {rollup.total > 0 ? (
            <CategoryTile
              name="Methods"
              badge="LIVE"
              blurb="Array, String, Object, Number, Map, Set, Promise, Date and the globals."
              count={`${rollup.total} ${rollup.total === 1 ? 'entry' : 'entries'} →`}
              href={METHODS_PATH}
            />
          ) : (
            <CategoryTile
              name="Methods"
              badge="SOON"
              blurb="Array, String, Object, Number, Map, Set, Promise, Date and the globals."
              count="planned"
            />
          )}
          <CategoryTile
            name="Operators"
            badge="SOON"
            blurb="Spread, optional chaining, nullish coalescing, equality."
            count="planned"
          />
          <CategoryTile
            name="Errors &amp; exceptions"
            badge="SOON"
            blurb="TypeError, RangeError, and what actually throws them."
            count="planned"
          />
          <CategoryTile
            name="Web APIs"
            badge="LATER"
            blurb="fetch, URL, Intl, and the browser globals devs reach for."
            count="planned"
          />
        </div>

        {rollup.types.length > 0 && (
          <section className="explore">
            <div className="explore-title">Browse by type</div>
            <div className="explore-sub">Jump straight to the methods for a specific built-in object.</div>
            <div className="types">
              {rollup.types.map((t) => (
                <TypePill
                  key={t.type}
                  name={t.type}
                  count={t.count}
                  href={`${METHODS_PATH}?type=${encodeURIComponent(t.type)}`}
                />
              ))}
            </div>
          </section>
        )}

        {featured.length > 0 && (
          <>
            <div className="section-hdr">Featured — try the live demos</div>
            <div className="searched">
              {featured.map((m, i) => (
                <a className="searched-card" key={m.href} href={m.href}>
                  <span className="searched-rank">{String(i + 1).padStart(2, '0')}</span>
                  <span className="searched-name">{m.name}</span>
                  {m.live && <span className="searched-hits">LIVE</span>}
                </a>
              ))}
            </div>
          </>
        )}

        <div className="cross">
          <Link className="cross-card" href="/reference/python">
            <div className="cross-kicker">Python</div>
            <div className="cross-title">Python reference →</div>
            <div className="cross-blurb">Every built-in function and type method, with live in-browser demos verified against CPython.</div>
          </Link>
          <Link className="cross-card" href="/tools">
            <div className="cross-kicker">Tools</div>
            <div className="cross-title">JSON, Base64, JWT, and more →</div>
            <div className="cross-blurb">Client-side developer utilities — formatters, encoders, minifiers. Everything runs in your browser.</div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .ref-page { max-width: 1200px; margin: 0 auto; padding: 92px 24px 64px; }

        .hero { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; margin-bottom: 40px; }
        h1 { font-size: 40px; font-weight: 800; color: #1B50EE; letter-spacing: -0.02em; margin: 0 0 10px; display: flex; align-items: center; gap: 14px; }
        .js-badge { font-family: ui-monospace, Menlo, monospace; font-size: 12px; font-weight: 700; color: #1B50EE; background: #E8EEFB; border: 1px solid #C8D4F6; padding: 4px 10px; border-radius: 5px; letter-spacing: 0.06em; text-transform: uppercase; }
        .hero-lede { color: #334155; font-size: 17px; line-height: 1.6; margin: 0 0 16px; max-width: 620px; }
        .hero-stats { display: flex; gap: 24px; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: #64748b; }
        .hero-stats b { color: #1B50EE; font-weight: 700; font-size: 14px; }

        .repl { background: #0f172a; border-radius: 8px; padding: 16px 18px; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: #d4dae5; line-height: 1.7; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12); }
        .repl .p { color: #4D74FF; font-weight: 700; }
        .repl .c { color: #94a3b8; }
        .repl .s { color: #86efac; }
        .repl .n { color: #f0abfc; }
        .repl .r { color: #cbd5e1; }
        .repl .b { color: #fde68a; }
        .repl-gap { margin-top: 8px; }

        .section-hdr { font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
        .cats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 40px; }

        .explore { background: #f2f6fd; border-left: 3px solid #1B50EE; border-radius: 0 8px 8px 0; padding: 20px 22px; margin-bottom: 40px; }
        .explore-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .explore-sub { color: #475569; font-size: 13px; margin-bottom: 14px; }
        .types { display: flex; gap: 6px; flex-wrap: wrap; }

        .searched { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 40px; }
        .searched-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid #e4e4e7; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.12s; }
        .searched-card:hover { border-color: #C8D4F6; background: #f8fafd; }
        .searched-rank { font-family: ui-monospace, Menlo, monospace; font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 0.06em; min-width: 20px; }
        .searched-name { font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: #1B50EE; font-weight: 700; flex: 1; }
        .searched-hits { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; color: #16a34a; font-weight: 800; }

        .cross { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding-top: 24px; border-top: 1px solid #f1f5f9; }
        .cross-card { display: block; padding: 18px 20px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; text-decoration: none; color: inherit; transition: border-color 0.12s; }
        .cross-card:hover { border-color: #C8D4F6; background: #f8fafd; }
        .cross-kicker { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
        .cross-title { font-size: 16px; font-weight: 700; color: #1B50EE; margin-bottom: 6px; }
        .cross-blurb { color: #475569; font-size: 12.5px; line-height: 1.55; }

        @media (max-width: 800px) {
          .hero { grid-template-columns: 1fr; }
          .cats { grid-template-columns: 1fr 1fr; }
          .searched { grid-template-columns: 1fr; }
          .cross { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
