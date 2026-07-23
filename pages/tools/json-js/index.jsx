// pages/json-to-js.jsx — v1
// JSON <-> JS object converter page.
// Follows tool-page-guide.md.

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import JsonToJsTool from '@/app/components/tools/JsonToJsTool';
import { getSiblings } from '../../../utils/getSiblings';

// ── Site constants ───────────────────────────────────────
const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';

// ── Helper components (module scope, JSX, non-serializable) ──

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
              target="_blank"
              rel="noopener noreferrer"
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
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">/</Kbd>], desc: 'Toggle between JSON→JS and JS→JSON' },
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

// ── Below-fold sections (module scope) ────────────────────

const SECTIONS = [
  {
    id: 'how',
    title: 'How to use',
    content: (
      <>
        <p>Pick a direction with the tabs at the top &mdash; <strong>JSON &rarr; JS</strong> or <strong>JS &rarr; JSON</strong>. Paste your input into the left pane. The converted output appears on the right as you type.</p>
        <p>Use the options row to control indent size, quote style (JSON&rarr;JS only), whether to unquote object keys, add trailing commas, or prefix the output with <code>const data = </code>.</p>
        <p>Copy the output with the <strong>Copy</strong> button, or download it as a <code>.js</code> / <code>.json</code> file.</p>
      </>
    ),
  },
  {
    id: 'shortcuts',
    title: 'Keyboard shortcuts',
    content: (
      <>
        <p>Three shortcuts are wired on this tool:</p>
        <ShortcutsTable />
      </>
    ),
  },
  {
    id: 'when',
    title: 'When to use it',
    content: (
      <>
        <p>JSON is a strict data-interchange format. A JavaScript object literal is what you write in code. They look similar but differ in ways that matter:</p>
        <ul>
          <li>JSON requires double-quoted keys and strings. JS accepts unquoted keys and single quotes.</li>
          <li>JSON forbids trailing commas. JS allows them.</li>
          <li>JSON has no comments. JS does.</li>
          <li>JSON only supports strings, numbers, booleans, null, arrays, and objects. JS has <code>undefined</code>, functions, dates, and more.</li>
        </ul>
        <p>Convert <strong>JSON &rarr; JS</strong> when you want to paste API response data straight into your source as a literal. Convert <strong>JS &rarr; JSON</strong> when you have a JS object literal (from a config file, a mock, a snippet) and need valid JSON to send over the wire or drop into a <code>.json</code> file.</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Indent</strong> &mdash; 2 spaces (default), 4 spaces, or a tab character.</p>
        <p><strong>Quotes</strong> (JSON&rarr;JS only) &mdash; single quotes (JS convention) or double quotes. Strings and unquotable keys use the chosen style.</p>
        <p><strong>Unquote keys</strong> (JSON&rarr;JS only) &mdash; strips quotes from keys that are valid JS identifiers. Keys with spaces, digits at the start, dashes, or reserved words stay quoted. This produces valid JS.</p>
        <p><strong>Trailing commas</strong> (JSON&rarr;JS only) &mdash; adds a comma after the last item in objects and arrays. Legal in JS, invalid in JSON.</p>
        <p><strong><code>const</code> prefix</strong> (JSON&rarr;JS only) &mdash; wraps the output as <code>const data = &#123;...&#125;;</code> so it&apos;s a full statement.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Not every key can be unquoted.</strong> A key like <code>&quot;first name&quot;</code>, <code>&quot;123id&quot;</code>, or <code>&quot;class&quot;</code> (a reserved word) must stay quoted to be valid JS. The tool handles this automatically &mdash; it only unquotes keys that match <code>/^[A-Za-z_$][A-Za-z0-9_$]*/</code> and aren&apos;t reserved words.</p>
        <p><strong>JS-only values are rejected on JS &rarr; JSON.</strong> <code>undefined</code>, functions, <code>NaN</code>, and <code>Infinity</code> aren&apos;t valid JSON. The tool surfaces a clear error rather than producing broken output.</p>
        <p><strong>Comments are stripped.</strong> On JS &rarr; JSON, both <code>//</code> and <code>/* ... */</code> comments are stripped before parsing. The output is comment-free.</p>
        <p><strong><code>const</code>/<code>let</code>/<code>var</code> declarations are unwrapped.</strong> Paste <code>const user = &#123;...&#125;</code> and the tool strips the declaration and semicolon before parsing the object literal.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your JSON and JS input never leave the page &mdash; no server, no logging, no analytics on the content.</p>
    ),
  },
];

