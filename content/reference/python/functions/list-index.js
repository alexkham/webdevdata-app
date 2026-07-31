// content/reference/python/functions/list-index.js
//
// Slug is type-prefixed: `index` exists on str, list and tuple.

export const meta = {
  slug:        'list-index',
  name:        'list.index',
  signature:   'list.index(value, start=0, end=len(lst))',
  blurb:       'Return the index of the first item equal to a value.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'index position find locate list where item',
};

export const method = {
  slug:      'list-index',
  name:      'list.index',
  signature: 'list.index(value, start=0, end=len(lst))',
  returns:   { type: 'int', desc: 'The index of the first item equal (==) to value. Raises ValueError when no item matches.' },

  category:    'List method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Where is this value? First matching index — or ValueError when absent.',

  cheat: {
    commonCall: 'names.index("alice")',
    returns:    'int — first match only',
    replaces:   'unlike str.find there is NO -1 form for lists',
    watchOut:   'raises ValueError when absent — guard with "in" first',
  },

  parameters: [
    { name: 'value', type: 'Any', required: true,  default: null,       desc: 'The value to locate, compared with ==.' },
    { name: 'start', type: 'int', required: false, default: '0',        desc: 'Begin searching at this index.' },
    { name: 'end',   type: 'int', required: false, default: 'len(lst)', desc: 'Stop searching before this index.' },
  ],

  demoParams: [
    { name: 'list',  type: 'list', hint: 'comma-separated items', input: 'csv' },
    { name: 'value', type: 'Any',  hint: 'value to locate',       input: 'text' },
    { name: 'start', type: 'int',  hint: 'search from',           input: 'number-or-none' },
  ],
  cases: [
    { id: 'default', label: 'default',   values: { list: 'a,b,c,b', value: 'b', start: '' } },
    { id: 'missing', label: 'not found', values: { list: 'a,b,c',   value: 'z', start: '' } },
    { id: 'start',   label: 'with start', values: { list: 'a,b,c,b', value: 'b', start: 2 } },
    { id: 'empty',   label: 'empty list', values: { list: '',       value: 'a', start: '' } },
  ],
  demoExplainer: 'Returns the FIRST index whose item equals the value. A missing value raises ValueError — Python has no -1 convention for lists. The optional start skips earlier matches.',

  patterns: [
    {
      name: 'Guarded lookup',
      desc: 'Check membership first when absence is a normal case.',
      code: 'if name in names:\n    pos = names.index(name)',
    },
    {
      name: 'Find all positions',
      desc: 'enumerate + comprehension beats repeated index calls.',
      code: '[i for i, x in enumerate(lst) if x == value]',
    },
    {
      name: 'Next occurrence after a known one',
      desc: 'Feed the previous match + 1 as start.',
      code: 'second = lst.index(value, first + 1)',
    },
  ],

  examples: [
    { title: 'First matching index',   code: '["a", "b", "c", "b"].index("b")',    returns: '1' },
    { title: 'Search from an index',   code: '["a", "b", "c", "b"].index("b", 2)', returns: '3' },
    { title: 'Numbers compare by ==',  code: '[1, True, 2].index(True)',           returns: '1' },
  ],

  pitfalls: [
    {
      name: 'Missing value raises',
      desc: 'No -1 sentinel — either guard or catch.',
      wrong: { label: 'Raises', code: '["a", "b"].index("z")', output: "ValueError: 'z' is not in list" },
      fix:   { label: 'Guard', code: 'pos = lst.index(v) if v in lst else None', output: 'None (guarded)' },
    },
    {
      name: 'Only the first match',
      desc: 'Duplicates after the first are invisible to index.',
      wrong: { label: 'Where are the rest?', code: '["b", "x", "b"].index("b")', output: '0 — only the first' },
      fix:   { label: 'All positions', code: '[i for i, x in enumerate(lst) if x == "b"]', output: '[0, 2]' },
    },
    {
      name: 'O(n) inside a loop',
      desc: 'index scans from the front every call — quadratic when used per item.',
      wrong: { label: 'Slow', code: 'for x in lst:\n    i = lst.index(x)  # rescans every time', output: 'O(n²) total' },
      fix:   { label: 'Fix', code: 'for i, x in enumerate(lst):\n    ...', output: 'O(n) — index comes free' },
    },
  ],

  when: {
    use: [
      'Position of a value you know (or require) to be present',
      'Resuming a search with start after a previous match',
    ],
    avoid: [
      'Absence is normal → guard with "in" or catch ValueError',
      'All positions → enumerate comprehension',
      'Position while iterating → enumerate',
      'Sorted data → bisect (binary search)',
    ],
  },

  notes: {
    complexity: 'O(n) — linear scan',
    return:     'int; list unchanged',
    cpython:    'Objects/listobject.c :: list_index_impl',
    memory:     'No allocation',
    threadSafe: 'Reading is safe; concurrent mutation is not',
  },

  related: [
    { name: 'list.count', slug: 'list-count', when: 'How many, not where' },
    { name: 'list.pop',   slug: 'list-pop',   when: 'Remove at the index you found' },
    { name: 'str.find',   slug: 'find',       when: 'The -1-returning string cousin' },
  ],

  faq: [
    {
      q: 'Why is there no find() for lists?',
      a: 'The API predates that convention; the idiomatic guard is membership first ("v in lst"), which reads better than a sentinel anyway.',
    },
    {
      q: 'How do I search from the end?',
      a: 'There is no rindex for lists. Compute it from the reversed list.',
      code: 'len(lst) - 1 - lst[::-1].index(v)',
    },
    {
      q: 'Does index use == or is?',
      a: '== equality. This means 1, 1.0 and True all match each other.',
    },
  ],

  history: [
    { version: '2.0', note: 'Core list method, unchanged semantics since.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.index',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
