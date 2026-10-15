// content/reference/python/stdlib/logging/index.js — the logging module hub

export const meta = {
  slug:        'index',
  name:        'logging',
  signature:   'import logging',
  blurb:       'Report what a program is doing at a chosen severity — loggers named by module, handlers that send records to the console or files, formatters that lay them out, and levels that decide what gets through.',
  category:    'system',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging module python logger getlogger basicconfig log levels debug info warning error critical handler formatter streamhandler filehandler log to file log to console print vs logging logging not printing root logger propagate lazy formatting f-string logging.handlers rotatingfilehandler dictconfig',
};

export const method = {
  slug: 'index',
  name: 'logging',

  category:    'System',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'getLogger(__name__) in every module, one configuration at startup, and messages that are only built when their level gets through. Records climb a tree of dotted logger names to the handlers that print them — and the root logger starts at WARNING, which is why logger.info() shows nothing until you configure something.',

  imports: ['import logging', 'import logging.handlers', 'from logging import getLogger'],
  facts: [
    { label: 'Public API',   value: '45 names in logging.__all__: getLogger, basicConfig, the level constants, Logger, Handler, StreamHandler, FileHandler, NullHandler, Formatter, Filter, LogRecord, LoggerAdapter, …' },
    { label: 'Default',      value: 'root logger at WARNING with no handlers — warnings and errors still reach stderr through logging.lastResort, info and debug are dropped' },
    { label: 'More handlers', value: 'logging.handlers: RotatingFileHandler, TimedRotatingFileHandler, QueueHandler / QueueListener, SysLogHandler, SMTPHandler, HTTPHandler, MemoryHandler, WatchedFileHandler, SocketHandler' },
    { label: 'Configuration', value: 'basicConfig() for scripts; logging.config.dictConfig() / fileConfig() for applications' },
  ],

  coverClasses: ['Logger', 'Handler', 'StreamHandler', 'FileHandler', 'NullHandler', 'Formatter', 'BufferingFormatter', 'Filter', 'LogRecord', 'LoggerAdapter'],

  modes: [
    {
      id: 'levels',
      label: 'levels',
      blurb: 'One logger, four calls. The logger level decides which of them produce a line.',
      params: [
        { name: 'level', type: 'int | str', hint: "a level: 'DEBUG', 'INFO', 30 …", input: 'auto' },
        { name: 'user',  type: 'str',       hint: 'a value for %s',               input: 'text' },
      ],
      template: "import io, logging\nlog = logging.getLogger('shop')\nlog.setLevel({$level})\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s:%(name)s:%(message)s'))\nlog.addHandler(handler)\ntry:\n    log.debug('cart contents for %s', {$user})\n    log.info('%s logged in', {$user})\n    log.warning('%s has 3 failed payments', {$user})\n    log.error('payment for %s declined', {$user})\nfinally:\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'info',    label: "'INFO'",            values: { level: 'INFO', user: 'ada' } },
        { id: 'debug',   label: "'DEBUG'",           values: { level: 'DEBUG', user: 'ada' } },
        { id: 'num',     label: '40',                values: { level: '40', user: 'ada' } },
        { id: 'between', label: '25 (custom)',       values: { level: '25', user: 'grace' } },
        { id: 'lower',   label: "'info' (lowercase)", values: { level: 'info', user: 'ada' } },
      ],
    },
    {
      id: 'tree',
      label: 'propagation',
      blurb: "Only 'shop' has a handler. Log from another logger and see whether the record climbs to it.",
      params: [
        { name: 'name',    type: 'str', hint: 'the logger to log from', input: 'text' },
        { name: 'message', type: 'str', hint: 'the message',            input: 'text' },
      ],
      template: "import io, logging\nshop = logging.getLogger('shop')\nshop.setLevel(logging.INFO)\nshop.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(name)s -> %(message)s'))\nshop.addHandler(handler)\ntry:\n    logging.getLogger({$name}).info({$message})\nfinally:\n    shop.removeHandler(handler)\nstream.getvalue()",
      cases: [
        { id: 'child',   label: 'shop.cart',        values: { name: 'shop.cart', message: 'item added' } },
        { id: 'deep',    label: 'shop.cart.items',  values: { name: 'shop.cart.items', message: 'qty 3' } },
        { id: 'self',    label: 'shop',             values: { name: 'shop', message: '100% done' } },
        { id: 'prefix',  label: 'shopping',         values: { name: 'shopping', message: 'item added' } },
      ],
    },
    {
      id: 'args',
      label: '%-formatting',
      blurb: 'The message and its argument are merged with % only when the record is emitted. A broken pair does not raise — the line is dropped and a "--- Logging error ---" report goes to stderr.',
      params: [
        { name: 'msg',   type: 'str',              hint: 'a message with % placeholders', input: 'text' },
        { name: 'value', type: 'int | float | str', hint: 'the argument',                 input: 'auto' },
      ],
      template: "import io, logging\nlog = logging.getLogger('shop')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nlog.addHandler(handler)\ntry:\n    log.info({$msg}, {$value})\nfinally:\n    log.removeHandler(handler)\nstream.getvalue()",
      cases: [
        { id: 'str',   label: '%s',            values: { msg: 'order %s shipped', value: '1042' } },
        { id: 'float', label: '%.2f',          values: { msg: 'total: %.2f EUR', value: '19.5' } },
        { id: 'pad',   label: '%-8s|',         values: { msg: '[%-8s|]', value: 'ada' } },
        { id: 'bad',   label: '%d with text',  values: { msg: '%d items', value: 'three' } },
        { id: 'pct',   label: 'stray %',       values: { msg: '100% of %s', value: 'ada' } },
      ],
    },
  ],
  demoExplainer: "The logger level is a threshold: at INFO, debug() is skipped before any formatting happens; 25 sits between INFO (20) and WARNING (30), so only warning and error pass. Names are case-sensitive — 'info' raises ValueError: Unknown level: 'info'. In the propagation tab the record from 'shop.cart' climbs to 'shop' and uses its handler, while 'shopping' is not a child of 'shop' (the tree splits on dots, not on prefixes); its effective level is the root logger's WARNING, so info() is not even enabled. In the last tab, '%d' with a str and a stray '%' both fail inside the handler: the line is lost, the program carries on.",

  patterns: [
    {
      name: 'One logger per module',
      desc: '__name__ gives the dotted module path, so loggers mirror your package tree and can be configured per subsystem.',
      code: "import logging\nlog = logging.getLogger(__name__)\n\ndef charge(order_id, amount):\n    log.info('charging order %s: %.2f', order_id, amount)",
    },
    {
      name: 'Configure once, in the entry point',
      desc: 'Libraries only create loggers; the application decides level, format and destination.',
      code: "import logging\n\nif __name__ == '__main__':\n    logging.basicConfig(\n        level=logging.INFO,\n        format='%(asctime)s %(levelname)-8s %(name)s: %(message)s',\n    )\n    main()",
    },
    {
      name: 'Console and file at the same time',
      desc: 'Several handlers on one logger, each with its own level.',
      code: "import logging\nroot = logging.getLogger()\nroot.setLevel(logging.DEBUG)\nconsole = logging.StreamHandler()\nconsole.setLevel(logging.INFO)\nfile = logging.FileHandler('app.log', encoding='utf-8')\nfile.setLevel(logging.DEBUG)\nfmt = logging.Formatter('%(asctime)s %(levelname)s %(name)s: %(message)s')\nfor h in (console, file):\n    h.setFormatter(fmt)\n    root.addHandler(h)",
    },
    {
      name: 'Rotate log files by size',
      desc: 'logging.handlers.RotatingFileHandler keeps app.log, app.log.1 … app.log.N.',
      code: "import logging, logging.handlers\nhandler = logging.handlers.RotatingFileHandler(\n    'app.log', maxBytes=1_000_000, backupCount=5, encoding='utf-8')\nlogging.getLogger().addHandler(handler)",
    },
    {
      name: 'Configuration as a dict',
      desc: 'logging.config.dictConfig sets up loggers, handlers and formatters from one data structure (often loaded from JSON or YAML).',
      code: "import logging.config\nlogging.config.dictConfig({\n    'version': 1,\n    'formatters': {'plain': {'format': '%(levelname)s %(name)s: %(message)s'}},\n    'handlers': {'console': {'class': 'logging.StreamHandler', 'formatter': 'plain'}},\n    'root': {'level': 'INFO', 'handlers': ['console']},\n})",
    },
  ],

  examples: [
    { title: 'Same name, same logger',        code: "import logging\nlogging.getLogger('shop.cart') is logging.getLogger('shop.cart')", returns: 'True' },
    { title: 'Dotted names form a tree',      code: "import logging\nshop = logging.getLogger('shop')\ncart = logging.getLogger('shop.cart')\ncart.parent is shop", returns: 'True' },
    { title: 'The root logger starts at WARNING', code: "import logging\nlogging.getLevelName(logging.getLogger().level)", returns: "'WARNING'" },
    { title: 'Log to standard output',        code: "import logging, sys\nlog = logging.getLogger('cli')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\nlog.info('copied %d files', 3)\nlog.debug('not shown: below INFO')\nlog.removeHandler(handler)", returns: 'INFO copied 3 files' },
    { title: 'Arguments are formatted lazily', code: "import logging\nclass Report:\n    def __str__(self):\n        print('building the report…')\n        return 'report'\nlog = logging.getLogger('shop.lazy')\nlog.setLevel(logging.INFO)\nlog.debug('state: %s', Report())\n'debug skipped, __str__ never ran'", returns: "'debug skipped, __str__ never ran'" },
    { title: 'Levels are plain ints',         code: 'import logging\n(logging.DEBUG, logging.INFO, logging.WARNING, logging.ERROR, logging.CRITICAL)', returns: '(10, 20, 30, 40, 50)' },
    { title: 'A logger repr shows its effective level', code: "import logging\napi = logging.getLogger('api')\napi.setLevel(logging.ERROR)\nrepr(logging.getLogger('api.v2'))", returns: "'<Logger api.v2 (ERROR)>'" },
  ],

  pitfalls: [
    {
      name: 'Expecting logger.info() to print without any setup',
      desc: 'An unconfigured logger inherits the root level, WARNING, so info and debug are dropped. (warning and above still appear on stderr via logging.lastResort, bare and unformatted.) Set a level and attach a handler — or call basicConfig in the entry point.',
      wrong: { label: 'no configuration', code: "import logging\nlog = logging.getLogger('worker')\nlog.info('job started')\nlog.getEffectiveLevel()", output: '30' },
      fix:   { label: 'level + handler',  code: "import logging, sys\nlog = logging.getLogger('worker.configured')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nlog.addHandler(handler)\nlog.info('job started')\nlog.removeHandler(handler)", output: 'job started' },
    },
    {
      name: 'Building the message with an f-string',
      desc: 'An f-string is evaluated before the call — even when the level is disabled and the record is thrown away. Pass the values as arguments; logging formats them only if a handler will emit the line (and tools that group logs by message template see one template).',
      wrong: { label: 'f-string', code: "import logging\ncalls = []\ndef snapshot():\n    calls.append(1)\n    return 'big dump'\nlog = logging.getLogger('shop.fstring')\nlog.setLevel(logging.WARNING)\nlog.debug(f'state: {snapshot()}')\nlen(calls)", output: '1' },
      fix:   { label: '%s argument', code: "import logging\ncalls = []\nclass Snapshot:\n    def __str__(self):\n        calls.append(1)\n        return 'big dump'\nlog = logging.getLogger('shop.fstring')\nlog.setLevel(logging.WARNING)\nlog.debug('state: %s', Snapshot())\nlen(calls)", output: '0' },
    },
    {
      name: 'Adding a handler on every call',
      desc: 'Handlers accumulate on the logger object, which getLogger returns again and again. Each call below adds one more, so the second message is printed twice. Configure handlers once, at startup.',
      wrong: { label: 'handler per call', code: "import logging, sys\ndef get_log():\n    log = logging.getLogger('dup')\n    log.setLevel(logging.INFO)\n    log.propagate = False\n    log.addHandler(logging.StreamHandler(sys.stdout))\n    return log\ntry:\n    get_log().info('first')\n    get_log().info('second')\nfinally:\n    logging.getLogger('dup').handlers.clear()", output: 'first\nsecond\nsecond' },
      fix:   { label: 'check first', code: "import logging, sys\ndef get_log():\n    log = logging.getLogger('dup.once')\n    if not log.handlers:\n        log.setLevel(logging.INFO)\n        log.propagate = False\n        log.addHandler(logging.StreamHandler(sys.stdout))\n    return log\ntry:\n    get_log().info('first')\n    get_log().info('second')\nfinally:\n    logging.getLogger('dup.once').handlers.clear()", output: 'first\nsecond' },
    },
  ],

  when: {
    use: [
      'Diagnostics of a long-running program: services, workers, scheduled jobs',
      'Libraries — emit records and let the application decide where they go',
      'Anything you want to switch between quiet and verbose without editing code',
    ],
    avoid: [
      'The actual output of a command-line tool (results, tables) → print()',
      'Telling the user about bad input in an interactive program → print() or an exception',
      'Warnings meant for developers of calling code → warnings.warn (and captureWarnings to route them into logging)',
    ],
  },

  notes: {
    cpython:        'Lib/logging/__init__.py, pure Python; logging.handlers and logging.config are separate submodules that need their own import',
    'Levels':       'DEBUG 10, INFO 20, WARNING 30, ERROR 40, CRITICAL 50; NOTSET 0 means "inherit from the parent"',
    'Thread safety': 'Handlers serialize emit() with a lock, so several threads can log to one handler; use QueueHandler for multiprocessing',
    'At exit':      'logging.shutdown() is registered with atexit and flushes and closes every handler',
  },

  related: [
    { name: 'print()', slug: 'print', when: 'Program output, not diagnostics', category: 'functions' },
    { name: '% formatting', slug: 'mod', when: 'The formatting logging applies to msg and args', category: 'operators' },
    { name: 'str.format()', slug: 'str-format', when: "What style='{' format strings use", category: 'functions' },
    { name: 'sys module', slug: 'sys', when: 'sys.stdout / sys.stderr as handler streams', category: 'stdlib' },
    { name: 'string module', slug: 'string', when: "string.Template behind style='$'", category: 'stdlib' },
    { name: 'DeprecationWarning', slug: 'deprecationwarning', when: 'Warnings that captureWarnings can route into logging', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does logging.info() not print anything?',
      a: "Nothing has been configured, so the logger's effective level is the root logger's default, WARNING, and INFO (20) is below it. Call logging.basicConfig(level=logging.INFO) once at startup, or set a level and add a handler to your own logger. warning() and above do appear without setup, through logging.lastResort.",
    },
    {
      q: 'What is the difference between print and logging?',
      a: 'print writes text to stdout, always. logging attaches a severity, a logger name and a timestamp to each message, can be filtered by level per module, can go to several destinations at once (console, file, syslog, network) and can be silenced or made verbose by configuration alone. Use print for the output your program exists to produce, logging for diagnostics.',
    },
    {
      q: 'Should I use f-strings in logging calls?',
      a: "Prefer log.info('user %s logged in', user). The f-string is always built, even when the level is disabled, and every message becomes a different string, which defeats log aggregators that group by template. With arguments, logging only formats the message if a handler will actually emit it.",
    },
    {
      q: 'How do I log to a file and the console at the same time?',
      a: "Attach two handlers to the root logger (or pass handlers=[...] to basicConfig): a StreamHandler for the console and a FileHandler for the file, each with its own level and formatter. The logger level must be at least as verbose as the most verbose handler.",
    },
    {
      q: 'What does logging.getLogger(__name__) do?',
      a: "It returns the logger named after the current module, e.g. 'shop.payments'. Because names are dotted, that logger is a child of 'shop' and propagates its records up to 'shop' and the root logger, so one configuration call controls the whole package.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html',
    meta:  'logging — Logging facility for Python',
  },

};
