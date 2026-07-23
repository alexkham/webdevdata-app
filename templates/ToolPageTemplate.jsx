// pages/YOUR-TOOL-SLUG.jsx
// ─────────────────────────────────────────────────────────────
// TOOL PAGE TEMPLATE — copy this file per tool, fill in every
// marked field, replace the tool placeholder with the real
// tool component.
//
// PRIMARY PURPOSE: SEO. Every meta tag, canonical URL, OG tag,
// Twitter card, and JSON-LD schema below is here for a reason.
// Do not skip fields. Do not let anything fall back to
// undefined — silent undefined values in title/description/URL
// ship to Google before you notice.
//
// PATTERN (mirrors LearnMathClass / CalculateMatrix):
//   • getStaticProps carries ONLY serializable data — strings,
//     arrays of primitives, plain objects, no React refs, no
//     undefined values.
//   • React nodes stay at module scope. Content stays in
//     getStaticProps. The page function joins them.
//   • Schemas: WebApplication + BreadcrumbList + FAQPage,
//     built from data so schema and page stay in sync.
//   • Hub-aggregation fields (hubDescription, category,
//     subCategory) present so hub pages can render this tool
//     as a card.
//
// TEMPLATE, NOT A COMPONENT. Everything below is a starting
// point. Replace placeholders, fill blanks, delete this header
// once you understand the pattern.
// ─────────────────────────────────────────────────────────────

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import { processContent } from '@/app/utils/contentProcessor';

// ─── Replace with the actual tool component import ───────────
// import YourTool from '@/app/components/tools/your-tool/YourTool';

// ─────────────────────────────────────────────────────────────
// Site-wide constants
// ─────────────────────────────────────────────────────────────

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';

// ─────────────────────────────────────────────────────────────
// Inline reference card component
//
// Lives at module scope because it is a React node factory —
// non-serializable. The data it renders (referenceData) lives
// inside getStaticProps. The page function joins them.
//
// Replace this with an imported shared component when one exists.
// ─────────────────────────────────────────────────────────────

