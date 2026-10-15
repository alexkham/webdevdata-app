// content/reference/python/stdlib/logging/setloggerclass.js

export const meta = {
  slug:        'setloggerclass',
  name:        'logging.setLoggerClass',
  signature:   'logging.setLoggerClass(klass)  ·  logging.getLoggerClass()  ·  logging.setLogRecordFactory(factory)  ·  logging.getLogRecordFactory()',
  blurb:       'The two customization hooks of logging: the class getLogger() instantiates for new loggers, and the callable every LogRecord is created with. Each has a getter, so you can extend the current one instead of replacing it.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+ (record factory 3.2+)',
  searchTerms: 'logging setLoggerClass getLoggerClass setLogRecordFactory getLogRecordFactory python custom logger class subclass logging.Logger add method to logger custom LogRecord attribute add field to every log record record factory logger not derived from logging.Logger',
};

export const method = {
  slug:      'setloggerclass',
  name:      'logging.setLoggerClass',
  signature: 'logging.setLoggerClass(klass)  ·  logging.getLoggerClass()  ·  logging.setLogRecordFactory(factory)  ·  logging.getLogRecordFactory()',
  returns:   { type: 'None | type | callable', desc: 'The setters return None; getLoggerClass() returns the class in use (logging.Logger by default), getLogRecordFactory() the factory in use (logging.LogRecord by default).' },

  category:    'logging function',
  version:     'Python 2.3+ (record factory 3.2+)',
  hasLiveDemo: true,

  subtitle: "setLoggerClass changes what getLogger() builds from now on — loggers that already exist keep their class, and the root logger is always a RootLogger. setLogRecordFactory changes how every record is made: Logger.makeRecord and makeLogRecord call the factory with the LogRecord constructor's arguments. Both settings are process-wide, so wrap the current class or factory (getLoggerClass / getLogRecordFactory) instead of discarding it.",

  covers: ['setLoggerClass', 'getLoggerClass', 'setLogRecordFactory', 'getLogRecordFactory'],

  cheat: {
    commonCall: 'logging.setLoggerClass(AuditLogger)',
    returns:    'None — later getLogger() calls create AuditLogger objects',
    replaces:   'helper functions wrapped around every logger',
    watchOut:   'call it before the loggers are created; it is global',
  },

  parameters: [
    { name: 'klass',   type: 'type',     required: true, default: null, desc: 'setLoggerClass: logging.Logger or a subclass whose __init__ can be called with just a name. Another class raises TypeError: logger not derived from logging.Logger: <name>; a non-class fails earlier, in issubclass() (TypeError: issubclass() arg 1 must be a class).' },
    { name: 'factory', type: 'callable', required: true, default: null, desc: 'setLogRecordFactory: called as factory(name, level, fn, lno, msg, args, exc_info, func=None, sinfo=None, **kwargs) and must return a LogRecord (usually by calling the previous factory).' },
  ],

  modes: [
    {
      id: 'class',
      label: 'setLoggerClass',
      blurb: "'payments' already exists. Then AuditLogger is installed and getLogger is called with your name.",
      params: [{ name: 'name', type: 'str', hint: "a logger name ('' = root)", input: 'text' }],
      template: "import logging\nclass AuditLogger(logging.Logger):\n    def audit(self, msg, *args):\n        self.warning('AUDIT ' + msg, *args)\nexisting = logging.getLogger('payments')\nlogging.setLoggerClass(AuditLogger)\ntry:\n    log = logging.getLogger({$name})\nfinally:\n    logging.setLoggerClass(logging.Logger)\n(type(log).__name__, hasattr(log, 'audit'))",
      cases: [
        { id: 'new',      label: "'payments.refunds'", values: { name: 'payments.refunds' } },
        { id: 'existing', label: "'payments'",         values: { name: 'payments' } },
        { id: 'root',     label: "'' (root)",          values: { name: '' } },
        { id: 'other',    label: "'Payments'",         values: { name: 'Payments' } },
      ],
    },
    {
      id: 'factory',
      label: 'setLogRecordFactory',
      blurb: 'A factory wraps the current one and stamps every record with record.env; the format string prints it.',
      params: [{ name: 'env', type: 'any', hint: 'a value for record.env', input: 'auto' }],
      template: "import io, logging\nlog = logging.getLogger('deploys')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('[%(env)s] %(levelname)s %(message)s'))\nlog.addHandler(handler)\nold_factory = logging.getLogRecordFactory()\ndef factory(*args, **kwargs):\n    record = old_factory(*args, **kwargs)\n    record.env = {$env}\n    return record\nlogging.setLogRecordFactory(factory)\ntry:\n    log.info('deploy started')\n    log.warning('%d hosts unreachable', 2)\nfinally:\n    logging.setLogRecordFactory(old_factory)\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'prod',    label: "'prod'",    values: { env: 'prod' } },
        { id: 'staging', label: "'staging'", values: { env: 'staging' } },
        { id: 'int',     label: '42',        values: { env: '42' } },
        { id: 'pct',     label: "'%s'",      values: { env: '%s' } },
      ],
    },
  ],
  demoExplainer: "A name that does not exist yet becomes an AuditLogger with the audit() method. 'payments' was created before setLoggerClass, so getLogger returns that same plain Logger — changing the class never converts existing loggers. The root logger ('' or 'root') is created when logging is imported and is a RootLogger. Names are case-sensitive, so 'Payments' is a new logger. In the factory tab every record gets env before any handler sees it, so %(env)s works without extra=. The value goes through %-formatting as an attribute, so '%s' is printed literally; only msg is merged with args.",

  patterns: [
    {
      name: 'Extend the class that is already installed',
      desc: "getLoggerClass() in the class statement keeps another library's customization instead of replacing it.",
      code: "import logging\n\nclass ContextLogger(logging.getLoggerClass()):\n    def with_request(self, request_id):\n        return logging.LoggerAdapter(self, {'request_id': request_id})\n\nlogging.setLoggerClass(ContextLogger)",
    },
    {
      name: 'Add a field to every record',
      desc: 'Chain to the previous factory; the new attribute is available to every formatter and filter.',
      code: "import logging, socket\nold_factory = logging.getLogRecordFactory()\n\ndef record_factory(*args, **kwargs):\n    record = old_factory(*args, **kwargs)\n    record.hostname = socket.gethostname()\n    return record\n\nlogging.setLogRecordFactory(record_factory)",
    },
    {
      name: 'Install the class before importing your modules',
      desc: 'Modules usually call getLogger(__name__) at import time, so the class must be set first.',
      code: "import logging\nfrom myapp.logging_ext import AuditLogger\nlogging.setLoggerClass(AuditLogger)\n\nimport myapp.payments  # its getLogger(__name__) now returns an AuditLogger",
    },
  ],

  examples: [
    { title: 'The defaults', code: 'import logging\n(logging.getLoggerClass() is logging.Logger, logging.getLogRecordFactory() is logging.LogRecord)', returns: '(True, True)' },
    { title: 'Only Logger subclasses are accepted', code: 'import logging\nlogging.setLoggerClass(dict)', returns: 'TypeError: logger not derived from logging.Logger: dict' },
    { title: 'Existing loggers keep their class', code: "import logging\nclass Tagged(logging.Logger):\n    pass\nbefore = logging.getLogger('payments.ex3')\nlogging.setLoggerClass(Tagged)\ntry:\n    after = logging.getLogger('payments.ex3.child')\nfinally:\n    logging.setLoggerClass(logging.Logger)\n(type(before).__name__, type(after).__name__, after.parent is before)", returns: "('Logger', 'Tagged', True)" },
    { title: 'Subclass whatever class is current', code: 'import logging\nclass MyLogger(logging.getLoggerClass()):\n    pass\nMyLogger.__mro__[1] is logging.Logger', returns: 'True' },
    { title: 'The factory gets the LogRecord arguments', code: "import logging\nseen = []\nold = logging.getLogRecordFactory()\ndef factory(name, level, fn, lno, msg, args, exc_info, func=None, sinfo=None, **kwargs):\n    seen.append((name, level, msg, args))\n    return old(name, level, fn, lno, msg, args, exc_info, func, sinfo, **kwargs)\nlog = logging.getLogger('payments.ex5')\nlog.addHandler(logging.NullHandler())\nlogging.setLogRecordFactory(factory)\ntry:\n    log.error('card %s declined', '4242')\nfinally:\n    logging.setLogRecordFactory(old)\nseen", returns: "[('payments.ex5', 40, 'card %s declined', ('4242',))]" },
    { title: 'makeLogRecord uses the factory too', code: "import logging\nold = logging.getLogRecordFactory()\ndef factory(*args, **kwargs):\n    record = old(*args, **kwargs)\n    record.region = 'eu-west'\n    return record\nlogging.setLogRecordFactory(factory)\ntry:\n    record = logging.makeLogRecord({'msg': 'hello'})\nfinally:\n    logging.setLogRecordFactory(old)\nrecord.region", returns: "'eu-west'" },
  ],

  pitfalls: [
    {
      name: 'Installing the class after the loggers exist',
      desc: 'A module-level getLogger(__name__) runs at import time. If setLoggerClass comes later, that logger is a plain Logger and the custom method is missing. Install the class first (or call it on the logger\'s own subclass from the start).',
      wrong: { label: 'getLogger first', code: "import logging\nclass AuditLogger(logging.Logger):\n    def audit(self, msg, *args):\n        self.warning('AUDIT ' + msg, *args)\nlog = logging.getLogger('payments.pit1')\nlogging.setLoggerClass(AuditLogger)\ntry:\n    log.audit('refund %s approved', 'r-77')\nfinally:\n    logging.setLoggerClass(logging.Logger)", output: "AttributeError: 'Logger' object has no attribute 'audit'" },
      fix:   { label: 'setLoggerClass first', code: "import logging, sys\nclass AuditLogger(logging.Logger):\n    def audit(self, msg, *args):\n        self.warning('AUDIT ' + msg, *args)\nlogging.setLoggerClass(AuditLogger)\ntry:\n    log = logging.getLogger('payments.pit1fix')\nfinally:\n    logging.setLoggerClass(logging.Logger)\nlog.propagate = False\nlog.addHandler(handler := logging.StreamHandler(sys.stdout))\nlog.audit('refund %s approved', 'r-77')\nlog.removeHandler(handler)", output: 'AUDIT refund r-77 approved' },
    },
    {
      name: 'A factory attribute that extra= also sets',
      desc: 'makeRecord applies extra= after the factory has run and refuses to overwrite an existing attribute. For a default that callers may override, use a Filter (it runs after extra= is applied) or Formatter(defaults=…).',
      wrong: { label: 'factory default', code: "import logging\nold = logging.getLogRecordFactory()\ndef factory(*args, **kwargs):\n    record = old(*args, **kwargs)\n    record.user = 'system'\n    return record\nlog = logging.getLogger('payments.pit2')\nlog.addHandler(logging.NullHandler())\nlogging.setLogRecordFactory(factory)\ntry:\n    log.warning('refund approved', extra={'user': 'ada'})\nfinally:\n    logging.setLogRecordFactory(old)", output: "KeyError: \"Attempt to overwrite 'user' in LogRecord\"" },
      fix:   { label: 'filter default', code: "import logging, sys\nclass DefaultUser(logging.Filter):\n    def filter(self, record):\n        if not hasattr(record, 'user'):\n            record.user = 'system'\n        return True\nlog = logging.getLogger('payments.pit2fix')\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(logging.Formatter('%(user)s: %(message)s'))\nlog.addHandler(handler)\nlog.addFilter(DefaultUser())\nlog.warning('refund approved', extra={'user': 'ada'})\nlog.warning('nightly sync done')\nlog.removeHandler(handler)", output: 'ada: refund approved\nsystem: nightly sync done' },
    },
  ],

  when: {
    use: [
      'setLoggerClass: an application-wide Logger subclass (extra convenience methods, a custom makeRecord)',
      'setLogRecordFactory: an attribute every record should carry (host, version, request id from a contextvar)',
      'The getters: extend the current class or factory without undoing someone else\'s',
    ],
    avoid: [
      'Context for some calls only → extra= or LoggerAdapter',
      'Changing output only → a Formatter (or Formatter(defaults=…))',
      'Library code → both hooks are process-wide and belong to the application',
    ],
  },

  notes: {
    cpython:       "setLoggerClass: if klass != Logger and not issubclass(klass, Logger): raise TypeError; then _loggerClass = klass. getLogger → Manager.getLogger instantiates (manager.loggerClass or _loggerClass)(name). setLogRecordFactory: _logRecordFactory = factory, used by Logger.makeRecord and makeLogRecord",
    'Per manager': 'logging.Logger.manager.setLoggerClass sets a class for one Manager only, and Manager.getLogger prefers it over the module-wide class. Manager.setLogRecordFactory only stores the factory on the manager: Logger.makeRecord always calls the module-wide factory, so it has no effect on records',
    'Root logger': 'The root logger is created at import as a RootLogger, so setLoggerClass never changes it',
    'Signature':   'The factory is called positionally with (name, level, fn, lno, msg, args, exc_info, func, sinfo); accept **kwargs so it keeps working if more are added',
  },

  related: [
    { name: 'logging.Logger', slug: 'logger', when: 'The class to subclass; makeRecord' },
    { name: 'logging.LogRecord', slug: 'logrecord', when: 'What the factory returns' },
    { name: 'logging.getLogger', slug: 'getlogger', when: 'Where the class is instantiated' },
    { name: 'logging.LoggerAdapter', slug: 'loggeradapter', when: 'Context without a subclass' },
    { name: 'logging.Filter', slug: 'filter', when: 'Add attributes per handler or logger' },
    { name: 'logging.addLevelName', slug: 'addlevelname', when: 'A custom level for a custom method' },
  ],

  faq: [
    {
      q: 'How do I create a custom logger class in Python?',
      a: 'Subclass logging.Logger (or logging.getLoggerClass()), keep __init__ callable with just a name, and call logging.setLoggerClass(MyLogger) before any getLogger() call that should return it. Keep using logging.getLogger(name) — never instantiate the subclass directly.',
    },
    {
      q: 'How do I add a custom field to every log record?',
      a: "Wrap the current factory: old = logging.getLogRecordFactory(); define factory(*args, **kwargs) that calls old(...), sets record.myfield and returns the record; then logging.setLogRecordFactory(factory). %(myfield)s is then available in every format string. A Filter attached to a handler works as well when only some output needs the field.",
    },
    {
      q: 'Why does setLoggerClass not affect my existing loggers?',
      a: 'Loggers are created once and cached by name. setLoggerClass only changes the class used for loggers created afterwards; a module that called getLogger(__name__) at import time keeps the plain Logger. Call setLoggerClass before those modules are imported.',
    },
    {
      q: 'What does "logger not derived from logging.Logger" mean?',
      a: 'setLoggerClass was given a class that is not logging.Logger or a subclass of it. Derive your class from logging.Logger (or from logging.getLoggerClass()).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.setLoggerClass',
    meta:  'logging.setLoggerClass',
  },

};
