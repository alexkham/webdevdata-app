// pages/reference/python/index.jsx
//
// /reference/python — language landing. Hero + REPL card, section tiles,
// browse-by-type pills, featured strip, cross-pillar cards. Counts come
// from the generated python-rollup; only editorial copy lives here.

import Head from 'next/head';
import Link from 'next/link';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import CategoryTile from '@/app/components/reference/explorer/CategoryTile';
import TypePill from '@/app/components/reference/explorer/TypePill';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';
const FUNCTIONS_PATH = '/reference/python/functions';

export async function getStaticProps() {
  const { pythonRollup } = require('@/data/generated/python-rollup');

  const seoData = {
    title:       `Python Reference — Functions, Methods & Live Demos | ${SITE_NAME}`,
    description: 'Python reference with live in-browser demos: built-in functions, string, list, dict and set methods — signatures, examples, pitfalls.',
    name:        'Python',
    subtitle:    'Built-in functions and methods, with a live in-browser demo where the semantics fit. No install, no waiting for a REPL to boot.',
    url:         '/reference/python',
    keywords:    'python reference, python functions, python methods, python live demo',
    breadcrumb: [
      { label: 'Home',      href: '/' },
      { label: 'Reference', href: '/reference' },
      { label: 'Python',    href: '/reference/python' },
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
      rollup: {
        total:     pythonRollup.total,
        liveTotal: pythonRollup.liveTotal,
        types:     pythonRollup.types,
        featured:  pythonRollup.featured,
      },
    },
  };
}

export default function PythonReferencePage({ seoData, schemas, rollup }) {
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
            <h1>{seoData.name} <span className="py-badge">3.12</span></h1>
            <p className="hero-lede">{seoData.subtitle}</p>
            <div className="hero-stats">
              <span><b>{rollup.total}</b> {rollup.total === 1 ? 'function' : 'functions'}</span>
              <span><b>{rollup.liveTotal}</b> live {rollup.liveTotal === 1 ? 'demo' : 'demos'}</span>
            </div>
          </div>

          <div className="repl" aria-hidden="true">
            <div><span className="p">&gt;&gt;&gt;</span> <span className="r">&quot;hello world&quot;</span>.<span className="n">replace</span>(<span className="s">&quot;o&quot;</span>, <span className="s">&quot;0&quot;</span>)</div>
            <div><span className="c"># &apos;hell0 w0rld&apos;</span></div>
            <div className="repl-gap"><span className="p">&gt;&gt;&gt;</span> [<span className="b">1</span>, <span className="b">2</span>, <span className="b">3</span>].<span className="n">count</span>(<span className="b">2</span>)</div>
            <div><span className="c"># 1</span></div>
            <div className="repl-gap"><span className="p">&gt;&gt;&gt;</span> <span className="n">sorted</span>([<span className="b">3</span>, <span className="b">1</span>, <span className="b">2</span>])</div>
            <div><span className="c"># [1, 2, 3]</span></div>
          </div>
        </section>

        <div className="section-hdr">Sections</div>
        <div className="cats">
          <CategoryTile
            name="Functions &amp; methods"
            badge="LIVE"
            blurb="Built-ins, string/list/dict/set methods, file objects."
            count={`${rollup.total} ${rollup.total === 1 ? 'entry' : 'entries'} →`}
            href={FUNCTIONS_PATH}
          />
          <CategoryTile
            name="Operators"
            badge="SOON"
            blurb="Arithmetic, comparison, logical, bitwise, walrus."
            count="planned"
          />
          <CategoryTile
            name="Errors &amp; exceptions"
            badge="SOON"
            blurb="TypeError, ValueError, KeyError, and the full hierarchy."
            count="planned"
          />
          <CategoryTile
            name="Standard library"
            badge="LATER"
            blurb="os, json, datetime, re, and the modules devs actually reach for."
            count="planned"
          />
        </div>

        {rollup.types.length > 0 && (
          <section className="explore">
            <div className="explore-title">Browse by type</div>
            <div className="explore-sub">Jump straight to the methods for a specific built-in type.</div>
            <div className="types">
              {rollup.types.map((t) => (
                <TypePill
                  key={t.type}
                  name={t.type}
                  count={t.count}
                  href={`${FUNCTIONS_PATH}?type=${encodeURIComponent(t.type)}`}
                />
              ))}
            </div>
          </section>
        )}

        {rollup.featured.length > 0 && (
          <>
            <div className="section-hdr">Featured — try the live demos</div>
            <div className="searched">
              {rollup.featured.map((m, i) => (
                <a className="searched-card" key={m.slug} href={`${FUNCTIONS_PATH}/${m.slug}`}>
                  <span className="searched-rank">{String(i + 1).padStart(2, '0')}</span>
                  <span className="searched-name">{m.name}</span>
                  <span className="searched-hits">LIVE</span>
                </a>
              ))}
            </div>
          </>
        )}

        <div className="cross">
          <Link className="cross-card" href="/tools">
            <div className="cross-kicker">Tools</div>
            <div className="cross-title">JSON, Base64, JWT, and more →</div>
            <div className="cross-blurb">Client-side developer utilities — formatters, encoders, minifiers. Everything runs in your browser.</div>
          </Link>
          <Link className="cross-card" href="/sql">
            <div className="cross-kicker">SQL</div>
            <div className="cross-title">SQL reference →</div>
            <div className="cross-blurb">Queries, clauses and functions for working with relational data.</div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .ref-page { max-width: 1200px; margin: 0 auto; padding: 92px 24px 64px; }

        .hero { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; margin-bottom: 40px; }
        h1 { font-size: 40px; font-weight: 800; color: #1B50EE; letter-spacing: -0.02em; margin: 0 0 10px; display: flex; align-items: center; gap: 14px; }
        .py-badge { font-family: ui-monospace, Menlo, monospace; font-size: 12px; font-weight: 700; color: #1B50EE; background: #E8EEFB; border: 1px solid #C8D4F6; padding: 4px 10px; border-radius: 5px; letter-spacing: 0.06em; text-transform: uppercase; }
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
