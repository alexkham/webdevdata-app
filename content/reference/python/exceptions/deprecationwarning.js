// content/reference/python/exceptions/deprecationwarning.js

export const meta = {
  slug:        'deprecationwarning',
  name:        'DeprecationWarning',
  signature:   'DeprecationWarning(*args)',
  blurb:       'Warning category for features that are deprecated — aimed at developers, so it is hidden by default unless triggered directly by code in __main__.',
  category:    'warnings',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'deprecationwarning pendingdeprecationwarning futurewarning deprecation warning deprecated is deprecated and will be removed warnings.deprecated decorator hidden by default __main__ pep 565 -W error::DeprecationWarning stacklevel pytest',
};

export const method = {
  slug:      'deprecationwarning',
  name:      'DeprecationWarning',
  signature: 'DeprecationWarning(*args)',

  category:    'Warning category',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: "A notice that something will go away. The default filters hide it unless the code that triggered it lives in __main__ — so library deprecations stay invisible until you run with -W default, -X dev, or a test runner.",

  chain: ['BaseException', 'Exception', 'Warning', 'DeprecationWarning'],

  cheat: {
    raisedBy: "warnings.warn(msg, DeprecationWarning, stacklevel=2), @warnings.deprecated (3.13)",
    message:  'app.py:7: DeprecationWarning: old_api() is deprecated',
    quickFix: 'see them: python -W default::DeprecationWarning (or -X dev)',
    watchOut: 'hidden by default outside __main__ — silence is not "no deprecations"',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'The message; warnings.warn(text, DeprecationWarning) builds it for you.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Issue a DeprecationWarning as if from a module of your choice, under the default filters. catch_warnings(record=True) counts what would be printed.',
      params: [{ name: 'module', type: 'str', hint: 'module name the warning comes from', input: 'text' }],
      template: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.warn_explicit('f() is deprecated', DeprecationWarning, 'lib.py', 1, module={$module})\nlen(caught)",
      cases: [
        { id: 'main',    label: '__main__',       values: { module: '__main__' } },
        { id: 'lib',     label: 'requests.utils', values: { module: 'requests.utils' } },
        { id: 'near',    label: '__main__.cli',   values: { module: '__main__.cli' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: "old_api() warns with stacklevel=2. Pick the action for DeprecationWarning: 'error' makes the call raise, which is how test suites catch deprecated usage.",
      params: [{ name: 'action', type: 'str', hint: 'error ignore always default', input: 'text' }],
      template: "import warnings\ndef old_api():\n    warnings.warn('old_api() is deprecated; use new_api()', DeprecationWarning, stacklevel=2)\n    return 1\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter({$action}, DeprecationWarning)\n    try:\n        r = old_api()\n    except DeprecationWarning as e:\n        r = f'caught: {e}'\n(r, len(caught))",
      cases: [
        { id: 'error',  label: 'error',  values: { action: 'error' } },
        { id: 'always', label: 'always', values: { action: 'always' } },
        { id: 'ignore', label: 'ignore', values: { action: 'ignore' } },
      ],
    },
  ],
  demoExplainer: "Only the exact module name __main__ gets a 1: the first default filter is default::DeprecationWarning:__main__, and its module field must equal the module name exactly. Any library module — even __main__.cli — falls through to ignore::DeprecationWarning and records nothing. In Handle mode, error turns the call into an exception (0 recorded), always lets it return 1 and records the warning.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'The constructor arguments; args[0] is the message text.' },
    { name: '__deprecated__', type: 'str', meaning: 'Not on the warning — set by @warnings.deprecated(msg) (3.13) on the decorated function or class, holding msg.' },
  ],

  patterns: [
    {
      name: 'Deprecate a function (3.13+)',
      desc: 'The decorator warns on every call (and type checkers flag uses statically).',
      code: "from warnings import deprecated\n\n@deprecated('Use load_config() instead')\ndef read_config(path):\n    return load_config(path)",
    },
    {
      name: 'Deprecate by hand (any version)',
      desc: 'stacklevel=2 attributes the warning to the caller, whose code has to change — and makes it visible when that caller is __main__.',
      code: "import warnings\n\ndef read_config(path):\n    warnings.warn('read_config() is deprecated; use load_config()', DeprecationWarning, stacklevel=2)\n    return load_config(path)",
    },
    {
      name: 'Fail tests on deprecations',
      desc: 'Catch them before the next upgrade removes the feature. pytest shows them in its summary by default; -W error::DeprecationWarning makes them fail.',
      code: "# pytest.ini\n# [pytest]\n# filterwarnings =\n#     error::DeprecationWarning\nimport warnings\nwarnings.simplefilter('error', DeprecationWarning)",
    },
  ],

  examples: [
    { title: 'Shown when triggered in __main__',  code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.warn('going away', DeprecationWarning)\nlen(caught)", returns: '1' },
    { title: 'Ignored when a library triggers it', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.warn_explicit('f() is deprecated', DeprecationWarning, 'lib.py', 1, module='mylib')\nlen(caught)", returns: '0' },
    { title: 'The default filters behind that',    code: "import warnings\n[f for f in warnings.filters if f[2] in (DeprecationWarning, PendingDeprecationWarning)]", returns: "[('default', None, <class 'DeprecationWarning'>, '__main__', 0), ('ignore', None, <class 'DeprecationWarning'>, None, 0), ('ignore', None, <class 'PendingDeprecationWarning'>, None, 0)]" },
    { title: 'PendingDeprecationWarning hidden, FutureWarning shown', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.warn('later', PendingDeprecationWarning)\n    warnings.warn('users see this', FutureWarning)\n[w.category.__name__ for w in caught]", returns: "['FutureWarning']" },
    { title: 'The three are separate classes',     code: 'issubclass(FutureWarning, DeprecationWarning), issubclass(PendingDeprecationWarning, DeprecationWarning)', returns: '(False, False)' },
    { title: '@warnings.deprecated (3.13)',        code: "import warnings\n@warnings.deprecated('use new_api() instead')\ndef old_api():\n    return 1\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    old_api()\n[(w.category.__name__, str(w.message)) for w in caught]", returns: "[('DeprecationWarning', 'use new_api() instead')]" },
    { title: 'The decorator stores the message',   code: "import warnings\n@warnings.deprecated('use new_api() instead')\ndef old_api():\n    return 1\nold_api.__deprecated__", returns: "'use new_api() instead'" },
    { title: 'Raised under an error filter',       code: "import warnings\nwith warnings.catch_warnings():\n    warnings.simplefilter('error', DeprecationWarning)\n    warnings.warn('going away', DeprecationWarning)", returns: 'DeprecationWarning: going away' },
  ],

  pitfalls: [
    {
      name: 'Without stacklevel the warning blames the library line',
      desc: 'The default stacklevel=1 points at the warn() call inside your function, which the user cannot change. stacklevel=2 points at the caller.',
      wrong: { label: 'stacklevel=1', code: "import warnings\ndef old(x):\n    warnings.warn('old() is deprecated', DeprecationWarning)\n    return x\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    old(1)\n[w.lineno for w in caught]", output: '[3]' },
      fix:   { label: 'stacklevel=2', code: "import warnings\ndef old(x):\n    warnings.warn('old() is deprecated', DeprecationWarning, stacklevel=2)\n    return x\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    old(1)\n[w.lineno for w in caught]", output: '[7]' },
    },
    {
      name: 'Using DeprecationWarning for end users of an application',
      desc: 'End users of an app never see DeprecationWarning from library code. For behavior changes they must notice (e.g. a config option going away), use FutureWarning, which the default filters show.',
      wrong: { label: 'DeprecationWarning', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.warn_explicit('option x is going away', DeprecationWarning, 'lib.py', 1, module='mylib')\nlen(caught)", output: '0' },
      fix:   { label: 'FutureWarning', code: "import warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.warn_explicit('option x is going away', FutureWarning, 'lib.py', 1, module='mylib')\nlen(caught)", output: '1' },
    },
  ],

  when: {
    use: [
      'DeprecationWarning: an API other developers call is going away',
      'PendingDeprecationWarning: it will be deprecated later (rarely used; hidden by default even in __main__)',
      'FutureWarning: users of an application must see it — the default filters do not hide it',
    ],
    avoid: [
      'Messages for end users → FutureWarning, or plain output/logging',
      'The feature is already gone → raise a real exception (AttributeError, TypeError …)',
    ],
  },

  notes: {
    cpython:          'The default filter list is built in Python/_warnings.c; the module field "__main__" is compared to the module name exactly',
    'Debug builds':   'The default filter list is empty — everything is shown',
    'Dev mode':       'python -X dev shows DeprecationWarning, PendingDeprecationWarning, ImportWarning and ResourceWarning',
    PEP:              'PEP 565 (show in __main__), PEP 702 (@warnings.deprecated)',
  },

  related: [
    { name: 'Warning',        slug: 'warning',        when: 'All categories, filters and actions' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What you get once the deprecated name is removed' },
    { name: 'ImportError',    slug: 'importerror',    when: 'Or this, when a deprecated module/name is removed' },
  ],

  faq: [
    {
      q: 'Why do I not see DeprecationWarning messages?',
      a: "Release builds ignore DeprecationWarning unless it is attributed to code in __main__ (the script you ran). Deprecations triggered inside libraries — including your own imported modules — are hidden. Show them with python -W default::DeprecationWarning, python -X dev, PYTHONWARNINGS=default, or warnings.simplefilter('default', DeprecationWarning) at startup. Test runners such as pytest show them in their summary.",
    },
    {
      q: 'How do I suppress a DeprecationWarning from a library?',
      a: "Filter it precisely: warnings.filterwarnings('ignore', category=DeprecationWarning, module='libname') (module is a regex matched against the module the warning is attributed to), or wrap the call in warnings.catch_warnings() with simplefilter('ignore', DeprecationWarning). Plan to fix the call, though — the feature will be removed.",
    },
    {
      q: 'What is the difference between DeprecationWarning, PendingDeprecationWarning and FutureWarning?',
      a: 'All three announce change; they differ in audience and default visibility. DeprecationWarning is for developers and is shown only when triggered from __main__. PendingDeprecationWarning means "will be deprecated later" and is ignored by default. FutureWarning is for end users of an application and is always shown by default. None of them is a subclass of another.',
    },
    {
      q: 'How do I mark a function as deprecated?',
      a: "In Python 3.13+, decorate it with @warnings.deprecated('message') — it emits DeprecationWarning on each call (on instantiation for classes), sets __deprecated__, and is understood by static type checkers. On older versions call warnings.warn('…', DeprecationWarning, stacklevel=2) at the top of the function; typing_extensions.deprecated backports the decorator.",
    },
    {
      q: 'How do I make DeprecationWarning fail my tests?',
      a: "Run with -W error::DeprecationWarning, set filterwarnings = error::DeprecationWarning in pytest's configuration, or call warnings.simplefilter('error', DeprecationWarning). The warning is then raised as an exception at the offending call, with a traceback pointing at it.",
    },
  ],

  history: [
    { version: '3.2', note: 'DeprecationWarning is ignored by default, in addition to PendingDeprecationWarning.' },
    { version: '3.7', note: 'DeprecationWarning is again shown by default when triggered directly by code in __main__.' },
    { version: '3.13', note: 'Added the @warnings.deprecated decorator (PEP 702).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#DeprecationWarning',
    meta:  'Built-in exceptions',
  },
};
