// pages/reference/javascript/methods/[name].jsx
//
// Dynamic leaf for /reference/javascript/methods/<slug>.
// Content comes from content/reference/javascript/methods/<slug>.js
// (meta + method). Emulator comes from the generated emulators map, looked
// up with the LANGUAGE-scoped key so python and javascript never collide.
//
// Mirrors pages/reference/python/functions/[name].jsx. The differences are
// the language passed to MethodDemo (which selects jsRepr over pyRepr) and
// the SEO copy.

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ReferenceFrame from '@/app/components/reference/frame/ReferenceFrame';
import MethodHero from '@/app/components/reference/method/MethodHero';
import MethodDemo from '@/app/components/reference/method/MethodDemo';
import Parameters from '@/app/components/reference/method/Parameters';
import Patterns from '@/app/components/reference/method/Patterns';
import Examples from '@/app/components/reference/method/Examples';
import Pitfalls from '@/app/components/reference/method/Pitfalls';
import WhenToUse from '@/app/components/reference/method/WhenToUse';
import Notes from '@/app/components/reference/method/Notes';
import Related from '@/app/components/reference/method/Related';
import FAQ from '@/app/components/reference/method/FAQ';
import History from '@/app/components/reference/method/History';
import { getEmulator } from '@/utils/emulators-map';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';
const BASE_PATH = '/reference/javascript/methods';

// Human labels for meta.category machine keys (sibling-rail heading).
const CATEGORY_LABELS = {
  array:   'Array methods',
  string:  'String methods',
  object:  'Object methods',
  number:  'Number methods',
  map:     'Map methods',
  set:     'Set methods',
  promise: 'Promise methods',
  date:    'Date methods',
  global:  'Global functions',
};

