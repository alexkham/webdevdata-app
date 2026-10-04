// content/reference/python/stdlib/urllib-parse/urlencode.js

export const meta = {
  slug:        'urlencode',
  name:        'urllib.parse.urlencode',
  signature:   "urllib.parse.urlencode(query, doseq=False, safe='', encoding=None, errors=None, quote_via=quote_plus)",
  blurb:       'Turn a dict (or a list of pairs) into a query string: every key and value goes through quote_plus and is joined with = and &.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib parse urlencode python dict to query string build query string url parameters doseq list values quote_via quote %20 instead of plus not a valid non-string sequence or mapping object URLSearchParams python equivalent',
};

export const method = {
  slug:      'urlencode',
  name:      'urllib.parse.urlencode',
  signature: "urllib.parse.urlencode(query, doseq=False, safe='', encoding=None, errors=None, quote_via=quote_plus)",
  returns:   { type: 'str', desc: "'key=value&key2=value2' with every key and value percent-encoded. No leading '?'." },

  category:    'urllib.parse function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "The way to build a query string. Values that are not str or bytes are passed through str() — so a list becomes \"['a', 'b']\" unless you pass doseq=True. Spaces become + (quote_plus); pass quote_via=quote for %20.",

  covers: ['urlencode'],

  cheat: {
    commonCall: "urlencode({'q': 'rock & roll', 'page': 2})",
    returns:    "'q=rock+%26+roll&page=2'",
    replaces:   "'&'.join(f'{k}={v}' ...) — which breaks on & = and spaces",
    watchOut:   'List values need doseq=True, or they are encoded as their repr',
  },

  parameters: [
    { name: 'query',     type: 'Mapping | sequence of pairs', required: true,  default: null,         desc: 'A dict (anything with .items()) or a list of (key, value) tuples — the list form allows repeated keys in any order. A str or a list of lists raises TypeError.' },
    { name: 'doseq',     type: 'bool',     required: false, default: 'False',      desc: 'True: a sequence value produces one key=item pair per item. False: every value goes through str().' },
    { name: 'safe',      type: 'str',      required: false, default: "''",         desc: 'Characters quote_via must not encode, e.g. "/" or ":".' },
    { name: 'encoding',  type: 'str',      required: false, default: 'None',       desc: 'Passed to quote_via for str keys and values (None means UTF-8).' },
    { name: 'errors',    type: 'str',      required: false, default: 'None',       desc: 'Passed to quote_via for str keys and values.' },
    { name: 'quote_via', type: 'callable', required: false, default: 'quote_plus', desc: 'The quoting function (3.5+). quote gives %20 for spaces instead of +.' },
  ],

  modes: [
    {
      id: 'dict',
      label: 'a dict',
      blurb: 'A search query and a page number, encoded as a query string.',
      params: [
        { name: 'q',    type: 'str', hint: 'search text', input: 'text' },
        { name: 'page', type: 'int', hint: 'page number', input: 'number' },
      ],
      template: "from urllib.parse import urlencode\nurlencode({'q': {$q}, 'page': {$page}})",
      cases: [
        { id: 'amp',   label: '& in a value',   values: { q: 'rock & roll', page: '2' } },
        { id: 'utf8',  label: 'non-ASCII',      values: { q: 'Zürich café', page: '1' } },
        { id: 'eq',    label: '= and +',        values: { q: 'a+b=c', page: '3' } },
        { id: 'slash', label: 'slash and ?',    values: { q: 'AC/DC?', page: '1' } },
      ],
    },
    {
      id: 'via',
      label: 'quote_via',
      blurb: 'The default quote_plus (space → +) next to quote_via=quote (space → %20).',
      params: [{ name: 'q', type: 'str', hint: 'a value with spaces', input: 'text' }],
      template: "from urllib.parse import urlencode, quote\n(urlencode({'q': {$q}}), urlencode({'q': {$q}}, quote_via=quote))",
      cases: [
        { id: 'space', label: 'spaces',     values: { q: 'new york city' } },
        { id: 'plus',  label: 'a plus',     values: { q: 'C++ 20' } },
        { id: 'slash', label: 'a slash',    values: { q: '/home/ada' } },
      ],
    },
    {
      id: 'doseq',
      label: 'doseq',
      blurb: 'A list value without and with doseq=True. Type comma-separated items.',
      params: [{ name: 'tags', type: 'list[str]', hint: 'comma-separated values', input: 'csv' }],
      template: "from urllib.parse import urlencode\n(urlencode({'tag': {$tags}}), urlencode({'tag': {$tags}}, doseq=True))",
      cases: [
        { id: 'two',   label: 'two tags',  values: { tags: 'python, web' } },
        { id: 'one',   label: 'one tag',   values: { tags: 'news' } },
        { id: 'none',  label: 'empty list', values: { tags: '' } },
      ],
    },
  ],
  demoExplainer: "Every key and value is quoted with quote_plus and safe='': a space becomes +, and & = + / ? are all percent-encoded, so they cannot break the query apart. With doseq=False a list is first turned into its str(), \"['python', 'web']\", and that text is encoded; doseq=True repeats the key once per item — and an empty list then produces nothing at all.",

  patterns: [
    {
      name: 'Full URL with a query',
      desc: 'urlencode returns the part after ?.',
      code: "from urllib.parse import urlencode\nurl = 'https://api.example.com/search?' + urlencode({'q': term, 'limit': 50})",
    },
    {
      name: 'Repeated keys',
      desc: 'Either a list of pairs, or a dict of lists with doseq=True.',
      code: "from urllib.parse import urlencode\nurlencode([('tag', 'a'), ('tag', 'b')])\nurlencode({'tag': ['a', 'b']}, doseq=True)",
    },
    {
      name: 'Skip None values',
      desc: 'None is encoded as the text None; filter first.',
      code: "from urllib.parse import urlencode\nquery = urlencode({k: v for k, v in params.items() if v is not None})",
    },
    {
      name: 'Merge into an existing URL',
      desc: 'parse_qs the old query, update, urlencode with doseq=True.',
      code: "from urllib.parse import urlsplit, parse_qs, urlencode\nparts = urlsplit(url)\nparams = parse_qs(parts.query)\nparams['page'] = [str(page)]\nurl = parts._replace(query=urlencode(params, doseq=True)).geturl()",
    },
  ],

  examples: [
    { title: 'A dict',                       code: "from urllib.parse import urlencode\nurlencode({'q': 'rock & roll', 'page': 2})",                   returns: "'q=rock+%26+roll&page=2'" },
    { title: '%20 instead of +',             code: "from urllib.parse import urlencode, quote\nurlencode({'q': 'rock & roll'}, quote_via=quote)",   returns: "'q=rock%20%26%20roll'" },
    { title: 'Lists with doseq=True',        code: "from urllib.parse import urlencode\nurlencode({'tag': ['a', 'b']}, doseq=True)",               returns: "'tag=a&tag=b'" },
    { title: 'A list of pairs',              code: "from urllib.parse import urlencode\nurlencode([('a', 1), ('a', 2), ('b', 'x')])",              returns: "'a=1&a=2&b=x'" },
    { title: 'Values go through str()',      code: "from urllib.parse import urlencode\nurlencode({'flag': True, 'none': None, 'price': 9.5})",      returns: "'flag=True&none=None&price=9.5'" },
    { title: 'safe= keeps characters',       code: "from urllib.parse import urlencode\nurlencode({'path': '/a/b'}, safe='/')",                   returns: "'path=/a/b'" },
    { title: 'Round trip with parse_qs',     code: "from urllib.parse import urlencode, parse_qs\nparse_qs(urlencode({'tag': ['a', 'b'], 'q': 'x y'}, doseq=True))", returns: "{'tag': ['a', 'b'], 'q': ['x y']}" },
    { title: 'A string is not a query',      code: "from urllib.parse import urlencode\nurlencode('a=1')",                                        returns: 'TypeError: not a valid non-string sequence or mapping object' },
  ],

  pitfalls: [
    {
      name: 'A list value without doseq',
      desc: "The list is converted with str() and encoded as one value — the server receives the text ['a', 'b'].",
      wrong: { label: 'doseq=False', code: "from urllib.parse import urlencode\nurlencode({'tag': ['a', 'b']})",             output: "'tag=%5B%27a%27%2C+%27b%27%5D'" },
      fix:   { label: 'doseq=True',  code: "from urllib.parse import urlencode\nurlencode({'tag': ['a', 'b']}, doseq=True)", output: "'tag=a&tag=b'" },
    },
    {
      name: 'Pairs as lists instead of tuples',
      desc: 'urlencode checks that the first item of a sequence is a tuple. A list of lists (e.g. from JSON) is rejected.',
      wrong: { label: 'list of lists',  code: "from urllib.parse import urlencode\nurlencode([['a', 1], ['b', 2]])",                         output: 'TypeError: not a valid non-string sequence or mapping object' },
      fix:   { label: 'list of tuples', code: "from urllib.parse import urlencode\nurlencode([tuple(p) for p in [['a', 1], ['b', 2]]])",      output: "'a=1&b=2'" },
    },
    {
      name: 'None becomes the text None',
      desc: 'Optional parameters set to None are sent as the string None. Leave them out instead.',
      wrong: { label: 'None kept',    code: "from urllib.parse import urlencode\nurlencode({'q': 'x', 'lang': None})",                                         output: "'q=x&lang=None'" },
      fix:   { label: 'filter first', code: "from urllib.parse import urlencode\nparams = {'q': 'x', 'lang': None}\nurlencode({k: v for k, v in params.items() if v is not None})", output: "'q=x'" },
    },
  ],

  when: {
    use: [
      'Building any query string or form-encoded POST body from data',
      'Values containing & = + / spaces or non-ASCII text',
    ],
    avoid: [
      'Encoding one value → quote / quote_plus',
      'JSON APIs → send json.dumps(...) as the body instead',
      'requests / httpx → pass params= and they call urlencode for you',
    ],
  },

  notes: {
    cpython:      'A mapping is iterated with .items(); keys and values that are bytes are quoted directly, everything else goes through str() and quote_via(value, safe, encoding, errors)',
    'Sequences':  'With doseq=True, any value with a len() (list, tuple, but not str or bytes) is iterated; other values are str()-ed',
    'Encoding':   "Form encoding (application/x-www-form-urlencoded): spaces as +, everything except letters, digits and _ . - ~ escaped",
  },

  related: [
    { name: 'urllib.parse.parse_qs', slug: 'parse_qs', when: 'The reverse: query string → dict' },
    { name: 'urllib.parse.quote',    slug: 'quote',    when: 'quote_plus / quote encode each part' },
    { name: 'urllib.parse.urlsplit', slug: 'urlsplit', when: 'Put the query into a URL with _replace' },
    { name: 'urllib.parse module',   slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
    { name: 'encodeURIComponent()',  slug: 'global-encodeuricomponent', when: 'JavaScript: encodes one component (%20 for spaces)', language: 'javascript', category: 'methods', href: '/reference/javascript/methods/global-encodeuricomponent' },
    { name: 'json.dumps',            slug: 'dumps',    when: 'Nested data does not fit a query string', category: 'stdlib/json' },
  ],

  faq: [
    {
      q: 'How do I convert a dict to a query string in Python?',
      a: "urllib.parse.urlencode({'q': 'x y', 'page': 2}) returns 'q=x+y&page=2'. Add '?' yourself when appending it to a URL.",
    },
    {
      q: 'How do I get %20 instead of + for spaces?',
      a: "Pass quote_via=quote: urlencode(params, quote_via=quote). The default quote_via=quote_plus writes spaces as +, which form decoders (and parse_qs) read as a space.",
    },
    {
      q: 'How do I encode a list as repeated parameters?',
      a: "urlencode({'tag': ['a', 'b']}, doseq=True) gives 'tag=a&tag=b'. Without doseq=True the list is encoded as its str(), \"['a', 'b']\".",
    },
    {
      q: 'Why does urlencode say "not a valid non-string sequence or mapping object"?',
      a: 'query must be a mapping or a sequence of tuples. A str, a number, or a list whose first item is a list (not a tuple) raises this TypeError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urlencode',
    meta:  'urllib.parse.urlencode',
  },

};
