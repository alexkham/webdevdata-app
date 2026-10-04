// content/reference/python/stdlib/urllib-parse/unquote.js — unquote, unquote_plus, unquote_to_bytes

export const meta = {
  slug:        'unquote',
  name:        'urllib.parse.unquote',
  signature:   "urllib.parse.unquote(string, encoding='utf-8', errors='replace')",
  blurb:       'Decode %XX escapes back into characters. unquote_plus also turns + into a space (form data); unquote_to_bytes returns the raw bytes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib parse unquote unquote_plus unquote_to_bytes python url decode percent decoding %20 plus to space decodeURIComponent python equivalent replacement character invalid utf-8 double encoded %25',
};

export const method = {
  slug:      'unquote',
  name:      'urllib.parse.unquote',
  signature: "urllib.parse.unquote(string, encoding='utf-8', errors='replace')",
  returns:   { type: 'str', desc: 'The text with every valid %XX escape decoded. unquote_to_bytes returns bytes instead.' },

  category:    'urllib.parse function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "The reverse of quote. unquote decodes %XX escapes and leaves + alone; unquote_plus decodes form data, where + means a space. Invalid UTF-8 never raises by default — errors='replace' turns it into the U+FFFD replacement character.",

  covers: ['unquote', 'unquote_plus', 'unquote_to_bytes'],

  cheat: {
    commonCall: "unquote('caf%C3%A9')",
    returns:    "'café'",
    replaces:   'decoding %XX escapes by hand',
    watchOut:   'unquote keeps + as +; form data needs unquote_plus',
  },

  parameters: [
    { name: 'string',   type: 'str | bytes', required: true,  default: null,      desc: 'Percent-encoded text. bytes are accepted by unquote since 3.9 (not by unquote_plus). A % that is not followed by two hex digits is kept as it is.' },
    { name: 'encoding', type: 'str',         required: false, default: "'utf-8'", desc: 'How the decoded bytes are turned into characters.' },
    { name: 'errors',   type: 'str',         required: false, default: "'replace'", desc: "What to do with bytes that are not valid in that encoding: 'replace' (U+FFFD), 'strict' (raise UnicodeDecodeError), 'ignore', …" },
  ],

  modes: [
    {
      id: 'compare',
      label: 'unquote vs unquote_plus',
      blurb: 'The same encoded text decoded both ways. Only unquote_plus turns + into a space.',
      params: [{ name: 'text', type: 'str', hint: 'percent-encoded text', input: 'text' }],
      template: 'from urllib.parse import unquote, unquote_plus\n(unquote({$text}), unquote_plus({$text}))',
      cases: [
        { id: 'form',  label: 'form data',      values: { text: 'rock+%26+roll' } },
        { id: 'utf8',  label: 'UTF-8 escapes',  values: { text: 'caf%C3%A9%20%E2%82%AC' } },
        { id: 'plus',  label: 'encoded plus',   values: { text: 'C%2B%2B+tips' } },
        { id: 'stray', label: 'stray %',        values: { text: '100% sure %zz' } },
      ],
    },
    {
      id: 'bytes',
      label: 'unquote_to_bytes',
      blurb: 'The raw bytes behind the escapes, before any decoding.',
      params: [{ name: 'text', type: 'str', hint: 'percent-encoded text', input: 'text' }],
      template: 'from urllib.parse import unquote_to_bytes\nunquote_to_bytes({$text})',
      cases: [
        { id: 'utf8',  label: 'UTF-8 é',       values: { text: 'caf%C3%A9' } },
        { id: 'latin', label: 'Latin-1 é',     values: { text: 'caf%E9' } },
        { id: 'raw',   label: 'non-ASCII text', values: { text: 'é%20x' } },
      ],
    },
    {
      id: 'encoding',
      label: 'wrong encoding',
      blurb: 'Bytes that are not valid UTF-8 become U+FFFD by default. Decoding as Latin-1 recovers them.',
      params: [{ name: 'text', type: 'str', hint: 'percent-encoded text', input: 'text' }],
      template: "from urllib.parse import unquote\n(unquote({$text}), unquote({$text}, encoding='latin-1'))",
      cases: [
        { id: 'latin', label: 'Latin-1 escapes', values: { text: '%E9t%E9' } },
        { id: 'utf8',  label: 'UTF-8 escapes',   values: { text: '%C3%A9t%C3%A9' } },
      ],
    },
  ],
  demoExplainer: "unquote decodes the %XX escapes as one block of bytes and then decodes those bytes as UTF-8, so %C3%A9 is a single é. A % that is not followed by two hex digits — '100% sure', '%zz' — is left exactly as it is, never an error. When the bytes are not valid UTF-8 (%E9 alone is Latin-1 é), the default errors='replace' puts U+FFFD in their place.",

  patterns: [
    {
      name: 'Decode a form-encoded value',
      desc: 'HTML forms send spaces as +.',
      code: "from urllib.parse import unquote_plus\nname = unquote_plus(raw_value)",
    },
    {
      name: 'Read a percent-encoded path segment',
      desc: 'Split on / first, then decode each segment, so an encoded %2F stays inside its segment.',
      code: "from urllib.parse import unquote, urlsplit\nsegments = [unquote(s) for s in urlsplit(url).path.split('/')]",
    },
    {
      name: 'Fail loudly on bad UTF-8',
      desc: "errors='strict' raises instead of inserting U+FFFD.",
      code: "from urllib.parse import unquote\ntext = unquote(value, errors='strict')",
    },
  ],

  examples: [
    { title: 'Decode UTF-8 escapes',          code: "from urllib.parse import unquote\nunquote('caf%C3%A9%20%E2%82%AC')",    returns: "'café €'" },
    { title: 'unquote keeps +',               code: "from urllib.parse import unquote\nunquote('rock+%26+roll')",           returns: "'rock+&+roll'" },
    { title: 'unquote_plus: + is a space',    code: "from urllib.parse import unquote_plus\nunquote_plus('rock+%26+roll')", returns: "'rock & roll'" },
    { title: 'Invalid escapes stay',          code: "from urllib.parse import unquote\nunquote('100% %zz%4')",              returns: "'100% %zz%4'" },
    { title: 'Raw bytes',                     code: "from urllib.parse import unquote_to_bytes\nunquote_to_bytes('a%20b%FF')", returns: "b'a b\\xff'" },
    { title: 'bytes input (3.9+)',            code: "from urllib.parse import unquote\nunquote(b'a%20b')",                  returns: "'a b'" },
    { title: 'Double-encoded text needs two passes', code: "from urllib.parse import unquote\n(unquote('%2541'), unquote(unquote('%2541')))", returns: "('%41', 'A')" },
  ],

  pitfalls: [
    {
      name: 'unquote on form data',
      desc: 'Browsers encode a space in a form field as +. unquote leaves it, so names come out as Ada+Lovelace.',
      wrong: { label: 'unquote',      code: "from urllib.parse import unquote\nunquote('Ada+Lovelace')",                output: "'Ada+Lovelace'" },
      fix:   { label: 'unquote_plus', code: "from urllib.parse import unquote_plus\nunquote_plus('Ada+Lovelace')",      output: "'Ada Lovelace'" },
    },
    {
      name: 'Silent U+FFFD for a different encoding',
      desc: "Text encoded as Latin-1 (%E9 for é) is not valid UTF-8. The default errors='replace' hides the problem; say the encoding when you know it.",
      wrong: { label: 'default utf-8', code: "from urllib.parse import unquote\nunquote('caf%E9')",                       output: "'caf�'" },
      fix:   { label: "encoding='latin-1'", code: "from urllib.parse import unquote\nunquote('caf%E9', encoding='latin-1')", output: "'café'" },
    },
    {
      name: 'unquote_plus with bytes',
      desc: "unquote accepts bytes, but unquote_plus calls string.replace('+', ' ') with str arguments, which bytes reject.",
      wrong: { label: 'unquote_plus(bytes)', code: "from urllib.parse import unquote_plus\nunquote_plus(b'a+b')",                        output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'replace first',       code: "from urllib.parse import unquote\nunquote(b'a+b'.replace(b'+', b' '))",               output: "'a b'" },
    },
  ],

  when: {
    use: [
      'Reading a percent-encoded path segment or value: unquote',
      'Reading form data or a query value by hand: unquote_plus',
      'Binary data in a URL: unquote_to_bytes',
    ],
    avoid: [
      'A whole query string → parse_qs / parse_qsl (they decode with unquote_plus)',
      'Decoding a full URL before splitting it → urlsplit first, then decode the parts',
    ],
  },

  notes: {
    cpython:       'unquote finds runs of ASCII characters, turns each run into bytes with unquote_to_bytes and decodes them; non-ASCII characters in the input are passed through untouched',
    'Errors':      "errors defaults to 'replace', not 'strict' — unquote never raises for bad UTF-8 unless you ask",
    'Invalid %':   'A % not followed by two hex digits is copied literally',
  },

  related: [
    { name: 'urllib.parse.quote',    slug: 'quote',    when: 'The reverse: characters → %XX' },
    { name: 'urllib.parse.parse_qs', slug: 'parse_qs', when: 'Decode a whole query string' },
    { name: 'urllib.parse module',   slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
    { name: 'decodeURIComponent()',  slug: 'global-decodeuricomponent', when: 'The JavaScript equivalent (throws on bad UTF-8)', language: 'javascript', category: 'methods', href: '/reference/javascript/methods/global-decodeuricomponent' },
    { name: 'UnicodeDecodeError',    slug: 'unicodedecodeerror', when: "What errors='strict' raises", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I URL-decode a string in Python?',
      a: "urllib.parse.unquote('caf%C3%A9') returns 'café'. For form data or query values, where + means a space, use unquote_plus.",
    },
    {
      q: 'Why does unquote not turn + into a space?',
      a: 'Because + is only a space in the form-encoding (application/x-www-form-urlencoded) used by query strings. In a path, + is a literal plus. unquote_plus is the form-data version.',
    },
    {
      q: 'Why do I get the � character after unquote?',
      a: "The escapes decode to bytes that are not valid UTF-8 — often text encoded as Latin-1, where é is %E9. unquote's default errors='replace' inserts U+FFFD; pass encoding='latin-1' if that is what the sender used, or errors='strict' to get an exception.",
    },
    {
      q: 'What is the Python equivalent of decodeURIComponent?',
      a: "unquote(text, errors='strict'). decodeURIComponent throws URIError on malformed escapes; unquote keeps an invalid % sequence as it is and, by default, replaces invalid UTF-8 with U+FFFD.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.unquote',
    meta:  'urllib.parse.unquote',
  },

};
