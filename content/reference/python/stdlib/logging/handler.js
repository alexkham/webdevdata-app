// content/reference/python/stdlib/logging/handler.js

export const meta = {
  slug:        'handler',
  name:        'logging.Handler',
  signature:   'logging.Handler(level=logging.NOTSET)',
  blurb:       'The base class of every handler: a level, a formatter, filters, an optional name and a lock. Subclass it and implement emit(record) to send log records anywhere.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+ (getHandlerByName 3.12+)',
  searchTerms: 'logging Handler class python custom logging handler subclass emit Handler.emit Handler.format Handler.handle Handler.setLevel Handler.setFormatter Handler.flush Handler.close Handler.name Handler.get_name Handler.set_name Handler.createLock Handler.acquire Handler.release handler level getHandlerByName getHandlerNames handler names lock thread safe',
};

export const method = {
  slug:      'handler',
  name:      'logging.Handler',
  signature: 'logging.Handler(level=logging.NOTSET)',
  returns:   { type: 'logging.Handler', desc: 'A handler whose emit() raises NotImplementedError — use a subclass (StreamHandler, FileHandler, …) or write one.' },

  category:    'logging class',
  version:     'Python 2.3+ (getHandlerByName 3.12+)',
  hasLiveDemo: true,

  subtitle: 'A logger decides whether a record is created; its handlers decide where it goes. Each handler has its own level and filters, applied after the logger’s, so one logger can send everything to a file and only warnings to the console. handle() runs the filters and, under the handler’s lock, calls emit() — the one method a subclass must write.',

  covers: [
    'Handler', 'Handler.setLevel', 'Handler.setFormatter', 'Handler.format', 'Handler.emit', 'Handler.handle',
    'Handler.flush', 'Handler.close', 'Handler.name', 'Handler.get_name', 'Handler.set_name',
    'Handler.createLock', 'Handler.acquire', 'Handler.release', 'getHandlerByName', 'getHandlerNames',
  ],

  cheat: {
    commonCall: 'handler.setLevel(logging.WARNING); handler.setFormatter(fmt); log.addHandler(handler)',
    returns:    '<StreamHandler <stderr> (WARNING)> — class, stream, level',
    replaces:   'if level >= …: write(…) checks of your own',
    watchOut:   'a handler level cannot let through what the logger level blocks',
  },

  parameters: [
    { name: 'level',     type: 'int | str', required: false, default: 'NOTSET', desc: 'Records below this level are ignored by this handler. NOTSET (0) accepts everything that reaches it.' },
  ],

  attributes: [
    { name: 'level',     type: 'int',              meaning: 'Threshold set by the constructor or setLevel()' },
    { name: 'formatter', type: 'Formatter | None', meaning: 'Set with setFormatter(); None means the default %(message)s format' },
    { name: 'filters',   type: 'list',             meaning: 'Filters added with addFilter(); all must pass before emit()' },
    { name: 'name',      type: 'str | None',       meaning: 'Optional name (property over get_name/set_name), registered for getHandlerByName' },
    { name: 'lock',      type: 'threading.RLock',  meaning: 'Made by createLock(); handle() holds it around emit(). acquire()/release() take and drop it' },
  ],

  modes: [
    {
      id: 'levels',
      label: 'handler levels',
      blurb: 'The logger is at DEBUG and has two handlers, "console" and "file". Give each its own level.',
      params: [
        { name: 'console_level', type: 'int | str', hint: "e.g. 'WARNING'", input: 'auto' },
        { name: 'file_level',    type: 'int | str', hint: "e.g. 'DEBUG'",   input: 'auto' },
      ],
      template: "import io, logging\nlog = logging.getLogger('relay')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nconsole, logfile = io.StringIO(), io.StringIO()\nto_console = logging.StreamHandler(console)\nto_console.setLevel({$console_level})\nto_file = logging.StreamHandler(logfile)\nto_file.setLevel({$file_level})\nfor handler in (to_console, to_file):\n    handler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\n    log.addHandler(handler)\ntry:\n    log.debug('cache miss')\n    log.info('job started')\n    log.warning('disk %d%% full', 91)\n    log.error('job failed')\nfinally:\n    log.removeHandler(to_console)\n    log.removeHandler(to_file)\n{'console': console.getvalue().splitlines(), 'file': logfile.getvalue().splitlines()}",
      cases: [
        { id: 'usual',  label: 'WARNING / DEBUG', values: { console_level: 'WARNING', file_level: 'DEBUG' } },
        { id: 'swap',   label: 'INFO / ERROR',    values: { console_level: 'INFO', file_level: 'ERROR' } },
        { id: 'custom', label: '35 / NOTSET',     values: { console_level: '35', file_level: 'NOTSET' } },
        { id: 'bad',    label: "'warn'",          values: { console_level: 'warn', file_level: 'DEBUG' } },
      ],
    },
    {
      id: 'subclass',
      label: 'write a handler',
      blurb: 'ListHandler keeps formatted lines in a list: its emit() is one line. Choose the formatter and the second message.',
      params: [
        { name: 'fmt', type: 'str', hint: 'a %-style format', input: 'text' },
        { name: 'msg', type: 'str', hint: 'a message',        input: 'text' },
      ],
      template: "import logging\nclass ListHandler(logging.Handler):\n    def __init__(self):\n        super().__init__()\n        self.lines = []\n    def emit(self, record):\n        self.lines.append(self.format(record))\nlog = logging.getLogger('relay.memory')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = ListHandler()\nhandler.setFormatter(logging.Formatter({$fmt}))\nlog.addHandler(handler)\ntry:\n    log.info('order %s shipped', 1042)\n    log.warning({$msg})\nfinally:\n    log.removeHandler(handler)\nhandler.lines",
      cases: [
        { id: 'level', label: 'levelname',      values: { fmt: '%(levelname)s %(message)s', msg: 'low stock' } },
        { id: 'name',  label: 'logger name',    values: { fmt: '[%(name)s] %(message)s', msg: '100% sold' } },
        { id: 'brace', label: '{}-style',       values: { fmt: '{levelname}: {message}', msg: 'low stock' } },
        { id: 'field', label: 'unknown field',  values: { fmt: '%(user)s %(message)s', msg: 'low stock' } },
      ],
    },
  ],
  demoExplainer: "The logger creates all four records; each handler then compares a record's level with its own. With WARNING / DEBUG the console shows two lines and the file all four. A level of 35 has no name but works as a threshold, NOTSET lets everything through, and 'warn' (lowercase) is not a level name — setLevel raises ValueError: Unknown level: 'warn'. In the second tab a message without arguments is never %-formatted, so '100% sold' is safe. A '{'-style format is rejected by Formatter, which defaults to style='%'. An unknown field fails inside emit() — and because this emit() does not catch it, the ValueError reaches the logging call. StreamHandler catches it and calls handleError() instead.",

  patterns: [
    {
      name: 'A minimal custom handler',
      desc: 'Format, deliver, and route failures to handleError so logging never crashes the program.',
      code: "import logging\n\nclass ChatHandler(logging.Handler):\n    def __init__(self, client, channel, level=logging.WARNING):\n        super().__init__(level)\n        self.client, self.channel = client, channel\n\n    def emit(self, record):\n        try:\n            self.client.post(self.channel, self.format(record))\n        except Exception:\n            self.handleError(record)",
    },
    {
      name: 'Different levels per destination',
      desc: 'The logger lets everything through; each handler filters for itself.',
      code: "import logging, sys\nroot = logging.getLogger()\nroot.setLevel(logging.DEBUG)\nconsole = logging.StreamHandler(sys.stderr)\nconsole.setLevel(logging.WARNING)\nlogfile = logging.FileHandler('debug.log', encoding='utf-8')\nfor handler in (console, logfile):\n    root.addHandler(handler)",
    },
    {
      name: 'Find a configured handler by name',
      desc: 'dictConfig names each handler after its key; getHandlerByName is 3.12+.',
      code: "import logging\nconsole = logging.getHandlerByName('console')\nif console is not None:\n    console.setLevel(logging.DEBUG)",
    },
  ],

  examples: [
    { title: 'The base class cannot emit',     code: 'import logging\nlogging.Handler().emit(None)', returns: 'NotImplementedError: emit must be implemented by Handler subclasses' },
    { title: 'A fresh handler',                code: 'import logging\nh = logging.Handler()\n(h.level, h.formatter, h.filters, h.name)', returns: '(0, None, [], None)' },
    { title: 'repr: class and level',          code: 'import logging\nrepr(logging.Handler(logging.INFO))', returns: "'<Handler (INFO)>'" },
    { title: 'format() without a formatter',   code: "import logging\nh = logging.Handler()\nh.format(logging.makeLogRecord({'msg': 'disk %d%% full', 'args': (91,)}))", returns: "'disk 91% full'" },
    { title: 'Look a handler up by name (3.12+)', code: "import logging\nh = logging.NullHandler()\nh.name = 'relay-null'\nlogging.getHandlerByName('relay-null') is h", returns: 'True' },
    { title: 'getHandlerNames is a frozenset', code: "import logging\na = logging.NullHandler()\na.set_name('relay-a')\nb = logging.NullHandler()\nb.name = 'relay-b'\n(type(logging.getHandlerNames()).__name__, sorted(n for n in logging.getHandlerNames() if n.startswith('relay-')))", returns: "('frozenset', ['relay-a', 'relay-b'])" },
    { title: 'close() unregisters the name',   code: "import logging\nh = logging.NullHandler()\nh.name = 'relay-closed'\nh.close()\nlogging.getHandlerByName('relay-closed') is None", returns: 'True' },
    { title: 'The lock is reentrant',          code: "import logging\nh = logging.Handler()\nwith h.lock:\n    h.acquire()\n    h.release()\ntype(h.lock).__name__", returns: "'RLock'" },
  ],

  pitfalls: [
    {
      name: 'emit() that skips the formatter',
      desc: 'record.msg is the raw template: the arguments are not merged in and the handler’s formatter is ignored. Call self.format(record).',
      wrong: { label: 'record.msg', code: "import logging\nclass ListHandler(logging.Handler):\n    def __init__(self):\n        super().__init__()\n        self.lines = []\n    def emit(self, record):\n        self.lines.append(record.msg)\nlog = logging.getLogger('relay.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := ListHandler())\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.info('order %s shipped', 1042)\nlog.removeHandler(handler)\nhandler.lines", output: "['order %s shipped']" },
      fix:   { label: 'self.format(record)', code: "import logging\nclass ListHandler(logging.Handler):\n    def __init__(self):\n        super().__init__()\n        self.lines = []\n    def emit(self, record):\n        self.lines.append(self.format(record))\nlog = logging.getLogger('relay.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := ListHandler())\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.info('order %s shipped', 1042)\nlog.removeHandler(handler)\nhandler.lines", output: "['INFO order 1042 shipped']" },
    },
    {
      name: 'emit() that lets exceptions escape',
      desc: 'A bad format or a failing destination then crashes the code that only wanted to log. The built-in handlers catch exceptions in emit() (all but RecursionError) and call handleError(record), which reports on stderr and carries on.',
      wrong: { label: 'no try', code: "import logging\nclass ListHandler(logging.Handler):\n    def __init__(self):\n        super().__init__()\n        self.lines = []\n    def emit(self, record):\n        self.lines.append(self.format(record))\nlog = logging.getLogger('relay.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := ListHandler())\ntry:\n    log.info('%d items', 'three')\nfinally:\n    log.removeHandler(handler)", output: 'TypeError: %d format: a real number is required, not str' },
      fix:   { label: 'handleError', code: "import io, contextlib, logging\nclass ListHandler(logging.Handler):\n    def __init__(self):\n        super().__init__()\n        self.lines = []\n    def emit(self, record):\n        try:\n            self.lines.append(self.format(record))\n        except Exception:\n            self.handleError(record)\nlog = logging.getLogger('relay.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := ListHandler())\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.info('%d items', 'three')\n    log.info('%d items', 3)\nlog.removeHandler(handler)\n(handler.lines, err.getvalue().splitlines()[0])", output: "(['3 items'], '--- Logging error ---')" },
    },
    {
      name: 'Lowering only the handler level',
      desc: 'The logger level is checked first. With the logger still at the inherited WARNING, a DEBUG handler never sees a debug record. Lower the logger level too.',
      wrong: { label: 'handler at DEBUG', code: "import io, logging\nlog = logging.getLogger('courier')\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setLevel(logging.DEBUG)\nlog.addHandler(handler)\nlog.debug('details')\nlog.removeHandler(handler)\nstream.getvalue()", output: "''" },
      fix:   { label: 'logger at DEBUG too', code: "import io, logging\nlog = logging.getLogger('courier.fixed')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setLevel(logging.DEBUG)\nlog.addHandler(handler)\nlog.debug('details')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'details\\n'" },
    },
  ],

  when: {
    use: [
      'Writing a handler for a destination logging does not ship (a chat channel, a database, a GUI widget)',
      'Giving each destination its own level, format and filters',
      'getHandlerByName to reach handlers that dictConfig created',
    ],
    avoid: [
      'Console output → StreamHandler; files → FileHandler or logging.handlers.RotatingFileHandler',
      'Slow destinations in the logging thread → logging.handlers.QueueHandler + QueueListener',
    ],
  },

  notes: {
    cpython:       'Handler(Filterer) in Lib/logging/__init__.py. handle(): rv = self.filter(record); if rv: with self.lock: self.emit(record); return rv — so it returns the (possibly replaced) record, or False',
    'Names':       'name is a property over get_name/set_name; named handlers live in a WeakValueDictionary, so getHandlerByName (3.12+) finds them only while something references them, and close() removes the name',
    'Lifecycle':   'Every handler is also kept in a list of weak references that logging.shutdown() walks at exit to flush() and close() it',
    'Locking':     'createLock() makes a threading.RLock (NullHandler sets None); acquire()/release() wrap it for subclasses',
  },

  related: [
    { name: 'StreamHandler', slug: 'streamhandler', when: 'Console and any file-like stream' },
    { name: 'FileHandler', slug: 'filehandler', when: 'Write to a file' },
    { name: 'NullHandler', slug: 'nullhandler', when: 'The do-nothing handler for libraries' },
    { name: 'Handler.handleError', slug: 'handleerror', when: 'What a failing emit() should call' },
    { name: 'Formatter', slug: 'formatter', when: 'What setFormatter takes' },
    { name: 'Filter', slug: 'filter', when: 'addFilter on handlers' },
  ],

  faq: [
    {
      q: 'How do I write a custom logging handler in Python?',
      a: 'Subclass logging.Handler and implement emit(self, record): build the text with self.format(record), deliver it, and wrap both in try/except Exception calling self.handleError(record). Level, filters, formatter and locking are inherited.',
    },
    {
      q: 'What is the difference between logger.setLevel and handler.setLevel?',
      a: 'The logger level decides whether a record is created at all (checked once, on the logger you call). The handler level decides whether that particular handler outputs it. A record must pass both, so the logger must be at least as verbose as its most verbose handler.',
    },
    {
      q: 'How do I find a handler by name?',
      a: "Python 3.12+: logging.getHandlerByName('console') returns the handler with that name or None, and getHandlerNames() returns a frozenset of all names. Handlers get names from dictConfig (their key in 'handlers') or from handler.name = '…'.",
    },
    {
      q: 'Are logging handlers thread-safe?',
      a: 'Yes: Handler.handle() calls emit() while holding the handler’s reentrant lock, so lines from different threads do not interleave. For several processes writing one file, send records through a queue (QueueHandler) to a single process instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#handler-objects',
    meta:  'Handler Objects',
  },

};
