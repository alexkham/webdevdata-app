

// utils/getSiblings.js
// ─────────────────────────────────────────────────────────────────────────────
// Reads page files from the filesystem to produce a list of related pages
// (siblings or children of the current page) for use as sidebar / nav links.
//
// Runs at BUILD TIME ONLY — imports `fs`. Must be called from getStaticProps
// (or getServerSideProps). Never import this into client code; the browser
// bundle has no filesystem.
//
//
// PATH RESOLUTION — why not __dirname
// ─────────────────────────────────────────────────────────────────────────────
// In Next.js, `__dirname` inside getStaticProps points at the COMPILED bundle
// location (…/.next/server/pages/…), NOT your source `pages/` folder. Reading
// from there returns Next's internal manifest files, not your pages.
//
// This util therefore resolves everything from `<process.cwd()>/pages`.
// You pass slugs and subdirectories as plain strings, not paths.
//
//
// SIGNATURE
// ─────────────────────────────────────────────────────────────────────────────
//   getSiblings(currentSlug, subDir = '', options = {})
//
//   currentSlug  string   the slug of the page calling this function.
//                         Used to mark that entry as `active: true` in the
//                         returned list, and used as the folder name to
//                         descend into when mode is 'children'.
//
//   subDir       string   subdirectory under pages/ where the current page
//                         lives. Empty string = pages root.
//                           pages/test4/index.jsx           → subDir = ''
//                           pages/tools/base64/index.jsx    → subDir = 'tools'
//                           pages/reference/python/foo.jsx  → subDir = 'reference/python'
//
//   options      object   { mode, exclude }
//
//     mode       'siblings'  (default) list pages at the SAME level as the
//                            current page. Scans pages/<subDir>/.
//                'children'  list pages NESTED INSIDE the current page.
//                            Scans pages/<subDir>/<currentSlug>/.
//
//     exclude    string[]   slugs to omit from the result. Matches both file
//                           slugs (foo.jsx → 'foo') and folder slugs
//                           (foo/index.jsx → 'foo').
//                           Example: ['about', 'privacy-policy']
//
//
// RETURN VALUE
// ─────────────────────────────────────────────────────────────────────────────
// Array of objects:
//   [
//     { slug: 'base64',      title: 'Base64',      href: '/base64',      active: true  },
//     { slug: 'url-encoder', title: 'URL Encoder', href: '/url-encoder', active: false },
//     …
//   ]
//
// `title` is derived from the slug via a kebab-case → Title Case prettifier,
// with acronym overrides for common dev terms (JWT, JSON, HTML, CSS, SQL, …).
// Add more in the TITLE_OVERRIDES map below.
//
// Returns [] if the directory doesn't exist or contains no valid page files.
//
//
// WHAT COUNTS AS A PAGE
// ─────────────────────────────────────────────────────────────────────────────
// Next.js has two routing patterns; this util handles both:
//   • File-based:      pages/foo.jsx           → route /foo, slug 'foo'
//   • Directory-based: pages/foo/index.jsx     → route /foo, slug 'foo'
//
// A directory is included only if it contains one of:
//   index.jsx, index.js, index.tsx, index.ts
//
// Ignored automatically:
//   • Files/folders starting with `_` (Next convention for _app, _document,
//     and typical drafts like _wip-tool.jsx)
//   • Hidden files (starting with `.`)
//   • `index.jsx` at the current level (would create a self-link at '/')
//   • Non-JS/TS files (images, markdown, JSON, etc.)
//
// If you want to hide additional pages, use the `exclude` option.
//
//
// EXAMPLES
// ─────────────────────────────────────────────────────────────────────────────
// Given this tree:
//
//   pages/
//     index.jsx
//     about.jsx
//     privacy-policy/index.jsx
//     terms-and-conditions/index.jsx
//     test4/
//       index.jsx
//       sub-a.jsx
//       sub-b/index.jsx
//     tools/
//       index.jsx
//       base64/index.jsx
//       url-encoder/index.jsx
//       jwt-decoder/index.jsx
//
// Called from pages/test4/index.jsx:
//
//   getSiblings('test4')
//     → siblings of test4 at pages/ level:
//       [ about, privacy-policy, terms-and-conditions, tools ]
//       (test4 itself is included with active:true if present as a folder)
//
//   getSiblings('test4', '', {
//     exclude: ['about', 'privacy-policy', 'terms-and-conditions']
//   })
//     → same as above minus the excluded ones:
//       [ tools, test4(active) ]
//
//   getSiblings('test4', '', { mode: 'children' })
//     → children of test4 (contents of pages/test4/):
//       [ sub-a, sub-b ]
//
// Called from pages/tools/base64/index.jsx:
//
//   getSiblings('base64', 'tools')
//     → tools at the same level:
//       [ base64(active), url-encoder, jwt-decoder ]
//
//   getSiblings('base64', 'tools', { mode: 'children' })
//     → contents of pages/tools/base64/ (nothing here in this tree → [])
//
//   getSiblings('base64', 'tools', {
//     mode: 'siblings',
//     exclude: ['jwt-decoder']
//   })
//     → [ base64(active), url-encoder ]
//
//
// TYPICAL USAGE ON A PAGE
// ─────────────────────────────────────────────────────────────────────────────
//   // pages/test4/index.jsx
//   import { getSiblings } from '../../utils/getSiblings';
//
//   export async function getStaticProps() {
//     const siblings = getSiblings('test4', '', {
//       exclude: ['about', 'privacy-policy', 'terms-and-conditions',
//                 'disclaimer', 'cookie-policy'],
//     });
//     return { props: { siblings } };
//   }
//
//   export default function Page({ siblings }) {
//     return <ToolFrame siblings={siblings}> … </ToolFrame>;
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';

