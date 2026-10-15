// content/reference/python/stdlib/logging/logger.js

export const meta = {
  slug:        'logger',
  name:        'logging.Logger',
  signature:   'logging.Logger(name, level=logging.NOTSET)',
  blurb:       'The class of every named logger: a name, a level, a parent, handlers and filters. Get instances from logging.getLogger — calling Logger() yourself makes an orphan outside the logger tree.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging Logger class python Logger.findCaller Logger.makeRecord Logger.root Logger.manager logger attributes name level parent propagate handlers disabled filters loggerDict list all loggers PlaceHolder instantiate Logger directly stacklevel funcName lineno',
};

export const method = {
  slug:      'logger',
  name:      'logging.Logger',
  signature: 'logging.Logger(name, level=logging.NOTSET)',
  returns:   { type: 'logging.Logger', desc: 'A logger that is NOT registered: no parent, not returned by getLogger. Use logging.getLogger(name) instead.' },

  category:    'logging class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Everything you call on a logger lives here: info() and friends, setLevel, addHandler, propagate. The class also holds two shared objects — Logger.root, the root logger, and Logger.manager, the registry behind getLogger — plus the two hooks that build a record: findCaller (where was the call made?) and makeRecord.',

  covers: ['Logger', 'Logger.findCaller', 'Logger.makeRecord', 'Logger.root', 'Logger.manager'],

  cheat: {
    commonCall: 'log = logging.getLogger(__name__)  # not logging.Logger(...)',
    returns:    '<Logger shop.cart (WARNING)> — name and effective level',
    replaces:   'a module-level print() helper',
    watchOut:   'Logger(name) is not in the tree: no parent, no root handlers',
  },

  parameters: [
    { name: 'name',  type: 'str',       required: true,  default: null,     desc: 'The logger name. The constructor does not check it; getLogger requires a str.' },
    { name: 'level', type: 'int | str', required: false, default: 'NOTSET', desc: 'Initial level, a number or a registered name — same rules as setLevel.' },
  ],

  attributes: [
    { name: 'name',      type: 'str',                meaning: 'The dotted name the logger was created with' },
    { name: 'level',     type: 'int',                meaning: 'Its own level; 0 (NOTSET) = use the parent’s' },
    { name: 'parent',    type: 'Logger | None',      meaning: 'Nearest existing ancestor in the tree; None for the root logger and for loggers made with Logger()' },
    { name: 'propagate', type: 'bool',               meaning: 'Pass records on to the parent’s handlers (default True)' },
    { name: 'handlers',  type: 'list[Handler]',      meaning: 'The handlers attached to this logger itself' },
    { name: 'filters',   type: 'list',               meaning: 'Logger-level filters, run only for records created on this logger' },
    { name: 'disabled',  type: 'bool',               meaning: 'True switches the logger off completely; logging.config sets it on loggers it does not configure' },
    { name: 'root',      type: 'RootLogger',         meaning: 'Class attribute: the root logger (logging.root)' },
    { name: 'manager',   type: 'logging.Manager',    meaning: 'Class attribute: the registry; manager.loggerDict maps names to loggers and PlaceHolder objects' },
  ],

  modes: [
    {
      id: 'direct',
      label: 'Logger() vs getLogger()',
      blurb: "Logger 'ledger' has a handler. The same name is used twice: once with logging.Logger(name), once with logging.getLogger(name). Where does each warning end up?",
      params: [{ name: 'name', type: 'str', hint: 'a logger name', input: 'text' }],
      template: "import io, contextlib, logging\nledger = logging.getLogger('ledger')\nledger.setLevel(logging.INFO)\nledger.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(name)s: %(message)s'))\nledger.addHandler(handler)\ntry:\n    with contextlib.redirect_stderr(io.StringIO()) as err:\n        logging.Logger({$name}).warning('from Logger()')\n        logging.getLogger({$name}).warning('from getLogger()')\nfinally:\n    ledger.removeHandler(handler)\n{'ledger handler': stream.getvalue().splitlines(), 'stderr': err.getvalue().splitlines()}",
      cases: [
        { id: 'child',  label: 'ledger.entries', values: { name: 'ledger.entries' } },
        { id: 'same',   label: 'ledger',         values: { name: 'ledger' } },
        { id: 'prefix', label: 'ledgers',        values: { name: 'ledgers' } },
        { id: 'root',   label: "'' (root)",      values: { name: '' } },
      ],
    },
    {
      id: 'caller',
      label: 'findCaller',
      blurb: 'post() asks findCaller where the logging call came from. stacklevel counts frames outward: 1 = post itself.',
      params: [{ name: 'stacklevel', type: 'int', hint: '1, 2 or 3', input: 'number' }],
      template: "import logging\nlog = logging.getLogger('ledger')\ndef post(entries):\n    return log.findCaller(stacklevel={$stacklevel})[1:3]\ndef close_books():\n    return post(3)\nclose_books()",
      cases: [
        { id: 'one',   label: '1', values: { stacklevel: '1' } },
        { id: 'two',   label: '2', values: { stacklevel: '2' } },
        { id: 'three', label: '3', values: { stacklevel: '3' } },
      ],
    },
    {
      id: 'record',
      label: 'makeRecord extra',
      blurb: 'makeRecord builds the LogRecord; every key of extra becomes an attribute — unless the record already has it.',
      params: [
        { name: 'key',   type: 'str', hint: 'an extra key',  input: 'text' },
        { name: 'value', type: 'any', hint: 'its value',     input: 'auto' },
      ],
      template: "import logging\nlog = logging.getLogger('ledger')\nrecord = log.makeRecord('ledger', logging.INFO, 'books.py', 42, 'posted %d entries', (12,), None, extra={{$key}: {$value}})\n(record.getMessage(), record.lineno, getattr(record, {$key}))",
      cases: [
        { id: 'batch',   label: 'batch',     values: { key: 'batch', value: '7' } },
        { id: 'user',    label: 'user',      values: { key: 'user', value: 'ada' } },
        { id: 'lineno',  label: 'lineno',    values: { key: 'lineno', value: '1' } },
        { id: 'message', label: 'message',   values: { key: 'message', value: 'hi' } },
      ],
    },
  ],
  demoExplainer: "A logger built with logging.Logger() has no parent, so its record never reaches the 'ledger' handler: finding no handler anywhere, logging prints the bare message to stderr through logging.lastResort. getLogger('ledger.entries') is wired into the tree and its record climbs to 'ledger'; 'ledgers' only shares a prefix, so both of its records end on stderr. In the findCaller tab, stacklevel 1 is the line inside post() (line 4), 2 the call in close_books() (line 6), 3 the module-level call (line 7). makeRecord refuses extra keys that would overwrite record attributes ('lineno') and the two the Formatter fills in later ('message', 'asctime'): KeyError: \"Attempt to overwrite 'lineno' in LogRecord\".",

  patterns: [
    {
      name: 'The standard way to get a logger',
      desc: 'getLogger registers the logger and links it to its parents.',
      code: "import logging\nlog = logging.getLogger(__name__)",
    },
    {
      name: 'List the loggers that exist',
      desc: 'loggerDict also holds PlaceHolder objects for names that are only ancestors.',
      code: "import logging\nfor name, obj in sorted(logging.Logger.manager.loggerDict.items()):\n    if isinstance(obj, logging.Logger):\n        print(name, logging.getLevelName(obj.getEffectiveLevel()))",
    },
    {
      name: 'Report the caller from a helper',
      desc: 'stacklevel=2 makes findCaller skip the helper frame, so %(funcName)s and %(lineno)d describe its caller.',
      code: "import logging\nlog = logging.getLogger(__name__)\n\ndef audit(msg, *args):\n    log.info(msg, *args, stacklevel=2)",
    },
  ],

  examples: [
    { title: 'Logger.root is the root logger',     code: 'import logging\nlogging.Logger.root is logging.getLogger()', returns: 'True' },
    { title: 'One manager for every logger',       code: "import logging\nlogging.getLogger('ledger.a').manager is logging.Logger.manager is logging.root.manager", returns: 'True' },
    { title: 'Missing ancestors are placeholders',  code: "import logging\nlogging.getLogger('ledger.audit.daily')\ntype(logging.Logger.manager.loggerDict['ledger.audit']).__name__", returns: "'PlaceHolder'" },
    { title: 'A Logger() is not registered',       code: "import logging\nlog = logging.Logger('ledger.direct')\n(log.parent, log is logging.getLogger('ledger.direct'))", returns: '(None, False)' },
    { title: 'Without a parent, NOTSET means everything', code: "import logging\nlog = logging.Logger('ledger.solo')\n(repr(log), log.isEnabledFor(logging.DEBUG))", returns: "('<Logger ledger.solo (NOTSET)>', True)" },
    { title: 'findCaller: line and function',      code: "import logging\ndef where():\n    return logging.getLogger('ledger').findCaller()[1:3]\nwhere()", returns: "(3, 'where')" },
    { title: 'makeRecord fills a LogRecord',       code: "import logging\nlog = logging.getLogger('ledger')\nrecord = log.makeRecord('ledger', logging.INFO, 'books.py', 42, 'posted %d entries', (12,), None, extra={'batch': 7})\n(record.getMessage(), record.filename, record.module, record.batch)", returns: "('posted 12 entries', 'books.py', 'books', 7)" },
    { title: 'The root logger’s repr',             code: 'import logging\nrepr(logging.getLogger())', returns: "'<RootLogger root (WARNING)>'" },
  ],

  pitfalls: [
    {
      name: 'Creating loggers with logging.Logger()',
      desc: "A Logger made directly has parent None, so its records never reach its ancestors' handlers, and getLogger(name) returns a different object. With no handler found, the record falls through to lastResort — bare text on stderr.",
      wrong: { label: 'Logger(name)', code: "import io, contextlib, logging\nparent = logging.getLogger('ledger.pit')\nparent.setLevel(logging.INFO)\nparent.propagate = False\nstream = io.StringIO()\nparent.addHandler(handler := logging.StreamHandler(stream))\nchild = logging.Logger('ledger.pit.child')\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    child.warning('posted')\nparent.removeHandler(handler)\n(stream.getvalue(), err.getvalue())", output: "('', 'posted\\n')" },
      fix:   { label: 'getLogger(name)', code: "import io, contextlib, logging\nparent = logging.getLogger('ledger.pit')\nparent.setLevel(logging.INFO)\nparent.propagate = False\nstream = io.StringIO()\nparent.addHandler(handler := logging.StreamHandler(stream))\nchild = logging.getLogger('ledger.pit.child')\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    child.warning('posted')\nparent.removeHandler(handler)\n(stream.getvalue(), err.getvalue())", output: "('posted\\n', '')" },
    },
    {
      name: 'Treating loggerDict values as loggers',
      desc: 'Names that so far only exist as ancestors are stored as PlaceHolder objects, which have no level, handlers or methods. Filter with isinstance.',
      wrong: { label: 'every value', code: "import logging\nlogging.getLogger('ledger.pit2.a.b')\n[lg.level for lg in logging.Logger.manager.loggerDict.values()]", output: "AttributeError: 'PlaceHolder' object has no attribute 'level'" },
      fix:   { label: 'isinstance(…, Logger)', code: "import logging\nlogging.getLogger('ledger.pit2.a.b')\n[name for name, lg in logging.Logger.manager.loggerDict.items()\n if isinstance(lg, logging.Logger) and name.startswith('ledger.pit2')]", output: "['ledger.pit2.a.b']" },
    },
  ],

  when: {
    use: [
      'Type hints and isinstance checks: def setup(log: logging.Logger)',
      'Subclassing, together with logging.setLoggerClass',
      'Logger.manager.loggerDict to inspect which loggers exist',
    ],
    avoid: [
      'Making loggers → logging.getLogger(name)',
      'Changing how records are built → setLogRecordFactory rather than overriding makeRecord',
    ],
  },

  notes: {
    cpython:      "Logger(Filterer) in Lib/logging/__init__.py; getLogger creates instances through Manager.getLogger, which sets .parent via _fixupParents. Logger.root and Logger.manager are assigned on the class right after the root logger is created",
    'findCaller': "Returns (filename, lineno, funcName, sinfo): it walks out from the call, skipping logging's own frames and stacklevel - 1 more; past the outermost frame it stops there",
    'makeRecord': "Calls the log record factory, then copies extra; a key equal to 'message', 'asctime' or an existing record attribute raises KeyError(\"Attempt to overwrite %r in LogRecord\")",
    'repr':       '<Logger NAME (LEVEL)> shows the effective level, not .level',
  },

  related: [
    { name: 'logging.getLogger', slug: 'getlogger', when: 'How loggers should be created' },
    { name: 'Logger.info and friends', slug: 'logger-info', when: 'The logging methods' },
    { name: 'Logger.setLevel', slug: 'logger-setlevel', when: 'level and getEffectiveLevel' },
    { name: 'Logger.propagate', slug: 'propagate', when: 'parent and propagation' },
    { name: 'logging.setLoggerClass', slug: 'setloggerclass', when: 'Make getLogger return your subclass' },
    { name: 'LogRecord', slug: 'logrecord', when: 'What makeRecord creates' },
  ],

  faq: [
    {
      q: 'Should I create logging.Logger objects directly?',
      a: "No. The docs say loggers should never be instantiated directly. logging.Logger('x') returns a logger with no parent that getLogger('x') does not know about, so it bypasses the configuration of the logger tree. Always use logging.getLogger(name).",
    },
    {
      q: 'How do I list all loggers in Python?',
      a: 'logging.Logger.manager.loggerDict (the same object as logging.root.manager.loggerDict) maps every name to a Logger or a PlaceHolder. Keep only the isinstance(obj, logging.Logger) entries.',
    },
    {
      q: 'What does findCaller return?',
      a: "A 4-tuple (filename, lineno, funcName, sinfo) describing the code that made the logging call; sinfo is the stack text when stack_info is true, else None. The record's %(pathname)s, %(lineno)d and %(funcName)s come from it. stacklevel=2 attributes the call to the caller of your helper function.",
    },
    {
      q: 'Why is my logger disabled after dictConfig or fileConfig?',
      a: 'Both disable existing loggers that the configuration does not mention (logger.disabled = True) unless you pass disable_existing_loggers=False. Create loggers after configuring, or set that option.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Logger',
    meta:  'logging.Logger',
  },

};
