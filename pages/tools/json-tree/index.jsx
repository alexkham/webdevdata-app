// pages/tools/json-tree.jsx — v2
// Renamed from json-tree-viewer. Diff vs v1: slug is /tools/json-tree (no "-viewer").

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import JsonTreeViewerTool from '@/app/components/tools/JsonTreeViewerTool';
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
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">Enter</Kbd>], desc: 'Copy the formatted JSON to clipboard' },
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
        <p>Paste JSON into the left pane. The tree appears on the right as you type (200ms debounce).</p>
        <p>Click any object or array node to expand or collapse it. Use the two arrow buttons in the top-right to expand or collapse the whole tree. Type in the <strong>Search</strong> box to highlight matching keys and values and dim everything else.</p>
        <p>Copy the whole tree as formatted JSON via the <strong>Copy</strong> button, or download as <code>data.json</code>.</p>
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
        <p>Tree view beats reading raw JSON when the structure is deep, wide, or unfamiliar.</p>
        <ul>
          <li>Exploring an API response before writing code against it.</li>
          <li>Inspecting a config file with many nested sections.</li>
          <li>Debugging a data payload where you need to spot a specific value fast.</li>
          <li>Comparing shape between two responses without eyeballing indentation.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Search</strong> &mdash; type in any key or value fragment. Matching nodes are highlighted, non-matching subtrees dim to 25% opacity. Empty search restores full view.</p>
        <p><strong>Expand all</strong> &mdash; opens every object and array in the tree.</p>
        <p><strong>Collapse all</strong> &mdash; folds everything back down to the root.</p>
        <p>Individual node clicks always work — regardless of the expand/collapse-all state.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Node paths are collision-free.</strong> A key named <code>id</code> inside <code>users[0]</code> and another <code>id</code> inside <code>orders[3]</code> track independently — this tool uses full paths like <code>root.users.0.id</code>, not just key names.</p>
        <p><strong>Very large inputs may lag.</strong> The parse is debounced 200ms, but rendering a huge tree (tens of thousands of nodes) still takes work. For massive structures, collapse before searching.</p>
        <p><strong>Strict JSON only.</strong> The tool uses <code>JSON.parse</code>, so trailing commas, comments, and unquoted keys are rejected. If your input is loose JS-object syntax, run it through <a href="/tools/json-js">JSON &harr; JS Converter</a> first.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your JSON never leaves the page — no server, no logging, no analytics on the content.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'json tree viewer',
    'json viewer',
    'json tree',
    'view json',
    'json explorer',
    'json navigator',
    'json inspector',
    'json parser online',
  ];

  const seoData = {
    title: 'JSON Tree Viewer | WebDevData',
    description: 'Interactive JSON tree viewer with live parse, search, expand/collapse-all, and type-colored values. Client-side.',
    name: 'JSON Tree Viewer',
    subtitle: 'Live parse. Search across keys and values. Expand or collapse the whole tree. Client-side.',
    url: '/tools/json-tree',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Interactive tree view for JSON with search and expand controls.',
    category: 'JSON Tools',
    subCategory: null,
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'JSON Tree', href: '/tools/json-tree' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'Live JSON parse (debounced)',
      'Collapsible hierarchical tree',
      'Path-based node identity (no key collisions)',
      'Search across keys and values with highlighting',
      'Expand-all / Collapse-all controls',
      'Type-colored values (string, number, boolean, null)',
      'Copy formatted JSON to clipboard',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'Interactive tree view for JSON.',
    text: 'Paste JSON, get a live tree with search and expand controls. Nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('json-tree', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'RFC 8259 (JSON)', href: 'https://datatracker.ietf.org/doc/html/rfc8259', meta: 'JSON specification' },
      { label: 'JSON.parse()', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse', meta: 'MDN — parse JSON string' },
      { label: 'JSON.stringify()', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify', meta: 'MDN — serialize to JSON' },
      { label: 'Related tool', href: '/tools/json-js', meta: 'JSON ↔ JS object converter' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What is a JSON tree viewer?',
      answer: 'A tool that renders JSON as a collapsible hierarchical tree instead of raw text. It makes deep or wide structures easier to explore, search, and understand.',
    },
    q2: {
      question: 'Does it work on huge JSON files?',
      answer: 'It handles typical API responses and configs comfortably. Very large payloads (tens of thousands of nodes) may lag on expand-all — keep sections collapsed while searching.',
    },
    q3: {
      question: 'Can I use unquoted keys or trailing commas?',
      answer: 'No. This tool uses strict JSON.parse. For loose JS-object input, run it through the JSON ↔ JS Converter first.',
    },
    q4: {
      question: 'What does Search actually do?',
      answer: 'Any node whose key or primitive value contains your search text is highlighted. Non-matching subtrees dim. Full-text search over keys and values, case-insensitive.',
    },
    q5: {
      question: 'Does Copy copy the tree or the JSON?',
      answer: 'The parsed JSON, re-formatted with 2-space indentation. If you want the original input verbatim, copy it from the input pane.',
    },
    q6: {
      question: 'Does the tool send my data anywhere?',
      answer: 'No. All parsing and rendering happens in your browser. The input never leaves the page.',
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

export default function JsonTreePage({
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
        <JsonTreeViewerTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
        />
      </ToolFrame>
    </>
  );
}