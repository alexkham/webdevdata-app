// content/reference/python/stdlib/collections/defaultdict.js

export const meta = {
  slug:        'defaultdict',
  name:        'collections.defaultdict',
  signature:   'collections.defaultdict(default_factory=None, /, [...])',
  blurb:       'A dict that builds a missing value with default_factory() the first time a key is read — the standard tool for grouping and counting.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'defaultdict python collections.defaultdict default value dict of lists group by grouping default_factory defaultdict.default_factory defaultdict.copy __missing__ nested dict keyerror',
};

export const method = {
  slug:      'defaultdict',
  name:      'collections.defaultdict',
  signature: 'collections.defaultdict(default_factory=None, /, [...])',
  returns:   { type: 'defaultdict', desc: 'A dict subclass; the remaining arguments are passed to dict().' },

  category:    'collections class',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'd[key] on a missing key calls default_factory() with no arguments, stores the result and returns it. Only d[key] does this — get(), "in" and pop() behave exactly like a plain dict.',

  covers: ['defaultdict', 'defaultdict.default_factory', 'defaultdict.copy'],

  cheat: {
    commonCall: 'groups = defaultdict(list)',
    returns:    "defaultdict(<class 'list'>, {})",
    replaces:   'd.setdefault(k, []).append(v) and "if k not in d" checks',
    watchOut:   'pass the TYPE (list), not a call (list())',
  },

  parameters: [
    { name: 'default_factory', type: 'callable | None', required: false, default: 'None', desc: 'Called with no arguments to make each missing value: list, int, set, dict, a lambda … None behaves like a plain dict (KeyError).' },
    { name: '[...]',           type: 'dict arguments',  required: false, default: null,   desc: 'Anything dict() accepts: a mapping, key/value pairs, keyword arguments.' },
  ],

  attributes: [
    { name: 'default_factory', type: 'callable | None', meaning: 'The factory used by __missing__. Writable: set it to None to stop creating keys.' },
  ],

  modes: [
    {
      id: 'group',
      label: 'group',
      blurb: 'Group words by length with defaultdict(list).',
      params: [{ name: 'words', type: 'list[str]', hint: 'comma-separated words', input: 'csv' }],
      template: 'from collections import defaultdict\ngroups = defaultdict(list)\nfor w in {$words}:\n    groups[len(w)].append(w)\ngroups',
      cases: [
        { id: 'animals', label: 'animals', values: { words: 'cat, horse, dog, mouse, ox' } },
        { id: 'none',    label: 'no words', values: { words: '' } },
      ],
    },
    {
      id: 'count',
      label: 'count',
      blurb: 'defaultdict(int) starts every key at 0, so += 1 just works.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'from collections import defaultdict\ncounts = defaultdict(int)\nfor ch in {$text}:\n    counts[ch] += 1\ncounts',
      cases: [
        { id: 'hello', label: 'hello', values: { text: 'hello' } },
        { id: 'empty', label: 'empty', values: { text: '' } },
      ],
    },
    {
      id: 'read',
      label: 'which reads insert?',
      blurb: 'get() and "in" do not create keys; d[key] does.',
      params: [
        { name: 'a', type: 'str', hint: 'key read with get()',  input: 'text' },
        { name: 'b', type: 'str', hint: 'key tested with in',   input: 'text' },
        { name: 'c', type: 'str', hint: 'key read with d[key]', input: 'text' },
      ],
      template: 'from collections import defaultdict\nd = defaultdict(list)\nd.get({$a})\n{$b} in d\nd[{$c}]\nd',
      cases: [
        { id: 'three', label: 'three keys', values: { a: 'x', b: 'y', c: 'z' } },
        { id: 'same',  label: 'same key',   values: { a: 'k', b: 'k', c: 'k' } },
      ],
    },
  ],
  demoExplainer: 'Grouping by len(w) makes the keys ints in first-seen order — 3, 5, 2 for the animals. In the last tab only the key read with square brackets appears in the result: get() returned None and "in" returned False without touching the dict.',

  patterns: [
    {
      name: 'Group records',
      desc: 'A dict of lists in one line per record.',
      code: 'from collections import defaultdict\nby_dept = defaultdict(list)\nfor person in people:\n    by_dept[person.dept].append(person.name)',
    },
    {
      name: 'Unique values per key',
      desc: 'defaultdict(set) with .add().',
      code: 'from collections import defaultdict\ntags = defaultdict(set)\nfor post, tag in pairs:\n    tags[post].add(tag)',
    },
    {
      name: 'Nested (two-level) dict',
      desc: 'The factory can itself build a defaultdict.',
      code: 'from collections import defaultdict\ngrid = defaultdict(lambda: defaultdict(int))\ngrid[row][col] += 1',
    },
    {
      name: 'Freeze it when done',
      desc: 'Turn it back into a plain dict so later typos raise KeyError.',
      code: 'result = dict(groups)',
    },
  ],

  examples: [
    { title: 'Missing key gets a fresh list', code: "from collections import defaultdict\nd = defaultdict(list)\nd['a'].append(1)\nd", returns: "defaultdict(<class 'list'>, {'a': [1]})" },
    { title: 'int() starts at 0',             code: "from collections import defaultdict\nd = defaultdict(int)\nd['x'] += 5\nd['x']", returns: '5' },
    { title: 'Constant default with a lambda', code: "from collections import defaultdict\nd = defaultdict(lambda: 'n/a')\nd['missing']", returns: "'n/a'" },
    { title: 'Initial contents like dict()',  code: "from collections import defaultdict\ndefaultdict(int, {'a': 1}, b=2)", returns: "defaultdict(<class 'int'>, {'a': 1, 'b': 2})" },
    { title: 'default_factory is an attribute', code: 'from collections import defaultdict\ndefaultdict(set).default_factory', returns: "<class 'set'>" },
    { title: 'copy() keeps the factory',      code: "from collections import defaultdict\nd = defaultdict(list, a=[1])\nd.copy()", returns: "defaultdict(<class 'list'>, {'a': [1]})" },
    { title: 'No factory: plain KeyError',    code: "from collections import defaultdict\ndefaultdict()['k']", returns: "KeyError: 'k'" },
  ],

  pitfalls: [
    {
      name: 'Calling the factory',
      desc: 'default_factory must be callable. list() is an empty list, not a factory.',
      wrong: { label: 'defaultdict(list())', code: 'from collections import defaultdict\ndefaultdict(list())', output: 'TypeError: first argument must be callable or None' },
      fix:   { label: 'defaultdict(list)',   code: 'from collections import defaultdict\ndefaultdict(list)', output: "defaultdict(<class 'list'>, {})" },
    },
    {
      name: 'Lookups that silently add keys',
      desc: 'Every d[key] read of a missing key inserts it — even inside an if. Use "in" or get() to look without inserting.',
      wrong: { label: 'd[key] in a test', code: "from collections import defaultdict\nd = defaultdict(int)\nif d['typo'] > 0:\n    pass\nlen(d)", output: '1' },
      fix:   { label: 'd.get(key, 0)',    code: "from collections import defaultdict\nd = defaultdict(int)\nif d.get('typo', 0) > 0:\n    pass\nlen(d)", output: '0' },
    },
    {
      name: 'Expecting get() to use the factory',
      desc: 'Only __getitem__ calls __missing__. get() returns None (or your default) like any dict.',
      wrong: { label: 'd.get(key)', code: "from collections import defaultdict\nprint(defaultdict(list).get('k'))", output: 'None' },
      fix:   { label: 'd[key]',     code: "from collections import defaultdict\ndefaultdict(list)['k']", output: '[]' },
    },
  ],

  when: {
    use: [
      'Building dicts of lists, sets or counters',
      'Accumulating into keys you do not know in advance',
    ],
    avoid: [
      'Counting → Counter (adds most_common, arithmetic)',
      'A one-off default at a single call site → dict.get(key, default) or setdefault',
      'Handing data to code that relies on KeyError → convert with dict(d)',
    ],
  },

  notes: {
    cpython:         'Modules/_collectionsmodule.c — defaultdict defines __missing__, __repr__, copy/__copy__, __reduce__ and the | operators itself; everything else is inherited from dict',
    '__missing__':   'dict.__getitem__ calls __missing__(key) for absent keys; defaultdict inserts default_factory() there, or raises KeyError(key) when the factory is None',
    'repr':          "The factory is shown by its own repr: defaultdict(<class 'list'>, {...}); a lambda factory shows as <function <lambda> at 0x…>",
  },

  related: [
    { name: 'Counter',          slug: 'counter',    when: 'Specialised counting dict' },
    { name: 'dict',             slug: 'dict',       when: 'The base class', category: 'functions' },
    { name: 'dict.setdefault',  slug: 'setdefault', when: 'A default at one call site', category: 'functions' },
    { name: 'dict.get',         slug: 'get',        when: 'Read with a default, never inserts', category: 'functions' },
    { name: 'KeyError',         slug: 'keyerror',   when: 'What a plain dict raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is defaultdict in Python?',
      a: 'A dict subclass from collections that calls a factory (list, int, set …) to create a value for any missing key accessed with d[key], stores it and returns it — so you never get KeyError when building up groups or counts.',
    },
    {
      q: 'What is the difference between defaultdict and dict.get?',
      a: 'd.get(key, default) returns the default without storing it. defaultdict stores the new value, which is what you want when you then append to it or increment it.',
    },
    {
      q: 'How do I convert a defaultdict to a normal dict?',
      a: 'dict(d). For nested defaultdicts, convert every level (for example with a recursive function or a dict comprehension). json.dumps accepts a defaultdict directly because it is a dict subclass.',
    },
    {
      q: 'Why does printing my defaultdict show <class \'list\'>?',
      a: 'The repr starts with the repr of default_factory. The data is the dict literal that follows it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.defaultdict',
    meta:  'collections.defaultdict',
  },
};
