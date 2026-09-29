// utils/stdlib-static.js
//
// Build-time helpers for the /reference/python/stdlib pages. Called ONLY
// from getStaticPaths / getStaticProps (Next strips those and their
// imports from the client bundle), so fs and require are fine here.
//
// Each covered module has a static folder under pages/reference/python/
// stdlib/<module>/ with a thin index.jsx (module hub) and [name].jsx
// (member page) that delegate their data work to these helpers.

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const ROOT = '/reference/python/stdlib';

// Member kinds (meta.category of a member page), in display order.
export const MEMBER_GROUPS = [
  { key: 'functions',  label: 'Functions' },
  { key: 'classes',    label: 'Classes' },
  { key: 'methods',    label: 'Methods & attributes' },
  { key: 'exceptions', label: 'Exceptions' },
  { key: 'constants',  label: 'Constants' },
];

function moduleCatalog(module) {
  // data/generated/python-stdlib-<module>-catalog.js → its single export
  const mod = require(`@/data/generated/python-stdlib-${module}-catalog`);
  return Object.values(mod)[0].items;
}

function loadContent(module, slug) {
  return require(`@/content/reference/python/stdlib/${module}/${slug}`);
}

// related[] → absolute hrefs. Bare slug = same module; category
// 'stdlib/<m>' = another module's member; 'stdlib' + slug = a module hub;
// any other category = a sibling section (functions, exceptions, …).
function withHrefs(related, module) {
  return (related || []).map((r) => {
    if (r.href) return r;
    let href;
    if (!r.category) href = `${ROOT}/${module}/${r.slug}`;
    else if (r.category === 'stdlib') href = `${ROOT}/${r.slug}`;
    else href = `/reference/python/${r.category}/${r.slug}`;
    return { ...r, href };
  });
}

const breadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: `${SITE_URL}${c.href}` })),
});
const faqSchema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (faq || []).map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })),
});

export function memberPaths(module) {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(process.cwd(), 'content/reference/python/stdlib', module);
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.js') && f !== 'index.js')
    .map((f) => ({ params: { name: f.replace(/\.js$/, '') } }));
}

export function memberProps(module, name) {
  const { meta, method } = loadContent(module, name);
  const hub = loadContent(module, 'index');
  const items = moduleCatalog(module);
  const base = `${ROOT}/${module}`;

  const order = MEMBER_GROUPS.map((g) => g.key);
  const siblings = items
    .filter((m) => m.slug !== 'index')
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category))
    .map((m) => ({ slug: m.slug, title: m.name, href: `${base}/${m.slug}`, active: m.slug === meta.slug }));

  // exception members: inheritance chain, ancestors linked when they have
  // a page among the built-in exceptions
  const { pythonExceptionsCatalog } = require('@/data/generated/python-exceptions-catalog');
  const excSlug = new Map(pythonExceptionsCatalog.items.map((m) => [m.name, m.slug]));
  const chain = (method.chain || []).map((n) => ({
    name: n,
    href: excSlug.has(n) ? `/reference/python/exceptions/${excSlug.get(n)}` : null,
  }));

  const url = `${base}/${meta.slug}`;
  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Reference', href: '/reference' },
    { label: 'Python', href: '/reference/python' },
    { label: 'Standard library', href: ROOT },
    { label: module, href: base },
    { label: meta.name, href: url },
  ];
  const seoData = {
    title: `Python ${meta.name} — Syntax, Examples & Pitfalls | ${SITE_NAME}`,
    description: `${meta.blurb} Parameters, examples, pitfalls${meta.hasLiveDemo ? ' and a live in-browser demo' : ''} for ${meta.name} from the Python standard library.`,
    name: meta.name,
    subtitle: method.subtitle || meta.blurb,
    url,
    keywords: `python ${meta.searchTerms}`,
    breadcrumb,
    datePublished: '2026-09-29',
  };
  const schemas = {
    article: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `Python ${meta.name}`,
      description: seoData.description,
      url: `${SITE_URL}${url}`,
      author: { '@type': 'Organization', name: SITE_NAME },
      datePublished: seoData.datePublished,
      inLanguage: 'en-US',
      keywords: seoData.keywords,
    },
    breadcrumb: breadcrumbSchema(breadcrumb),
    faq: faqSchema(method.faq),
  };
  return {
    props: {
      seoData,
      meta,
      method: { ...method, related: withHrefs(method.related, module) },
      chain,
      siblings,
      siblingsTitle: `${hub.meta.name} module`,
      schemas,
      moduleHref: base,
    },
  };
}

export function moduleHubProps(module) {
  const { meta, method } = loadContent(module, 'index');
  const items = moduleCatalog(module).filter((m) => m.slug !== 'index');
  const base = `${ROOT}/${module}`;
  const groups = MEMBER_GROUPS.map((g) => ({
    ...g,
    items: items
      .filter((m) => m.category === g.key)
      .map((m) => ({ name: m.name, signature: m.signature, blurb: m.blurb, hasLiveDemo: m.hasLiveDemo, href: `${base}/${m.slug}` })),
  }));

  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Reference', href: '/reference' },
    { label: 'Python', href: '/reference/python' },
    { label: 'Standard library', href: ROOT },
    { label: meta.name, href: base },
  ];
  const seoData = {
    title: `Python ${meta.name} Module — Functions, Examples & Pitfalls | ${SITE_NAME}`,
    description: `${meta.blurb} Every public function and class of the ${meta.name} module, with examples, pitfalls${meta.hasLiveDemo ? ' and live in-browser demos' : ''}.`,
    name: meta.name,
    subtitle: method.subtitle || meta.blurb,
    url: base,
    keywords: `python ${meta.searchTerms}`,
    breadcrumb,
  };
  // sibling rail: the module's members
  const siblings = groups.flatMap((g) => g.items).map((m) => ({ slug: m.href, title: m.name, href: m.href, active: false }));
  return {
    props: {
      seoData,
      meta,
      method: { ...method, related: withHrefs(method.related, module) },
      groups,
      siblings,
      siblingsTitle: `${meta.name} module`,
      schemas: { breadcrumb: breadcrumbSchema(breadcrumb), faq: faqSchema(method.faq) },
    },
  };
}

export function stdlibIndexProps() {
  const { pythonStdlibCatalog } = require('@/data/generated/python-stdlib-catalog');
  const modules = pythonStdlibCatalog.modules;
  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Reference', href: '/reference' },
    { label: 'Python', href: '/reference/python' },
    { label: 'Standard library', href: ROOT },
  ];
  return { modules, breadcrumb, breadcrumbSchema: breadcrumbSchema(breadcrumb) };
}
