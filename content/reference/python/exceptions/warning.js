// content/reference/python/exceptions/warning.js

export const meta = {
  slug:        'warning',
  name:        'Warning',
  signature:   'Warning(*args)',
  blurb:       'Base class of all warning categories — messages from warnings.warn() that are printed, ignored, or turned into exceptions depending on the warning filters.',
  category:    'warnings',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'warning userwarning syntaxwarning runtimewarning importwarning unicodewarning byteswarning resourcewarning encodingwarning warnings module warnings.warn simplefilter filterwarnings catch_warnings record -W error stacklevel suppress warnings invalid escape sequence coroutine was never awaited unclosed file',
};

export const method = {
  slug:      'warning',
  name:      'Warning',
  signature: 'Warning(*args)',

  category:    'Warning category',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'A warning is an exception class that is normally not raised: warnings.warn() hands it to the filters, which print it once, ignore it, or — with "error" — raise it like any other exception.',

  chain: ['BaseException', 'Exception', 'Warning'],

  cheat: {
    raisedBy: 'warnings.warn(msg, Category), the compiler (SyntaxWarning), the runtime (RuntimeWarning, ResourceWarning)',
    message:  'file.py:12: UserWarning: text  (printed to stderr)',
    quickFix: "silence one: filterwarnings('ignore', message=…, category=…)",
    watchOut: 'shown once per location by default — a loop does not repeat it',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'The message. warnings.warn(text, Category) builds Category(text) for you.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'The same warnings.warn() call runs 3 times under a filter action of your choice. catch_warnings(record=True) collects what would have been printed.',
      params: [{ name: 'action', type: 'str', hint: 'error ignore always default module once', input: 'text' }],
      template: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter({$action})\n    for i in range(3):\n        warnings.warn('old API', UserWarning)\n[str(w.message) for w in caught]",
      cases: [
        { id: 'default', label: 'default', values: { action: 'default' } },
        { id: 'always',  label: 'always',  values: { action: 'always' } },
        { id: 'ignore',  label: 'ignore',  values: { action: 'ignore' } },
        { id: 'error',   label: 'error',   values: { action: 'error' } },
        { id: 'typo',    label: 'Error',   values: { action: 'Error' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: "Under simplefilter('error') a warning is raised, so ordinary except clauses catch it — except Warning catches every category.",
      params: [{ name: 'msg', type: 'str', hint: 'warning text', input: 'text' }],
      template: "import warnings\nwith warnings.catch_warnings():\n    warnings.simplefilter('error')\n    try:\n        warnings.warn({$msg}, RuntimeWarning)\n        r = 'no exception'\n    except Warning as e:\n        r = f'caught {type(e).__name__}: {e}'\nr",
      cases: [
        { id: 'msg',   label: 'disk almost full', values: { msg: 'disk almost full' } },
        { id: 'empty', label: 'empty message',    values: { msg: '' } },
      ],
    },
  ],
  demoExplainer: "Compare default and always: the default action records the warning once for that line, so a warning inside a loop appears a single time; always records all three. error stops at the first call with an uncaught UserWarning — that is what python -W error does to your whole program. The action must be spelled exactly: 'Error' is a ValueError, not a filter.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'The constructor arguments; args[0] is the message text.' },
    { name: 'w.message / w.category / w.filename / w.lineno', type: 'record fields', meaning: 'With catch_warnings(record=True) each recorded item carries the Warning instance, its class, and the location it is attributed to (see stacklevel).' },
  ],

  patterns: [
    {
      name: 'Warn from your own code',
      desc: 'Pick a category, and stacklevel=2 so the report points at the caller that needs changing.',
      code: "import warnings\n\ndef connect(host, timeout=None):\n    if timeout is None:\n        warnings.warn('no timeout set; connections may hang', RuntimeWarning, stacklevel=2)",
    },
    {
      name: 'Silence one specific warning',
      desc: 'Match by message (a regex matched at the start) and category instead of switching everything off.',
      code: "import warnings\nwarnings.filterwarnings('ignore', message='.*unclosed.*', category=ResourceWarning)",
    },
    {
      name: 'Make warnings fail in tests',
      desc: 'Same as running python -W error: any warning becomes an exception. In pytest: -W error or the filterwarnings ini option.',
      code: "import warnings\n\ndef test_no_warnings():\n    with warnings.catch_warnings():\n        warnings.simplefilter('error')\n        run_the_code()",
    },
  ],

  examples: [
    { title: 'Default category is UserWarning', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    warnings.warn('careful')\n(caught[0].category.__name__, str(caught[0].message))", returns: "('UserWarning', 'careful')" },
    { title: "'error' raises it",                code: "import warnings\nwith warnings.catch_warnings():\n    warnings.simplefilter('error')\n    warnings.warn('careful')", returns: 'UserWarning: careful' },
    { title: 'All built-in categories',          code: "sorted(c.__name__ for c in Warning.__subclasses__() if c.__module__ == 'builtins')", returns: "['BytesWarning', 'DeprecationWarning', 'EncodingWarning', 'FutureWarning', 'ImportWarning', 'PendingDeprecationWarning', 'ResourceWarning', 'RuntimeWarning', 'SyntaxWarning', 'UnicodeWarning', 'UserWarning']" },
    { title: 'SyntaxWarning from the compiler',  code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    compile(r\"'\\d'\", '<demo>', 'eval')\n[(w.category.__name__, str(w.message)) for w in caught]", returns: "[('SyntaxWarning', \"invalid escape sequence '\\\\d'\")]" },
    { title: 'SyntaxWarning as error becomes SyntaxError', code: "import warnings\nwith warnings.catch_warnings():\n    warnings.simplefilter('error')\n    compile(r\"'\\d'\", '<demo>', 'eval')", returns: "SyntaxError: invalid escape sequence '\\d'" },
    { title: 'RuntimeWarning: coroutine never awaited', code: "import warnings\nasync def fetch():\n    return 1\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    fetch()\n[(w.category.__name__, str(w.message)) for w in caught]", returns: "[('RuntimeWarning', \"coroutine 'fetch' was never awaited\")]" },
    { title: 'ResourceWarning: file never closed', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    f = open('data.txt', 'w')\n    del f\n[w.category.__name__ for w in caught]", returns: "['ResourceWarning']" },
    { title: 'stacklevel=2 blames the caller',   code: "import warnings\ndef old(x):\n    warnings.warn('old() is deprecated', DeprecationWarning, stacklevel=2)\n    return x\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    old(1)\n[w.lineno for w in caught]", returns: '[7]' },
  ],

  pitfalls: [
    {
      name: 'Blanket ignore hides warnings you need',
      desc: "simplefilter('ignore') also swallows deprecations and resource leaks from your own code. Filter by message and category.",
      wrong: { label: 'Ignore everything', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('ignore')\n    warnings.warn('noisy library message')\n    warnings.warn('important')\n[str(w.message) for w in caught]", output: '[]' },
      fix:   { label: 'Ignore one message', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    warnings.filterwarnings('ignore', message='noisy')\n    warnings.warn('noisy library message')\n    warnings.warn('important')\n[str(w.message) for w in caught]", output: "['important']" },
    },
    {
      name: 'Passing the category as a string',
      desc: 'The second argument is a class, not its name.',
      wrong: { label: "'UserWarning'", code: "import warnings\nwarnings.warn('x', 'UserWarning')", output: "TypeError: category must be a Warning subclass, not 'str'" },
      fix:   { label: 'UserWarning', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    warnings.warn('x', UserWarning)\nlen(caught)", output: '1' },
    },
    {
      name: 'Filters are ordered: the newest wins',
      desc: 'simplefilter and filterwarnings insert at the front of the list, so a later, more general call overrides an earlier specific one.',
      wrong: { label: 'Specific first', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always', UserWarning)\n    warnings.simplefilter('error')\n    warnings.warn('shown, not raised')\nlen(caught)", output: 'UserWarning: shown, not raised' },
      fix:   { label: 'General first', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('error')\n    warnings.simplefilter('always', UserWarning)\n    warnings.warn('shown, not raised')\nlen(caught)", output: '1' },
    },
  ],

  when: {
    use: [
      'Something works but is probably a mistake or will change — the caller should hear about it without crashing',
      'Library code: deprecations, odd-but-legal arguments, fallbacks that lose performance',
      'Subclass a category (class ConfigWarning(UserWarning)) so users can filter yours precisely',
    ],
    avoid: [
      'The operation cannot continue → raise a real exception',
      'Diagnostics for operators of a service → logging (logging.captureWarnings(True) routes warnings there)',
    ],
  },

  notes: {
    cpython:          'Python/_warnings.c — the C implementation behind warnings.warn(); Lib/warnings.py holds filters, catch_warnings and formatting',
    'Default filters': 'Release builds ignore DeprecationWarning (except in __main__), PendingDeprecationWarning, ImportWarning and ResourceWarning; -X dev shows them all',
    'Command line':   'python -W error, -W ignore::DeprecationWarning, or PYTHONWARNINGS=… set filters before your code runs',
    Categories:       'UserWarning (default), DeprecationWarning, PendingDeprecationWarning, FutureWarning, SyntaxWarning, RuntimeWarning, ImportWarning, UnicodeWarning, BytesWarning, ResourceWarning, EncodingWarning',
  },

  related: [
    { name: 'DeprecationWarning', slug: 'deprecationwarning', when: 'Deprecations — hidden by default outside __main__' },
    { name: 'Exception',          slug: 'exception',          when: 'Warning is a subclass, so except Exception catches raised warnings' },
    { name: 'SyntaxError',        slug: 'syntaxerror',        when: 'What a SyntaxWarning becomes under -W error' },
  ],

  faq: [
    {
      q: 'How do I turn warnings into errors?',
      a: "Run python -W error script.py (or set PYTHONWARNINGS=error), or call warnings.simplefilter('error') — inside warnings.catch_warnings() to limit it to a block. The warning is then raised as an exception of its category and can be caught with except UserWarning, except DeprecationWarning, or except Warning.",
    },
    {
      q: 'How do I suppress a warning in Python?',
      a: "For one known warning: warnings.filterwarnings('ignore', message='regex', category=SomeWarning) near program start, or wrap the noisy call in with warnings.catch_warnings(): warnings.simplefilter('ignore'). From outside: python -W ignore::DeprecationWarning. Avoid ignoring everything — you lose deprecation notices you will need before the next upgrade.",
    },
    {
      q: 'Why is my warning only shown once?',
      a: "The default action is 'default': print the first occurrence for each (message, category, module, line) and suppress repeats. Use simplefilter('always') to see every occurrence. Once a warning has been shown, the per-module __warningregistry__ remembers it until the filters change.",
    },
    {
      q: 'What are SyntaxWarning, RuntimeWarning and ResourceWarning?',
      a: "SyntaxWarning comes from the compiler for dubious code such as invalid escape sequences ('\\d' — use r'\\d') or x is 1. RuntimeWarning flags suspicious runtime behavior, e.g. a coroutine that was never awaited. ResourceWarning reports resources such as files or sockets that were never closed; it is ignored by default, so run with -X dev or -W default to see it.",
    },
    {
      q: 'What are BytesWarning, EncodingWarning, UnicodeWarning and ImportWarning?',
      a: 'BytesWarning is emitted only when Python runs with -b, e.g. for comparing bytes with str. EncodingWarning (3.10+) appears only with -X warn_default_encoding, when open() and friends are used without an explicit encoding. UnicodeWarning is a category for Unicode-related warnings that current CPython rarely emits. ImportWarning flags probable mistakes during imports and is ignored by default.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#Warning',
    meta:  'Built-in exceptions',
  },
};
