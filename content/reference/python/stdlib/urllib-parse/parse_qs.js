// content/reference/python/stdlib/urllib-parse/parse_qs.js — parse_qs, parse_qsl

export const meta = {
  slug:        'parse_qs',
  name:        'urllib.parse.parse_qs',
  signature:   "urllib.parse.parse_qs(qs, keep_blank_values=False, strict_parsing=False, encoding='utf-8', errors='replace', max_num_fields=None, separator='&')",
  blurb:       'Parse a query string into a dict of lists (parse_qs) or a list of (name, value) pairs (parse_qsl), decoding %XX escapes and + as you go.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib parse parse_qs parse_qsl python parse query string get query parameters from url dict of lists keep_blank_values strict_parsing max_num_fields separator semicolon bad query field URLSearchParams python equivalent',
};

export const method = {
  slug:      'parse_qs',
  name:      'urllib.parse.parse_qs',
  signature: "urllib.parse.parse_qs(qs, keep_blank_values=False, strict_parsing=False, encoding='utf-8', errors='replace', max_num_fields=None, separator='&')",
  returns:   { type: 'dict[str, list[str]]', desc: 'parse_qs: every name mapped to the list of its values, in order. parse_qsl: a list of (name, value) tuples, duplicates and order kept.' },

  category:    'urllib.parse function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "parse_qs('tag=a&tag=b') gives {'tag': ['a', 'b']} — always lists, because a name can repeat. parse_qsl keeps the raw (name, value) pairs. Both drop empty values unless keep_blank_values=True, and both expect the query without its leading '?'.",

  covers: ['parse_qs', 'parse_qsl'],

  cheat: {
    commonCall: 'parse_qs(urlsplit(url).query)',
    returns:    "{'q': ['python'], 'page': ['2']}",
    replaces:   "query.split('&') and split('=') by hand",
    watchOut:   "Values are lists — use ['page'][0]; and 'q=' disappears without keep_blank_values=True",
  },

  parameters: [
    { name: 'qs',                type: 'str | bytes', required: true,  default: null,      desc: 'The query string, without the leading ?. bytes give bytes names and values.' },
    { name: 'keep_blank_values', type: 'bool',        required: false, default: 'False',   desc: "True keeps fields with an empty value ('q=' → ''); False drops them." },
    { name: 'strict_parsing',    type: 'bool',        required: false, default: 'False',   desc: "True raises ValueError('bad query field: ...') for a field without '=' (including the empty field of a doubled or trailing separator); False skips it." },
    { name: 'encoding',          type: 'str',         required: false, default: "'utf-8'", desc: 'Passed to unquote_plus for every name and value.' },
    { name: 'errors',            type: 'str',         required: false, default: "'replace'", desc: 'Passed to unquote_plus: invalid UTF-8 becomes U+FFFD by default.' },
    { name: 'max_num_fields',    type: 'int | None',  required: false, default: 'None',    desc: "Raise ValueError('Max number of fields exceeded') if the query has more fields than this (3.8+). Protects servers from huge POST bodies." },
    { name: 'separator',         type: 'str',         required: false, default: "'&'",     desc: 'The one string that separates fields (3.10+). Before 3.10 both & and ; were accepted.' },
  ],

  modes: [
    {
      id: 'qs',
      label: 'parse_qs',
      blurb: 'A dict of lists. Repeated names collect every value.',
      params: [{ name: 'query', type: 'str', hint: 'a query string, no ?', input: 'text' }],
      template: 'from urllib.parse import parse_qs\nparse_qs({$query})',
      cases: [
        { id: 'repeat', label: 'repeated name',   values: { query: 'tag=python&tag=web&page=2' } },
        { id: 'enc',    label: 'encoded values',  values: { query: 'name=Ada+Lovelace&city=Z%C3%BCrich' } },
        { id: 'blank',  label: 'empty value',     values: { query: 'q=&page=1' } },
        { id: 'qmark',  label: 'with the ?',      values: { query: '?a=1&b=2' } },
        { id: 'semi',   label: 'semicolons',      values: { query: 'a=1;b=2' } },
      ],
    },
    {
      id: 'qsl',
      label: 'parse_qsl + blanks',
      blurb: 'parse_qsl with keep_blank_values=True: every field, in order, empty ones included.',
      params: [{ name: 'query', type: 'str', hint: 'a query string, no ?', input: 'text' }],
      template: 'from urllib.parse import parse_qsl\nparse_qsl({$query}, keep_blank_values=True)',
      cases: [
        { id: 'blank', label: 'blank and bare', values: { query: 'q=&debug&page=1' } },
        { id: 'order', label: 'order kept',     values: { query: 'b=2&a=1&b=3' } },
        { id: 'eq',    label: '= in a value',   values: { query: 'expr=a%3Db&raw=x=y' } },
      ],
    },
    {
      id: 'strict',
      label: 'strict_parsing',
      blurb: 'strict_parsing=True turns every malformed field into a ValueError naming it.',
      params: [{ name: 'query', type: 'str', hint: 'a query string, no ?', input: 'text' }],
      template: 'from urllib.parse import parse_qsl\nparse_qsl({$query}, strict_parsing=True)',
      cases: [
        { id: 'ok',     label: 'well formed',      values: { query: 'a=1&b=2' } },
        { id: 'bare',   label: 'field without =',  values: { query: 'a=1&debug' } },
        { id: 'double', label: 'doubled &',        values: { query: 'a=1&&b=2' } },
      ],
    },
  ],
  demoExplainer: "parse_qs splits on & only (the default separator since 3.10), so 'a=1;b=2' is one field whose value is '1;b=2'. A leading ? is not stripped either: it becomes part of the first name, '?a'. Names and values are decoded with unquote_plus, so + and %20 both become a space.",

  patterns: [
    {
      name: 'Query parameters of a URL',
      desc: 'Split the URL first; parse only its query.',
      code: "from urllib.parse import urlsplit, parse_qs\nparams = parse_qs(urlsplit(url).query)\npage = int(params.get('page', ['1'])[0])",
    },
    {
      name: 'One value per name',
      desc: 'dict over parse_qsl keeps the LAST value of a repeated name.',
      code: "from urllib.parse import parse_qsl\nparams = dict(parse_qsl(query))",
    },
    {
      name: 'Limit untrusted input',
      desc: 'Reject absurdly long bodies before building the dict.',
      code: "from urllib.parse import parse_qs\nform = parse_qs(body, max_num_fields=100, strict_parsing=True)",
    },
    {
      name: 'Round trip with urlencode',
      desc: 'parse_qs output goes straight back into urlencode with doseq=True.',
      code: "from urllib.parse import parse_qs, urlencode\nparams = parse_qs(query)\nparams['page'] = ['3']\nnew_query = urlencode(params, doseq=True)",
    },
  ],

  examples: [
    { title: 'Repeated names → lists',     code: "from urllib.parse import parse_qs\nparse_qs('tag=a&tag=b&page=2')",               returns: "{'tag': ['a', 'b'], 'page': ['2']}" },
    { title: 'parse_qsl keeps pairs',      code: "from urllib.parse import parse_qsl\nparse_qsl('tag=a&tag=b&page=2')",             returns: "[('tag', 'a'), ('tag', 'b'), ('page', '2')]" },
    { title: 'From a full URL',            code: "from urllib.parse import parse_qs, urlparse\nparse_qs(urlparse('https://example.com/s?q=python&page=2').query)", returns: "{'q': ['python'], 'page': ['2']}" },
    { title: 'Escapes and + are decoded',  code: "from urllib.parse import parse_qs\nparse_qs('name=Ada+Lovelace&city=Z%C3%BCrich')", returns: "{'name': ['Ada Lovelace'], 'city': ['Zürich']}" },
    { title: 'Blank values: dropped or kept', code: "from urllib.parse import parse_qs\n(parse_qs('q=&page=1'), parse_qs('q=&page=1', keep_blank_values=True))", returns: "({'page': ['1']}, {'q': [''], 'page': ['1']})" },
    { title: 'A custom separator',         code: "from urllib.parse import parse_qsl\nparse_qsl('a=1;b=2', separator=';')",         returns: "[('a', '1'), ('b', '2')]" },
    { title: 'max_num_fields',             code: "from urllib.parse import parse_qsl\nparse_qsl('a=1&b=2&c=3', max_num_fields=2)", returns: 'ValueError: Max number of fields exceeded' },
    { title: 'bytes in, bytes out',        code: "from urllib.parse import parse_qsl\nparse_qsl(b'a=1&b=%FF')",                    returns: "[(b'a', b'1'), (b'b', b'\\xff')]" },
  ],

  pitfalls: [
    {
      name: 'Forgetting that values are lists',
      desc: "parse_qs always returns lists, even for a name that appears once. Take [0] (or use parse_qsl) when you want one value.",
      wrong: { label: "['page']",    code: "from urllib.parse import parse_qs\nparse_qs('page=2')['page']",    output: "['2']" },
      fix:   { label: "['page'][0]", code: "from urllib.parse import parse_qs\nparse_qs('page=2')['page'][0]", output: "'2'" },
    },
    {
      name: 'Parsing the whole URL',
      desc: 'parse_qs does not look for the ?. Given a full URL, the scheme, host and path end up inside the first name.',
      wrong: { label: 'full URL',  code: "from urllib.parse import parse_qs\nparse_qs('https://example.com/s?q=python')",                 output: "{'https://example.com/s?q': ['python']}" },
      fix:   { label: 'the query', code: "from urllib.parse import parse_qs, urlsplit\nparse_qs(urlsplit('https://example.com/s?q=python').query)", output: "{'q': ['python']}" },
    },
    {
      name: 'Empty parameters vanish',
      desc: "A search box submitted empty sends 'q='. By default it is dropped, so 'q' in params is False.",
      wrong: { label: 'default',                code: "from urllib.parse import parse_qs\n'q' in parse_qs('q=&page=1')",                         output: 'False' },
      fix:   { label: 'keep_blank_values=True', code: "from urllib.parse import parse_qs\n'q' in parse_qs('q=&page=1', keep_blank_values=True)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Reading query parameters from a URL or a form body',
      'Repeated names (filters, tags): parse_qs collects them',
      'Order or duplicates matter: parse_qsl',
    ],
    avoid: [
      'Building a query string → urlencode',
      'JSON request bodies → json.loads',
      'Inside a web framework → its request.args / request.GET already did this',
    ],
  },

  notes: {
    cpython:      'parse_qs is a loop over parse_qsl that appends each value to a list per name; parse_qsl splits on separator, partitions each field at the first =, and decodes both halves with unquote_plus',
    'Separator':  "Since 3.10 only one separator is used ('&' by default); 'a=1;b=2' is a single field",
    'Exceptions': "ValueError for strict_parsing failures ('bad query field: ...'), max_num_fields ('Max number of fields exceeded') and an empty or non-string separator",
  },

  related: [
    { name: 'urllib.parse.urlencode', slug: 'urlencode', when: 'The reverse: dict → query string' },
    { name: 'urllib.parse.urlsplit',  slug: 'urlsplit',  when: 'Get the query out of a URL first' },
    { name: 'urllib.parse.unquote',   slug: 'unquote',   when: 'What decodes each name and value (unquote_plus)' },
    { name: 'urllib.parse module',    slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
    { name: 'ValueError',             slug: 'valueerror', when: 'What strict_parsing and max_num_fields raise', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I get query parameters from a URL in Python?',
      a: "parse_qs(urlsplit(url).query) returns a dict of lists, e.g. {'q': ['python'], 'page': ['2']}. Use parse_qsl for (name, value) pairs, or dict(parse_qsl(...)) for one value per name (the last one wins).",
    },
    {
      q: 'Why does parse_qs return lists?',
      a: "A name can appear several times (tag=a&tag=b), so every value is collected in a list. Take params['name'][0] for the first value.",
    },
    {
      q: 'Why are my empty parameters missing?',
      a: "keep_blank_values defaults to False, so a field like 'q=' is dropped. Pass keep_blank_values=True to get 'q': [''].",
    },
    {
      q: 'Does parse_qs split on semicolons?',
      a: "Not since Python 3.10: only the separator argument ('&' by default) splits fields. Pass separator=';' for semicolon-separated queries.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.parse_qs',
    meta:  'urllib.parse.parse_qs',
  },

};
