// content/reference/python/stdlib/logging/formatter.js

export const meta = {
  slug:        'formatter',
  name:        'logging.Formatter',
  signature:   "logging.Formatter(fmt=None, datefmt=None, style='%', validate=True, *, defaults=None)",
  blurb:       "Turn a LogRecord into text with a format string over the record's attributes — %(levelname)s, {name}, $message … — plus the traceback and stack when the record carries them.",
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+ (style 3.2, validate 3.8, defaults 3.10)',
  searchTerms: 'logging Formatter python log format string %(asctime)s %(levelname)s %(name)s %(message)s %(lineno)d %(funcName)s %(filename)s %(module)s %(process)d %(threadName)s style { $ str.format string.Template Formatter.format Formatter.formatMessage Formatter.usesTime Formatter.formatException Formatter.formatStack validate defaults Invalid format for % style Formatting field not found in record logrecord attributes',
};

export const method = {
  slug:      'formatter',
  name:      'logging.Formatter',
  signature: "logging.Formatter(fmt=None, datefmt=None, style='%', validate=True, *, defaults=None)",
  returns:   { type: 'logging.Formatter', desc: 'An object whose format(record) returns the text a handler writes.' },

  category:    'logging class',
  version:     'Python 2.3+ (style 3.2, validate 3.8, defaults 3.10)',
  hasLiveDemo: true,

  subtitle: "format(record) first computes record.message = record.getMessage() (msg % args), adds record.asctime if the format mentions it, then fills the format string from the record's attributes — with % by default, str.format for style='{' or string.Template for style='$'. A traceback (exc_info) and stack (stack_info) are appended on new lines.",

  covers: ['Formatter', 'Formatter.format', 'Formatter.formatMessage', 'Formatter.usesTime', 'Formatter.formatException', 'Formatter.formatStack'],

  cheat: {
    commonCall: "logging.Formatter('%(asctime)s %(levelname)-8s %(name)s: %(message)s')",
    returns:    "'2003-07-08 16:49:45,896 WARNING  checkout.cart: 3 items left'",
    replaces:   'prefixes glued onto every message by hand',
    watchOut:   "the format's syntax must match style= ('%' by default)",
  },

  parameters: [
    { name: 'fmt',      type: 'str | None',      required: false, default: 'None',  desc: "The format string; None means '%(message)s' (or '{message}' / '${message}' for the other styles)." },
    { name: 'datefmt',  type: 'str | None',      required: false, default: 'None',  desc: 'time.strftime format for %(asctime)s; None gives 2003-07-08 16:49:45,896.' },
    { name: 'style',    type: "'%' | '{' | '$'", required: false, default: "'%'",   desc: "Syntax of fmt: %-formatting, str.format, or string.Template (3.2+). Anything else raises ValueError: Style must be one of: %,{,$." },
    { name: 'validate', type: 'bool',            required: false, default: 'True',  desc: 'Check at construction that fmt contains at least one field in the chosen style (3.8+).' },
    { name: 'defaults', type: 'dict | None',     required: false, default: 'None',  desc: 'Values for custom fields that a record does not have (3.10+).' },
  ],

  attributes: [
    { name: '%(name)s',            type: 'str',   meaning: 'Name of the logger used for the call' },
    { name: '%(levelname)s',       type: 'str',   meaning: "Level name: 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'" },
    { name: '%(levelno)s',         type: 'int',   meaning: 'Numeric level' },
    { name: '%(message)s',         type: 'str',   meaning: 'msg % args — set by format()' },
    { name: '%(asctime)s',         type: 'str',   meaning: "Creation time as text, by default '2003-07-08 16:49:45,896'; set by format() when the format uses it" },
    { name: '%(created)f',         type: 'float', meaning: 'Creation time, seconds since the epoch' },
    { name: '%(msecs)d',           type: 'float', meaning: 'Millisecond part of the creation time' },
    { name: '%(relativeCreated)d', type: 'float', meaning: 'Milliseconds since the logging module was loaded' },
    { name: '%(pathname)s',        type: 'str',   meaning: 'Full path of the source file of the call' },
    { name: '%(filename)s',        type: 'str',   meaning: 'File name part of pathname' },
    { name: '%(module)s',          type: 'str',   meaning: 'filename without its extension' },
    { name: '%(funcName)s',        type: 'str',   meaning: "Function containing the call ('<module>' at top level)" },
    { name: '%(lineno)d',          type: 'int',   meaning: 'Source line of the call' },
    { name: '%(process)d',         type: 'int',   meaning: 'Process id' },
    { name: '%(processName)s',     type: 'str',   meaning: "Process name, 'MainProcess' in the main process" },
    { name: '%(thread)d',          type: 'int',   meaning: 'Thread id' },
    { name: '%(threadName)s',      type: 'str',   meaning: "Thread name, 'MainThread' in the main thread" },
    { name: '%(taskName)s',        type: 'str | None', meaning: 'asyncio task name, or None (3.12+)' },
  ],

  modes: [
    {
      id: 'style',
      label: 'format and style',
      blurb: "Logger 'checkout.cart' calls log.warning('%d items left', 3) on line 10. Write a format string and pick its style.",
      params: [
        { name: 'fmt',   type: 'str', hint: 'a format string',  input: 'text' },
        { name: 'style', type: 'str', hint: "'%', '{' or '$'",  input: 'text' },
      ],
      template: "import io, logging\nlog = logging.getLogger('checkout.cart')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter({$fmt}, style={$style}))\nlog.addHandler(handler)\ntry:\n    log.warning('%d items left', 3)\nfinally:\n    log.removeHandler(handler)\nstream.getvalue()",
      cases: [
        { id: 'percent', label: "'%'",              values: { fmt: '%(levelname)-8s|%(name)s|%(message)s', style: '%' } },
        { id: 'brace',   label: "'{'",              values: { fmt: '{levelname:<8}|{name}|{message}', style: '{' } },
        { id: 'dollar',  label: "'$'",              values: { fmt: '${levelname}|$name|$message', style: '$' } },
        { id: 'where',   label: 'lineno, funcName', values: { fmt: '%(lineno)d %(funcName)s %(message)s', style: '%' } },
        { id: 'raw',     label: 'msg and args',     values: { fmt: '%(levelno)s %(msg)s %(args)s', style: '%' } },
        { id: 'wrong',   label: '{} with %',        values: { fmt: '{levelname} {message}', style: '%' } },
      ],
    },
    {
      id: 'defaults',
      label: 'defaults=',
      blurb: "The format uses a custom field, %(user)s, with defaults={'user': 'anonymous'}. The first call has no extra, the second passes extra={'user': …}.",
      params: [{ name: 'user', type: 'any', hint: 'a user name', input: 'auto' }],
      template: "import io, logging\nlog = logging.getLogger('checkout.views')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('[%(user)s] %(message)s', defaults={'user': 'anonymous'}))\nlog.addHandler(handler)\ntry:\n    log.info('page viewed')\n    log.info('page viewed', extra={'user': {$user}})\nfinally:\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'name',  label: "'ada'", values: { user: 'ada' } },
        { id: 'int',   label: '42',    values: { user: '42' } },
        { id: 'empty', label: "''",    values: { user: '' } },
      ],
    },
  ],
  demoExplainer: "The three styles produce the same line from the same record: %(levelname)-8s and {levelname:<8} both pad to 8 characters, and $-style has no padding syntax at all. %(lineno)d and %(funcName)s describe the logging call — line 10, at module level — while %(msg)s and %(args)s are the raw template and its tuple. A {}-format with the default style='%' is rejected when the Formatter is created: ValueError: Invalid format '{levelname} {message}' for '%' style. (%(filename)s, %(pathname)s, %(module)s and the time and process fields depend on where and when the code runs, so the browser demo does not invent them.) In the defaults tab the record without extra falls back to 'anonymous'; extra= wins when present, even when it is an empty string.",

  patterns: [
    {
      name: 'A typical application format',
      desc: 'Time, padded level, logger name, message.',
      code: "import logging\nformatter = logging.Formatter('%(asctime)s %(levelname)-8s %(name)s: %(message)s')",
    },
    {
      name: 'The same with str.format syntax',
      desc: "style='{' also allows format specs and conversions.",
      code: "import logging\nformatter = logging.Formatter('{asctime} {levelname:<8} {name}: {message}', style='{')",
    },
    {
      name: 'Single-line tracebacks for log collectors',
      desc: 'Override formatException; format() appends its result after the message.',
      code: "import logging\n\nclass OneLineFormatter(logging.Formatter):\n    def formatException(self, ei):\n        return repr(super().formatException(ei))",
    },
    {
      name: 'A custom field that may be missing',
      desc: 'defaults= (3.10+) fills fields only some records carry via extra=.',
      code: "import logging\nformatter = logging.Formatter('%(asctime)s [%(request_id)s] %(message)s', defaults={'request_id': '-'})",
    },
  ],

  examples: [
    { title: "The default format is '%(message)s'", code: "import logging\nlogging.Formatter().format(logging.makeLogRecord({'msg': 'hi %s', 'args': ('ada',)}))", returns: "'hi ada'" },
    { title: 'format() stores record.message', code: "import logging\nrecord = logging.makeLogRecord({'msg': 'hi %s', 'args': ('ada',)})\nlogging.Formatter('%(message)s').format(record)\nrecord.message", returns: "'hi ada'" },
    { title: 'usesTime() looks for asctime',   code: "import logging\n(logging.Formatter('%(asctime)s %(message)s').usesTime(), logging.Formatter('{message}', style='{').usesTime())", returns: '(True, False)' },
    { title: 'formatException',                code: 'import sys, logging\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    ei = sys.exc_info()\nlogging.Formatter().formatException(ei).splitlines()[-1]', returns: "'ZeroDivisionError: division by zero'" },
    { title: 'formatMessage formats only the message part', code: "import logging\nclass Shouting(logging.Formatter):\n    def formatMessage(self, record):\n        return super().formatMessage(record).upper()\nShouting('%(levelname)s %(message)s').format(logging.makeLogRecord({'msg': 'disk full', 'levelname': 'WARNING'}))", returns: "'WARNING DISK FULL'" },
    { title: 'A cached exc_text is appended',  code: "import logging\nrecord = logging.makeLogRecord({'msg': 'failed', 'exc_text': 'Traceback (cached)'})\nlogging.Formatter().format(record)", returns: "'failed\\nTraceback (cached)'" },
    { title: 'validate=False skips the check', code: "import logging\nlogging.Formatter('{message}', validate=False).format(logging.makeLogRecord({'msg': 'hi'}))", returns: "'{message}'" },
    { title: 'A format without fields is rejected', code: "import logging\nlogging.Formatter('no fields at all')", returns: "ValueError: Invalid format 'no fields at all' for '%' style" },
  ],

  pitfalls: [
    {
      name: 'A {} format with the default style',
      desc: "style defaults to '%', so a str.format-style string fails validation when the Formatter is built. Pass style='{' (or '$' for $name).",
      wrong: { label: "no style=", code: "import logging\nlogging.Formatter('{asctime} {levelname} {message}')", output: "ValueError: Invalid format '{asctime} {levelname} {message}' for '%' style" },
      fix:   { label: "style='{'", code: "import logging\nformatter = logging.Formatter('{asctime} {levelname} {message}', style='{')\nformatter.usesTime()", output: 'True' },
    },
    {
      name: 'A placeholder without its conversion letter',
      desc: "'%(levelname) %(message)s' passes validation (one field is fine), but formatting it fails on every record: each line is lost and a Logging error report goes to stderr. Every %(name) needs a type such as s or d.",
      wrong: { label: '%(levelname)', code: "import io, contextlib, logging\nlog = logging.getLogger('checkout.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname) %(message)s'))\nlog.addHandler(handler)\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.info('cache cleared')\nlog.removeHandler(handler)\n(stream.getvalue(), [line for line in err.getvalue().splitlines() if line.startswith('ValueError')])", output: "('', [\"ValueError: unsupported format character '%' (0x25) at index 13\"])" },
      fix:   { label: '%(levelname)s', code: "import io, logging\nlog = logging.getLogger('checkout.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\nlog.info('cache cleared')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'INFO cache cleared\\n'" },
    },
    {
      name: 'A custom field that only some records have',
      desc: "Records logged without extra={'request_id': …} have no such attribute; formatting fails and the line is dropped. Give the field a default.",
      wrong: { label: 'no default', code: "import io, contextlib, logging\nlog = logging.getLogger('checkout.pit3')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('[%(request_id)s] %(message)s'))\nlog.addHandler(handler)\nwith contextlib.redirect_stderr(io.StringIO()):\n    log.info('cache cleared')\nlog.removeHandler(handler)\nstream.getvalue()", output: "''" },
      fix:   { label: 'defaults=', code: "import io, logging\nlog = logging.getLogger('checkout.pit3')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('[%(request_id)s] %(message)s', defaults={'request_id': '-'}))\nlog.addHandler(handler)\nlog.info('cache cleared')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'[-] cache cleared\\n'" },
    },
  ],

  when: {
    use: [
      'Every handler that writes text: one Formatter per output layout',
      "style='{' when you want format specs ({levelname:<8}, {msecs:03.0f})",
      'Subclassing to change exceptions, stacks or the whole layout (JSON lines)',
    ],
    avoid: [
      'Per-call formatting of the message → arguments to the logging call',
      'Changing dates only → datefmt, or the formatTime hooks',
    ],
  },

  notes: {
    cpython:     'Formatter in Lib/logging/__init__.py with PercentStyle, StrFormatStyle and StringTemplateStyle; format(): message = getMessage(), asctime if usesTime(), formatMessage(), then exc_text (from formatException, cached on the record) and formatStack(stack_info) on new lines',
    'Validation': "validate=True (3.8+) requires at least one field of the chosen style; '%'-style fields are checked with a regex, so a field missing its conversion letter can slip through",
    'Missing fields': "A KeyError while formatting becomes ValueError('Formatting field not found in record: …'), which the handler reports through handleError",
    'Styles':    "'{' uses str.format (format specs, !r/!s/!a, attribute and index access); '$' uses string.Template.substitute ($$ for a literal $)",
  },

  related: [
    { name: 'Formatter.formatTime', slug: 'formattime', when: 'asctime, datefmt, UTC timestamps, milliseconds' },
    { name: 'LogRecord', slug: 'logrecord', when: 'The attributes a format string reads' },
    { name: 'Handler.setFormatter', slug: 'handler', when: 'Attach a formatter to a handler' },
    { name: 'BufferingFormatter', slug: 'bufferingformatter', when: 'Format a batch of records' },
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'format=, datefmt=, style= in one call' },
    { name: 'str.format()', slug: 'str-format', when: "The syntax of style='{'", category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I change the format of Python log messages?',
      a: "Create logging.Formatter('%(asctime)s %(levelname)s %(name)s: %(message)s') and attach it with handler.setFormatter(formatter), or pass format= to logging.basicConfig. The available fields are the LogRecord attributes listed above.",
    },
    {
      q: "What does \"ValueError: Invalid format '…' for '%' style\" mean?",
      a: "The format string has no field in the syntax style= expects — typically a {name} format without style='{'. Pass the matching style, or fix the placeholders.",
    },
    {
      q: 'How do I show the file name and line number in logs?',
      a: 'Add %(filename)s:%(lineno)d (or %(pathname)s for the full path) and %(funcName)s for the function. They describe the line that called the logging method; use stacklevel= when a helper function does the logging.',
    },
    {
      q: 'How do I add milliseconds or change the date format?',
      a: "datefmt= takes a time.strftime format ('%H:%M:%S'). strftime has no milliseconds, so add %(msecs)03d to the format string, or use the default asctime, which already ends in ',123'.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#formatter-objects',
    meta:  'Formatter Objects',
  },

};
