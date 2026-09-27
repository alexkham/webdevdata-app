// content/reference/javascript/methods/global-decodeuricomponent.js
//
// decodeURI is consolidated here, mirroring the encode page.

export const meta = {
  slug:        'global-decodeuricomponent',
  name:        'decodeURIComponent',
  signature:   'decodeURIComponent(string)',
  blurb:       'Undo percent encoding — and it throws on a stray % rather than passing it through.',
  category:    'global',
  type:        'global',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'decodeURIComponent decodeURI URIError malformed percent decode query string plus sign space javascript',
};

export const method = {
  slug:      'global-decodeuricomponent',
  name:      'decodeURIComponent',
  signature: 'decodeURIComponent(string)',
  returns:   { type: 'string', desc: 'The decoded string. Throws URIError for a malformed sequence — a % not followed by two hex digits, or bytes that are not valid UTF-8.' },

  category:    'Global function',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The inverse of encodeURIComponent. Its one hard edge is that malformed input throws rather than degrading, which matters because the input usually comes from a URL you did not write.',

  cheat: {
    commonCall: 'decodeURIComponent(param)',
    returns:    'the decoded string',
    replaces:   'the deprecated unescape()',
    watchOut:   'a stray % throws URIError; + is NOT decoded as a space',
  },

  parameters: [
    { name: 'string', type: 'string', required: true, default: null, desc: 'The percent-encoded text. decodeURI leaves reserved sequences such as %26 and %2F encoded; decodeURIComponent decodes everything.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'encoded text, e.g. a%20b', input: 'text' },
  ],
  demoTemplate: '[decodeURIComponent({s}), decodeURI({s})]',
  cases: [
    { id: 'space',   label: 'a space',                values: { s: 'a%20b' } },
    { id: 'reserved',label: 'reserved char (!)',      values: { s: 'a%20b%26c' } },
    { id: 'utf8',    label: 'UTF-8 sequence',         values: { s: '%E4%B8%AD' } },
    { id: 'plus',    label: '+ NOT decoded (!)',      values: { s: 'a+b' } },
    { id: 'stray',   label: 'stray % → THROWS (!)',   values: { s: '%' } },
  ],
  demoExplainer: "The pair is [decodeURIComponent, decodeURI]. The second case shows the asymmetry that mirrors the encode side: %26 becomes & under decodeURIComponent and stays %26 under decodeURI, because decodeURI deliberately refuses to decode anything that would change a URL structure. The fourth case catches people constantly — a + stays a plus sign, because the plus-means-space convention belongs to form encoding, not to URLs. The last case throws: a lone % is malformed, and there is no lenient mode.",

  patterns: [
    {
      name: 'Read a query parameter',
      desc: 'URLSearchParams decodes for you, including +.',
      code: "const q = new URL(href).searchParams.get('q');",
    },
    {
      name: 'Decode defensively',
      desc: 'Malformed input from a URL is common.',
      code: 'let v;\ntry { v = decodeURIComponent(raw); } catch { v = raw; }',
    },
    {
      name: 'Handle form encoding',
      desc: 'Replace + before decoding, if you must do it by hand.',
      code: "decodeURIComponent(raw.replace(/\\+/g, ' '));",
    },
  ],

  examples: [
    { title: 'A space',            code: "decodeURIComponent('a%20b')",   returns: "'a b'" },
    { title: 'Reserved decoded',   code: "decodeURIComponent('%26')",     returns: "'&'" },
    { title: 'decodeURI keeps it', code: "decodeURI('%26')",              returns: "'%26'" },
    { title: 'UTF-8',              code: "decodeURIComponent('%E4%B8%AD')", returns: "'中'" },
    { title: '+ is left alone',    code: "decodeURIComponent('a+b')",     returns: "'a+b'" },
    { title: 'A stray % throws',   code: "decodeURIComponent('%')",       returns: 'URIError: URI malformed' },
  ],

  pitfalls: [
    {
      name: 'Malformed input throws URIError',
      desc: 'A lone % — from truncated input, a hand-edited URL, or a value that was never encoded — crashes rather than passing through. Since the input is almost always from outside your control, decoding without a try/catch is a reliable way to break a page on a bad link.',
      wrong: { label: 'Crashes', code: "decodeURIComponent('100%')", output: 'URIError: URI malformed' },
      fix:   { label: 'Guard it', code: "try { decodeURIComponent(raw); } catch { /* use raw */ }", output: 'survives' },
    },
    {
      name: 'It does not turn + into a space',
      desc: 'Query strings produced by HTML forms encode spaces as +, and this function leaves them as plus signs. Search terms then arrive with visible pluses. URLSearchParams applies the form rules and is the right tool for reading query strings.',
      wrong: { label: 'Plus survives', code: "decodeURIComponent('hello+world')", output: "'hello+world'" },
      fix:   { label: 'URLSearchParams', code: "new URLSearchParams('q=hello+world').get('q')", output: "'hello world'" },
    },
    {
      name: 'Double-decoding is a security bug',
      desc: 'Decoding twice turns %252F into a literal slash, which can defeat a path check that ran between the two decodes. Decode exactly once, at the boundary, and never decode a value you have already decoded.',
      wrong: { label: 'Escapes the check', code: "decodeURIComponent(decodeURIComponent('%252F'))", output: "'/'" },
      fix:   { label: 'Decode once',       code: "decodeURIComponent('%252F')", output: "'%2F'" },
    },
    {
      name: 'decodeURI cannot undo encodeURIComponent',
      desc: 'They are not a pair. decodeURI refuses to decode reserved sequences, so a value escaped with encodeURIComponent comes back still containing %26 and %2F. Match each function with its own inverse.',
      wrong: { label: 'Half decoded', code: "decodeURI(encodeURIComponent('a&b'))", output: "'a%26b'" },
      fix:   { label: 'Matching pair', code: "decodeURIComponent(encodeURIComponent('a&b'))", output: "'a&b'" },
    },
  ],

  when: {
    use: [
      'Decoding one value you escaped with encodeURIComponent',
      'Reading a percent-encoded path segment',
      'Tidying a display string that arrived encoded',
    ],
    avoid: [
      'Reading query strings → URLSearchParams, which handles +',
      'The input may be malformed → wrap it in try/catch',
      'A whole URL → decodeURI, or leave it encoded',
      'unescape() → deprecated and wrong for UTF-8',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the string',
    return:     'A new string; throws rather than returning a partial result',
    cpython:    'V8: Builtins-global-decodeuricomponent',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'encodeURIComponent', slug: 'global-encodeuricomponent', when: 'The matching inverse' },
    { name: 'escape',             slug: 'global-escape',             when: 'unescape, the deprecated counterpart' },
    { name: 'atob',               slug: 'global-btoa',               when: 'Decoding base64 instead' },
    { name: 'String.prototype.replace', slug: 'string-replace',      when: 'Converting + before decoding' },
  ],

  faq: [
    {
      q: 'Why does decoding throw on a percent sign?',
      a: 'Because % begins an escape sequence, so a % not followed by two hex digits is malformed input and the specification requires a URIError. There is no lenient mode — wrap it, or validate first.',
      code: "const safe = s => { try { return decodeURIComponent(s); } catch { return s; } };",
    },
    {
      q: 'Why are there plus signs in my decoded text?',
      a: 'Because the value came from form encoding, where + means space, and this function only understands percent escapes. Use URLSearchParams to read query strings — it applies the form rules.',
    },
    {
      q: 'decodeURIComponent or decodeURI?',
      a: 'Component for a value, matching encodeURIComponent. decodeURI only for a whole URL, and it deliberately leaves reserved sequences encoded so the URL structure cannot change under it. Never mix one with the other function inverse.',
    },
  ],

  history: [
    { version: 'ES1', note: 'unescape shipped alongside escape, using Latin-1.' },
    { version: 'ES3', note: 'decodeURI and decodeURIComponent added with UTF-8 support and strict validation.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent',
    meta:  'decodeURIComponent',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'Encode and decode URLs interactively' },
  ],
};
