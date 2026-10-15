// content/reference/python/stdlib/logging/getlogger.js

export const meta = {
  slug:        'getlogger',
  name:        'logging.getLogger',
  signature:   'logging.getLogger(name=None)',
  blurb:       'Return the logger with a given dotted name, creating it on first use — the same object every time. No name gives the root logger.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging getLogger python get logger by name getLogger(__name__) root logger logger hierarchy dotted name parent child logger same object singleton logger name must be a string',
};

export const method = {
  slug:      'getlogger',
  name:      'logging.getLogger',
  signature: 'logging.getLogger(name=None)',
  returns:   { type: 'logging.Logger', desc: "The logger called name — created the first time, the identical object on every later call. None, '' and 'root' all give the root logger." },

  category:    'logging function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "Loggers are looked up by name in one process-wide registry, so getLogger('shop.cart') in two modules returns the same object. The dots in the name place it in a tree: its parent is the nearest existing ancestor, and records travel up that chain.",

  covers: ['getLogger'],

  cheat: {
    commonCall: 'log = logging.getLogger(__name__)',
    returns:    "<Logger shop.cart (WARNING)> — the same object for the same name",
    replaces:   'passing logger objects between modules',
    watchOut:   'loggers are never freed — do not put ids or user input in the name',
  },

  parameters: [
    { name: 'name', type: 'str | None', required: false, default: 'None', desc: "Dotted logger name, usually __name__. None, '' or 'root' return the root logger — so does any other false value (0, b''), because the function only checks whether name is false. A true value that is not a str raises TypeError: A logger name must be a string." },
  ],

  modes: [
    {
      id: 'parent',
      label: 'parent',
      blurb: "The snippet creates 'billing' and 'billing.invoice'; type a name and see which logger becomes its parent.",
      params: [{ name: 'name', type: 'str', hint: 'a dotted logger name', input: 'text' }],
      template: "import logging\nlogging.getLogger('billing')\nlogging.getLogger('billing.invoice')\nlog = logging.getLogger({$name})\n(log.name, log.parent.name if log.parent else None)",
      cases: [
        { id: 'grand',  label: 'billing.invoice.pdf', values: { name: 'billing.invoice.pdf' } },
        { id: 'skip',   label: 'billing.tax.vat',     values: { name: 'billing.tax.vat' } },
        { id: 'prefix', label: 'billingx',            values: { name: 'billingx' } },
        { id: 'root',   label: "'root'",              values: { name: 'root' } },
        { id: 'empty',  label: "'' (empty)",          values: { name: '' } },
      ],
    },
    {
      id: 'same',
      label: 'same object?',
      blurb: 'Two getLogger calls: is it the same logger? Leave a field empty to pass None.',
      params: [
        { name: 'a', type: 'str | None', hint: 'first name (empty → None)',  input: 'text-or-none' },
        { name: 'b', type: 'str | None', hint: 'second name (empty → None)', input: 'text-or-none' },
      ],
      template: 'import logging\nlogging.getLogger({$a}) is logging.getLogger({$b})',
      cases: [
        { id: 'same',  label: 'same name',       values: { a: 'billing', b: 'billing' } },
        { id: 'root',  label: "None vs 'root'",  values: { a: '', b: 'root' } },
        { id: 'case',  label: 'different case',  values: { a: 'billing', b: 'Billing' } },
        { id: 'space', label: 'trailing space',  values: { a: 'billing', b: 'billing ' } },
      ],
    },
  ],
  demoExplainer: "'billing.tax.vat' gets 'billing' as its parent: no logger called 'billing.tax' exists, so the tree skips to the nearest real ancestor (an internal placeholder holds the gap until 'billing.tax' is created). 'billingx' shares a prefix but not a dot, so its parent is the root logger. getLogger('root') and getLogger('') both return the root logger, whose parent is None. Names are compared exactly — case and spaces count.",

  patterns: [
    {
      name: 'Module-level logger',
      desc: 'The standard idiom: one line at the top of every module.',
      code: "import logging\n\nlog = logging.getLogger(__name__)\n\ndef load(path):\n    log.debug('loading %s', path)",
    },
    {
      name: 'Configure a whole package by its top name',
      desc: "Loggers 'shop.cart', 'shop.payments' … all inherit from 'shop'.",
      code: "import logging\nlogging.getLogger('shop').setLevel(logging.DEBUG)\nlogging.getLogger('shop.payments').setLevel(logging.WARNING)  # quieter subsystem",
    },
    {
      name: 'Silence a chatty third-party library',
      desc: "Raise the level of the library's top-level logger; its children inherit it.",
      code: "import logging\nlogging.getLogger('urllib3').setLevel(logging.WARNING)",
    },
  ],

  examples: [
    { title: 'No name: the root logger',          code: 'import logging\nlogging.getLogger().name', returns: "'root'" },
    { title: "'root' is the root logger too",     code: "import logging\nlogging.getLogger() is logging.getLogger('root')", returns: 'True' },
    { title: "__name__ in the script you run",    code: 'import logging\nlogging.getLogger(__name__).name', returns: "'__main__'" },
    { title: 'getChild is the same lookup',       code: "import logging\nlogging.getLogger('ledger').getChild('tax') is logging.getLogger('ledger.tax')", returns: 'True' },
    { title: 'A child created first is re-parented later', code: "import logging\nchild = logging.getLogger('exports.daily.pdf')\nbefore = child.parent.name\nlogging.getLogger('exports.daily')\n(before, child.parent.name)", returns: "('root', 'exports.daily')" },
    { title: 'The name must be a str',            code: 'import logging\nlogging.getLogger(42)', returns: 'TypeError: A logger name must be a string' },
  ],

  pitfalls: [
    {
      name: 'A logger per request, user or object',
      desc: 'The registry keeps every logger alive for the life of the process, so names built from ids leak memory. Keep one logger per module and put the id in the message or in extra.',
      wrong: { label: 'name per request', code: "import logging, weakref\nrefs = [weakref.ref(logging.getLogger(f'request.{i}')) for i in range(1000)]\nsum(r() is not None for r in refs)", output: '1000' },
      fix:   { label: 'id in the record', code: "import logging, sys\nlog = logging.getLogger('request')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(logging.Formatter('[%(request_id)s] %(message)s'))\nlog.addHandler(handler)\nlog.info('handled', extra={'request_id': 4711})\nlog.removeHandler(handler)", output: '[4711] handled' },
    },
    {
      name: 'Treating a shared prefix as a parent',
      desc: "The hierarchy follows dots, not string prefixes: 'shopping' is not a child of 'shop' and does not use its handlers or level.",
      wrong: { label: 'prefix', code: "import logging\nlogging.getLogger('shop')\nlogging.getLogger('shopping').parent.name", output: "'root'" },
      fix:   { label: 'dotted', code: "import logging\nlogging.getLogger('shop')\nlogging.getLogger('shop.ping').parent.name", output: "'shop'" },
    },
  ],

  when: {
    use: [
      'At the top of every module: log = logging.getLogger(__name__)',
      "To reach a library's logger and change its level or handlers",
    ],
    avoid: [
      'Per-call or per-object names → one module logger plus extra= or a LoggerAdapter',
      'Instantiating logging.Logger directly → it is not registered and has no parent',
    ],
  },

  notes: {
    cpython:   'Manager.getLogger in Lib/logging/__init__.py: a dict lookup under the module lock; missing ancestors are recorded as PlaceHolder objects and fixed up when they are created',
    'Root':    "getLogger(), getLogger(None), getLogger('') and getLogger('root') all return logging.root",
    'Class':   'New loggers are instances of getLoggerClass() (Logger unless setLoggerClass was called)',
  },

  related: [
    { name: 'Logger', slug: 'logger', when: 'What getLogger returns' },
    { name: 'Logger.getChild', slug: 'logger-getchild', when: 'Child loggers from a parent object' },
    { name: 'Logger.propagate', slug: 'propagate', when: 'How records climb the tree' },
    { name: 'Logger.setLevel', slug: 'logger-setlevel', when: 'Levels inherited down the tree' },
    { name: 'logging.setLoggerClass', slug: 'setloggerclass', when: 'Make getLogger return your subclass' },
    { name: 'logging module', slug: 'logging', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between logging.getLogger() and logging.getLogger(__name__)?',
      a: "getLogger() returns the root logger, the top of the tree that every other logger propagates to. getLogger(__name__) returns a logger named after the current module, e.g. 'shop.cart'; its records still reach the root logger's handlers, but you can set its level and handlers separately.",
    },
    {
      q: 'Do I need to pass the logger object between modules?',
      a: 'No. Every call with the same name returns the same object, so each module simply calls logging.getLogger(__name__) itself, and configuration done anywhere (usually at startup) applies to it.',
    },
    {
      q: 'Can I delete or reset a logger?',
      a: 'There is no public API to remove one: the registry keeps every logger for the life of the process. You can remove its handlers and filters, set its level back to NOTSET, propagate back to True and disabled back to False, which makes it behave like a fresh logger.',
    },
    {
      q: 'Why is my logger\'s parent the root logger when I expected a package logger?',
      a: "The parent is the nearest ancestor that exists at the moment you look. If 'shop' is created later, Python re-parents 'shop.cart' to it automatically. A name that only shares a prefix ('shopping') is never a child.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.getLogger',
    meta:  'logging.getLogger',
  },

};
