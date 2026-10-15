// content/reference/python/stdlib/logging/exception.js

export const meta = {
  slug:        'exception',
  name:        'logging.exception',
  signature:   'logging.exception(msg, *args, exc_info=True, **kwargs)',
  blurb:       'Log an ERROR together with the traceback of the exception being handled — call it inside an except block. Logger.exception is the same on a named logger.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging exception python log traceback logger.exception Logger.exception exc_info stack_info log exception with stack trace NoneType: None logging error with traceback except block sys.exc_info',
};

export const method = {
  slug:      'exception',
  name:      'logging.exception',
  signature: 'logging.exception(msg, *args, exc_info=True, **kwargs)  ·  Logger.exception(msg, *args, exc_info=True, **kwargs)',
  returns:   { type: 'None', desc: 'Logs one ERROR record whose text ends with the formatted traceback.' },

  category:    'logging function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'error() with exc_info=True: the handler appends "Traceback (most recent call last):", the frames and the exception line after your message. It reads the exception from sys.exc_info(), so it only makes sense inside except — elsewhere the traceback is the placeholder "NoneType: None".',

  covers: ['exception', 'Logger.exception'],

  cheat: {
    commonCall: "log.exception('could not save %s', path)  # inside except",
    returns:    'None — the ERROR line plus the full traceback',
    replaces:   'traceback.print_exc() next to a log call',
    watchOut:   'outside an except block the "traceback" is just NoneType: None',
  },

  parameters: [
    { name: 'msg',        type: 'str',  required: true,  default: null,   desc: 'The message, %-formatted with args.' },
    { name: '*args',      type: 'any',  required: false, default: '()',   desc: 'Values for the % placeholders in msg.' },
    { name: 'exc_info',   type: 'bool | BaseException | tuple', required: false, default: 'True', desc: 'True: sys.exc_info(). An exception instance (3.5+) or a (type, value, traceback) tuple logs that one instead. False: no traceback.' },
    { name: 'stack_info', type: 'bool', required: false, default: 'False', desc: 'Also append "Stack (most recent call last):" and the frames leading to this call.' },
    { name: 'extra',      type: 'dict', required: false, default: 'None', desc: 'Extra LogRecord attributes for the format string.' },
  ],

  modes: [
    {
      id: 'catch',
      label: 'in except',
      blurb: 'Look a key up in a settings dict; a KeyError is logged with log.exception. Frame lines (indented, file paths) are left out of the result.',
      params: [{ name: 'key', type: 'str', hint: 'a key to look up', input: 'text' }],
      template: "import io, logging\nlog = logging.getLogger('jobs')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\nconfig = {'host': 'db1', 'port': 5432}\ntry:\n    try:\n        value = config[{$key}]\n    except KeyError:\n        log.exception('missing setting %r', {$key})\nfinally:\n    log.removeHandler(handler)\n[line for line in stream.getvalue().splitlines() if not line.startswith(' ')]",
      cases: [
        { id: 'missing', label: "'user'",  values: { key: 'user' } },
        { id: 'found',   label: "'host'",  values: { key: 'host' } },
        { id: 'quote',   label: "it's",    values: { key: "it's" } },
        { id: 'case',    label: "'Host'",  values: { key: 'Host' } },
      ],
    },
    {
      id: 'instance',
      label: 'exc_info=exception',
      blurb: 'An exception object that was created but never raised, passed as exc_info.',
      params: [{ name: 'text', type: 'str', hint: 'the exception message', input: 'text' }],
      template: "import io, logging\nlog = logging.getLogger('jobs')\nlog.setLevel(logging.DEBUG)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\ntry:\n    log.error('rejected upload', exc_info=ValueError({$text}))\nfinally:\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'msg',   label: 'a message',     values: { text: 'file too large' } },
        { id: 'empty', label: 'empty message', values: { text: '' } },
      ],
    },
  ],
  demoExplainer: "A missing key gives three unindented lines: your message at ERROR, 'Traceback (most recent call last):' and the exception line — KeyError shows the key with repr quotes. A key that exists raises nothing, so nothing is logged. An exception that was never raised has no traceback, so only its type and message are appended — and a ValueError with an empty message is shown as the bare class name.",

  patterns: [
    {
      name: 'Log and continue',
      desc: 'Record the full traceback, keep the program running.',
      code: "import logging\nlog = logging.getLogger(__name__)\n\nfor path in paths:\n    try:\n        process(path)\n    except Exception:\n        log.exception('failed to process %s', path)",
    },
    {
      name: 'Log at another level with a traceback',
      desc: 'exception() always uses ERROR; any method takes exc_info=True.',
      code: "try:\n    response = fetch(url)\nexcept TimeoutError:\n    log.warning('retrying %s', url, exc_info=True)",
    },
    {
      name: 'Log, then re-raise to the caller',
      desc: 'Only if nobody further up logs it again — otherwise the traceback appears twice.',
      code: "try:\n    f = open(path)\nexcept OSError:\n    log.exception('could not open %s', path)\n    raise",
    },
  ],

  examples: [
    { title: 'Message, then the traceback (frame lines left out)', code: "import io, logging\nlog = logging.getLogger('jobs.import')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    log.exception('bad ratio')\nlog.removeHandler(handler)\n[line for line in stream.getvalue().splitlines() if not line.startswith(' ')]", returns: "['bad ratio', 'Traceback (most recent call last):', 'ZeroDivisionError: division by zero']" },
    { title: 'It logs at ERROR',                  code: "import io, logging\nlog = logging.getLogger('jobs.level')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s'))\nlog.addHandler(handler)\ntry:\n    {}['x']\nexcept KeyError:\n    log.exception('lookup failed')\nlog.removeHandler(handler)\nstream.getvalue().splitlines()[0]", returns: "'ERROR'" },
    { title: 'exc_info=False drops the traceback', code: "import io, logging\nlog = logging.getLogger('jobs.quiet')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\ntry:\n    int('x')\nexcept ValueError:\n    log.exception('not a number', exc_info=False)\nlog.removeHandler(handler)\nstream.getvalue()", returns: "'not a number\\n'" },
    { title: 'A traceback at WARNING level',      code: "import io, logging\nlog = logging.getLogger('jobs.warn')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\ntry:\n    open('missing.txt')\nexcept FileNotFoundError:\n    log.warning('using defaults', exc_info=True)\nlog.removeHandler(handler)\nstream.getvalue().splitlines()[-1]", returns: "\"FileNotFoundError: [Errno 2] No such file or directory: 'missing.txt'\"" },
    { title: 'stack_info adds the call stack',    code: "import io, logging\nlog = logging.getLogger('jobs.stack')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nlog.info('checkpoint', stack_info=True)\nlog.removeHandler(handler)\nstream.getvalue().splitlines()[:2]", returns: "['checkpoint', 'Stack (most recent call last):']" },
    { title: 'The record keeps the exception',    code: "import logging\nrecords = []\nlog = logging.getLogger('jobs.keep')\nlog.propagate = False\nlog.addFilter(records.append)\ntry:\n    [][3]\nexcept IndexError:\n    log.exception('boom')\nlog.filters.clear()\nrecord = records[0]\n(record.levelname, record.exc_info[0].__name__, str(record.exc_info[1]))", returns: "('ERROR', 'IndexError', 'list index out of range')" },
  ],

  pitfalls: [
    {
      name: 'Calling exception() outside an except block',
      desc: 'There is no exception being handled, so sys.exc_info() is (None, None, None) and the "traceback" is printed as NoneType: None. Use error() for errors you detect yourself.',
      wrong: { label: 'no except', code: "import io, logging\nlog = logging.getLogger('jobs.check')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nif 3 > 2:\n    log.exception('quota exceeded')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'quota exceeded\\nNoneType: None\\n'" },
      fix:   { label: 'error()', code: "import io, logging\nlog = logging.getLogger('jobs.check')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nif 3 > 2:\n    log.error('quota exceeded')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'quota exceeded\\n'" },
    },
    {
      name: 'Logging only the exception object',
      desc: "log.error(e) prints str(e) — 'division by zero' — with no type and no line numbers. exception() (or exc_info=True) keeps the traceback.",
      wrong: { label: 'log.error(e)', code: "import io, logging\nlog = logging.getLogger('jobs.lost')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\ntry:\n    1 / 0\nexcept ZeroDivisionError as e:\n    log.error(e)\nlog.removeHandler(handler)\nstream.getvalue().splitlines()", output: "['division by zero']" },
      fix:   { label: 'log.exception', code: "import io, logging\nlog = logging.getLogger('jobs.lost')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    log.exception('ratio failed')\nlog.removeHandler(handler)\n[line for line in stream.getvalue().splitlines() if not line.startswith(' ')]", output: "['ratio failed', 'Traceback (most recent call last):', 'ZeroDivisionError: division by zero']" },
    },
  ],

  when: {
    use: [
      'Inside except, when the error is handled and the program continues',
      'At the top of a worker loop or request handler, to record unexpected failures',
    ],
    avoid: [
      'Errors you detect yourself (no exception) → error()',
      'Expected, routine exceptions → a lower level without the traceback',
      'Logging and re-raising at every layer → log once, where it is handled',
    ],
  },

  notes: {
    cpython:     'Logger.exception(msg, *args, exc_info=True, **kwargs) simply calls self.error(...); Logger._log turns exc_info=True into sys.exc_info() and an exception instance into (type(e), e, e.__traceback__)',
    'Formatting': 'Formatter.formatException uses traceback.print_exception and caches the text in record.exc_text, so several handlers reuse it',
    'Module function': 'logging.exception logs on the root logger and, like logging.error, calls basicConfig() if the root logger has no handlers',
  },

  related: [
    { name: 'Logger.error and friends', slug: 'logger-info', when: 'exc_info= on every logging method' },
    { name: 'Formatter', slug: 'formatter', when: 'formatException and exc_text' },
    { name: 'try', slug: 'try', when: 'The except block exception() belongs in', category: 'keywords' },
    { name: 'raise', slug: 'raise', when: 'Re-raise after logging', category: 'keywords' },
    { name: 'logging.info and friends', slug: 'log-functions', when: 'Module-level calls on the root logger' },
  ],

  faq: [
    {
      q: 'How do I log an exception with its traceback in Python?',
      a: "Inside the except block call log.exception('what failed') — it logs at ERROR and appends the traceback. For another level use exc_info=True, e.g. log.warning('retrying', exc_info=True).",
    },
    {
      q: 'Why does my log show "NoneType: None"?',
      a: 'exception() or exc_info=True was used where no exception is being handled, so there was no traceback to print. Call it inside except, or use error() for conditions you detect yourself.',
    },
    {
      q: 'What is the difference between logger.exception and logger.error?',
      a: 'exception(msg) is error(msg, exc_info=True): same ERROR level, plus the traceback of the exception currently being handled. error() alone prints only the message.',
    },
    {
      q: 'Can I log an exception that I caught earlier and stored?',
      a: 'Yes — pass it as exc_info: log.error("job failed", exc_info=err). Since 3.5 an exception instance is accepted; its __traceback__ is used, so an exception that was never raised prints just its type and message.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Logger.exception',
    meta:  'Logger.exception',
  },

};
