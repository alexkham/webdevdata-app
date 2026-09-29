// app/components/reference/frame/RefHead.jsx
//
// <Head> tags for a reference page from its seoData + JSON-LD schemas:
// title, description, canonical, Open Graph, Twitter, robots, and every
// non-empty schema. Used by the stdlib pages, whose page files are thin.
// (The visible h1/subtitle stay in the page itself.)

import Head from 'next/head';

const SITE_URL = 'https://www.webdevdata.net';
const SITE_NAME = 'WebDevData';
const DEFAULT_OG_IMAGE = '/og-images/default.png';

export default function RefHead({ seoData, schemas = {}, ogType = 'article' }) {
  const canonical = `${SITE_URL}${seoData.url}`;
  const ogImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  const list = Object.values(schemas).filter((s) => s && !(s['@type'] === 'FAQPage' && s.mainEntity.length === 0));
  return (
    <Head>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="robots" content="index, follow" />

      {list.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </Head>
  );
}
