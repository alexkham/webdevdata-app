// pages/tools/uuid-generator/index.jsx — v1

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import UuidGeneratorTool from '@/app/components/tools/UuidGeneratorTool';
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
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">R</Kbd>], desc: 'Regenerate the batch' },
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">Enter</Kbd>], desc: 'Copy all IDs to clipboard' },
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
        <p>Pick a format with the tabs — <strong>UUID v4</strong>, <strong>UUID v7</strong>, or <strong>ULID</strong>. Set how many to generate at once. IDs appear immediately; hit <strong>Regenerate</strong> for a new batch.</p>
        <p>Toggle uppercase, hyphens, or braces to match your target system&apos;s convention. Copy all with one click, or download as a text file.</p>
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
    title: 'When to use which',
    content: (
      <>
        <p><strong>UUID v4</strong> — the default when you want a random ID with no coordination. Distributed systems, session tokens, request IDs, one-off things where order doesn&apos;t matter.</p>
        <p><strong>UUID v7</strong> — when the ID becomes a database primary key. The first 48 bits are a timestamp, so B-tree indexes stay compact. Same 128 bits as v4, same collision-safe randomness, but sortable.</p>
        <p><strong>ULID</strong> — when you want v7&apos;s time-ordering but shorter (26 chars vs 36) and URL-safe (no hyphens, Crockford base-32 skips ambiguous characters like <code>0</code>/<code>O</code>).</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Count</strong> — 1, 10, 100, or 1000 IDs per batch.</p>
        <p><strong>Uppercase</strong> — <code>ABC-123</code> vs <code>abc-123</code>. ULIDs default to uppercase; UUIDs default to lowercase per RFC 4122.</p>
        <p><strong>Hyphens</strong> (UUID only) — with hyphens (<code>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>) or without.</p>
        <p><strong>Braces</strong> — wraps each ID in <code>&#123; &#125;</code>. Standard in some Microsoft contexts.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Not all databases support UUID v7 natively.</strong> Postgres, MySQL, SQLite can store it as text or bytea; some ORMs may not parse the version bits correctly. Test before you commit to it as a primary key type.</p>
        <p><strong>ULID lexicographic order.</strong> ULIDs sort correctly as strings — that&apos;s the whole point. UUID v7 requires binary sort for correct ordering; string sort mostly works because the hex is right-padded per byte, but be aware.</p>
        <p><strong>Collision risk is essentially zero.</strong> Both UUID v4 (122 bits of randomness) and ULID (80 bits of randomness within one ms) have negligible collision probability at real-world scale.</p>
        <p><strong>Uses cryptographic randomness.</strong> <code>crypto.randomUUID()</code> and <code>crypto.getRandomValues()</code> under the hood — safe for tokens and IDs where guessability matters. Not <code>Math.random()</code>.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. No server involved. IDs are generated by your browser&apos;s cryptographic random number generator.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'uuid generator',
    'uuid v4 generator',
    'uuid v7 generator',
    'ulid generator',
    'generate uuid',
    'guid generator',
    'random id generator',
  ];

  const seoData = {
    title: 'UUID / ULID Generator | WebDevData',
    description: 'Generate UUID v4, UUID v7, or ULID identifiers in bulk. Cryptographically secure, client-side. Copy all or download.',
    name: 'UUID / ULID Generator',
    subtitle: 'v4 random, v7 time-ordered, or ULID. Bulk generate 1 to 1000. Copy or download.',
    url: '/tools/uuid-generator',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Bulk-generate UUIDs (v4, v7) or ULIDs.',
    category: 'Tools',
    subCategory: 'Generators',
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'UUID Generator', href: '/tools/uuid-generator' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'UUID v4 (random) generation',
      'UUID v7 (time-ordered) generation',
      'ULID generation (26-char, time-sortable)',
      'Bulk generate 1 / 10 / 100 / 1000 at once',
      'Uppercase, hyphens, and braces formatting options',
      'Copy all or download as .txt',
      'Cryptographically secure (crypto.getRandomValues)',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-22',
  };

  const calloutData = {
    highlight: 'UUIDs and ULIDs, generated in your browser.',
    text: 'Bulk generate v4, v7, or ULID. Cryptographically secure — no server, no logging.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'when', label: 'When to use which ↓' },
    ],
  };

  const siblings = getSiblings('uuid-generator', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'RFC 9562 (UUIDs)', href: 'https://datatracker.ietf.org/doc/html/rfc9562', meta: 'UUID v1–v8 specification' },
      { label: 'ULID spec', href: 'https://github.com/ulid/spec', meta: 'ULID canonical spec' },
      { label: 'crypto.randomUUID()', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID', meta: 'MDN — browser UUID API' },
      { label: 'Crockford base32', href: 'https://www.crockford.com/base32.html', meta: 'ULID&apos;s encoding' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What is the difference between UUID v4 and v7?',
      answer: 'v4 is fully random. v7 embeds a timestamp in the first 48 bits, so IDs sort by creation time. v7 is a newer spec (RFC 9562, 2024) meant to be database-friendly as a primary key without the fragmentation of v4.',
    },
    q2: {
      question: 'What is a ULID and how does it compare?',
      answer: 'ULID (Universally Unique Lexicographically Sortable Identifier) is a 26-character time-sortable ID. Same time-ordering benefit as UUID v7 but shorter and URL-safe out of the box — Crockford base-32, no hyphens, no ambiguous characters.',
    },
    q3: {
      question: 'Can I trust these IDs for security tokens?',
      answer: 'Yes. This tool uses the browser&apos;s cryptographic random number generator (crypto.getRandomValues). UUID v4 provides 122 bits of randomness — collision-safe and non-predictable.',
    },
    q4: {
      question: 'What is the maximum count I can generate?',
      answer: '1000 per batch in the UI. If you need more, generate multiple batches or script it directly with crypto.randomUUID() in a loop.',
    },
    q5: {
      question: 'Does the tool send my IDs anywhere?',
      answer: 'No. Everything runs in your browser. Generated IDs never leave the page.',
    },
    q6: {
      question: 'Is UUID v7 stable enough for production?',
      answer: 'The spec was finalized in RFC 9562 (May 2024). Postgres 18+ and many other databases support it natively. Verify your specific stack — some older ORMs may not handle the version bits correctly yet.',
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

export default function UuidGeneratorPage({
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
        <UuidGeneratorTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
        />
      </ToolFrame>
    </>
  );
}