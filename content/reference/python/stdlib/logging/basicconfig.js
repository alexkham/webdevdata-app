// content/reference/python/stdlib/logging/basicconfig.js

export const meta = {
  slug:        'basicconfig',
  name:        'logging.basicConfig',
  signature:   'logging.basicConfig(**kwargs)',
  blurb:       'One-call setup of the root logger: a console or file handler, a format and a level. Does nothing if the root logger already has handlers — unless force=True.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging basicConfig python configure logging level format filename filemode stream handlers force datefmt style encoding errors BASIC_FORMAT basicconfig not working second call ignored logging to file default format levelname name message',
};

export const method = {
  slug:      'basicconfig',
  name:      'logging.basicConfig',
  signature: 'logging.basicConfig(*, filename=None, filemode="a", format=BASIC_FORMAT, datefmt=None, style="%", level=None, stream=None, handlers=None, force=False, encoding=None, errors="backslashreplace")',
  returns:   { type: 'None', desc: 'Configures the root logger in place.' },

  category:    'logging function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The quickest correct setup for a script: call it once, first thing, in the entry point. It only acts when the root logger has no handlers — so a second call, or a call after anything has already logged through the root logger, is silently ignored. force=True (3.8+) replaces the existing handlers instead.',

  covers: ['basicConfig', 'BASIC_FORMAT'],

  cheat: {
    commonCall: "logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s: %(message)s')",
    returns:    'None — the root logger now has one handler',
    replaces:   'creating a handler and formatter for the root logger by hand',
    watchOut:   'ignored when the root logger already has handlers (pass force=True)',
  },

  parameters: [
    { name: 'level',    type: 'int | str', required: false, default: 'None', desc: "Root logger level, e.g. logging.DEBUG or 'DEBUG'. Not given: the root stays at WARNING." },
    { name: 'format',   type: 'str',       required: false, default: 'BASIC_FORMAT', desc: "Format string for the handler; BASIC_FORMAT is '%(levelname)s:%(name)s:%(message)s'. With style='{' or '$' and no format, the same layout in that syntax is used ('{levelname}:{name}:{message}', '${levelname}:${name}:${message}')." },
    { name: 'datefmt',  type: 'str',       required: false, default: 'None', desc: 'time.strftime format for %(asctime)s.' },
    { name: 'style',    type: "'%' | '{' | '$'", required: false, default: "'%'", desc: 'Which syntax format uses (3.2+).' },
    { name: 'stream',   type: 'file-like', required: false, default: 'None', desc: 'Stream for the StreamHandler (sys.stderr when omitted). Cannot be combined with filename or handlers.' },
    { name: 'filename', type: 'str | PathLike', required: false, default: 'None', desc: 'Log to this file with a FileHandler instead of a stream.' },
    { name: 'filemode', type: 'str',       required: false, default: "'a'", desc: "Mode for opening filename — 'w' starts the file afresh." },
    { name: 'encoding', type: 'str',       required: false, default: 'None', desc: 'Encoding for filename (3.9+). Without it the locale encoding is used, which differs between platforms.' },
    { name: 'errors',   type: 'str',       required: false, default: "'backslashreplace'", desc: 'Encoding error handler for filename (3.9+).' },
    { name: 'handlers', type: 'iterable of Handler', required: false, default: 'None', desc: 'Ready-made handlers to attach (3.3+); those without a formatter get the one built from format/datefmt/style.' },
    { name: 'force',    type: 'bool',      required: false, default: 'False', desc: 'Remove and close the existing root handlers first (3.8+).' },
  ],

  modes: [
    {
      id: 'once',
      label: 'second call',
      blurb: 'Two basicConfig calls with different levels, then an info() and a debug() line. Which level wins?',
      params: [
        { name: 'first',  type: 'int | str', hint: 'level of the first call',  input: 'auto' },
        { name: 'second', type: 'int | str', hint: 'level of the second call', input: 'auto' },
      ],
      template: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, level={$first}, format='%(levelname)s:%(message)s')\n    logging.basicConfig(stream=stream, level={$second}, format='%(levelname)s:%(message)s')\n    logging.info('info line')\n    logging.debug('debug line')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue().splitlines()",
      cases: [
        { id: 'ignored', label: 'INFO, then DEBUG',  values: { first: 'INFO', second: 'DEBUG' } },
        { id: 'debug',   label: 'DEBUG, then INFO',  values: { first: 'DEBUG', second: 'INFO' } },
        { id: 'quiet',   label: 'WARNING first',     values: { first: 'WARNING', second: 'DEBUG' } },
        { id: 'num',     label: '15, then 50',       values: { first: '15', second: '50' } },
        { id: 'bad',     label: "'loud'",            values: { first: 'loud', second: 'INFO' } },
      ],
    },
    {
      id: 'force',
      label: 'force=True',
      blurb: 'A first call sets a format; the second passes force=True with yours. The old handler is removed and closed.',
      params: [
        { name: 'fmt', type: 'str', hint: 'a %-style format string', input: 'text' },
        { name: 'msg', type: 'str', hint: 'a warning message',      input: 'text' },
      ],
      template: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, format='first: %(message)s')\n    logging.basicConfig(stream=stream, format={$fmt}, force=True)\n    logging.warning({$msg})\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()",
      cases: [
        { id: 'replace', label: 'new format',      values: { fmt: 'second: %(message)s', msg: 'disk low' } },
        { id: 'fields',  label: 'level and name',  values: { fmt: '%(levelname)-8s| %(name)s | %(message)s', msg: 'disk low' } },
        { id: 'brace',   label: '{message}',       values: { fmt: '{message}', msg: 'disk low' } },
        { id: 'missing', label: 'unknown field',   values: { fmt: '%(user)s %(message)s', msg: 'disk low' } },
      ],
    },
    {
      id: 'style',
      label: 'style',
      blurb: "format= is read with the syntax style= names: '%' (default), '{' or '$'.",
      params: [
        { name: 'style', type: 'str', hint: "'%', '{' or '$'",  input: 'text' },
        { name: 'fmt',   type: 'str', hint: 'a format string', input: 'text' },
      ],
      template: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, style={$style}, format={$fmt}, force=True)\n    logging.getLogger('cron').error('job %s failed', 'backup')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()",
      cases: [
        { id: 'brace',  label: "'{'",            values: { style: '{', fmt: '{levelname:<7}|{name}|{message}' } },
        { id: 'dollar', label: "'$'",            values: { style: '$', fmt: '$levelname in $name: $message' } },
        { id: 'pct',    label: "'%'",            values: { style: '%', fmt: '%(name)s: %(message)s' } },
        { id: 'mixed',  label: "'{' with %(…)s", values: { style: '{', fmt: '%(message)s' } },
        { id: 'nostyle', label: "'f'",           values: { style: 'f', fmt: '{message}' } },
      ],
    },
  ],
  demoExplainer: "With INFO first and DEBUG second, only 'INFO:info line' appears: the second call found a handler on the root logger and returned without doing anything, level included. A numeric level such as 15 works too (debug is 10, so it is still filtered). force=True closes the first handler and installs a new one; a format that does not match the style (here '{message}' for '%') raises ValueError — after force has removed the old handler, before a new one is attached — while a field the record lacks ('%(user)s') only fails when a line is emitted — that line is dropped with a report on stderr, so the result is empty.",

  patterns: [
    {
      name: 'Script entry point',
      desc: 'Configure before anything logs; the format shows time, level and logger.',
      code: "import logging\n\ndef main():\n    logging.getLogger(__name__).info('starting')\n\nif __name__ == '__main__':\n    logging.basicConfig(\n        level=logging.INFO,\n        format='%(asctime)s %(levelname)-8s %(name)s: %(message)s',\n        datefmt='%Y-%m-%d %H:%M:%S',\n    )\n    main()",
    },
    {
      name: 'Log to a file',
      desc: "filemode='w' overwrites on every run; always pass an encoding.",
      code: "import logging\nlogging.basicConfig(filename='app.log', filemode='w', encoding='utf-8', level=logging.DEBUG)",
    },
    {
      name: 'File and console',
      desc: 'handlers= attaches several handlers; each without a formatter gets the shared one.',
      code: "import logging, sys\nlogging.basicConfig(\n    level=logging.INFO,\n    format='%(levelname)s %(message)s',\n    handlers=[logging.FileHandler('app.log', encoding='utf-8'), logging.StreamHandler(sys.stdout)],\n)",
    },
    {
      name: 'Level from the command line or environment',
      desc: 'Level names are accepted as strings.',
      code: "import logging, os\nlogging.basicConfig(level=os.environ.get('LOGLEVEL', 'WARNING').upper())",
    },
  ],

  examples: [
    { title: 'BASIC_FORMAT, the default format', code: 'import logging\nlogging.BASIC_FORMAT', returns: "'%(levelname)s:%(name)s:%(message)s'" },
    { title: 'Default layout, any stream',      code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, level=logging.INFO)\n    logging.getLogger('startup').info('ready')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", returns: "'INFO:startup:ready\\n'" },
    { title: 'Log to a file',                   code: "import logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\ntry:\n    logging.basicConfig(filename='app.log', filemode='w', encoding='utf-8',\n                        level=logging.INFO, format='%(levelname)s %(message)s')\n    logging.info('written to a file')\nfinally:\n    for h in root.handlers:\n        if h not in saved[0]:\n            h.close()\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nopen('app.log', encoding='utf-8').read()", returns: "'INFO written to a file\\n'" },
    { title: 'handlers= keeps an existing formatter', code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nplain, custom = io.StringIO(), io.StringIO()\nmine = logging.StreamHandler(custom)\nmine.setFormatter(logging.Formatter('custom> %(message)s'))\ntry:\n    logging.basicConfig(handlers=[logging.StreamHandler(plain), mine],\n                        format='shared> %(message)s')\n    logging.warning('hello')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\n(plain.getvalue(), custom.getvalue())", returns: "('shared> hello\\n', 'custom> hello\\n')" },
    { title: 'stream and filename are exclusive', code: "import io, logging\nlogging.basicConfig(stream=io.StringIO(), filename='app.log')", returns: "ValueError: 'stream' and 'filename' should not be specified together" },
    { title: 'Unknown style',                   code: "import logging\nlogging.basicConfig(style='f')", returns: 'ValueError: Style must be one of: %,{,$' },
  ],

  pitfalls: [
    {
      name: 'Configuring after something already logged',
      desc: 'logging.warning() and friends call basicConfig() themselves when the root logger has no handler. Your later basicConfig then finds that handler and does nothing — level and stream included. Configure first, or pass force=True.',
      wrong: { label: 'too late', code: "import io, contextlib, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(io.StringIO()):\n        logging.warning('too early')\n    logging.basicConfig(stream=stream, level=logging.DEBUG)\n    logging.debug('lost')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", output: "''" },
      fix:   { label: 'force=True', code: "import io, contextlib, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(io.StringIO()):\n        logging.warning('too early')\n    logging.basicConfig(stream=stream, level=logging.DEBUG, force=True)\n    logging.debug('kept')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", output: "'DEBUG:root:kept\\n'" },
    },
    {
      name: 'A misspelled keyword half-applies the configuration',
      desc: 'Unknown keywords are only checked at the very end, after the handler has been attached — the ValueError arrives with the root logger already changed.',
      wrong: { label: 'fromat=', code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\ntry:\n    try:\n        logging.basicConfig(stream=io.StringIO(), fromat='%(message)s')\n    except ValueError as e:\n        error = str(e)\n    added = len(root.handlers) - len(saved[0])\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\n(error, added)", output: "('Unrecognised argument(s): fromat', 1)" },
      fix:   { label: 'format=', code: "import io, logging\nroot = logging.getLogger()\nsaved = root.handlers[:], root.level\nstream = io.StringIO()\ntry:\n    logging.basicConfig(stream=stream, format='%(message)s')\n    logging.warning('configured')\nfinally:\n    root.handlers[:] = saved[0]\n    root.setLevel(saved[1])\nstream.getvalue()", output: "'configured\\n'" },
    },
  ],

  when: {
    use: [
      'Scripts and small programs: one call in the entry point',
      'Notebooks and experiments, with force=True to reconfigure',
    ],
    avoid: [
      'Library code → only create loggers; leave configuration to the application',
      'Several loggers with different handlers, or config files → logging.config.dictConfig',
    ],
  },

  notes: {
    cpython:        'Lib/logging/__init__.py: holds the module lock, returns early when root.handlers is non-empty (after force=True has emptied it), builds one Formatter and attaches it to every handler that has none',
    'Implicit call': 'logging.debug/info/warning/error/critical/exception/log call basicConfig() with no arguments when the root logger has no handlers',
    'Versions':     'style 3.2, handlers 3.3, force 3.8, encoding and errors 3.9',
    'Encoding':     'filename without encoding= uses the locale encoding: UTF-8 on most Linux and macOS systems, a legacy code page on Windows unless UTF-8 mode is on',
  },

  related: [
    { name: 'logging.info and friends', slug: 'log-functions', when: 'The module-level calls that trigger an implicit basicConfig' },
    { name: 'Formatter', slug: 'formatter', when: 'What format, datefmt and style build' },
    { name: 'FileHandler', slug: 'filehandler', when: 'What filename= creates' },
    { name: 'StreamHandler', slug: 'streamhandler', when: 'What stream= creates' },
    { name: 'logging levels', slug: 'levels', when: 'Values for level=' },
    { name: 'logging module', slug: 'logging', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does logging.basicConfig not work?',
      a: "Almost always because the root logger already has a handler: an earlier basicConfig call, an earlier logging.info/warning call (which configures defaults), a framework, or a test runner. basicConfig then returns without doing anything. Pass force=True (Python 3.8+) to replace the existing handlers.",
    },
    {
      q: 'How do I make basicConfig write to a file?',
      a: "logging.basicConfig(filename='app.log', encoding='utf-8', level=logging.INFO). The file is appended to; filemode='w' starts it fresh each run. To log to the console as well, pass handlers=[logging.FileHandler(...), logging.StreamHandler()] instead of filename.",
    },
    {
      q: 'What is the default format of basicConfig?',
      a: "logging.BASIC_FORMAT, '%(levelname)s:%(name)s:%(message)s' — e.g. 'WARNING:root:disk almost full'. There is no timestamp unless you add %(asctime)s to format.",
    },
    {
      q: 'Does basicConfig set the level of my named loggers?',
      a: 'It sets the level of the root logger only. Named loggers whose level is NOTSET inherit it; loggers you gave an explicit level keep their own.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.basicConfig',
    meta:  'logging.basicConfig',
  },

};
