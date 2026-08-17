// pages/reference/python/operators/index.jsx
//
// /reference/python/operators — the operators explorer: search + group
// tabs + accordion groups of operator cards. Data from the generated
// python-operators-catalog; only editorial labels/blurbs live here.

import Head from 'next/head';
import { useState } from 'react';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import SearchBox from '@/app/components/reference/explorer/SearchBox';
import MethodCard from '@/app/components/reference/explorer/MethodCard';
import AccordionGroup from '@/app/components/reference/explorer/AccordionGroup';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';
const BASE_PATH = '/reference/python/operators';

// Editorial copy per meta.category machine key, in display order.
const CATEGORIES = [
  { key: 'arithmetic', tab: 'Arithmetic', title: '+ - * / // % **', blurb: 'Numbers in, numbers out — plus the true/floor division split and Python’s divisor-signed modulo.' },
  { key: 'comparison', tab: 'Comparison', title: '== != < > <= >=', blurb: 'Value equality and ordering. Chainable: lo <= x < hi reads exactly as written.' },
  { key: 'logical',    tab: 'Logical',    title: 'and or not',      blurb: 'Truthiness-based, short-circuiting — and they return operands, which powers the guard and default idioms.' },
  { key: 'bitwise',    tab: 'Bitwise',    title: '& | ^ ~ << >>',   blurb: 'Bit-level integer math: masks, flags, shifts. Also set algebra and dict merging.' },
  { key: 'membership', tab: 'Membership', title: 'in, not in',      blurb: 'Element, substring and key tests across every container type.' },
  { key: 'identity',   tab: 'Identity',   title: 'is, is not',      blurb: 'Same-object tests — the right way to check for None.' },
  { key: 'assignment', tab: 'Assignment', title: ':=',              blurb: 'The walrus: assignment as an expression (Python 3.8+).' },
];

// Explorer container — page-local, holds the filter state so the page
// function itself stays thin.
function OperatorsExplorer({ items }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const term = query.trim().toLowerCase();
  const filtering = term.length > 0;

  const matches = (m) => {
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
          placeholder={`Search ${items.length} operators… (press / to focus)`}
        />
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
          unitLabel="operators"
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
        <div className="empty">Nothing matches. Try a different search.</div>
      )}

      <style jsx>{`
        .controls { display: flex; gap: 12px; align-items: center; padding: 12px 14px; background: #f2f6fd; border: 1px solid #C8D4F6; border-left: 3px solid #1B50EE; border-radius: 0 6px 6px 0; margin-bottom: 18px; flex-wrap: wrap; }
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
  const { pythonOperatorsCatalog } = require('@/data/generated/python-operators-catalog');
  const items = pythonOperatorsCatalog.items;

  const seoData = {
    title:       `Python Operators — Reference | ${SITE_NAME}`,
    description: 'Browse Python operators: arithmetic, comparison, logical, bitwise, membership, identity and the walrus — with examples, pitfalls and live demos.',
    name:        'Python operators',
    subtitle:    'Arithmetic to walrus — every operator with its exact semantics. Entries with a LIVE pill have an editable in-browser demo.',
    url:         BASE_PATH,
    keywords:    'python operators, arithmetic operators, comparison operators, bitwise operators, walrus operator',
    breadcrumb: [
      { label: 'Home',      href: '/' },
      { label: 'Reference', href: '/reference' },
      { label: 'Python',    href: '/reference/python' },
      { label: 'Operators', href: BASE_PATH },
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

export default function PythonOperatorsPage({ seoData, items, schemas }) {
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
        <OperatorsExplorer items={items} />
      </div>

      <style jsx>{`
        .ref-page { max-width: 1200px; margin: 0 auto; padding: 92px 24px 64px; }
        h1 { font-size: 34px; font-weight: 800; color: #1B50EE; letter-spacing: -0.02em; margin: 0 0 6px; }
        .subtitle { color: #475569; font-size: 16px; margin: 0 0 28px; max-width: 720px; }
      `}</style>
    </>
  );
}
