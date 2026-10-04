// content/reference/python/stdlib/sys/exc_info.js — sys.exc_info and sys.exception

export const meta = {
  slug:        'exc_info',
  name:        'sys.exc_info / sys.exception',
  signature:   'sys.exception() · sys.exc_info()',
  blurb:       'The exception currently being handled: exception() (3.11+) returns the instance, exc_info() the old (type, value, traceback) triple. Outside an except block you get None / three Nones.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'exc_info all versions · exception 3.11+ · last_exc 3.12+',
  searchTerms: 'sys.exc_info exc_info sys.exception exception current exception handled exception traceback type value last_exc sys.last_exc last_type last_value last_traceback post mortem pdb.pm python get exception in except',
};

export const method = {
  slug:      'exc_info',
  name:      'sys.exc_info / sys.exception',
  signature: 'sys.exception() · sys.exc_info()',
  returns:   { type: 'BaseException | None · tuple', desc: 'exception(): the handled exception or None. exc_info(): (type(e), e, e.__traceback__) or (None, None, None).' },

  category:    'sys function',
  version:     'exc_info all versions · exception 3.11+ · last_exc 3.12+',
  hasLiveDemo: true,

  subtitle: "Inside an except block — or in any function it calls — these tell you what is being handled. That is how logging helpers, cleanup code and debuggers get at the exception without being passed it.",

  covers: ['exc_info', 'exception'],

  cheat: {
    commonCall: 'err = sys.exception()',
    returns:    'the exception instance, or None outside a handler',
    replaces:   'sys.exc_info()[1] (pre-3.11 spelling)',
    watchOut:   'Only works while the except block is running',
  },

  parameters: [],

  modes: [
    {
      id: 'parse',
      label: 'inside except',
      blurb: 'int() either succeeds (nothing is being handled, so exc_info() is three Nones) or raises ValueError, which the handler reads back through exc_info() and exception().',
      params: [{ name: 'text', type: 'str', hint: 'text for int()', input: 'text' }],
      template: "import sys\ntry:\n    n = int({$text})\nexcept ValueError:\n    t, v, tb = sys.exc_info()\n    result = (t.__name__, str(v), v is sys.exception())\nelse:\n    result = (n, sys.exc_info())\nresult",
      cases: [
        { id: 'ok',     label: 'valid',     values: { text: ' 1_000 ' } },
        { id: 'bad',    label: 'not a number', values: { text: '12abc' } },
        { id: 'float',  label: 'decimal point', values: { text: '3.5' } },
        { id: 'arabic', label: 'Arabic-Indic digits', values: { text: '١٢٣' } },
      ],
    },
  ],
  demoExplainer: 'exc_info() and exception() describe the same exception: the triple is just (type(v), v, v.__traceback__). In the else branch nothing is being handled, so exc_info() is (None, None, None). int() itself strips surrounding whitespace, accepts underscores between digits and any Unicode decimal digits — "١٢٣" is 123 — but rejects a decimal point.',

  patterns: [
    {
      name: 'A logging helper called from except blocks',
      desc: 'The helper does not need the exception passed in.',
      code: "import sys, traceback\n\ndef log_current_error(context):\n    err = sys.exception()\n    if err is not None:\n        print(f'{context}: {err!r}', file=sys.stderr)\n        traceback.print_exception(err)\n\ntry:\n    risky()\nexcept Exception:\n    log_current_error('import step')",
    },
    {
      name: 'Old code that still uses the triple',
      desc: 'exc_info() is still supported; unpack all three.',
      code: 'import sys\ntry:\n    risky()\nexcept Exception:\n    exc_type, exc_value, exc_tb = sys.exc_info()',
    },
    {
      name: 'Post-mortem after a crash at the prompt',
      desc: 'The interactive interpreter stores the last unhandled exception in sys.last_exc (3.12+).',
      code: '# at the >>> prompt, after a traceback:\nimport pdb\npdb.pm()  # debugs sys.last_exc',
    },
  ],

  examples: [
    { title: 'Same object as the except target', code: "import sys\ntry:\n    {}['missing']\nexcept KeyError as e:\n    result = sys.exception() is e\nresult", returns: 'True' },
    { title: 'The triple',                       code: "import sys\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    t, v, tb = sys.exc_info()\n    result = (t.__name__, str(v), tb is v.__traceback__)\nresult", returns: "('ZeroDivisionError', 'division by zero', True)" },
    { title: 'Nothing handled: Nones',           code: 'import sys\n(sys.exception(), sys.exc_info())', returns: '(None, (None, None, None))' },
    { title: 'Visible in functions the handler calls', code: "import sys\ndef current():\n    return type(sys.exception()).__name__\ntry:\n    int('x')\nexcept ValueError:\n    result = current()\nresult", returns: "'ValueError'" },
    { title: 'Nested handlers: the innermost wins', code: "import sys\ntry:\n    raise KeyError('outer')\nexcept KeyError:\n    try:\n        raise IndexError('inner')\n    except IndexError:\n        inner = type(sys.exception()).__name__\n    outer = type(sys.exception()).__name__\n(inner, outer)", returns: "('IndexError', 'KeyError')" },
    { title: 'Cleared when the handler ends',    code: "import sys\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    pass\nsys.exception() is None", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Asking after the except block is over',
      desc: 'Once the handler finishes, nothing is being handled. Call it (or the helper) inside the except block.',
      wrong: { label: 'after except', code: "import sys\ntry:\n    int('x')\nexcept ValueError:\n    pass\ntype(sys.exception()).__name__", output: "'NoneType'" },
      fix:   { label: 'inside except', code: "import sys\ntry:\n    int('x')\nexcept ValueError:\n    name = type(sys.exception()).__name__\nname", output: "'ValueError'" },
    },
    {
      name: 'Unpacking exc_info() when nothing is handled',
      desc: 'The triple is (None, None, None), so attribute access on the value fails. Check for None, or use sys.exception().',
      wrong: { label: 'assume a value', code: 'import sys\nexc_type, value, tb = sys.exc_info()\nvalue.args', output: "AttributeError: 'NoneType' object has no attribute 'args'" },
      fix:   { label: 'check None', code: 'import sys\nerr = sys.exception()\nerr.args if err is not None else ()', output: '()' },
    },
  ],

  when: {
    use: [
      'Helpers that log or report "the current error" from inside handlers',
      'Code that must work with an exception it was not given (context managers, debuggers)',
    ],
    avoid: [
      'Normal handlers → except ValueError as e: gives you e directly',
      'Formatting a traceback → traceback.format_exc() / traceback.print_exception(e)',
    ],
  },

  notes: {
    cpython:         'Both read the topmost handled exception of the current thread (_PyErr_GetTopmostException, Python/sysmodule.c); exc_info builds the triple from that one value, so type and traceback always match it (3.11+)',
    'last_exc':      'sys.last_exc (3.12+) and the deprecated last_type / last_value / last_traceback are set only when an exception reaches the interactive interpreter (or traceback printing via PyErr_Print); a normal script does not have them',
    'Reference cycles': 'Storing the traceback in a local of the frame it belongs to creates a cycle; del it when done (exception() avoids keeping tb around)',
  },

  related: [
    { name: 'sys.excepthook', slug: 'excepthook', when: 'What runs for uncaught exceptions' },
    { name: 'try / except',   slug: 'try',        when: 'Where these functions are useful', category: 'keywords' },
    { name: 'raise',          slug: 'raise',      when: 'Re-raise the handled exception with a bare raise', category: 'keywords' },
    { name: 'BaseException',  slug: 'baseexception', when: '__traceback__ and the exception attributes', category: 'exceptions' },
    { name: 'sys module',     slug: 'sys',        when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between sys.exc_info() and sys.exception()?',
      a: 'sys.exception() (Python 3.11+) returns just the exception instance. sys.exc_info() returns the older triple (type, value, traceback), which is always (type(e), e, e.__traceback__). New code should use sys.exception().',
    },
    {
      q: 'Why does sys.exc_info() return (None, None, None)?',
      a: 'No exception is being handled at that point — you called it outside an except block (or after it finished). The information is only available while the handler runs.',
    },
    {
      q: 'What is sys.last_exc?',
      a: 'In the interactive interpreter, the last exception that was not handled and produced a traceback (Python 3.12+; earlier versions only have last_type, last_value and last_traceback). pdb.pm() uses it for post-mortem debugging. It does not exist in a script that has not crashed.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.exception',
    meta:  'sys.exception / sys.exc_info',
  },
};
