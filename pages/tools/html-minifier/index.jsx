// pages/tools/html-minifier/index.jsx — v1

import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ToolFrame from '@/app/components/tool-page/ToolFrame';
import HtmlMinifierTool from '@/app/components/tools/HtmlMinifierTool';
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
        <p>Paste HTML into the input pane. The minified output appears on the right as you type (300ms debounce).</p>
        <p>Toggle options to control what gets stripped: whitespace, comments, attribute quotes, empty attributes. Inline <code>&lt;style&gt;</code> and <code>&lt;script&gt;</code> blocks can be minified in place.</p>
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
        <p>HTML minification saves bytes on static pages, email templates, and generated markup.</p>
        <ul>
          <li>Prepping a static HTML file for a CDN drop without a build pipeline.</li>
          <li>Cleaning up template output to see the actual bytes shipped.</li>
          <li>Compressing HTML email templates before sending.</li>
          <li>Quickly checking how small a snippet becomes.</li>
        </ul>
        <p><strong>When not to use:</strong> If you have a build pipeline (Next.js, webpack, Vite), it already minifies HTML output in production. This tool is for one-offs.</p>
      </>
    ),
  },
  {
    id: 'options',
    title: 'Options',
    content: (
      <>
        <p><strong>Collapse whitespace</strong> — runs of spaces, tabs, and newlines become a single space. Off preserves formatting exactly.</p>
        <p><strong>Remove comments</strong> — strips all HTML <code>&lt;!-- ... --&gt;</code> comments. Conditional comments (<code>&lt;!--[if IE]&gt;</code>) are also removed.</p>
        <p><strong>Unquote attrs</strong> — <code>class=&quot;foo&quot;</code> becomes <code>class=foo</code> when the value contains no special chars.</p>
        <p><strong>Remove empty attrs</strong> — drops attributes with empty string values.</p>
        <p><strong>Minify CSS</strong> — collapses whitespace and comments inside <code>&lt;style&gt;</code> blocks.</p>
        <p><strong>Minify JS</strong> — same for <code>&lt;script&gt;</code> blocks. Uses terser internally.</p>
      </>
    ),
  },
  {
    id: 'gotchas',
    title: 'Format-specific gotchas',
    content: (
      <>
        <p><strong>Whitespace can be meaningful.</strong> Inside <code>&lt;pre&gt;</code> and <code>&lt;textarea&gt;</code>, whitespace is preserved automatically. Between inline elements (<code>&lt;span&gt;A&lt;/span&gt; &lt;span&gt;B&lt;/span&gt;</code>), the space you rendered may matter — collapse can change layout. Test after minifying.</p>
        <p><strong>Attribute quotes matter more than they look.</strong> The tool only unquotes values that are safe to unquote. Values with spaces, quotes, or reserved chars stay quoted.</p>
        <p><strong>Conditional comments go too.</strong> If you need <code>&lt;!--[if IE]&gt;</code>-style comments for legacy browsers, turn off &quot;Remove comments.&quot;</p>
        <p><strong>The library loads on first use.</strong> The minifier is dynamic-imported, so the first minify has a brief delay while it downloads. Subsequent runs are instant.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <p>Everything runs in your browser. Your HTML never leaves the page — no server, no logging, no analytics on the content.</p>
    ),
  },
];

// ── getStaticProps ──────────────────────────────────────

export async function getStaticProps() {
  const keyWords = [
    'html minifier',
    'minify html',
    'html compressor',
    'html optimizer',
    'compress html online',
    'html minification',
  ];

  const seoData = {
    title: 'HTML Minifier | WebDevData',
    description: 'Minify HTML in your browser. Strips whitespace, comments, and unnecessary quotes. Can minify inline CSS and JS too.',
    name: 'HTML Minifier',
    subtitle: 'Client-side HTML minification with live output and byte-savings stats.',
    url: '/tools/html-minifier',
    keywords: keyWords.join(', '),
    ogImagePath: '',
    canonicalOverride: null,
    hubDescription: 'Minify HTML, including inline CSS and JS.',
    category: 'HTML Tools',
    subCategory: 'Formatters',
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'Tools', href: '/tools' },
      { label: 'HTML Minifier', href: '/tools/html-minifier' },
    ],
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'HTML minification via html-minifier-terser',
      'Collapse whitespace',
      'Remove comments',
      'Unquote attributes when safe',
      'Remove empty attributes',
      'Minify inline CSS',
      'Minify inline JS (via terser)',
      'Live byte-savings stats',
      'Client-side, no data leaves the browser',
    ],
    datePublished: '2026-07-21',
  };

  const calloutData = {
    highlight: 'HTML minification in your browser.',
    text: 'Paste HTML, get minified output. Client-side; nothing sent to a server.',
    jumps: [
      { to: 'how', label: 'How to use ↓' },
      { to: 'shortcuts', label: 'Shortcuts ↓' },
    ],
  };

  const siblings = getSiblings('html-minifier', 'tools', {
    exclude: [],
  });

  const referenceData = {
    heading: 'Reference',
    items: [
      { label: 'html-minifier-terser', href: 'https://github.com/terser/html-minifier-terser', meta: 'Underlying library' },
      { label: 'HTML specification', href: 'https://html.spec.whatwg.org/', meta: 'WHATWG living standard' },
      { label: 'Related tool', href: '/tools/js-minifier', meta: 'JavaScript minifier' },
      { label: 'Related tool', href: '/tools/css-minifier', meta: 'CSS minifier' },
    ],
  };

  const faqQuestions = {
    q1: {
      question: 'What does HTML minification do?',
      answer: 'Removes whitespace, comments, and unnecessary attribute quotes. Optionally minifies inline CSS and JS. The resulting HTML renders identically but is smaller.',
    },
    q2: {
      question: 'Will minification break my page?',
      answer: 'Rarely, but whitespace between inline elements can affect layout. Test the minified output before shipping if you rely on whitespace formatting.',
    },
    q3: {
      question: 'What are safe attribute values to unquote?',
      answer: 'Values with no spaces, no quotes, and no HTML-reserved characters. The tool checks and leaves values quoted when unquoting would break parsing.',
    },
    q4: {
      question: 'Does it minify inline CSS and JS?',
      answer: 'Yes, if the options are on. Inline <style> content is minified as CSS; inline <script> content is minified via terser.',
    },
    q5: {
      question: 'Why does the first minify take a moment?',
      answer: 'The library loads on demand. First minify triggers the download; subsequent runs are instant.',
    },
    q6: {
      question: 'Does the tool send my HTML anywhere?',
      answer: 'No. All minification happens in your browser. The input never leaves the page.',
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

export default function HtmlMinifierPage({
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
        <HtmlMinifierTool
          theme={toolOptions.theme}
          showExplanations={toolOptions.showExplanations}
          showOrientationToggle={toolOptions.showOrientationToggle}
          initialOrientation={toolOptions.initialOrientation}
        />
      </ToolFrame>
    </>
  );
}