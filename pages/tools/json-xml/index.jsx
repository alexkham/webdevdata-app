// pages/tools/json-xml/index.jsx — v1
// JSON ↔ XML converter page.

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import JsonXmlTool from '@/app/components/tools/JsonXmlTool';
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
        <p>Pick a direction with the tabs — <strong>JSON &rarr; XML</strong> or <strong>XML &rarr; JSON</strong>. Paste your input on the left. The converted output appears on the right as you type.</p>
        <p>For JSON&rarr;XML, set the root element name and whether to include the <code>&lt;?xml ... ?&gt;</code> declaration. For XML&rarr;JSON, choose whether to collapse single-element arrays and whether to merge attributes with sibling children.</p>
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
        <p>XML is still everywhere in legacy and enterprise systems: SOAP APIs, RSS/Atom feeds, sitemaps, Office and DOCX innards, Android manifests, SVG.</p>
        <ul>
          <li>Consuming a SOAP or SAML response and needing JSON to feed a JS front-end.</li>
          <li>Generating an RSS feed from a JSON data source.</li>
          <li>Comparing shape between an XML config and its JSON port.</li>
          <li>Sanity-checking that a converter you wrote produces the same result on both directions.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Indent</strong> &mdash; 2 spaces, 4 spaces, or tab.</p>
        <p><strong>Root</strong> (JSON&rarr;XML only) &mdash; the wrapping root element name. Default <code>root</code>. XML must have exactly one root; JSON doesn&apos;t need one, so this fills the gap.</p>
        <p><strong>XML declaration</strong> (JSON&rarr;XML only) &mdash; include the <code>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</code> prolog. Turn off for XML fragments meant to be embedded.</p>
        <p><strong>Collapse single arrays</strong> (XML&rarr;JSON only) &mdash; XML has no array type; xml2js normally wraps every child in an array in case it repeats. This flag returns single-child values as plain values instead. Cleaner but you lose the &quot;might have siblings&quot; hint.</p>
        <p><strong>Merge attributes</strong> (XML&rarr;JSON only) &mdash; XML attributes get lifted alongside child elements instead of nested under a <code>$</code> key. Reads more naturally in JSON.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>JSON and XML aren&apos;t 1:1.</strong> XML has attributes, mixed content (text and elements interleaved), namespaces, and CDATA. JSON has arrays, booleans, and null. Round-tripping between them can lose fidelity — expect some structural drift.</p>
        <p><strong>XML has no array type.</strong> Repeated elements become arrays in JSON; single elements without repetition may or may not become arrays depending on the <em>Collapse single arrays</em> option.</p>
        <p><strong>All XML text is strings.</strong> The XML&rarr;JSON pass reads every text node as a string — <code>&lt;age&gt;30&lt;/age&gt;</code> becomes <code>&quot;age&quot;: &quot;30&quot;</code>, not <code>&quot;age&quot;: 30</code>. Post-process if you need typed values.</p>
        <p><strong>Root element required for XML.</strong> If your JSON is <code>[1, 2, 3]</code>, it gets wrapped as <code>&lt;root&gt;&lt;0&gt;1&lt;/0&gt;...&lt;/root&gt;</code> — probably not what you want. Wrap arrays in a named property first.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your JSON and XML never leave the page — no server, no logging, no analytics on the content.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'json to xml',
    'xml to json',
    'json xml converter',
    'convert json to xml',
    'convert xml to json',
    'xml parser',
    'xml formatter',
  ];

  const seoData = {
    title: 'JSON ↔ XML Converter | WebDevData',
    description: 'Convert JSON to XML and back, in your browser. Powered by xml2js. Live output with indent, root name, and attribute-handling options.',
    name: 'JSON ↔ XML Converter',
    subtitle: 'Both directions. Client-side. Configurable root, attribute lifting, single-array collapse.',
    url: '/tools/json-xml',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Convert between JSON and XML, in your browser.',
    category: 'JSON Tools',
    subCategory: 'Converters',
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'JSON ↔ XML', href: '/tools/json-xml' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'JSON to XML conversion',
      'XML to JSON conversion',
      'Configurable root element name',
      'Toggle XML declaration',
      'Collapse single-child arrays option',
      'Merge attributes with siblings option',
      'Live output',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'JSON ↔ XML, both directions.',
    text: 'Client-side. Nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('json-xml', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'XML 1.0 spec', href: 'https://www.w3.org/TR/xml/', meta: 'W3C — XML specification' },
      { label: 'xml2js', href: 'https://github.com/Leonidas-from-XIV/node-xml2js', meta: 'Underlying library' },
      { label: 'RFC 8259 (JSON)', href: 'https://datatracker.ietf.org/doc/html/rfc8259', meta: 'JSON specification' },
      { label: 'Related tool', href: '/tools/yaml-json', meta: 'YAML ↔ JSON converter' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'How do you convert between JSON and XML when they have different data models?',
      answer: 'Object keys become element names; primitive values become text nodes; arrays become repeated elements. XML attributes, when going XML → JSON, are lifted next to sibling elements. Some structural drift is unavoidable — round-tripping may not be identical.',
    },
    q2: {
      question: 'What is the Root option for?',
      answer: 'XML documents must have exactly one root element. JSON does not. When converting JSON → XML, the tool wraps your JSON in a root element with the name you provide (default: "root").',
    },
    q3: {
      question: 'Why is my number a string in the JSON output?',
      answer: 'XML text nodes are always strings — <age>30</age> reads as the string "30". If you need typed values, post-process the JSON to coerce.',
    },
    q4: {
      question: 'What does "Collapse single arrays" do?',
      answer: 'xml2js wraps every child element in an array by default, in case it repeats later. With this option on, single children become plain values instead. Cleaner JSON, but you lose the "might have siblings" affordance.',
    },
    q5: {
      question: 'What if my XML has attributes?',
      answer: 'By default, attributes are nested under a $ key. With Merge attributes on, they lift up alongside child elements — reads more naturally in JSON.',
    },
    q6: {
      question: 'Does the tool send my data anywhere?',
      answer: 'No. All conversion happens in your browser using xml2js. The input never leaves the page.',
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

export default function JsonXmlPage({
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
        <JsonXmlTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}