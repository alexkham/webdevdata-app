// content/reference/tool-links.js
//
// The ONE source of truth for reference ⇄ tools cross-links.
//
//   reference page → its "Try in a tool" rail card   (toolLinksFor)
//   tool page      → extra items in its Reference card (referenceLinksFor)
//
// A link belongs here only when the reference page's subject is what the
// tool does (parse/validate JSON, encode URLs, Base64, HTML entities …) —
// never a generic "inspect your data" filler. audit-content enforces that
// pages carry no tryInTool of their own and that every id below resolves.
//
// Each entry: page = '<language>/<category>/<slug>' (stdlib module hubs:
// 'python/stdlib/<module>/index'); label/href are derived from the page;
// toolNote = shown on the reference page; refNote = shown on the tool page.

export const TOOLS = {
  '/tools/json-formatter': 'JSON Formatter',
  '/tools/json-tree':      'JSON Tree Viewer',
  '/tools/json-js':        'JSON ⇄ JS Converter',
  '/tools/json-xml':       'JSON ⇄ XML Converter',
  '/tools/yaml-json':      'YAML ⇄ JSON Converter',
  '/tools/base64':         'Base64 Encoder / Decoder',
  '/tools/url-encoder':    'URL Encoder / Decoder',
  '/tools/html-encoder':   'HTML Entity Encoder',
  '/tools/jwt-decoder':    'JWT Decoder',
  '/tools/uuid-generator': 'UUID Generator',
};

