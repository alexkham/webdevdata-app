// pages/tools/js-minifier.jsx — v2
// Moved under /tools/. Diff vs v1: URL, breadcrumbs, getSiblings subdir, import path depth, cross-link.

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import JsMinifierTool from '@/app/components/tools/JsMinifierTool';
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
        <p>Paste JavaScript into the input pane. The minified output appears on the right as you type (300ms debounce, so it doesn&apos;t re-run on every keystroke).</p>
        <p>Adjust the options row to control mangling, compression, comment preservation, and ECMAScript target. Copy the output or download as <code>minified.js</code>.</p>
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
        <p>Minification is production shipping. It strips whitespace, shortens variable names, drops comments and dead code, and can remove debugging aids like <code>console.log</code> and <code>debugger</code>.</p>
        <ul>
          <li>Preparing a script for a static site or CDN drop, without setting up a build pipeline.</li>
          <li>Quickly checking how small a snippet gets before wiring it into a bundler.</li>
          <li>Sanity-checking terser&apos;s output on a specific piece of code.</li>
          <li>One-off scripts that don&apos;t warrant a full build.</li>
        </ul>
        <p><strong>When not to use:</strong> If you already have a build pipeline (webpack, Rollup, Vite, esbuild), minify there — you&apos;ll want source maps and integration into your deploy.</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Mangle names</strong> — renames variables and function names to short forms (<code>a</code>, <code>b</code>, <code>c</code>, ...) within their scope. Safe by default; can break if your code relies on <code>Function.prototype.name</code> or reflection.</p>
        <p><strong>Compress</strong> — enables terser&apos;s expression-level optimizations: dead code elimination, constant folding, inline simple functions, remove unreachable branches.</p>
        <p><strong>Drop <code>console</code></strong> — removes all <code>console.*</code> calls. Only active when Compress is on.</p>
        <p><strong>Drop <code>debugger</code></strong> — removes all <code>debugger;</code> statements. Only active when Compress is on.</p>
        <p><strong>Comments</strong> — <em>None</em> strips every comment. <em>Important</em> keeps <code>/*! */</code>-style banners (license headers). <em>All</em> keeps every comment.</p>
        <p><strong>Target</strong> — ECMAScript version the output must run on. <em>ES5</em> for legacy browser support; <em>Latest</em> for modern-only builds.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Mangling can break code that reads function names.</strong> If your code does <code>fn.name === &apos;handleClick&apos;</code>, mangling changes <code>handleClick</code> to something like <code>a</code>. Same for Vue/React devtools that use <code>displayName</code> — pass those through your build unchanged, or disable mangling.</p>
        <p><strong>Terser is not a transpiler.</strong> Modern syntax stays modern. If you paste in <code>async</code> functions and set target to ES5, terser will not down-compile — you&apos;ll get an error or invalid output. Use Babel for down-compilation, then terser to minify.</p>
        <p><strong>Long-running scripts may hit the debounce.</strong> Minification runs 300ms after your last keystroke. Very large inputs (hundreds of KB) may take a second or two to process on the main thread.</p>
        <p><strong>Terser is dynamic-imported on first use.</strong> First minify has a small delay while the library loads (~200KB gzipped). Subsequent runs are instant.</p>
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
    'javascript minifier',
    'js minifier',
    'minify javascript',
    'minify js online',
    'compress javascript',
    'javascript compressor',
    'js code optimizer',
    'terser online',
  ];

  const seoData = {
    title: 'JavaScript Minifier | WebDevData',
    description: 'Minify JavaScript in your browser. Terser under the hood, with mangling, compression, drop-console, and comment options.',
    name: 'JavaScript Minifier',
    subtitle: 'Terser in your browser. Live output, per-option control, real byte-savings stats.',
    url: '/tools/js-minifier',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Minify JavaScript with terser, in your browser.',
    category: 'Formatters & Minifiers',
    subCategory: null,
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'JS Minifier', href: '/tools/js-minifier' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'JavaScript minification via terser',
      'Variable name mangling',
      'Expression compression and dead-code elimination',
      'Drop console and debugger statements',
      'Comment preservation control',
      'ECMAScript target selection',
      'Live byte-savings stats',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'Minification in your browser.',
    text: 'Paste JavaScript, get minified output. Terser under the hood; nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('js-minifier', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'Terser', href: 'https://terser.org/', meta: 'Official docs' },
      { label: 'Terser options', href: 'https://terser.org/docs/options/', meta: 'Full compress / mangle / format options' },
      { label: 'ECMAScript versions', href: 'https://en.wikipedia.org/wiki/ECMAScript_version_history', meta: 'Yearly editions of the language' },
      { label: 'Compare tools', href: '/tools/js-beautifier', meta: 'Reverse: unminify / beautify' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What is JavaScript minification?',
      answer: 'Minification reduces file size by removing whitespace, comments, and dead code, and shortening variable names. It preserves behavior — the minified script runs identically to the original.',
    },
    q2: {
      question: 'Is this the same as compression like gzip?',
      answer: 'No. Minification changes the source itself; compression encodes the bytes during transfer. Use both — minify first, then let the server gzip or brotli the response for best results.',
    },
    q3: {
      question: 'Will minifying break my code?',
      answer: 'Rarely, but yes if your code relies on function names or class names as strings (via Function.prototype.name), or on eval strings. Test after minifying, and disable mangling if you hit issues.',
    },
    q4: {
      question: 'Why does the first minify take a moment?',
      answer: 'Terser is loaded on demand — the first minify triggers the download (~200KB gzipped). After that, minification is instant.',
    },
    q5: {
      question: 'Does the tool support source maps?',
      answer: 'Not in this version. Terser supports source map output; if you need them, run terser as part of your build pipeline instead.',
    },
    q6: {
      question: 'Can I minify a whole bundle?',
      answer: 'For anything larger than a few hundred KB, use terser via a bundler — the browser main thread will freeze on massive inputs. This tool is for snippets and small files.',
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

export default function JsMinifierPage({
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
        <JsMinifierTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}