// pages/tools/jwt-decoder/index.jsx — v1

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import JwtDecoderTool from '@/app/components/tools/JwtDecoderTool';
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
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">Enter</Kbd>], desc: 'Copy decoded header + payload as JSON' },
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
        <p>Paste a JWT into the input pane. The decoded <strong>Header</strong>, <strong>Payload</strong>, and <strong>Signature</strong> appear on the right as you type.</p>
        <p>To verify an HS256/384/512 signature, toggle <strong>Verify signature</strong> and paste the shared secret. The badge shows valid or invalid immediately. RS*/ES*/PS* verification isn&apos;t supported (needs a public key).</p>
        <p>Standard time claims (<code>iat</code>, <code>nbf</code>, <code>exp</code>) are shown as human-readable UTC and relative time. An expired token gets a red badge.</p>
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
        <p>JWTs are opaque to the eye but the payload is just base64-encoded JSON. Decoding lets you inspect what you&apos;re actually receiving.</p>
        <ul>
          <li>Debugging an auth flow — is the <code>sub</code> claim what you expect? Are the roles right?</li>
          <li>Checking if a token has expired without wiring it into your app.</li>
          <li>Confirming the algorithm your identity provider is using.</li>
          <li>Sanity-checking an HS256 signature with your shared secret before shipping the code that consumes it.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Verify signature</strong> &mdash; enables HMAC verification. Requires a shared secret. Only works for <code>HS256</code>, <code>HS384</code>, and <code>HS512</code>.</p>
        <p><strong>Secret</strong> &mdash; the UTF-8 shared secret used to compute the HMAC. Never leaves your browser.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Decoding is not verification.</strong> Any JWT decodes trivially — the signature is what prevents tampering. If you display decoded contents to a user, always verify the signature first.</p>
        <p><strong>The <code>none</code> algorithm is a footgun.</strong> Older JWT libraries accepted <code>alg: none</code> as valid, letting attackers forge tokens with no signature. If you see <code>none</code> in a token, question why.</p>
        <p><strong>Public-key algorithms aren&apos;t supported here.</strong> RS256, ES256, PS256, etc. need a public key. Decoding still works; only verification is skipped. Use your JWT library server-side for verification of asymmetric-signed tokens.</p>
        <p><strong>Times are in seconds since epoch.</strong> Standard JWT claims (<code>iat</code>, <code>nbf</code>, <code>exp</code>) use Unix seconds, not milliseconds. The tool renders both absolute UTC and a relative offset.</p>
        <p><strong>Signature format shown as base64url and hex.</strong> Copy whichever your consumer expects.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser — the token, the secret, the decoded output. Nothing is sent to a server. <strong>Never paste a production token into an online tool you don&apos;t control.</strong> This tool is safe, but the habit of trusting others isn&apos;t.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'jwt decoder',
    'jwt debugger',
    'decode jwt',
    'jwt parser',
    'jwt verify',
    'json web token decoder',
    'hs256 verify',
  ];

  const seoData = {
    title: 'JWT Decoder | WebDevData',
    description: 'Decode JSON Web Tokens in your browser. Inspect header, payload, and signature. Verify HS256/384/512 with a shared secret. Client-side.',
    name: 'JWT Decoder',
    subtitle: 'Header, payload, signature — decoded in your browser. Optional HS256/384/512 verify.',
    url: '/tools/jwt-decoder',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Decode and optionally verify JWTs in your browser.',
    category: 'Tools',
    subCategory: 'Encoders',
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'JWT Decoder', href: '/tools/jwt-decoder' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'JWT decode (header, payload, signature)',
      'Human-readable iat / nbf / exp times',
      'Expiration status badge',
      'Optional HS256/384/512 verification via Web Crypto',
      'Signature shown as base64url and hex',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-22',
  };

  const calloutData = {
    highlight: 'JWT decoding in your browser.',
    text: 'Decode any JWT to inspect it. Verify HS256/384/512 with a shared secret. Nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('jwt-decoder', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'RFC 7519 (JWT)', href: 'https://datatracker.ietf.org/doc/html/rfc7519', meta: 'JSON Web Token specification' },
      { label: 'RFC 7515 (JWS)', href: 'https://datatracker.ietf.org/doc/html/rfc7515', meta: 'JSON Web Signature' },
      { label: 'RFC 7518 (JWA)', href: 'https://datatracker.ietf.org/doc/html/rfc7518', meta: 'JSON Web Algorithms' },
      { label: 'Web Crypto — HMAC', href: 'https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign', meta: 'MDN — browser HMAC API' },
      { label: 'Related tool', href: '/tools/base64', meta: 'Base64 encoder / decoder' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What is a JWT?',
      answer: 'A JSON Web Token — three base64url-encoded segments joined by dots: header, payload, signature. Used for authentication and information transfer. The payload is not encrypted; the signature prevents tampering.',
    },
    q2: {
      question: 'Is decoding the same as verifying?',
      answer: 'No. Decoding just base64-decodes and parses JSON — anyone can do it, and it proves nothing. Verification checks the signature against a secret (HS*) or public key (RS*, ES*), which is what proves the token is authentic.',
    },
    q3: {
      question: 'Why can I not verify RS256 tokens?',
      answer: 'RS256 uses asymmetric cryptography — you need the issuer&apos;s public key. That is beyond a simple in-browser tool. Decode still works; use a server-side JWT library for RS*/ES*/PS* verification.',
    },
    q4: {
      question: 'What about the "none" algorithm?',
      answer: 'A token signed with alg: none has no signature. Old JWT libraries had a vulnerability where they accepted this as valid — attackers could forge tokens. Modern libraries reject it. If you see none in a real token, question its origin.',
    },
    q5: {
      question: 'Are iat / nbf / exp in milliseconds or seconds?',
      answer: 'Seconds since Unix epoch. This is the JWT convention and differs from JavaScript Date.now() (milliseconds). The tool shows both absolute UTC and relative time so you do not have to convert in your head.',
    },
    q6: {
      question: 'Does the tool send my JWT anywhere?',
      answer: 'No. Decoding and verification happen entirely in your browser using the Web Crypto API. Neither the token nor the secret leaves the page.',
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

export default function JwtDecoderPage({
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
        <JwtDecoderTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}