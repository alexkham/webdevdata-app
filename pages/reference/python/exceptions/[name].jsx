// pages/reference/python/exceptions/[name].jsx
//
// Dynamic leaf for /reference/python/exceptions/<slug>.
// Same page shape as the functions/operators leaves; the exception kind
// adds the inheritance chain (ExceptionHero), a Trigger / Raise / Handle
// snippet demo (SnippetDemo) and an attributes table.

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ReferenceFrame from '@/app/components/reference/frame/ReferenceFrame';
import ExceptionHero from '@/app/components/reference/exception/ExceptionHero';
import SnippetDemo from '@/app/components/reference/snippet/SnippetDemo';
import Attributes from '@/app/components/reference/exception/Attributes';
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
const BASE_PATH = '/reference/python/exceptions';

// Human labels for meta.category machine keys (sibling-rail heading).
const CATEGORY_LABELS = {
  base:            'Base classes',
  lookup:          'Lookup & name errors',
  'type-value':    'Type & value errors',
  arithmetic:      'Arithmetic errors',
  os:              'OS & file errors',
  'import-syntax': 'Import & syntax errors',
  runtime:         'Runtime errors',
  control:         'Control flow & exit',
  warnings:        'Warnings',
};

export async function getStaticPaths() {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(process.cwd(), 'content/reference/python/exceptions');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
  const paths = files.map((f) => ({ params: { name: f.replace(/\.js$/, '') } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { meta, method } = require('@/content/reference/python/exceptions/' + params.name);
  const { pythonExceptionsCatalog } = require('@/data/generated/python-exceptions-catalog');

  const siblings = pythonExceptionsCatalog.items
    .filter((m) => m.category === meta.category)
    .map((m) => ({
      slug: m.slug,
      title: m.name,
      href: `${BASE_PATH}/${m.slug}`,
      active: m.slug === meta.slug,
    }));

  const siblingsTitle = CATEGORY_LABELS[meta.category] || 'Related pages';

  // Inheritance chain, each ancestor linked when it has its own page.
  const slugByName = new Map(pythonExceptionsCatalog.items.map((m) => [m.name, m.slug]));
  const chain = (method.chain || []).map((name) => ({
    name,
    href: slugByName.has(name) ? `${BASE_PATH}/${slugByName.get(name)}` : null,
  }));

  const seoData = {
    title:       `Python ${meta.name} — Causes, Fixes & Examples | ${SITE_NAME}`,
    description: `${meta.blurb} What raises ${meta.name}, how to handle it, pitfalls${meta.hasLiveDemo ? ' and a live in-browser demo' : ''}.`,
    name:        meta.name,
    subtitle:    method.subtitle || meta.blurb,
    url:         `${BASE_PATH}/${meta.slug}`,
    keywords:    `python ${meta.searchTerms}`,
    breadcrumb: [
      { label: 'Home',       href: '/' },
      { label: 'Reference',  href: '/reference' },
      { label: 'Python',     href: '/reference/python' },
      { label: 'Exceptions', href: BASE_PATH },
      { label: meta.name,    href: `${BASE_PATH}/${meta.slug}` },
    ],
    datePublished: '2026-09-27',
  };

  const schemas = {
    article: {
      '@context':    'https://schema.org',
      '@type':       'TechArticle',
      headline:      `Python ${meta.name}`,
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
  const methodWithTools = { ...method, tryInTool: toolLinksFor(`python/exceptions/${meta.slug}`) };

  return { props: { seoData, meta, method: methodWithTools, chain, siblings, siblingsTitle, schemas, frameOptions } };
}

export default function ExceptionPage({ seoData, meta, method, chain, siblings, siblingsTitle, schemas, frameOptions }) {
  const emulator = getEmulator('python', 'exceptions', meta.slug);
  const canonical = `${SITE_URL}${seoData.url}`;
  const ogImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  const sections = [];
  if (meta.hasLiveDemo && emulator) {
    sections.push({ id: 'demo', label: 'Demo', count: null, content: <SnippetDemo modes={method.modes} emulator={emulator} explainer={method.demoExplainer} /> });
  }
  if (method.parameters && method.parameters.length > 0) {
    sections.push({ id: 'params', label: 'Constructor', count: null, content: <Parameters parameters={method.parameters} /> });
  }
  if (method.attributes && method.attributes.length > 0) {
    sections.push({ id: 'attributes', label: 'Attributes', count: null, content: <Attributes attributes={method.attributes} /> });
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
          <ExceptionHero method={method} chain={chain} />
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
