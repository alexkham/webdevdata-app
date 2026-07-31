// content/reference/python/functions/setdefault.js

export const meta = {
  slug:        'setdefault',
  name:        'dict.setdefault',
  signature:   'dict.setdefault(key, default=None)',
  blurb:       'Return the value for a key, inserting the default first if missing.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'setdefault insert default missing key initialize grouping',
};

export const method = {
  slug:      'setdefault',
  name:      'dict.setdefault',
  signature: 'dict.setdefault(key, default=None)',
  returns:   { type: 'Any', desc: 'The existing value when the key is present; otherwise the default — which is also STORED under the key.' },

  category:    'Dict method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'dict.get that also writes: missing keys get the default stored, then returned.',

  cheat: {
    commonCall: 'groups.setdefault(key, []).append(item)',
    returns:    'existing value, or the default (now stored)',
    replaces:   'get reads only; setdefault reads AND writes on miss',
    watchOut:   'the default is evaluated even when the key exists',
  },

  parameters: [
    { name: 'key',     type: 'hashable', required: true,  default: null,   desc: 'The key to look up (and possibly create).' },
    { name: 'default', type: 'Any',      required: false, default: 'None', desc: 'Stored under key and returned when the key is absent.' },
  ],

  demoParams: [
    { name: 'dict',    type: 'dict', hint: 'key: value pairs', input: 'kv' },
    { name: 'key',     type: 'str',  hint: 'key to look up',   input: 'text' },
    { name: 'default', type: 'Any',  hint: 'empty = None',     input: 'text-or-none' },
  ],
  cases: [
    { id: 'default', label: 'present',      values: { dict: 'a: 1, b: 2', key: 'a', default: '0' } },
    { id: 'missing', label: 'missing',      values: { dict: 'a: 1, b: 2', key: 'z', default: '0' } },
    { id: 'none',    label: 'default None', values: { dict: 'a: 1',       key: 'z', default: '' } },
  ],
  demoExplainer: 'The demo shows the RETURN value. The side effect is the point though: on a miss, real Python also stores the default — after {"a": 1}.setdefault("z", 0) the dict is {"a": 1, "z": 0}.',

  patterns: [
    {
      name: 'Grouping into lists',
      desc: 'The canonical setdefault idiom — initialize-and-append in one line.',
      code: 'groups = {}\nfor item in items:\n    groups.setdefault(item.kind, []).append(item)',
    },
    {
      name: 'Nested dict creation',
      desc: 'Build one level at a time without membership checks.',
      code: 'tree.setdefault(a, {}).setdefault(b, {})[c] = value',
    },
    {
      name: 'First-write-wins cache',
      desc: 'Later calls with the same key keep the original value.',
      code: 'canonical = seen.setdefault(name.lower(), name)',
    },
  ],

  examples: [
    { title: 'Key present — value returned, dict untouched', code: '{"a": 1}.setdefault("a", 0)', returns: '1' },
    { title: 'Key missing — default stored and returned',     code: '{"a": 1}.setdefault("z", 0)', returns: '0' },
    { title: 'Default defaults to None',                      code: '{}.setdefault("k")',          returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'The default is evaluated eagerly',
      desc: 'Even when the key exists, the default expression runs — costly defaults hurt.',
      wrong: { label: 'Wasted work', code: 'd.setdefault(k, expensive())', output: 'expensive() runs on every call' },
      fix:   { label: 'Fix', code: 'if k not in d:\n    d[k] = expensive()', output: 'expensive() only on miss' },
    },
    {
      name: 'Mutable default is shared per call, not per key',
      desc: 'Each setdefault call needs a FRESH list/dict literal — do not hoist it.',
      wrong: { label: 'Shared list', code: 'empty = []\nd.setdefault("a", empty).append(1)\nd.setdefault("b", empty).append(2)', output: "d['a'] is d['b'] — both [1, 2]" },
      fix:   { label: 'Fix', code: 'd.setdefault("a", []).append(1)\nd.setdefault("b", []).append(2)', output: "{'a': [1], 'b': [2]}" },
    },
    {
      name: 'Heavy grouping wants defaultdict',
      desc: 'setdefault re-evaluates the default per call; defaultdict builds it only on miss.',
      wrong: { label: 'Fine but noisy', code: 'groups.setdefault(k, []).append(x)', output: 'new [] built every call' },
      fix:   { label: 'At scale', code: 'from collections import defaultdict\ngroups = defaultdict(list)\ngroups[k].append(x)', output: '[] built only on first miss' },
    },
  ],

  when: {
    use: [
      'Occasional initialize-if-missing on a plain dict',
      'Grouping / nesting without pre-checks',
      'First-write-wins registries',
    ],
    avoid: [
      'Read-only default → dict.get',
      'Every key needs the same factory → collections.defaultdict',
      'Expensive defaults → explicit "if key not in d" guard',
    ],
  },

  notes: {
    complexity: 'O(1) average — single hash lookup, insert on miss',
    return:     'stored value; dict mutates only on miss',
    cpython:    'Objects/dictobject.c :: dict_setdefault_impl',
    memory:     'Inserts one entry on miss',
    threadSafe: 'The lookup-insert is atomic in CPython — handy for simple caches',
  },

  related: [
    { name: 'dict.get',  slug: 'get',      when: 'Default without storing' },
    { name: 'dict.pop',  slug: 'dict-pop', when: 'The removal counterpart' },
    { name: 'len',       slug: 'len',      when: 'Count the keys you created' },
  ],

  faq: [
    {
      q: 'When should I use defaultdict instead?',
      a: 'When most lookups create the key and the default comes from a factory (list, int, set). setdefault wins for one-off use on dicts you do not control the type of.',
    },
    {
      q: 'Why is it called setdefault?',
      a: 'Historical naming: it SETs the DEFAULT value for the key if unset. Read it as "get, setting a default if missing".',
    },
    {
      q: 'Is setdefault atomic?',
      a: 'In CPython the check-and-insert happens under the GIL as one operation — two threads calling it with the same key cannot both insert.',
    },
  ],

  history: [
    { version: '2.0', note: 'Core dict method, unchanged semantics since.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.setdefault',
    meta:  'dict.setdefault',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Explore nested keys' },
  ],
};
