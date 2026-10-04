// content/reference/python/stdlib/urllib-parse/urlsplit.js — urlsplit, urlunsplit, SplitResult

export const meta = {
  slug:        'urlsplit',
  name:        'urllib.parse.urlsplit',
  signature:   "urllib.parse.urlsplit(url, scheme='', allow_fragments=True)",
  blurb:       'Split a URL into five parts — scheme, netloc, path, query, fragment — as a SplitResult; urlunsplit joins five parts back into a URL.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib parse urlsplit urlunsplit SplitResult SplitResult.geturl python split url into parts build url from components scheme netloc path query fragment _replace _asdict round trip normalize url empty query dropped',
};

export const method = {
  slug:      'urlsplit',
  name:      'urllib.parse.urlsplit',
  signature: "urllib.parse.urlsplit(url, scheme='', allow_fragments=True)",
  returns:   { type: 'SplitResult', desc: 'A named 5-tuple (scheme, netloc, path, query, fragment) with .hostname, .port, .username, .password and .geturl(). SplitResultBytes for bytes input.' },

  category:    'urllib.parse function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "The URL splitter to reach for first: five plain-string parts, nothing decoded, ;params left in the path. urlunsplit is its inverse — up to cosmetics: an empty '?' or '#' is dropped on the way back.",

  covers: ['urlsplit', 'urlunsplit', 'SplitResult', 'SplitResult.geturl'],

  cheat: {
    commonCall: 'urlsplit(url).path',
    returns:    "'/a/b;v=1' — params stay in the path",
    replaces:   'urlparse when you do not need ;params split off',
    watchOut:   'urlunsplit takes exactly 5 parts — not the 6 of urlparse',
  },

  parameters: [
    { name: 'url',             type: 'str | bytes', required: true,  default: null,   desc: 'The URL. Leading C0 control characters and spaces are stripped (3.12+); tab, CR and LF are removed everywhere (3.10+). The scheme is lowercased.' },
    { name: 'scheme',          type: 'str | bytes', required: false, default: "''",   desc: 'Default scheme for URLs that have none.' },
    { name: 'allow_fragments', type: 'bool',        required: false, default: 'True', desc: 'False keeps #... as part of the path or query.' },
  ],

  modes: [
    {
      id: 'split',
      label: 'urlsplit',
      blurb: 'The five components. Compare with urlparse: ;params stay in path.',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'from urllib.parse import urlsplit\nurlsplit({$url})',
      cases: [
        { id: 'full',   label: 'every part',   values: { url: 'HTTPS://Example.com:8080/a/b;v=1?q=x#top' } },
        { id: 'rel',    label: 'relative',     values: { url: '../img/logo.png?v=2' } },
        { id: 'space',  label: 'leading space', values: { url: '  https://example.com/' } },
        { id: 'frag',   label: 'two #',        values: { url: 'https://example.com/#a#b' } },
      ],
    },
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'urlunsplit(urlsplit(url)) — what survives.',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'from urllib.parse import urlsplit, urlunsplit\nurlunsplit(urlsplit({$url}))',
      cases: [
        { id: 'same',  label: 'unchanged',        values: { url: 'https://example.com/a?q=1#f' } },
        { id: 'empty', label: 'empty ? and #',    values: { url: 'https://example.com/a?#' } },
        { id: 'case',  label: 'scheme case',      values: { url: 'HTTP://Example.com' } },
      ],
    },
    {
      id: 'build',
      label: 'urlunsplit',
      blurb: 'Build a URL from parts: scheme https, your netloc, path and query.',
      params: [
        { name: 'netloc', type: 'str', hint: 'host[:port]', input: 'text' },
        { name: 'path',   type: 'str', hint: 'path',        input: 'text' },
        { name: 'query',  type: 'str', hint: 'query',       input: 'text' },
      ],
      template: "from urllib.parse import urlunsplit\nurlunsplit(('https', {$netloc}, {$path}, {$query}, ''))",
      cases: [
        { id: 'basic', label: 'host + path',        values: { netloc: 'example.com', path: '/search', query: 'q=python' } },
        { id: 'noslash', label: 'path without /',   values: { netloc: 'example.com', path: 'a/b', query: '' } },
        { id: 'nohost', label: 'no netloc',         values: { netloc: '', path: '/local', query: 'x=1' } },
      ],
    },
  ],
  demoExplainer: "The scheme is lowercased ('HTTPS' → 'https') but the host is not — use .hostname for that. Leading spaces and control characters are stripped before parsing. Only the first # starts the fragment. On the way back, urlunsplit adds the '/' a path needs after a netloc, and an empty query or fragment simply disappears, so 'https://example.com/a?#' comes back as 'https://example.com/a'.",

  patterns: [
    {
      name: 'Strip query and fragment',
      desc: 'A canonical form for caching or comparison.',
      code: "from urllib.parse import urlsplit, urlunsplit\ns = urlsplit(url)\nbase = urlunsplit((s.scheme, s.netloc, s.path, '', ''))",
    },
    {
      name: 'Replace the query',
      desc: '_replace returns a new SplitResult; geturl() calls urlunsplit.',
      code: "from urllib.parse import urlsplit, urlencode\nnew_url = urlsplit(url)._replace(query=urlencode(params)).geturl()",
    },
    {
      name: 'Check the scheme before fetching',
      desc: 'Reject file:, javascript: and friends.',
      code: "from urllib.parse import urlsplit\nif urlsplit(url).scheme not in ('http', 'https'):\n    raise ValueError('only http(s) URLs are allowed')",
    },
  ],

  examples: [
    { title: 'Five components',             code: "from urllib.parse import urlsplit\nurlsplit('https://example.com/a/b;v=1?q=x#top')", returns: "SplitResult(scheme='https', netloc='example.com', path='/a/b;v=1', query='q=x', fragment='top')" },
    { title: 'The scheme is lowercased',    code: "from urllib.parse import urlsplit\nurlsplit('HTTPS://Example.COM/Path')[:2]",        returns: "('https', 'Example.COM')" },
    { title: 'Tuple unpacking',             code: "from urllib.parse import urlsplit\nscheme, netloc, path, query, fragment = urlsplit('https://example.com/a?q=1')\nnetloc", returns: "'example.com'" },
    { title: 'Empty ? and # are dropped',   code: "from urllib.parse import urlsplit, urlunsplit\nurlunsplit(urlsplit('https://example.com/a?#'))", returns: "'https://example.com/a'" },
    { title: 'urlunsplit adds the slash',   code: "from urllib.parse import urlunsplit\nurlunsplit(('https', 'example.com', 'a/b', 'x=1', ''))", returns: "'https://example.com/a/b?x=1'" },
    { title: 'SplitResult.geturl',          code: "from urllib.parse import SplitResult\nSplitResult('https', 'example.com', '/a', 'q=1', '').geturl()", returns: "'https://example.com/a?q=1'" },
    { title: '_asdict()',                   code: "from urllib.parse import urlsplit\nurlsplit('https://example.com/a')._asdict()", returns: "{'scheme': 'https', 'netloc': 'example.com', 'path': '/a', 'query': '', 'fragment': ''}" },
  ],

  pitfalls: [
    {
      name: 'Misspelling a field in _replace',
      desc: "The fields are scheme, netloc, path, query, fragment — there is no 'host'. Since 3.13 an unknown name raises TypeError.",
      wrong: { label: 'host=',   code: "from urllib.parse import urlsplit\nurlsplit('https://example.com/a')._replace(host='example.org')",   output: "TypeError: Got unexpected field names: ['host']" },
      fix:   { label: 'netloc=', code: "from urllib.parse import urlsplit\nurlsplit('https://example.com/a')._replace(netloc='example.org').geturl()", output: "'https://example.org/a'" },
    },
    {
      name: 'Passing four parts to urlunsplit',
      desc: 'urlunsplit needs all five parts, fragment included — use an empty string for parts you do not have.',
      wrong: { label: '4 parts', code: "from urllib.parse import urlunsplit\nurlunsplit(('https', 'example.com', '/a', 'q=1'))",     output: 'ValueError: not enough values to unpack (expected 6, got 5)' },
      fix:   { label: '5 parts', code: "from urllib.parse import urlunsplit\nurlunsplit(('https', 'example.com', '/a', 'q=1', ''))", output: "'https://example.com/a?q=1'" },
    },
    {
      name: 'Expecting the host to be lowercased',
      desc: 'urlsplit lowercases only the scheme. Compare hosts with .hostname, which is lowercased.',
      wrong: { label: 'netloc',   code: "from urllib.parse import urlsplit\nurlsplit('https://Example.COM/').netloc == 'example.com'",   output: 'False' },
      fix:   { label: 'hostname', code: "from urllib.parse import urlsplit\nurlsplit('https://Example.COM/').hostname == 'example.com'", output: 'True' },
    },
  ],

  when: {
    use: [
      'Any time you need the parts of a URL',
      'Rebuilding a URL after changing a part (_replace + geturl, or urlunsplit)',
    ],
    avoid: [
      'Legacy ;params handling → urlparse',
      'Resolving a relative link against a page URL → urljoin',
      'Decoding the query → parse_qs on .query',
    ],
  },

  notes: {
    cpython:       "Strips leading C0/space and removes tab/CR/LF, takes the scheme if the text before ':' is a valid scheme starting with a letter, takes the netloc after '//' up to the first / ? or #, then splits off # and ?; results are cached (functools.lru_cache)",
    'Errors':      "ValueError: 'Invalid IPv6 URL' for unbalanced brackets, '... does not appear to be an IPv4 or IPv6 address', 'An IPv4 address cannot be in brackets', and NFKC-unsafe netlocs",
    '_replace':    'An unknown field name raises TypeError in 3.13 (ValueError before)',
  },

  related: [
    { name: 'urllib.parse.urlparse', slug: 'urlparse', when: 'The 6-part version with ;params' },
    { name: 'urllib.parse.parse_qs', slug: 'parse_qs', when: 'Decode the query component' },
    { name: 'urllib.parse.urljoin',  slug: 'urljoin',  when: 'Resolve a relative URL' },
    { name: 'SplitResultBytes',      slug: 'bytes-results', when: 'What bytes input returns' },
    { name: 'urllib.parse module',   slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
    { name: 'collections.namedtuple', slug: 'namedtuple', when: 'Where _replace and _asdict come from', category: 'stdlib/collections' },
  ],

  faq: [
    {
      q: 'Should I use urlsplit or urlparse?',
      a: 'urlsplit. The Python docs say urlsplit() should generally be used instead of urlparse(); urlparse only adds the split of ;params off the last path segment, a feature from obsolete RFCs.',
    },
    {
      q: 'How do I rebuild a URL from its parts?',
      a: "urlunsplit((scheme, netloc, path, query, fragment)), or change one field with urlsplit(url)._replace(query='a=1').geturl().",
    },
    {
      q: 'Why does urlunsplit(urlsplit(url)) not give back exactly my URL?',
      a: "Empty delimiters are dropped (a bare '?' or '#'), the scheme comes back lowercased, and tabs, newlines and leading spaces were removed when splitting. The result is an equivalent URL.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urlsplit',
    meta:  'urllib.parse.urlsplit',
  },

};