export const TOOL_LINKS = [
  // ── JSON ────────────────────────────────────────────────
  { tool: '/tools/json-formatter', page: 'python/stdlib/json/index',           toolNote: 'Validate and pretty-print JSON',               refNote: 'Python json module overview' },
  { tool: '/tools/json-formatter', page: 'python/stdlib/json/loads',           toolNote: 'Find where a document stops being valid JSON', refNote: 'Python: parse a JSON string' },
  { tool: '/tools/json-formatter', page: 'python/stdlib/json/dumps',           toolNote: 'Compare with indent= / sort_keys= output',     refNote: 'Python: serialize to JSON text' },
  { tool: '/tools/json-formatter', page: 'python/stdlib/json/load',            toolNote: 'Check a JSON file before loading it',          refNote: 'Python: parse a JSON file' },
  { tool: '/tools/json-formatter', page: 'python/stdlib/json/dump',            toolNote: 'Check the file you wrote',                     refNote: 'Python: write JSON to a file' },
  { tool: '/tools/json-formatter', page: 'python/stdlib/json/jsondecodeerror', toolNote: 'See the same error position in the editor',    refNote: 'Python: the error for invalid JSON' },
  { tool: '/tools/json-tree',      page: 'python/stdlib/json/index',           toolNote: 'Explore a document as a tree',                 refNote: 'Python json module overview' },
  { tool: '/tools/json-tree',      page: 'python/stdlib/json/loads',           toolNote: 'Browse what loads() will return',              refNote: 'Python: JSON → dict / list' },
  { tool: '/tools/json-js',        page: 'python/stdlib/json/dumps',           toolNote: 'JSON text vs JS object literal',               refNote: 'Python: produce strict JSON text' },
  { tool: '/tools/json-js',        page: 'javascript/methods/global-structuredclone', toolNote: 'Object literals ⇄ JSON text',            refNote: 'JS: deep copy without a JSON round trip' },
  { tool: '/tools/json-xml',       page: 'python/stdlib/json/index',           toolNote: 'Convert JSON to XML and back',                 refNote: 'Python json module overview' },
  { tool: '/tools/yaml-json',      page: 'python/stdlib/json/index',           toolNote: 'Convert YAML config to JSON',                  refNote: 'Python json module overview' },

  // ── Base64 / binary-as-text ─────────────────────────────
  { tool: '/tools/base64',         page: 'javascript/methods/global-btoa',     toolNote: 'Encode and decode Base64 text',                refNote: 'JS: btoa() and atob()' },
  { tool: '/tools/base64',         page: 'python/functions/str-encode',        toolNote: 'Base64 works on bytes — encode text first',    refNote: 'Python: str → bytes' },
  { tool: '/tools/base64',         page: 'python/functions/bytes-decode',      toolNote: 'Decoded Base64 is bytes — decode to text',     refNote: 'Python: bytes → str' },
  { tool: '/tools/base64',         page: 'python/exceptions/unicodedecodeerror', toolNote: 'Decoded bytes that are not UTF-8 text',     refNote: 'Python: bytes that are not valid text' },
  { tool: '/tools/base64',         page: 'python/functions/bytes-hex',         toolNote: 'Another text form of the same bytes',          refNote: 'Python: bytes as hexadecimal text' },
  { tool: '/tools/base64',         page: 'python/stdlib/base64/index',         toolNote: 'Encode and decode Base64 text in the browser', refNote: 'Python: the base64 module' },
  { tool: '/tools/base64',         page: 'python/stdlib/base64/b64encode',     toolNote: 'Check your b64encode output',                  refNote: 'Python: base64.b64encode' },
  { tool: '/tools/base64',         page: 'python/stdlib/base64/b64decode',     toolNote: 'Decode Base64 and spot padding problems',      refNote: 'Python: base64.b64decode' },
  { tool: '/tools/base64',         page: 'python/stdlib/base64/urlsafe-b64',   toolNote: 'Standard and URL-safe Base64 side by side',    refNote: 'Python: URL-safe Base64 (- and _)' },

  // ── URL encoding ────────────────────────────────────────
  { tool: '/tools/url-encoder',    page: 'javascript/methods/global-encodeuricomponent', toolNote: 'Percent-encode text interactively', refNote: 'JS: encodeURIComponent() / encodeURI()' },
  { tool: '/tools/url-encoder',    page: 'javascript/methods/global-decodeuricomponent', toolNote: 'Decode a percent-encoded string',    refNote: 'JS: decodeURIComponent() / decodeURI()' },
  { tool: '/tools/url-encoder',    page: 'javascript/methods/global-escape',   toolNote: 'The standard encoding to use instead',         refNote: 'JS: legacy escape() / unescape()' },
  { tool: '/tools/url-encoder',    page: 'python/stdlib/urllib-parse/index',     toolNote: 'Encode and decode URL text interactively',  refNote: 'Python urllib.parse module overview' },
  { tool: '/tools/url-encoder',    page: 'python/stdlib/urllib-parse/quote',     toolNote: 'Percent-encode text; compare %20 with +',   refNote: 'Python: quote() / quote_plus()' },
  { tool: '/tools/url-encoder',    page: 'python/stdlib/urllib-parse/unquote',   toolNote: 'Decode a percent-encoded string',           refNote: 'Python: unquote() / unquote_plus()' },
  { tool: '/tools/url-encoder',    page: 'python/stdlib/urllib-parse/urlencode', toolNote: 'Check how each query value gets encoded',   refNote: 'Python: dict → query string' },
  { tool: '/tools/url-encoder',    page: 'python/stdlib/urllib-parse/parse_qs',  toolNote: 'Decode the values of a query string',       refNote: 'Python: query string → dict' },

  // ── UUIDs (the tool makes v4 and v7 — so no uuid3/uuid5 link) ──
  { tool: '/tools/uuid-generator', page: 'python/stdlib/uuid/index',      toolNote: 'Generate UUIDs in the browser',                       refNote: 'Python uuid module overview' },
  { tool: '/tools/uuid-generator', page: 'python/stdlib/uuid/uuid4',      toolNote: 'Random version 4 UUIDs, the same kind uuid4() makes',  refNote: 'Python: uuid.uuid4()' },
  { tool: '/tools/uuid-generator', page: 'python/stdlib/uuid/uuid-class', toolNote: 'Paste a generated UUID and parse it with UUID()',     refNote: 'Python: parse and validate a UUID string' },

  // ── HTML entities ───────────────────────────────────────
  { tool: '/tools/html-encoder',   page: 'python/exceptions/unicodeencodeerror', toolNote: "Same &#NNN; output as errors='xmlcharrefreplace'", refNote: 'Python: xmlcharrefreplace writes HTML entities' },
  { tool: '/tools/html-encoder',   page: 'python/functions/ord',               toolNote: 'Numeric entities are code points: &#233;',     refNote: 'Python: character → code point' },
  { tool: '/tools/html-encoder',   page: 'python/functions/chr',               toolNote: 'Decode &#NNN; entities to characters',         refNote: 'Python: code point → character' },
  { tool: '/tools/html-encoder',   page: 'python/stdlib/html/index',           toolNote: 'Encode and decode entities in the browser',     refNote: 'Python html module: escape() and unescape()' },
  { tool: '/tools/html-encoder',   page: 'python/stdlib/html/escape',          toolNote: 'See which characters become entities',          refNote: 'Python: html.escape(text, quote=True)' },
  { tool: '/tools/html-encoder',   page: 'python/stdlib/html/unescape',        toolNote: 'Decode named and numeric entities interactively', refNote: 'Python: html.unescape — HTML5 entity rules' },

  // ── JWT ─────────────────────────────────────────────────
  { tool: '/tools/jwt-decoder',    page: 'javascript/methods/global-btoa',     toolNote: 'JWT parts are Base64URL — decode one here',    refNote: 'JS: atob() decodes a JWT segment (after -→+, _→/)' },
  { tool: '/tools/jwt-decoder',    page: 'python/stdlib/json/loads',           toolNote: 'A decoded JWT payload is JSON',                refNote: 'Python: parse the decoded payload' },
  { tool: '/tools/jwt-decoder',    page: 'python/stdlib/datetime/fromtimestamp', toolNote: 'Read exp / iat claims (Unix seconds)',      refNote: 'Python: exp / iat seconds → datetime' },
  { tool: '/tools/jwt-decoder',    page: 'python/stdlib/base64/urlsafe-b64',   toolNote: 'Decode a whole JWT (header, payload, expiry) at once', refNote: 'Python: decode a JWT segment with urlsafe_b64decode' },
];

