// content/reference/python/stdlib/itertools/islice.js

export const meta = {
  slug:        'islice',
  name:        'itertools.islice',
  signature:   'itertools.islice(iterable, stop)  ·  itertools.islice(iterable, start, stop[, step])',
  blurb:       'Slice any iterator — generators, files, infinite counters — the way [start:stop:step] slices a list, without negative indices.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'itertools islice slice a generator first n items take n skip lines head of iterator python islice negative index stop argument for islice must be none or an integer sys.maxsize',
};

export const method = {
  slug:      'islice',
  name:      'itertools.islice',
  signature: 'itertools.islice(iterable, start, stop, step=1)',
  returns:   { type: 'iterator', desc: 'The selected items, read lazily from the underlying iterator.' },

  category:    'itertools function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Generators cannot be indexed, so gen[:5] is a TypeError — islice(gen, 5) is the answer. It consumes the underlying iterator as it goes, and it cannot count from the end.',

  covers: ['islice'],

  cheat: {
    commonCall: 'list(islice(gen, 5))',
    returns:    'the first 5 items (fewer if gen is shorter)',
    replaces:   'gen[:5] (TypeError) and manual counters with break',
    watchOut:   'no negative start/stop/step — ValueError',
  },

  parameters: [
    { name: 'iterable', type: 'iterable',   required: true,  default: null,   desc: 'Any iterable; it is advanced (consumed) as islice reads from it.' },
    { name: 'start',    type: 'int | None', required: false, default: '0',    desc: 'Items to skip first. With a single number argument, that number is stop, not start.' },
    { name: 'stop',     type: 'int | None', required: true,  default: null,   desc: 'Index to stop before; None means "until the end".' },
    { name: 'step',     type: 'int | None', required: false, default: '1',    desc: 'Take every step-th item; must be positive.' },
  ],

  modes: [
    {
      id: 'slice',
      label: 'start, stop, step',
      blurb: 'Same meaning as text[start:stop:step] — leave a field empty for None.',
      params: [
        { name: 'text',  type: 'str',        hint: 'some text',     input: 'text' },
        { name: 'start', type: 'int | None', hint: 'start or empty', input: 'number-or-none' },
        { name: 'stop',  type: 'int | None', hint: 'stop or empty',  input: 'number-or-none' },
        { name: 'step',  type: 'int | None', hint: 'step or empty',  input: 'number-or-none' },
      ],
      template: "from itertools import islice\n''.join(islice({$text}, {$start}, {$stop}, {$step}))",
      cases: [
        { id: 'every2', label: 'every 2nd',  values: { text: 'abcdefgh', start: '1', stop: '7', step: '2' } },
        { id: 'tail',   label: 'skip 3',     values: { text: 'abcdefgh', start: '3', stop: '', step: '' } },
        { id: 'neg',    label: 'stop = -1',  values: { text: 'abcdefgh', start: '0', stop: '-1', step: '' } },
        { id: 'negs',   label: 'start = -2', values: { text: 'abcdefgh', start: '-2', stop: '', step: '' } },
        { id: 'zero',   label: 'step = 0',   values: { text: 'abcdefgh', start: '0', stop: '4', step: '0' } },
      ],
    },
    {
      id: 'consume',
      label: 'consumes',
      blurb: 'islice reads from the iterator you give it. What is left afterwards?',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'how many to take',      input: 'number' },
      ],
      template: 'from itertools import islice\nit = iter({$items})\nhead = list(islice(it, {$n}))\nhead, list(it)',
      cases: [
        { id: 'head', label: 'head + rest', values: { items: 'a, b, c, d, e', n: '2' } },
        { id: 'all',  label: 'n > len',     values: { items: 'a, b', n: '5' } },
      ],
    },
    {
      id: 'infinite',
      label: 'infinite input',
      blurb: 'Squares from a generator that never ends — islice makes it finite.',
      params: [{ name: 'n', type: 'int', hint: 'how many', input: 'number' }],
      template: 'from itertools import count, islice\nsquares = (x * x for x in count(1))\nlist(islice(squares, {$n}))',
      cases: [
        { id: 'five', label: 'first 5', values: { n: '5' } },
        { id: 'zero', label: 'n = 0',   values: { n: '0' } },
      ],
    },
  ],
  demoExplainer: 'A negative stop is rejected with "Stop argument for islice() must be None or an integer: 0 <= x <= sys.maxsize.", a negative start with "Indices for islice() must be None or an integer: 0 <= x <= sys.maxsize.", and a step of 0 with "Step for islice() must be a positive integer or None." In the consumes tab, the items islice took are gone from it — the rest of the iterator continues right after them; islice never reads more than it needs.',

  patterns: [
    {
      name: 'First n items of a generator',
      desc: 'The lazy equivalent of [:n].',
      code: 'from itertools import islice\nfirst_ten = list(islice(read_records(), 10))',
    },
    {
      name: 'Skip a header',
      desc: 'Start reading a file at line 2.',
      code: 'from itertools import islice\nwith open("data.csv", encoding="utf-8") as f:\n    for line in islice(f, 1, None):\n        handle(line)',
    },
    {
      name: 'The n-th item',
      desc: 'next() with a default avoids StopIteration when the iterator is short.',
      code: 'from itertools import islice\ndef nth(iterable, n, default=None):\n    return next(islice(iterable, n, None), default)',
    },
  ],

  examples: [
    { title: 'First n',                    code: 'from itertools import islice\nlist(islice(range(100), 4))',               returns: '[0, 1, 2, 3]' },
    { title: 'start, stop, step',          code: "from itertools import islice\nlist(islice('abcdefg', 1, 6, 2))",           returns: "['b', 'd', 'f']" },
    { title: 'stop=None reads to the end', code: "from itertools import islice\nlist(islice('abcde', 2, None))",            returns: "['c', 'd', 'e']" },
    { title: 'Generators cannot be sliced', code: 'gen = (x for x in range(10))\ngen[:3]',                                   returns: "TypeError: 'generator' object is not subscriptable" },
    { title: '…but islice works',           code: 'from itertools import islice\ngen = (x for x in range(10))\nlist(islice(gen, 3))', returns: '[0, 1, 2]' },
    { title: 'No negative indices',         code: "from itertools import islice\nislice('abc', -1)",                       returns: 'ValueError: Stop argument for islice() must be None or an integer: 0 <= x <= sys.maxsize.' },
    { title: 'Step must be positive',       code: "from itertools import islice\nislice('abc', 0, 2, 0)",                  returns: 'ValueError: Step for islice() must be a positive integer or None.' },
  ],

  pitfalls: [
    {
      name: 'Calling islice twice on the same iterator',
      desc: 'Each call continues where the iterator stopped — islice(it, 3) a second time gives the NEXT three items, not the same three.',
      wrong: { label: 'same iterator', code: 'from itertools import islice\nit = iter(range(10))\nlist(islice(it, 3)), list(islice(it, 3))', output: '([0, 1, 2], [3, 4, 5])' },
      fix:   { label: 'a list',        code: 'items = list(range(10))\nitems[:3], items[:3]', output: '([0, 1, 2], [0, 1, 2])' },
    },
    {
      name: 'Taking the last n items',
      desc: 'islice cannot count from the end. collections.deque(maxlen=n) keeps the last n in one pass.',
      wrong: { label: 'negative start', code: 'from itertools import islice\nlist(islice(range(10), -3, None))', output: 'ValueError: Indices for islice() must be None or an integer: 0 <= x <= sys.maxsize.' },
      fix:   { label: 'deque(maxlen=3)', code: 'from collections import deque\nlist(deque(range(10), maxlen=3))', output: '[7, 8, 9]' },
    },
  ],

  when: {
    use: [
      'First n items of a generator, file or infinite iterator',
      'Skipping a prefix (headers) lazily',
      'Every k-th item of a stream',
    ],
    avoid: [
      'Lists, strings, tuples → ordinary slicing (faster, supports negatives)',
      'Last n items → collections.deque(iterable, maxlen=n)',
    ],
  },

  notes: {
    cpython:    'islice_new validates the arguments with the messages shown; islice_next skips items until the next wanted index and never reads past stop',
    'Range':    'start, stop and step must be None or ints from 0 to sys.maxsize (step from 1)',
    'Consumes': 'the underlying iterator advances; with start=k, the first k items are read and discarded',
  },

  related: [
    { name: 'slice()',              slug: 'slice',        when: 'The [start:stop:step] object for sequences', category: 'functions' },
    { name: 'next()',               slug: 'next',         when: 'Take a single item', category: 'functions' },
    { name: 'itertools.takewhile',  slug: 'takewhile',    when: 'Stop on a condition instead of a count' },
    { name: 'itertools.count / cycle / repeat', slug: 'count-cycle-repeat', when: 'Infinite iterators to cut down' },
    { name: 'itertools module',     slug: 'itertools',    when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the first n items of a generator in Python?',
      a: 'list(itertools.islice(gen, n)). It stops early if the generator has fewer than n items.',
    },
    {
      q: 'Why does islice raise "Stop argument for islice() must be None or an integer: 0 <= x <= sys.maxsize."?',
      a: 'islice does not support negative values (or floats). An iterator has no known length, so "from the end" is impossible. Convert to a list and slice normally, or keep the last n items with collections.deque(maxlen=n).',
    },
    {
      q: 'Does islice consume the iterator?',
      a: 'Yes. Reading from islice reads from the underlying iterator; items it skips are consumed too. A later read continues after the last item islice took.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.islice',
    meta:  'itertools.islice',
  },
};
