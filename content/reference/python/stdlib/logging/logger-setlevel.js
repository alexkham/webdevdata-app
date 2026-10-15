// content/reference/python/stdlib/logging/logger-setlevel.js

export const meta = {
  slug:        'logger-setlevel',
  name:        'Logger.setLevel / getEffectiveLevel / isEnabledFor',
  signature:   'Logger.setLevel(level)',
  blurb:       "Set a logger's own threshold, read the threshold that actually applies (inherited from the nearest ancestor with a level), and ask whether a level would get through.",
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'Logger.setLevel Logger.getEffectiveLevel Logger.isEnabledFor logger setlevel python set log level effective level inherit parent level NOTSET isEnabledFor debug guard Unknown level Level not an integer or a valid string level names case sensitive',
};

export const method = {
  slug:      'logger-setlevel',
  name:      'Logger.setLevel / getEffectiveLevel / isEnabledFor',
  signature: 'Logger.setLevel(level)  ·  Logger.getEffectiveLevel()  ·  Logger.isEnabledFor(level)',
  returns:   { type: 'None | int | bool', desc: 'setLevel: None. getEffectiveLevel: the int threshold in force. isEnabledFor: whether a record of that level would be created.' },

  category:    'logging.Logger method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "logger.level is only the logger's own setting; 0 (NOTSET) means \"ask my parent\". getEffectiveLevel() walks up the dotted-name tree to the first logger with a non-zero level — ultimately the root logger, which starts at WARNING. isEnabledFor(level) compares against that, and also honours logging.disable().",

  covers: ['Logger.setLevel', 'Logger.getEffectiveLevel', 'Logger.isEnabledFor'],

  cheat: {
    commonCall: "logging.getLogger('app').setLevel(logging.DEBUG)",
    returns:    'None; getEffectiveLevel() → 10',
    replaces:   'if DEBUG: print(…) flags',
    watchOut:   "names are case-sensitive: setLevel('debug') raises ValueError",
  },

  parameters: [
    { name: 'level', type: 'int | str', required: true, default: null, desc: "setLevel: an int (logging.DEBUG, 25, …) or a registered name ('DEBUG', 'WARN', …). isEnabledFor: an int." },
  ],

  modes: [
    {
      id: 'inherit',
      label: 'parent and child',
      blurb: "Set the level of 'inventory' and of its child 'inventory.sync', then look at the child.",
      params: [
        { name: 'parent', type: 'int | str', hint: "e.g. 'INFO', 'NOTSET'", input: 'auto' },
        { name: 'child',  type: 'int | str', hint: "e.g. 'NOTSET', 15",     input: 'auto' },
      ],
      template: "import logging\nparent = logging.getLogger('inventory')\nchild = logging.getLogger('inventory.sync')\nparent.setLevel({$parent})\nchild.setLevel({$child})\n(child.level, child.getEffectiveLevel(), child.isEnabledFor(logging.INFO))",
      cases: [
        { id: 'inherit', label: 'INFO / NOTSET',     values: { parent: 'INFO', child: 'NOTSET' } },
        { id: 'own',     label: 'ERROR / DEBUG',     values: { parent: 'ERROR', child: 'DEBUG' } },
        { id: 'stricter', label: 'DEBUG / WARNING',  values: { parent: 'DEBUG', child: 'WARNING' } },
        { id: 'root',    label: 'NOTSET / NOTSET',   values: { parent: 'NOTSET', child: 'NOTSET' } },
        { id: 'num',     label: '15 / 0',            values: { parent: '15', child: '0' } },
        { id: 'lower',   label: "'debug' (lowercase)", values: { parent: 'debug', child: 'NOTSET' } },
        { id: 'float',   label: '15.5',              values: { parent: 'INFO', child: '15.5' } },
      ],
    },
  ],
  demoExplainer: "The tuple is (the child's own level, the level in force, whether INFO gets through). With NOTSET the child borrows its parent's level; a level of its own wins even when the parent is stricter or looser. When neither sets one, the search reaches the root logger and its default WARNING (30), so INFO is off. Names must be registered and spelled exactly — 'debug' raises ValueError: Unknown level: 'debug' — and a float is rejected as \"Level not an integer or a valid string\".",

  patterns: [
    {
      name: 'Verbose for one subsystem only',
      desc: 'Child loggers inherit; set the level where you need the detail.',
      code: "import logging\nlogging.basicConfig(level=logging.WARNING)\nlogging.getLogger('app.db').setLevel(logging.DEBUG)",
    },
    {
      name: 'Guard work that is costly before the call',
      desc: 'Lazy % formatting saves the string; isEnabledFor also saves computing the arguments.',
      code: "import logging\nlog = logging.getLogger(__name__)\nif log.isEnabledFor(logging.DEBUG):\n    log.debug('cache contents: %s', dump_cache())",
    },
    {
      name: 'Level from configuration',
      desc: 'setLevel accepts the registered names directly.',
      code: "import logging, os\nlogging.getLogger('app').setLevel(os.environ.get('APP_LOG_LEVEL', 'INFO').upper())",
    },
  ],

  examples: [
    { title: 'A name works as well as a number', code: "import logging\nlog = logging.getLogger('inventory.ex1')\nlog.setLevel('WARNING')\nlog.level", returns: '30' },
    { title: 'NOTSET inherits from the parent',  code: "import logging\nlogging.getLogger('warehouse').setLevel(logging.ERROR)\nlog = logging.getLogger('warehouse.picking')\n(log.level, log.getEffectiveLevel())", returns: '(0, 40)' },
    { title: 'isEnabledFor is a >= comparison',  code: "import logging\nlog = logging.getLogger('inventory.ex3')\nlog.setLevel(25)\n[log.isEnabledFor(n) for n in (20, 25, 30)]", returns: '[False, True, True]' },
    { title: 'logging.disable overrides every level', code: "import logging\nlog = logging.getLogger('inventory.ex4')\nlog.setLevel(logging.DEBUG)\nlogging.disable(logging.ERROR)\ntry:\n    result = log.isEnabledFor(logging.ERROR)\nfinally:\n    logging.disable(logging.NOTSET)\nresult", returns: 'False' },
    { title: 'The root logger starts at WARNING', code: 'import logging\nlogging.getLogger().getEffectiveLevel()', returns: '30' },
    { title: 'Names are case-sensitive',         code: "import logging\nlogging.getLogger('inventory.ex6').setLevel('info')", returns: "ValueError: Unknown level: 'info'" },
    { title: 'Handlers have a level of their own', code: "import io, logging\nlog = logging.getLogger('inventory.ex7')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setLevel(logging.WARNING)\nlog.addHandler(handler)\nlog.info('passes the logger, not the handler')\nlog.warning('passes both')\nlog.removeHandler(handler)\nstream.getvalue()", returns: "'passes both\\n'" },
  ],

  pitfalls: [
    {
      name: 'Setting DEBUG on the logger and expecting debug lines',
      desc: 'A record must pass the logger level AND the level of each handler. basicConfig and StreamHandler() leave the handler at NOTSET, but a handler you gave a level filters on its own.',
      wrong: { label: 'handler at INFO', code: "import io, logging\nlog = logging.getLogger('inventory.pit1')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setLevel(logging.INFO)\nlog.addHandler(handler)\nlog.debug('row 17 skipped')\nlog.removeHandler(handler)\nstream.getvalue()", output: "''" },
      fix:   { label: 'both at DEBUG', code: "import io, logging\nlog = logging.getLogger('inventory.pit1')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setLevel(logging.DEBUG)\nlog.addHandler(handler)\nlog.debug('row 17 skipped')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'row 17 skipped\\n'" },
    },
    {
      name: 'Reading logger.level to see what will be logged',
      desc: ".level is 0 for almost every logger — it only says the logger has no level of its own. Ask getEffectiveLevel() or isEnabledFor() instead.",
      wrong: { label: '.level', code: "import logging\nlogging.getLogger('reports').setLevel(logging.ERROR)\nlog = logging.getLogger('reports.monthly')\nlog.level <= logging.INFO", output: 'True' },
      fix:   { label: 'isEnabledFor', code: "import logging\nlogging.getLogger('reports').setLevel(logging.ERROR)\nlog = logging.getLogger('reports.monthly')\nlog.isEnabledFor(logging.INFO)", output: 'False' },
    },
  ],

  when: {
    use: [
      'Turning detail on for one package or module: setLevel on its logger',
      'isEnabledFor before computing expensive debug data',
    ],
    avoid: [
      'Comparing logger.level yourself → getEffectiveLevel() / isEnabledFor()',
      'Silencing everything temporarily → logging.disable()',
      'Filtering by something other than severity → a Filter',
    ],
  },

  notes: {
    cpython:   'setLevel stores _checkLevel(level) and clears the isEnabledFor cache of every logger (Manager._clear_cache); isEnabledFor caches its answer per level until the next setLevel or disable',
    'Names':   "setLevel accepts any name registered in the level table — 'CRITICAL', 'FATAL', 'ERROR', 'WARN', 'WARNING', 'INFO', 'DEBUG', 'NOTSET' and anything added with addLevelName",
    'Order':   'A record is created only if isEnabledFor(level) is true; logger filters, then each handler level and handler filters, decide what is emitted',
  },

  related: [
    { name: 'logging levels', slug: 'levels', when: 'The constants and their numbers' },
    { name: 'logging.disable', slug: 'disable', when: 'A process-wide ceiling' },
    { name: 'Handler', slug: 'handler', when: 'Handler.setLevel, the second threshold' },
    { name: 'Logger.propagate', slug: 'propagate', when: "Propagated records skip the parents' levels" },
    { name: 'logging.getLogger', slug: 'getlogger', when: 'The tree the effective level is inherited through' },
  ],

  faq: [
    {
      q: 'Why does my logger ignore setLevel(logging.DEBUG)?',
      a: 'The logger level is only the first gate. The handler that prints the line has its own level (check handler.level), and a record that propagates to a parent is checked against the parent\'s handlers\' levels, not the parent logger\'s level. Also check that logging.disable() has not been called.',
    },
    {
      q: 'What is the difference between logger.level and getEffectiveLevel()?',
      a: "level is what was set on this logger (0 / NOTSET if nothing). getEffectiveLevel() is the level actually used: the first non-zero level found walking up through the parents, ending at the root logger's level (WARNING by default).",
    },
    {
      q: 'Can I pass the level as a string?',
      a: "Yes: setLevel('DEBUG') works since Python 3.2, for every registered name. It is case-sensitive, so convert user input with .upper(). isEnabledFor and Logger.log, however, need the int.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Logger.setLevel',
    meta:  'Logger.setLevel',
  },

};
