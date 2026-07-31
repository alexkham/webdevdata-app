// content/reference/python/functions/get.js

export const meta = {
  slug:        'get',
  name:        'dict.get',
  signature:   'dict.get(key, default=None)',
  blurb:       'Return the value for a key, or a default — never raises.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'get dictionary key default safe access lookup keyerror',
};

export const method = {
  slug:      'get',
  name:      'dict.get',
  signature: 'dict.get(key, default=None)',
  returns:   { type: 'Any', desc: 'The value for key if present, otherwise default. Never raises KeyError.' },

  category:    'Dict method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Safe key lookup: the value if the key exists, a default if it does not — never a KeyError.',

  cheat: {
    commonCall: 'config.get("debug", False)',
    returns:    'value or default (None if omitted)',
    replaces:   'd[key] raises on a missing key; get never does',
    watchOut:   'a key stored with value None is indistinguishable from missing',
  },

  parameters: [
    { name: 'key',     type: 'hashable', required: true,  default: null,   desc: 'The key to look up.' },
    { name: 'default', type: 'Any',      required: false, default: 'None', desc: 'Returned when the key is absent. Not stored in the dict.' },
  ],

  demoParams: [
    { name: 'dict',    type: 'dict', hint: 'key: value pairs',    input: 'kv' },
    { name: 'key',     type: 'str',  hint: 'key to look up',      input: 'text' },
    { name: 'default', type: 'Any',  hint: 'empty = None',        input: 'text-or-none' },
  ],
  cases: [
    { id: 'default', label: 'present',      values: { dict: 'a: 1, b: 2', key: 'a', default: '' } },
    { id: 'missing', label: 'missing',      values: { dict: 'a: 1, b: 2', key: 'z', default: '' } },
    { id: 'fallback', label: 'with default', values: { dict: 'a: 1, b: 2', key: 'z', default: 'n/a' } },
    { id: 'empty',   label: 'empty dict',   values: { dict: '',           key: 'a', default: '' } },
  ],
  demoExplainer: 'If the key exists you get its value; if not, you get the default — None when no default is given. The dict itself is never modified. (Demo values are strings, from the text inputs.)',

  patterns: [
    {
      name: 'Optional config with fallback',
      desc: 'The canonical use — absent settings fall back to a sane default.',
      code: 'timeout = config.get("timeout", 30)',
    },
    {
      name: 'Counting occurrences',
      desc: 'get with a 0 default replaces the missing-key dance.',
      code: 'counts[word] = counts.get(word, 0) + 1',
    },
    {
      name: 'Chained optional lookups',
      desc: 'Defaulting to an empty dict keeps the chain alive.',
      code: 'city = user.get("address", {}).get("city")',
    },
  ],

  examples: [
    { title: 'Key present',                 code: '{"a": 1}.get("a")',        returns: '1' },
    { title: 'Key missing — default None',  code: '{"a": 1}.get("z")',        returns: 'None' },
    { title: 'Key missing — explicit',      code: '{"a": 1}.get("z", 0)',     returns: '0' },
  ],

  pitfalls: [
    {
      name: 'None value vs missing key',
      desc: 'get cannot distinguish a stored None from an absent key.',
      wrong: { label: 'Ambiguous', code: '{"a": None}.get("a") is {"x": 1}.get("a")', output: 'True — both None' },
      fix:   { label: 'Check membership', code: 'if "a" in d:\n    value = d["a"]', output: 'presence and value handled separately' },
    },
    {
      name: 'The default is not stored',
      desc: 'get reads; it never writes. Use setdefault to store the fallback.',
      wrong: { label: 'Not saved', code: 'd.get("k", [])\nprint(d)', output: '{} — still empty' },
      fix:   { label: 'Fix', code: 'd.setdefault("k", []).append(x)', output: "{'k': [x]}" },
    },
    {
      name: 'Eager default evaluation',
      desc: 'The default expression runs even when the key exists.',
      wrong: { label: 'Wasted work', code: 'd.get(k, expensive())', output: 'expensive() always called' },
      fix:   { label: 'Fix', code: 'd[k] if k in d else expensive()', output: 'expensive() only on miss' },
    },
  ],

  when: {
    use: [
      'Lookups where missing keys are normal, not errors',
      'Config and options dictionaries',
      'Counting / accumulating patterns',
    ],
    avoid: [
      'A missing key is a bug → d[key] so it raises loudly',
      'Store the default on miss → dict.setdefault',
      'Same default for every key → collections.defaultdict',
    ],
  },

  notes: {
    complexity: 'O(1) average — hash lookup',
    return:     'value or default; dict unchanged',
    cpython:    'Objects/dictobject.c :: dict_get_impl',
    memory:     'No allocation',
    threadSafe: 'Single lookup is atomic in CPython; read-modify-write is not',
  },

  related: [
    { name: 'list.pop',  slug: 'list-pop', when: 'Remove-and-return for lists' },
    { name: 'sorted',    slug: 'sorted',   when: 'Order dict keys or items' },
    { name: 'len',       slug: 'len',      when: 'How many keys' },
  ],

  faq: [
    {
      q: 'When should I use d[key] instead of d.get(key)?',
      a: 'When a missing key means something went wrong. Square brackets raise KeyError immediately — a silent None can travel far before it explodes.',
    },
    {
      q: 'What is the difference between get and setdefault?',
      a: 'get returns the default without touching the dict; setdefault also STORES the default under that key when missing.',
      code: 'd.get("k", 0)        # d unchanged\nd.setdefault("k", 0) # d["k"] now exists',
    },
    {
      q: 'How do I get a nested value safely?',
      a: 'Chain get calls with dict defaults at each level.',
      code: 'user.get("address", {}).get("city", "unknown")',
    },
  ],

  history: [
    { version: '2.0', note: 'Core dict method, unchanged semantics since.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.get',
    meta:  'dict.get',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Explore nested keys' },
  ],
};
