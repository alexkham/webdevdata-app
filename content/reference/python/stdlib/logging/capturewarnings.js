// content/reference/python/stdlib/logging/capturewarnings.js

export const meta = {
  slug:        'capturewarnings',
  name:        'logging.captureWarnings',
  signature:   'logging.captureWarnings(capture)',
  blurb:       "Send the warnings module's output through logging: with captureWarnings(True), every warning that passes the warnings filters is logged at WARNING on the logger named 'py.warnings' instead of being printed to stderr.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.7+ / 3.1+',
  searchTerms: 'logging captureWarnings python redirect warnings to logging py.warnings logger log warnings to file capture warnings in log warnings.warn logging DeprecationWarning in logs warnings.showwarning formatwarning warnings disappear after captureWarnings blank line after warning',
};

export const method = {
  slug:      'capturewarnings',
  name:      'logging.captureWarnings',
  signature: 'logging.captureWarnings(capture)',
  returns:   { type: 'None', desc: 'captureWarnings(True) replaces warnings.showwarning with a function that logs; captureWarnings(False) puts back the showwarning that was in place before.' },

  category:    'logging function',
  version:     'Python 2.7+ / 3.1+',
  hasLiveDemo: true,

  subtitle: "With capture on, warnings.showwarning is replaced: each warning the warnings filters let through is turned into text by warnings.formatwarning() and passed, whole, as the message of logging.getLogger('py.warnings').warning(). The filters still decide which warnings exist; logging decides where they go and how they look. Configure a handler first — on 'py.warnings' or the root logger — or captured warnings vanish.",

  covers: ['captureWarnings'],

  cheat: {
    commonCall: 'logging.captureWarnings(True)',
    returns:    "None — warnings now go to the 'py.warnings' logger",
    replaces:   'warnings printed straight to stderr, outside your log format and files',
    watchOut:   "without a handler on 'py.warnings' or the root logger, warnings disappear",
  },

  parameters: [
    { name: 'capture', type: 'bool', required: true, default: null, desc: "Truthy: install the logging hook (a second call does nothing). Falsy: restore the showwarning saved by the first call and stop capturing." },
  ],

  modes: [
    {
      id: 'capture',
      label: 'on / off',
      blurb: "A handler on 'py.warnings' writes to one buffer, stderr is redirected to another. Switch capturing on or off and issue one UserWarning.",
      params: [
        { name: 'capture', type: 'int',  hint: '1 = captureWarnings(True), 0 = False', input: 'number' },
        { name: 'message', type: 'str',  hint: 'the warning text',                    input: 'text' },
      ],
      template: "import contextlib, io, logging, warnings\nlog = logging.getLogger('py.warnings')\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(name)s %(levelname)s | %(message)s'))\nlog.addHandler(handler)\nlogging.captureWarnings(bool({$capture}))\ntry:\n    with warnings.catch_warnings(), contextlib.redirect_stderr(io.StringIO()) as err:\n        warnings.simplefilter('always')\n        warnings.warn_explicit({$message}, UserWarning, '<config>', 12)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\n{'logging': stream.getvalue(), 'stderr': err.getvalue()}",
      cases: [
        { id: 'on',      label: '1, a message',    values: { capture: '1', message: 'config key "port" is deprecated' } },
        { id: 'off',     label: '0, a message',    values: { capture: '0', message: 'config key "port" is deprecated' } },
        { id: 'percent', label: "1, '100% …'",     values: { capture: '1', message: '100% of quota used' } },
        { id: 'empty',   label: "1, ''",           values: { capture: '1', message: '' } },
      ],
    },
    {
      id: 'level',
      label: 'py.warnings level',
      blurb: "Capturing is on. Set the level of the 'py.warnings' logger and issue one RuntimeWarning.",
      params: [{ name: 'level', type: 'int | str', hint: "'WARNING', 'ERROR', 35 …", input: 'auto' }],
      template: "import io, logging, warnings\nlog = logging.getLogger('py.warnings')\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\ntry:\n    log.setLevel({$level})\n    logging.captureWarnings(True)\n    with warnings.catch_warnings():\n        warnings.simplefilter('always')\n        warnings.warn_explicit('retrying in 5 s', RuntimeWarning, '<net>', 40)\nfinally:\n    logging.captureWarnings(False)\n    log.setLevel(logging.NOTSET)\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'warning', label: "'WARNING'", values: { level: 'WARNING' } },
        { id: 'error',   label: "'ERROR'",   values: { level: 'ERROR' } },
        { id: 'num',     label: '35',        values: { level: '35' } },
        { id: 'debug',   label: "'DEBUG'",   values: { level: 'DEBUG' } },
        { id: 'lower',   label: "'warning'", values: { level: 'warning' } },
      ],
    },
  ],
  demoExplainer: "With capture on, the warning reaches the handler as one WARNING record on 'py.warnings' and nothing is printed to stderr; with 0 the original showwarning prints the same '<config>:12: UserWarning: …' text to stderr and logging sees nothing. The message is formatwarning's whole text, including its final newline — so the handler's own newline adds a blank line after each warning. It is passed as msg with no arguments, so '100% of quota used' is not %-formatted. The demo uses warnings.warn_explicit with a made-up file name '<config>' and line 12 so the text is the same everywhere; with warnings.warn() the text holds the calling file and line, plus the source line indented on a second line when the file can be read. In the second tab the record is always at WARNING (30): 'ERROR' and 35 hide it, 'DEBUG' lets it through, and the lowercase 'warning' raises ValueError: Unknown level: 'warning' before capturing starts.",

  patterns: [
    {
      name: 'Warnings into the application log',
      desc: 'Configure logging first, then capture: the root handler formats warnings like every other record.',
      code: "import logging\nlogging.basicConfig(\n    level=logging.INFO,\n    format='%(asctime)s %(name)s %(levelname)s: %(message)s',\n)\nlogging.captureWarnings(True)",
    },
    {
      name: 'Warnings in their own file',
      desc: "A handler on 'py.warnings' itself; propagation still sends them to the root handlers as well unless you turn it off.",
      code: "import logging\nwarnings_log = logging.getLogger('py.warnings')\nwarnings_log.addHandler(logging.FileHandler('warnings.log', encoding='utf-8'))\nwarnings_log.propagate = False\nlogging.captureWarnings(True)",
    },
    {
      name: 'With dictConfig',
      desc: "'py.warnings' is configured like any other logger name.",
      code: "import logging, logging.config\nlogging.config.dictConfig({\n    'version': 1,\n    'handlers': {'console': {'class': 'logging.StreamHandler'}},\n    'loggers': {'py.warnings': {'handlers': ['console'], 'level': 'WARNING'}},\n})\nlogging.captureWarnings(True)",
    },
    {
      name: 'Also log deprecations',
      desc: 'DeprecationWarning is ignored by default outside __main__; change the filter, then capture.',
      code: "import logging, warnings\nwarnings.simplefilter('default', DeprecationWarning)\nlogging.captureWarnings(True)",
    },
  ],

  examples: [
    { title: "Captured warnings are WARNING records on 'py.warnings'", code: "import logging, warnings\nrecords = []\nclass Collect(logging.Handler):\n    def emit(self, record):\n        records.append((record.name, record.levelname, record.args))\nlog = logging.getLogger('py.warnings')\nhandler = Collect()\nlog.addHandler(handler)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings():\n        warnings.simplefilter('always')\n        warnings.warn_explicit('cache disabled', UserWarning, '<config>', 3)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\nrecords", returns: "[('py.warnings', 'WARNING', ())]" },
    { title: 'The message is the formatwarning text', code: "import logging, warnings\nmessages = []\nclass Collect(logging.Handler):\n    def emit(self, record):\n        messages.append(record.getMessage())\nlog = logging.getLogger('py.warnings')\nhandler = Collect()\nlog.addHandler(handler)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings():\n        warnings.simplefilter('always')\n        warnings.warn_explicit('cache disabled', UserWarning, '<config>', 3)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\nmessages", returns: "['<config>:3: UserWarning: cache disabled\\n']" },
    { title: 'It swaps warnings.showwarning', code: 'import logging, warnings\noriginal = warnings.showwarning\nlogging.captureWarnings(True)\nreplaced = warnings.showwarning is not original\nlogging.captureWarnings(False)\n(replaced, warnings.showwarning is original)', returns: '(True, True)' },
    { title: 'The warnings filters still run first', code: "import logging, warnings\nmessages = []\nclass Collect(logging.Handler):\n    def emit(self, record):\n        messages.append(record.getMessage().strip())\nlog = logging.getLogger('py.warnings')\nhandler = Collect()\nlog.addHandler(handler)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings():\n        warnings.simplefilter('always')\n        warnings.simplefilter('ignore', DeprecationWarning)\n        warnings.warn_explicit('old API', DeprecationWarning, '<config>', 3)\n        warnings.warn_explicit('disk almost full', UserWarning, '<config>', 4)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\nmessages", returns: "['<config>:4: UserWarning: disk almost full']" },
    { title: "The 'default' action logs a repeated warning once", code: "import logging, warnings\nrecords = []\nclass Collect(logging.Handler):\n    def emit(self, record):\n        records.append(record)\nlog = logging.getLogger('py.warnings')\nhandler = Collect()\nlog.addHandler(handler)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings():\n        warnings.simplefilter('default')\n        for attempt in range(3):\n            warnings.warn('cache disabled')\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\nlen(records)", returns: '1' },
    { title: 'An explicit file= bypasses logging', code: "import io, logging, warnings\nbuf = io.StringIO()\nlogging.captureWarnings(True)\ntry:\n    warnings.showwarning('cache disabled', UserWarning, '<config>', 3, file=buf)\nfinally:\n    logging.captureWarnings(False)\nbuf.getvalue()", returns: "'<config>:3: UserWarning: cache disabled\\n'" },
  ],

  pitfalls: [
    {
      name: 'Capturing before anything handles py.warnings',
      desc: "Before capture, a warning prints to stderr. After captureWarnings(True) with no logging configuration, logging gives 'py.warnings' a NullHandler; because a handler now exists, the stderr fallback (lastResort) is not used either — and the warning is simply gone. Add a handler to 'py.warnings' or configure the root logger, then capture.",
      wrong: { label: 'nothing configured', code: "import contextlib, io, logging, warnings\nlog = logging.getLogger('py.warnings')\nsaved = log.handlers[:]\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings(), contextlib.redirect_stderr(io.StringIO()) as err:\n        warnings.simplefilter('always')\n        warnings.warn_explicit('disk almost full', UserWarning, '<config>', 7)\nfinally:\n    logging.captureWarnings(False)\n    log.handlers[:] = saved\nerr.getvalue()", output: "''" },
      fix:   { label: 'a handler first', code: "import logging, sys, warnings\nlog = logging.getLogger('py.warnings')\nhandler = logging.StreamHandler(sys.stdout)\nlog.addHandler(handler)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings():\n        warnings.simplefilter('always')\n        warnings.warn_explicit('disk almost full', UserWarning, '<config>', 7)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)", output: '<config>:7: UserWarning: disk almost full' },
    },
    {
      name: 'The blank line after every captured warning',
      desc: "formatwarning's text ends with a newline and the handler adds its own terminator, so each captured warning is followed by an empty line in the log. Strip it with a filter on the handler (the filter changes the shared record, so every later handler sees the stripped text too).",
      wrong: { label: 'as captured', code: "import io, logging, warnings\nlog = logging.getLogger('py.warnings')\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings():\n        warnings.simplefilter('always')\n        warnings.warn_explicit('disk almost full', UserWarning, '<config>', 7)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\nstream.getvalue().splitlines()", output: "['WARNING <config>:7: UserWarning: disk almost full', '']" },
      fix:   { label: 'strip in a filter', code: "import io, logging, warnings\nclass StripNewline(logging.Filter):\n    def filter(self, record):\n        record.msg = str(record.msg).rstrip('\\n')\n        return True\nlog = logging.getLogger('py.warnings')\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nhandler.addFilter(StripNewline())\nlog.addHandler(handler)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings():\n        warnings.simplefilter('always')\n        warnings.warn_explicit('disk almost full', UserWarning, '<config>', 7)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\nstream.getvalue().splitlines()", output: "['WARNING <config>:7: UserWarning: disk almost full']" },
    },
    {
      name: 'Turning capture on inside warnings.catch_warnings()',
      desc: "catch_warnings() restores warnings.showwarning when the block ends, but logging still remembers that capturing is on — so a later captureWarnings(True) does nothing and warnings go back to stderr. Call captureWarnings(True) once at startup, outside such blocks (or call captureWarnings(False) before the block ends).",
      wrong: { label: 'inside the block', code: "import contextlib, io, logging, warnings\nlog = logging.getLogger('py.warnings')\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nlog.addHandler(handler)\nwith warnings.catch_warnings():\n    logging.captureWarnings(True)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings(), contextlib.redirect_stderr(io.StringIO()) as err:\n        warnings.simplefilter('always')\n        warnings.warn_explicit('still printed', UserWarning, '<config>', 9)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\n(stream.getvalue(), err.getvalue())", output: "('', '<config>:9: UserWarning: still printed\\n')" },
      fix:   { label: 'once, outside', code: "import contextlib, io, logging, warnings\nlog = logging.getLogger('py.warnings')\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nlog.addHandler(handler)\nlogging.captureWarnings(True)\ntry:\n    with warnings.catch_warnings(), contextlib.redirect_stderr(io.StringIO()) as err:\n        warnings.simplefilter('always')\n        warnings.warn_explicit('now logged', UserWarning, '<config>', 9)\nfinally:\n    logging.captureWarnings(False)\n    log.removeHandler(handler)\n(stream.getvalue(), err.getvalue())", output: "('<config>:9: UserWarning: now logged\\n\\n', '')" },
    },
  ],

  when: {
    use: [
      'Applications that log to files or a log service and want warnings there too',
      'Seeing which DeprecationWarnings a deployment triggers (with a filter that shows them)',
      'One place to format, filter and route warnings and log records together',
    ],
    avoid: [
      'Library code → leave the decision to the application',
      'Silencing warnings → a warnings filter (warnings.simplefilter / -W), not logging levels',
      'Turning warnings into errors → warnings.simplefilter("error")',
    ],
  },

  notes: {
    cpython:        "captureWarnings(True): if logging._warnings_showwarning is None, save warnings.showwarning there and install logging._showwarning. That function calls the saved original when file= is given; otherwise s = warnings.formatwarning(message, category, filename, lineno, line), adds a NullHandler to 'py.warnings' if it has no handlers, and calls logger.warning(str(s))",
    'Message as msg': 'The text is passed as msg with no args (bpo-46557), so aggregators that group by msg see each distinct warning text, and a % in it is never interpreted',
    'Filters first':  'The warnings filters (-W, PYTHONWARNINGS, warnings.simplefilter) run before showwarning: a warning they ignore never reaches logging. DeprecationWarning is ignored by default unless it is triggered in __main__',
    'Propagation':    "'py.warnings' propagates like any logger, so records also reach the root logger's handlers",
  },

  related: [
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'Configure the root handler before capturing' },
    { name: 'logging.NullHandler', slug: 'nullhandler', when: "What gets added to an empty 'py.warnings'" },
    { name: 'logging.lastResort', slug: 'lastresort', when: 'Why that NullHandler hides the warning' },
    { name: 'logging.Filter', slug: 'filter', when: 'Clean up or drop captured warnings per handler' },
    { name: 'Warning', slug: 'warning', when: 'The warning category classes', category: 'exceptions' },
    { name: 'DeprecationWarning', slug: 'deprecationwarning', when: 'Ignored by default outside __main__', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I send Python warnings to my log file?',
      a: "Configure logging first (basicConfig or your handlers), then call logging.captureWarnings(True). Each warning is then logged at WARNING on the logger 'py.warnings' and goes to the same handlers as your other records; add a handler to 'py.warnings' if you want warnings in a separate file.",
    },
    {
      q: 'Why do warnings disappear after logging.captureWarnings(True)?',
      a: "If neither 'py.warnings' nor the root logger has a handler, logging adds a NullHandler to 'py.warnings' and the record goes nowhere — the stderr fallback (lastResort) only applies when no handler at all is found. Configure a handler before capturing.",
    },
    {
      q: 'What is the py.warnings logger?',
      a: "The logger captured warnings are logged to. It is an ordinary logger: you can set its level, attach handlers, or set propagate = False to keep warnings out of the root handlers.",
    },
    {
      q: 'Why is there an empty line after each captured warning?',
      a: "warnings.formatwarning() ends its text with a newline, and that whole text becomes the log message; the handler then adds its terminator. Strip the trailing newline in a Filter or a custom Formatter if you want single lines.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.captureWarnings',
    meta:  'logging.captureWarnings',
  },

};
