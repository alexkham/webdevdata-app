// content/reference/python/stdlib/logging/handleerror.js

export const meta = {
  slug:        'handleerror',
  name:        'Handler.handleError',
  signature:   'Handler.handleError(record)  ·  logging.raiseExceptions = True',
  blurb:       'What a handler does when emitting a record fails: print a "--- Logging error ---" report to stderr and carry on. logging.raiseExceptions = False makes it silent.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'Handler.handleError raiseExceptions logging.raiseExceptions --- Logging error --- python logging error not all arguments converted during string formatting Message: Arguments: Call stack: logging swallows exceptions make logging errors raise in tests format requires a mapping',
};

export const method = {
  slug:      'handleerror',
  name:      'Handler.handleError',
  signature: 'Handler.handleError(record)  ·  logging.raiseExceptions',
  returns:   { type: 'None', desc: 'Writes the report to sys.stderr (when raiseExceptions is true) and returns; the record is not emitted.' },

  category:    'logging.Handler method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Logging must never take a program down, so the built-in handlers wrap emit() in try/except and pass failures to handleError(record). It prints "--- Logging error ---", the traceback, the call stack and the record’s msg and args to stderr — then the logging call returns normally and the line is simply missing from the log.',

  covers: ['Handler.handleError', 'raiseExceptions'],

  cheat: {
    commonCall: "self.handleError(record)  # in emit()'s except block",
    returns:    'None — a report on stderr, the line is lost',
    replaces:   'letting a logging failure crash the caller',
    watchOut:   'tests pass while log lines silently disappear',
  },

  parameters: [
    { name: 'record',          type: 'LogRecord', required: true,  default: null,   desc: 'The record that failed; its msg and args are printed at the end of the report.' },
    { name: 'raiseExceptions', type: 'bool',      required: false, default: 'True', desc: 'Module attribute. False: handleError prints nothing (and Logger.log stops rejecting non-int levels). It never makes the exception propagate.' },
  ],

  modes: [
    {
      id: 'report',
      label: 'the report',
      blurb: 'log.info(msg, arg) with a broken pair. The result is the unindented lines of what went to stderr (file and code lines left out).',
      params: [
        { name: 'msg', type: 'str', hint: 'a message',      input: 'text' },
        { name: 'arg', type: 'any', hint: 'one argument',   input: 'auto' },
      ],
      template: "import io, contextlib, logging\nlog = logging.getLogger('alerts')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\ntry:\n    with contextlib.redirect_stderr(io.StringIO()) as err:\n        log.info({$msg}, {$arg})\nfinally:\n    log.removeHandler(handler)\n[line for line in err.getvalue().splitlines() if not line.startswith(' ')]",
      cases: [
        { id: 'print',   label: "'total:', 42",      values: { msg: 'total:', arg: '42' } },
        { id: 'digit',   label: "'%d items', 'three'", values: { msg: '%d items', arg: 'three' } },
        { id: 'missing', label: "'%s and %s', 'ada'", values: { msg: '%s and %s', arg: 'ada' } },
        { id: 'named',   label: "'%(user)s paid'",    values: { msg: '%(user)s paid', arg: 'ada' } },
        { id: 'ok',      label: "'%s items', 3",      values: { msg: '%s items', arg: '3' } },
      ],
    },
    {
      id: 'switch',
      label: 'raiseExceptions',
      blurb: "Two calls: one broken ('ninety' for %d), one fine. Set logging.raiseExceptions (1 = True, 0 = False) and compare the log with stderr.",
      params: [{ name: 'flag', type: 'int', hint: '1 or 0', input: 'number' }],
      template: "import io, contextlib, logging\nlog = logging.getLogger('alerts.quiet')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\ntry:\n    logging.raiseExceptions = bool({$flag})\n    with contextlib.redirect_stderr(io.StringIO()) as err:\n        log.info('disk %d%% full', 'ninety')\n        log.info('disk %d%% full', 91)\nfinally:\n    logging.raiseExceptions = True\n    log.removeHandler(handler)\n(stream.getvalue(), err.getvalue().splitlines()[:1])",
      cases: [
        { id: 'on',  label: '1 (default)', values: { flag: '1' } },
        { id: 'off', label: '0',           values: { flag: '0' } },
      ],
    },
  ],
  demoExplainer: "Every failure follows the same shape: the header, the traceback of the formatting error (here TypeError from msg % args), 'Call stack:' with the frames of your logging call, then Message: (repr of msg) and Arguments: (the args tuple). A print-style call gives 'not all arguments converted during string formatting'; a %(name)s placeholder with a non-dict argument gives 'format requires a mapping'. A correct pair produces no report. In the second tab the broken call is lost either way and the good one is logged; raiseExceptions only decides whether the report appears.",

  patterns: [
    {
      name: 'The emit() skeleton of every handler',
      desc: 'Catch everything except RecursionError, as the standard handlers do.',
      code: "import logging\n\nclass MyHandler(logging.Handler):\n    def emit(self, record):\n        try:\n            msg = self.format(record)\n            self.deliver(msg)\n        except RecursionError:\n            raise\n        except Exception:\n            self.handleError(record)",
    },
    {
      name: 'Make logging errors fail your tests',
      desc: 'handleError runs inside the except block of emit(), so a bare raise re-raises the original error.',
      code: "import logging\n\nclass StrictHandler(logging.StreamHandler):\n    def handleError(self, record):\n        raise\n\nlogging.getLogger().addHandler(StrictHandler())",
    },
    {
      name: 'Silence logging errors in production',
      desc: 'The documented switch; the broken lines are still lost.',
      code: 'import logging\nlogging.raiseExceptions = False',
    },
  ],

  examples: [
    { title: 'The default',                     code: 'import logging\nlogging.raiseExceptions', returns: 'True' },
    { title: 'The report ends with msg and args', code: "import io, contextlib, logging\nlog = logging.getLogger('alerts.ex1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := logging.StreamHandler(io.StringIO()))\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.info('total:', 42)\nlog.removeHandler(handler)\nerr.getvalue().splitlines()[-2:]", returns: "[\"Message: 'total:'\", 'Arguments: (42,)']" },
    { title: 'A missing field: two chained errors', code: "import io, contextlib, logging\nlog = logging.getLogger('alerts.ex2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(io.StringIO())\nhandler.setFormatter(logging.Formatter('%(user)s %(message)s'))\nlog.addHandler(handler)\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.info('signed in')\nlog.removeHandler(handler)\n[line for line in err.getvalue().splitlines() if line.startswith(('KeyError', 'ValueError', 'During'))]", returns: "[\"KeyError: 'user'\", 'During handling of the above exception, another exception occurred:', \"ValueError: Formatting field not found in record: 'user'\"]" },
    { title: 'The caller sees no exception',    code: "import io, contextlib, logging\nlog = logging.getLogger('alerts.ex3')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := logging.StreamHandler(io.StringIO()))\ntry:\n    with contextlib.redirect_stderr(io.StringIO()):\n        log.info('total:', 42)\n    outcome = 'no exception'\nexcept TypeError:\n    outcome = 'caught'\nfinally:\n    log.removeHandler(handler)\noutcome", returns: "'no exception'" },
    { title: 'A strict handler re-raises',      code: "import io, logging\nclass StrictHandler(logging.StreamHandler):\n    def handleError(self, record):\n        raise\nlog = logging.getLogger('alerts.ex4')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := StrictHandler(io.StringIO()))\ntry:\n    log.info('total:', 42)\nfinally:\n    log.removeHandler(handler)", returns: 'TypeError: not all arguments converted during string formatting' },
    { title: 'raiseExceptions also relaxes log()', code: "import logging\nlog = logging.getLogger('alerts.ex5')\ntry:\n    logging.raiseExceptions = False\n    log.log('ERROR', 'not an int level')\n    outcome = 'returned quietly'\nfinally:\n    logging.raiseExceptions = True\noutcome", returns: "'returned quietly'" },
  ],

  pitfalls: [
    {
      name: 'Expecting a bad logging call to raise',
      desc: 'A test that only checks for exceptions passes, yet the line never reaches the log. In tests, attach a handler whose handleError re-raises.',
      wrong: { label: 'StreamHandler', code: "import io, contextlib, logging\nlog = logging.getLogger('alerts.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nwith contextlib.redirect_stderr(io.StringIO()):\n    log.info('retries:', 3)\nlog.removeHandler(handler)\nstream.getvalue()", output: "''" },
      fix:   { label: 'StrictHandler', code: "import io, logging\nclass StrictHandler(logging.StreamHandler):\n    def handleError(self, record):\n        raise\nlog = logging.getLogger('alerts.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := StrictHandler(io.StringIO()))\ntry:\n    log.info('retries:', 3)\nfinally:\n    log.removeHandler(handler)", output: 'TypeError: not all arguments converted during string formatting' },
    },
    {
      name: 'Hiding the problem with raiseExceptions = False',
      desc: 'It removes the report, not the bug: the record is still dropped, now without a trace. Fix the call instead.',
      wrong: { label: 'silenced', code: "import io, contextlib, logging\nlog = logging.getLogger('alerts.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\ntry:\n    logging.raiseExceptions = False\n    with contextlib.redirect_stderr(io.StringIO()) as err:\n        log.info('%s and %s', 'ada')\nfinally:\n    logging.raiseExceptions = True\n    log.removeHandler(handler)\n(stream.getvalue(), err.getvalue())", output: "('', '')" },
      fix:   { label: 'both arguments', code: "import io, logging\nlog = logging.getLogger('alerts.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nlog.info('%s and %s', 'ada', 'grace')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'ada and grace\\n'" },
    },
  ],

  when: {
    use: [
      'Calling self.handleError(record) from the except block of your own emit()',
      'Overriding handleError to re-raise in tests, or to count failures',
      'raiseExceptions = False only where nothing can show stderr anyway',
    ],
    avoid: [
      'Finding the bug: read the "Message:" and "Arguments:" lines of the report',
    ],
  },

  notes: {
    cpython:     "Handler.handleError in Lib/logging/__init__.py: if raiseExceptions and sys.stderr: write '--- Logging error ---', traceback.print_exception of the active exception, 'Call stack:' with the first frame outside the logging package, then 'Message: %r\\nArguments: %s' % (record.msg, record.args)",
    'No stderr': 'With sys.stderr set to None (pythonw, some services) the report is skipped silently',
    'Chains':    'A missing %(field)s shows two tracebacks — the KeyError and the ValueError raised while handling it — and an error inside your own except block adds that exception too',
  },

  related: [
    { name: 'logging.Handler', slug: 'handler', when: 'Where emit() and handleError live' },
    { name: 'StreamHandler', slug: 'streamhandler', when: 'Its emit() calls handleError' },
    { name: 'Logger.info and friends', slug: 'logger-info', when: 'Calls that produce these errors' },
    { name: 'logging.lastResort', slug: 'lastresort', when: 'The other thing that writes to stderr' },
    { name: '% formatting', slug: 'mod', when: 'The errors behind most reports', category: 'operators' },
  ],

  faq: [
    {
      q: 'What does "--- Logging error ---" mean in Python?',
      a: "A handler failed to emit a record — usually because msg % args did not work (wrong number of placeholders, %d with a str, a print-style call). The report on stderr shows the error, the call stack of your logging call and the Message and Arguments. That one line is dropped; the program keeps running.",
    },
    {
      q: 'How do I make logging errors raise exceptions?',
      a: 'Override handleError in a handler subclass with a bare raise (it runs inside the except block of emit(), so the original exception propagates). Use that handler in tests. logging.raiseExceptions = True does not do this — it only controls whether the report is printed.',
    },
    {
      q: 'What is logging.raiseExceptions?',
      a: 'A module-level flag, True by default. When it is False, handleError prints nothing, and Logger.log() returns quietly instead of raising TypeError for a non-int level. Despite its name, it never lets a handler exception propagate to the caller.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Handler.handleError',
    meta:  'Handler.handleError',
  },

};
