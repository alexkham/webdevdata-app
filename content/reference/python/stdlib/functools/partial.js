// content/reference/python/stdlib/functools/partial.js

export const meta = {
  slug:        'partial',
  name:        'functools.partial',
  signature:   'functools.partial(func, /, *args, **keywords)',
  blurb:       'Freeze some arguments of a function and get a new callable that needs only the rest — partial(int, base=2) is a binary parser.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'functools partial partial function application freeze arguments preset keyword arguments partial.func partial.args partial.keywords callback with arguments python partial vs lambda',
};

export const method = {
  slug:      'partial',
  name:      'functools.partial',
  signature: 'functools.partial(func, /, *args, **keywords)',
  returns:   { type: 'functools.partial', desc: 'A callable: calling it with more arguments calls func(*args, *more, **{**keywords, **more_keywords}).' },

  category:    'functools class',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'A partial object remembers a function plus some arguments. Positional arguments are prepended, keywords are merged — and a keyword given at call time overrides the frozen one.',

  covers: ['partial', 'partial.func', 'partial.args', 'partial.keywords'],

  cheat: {
    commonCall: 'parse_bin = partial(int, base=2)',
    returns:    "functools.partial(<class 'int'>, base=2)",
    replaces:   'lambda s: int(s, base=2)',
    watchOut:   'frozen positionals come FIRST — you cannot freeze a middle one by position',
  },

  parameters: [
    { name: 'func',       type: 'callable', required: true,  default: null, desc: 'The function to wrap. Read back as .func.' },
    { name: '*args',      type: 'object',   required: false, default: null, desc: 'Positional arguments put in front of the call-time ones. Read back as .args (a tuple).' },
    { name: '**keywords', type: 'object',   required: false, default: null, desc: 'Default keyword arguments; call-time keywords override them. Read back as .keywords (a dict).' },
  ],

  modes: [
    {
      id: 'base',
      label: 'partial(int, base=…)',
      blurb: 'The docs example: a parser for numbers in a fixed base.',
      params: [
        { name: 'base', type: 'int', hint: 'base (2–36, or 0)', input: 'number' },
        { name: 'text', type: 'str', hint: 'digits to parse',   input: 'text' },
      ],
      template: 'from functools import partial\nparse = partial(int, base={$base})\nparse({$text})',
      cases: [
        { id: 'bin',    label: 'binary',        values: { base: '2', text: '10010' } },
        { id: 'hex',    label: 'hex',           values: { base: '16', text: 'ff' } },
        { id: 'prefix', label: '0b prefix',     values: { base: '2', text: '0b1_0' } },
        { id: 'bad',    label: 'bad digit',     values: { base: '2', text: '102' } },
        { id: 'base1',  label: 'base 1',        values: { base: '1', text: '1' } },
      ],
    },
    {
      id: 'repr',
      label: 'repr & attributes',
      blurb: 'A partial object shows what it froze; .func, .args and .keywords expose the pieces.',
      params: [
        { name: 'first', type: 'str', hint: 'frozen positional', input: 'text' },
        { name: 'sep',   type: 'str', hint: 'frozen keyword',    input: 'text' },
      ],
      template: 'from functools import partial\np = partial(print, {$first}, sep={$sep})\np, p.args, p.keywords',
      cases: [
        { id: 'arrow', label: 'arrow', values: { first: '>>', sep: ' ' } },
        { id: 'quote', label: 'quotes', values: { first: "it's", sep: ', ' } },
      ],
    },
    {
      id: 'greet',
      label: 'override a keyword',
      blurb: 'Freeze the first argument; a call-time keyword beats the frozen default.',
      params: [
        { name: 'greeting', type: 'str',       hint: 'frozen greeting',       input: 'text' },
        { name: 'names',    type: 'list[str]', hint: 'comma-separated names', input: 'csv' },
      ],
      template: "from functools import partial\ndef greet(greeting, name, end='!'):\n    return f'{greeting}, {name}{end}'\nhello = partial(greet, {$greeting}, end='.')\n[hello(n) for n in {$names}] + [hello('you', end='?')]",
      cases: [
        { id: 'hi',  label: 'Hi',  values: { greeting: 'Hi', names: 'Ana, Ben' } },
        { id: 'one', label: 'no names', values: { greeting: 'Hey', names: '' } },
      ],
    },
  ],
  demoExplainer: 'int() accepts a matching prefix and single underscores between digits, so "0b1_0" in base 2 is 2. A digit that is not valid in the base gives "invalid literal for int() with base 2: \'102\'", and base 1 fails only when the partial is CALLED — "int() base must be >= 2 and <= 36, or 0" — because partial checks nothing but that func is callable. The repr tab shows the frozen pieces: args is a tuple, keywords a dict.',

  patterns: [
    {
      name: 'Callbacks with arguments',
      desc: 'Pass a ready-to-call function where only a no-argument callable is accepted.',
      code: 'from functools import partial\nbutton.on_click(partial(save, document, overwrite=True))',
    },
    {
      name: 'Preset key functions',
      desc: 'Freeze configuration once, use it everywhere.',
      code: 'from functools import partial\nimport json\npretty = partial(json.dumps, indent=2, sort_keys=True)\nprint(pretty(data))',
    },
    {
      name: 'map with extra arguments',
      desc: 'map calls with one argument; partial supplies the rest.',
      code: 'from functools import partial\nrounded = list(map(partial(round, ndigits=2), prices))',
    },
  ],

  examples: [
    { title: 'Binary parser (docs example)', code: "from functools import partial\nbasetwo = partial(int, base=2)\nbasetwo('10010')", returns: '18' },
    { title: 'repr shows the frozen arguments', code: 'from functools import partial\npartial(int, base=2)',                  returns: "functools.partial(<class 'int'>, base=2)" },
    { title: 'Positional arguments go first', code: 'from functools import partial\nsub10 = partial(divmod, 10)\nsub10(3)',   returns: '(3, 1)' },
    { title: '.func, .args, .keywords',  code: 'from functools import partial\np = partial(max, 1, 2, default=0)\np.func, p.args, p.keywords', returns: "(<built-in function max>, (1, 2), {'default': 0})" },
    { title: 'Call-time keywords win',   code: "from functools import partial\np = partial(sorted, reverse=True)\np([2, 3, 1], reverse=False)", returns: '[1, 2, 3]' },
    { title: 'func must be callable',    code: 'from functools import partial\npartial(42)',                                returns: 'TypeError: the first argument must be callable' },
  ],

  pitfalls: [
    {
      name: 'Freezing an argument that is not first',
      desc: 'Positional arguments are prepended, so partial(pow, 2) fixes the BASE. Freeze the second one by keyword.',
      wrong: { label: 'partial(pow, 2)',   code: 'from functools import partial\nsquare = partial(pow, 2)\nsquare(5)',     output: '32' },
      fix:   { label: 'partial(pow, exp=2)', code: 'from functools import partial\nsquare = partial(pow, exp=2)\nsquare(5)', output: '25' },
    },
    {
      name: 'The same argument twice',
      desc: 'A frozen positional plus the same name as a keyword at call time is a conflict.',
      wrong: { label: 'conflict', code: "from functools import partial\ndef greet(greeting, name):\n    return f'{greeting}, {name}'\nhi = partial(greet, 'Hi')\nhi(greeting='Hello', name='Ana')", output: "TypeError: greet() got multiple values for argument 'greeting'" },
      fix:   { label: 'freeze by keyword', code: "from functools import partial\ndef greet(greeting, name):\n    return f'{greeting}, {name}'\nhi = partial(greet, greeting='Hi')\nhi(greeting='Hello', name='Ana')", output: "'Hello, Ana'" },
    },
  ],

  when: {
    use: [
      'Callbacks and key functions that need preset arguments',
      'A configured variant of a function used in many places',
      'Picklable "lambda-like" callables (partial of a module-level function pickles; a lambda does not)',
    ],
    avoid: [
      'Methods inside a class body → partialmethod',
      'Logic beyond fixing arguments → a def or lambda',
    ],
  },

  notes: {
    cpython:      'partial is implemented in C (Modules/_functoolsmodule.c); Lib/functools.py has a Python fallback',
    'Flattening': 'partial(partial(f, 1), 2) is stored as partial(f, 1, 2) — nested partials are merged',
    'Attributes': '.func, .args and .keywords are read-only; there is no __name__ (copy one with update_wrapper if needed)',
  },

  related: [
    { name: 'functools.partialmethod', slug: 'partialmethod', when: 'The same for methods in a class body' },
    { name: 'functools.wraps',         slug: 'wraps',         when: 'Give a partial a __name__ and __doc__' },
    { name: 'int()',                   slug: 'int',           when: 'The function in the classic example', category: 'functions' },
    { name: 'lambda',                  slug: 'lambda',        when: 'The inline alternative', category: 'keywords' },
    { name: 'functools module',        slug: 'functools',     when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between functools.partial and a lambda?',
      a: 'Both create a callable with some arguments fixed. partial evaluates and stores the arguments at creation time, has a readable repr, exposes .func/.args/.keywords and can be pickled; a lambda looks names up when called and can contain any expression.',
    },
    {
      q: 'How do I fix the second argument of a function with partial?',
      a: 'Pass it by keyword: partial(pow, exp=2). Positional arguments given to partial always fill the leftmost parameters.',
    },
    {
      q: 'Why does my partial object have no __name__?',
      a: 'partial objects are not functions and do not copy the wrapped function\'s metadata. Use functools.update_wrapper(p, func) to copy __name__, __doc__ and friends onto it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.partial',
    meta:  'functools.partial',
  },
};
