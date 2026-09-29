// content/reference/python/keywords/raise.js

export const meta = {
  slug:        'raise',
  name:        'raise',
  signature:   'raise Exception(message)',
  blurb:       'Throw an exception, re-raise the one being handled, or chain a new one to its cause with from.',
  category:    'errors-context',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'raise exception throw error raise from from none re-raise reraise exception chaining __cause__ __context__ custom exception notimplementederror keyword',
};

export const method = {
  slug:      'raise',
  name:      'raise',
  signature: 'raise Exception(message)',

  category:    'Errors & context',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'How Python code signals failure: raise an exception object (or class), re-raise the current one with a bare raise, and record why with from.',

  covers: ['raise'],

  syntax: [
    { label: 'raise', code: "raise ValueError('bad input')" },
    { label: 're-raise', code: 'except OSError:\n    log_it()\n    raise' },
    { label: 'raise … from', code: 'except KeyError as e:\n    raise LookupError(msg) from e' },
    { label: 'hide the context', code: 'raise TypeError(msg) from None' },
  ],

  cheat: {
    useFor:    'raise ValueError(f"...") for bad input; bare raise to pass an error on after logging',
    result:    'a statement — never finishes normally; control jumps to the nearest matching except',
    pairsWith: 'try / except, from, custom Exception subclasses, assert',
    watchOut:  'raise needs a BaseException subclass or instance — not a string, not NotImplemented',
  },

  parameters: [
    { name: 'exception', type: 'expression', required: false, default: null, desc: 'An exception instance, or a class (instantiated with no arguments). Omitted: re-raise the exception currently being handled.' },
    { name: 'from cause', type: 'expression', required: false, default: null, desc: 'An exception (or class) stored as __cause__ of the new one, or None to hide the implicit __context__ from the traceback.' },
  ],

  modes: [
    {
      id: 'raise',
      label: 'raise',
      blurb: 'Guard a function against bad input. A negative age raises; anything else is returned.',
      params: [{ name: 'age', type: 'int', hint: 'try -5', input: 'number' }],
      template: "def set_age(age):\n    if age < 0:\n        raise ValueError(f'age must be >= 0, got {age}')\n    return age\nset_age({$age})",
      cases: [
        { id: 'ok',  label: 'age 30', values: { age: '30' } },
        { id: 'neg', label: 'age -5', values: { age: '-5' } },
      ],
    },
    {
      id: 'from',
      label: 'raise … from e',
      blurb: 'Translate a low-level IndexError into a ValueError, keeping the original as __cause__.',
      params: [{ name: 'i', type: 'int', hint: 'try 5', input: 'number' }],
      template: "prices = [5, 8, 13]\ndef price(i):\n    try:\n        return prices[i]\n    except IndexError as e:\n        raise ValueError(f'no item #{i}') from e\ntry:\n    result = price({$i})\nexcept ValueError as err:\n    result = (str(err), repr(err.__cause__))\nresult",
      cases: [
        { id: 'ok',  label: 'i = 2', values: { i: '2' } },
        { id: 'bad', label: 'i = 5', values: { i: '5' } },
        { id: 'neg', label: 'i = -4', values: { i: '-4' } },
      ],
    },
    {
      id: 'reraise',
      label: 'bare raise',
      blurb: 'Log inside except, then re-raise: the caller receives the very same exception.',
      params: [{ name: 'b', type: 'int', hint: 'try 0', input: 'number' }],
      template: "log = []\ndef div(a, b):\n    try:\n        return a // b\n    except ZeroDivisionError:\n        log.append('logged')\n        raise\ntry:\n    result = div(100, {$b})\nexcept ZeroDivisionError as e:\n    result = f'caught again: {e}'\n(result, log)",
      cases: [
        { id: 'ok',   label: 'b = 7', values: { b: '7' } },
        { id: 'zero', label: 'b = 0', values: { b: '0' } },
      ],
    },
  ],
  demoExplainer: 'In the raise tab the message is built with an f-string at the moment of raising — include the offending value, it is the most useful part of a traceback. In the from tab, err.__cause__ is the original IndexError object; an uncaught chained error prints both tracebacks joined by "The above exception was the direct cause of the following exception". A float index (1e21 or more) raises TypeError instead, which nothing here catches. In the bare raise tab the message the caller sees is the original one: bare raise does not create a new exception.',

  patterns: [
    {
      name: 'Validate arguments',
      desc: 'ValueError for a bad value, TypeError for a bad type; put the value in the message.',
      code: "def withdraw(amount):\n    if amount <= 0:\n        raise ValueError(f'amount must be positive, got {amount!r}')",
    },
    {
      name: 'Custom exception type',
      desc: 'Subclass Exception so callers can catch your error specifically.',
      code: "class ConfigError(Exception):\n    pass\n\nraise ConfigError('missing key: port')",
    },
    {
      name: 'Translate and chain',
      desc: 'Wrap a library error in your own type without losing it.',
      code: "try:\n    data = json.loads(text)\nexcept json.JSONDecodeError as e:\n    raise ConfigError('config is not valid JSON') from e",
    },
    {
      name: 'Abstract method placeholder',
      desc: 'The exception class, not the NotImplemented constant.',
      code: "def area(self):\n    raise NotImplementedError('subclasses must implement area()')",
    },
  ],

  examples: [
    { title: 'Raise with a message',          code: "raise ValueError('negative size')",                                        returns: 'ValueError: negative size' },
    { title: 'A class is instantiated for you', code: "try:\n    raise IndexError\nexcept IndexError as e:\n    print(repr(e), e.args)", returns: 'IndexError() ()' },
    { title: 'Custom exception class',        code: "class InsufficientFunds(Exception):\n    pass\nraise InsufficientFunds('balance 5, need 10')", returns: 'InsufficientFunds: balance 5, need 10' },
    { title: 'from sets __cause__',           code: "try:\n    try:\n        {}['id']\n    except KeyError as e:\n        raise LookupError('user not found') from e\nexcept LookupError as err:\n    print(repr(err.__cause__))", returns: "KeyError('id')" },
    { title: 'Raising inside except sets __context__', code: "try:\n    try:\n        1 / 0\n    except ZeroDivisionError:\n        raise ValueError('while handling')\nexcept ValueError as err:\n    print(repr(err.__context__), err.__cause__)", returns: "ZeroDivisionError('division by zero') None" },
    { title: 'from None hides the context',   code: "try:\n    try:\n        int('x')\n    except ValueError:\n        raise TypeError('expected a number') from None\nexcept TypeError as err:\n    print(err.__cause__, err.__suppress_context__)", returns: 'None True' },
    { title: 'Bare raise with nothing to re-raise', code: 'raise',                                                               returns: 'RuntimeError: No active exception to reraise' },
    { title: 'Only exceptions can be raised', code: "raise 'something broke'",                                                  returns: 'TypeError: exceptions must derive from BaseException' },
  ],

  pitfalls: [
    {
      name: 'Python 2 syntax: raise E, "message"',
      desc: 'The comma form was removed in Python 3 — call the class with the message instead.',
      wrong: { label: 'comma form', code: "compile(\"raise ValueError, 'bad'\", '<demo>', 'exec')", output: 'SyntaxError: invalid syntax' },
      fix:   { label: 'call the class', code: "raise ValueError('bad')", output: 'ValueError: bad' },
    },
    {
      name: 'raise NotImplemented instead of NotImplementedError',
      desc: 'NotImplemented is a constant for binary operators, not an exception. Raising it is itself an error.',
      wrong: { label: 'the constant', code: 'raise NotImplemented', output: 'TypeError: exceptions must derive from BaseException' },
      fix:   { label: 'the exception', code: "raise NotImplementedError('area() not written yet')", output: 'NotImplementedError: area() not written yet' },
    },
    {
      name: 'Translating an error without from',
      desc: 'Raising inside except only records the old error as __context__, and the traceback says "During handling of the above exception, another exception occurred" — as if your handler crashed. from e marks it as the intended cause.',
      wrong: { label: 'implicit context', code: "try:\n    try:\n        {}['port']\n    except KeyError:\n        raise RuntimeError('config broken')\nexcept RuntimeError as err:\n    print(err.__cause__)", output: 'None' },
      fix:   { label: 'raise … from e',   code: "try:\n    try:\n        {}['port']\n    except KeyError as e:\n        raise RuntimeError('config broken') from e\nexcept RuntimeError as err:\n    print(repr(err.__cause__))", output: "KeyError('port')" },
    },
  ],

  when: {
    use: [
      'A function receives input it cannot work with (ValueError, TypeError)',
      'A situation the caller must deal with, where returning a special value would be ignored',
      'Re-raising after logging or cleanup (bare raise)',
      'Wrapping a low-level error in your own type (raise … from e)',
    ],
    avoid: [
      'Internal "this cannot happen" checks during development → assert',
      'Normal, expected outcomes like "not found" in a search → return None or a default',
      'Stopping a generator → return (raising StopIteration inside one becomes RuntimeError)',
    ],
  },

  notes: {
    cpython:    'raise X from Y sets X.__cause__ = Y and X.__suppress_context__ = True; __context__ is set automatically whenever an exception is raised while another is being handled',
    'Class or instance': 'raise ValueError is the same as raise ValueError() — the class is called with no arguments',
    'from':     'The from keyword is shared with import (from module import name) and yield from; this page covers its raise meaning',
  },

  related: [
    { name: 'try / except',  slug: 'try',    when: 'Catch what raise throws' },
    { name: 'assert',        slug: 'assert', when: 'Raise AssertionError on a failed check' },
    { name: 'import (from)', slug: 'import', when: 'The other meaning of from' },
    { name: 'BaseException', slug: 'baseexception', when: 'Everything raise accepts derives from it', category: 'exceptions' },
    { name: 'ValueError',    slug: 'valueerror',    when: 'The usual choice for a bad argument value', category: 'exceptions' },
    { name: 'RuntimeError',  slug: 'runtimeerror',  when: 'What a bare raise gives when nothing is active', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between raise and raise e?',
      a: 'Inside an except block both re-raise the same exception object. Bare raise is the idiom: it is shorter and needs no as name. raise e additionally adds the current line to the traceback.',
    },
    {
      q: 'What does raise … from do?',
      a: 'It chains exceptions explicitly: raise NewError(...) from original stores original as __cause__, and an uncaught traceback prints both, joined by "The above exception was the direct cause of the following exception". raise ... from None hides the old exception from the traceback instead.',
    },
    {
      q: 'Should I raise a class or an instance?',
      a: 'Either works — a class is instantiated with no arguments. Use an instance when you have a message, which is almost always: raise ValueError(f"bad port {port!r}").',
    },
    {
      q: 'Can I raise a string in Python 3?',
      a: 'No. raise "error" fails with TypeError: exceptions must derive from BaseException. Use an exception class, or define your own by subclassing Exception.',
    },
  ],

  history: [
    { version: '3.3',  note: 'None is permitted as the cause in raise X from None; __suppress_context__ was added.' },
    { version: '3.11', note: 'A bare raise re-raises with the traceback as modified in the except clause, not the one it had when caught.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement',
    meta:  'The raise statement',
  },
};
