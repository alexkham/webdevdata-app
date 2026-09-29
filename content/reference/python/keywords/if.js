// content/reference/python/keywords/if.js

export const meta = {
  slug:        'if',
  name:        'if',
  signature:   'if condition:',
  blurb:       'Run a block only when a condition is truthy — with elif for more tests, else for the fallback, and x if c else y as an expression.',
  category:    'control-flow',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'if elif else if statement else if conditional branch condition truthy falsy truthiness chained comparison ternary one line if keyword',
};

export const method = {
  slug:      'if',
  name:      'if',
  signature: 'if condition:',

  category:    'Control flow',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Python tests truthiness, not "== True": 0, empty strings, empty containers and None all count as false. elif chains tests, and only the first true branch runs.',

  covers: ['if', 'elif', 'else'],

  syntax: [
    { label: 'if', code: 'if condition:\n    body' },
    { label: 'if / elif / else', code: 'if test1:\n    first\nelif test2:\n    second\nelse:\n    fallback' },
    { label: 'conditional expression', code: 'x = a if condition else b' },
  ],

  cheat: {
    useFor:    'if x: / if a < x <= b: / elif for the next test / y = a if c else b',
    result:    'a statement — runs at most one branch; the ternary form is an expression',
    pairsWith: 'and, or, not, in, is, else, chained comparisons',
    watchOut:  'x == 1 or 2 is always true; the string "False" is truthy',
  },

  parameters: [
    { name: 'condition', type: 'expression', required: true,  default: null, desc: 'Any value. Python calls bool() on it: 0, 0.0, "", [], {}, set(), None and False are false; almost everything else is true.' },
    { name: 'body',      type: 'block',      required: true,  default: null, desc: 'Runs when the condition is truthy. Must not be empty — write pass for a placeholder.' },
    { name: 'elif',      type: 'block',      required: false, default: null, desc: 'Any number of further tests. Checked top to bottom only while every test above was false; the first true one wins.' },
    { name: 'else',      type: 'block',      required: false, default: null, desc: 'Runs when no if / elif test was true. At most one, always last.' },
  ],

  modes: [
    {
      id: 'if',
      label: 'if',
      blurb: 'Is the value truthy? Type anything — a number, text, or nothing at all.',
      params: [{ name: 'value', type: 'int | float | str', hint: 'number or text', input: 'auto' }],
      template: 'value = {$value}\nverdict = "falsy"\nif value:\n    verdict = "truthy"\nverdict',
      cases: [
        { id: 'zero',  label: '0',            values: { value: '0' } },
        { id: 'fzero', label: '0.0',          values: { value: '0.0' } },
        { id: 'empty', label: 'empty string', values: { value: '' } },
        { id: 'space', label: 'a space',      values: { value: ' ' } },
        { id: 'false', label: 'text "False"', values: { value: 'False' } },
        { id: 'neg',   label: '-1',           values: { value: '-1' } },
      ],
    },
    {
      id: 'elif',
      label: 'if / elif / else',
      blurb: 'Grade a score. Tests run top to bottom and the first true one wins — so the order of the thresholds matters.',
      params: [{ name: 'score', type: 'int', hint: 'a whole number', input: 'number' }],
      template: 'score = {$score}\nif score >= 90:\n    grade = "A"\nelif score >= 75:\n    grade = "B"\nelif score >= 50:\n    grade = "C"\nelse:\n    grade = "F"\ngrade',
      cases: [
        { id: 'a',     label: '95',              values: { score: '95' } },
        { id: 'edge',  label: '90 (boundary)',   values: { score: '90' } },
        { id: 'b',     label: '89',              values: { score: '89' } },
        { id: 'c',     label: '50',              values: { score: '50' } },
        { id: 'f',     label: '-5',              values: { score: '-5' } },
      ],
    },
    {
      id: 'ternary',
      label: 'x if c else y',
      blurb: 'The conditional expression, with a chained comparison as its condition: 0 <= n < 10 means 0 <= n and n < 10.',
      params: [{ name: 'n', type: 'int', hint: 'a whole number', input: 'number' }],
      template: 'n = {$n}\n"in range" if 0 <= n < 10 else "out of range"',
      cases: [
        { id: 'in',    label: '7',          values: { n: '7' } },
        { id: 'low',   label: '0 (lower)',  values: { n: '0' } },
        { id: 'high',  label: '10 (upper)', values: { n: '10' } },
        { id: 'neg',   label: '-3',         values: { n: '-3' } },
      ],
    },
  ],
  demoExplainer: 'In the if tab, the condition is not compared with True — Python asks bool(value). Zero of any number type and the empty string are false; a single space and the text "False" are non-empty strings, so they are true. In the if / elif / else tab, 90 gets an A because the >= 90 test comes first; every later elif is skipped once one branch has run. In the x if c else y tab, the upper bound 10 is excluded because the chain reads n < 10.',

  patterns: [
    {
      name: 'Guard clause',
      desc: 'Handle the bad case first and leave early, instead of nesting the happy path.',
      code: 'def area(w, h):\n    if w < 0 or h < 0:\n        raise ValueError("negative size")\n    return w * h',
    },
    {
      name: 'Empty-or-None check',
      desc: 'if not items covers None, [] and "" in one test. Use is None when an empty value is valid.',
      code: 'def first(items):\n    if not items:\n        return None\n    return items[0]',
    },
    {
      name: 'Membership instead of or-chains',
      desc: 'in a set / tuple replaces x == a or x == b or x == c.',
      code: 'def is_weekend(day):\n    return day in {"sat", "sun"}',
    },
    {
      name: 'Default with the conditional expression',
      desc: 'Pick a value in one line; only the chosen side is evaluated.',
      code: 'def label(n):\n    return "item" if n == 1 else "items"',
    },
  ],

  examples: [
    { title: 'if / elif / else',                   code: "t = 18\nif t < 0:\n    print('freezing')\nelif t < 20:\n    print('cool')\nelse:\n    print('warm')", returns: 'cool' },
    { title: 'Falsy values',                       code: "[bool(v) for v in (0, 0.0, '', [], {}, None)]",            returns: '[False, False, False, False, False, False]' },
    { title: 'Non-empty is truthy — even "False"', code: "[bool(v) for v in ('False', '0', ' ', [0], -1)]",           returns: '[True, True, True, True, True]' },
    { title: 'Chained comparison',                 code: 'x = 5\n1 < x < 10',                                        returns: 'True' },
    { title: 'Chains compare neighbours only',     code: '1 < 3 > 2',                                                returns: 'True' },
    { title: 'Conditional expression',             code: "n = 3\n'odd' if n % 2 else 'even'",                         returns: "'odd'" },
    { title: 'Only the first true branch runs',    code: "x = 100\nif x > 10:\n    print('big')\nelif x > 50:\n    print('huge')", returns: 'big' },
    { title: 'else also belongs to loops and try', code: "for n in []:\n    pass\nelse:\n    print('loop else')\ntry:\n    pass\nexcept ValueError:\n    pass\nelse:\n    print('try else')", returns: 'loop else\ntry else' },
  ],

  pitfalls: [
    {
      name: 'x == a or b is always true',
      desc: 'It parses as (x == a) or b, and a non-empty b is truthy on its own. Compare each value, or use in.',
      wrong: { label: 'or-chain of values', code: "answer = 'no'\nif answer == 'y' or 'yes':\n    print('accepted')", output: 'accepted' },
      fix:   { label: 'membership test',    code: "answer = 'no'\nif answer in ('y', 'yes'):\n    print('accepted')\nelse:\n    print('rejected')", output: 'rejected' },
    },
    {
      name: 'Separate ifs instead of elif',
      desc: 'Independent if statements are all tested, so a value can match several branches. elif stops at the first match.',
      wrong: { label: 'three ifs', code: "n = 95\nhits = []\nif n > 50:\n    hits.append('pass')\nif n > 90:\n    hits.append('top')\nhits", output: "['pass', 'top']" },
      fix:   { label: 'most specific first + elif', code: "n = 95\nif n > 90:\n    grade = 'top'\nelif n > 50:\n    grade = 'pass'\ngrade", output: "'top'" },
    },
    {
      name: 'if not x when 0 is a valid value',
      desc: 'if not x is also true for 0 and "". When only None means missing, test is None.',
      wrong: { label: 'truthiness test', code: "discount = 0\nif not discount:\n    discount = 10\ndiscount", output: '10' },
      fix:   { label: 'is None', code: "discount = 0\nif discount is None:\n    discount = 10\ndiscount", output: '0' },
    },
    {
      name: 'Using = instead of == in a condition',
      desc: 'Assignment is a statement, so it is a syntax error in an if test (the walrus := is the expression form).',
      wrong: { label: 'single =', code: "compile('if x = 5:\\n    pass', '<demo>', 'exec')", output: "SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?" },
      fix:   { label: 'comparison', code: 'x = 5\nif x == 5:\n    print("five")', output: 'five' },
    },
  ],

  when: {
    use: [
      'Choosing between actions based on a condition',
      'Guard clauses that reject bad input early',
      'Picking one of two values inline with a if c else b',
    ],
    avoid: [
      'Long elif chains mapping values to values → a dict lookup',
      'Matching on the shape of data (lists, dicts, objects) → match (3.10+)',
      'Returning a bool from a test → return the test itself, not if ...: return True',
    ],
  },

  notes: {
    cpython:      'The condition is evaluated once and converted with bool(), which calls __bool__, then falls back to __len__; objects with neither are always true',
    'Chaining':   'a < b < c evaluates b only once and stops at the first false comparison — it is a and b < c, not (a < b) < c',
    'else':       'else is shared with for / while (runs when no break happened) and try (runs when no exception was raised)',
  },

  related: [
    { name: 'match',   slug: 'match', when: 'Branch on the structure of a value (3.10+)' },
    { name: 'while',   slug: 'while', when: 'Repeat while a condition stays true' },
    { name: 'for',     slug: 'for',   when: 'for / else — else runs when no break happened' },
    { name: 'pass',    slug: 'pass',  when: 'Placeholder for an empty branch' },
    { name: 'a if c else b', slug: 'ternary', when: 'The conditional expression in depth', category: 'operators' },
    { name: 'and',     slug: 'and',   when: 'Combine conditions (short-circuit)', category: 'operators' },
    { name: 'not',     slug: 'not',   when: 'Negate a condition', category: 'operators' },
    { name: 'bool()',  slug: 'bool',  when: 'What counts as true or false', category: 'functions' },
  ],

  faq: [
    {
      q: 'Does Python have else if?',
      a: 'It is spelled elif. You can write else: followed by an indented if, but that nests one level deeper for each test; elif keeps the whole chain flat. There is no switch statement — use elif, a dict lookup, or match (3.10+).',
    },
    {
      q: 'What values are false in an if statement?',
      a: 'False, None, zero of any numeric type (0, 0.0, 0j), and empty containers or strings ("", [], (), {}, set(), range(0)). Everything else is true, including the strings "0", "False" and " ", and a list containing a zero.',
    },
    {
      q: 'How do I write a one-line if/else in Python?',
      a: 'Use the conditional expression: result = a if condition else b. The else part is required. For a statement without else, if condition: do_something() on one line is legal but style guides discourage it.',
    },
    {
      q: 'Is if x: the same as if x == True:?',
      a: 'No. if x: asks bool(x), so 5, "text" and [1] pass. x == True is only true for True itself and values equal to 1, such as 1 and 1.0. Write if x: for truthiness and if x is True: in the rare case you need the exact object.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#the-if-statement',
    meta:  'The if statement',
  },
};
