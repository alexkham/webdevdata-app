// pages/tools/css-minifier/index.jsx — v1

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import CssMinifierTool from '@/app/components/tools/CssMinifierTool';
import { getSiblings } from '../../../utils/getSiblings';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';

// ── Module-scope helpers ─────────────────────────────────

function ReferenceCard({ data }) {
  if (!data) return null;
  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: 16,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 800,
        color: '#334155',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        {data.heading}
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              target={it.href.startsWith('/') ? '_self' : '_blank'}
              rel={it.href.startsWith('/') ? undefined : 'noopener noreferrer'}
              style={{
                color: '#1B50EE',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
                borderBottom: '1px solid #C8D4F6',
              }}
            >
              {it.label}
            </a>
            {it.meta && (
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {it.meta}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Kbd({ children }) {
  return (
    <kbd style={{
      display: 'inline-block',
      padding: '2px 7px',
      fontFamily: 'ui-monospace, Menlo, monospace',
      fontSize: 11.5,
      color: '#334155',
      background: '#f1f5f9',
      border: '1px solid #cbd5e1',
      borderRadius: 4,
      boxShadow: '0 1px 0 #cbd5e1',
      lineHeight: 1.2,
    }}>
      {children}
    </kbd>
  );
}

function ShortcutsTable() {
  const rows = [
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">K</Kbd>], desc: 'Focus the input pane' },
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">Enter</Kbd>], desc: 'Copy output to clipboard' },
  ];
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 520 }}>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '10px 0', width: 220 }}>{r.keys}</td>
            <td style={{ padding: '10px 0', color: '#475569' }}>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FAQBlock({ questions }) {
  const entries = Object.values(questions).filter((q) => q.question && q.answer);
  if (entries.length === 0) return null;
  return (
    <div>
      {entries.map((q, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6, fontSize: 15 }}>
            {q.question}
          </div>
          <div style={{ color: '#475569', lineHeight: 1.65 }}>
            {q.answer}
          </div>
        </div>
      ))}
    </div>
  );
}

