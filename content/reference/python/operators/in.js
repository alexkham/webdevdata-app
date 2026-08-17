// content/reference/python/operators/in.js

export const meta = {
  slug:        'in',
  name:        'in',
  signature:   'item in container',
  blurb:       'Membership test — substring test for strings.',
  category:    'membership',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'in membership contains element substring operator',
};

export const method = {
  slug:      'in',
  name:      'in',
  signature: 'item in container',
  returns:   { type: 'bool', desc: 'True when item is an element of container — or a substring, for strings. Dicts test their KEYS.' },

  category:    'Membership operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Is it in there? One operator for elements, substrings and dict keys.',

  cheat: {
    commonCall: 'if key in d:',
    returns:    'bool',
    replaces:   '"ell" in "hello" — substring, not element',
    watchOut:   'dicts test keys, not values — use d.values() for values',
  },

  parameters: [
    { name: 'item',      type: 'Any',      required: true, default: null, desc: 'The candidate — compared with == against elements (substring match for strings).' },
    { name: 'container', type: 'iterable', required: true, default: null, desc: 'Where to look: list, tuple, set, dict (keys), str, or any __contains__/iterable.' },
  ],

  demoParams: [
    { name: 'item',      type: 'Any',  hint: 'to find',               input: 'text' },
    { name: 'container', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  demoTemplate: '{item} in {container}',
  cases: [
    { id: 'default', label: 'present', values: { item: 'b', container: 'a,b,c' } },
    { id: 'absent',  label: 'absent',  values: { item: 'z', container: 'a,b,c' } },
    { id: 'empty',   label: 'empty',   values: { item: 'a', container: '' } },
  ],
  demoExplainer: 'Membership by equality against a list here. In real Python the same operator does substring tests on strings ("ell" in "hello") and key tests on dicts.',

  patterns: [
    {
      name: 'Key check before access',
      desc: 'The safe-dict pattern (or use .get).',
      code: 'if name in scores:\n    print(scores[name])',
    },
    {
      name: 'Value whitelists',
      desc: 'Sets make repeated membership checks O(1).',
      code: 'VALID = {"a", "b", "c"}\nif code in VALID:',
    },
    {
      name: 'Substring search',
      desc: 'The readable alternative to find() != -1.',
      code: 'if "@" in email:',
    },
  ],

  examples: [
    { title: 'List element',   code: '2 in [1, 2, 3]',        returns: 'True' },
    { title: 'Substring',      code: '"ell" in "hello"',      returns: 'True' },
    { title: 'Dict tests keys', code: '"a" in {"a": 1}',      returns: 'True' },
    { title: 'Not values',     code: '1 in {"a": 1}',         returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Dicts test keys, not values',
      desc: 'The most common in-operator surprise.',
      wrong: { label: 'False', code: '1 in {"a": 1}', output: 'False — 1 is a value, not a key' },
      fix:   { label: 'Fix', code: '1 in {"a": 1}.values()', output: 'True' },
    },
    {
      name: 'List membership is O(n)',
      desc: 'Hot-loop membership wants a set.',
      wrong: { label: 'Slow', code: 'for x in stream:\n    if x in big_list:', output: 'scans the list every time' },
      fix:   { label: 'Fix', code: 'big = set(big_list)\nfor x in stream:\n    if x in big:', output: 'O(1) per check' },
    },
    {
      name: 'Substring vs element for strings',
      desc: '"ab" in "abc" is True even though "ab" is not a single character.',
      wrong: { label: 'Element intuition', code: '"ab" in list("abc")', output: 'False — list of chars has no "ab"' },
      fix:   { label: 'Substring is on str', code: '"ab" in "abc"', output: 'True' },
    },
  ],

  when: {
    use: [
      'Membership and key checks',
      'Substring tests',
      'Whitelist validation (with sets)',
    ],
    avoid: [
      'Position needed → list.index / str.find',
      'Repeated checks against a big list → convert to set',
    ],
  },

  notes: {
    complexity: 'O(1) sets/dicts; O(n) lists/tuples; O(n·m) strings',
    return:     'bool',
    cpython:    'ceval COMPARE_OP/CONTAINS_OP → __contains__, falls back to iteration',
    memory:     'No allocation',
    threadSafe: 'Yes for stable containers',
  },

  related: [
    { name: 'not-in',     slug: 'not-in',     when: 'The negation' },
    { name: 'list.index', slug: 'list-index', when: 'Where exactly', category: 'functions' },
    { name: 'str.find',   slug: 'find',       when: 'Substring position', category: 'functions' },
  ],

  faq: [
    {
      q: 'How does in work for my own class?',
      a: 'Python tries __contains__, then falls back to iterating __iter__ comparing with ==. Implement __contains__ for O(1) or custom semantics.',
    },
    {
      q: 'Is `x in range(a, b)` fast?',
      a: 'Yes — range implements __contains__ arithmetically for ints, so it is O(1), not a scan.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#membership-test-operations',
    meta:  'membership tests',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect container data' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Explore nested keys' },
  ],
};
