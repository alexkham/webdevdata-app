// content/reference/python/stdlib/logging/lastresort.js

export const meta = {
  slug:        'lastresort',
  name:        'logging.lastResort',
  signature:   'logging.lastResort',
  blurb:       'The handler of last resort: when a record finds no handler at all, logging hands it to this stderr handler at level WARNING. That is why warnings print, unformatted, in programs that never configured logging.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'logging lastResort python logging prints without basicConfig warning printed without format no handlers configured _StderrHandler logging output to stderr by default why does logging.warning print debug not printed No handlers could be found for logger',
};

export const method = {
  slug:      'lastresort',
  name:      'logging.lastResort',
  signature: 'logging.lastResort  # a _StderrHandler(WARNING)',
  returns:   { type: 'logging.Handler | None', desc: 'A handler that writes the bare message to the current sys.stderr. Assign None to switch the fallback off.' },

  category:    'logging constant',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Logger.callHandlers walks up the logger tree counting handlers. If it found none — no configuration anywhere, or propagate = False on a logger without handlers — the record goes to logging.lastResort: level WARNING, format "%(message)s", written to whatever sys.stderr is at that moment. It is a safety net, not a configuration.',

  covers: ['lastResort'],

  cheat: {
    commonCall: 'logging.lastResort',
    returns:    '<_StderrHandler <stderr> (WARNING)>',
    replaces:   "Python 2's 'No handlers could be found for logger' message",
    watchOut:   'it ignores your logger level: DEBUG records still stop at its WARNING',
  },

  attributes: [
    { name: 'level',     type: 'int',          meaning: 'WARNING (30); records below it are dropped' },
    { name: 'formatter', type: 'None',         meaning: 'None, so the default %(message)s format: no level, no name, no time' },
    { name: 'stream',    type: 'property',     meaning: 'Always the current sys.stderr (looked up on every record)' },
  ],

  modes: [
    {
      id: 'level',
      label: 'its level',
      blurb: "Logger 'orphan' is at DEBUG but has no handler. Four calls; set the level of lastResort and see which reach stderr.",
      params: [{ name: 'level', type: 'int | str', hint: "'WARNING' is the default", input: 'auto' }],
      template: "import io, contextlib, logging\nlog = logging.getLogger('orphan')\nlog.setLevel(logging.DEBUG)\nsaved = logging.lastResort.level\ntry:\n    logging.lastResort.setLevel({$level})\n    with contextlib.redirect_stderr(io.StringIO()) as err:\n        log.debug('debug line')\n        log.info('info line')\n        log.warning('warning line')\n        log.error('error line')\nfinally:\n    logging.lastResort.setLevel(saved)\nerr.getvalue().splitlines()",
      cases: [
        { id: 'default', label: "'WARNING'", values: { level: 'WARNING' } },
        { id: 'debug',   label: "'DEBUG'",   values: { level: 'DEBUG' } },
        { id: 'error',   label: "'ERROR'",   values: { level: 'ERROR' } },
        { id: 'off',     label: '60',        values: { level: '60' } },
      ],
    },
  ],
  demoExplainer: 'The logger creates all four records (its own level is DEBUG), but with no handler in the tree each one is offered to lastResort, which applies its own level. At the default WARNING only the warning and the error are printed — as bare messages, because lastResort has no formatter. Above CRITICAL (60) nothing gets through.',

  patterns: [
    {
      name: 'Replace the safety net with a real configuration',
      desc: 'Once the root logger has a handler, lastResort is never used.',
      code: "import logging\nlogging.basicConfig(level=logging.INFO, format='%(levelname)s %(name)s: %(message)s')",
    },
    {
      name: 'Show everything while experimenting',
      desc: 'Quick and global; prefer basicConfig in real code.',
      code: 'import logging\nlogging.lastResort.setLevel(logging.DEBUG)',
    },
  ],

  examples: [
    { title: 'A private stderr handler class', code: 'import logging\ntype(logging.lastResort).__name__', returns: "'_StderrHandler'" },
    { title: 'Its level is WARNING',           code: 'import logging\nlogging.getLevelName(logging.lastResort.level)', returns: "'WARNING'" },
    { title: 'Bare message, no level or name', code: "import io, contextlib, logging\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    logging.getLogger('orphan.bare').warning('disk %d%% full', 91)\nerr.getvalue()", returns: "'disk 91% full\\n'" },
    { title: 'It follows sys.stderr',          code: 'import io, sys, contextlib, logging\nwith contextlib.redirect_stderr(io.StringIO()) as buf:\n    same = logging.lastResort.stream is sys.stderr is buf\nsame', returns: 'True' },
    { title: 'Tracebacks are included',        code: "import io, contextlib, logging\nlog = logging.getLogger('orphan.exc')\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    try:\n        1 / 0\n    except ZeroDivisionError:\n        log.exception('failed')\n[line for line in err.getvalue().splitlines() if not line.startswith(' ')]", returns: "['failed', 'Traceback (most recent call last):', 'ZeroDivisionError: division by zero']" },
    { title: 'Any handler, even a NullHandler, disables it', code: "import io, contextlib, logging\nlog = logging.getLogger('orphan.null')\nlog.addHandler(null := logging.NullHandler())\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.error('swallowed')\nlog.removeHandler(null)\nerr.getvalue()", returns: "''" },
  ],

  pitfalls: [
    {
      name: 'Setting the logger to DEBUG without adding a handler',
      desc: 'The logger now creates debug records, but with no handler they go to lastResort, which only prints WARNING and above. Add a handler (or call basicConfig with level=DEBUG).',
      wrong: { label: 'level only', code: "import io, contextlib, logging\nlog = logging.getLogger('orphan.pit1')\nlog.setLevel(logging.DEBUG)\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.debug('connecting to %s', 'db1')\nerr.getvalue()", output: "''" },
      fix:   { label: 'level + handler', code: "import io, logging\nlog = logging.getLogger('orphan.pit1b')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nlog.debug('connecting to %s', 'db1')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'connecting to db1\\n'" },
    },
    {
      name: 'Mistaking lastResort output for a configured log',
      desc: 'Warnings appear, so logging looks set up — but there is no level name, no logger name, no time, and info() is silently dropped. Configure a handler with a format.',
      wrong: { label: 'nothing configured', code: "import io, contextlib, logging\nlog = logging.getLogger('orphan.pit2')\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.info('job started')\n    log.warning('job slow')\nerr.getvalue()", output: "'job slow\\n'" },
      fix:   { label: 'own handler + format', code: "import io, logging\nlog = logging.getLogger('orphan.pit2b')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(name)s: %(message)s'))\nlog.addHandler(handler)\nlog.info('job started')\nlog.warning('job slow')\nlog.removeHandler(handler)\nstream.getvalue().splitlines()", output: "['INFO orphan.pit2b: job started', 'WARNING orphan.pit2b: job slow']" },
    },
  ],

  when: {
    use: [
      'Knowing why unconfigured programs print warnings and errors',
      'Temporarily lowering its level while exploring',
    ],
    avoid: [
      'As the logging setup of a program → basicConfig or dictConfig',
      'Hiding library output by setting it to None → a NullHandler on the library logger, or a level',
    ],
  },

  notes: {
    cpython:     "lastResort = _defaultLastResort = _StderrHandler(WARNING) in Lib/logging/__init__.py; _StderrHandler's stream property returns sys.stderr",
    'When used': 'Logger.callHandlers: if no handler was found walking up the tree (found == 0), the record goes to lastResort when record.levelno >= lastResort.level',
    'Set to None': 'Then a record with no handler makes logging print \'No handlers could be found for logger "NAME"\' to stderr — once per process — and is otherwise lost',
  },

  related: [
    { name: 'logging.NullHandler', slug: 'nullhandler', when: 'Keeps a library out of lastResort' },
    { name: 'Logger.propagate', slug: 'propagate', when: 'propagate = False without handlers leads here' },
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'A real configuration' },
    { name: 'StreamHandler', slug: 'streamhandler', when: 'Its parent class' },
    { name: 'logging levels', slug: 'levels', when: 'Why WARNING is the cut-off' },
  ],

  faq: [
    {
      q: 'Why does logging.warning print even though I never configured logging?',
      a: "logging.warning() on the root logger calls basicConfig() for you. A named logger's warning is printed by logging.lastResort, the fallback for records that find no handler: WARNING and above, bare text on stderr.",
    },
    {
      q: 'Why does my debug or info message not print without configuration?',
      a: 'Two gates stop it: the logger’s effective level is the root’s WARNING, and even with setLevel(DEBUG) the fallback handler lastResort only prints WARNING and above. Add a handler, or call logging.basicConfig(level=logging.DEBUG).',
    },
    {
      q: 'Can I turn off the last-resort handler?',
      a: "Yes: logging.lastResort = None. Records without a handler are then dropped, after a single 'No handlers could be found for logger \"NAME\"' line on stderr. Usually it is better to give the logger a handler or a NullHandler.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.lastResort',
    meta:  'logging.lastResort',
  },

};
