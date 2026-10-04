// content/reference/python/stdlib/itertools/takewhile.js

export const meta = {
  slug:        'takewhile',
  name:        'itertools.takewhile / dropwhile',
  signature:   'itertools.takewhile(predicate, iterable)  ·  itertools.dropwhile(predicate, iterable)',
  blurb:       'Split an iterable at the first item that fails a test: takewhile keeps the prefix, dropwhile skips it and keeps the rest.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'itertools takewhile dropwhile take while condition skip while prefix stop at first false skip leading lines python takewhile vs filter',
};

export const method = {
  slug:      'takewhile',
  name:      'itertools.takewhile / dropwhile',
  signature: 'itertools.takewhile(predicate, iterable)',
  returns:   { type: 'iterator', desc: 'takewhile: items up to (not including) the first one where predicate is false. dropwhile: that item and everything after it.' },

  category:    'itertools functions',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Unlike filter(), these look at the predicate only until it first fails. After that, takewhile stops for good and dropwhile passes everything through unchecked.',

  covers: ['takewhile', 'dropwhile'],

  cheat: {
    commonCall: 'takewhile(lambda x: x < 10, nums)',
    returns:    'the leading run that passes the test',
    replaces:   'for … if not cond: break loops',
    watchOut:   'takewhile consumes the first failing item — it is lost',
  },

  parameters: [
    { name: 'predicate', type: 'callable', required: true, default: null, desc: 'Called with each item until it returns a false value.' },
    { name: 'iterable',  type: 'iterable', required: true, default: null, desc: 'The items. May be infinite for takewhile.' },
  ],

  modes: [
    {
      id: 'split',
      label: 'take / drop / filter',
      blurb: 'The same test, x < limit, through takewhile, dropwhile and a filtering comprehension.',
      params: [
        { name: 'nums',  type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'limit', type: 'int',               hint: 'limit',                   input: 'number' },
      ],
      template: 'from itertools import takewhile, dropwhile\ntaken = list(takewhile(lambda x: x < {$limit}, {$nums}))\ndropped = list(dropwhile(lambda x: x < {$limit}, {$nums}))\nfiltered = [x for x in {$nums} if x < {$limit}]\ntaken, dropped, filtered',
      cases: [
        { id: 'mid',   label: 'dips again', values: { nums: '1, 4, 6, 3, 2', limit: '5' } },
        { id: 'first', label: 'first fails', values: { nums: '9, 1, 2', limit: '5' } },
        { id: 'all',   label: 'all pass',   values: { nums: '1, 2, 3', limit: '5' } },
      ],
    },
    {
      id: 'comments',
      label: 'skip a header',
      blurb: "dropwhile skips leading lines that start with '#', and keeps later ones even if they do.",
      params: [{ name: 'lines', type: 'list[str]', hint: 'comma-separated lines', input: 'csv' }],
      template: "from itertools import dropwhile\nlist(dropwhile(lambda line: line.startswith('#'), {$lines}))",
      cases: [
        { id: 'hdr',  label: 'header comments', values: { lines: '# name, # date, data 1, # note, data 2' } },
        { id: 'none', label: 'no header',       values: { lines: 'data 1, data 2' } },
      ],
    },
  ],
  demoExplainer: 'In "dips again", 3 and 2 are below the limit but come after 6, so takewhile never reaches them and dropwhile lets them through — only the comprehension tests every item. If the very first item fails, takewhile yields nothing and dropwhile yields everything.',

  patterns: [
    {
      name: 'Read until a sentinel',
      desc: 'takewhile makes an infinite or long source finite.',
      code: 'from itertools import takewhile\nfor line in takewhile(lambda l: l.strip() != "END", lines):\n    handle(line)',
    },
    {
      name: 'Values below a bound from an infinite generator',
      desc: 'filter would never finish; takewhile stops at the first value too large.',
      code: 'from itertools import count, takewhile\nsquares = list(takewhile(lambda n: n < 1000, (i * i for i in count())))',
    },
    {
      name: 'Skip leading blank lines',
      desc: 'dropwhile stops checking once real content starts.',
      code: 'from itertools import dropwhile\nbody = list(dropwhile(lambda l: not l.strip(), lines))',
    },
  ],

  examples: [
    { title: 'takewhile keeps the prefix',  code: 'from itertools import takewhile\nlist(takewhile(lambda x: x < 5, [1, 4, 6, 3, 2]))', returns: '[1, 4]' },
    { title: 'dropwhile keeps the rest',    code: 'from itertools import dropwhile\nlist(dropwhile(lambda x: x < 5, [1, 4, 6, 3, 2]))', returns: '[6, 3, 2]' },
    { title: 'filter checks every item',    code: 'list(filter(lambda x: x < 5, [1, 4, 6, 3, 2]))',                                returns: '[1, 4, 3, 2]' },
    { title: 'Stops an infinite iterator',  code: 'from itertools import count, takewhile\nlist(takewhile(lambda n: n * n < 50, count(1)))', returns: '[1, 2, 3, 4, 5, 6, 7]' },
    { title: 'Strip leading spaces of a list', code: "from itertools import dropwhile\n''.join(dropwhile(str.isspace, '   hi there'))", returns: "'hi there'" },
  ],

  pitfalls: [
    {
      name: 'Losing the first failing item',
      desc: 'takewhile has to read an item to test it. When the test fails, that item is consumed and discarded — the source continues after it.',
      wrong: { label: 'reuse the iterator', code: 'from itertools import takewhile\nit = iter([1, 2, 10, 3])\nsmall = list(takewhile(lambda x: x < 5, it))\nsmall, list(it)', output: '([1, 2], [3])' },
      fix:   { label: 'take + drop on copies', code: 'from itertools import takewhile, dropwhile, tee\na, b = tee([1, 2, 10, 3])\nlist(takewhile(lambda x: x < 5, a)), list(dropwhile(lambda x: x < 5, b))', output: '([1, 2], [10, 3])' },
    },
    {
      name: 'Using takewhile as a filter',
      desc: 'Items that pass the test after the first failure are never reached.',
      wrong: { label: 'takewhile', code: 'from itertools import takewhile\nlist(takewhile(lambda w: w.islower(), ["a", "B", "c"]))', output: "['a']" },
      fix:   { label: 'comprehension', code: '[w for w in ["a", "B", "c"] if w.islower()]', output: "['a', 'c']" },
    },
  ],

  when: {
    use: [
      'Data with a meaningful prefix (sorted values, headers, preambles)',
      'Stopping an infinite iterator at a condition',
    ],
    avoid: [
      'Testing every item → filter() or a comprehension',
      'Need the failing item too → a for loop with break, or tee + dropwhile',
    ],
  },

  notes: {
    cpython:      'takewhile_next and dropwhile_next in Modules/itertoolsmodule.c; both keep a "stop"/"start" flag so the predicate is never called again after it first fails',
    'Laziness':   'dropwhile produces nothing until the predicate first fails — on an infinite iterator where it never fails, it never returns',
  },

  related: [
    { name: 'filter()',             slug: 'filter',      when: 'Test every item', category: 'functions' },
    { name: 'itertools.filterfalse / compress', slug: 'filterfalse', when: 'Keep the items that fail a test' },
    { name: 'itertools.islice',     slug: 'islice',      when: 'Stop after a count instead of a condition' },
    { name: 'break',                slug: 'break',       when: 'The loop form of takewhile', category: 'keywords' },
    { name: 'itertools module',     slug: 'itertools',   when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between takewhile and filter?',
      a: 'filter tests every item and keeps all that pass. takewhile stops at the first item that fails, even if later items would pass.',
    },
    {
      q: 'Why does takewhile lose an element?',
      a: 'To know where to stop it must read the first failing item, and it does not give it back. If you need it, use tee() and dropwhile() on the second copy, or a loop with break.',
    },
    {
      q: 'How do I skip lines until a condition in Python?',
      a: 'itertools.dropwhile(lambda line: not condition(line), lines) yields the first line that meets the condition and everything after it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.takewhile',
    meta:  'itertools.takewhile, dropwhile',
  },
};
