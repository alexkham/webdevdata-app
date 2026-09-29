// content/reference/python/exceptions/assertionerror.js

export const meta = {
  slug:        'assertionerror',
  name:        'AssertionError',
  signature:   'AssertionError(*args)',
  blurb:       'Raised when an assert statement finds its condition false. Meant for catching bugs — python -O removes asserts entirely.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'assertionerror assertion error assert statement assert message python -O optimize __debug__ pytest assert invariant',
};

export const method = {
  slug:      'assertionerror',
  name:      'AssertionError',
  signature: 'AssertionError(*args)',

  category:    'Runtime exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'assert cond, msg is shorthand for "if not cond: raise AssertionError(msg)" — but only while __debug__ is true, so it must never guard real input.',

  chain: ['BaseException', 'Exception', 'AssertionError'],

  cheat: {
    raisedBy: 'assert condition, message',
    message:  'the message after the comma — empty if none',
    quickFix: 'fix the broken assumption, or raise ValueError for bad input',
    watchOut: 'python -O strips every assert',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'assert passes its message expression as the single argument; with no message there are no args and the traceback line is bare AssertionError.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'An assert with a message. The f-string is only evaluated when the check fails.',
      params: [{ name: 'age', type: 'int', hint: 'try -5 or 200', input: 'number' }],
      template: "def set_age(age):\n    assert 0 <= age <= 150, f'age out of range: {age}'\n    return age\nset_age({$age})",
      cases: [
        { id: 'ok',   label: 'in range',  values: { age: '42' } },
        { id: 'neg',  label: 'negative',  values: { age: '-5' } },
        { id: 'high', label: 'too high',  values: { age: '200' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catching it works, but in production (-O) the assert is gone and nothing would be caught.',
      params: [{ name: 'age', type: 'int', hint: 'try -5 or 200', input: 'number' }],
      template: "def set_age(age):\n    assert 0 <= age <= 150, f'age out of range: {age}'\n    return age\ntry:\n    result = set_age({$age})\nexcept AssertionError as e:\n    result = f'rejected: {e}'\nresult",
      cases: [
        { id: 'ok',  label: 'in range', values: { age: '30' } },
        { id: 'neg', label: 'negative', values: { age: '-1' } },
      ],
    },
  ],
  demoExplainer: "The message after the comma becomes str(e), which is what the traceback line shows. Everything here depends on asserts being enabled: run the same file with python -O and set_age(-5) returns -5 without complaint. That is why this pattern belongs in tests and internal sanity checks, while user-supplied ages need an if + raise ValueError.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'The assert message as a one-element tuple, or () when the assert had no message.' },
  ],

  patterns: [
    {
      name: 'Internal invariant',
      desc: 'State something that must be true if your own code is correct. If it fires, it is a bug in the program, not bad input.',
      code: "def pop_min(heap):\n    assert heap, 'pop_min() on empty heap — caller should check'\n    return heap.pop(0)",
    },
    {
      name: 'Input validation done right',
      desc: 'Data from users, files or the network must be checked with an if that survives -O.',
      code: "def set_age(age):\n    if not 0 <= age <= 150:\n        raise ValueError(f'age out of range: {age}')\n    return age",
    },
    {
      name: 'Tests',
      desc: 'pytest rewrites plain assert statements to show both sides of a failed comparison.',
      code: "def test_total():\n    assert total([1, 2]) == 3",
    },
  ],

  examples: [
    { title: 'Assert without a message', code: 'x = -1\nassert x > 0', returns: 'AssertionError' },
    { title: 'Assert with a message',    code: "x = -1\nassert x > 0, f'x must be positive, got {x}'", returns: 'AssertionError: x must be positive, got -1' },
    { title: 'Passing assert does nothing', code: "x = 5\nassert x > 0\n'ok'", returns: "'ok'" },
    { title: 'The message is e.args[0]', code: "try:\n    assert False, 'boom'\nexcept AssertionError as e:\n    args = e.args\nargs", returns: "('boom',)" },
    { title: 'Any object can be the message', code: "try:\n    assert 1 == 2, {'expected': 2}\nexcept AssertionError as e:\n    detail = e.args[0]\ndetail", returns: "{'expected': 2}" },
    { title: 'Raise it directly',         code: "raise AssertionError('unreachable branch')", returns: 'AssertionError: unreachable branch' },
    { title: 'Asserts are on unless -O',  code: '__debug__', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'assert (condition, message) never fails',
      desc: 'Parentheses make a two-element tuple, and a non-empty tuple is always true. Python emits a SyntaxWarning for this, but the assert silently passes.',
      wrong: { label: 'Tuple', code: "x = -1\nassert (x > 0, 'x must be positive')\n'passed'", output: "'passed'" },
      fix:   { label: 'No parentheses', code: "x = -1\nassert x > 0, 'x must be positive'\n'passed'", output: 'AssertionError: x must be positive' },
    },
    {
      name: 'Validating user input with assert',
      desc: 'Under python -O (or PYTHONOPTIMIZE) the assert line is compiled away, so bad data flows straight through. compile(..., optimize=1) below is exactly what -O does to a module. Use an if and a real exception type.',
      wrong: { label: 'assert under -O', code: "src = '\\n'.join([\n    'def withdraw(balance, amount):',\n    \"    assert amount > 0, 'amount must be positive'\",\n    '    return balance - amount',\n])\nns = {}\nexec(compile(src, '<bank>', 'exec', optimize=1), ns)  # what python -O does\nns['withdraw'](100, -50)", output: '150' },
      fix:   { label: 'if + ValueError', code: "src = '\\n'.join([\n    'def withdraw(balance, amount):',\n    '    if amount <= 0:',\n    \"        raise ValueError('amount must be positive')\",\n    '    return balance - amount',\n])\nns = {}\nexec(compile(src, '<bank>', 'exec', optimize=1), ns)  # what python -O does\nns['withdraw'](100, -50)", output: 'ValueError: amount must be positive' },
    },
    {
      name: 'Side effects inside the assert',
      desc: 'The whole expression disappears under -O — including a call that does real work. Do the work first, assert on the result.',
      wrong: { label: 'Work inside assert', code: "src = 'items = [3, 1]\\nassert items.pop() == 1'\nns = {}\nexec(compile(src, '<s>', 'exec', optimize=1), ns)  # what python -O does\nns['items']", output: '[3, 1]' },
      fix:   { label: 'Work outside', code: "src = 'items = [3, 1]\\nlast = items.pop()\\nassert last == 1'\nns = {}\nexec(compile(src, '<s>', 'exec', optimize=1), ns)  # what python -O does\nns['items']", output: '[3]' },
    },
  ],

  when: {
    use: [
      'Internal invariants: "this can only happen if my code has a bug"',
      'Test code (pytest, unittest) and debugging checks during development',
      'Documenting an assumption right where it is relied on',
    ],
    avoid: [
      'Validating arguments, user input, config or file contents → ValueError / TypeError',
      'Security or permission checks — they vanish under -O',
      'Expressions with side effects',
    ],
  },

  notes: {
    'Equivalent to': 'if __debug__:\n    if not cond: raise AssertionError(msg)',
    'python -O':     '__debug__ becomes False and assert statements are not compiled at all',
    pytest:          'rewrites assert in test files to report the compared values',
  },

  related: [
    { name: 'ValueError', slug: 'valueerror', when: 'The right error for bad input values' },
    { name: 'TypeError',  slug: 'typeerror',  when: 'The right error for bad input types' },
    { name: 'RuntimeError', slug: 'runtimeerror', when: 'For invalid state that must be checked in production too' },
    { name: 'isinstance()', slug: 'isinstance', when: 'Common inside type-checking asserts', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I add a message to an assert?',
      a: "Put it after a comma: assert x > 0, f'x must be positive, got {x}'. The message expression is only evaluated when the assertion fails and becomes the exception's argument, so the traceback ends with AssertionError: x must be positive, got -1. Do not wrap condition and message in parentheses — that creates a tuple, which is always true.",
    },
    {
      q: 'Why should I not use assert to validate input?',
      a: "Because python -O (or the PYTHONOPTIMIZE environment variable) removes assert statements from the compiled code. Anything guarded only by assert is unchecked in optimized runs. assert is for conditions that indicate a bug in your own program; for data coming from outside, write if not ok: raise ValueError(...).",
    },
    {
      q: 'Why does my AssertionError have no message?',
      a: 'The assert had no message part (assert x > 0), so the exception has no args and prints as a bare AssertionError. The traceback still shows the failing line. Add ", message" to the assert, or run under pytest, which rewrites asserts to show the compared values.',
    },
    {
      q: 'Should I catch AssertionError?',
      a: 'Rarely. A failed assert means a bug, so letting it crash with a traceback is usually right. Test frameworks catch it to report failures; application code catching it is a sign the assert should have been a real validation with a specific exception.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#AssertionError',
    meta:  'Built-in exceptions',
  },
};
