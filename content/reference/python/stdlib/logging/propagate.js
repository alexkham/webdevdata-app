// content/reference/python/stdlib/logging/propagate.js

export const meta = {
  slug:        'propagate',
  name:        'Logger.propagate',
  signature:   'Logger.propagate = True',
  blurb:       "Whether a logger passes its records on to its ancestors' handlers after its own — and Logger.handle / callHandlers, the methods that do the walk.",
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'Logger.propagate Logger.handle Logger.callHandlers logger propagate false python propagation parent logger handlers duplicate messages child logger records climb hierarchy parent level not checked',
};

export const method = {
  slug:      'propagate',
  name:      'Logger.propagate',
  signature: 'Logger.propagate = True  ·  Logger.handle(record)  ·  Logger.callHandlers(record)',
  returns:   { type: 'bool', desc: 'propagate defaults to True. handle() and callHandlers() return None.' },

  category:    'logging.Logger attribute',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "A record is created once, by the logger you call, after checking that logger's effective level. callHandlers then offers it to that logger's handlers and, while propagate is true, to each ancestor's handlers in turn. The ancestors' own levels and filters are never consulted on the way — only their handlers' levels.",

  covers: ['Logger.handle', 'Logger.callHandlers'],

  cheat: {
    commonCall: "logging.getLogger('app.audit').propagate = False",
    returns:    "the 'app.audit' records stop at its own handlers",
    replaces:   'filtering duplicates out of the root handler',
    watchOut:   "a parent logger's level does not filter its children's records",
  },

  parameters: [
    { name: 'record', type: 'logging.LogRecord', required: true, default: null, desc: 'handle / callHandlers: the record to dispatch. handle() applies the logger\'s filters (and disabled) first; callHandlers() does not.' },
  ],

  modes: [
    {
      id: 'climb',
      label: 'which handlers fire',
      blurb: "'app' and 'app.db' have one handler each; 'app.db' propagates. Set the level of 'app', of its handler, and of the record logged on 'app.db' (a DEBUG logger).",
      params: [
        { name: 'app_level',     type: 'int | str', hint: "level of logger 'app'",  input: 'auto' },
        { name: 'handler_level', type: 'int | str', hint: "level of app's handler", input: 'auto' },
        { name: 'level',         type: 'int',       hint: 'level of the record',    input: 'auto' },
      ],
      template: "import io, logging\napp = logging.getLogger('app')\ndb = logging.getLogger('app.db')\napp.setLevel({$app_level})\napp.propagate = False\ndb.setLevel(logging.DEBUG)\nstream = io.StringIO()\napp_handler = logging.StreamHandler(stream)\napp_handler.setLevel({$handler_level})\napp_handler.setFormatter(logging.Formatter('app handler: %(levelname)s %(message)s'))\ndb_handler = logging.StreamHandler(stream)\ndb_handler.setFormatter(logging.Formatter('db handler:  %(levelname)s %(message)s'))\napp.addHandler(app_handler)\ndb.addHandler(db_handler)\ntry:\n    db.log({$level}, 'query took %d ms', 870)\nfinally:\n    app.removeHandler(app_handler)\n    db.removeHandler(db_handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'parent',  label: 'app ERROR, record DEBUG', values: { app_level: 'ERROR', handler_level: 'NOTSET', level: '10' } },
        { id: 'handler', label: 'handler WARNING',         values: { app_level: 'NOTSET', handler_level: 'WARNING', level: '20' } },
        { id: 'both',    label: 'record WARNING',          values: { app_level: 'NOTSET', handler_level: 'WARNING', level: '30' } },
        { id: 'below',   label: 'record 5',                values: { app_level: 'DEBUG', handler_level: 'NOTSET', level: '5' } },
      ],
    },
    {
      id: 'stop',
      label: 'propagate = False',
      blurb: "'app' and 'app.audit' have handlers; 'app.audit' sets propagate = False. Log an INFO line from any logger.",
      params: [{ name: 'name', type: 'str', hint: 'the logger to log from', input: 'text' }],
      template: "import io, logging\napp = logging.getLogger('app')\napp.setLevel(logging.INFO)\napp.propagate = False\naudit = logging.getLogger('app.audit')\naudit.setLevel(logging.NOTSET)\naudit.propagate = False\nstream = io.StringIO()\nhandlers = {}\nfor logger in (app, audit):\n    handlers[logger] = logging.StreamHandler(stream)\n    handlers[logger].setFormatter(logging.Formatter(logger.name + ' handler <- %(name)s'))\n    logger.addHandler(handlers[logger])\ntry:\n    logging.getLogger({$name}).info('event')\nfinally:\n    for logger, handler in handlers.items():\n        logger.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'child',  label: 'app.cache',        values: { name: 'app.cache' } },
        { id: 'audit',  label: 'app.audit',        values: { name: 'app.audit' } },
        { id: 'deeper', label: 'app.audit.login',  values: { name: 'app.audit.login' } },
        { id: 'app',    label: 'app',              values: { name: 'app' } },
        { id: 'web',    label: 'web',              values: { name: 'web' } },
      ],
    },
  ],
  demoExplainer: "With 'app' at ERROR, a DEBUG record from 'app.db' still reaches the app handler: the parent logger's level is not checked during propagation, only the handler's. A handler at WARNING drops the INFO record but takes the WARNING one. A record below the DEBUG level of 'app.db' is never created, so no handler sees it. In the second tab, records climb until a logger with propagate = False: 'app.audit.login' is handled by the audit handler and stops there. 'web' is not under 'app' and its effective level is the root's WARNING, so info() does nothing.",

  patterns: [
    {
      name: 'Handlers only on the root',
      desc: 'Named loggers keep propagate=True and no handlers; one place decides the output.',
      code: "import logging\nlogging.basicConfig(level=logging.INFO, format='%(levelname)s %(name)s: %(message)s')\nlogging.getLogger('app.db').info('connected')  # printed once, by the root handler",
    },
    {
      name: 'A separate audit trail',
      desc: 'Its own file handler, and propagate=False so the audit lines stay out of the main log.',
      code: "import logging\naudit = logging.getLogger('app.audit')\naudit.addHandler(logging.FileHandler('audit.log', encoding='utf-8'))\naudit.propagate = False",
    },
    {
      name: 'Hand a record to the logging tree yourself',
      desc: 'Records received from another process (e.g. over a socket) are passed to handle().',
      code: "import logging\nrecord = logging.makeLogRecord(data)   # data: the record's __dict__\nlogging.getLogger(record.name).handle(record)",
    },
  ],

  examples: [
    { title: 'propagate is True by default',     code: "import logging\nlogging.getLogger('app.ex1').propagate", returns: 'True' },
    { title: 'Child records reach the parent handler', code: "import io, logging\nparent = logging.getLogger('etl')\nparent.setLevel(logging.INFO)\nparent.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(name)s: %(message)s'))\nparent.addHandler(handler)\nlogging.getLogger('etl.extract').info('42 rows read')\nparent.removeHandler(handler)\nstream.getvalue()", returns: "'etl.extract: 42 rows read\\n'" },
    { title: "The parent's filters are skipped too", code: "import io, logging\nparent = logging.getLogger('etl2')\nparent.setLevel(logging.INFO)\nparent.propagate = False\nparent.addFilter(lambda record: False)\nstream = io.StringIO()\nparent.addHandler(handler := logging.StreamHandler(stream))\nparent.info('from the parent')\nlogging.getLogger('etl2.load').info('from the child')\nparent.removeHandler(handler)\nparent.filters.clear()\nstream.getvalue()", returns: "'from the child\\n'" },
    { title: 'handle() runs the logger filters first', code: "import io, logging\nlog = logging.getLogger('etl3')\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nlog.addFilter(lambda record: 'secret' not in record.msg)\nfor msg in ('ok', 'secret token'):\n    log.handle(logging.makeLogRecord({'name': 'etl3', 'msg': msg, 'levelno': 20}))\nlog.removeHandler(handler)\nlog.filters.clear()\nstream.getvalue()", returns: "'ok\\n'" },
    { title: 'handle() does not check the level',  code: "import io, logging\nlog = logging.getLogger('etl4')\nlog.setLevel(logging.ERROR)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nlog.handle(logging.makeLogRecord({'msg': 'a DEBUG record', 'levelno': 10}))\nlog.removeHandler(handler)\nstream.getvalue()", returns: "'a DEBUG record\\n'" },
    { title: 'callHandlers with no handler anywhere uses lastResort', code: "import io, contextlib, logging\nerr = io.StringIO()\nwith contextlib.redirect_stderr(err):\n    logging.getLogger('orphan.ex6').callHandlers(logging.makeLogRecord({'msg': 'nobody listens', 'levelno': 40}))\nerr.getvalue()", returns: "'nobody listens\\n'" },
  ],

  pitfalls: [
    {
      name: 'Raising the parent level to quiet a child',
      desc: "The parent's level only matters to records logged on the parent itself (and to children that inherit it as their effective level). A child with its own level still sends its records to the parent's handlers. Raise the child's level or the handler's level.",
      wrong: { label: 'parent at ERROR', code: "import io, logging\nparent = logging.getLogger('crawler')\nparent.setLevel(logging.ERROR)\nparent.propagate = False\nstream = io.StringIO()\nparent.addHandler(handler := logging.StreamHandler(stream))\nchild = logging.getLogger('crawler.fetch')\nchild.setLevel(logging.DEBUG)\nchild.debug('GET /robots.txt')\nparent.removeHandler(handler)\nstream.getvalue()", output: "'GET /robots.txt\\n'" },
      fix:   { label: 'handler at ERROR', code: "import io, logging\nparent = logging.getLogger('crawler')\nparent.setLevel(logging.ERROR)\nparent.propagate = False\nstream = io.StringIO()\nparent.addHandler(handler := logging.StreamHandler(stream))\nhandler.setLevel(logging.ERROR)\nchild = logging.getLogger('crawler.fetch')\nchild.setLevel(logging.DEBUG)\nchild.debug('GET /robots.txt')\nparent.removeHandler(handler)\nstream.getvalue()", output: "''" },
    },
    {
      name: 'propagate = False on a logger without handlers',
      desc: "The record never reaches the root handler you configured. Finding no handler at all, logging falls back to lastResort: bare text on stderr, WARNING and above only — your format, file and levels are bypassed. Only switch propagation off where you attach a handler.",
      wrong: { label: 'stopped too early', code: "import io, contextlib, logging\nroot = logging.getLogger()\nstream, err = io.StringIO(), io.StringIO()\nroot.addHandler(handler := logging.StreamHandler(stream))\nhandler.setFormatter(logging.Formatter('%(levelname)s %(name)s: %(message)s'))\nworker = logging.getLogger('queue.worker')\nworker.propagate = False\ntry:\n    with contextlib.redirect_stderr(err):\n        worker.warning('job failed')\nfinally:\n    root.removeHandler(handler)\n(stream.getvalue(), err.getvalue())", output: "('', 'job failed\\n')" },
      fix:   { label: 'keep propagating', code: "import io, contextlib, logging\nroot = logging.getLogger()\nstream, err = io.StringIO(), io.StringIO()\nroot.addHandler(handler := logging.StreamHandler(stream))\nhandler.setFormatter(logging.Formatter('%(levelname)s %(name)s: %(message)s'))\nworker = logging.getLogger('queue.worker')\nworker.propagate = True\ntry:\n    with contextlib.redirect_stderr(err):\n        worker.warning('job failed')\nfinally:\n    root.removeHandler(handler)\n(stream.getvalue(), err.getvalue())", output: "('WARNING queue.worker: job failed\\n', '')" },
    },
  ],

  when: {
    use: [
      'propagate = False on a logger that has its own handler and should not also appear in the main log',
      'handle() to inject records built elsewhere (sockets, queues, tests)',
    ],
    avoid: [
      'Quieting a subsystem → set its level, not the parent’s',
      'Calling callHandlers directly → handle() also applies the logger filters and the disabled flag',
    ],
  },

  notes: {
    cpython:    'Logger.handle: return if disabled; run the filters (a filter may return a replacement record, 3.12+); then callHandlers. callHandlers walks c = self, c.parent … calling every handler whose level <= record.levelno, and stops after a logger with propagate false; if it found no handler at all it uses lastResort',
    'Levels':   'Only the logger that creates the record checks its effective level (isEnabledFor); handlers check their own level',
    'Filters':  'Logger filters run in handle() of the originating logger only; handler filters run for every handler',
  },

  related: [
    { name: 'Logger.addHandler', slug: 'logger-addhandler', when: 'Attach the handlers records propagate to' },
    { name: 'Logger.setLevel', slug: 'logger-setlevel', when: 'The level checked when the record is created' },
    { name: 'Filter', slug: 'filter', when: 'Logger filters vs handler filters' },
    { name: 'logging.lastResort', slug: 'lastresort', when: 'What callHandlers uses when no handler is found' },
    { name: 'logging.getLogger', slug: 'getlogger', when: 'The dotted-name tree records climb' },
  ],

  faq: [
    {
      q: 'What does logger.propagate = False do?',
      a: "The logger still handles its records with its own handlers, but no longer passes them to its parent's (and the root logger's) handlers. Its children stop there too, because their records climb through it.",
    },
    {
      q: 'Why do I see my log messages twice?',
      a: 'A handler on the logger and another on an ancestor (often the root, added by basicConfig) both receive the record. Remove one of them, or set propagate = False on the logger that has its own handler.',
    },
    {
      q: 'Does the parent logger\'s level filter propagated records?',
      a: "No. The level is checked once, against the effective level of the logger you called. After that only handler levels and handler filters apply, which is why setting a parent logger to ERROR does not hide a DEBUG-level child's records from the parent's handlers.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Logger.propagate',
    meta:  'Logger.propagate',
  },

};