export async function getStaticPaths() {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(process.cwd(), 'content/reference/javascript/methods');
  // The directory may not exist yet while the language is being built out.
  if (!fs.existsSync(dir)) return { paths: [], fallback: false };
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
  const paths = files.map((f) => ({ params: { name: f.replace(/\.js$/, '') } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { meta, method } = require('@/content/reference/javascript/methods/' + params.name);
  const { javascriptMethodsCatalog } = require('@/data/generated/javascript-methods-catalog');

  // Siblings: every method in the same category, from the generated catalog.
  const siblings = javascriptMethodsCatalog.items
    .filter((m) => m.category === meta.category)
    .map((m) => ({
      slug: m.slug,
      title: m.name,
      href: `${BASE_PATH}/${m.slug}`,
      active: m.slug === meta.slug,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const siblingsTitle = CATEGORY_LABELS[meta.category] || 'Related pages';

  // A trailing "()" only makes sense for a single callable method. Combined
  // pages ("Date setters (setMonth, …)", "Map.prototype.keys, values, …") and
  // accessors (Map.size) are not callable under that name, so they keep it off.
  const isSingleCallable =
    !/\s/.test(meta.name) && !/accessor|constant/i.test(method.category || '');
  const displayName = isSingleCallable ? `${meta.name}()` : meta.name;

  const seoData = {
    title:       `${displayName} — JavaScript Reference | ${SITE_NAME}`,
    description: `${meta.blurb} Signature, parameters, examples, pitfalls and a live in-browser demo of JavaScript ${meta.name}.`,
    name:        displayName,
    subtitle:    method.subtitle || meta.blurb,
    url:         `${BASE_PATH}/${meta.slug}`,
    keywords:    `javascript ${meta.searchTerms}`,
    breadcrumb: [
      { label: 'Home',       href: '/' },
      { label: 'Reference',  href: '/reference' },
      { label: 'JavaScript', href: '/reference/javascript' },
      { label: 'Methods',    href: BASE_PATH },
      { label: meta.name,    href: `${BASE_PATH}/${meta.slug}` },
    ],
    datePublished: '2026-09-11',
  };

  const schemas = {
    article: {
      '@context':    'https://schema.org',
      '@type':       'TechArticle',
      headline:      `JavaScript ${displayName}`,
      description:   seoData.description,
      url:           `${SITE_URL}${seoData.url}`,
      author:        { '@type': 'Organization', name: SITE_NAME },
      datePublished: seoData.datePublished,
      inLanguage:    'en-US',
      keywords:      seoData.keywords,
    },
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
    faq: {
      '@context': 'https://schema.org',
      '@type':    'FAQPage',
      mainEntity: (method.faq || []).map((q) => ({
        '@type': 'Question',
        name:    q.q,
        acceptedAnswer: { '@type': 'Answer', text: q.a },
      })),
    },
  };

  const frameOptions = {
    layout: 'sidebar',
  };

  // "Try in a tool": from the shared reference ⇄ tools registry
  const { toolLinksFor } = require('@/content/reference/tool-links');
  const methodWithTools = { ...method, tryInTool: toolLinksFor(`javascript/methods/${meta.slug}`) };

  return { props: { seoData, meta, method: methodWithTools, siblings, siblingsTitle, schemas, frameOptions } };
}

export default function MethodPage({ seoData, meta, method, siblings, siblingsTitle, schemas, frameOptions }) {
  const emulator = getEmulator('javascript', 'methods', meta.slug);
  const canonical = `${SITE_URL}${seoData.url}`;
  const ogImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  const sections = [];
  if (meta.hasLiveDemo && emulator) {
    sections.push({ id: 'demo', label: 'Demo', count: null, content: <MethodDemo method={method} emulator={emulator} language="javascript" /> });
  }
  if (method.parameters && method.parameters.length > 0) {
    sections.push({ id: 'params', label: 'Parameters', count: null, content: <Parameters parameters={method.parameters} returns={method.returns} /> });
  }
  if (method.patterns && method.patterns.length > 0) {
    sections.push({ id: 'patterns', label: 'Common patterns', count: null, content: <Patterns patterns={method.patterns} /> });
  }
  if (method.examples && method.examples.length > 0) {
    sections.push({ id: 'examples', label: 'Examples', count: method.examples.length, content: <Examples examples={method.examples} /> });
  }
  if (method.pitfalls && method.pitfalls.length > 0) {
    sections.push({ id: 'pitfalls', label: 'Pitfalls', count: method.pitfalls.length, content: <Pitfalls pitfalls={method.pitfalls} /> });
  }
  if (method.when) {
    sections.push({ id: 'when', label: 'When to use', count: null, content: <WhenToUse when={method.when} /> });
  }
  if (method.notes) {
    sections.push({ id: 'notes', label: 'Notes', count: null, content: <Notes notes={method.notes} /> });
  }
  if (method.related && method.related.length > 0) {
    sections.push({ id: 'related', label: 'Related', count: null, content: <Related related={method.related} basePath={BASE_PATH} /> });
  }
  if (method.faq && method.faq.length > 0) {
    sections.push({ id: 'faq', label: 'FAQ', count: method.faq.length, content: <FAQ faq={method.faq} /> });
  }
  if (method.history && method.history.length > 0) {
    sections.push({ id: 'history', label: 'History', count: null, content: <History history={method.history} /> });
  }

  const rail = {
    tryInTool:    method.tryInTool || [],
    officialDocs: method.officialDocs || null,
  };

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
        <meta property="og:type"        content="article" />
        <meta property="og:site_name"   content={SITE_NAME} />
        <meta property="og:image"       content={ogImage} />

        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image"       content={ogImage} />

        <meta name="robots" content="index, follow" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
        {schemas.faq.mainEntity.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
        )}
      </Head>

      <div className="ref-page">
        <Breadcrumb />

        <ReferenceFrame
          layout={frameOptions.layout}
          siblings={siblings}
          siblingsTitle={siblingsTitle}
          sections={sections}
          rail={rail}
        >
          <h1 className="ref-h1">{seoData.name}</h1>
          {seoData.subtitle && <p className="ref-sub">{seoData.subtitle}</p>}
          <MethodHero method={method} />
        </ReferenceFrame>
      </div>

      <style jsx>{`
        .ref-page { max-width: 1280px; margin: 0 auto; padding: 84px 24px 80px; }
        .ref-h1 { font-size: 30px; font-weight: 800; color: #1B50EE; letter-spacing: -0.02em; margin: 0 0 4px; font-family: ui-monospace, Menlo, monospace; }
        .ref-sub { color: #475569; font-size: 15px; margin: 0 0 14px; }
      `}</style>
    </>
  );
}
