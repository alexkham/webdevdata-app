// content/reference/python/stdlib/logging/logrecord.js

export const meta = {
  slug:        'logrecord',
  name:        'logging.LogRecord',
  signature:   'logging.LogRecord(name, level, pathname, lineno, msg, args, exc_info, func=None, sinfo=None)',
  blurb:       'One logging event: logger name, level, message template and arguments, source location, time, thread and process. Loggers create them; filters, formatters and handlers read them. makeLogRecord builds one from a dict.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging LogRecord python log record attributes LogRecord.getMessage makeLogRecord record.msg record.args record.message levelname levelno pathname filename module lineno funcName created msecs thread threadName process processName taskName exc_info stack_info create log record for tests',
};

export const method = {
  slug:      'logrecord',
  name:      'logging.LogRecord',
  signature: 'logging.LogRecord(name, level, pathname, lineno, msg, args, exc_info, func=None, sinfo=None)  ·  logging.makeLogRecord(dict)',
  returns:   { type: 'logging.LogRecord', desc: 'A record with the attributes listed below; makeLogRecord returns one whose __dict__ is updated from the dict.' },

  category:    'logging class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "A record keeps the message template (msg) and its arguments (args) separately; getMessage() merges them with str(msg) % args whenever asked, so the work is done only for records that are emitted. Everything a format string can show — %(levelname)s, %(lineno)d, %(threadName)s — is an attribute set when the record is created.",

  covers: ['LogRecord', 'LogRecord.getMessage', 'makeLogRecord'],

  cheat: {
    commonCall: 'record.getMessage()',
    returns:    "'order 1042 shipped' — str(msg) % args",
    replaces:   'record.msg % record.args by hand',
    watchOut:   'record.msg is the template, not the final text',
  },

  parameters: [
    { name: 'name',     type: 'str',        required: true,  default: null,   desc: 'Logger name.' },
    { name: 'level',    type: 'int',        required: true,  default: null,   desc: 'Numeric level; levelname is getLevelName(level). Not validated.' },
    { name: 'pathname', type: 'str',        required: true,  default: null,   desc: 'Source file path; filename and module are derived from it.' },
    { name: 'lineno',   type: 'int',        required: true,  default: null,   desc: 'Source line of the call.' },
    { name: 'msg',      type: 'Any',        required: true,  default: null,   desc: 'The message template, or any object (str() is applied).' },
    { name: 'args',     type: 'tuple | dict | None', required: true, default: null, desc: 'Arguments for msg % args. A 1-tuple holding a non-empty dict is unpacked to that dict.' },
    { name: 'exc_info', type: 'tuple | None', required: true, default: null,  desc: 'A (type, value, traceback) tuple or None.' },
    { name: 'func',     type: 'str | None', required: false, default: 'None', desc: 'Name of the calling function (funcName).' },
    { name: 'sinfo',    type: 'str | None', required: false, default: 'None', desc: 'Stack text (stack_info).' },
  ],

  attributes: [
    { name: 'name',            type: 'str',          meaning: 'Logger name' },
    { name: 'msg / args',      type: 'Any / tuple | dict', meaning: 'Template and arguments, merged by getMessage()' },
    { name: 'levelno / levelname', type: 'int / str', meaning: 'Numeric level and its name' },
    { name: 'pathname / filename / module', type: 'str', meaning: 'Full path, file name, file name without extension' },
    { name: 'lineno / funcName', type: 'int / str',  meaning: 'Line and function of the logging call' },
    { name: 'created',         type: 'float',        meaning: 'time.time_ns() / 1e9 at creation' },
    { name: 'msecs',           type: 'float',        meaning: 'Milliseconds part of created' },
    { name: 'relativeCreated', type: 'float',        meaning: 'Milliseconds since logging was imported' },
    { name: 'thread / threadName', type: 'int / str', meaning: 'Thread id and name' },
    { name: 'process / processName', type: 'int / str', meaning: 'Process id and name' },
    { name: 'taskName',        type: 'str | None',   meaning: 'asyncio task name (3.12+)' },
    { name: 'exc_info / exc_text', type: 'tuple | None / str | None', meaning: 'The exception tuple, and its text cached by Formatter.format' },
    { name: 'stack_info',      type: 'str | None',   meaning: 'Stack text when stack_info=True was passed' },
    { name: 'message / asctime', type: 'str',        meaning: 'Set by Formatter.format, not at creation' },
  ],

  modes: [
    {
      id: 'message',
      label: 'getMessage',
      blurb: "A record for logger 'shop.cart' at INFO, from shop/cart.py line 42, with your msg and one argument.",
      params: [
        { name: 'msg', type: 'str', hint: 'a message template', input: 'text' },
        { name: 'arg', type: 'any', hint: 'one argument',       input: 'auto' },
      ],
      template: "import logging\nrecord = logging.LogRecord('shop.cart', logging.INFO, 'shop/cart.py', 42, {$msg}, ({$arg},), None)\n(record.getMessage(), record.levelname, record.filename, record.module, record.lineno)",
      cases: [
        { id: 'ok',     label: "'order %s shipped'", values: { msg: 'order %s shipped', arg: '1042' } },
        { id: 'pct',    label: "'%.1f%% done'",      values: { msg: '%.1f%% done', arg: '99.25' } },
        { id: 'repr',   label: "'%r'",               values: { msg: '%r', arg: 'ada' } },
        { id: 'digit',  label: "'%d items'",         values: { msg: '%d items', arg: 'three' } },
        { id: 'extra',  label: 'no placeholder',     values: { msg: 'no placeholders', arg: '7' } },
      ],
    },
    {
      id: 'level',
      label: 'levelname',
      blurb: 'The constructor stores level as levelno and getLevelName(level) as levelname — without checking it.',
      params: [{ name: 'level', type: 'any', hint: '20, 25, …', input: 'auto' }],
      template: "import logging\nrecord = logging.LogRecord('shop', {$level}, 'app.py', 1, 'x', None, None)\n(record.levelno, record.levelname)",
      cases: [
        { id: 'info',   label: '20',      values: { level: '20' } },
        { id: 'custom', label: '25',      values: { level: '25' } },
        { id: 'zero',   label: '0',       values: { level: '0' } },
        { id: 'name',   label: "'INFO'",  values: { level: 'INFO' } },
      ],
    },
  ],
  demoExplainer: "getMessage applies % only when args is non-empty, and errors are raised right here — calling it yourself is the quickest way to see why a log line went missing. '%.1f' rounds 99.25 — exactly halfway — to the even digit, '99.2', and %% gives a literal percent sign. In the levelname tab, an unregistered number gives 'Level 25', and a str level is not converted: levelno stays 'INFO' while levelname becomes 20, because getLevelName also translates names to numbers.",

  patterns: [
    {
      name: 'Build records in tests',
      desc: 'makeLogRecord fills any attributes you need.',
      code: "import logging\nrecord = logging.makeLogRecord({'name': 'app', 'levelno': logging.ERROR, 'levelname': 'ERROR', 'msg': 'boom %s', 'args': (1,)})\nassert formatter.format(record).endswith('boom 1')",
    },
    {
      name: 'Rebuild a record received over the network',
      desc: 'SocketHandler pickles a dict made from record.__dict__; the receiver turns it back into a record.',
      code: "import logging, pickle\nrecord = logging.makeLogRecord(pickle.loads(payload))\nlogging.getLogger(record.name).handle(record)",
    },
    {
      name: 'Freeze arguments before queueing',
      desc: 'Records keep references to args; format them now when the objects may change.',
      code: "import logging\nlog = logging.getLogger(__name__)\nlog.info('state: %s', repr(state))",
    },
  ],

  examples: [
    { title: 'repr shows name, level, path, line, msg', code: "import logging\nrepr(logging.LogRecord('shop', logging.INFO, 'shop/cart.py', 42, 'order %s shipped', (1042,), None))", returns: "'<LogRecord: shop, 20, shop/cart.py, 42, \"order %s shipped\">'" },
    { title: 'Any object as msg',                 code: "import logging\nlogging.LogRecord('shop', 40, 'app.py', 1, ValueError('bad input'), None, None).getMessage()", returns: "'bad input'" },
    { title: 'A single dict argument',            code: "import logging\nrecord = logging.LogRecord('shop', 20, 'app.py', 1, '%(user)s paid', ({'user': 'ada'},), None)\n(record.args, record.getMessage())", returns: "({'user': 'ada'}, 'ada paid')" },
    { title: 'makeLogRecord',                     code: "import logging\nlogging.makeLogRecord({'msg': 'x %s', 'args': ('y',)}).getMessage()", returns: "'x y'" },
    { title: 'makeLogRecord starts from level None', code: 'import logging\nlogging.makeLogRecord({}).levelname', returns: "'Level None'" },
    { title: 'Copying a record',                  code: "import logging\nrecord = logging.LogRecord('shop', 20, 'app.py', 7, 'cart %s', ('opened',), None)\ncopy = logging.makeLogRecord(record.__dict__)\n(copy.getMessage(), copy.lineno, copy is record)", returns: "('cart opened', 7, False)" },
    { title: 'Path, file name, module',           code: "import logging\nrecord = logging.LogRecord('shop', 20, '/srv/app/billing.py', 1, 'x', None, None)\n(record.pathname, record.filename, record.module)", returns: "('/srv/app/billing.py', 'billing.py', 'billing')" },
    { title: 'Thread, process and task names',    code: "import logging\nrecord = logging.LogRecord('shop', 20, 'app.py', 1, 'x', None, None)\n(record.threadName, record.processName, record.taskName)", returns: "('MainThread', 'MainProcess', None)" },
  ],

  pitfalls: [
    {
      name: 'Checking record.msg instead of the message',
      desc: 'msg is the template; the values are in args. A filter that searches msg for a secret misses it when the secret is an argument. Use record.getMessage().',
      wrong: { label: 'record.msg', code: "import io, logging\nlog = logging.getLogger('shop.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.addFilter(lambda record: 'hunter2' not in record.msg)\nlog.addHandler(handler)\nlog.info('login %s:%s', 'ada', 'hunter2')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'login ada:hunter2\\n'" },
      fix:   { label: 'getMessage()', code: "import io, logging\nlog = logging.getLogger('shop.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.addFilter(lambda record: 'hunter2' not in record.getMessage())\nlog.addHandler(handler)\nlog.info('login %s:%s', 'ada', 'hunter2')\nlog.removeHandler(handler)\nstream.getvalue()", output: "''" },
    },
    {
      name: 'Mutable arguments formatted later',
      desc: 'The record stores a reference to each argument and formats it only when a handler emits it. With buffering or queue handlers that can be much later — after the object has changed. Pass a snapshot.',
      wrong: { label: 'the live list', code: "import logging\nrecords = []\nlog = logging.getLogger('shop.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addFilter(records.append)\ncart = ['apple']\nlog.info('cart: %s', cart)\ncart.append('pear')\nlog.filters.clear()\nrecords[0].getMessage()", output: "\"cart: ['apple', 'pear']\"" },
      fix:   { label: 'a copy', code: "import logging\nrecords = []\nlog = logging.getLogger('shop.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addFilter(records.append)\ncart = ['apple']\nlog.info('cart: %s', list(cart))\ncart.append('pear')\nlog.filters.clear()\nrecords[0].getMessage()", output: "\"cart: ['apple']\"" },
    },
  ],

  when: {
    use: [
      'Reading attributes in filters, formatters and custom handlers',
      'makeLogRecord in tests and when receiving records from another process',
    ],
    avoid: [
      'Creating records to log them → call the logger methods',
      'Adding attributes to every record → setLogRecordFactory, a filter or extra=',
    ],
  },

  notes: {
    cpython:      'LogRecord.__init__ in Lib/logging/__init__.py; getMessage(): msg = str(self.msg); if self.args: msg = msg % self.args',
    'Factory':    'Loggers create records through logging.getLogRecordFactory() (LogRecord by default); makeLogRecord(dict) calls the same factory with placeholder values, then updates __dict__',
    'Machine values': 'created, msecs, relativeCreated, thread and process depend on the moment and the process; the demos here leave them out',
    'Versions':   'processName 3.1, taskName 3.12',
  },

  related: [
    { name: 'logging.Formatter', slug: 'formatter', when: 'Turns records into text' },
    { name: 'logging.Filter', slug: 'filter', when: 'Receives records' },
    { name: 'logging.setLogRecordFactory', slug: 'setloggerclass', when: 'Customise record creation' },
    { name: 'Logger', slug: 'logger', when: 'makeRecord and findCaller' },
    { name: '% formatting', slug: 'mod', when: 'What getMessage applies', category: 'operators' },
  ],

  faq: [
    {
      q: 'What is the difference between record.msg, record.getMessage() and record.message?',
      a: 'msg is the template passed to the logging call, getMessage() returns str(msg) % args, and message is the result of getMessage() that Formatter.format stores on the record — it exists only after a formatter has run.',
    },
    {
      q: 'How do I create a LogRecord for a test?',
      a: "logging.makeLogRecord({'msg': 'disk %d%% full', 'args': (91,), 'levelname': 'WARNING'}) sets exactly the attributes you pass. The constructor needs all of name, level, pathname, lineno, msg, args and exc_info.",
    },
    {
      q: 'Which attributes does a LogRecord have?',
      a: 'name, msg, args, levelno, levelname, pathname, filename, module, lineno, funcName, created, msecs, relativeCreated, thread, threadName, process, processName, taskName, exc_info, exc_text and stack_info — plus message and asctime once formatted, and anything added through extra=.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logrecord-objects',
    meta:  'LogRecord Objects',
  },

};
