// content/reference/python/stdlib/itertools/count-cycle-repeat.js

export const meta = {
  slug:        'count-cycle-repeat',
  name:        'itertools.count / cycle / repeat',
  signature:   'itertools.count(start=0, step=1)  ·  itertools.cycle(iterable)  ·  itertools.repeat(object[, times])',
  blurb:       'The three infinite iterators: numbers forever, a sequence over and over, one value again and again.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'itertools count cycle repeat infinite iterator endless counter round robin repeat value forever python count step float a number is required',
};

export const method = {
  slug:      'count-cycle-repeat',
  name:      'itertools.count / cycle / repeat',
  signature: 'itertools.count(start=0, step=1)',
  returns:   { type: 'iterator', desc: 'count: start, start+step, …  cycle: the items, then the same items again, forever.  repeat: object, times times (forever without times).' },

  category:    'itertools functions',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'They never stop on their own. Pair them with something finite — zip(), islice(), takewhile() or a break — or your loop runs forever.',

  covers: ['count', 'cycle', 'repeat'],

  cheat: {
    commonCall: 'zip(count(1), names) · islice(cycle(colors), n) · repeat(0, n)',
    returns:    'lazy infinite (or times-limited) iterators',
    replaces:   'while True: i += 1 counters and modulo index tricks',
    watchOut:   'list(count()) never returns',
  },

  parameters: [
    { name: 'start',    type: 'int | float | Decimal | Fraction', required: false, default: '0', desc: 'count: first value. Any number type.' },
    { name: 'step',     type: 'number',   required: false, default: '1',  desc: 'count: added to the previous value each time (repeated addition, so float steps accumulate rounding error).' },
    { name: 'iterable', type: 'iterable', required: true,  default: null, desc: 'cycle: the items to repeat. They are saved during the first pass, so a one-shot iterator is fine.' },
    { name: 'object',   type: 'object',   required: true,  default: null, desc: 'repeat: the value to yield (the same object every time, not copies).' },
    { name: 'times',    type: 'int',      required: false, default: null, desc: 'repeat: how many times; omitted means forever, negative means zero times.' },
  ],

  modes: [
    {
      id: 'count',
      label: 'count',
      blurb: 'The first n values of count(start, step). Try a float step, or a string.',
      params: [
        { name: 'start', type: 'int | float', hint: 'start', input: 'auto' },
        { name: 'step',  type: 'int | float', hint: 'step',  input: 'auto' },
        { name: 'n',     type: 'int',         hint: 'how many to take', input: 'number' },
      ],
      template: 'from itertools import count, islice\nlist(islice(count({$start}, {$step}), {$n}))',
      cases: [
        { id: 'tens',  label: 'by tens',     values: { start: '10', step: '10', n: '4' } },
        { id: 'float', label: 'float step',  values: { start: '0', step: '0.1', n: '4' } },
        { id: 'down',  label: 'counting down', values: { start: '3', step: '-1', n: '5' } },
        { id: 'str',   label: 'a string',    values: { start: 'a', step: '1', n: '3' } },
      ],
    },
    {
      id: 'cycle',
      label: 'cycle',
      blurb: 'Deal n items round-robin from a short list.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'how many to take',      input: 'number' },
      ],
      template: 'from itertools import cycle, islice\nlist(islice(cycle({$items}), {$n}))',
      cases: [
        { id: 'teams', label: 'teams',       values: { items: 'red, blue', n: '5' } },
        { id: 'empty', label: 'empty input', values: { items: '', n: '3' } },
      ],
    },
    {
      id: 'repeat',
      label: 'repeat',
      blurb: 'repeat with times= is finite.',
      params: [
        { name: 'value', type: 'str', hint: 'value to repeat', input: 'text' },
        { name: 'times', type: 'int', hint: 'times',           input: 'number' },
      ],
      template: 'from itertools import repeat\nlist(repeat({$value}, {$times}))',
      cases: [
        { id: 'three', label: '3 times',  values: { value: 'hi', times: '3' } },
        { id: 'neg',   label: 'negative', values: { value: 'hi', times: '-2' } },
      ],
    },
    {
      id: 'number',
      label: 'number lines',
      blurb: 'zip stops at the shorter input, so count() can number a finite list.',
      params: [{ name: 'lines', type: 'list[str]', hint: 'comma-separated lines', input: 'csv' }],
      template: "from itertools import count\n[f'{n}. {line}' for n, line in zip(count(1), {$lines})]",
      cases: [
        { id: 'todo', label: 'to-do', values: { lines: 'buy milk, call Ana, fix bug' } },
      ],
    },
  ],
  demoExplainer: 'count adds step again and again, so a float step drifts: 0, 0.1, 0.2, 0.30000000000000004. A string start fails at once with "TypeError: a number is required". cycle over an empty input yields nothing (there is nothing to repeat), and repeat with a negative times yields nothing instead of raising.',

  patterns: [
    {
      name: 'Unique ids',
      desc: 'next() on a shared count() hands out 1, 2, 3, …',
      code: 'from itertools import count\n_ids = count(1)\ndef new_id():\n    return next(_ids)',
    },
    {
      name: 'Round-robin assignment',
      desc: 'zip a finite list with an infinite cycle.',
      code: 'from itertools import cycle\nassignments = dict(zip(tasks, cycle(workers)))',
    },
    {
      name: 'A constant argument for map',
      desc: 'repeat supplies the same value to every call; map stops at the shortest input.',
      code: 'from itertools import repeat\nsquares = list(map(pow, range(10), repeat(2)))',
    },
  ],

  examples: [
    { title: 'count with a step',           code: 'from itertools import count, islice\nlist(islice(count(5, 3), 4))',        returns: '[5, 8, 11, 14]' },
    { title: 'Float steps accumulate error', code: 'from itertools import count, islice\nlist(islice(count(1, 0.1), 4))',    returns: '[1, 1.1, 1.2000000000000002, 1.3000000000000003]' },
    { title: 'cycle through a short list',  code: "from itertools import cycle, islice\n''.join(islice(cycle('ab'), 5))",   returns: "'ababa'" },
    { title: 'repeat a fixed number of times', code: "from itertools import repeat\nlist(repeat('x', 3))",                  returns: "['x', 'x', 'x']" },
    { title: 'Numbering with zip',          code: "from itertools import count\nlist(zip(count(1), 'abc'))",              returns: "[(1, 'a'), (2, 'b'), (3, 'c')]" },
    { title: 'Constant argument for map',   code: 'from itertools import repeat\nlist(map(pow, [1, 2, 3], repeat(2)))',    returns: '[1, 4, 9]' },
    { title: 'count needs a number',        code: "from itertools import count\ncount('a')",                              returns: 'TypeError: a number is required' },
  ],

  pitfalls: [
    {
      name: 'repeat yields the SAME object',
      desc: 'repeat([], 3) gives one list three times — mutating it changes "all" of them.',
      wrong: { label: 'shared list', code: 'from itertools import repeat\nrows = list(repeat([], 3))\nrows[0].append(1)\nrows', output: '[[1], [1], [1]]' },
      fix:   { label: 'new list each time', code: 'rows = [[] for _ in range(3)]\nrows[0].append(1)\nrows', output: '[[1], [], []]' },
    },
    {
      name: 'Exact decimal steps',
      desc: 'Float steps drift because each value is the previous one plus step. Count integers and scale, or use Decimal.',
      wrong: { label: 'float step',   code: 'from itertools import count, islice\nlist(islice(count(0, 0.1), 4))[-1]', output: '0.30000000000000004' },
      fix:   { label: 'scale an int', code: 'from itertools import count, islice\n[i / 10 for i in islice(count(), 4)][-1]', output: '0.3' },
    },
  ],

  when: {
    use: [
      'Counters and id generators of unknown length',
      'Round-robin over a fixed set (workers, colours, players)',
      'A constant stream for map/zip/starmap',
    ],
    avoid: [
      'A known range of ints → range() (finite, sized, indexable)',
      'Numbering items → enumerate(items, start=1)',
      'A list of n mutable objects → a comprehension, not repeat',
    ],
  },

  notes: {
    cpython:    'count, cycle and repeat are C types in Modules/itertoolsmodule.c; count has a fast mode for an int start below sys.maxsize with step 1, and a slow mode that adds step with + otherwise',
    'Versions': 'count gained step and non-integer arguments in 3.1 (2.7 on the 2.x line)',
    'Memory':   'cycle keeps a copy of every item from the first pass',
  },

  related: [
    { name: 'itertools.islice', slug: 'islice',    when: 'Cut an infinite iterator to n items' },
    { name: 'itertools.takewhile', slug: 'takewhile', when: 'Stop an infinite iterator on a condition' },
    { name: 'enumerate()',      slug: 'enumerate', when: 'Numbering items — count(1) built in', category: 'functions' },
    { name: 'range()',          slug: 'range',     when: 'A finite, sized count', category: 'functions' },
    { name: 'itertools module', slug: 'itertools', when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I loop forever with a counter in Python?',
      a: 'for i in itertools.count(): … with a break when done. count(start, step) also takes floats or negative steps.',
    },
    {
      q: 'How do I cycle through a list in Python?',
      a: 'itertools.cycle(items) yields the items over and over. Bound it with zip() against a finite input or with islice(cycle(items), n).',
    },
    {
      q: 'What is itertools.repeat used for?',
      a: 'Supplying a constant: map(pow, xs, repeat(2)) squares xs, and zip(names, repeat(default)) pairs every name with a default. With times=n it is a finite iterator of n copies of the same object.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.count',
    meta:  'itertools.count, cycle, repeat',
  },
};
