// pages/reference/index.jsx
//
// /reference — pillar landing. Language clusters come from the generated
// reference-catalog; only the per-language editorial copy lives here.
// Languages appear automatically once their content files exist.

import Head from 'next/head';
import Link from 'next/link';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import LanguageCard from '@/app/components/reference/explorer/LanguageCard';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';

// Editorial copy per language id. Languages without an entry fall back to
// a prettified id and an empty blurb.
const LANGUAGE_EDITORIAL = {
  python: {
    title: 'Python',
    blurb: 'Built-in functions, string and list methods, dictionary and set operations. Entries marked LIVE have an editable in-browser demo.',
  },
  javascript: {
    title: 'JavaScript',
    blurb: 'Prototype methods on Array, String, Object, Number, Date, Map, Set, and Promise.',
  },
};

const SAMPLES_PER_LANGUAGE = 9;

export async function getStaticProps() {
  const { referenceCatalog } = require('@/data/generated/reference-catalog');

  const languages = referenceCatalog.languages.map((lang) => {
    const editorial = LANGUAGE_EDITORIAL[lang.id] || {
      title: lang.id.charAt(0).toUpperCase() + lang.id.slice(1),
      blurb: '',
    };
    const liveCount = lang.categories.reduce((n, c) => n + c.liveCount, 0);

    // Sample cards: spread across categories in catalog order.
    const samples = [];
    for (const cat of lang.categories) {
      for (const item of cat.items) {
        if (samples.length >= SAMPLES_PER_LANGUAGE) break;
        samples.push({ name: item.name, blurb: item.blurb, href: `${cat.href}/${item.slug}` });
      }
    }

    // Browse target: the first category's explorer (single-category
    // languages), or the language landing once there are several.
    const browseHref = lang.categories.length === 1 ? lang.categories[0].href : lang.href;

    return {
      id: lang.id,
      title: editorial.title,
      blurb: editorial.blurb,
      count: lang.count,
      liveCount,
      samples,
      browseHref,
      landingHref: lang.href,
    };
  });

  const seoData = {
    title:       `Developer Reference — ${languages.map((l) => l.title).join(', ')} | ${SITE_NAME}`,
    description: 'Function and method references with live in-browser demos: signatures, parameters, examples and pitfalls for every entry.',
    name:        'Reference',
    subtitle:    `Function and method references for ${languages.map((l) => l.title).join(', ')}.`,
    url:         '/reference',
    keywords:    'developer reference, python reference, function reference, method reference',
    breadcrumb: [
      { label: 'Home',      href: '/' },
      { label: 'Reference', href: '/reference' },
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

  return { props: { seoData, schemas, languages } };
}

export default function ReferencePage({ seoData, schemas, languages }) {
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

        <div className="grid">
          <aside className="rail">
            <div className="rail-hdr">Languages</div>
            <nav className="rail-list">
              {languages.map((l, i) => (
                <a key={l.id} href={`#${l.id}`} className={i === 0 ? 'active' : ''}>{l.title}</a>
              ))}
            </nav>
            <div className="rail-hdr">Also see</div>
            <nav className="rail-list">
              <Link href="/tools">Tools</Link>
              <Link href="/sql">SQL</Link>
              <Link href="/c-programming">C Programming</Link>
            </nav>
          </aside>

          <div className="main">
            {languages.map((l) => (
              <LanguageCard
                key={l.id}
                id={l.id}
                title={l.title}
                blurb={l.blurb}
                count={l.count}
                liveCount={l.liveCount}
                samples={l.samples}
                browseHref={l.browseHref}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ref-page { max-width: 1200px; margin: 0 auto; padding: 92px 24px 64px; }
        h1 { font-size: 34px; font-weight: 800; color: #1B50EE; letter-spacing: -0.02em; margin: 0 0 6px; }
        .subtitle { color: #475569; font-size: 16px; margin: 0 0 32px; }
        .grid { display: grid; grid-template-columns: 200px 1fr; gap: 32px; align-items: start; }
        .rail { position: sticky; top: 84px; border-right: 1px solid #f1f5f9; padding-right: 20px; }
        .rail-hdr { font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px; }
        .rail-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; }
        .rail-list a { color: #334155; text-decoration: none; font-size: 13.5px; padding-left: 12px; border-left: 2px solid transparent; }
        .rail-list a.active { color: #1B50EE; font-weight: 600; border-left-color: #1B50EE; }
        .rail-list a:hover { color: #1B50EE; }
        .main { min-width: 0; }
        @media (max-width: 720px) {
          .grid { grid-template-columns: 1fr; }
          .rail { position: static; border-right: none; padding-right: 0; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
        }
      `}</style>
    </>
  );
}
