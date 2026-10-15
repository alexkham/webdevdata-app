// content/reference/python/stdlib/logging/levels.js

export const meta = {
  slug:        'levels',
  name:        'logging.DEBUG / INFO / WARNING / ERROR / CRITICAL',
  signature:   'logging.CRITICAL = 50 · ERROR = 40 · WARNING = 30 · INFO = 20 · DEBUG = 10 · NOTSET = 0',
  blurb:       'The standard severity levels — plain ints from 10 to 50 — plus NOTSET (0, "inherit") and the aliases FATAL and WARN.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging levels python DEBUG INFO WARNING ERROR CRITICAL NOTSET FATAL WARN log level numbers 10 20 30 40 50 severity order which level to use custom level threshold',
};

export const method = {
  slug:      'levels',
  name:      'logging.DEBUG / INFO / WARNING / ERROR / CRITICAL',
  signature: 'logging.CRITICAL = 50 · ERROR = 40 · WARNING = 30 · INFO = 20 · DEBUG = 10 · NOTSET = 0',

  category:    'logging constants',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'A level is just an int: a record gets through when its level is at least the threshold of the logger (and of each handler). The steps of 10 leave room for your own levels; NOTSET (0) is not a severity but "no level of my own — ask my parent".',

  covers: ['CRITICAL', 'FATAL', 'ERROR', 'WARNING', 'WARN', 'INFO', 'DEBUG', 'NOTSET'],

  attributes: [
    { name: 'CRITICAL', type: 'int = 50', meaning: 'The program itself may be unable to continue' },
    { name: 'FATAL',    type: 'int = 50', meaning: 'Alias of CRITICAL (its name is reported as CRITICAL)' },
    { name: 'ERROR',    type: 'int = 40', meaning: 'A function failed; logger.exception() also uses this level' },
    { name: 'WARNING',  type: 'int = 30', meaning: 'Something unexpected, the program still works — the default threshold of the root logger' },
    { name: 'WARN',     type: 'int = 30', meaning: 'Alias of WARNING' },
    { name: 'INFO',     type: 'int = 20', meaning: 'Confirmation that things work as expected' },
    { name: 'DEBUG',    type: 'int = 10', meaning: 'Detail for diagnosing problems' },
    { name: 'NOTSET',   type: 'int = 0',  meaning: 'Default of every logger and handler: a logger defers to its parent, a handler passes everything' },
  ],

  modes: [
    {
      id: 'threshold',
      label: 'threshold',
      blurb: "Set a logger's level and list which standard levels it is enabled for.",
      params: [{ name: 'level', type: 'int | str', hint: "e.g. 'INFO', 25, 'NOTSET'", input: 'auto' }],
      template: "import logging\nlog = logging.getLogger('levels.demo')\nlog.setLevel({$level})\n[name for name in ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')\n if log.isEnabledFor(getattr(logging, name))]",
      cases: [
        { id: 'info',   label: "'INFO'",   values: { level: 'INFO' } },
        { id: 'custom', label: '25',       values: { level: '25' } },
        { id: 'notset', label: "'NOTSET'", values: { level: 'NOTSET' } },
        { id: 'one',    label: '1',        values: { level: '1' } },
        { id: 'high',   label: '51',       values: { level: '51' } },
        { id: 'warn',   label: "'WARN'",   values: { level: 'WARN' } },
      ],
    },
  ],
  demoExplainer: "The comparison is plain >=: at 25 the logger accepts WARNING (30) and up. 'NOTSET' (0) does not mean \"everything\" — the logger falls back to its parent, the root logger at WARNING. Level 1 is the way to really let everything through; above 50 nothing passes. 'WARN' is accepted as a name and stands for 30.",

  patterns: [
    {
      name: 'Level from configuration text',
      desc: 'setLevel and basicConfig accept level names as strings.',
      code: "import logging, os\nlogging.getLogger('app').setLevel(os.environ.get('APP_LOG_LEVEL', 'INFO'))",
    },
    {
      name: 'Skip expensive work below the level',
      desc: 'Guard work that is costly even before formatting.',
      code: "import logging\nlog = logging.getLogger(__name__)\nif log.isEnabledFor(logging.DEBUG):\n    log.debug('state dump: %s', build_dump())",
    },
    {
      name: 'A level between two standard ones',
      desc: 'Any int works; register a name for it with addLevelName.',
      code: "import logging\nNOTICE = 25\nlogging.addLevelName(NOTICE, 'NOTICE')\nlogging.getLogger(__name__).log(NOTICE, 'config reloaded')",
    },
  ],

  examples: [
    { title: 'The standard values',       code: 'import logging\n[logging.DEBUG, logging.INFO, logging.WARNING, logging.ERROR, logging.CRITICAL]', returns: '[10, 20, 30, 40, 50]' },
    { title: 'Levels compare as ints',    code: 'import logging\nlogging.ERROR > logging.WARNING > logging.INFO', returns: 'True' },
    { title: 'FATAL and WARN are aliases', code: 'import logging\n(logging.FATAL is logging.CRITICAL, logging.WARN == logging.WARNING)', returns: '(True, True)' },
    { title: 'Aliases report the main name', code: 'import logging\n(logging.getLevelName(logging.FATAL), logging.getLevelName(logging.WARN))', returns: "('CRITICAL', 'WARNING')" },
    { title: 'NOTSET is zero',            code: 'import logging\nlogging.NOTSET', returns: '0' },
    { title: 'A new logger has no level of its own', code: "import logging\nlog = logging.getLogger('levels.fresh')\n(log.level, log.getEffectiveLevel())", returns: '(0, 30)' },
  ],

  pitfalls: [
    {
      name: 'Using NOTSET to mean "log everything"',
      desc: 'NOTSET means "inherit": a NOTSET logger under the default root still filters at WARNING. Use DEBUG (or 1) to open a logger fully.',
      wrong: { label: 'NOTSET', code: "import logging\nlog = logging.getLogger('levels.open')\nlog.setLevel(logging.NOTSET)\nlog.isEnabledFor(logging.DEBUG)", output: 'False' },
      fix:   { label: 'DEBUG',  code: "import logging\nlog = logging.getLogger('levels.open')\nlog.setLevel(logging.DEBUG)\nlog.isEnabledFor(logging.DEBUG)", output: 'True' },
    },
    {
      name: 'Sorting or comparing level names as text',
      desc: "Names sort alphabetically, not by severity — 'WARNING' > 'ERROR' as strings. Compare the numbers.",
      wrong: { label: 'string order', code: "sorted(['WARNING', 'DEBUG', 'ERROR', 'INFO'])", output: "['DEBUG', 'ERROR', 'INFO', 'WARNING']" },
      fix:   { label: 'by number',    code: "import logging\nsorted(['WARNING', 'DEBUG', 'ERROR', 'INFO'], key=logging.getLevelNamesMapping().get)", output: "['DEBUG', 'INFO', 'WARNING', 'ERROR']" },
    },
  ],

  when: {
    use: [
      'DEBUG: details only needed while diagnosing',
      'INFO: normal milestones (started, finished, connected)',
      'WARNING: unexpected but handled; ERROR: an operation failed; CRITICAL: the program cannot go on',
    ],
    avoid: [
      'Many custom levels → they confuse every handler and tool that knows only the standard five',
      'Level names as plain strings in comparisons → use the int constants',
    ],
  },

  notes: {
    cpython:   'Module-level ints in Lib/logging/__init__.py, with the _levelToName / _nameToLevel tables behind getLevelName and addLevelName',
    'Root':    'The root logger is created at WARNING; every other logger and every handler starts at NOTSET',
    'Strings': "setLevel accepts the registered names ('DEBUG' … 'CRITICAL', plus 'WARN', 'FATAL', 'NOTSET'); they are case-sensitive",
  },

  related: [
    { name: 'Logger.setLevel', slug: 'logger-setlevel', when: 'Set a threshold, read the effective level' },
    { name: 'logging.getLevelName', slug: 'getlevelname', when: 'Number to name and back' },
    { name: 'logging.addLevelName', slug: 'addlevelname', when: 'Name a custom level' },
    { name: 'logging.disable', slug: 'disable', when: 'A global ceiling over all levels' },
    { name: 'Handler', slug: 'handler', when: 'Handlers have levels too' },
  ],

  faq: [
    {
      q: 'What are the logging levels in Python?',
      a: 'DEBUG 10, INFO 20, WARNING 30, ERROR 40 and CRITICAL 50, plus NOTSET 0. FATAL is another name for CRITICAL and WARN for WARNING.',
    },
    {
      q: 'What is the default logging level?',
      a: 'The root logger starts at WARNING, and every other logger starts at NOTSET, which means it uses its ancestors\' level — so by default WARNING, ERROR and CRITICAL get through and DEBUG and INFO do not.',
    },
    {
      q: 'Which level should I use?',
      a: "Use DEBUG for details you only want while diagnosing, INFO for normal milestones, WARNING for something unexpected that the program handled, ERROR when an operation failed, CRITICAL when the program cannot continue. Inside except blocks, logger.exception() logs at ERROR with the traceback.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging-levels',
    meta:  'Logging Levels',
  },

};
