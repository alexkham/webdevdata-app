
// pages/base64.jsx  (v5)

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import Base64Tool from '@/app/components/tools/Base64Tool';
import { getSiblings } from '../../../utils/getSiblings';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';

// ─── Reference card component ────────────────────────────────

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

// ─── Kbd combo (small styled component for shortcut cells) ──

function Kbd({ children }) {
  const S = {
    display: 'inline-block',
    fontFamily: 'ui-monospace, Menlo, monospace',
    fontSize: 12,
    fontWeight: 600,
    padding: '2px 7px',
    background: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderBottom: '2px solid #94a3b8',
    borderRadius: 4,
    color: '#0f172a',
    margin: '0 1px',
    lineHeight: 1.2,
  };
  return <kbd style={S}>{children}</kbd>;
}

// ─── Shortcuts table (rendered inside the shortcuts section) ──

function ShortcutsTable() {
  const TABLE = { borderCollapse: 'collapse', width: '100%', maxWidth: 640, margin: '10px 0 4px' };
  const TH    = { textAlign: 'left', padding: '10px 14px', borderBottom: '2px solid #cfd6e0', color: '#334155', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: '#f2f6fd' };
  const TD    = { padding: '10px 14px', borderBottom: '1px solid #e4e4e7', color: '#475569', fontSize: 14, verticalAlign: 'middle' };
  const TD_KBD = { ...TD, whiteSpace: 'nowrap' };
  const rows = [
    { keys: <><Kbd>⌘</Kbd> <Kbd>K</Kbd>  <span style={{ color: '#94a3b8', margin: '0 4px' }}>/</span>  <Kbd>Ctrl</Kbd> <Kbd>K</Kbd></>,
      action: 'Focus the input pane' },
    { keys: <><Kbd>⌘</Kbd> <Kbd>Enter</Kbd>  <span style={{ color: '#94a3b8', margin: '0 4px' }}>/</span>  <Kbd>Ctrl</Kbd> <Kbd>Enter</Kbd></>,
      action: 'Copy output to clipboard' },
    { keys: <><Kbd>⌘</Kbd> <Kbd>/</Kbd>  <span style={{ color: '#94a3b8', margin: '0 4px' }}>/</span>  <Kbd>Ctrl</Kbd> <Kbd>/</Kbd></>,
      action: 'Toggle between Encode and Decode' },
  ];
  return (
    <table style={TABLE}>
      <thead>
        <tr>
          <th style={TH}>Shortcut</th>
          <th style={TH}>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={TD_KBD}>{r.keys}</td>
            <td style={TD}>{r.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Below-fold sections ─────────────────────────────────────

const SECTIONS = [
  {
    id: 'how',
    title: 'How to use',
    content: (
      <>
        <p>Choose <strong>Encode</strong> to convert text into Base64, or <strong>Decode</strong> to reverse a Base64 string back into text. The output pane updates instantly as you type.</p>
        <p>Click <strong>Copy</strong> in the output header to copy the result to your clipboard, or <strong>Download</strong> to save it as a text file. <strong>Reset</strong> clears everything.</p>
      </>
    ),
  },
  {
    id: 'shortcuts',
    title: 'Keyboard shortcuts',
    content: (
      <>
        <p>Common actions are bound to keyboard shortcuts. They work anywhere on this page while the tool is loaded.</p>
        <ShortcutsTable />
      </>
    ),
  },
  {
    id: 'when',
    title: 'When to use Base64',
    content: (
      <>
        <p>Base64 is a text-safe representation of binary data. Common uses include:</p>
        <ul>
          <li>Embedding binary data in JSON, XML, or URL parameters</li>
          <li>HTTP Basic Authentication headers</li>
          <li>Data URIs for inline images, fonts, or SVG</li>
          <li>Email attachments (MIME)</li>
          <li>Storing credentials or tokens in text-only environments</li>
        </ul>
        <p><strong>Not for confidentiality.</strong> Base64 is encoding, not encryption. Anyone can decode it. Never use it as a way to hide sensitive data.</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>URL-safe:</strong> replaces <code>+</code> with <code>-</code> and <code>/</code> with <code>_</code>. Use this for Base64 that will appear in URLs or JWTs.</p>
        <p><strong>Strip padding:</strong> removes trailing <code>=</code> characters. Padding is optional in some contexts and decoders will typically accept both.</p>
        <p><strong>Line-wrap 76:</strong> wraps the output at 76 characters per line. Required for MIME (email) format.</p>
        <p><strong>Text encoding:</strong> how your text is converted to bytes before encoding. UTF-8 is the modern standard and correct in almost every case. Legacy systems may use Latin-1 or UTF-16.</p>
      </>
    ),
  },
  {
    id: 'utf8',
    title: 'Unicode and UTF-8',
    content: (
      <>
        <p>This tool encodes and decodes UTF-8 correctly. Emoji, Cyrillic, Chinese, Arabic &mdash; all handled as bytes rather than as characters.</p>
        <p>The native browser functions <code>btoa</code> and <code>atob</code> only handle Latin-1 and will fail on characters outside that range. This tool wraps them with proper UTF-8 conversion, so any Unicode string round-trips correctly.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <>
        <p>Everything runs in your browser. No input, output, or metadata is sent to any server. The page works offline once loaded.</p>
      </>
    ),
  },
];

// ─── FAQ block ───────────────────────────────────────────────

function FAQBlock({ questions }) {
  const items = Object.values(questions).filter((q) => q.question && q.answer);
  if (!items.length) return null;
  return (
    <>
      {items.map((q, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{q.question}</p>
          <p style={{ color: '#475569', margin: 0 }}>{q.answer}</p>
        </div>
      ))}
    </>
  );
}

// ─── getStaticProps ──────────────────────────────────────────

export async function getStaticProps() {


  

  const keyWords = [
    'base64 encoder',
    'base64 decoder',
    'base64 online',
    'encode base64',
    'decode base64',
    'base64 to text',
    'text to base64',
    'base64 converter',
    'utf-8 base64',
    'base64 tool',
  ];

  const seoData = {
    title:       'Base64 Encoder & Decoder | WebDevData',
    description: 'Fast Base64 encoder and decoder. UTF-8 safe, runs entirely in your browser, no data sent to any server. Copy to clipboard, works offline.',
    name:        'Base64 Encoder / Decoder',
    subtitle:    'Encode and decode Base64 strings. UTF-8 safe, entirely client-side.',
    url:         '/tools/base64',
    keywords:    keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,

    hubDescription: 'Encode and decode Base64 with proper UTF-8 handling.',
    category:       'Encoders',
    subCategory:    null,

    breadcrumb: [
      { label: 'Home',     href: '/' },
      { label: 'Tools',    href: '/tools' },
      { label: 'Encoders', href: '/tools/encoders' },
      { label: 'Base64',   href: '/base64' },
    ],

    applicationCategory: 'DeveloperApplication',
    featureList: [
      'Encode text to Base64',
      'Decode Base64 to text',
      'UTF-8 safe (Unicode, emoji, non-Latin scripts)',
      'URL-safe, padding, and MIME line-wrap options',
      'File drop to encode any file',
      'One-click copy and download',
      'Keyboard shortcuts for common actions',
      'Client-side only — no server round-trip',
    ],
    datePublished: '2026-07-19',
  };

  const calloutData = {
    highlight: 'Everything runs in your browser.',
    text:      'Nothing is sent to any server. Works offline once the page loads.',
    jumps: [
      { to: 'how',       label: 'How to use \u2193' },
      { to: 'shortcuts', label: 'Shortcuts \u2193' },
    ],
  };

  // Siblings discovered from the filesystem at build time.
//   const siblings = getSiblings('test4' );
// console.log('SIBLINGS:', siblings);

 const siblings =getSiblings('base64', 'tools', { exclude: ['about', 'privacy-policy', 'terms-and-conditions', 'disclaimer', 'cookie-policy'] })
// getSiblings('test4', '', { mode: 'children' })
// getSiblings('base64', 'tools', { mode: 'children', exclude: ['old-tool'] })

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'RFC 4648',      href: 'https://datatracker.ietf.org/doc/html/rfc4648',                meta: 'Base64 specification' },
      { label: 'window.btoa()', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa', meta: 'MDN — Latin-1 encode' },
      { label: 'window.atob()', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/atob', meta: 'MDN — Latin-1 decode' },
      { label: 'Data URLs',     href: 'https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/data', meta: 'MDN — data: scheme' },
    ],
  };

  const faqQuestions = {
    obj1: {
      question: 'Is Base64 the same as encryption?',
      answer:   'No. Base64 is encoding — a reversible representation of bytes as text. Anyone who receives a Base64 string can decode it without a key. Never use Base64 to hide sensitive data.',
    },
    obj2: {
      question: 'Why does my Base64 string end with = or ==?',
      answer:   'The equals signs are padding. Base64 encodes in 3-byte groups; when the input length is not a multiple of 3, one or two = characters are appended so the output length is always a multiple of 4.',
    },
    obj3: {
      question: 'Can I encode binary files with this tool?',
      answer:   'Yes. Drag a file onto the drop zone or click it to browse. The file is read as bytes and encoded directly. All processing happens in your browser.',
    },
    obj4: {
      question: 'Why does my Unicode text encode differently than in other tools?',
      answer:   'This tool uses UTF-8 as the byte representation before encoding, which is the modern standard. Some older tools use Latin-1 or UTF-16 and produce different Base64. UTF-8 is what you want in almost every real-world case.',
    },
    obj5: {
      question: 'Is my data sent anywhere?',
      answer:   'No. All encoding and decoding happens in your browser using native JavaScript APIs. Nothing is transmitted, logged, or stored server-side.',
    },
  };

  const frameOptions = {
    layout:         'classic',
    theme:          'light',
    initialSidebar: 'folded',
  };

  const toolOptions = {
    theme:                 frameOptions.theme,
    showExplanations:      false,
    showOrientationToggle: true,
    initialOrientation:    'horizontal',
  };

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
      offers:              { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList:         seoData.featureList,
      author:              { '@type': 'Organization', name: SITE_NAME },
      datePublished:       seoData.datePublished,
      dateModified:        new Date().toISOString(),
      inLanguage:          'en-US',
      isAccessibleForFree: true,
      keywords:            seoData.keywords,
    },
    breadcrumb: {
      '@context':       'https://schema.org',
      '@type':          'BreadcrumbList',
      itemListElement:  seoData.breadcrumb.map((crumb, i) => ({
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
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
    },
  };

  return {
    props: {
      seoData,
      calloutData,
      siblings,
      referenceData,
      faqQuestions,
      schemas,
      frameOptions,
      toolOptions,
    },
  };
}

// ─── Page function ──────────────────────────────────────────

export default function Base64Page({
  seoData,
  calloutData,
  siblings,
  referenceData,
  faqQuestions,
  schemas,
  frameOptions,
  toolOptions,
}) {

  const canonical = seoData.canonicalOverride
    ? `${SITE_URL}${seoData.canonicalOverride}`
    : `${SITE_URL}${seoData.url}`;

  const ogImage = seoData.ogImagePath
    ? `${SITE_URL}${seoData.ogImagePath}`
    : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  const callout = calloutData.text
    ? {
        text: (
          <>
            {calloutData.highlight && <><strong>{calloutData.highlight}</strong>{' '}</>}
            {calloutData.text}
          </>
        ),
        jumps: calloutData.jumps,
      }
    : null;

  const sections = [
    ...SECTIONS,
    {
      id:      'faq',
      title:   'Frequently asked questions',
      content: <FAQBlock questions={faqQuestions} />,
    },
  ];

  const referencePanel = (referenceData && referenceData.items && referenceData.items.length)
    ? <ReferenceCard heading={referenceData.heading} items={referenceData.items} />
    : null;

  return (
    <>
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

      <ToolFrame
        layout={frameOptions.layout}
        theme={frameOptions.theme}
        initialSidebar={frameOptions.initialSidebar}
        siblings={siblings}
        callout={callout}
        sections={sections}
        referencePanel={referencePanel}
      >
        <Base64Tool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>

    </>
  );
}