const TITLE_OVERRIDES = {
  jwt:  'JWT',
  json: 'JSON',
  html: 'HTML',
  css:  'CSS',
  sql:  'SQL',
  xml:  'XML',
  csv:  'CSV',
  yaml: 'YAML',
  uuid: 'UUID',
  ulid: 'ULID',
  url:  'URL',
  api:  'API',
};

const INDEX_FILES = ['index.jsx', 'index.js', 'index.tsx', 'index.ts'];

function prettify(slug) {
  return slug
    .split('-')
    .map((w) => TITLE_OVERRIDES[w.toLowerCase()] || (w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

export function getSiblings(currentSlug, subDir = '', options = {}) {
  const { mode = 'siblings', exclude = [] } = options;
  const excludeSet = new Set(exclude);

  const pagesRoot = path.join(process.cwd(), 'pages');

  // Build the directory to scan and the URL prefix for hrefs.
  //   siblings: scan pages/<subDir>/         hrefs → /<subDir>/<slug>
  //   children: scan pages/<subDir>/<slug>/  hrefs → /<subDir>/<currentSlug>/<slug>
  let fullPath;
  let urlBase;

  if (mode === 'children') {
    const parts = [pagesRoot];
    if (subDir) parts.push(subDir);
    parts.push(currentSlug);
    fullPath = path.join(...parts);

    urlBase = (subDir ? '/' + subDir.replace(/\\/g, '/') : '') + '/' + currentSlug;
  } else {
    fullPath = subDir ? path.join(pagesRoot, subDir) : pagesRoot;
    urlBase  = subDir ? '/' + subDir.replace(/\\/g, '/') : '';
  }

  if (!fs.existsSync(fullPath)) return [];

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    const name = entry.name;
    if (name.startsWith('_') || name.startsWith('.')) continue;

    if (entry.isFile()) {
      const m = name.match(/^(.+?)\.(jsx?|tsx?)$/);
      if (!m) continue;
      const slug = m[1];
      if (slug === 'index') continue;
      if (excludeSet.has(slug)) continue;
      slugs.push(slug);
    } else if (entry.isDirectory()) {
      if (excludeSet.has(name)) continue;
      const hasIndex = INDEX_FILES.some((f) =>
        fs.existsSync(path.join(fullPath, name, f))
      );
      if (hasIndex) slugs.push(name);
    }
  }

  if (slugs.length === 0) return [];

  return slugs.map((slug) => ({
    slug,
    title:  prettify(slug),
    href:   `${urlBase}/${slug}`,
    active: slug === currentSlug,
  }));
}