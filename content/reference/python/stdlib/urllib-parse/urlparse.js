// content/reference/python/stdlib/urllib-parse/urlparse.js — urlparse, urlunparse, ParseResult

export const meta = {
  slug:        'urlparse',
  name:        'urllib.parse.urlparse',
  signature:   "urllib.parse.urlparse(url, scheme='', allow_fragments=True)",
  blurb:       'Split a URL into six parts — scheme, netloc, path, params, query, fragment — as a ParseResult with hostname, port, username and password attributes; urlunparse puts them back together.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib parse urlparse urlunparse ParseResult ParseResult.geturl python parse url components scheme netloc path params query fragment hostname port username password get domain from url port out of range 0-65535 invalid ipv6 url _replace geturl',
};

export const method = {
  slug:      'urlparse',
  name:      'urllib.parse.urlparse',
  signature: "urllib.parse.urlparse(url, scheme='', allow_fragments=True)",
  returns:   { type: 'ParseResult', desc: 'A named 6-tuple (scheme, netloc, path, params, query, fragment) with .hostname, .port, .username, .password and .geturl(). ParseResultBytes for bytes input.' },

  category:    'urllib.parse function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "urlparse cuts a URL at its delimiters without decoding or validating much: the parts are plain strings, % escapes stay as they are, and a URL without '//' has no netloc at all. The extra attributes do the fiddly work — .hostname is lowercased, .port is an int (or a ValueError).",

  covers: ['urlparse', 'urlunparse', 'ParseResult', 'ParseResult.geturl'],

  cheat: {
    commonCall: 'urlparse(url).hostname',
    returns:    "'example.com' — lowercased, without port or user info",
    replaces:   "url.split('/')[2] and other string surgery",
    watchOut:   "'example.com/path' (no scheme, no //) is all path; .port raises ValueError for bad ports",
  },

  parameters: [
    { name: 'url',             type: 'str | bytes', required: true,  default: null,   desc: 'The URL. Leading C0 control characters and spaces are stripped (3.12+), and tab, CR and LF are removed everywhere (3.10+).' },
    { name: 'scheme',          type: 'str | bytes', required: false, default: "''",   desc: 'The scheme to report when the URL has none. It never overrides a scheme that is present.' },
    { name: 'allow_fragments', type: 'bool',        required: false, default: 'True', desc: 'False leaves #... inside the path or query instead of splitting it into fragment.' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'urlparse',
      blurb: 'The six components. Try a URL without a scheme, or with ;params.',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'from urllib.parse import urlparse\nurlparse({$url})',
      cases: [
        { id: 'full',   label: 'every part',        values: { url: 'https://user:pw@Example.com:8080/a/b;v=1?q=x#top' } },
        { id: 'noschm', label: 'no scheme',         values: { url: 'example.com/path?q=1' } },
        { id: 'slash',  label: 'leading //',        values: { url: '//example.com/path' } },
        { id: 'mail',   label: 'mailto:',           values: { url: 'mailto:ada@example.com?subject=Hi' } },
        { id: 'ipv6',   label: 'broken IPv6',       values: { url: 'http://[::1/' } },
      ],
    },
    {
      id: 'netloc',
      label: 'host and port',
      blurb: 'The netloc helpers: (username, password, hostname, port).',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'from urllib.parse import urlparse\nu = urlparse({$url})\n(u.username, u.password, u.hostname, u.port)',
      cases: [
        { id: 'full',  label: 'user, host, port', values: { url: 'https://ada:secret@API.Example.com:8443/v1' } },
        { id: 'plain', label: 'no port',          values: { url: 'https://example.com/' } },
        { id: 'ipv6',  label: 'IPv6 host',        values: { url: 'http://[2001:DB8::1]:8000/' } },
        { id: 'range', label: 'port too big',     values: { url: 'https://example.com:99999/' } },
        { id: 'text',  label: 'port not a number', values: { url: 'https://example.com:http/' } },
      ],
    },
    {
      id: 'replace',
      label: '_replace + geturl',
      blurb: 'Swap one component and rebuild the URL.',
      params: [
        { name: 'url',   type: 'str', hint: 'a URL',          input: 'text' },
        { name: 'query', type: 'str', hint: 'the new query',  input: 'text' },
      ],
      template: 'from urllib.parse import urlparse\nurlparse({$url})._replace(query={$query}).geturl()',
      cases: [
        { id: 'page',  label: 'change query', values: { url: 'https://example.com/list?page=1#top', query: 'page=2' } },
        { id: 'drop',  label: 'remove query', values: { url: 'https://example.com/a?token=abc', query: '' } },
      ],
    },
  ],
  demoExplainer: "Without '//' there is no netloc: 'example.com/path' is entirely path, and 'mailto:ada@example.com' is a scheme plus a path. .hostname lowercases the host and drops the IPv6 brackets; .port converts to int and raises ValueError when the text is not digits ('Port could not be cast to integer value as ...') or the number is above 65535 ('Port out of range 0-65535'). An unbalanced [ in the netloc fails already in urlparse: 'Invalid IPv6 URL'.",

  patterns: [
    {
      name: 'Domain of a URL',
      desc: '.hostname, not .netloc — netloc still has the port and user info.',
      code: "from urllib.parse import urlparse\nhost = urlparse(url).hostname  # None if the URL has no //host",
    },
    {
      name: 'Port with a default',
      desc: '.port is None when absent.',
      code: "from urllib.parse import urlparse\nu = urlparse(url)\nport = u.port or (443 if u.scheme == 'https' else 80)",
    },
    {
      name: 'Accept URLs typed without a scheme',
      desc: "Prefix '//' (or 'https://') so the host lands in netloc.",
      code: "from urllib.parse import urlparse\nif '//' not in text:\n    text = 'https://' + text\nu = urlparse(text)",
    },
    {
      name: 'Change one part',
      desc: 'ParseResult is a namedtuple: _replace returns a new one, geturl() rebuilds the string.',
      code: "from urllib.parse import urlparse\nclean = urlparse(url)._replace(query='', fragment='').geturl()",
    },
  ],

  examples: [
    { title: 'All six components',            code: "from urllib.parse import urlparse\nurlparse('https://user:pw@Example.com:8080/a/b;v=1?q=x#top')", returns: "ParseResult(scheme='https', netloc='user:pw@Example.com:8080', path='/a/b', params='v=1', query='q=x', fragment='top')" },
    { title: 'netloc helpers',                code: "from urllib.parse import urlparse\nu = urlparse('https://user:pw@Example.com:8080/a/b?q=x#top')\n(u.hostname, u.port, u.username, u.password)", returns: "('example.com', 8080, 'user', 'pw')" },
    { title: 'No // means no netloc',         code: "from urllib.parse import urlparse\nurlparse('example.com/path')",            returns: "ParseResult(scheme='', netloc='', path='example.com/path', params='', query='', fragment='')" },
    { title: "'host:port' looks like a scheme", code: "from urllib.parse import urlparse\nurlparse('localhost:8000')",            returns: "ParseResult(scheme='localhost', netloc='', path='8000', params='', query='', fragment='')" },
    { title: 'Port out of range',             code: "from urllib.parse import urlparse\nurlparse('https://example.com:99999/').port", returns: 'ValueError: Port out of range 0-65535' },
    { title: 'urlunparse',                    code: "from urllib.parse import urlunparse\nurlunparse(('https', 'example.com', '/a', '', 'q=1', ''))", returns: "'https://example.com/a?q=1'" },
    { title: 'ParseResult.geturl',            code: "from urllib.parse import ParseResult\nParseResult('https', 'example.com', '/a', '', '', 'top').geturl()", returns: "'https://example.com/a#top'" },
    { title: 'Tabs and newlines are removed', code: "from urllib.parse import urlparse\nurlparse('https://exa\\tmple.com/').netloc", returns: "'example.com'" },
  ],

  pitfalls: [
    {
      name: 'Parsing a URL without a scheme',
      desc: "Only '//' starts a netloc. Text typed by users ('example.com/page') has no host as far as urlparse is concerned.",
      wrong: { label: 'bare domain', code: "from urllib.parse import urlparse\nu = urlparse('example.com/page')\n(u.hostname, u.path)",   output: "(None, 'example.com/page')" },
      fix:   { label: "add '//'",    code: "from urllib.parse import urlparse\nu = urlparse('//example.com/page')\n(u.hostname, u.path)", output: "('example.com', '/page')" },
    },
    {
      name: 'Using netloc as the host name',
      desc: 'netloc is everything between // and the path: user info, host and port, with the original capitals.',
      wrong: { label: 'netloc',   code: "from urllib.parse import urlparse\nurlparse('https://ada@Example.com:8080/').netloc",   output: "'ada@Example.com:8080'" },
      fix:   { label: 'hostname', code: "from urllib.parse import urlparse\nurlparse('https://ada@Example.com:8080/').hostname", output: "'example.com'" },
    },
    {
      name: 'urlunparse wants six parts',
      desc: 'urlunparse takes the 6-tuple of urlparse (with params). A 5-tuple from urlsplit belongs in urlunsplit.',
      wrong: { label: '5 parts', code: "from urllib.parse import urlunparse\nurlunparse(('https', 'example.com', '/a', '', 'q=1'))",     output: 'ValueError: not enough values to unpack (expected 7, got 6)' },
      fix:   { label: '6 parts', code: "from urllib.parse import urlunparse\nurlunparse(('https', 'example.com', '/a', '', 'q=1', ''))", output: "'https://example.com/a?q=1'" },
    },
  ],

  when: {
    use: [
      'Reading the scheme, host, port or path of a URL',
      'Changing one part of a URL: _replace + geturl',
      'Old ;params syntax matters to you (rare)',
    ],
    avoid: [
      'Most new code → urlsplit (same thing without the rarely used params split)',
      'Query parameters → parse_qs(urlsplit(url).query)',
      'Validating that a string is a URL → urlparse accepts almost anything',
    ],
  },

  notes: {
    cpython:      'urlparse calls urlsplit and then, for schemes in uses_params (http, https, ftp, …), splits ;params off the last path segment',
    'Validation': "Very little: unbalanced brackets, invalid bracketed hosts and NFKC-unsafe netlocs raise ValueError; everything else parses",
    'Exceptions': "ValueError from urlparse for bad IPv6 brackets; ValueError from .port; TypeError when str and bytes are mixed",
  },

  related: [
    { name: 'urllib.parse.urlsplit', slug: 'urlsplit', when: 'The 5-part version most code wants' },
    { name: 'urllib.parse.parse_qs', slug: 'parse_qs', when: 'Decode the query component' },
    { name: 'urllib.parse.urljoin',  slug: 'urljoin',  when: 'Resolve a relative link' },
    { name: 'ParseResultBytes',      slug: 'bytes-results', when: 'What bytes input returns' },
    { name: 'urllib.parse module',   slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
    { name: 'ValueError',            slug: 'valueerror', when: 'What .port and bad IPv6 URLs raise', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I get the domain name from a URL in Python?',
      a: "urlparse(url).hostname — it strips user info and port and lowercases the host. It is None when the URL has no '//' part, e.g. 'example.com/page'.",
    },
    {
      q: 'What is the difference between urlparse and urlsplit?',
      a: "urlparse returns 6 parts and splits ;params off the last path segment; urlsplit returns 5 parts and leaves ;params in the path. Modern URLs rarely use params, so the docs recommend urlsplit.",
    },
    {
      q: "Why does urlparse('example.com') put everything in path?",
      a: "Because netloc only starts after '//'. Without a scheme and '//', the whole string is a relative path. Prefix '//' or 'https://' before parsing.",
    },
    {
      q: "Why do I get 'Port out of range 0-65535'?",
      a: 'The .port attribute converts the port text to int and raises ValueError when it is above 65535 (since Python 3.6). Non-digit ports raise "Port could not be cast to integer value as ...". urlparse itself does not check.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urlparse',
    meta:  'urllib.parse.urlparse',
  },

};
