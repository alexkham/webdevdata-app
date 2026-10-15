// content/reference/python/stdlib/logging/logger-info.js

export const meta = {
  slug:        'logger-info',
  name:        'Logger.info / debug / warning / error / critical / log',
  signature:   'Logger.info(msg, *args, exc_info=None, stack_info=False, stacklevel=1, extra=None)',
  blurb:       'Log a message at a level on a named logger. The %-placeholders in msg are filled from args only if the record is actually emitted.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'Logger.debug Logger.info Logger.warning Logger.warn Logger.error Logger.critical Logger.fatal Logger.log logger.info python log message with arguments %s lazy formatting extra stacklevel stack_info exc_info level must be an integer not all arguments converted during string formatting logging error',
};

export const method = {
  slug:      'logger-info',
  name:      'Logger.info / debug / warning / error / critical / log',
  signature: 'Logger.debug|info|warning|error|critical(msg, *args, exc_info=None, stack_info=False, stacklevel=1, extra=None)  ·  Logger.log(level, msg, *args, **kwargs)',
  returns:   { type: 'None', desc: 'Creates a LogRecord and passes it to the handlers, if the level is enabled.' },

  category:    'logging.Logger method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "The everyday calls. log.info('order %s shipped', order_id) checks the level first, and only when the record will be handled does msg % args run — so pass values as arguments, not pre-formatted. A broken format does not raise: the line is dropped and a '--- Logging error ---' report goes to stderr.",

  covers: ['Logger.debug', 'Logger.info', 'Logger.warning', 'Logger.warn', 'Logger.error', 'Logger.critical', 'Logger.fatal', 'Logger.log'],

  cheat: {
    commonCall: "log.info('order %s shipped to %s', order_id, city)",
    returns:    'None — a line through every handler the record reaches',
    replaces:   'print() for diagnostics',
    watchOut:   "commas like print('total:', n) break the % formatting",
  },

  parameters: [
    { name: 'level',      type: 'int',  required: true,  default: null,    desc: 'log() only: the numeric level. A str raises TypeError: level must be an integer.' },
    { name: 'msg',        type: 'str',  required: true,  default: null,    desc: 'The message; with args it is a %-format string. Non-str objects are converted with str().' },
    { name: '*args',      type: 'any',  required: false, default: '()',    desc: 'Values for the % placeholders, merged only when the record is emitted. A single dict enables %(key)s.' },
    { name: 'exc_info',   type: 'bool | exception | tuple', required: false, default: 'None', desc: 'True: add the traceback of the exception being handled; an exception instance: add its traceback.' },
    { name: 'stack_info', type: 'bool', required: false, default: 'False', desc: 'Append "Stack (most recent call last):" and the current call stack.' },
    { name: 'stacklevel', type: 'int',  required: false, default: '1',     desc: 'Attribute the record to the caller N frames up — for logging helper functions (3.8+).' },
    { name: 'extra',      type: 'dict', required: false, default: 'None',  desc: "Extra LogRecord attributes for the format string. Keys may not clash with existing attributes ('name', 'msg', …)." },
  ],

  modes: [
    {
      id: 'call',
      label: 'log(level, msg, arg)',
      blurb: 'The logger is at DEBUG with a "%(levelname)s %(message)s" handler. Pick a level, a message and one argument.',
      params: [
        { name: 'level', type: 'int', hint: '10, 20, 35 …',                input: 'auto' },
        { name: 'msg',   type: 'str', hint: 'a message with a placeholder', input: 'text' },
        { name: 'arg',   type: 'any', hint: 'the value for it',             input: 'auto' },
      ],
      template: "import io, logging\nlog = logging.getLogger('orders')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\ntry:\n    log.log({$level}, {$msg}, {$arg})\nfinally:\n    log.removeHandler(handler)\nstream.getvalue()",
      cases: [
        { id: 'info',   label: '20, %s',          values: { level: '20', msg: 'order %s shipped', arg: '1042' } },
        { id: 'error',  label: '40, %d',          values: { level: '40', msg: 'payment failed after %d tries', arg: '3' } },
        { id: 'custom', label: '35 (no name)',    values: { level: '35', msg: 'stock low: %s', arg: 'SKU-7' } },
        { id: 'low',    label: '5 (below DEBUG)', values: { level: '5', msg: 'cache hit for %s', arg: 'cart' } },
        { id: 'print',  label: 'print-style',     values: { level: '20', msg: 'total:', arg: '42' } },
        { id: 'str',    label: "'INFO' as level", values: { level: 'INFO', msg: 'order %s shipped', arg: '1042' } },
      ],
    },
    {
      id: 'extra',
      label: 'extra=',
      blurb: 'The format string uses a custom field, %(customer)s. Supply it through extra= with a key and a value.',
      params: [
        { name: 'key',   type: 'str', hint: 'the extra key', input: 'text' },
        { name: 'value', type: 'any', hint: 'its value',     input: 'auto' },
      ],
      template: "import io, logging\nlog = logging.getLogger('orders')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s [%(customer)s] %(message)s'))\nlog.addHandler(handler)\ntry:\n    log.warning('refund requested', extra={{$key}: {$value}})\nfinally:\n    log.removeHandler(handler)\nstream.getvalue()",
      cases: [
        { id: 'ok',      label: 'customer',          values: { key: 'customer', value: 'ada' } },
        { id: 'int',     label: 'an int value',      values: { key: 'customer', value: '1042' } },
        { id: 'missing', label: 'another key',       values: { key: 'client', value: 'ada' } },
        { id: 'clash',   label: "'msg' (reserved)",  values: { key: 'msg', value: 'ada' } },
      ],
    },
  ],
  demoExplainer: "Level 35 has no registered name, so %(levelname)s prints 'Level 35'; level 5 is below the logger's DEBUG and nothing is formatted at all. The print-style call passes 42 for a message without a placeholder: 'total:' % (42,) fails with TypeError: not all arguments converted during string formatting inside the handler, so the line is lost and the report goes to stderr — the result is empty. A str level is rejected up front. With extra=, the key becomes a record attribute: the wrong key leaves %(customer)s unfilled (the line is dropped with a report on stderr), and a key that already exists on the record raises KeyError in the caller.",

  patterns: [
    {
      name: 'Values as arguments, not pre-formatted',
      desc: 'The message is only built when a handler will emit it.',
      code: "import logging\nlog = logging.getLogger(__name__)\nlog.debug('cart %s has %d items', cart_id, len(items))",
    },
    {
      name: 'Context for every line of a request',
      desc: 'extra= puts fields on the record; the format string prints them.',
      code: "import logging\nlog = logging.getLogger(__name__)\nlog.info('payment accepted', extra={'request_id': request_id, 'user': user.name})",
    },
    {
      name: 'A logging helper that reports its caller',
      desc: "stacklevel=2 makes %(funcName)s and %(lineno)d point at the helper's caller.",
      code: "import logging\nlog = logging.getLogger(__name__)\n\ndef audit(event, *args):\n    log.info('AUDIT ' + event, *args, stacklevel=2)",
    },
    {
      name: 'Level chosen at run time',
      desc: 'log() takes the level as a number.',
      code: "import logging\nlog = logging.getLogger(__name__)\nlog.log(logging.WARNING if retries else logging.INFO, 'sync finished after %d retries', retries)",
    },
  ],

  examples: [
    { title: '%-style arguments',                code: "import logging, sys\nlog = logging.getLogger('orders.ex1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nlog.addHandler(handler)\nlog.warning('disk %d%% full on %s', 93, '/var')\nlog.removeHandler(handler)", returns: 'disk 93% full on /var' },
    { title: 'Disabled levels skip the formatting', code: "import logging\nclass Expensive:\n    def __str__(self):\n        print('formatting!')\n        return 'big report'\nlog = logging.getLogger('orders.ex2')\nlog.setLevel(logging.INFO)\nlog.debug('state: %s', Expensive())\n'nothing printed'", returns: "'nothing printed'" },
    { title: 'One dict argument fills %(key)s',  code: "import logging, sys\nlog = logging.getLogger('orders.ex3')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nlog.addHandler(handler)\nlog.info('%(user)s paid %(amount).2f', {'user': 'ada', 'amount': 19.5})\nlog.removeHandler(handler)", returns: 'ada paid 19.50' },
    { title: 'stacklevel=2 names the caller',    code: "import logging, sys\nlog = logging.getLogger('orders.ex4')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(logging.Formatter('%(funcName)s: %(message)s'))\nlog.addHandler(handler)\ndef audit(event):\n    log.info(event, stacklevel=2)\ndef checkout():\n    audit('order placed')\ncheckout()\nlog.removeHandler(handler)", returns: 'checkout: order placed' },
    { title: 'log() wants an int level',         code: "import logging\nlogging.getLogger('orders.ex5').log('ERROR', 'failed')", returns: 'TypeError: level must be an integer' },
    { title: 'fatal() is critical()',            code: "import logging, sys\nlog = logging.getLogger('orders.ex6')\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\nlog.fatal('giving up')\nlog.removeHandler(handler)", returns: 'CRITICAL giving up' },
    { title: 'warn() is deprecated',             code: "import logging, warnings\nlog = logging.getLogger('orders.ex7')\nlog.setLevel(logging.ERROR)\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    log.warn('old spelling')\nstr(caught[0].message)", returns: "\"The 'warn' method is deprecated, use 'warning' instead\"" },
  ],

  pitfalls: [
    {
      name: 'Calling it like print()',
      desc: "Extra positional arguments are % arguments. 'total:' has no placeholder, so formatting fails inside the handler: the line is lost and a '--- Logging error ---' report is written to stderr instead of an exception in your code.",
      wrong: { label: "log.info('total:', n)", code: "import io, contextlib, logging\nlog = logging.getLogger('orders.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream, err = io.StringIO(), io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nwith contextlib.redirect_stderr(err):\n    log.info('total:', 42)\nlog.removeHandler(handler)\n(stream.getvalue(), err.getvalue().splitlines()[0])", output: "('', '--- Logging error ---')" },
      fix:   { label: "'total: %s'", code: "import io, contextlib, logging\nlog = logging.getLogger('orders.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream, err = io.StringIO(), io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nwith contextlib.redirect_stderr(err):\n    log.info('total: %s', 42)\nlog.removeHandler(handler)\n(stream.getvalue(), err.getvalue())", output: "('total: 42\\n', '')" },
    },
    {
      name: 'Passing the values as one tuple',
      desc: 'A tuple is one argument. Two placeholders need two arguments — unpack the tuple with *.',
      wrong: { label: 'pair', code: "import io, contextlib, logging\nlog = logging.getLogger('orders.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\npair = ('ada', 'grace')\nwith contextlib.redirect_stderr(io.StringIO()):\n    log.info('%s and %s', pair)\nlog.removeHandler(handler)\nstream.getvalue()", output: "''" },
      fix:   { label: '*pair', code: "import io, contextlib, logging\nlog = logging.getLogger('orders.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\npair = ('ada', 'grace')\nwith contextlib.redirect_stderr(io.StringIO()):\n    log.info('%s and %s', *pair)\nlog.removeHandler(handler)\nstream.getvalue()", output: "'ada and grace\\n'" },
    },
    {
      name: 'An extra key that is already a record attribute',
      desc: "extra= cannot overwrite the attributes every record has (name, msg, args, levelname, message, asctime, …). Unlike a formatting error, this raises KeyError in your code. Pick a different key.",
      wrong: { label: "extra={'name': …}", code: "import logging\nlog = logging.getLogger('orders.pit3')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.info('signed up', extra={'name': 'ada'})", output: "KeyError: \"Attempt to overwrite 'name' in LogRecord\"" },
      fix:   { label: "extra={'username': …}", code: "import io, logging\nlog = logging.getLogger('orders.pit3')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(username)s %(message)s'))\nlog.addHandler(handler)\nlog.info('signed up', extra={'username': 'ada'})\nlog.removeHandler(handler)\nstream.getvalue()", output: "'ada signed up\\n'" },
    },
  ],

  when: {
    use: [
      'Every diagnostic message in modules and libraries, on a logger from getLogger(__name__)',
      'log(level, …) when the level is decided at run time',
    ],
    avoid: [
      'Inside except blocks when you want the traceback → exception() or exc_info=True',
      'warn() and fatal() → warning() and critical()',
      'Program output that is the point of a command-line tool → print()',
    ],
  },

  notes: {
    cpython:     'Each method checks self.isEnabledFor(LEVEL) and calls self._log(LEVEL, msg, args, **kwargs), which builds the record with makeRecord and hands it to handle(); log() first raises TypeError for a non-int level when logging.raiseExceptions is true',
    'Formatting': 'LogRecord.getMessage does str(msg) % args only when a handler formats the record; errors there go to Handler.handleError',
    'warn':       "Logger.warn emits DeprecationWarning (\"The 'warn' method is deprecated, use 'warning' instead\"); Logger.fatal is a plain alias of critical",
  },

  related: [
    { name: 'logging.exception', slug: 'exception', when: 'error() plus the current traceback' },
    { name: 'Logger.setLevel', slug: 'logger-setlevel', when: 'Which of these calls get through' },
    { name: 'LogRecord', slug: 'logrecord', when: 'What a call creates; getMessage does the % merge' },
    { name: 'LoggerAdapter', slug: 'loggeradapter', when: 'The same calls with extra context built in' },
    { name: 'logging.info and friends', slug: 'log-functions', when: 'Module-level versions on the root logger' },
    { name: '% formatting', slug: 'mod', when: 'The formatting msg % args uses', category: 'operators' },
  ],

  faq: [
    {
      q: 'Why use log.info("x %s", value) instead of an f-string?',
      a: 'With arguments, the string is only built when a handler will emit the record; a disabled debug() call costs almost nothing. An f-string is evaluated before the call every time, and it turns every message into a different string, which makes log aggregation by message template impossible.',
    },
    {
      q: 'What does "--- Logging error ---" mean?',
      a: "A handler failed while formatting or writing a record — most often msg % args did not fit (wrong number of %s, a %d with a str, a print-style call). The traceback and the message/arguments follow on stderr; the record itself is dropped and your program continues.",
    },
    {
      q: 'How do I add custom fields like a request id to log lines?',
      a: "Pass extra={'request_id': rid} and use %(request_id)s in the format string. To attach the same fields to many calls, wrap the logger in a LoggerAdapter or use a filter that sets the attribute on every record.",
    },
    {
      q: 'What is stacklevel for?',
      a: "When you wrap logging calls in your own helper function, %(funcName)s, %(lineno)d and %(pathname)s would all point at the helper. stacklevel=2 (Python 3.8+) skips one frame so they describe the helper's caller.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Logger.debug',
    meta:  'Logger.debug and the other level methods',
  },

};