function ReferenceCard({ heading, items }) {
  const CARD = { background: '#fff', border: '1px solid #e4e4e7', borderRadius: 10, padding: '14px 16px' };
  const HEAD = { fontSize: 11, fontWeight: 700, color: '#71717a', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #e4e4e7' };
  const LINK = { display: 'block', padding: '8px 0', color: '#18181b', fontSize: 13.5, fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #f4f4f5' };
  const META = { fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#71717a', marginTop: 2, fontWeight: 400 };
  const last = items.length - 1;
  return (
    <div style={CARD}>
      <div style={HEAD}>{heading}</div>
      {items.map((it, i) => (
        <a key={it.href} href={it.href} style={i === last ? { ...LINK, borderBottom: 'none' } : LINK}>
          {it.label}
          {it.meta && <div style={META}>{it.meta}</div>}
        </a>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// getStaticProps — everything serializable lives here.
// Strings, arrays of primitives, plain objects. No React refs,
// no components, no functions, no undefined values.
// ─────────────────────────────────────────────────────────────

export async function getStaticProps() {

  // ── Keywords for meta tag + schema.keywords ────────────────
  // Aim for 10-15 terms. Real search phrases, not brainstorm noise.
  const keyWords = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];

  // ── SEO data ───────────────────────────────────────────────
  // EVERY FIELD MANUAL. Nothing derived from slug or tool name.
  const seoData = {
    // Meta title — appears in browser tab and search results.
    // Convention: 'Tool Name | WebDevData'. Under 60 chars total.
    title: ' | WebDevData',

    // Meta description — 150-160 chars. Active voice.
    // Leads with what the tool does, ends with the differentiator.
    description: '',

    // Short display name — used in <h1>, breadcrumb, and schemas.
    name: '',

    // On-page subtitle — one line under the <h1>. Different from
    // description; this is human-facing, not SEO-facing.
    subtitle: '',

    // Path only, no domain. E.g. '/json-formatter'.
    url: '',

    // Joined into meta keywords + schema.keywords.
    keywords: keyWords.join(', '),

    // OG image path — 1200x630 recommended. Path only, no domain.
    // Empty string falls back to DEFAULT_OG_IMAGE.
    ogImagePath: '',

    // Canonical override — set only when this page canonicalizes
    // to a different URL. Leave null for the default (SITE_URL + url).
    canonicalOverride: null,

    // ── Hub-aggregation fields ───────────────────────────────
    // Consumed by hub/landing pages that render this tool as a card.
    // Do NOT start hubDescription with 'Interactive', 'Comprehensive',
    // 'Powerful', 'Complete', 'Advanced', 'Ultimate', or any generic
    // superlative — every tool is interactive; the opening words are
    // the most valuable real estate on a hub card. Open with a
    // concrete verb or specific noun phrase describing the tool's
    // actual function.
    hubDescription: '',
    category: '',
    subCategory: '',

    // Breadcrumb — full path, hand-written. Every crumb {label, href}.
    // Last item's href should equal seoData.url.
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: '', href: '' },
      { label: '', href: '' },
    ],

    // ── WebApplication schema extras ─────────────────────────
    applicationCategory: 'DeveloperApplication',
    featureList: [
      '',
      '',
      '',
    ],
    // ISO date, hand-written. Don't auto-generate — dateModified
    // handles the "last updated" signal.
    datePublished: '',
  };

  // ── Callout above the tool (optional) ──────────────────────
  // Set text: '' to hide the callout entirely.
  const calloutData = {
    highlight: '',              // optional prefix; rendered as <strong>
    text: '',                   // main message
    jumpTo: 'how',              // section id to anchor-link to
    jumpLabel: 'How to use \u2193',
  };

  // ── Left rail siblings ─────────────────────────────────────
  // One object per related tool. active=true marks the current tool.
  // Empty array = no left rail rendered at all.
  const siblings = [
    { slug: '', title: '', blurb: '', href: '', active: false, category: '' },
    { slug: '', title: '', blurb: '', href: '', active: false, category: '' },
  ];

  // ── Reference card data (optional) ─────────────────────────
  // Set items to [] to hide the reference panel entirely.
  // meta is optional per item — small monospace subtitle under each link.
  const referenceData = {
    heading: 'Reference',
    items: [
      { label: '', href: '', meta: '' },
      { label: '', href: '', meta: '' },
      { label: '', href: '', meta: '' },
    ],
  };

  // ── Below-fold sections ────────────────────────────────────
  // Each section: { id, title, content }
  //   id      — anchor + TOC + callout.jumpTo target
  //   title   — <h2> label + TOC label
  //   content — markdown string; runs through processContent at render.
  //
  // Order defines both TOC order and page order.
  // The FAQ section is added automatically at the end from faqQuestions
  // to keep the visible FAQ and the schema in sync — do NOT add an
  // FAQ section here.
  const sectionsContent = [
    {
      id: 'how',
      title: 'How to use',
      content: `

`,
    },
    {
      id: 'accepts',
      title: 'Accepted inputs',
      content: `

`,
    },
    {
      id: 'shortcuts',
      title: 'Keyboard shortcuts',
      content: `

`,
    },
  ];

  // ── FAQ questions ──────────────────────────────────────────
  // Single source of truth for both the FAQPage schema AND the
  // visible FAQ section (assembled in the page function).
  const faqQuestions = {
    obj1: { question: '', answer: '' },
    obj2: { question: '', answer: '' },
    obj3: { question: '', answer: '' },
    obj4: { question: '', answer: '' },
    obj5: { question: '', answer: '' },
  };

  // ── ToolFrame layout options ───────────────────────────────
  const frameOptions = {
    layout:         'classic',
    theme:          'light',
    initialSidebar: 'folded',
    expandTool:     false,
  };

  // ── Schemas ────────────────────────────────────────────────
  // Built from the data above so schema and page stay in sync.
  const schemas = {

    webApplication: {
      '@context':          'https://schema.org',
      '@type':             'WebApplication',
      name:                seoData.name,
      description:         seoData.description,
      url:                 `${SITE_URL}${seoData.url}`,
      applicationCategory: seoData.applicationCategory,
      operatingSystem:     'Any',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type':        'Offer',
        price:          '0',
        priceCurrency:  'USD',
      },
      featureList: seoData.featureList.filter(Boolean),
      author: {
        '@type': 'Organization',
        name:    SITE_NAME,
      },
      datePublished:       seoData.datePublished,
      dateModified:        new Date().toISOString(),
      inLanguage:          'en-US',
      isAccessibleForFree: true,
      keywords:            seoData.keywords,
    },

    breadcrumb: {
      '@context':       'https://schema.org',
      '@type':          'BreadcrumbList',
      itemListElement: seoData.breadcrumb.map((crumb, i) => ({
        '@type':   'ListItem',
        position:  i + 1,
        name:      crumb.label,
        item:      `${SITE_URL}${crumb.href}`,
      })),
    },

    faq: {
      '@context':  'https://schema.org',
      '@type':     'FAQPage',
      mainEntity:  Object.values(faqQuestions)
        .filter((q) => q.question && q.answer)
        .map((q) => ({
          '@type': 'Question',
          name:    q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text:    q.answer,
          },
        })),
    },
  };

  return {
    props: {
      seoData,
      calloutData,
      siblings,
      referenceData,
      sectionsContent,
      faqQuestions,
      schemas,
      frameOptions,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Page function — assembles ReactNodes from static data and
// renders <Head> + <ToolFrame>.
// ─────────────────────────────────────────────────────────────

export default function ToolPage({
  seoData,
  calloutData,
  siblings,
  referenceData,
  sectionsContent,
  faqQuestions,
  schemas,
  frameOptions,
}) {

  // ── Canonical + OG image URLs ──────────────────────────────
  const canonical = seoData.canonicalOverride
    ? `${SITE_URL}${seoData.canonicalOverride}`
    : `${SITE_URL}${seoData.url}`;

  const ogImage = seoData.ogImagePath
    ? `${SITE_URL}${seoData.ogImagePath}`
    : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  // ── Assemble callout ReactNode ─────────────────────────────
  const callout = calloutData.text
    ? {
        text: (
          <>
            {calloutData.highlight && <><strong>{calloutData.highlight}</strong>{' '}</>}
            {calloutData.text}
          </>
        ),
        jumpTo:    calloutData.jumpTo,
        jumpLabel: calloutData.jumpLabel,
      }
    : null;

  // ── Build FAQ section markdown from faqQuestions ───────────
  // Single source of truth: same data feeds the schema and the
  // visible section.
  const faqMarkdown = Object.values(faqQuestions)
    .filter((q) => q.question && q.answer)
    .map((q) => `**${q.question}**\n\n${q.answer}`)
    .join('\n\n');

  // ── Assemble sections — markdown → JSX via processContent ──
  const sections = [
    ...sectionsContent.map((s) => ({
      id:      s.id,
      title:   s.title,
      content: <>{processContent(s.content)}</>,
    })),
    ...(faqMarkdown ? [{
      id:      'faq',
      title:   'Frequently asked questions',
      content: <>{processContent(faqMarkdown)}</>,
    }] : []),
  ];

  // ── Assemble reference panel ReactNode ─────────────────────
  const referencePanel = (referenceData && referenceData.items && referenceData.items.length)
    ? <ReferenceCard heading={referenceData.heading} items={referenceData.items} />
    : null;

  return (
    <>

      {/* ── SEO Head — every tag intentional ─────────────── */}
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webApplication) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
        />
        {schemas.faq.mainEntity.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
          />
        )}
      </Head>
      <br/>
      <br/>
      {/* ── Page chrome — breadcrumb + h1 + subtitle ─────── */}
      <Breadcrumb />

      <h1 style={{
        fontSize:      30,
        fontWeight:    800,
        color:         '#1B50EE',
        letterSpacing: '-0.02em',
        lineHeight:    1.15,
        textAlign:     'center',
        margin:        '20px 0 10px',
      }}>
        {seoData.name}
      </h1>

      {seoData.subtitle && (
        <p style={{
          color:         '#475569',
          fontSize:      18,
          fontWeight:    500,
          lineHeight:    1.6,
          letterSpacing: '-0.01em',
          textAlign:     'center',
          margin:        '0 0 24px',
        }}>
          {seoData.subtitle}
        </p>
      )}

      {/* ── ToolFrame — the layout host ──────────────────── */}
      <ToolFrame
        layout={frameOptions.layout}
        theme={frameOptions.theme}
        initialSidebar={frameOptions.initialSidebar}
        expandTool={frameOptions.expandTool}
        siblings={siblings}
        callout={callout}
        sections={sections}
        referencePanel={referencePanel}
      >
        {/*
          ── Replace this placeholder with the actual tool ──
          Example:
            <YourTool />
        */}
        <div style={{
          padding:        48,
          textAlign:      'center',
          color:          '#64748b',
          fontStyle:      'italic',
          minHeight:      380,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontFamily:     'ui-monospace, Menlo, monospace',
          fontSize:       13,
        }}>
          Tool placeholder &mdash; replace with your tool component
        </div>
      </ToolFrame>

    </>
  );
}