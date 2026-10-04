// content/reference/python/stdlib/urllib-parse/index.js — the urllib.parse module hub

export const meta = {
  slug:        'index',
  name:        'urllib.parse',
  signature:   'import urllib.parse',
  blurb:       'Split URLs into parts and put them back together, resolve relative links, and percent-encode or decode text and query strings — urlsplit, urljoin, quote, urlencode, parse_qs.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib.parse module python url parsing urlparse urlsplit urljoin urlencode parse_qs quote unquote percent encoding url encode decode query string hostname port python 3 urlparse module',
};

export const method = {
  slug: 'index',
  name: 'urllib.parse',

  category:    'Data formats',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  coverClasses: ['ParseResult', 'SplitResult', 'DefragResult', 'ParseResultBytes', 'SplitResultBytes', 'DefragResultBytes'],

  subtitle: "Two halves in one module. Parsing: urlsplit / urlparse cut a URL into named parts, urljoin resolves links, urlunsplit rebuilds. Quoting: quote / quote_plus / urlencode percent-encode, unquote / parse_qs decode. Nothing here touches the network — that is urllib.request.",

  imports: ['import urllib.parse', 'from urllib.parse import urlsplit, urljoin, urlencode, parse_qs, quote'],
  facts: [
    { label: 'Parsing',  value: 'urlsplit, urlparse, urlunsplit, urlunparse, urljoin, urldefrag — results are named tuples with .hostname, .port, .geturl()' },
    { label: 'Quoting',  value: 'quote, quote_plus, quote_from_bytes, unquote, unquote_plus, unquote_to_bytes, urlencode, parse_qs, parse_qsl' },
    { label: 'Spec',     value: 'RFC 3986 with deliberate leniency; not a WHATWG URL parser and not a validator' },
    { label: 'Python 2', value: 'The functions of Python 2 urlparse plus urllib.quote / urlencode moved here in Python 3' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'take a URL apart',
      blurb: 'urlsplit plus the netloc helpers: scheme, host, port, path, query, fragment.',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'from urllib.parse import urlsplit\nu = urlsplit({$url})\n(u.scheme, u.hostname, u.port, u.path, u.query, u.fragment)',
      cases: [
        { id: 'full',   label: 'full URL',      values: { url: 'https://Shop.Example.com:8443/cart/items?id=7&qty=2#summary' } },
        { id: 'bare',   label: 'no scheme',     values: { url: 'example.com/search?q=python' } },
        { id: 'ipv6',   label: 'IPv6 host',     values: { url: 'http://[::1]:8000/health' } },
        { id: 'port',   label: 'bad port',      values: { url: 'https://example.com:70000/' } },
      ],
    },
    {
      id: 'encode',
      label: 'encode a value',
      blurb: "quote (path style), quote with safe='', and quote_plus (form style).",
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "from urllib.parse import quote, quote_plus\n(quote({$text}), quote({$text}, safe=''), quote_plus({$text}))",
      cases: [
        { id: 'amp',   label: 'spaces, &, /', values: { text: 'R&D / Q3 report' } },
        { id: 'utf8',  label: 'non-ASCII',    values: { text: 'São Paulo' } },
      ],
    },
    {
      id: 'query',
      label: 'decode a query',
      blurb: 'parse_qs turns a query string into a dict of lists.',
      params: [{ name: 'query', type: 'str', hint: 'a query string, no ?', input: 'text' }],
      template: 'from urllib.parse import parse_qs\nparse_qs({$query})',
      cases: [
        { id: 'rep',   label: 'repeated keys',  values: { query: 'color=red&color=blue&size=M' } },
        { id: 'enc',   label: 'encoded values', values: { query: 'q=rock+%26+roll&lang=pt%2DBR' } },
      ],
    },
  ],
  demoExplainer: "urlsplit keeps the host as written in netloc; .hostname lowercases it and drops IPv6 brackets, and .port is an int or None — or a ValueError such as 'Port out of range 0-65535'. Without '//' there is no host at all. On the quoting side, quote keeps '/' unless safe='', and quote_plus writes spaces as + — the form style that parse_qs decodes.",

  patterns: [
    {
      name: 'Read query parameters',
      desc: 'Split first, then parse the query.',
      code: "from urllib.parse import urlsplit, parse_qs\nparams = parse_qs(urlsplit(url).query)",
    },
    {
      name: 'Build a URL with a query',
      desc: 'urlencode quotes every key and value.',
      code: "from urllib.parse import urlencode\nurl = 'https://example.com/search?' + urlencode({'q': term, 'page': 2})",
    },
    {
      name: 'Resolve a link',
      desc: 'Relative href → absolute URL.',
      code: "from urllib.parse import urljoin\nabsolute = urljoin(page_url, href)",
    },
    {
      name: 'Encode one path segment',
      desc: "safe='' so slashes in the value are encoded.",
      code: "from urllib.parse import quote\nurl = 'https://example.com/users/' + quote(username, safe='')",
    },
  ],

  examples: [
    { title: 'Split a URL',            code: "from urllib.parse import urlsplit\nurlsplit('https://example.com:8080/a?q=1#top')", returns: "SplitResult(scheme='https', netloc='example.com:8080', path='/a', query='q=1', fragment='top')" },
    { title: 'Host and port',          code: "from urllib.parse import urlsplit\nu = urlsplit('https://Example.com:8080/')\n(u.hostname, u.port)", returns: "('example.com', 8080)" },
    { title: 'Resolve a relative link', code: "from urllib.parse import urljoin\nurljoin('https://example.com/docs/guide.html', 'faq.html')", returns: "'https://example.com/docs/faq.html'" },
    { title: 'Build a query string',   code: "from urllib.parse import urlencode\nurlencode({'q': 'rock & roll', 'page': 2})",  returns: "'q=rock+%26+roll&page=2'" },
    { title: 'Read a query string',    code: "from urllib.parse import parse_qs\nparse_qs('tag=a&tag=b&page=2')",           returns: "{'tag': ['a', 'b'], 'page': ['2']}" },
    { title: 'Percent-encode',         code: "from urllib.parse import quote\nquote('café menu.pdf')",                         returns: "'caf%C3%A9%20menu.pdf'" },
    { title: 'Percent-decode',         code: "from urllib.parse import unquote\nunquote('caf%C3%A9%20menu.pdf')",              returns: "'café menu.pdf'" },
  ],

  pitfalls: [
    {
      name: 'quote keeps slashes by default',
      desc: "quote's safe parameter defaults to '/', which is wrong for a single path segment or a query value.",
      wrong: { label: 'quote(x)',          code: "from urllib.parse import quote\nquote('a/b c')",           output: "'a/b%20c'" },
      fix:   { label: "quote(x, safe='')", code: "from urllib.parse import quote\nquote('a/b c', safe='')", output: "'a%2Fb%20c'" },
    },
    {
      name: 'urljoin with a base that lacks a trailing slash',
      desc: 'The last path segment of the base is replaced, not extended.',
      wrong: { label: "'/v1'",  code: "from urllib.parse import urljoin\nurljoin('https://example.com/api/v1', 'users')",  output: "'https://example.com/api/users'" },
      fix:   { label: "'/v1/'", code: "from urllib.parse import urljoin\nurljoin('https://example.com/api/v1/', 'users')", output: "'https://example.com/api/v1/users'" },
    },
    {
      name: 'Building query strings by hand',
      desc: 'An & or = inside a value splits it into extra parameters on the server.',
      wrong: { label: 'f-string',  code: "from urllib.parse import parse_qs\nq = 'R&D'\nparse_qs(f'dept={q}&page=1')",                                   output: "{'dept': ['R'], 'page': ['1']}" },
      fix:   { label: 'urlencode', code: "from urllib.parse import parse_qs, urlencode\nparse_qs(urlencode({'dept': 'R&D', 'page': 1}))",                output: "{'dept': ['R&D'], 'page': ['1']}" },
    },
  ],

  when: {
    use: [
      'Reading or changing parts of a URL',
      'Turning relative links into absolute ones',
      'Encoding values for URLs and decoding query strings',
    ],
    avoid: [
      'Fetching URLs → urllib.request, or the requests / httpx packages',
      'Validating untrusted URLs for security decisions → parse, then check scheme and hostname explicitly',
      'HTML escaping → html.escape',
    ],
  },

  notes: {
    cpython:      'Lib/urllib/parse.py, pure Python. bytes input is decoded as ASCII, parsed as str and encoded back',
    'Leniency':   'Almost any string parses; only unbalanced or invalid IPv6 brackets and NFKC-unsafe netlocs raise ValueError. Since 3.10 tab, CR and LF are removed; since 3.12 leading C0 control characters and spaces are stripped',
    'Results':    'ParseResult, SplitResult and DefragResult are namedtuples: index, unpack, _replace(), _asdict(), geturl(); encode() gives the *Bytes classes',
  },

  related: [
    { name: 'json module',          slug: 'json',   when: 'Request and response bodies',                category: 'stdlib' },
    { name: 'base64 module',        slug: 'base64', when: 'urlsafe_b64encode for binary data in URLs', category: 'stdlib' },
    { name: 'ValueError',           slug: 'valueerror', when: 'What bad ports and IPv6 URLs raise',     category: 'exceptions' },
    { name: 'encodeURIComponent()', slug: 'global-encodeuricomponent', when: 'JavaScript: compare with quote(safe="")', language: 'javascript', category: 'methods', href: '/reference/javascript/methods/global-encodeuricomponent' },
    { name: 'decodeURIComponent()', slug: 'global-decodeuricomponent', when: 'JavaScript: compare with unquote',          language: 'javascript', category: 'methods', href: '/reference/javascript/methods/global-decodeuricomponent' },
  ],

  faq: [
    {
      q: 'How do I parse a URL in Python?',
      a: "from urllib.parse import urlsplit; u = urlsplit(url) — then u.scheme, u.hostname, u.port, u.path, u.query and u.fragment. parse_qs(u.query) decodes the query parameters.",
    },
    {
      q: 'How do I URL-encode a string in Python 3?',
      a: "urllib.parse.quote(text, safe='') for a value in a path, quote_plus(text) for a form-style query value, and urlencode(dict) for a whole query string. In Python 2 these were urllib.quote and urllib.urlencode.",
    },
    {
      q: 'Where did the urlparse module go in Python 3?',
      a: 'It became urllib.parse, together with the quoting functions that were in urllib. from urllib.parse import urlparse works the same way.',
    },
    {
      q: 'Does urllib.parse validate URLs?',
      a: "Barely. Almost any string parses — 'not a url' becomes a path. Check the parts you care about yourself: scheme in ('http', 'https') and a non-empty hostname.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html',
    meta:  'urllib.parse — Parse URLs into components',
  },

};
