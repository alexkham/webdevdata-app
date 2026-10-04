// content/reference/python/stdlib/urllib-parse/bytes-results.js — ParseResultBytes, SplitResultBytes, DefragResultBytes

export const meta = {
  slug:        'bytes-results',
  name:        'urllib.parse.ParseResultBytes',
  signature:   'urllib.parse.ParseResultBytes(scheme, netloc, path, params, query, fragment)',
  blurb:       'The bytes twins of ParseResult, SplitResult and DefragResult: what urlparse, urlsplit and urldefrag return for bytes input, with .decode() back to str.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'urllib parse ParseResultBytes SplitResultBytes DefragResultBytes ParseResultBytes.geturl SplitResultBytes.geturl DefragResultBytes.geturl python parse url bytes urlparse bytes decode encode ascii codec cannot decode cannot mix str and non-str arguments',
};

export const method = {
  slug:      'bytes-results',
  name:      'urllib.parse.ParseResultBytes',
  signature: 'urllib.parse.ParseResultBytes(scheme, netloc, path, params, query, fragment)',
  returns:   { type: 'ParseResultBytes | SplitResultBytes | DefragResultBytes', desc: 'Named tuples of bytes fields. .decode(encoding="ascii", errors="strict") returns the str class; geturl() returns bytes.' },

  category:    'urllib.parse class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "Give urlparse, urlsplit or urldefrag bytes and every field comes back as bytes, in a *Bytes result class. Internally the bytes are decoded as ASCII, parsed as str and encoded again — so the input must be pure ASCII, and str and bytes arguments cannot be mixed.",

  covers: [
    'ParseResultBytes', 'SplitResultBytes', 'DefragResultBytes',
    'ParseResultBytes.geturl', 'SplitResultBytes.geturl', 'DefragResultBytes.geturl',
  ],

  cheat: {
    commonCall: "urlsplit(b'https://example.com/a')",
    returns:    "SplitResultBytes(scheme=b'https', netloc=b'example.com', ...)",
    replaces:   'decoding the URL bytes yourself before parsing',
    watchOut:   'Non-ASCII bytes raise UnicodeDecodeError — percent-encode them first',
  },

  parameters: [
    { name: 'scheme, netloc, path, params, query, fragment', type: 'bytes', required: true, default: null, desc: 'ParseResultBytes fields (SplitResultBytes has no params; DefragResultBytes has url and fragment). Usually created by the parse functions, not by hand.' },
  ],

  modes: [
    {
      id: 'split',
      label: 'urlsplit(bytes)',
      blurb: 'The URL text encoded as UTF-8 bytes, then split. Non-ASCII characters make it fail.',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'from urllib.parse import urlsplit\nurlsplit({$url}.encode())',
      cases: [
        { id: 'ascii', label: 'ASCII URL',     values: { url: 'https://Example.com:8080/a?q=1#f' } },
        { id: 'utf8',  label: 'non-ASCII path', values: { url: 'https://example.com/café' } },
      ],
    },
    {
      id: 'attrs',
      label: 'attributes and decode()',
      blurb: '.hostname and .port work on bytes too; .decode() gives back the str result.',
      params: [{ name: 'url', type: 'str', hint: 'an ASCII URL', input: 'text' }],
      template: 'from urllib.parse import urlparse\nr = urlparse({$url}.encode())\n(r.hostname, r.port, r.geturl(), r.decode())',
      cases: [
        { id: 'host', label: 'host and port', values: { url: 'https://user@API.Example.com:8443/v1;x?y=1' } },
        { id: 'bad',  label: 'bad port',      values: { url: 'https://example.com:99999/' } },
      ],
    },
  ],
  demoExplainer: "Bytes input is decoded with the ascii codec before parsing, so 'café' encoded as UTF-8 fails at the first byte of é: \"'ascii' codec can't decode byte 0xc3 in position ...\". Everything else works as for str: .hostname is lowercased bytes, .port is an int, geturl() returns bytes and .decode() converts the whole result to ParseResult.",

  patterns: [
    {
      name: 'Parse URLs read as bytes',
      desc: 'Raw HTTP or log data; decode the result once at the end.',
      code: "from urllib.parse import urlsplit\nparts = urlsplit(raw_url_bytes)\nhost = parts.hostname.decode('ascii')",
    },
    {
      name: 'Convert between the two families',
      desc: 'encode() on a str result, decode() on a bytes result (ASCII by default).',
      code: "from urllib.parse import urlparse\nb = urlparse(url).encode('utf-8')\ns = b.decode('utf-8')",
    },
  ],

  examples: [
    { title: 'urlparse(bytes)',               code: "from urllib.parse import urlparse\nurlparse(b'https://example.com/a?q=1')", returns: "ParseResultBytes(scheme=b'https', netloc=b'example.com', path=b'/a', params=b'', query=b'q=1', fragment=b'')" },
    { title: 'hostname is bytes, port is int', code: "from urllib.parse import urlsplit\nr = urlsplit(b'https://Example.com:8080/')\n(r.hostname, r.port)", returns: "(b'example.com', 8080)" },
    { title: 'decode() → ParseResult',        code: "from urllib.parse import urlparse\nurlparse(b'https://example.com/a').decode()", returns: "ParseResult(scheme='https', netloc='example.com', path='/a', params='', query='', fragment='')" },
    { title: 'encode() → ParseResultBytes',   code: "from urllib.parse import urlparse\nurlparse('https://example.com/a').encode()", returns: "ParseResultBytes(scheme=b'https', netloc=b'example.com', path=b'/a', params=b'', query=b'', fragment=b'')" },
    { title: 'SplitResultBytes.geturl',       code: "from urllib.parse import urlsplit\nurlsplit(b'https://example.com/a#f').geturl()",  returns: "b'https://example.com/a#f'" },
    { title: 'ParseResultBytes.geturl',       code: "from urllib.parse import urlparse\nurlparse(b'https://example.com/a;p').geturl()", returns: "b'https://example.com/a;p'" },
    { title: 'DefragResultBytes.geturl',      code: "from urllib.parse import urldefrag\nurldefrag(b'https://example.com/a#f').geturl()", returns: "b'https://example.com/a#f'" },
  ],

  pitfalls: [
    {
      name: 'Raw UTF-8 bytes in the URL',
      desc: 'The bytes are decoded as ASCII before parsing. Percent-encode non-ASCII bytes first (quote_from_bytes), or parse the str.',
      wrong: { label: 'raw é',          code: "from urllib.parse import urlsplit\nurlsplit('https://example.com/café'.encode())",                     output: "UnicodeDecodeError: 'ascii' codec can't decode byte 0xc3 in position 23: ordinal not in range(128)" },
      fix:   { label: 'percent-encoded', code: "from urllib.parse import urlsplit, quote\nurlsplit(quote('https://example.com/café', safe=':/').encode()).path", output: "b'/caf%C3%A9'" },
    },
    {
      name: 'Mixing str and bytes arguments',
      desc: 'All arguments must be str, or all bytes. The default scheme must be bytes too.',
      wrong: { label: "scheme='http'",  code: "from urllib.parse import urlsplit\nurlsplit(b'example.com/a', 'http')",  output: 'TypeError: Cannot mix str and non-str arguments' },
      fix:   { label: "scheme=b'http'", code: "from urllib.parse import urlsplit\nurlsplit(b'example.com/a', b'http').scheme", output: "b'http'" },
    },
    {
      name: 'encode() with non-ASCII fields',
      desc: "A str result's encode() defaults to ASCII; give it the encoding you want.",
      wrong: { label: 'encode()',        code: "from urllib.parse import urlparse\nurlparse('https://example.com/café').encode()",        output: "UnicodeEncodeError: 'ascii' codec can't encode character '\\xe9' in position 4: ordinal not in range(128)" },
      fix:   { label: "encode('utf-8')", code: "from urllib.parse import urlparse\nurlparse('https://example.com/café').encode('utf-8').path", output: "b'/caf\\xc3\\xa9'" },
    },
  ],

  when: {
    use: [
      'URLs that arrive as bytes (sockets, binary logs) and are pure ASCII',
      'Keeping a bytes pipeline bytes end to end',
    ],
    avoid: [
      'Text URLs → the str functions and ParseResult / SplitResult',
      'Non-ASCII bytes → percent-encode them, or decode to str first',
    ],
  },

  notes: {
    cpython:       "_coerce_args decodes every bytes argument with 'ascii' strict, the str parser runs, and the result's encode() (ascii strict) produces the *Bytes class",
    'Classes':     'ParseResultBytes, SplitResultBytes and DefragResultBytes subclass the same namedtuples as their str twins; the netloc helpers (hostname, port, username, password) work on bytes',
    'Since':       'Python 3.2 — bytes input to the URL parsing functions and these classes were added together',
  },

  related: [
    { name: 'urllib.parse.urlparse',  slug: 'urlparse',  when: 'ParseResult, the str version' },
    { name: 'urllib.parse.urlsplit',  slug: 'urlsplit',  when: 'SplitResult, the str version' },
    { name: 'urllib.parse.urldefrag', slug: 'urldefrag', when: 'DefragResult, the str version' },
    { name: 'urllib.parse module',    slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
    { name: 'UnicodeDecodeError',     slug: 'unicodedecodeerror', when: 'What non-ASCII bytes raise', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Can urlparse parse bytes?',
      a: "Yes, since Python 3.2: urlparse(b'https://example.com/') returns a ParseResultBytes with bytes fields. The bytes must be ASCII — non-ASCII bytes raise UnicodeDecodeError.",
    },
    {
      q: 'How do I convert ParseResultBytes to ParseResult?',
      a: "Call .decode() (ASCII by default, or .decode('utf-8')). The reverse is ParseResult.encode().",
    },
    {
      q: "What does 'Cannot mix str and non-str arguments' mean?",
      a: "One argument is str and another is bytes — for example urlsplit(b'...', 'http') or urljoin(b'...', '...'). Make them all the same type.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.ParseResultBytes',
    meta:  'urllib.parse.ParseResultBytes',
  },

};
