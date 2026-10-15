// content/reference/python/stdlib/logging/nullhandler.js

export const meta = {
  slug:        'nullhandler',
  name:        'logging.NullHandler',
  signature:   'logging.NullHandler(level=logging.NOTSET)',
  blurb:       'A handler that does nothing. Libraries attach one to their top-level logger so that, while the application has not configured logging, their warnings are not printed through logging.lastResort.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'logging NullHandler python library logging best practice NullHandler.handle NullHandler.emit NullHandler.createLock no-op handler silence library warnings addHandler(logging.NullHandler()) No handlers could be found for logger lastResort',
};

export const method = {
  slug:      'nullhandler',
  name:      'logging.NullHandler',
  signature: 'logging.NullHandler(level=logging.NOTSET)',
  returns:   { type: 'logging.NullHandler', desc: 'A handler whose handle() and emit() do nothing and whose lock is None.' },

  category:    'logging class',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'When a record finds no handler anywhere on its way up, logging prints it through logging.lastResort (WARNING and above, bare text on stderr). A NullHandler counts as a handler, so a library that adds one keeps quiet in unconfigured programs — and as soon as the application configures logging, records still propagate to its handlers.',

  covers: ['NullHandler', 'NullHandler.handle', 'NullHandler.emit', 'NullHandler.createLock'],

  cheat: {
    commonCall: 'logging.getLogger(__name__).addHandler(logging.NullHandler())',
    returns:    'None — the library logger now has a handler that ignores everything',
    replaces:   'basicConfig() or a StreamHandler inside a library',
    watchOut:   'it does not stop propagation to the application’s handlers',
  },

  parameters: [
    { name: 'level', type: 'int | str', required: false, default: 'NOTSET', desc: 'Accepted like any handler level, but irrelevant: handle() ignores levels and filters.' },
  ],

  modes: [
    {
      id: 'library',
      label: 'library logger',
      blurb: "The library logs on 'lib'. Choose whether it adds a NullHandler (1/0) and whether the application put a handler on the root logger (1/0).",
      params: [
        { name: 'null',       type: 'int', hint: '1 = library adds NullHandler', input: 'number' },
        { name: 'configured', type: 'int', hint: '1 = app has a root handler',   input: 'number' },
      ],
      template: "import io, contextlib, logging\nlib = logging.getLogger('lib')\nnull = logging.NullHandler()\napp_stream = io.StringIO()\napp_handler = logging.StreamHandler(app_stream)\nif {$null}:\n    lib.addHandler(null)\nif {$configured}:\n    logging.getLogger().addHandler(app_handler)\ntry:\n    with contextlib.redirect_stderr(io.StringIO()) as err:\n        lib.warning('cache directory missing')\n        lib.info('cache warmed')\nfinally:\n    lib.removeHandler(null)\n    logging.getLogger().removeHandler(app_handler)\n{'app handler': app_stream.getvalue(), 'stderr': err.getvalue()}",
      cases: [
        { id: 'bare',     label: 'no NullHandler, no config', values: { null: '0', configured: '0' } },
        { id: 'quiet',    label: 'NullHandler, no config',    values: { null: '1', configured: '0' } },
        { id: 'both',     label: 'NullHandler + app config',  values: { null: '1', configured: '1' } },
        { id: 'app',      label: 'app config only',           values: { null: '0', configured: '1' } },
      ],
    },
  ],
  demoExplainer: "Without any handler the warning ends up on stderr through lastResort. With the NullHandler, the record finds a handler (one that does nothing), so lastResort stays out of it and nothing is printed. Once the application adds a root handler, the record propagates to it whether or not the NullHandler is there. The info() line never appears: the logger’s effective level is the root logger’s WARNING.",

  patterns: [
    {
      name: 'In a library’s __init__.py',
      desc: 'The pattern the logging docs recommend for libraries — and nothing else.',
      code: "import logging\nlogging.getLogger(__name__).addHandler(logging.NullHandler())",
    },
    {
      name: 'Silencing a chatty dependency in an application',
      desc: 'Raise its level, or stop it from reaching your handlers.',
      code: "import logging\nlogging.getLogger('urllib3').setLevel(logging.WARNING)\nnoisy = logging.getLogger('some_library')\nnoisy.propagate = False\nnoisy.addHandler(logging.NullHandler())",
    },
  ],

  examples: [
    { title: 'handle() does nothing and returns None', code: "import logging\nlogging.NullHandler().handle(logging.makeLogRecord({'msg': 'x'})) is None", returns: 'True' },
    { title: 'Filters are not even consulted', code: "import logging\ncalls = []\nh = logging.NullHandler()\nh.addFilter(lambda record: calls.append(record) or True)\nh.handle(logging.makeLogRecord({'msg': 'x'}))\ncalls", returns: '[]' },
    { title: 'No lock is created',             code: 'import logging\nlogging.NullHandler().lock is None', returns: 'True' },
    { title: 'It counts for hasHandlers()',   code: "import logging\nlib = logging.getLogger('lib.has')\nlib.addHandler(null := logging.NullHandler())\nresult = lib.hasHandlers()\nlib.removeHandler(null)\nresult", returns: 'True' },
    { title: 'It keeps lastResort quiet',     code: "import io, contextlib, logging\nlog = logging.getLogger('lib.quiet')\nlog.addHandler(null := logging.NullHandler())\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.error('swallowed')\nlog.removeHandler(null)\nerr.getvalue()", returns: "''" },
    { title: 'repr',                          code: 'import logging\nrepr(logging.NullHandler())', returns: "'<NullHandler (NOTSET)>'" },
  ],

  pitfalls: [
    {
      name: 'A library that adds a real handler',
      desc: 'The application usually puts its own handler on the root logger. A StreamHandler added by the library prints every record a second time (and with a format the application did not choose). Libraries add a NullHandler and leave output to the application.',
      wrong: { label: 'StreamHandler in the library', code: "import io, logging\nout = io.StringIO()\nlib = logging.getLogger('lib.pit1')\nlib.addHandler(lib_handler := logging.StreamHandler(out))\nroot = logging.getLogger()\nroot.addHandler(app_handler := logging.StreamHandler(out))\ntry:\n    lib.warning('retrying')\nfinally:\n    lib.removeHandler(lib_handler)\n    root.removeHandler(app_handler)\nout.getvalue()", output: "'retrying\\nretrying\\n'" },
      fix:   { label: 'NullHandler', code: "import io, logging\nout = io.StringIO()\nlib = logging.getLogger('lib.pit1')\nlib.addHandler(lib_handler := logging.NullHandler())\nroot = logging.getLogger()\nroot.addHandler(app_handler := logging.StreamHandler(out))\ntry:\n    lib.warning('retrying')\nfinally:\n    lib.removeHandler(lib_handler)\n    root.removeHandler(app_handler)\nout.getvalue()", output: "'retrying\\n'" },
    },
    {
      name: 'Using NullHandler to mute a logger',
      desc: 'A NullHandler adds a handler; it does not remove the others. Records still propagate to the root handlers. To quieten a logger, raise its level (or set propagate = False).',
      wrong: { label: 'NullHandler only', code: "import io, logging\nout = io.StringIO()\nchatty = logging.getLogger('lib.chatty')\nchatty.addHandler(null := logging.NullHandler())\nroot = logging.getLogger()\nroot.addHandler(app_handler := logging.StreamHandler(out))\ntry:\n    chatty.warning('retrying')\nfinally:\n    chatty.removeHandler(null)\n    root.removeHandler(app_handler)\nout.getvalue()", output: "'retrying\\n'" },
      fix:   { label: 'setLevel(ERROR)', code: "import io, logging\nout = io.StringIO()\nchatty = logging.getLogger('lib.chatty2')\nchatty.setLevel(logging.ERROR)\nroot = logging.getLogger()\nroot.addHandler(app_handler := logging.StreamHandler(out))\ntry:\n    chatty.warning('retrying')\n    chatty.error('gave up')\nfinally:\n    root.removeHandler(app_handler)\nout.getvalue()", output: "'gave up\\n'" },
    },
  ],

  when: {
    use: [
      'The top-level logger of every library or reusable package',
      'A placeholder handler in configuration that must name one',
    ],
    avoid: [
      'Muting a logger in an application → setLevel, propagate = False, or logger.disabled',
      'Applications → configure real handlers (basicConfig, dictConfig)',
    ],
  },

  notes: {
    cpython:      'NullHandler(Handler) in Lib/logging/__init__.py overrides handle() and emit() with empty stubs and createLock() with self.lock = None — it never acquires a lock',
    'lastResort': 'Logger.callHandlers counts every handler it finds on the way up; only when the count is 0 does it use logging.lastResort',
    'Versions':   'Added in Python 3.1',
  },

  related: [
    { name: 'logging.lastResort', slug: 'lastresort', when: 'What NullHandler keeps from printing' },
    { name: 'logging.Handler', slug: 'handler', when: 'The base class' },
    { name: 'Logger.propagate', slug: 'propagate', when: 'Records still climb past a NullHandler' },
    { name: 'Logger.addHandler', slug: 'logger-addhandler', when: 'Attaching it' },
  ],

  faq: [
    {
      q: 'Why should a library add a NullHandler?',
      a: 'So that, in a program that has not configured logging, the library’s warnings are not printed on stderr through logging.lastResort. It changes nothing once the application configures logging: records still propagate to the application’s handlers. The library must not add other handlers or call basicConfig.',
    },
    {
      q: 'What does "No handlers could be found for logger" mean?',
      a: 'It is the message Python 2 printed for a record that found no handler. Python 3.2+ uses logging.lastResort instead and prints the record itself; you only see that message again if lastResort has been set to None.',
    },
    {
      q: 'Does NullHandler silence a logger?',
      a: 'No. It stops lastResort from printing records that found no handler, but propagation to the root logger’s handlers continues. Use logger.setLevel(...) or logger.propagate = False to keep a logger’s records out of your output.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.handlers.html#nullhandler',
    meta:  'NullHandler',
  },

};
