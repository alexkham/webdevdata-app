// pages/tools/json-formatter/index.jsx
// JSON Formatter / Validator / Minifier tool page.

import Head from 'next/head';
import Link from 'next/link';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import JsonFormatterTool from '@/app/components/tools/JsonFormatterTool';
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
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">Enter</Kbd>], desc: 'Copy the output to clipboard' },
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">/</Kbd>], desc: 'Switch between Format and Minify' },
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
        <p>Paste JSON into the left pane, or drop a file onto the drop zone. The output updates live as you type &mdash; formatted with your chosen indent in <strong>Format</strong> mode, collapsed to one line in <strong>Minify</strong> mode.</p>
        <p>If the input isn&apos;t valid JSON, the output pane shows the parse error with the line and column where it occurred, so this doubles as a validator &mdash; there&apos;s no separate &quot;validate&quot; button to press.</p>
        <p>Copy the result with the <strong>Copy</strong> button, or download it as <code>formatted.json</code> / <code>minified.json</code>. The stats footer tracks size, top-level key count, and nesting depth as you go.</p>
      </>
    ),
  },
  {
    id: 'shortcuts',
    title: 'Keyboard shortcuts',
    content: (
      <>
        <p>Three shortcuts:</p>
        <ShortcutsTable />
      </>
    ),
  },
  {
    id: 'when',
    title: 'When to use it',
    content: (
      <>
        <p>Format when you need to read; minify when you need to ship.</p>
        <ul>
          <li>Making a minified API response readable before debugging against it.</li>
          <li>Checking whether a hand-edited config file is still valid JSON.</li>
          <li>Normalizing indentation before committing a JSON file to version control.</li>
          <li>Sorting keys to diff two JSON documents that differ only in key order.</li>
          <li>Minifying a payload before embedding it in a query string, env var, or fixture.</li>
        </ul>
        <p>If you mainly want to explore a deep structure rather than re-print it, the <Link href="/tools/json-tree">JSON Tree Viewer</Link> is the better fit.</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Indent</strong> &mdash; 2 spaces (default), 4 spaces, or a tab character per nesting level. Only shown in Format mode; Minify always produces a single line with no whitespace between tokens.</p>
        <p><strong>Sort keys A&rarr;Z</strong> &mdash; recursively sorts every object&apos;s keys alphabetically, at every nesting level, in both modes. Values and array order are untouched. Useful for stable diffs.</p>
        <p><strong>Escape non-ASCII</strong> &mdash; replaces every character above U+007E in the output with its <code>\uXXXX</code> escape. The result is pure ASCII and still parses to the exact same strings.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Big numbers lose precision.</strong> JavaScript parses JSON numbers as IEEE 754 doubles, so integers beyond 2<sup>53</sup>&minus;1 (like 64-bit IDs) get rounded, and long decimals may re-print differently. If exact digits matter, keep them as strings.</p>
        <p><strong>Duplicate keys collapse.</strong> JSON with the same key twice in one object is parsed by keeping only the last occurrence &mdash; the earlier value silently disappears from the output.</p>
        <p><strong>Trailing commas are invalid.</strong> <code>{'{"a": 1,}'}</code> is legal in JavaScript but not in JSON &mdash; the tool rejects it with an error. Same for single quotes and unquoted keys; convert loose JS-object syntax with the <Link href="/tools/json-js">JSON &harr; JS Converter</Link> first.</p>
        <p><strong>Comments are not JSON.</strong> <code>{'//'}</code> and <code>{'/* */'}</code> comments belong to JSONC/JSON5, not RFC 8259 JSON, and will fail validation here.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your JSON never leaves the page &mdash; no server, no logging, no analytics on the content.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'json formatter',
    'json validator',
    'format json online',
    'json beautifier',
    'json minifier',
    'pretty print json',
    'json pretty printer',
    'validate json online',
    'minify json',
    'json lint',
  ];

  const seoData = {
    title: 'JSON Formatter & Validator | WebDevData',
    description: 'Format, validate, and minify JSON online. Pretty-print with 2 or 4 spaces or tabs, sort keys, escape unicode, and catch syntax errors — all client-side.',
    name: 'JSON Formatter / Validator',
    subtitle: 'Format, validate, and minify JSON. Sort keys, escape unicode, clear parse errors. Client-side.',
    url: '/tools/json-formatter',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Format, validate, and minify JSON with key sorting and unicode escaping.',
    category: 'JSON Tools',
    subCategory: null,
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'JSON Formatter', href: '/tools/json-formatter' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'Format (pretty-print) with 2 spaces, 4 spaces, or tabs',
      'Minify to a single line',
      'Implicit validation with line and column on parse errors',
      'Recursive key sorting (A–Z)',
      'Escape non-ASCII characters as \\uXXXX',
      'File drop — load any JSON file',
      'Live stats: size delta, top-level count, nesting depth',
      'Copy and download output',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-24',
  };

  const calloutData = {
    highlight: 'Format, validate, and minify JSON.',
    text: 'Paste JSON, get clean output or a compact single line — errors show line and column. Nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('json-formatter', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'RFC 8259 (JSON)', href: 'https://datatracker.ietf.org/doc/html/rfc8259', meta: 'JSON specification' },
      { label: 'JSON.parse()', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse', meta: 'MDN — parse JSON string' },
      { label: 'JSON.stringify()', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify', meta: 'MDN — serialize to JSON' },
      { label: 'json.org', href: 'https://www.json.org/json-en.html', meta: 'JSON grammar reference' },
      { label: 'Related tool', href: '/tools/json-tree', meta: 'Interactive JSON tree viewer' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'Is my JSON uploaded anywhere?',
      answer: 'No. Parsing, formatting, and minifying all happen in your browser with the native JSON engine. The input never leaves the page — no server, no logging.',
    },
    q2: {
      question: 'What is the difference between Format and Minify?',
      answer: 'Both parse your JSON and re-print it. Format adds indentation and line breaks for readability; Minify strips all insignificant whitespace into a single line for the smallest size. The data is identical either way.',
    },
    q3: {
      question: 'Why did my large numbers change?',
      answer: 'JavaScript stores JSON numbers as IEEE 754 double-precision floats. Integers above 9007199254740991 (2^53 − 1) cannot be represented exactly and get rounded. Keep 64-bit IDs and high-precision decimals as strings if the exact digits matter.',
    },
    q4: {
      question: 'Does key order matter in JSON?',
      answer: 'Per RFC 8259, object member order carries no meaning and parsers are free to ignore it. That is why the Sort keys option is safe: sorted output is semantically identical, and it makes diffs between documents stable.',
    },
    q5: {
      question: 'Is there a maximum input size?',
      answer: 'No hard limit — it depends on your browser’s memory. Documents up to a few megabytes format instantly; very large files (tens of MB) may take a moment or hit browser string limits.',
    },
    q6: {
      question: 'Why is my JSON with comments or trailing commas rejected?',
      answer: 'Comments and trailing commas belong to JSONC and JSON5, not standard JSON. This tool validates against strict RFC 8259 JSON via JSON.parse. Convert loose JS-object syntax with the JSON ↔ JS Converter first.',
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

// ── Page function ────────────────────────────────────────

export default function JsonFormatterPage({
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
        <JsonFormatterTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}
