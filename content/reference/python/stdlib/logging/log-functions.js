// content/reference/python/stdlib/logging/log-functions.js

export const meta = {
  slug:        'log-functions',
  name:        'logging.info / debug / warning / error / critical / log',
  signature:   'logging.info(msg, *args, **kwargs)',
  blurb:       'Module-level shortcuts that log on the root logger — and configure it with basicConfig() first if it has no handlers yet.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging.info logging.debug logging.warning logging.error logging.critical logging.log logging.warn logging.fatal debug info warning warn error critical fatal log python module level logging functions root logger WARNING:root: implicit basicConfig deprecated warn level must be an integer',
};

export const method = {
  slug:      'log-functions',
  name:      'logging.info / debug / warning / error / critical / log',
  signature: 'logging.debug|info|warning|error|critical(msg, *args, **kwargs)  ·  logging.log(level, msg, *args, **kwargs)',
  returns:   { type: 'None', desc: 'Logs one record on the root logger.' },

  category:    'logging function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "logging.info('x') is root.info('x') with a side effect: when the root logger has no handlers, it first calls basicConfig() — a stderr handler with the 'LEVEL:root:message' format. Handy in a script, a trap in a library. warn and fatal are older aliases of warning and critical; warn is deprecated.",

  covers: ['debug', 'info', 'warning', 'warn', 'error', 'critical', 'fatal', 'log'],

  cheat: {
    commonCall: "logging.warning('disk %d%% full', 93)",
    returns:    "None — prints 'WARNING:root:disk 93% full' with the default setup",
    replaces:   'print() for diagnostics in a small script',
    watchOut:   'configures the root logger on first use; libraries should use getLogger(__name__)',
  },

  parameters: [
    { name: 'level',      type: 'int',  required: true,  default: null,    desc: 'logging.log only: the numeric level. A str such as "INFO" raises TypeError.' },
    { name: 'msg',        type: 'str',  required: true,  default: null,    desc: 'The message, a %-format string when args are given (str() is applied to non-str values).' },
    { name: '*args',      type: 'any',  required: false, default: '()',    desc: 'Values merged into msg with % — only when the record is emitted. A single dict allows %(key)s.' },
    { name: 'exc_info',   type: 'bool | exception | tuple', required: false, default: 'None', desc: 'Append a traceback (see logging.exception).' },
    { name: 'stack_info', type: 'bool', required: false, default: 'False', desc: 'Append the current call stack.' },
    { name: 'stacklevel', type: 'int',  required: false, default: '1',     desc: 'Report the caller N frames up as the source line (3.8+).' },
    { name: 'extra',      type: 'dict', required: false, default: 'None',  desc: 'Extra attributes for the LogRecord, usable in the format string.' },
  ],

  modes: [
    {
      id: 'implicit',
      label: 'no setup',
      blurb: 'Nothing is configured. logging.log() adds a handler to the root logger, then logs — does a line appear on stderr?',
      params: [
        { name: 'level', type: 'int', hint: 'a numeric level (10 … 50)', input: 'auto' },
        { name: 'msg',   type: 'str', hint: 'the message',               input: 'text' },
      ],
      template: "import io, contextlib, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        logging.log({$level}, {$msg})\n        added = len(root.handlers) - len(saved[0])\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\n(added, err.getvalue())",
      cases: [
        { id: 'warning', label: '30',          values: { level: '30', msg: 'disk almost full' } },
        { id: 'info',    label: '20',          values: { level: '20', msg: 'service started' } },
        { id: 'custom',  label: '35',          values: { level: '35', msg: 'between levels' } },
        { id: 'str',     label: "'ERROR' (str)", values: { level: 'ERROR', msg: 'failed' } },
      ],
    },
    {
      id: 'calls',
      label: 'five calls',
      blurb: 'The root logger configured with basicConfig, then one call of each kind.',
      params: [{ name: 'level', type: 'int | str', hint: 'root level', input: 'auto' }],
      template: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, level={$level}, format='%(levelname)s %(message)s', force=True)\n    logging.debug('cache miss')\n    logging.info('request served')\n    logging.warning('slow response')\n    logging.error('upstream failed')\n    logging.critical('out of memory')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue().splitlines()",
      cases: [
        { id: 'default', label: "'WARNING'", values: { level: 'WARNING' } },
        { id: 'debug',   label: "'DEBUG'",   values: { level: 'DEBUG' } },
        { id: 'error',   label: '40',        values: { level: '40' } },
        { id: 'fatal',   label: "'FATAL'",   values: { level: 'FATAL' } },
      ],
    },
  ],
  demoExplainer: "In every 'no setup' case the root logger gains one handler — even at level 20, where the root level (WARNING) then drops the message, so stderr stays empty. Level 35 has no name, so it prints as 'Level 35'. A str level makes logging.log raise TypeError: level must be an integer — after the implicit basicConfig has already run. 'FATAL' is accepted as a level name and means CRITICAL (50).",

  patterns: [
    {
      name: 'A quick script',
      desc: 'Fine for single-file scripts: configure once, then call the module functions.',
      code: "import logging\nlogging.basicConfig(level=logging.INFO)\nlogging.info('processing %d files', 12)",
    },
    {
      name: 'Dict as the single argument',
      desc: 'One mapping argument enables %(name)s placeholders in the message.',
      code: "import logging\nlogging.warning('%(user)s failed to log in from %(ip)s', {'user': 'ada', 'ip': '10.0.0.7'})",
    },
    {
      name: 'Level chosen at run time',
      desc: 'logging.log takes the level as a number.',
      code: "import logging\nlevel = logging.ERROR if failed else logging.INFO\nlogging.log(level, 'batch finished: %d failures', failures)",
    },
  ],

  examples: [
    { title: 'The default format names the root logger', code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream)\n    logging.warning('disk %d%% full', 93)\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", returns: "'WARNING:root:disk 93% full\\n'" },
    { title: 'A dict argument fills %(key)s',   code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, format='%(message)s')\n    logging.error('%(user)s from %(ip)s', {'user': 'ada', 'ip': '10.0.0.7'})\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", returns: "'ada from 10.0.0.7\\n'" },
    { title: 'logging.log with a custom number', code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, level=logging.DEBUG)\n    logging.log(15, 'verbose detail')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", returns: "'Level 15:root:verbose detail\\n'" },
    { title: 'fatal is critical under another name', code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream)\n    logging.fatal('giving up')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", returns: "'CRITICAL:root:giving up\\n'" },
    { title: 'warn() is deprecated',             code: "import io, contextlib, logging, warnings\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\ntry:\n    with warnings.catch_warnings(record=True) as caught, contextlib.redirect_stderr(io.StringIO()):\n        warnings.simplefilter('always')\n        logging.warn('old name')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\n(caught[0].category.__name__, str(caught[0].message))", returns: "('DeprecationWarning', \"The 'warn' function is deprecated, use 'warning' instead\")" },
    { title: 'msg need not be a str',            code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, format='%(message)s')\n    logging.warning({'disk': 'full'})\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", returns: "\"{'disk': 'full'}\\n\"" },
  ],

  pitfalls: [
    {
      name: 'Calling logging.info() inside a library',
      desc: "The module-level functions configure the root logger as a side effect, taking that decision away from the application. A library should log through getLogger(__name__), which never adds handlers.",
      wrong: { label: 'logging.info', code: "import io, contextlib, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\ntry:\n    with contextlib.redirect_stderr(io.StringIO()):\n        logging.info('library: cache warmed')\n    added = len(root.handlers) - len(saved[0])\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nadded", output: '1' },
      fix:   { label: 'module logger', code: "import io, contextlib, logging\nroot = logging.getLogger()\nbefore = len(root.handlers)\nwith contextlib.redirect_stderr(io.StringIO()):\n    logging.getLogger('mylib.cache').info('cache warmed')\nlen(root.handlers) - before", output: '0' },
    },
    {
      name: 'A level name passed to logging.log',
      desc: 'setLevel accepts names, logging.log does not: its level must be an int. Map names through getLevelNamesMapping() (3.11+) or use the constants.',
      wrong: { label: "'INFO'", code: "import io, contextlib, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\ntry:\n    with contextlib.redirect_stderr(io.StringIO()):\n        logging.log('INFO', 'started')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])", output: 'TypeError: level must be an integer' },
      fix:   { label: 'mapped to an int', code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, level=logging.INFO)\n    logging.log(logging.getLevelNamesMapping()['INFO'], 'started')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", output: "'INFO:root:started\\n'" },
    },
  ],

  when: {
    use: [
      'Short scripts and notebooks where the root logger is all you need',
      'Quick diagnostics before proper logging is set up',
    ],
    avoid: [
      'Libraries and larger programs → logging.getLogger(__name__) and its methods',
      'Telling records from different modules apart → named loggers (the module functions always say root)',
    ],
  },

  notes: {
    cpython:      'Each function checks len(root.handlers) == 0, calls basicConfig() if so, then delegates to root.debug/info/…; logging.exception calls error with exc_info=True',
    'warn':       "logging.warn emits a DeprecationWarning (\"The 'warn' function is deprecated, use 'warning' instead\") and then calls warning",
    'fatal':      'logging.fatal is an undeprecated alias of critical; the FATAL constant equals CRITICAL (50)',
  },

  related: [
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'What the implicit call does' },
    { name: 'Logger.info and friends', slug: 'logger-info', when: 'The same methods on your own logger' },
    { name: 'logging.exception', slug: 'exception', when: 'error() plus the current traceback' },
    { name: 'logging levels', slug: 'levels', when: 'The numbers behind the names' },
    { name: 'DeprecationWarning', slug: 'deprecationwarning', when: 'What logging.warn emits', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between logging.info() and logger.info()?',
      a: "logging.info() logs on the root logger and configures it with basicConfig() if it has no handlers. logger.info() on a logger from getLogger(__name__) logs under that name, never configures anything, and lets you set levels per module. Use the module functions in small scripts, named loggers everywhere else.",
    },
    {
      q: 'Why does logging.warning print WARNING:root: before my message?',
      a: "That is basicConfig's default format, BASIC_FORMAT = '%(levelname)s:%(name)s:%(message)s', and the module-level functions log on the logger named 'root'. Pass format= to basicConfig to change it.",
    },
    {
      q: 'Is logging.warn deprecated?',
      a: "Yes. logging.warn and Logger.warn emit a DeprecationWarning and call warning(); use logging.warning instead. logging.fatal still works silently and is the same as logging.critical.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.info',
    meta:  'logging.info and the other module-level functions',
  },

};