const SECTIONS = [
  {
    id: 'how',
    title: 'How to use',
    content: (
      <>
        <p>Paste CSS into the input pane. The minified output appears on the right as you type (300ms debounce).</p>
        <p>Toggle <strong>Restructure</strong> for aggressive optimization — merging duplicate selectors, hoisting common declarations, dropping unused rules. Turn it off if you need the output to preserve source order and structure.</p>
        <p>Pick a <strong>Comments</strong> mode: <em>None</em> strips everything, <em>Exclamation</em> keeps <code>/*! */</code> license banners, <em>All</em> preserves every comment.</p>
      </>
    ),
  },
  {
    id: 'shortcuts',
    title: 'Keyboard shortcuts',
    content: (
      <>
        <p>Two shortcuts:</p>
        <ShortcutsTable />
      </>
    ),
  },
  {
    id: 'when',
    title: 'When to use it',
    content: (
      <>
        <p>CSS minification saves bytes on production stylesheets, especially large frameworks or handwritten design systems.</p>
        <ul>
          <li>Shipping a hand-authored stylesheet to a CDN without a build pipeline.</li>
          <li>Checking how small a snippet becomes before wiring it into a bundler.</li>
          <li>Compressing inline critical CSS for above-the-fold rendering.</li>
          <li>Cleaning up copy-pasted CSS from a design tool.</li>
        </ul>
        <p><strong>When not to use:</strong> If you have a build pipeline (webpack, Vite, PostCSS), minify there — the output can then be integrated with source maps and hashed filenames.</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Restructure</strong> — enables csso&apos;s AST-level optimizations: merge duplicate selectors, hoist shared declarations, remove unused rules from selector groups, optimize shorthand properties. Turn off if you need output that mirrors source structure line-for-line.</p>
        <p><strong>Comments</strong>:</p>
        <ul>
          <li><em>None</em> — strips every comment.</li>
          <li><em>Exclamation</em> — keeps only <code>/*! ... */</code>-style comments (used for license headers). Standard for open-source CSS.</li>
          <li><em>All</em> — preserves every comment.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Restructure can reorder rules.</strong> Merging duplicate selectors and hoisting common declarations changes source order. If your CSS relies on specific declaration order for the cascade (rare but possible), turn Restructure off.</p>
        <p><strong>CSS variables are preserved.</strong> <code>--custom-prop</code> definitions and <code>var(...)</code> references pass through unchanged.</p>
        <p><strong>Vendor prefixes are preserved.</strong> csso doesn&apos;t remove <code>-webkit-</code> or <code>-moz-</code> prefixes unless they&apos;re unambiguously redundant. Use autoprefixer&apos;s <code>--remove</code> upstream if you want them dropped.</p>
        <p><strong>Unknown at-rules pass through.</strong> Non-standard at-rules (some framework macros) are kept as-is.</p>
        <p><strong>csso loads on first use.</strong> First minify triggers the library download; subsequent runs are instant.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your CSS never leaves the page — no server, no logging, no analytics on the content.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'css minifier',
    'minify css',
    'css compressor',
    'css optimizer',
    'compress css online',
    'css minification',
  ];

  const seoData = {
    title: 'CSS Minifier | WebDevData',
    description: 'Minify CSS in your browser with csso. AST-based optimization, not just regex — merges duplicate selectors, optimizes shorthand, preserves variables.',
    name: 'CSS Minifier',
    subtitle: 'Client-side CSS minification with real AST-level optimization. Live output.',
    url: '/tools/css-minifier',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Minify CSS with csso, in your browser.',
    category: 'Tools',
    subCategory: 'Formatters',
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'CSS Minifier', href: '/tools/css-minifier' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'CSS minification via csso',
      'AST-level optimization (not regex)',
      'Merge duplicate selectors',
      'Optimize shorthand properties',
      'Preserve CSS variables and vendor prefixes',
      'Configurable comment handling',
      'Live byte-savings stats',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'CSS minification in your browser.',
    text: 'Paste CSS, get minified output. Real AST-based minifier; nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('css-minifier', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'csso', href: 'https://github.com/css/csso', meta: 'Underlying minifier' },
      { label: 'CSS specifications', href: 'https://www.w3.org/Style/CSS/', meta: 'W3C CSS working group' },
      { label: 'Related tool', href: '/tools/html-minifier', meta: 'HTML minifier' },
      { label: 'Related tool', href: '/tools/js-minifier', meta: 'JavaScript minifier' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What does CSS minification do?',
      answer: 'Removes whitespace, comments, and redundant syntax. A proper minifier like csso also merges duplicate selectors, optimizes shorthand properties, and hoists common declarations. The result renders identically but ships smaller.',
    },
    q2: {
      question: 'Is this the same as regex-based minification?',
      answer: 'No. csso parses CSS into an AST and applies real optimizations. Regex-based minification only removes whitespace and can break on valid CSS constructs like nested media queries or complex selectors.',
    },
    q3: {
      question: 'Will Restructure change my output layout?',
      answer: 'It can — Restructure merges duplicate selectors and reorders declarations. This is safe in typical CSS but can change behavior if your styles rely on very specific cascade order. Turn Restructure off if you hit issues.',
    },
    q4: {
      question: 'Are CSS variables and vendor prefixes preserved?',
      answer: 'Yes. csso passes both through unchanged. If you want vendor prefixes stripped, use autoprefixer with the --remove flag as a preprocessing step.',
    },
    q5: {
      question: 'Why does the first minify take a moment?',
      answer: 'csso is loaded on demand — the first minify triggers the download. After that, minification is instant.',
    },
    q6: {
      question: 'Does the tool send my CSS anywhere?',
      answer: 'No. All minification happens in your browser. The input never leaves the page.',
    },
  };

  const frameOptions = {
    layout: 'classic',
    theme: 'light',
    initialSidebar: 'folded',
  };

  const toolOptions = {
    theme: frameOptions.theme,
    showExplanations: false,
    showOrientationToggle: true,
    initialOrientation: 'horizontal',
  };

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seoData.name,
    description: seoData.description,
    url: SITE_URL + seoData.url,
    applicationCategory: seoData.applicationCategory,
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires modern browser.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: seoData.featureList,
    author: { '@type': 'Organization', name: SITE_NAME },
    datePublished: seoData.datePublished,
    dateModified: seoData.datePublished,
    inLanguage: 'en',
    isAccessibleForFree: true,
    keywords: seoData.keywords,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: seoData.breadcrumb.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: SITE_URL + c.href,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Object.values(faqQuestions)
      .filter((q) => q.question && q.answer)
      .map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
  };

  const schemas = {
    webApplication: webApplicationSchema,
    breadcrumb: breadcrumbSchema,
    faq: faqSchema,
  };

  return {
    props: {
      seoData,
      calloutData,
      siblings,
      referenceData,
      faqQuestions,
      frameOptions,
      toolOptions,
      schemas,
    },
  };
}

export default function CssMinifierPage({
  seoData,
  calloutData,
  siblings,
  referenceData,
  faqQuestions,
  frameOptions,
  toolOptions,
  schemas,
}) {
  const canonicalUrl = SITE_URL + (seoData.canonicalOverride || seoData.url);
  const ogImageUrl = SITE_URL + (seoData.ogImagePath || DEFAULT_OG_IMAGE);

  const callout = {
    text: (
      <>
        <strong>{calloutData.highlight}</strong> {calloutData.text}
      </>
    ),
    jumps: calloutData.jumps,
  };

  const sections = [
    ...SECTIONS,
    {
      id: 'faq',
      title: 'Frequently asked questions',
      content: <FAQBlock questions={faqQuestions} />,
    },
  ];

  const referencePanel = <ReferenceCard data={referenceData} />;

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoData.name} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.name} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={ogImageUrl} />
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

      <br />
      <br />
      <Breadcrumb />

      <h1 style={{
        fontSize: 30,
        fontWeight: 800,
        color: '#1B50EE',
        textAlign: 'center',
        letterSpacing: '-0.01em',
        marginTop: 20,
        marginBottom: 8,
      }}>
        {seoData.name}
      </h1>

      {seoData.subtitle && (
        <p style={{
          color: '#475569',
          fontSize: 18,
          textAlign: 'center',
          maxWidth: 780,
          margin: '0 auto 24px',
          lineHeight: 1.5,
        }}>
          {seoData.subtitle}
        </p>
      )}

      <ToolFrame
        layout={frameOptions.layout}
        theme={frameOptions.theme}
        initialSidebar={frameOptions.initialSidebar}
        siblings={siblings}
        callout={callout}
        sections={sections}
        referencePanel={referencePanel}
      >
        <CssMinifierTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}