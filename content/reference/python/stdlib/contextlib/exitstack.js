// content/reference/python/stdlib/contextlib/exitstack.js — contextlib.ExitStack

export const meta = {
  slug:        'exitstack',
  name:        'contextlib.ExitStack',
  signature:   'contextlib.ExitStack()',
  blurb:       'A context manager that holds a stack of other context managers and cleanup callbacks, and unwinds them in reverse order — for a number of resources known only at run time.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'contextlib ExitStack python ExitStack.close enter_context callback push pop_all open multiple files with statement variable number of context managers cleanup stack LIFO unwind dynamic with',
};

export const method = {
  slug:      'exitstack',
  name:      'contextlib.ExitStack',
  signature: 'contextlib.ExitStack()',
  returns:   { type: 'ExitStack', desc: 'An empty stack; __enter__ returns the stack itself.' },

  category:    'contextlib class',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'enter_context(cm) enters a context manager now and schedules its exit; callback(fn, *args) schedules any function. At the end of the with block — or on close() — everything runs last-in, first-out, exactly like nested with statements, including exception handling.',

  covers: ['ExitStack', 'ExitStack.close'],

  cheat: {
    commonCall: 'with ExitStack() as stack:\n    files = [stack.enter_context(open(p)) for p in paths]',
    returns:    'all files closed in reverse order at the end',
    replaces:   'deeply nested with statements and hand-written cleanup lists',
    watchOut:   'callbacks run on close / exit, not when the stack is garbage collected',
  },

  parameters: [],

  attributes: [
    { name: 'enter_context(cm)',          type: 'method', meaning: "Calls cm.__enter__(), pushes cm.__exit__ and returns what __enter__ returned. TypeError (3.11+) if cm is not a context manager." },
    { name: 'callback(fn, /, *args, **kwds)', type: 'method', meaning: 'Pushes fn(*args, **kwds); it cannot see or suppress exceptions. Returns fn, so it also works as a decorator.' },
    { name: 'push(exit)',                 type: 'method', meaning: 'Pushes an __exit__-style callable (exc_type, exc, tb) — or the __exit__ of an object passed in, without calling its __enter__. A true return value suppresses the exception.' },
    { name: 'pop_all()',                  type: 'method', meaning: 'Moves every pending callback to a new ExitStack and returns it; nothing runs now.' },
    { name: 'close()',                    type: 'method', meaning: 'Unwinds the stack immediately, as an exit without exception. The stack is empty afterwards, so a second close() does nothing.' },
  ],

  modes: [
    {
      id: 'callbacks',
      label: 'LIFO',
      blurb: 'Register one cleanup per name; they run in reverse order after the block.',
      params: [{ name: 'names', type: 'list[str]', hint: 'comma-separated resource names', input: 'csv' }],
      template: "from contextlib import ExitStack\nlog = []\nwith ExitStack() as stack:\n    for name in {$names}:\n        log.append('open ' + name)\n        stack.callback(log.append, 'close ' + name)\n    log.append('work')\nlog",
      cases: [
        { id: 'three', label: 'a, b, c', values: { names: 'a, b, c' } },
        { id: 'none',  label: 'empty',   values: { names: '' } },
      ],
    },
    {
      id: 'partial',
      label: 'a failing open',
      blurb: "The resource named bad fails to open. Everything opened before it is still closed, in reverse order.",
      params: [{ name: 'names', type: 'list[str]', hint: 'names; bad fails', input: 'csv' }],
      template: "from contextlib import ExitStack\nlog = []\ndef acquire(name):\n    if name == 'bad':\n        raise OSError('cannot open ' + name)\n    log.append('open ' + name)\n    return name\ntry:\n    with ExitStack() as stack:\n        for name in {$names}:\n            stack.callback(log.append, 'close ' + acquire(name))\n        log.append('all open')\nexcept OSError as e:\n    log.append(f'error: {e}')\nlog",
      cases: [
        { id: 'fail', label: 'a, b, bad, c', values: { names: 'a, b, bad, c' } },
        { id: 'ok',   label: 'a, b',         values: { names: 'a, b' } },
      ],
    },
    {
      id: 'popall',
      label: 'pop_all',
      blurb: 'pop_all() moves the callbacks to a new stack: leaving the with block runs nothing, later.close() runs them.',
      params: [{ name: 'names', type: 'list[str]', hint: 'comma-separated names', input: 'csv' }],
      template: "from contextlib import ExitStack\nlog = []\nwith ExitStack() as stack:\n    for name in {$names}:\n        stack.callback(log.append, 'close ' + name)\n    later = stack.pop_all()\nlog.append('with block done')\nlater.close()\nlog",
      cases: [
        { id: 'two', label: 'x, y', values: { names: 'x, y' } },
      ],
    },
  ],
  demoExplainer: "Cleanups always run newest first. When acquire('bad') raises, the callbacks for a and b are already registered, so the stack closes b, then a, before the OSError reaches the except clause; c is never opened. After pop_all() the original stack is empty, which is why 'with block done' is logged before any close.",

  patterns: [
    {
      name: 'All-or-nothing opening',
      desc: 'Keep the files only if every open succeeded; otherwise everything is closed again.',
      code: 'from contextlib import ExitStack\nwith ExitStack() as stack:\n    files = [stack.enter_context(open(p)) for p in paths]\n    close_files = stack.pop_all().close\n# later, when done with the files:\nclose_files()',
    },
    {
      name: 'Optional context managers',
      desc: 'Enter only the ones that apply.',
      code: 'from contextlib import ExitStack\nwith ExitStack() as stack:\n    if use_lock:\n        stack.enter_context(lock)\n    if verbose:\n        stack.enter_context(timer())\n    run()',
    },
    {
      name: 'Cleanup in __enter__ of your own class',
      desc: 'If a later step of setup fails, the earlier ones are undone.',
      code: "from contextlib import ExitStack\n\nclass Pipeline:\n    def __enter__(self):\n        with ExitStack() as stack:\n            self.src = stack.enter_context(open_source())\n            self.dst = stack.enter_context(open_target())\n            self._stack = stack.pop_all()\n        return self\n    def __exit__(self, *exc):\n        return self._stack.__exit__(*exc)",
    },
  ],

  examples: [
    { title: 'Open a list of files',           code: "from contextlib import ExitStack\nnames = ['a.txt', 'b.txt']\nfor n in names:\n    open(n, 'w').close()\nwith ExitStack() as stack:\n    files = [stack.enter_context(open(n)) for n in names]\n    print([f.closed for f in files])\n[f.closed for f in files]", returns: '[False, False]\n[True, True]' },
    { title: 'Callbacks run in reverse',       code: "from contextlib import ExitStack\nwith ExitStack() as stack:\n    stack.callback(print, 'first registered')\n    stack.callback(print, 'second registered')", returns: 'second registered\nfirst registered' },
    { title: 'callback as a decorator',        code: "from contextlib import ExitStack\nwith ExitStack() as stack:\n    @stack.callback\n    def cleanup():\n        print('decorated callback ran')\n    print('body')", returns: 'body\ndecorated callback ran' },
    { title: 'push() can suppress',            code: "from contextlib import ExitStack\ndef ignore_value_error(exc_type, exc, tb):\n    print('saw', exc_type.__name__ if exc_type else None)\n    return exc_type is ValueError\nwith ExitStack() as stack:\n    stack.push(ignore_value_error)\n    raise ValueError('swallowed')\n'continued'", returns: "saw ValueError\n'continued'" },
    { title: 'pop_all() defers the cleanup',   code: "from contextlib import ExitStack\nwith ExitStack() as stack:\n    stack.callback(print, 'closed')\n    close_later = stack.pop_all().close\nprint('with ended')\nclose_later()", returns: 'with ended\nclosed' },
    { title: 'close() empties the stack',      code: "from contextlib import ExitStack\nstack = ExitStack()\nstack.callback(print, 'cleanup')\nstack.close()\nstack.close()", returns: 'cleanup' },
    { title: 'A failing callback does not stop the others', code: "from contextlib import ExitStack\ndef failing():\n    raise RuntimeError('cleanup failed')\ntry:\n    with ExitStack() as stack:\n        stack.callback(print, 'still runs')\n        stack.callback(failing)\nexcept RuntimeError as e:\n    print('raised:', e)", returns: 'still runs\nraised: cleanup failed' },
    { title: 'Not a context manager',          code: 'from contextlib import ExitStack\nwith ExitStack() as stack:\n    stack.enter_context(42)', returns: "TypeError: 'builtins.int' object does not support the context manager protocol" },
  ],

  pitfalls: [
    {
      name: 'Expecting garbage collection to run the callbacks',
      desc: 'An ExitStack that is neither used in with nor closed never runs its callbacks. Call close() — or better, use it in a with statement.',
      wrong: { label: 'no close()', code: "from contextlib import ExitStack\nlog = []\ndef work():\n    stack = ExitStack()\n    stack.callback(log.append, 'cleanup')\nwork()\nlog", output: '[]' },
      fix:   { label: 'with', code: "from contextlib import ExitStack\nlog = []\ndef work():\n    with ExitStack() as stack:\n        stack.callback(log.append, 'cleanup')\nwork()\nlog", output: "['cleanup']" },
    },
    {
      name: 'push() where enter_context() was meant',
      desc: 'push(cm) registers only cm.__exit__ — it never enters cm. Here the setup runs at exit time instead, and the generator fails. To enter and register in one step, use enter_context.',
      wrong: { label: 'push(cm)', code: "from contextlib import ExitStack, contextmanager\n@contextmanager\ndef res():\n    print('setup')\n    yield 'r'\n    print('teardown')\nwith ExitStack() as stack:\n    stack.push(res())\n    print('body')", output: "body\nsetup\nRuntimeError: generator didn't stop" },
      fix:   { label: 'enter_context', code: "from contextlib import ExitStack, contextmanager\n@contextmanager\ndef res():\n    print('setup')\n    yield 'r'\n    print('teardown')\nwith ExitStack() as stack:\n    print(stack.enter_context(res()))\n    print('body')", output: 'setup\nr\nbody\nteardown' },
    },
  ],

  when: {
    use: [
      'A list of files, connections or locks whose length is known only at run time',
      'Context managers that are entered only under some conditions',
      'Building the __enter__ of your own class from several resources, with rollback if one fails',
    ],
    avoid: [
      'A fixed, small set of resources → a normal with a, b: statement',
      'async with resources → contextlib.AsyncExitStack',
    ],
  },

  notes: {
    cpython:       'Lib/contextlib.py: callbacks live in a collections.deque; __exit__ pops them one by one, passes the current exception (or None) to each, lets a true return value clear it, and chains a new exception raised by a callback to the previous one',
    'Exceptions':  'If a callback raises, the remaining callbacks still run and receive the new exception; the last exception left is raised from the with statement',
    'Methods':     'enter_context, callback, push and pop_all are defined on the private base class _BaseExitStack (shared with AsyncExitStack); close is ExitStack\'s own',
  },

  related: [
    { name: 'AsyncExitStack', slug: 'asyncexitstack', when: 'The same for async with' },
    { name: 'contextlib.contextmanager', slug: 'contextmanager', when: 'Context managers to push on the stack' },
    { name: 'contextlib.nullcontext', slug: 'nullcontext', when: 'A single optional context manager' },
    { name: 'with', slug: 'with', when: 'Nested with statements — what ExitStack generalizes', category: 'keywords' },
    { name: 'collections.deque', slug: 'deque', when: 'The container holding the callbacks', category: 'stdlib/collections' },
  ],

  faq: [
    {
      q: 'How do I open a variable number of files with one with statement?',
      a: 'Use contextlib.ExitStack: "with ExitStack() as stack: files = [stack.enter_context(open(p)) for p in paths]". All files are closed when the block ends, and if one open fails the files opened before it are closed right away.',
    },
    {
      q: 'In which order does ExitStack call the callbacks?',
      a: 'Last in, first out — the reverse of registration, just like nested with statements unwind from the inside out.',
    },
    {
      q: 'What is ExitStack.pop_all for?',
      a: 'It transfers all registered callbacks to a new ExitStack without running them. Typical use: open several resources inside a with block and, only if all of them succeeded, keep them open by calling pop_all(); close the returned stack later.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.ExitStack',
    meta:  'contextlib.ExitStack',
  },
};
