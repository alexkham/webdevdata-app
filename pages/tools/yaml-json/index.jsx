// pages/tools/yaml-json/index.jsx — v1
// YAML ↔ JSON converter page.

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import YamlJsonTool from '@/app/components/tools/YamlJsonTool';
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
    { keys: [<Kbd key="k1">Cmd</Kbd>, ' / ', <Kbd key="k2">Ctrl</Kbd>, ' + ', <Kbd key="k3">/</Kbd>], desc: 'Toggle direction' },
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
        <p>Pick a direction with the tabs — <strong>YAML &rarr; JSON</strong> or <strong>JSON &rarr; YAML</strong>. Paste your input on the left. The converted output appears on the right as you type.</p>
        <p>Set indent size (both directions), and for JSON&rarr;YAML you can sort keys alphabetically or force parts of the output into inline flow syntax.</p>
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
        <p>YAML and JSON carry the same shape of data; they differ in syntax. Which one is right depends on where the data lives.</p>
        <ul>
          <li>Kubernetes, Ansible, Docker Compose, CircleCI, GitHub Actions all use YAML — comments and readability win.</li>
          <li>APIs, config exports, log payloads use JSON — universal parser support, no whitespace-sensitivity gotchas.</li>
          <li>Converting between them lets you author in one and ship in the other.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Indent</strong> &mdash; 2 spaces, 4 spaces, or tab (JSON only; YAML doesn&apos;t allow tabs for indentation).</p>
        <p><strong>Sort keys</strong> (JSON&rarr;YAML only) &mdash; sorts object keys alphabetically. Useful for diff-friendly config files.</p>
        <p><strong>Inline from depth</strong> (JSON&rarr;YAML only) &mdash; forces mappings and sequences at or beyond this depth into inline flow syntax (<code>{'{a: 1, b: 2}'}</code> instead of block form). Set to <em>Never</em> for pure block style.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>YAML anchors and references are resolved.</strong> Input like <code>&lt;&lt;: *defaults</code> merges the referenced mapping into the output — JSON has no anchor concept, so it&apos;s expanded.</p>
        <p><strong>Comments disappear.</strong> JSON has no comments; YAML&rarr;JSON drops them silently.</p>
        <p><strong>YAML tabs are illegal for indentation.</strong> Block YAML mandates spaces. If you set indent to Tab and switch to JSON&rarr;YAML, the output uses 2 spaces regardless.</p>
        <p><strong>YAML type coercion.</strong> Unquoted <code>yes</code>, <code>no</code>, <code>on</code>, <code>off</code> become booleans in older YAML 1.1 mode. This tool uses YAML 1.2 (js-yaml default), so only <code>true</code>/<code>false</code>/<code>null</code> coerce.</p>
        <p><strong>Bidirectional round-trip isn&apos;t always identical.</strong> YAML has many ways to write the same data; converting to JSON and back may produce cleaner but different YAML.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your YAML and JSON never leave the page — no server, no logging, no analytics on the content.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'yaml to json',
    'json to yaml',
    'yaml json converter',
    'convert yaml to json',
    'convert json to yaml',
    'yaml parser',
    'yaml formatter',
  ];

  const seoData = {
    title: 'YAML ↔ JSON Converter | WebDevData',
    description: 'Convert YAML to JSON and back, in your browser. Powered by js-yaml. Live output, indent and inline-flow control.',
    name: 'YAML ↔ JSON Converter',
    subtitle: 'Both directions. Client-side. Anchors resolved, YAML 1.2 semantics, real live output.',
    url: '/tools/yaml-json',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Convert YAML to JSON and JSON to YAML, in your browser.',
    category: 'JSON Tools',
    subCategory: 'Converters',
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'YAML ↔ JSON', href: '/tools/yaml-json' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'YAML to JSON conversion',
      'JSON to YAML conversion',
      'YAML 1.2 semantics via js-yaml',
      'Configurable indent (2, 4, tab for JSON)',
      'Sort keys alphabetically (JSON → YAML)',
      'Inline flow depth control (JSON → YAML)',
      'Live output',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'YAML ↔ JSON, both directions.',
    text: 'Client-side, powered by js-yaml. Nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('yaml-json', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'YAML 1.2 spec', href: 'https://yaml.org/spec/1.2.2/', meta: 'Official YAML spec' },
      { label: 'js-yaml', href: 'https://github.com/nodeca/js-yaml', meta: 'Underlying library' },
      { label: 'RFC 8259 (JSON)', href: 'https://datatracker.ietf.org/doc/html/rfc8259', meta: 'JSON specification' },
      { label: 'Related tool', href: '/tools/json-js', meta: 'JSON ↔ JS object converter' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What is the difference between YAML and JSON?',
      answer: 'Same data model, different syntax. YAML uses indentation and is easier to read and write by hand — good for configs. JSON uses braces and brackets, is stricter, and has universal parser support — good for APIs and data interchange.',
    },
    q2: {
      question: 'Which YAML version does this tool use?',
      answer: 'YAML 1.2 semantics (via js-yaml). That means yes/no/on/off stay as strings; only true/false/null are booleans/null. If you have YAML 1.1 files with yes-as-boolean, quote them.',
    },
    q3: {
      question: 'Are comments preserved when converting YAML to JSON?',
      answer: 'No. JSON has no comment syntax. Comments in the YAML input are dropped from the JSON output.',
    },
    q4: {
      question: 'What happens to YAML anchors and references?',
      answer: 'They are resolved. If your YAML uses &defaults and <<: *defaults, the referenced mapping is merged into the output before serialization.',
    },
    q5: {
      question: 'Can I use tabs for indentation in YAML?',
      answer: 'No — block YAML mandates spaces. If you pick Tab as indent, JSON output uses tabs but YAML output falls back to spaces.',
    },
    q6: {
      question: 'Does the tool send my data anywhere?',
      answer: 'No. All conversion happens in your browser using js-yaml. The input never leaves the page.',
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

export default function YamlJsonPage({
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
        <YamlJsonTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}