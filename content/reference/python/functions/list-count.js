// content/reference/python/functions/list-count.js
//
// Slug is type-prefixed: `count` exists on str, list and tuple.

export const meta = {
  slug:        'list-count',
  name:        'list.count',
  signature:   'list.count(value)',
  blurb:       'Count how many items in the list equal a value.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'count occurrences list frequency how many items',
};

export const method = {
  slug:      'list-count',
  name:      'list.count',
  signature: 'list.count(value)',
  returns:   { type: 'int', desc: 'The number of items equal (==) to value. Zero if none match.' },

  category:    'List method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Count how many items in the list compare equal to a value.',

  cheat: {
    commonCall: '[1, 2, 2, 3].count(2)',
    returns:    'int — 0 when absent',
    replaces:   'uses == equality, so 1 and True count as the same value',
    watchOut:   'O(n) every call — counting many values wants Counter',
  },

  parameters: [
    { name: 'value', type: 'Any', required: true, default: null, desc: 'The value to count. Items match by == equality, not identity.' },
  ],

  demoParams: [
    { name: 'list', type: 'list', hint: 'comma-separated items', input: 'csv' },
    { name: 'value', type: 'Any', hint: 'value to count',        input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default',   values: { list: 'a,b,a,c,a', value: 'a' } },
    { id: 'none',    label: 'not found', values: { list: 'a,b,c',     value: 'z' } },
    { id: 'numbers', label: 'numbers',   values: { list: '1,2,2,3',   value: '2' } },
    { id: 'empty',   label: 'empty list', values: { list: '',         value: 'a' } },
  ],
  demoExplainer: 'Each item is compared with == against the value; the demo’s comma-separated input makes every item a string. A missing value simply counts as zero — no error.',

  patterns: [
    {
      name: 'Simple duplicate check',
      desc: 'Fine for a single value; use a Counter or set for many.',
      code: 'if names.count(name) > 1:\n    warn("duplicate")',
    },
    {
      name: 'Vote tallying for one option',
      desc: 'Direct and readable when only one answer matters.',
      code: 'yes_votes = votes.count("yes")',
    },
  ],

  examples: [
    { title: 'Count matching items',   code: '[1, 2, 2, 3].count(2)',      returns: '2' },
    { title: 'Value not present',      code: '["a", "b"].count("z")',      returns: '0' },
    { title: 'Equality, not identity', code: '[1, True, 1.0].count(1)',    returns: '3' },
  ],

  pitfalls: [
    {
      name: 'Counting many values is quadratic',
      desc: 'count scans the whole list each call.',
      wrong: { label: 'Slow', code: '{v: lst.count(v) for v in lst}', output: 'O(n²) — full scan per item' },
      fix:   { label: 'Fix', code: 'from collections import Counter\nCounter(lst)', output: 'O(n) — one pass' },
    },
    {
      name: '== equality can surprise',
      desc: 'True == 1 and 1.0 == 1, so mixed-type lists count across types.',
      wrong: { label: 'Surprising', code: '[True, 1, 1.0].count(1)', output: '3' },
      fix:   { label: 'Type-strict count', code: 'sum(1 for x in lst\n    if type(x) is int and x == 1)', output: '1' },
    },
  ],

  when: {
    use: [
      'Counting one value in a small-to-medium list',
      'Quick duplicate existence checks',
    ],
    avoid: [
      'Frequencies of many values → collections.Counter',
      'Substring counting in a string → str.count',
      'Just existence → value in lst',
    ],
  },

  notes: {
    complexity: 'O(n) — compares every item',
    return:     'int',
    cpython:    'Objects/listobject.c :: list_count',
    memory:     'No allocation beyond the result',
    threadSafe: 'Reading is safe; concurrent mutation of the list is not',
  },

  related: [
    { name: 'str.count', slug: 'str-count', when: 'Count substrings in a string' },
    { name: 'list.pop',  slug: 'list-pop',  when: 'Remove and return an item' },
    { name: 'sorted',    slug: 'sorted',    when: 'Order items before grouping' },
  ],

  faq: [
    {
      q: 'How do I count items matching a condition instead of a value?',
      a: 'Use sum with a generator expression.',
      code: 'sum(1 for x in lst if x > 10)',
    },
    {
      q: 'Why does [True, 1].count(1) return 2?',
      a: 'count uses == and bool is a subclass of int, so True == 1. Filter by type if you need to distinguish them.',
    },
    {
      q: 'Does count work on tuples too?',
      a: 'Yes — tuple.count has identical semantics.',
    },
  ],

  history: [
    { version: '2.0', note: 'Core list method, unchanged semantics since.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#common-sequence-operations',
    meta:  'list.count',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
