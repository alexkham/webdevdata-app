// content/reference/python/functions/bool.js

export const meta = {
  slug:        'bool',
  name:        'bool',
  signature:   'bool(x=False)',
  blurb:       'Convert any value to True or False using Python\'s truthiness rules.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'bool boolean true false truthy falsy convert if test cast bool.bit_length bool.bit_count bool.to_bytes bool.from_bytes bool.as_integer_ratio bool.is_integer bool.conjugate',
};

export const method = {
  slug:      'bool',
  name:      'bool',
  signature: 'bool(x=False)',
  returns:   { type: 'bool', desc: 'True or False. Falsy values: 0, 0.0, "", [], (), {}, set(), None, False, and objects whose __bool__ or __len__ returns falsy. Everything else is truthy.' },

  category:    'Built-in function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The bool type constructor — the explicit form of the truthiness test that `if` uses implicitly.',

  cheat: {
    commonCall: 'if not bool(items):',
    returns:    'True or False — always',
    replaces:   'writing `if len(x) > 0 else False`-style verbose checks',
    watchOut:   'bool("False") is True — the STRING is non-empty; only the empty string is falsy',
  },

  parameters: [
    { name: 'x', type: 'Any', required: false, default: 'False', desc: 'Any value. No argument returns False. Objects are tested via __bool__() (if defined), then __len__() (0 is falsy), then default truthy.' },
  ],

  demoParams: [
    { name: 'x', type: 'str', hint: 'any value', input: 'text' },
  ],
  cases: [
    { id: 'zero',        label: 'zero',           values: { x: '0' } },
    { id: 'positive',    label: 'positive',       values: { x: '1' } },
    { id: 'negative',    label: 'negative',       values: { x: '-1' } },
    { id: 'empty-str',   label: 'empty string',   values: { x: '' } },
    { id: 'space-str',   label: 'space string',   values: { x: ' ' } },
    { id: 'false-str',   label: '"False" string', values: { x: 'False' } },
    { id: 'zero-str',    label: '"0" string',     values: { x: '0' } },
    { id: 'none-str',    label: '"None" string',  values: { x: 'None' } },
  ],
  demoExplainer: 'The demo passes text through the input, so most cases test string truthiness — the string "0" and the string "False" are BOTH truthy because they are non-empty. Only the empty string is falsy. In real code bool() also handles numbers, lists, dicts, sets, and custom objects via their __bool__ or __len__ methods.',

  patterns: [
    {
      name: 'Coerce to strict True/False',
      desc: 'Ensures downstream code sees a real bool, not a truthy string or list.',
      code: 'active = bool(user_input)   # store True or False, not the raw value',
    },
    {
      name: 'Filter truthy items',
      desc: 'filter(None, iterable) is idiomatic for \"keep truthy items\".',
      code: 'kept = list(filter(None, items))',
    },
    {
      name: 'Custom __bool__ on a class',
      desc: 'Objects can define their own truthiness — falls back to __len__ if absent.',
      code: 'class Cart:\n    def __bool__(self):\n        return self.total > 0',
    },
  ],

  examples: [
    { title: 'Zero is False',        code: 'bool(0)',           returns: 'False' },
    { title: 'Positive is True',     code: 'bool(1)',           returns: 'True' },
    { title: 'Empty string False',   code: 'bool("")',          returns: 'False' },
    { title: '"False" string True',  code: 'bool("False")',     returns: 'True  # non-empty string' },
    { title: 'Empty list False',     code: 'bool([])',          returns: 'False' },
    { title: 'List with 0 True',     code: 'bool([0])',         returns: 'True  # length > 0' },
    { title: 'None is False',        code: 'bool(None)',        returns: 'False' },
    { title: 'No argument',          code: 'bool()',            returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'bool("False") is TRUE',
      desc: 'The rule is emptiness, not semantics. The string "False" is a non-empty string — Python does not read English. Parsing user input to a real bool needs an explicit mapping.',
      wrong: { label: 'Assumed parse', code: 'is_admin = bool(request.form["is_admin"])   # user sent "False"', output: 'True  # non-empty string' },
      fix:   { label: 'Explicit map',  code: 'is_admin = request.form["is_admin"].lower() == "true"', output: 'False when the string says "false"' },
    },
    {
      name: 'bool([0]) is TRUE',
      desc: 'Truthiness of a container tests LENGTH, not contents. A list with a single zero is still non-empty, therefore truthy.',
      wrong: { label: 'Length-based', code: 'if bool(items):\n    ...  # runs for [0], [False], [None]', output: 'runs even when contents are all falsy' },
      fix:   { label: 'Test contents', code: 'if any(items):\n    ...  # only if at least one is truthy', output: 'runs only when a truthy item exists' },
    },
    {
      name: 'bool is a subclass of int — True == 1, False == 0',
      desc: 'True and False are literal integers under the hood. Arithmetic with bools works — sometimes usefully (sum a list of bools for a count), sometimes surprisingly.',
      wrong: { label: 'Weird types', code: 'True + True + False', output: '2  # integer arithmetic' },
      fix:   { label: 'Use it deliberately', code: 'count = sum(x > 0 for x in items)', output: 'idiomatic count of matches' },
    },
    {
      name: '`is True` and `is False` almost never match user expectations',
      desc: 'A truthy value is not the same as the True singleton. `if x is True:` fails for 1, "yes", or any custom truthy object.',
      wrong: { label: 'Identity check', code: 'if authenticated is True:\n    ...  # misses truthy 1', output: 'branch skipped for 1' },
      fix:   { label: 'Truthiness',      code: 'if authenticated:\n    ...  # standard truthiness', output: 'covers all truthy values' },
    },
  ],

  when: {
    use: [
      'Storing a strict True/False in place of an arbitrary truthy/falsy value',
      'Filtering truthy items — filter(None, iterable) or bool() in a comprehension',
      'Testing a custom object\'s __bool__ method explicitly',
      'Counting matches — `sum(cond(x) for x in items)` relies on True == 1',
    ],
    avoid: [
      'Parsing "true" / "false" strings from user input → explicit comparison',
      'Testing whether a container has truthy CONTENTS → any() instead',
      '`if x is True` — use plain `if x`',
      'Comparing custom-object truthiness across types → be explicit',
    ],
  },

  notes: {
    complexity: 'O(1) for most types; O(n) if __len__ walks a collection',
    return:     'bool — always the True or False singleton',
    cpython:    'Objects/boolobject.c :: bool_new — dispatches to type\'s __bool__ then __len__',
    memory:     'No allocation — True and False are singletons',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'any',   slug: 'any',   when: 'Truthy check across an iterable' },
    { name: 'all',   slug: 'all',   when: 'Every item truthy?' },
    { name: 'int',   slug: 'int',   when: 'True is 1 and False is 0 — bool is a subclass of int' },
    { name: 'len',   slug: 'len',   when: 'Length-based truthiness on containers' },
  ],

  faq: [
    {
      q: 'Does bool have any methods of its own?',
      a: 'None at all. bool is a SUBCLASS of int, and it adds nothing — every method you can call on True or False is int\'s: bit_length, bit_count, to_bytes, from_bytes, as_integer_ratio, is_integer and conjugate. They are documented on the int pages, and they behave exactly as they would on 1 and 0. Note that they return ints, not bools, so True.conjugate() is 1 rather than True.',
      code: "[m for m in dir(bool) if not m.startswith('_') and m not in dir(int)]\n# []  — bool adds nothing\nTrue.bit_length()   # 1",
    },
    {
      q: 'How do I parse "true" / "false" strings?',
      a: 'Explicit mapping — bool() would treat both as truthy since they are non-empty strings.',
      code: 'def parse_bool(s):\n    return s.strip().lower() in ("true", "yes", "1", "on")',
    },
    {
      q: 'Why is True + True == 2?',
      a: 'bool is a subclass of int in Python — True is 1 and False is 0 at the machine level. This makes summing a list of bools a natural way to count matches.',
    },
    {
      q: 'What values are falsy in Python?',
      a: 'Numeric zero (0, 0.0, 0j), the empty string, empty containers ([], (), {}, set(), b""), None, and False itself. Custom objects can add their own via __bool__ or __len__.',
    },
  ],

  history: [
    { version: '2.3', note: 'bool type introduced — before this, True and False were plain integers (1 and 0) named in the code.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#bool',
    meta:  'bool',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect input data' },
  ],
};