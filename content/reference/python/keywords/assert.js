// content/reference/python/keywords/assert.js

export const meta = {
  slug:        'assert',
  name:        'assert',
  signature:   'assert condition, message',
  blurb:       'A debugging check: raise AssertionError if a condition is false — and vanish entirely under python -O.',
  category:    'errors-context',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'assert statement assertion assertionerror assert message assert tuple always true syntaxwarning python -o __debug__ sanity check invariant keyword',
};

export const method = {
  slug:      'assert',
  name:      'assert',
  signature: 'assert condition, message',

  category:    'Errors & context',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'A one-line sanity check for things that must be true if your code is correct. It is a statement, not a function — parentheses around both parts turn it into a check that can never fail.',

  covers: ['assert'],

  syntax: [
    { label: 'assert', code: 'assert condition' },
    { label: 'with a message', code: "assert condition, 'message'" },
    { label: 'means (roughly)', code: 'if __debug__:\n    if not condition:\n        raise AssertionError(msg)' },
  ],

  cheat: {
    useFor:    'assert invariants and assumptions in your own code and in tests',
    result:    'a statement — nothing if the condition is truthy, AssertionError(message) if not',
    pairsWith: 'AssertionError, __debug__, pytest, isinstance()',
    watchOut:  'never assert (cond, msg) — a tuple is always true; -O removes every assert',
  },

  parameters: [
    { name: 'condition', type: 'expression', required: true,  default: null, desc: 'Tested for truthiness. Falsy → AssertionError.' },
    { name: 'message',   type: 'expression', required: false, default: null, desc: 'Evaluated only when the assert fails, and passed to AssertionError. Any object; usually an f-string with the offending values.' },
  ],

  modes: [
    {
      id: 'assert',
      label: 'assert, message',
      blurb: 'An internal invariant: take() assumes callers never ask for more than is in stock.',
      params: [{ name: 'n', type: 'int', hint: 'more than 5 fails', input: 'number' }],
      template: "def take(stock, n):\n    assert n <= stock, f'cannot take {n}, only {stock} left'\n    return stock - n\ntake(5, {$n})",
      cases: [
        { id: 'ok',   label: 'n = 3', values: { n: '3' } },
        { id: 'fail', label: 'n = 8', values: { n: '8' } },
      ],
    },
    {
      id: 'tuple',
      label: 'tuple trap',
      blurb: 'The same check written twice. With parentheses around both parts it tests a tuple — which is never false.',
      params: [{ name: 'x', type: 'int', hint: 'try -1', input: 'number' }],
      template: "x = {$x}\nresults = []\ntry:\n    assert (x > 0, 'x must be positive')\n    results.append('tuple form: passed')\nexcept AssertionError:\n    results.append('tuple form: failed')\ntry:\n    assert x > 0, 'x must be positive'\n    results.append('real assert: passed')\nexcept AssertionError as e:\n    results.append(f'real assert: {e}')\nresults",
      cases: [
        { id: 'neg', label: 'x = -1', values: { x: '-1' } },
        { id: 'pos', label: 'x = 4',  values: { x: '4' } },
      ],
    },
  ],
  demoExplainer: 'In the tuple trap tab, the first assert passes for every x: (x > 0, "...") is a two-item tuple, and non-empty tuples are truthy. CPython notices at compile time and prints "SyntaxWarning: assertion is always true, perhaps remove parentheses?" to stderr — easy to miss in a log, invisible here. The second form is the real check. The failed-assert message is exactly the value after the comma.',

  patterns: [
    {
      name: 'Invariant inside your own code',
      desc: 'State what must be true if the code is correct.',
      code: "assert len(result) == len(items), 'lost items while merging'",
    },
    {
      name: 'Test assertion',
      desc: 'pytest rewrites plain asserts to show both sides of a failed comparison.',
      code: "def test_total():\n    assert total([1, 2]) == 3",
    },
    {
      name: 'Narrowing a type',
      desc: 'Documents an assumption (and satisfies type checkers).',
      code: 'assert user is not None\nprint(user.name)',
    },
    {
      name: 'Long condition over several lines',
      desc: 'Parenthesize only the condition, never the condition and message together.',
      code: "assert (\n    start <= end\n), f'bad range {start}..{end}'",
    },
  ],

  examples: [
    { title: 'A failing assert with a message', code: "assert 1 > 2, 'math is broken'",                      returns: 'AssertionError: math is broken' },
    { title: 'Without a message',              code: 'assert []',                                              returns: 'AssertionError' },
    { title: 'The message is any object',      code: "assert 0, {'code': 42}",                                returns: "AssertionError: {'code': 42}" },
    { title: 'The message is evaluated only on failure', code: "def details():\n    print('building message')\n    return 'details'\nassert True, details()\nassert False, details()", returns: 'building message\nAssertionError: details' },
    { title: 'The tuple warning, captured',    code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    compile(\"assert (1 > 2, 'msg')\", '<demo>', 'exec')\nprint(caught[0].category.__name__, caught[0].message)", returns: 'SyntaxWarning assertion is always true, perhaps remove parentheses?' },
    { title: 'Under -O, asserts are gone',      code: "code = compile(\"assert False, 'boom'\", '<demo>', 'exec', optimize=1)\nexec(code)\nprint('no error under -O')", returns: 'no error under -O' },
    { title: '__debug__ is what -O switches off', code: '__debug__',                                           returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'assert (condition, message) never fails',
      desc: 'assert is not a function. The parentheses build a tuple, and a non-empty tuple is always true — the only sign is a SyntaxWarning on stderr.',
      wrong: { label: 'parenthesized pair', code: "x = -1\nassert (x > 0, 'x must be positive')\n'passed'", output: "'passed'" },
      fix:   { label: 'comma outside',      code: "x = -1\nassert x > 0, 'x must be positive'\n'passed'", output: 'AssertionError: x must be positive' },
    },
    {
      name: 'Checks that must run in production',
      desc: 'python -O (or PYTHONOPTIMIZE) compiles asserts away. Here compile(optimize=1) does the same: the overdraft goes through. Use if + raise for anything that guards real data.',
      wrong: { label: 'assert as a guard', code: "src = '''\ndef withdraw(balance, amount):\n    assert amount <= balance, 'insufficient funds'\n    return balance - amount\nprint(withdraw(10, 50))\n'''\nexec(compile(src, '<demo>', 'exec', optimize=1))", output: '-40' },
      fix:   { label: 'if + raise',        code: "src = '''\ndef withdraw(balance, amount):\n    if amount > balance:\n        raise ValueError('insufficient funds')\n    return balance - amount\nprint(withdraw(10, 50))\n'''\nexec(compile(src, '<demo>', 'exec', optimize=1))", output: 'ValueError: insufficient funds' },
    },
  ],

  when: {
    use: [
      'Invariants: things that are true unless your own code has a bug',
      'Tests (pytest is built on plain assert)',
      'Documenting an assumption at the top of a tricky block',
    ],
    avoid: [
      'Validating user input, file contents or API arguments → if … raise ValueError / TypeError',
      'Anything with side effects in the condition — it disappears under -O',
      'Security or permission checks → an explicit if + raise',
    ],
  },

  notes: {
    cpython:   'With -O the compiler emits no code at all for assert statements, and __debug__ is False. The check happens at compile time, so .pyc files for optimized runs are cached separately (.opt-1.pyc)',
    'Message': 'On failure the message expression becomes AssertionError(message).args[0]; with no message, args is empty and the traceback shows a bare AssertionError',
    'Syntax':  'assert is a statement: assert(x) works only because (x) is just x in parentheses; assert(x, msg) is the tuple trap',
  },

  related: [
    { name: 'raise',          slug: 'raise',          when: 'Checks that must survive -O' },
    { name: 'try / except',   slug: 'try',            when: 'Catching AssertionError (rarely a good idea)' },
    { name: 'AssertionError', slug: 'assertionerror', when: 'The exception a failed assert raises', category: 'exceptions' },
    { name: 'SyntaxError',    slug: 'syntaxerror',    when: 'Its sibling SyntaxWarning flags the tuple trap', category: 'exceptions' },
    { name: 'isinstance()',   slug: 'isinstance',     when: 'Common inside type-checking asserts', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does my assert with parentheses always pass?',
      a: 'assert (x > 0, "msg") asserts a two-item tuple, and non-empty tuples are always truthy. Write assert x > 0, "msg" — the comma belongs to the assert statement. CPython warns: "SyntaxWarning: assertion is always true, perhaps remove parentheses?".',
    },
    {
      q: 'Are asserts removed in production?',
      a: 'Only if Python runs with -O / -OO or the PYTHONOPTIMIZE environment variable is set — then no code is generated for them. Most deployments do not use -O, but you cannot rely on either: never put a required check or a side effect in an assert.',
    },
    {
      q: 'How do I add a message to an assert?',
      a: 'After a comma: assert cond, f"expected {a} == {b}". The message is only evaluated if the assert fails, so it can be expensive to build.',
    },
    {
      q: 'Should I use assert or raise?',
      a: 'assert for "this cannot happen if my code is right" (a bug detector); raise for conditions that depend on input or the environment and can happen in correct programs.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement',
    meta:  'The assert statement',
  },
};
