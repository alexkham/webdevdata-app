// content/reference/python/stdlib/logging/addlevelname.js

export const meta = {
  slug:        'addlevelname',
  name:        'logging.addLevelName',
  signature:   'logging.addLevelName(level, levelName)',
  blurb:       'Give a level number a name — a custom level like NOTICE = 25 or TRACE = 5, or a new label for a built-in one. Formatters print the name, and setLevel accepts it.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging addLevelName python custom log level add new logging level TRACE NOTICE VERBOSE SUCCESS level name rename WARNING to WARN Level 25 logger.trace method custom levels',
};

export const method = {
  slug:      'addlevelname',
  name:      'logging.addLevelName',
  signature: 'logging.addLevelName(level, levelName)',
  returns:   { type: 'None', desc: 'Registers the pair in both directions: getLevelName(level) → levelName and getLevelName(levelName) → level.' },

  category:    'logging function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "Levels are plain ints, so log.log(25, …) works without any registration — the record just prints as 'Level 25'. addLevelName stores the name in the module's two level tables, process-wide: records created afterwards carry it in %(levelname)s, and setLevel('NOTICE') and getLevelNamesMapping() know it. It does not create a log.notice() method.",

  covers: ['addLevelName'],

  cheat: {
    commonCall: "logging.addLevelName(25, 'NOTICE')",
    returns:    "None — then getLevelName(25) → 'NOTICE'",
    replaces:   "records that print as 'Level 25'",
    watchOut:   'no log.notice() method appears; the change is global',
  },

  parameters: [
    { name: 'level',     type: 'int', required: true, default: null, desc: 'The level number. Built-in levels are 10, 20, 30, 40, 50; a custom level goes between or below them (e.g. 5, 15, 25).' },
    { name: 'levelName', type: 'str', required: true, default: null, desc: 'The text shown in %(levelname)s and accepted by setLevel(). Case-sensitive. Registering an existing level number replaces its name.' },
  ],

  modes: [
    {
      id: 'register',
      label: 'register and log',
      blurb: "Register a level, then log once at that level and once at WARNING. The logger is at DEBUG (10). (patch.dict puts the level tables back afterwards, so the registration does not outlive the demo — in a program you would register once at startup.)",
      params: [
        { name: 'level', type: 'int', hint: 'a level number: 25, 5, 30 …', input: 'auto' },
        { name: 'name',  type: 'str', hint: 'its name',                    input: 'text' },
      ],
      template: "import io, logging\nfrom unittest import mock\nlog = logging.getLogger('alarms')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelno)s %(levelname)s: %(message)s'))\nlog.addHandler(handler)\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName({$level}, {$name})\n    try:\n        log.log({$level}, 'disk usage at %d%%', 91)\n        log.warning('backup is late')\n    finally:\n        log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'notice', label: "25 'NOTICE'", values: { level: '25', name: 'NOTICE' } },
        { id: 'trace',  label: "5 'TRACE'",   values: { level: '5', name: 'TRACE' } },
        { id: 'rename', label: "30 'WARN'",   values: { level: '30', name: 'WARN' } },
        { id: 'alert',  label: "45 'ALERT'",  values: { level: '45', name: 'ALERT' } },
        { id: 'str',    label: "'twenty-five'", values: { level: 'twenty-five', name: 'NOTICE' } },
      ],
    },
    {
      id: 'byname',
      label: 'setLevel by name',
      blurb: "NOTICE = 25 is registered. Pass a name to setLevel and see the level it resolves to, its name, and whether INFO is still enabled.",
      params: [{ name: 'name', type: 'str', hint: "'NOTICE', 'notice', 'INFO' …", input: 'text' }],
      template: "import logging\nfrom unittest import mock\nlog = logging.getLogger('alarms.names')\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(25, 'NOTICE')\n    log.setLevel({$name})\n    result = (log.level, logging.getLevelName(log.level), log.isEnabledFor(logging.INFO))\nresult",
      cases: [
        { id: 'notice', label: "'NOTICE'",   values: { name: 'NOTICE' } },
        { id: 'lower',  label: "'notice'",   values: { name: 'notice' } },
        { id: 'info',   label: "'INFO'",     values: { name: 'INFO' } },
        { id: 'level',  label: "'Level 25'", values: { name: 'Level 25' } },
      ],
    },
  ],
  demoExplainer: "The level number does the filtering and the name is only a label: 25 sits between INFO and WARNING and passes the DEBUG logger, while TRACE = 5 is below DEBUG (10), so that record is never created — only the warning appears. Registering 30 as 'WARN' relabels the built-in WARNING, so both lines say WARN. addLevelName itself accepts any dict key, even a str, but log.log() insists on an int: TypeError: level must be an integer. In the second tab setLevel looks names up exactly as registered: 'notice' and 'Level 25' raise ValueError: Unknown level, and once the logger is at NOTICE (25), INFO (20) is no longer enabled.",

  patterns: [
    {
      name: 'A custom level as a module constant',
      desc: 'Register once, at import time of the application, and log with log.log(LEVEL, …).',
      code: "import logging\nNOTICE = 25\nlogging.addLevelName(NOTICE, 'NOTICE')\nlog = logging.getLogger(__name__)\nlog.log(NOTICE, 'configuration reloaded from %s', path)",
    },
    {
      name: 'A convenience method on a Logger subclass',
      desc: 'addLevelName adds no method; a subclass installed with setLoggerClass can.',
      code: "import logging\nTRACE = 5\nlogging.addLevelName(TRACE, 'TRACE')\n\nclass TraceLogger(logging.Logger):\n    def trace(self, msg, *args, **kwargs):\n        if self.isEnabledFor(TRACE):\n            self._log(TRACE, msg, args, **kwargs)\n\nlogging.setLoggerClass(TraceLogger)",
    },
    {
      name: 'Shorter labels for aligned output',
      desc: 'Rename the built-in levels; the numbers and their meaning stay the same.',
      code: "import logging\nfor level, name in [(logging.DEBUG, 'DBG'), (logging.INFO, 'INF'), (logging.WARNING, 'WRN'),\n                    (logging.ERROR, 'ERR'), (logging.CRITICAL, 'CRT')]:\n    logging.addLevelName(level, name)",
    },
  ],

  examples: [
    { title: 'Register, then look up both ways', code: "import logging\nfrom unittest import mock\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(25, 'NOTICE')\n    result = (logging.getLevelName(25), logging.getLevelName('NOTICE'))\nresult", returns: "('NOTICE', 25)" },
    { title: "Without a name a level prints as 'Level N'", code: "import logging\nrecord = logging.LogRecord('app', 25, 'app.py', 7, 'cache rebuilt', None, None)\nrecord.levelname", returns: "'Level 25'" },
    { title: 'Records created afterwards carry the name', code: "import logging\nfrom unittest import mock\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(25, 'NOTICE')\n    record = logging.LogRecord('app', 25, 'app.py', 7, 'cache rebuilt', None, None)\nlogging.Formatter('%(levelname)s %(message)s').format(record)", returns: "'NOTICE cache rebuilt'" },
    { title: 'Relabel a built-in level', code: "import logging\nfrom unittest import mock\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(logging.WARNING, 'WARN')\n    result = logging.getLevelName(30)\nresult", returns: "'WARN'" },
    { title: 'getLevelNamesMapping includes it', code: "import logging\nfrom unittest import mock\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(5, 'TRACE')\n    result = logging.getLevelNamesMapping()['TRACE']\nresult", returns: '5' },
    { title: 'Unknown names are rejected by setLevel', code: "import logging\nlogging.getLogger('alarms.ex6').setLevel('NOTICE')", returns: "ValueError: Unknown level: 'NOTICE'" },
  ],

  pitfalls: [
    {
      name: 'Expecting a log.notice() method',
      desc: 'addLevelName only names a number. Logger methods exist for the five built-in levels; for a custom one call log.log(level, …) — or add a method in a Logger subclass (see the pattern above).',
      wrong: { label: 'log.notice()', code: "import logging\nfrom unittest import mock\nNOTICE = 25\nlog = logging.getLogger('alarms.pit1')\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(NOTICE, 'NOTICE')\n    log.notice('cache rebuilt')", output: "AttributeError: 'Logger' object has no attribute 'notice'" },
      fix:   { label: 'log.log(NOTICE, …)', code: "import logging, sys\nfrom unittest import mock\nNOTICE = 25\nlog = logging.getLogger('alarms.pit1fix')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(NOTICE, 'NOTICE')\n    log.log(NOTICE, 'cache rebuilt')\nlog.removeHandler(handler)", output: 'NOTICE cache rebuilt' },
    },
    {
      name: 'A TRACE level below the logger level',
      desc: 'A name changes nothing about filtering. TRACE = 5 is below DEBUG (10), so a logger at DEBUG drops it before a record exists. Lower the logger (and handler) level to TRACE.',
      wrong: { label: 'logger at DEBUG', code: "import io, logging\nfrom unittest import mock\nTRACE = 5\nlog = logging.getLogger('alarms.pit2')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(TRACE, 'TRACE')\n    log.log(TRACE, 'entering parse()')\nlog.removeHandler(handler)\nstream.getvalue()", output: "''" },
      fix:   { label: 'logger at TRACE', code: "import io, logging\nfrom unittest import mock\nTRACE = 5\nlog = logging.getLogger('alarms.pit2fix')\nlog.setLevel(TRACE)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nwith mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):\n    logging.addLevelName(TRACE, 'TRACE')\n    log.log(TRACE, 'entering parse()')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'entering parse()\\n'" },
    },
  ],

  when: {
    use: [
      'An application that needs a level between the built-in ones (NOTICE, AUDIT) or below DEBUG (TRACE)',
      'Relabelling the built-in levels for compact or localized output',
      'Configuration that names a custom level: setLevel and dictConfig accept it once registered',
    ],
    avoid: [
      'Library code → custom levels clash with the application\'s and with other libraries (the docs advise against it)',
      'Marking a category of messages → a separate logger name, or extra= fields, filter better than a level',
    ],
  },

  notes: {
    cpython:     'with _lock: _levelToName[level] = levelName; _nameToLevel[levelName] = level — two plain dicts in Lib/logging/__init__.py; there is no function to unregister',
    'Scope':     'Process-wide: every logger, handler and formatter sees the new name, including in libraries',
    'Ordering':  'The docs ask for positive integers that increase with severity, so threshold comparisons keep working',
    'Timing':    'record.levelname is computed when the LogRecord is created, so records made before the call keep the old text',
  },

  related: [
    { name: 'logging.getLevelName', slug: 'getlevelname', when: 'Look names and numbers up' },
    { name: 'logging levels', slug: 'levels', when: 'The built-in constants' },
    { name: 'Logger.log', slug: 'logger-info', when: 'Log at any numeric level' },
    { name: 'logging.setLoggerClass', slug: 'setloggerclass', when: 'Add a method for the new level' },
    { name: 'Logger.setLevel', slug: 'logger-setlevel', when: 'Accepts the registered name' },
  ],

  faq: [
    {
      q: 'How do I add a custom log level like TRACE in Python?',
      a: "Pick a number (TRACE = 5 sits below DEBUG), register it with logging.addLevelName(TRACE, 'TRACE') and log with log.log(TRACE, 'message'). Set the logger and handler levels to TRACE or lower, or the records are filtered out. For a log.trace() method, subclass Logger and install it with logging.setLoggerClass.",
    },
    {
      q: 'Why does my log show "Level 25"?',
      a: "A record at a level number with no registered name gets the text 'Level 25' in %(levelname)s. Call logging.addLevelName(25, 'NOTICE') before logging, or use one of the built-in levels.",
    },
    {
      q: 'Can I rename WARNING to WARN in log output?',
      a: "Yes: logging.addLevelName(logging.WARNING, 'WARN'). The number stays 30, so filtering is unchanged; only %(levelname)s and getLevelName(30) show the new text. The old name still maps to 30 in getLevelNamesMapping, so setLevel('WARNING') keeps working.",
    },
    {
      q: 'Does addLevelName add a method to the logger?',
      a: "No. It only fills the name tables; log.notice() raises AttributeError: 'Logger' object has no attribute 'notice'. Use log.log(NOTICE, …), or define the method in a Logger subclass.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.addLevelName',
    meta:  'logging.addLevelName',
  },

};
