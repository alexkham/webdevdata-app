// content/reference/python/stdlib/logging/logger-getchild.js

export const meta = {
  slug:        'logger-getchild',
  name:        'Logger.getChild / getChildren',
  signature:   'Logger.getChild(suffix)',
  blurb:       "getChild('x') is getLogger(parent.name + '.x'); getChildren() (3.12+) returns the set of loggers directly below a logger.",
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+ (getChildren 3.12+)',
  searchTerms: 'Logger.getChild Logger.getChildren getchild python child logger name suffix getLogger(__name__).getChild list child loggers logger tree immediate children set',
};

export const method = {
  slug:      'logger-getchild',
  name:      'Logger.getChild / getChildren',
  signature: 'Logger.getChild(suffix)  ·  Logger.getChildren()',
  returns:   { type: 'Logger | set[Logger]', desc: 'getChild: the logger named "<name>.<suffix>" (created if needed). getChildren: a new set of the existing loggers one level below.' },

  category:    'logging.Logger method',
  version:     'Python 3.2+ (getChildren 3.12+)',
  hasLiveDemo: true,

  subtitle: "getChild builds the dotted name for you and goes through the same registry as getLogger, so it returns the one shared logger of that name. getChildren lists only loggers that exist and sit exactly one dot below — a 'shop.reports.daily' created without 'shop.reports' is not a child of 'shop'.",

  covers: ['Logger.getChild', 'Logger.getChildren'],

  cheat: {
    commonCall: "log.getChild('db')",
    returns:    "<Logger app.db (WARNING)> — same as getLogger('app.db')",
    replaces:   "getLogger(f'{log.name}.db')",
    watchOut:   'getChildren returns a set: sort the names for stable output',
  },

  parameters: [
    { name: 'suffix', type: 'str', required: true, default: null, desc: "getChild: the rest of the name, may itself contain dots ('db.pool'). On the root logger the suffix alone is the name." },
  ],

  modes: [
    {
      id: 'child',
      label: 'getChild',
      blurb: 'The name getChild gives for a parent logger and a suffix.',
      params: [
        { name: 'parent', type: 'str', hint: "a logger name ('' = root)", input: 'text' },
        { name: 'suffix', type: 'str', hint: 'the suffix',               input: 'auto' },
      ],
      template: 'import logging\nlogging.getLogger({$parent}).getChild({$suffix}).name',
      cases: [
        { id: 'plain', label: "'api' + 'v2'",       values: { parent: 'api', suffix: 'v2' } },
        { id: 'dots',  label: "'api' + 'v2.users'", values: { parent: 'api', suffix: 'v2.users' } },
        { id: 'root',  label: "root + 'jobs'",      values: { parent: '', suffix: 'jobs' } },
        { id: 'int',   label: 'suffix 2',           values: { parent: 'api', suffix: '2' } },
      ],
    },
    {
      id: 'children',
      label: 'getChildren',
      blurb: "The snippet creates store.cart, store.cart.items, store.users and store.reports.daily. List the children of any logger.",
      params: [{ name: 'name', type: 'str', hint: 'a logger name', input: 'text' }],
      template: "import logging\nfor name in ('store.cart', 'store.cart.items', 'store.users', 'store.reports.daily'):\n    logging.getLogger(name)\nsorted(child.name for child in logging.getLogger({$name}).getChildren())",
      cases: [
        { id: 'store', label: 'store',               values: { name: 'store' } },
        { id: 'cart',  label: 'store.cart',          values: { name: 'store.cart' } },
        { id: 'leaf',  label: 'store.users',         values: { name: 'store.users' } },
        { id: 'deep',  label: 'store.reports.daily', values: { name: 'store.reports.daily' } },
      ],
    },
  ],
  demoExplainer: "getChild simply joins the names with a dot, so a dotted suffix goes several levels down; on the root logger the suffix alone becomes the name. A non-str suffix fails in that join with TypeError: sequence item 1: expected str instance, int found. In the second tab 'store' has two children: store.cart.items is a grandchild, and store.reports.daily hangs from 'store' only through a placeholder for the missing 'store.reports', so it does not count as a child either.",

  patterns: [
    {
      name: 'Per-class loggers under the module logger',
      desc: 'Records carry the class name; module-level settings still apply.',
      code: "import logging\nlog = logging.getLogger(__name__)\n\nclass Importer:\n    def __init__(self):\n        self.log = log.getChild(type(self).__name__)",
    },
    {
      name: 'Inspect what a library created',
      desc: 'getChildren shows the sub-loggers you can tune (3.12+).',
      code: "import logging\nfor child in sorted(logging.getLogger('urllib3').getChildren(), key=lambda lg: lg.name):\n    print(child.name, logging.getLevelName(child.getEffectiveLevel()))",
    },
  ],

  examples: [
    { title: 'Same logger as getLogger',        code: "import logging\nlogging.getLogger('api').getChild('v2') is logging.getLogger('api.v2')", returns: 'True' },
    { title: 'The child inherits the level',    code: "import logging\nlogging.getLogger('scheduler').setLevel(logging.ERROR)\nlogging.getLogger('scheduler').getChild('thread1').getEffectiveLevel()", returns: '40' },
    { title: 'A dotted suffix goes deeper',     code: "import logging\nchild = logging.getLogger('svc').getChild('v2.users')\n(child.name, child.parent.name)", returns: "('svc.v2.users', 'svc')" },
    { title: 'On the root logger',              code: "import logging\nlogging.getLogger().getChild('jobs') is logging.getLogger('jobs')", returns: 'True' },
    { title: 'getChildren returns a set',       code: "import logging\nlogging.getLogger('pkg.a')\ntype(logging.getLogger('pkg').getChildren()).__name__", returns: "'set'" },
    { title: 'Only direct children',            code: "import logging\nfor name in ('farm.barn', 'farm.barn.cow', 'farm.field'):\n    logging.getLogger(name)\nsorted(c.name for c in logging.getLogger('farm').getChildren())", returns: "['farm.barn', 'farm.field']" },
  ],

  pitfalls: [
    {
      name: 'Printing the getChildren() set directly',
      desc: 'Loggers hash by identity, so the set order changes from run to run. Sort by name before printing or comparing.',
      wrong: { label: 'raw set', code: "import logging\nfor name in ('zoo.b', 'zoo.a'):\n    logging.getLogger(name)\nlen(logging.getLogger('zoo').getChildren())", output: '2' },
      fix:   { label: 'sorted names', code: "import logging\nfor name in ('zoo.b', 'zoo.a'):\n    logging.getLogger(name)\nsorted(c.name for c in logging.getLogger('zoo').getChildren())", output: "['zoo.a', 'zoo.b']" },
    },
    {
      name: 'Building per-object logger names',
      desc: "getChild(str(user_id)) creates a new logger for every id and the registry keeps them all for the life of the process. Put the id in the message or in extra instead.",
      wrong: { label: 'child per id', code: "import logging\nlog = logging.getLogger('sessions')\nfor user_id in range(500):\n    log.getChild(str(user_id))\nlen(log.getChildren())", output: '500' },
      fix:   { label: 'one logger', code: "import io, logging\nlog = logging.getLogger('sessions2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nlog.info('user %s logged in', 499)\nlog.removeHandler(handler)\nstream.getvalue()", output: "'user 499 logged in\\n'" },
    },
  ],

  when: {
    use: [
      'Sub-loggers derived from a logger object you already hold',
      'getChildren to explore a logger tree (3.12+)',
    ],
    avoid: [
      'Names built from data (ids, users, URLs) → one logger plus extra= or a LoggerAdapter',
      'Listing every logger in the process → logging.root.manager.loggerDict',
    ],
  },

  notes: {
    cpython:     "getChild: if self.root is not self: suffix = '.'.join((self.name, suffix)); return self.manager.getLogger(suffix). getChildren: loggers in manager.loggerDict whose parent is self and whose name has exactly one more dot",
    'Versions':  'getChild 3.2, getChildren 3.12',
  },

  related: [
    { name: 'logging.getLogger', slug: 'getlogger', when: 'The registry getChild goes through' },
    { name: 'Logger', slug: 'logger', when: 'parent, name and the other attributes' },
    { name: 'Logger.propagate', slug: 'propagate', when: 'How child records reach the parent' },
    { name: 'LoggerAdapter', slug: 'loggeradapter', when: 'Per-object context without new loggers' },
  ],

  faq: [
    {
      q: 'What is the difference between getChild and getLogger?',
      a: "None in the result: logger.getChild('x') returns getLogger(logger.name + '.x'), the same shared object. getChild is handy when you hold a logger but not its name, e.g. a module logger passed into a class.",
    },
    {
      q: 'How do I list all child loggers?',
      a: "Python 3.12+: logger.getChildren() returns the set of direct children (sort by .name for display). On older versions, filter logging.root.manager.loggerDict by name prefix and skip the PlaceHolder entries.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Logger.getChild',
    meta:  'Logger.getChild',
  },

};
