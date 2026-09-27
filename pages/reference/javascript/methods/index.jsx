// pages/reference/javascript/methods/index.jsx
//
// /reference/javascript/methods — the explorer: search + category tabs +
// accordion groups of method cards. Data comes from the generated
// javascript-methods-catalog; only the editorial labels/blurbs live here.
//
// Mirrors pages/reference/python/functions/index.jsx.

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import SearchBox from '@/app/components/reference/explorer/SearchBox';
import MethodCard from '@/app/components/reference/explorer/MethodCard';
import AccordionGroup from '@/app/components/reference/explorer/AccordionGroup';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';
const BASE_PATH = '/reference/javascript/methods';

// Editorial copy per meta.category machine key. Groups appear only for
// categories that actually exist in the catalog, in this order.
const CATEGORIES = [
  { key: 'array',   tab: 'Arrays',   title: 'Array methods',   blurb: 'Methods on Array.prototype. Some mutate the array in place, others return a new one — the split that causes most Array bugs.' },
  { key: 'string',  tab: 'Strings',  title: 'String methods',  blurb: 'Methods on String.prototype. Strings are immutable — every method returns a new string.' },
  { key: 'object',  tab: 'Objects',  title: 'Object methods',  blurb: 'Static helpers on Object for keys, values, entries and copying.' },
  { key: 'number',  tab: 'Numbers',  title: 'Number methods',  blurb: 'Formatting and parsing on Number, plus the static checks.' },
  { key: 'map',     tab: 'Map',      title: 'Map methods',     blurb: 'Keyed collections that accept any value as a key and preserve insertion order.' },
  { key: 'set',     tab: 'Set',      title: 'Set methods',     blurb: 'Collections of unique values, and the newer set-algebra methods.' },
  { key: 'promise', tab: 'Promise',  title: 'Promise methods', blurb: 'Combinators and the instance methods that drive async control flow.' },
  { key: 'date',    tab: 'Date',     title: 'Date methods',    blurb: 'Reading and formatting dates, with the usual timezone traps.' },
  { key: 'global',  tab: 'Globals',  title: 'Global functions', blurb: 'Functions available everywhere without an import.' },
];