// ── getStaticProps ────────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'json to javascript',
    'json to js object',
    'json to js converter',
    'javascript object to json',
    'js to json converter',
    'json parser',
    'unquote json keys',
  ];

  const seoData = {
    title: 'JSON &harr; JavaScript Object Converter | WebDevData',
    description: 'Convert JSON to a JavaScript object literal, or a JS object back to JSON. Client-side, keyboard-first, with quote and indent options.',
    name: 'JSON ↔ JavaScript Object Converter',
    subtitle: 'Both directions. Client-side. Handles unquotable keys, trailing commas, and comments correctly.',
    url: '/tools/json-js',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Convert JSON to JS object literals and back, with quote and indent control.',
    category: 'JSON Tools',
    subCategory: null,
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'JSON ↔ JS Object', href: '/json-to-js' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'JSON to JavaScript object literal conversion',
      'JavaScript object literal to JSON conversion',
      'Single or double quote output',
      'Optional key unquoting (identifier-safe)',
      'Trailing comma option',
      'Optional const prefix',
      'Handles comments in JS input',
      'Keyboard shortcuts',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'Both directions, in your browser.',
    text: 'Paste JSON to get a JS object literal, or paste a JS object to get valid JSON. Nothing is sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('json-to-js', '', {
    exclude: ['about', 'privacy-policy', 'terms-and-conditions', 'disclaimer', 'cookie-policy'],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'RFC 8259 (JSON)', href: 'https://datatracker.ietf.org/doc/html/rfc8259', meta: 'JSON specification' },
      { label: 'JSON.parse()', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse', meta: 'MDN &mdash; parse JSON string' },
      { label: 'JSON.stringify()', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify', meta: 'MDN &mdash; serialize to JSON' },
      { label: 'Object literals', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#object_literals', meta: 'MDN &mdash; JS object literal grammar' },
      { label: 'Lexical grammar', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar', meta: 'MDN &mdash; identifiers and reserved words' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What is the difference between JSON and a JavaScript object?',
      answer: 'JSON is a strict text format for data exchange. A JavaScript object is a runtime value in JS code. JSON requires double-quoted keys and strings, forbids trailing commas and comments, and only supports six data types. JS object literals are more permissive: unquoted keys, single or double quotes, trailing commas, comments, and richer types including functions and undefined.',
    },
    q2: {
      question: 'Why did my keys stay quoted after conversion?',
      answer: 'Only keys that are valid JavaScript identifiers get unquoted. Keys with spaces, dashes, digits at the start, or reserved words like class or default must stay quoted to produce valid JavaScript.',
    },
    q3: {
      question: 'Does the tool send my data anywhere?',
      answer: 'No. All conversion happens in your browser. The input never leaves the page.',
    },
    q4: {
      question: 'Can I paste a full const declaration?',
      answer: 'Yes. On JS to JSON, a leading const/let/var declaration and trailing semicolon are stripped before parsing.',
    },
    q5: {
      question: 'What happens if my JS object has a function or undefined?',
      answer: 'Those are not valid JSON. The tool rejects them with a clear error rather than producing broken output.',
    },
    q6: {
      question: 'Does it handle comments in JS input?',
      answer: 'Yes. Both single-line // and block /* ... */ comments are stripped before parsing.',
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

  // Schemas built from source data.
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

// ── Page function ─────────────────────────────────────────

export default function JsonToJsPage({
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
        <JsonToJsTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}