// content/reference/python/exceptions/runtimeerror.js

export const meta = {
  slug:        'runtimeerror',
  name:        'RuntimeError',
  signature:   'RuntimeError(*args)',
  blurb:       'The catch-all for errors that fit no other category — most often a dict or set changed size while you were looping over it.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'runtimeerror runtime error pythonfinalizationerror python finalization error dictionary changed size during iteration set changed size during iteration dictionary keys changed generator raised stopiteration pep 479 no running event loop super no arguments',
};

export const method = {
  slug:      'runtimeerror',
  name:      'RuntimeError',
  signature: 'RuntimeError(*args)',

  category:    'Runtime exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'An operation that was legal on its own became illegal because of the state around it — the classic is changing a dict while a for loop is walking it.',

  chain: ['BaseException', 'Exception', 'RuntimeError'],

  cheat: {
    raisedBy: 'mutating a dict/set during a for loop, StopIteration inside a generator, asyncio outside a loop',
    message:  'dictionary changed size during iteration',
    quickFix: 'loop over list(d) or build a new dict',
    watchOut: 'except RuntimeError also catches RecursionError and NotImplementedError',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one string saying what went wrong. Stored in e.args; str(e) is that string.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Delete matching items while looping over the dict itself. Any deletion breaks the loop — even of the last key.',
      params: [{ name: 'qty', type: 'int', hint: 'delete items with this stock', input: 'number' }],
      template: "stock = {'apple': 3, 'pear': 0, 'plum': 0}\nfor name in stock:\n    if stock[name] == {$qty}:\n        del stock[name]\nstock",
      cases: [
        { id: 'none',  label: 'nothing to delete', values: { qty: '7' } },
        { id: 'zero',  label: 'delete sold-out',   values: { qty: '0' } },
        { id: 'first', label: 'delete one',        values: { qty: '3' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'The fix: loop over list(stock), a snapshot of the keys, so the dict itself can change freely.',
      params: [{ name: 'qty', type: 'int', hint: 'delete items with this stock', input: 'number' }],
      template: "stock = {'apple': 3, 'pear': 0, 'plum': 0}\nfor name in list(stock):\n    if stock[name] == {$qty}:\n        del stock[name]\nstock",
      cases: [
        { id: 'zero',  label: 'delete sold-out', values: { qty: '0' } },
        { id: 'first', label: 'delete one',      values: { qty: '3' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, deleting 'apple' (qty 3) is the only change, yet the loop still dies: the dict iterator checks the size on every next() call, so the error comes from the step AFTER the del. Handle deletes the same items without complaint, because list(stock) copied the keys before the loop started.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: 'The constructor arguments — normally the one message string.' },
    { name: '__cause__',   type: 'BaseException | None', meaning: 'For "generator raised StopIteration" this is the original StopIteration.' },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised (implicit chaining).' },
  ],

  patterns: [
    {
      name: 'Filter by building a new dict',
      desc: 'Usually clearer than deleting in place, and it never iterates the dict it changes.',
      code: "in_stock = {name: qty for name, qty in stock.items() if qty > 0}",
    },
    {
      name: 'Delete from a snapshot',
      desc: 'When the same dict object must be kept (other code holds a reference), iterate a copy of the keys.',
      code: "for name in list(stock):\n    if stock[name] == 0:\n        del stock[name]",
    },
    {
      name: 'Raise it for invalid state',
      desc: 'Your own code can raise RuntimeError when an object is used in a state that makes the call meaningless and no more specific built-in fits.',
      code: "class Connection:\n    def send(self, data):\n        if self.closed:\n            raise RuntimeError('send() on a closed connection')\n        self._sock.sendall(data)",
    },
  ],

  examples: [
    { title: 'Deleting while looping over a dict', code: "d = {'a': 1, 'b': 2}\nfor k in d:\n    if d[k] == 2:\n        del d[k]", returns: 'RuntimeError: dictionary changed size during iteration' },
    { title: 'Adding to a set while looping',      code: "s = {1, 2, 3}\nfor x in s:\n    s.add(x * 10)", returns: 'RuntimeError: Set changed size during iteration' },
    { title: 'Same size, different keys',          code: "d = {'a': 1}\nfor k in d:\n    del d[k]\n    d[k + '!'] = 1", returns: 'RuntimeError: dictionary keys changed during iteration' },
    { title: 'StopIteration leaking out of a generator (PEP 479)', code: "def firsts(rows):\n    for row in rows:\n        yield next(iter(row))\nlist(firsts([[1], [], [3]]))", returns: 'RuntimeError: generator raised StopIteration' },
    { title: 'The original StopIteration is the cause', code: "def gen():\n    yield next(iter([]))\ntry:\n    list(gen())\nexcept RuntimeError as e:\n    cause = e.__cause__\ncause", returns: 'StopIteration()' },
    { title: 'asyncio outside an event loop',      code: "import asyncio\nasyncio.get_running_loop()", returns: 'RuntimeError: no running event loop' },
    { title: 'Zero-argument super() outside a class', code: "def f():\n    return super()\nf()", returns: 'RuntimeError: super(): no arguments' },
    { title: 'Its subclasses', code: 'issubclass(RecursionError, RuntimeError), issubclass(NotImplementedError, RuntimeError), issubclass(PythonFinalizationError, RuntimeError)', returns: '(True, True, True)' },
  ],

  pitfalls: [
    {
      name: 'Changing values is fine, changing keys is not',
      desc: 'Assigning to an existing key during the loop is allowed — the size and key set stay the same. Only adding or removing keys breaks the iterator.',
      wrong: { label: 'Remove in loop', code: "prices = {'a': 5, 'b': 0}\nfor k in prices:\n    if prices[k] == 0:\n        del prices[k]\nprices", output: 'RuntimeError: dictionary changed size during iteration' },
      fix:   { label: 'Update values only', code: "prices = {'a': 5, 'b': 0}\nfor k in prices:\n    prices[k] = prices[k] * 2\nprices", output: "{'a': 10, 'b': 0}" },
    },
    {
      name: 'next() inside a generator',
      desc: 'A bare next() that runs out inside a generator no longer ends the generator quietly (Python 3.7+) — it becomes RuntimeError. Give next() a default, or return explicitly.',
      wrong: { label: 'Bare next()', code: "def firsts(rows):\n    for row in rows:\n        yield next(iter(row))\nlist(firsts([[1], []]))", output: 'RuntimeError: generator raised StopIteration' },
      fix:   { label: 'next(it, default)', code: "def firsts(rows):\n    for row in rows:\n        yield next(iter(row), None)\nlist(firsts([[1], []]))", output: '[1, None]' },
    },
    {
      name: 'except RuntimeError is wider than it looks',
      desc: 'RecursionError, NotImplementedError and PythonFinalizationError are all subclasses, so a handler meant for one specific runtime condition also hides an unimplemented method.',
      wrong: { label: 'Broad handler', code: "class Base:\n    def save(self):\n        raise NotImplementedError\ntry:\n    Base().save()\n    status = 'saved'\nexcept RuntimeError:\n    status = 'busy, retry later'\nstatus", output: "'busy, retry later'" },
      fix:   { label: 'Let the bug surface', code: "class Base:\n    def save(self):\n        raise NotImplementedError\ntry:\n    Base().save()\n    status = 'saved'\nexcept RuntimeError as e:\n    if isinstance(e, NotImplementedError):\n        raise\n    status = 'busy, retry later'\nstatus", output: 'NotImplementedError' },
    },
  ],

  when: {
    use: [
      'Your object is called in a state where the operation cannot work (closed, not started, already finished)',
      'An invariant broke at runtime and no more specific exception (ValueError, TypeError, …) fits',
    ],
    avoid: [
      'Bad argument values → ValueError; wrong types → TypeError',
      'Methods a subclass must provide → NotImplementedError',
      'Catching it broadly — you also catch RecursionError and NotImplementedError',
    ],
  },

  notes: {
    cpython:       'Objects/dictobject.c — the dict iterator stores the size it started with and raises on the next step if ma_used differs',
    'Subclasses':  'RecursionError (3.5+), NotImplementedError, PythonFinalizationError (3.13+)',
    'Not this one': "'generator already executing' is a ValueError, not a RuntimeError",
  },

  related: [
    { name: 'RecursionError',      slug: 'recursionerror',      when: 'The recursion-limit subclass' },
    { name: 'NotImplementedError', slug: 'notimplementederror', when: 'The abstract-method subclass' },
    { name: 'StopIteration',       slug: 'stopiteration',       when: 'What PEP 479 turns into RuntimeError inside generators' },
    { name: 'next()',              slug: 'next',                when: 'Pass a default so it cannot raise', category: 'functions' },
    { name: 'dict.keys',           slug: 'dict-keys',           when: 'A live view — list() it before mutating', category: 'functions' },
    { name: 'list()',              slug: 'list',                when: 'Snapshot the keys before the loop', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I fix "RuntimeError: dictionary changed size during iteration"?',
      a: "Do not add or remove keys of a dict while a for loop is iterating it. Either loop over a snapshot — for k in list(d): — or build a new dict with a comprehension: d = {k: v for k, v in d.items() if keep(v)}. Updating the value of an existing key inside the loop is fine. The same applies to sets (Set changed size during iteration) and to d.keys(), d.values() and d.items(), which are live views of the dict.",
    },
    {
      q: 'Why does "generator raised StopIteration" happen?',
      a: "Since Python 3.7 (PEP 479), a StopIteration that escapes from inside a generator body is converted to RuntimeError, with the original StopIteration as __cause__. It usually comes from a bare next(it) call that ran out. Use next(it, default), or catch StopIteration and return. To end a generator on purpose, use return — never raise StopIteration.",
    },
    {
      q: 'What is PythonFinalizationError?',
      a: 'A RuntimeError subclass added in Python 3.13. It is raised when an operation is blocked because the interpreter is shutting down (finalization) — the docs list creating a new Python thread and os.fork(). Before 3.13 a plain RuntimeError was raised, so except RuntimeError still catches it. You typically see it from code running in atexit handlers or __del__ methods at exit; sys.is_finalizing() tells you whether shutdown has started.',
    },
    {
      q: 'Is "generator already executing" a RuntimeError?',
      a: "No — it is a ValueError. It happens when a generator tries to resume itself, for example when its body calls next() on the same generator object.",
    },
    {
      q: 'Should I raise RuntimeError in my own code?',
      a: 'Only when nothing more specific fits. Bad values are ValueError, wrong types are TypeError, missing overrides are NotImplementedError. RuntimeError is right for "this object is in the wrong state for that call", such as using a connection after close() — or define your own exception subclass for it.',
    },
  ],

  history: [
    { version: '3.5', note: 'RecursionError split out: previously a plain RuntimeError was raised for exceeding the recursion limit.' },
    { version: '3.7', note: 'PEP 479 enabled for all code: StopIteration raised inside a generator becomes RuntimeError.' },
    { version: '3.13', note: 'PythonFinalizationError added: previously a plain RuntimeError was raised for operations blocked during shutdown.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#RuntimeError',
    meta:  'Built-in exceptions',
  },
};
