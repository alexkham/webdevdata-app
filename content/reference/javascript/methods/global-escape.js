// content/reference/javascript/methods/global-escape.js
//
// unescape is consolidated here. Both are Annex B, and the demo shows escape
// beside encodeURIComponent because the contrast IS the reason not to use it.

export const meta = {
  slug:        'global-escape',
  name:        'escape and unescape',
  signature:   'escape(string), unescape(string)',
  blurb:       'Deprecated Latin-1 encoders that emit a non-standard %uXXXX form for anything else.',
  category:    'global',
  type:        'global',
  hasLiveDemo: true,
  version:     'ES1, Annex B since ES3',
  searchTerms: 'escape unescape deprecated annex b Latin-1 %uXXXX encodeURIComponent legacy UTF-8 broken javascript',
};

export const method = {
  slug:      'global-escape',
  name:      'escape and unescape',
  signature: 'escape(string), unescape(string)',
  returns:   { type: 'string', desc: 'escape percent-encodes using Latin-1 byte values, and emits the non-standard %uXXXX form for code points above 255. unescape reverses it.' },

  category:    'Global functions (Annex B)',
  version:     'ES1, Annex B since ES3',
  hasLiveDemo: true,

  subtitle: 'Deprecated since 1999 and still present in every engine. Documented here so you recognise it in old code and understand why the data it produced is often subtly corrupt.',

  cheat: {
    commonCall: 'encodeURIComponent(s)',
    returns:    'Latin-1 percent codes, plus %uXXXX',
    replaces:   'nothing — encodeURIComponent replaces IT',
    watchOut:   '%uXXXX is not valid URL encoding and nothing else decodes it',
  },

  parameters: [
    { name: 'string', type: 'string', required: true, default: null, desc: 'The text to encode. Code points up to 255 become %XX using the LATIN-1 byte; anything higher becomes %uXXXX, a form no standard recognises.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'text to encode', input: 'text' },
  ],
  demoTemplate: '[escape({s}), encodeURIComponent({s})]',
  cases: [
    { id: 'ascii',  label: 'ASCII — they agree',      values: { s: 'a b' } },
    { id: 'accent', label: 'é → WRONG BYTES (!)',     values: { s: 'é' } },
    { id: 'cjk',    label: '中 → %uXXXX (!)',          values: { s: '中' } },
    { id: 'plus',   label: 'a plus sign',             values: { s: '+' } },
    { id: 'slash',  label: 'a slash',                 values: { s: '/' } },
  ],
  demoExplainer: "The pair is [escape, encodeURIComponent]. For plain ASCII they agree, which is why escape survived so long without obvious breakage. The second case is the silent corruption: escape emits %E9, the single Latin-1 byte for é, while encodeURIComponent emits %C3%A9, the correct UTF-8 pair — so anything decoding escape output as UTF-8 gets a replacement character. The third case is worse: 中 becomes %u4E2D, a form invented by Netscape that no URL parser, server or standard understands.",

  patterns: [
    {
      name: 'Use encodeURIComponent',
      desc: 'The correct replacement, in every case.',
      code: 'const encoded = encodeURIComponent(value);',
    },
    {
      name: 'Decoding legacy escape output',
      desc: 'unescape is the only thing that reads %uXXXX.',
      code: 'const text = unescape(legacyValue);',
    },
    {
      name: 'Migrating stored data',
      desc: 'Decode with the old function, re-encode with the new.',
      code: 'const fixed = encodeURIComponent(unescape(stored));',
    },
  ],

  examples: [
    { title: 'ASCII matches',     code: "escape('a b')",              returns: "'a%20b'" },
    { title: 'Latin-1 byte',      code: "escape('é')",                returns: "'%E9'" },
    { title: 'UTF-8 is correct',  code: "encodeURIComponent('é')",    returns: "'%C3%A9'" },
    { title: 'Non-standard form', code: "escape('中')",               returns: "'%u4E2D'" },
    { title: 'Proper UTF-8',      code: "encodeURIComponent('中')",   returns: "'%E4%B8%AD'" },
    { title: 'unescape reverses it', code: "unescape('%E9')",         returns: "'é'" },
  ],

  pitfalls: [
    {
      name: '%uXXXX is not valid URL encoding',
      desc: 'Netscape invented it and nothing else implements it. A URL carrying %u4E2D will not decode on any server, and decodeURIComponent throws on it. Data encoded this way is effectively readable only by JavaScript calling unescape.',
      wrong: { label: 'Nothing decodes it', code: "decodeURIComponent(escape('中'))", output: 'URIError: URI malformed' },
      fix:   { label: 'Matching pair',      code: "decodeURIComponent(encodeURIComponent('中'))", output: "'中'" },
    },
    {
      name: 'Latin-1 output corrupts silently',
      desc: 'The worse failure, because nothing throws. An accented letter becomes a single Latin-1 byte such as %E9, which is not valid UTF-8 — so a server decoding it as UTF-8 produces a replacement character. Accented names stored through escape come back mangled and nobody notices until a user complains.',
      wrong: { label: 'Wrong bytes', code: "escape('é')", output: "'%E9' — invalid as UTF-8" },
      fix:   { label: 'Right bytes', code: "encodeURIComponent('é')", output: "'%C3%A9'" },
    },
    {
      name: 'It does not escape + / @',
      desc: 'escape leaves several characters that are reserved in URLs, including + and /, so its output is not safe to drop into a query string anyway. It was never a URL encoder — it predates the URL specification it is used with.',
      wrong: { label: 'Not escaped', code: "escape('a+b/c')", output: "'a+b/c'" },
      fix:   { label: 'Escaped',     code: "encodeURIComponent('a+b/c')", output: "'a%2Bb%2Fc'" },
    },
    {
      name: 'It is Annex B, not the core language',
      desc: 'Normatively optional — required only of web browsers. A conforming non-browser runtime may omit it, so code using it is not portable even though every current engine happens to ship it.',
      wrong: { label: 'May be absent', code: "escape('a')", output: 'ReferenceError in a conforming non-browser host' },
      fix:   { label: 'Always present', code: "encodeURIComponent('a')", output: 'core language' },
    },
  ],

  when: {
    use: [
      'Never in new code',
      'Decoding data that was originally encoded with escape — unescape is the only thing that reads %uXXXX',
      'Recognising it while reading something old',
    ],
    avoid: [
      'Encoding anything → encodeURIComponent',
      'Decoding modern percent encoding → decodeURIComponent',
      'Non-ASCII text → escape corrupts it, silently or otherwise',
      'Portable code → Annex B is optional outside browsers',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the string',
    return:     'A new string; the input is unchanged',
    cpython:    'V8: Builtins-global-escape — the Annex B section',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'encodeURIComponent', slug: 'global-encodeuricomponent', when: 'The correct replacement' },
    { name: 'decodeURIComponent', slug: 'global-decodeuricomponent', when: 'The correct way to decode' },
    { name: 'btoa',               slug: 'global-btoa',               when: 'Another function with a Latin-1 limitation' },
    { name: 'String HTML methods',slug: 'string-html-methods',       when: 'Another Annex B family kept for compatibility' },
  ],

  faq: [
    {
      q: 'Why does escape still exist?',
      a: 'Because removing it would break old pages, and the web platform does not break old pages. Annex B is the section of the specification that documents exactly these features — deprecated, normatively optional, and permanently present.',
    },
    {
      q: 'What is %uXXXX?',
      a: 'A Netscape invention for encoding code points above 255, using four hex digits after %u. It appears in no standard, no server framework decodes it, and decodeURIComponent throws on it. Only unescape understands it.',
      code: "escape('中');              // '%u4E2D'\nunescape('%u4E2D');        // '中'\ndecodeURIComponent('%u4E2D');   // URIError",
    },
    {
      q: 'I have data encoded with escape. How do I fix it?',
      a: 'Decode with unescape — the only function that reads the format — then re-encode with encodeURIComponent. Do it once, as a migration, and store the corrected form.',
      code: 'const fixed = encodeURIComponent(unescape(stored));',
    },
  ],

  history: [
    { version: 'ES1', note: 'escape and unescape shipped with the Latin-1 and %uXXXX behaviour.' },
    { version: 'ES3', note: 'encodeURI and encodeURIComponent added with proper UTF-8; escape deprecated in the same edition.' },
    { version: 'ES5', note: 'Formally moved to Annex B as normatively optional legacy features.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape',
    meta:  'escape',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'Encode and decode URLs correctly' },
  ],
};
