// pages/tools/url-encoder/index.jsx — v1
// URL encoder / decoder page.

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import UrlEncoderTool from '@/app/components/tools/UrlEncoderTool';
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
        <p>Pick a direction with the tabs — <strong>Encode</strong> or <strong>Decode</strong>. Paste your input on the left. The output appears on the right as you type.</p>
        <p>Choose the right encoding mode: <em>Component</em> for a single query value or path segment, <em>URI</em> for a full URL where you want to keep <code>: / ? # &amp;</code> etc. intact, or <em>Form</em> for form-post bodies (spaces become <code>+</code>).</p>
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
        <p>URL encoding is required whenever text goes into a URL and might contain characters URLs treat specially.</p>
        <ul>
          <li>Building a query string from arbitrary user input.</li>
          <li>Encoding a redirect target passed as a query parameter.</li>
          <li>Escaping a filename or path segment that might contain spaces or special chars.</li>
          <li>Decoding a URL you received in a log or an email — <code>%20</code> back to space, <code>%3F</code> back to <code>?</code>.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Component</strong> — <code>encodeURIComponent</code>. Escapes everything reserved. Use for a single query value or path segment. This is what you want 90% of the time.</p>
        <p><strong>URI</strong> — <code>encodeURI</code>. Preserves URL-structural characters (<code>: / ? # [ ] @ ! $ &amp; &apos; ( ) * + , ; =</code>). Use when the input is a whole URL you want to escape without breaking its structure.</p>
        <p><strong>Form</strong> — <code>application/x-www-form-urlencoded</code>. Same as Component but spaces become <code>+</code>. Use for form-post bodies.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Component and URI differ where it matters.</strong> Given <code>a=b&amp;c=d</code>, <em>Component</em> escapes <code>&amp;</code> and <code>=</code> (making the whole string one value); <em>URI</em> preserves them. Pick based on what your string represents.</p>
        <p><strong>Form uses <code>+</code> for space, not <code>%20</code>.</strong> Server-side decoders differ — some (application/x-www-form-urlencoded parsers) accept both; some (path decoders) treat <code>+</code> as a literal plus. Match the encoding mode to the target.</p>
        <p><strong>Decode fails on malformed input.</strong> A lone <code>%</code> or an incomplete escape like <code>%2</code> throws a <code>URIError</code>. The tool surfaces the message.</p>
        <p><strong>Non-ASCII becomes UTF-8 bytes.</strong> <code>é</code> encodes to <code>%C3%A9</code>, not <code>%E9</code>. Legacy Latin-1 systems will misread it.</p>
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
    'url encoder',
    'url decoder',
    'url encode',
    'url decode',
    'percent encoding',
    'encodeuricomponent',
    'decode url online',
    'urlencode',
  ];

  const seoData = {
    title: 'URL Encoder / Decoder | WebDevData',
    description: 'Encode or decode URL text in your browser. Three modes: component, full URI, and form-urlencoded. Live output.',
    name: 'URL Encoder / Decoder',
    subtitle: 'Percent-encode text for URLs, or decode it back. Component, URI, or form-encoded — pick the right mode.',
    url: '/tools/url-encoder',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Encode text or URLs for safe transport, or decode percent-encoded input.',
    category: 'Encoders',
    subCategory: null,
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'URL Encoder', href: '/tools/url-encoder' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'URL component encoding (encodeURIComponent)',
      'Full URI encoding (encodeURI) — preserves structure',
      'Form-urlencoded (spaces as +)',
      'Live output',
      'Handles UTF-8 correctly',
      'Keyboard shortcuts',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'URL encoding, both directions.',
    text: 'Encode text for safe URL transport, or decode percent-escaped input. Three modes for different contexts.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('url-encoder', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'RFC 3986 (URI)', href: 'https://datatracker.ietf.org/doc/html/rfc3986', meta: 'URI generic syntax' },
      { label: 'encodeURIComponent()', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent', meta: 'MDN — component encoding' },
      { label: 'encodeURI()', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI', meta: 'MDN — full URI encoding' },
      { label: 'application/x-www-form-urlencoded', href: 'https://url.spec.whatwg.org/#application/x-www-form-urlencoded', meta: 'WHATWG URL spec' },
      { label: 'Related tool', href: '/tools/html-encoder', meta: 'HTML entity encoder / decoder' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What is URL encoding?',
      answer: 'A scheme for representing characters that are not URL-safe as percent-escapes: %20 for space, %3F for ?, and so on. Required because URLs can only carry a limited ASCII subset.',
    },
    q2: {
      question: 'Component vs URI mode — which do I pick?',
      answer: 'Component (encodeURIComponent) escapes everything reserved — use it for a single query value or path segment. URI (encodeURI) preserves URL structure characters like /, ?, #, & — use it when the input is a full URL you want to escape without breaking it.',
    },
    q3: {
      question: 'Why does Form mode use + for spaces?',
      answer: 'Historical convention from HTML form submission. application/x-www-form-urlencoded bodies use + for space and %20 for a literal plus. Query-string decoders in most languages accept both; path decoders often do not.',
    },
    q4: {
      question: 'What does %C3%A9 mean?',
      answer: 'UTF-8 percent-encoding for é. Modern URL encoders always output UTF-8 byte sequences. Legacy Latin-1 systems would encode é as %E9 — this tool always uses UTF-8.',
    },
    q5: {
      question: 'Why did Decode throw a URIError?',
      answer: 'Input contains a malformed percent-escape — a lone % without two hex digits after it, or a hex sequence that would produce invalid UTF-8. Fix the input or ask where it came from.',
    },
    q6: {
      question: 'Does the tool send my text anywhere?',
      answer: 'No. All encoding and decoding happens in your browser. The input never leaves the page.',
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

export default function UrlEncoderPage({
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
        <UrlEncoderTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}