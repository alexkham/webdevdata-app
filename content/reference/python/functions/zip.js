// content/reference/python/functions/zip.js

export const meta = {
  slug:        'zip',
  name:        'zip',
  signature:   'zip(*iterables, strict=False)',
  blurb:       'Pair items from two or more iterables, one from each.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'zip pair combine parallel iterate together lockstep tuples merge',
};

export const method = {
  slug:      'zip',
  name:      'zip',
  signature: 'zip(*iterables, strict=False)',
  returns:   { type: 'zip', desc: 'An iterator of tuples — one tuple per position, containing the item from each iterable at that position. Lazy.' },

  category:    'Built-in function',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Walk two or more iterables in parallel, one step at a time.',

  cheat: {
    commonCall: 'for a, b in zip(xs, ys):',
    returns:    'iterator of tuples — length = shortest input',
    replaces:   'manual index-based loops over parallel lists',
    watchOut:   'silently truncates to the shortest; strict=True raises',
  },

  parameters: [
    { name: '*iterables', type: 'iterable', required: true,  default: null,    desc: 'Any number of iterables. Each contributes one item per position.' },
    { name: 'strict',     type: 'bool',     required: false, default: 'False', desc: 'If True, raise ValueError when lengths differ. Added in Python 3.10.' },
  ],

  demoParams: [
    { name: 'a',      type: 'list', hint: 'first iterable',    input: 'csv' },
    { name: 'b',      type: 'list', hint: 'second iterable',   input: 'csv' },
    { name: 'strict', type: 'int',  hint: '1 = strict, empty = off', input: 'number-or-none' },
  ],
  cases: [
    { id: 'equal',      label: 'equal lengths',   values: { a: '1,2,3', b: 'a,b,c',   strict: '' } },
    { id: 'a-shorter',  label: 'a shorter',       values: { a: '1,2',   b: 'a,b,c,d', strict: '' } },
    { id: 'strict-ok',  label: 'strict ok',       values: { a: '1,2,3', b: 'a,b,c',   strict: 1 } },
    { id: 'strict-err', label: 'strict fails',    values: { a: '1,2',   b: 'a,b,c',   strict: 1 } },
    { id: 'empty',      label: 'empty',           values: { a: '',      b: 'a,b',     strict: '' } },
  ],
  demoExplainer: 'zip stops at the shortest input by default — silently. Longer iterables lose their tail with no warning. Pass strict=True (Python 3.10+) to raise a ValueError instead. The demo materializes the iterator as a list of pairs.',

  patterns: [
    {
      name: 'Parallel iteration',
      desc: 'Same-position items from two lists, no indexing.',
      code: 'for name, age in zip(names, ages):\n    print(name, age)',
    },
    {
      name: 'Dict from two lists',
      desc: 'Keys from one, values from the other.',
      code: 'lookup = dict(zip(keys, values))',
    },
    {
      name: 'Transpose rows to columns',
      desc: 'Star-unpack a list of rows — the classic matrix flip.',
      code: 'rows = [[1, 2, 3], [4, 5, 6]]\ncols = list(zip(*rows))\n# [(1, 4), (2, 5), (3, 6)]',
    },
  ],

  examples: [
    { title: 'Basic pair',            code: 'list(zip([1,2,3], ["a","b","c"]))',            returns: '[(1, "a"), (2, "b"), (3, "c")]' },
    { title: 'Uneven — truncates',    code: 'list(zip([1,2], ["a","b","c"]))',              returns: '[(1, "a"), (2, "b")]' },
    { title: 'strict raises',         code: 'list(zip([1,2], ["a","b","c"], strict=True))', returns: 'ValueError: zip() argument 2 is longer than argument 1' },
    { title: 'Three iterables',       code: 'list(zip([1,2],["a","b"],[True,False]))',      returns: '[(1,"a",True), (2,"b",False)]' },
  ],

  pitfalls: [
    {
      name: 'Silent truncation to shortest',
      desc: 'The default drops the tail without warning — a classic source of bugs where you thought all items were processed.',
      wrong: { label: 'Loses data', code: 'names = ["Ann", "Bob", "Cara"]\nages  = [30, 40]\nlist(zip(names, ages))', output: '[("Ann", 30), ("Bob", 40)]  # Cara silently dropped' },
      fix:   { label: 'strict=True', code: 'list(zip(names, ages, strict=True))', output: 'ValueError: zip() argument 2 is shorter than argument 1' },
    },
    {
      name: 'Iterator exhausts after one pass',
      desc: 'zip returns an iterator, not a list.',
      wrong: { label: 'Empty on reuse', code: 'z = zip(a, b)\nlist(z)  # populated\nlist(z)  # []', output: 'second call is empty' },
      fix:   { label: 'Materialize',   code: 'pairs = list(zip(a, b))', output: 'reusable list' },
    },
    {
      name: 'Passing one iterable pairs with nothing',
      desc: 'zip of a single iterable gives 1-tuples, not the items themselves.',
      wrong: { label: 'Odd shape',   code: 'list(zip([1, 2, 3]))', output: '[(1,), (2,), (3,)]' },
      fix:   { label: 'Just iterate', code: 'for x in [1, 2, 3]: ...', output: '1, 2, 3' },
    },
  ],

  when: {
    use: [
      'Parallel iteration over aligned sequences',
      'Building a dict from parallel key/value lists',
      'Transposing rows to columns with zip(*rows)',
      'Aligned-length invariants → strict=True',
    ],
    avoid: [
      'Different-length inputs where truncation would hide bugs → strict=True or itertools.zip_longest',
      'Single iterable with counter → enumerate',
      'Cartesian product → itertools.product',
    ],
  },

  notes: {
    complexity: 'O(1) per step',
    return:     'zip object (iterator), not list',
    cpython:    'Python/bltinmodule.c :: zip_next',
    memory:     'O(1) — one item per iterable held at a time',
    threadSafe: 'Only as safe as the underlying iterables',
  },

  related: [
    { name: 'enumerate', slug: 'enumerate', when: 'Index alongside items (single iterable)' },
    { name: 'sorted',    slug: 'sorted',    when: 'Align by order first, then pair' },
    { name: 'max',       slug: 'max',       when: 'Reduce parallel pairs to a single result' },
  ],

  faq: [
    {
      q: 'What happened to izip in Python 3?',
      a: 'zip in Python 2 built a list; itertools.izip was the lazy version. In Python 3 they merged — zip is lazy by default and izip is gone.',
    },
    {
      q: 'How do I keep the longer iterable when lengths differ?',
      a: 'itertools.zip_longest — pads with a fillvalue (None by default).',
      code: 'from itertools import zip_longest\nlist(zip_longest([1,2], ["a","b","c"], fillvalue="-"))\n# [(1, "a"), (2, "b"), ("-", "c")]',
    },
    {
      q: 'What does zip(*rows) actually do?',
      a: 'Star-unpacks a list of rows into positional arguments — turning rows into columns. It is the standard Python transpose.',
    },
  ],

  history: [
    { version: '2.0',  note: 'zip() introduced (returned a list).' },
    { version: '3.0',  note: 'zip() became lazy (returns an iterator).' },
    { version: '3.10', note: 'strict keyword parameter added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#zip',
    meta:  'zip',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the resulting pairs' },
  ],
};