// page id → public URL and display name are resolved by the helpers below
// from the generated catalogs (so a renamed page can't leave a stale label).
function pageInfo(id) {
  const [language, ...rest] = id.split('/');
  const slug = rest.pop();
  const category = rest.join('/');
  const { referenceCatalog } = require('@/data/generated/reference-catalog');
  const lang = referenceCatalog.languages.find((l) => l.id === language);
  const group = category.split('/')[0];
  const cat = lang && lang.categories.find((c) => c.id === group);
  // module folders are listed under their group with 'module/slug' slugs
  const catSlug = category.includes('/') ? (slug === 'index' ? category.split('/')[1] : `${category.split('/')[1]}/${slug}`) : slug;
  const item = cat && cat.items.find((m) => m.slug === catSlug);
  if (!item) return null;
  return { href: `${cat.href}/${catSlug}`, name: item.name, language };
}

const LANG_LABEL = { python: 'Python', javascript: 'JavaScript' };

// For a reference page: [{ name, href, meta }] for its "Try in a tool" card.
export function toolLinksFor(pageId) {
  return TOOL_LINKS
    .filter((l) => l.page === pageId)
    .map((l) => ({ name: TOOLS[l.tool], href: l.tool, meta: l.toolNote }));
}

// For a tool page: [{ label, href, meta }] Reference-card items.
export function referenceLinksFor(toolHref) {
  return TOOL_LINKS
    .filter((l) => l.tool === toolHref)
    .map((l) => {
      const info = pageInfo(l.page);
      if (!info) return null;
      return { label: `${info.name} (${LANG_LABEL[info.language] || info.language})`, href: info.href, meta: l.refNote };
    })
    .filter(Boolean);
}
