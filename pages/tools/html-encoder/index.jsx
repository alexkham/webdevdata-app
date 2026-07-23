// pages/tools/html-encoder/index.jsx — v1
// HTML entity encoder / decoder. Merges old html-encoder (256 impr) + html-entities (38 impr).

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import HtmlEncoderTool from '@/app/components/tools/HtmlEncoderTool';
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
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">/</Kbd>], desc: 'Toggle between Encode and Decode' },
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
        <p>Pick a direction with the tabs — <strong>Encode</strong> or <strong>Decode</strong>. Paste your input into the left pane. The output appears on the right as you type.</p>
        <p>Encode mode always converts the five special characters (<code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&quot;</code>, <code>&apos;</code>). Turn on <strong>Encode non-ASCII</strong> to also convert characters above 127 — accented letters, symbols, currency signs — using your chosen style (named, decimal, or hex).</p>
        <p>Decode mode handles every entity the browser knows: named (<code>&amp;copy;</code>), decimal (<code>&amp;#169;</code>), and hex (<code>&amp;#xA9;</code>).</p>
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
        <p>Encoding matters whenever text goes into an HTML page and the text contains characters HTML treats specially.</p>
        <ul>
          <li>Displaying code snippets inside HTML without them being interpreted as markup.</li>
          <li>Preventing XSS by escaping user input before rendering it.</li>
          <li>Ensuring special characters like <code>&amp;</code> in URLs or query strings render correctly.</li>
          <li>Making non-ASCII content robust across systems with limited encoding support.</li>
        </ul>
        <p>Decoding matters when you receive HTML-encoded content and need the original text back — from an API, a legacy database column, or a scraped page.</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Encode non-ASCII</strong> (Encode mode) &mdash; when off, only the five special characters get encoded. When on, everything above ASCII 127 also gets converted to an entity.</p>
        <p><strong>Style</strong> (Encode mode, only when non-ASCII is on):</p>
        <ul>
          <li><em>Named</em> &mdash; uses readable names like <code>&amp;copy;</code>, <code>&amp;euro;</code>, <code>&amp;mdash;</code> for common characters. Falls back to decimal for anything without a named entity.</li>
          <li><em>Decimal</em> &mdash; numeric like <code>&amp;#169;</code>. Universal, always works.</li>
          <li><em>Hex</em> &mdash; numeric hex like <code>&amp;#xA9;</code>. Common in generated markup.</li>
        </ul>
        <p><strong>Decode</strong> has no options &mdash; the browser&apos;s HTML parser handles every entity type.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Only five chars are dangerous.</strong> For preventing HTML injection, encoding just <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&quot;</code>, and <code>&apos;</code> is enough. Encoding non-ASCII is a display/portability choice, not a security one.</p>
        <p><strong>Order of the basic 5 matters.</strong> Ampersand must be encoded first, otherwise you double-encode. This tool handles that.</p>
        <p><strong>Decoding uses the browser DOM.</strong> That means it accepts loose HTML too — an unterminated entity like <code>&amp;copy</code> without the semicolon still decodes in many browsers. Result may vary by browser.</p>
        <p><strong>Emoji are supra-BMP.</strong> Modern browsers handle them fine as decimal or hex entities (<code>&amp;#128512;</code>), but named entities don&apos;t exist for them.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your text never leaves the page — no server, no logging, no analytics on the content.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'html encoder',
    'html decoder',
    'html entities',
    'html entity converter',
    'html escape',
    'html unescape',
    'encode html',
    'decode html entities',
  ];

  const seoData = {
    title: 'HTML Encoder / Decoder | WebDevData',
    description: 'Encode and decode HTML entities in your browser. Handles the five special characters plus optional non-ASCII (named, decimal, or hex).',
    name: 'HTML Encoder / Decoder',
    subtitle: 'Encode special characters to HTML entities and back. Live output. Client-side.',
    url: '/tools/html-encoder',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Encode text to HTML entities, or decode entities back to text.',
    category: 'Encoders',
    subCategory: null,
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'HTML Encoder', href: '/tools/html-encoder' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'HTML entity encoding of the five special characters',
      'Optional non-ASCII encoding',
      'Named, decimal, or hex entity style',
      'Decoding of named, decimal, and hex entities via browser parser',
      'Live output',
      'Keyboard shortcuts',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'HTML entities, both directions.',
    text: 'Encode text into HTML entities, or decode entities back into text. All in your browser.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('html-encoder', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'HTML entity reference', href: 'https://developer.mozilla.org/en-US/docs/Glossary/Entity', meta: 'MDN — HTML entities glossary' },
      { label: 'Named character references', href: 'https://html.spec.whatwg.org/multipage/named-characters.html', meta: 'WHATWG — full HTML5 named entities' },
      { label: 'Numeric character references', href: 'https://www.w3.org/TR/html4/charset.html#h-5.3.1', meta: 'W3C — decimal / hex entities' },
      { label: 'Related tool', href: '/tools/url-encoder', meta: 'URL encoder / decoder' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What are HTML entities?',
      answer: 'Special sequences that represent characters that either have meaning in HTML (like &lt; for <) or that are hard to type. They start with & and end with ;. Three forms: named (&copy;), decimal (&#169;), and hex (&#xA9;).',
    },
    q2: {
      question: 'Do I need to encode non-ASCII characters?',
      answer: 'Not for security — only the five basic characters matter for preventing HTML injection. Encoding non-ASCII is useful when your target system has limited encoding support, or when you want the source file to stay pure ASCII.',
    },
    q3: {
      question: 'What is the difference between named, decimal, and hex entities?',
      answer: 'Named entities are readable shortcuts (&copy; for ©). Decimal uses the codepoint (&#169;). Hex uses the hex codepoint (&#xA9;). All produce the same character. Named is easier to read, numeric is universal.',
    },
    q4: {
      question: 'Does Decode handle every entity type?',
      answer: 'Yes. Decoding uses the browser HTML parser, so any entity the browser knows — named, decimal, hex, obscure ones — decodes correctly.',
    },
    q5: {
      question: 'Does the tool send my text anywhere?',
      answer: 'No. All encoding and decoding happens in your browser. The input never leaves the page.',
    },
    q6: {
      question: 'Will this protect me from XSS?',
      answer: 'Encoding user input before injecting it into HTML is one XSS defense. But context matters — attribute values, JS strings, and URLs need context-specific escaping too. Use a battle-tested library for production XSS prevention.',
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

export default function HtmlEncoderPage({
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
        <HtmlEncoderTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}