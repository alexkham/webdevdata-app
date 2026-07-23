// pages/tools/js-beautifier.jsx — v2
// Moved under /tools/. Diff vs v1: URL, breadcrumbs, getSiblings subdir, import path depth, cross-link.

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import JsBeautifierTool from '@/app/components/tools/JsBeautifierTool';
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
        <p>Paste minified or compact JavaScript into the input pane. The beautified output appears on the right as you type (300ms debounce).</p>
        <p>Adjust indent size, blank-line handling, and formatting options. Copy the output or download as <code>beautified.js</code>.</p>
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
        <p>Beautifying (also called unminifying or prettifying) makes minified code readable — for inspection, debugging, or understanding third-party scripts.</p>
        <ul>
          <li>Reading a minified script embedded in a page&apos;s HTML.</li>
          <li>Inspecting a vendor bundle before you rewrite or replace it.</li>
          <li>Making a stack trace pointing into minified code more navigable.</li>
          <li>Cleaning up a one-liner someone pasted into a Slack thread.</li>
        </ul>
        <p><strong>Note:</strong> Beautifying is <em>not</em> the same as un-mangling. If the original variable names were renamed to <code>a</code>, <code>b</code>, <code>c</code>, this tool doesn&apos;t recover them — it only restores formatting. For name recovery, you need source maps.</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Indent</strong> — 2 spaces, 4 spaces, or a tab character.</p>
        <p><strong>Preserve blank lines</strong> — keep empty lines from the input in the output. Off: collapse everything to single-line separators.</p>
        <p><strong>Max blank</strong> — cap on consecutive blank lines when Preserve blank lines is on.</p>
        <p><strong>Space in parens</strong> — <code>( x )</code> instead of <code>(x)</code>. Some style guides prefer this.</p>
        <p><strong>Break chained methods</strong> — put each <code>.method()</code> in a chain on its own line. Useful for fluent APIs.</p>
        <p><strong>Trailing newline</strong> — end the file with a newline (POSIX convention).</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Mangled names don&apos;t come back.</strong> Beautifying restores whitespace and line breaks but does not rename <code>a</code>, <code>b</code>, <code>c</code> back to their originals. That information is gone unless you have source maps.</p>
        <p><strong>Not all minified code beautifies cleanly.</strong> Aggressively-compressed constructs (comma expressions, inlined helpers, mangled property accesses) may produce output that&apos;s less readable than you&apos;d hope.</p>
        <p><strong>Semicolon-less input is fine.</strong> The beautifier handles ASI (automatic semicolon insertion) — you don&apos;t need to add semicolons before pasting.</p>
        <p><strong>js-beautify is dynamic-imported.</strong> First beautify has a brief delay while the library loads. Subsequent runs are instant.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your JavaScript never leaves the page — no server, no logging, no analytics on the content.</p>
    ),
  },
];

export async function getStaticProps() {
  const keyWords = [
    'javascript beautifier',
    'js beautifier',
    'unminify javascript',
    'js unminifier',
    'prettify javascript',
    'javascript prettifier',
    'format javascript online',
    'js formatter',
  ];

  const seoData = {
    title: 'JavaScript Beautifier / Unminifier | WebDevData',
    description: 'Beautify minified JavaScript in your browser. Restore whitespace, indentation, and line breaks. Powered by js-beautify.',
    name: 'JavaScript Beautifier',
    subtitle: 'Turn minified JavaScript into readable code. Powered by js-beautify. Live output, all options.',
    url: '/tools/js-beautifier',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Restore readable formatting to minified or compact JavaScript.',
    category: 'Formatters & Minifiers',
    subCategory: null,
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'JS Beautifier', href: '/tools/js-beautifier' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'JavaScript beautification via js-beautify',
      'Configurable indent size (2, 4, tab)',
      'Blank line preservation with cap',
      'Space-in-parens control',
      'Chained method breaking',
      'Trailing newline option',
      'Live output',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'Beautification in your browser.',
    text: 'Paste minified JavaScript, get a readable version. Nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('js-beautifier', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'js-beautify', href: 'https://beautifier.io/', meta: 'Official homepage' },
      { label: 'GitHub — js-beautify', href: 'https://github.com/beautify-web/js-beautify', meta: 'Source and full options' },
      { label: 'ECMAScript grammar', href: 'https://tc39.es/ecma262/', meta: 'Official language spec' },
      { label: 'Compare tools', href: '/tools/js-minifier', meta: 'Reverse: minify JavaScript' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What is JavaScript beautification?',
      answer: 'Reformatting compact or minified JavaScript into a readable form: line breaks, consistent indentation, spacing around operators and keywords. It preserves behavior — the beautified script runs identically.',
    },
    q2: {
      question: 'Can beautification recover original variable names?',
      answer: 'No. Beautifying restores whitespace and structure, not identifiers. If names were mangled to a, b, c, they stay that way. Name recovery requires source maps.',
    },
    q3: {
      question: 'Will this modify my code?',
      answer: 'Only formatting: whitespace, indentation, and line breaks. Logic, identifiers, and values are untouched. The beautified script runs the same as the input.',
    },
    q4: {
      question: 'Why does the first beautify take a moment?',
      answer: 'js-beautify is loaded on demand — the first run triggers the download. After that, beautification is instant.',
    },
    q5: {
      question: 'Does it handle JSX or TypeScript?',
      answer: 'js-beautify is JavaScript-focused. It may work on simple JSX or TypeScript but will not reliably handle types, generics, or JSX attributes. Use a language-specific formatter (Prettier) for those.',
    },
    q6: {
      question: 'What is the difference between beautify and minify?',
      answer: 'Minify reduces code to the smallest form that still runs. Beautify does the opposite: reformats for readability. Both preserve behavior.',
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

export default function JsBeautifierPage({
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
        <JsBeautifierTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}