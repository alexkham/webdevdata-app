// content/reference/python/stdlib/logging/disable.js

export const meta = {
  slug:        'disable',
  name:        'logging.disable',
  signature:   'logging.disable(level=CRITICAL)',
  blurb:       'Switch off every logging call at or below a level, in every logger of the process, regardless of their own levels — and switch it back on with logging.disable(logging.NOTSET).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+ (default level 3.7)',
  searchTerms: 'logging disable python turn off logging temporarily silence all loggers disable logging in tests logging.disable(logging.CRITICAL) logging.disable(logging.NOTSET) re-enable logging suppress log output manager.disable logger.disabled',
};

export const method = {
  slug:      'disable',
  name:      'logging.disable',
  signature: 'logging.disable(level=CRITICAL)',
  returns:   { type: 'None', desc: 'Sets the process-wide ceiling (logging.root.manager.disable) and clears every logger\'s isEnabledFor cache.' },

  category:    'logging function',
  version:     'Python 2.3+ (default level 3.7)',
  hasLiveDemo: true,

  subtitle: "A ceiling over all loggers: after logging.disable(logging.INFO), every debug() and info() call anywhere is discarded before a record is made, while warning() and above are judged by the logger's own effective level as usual. With no argument it disables everything up to CRITICAL. It stays in force until logging.disable(logging.NOTSET).",

  covers: ['disable'],

  cheat: {
    commonCall: 'logging.disable(logging.CRITICAL)',
    returns:    'None — all logging calls up to CRITICAL are now ignored',
    replaces:   'setting every logger and handler level by hand',
    watchOut:   'the level itself is disabled too; undo with disable(logging.NOTSET)',
  },

  parameters: [
    { name: 'level', type: 'int | str', required: false, default: 'CRITICAL', desc: "Calls of this severity and below are ignored. A level name ('INFO') works too; an unknown name raises ValueError: Unknown level. NOTSET (0) removes the ceiling. Defaulted to CRITICAL since 3.7." },
  ],

  modes: [
    {
      id: 'ceiling',
      label: 'the ceiling',
      blurb: 'The logger is at DEBUG and logs one event per level. Pick the level to disable.',
      params: [{ name: 'level', type: 'int | str', hint: "'INFO', 30, 'CRITICAL', 0 …", input: 'auto' }],
      template: "import io, logging\nlog = logging.getLogger('maintenance')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\ntry:\n    logging.disable({$level})\n    for level in (logging.DEBUG, logging.INFO, logging.WARNING, logging.ERROR, logging.CRITICAL):\n        log.log(level, 'event at level %d', level)\nfinally:\n    logging.disable(logging.NOTSET)\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'info',     label: "'INFO'",     values: { level: 'INFO' } },
        { id: 'num',      label: '30',         values: { level: '30' } },
        { id: 'between',  label: '15',         values: { level: '15' } },
        { id: 'critical', label: "'CRITICAL'", values: { level: 'CRITICAL' } },
        { id: 'notset',   label: '0 (NOTSET)', values: { level: '0' } },
        { id: 'lower',    label: "'info'",     values: { level: 'info' } },
      ],
    },
    {
      id: 'combined',
      label: 'with the logger level',
      blurb: 'logging.disable(logging.INFO) is in force. Set the logger level and see which levels are still enabled.',
      params: [{ name: 'logger_level', type: 'int | str', hint: "'DEBUG', 'ERROR', 'NOTSET' …", input: 'auto' }],
      template: "import logging\nlog = logging.getLogger('maintenance.db')\nlog.setLevel({$logger_level})\ntry:\n    logging.disable(logging.INFO)\n    enabled = [name for name in ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL') if log.isEnabledFor(logging.getLevelName(name))]\nfinally:\n    logging.disable(logging.NOTSET)\nenabled",
      cases: [
        { id: 'debug',  label: "'DEBUG'",  values: { logger_level: 'DEBUG' } },
        { id: 'error',  label: "'ERROR'",  values: { logger_level: 'ERROR' } },
        { id: 'notset', label: "'NOTSET'", values: { logger_level: 'NOTSET' } },
        { id: 'num',    label: '35',       values: { logger_level: '35' } },
      ],
    },
  ],
  demoExplainer: "disable(level) drops that level and everything below it: 'INFO' keeps WARNING, ERROR and CRITICAL; 30 keeps only ERROR and CRITICAL; 15 is not a level name, but the comparison is numeric, so DEBUG (10) is dropped and INFO (20) gets through. 'CRITICAL' silences everything and 0 (NOTSET) removes the ceiling. Names are case-sensitive: 'info' raises ValueError: Unknown level: 'info' (the finally block still runs). In the second tab the two thresholds combine — a level must be above the disable ceiling AND at or above the logger's effective level; with NOTSET the logger inherits the root logger's WARNING.",

  patterns: [
    {
      name: 'Silence logging for one block',
      desc: 'A small context manager that always restores the previous ceiling.',
      code: "import contextlib, logging\n\n@contextlib.contextmanager\ndef logging_disabled(level=logging.CRITICAL):\n    previous = logging.root.manager.disable\n    logging.disable(level)\n    try:\n        yield\n    finally:\n        logging.disable(previous)",
    },
    {
      name: 'Quiet test suite',
      desc: 'Turn logging off for a test case and undo it in cleanup, even when the test fails.',
      code: "import logging, unittest\n\nclass ImportTests(unittest.TestCase):\n    def setUp(self):\n        logging.disable(logging.CRITICAL)\n        self.addCleanup(logging.disable, logging.NOTSET)",
    },
    {
      name: 'A command-line --quiet flag',
      desc: 'Keep errors, drop everything below them.',
      code: "import logging\nif args.quiet:\n    logging.disable(logging.WARNING)",
    },
  ],

  examples: [
    { title: 'With no argument everything is off', code: "import logging\nlog = logging.getLogger('maintenance.ex1')\ntry:\n    logging.disable()\n    result = log.isEnabledFor(logging.CRITICAL)\nfinally:\n    logging.disable(logging.NOTSET)\nresult", returns: 'False' },
    { title: 'The ceiling is stored on the manager', code: "import logging\ntry:\n    logging.disable('WARNING')\n    result = logging.root.manager.disable\nfinally:\n    logging.disable(logging.NOTSET)\nresult", returns: '30' },
    { title: 'NOTSET (0) means no ceiling', code: 'import logging\nlogging.disable(logging.NOTSET)\nlogging.root.manager.disable', returns: '0' },
    { title: 'Above the ceiling the logger level still decides', code: "import logging\nlog = logging.getLogger('maintenance.ex4')\nlog.setLevel(logging.ERROR)\ntry:\n    logging.disable(logging.INFO)\n    result = (log.isEnabledFor(logging.WARNING), log.isEnabledFor(logging.ERROR))\nfinally:\n    logging.disable(logging.NOTSET)\nresult", returns: '(False, True)' },
    { title: 'Unknown names are rejected', code: "import logging\nlogging.disable('warn')", returns: "ValueError: Unknown level: 'warn'" },
    { title: 'Logger.disabled switches off one logger only', code: "import logging\nlog = logging.getLogger('maintenance.ex6')\nlog.disabled = True\ntry:\n    result = (log.isEnabledFor(logging.CRITICAL), log.getChild('sub').isEnabledFor(logging.CRITICAL))\nfinally:\n    log.disabled = False\nresult", returns: '(False, True)' },
  ],

  pitfalls: [
    {
      name: 'disable(WARNING) to keep the warnings',
      desc: "disable(level) works like 'at most level', not like setLevel's 'at least level': the level you pass is switched off too. To keep warnings and above, disable INFO.",
      wrong: { label: 'disable(WARNING)', code: "import logging, sys\nlog = logging.getLogger('maintenance.pit1')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nlog.addHandler(handler := logging.StreamHandler(sys.stdout))\ntry:\n    logging.disable(logging.WARNING)\n    log.info('cache warmed')\n    log.warning('disk 91% full')\n    log.error('backup failed')\nfinally:\n    logging.disable(logging.NOTSET)\n    log.removeHandler(handler)", output: 'backup failed' },
      fix:   { label: 'disable(INFO)', code: "import logging, sys\nlog = logging.getLogger('maintenance.pit1')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nlog.addHandler(handler := logging.StreamHandler(sys.stdout))\ntry:\n    logging.disable(logging.INFO)\n    log.info('cache warmed')\n    log.warning('disk 91% full')\n    log.error('backup failed')\nfinally:\n    logging.disable(logging.NOTSET)\n    log.removeHandler(handler)", output: 'disk 91% full\nbackup failed' },
    },
    {
      name: 'Disabling in a test and never switching back',
      desc: 'The ceiling is global and permanent: a test that calls disable() leaves every later test (and its log assertions) silenced. Restore it in a finally block or with addCleanup(logging.disable, logging.NOTSET).',
      wrong: { label: 'no restore', code: "import logging\ndef test_import_is_quiet():\n    logging.disable(logging.CRITICAL)\n    pass  # import and exercise the module\ntry:\n    test_import_is_quiet()\n    leaked = logging.root.manager.disable\nfinally:\n    logging.disable(logging.NOTSET)  # (clean up after this snippet)\nleaked", output: '50' },
      fix:   { label: 'try / finally', code: "import logging\ndef test_import_is_quiet():\n    logging.disable(logging.CRITICAL)\n    try:\n        pass  # import and exercise the module\n    finally:\n        logging.disable(logging.NOTSET)\ntest_import_is_quiet()\nlogging.root.manager.disable", output: '0' },
    },
  ],

  when: {
    use: [
      'Silencing all output in tests or benchmarks, then restoring it',
      'A global --quiet switch that must override whatever levels libraries set',
      'Temporarily muting a noisy phase (an import, a bulk job) in one place',
    ],
    avoid: [
      'Muting one library → logging.getLogger("lib").setLevel(logging.ERROR) or .disabled = True',
      'Permanent configuration → logger and handler levels (setLevel, basicConfig(level=…))',
    ],
  },

  notes: {
    cpython:      'disable(level): root.manager.disable = level (the property setter runs _checkLevel, so names work), then root.manager._clear_cache() empties every logger\'s isEnabledFor cache',
    'Check order': 'isEnabledFor: logger.disabled → False; manager.disable >= level → False; otherwise level >= getEffectiveLevel()',
    'Custom levels': 'With a custom level above CRITICAL, the default argument no longer disables it — pass a higher level explicitly (the docs make the same point)',
    'Module functions': 'logging.info() and friends still call basicConfig() on an empty root logger before the level check, so a handler may be added even while logging is disabled',
  },

  related: [
    { name: 'Logger.setLevel', slug: 'logger-setlevel', when: 'Per-logger thresholds' },
    { name: 'logging levels', slug: 'levels', when: 'The numbers being compared' },
    { name: 'Logger', slug: 'logger', when: 'Logger.disabled for a single logger' },
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'Set the root level instead' },
    { name: 'contextlib module', slug: 'contextlib', when: 'Wrap disable/restore in a context manager', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I temporarily disable all logging in Python?',
      a: 'Call logging.disable(logging.CRITICAL) (or just logging.disable() since 3.7) and later logging.disable(logging.NOTSET) to turn logging back on. Put the restore in a finally block so an exception cannot leave logging off.',
    },
    {
      q: 'How do I re-enable logging after logging.disable()?',
      a: 'logging.disable(logging.NOTSET) — NOTSET is 0, which removes the ceiling. The loggers\' caches are cleared at the same time, so the change applies immediately.',
    },
    {
      q: 'What is the difference between logging.disable and logger.disabled?',
      a: 'logging.disable(level) is one process-wide ceiling that applies to every logger. logger.disabled = True turns off a single logger object completely; its children are not affected, because isEnabledFor checks only the logger\'s own flag.',
    },
    {
      q: 'Does logging.disable(logging.WARNING) keep warnings?',
      a: 'No. disable(level) ignores calls of that level and below, so WARNING, INFO and DEBUG are all dropped and only ERROR and CRITICAL remain. To keep warnings, call logging.disable(logging.INFO).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.disable',
    meta:  'logging.disable',
  },

};