// Explorer container — page-local, holds all the filter state so the page
// function itself stays thin.
function MethodsExplorer({ items }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [liveOnly, setLiveOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // ?type=array deep link (from the landing's type pills) → open that tab.
  useEffect(() => {
    if (!router.isReady) return;
    const type = router.query.type;
    if (!type) return;
    const match = items.find((m) => m.type === type);
    if (match) setActiveTab(match.category);
  }, [router.isReady, router.query.type, items]);

  const term = query.trim().toLowerCase();
  const filtering = term.length > 0 || liveOnly;

  const matches = (m) => {
    if (liveOnly && !m.hasLiveDemo) return false;
    if (!term) return true;
    return (
      m.name.toLowerCase().includes(term) ||
      (m.blurb || '').toLowerCase().includes(term) ||
      (m.searchTerms || '').toLowerCase().includes(term)
    );
  };

  const groups = CATEGORIES
    .map((cat) => {
      const all = items.filter((m) => m.category === cat.key);
      return { ...cat, all, visible: all.filter(matches) };
    })
    .filter((g) => g.all.length > 0);

  const shownGroups = groups.filter(
    (g) => (activeTab === 'all' || activeTab === g.key) && (!filtering || g.visible.length > 0)
  );

  return (
    <div>
      <div className="controls">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder={`Search ${items.length} method${items.length === 1 ? '' : 's'}… (press / to focus)`}
        />
        <label className="toggle">
          <input type="checkbox" checked={liveOnly} onChange={(e) => setLiveOnly(e.target.checked)} />
          Live demo only
        </label>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'all' ? 'on' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All <span className="count">{items.length}</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.key}
            type="button"
            className={`tab ${activeTab === g.key ? 'on' : ''}`}
            onClick={() => setActiveTab(g.key)}
          >
            {g.tab} <span className="count">{g.all.length}</span>
          </button>
        ))}
      </div>

      {shownGroups.map((g) => (
        <AccordionGroup
          key={g.key}
          catLabel={g.tab}
          title={g.title}
          count={g.all.length}
          liveCount={g.all.filter((m) => m.hasLiveDemo).length}
          blurb={g.blurb}
          defaultOpen={g.key === groups[0].key}
          forceOpen={filtering || activeTab === g.key}
        >
          {(filtering ? g.visible : g.all).map((m) => (
            <MethodCard
              key={m.slug}
              name={m.name}
              signature={m.signature}
              blurb={m.blurb}
              href={`${BASE_PATH}/${m.slug}`}
              live={m.hasLiveDemo}
            />
          ))}
        </AccordionGroup>
      ))}

      {shownGroups.length === 0 && (
        <div className="empty">Nothing matches. Try a different search or clear the filters.</div>
      )}

      <style jsx>{`
        .controls { display: flex; gap: 12px; align-items: center; padding: 12px 14px; background: #f2f6fd; border: 1px solid #C8D4F6; border-left: 3px solid #1B50EE; border-radius: 0 6px 6px 0; margin-bottom: 18px; flex-wrap: wrap; }
        .toggle { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #334155; font-weight: 600; cursor: pointer; user-select: none; }
        .toggle input { accent-color: #1B50EE; width: 15px; height: 15px; }
        .tabs { display: flex; gap: 2px; margin-bottom: 20px; border-bottom: 1px solid #e4e4e7; overflow-x: auto; }
        .tab { padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #64748b; background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; letter-spacing: 0.03em; white-space: nowrap; }
        .tab:hover { color: #1B50EE; }
        .tab.on { color: #1B50EE; border-bottom-color: #1B50EE; }
        .count { display: inline-block; margin-left: 6px; font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; font-weight: 700; color: #64748b; background: #eef2f7; padding: 2px 6px; border-radius: 3px; }
        .tab.on .count { color: #1B50EE; background: #E8EEFB; }
        .empty { padding: 24px; text-align: center; color: #64748b; font-size: 13px; background: #fafbfc; border: 1px dashed #e4e4e7; border-radius: 6px; }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const { javascriptMethodsCatalog } = require('@/data/generated/javascript-methods-catalog');
  const items = javascriptMethodsCatalog.items;

  const seoData = {
    title:       `JavaScript Methods — Reference | ${SITE_NAME}`,
    description: 'Browse JavaScript methods on Array, String, Object, Number, Map, Set, Promise, Date and the global functions: signatures, parameters, examples, pitfalls and live in-browser demos.',
    name:        'JavaScript methods',
    subtitle:    'Array, String, Object, Number, Map, Set, Promise, Date and the global functions. Every entry with a LIVE pill has a live in-browser demo.',
    url:         BASE_PATH,
    keywords:    'javascript methods, array methods, string methods, javascript reference, mdn',
    breadcrumb: [
      { label: 'Home',       href: '/' },
      { label: 'Reference',  href: '/reference' },
      { label: 'JavaScript', href: '/reference/javascript' },
      { label: 'Methods',    href: BASE_PATH },
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

  return { props: { seoData, items, schemas } };
}

export default function JavaScriptMethodsPage({ seoData, items, schemas }) {
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
        <h1>{seoData.name}</h1>
        <p className="subtitle">{seoData.subtitle}</p>
        <MethodsExplorer items={items} />
      </div>

      <style jsx>{`
        .ref-page { max-width: 1200px; margin: 0 auto; padding: 92px 24px 64px; }
        h1 { font-size: 34px; font-weight: 800; color: #1B50EE; letter-spacing: -0.02em; margin: 0 0 6px; }
        .subtitle { color: #475569; font-size: 16px; margin: 0 0 28px; max-width: 720px; }
      `}</style>
    </>
  );
}
