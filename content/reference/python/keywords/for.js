// content/reference/python/keywords/for.js

export const meta = {
  slug:        'for',
  name:        'for',
  signature:   'for target in iterable:',
  blurb:       'Loop over the items of any iterable — lists, strings, dicts, files, generators — one at a time.',
  category:    'control-flow',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'for loop for-else for else iterate iteration loop over list range enumerate zip items break keyword',
};

export const method = {
  slug:      'for',
  name:      'for',
  signature: 'for target in iterable:',

  category:    'Control flow',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Python’s only counting-free loop: it walks an iterable item by item — and its optional else runs only when no break happened.',

  covers: ['for'],

  syntax: [
    { label: 'for', code: 'for target in iterable:\n    body' },
    { label: 'for / else', code: 'for target in iterable:\n    body      # may break\nelse:\n    no_break  # only if no break' },
  ],

  cheat: {
    useFor:    'for x in items / for i, x in enumerate(items) / for k, v in d.items()',
    result:    'a statement — no value; target stays bound to the last item',
    pairsWith: 'break, continue, else, range(), enumerate(), zip()',
    watchOut:  'else means "no break", not "empty"; never mutate the list you loop over',
  },

  parameters: [
    { name: 'target',   type: 'name / pattern', required: true,  default: null, desc: 'Assigned each item in turn. Can unpack: for i, x in … . Still bound to the last item after the loop.' },
    { name: 'iterable', type: 'expression',     required: true,  default: null, desc: 'Evaluated once, before the first iteration. Anything with __iter__ (or __getitem__).' },
    { name: 'body',     type: 'block',          required: true,  default: null, desc: 'Runs once per item. break leaves the loop, continue skips to the next item.' },
    { name: 'else',     type: 'block',          required: false, default: null, desc: 'Runs once after the last item — skipped if the loop was left with break (or return / an exception).' },
  ],

  modes: [
    {
      id: 'for',
      label: 'for',
      blurb: 'Add up a list. The loop variable survives the loop — unless the list was empty.',
      params: [{ name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'total = 0\nfor n in {$numbers}:\n    total += n\n(total, n)',
      cases: [
        { id: 'ints',  label: 'ints',       values: { numbers: '3, 5, 8' } },
        { id: 'mixed', label: 'with float', values: { numbers: '1, 2.5' } },
        { id: 'empty', label: 'empty list', values: { numbers: '' } },
      ],
    },
    {
      id: 'else',
      label: 'for / else',
      blurb: 'Search for the first negative number. else runs only when the loop finished without break.',
      params: [{ name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'for n in {$numbers}:\n    if n < 0:\n        result = f"found {n}"\n        break\nelse:\n    result = "no negatives"\nresult',
      cases: [
        { id: 'found', label: 'has a negative', values: { numbers: '4, -2, 7, -9' } },
        { id: 'none',  label: 'all positive',   values: { numbers: '4, 2, 7' } },
        { id: 'empty', label: 'empty list',     values: { numbers: '' } },
      ],
    },
    {
      id: 'enumerate',
      label: 'enumerate',
      blurb: 'Unpack (index, item) pairs straight into two names — no range(len(...)).',
      params: [{ name: 'word', type: 'str', hint: 'any text', input: 'text' }],
      template: 'pairs = []\nfor i, ch in enumerate({$word}, start=1):\n    pairs.append((i, ch))\npairs',
      cases: [
        { id: 'word',  label: 'a word',       values: { word: 'hey' } },
        { id: 'empty', label: 'empty string', values: { word: '' } },
      ],
    },
  ],
  demoExplainer: 'Two things to notice. In the for tab, n is still readable after the loop (it holds the last item) — but with an empty list the body never ran, so n was never bound and the last line fails. In the for / else tab, else is not "if empty": an empty list reaches else too, because nothing broke out of the loop.',

  patterns: [
    {
      name: 'Index and item together',
      desc: 'enumerate instead of range(len(...)).',
      code: 'for i, line in enumerate(lines, start=1):\n    print(i, line)',
    },
    {
      name: 'Two sequences in step',
      desc: 'zip stops at the shortest; strict=True (3.10+) raises on a length mismatch instead.',
      code: 'for name, score in zip(names, scores, strict=True):\n    print(name, score)',
    },
    {
      name: 'Dict keys and values',
      desc: 'Looping a dict gives keys; .items() gives both.',
      code: 'for key, value in config.items():\n    print(key, "=", value)',
    },
    {
      name: 'Search with a fallback',
      desc: 'for / else replaces a found-flag variable.',
      code: 'for user in users:\n    if user.is_admin:\n        break\nelse:\n    user = None',
    },
  ],

  examples: [
    { title: 'Loop over a list',            code: "for fruit in ['apple', 'pear']:\n    print(fruit)",               returns: 'apple\npear' },
    { title: 'range() counts',              code: 'for i in range(3):\n    print(i)',                                  returns: '0\n1\n2' },
    { title: 'Strings iterate by character', code: "for ch in 'hi!':\n    print(ch)",                                 returns: 'h\ni\n!' },
    { title: 'Dicts iterate by key',        code: "for k in {'a': 1, 'b': 2}:\n    print(k)",                          returns: 'a\nb' },
    { title: 'Unpacking in the target',     code: "for name, age in [('Ann', 31), ('Bo', 25)]:\n    print(name, age)",  returns: 'Ann 31\nBo 25' },
    { title: 'The target outlives the loop', code: 'for i in range(3):\n    pass\ni',                                   returns: '2' },
    { title: 'else runs when nothing broke', code: "for x in [1, 3, 5]:\n    if x % 2 == 0:\n        break\nelse:\n    print('no even number')", returns: 'no even number' },
  ],

  pitfalls: [
    {
      name: 'Removing items from the list you are looping over',
      desc: 'The loop walks by index; deleting shifts the remaining items left, so the one after each removal is skipped.',
      wrong: { label: 'remove while looping', code: 'nums = [1, 2, 2, 3]\nfor n in nums:\n    if n == 2:\n        nums.remove(n)\nnums', output: '[1, 2, 3]' },
      fix:   { label: 'build a new list',     code: 'nums = [1, 2, 2, 3]\nnums = [n for n in nums if n != 2]\nnums', output: '[1, 3]' },
    },
    {
      name: 'Reading else as "if the loop was empty"',
      desc: 'else runs whenever the loop was not left with break — including after a normal full pass.',
      wrong: { label: 'expects else to be skipped', code: "for x in [1, 2]:\n    pass\nelse:\n    print('empty?')", output: 'empty?' },
      fix:   { label: 'test emptiness directly',    code: "items = [1, 2]\nif not items:\n    print('empty')\nelse:\n    print(len(items), 'items')", output: '2 items' },
    },
    {
      name: 'Closures capture the variable, not the value',
      desc: 'Functions created in a loop all see the loop variable’s final value. Bind the current value as a default argument.',
      wrong: { label: 'late binding', code: 'funcs = []\nfor i in range(3):\n    funcs.append(lambda: i)\n[f() for f in funcs]', output: '[2, 2, 2]' },
      fix:   { label: 'default argument', code: 'funcs = []\nfor i in range(3):\n    funcs.append(lambda i=i: i)\n[f() for f in funcs]', output: '[0, 1, 2]' },
    },
    {
      name: 'Changing a dict’s size while looping over it',
      desc: 'Adding or deleting keys during iteration raises. Loop over a snapshot of the keys instead.',
      wrong: { label: 'delete during loop', code: "d = {'a': 1, 'b': 0}\nfor k in d:\n    if d[k] == 0:\n        del d[k]", output: 'RuntimeError: dictionary changed size during iteration' },
      fix:   { label: 'loop over list(d)',  code: "d = {'a': 1, 'b': 0}\nfor k in list(d):\n    if d[k] == 0:\n        del d[k]\nd", output: "{'a': 1}" },
    },
  ],

  when: {
    use: [
      'Doing something with every item of a collection, file or generator',
      'Searching with an early exit (break) and a not-found branch (else)',
      'Counting a fixed number of times with range()',
    ],
    avoid: [
      'Building a new list from an old one → a list comprehension',
      'Looping until a condition changes, not over items → while',
      'Summing / finding max / checking any → sum(), max(), any() directly',
    ],
  },

  notes: {
    cpython:        'Compiles to GET_ITER once, then FOR_ITER per step; the loop ends when the iterator raises StopIteration',
    'Scope':        'for does not create a scope — the target is an ordinary variable of the enclosing function or module',
    'Iterable':     'The iterable expression is evaluated once; reassigning the name inside the loop does not change what is looped over',
  },

  related: [
    { name: 'while',     slug: 'while',     when: 'Loop on a condition instead of over items' },
    { name: 'break',     slug: 'break',     when: 'Leave the loop early (skips else)' },
    { name: 'continue',  slug: 'continue',  when: 'Skip to the next item' },
    { name: 'range()',   slug: 'range',     when: 'Numbers to loop over', category: 'functions' },
    { name: 'enumerate()', slug: 'enumerate', when: 'Index + item pairs', category: 'functions' },
    { name: 'zip()',     slug: 'zip',       when: 'Several iterables in step', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does else do on a for loop?',
      a: 'It runs once after the loop finishes normally — that is, when the loop was not exited with break (or return, or an exception). It is meant for search loops: break when you find something, handle "not found" in else.',
    },
    {
      q: 'How do I get the index in a for loop?',
      a: 'Use enumerate: for i, item in enumerate(items). Pass start=1 to count from one. range(len(items)) works but is considered unidiomatic.',
    },
    {
      q: 'Is the loop variable available after the loop?',
      a: 'Yes — for does not create its own scope, so the target keeps the last item. If the iterable was empty the body never ran and the name is not bound at all (NameError if nothing assigned it before).',
    },
    {
      q: 'How do I loop backwards or with a step?',
      a: 'reversed(items) walks a sequence backwards without copying; range(start, stop, step) handles numeric steps, e.g. range(10, 0, -2).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#the-for-statement',
    meta:  'The for statement',
  },
};
