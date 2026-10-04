// content/reference/python/stdlib/urllib-parse/quote.js — quote, quote_plus, quote_from_bytes

export const meta = {
  slug:        'quote',
  name:        'urllib.parse.quote',
  signature:   "urllib.parse.quote(string, safe='/', encoding=None, errors=None)",
  blurb:       'Percent-encode text for a URL: quote writes a space as %20 and keeps / by default; quote_plus writes a space as + for form data; quote_from_bytes takes bytes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib parse quote quote_plus quote_from_bytes python url encode percent encoding urlencode string escape url space %20 plus sign safe parameter slash not encoded encodeURIComponent python equivalent unreserved characters',
};

export const method = {
  slug:      'quote',
  name:      'urllib.parse.quote',
  signature: "urllib.parse.quote(string, safe='/', encoding=None, errors=None)",
  returns:   { type: 'str', desc: 'The percent-encoded text: ASCII letters, digits, _ . - ~ and the characters in safe stay as they are; every other byte becomes %XX (uppercase hex).' },

  category:    'urllib.parse function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "Three spellings of percent-encoding. quote is for URL paths — and it keeps '/' unless you pass safe=''. quote_plus is for form-style query values: a space becomes +, and nothing is safe by default. quote_from_bytes does the same job on bytes you already have.",

  covers: ['quote', 'quote_plus', 'quote_from_bytes'],

  cheat: {
    commonCall: "quote(name, safe='')",
    returns:    "'a%20b%2Fc' for 'a b/c'",
    replaces:   "hand-written .replace(' ', '%20') chains",
    watchOut:   "The default safe='/' leaves slashes unencoded — wrong for a single path segment or a query value",
  },

  parameters: [
    { name: 'string',   type: 'str | bytes', required: true,  default: null,   desc: 'The text to encode. A str is first encoded to bytes (UTF-8 unless encoding says otherwise); bytes are used as they are.' },
    { name: 'safe',     type: 'str | bytes', required: false, default: "'/'",  desc: "Extra characters to leave unencoded, on top of letters, digits and _ . - ~. quote and quote_from_bytes default to '/', quote_plus to ''. Non-ASCII characters in safe are ignored." },
    { name: 'encoding', type: 'str',         required: false, default: 'None', desc: "Codec used to turn a str into bytes (None means 'utf-8'). Must not be given when string is bytes — TypeError." },
    { name: 'errors',   type: 'str',         required: false, default: 'None', desc: "What to do with characters the codec cannot encode (None means 'strict', which raises UnicodeEncodeError)." },
  ],

  modes: [
    {
      id: 'compare',
      label: 'quote vs quote_plus',
      blurb: 'The same text three ways: quote with its default safe, quote with nothing safe, and quote_plus.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "from urllib.parse import quote, quote_plus\n(quote({$text}), quote({$text}, safe=''), quote_plus({$text}))",
      cases: [
        { id: 'space',  label: 'spaces and &',  values: { text: 'rock & roll' } },
        { id: 'slash',  label: 'a slash',       values: { text: 'AC/DC live' } },
        { id: 'plus',   label: 'a plus sign',   values: { text: '1+1=2' } },
        { id: 'utf8',   label: 'non-ASCII',     values: { text: 'café €' } },
        { id: 'kept',   label: 'never encoded', values: { text: 'A-z_0.9~' } },
      ],
    },
    {
      id: 'safe',
      label: 'safe=',
      blurb: 'Choose which reserved characters survive. Letters, digits and _ . - ~ are always kept.',
      params: [
        { name: 'text', type: 'str', hint: 'any text',              input: 'text' },
        { name: 'safe', type: 'str', hint: 'characters to keep',     input: 'text' },
      ],
      template: 'from urllib.parse import quote\nquote({$text}, safe={$safe})',
      cases: [
        { id: 'path',  label: "path: safe='/'",     values: { text: '/files/my report.pdf', safe: '/' } },
        { id: 'seg',   label: "segment: safe=''",   values: { text: 'my/report.pdf', safe: '' } },
        { id: 'jsec',  label: 'like encodeURIComponent', values: { text: "it's (fun)!*", safe: "!*'()" } },
        { id: 'colon', label: "safe=':@'",          values: { text: 'user@host:8080', safe: ':@' } },
      ],
    },
    {
      id: 'encoding',
      label: 'encoding=',
      blurb: 'The same text encoded as UTF-8 (the default) and as Latin-1. Characters Latin-1 cannot hold raise UnicodeEncodeError.',
      params: [{ name: 'text', type: 'str', hint: 'text with accents', input: 'text' }],
      template: "from urllib.parse import quote\n(quote({$text}), quote({$text}, encoding='latin-1'))",
      cases: [
        { id: 'acc',  label: 'é and ü',   values: { text: 'Zürich café' } },
        { id: 'euro', label: 'euro sign', values: { text: '5 €' } },
      ],
    },
  ],
  demoExplainer: "quote keeps / because its default is safe='/', so 'AC/DC live' becomes 'AC/DC%20live' — fine inside a path, wrong for one path segment or a query value. quote_plus writes the space as + and therefore must encode a literal + as %2B. Non-ASCII text is encoded to UTF-8 first: é is the two bytes %C3%A9, € the three bytes %E2%82%AC.",

  patterns: [
    {
      name: 'One path segment',
      desc: "safe='' so a slash inside the value cannot create a new path segment.",
      code: "from urllib.parse import quote\nurl = f'https://example.com/files/{quote(filename, safe=\"\")}'",
    },
    {
      name: 'A whole path',
      desc: 'The default safe keeps the separators and encodes everything else.',
      code: "from urllib.parse import quote\nurl = 'https://example.com' + quote('/docs/my file.txt')",
    },
    {
      name: 'Match JavaScript encodeURIComponent',
      desc: "encodeURIComponent also leaves ! * ' ( ) alone.",
      code: "from urllib.parse import quote\nquote(text, safe=\"!*'()\")",
    },
    {
      name: 'A query string from a dict',
      desc: 'Do not quote and join by hand — urlencode applies quote_plus to every key and value.',
      code: "from urllib.parse import urlencode\nquery = urlencode({'q': search, 'page': page})",
    },
  ],

  examples: [
    { title: 'quote keeps the slash',        code: "from urllib.parse import quote\nquote('a b&c/d')",              returns: "'a%20b%26c/d'" },
    { title: "safe='' encodes it too",        code: "from urllib.parse import quote\nquote('a b&c/d', safe='')",     returns: "'a%20b%26c%2Fd'" },
    { title: 'quote_plus: space → +',         code: "from urllib.parse import quote_plus\nquote_plus('a b&c/d')",    returns: "'a+b%26c%2Fd'" },
    { title: 'A literal + becomes %2B',       code: "from urllib.parse import quote_plus\nquote_plus('1+1=2')",      returns: "'1%2B1%3D2'" },
    { title: 'Non-ASCII → UTF-8 bytes',       code: "from urllib.parse import quote\nquote('café €')",               returns: "'caf%C3%A9%20%E2%82%AC'" },
    { title: 'A different encoding',          code: "from urllib.parse import quote\nquote('café', encoding='latin-1')", returns: "'caf%E9'" },
    { title: 'quote_from_bytes',              code: "from urllib.parse import quote_from_bytes\nquote_from_bytes(b'\\x00\\xff/')", returns: "'%00%FF/'" },
    { title: 'Numbers are not text',          code: "from urllib.parse import quote\nquote(42)",                     returns: 'TypeError: quote_from_bytes() expected bytes' },
  ],

  pitfalls: [
    {
      name: 'The default safe="/" in a path segment',
      desc: 'A user-supplied name with a slash silently becomes two path segments, pointing at a different resource.',
      wrong: { label: 'default safe', code: "from urllib.parse import quote\n'/files/' + quote('2026/report.pdf')",           output: "'/files/2026/report.pdf'" },
      fix:   { label: "safe=''",      code: "from urllib.parse import quote\n'/files/' + quote('2026/report.pdf', safe='')", output: "'/files/2026%2Freport.pdf'" },
    },
    {
      name: 'Quoting text that is already encoded',
      desc: 'quote encodes % like any other character, so an already-encoded value is encoded twice and the server sees the literal text %20.',
      wrong: { label: 'quote twice',        code: "from urllib.parse import quote\nquote('my%20file.txt')",          output: "'my%2520file.txt'" },
      fix:   { label: 'decode, then encode', code: "from urllib.parse import quote, unquote\nquote(unquote('my%20file.txt'))", output: "'my%20file.txt'" },
    },
    {
      name: 'An encoding that cannot hold the text',
      desc: "errors defaults to 'strict', so a character outside the codec raises. Prefer UTF-8; use errors= only if the server really wants another codec.",
      wrong: { label: 'ascii',                 code: "from urllib.parse import quote\nquote('€', encoding='ascii')",                            output: "UnicodeEncodeError: 'ascii' codec can't encode character '\\u20ac' in position 0: ordinal not in range(128)" },
      fix:   { label: 'utf-8 (the default)',   code: "from urllib.parse import quote\nquote('€')",                                              output: "'%E2%82%AC'" },
    },
  ],

  when: {
    use: [
      'Putting a value into a URL path (safe="" for a single segment)',
      'Building a query value by hand: quote_plus',
      'Encoding raw bytes for a URL: quote_from_bytes',
    ],
    avoid: [
      'A whole query string from a dict → urlencode',
      'Already-encoded text → it gets encoded twice (% becomes %25)',
      'HTML escaping → html.escape',
    ],
  },

  notes: {
    cpython:       "quote encodes str with str.encode(encoding, errors) and hands the bytes to quote_from_bytes, which maps every byte through a cached table: kept as-is when it is unreserved or in safe, else '%XX'",
    'Unreserved':  'A-Z a-z 0-9 _ . - ~ are never encoded (RFC 3986). ~ joined the set in Python 3.7',
    'Defaults':    "quote: safe='/'. quote_plus: safe=''. quote_from_bytes: safe='/'",
    'Exceptions':  "TypeError for encoding/errors with bytes input and for non-str/bytes values; UnicodeEncodeError with errors='strict'",
  },

  related: [
    { name: 'urllib.parse.unquote',   slug: 'unquote',   when: 'The reverse: %XX → characters' },
    { name: 'urllib.parse.urlencode', slug: 'urlencode', when: 'A whole query string from a dict' },
    { name: 'urllib.parse module',    slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
    { name: 'encodeURIComponent()',   slug: 'global-encodeuricomponent', when: 'The JavaScript equivalent (keeps ! * \' ( ) too)', language: 'javascript', category: 'methods', href: '/reference/javascript/methods/global-encodeuricomponent' },
    { name: 'base64.urlsafe_b64encode', slug: 'urlsafe-b64', when: 'Binary data in a URL without % escapes', category: 'stdlib/base64' },
    { name: 'UnicodeEncodeError',     slug: 'unicodeencodeerror', when: 'What errors="strict" raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between quote and quote_plus?',
      a: "quote writes a space as %20 and keeps '/' by default (safe='/'); it is meant for URL paths. quote_plus writes a space as + and has safe='', the form-encoding style used in query strings — so a literal + becomes %2B. unquote_plus reverses quote_plus.",
    },
    {
      q: 'Why does urllib.parse.quote not encode the slash?',
      a: "Because its safe parameter defaults to '/'. Pass safe='' to encode / as %2F, for example when the value is one path segment or a query value.",
    },
    {
      q: 'What is the Python equivalent of JavaScript encodeURIComponent?',
      a: "quote(text, safe=\"!*'()\") gives the same result: encodeURIComponent leaves A-Z a-z 0-9 - _ . ! ~ * ' ( ) unencoded, and quote always keeps the letters, digits and - _ . ~. Plain quote(text, safe='') additionally encodes ! * ' ( ).",
    },
    {
      q: 'How do I URL-encode a whole dict of parameters?',
      a: "Use urlencode({'q': 'x y', 'page': 2}), which applies quote_plus to every key and value and joins them with & and =.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.quote',
    meta:  'urllib.parse.quote',
  },

};
