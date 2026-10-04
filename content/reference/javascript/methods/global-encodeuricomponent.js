// content/reference/javascript/methods/global-encodeuricomponent.js
//
// NOTE: literals containing ${"\\"}u… are deliberate. Next 14.2.4's SWC
// compiles the TEXT "\\uD83D" into a real lone surrogate, which breaks
// hydration. Injecting the backslash through a template expression is the
// only form verified to survive both its transform and its minifier.
//
// encodeURI is consolidated here: the two differ only in which characters
// they leave alone, and choosing between them is the whole question.

export const meta = {
  slug:        'global-encodeuricomponent',
  name:        'encodeURIComponent',
  signature:   'encodeURIComponent(string)',
  blurb:       'Escape a URL PIECE — encodeURI escapes a whole URL and leaves & and = alone.',
  category:    'global',
  type:        'global',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'encodeURIComponent encodeURI escape URL query string percent encoding UTF-8 reserved characters javascript',
};

export const method = {
  slug:      'global-encodeuricomponent',
  name:      'encodeURIComponent',
  signature: 'encodeURIComponent(string)',
  returns:   { type: 'string', desc: 'The string with every character escaped except A–Z a–z 0–9 and - _ . ! ~ * \' ( ). Non-ASCII characters become UTF-8 percent sequences.' },

  category:    'Global function',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'For one VALUE inside a URL — a query parameter, a path segment. encodeURI is for a whole URL and deliberately leaves the structural characters intact, which makes it the wrong choice for values.',

  cheat: {
    commonCall: 'encodeURIComponent(value)',
    returns:    'a percent-encoded string',
    replaces:   'the deprecated escape()',
    watchOut:   'it does NOT escape ! \' ( ) * — and a lone surrogate throws',
  },

  parameters: [
    { name: 'string', type: 'string', required: true, default: null, desc: 'The text to escape. Non-strings are converted first. A lone surrogate — from slicing an emoji in half — throws URIError.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'text to encode', input: 'text' },
  ],
  demoTemplate: '[encodeURIComponent({s}), encodeURI({s})]',
  cases: [
    { id: 'query',  label: 'query characters (!)',  values: { s: 'a b&c=d' } },
    { id: 'url',    label: 'a whole URL (!)',       values: { s: 'https://x.com/a b' } },
    { id: 'accent', label: 'accented → UTF-8',      values: { s: 'é' } },
    { id: 'safe',   label: "not escaped: !'()*",    values: { s: "!'()*-._~" } },
    { id: 'plus',   label: 'a plus sign',           values: { s: '+' } },
  ],
  demoExplainer: "The pair is [encodeURIComponent, encodeURI]. The first case is the decision in one line: for the text 'a b&c=d', encodeURIComponent escapes the & and = because inside a single value they would be mistaken for structure, while encodeURI leaves them because in a whole URL that is exactly what they are. The second case shows the mirror image — encodeURI keeps a URL usable, encodeURIComponent destroys it by escaping the slashes and colon. Accented characters become UTF-8 byte sequences in both. Note the fourth case: several punctuation characters are NOT escaped by either.",

  patterns: [
    {
      name: 'Build a query string',
      desc: 'Better still, let URLSearchParams do it.',
      code: "const q = new URLSearchParams({name: value}).toString();",
    },
    {
      name: 'Escape one path segment',
      desc: 'A value that might contain a slash.',
      code: 'const url = `/users/${encodeURIComponent(id)}`;',
    },
    {
      name: 'Fix a URL that has spaces',
      desc: 'This is what encodeURI is for.',
      code: 'const safe = encodeURI(urlWithSpaces);',
    },
  ],

  examples: [
    { title: 'A value',            code: "encodeURIComponent('a b&c=d')", returns: "'a%20b%26c%3Dd'" },
    { title: 'A whole URL',        code: "encodeURI('a b&c=d')",          returns: "'a%20b&c=d'" },
    { title: 'It destroys a URL',  code: "encodeURIComponent('https://x.com/a')", returns: "'https%3A%2F%2Fx.com%2Fa'" },
    { title: 'UTF-8 for non-ASCII',code: "encodeURIComponent('é')",       returns: "'%C3%A9'" },
    { title: "!'()* survive",      code: "encodeURIComponent(\"!'()*\")", returns: `"!'()*"` },
    { title: 'A lone surrogate throws', code: `encodeURIComponent('${"\\"}ud83d')`, returns: 'URIError: URI malformed' },
  ],

  pitfalls: [
    {
      name: 'Using encodeURI for a value',
      desc: 'The classic mix-up. encodeURI leaves & = ? # / : alone, so a value containing any of them silently changes the MEANING of the URL — a value with an & becomes two parameters. Values always want encodeURIComponent.',
      wrong: { label: 'Injects a parameter', code: "'?q=' + encodeURI('a&admin=1')", output: "'?q=a&admin=1'" },
      fix:   { label: 'Escaped',             code: "'?q=' + encodeURIComponent('a&admin=1')", output: "'?q=a%26admin%3D1'" },
    },
    {
      name: "It leaves ! ' ( ) * unescaped",
      desc: 'Those five are legal in a URI but not in every context that consumes one — some older servers and OAuth signature schemes require them escaped. If a signature mismatches, this is often why.',
      wrong: { label: 'Not escaped', code: "encodeURIComponent(\"it's\")", output: `"it's"` },
      fix:   { label: 'Escape them too', code: "encodeURIComponent(\"it's\").replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())", output: "'it%27s'" },
    },
    {
      name: 'A lone surrogate throws URIError',
      desc: 'There is no UTF-8 encoding for half a surrogate pair, so a string truncated through an emoji crashes here rather than producing mangled output. That makes this function a common place for a slice bug to finally surface.',
      wrong: { label: 'Throws', code: "encodeURIComponent('\\u{1F600}abc'.slice(0, 1))", output: 'URIError: URI malformed' },
      fix:   { label: 'Repair first', code: "encodeURIComponent('\\u{1F600}abc'.slice(0, 1).toWellFormed())", output: "'%EF%BF%BD'" },
    },
    {
      name: 'It does not encode a space as +',
      desc: 'It produces %20. The + convention belongs to application/x-www-form-urlencoded form bodies, not to URLs generally — so a server expecting form encoding may not decode %20 the way you assume. URLSearchParams handles the distinction.',
      wrong: { label: 'Percent form', code: "encodeURIComponent('a b')", output: "'a%20b'" },
      fix:   { label: 'Form encoding', code: "new URLSearchParams({q: 'a b'}).toString()", output: "'q=a+b'" },
    },
  ],

  when: {
    use: [
      'Escaping one query-parameter value',
      'Escaping a path segment that may contain reserved characters',
      'Anywhere a value is concatenated into a URL by hand',
    ],
    avoid: [
      'Building a whole query string → URLSearchParams',
      'Fixing an existing URL with spaces → encodeURI',
      'HTML escaping → this is not an HTML escaper',
      'escape() → deprecated and wrong for non-Latin-1',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the string',
    return:     'A new string; the input is unchanged',
    cpython:    'V8: Builtins-global-encodeuricomponent',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'decodeURIComponent', slug: 'global-decodeuricomponent', when: 'Reading the value back' },
    { name: 'escape',             slug: 'global-escape',             when: 'The deprecated predecessor, and why not to use it' },
    { name: 'btoa',               slug: 'global-btoa',               when: 'Base64 rather than percent encoding' },
    { name: 'String.prototype.isWellFormed', slug: 'string-wellformed', when: 'Avoiding the lone-surrogate URIError' },
  ],

  faq: [
    {
      q: 'encodeURIComponent or encodeURI?',
      a: 'Component for a VALUE going into a URL; encodeURI for a whole URL that needs tidying. The test: if the text could legitimately contain a & or / that is data rather than structure, you need encodeURIComponent.',
      code: "encodeURIComponent(value);   // one piece\nencodeURI(wholeUrl);         // an entire URL",
    },
    {
      q: 'Should I just use URLSearchParams?',
      a: 'For query strings, yes — it escapes each value, joins with & and handles repeated keys. It also uses form encoding, so spaces become +, which is what most servers expect from a query string.',
      code: "const url = new URL('/search', base);\nurl.searchParams.set('q', 'a b&c');",
    },
    {
      q: 'Why does it throw on my string?',
      a: 'Almost certainly a lone surrogate — half an emoji left behind by slicing or truncating. Call toWellFormed first, or slice by code point so the pair is never split.',
      code: "encodeURIComponent(s.toWellFormed());",
    },
  ],

  history: [
    { version: 'ES1', note: 'escape and unescape shipped, using Latin-1 and a non-standard %uXXXX form.' },
    { version: 'ES3', note: 'encodeURI and encodeURIComponent added with proper UTF-8 encoding; escape deprecated.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent',
    meta:  'encodeURIComponent',
  },

};
