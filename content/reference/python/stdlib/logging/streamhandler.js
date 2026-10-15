// content/reference/python/stdlib/logging/streamhandler.js

export const meta = {
  slug:        'streamhandler',
  name:        'logging.StreamHandler',
  signature:   'logging.StreamHandler(stream=None)',
  blurb:       'Write each formatted record, plus a newline, to a file-like object — sys.stderr by default, or sys.stdout, an open file, an io.StringIO.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+ (setStream 3.7+)',
  searchTerms: 'logging StreamHandler python log to console log to stdout instead of stderr StreamHandler.terminator StreamHandler.setStream StreamHandler.flush StreamHandler.emit change stream newline no newline terminator io.StringIO capture log output I/O operation on closed file',
};

export const method = {
  slug:      'streamhandler',
  name:      'logging.StreamHandler',
  signature: 'logging.StreamHandler(stream=None)',
  returns:   { type: 'logging.StreamHandler', desc: 'A handler that writes format(record) + terminator to stream and flushes it after every record.' },

  category:    'logging class',
  version:     'Python 2.3+ (setStream 3.7+)',
  hasLiveDemo: true,

  subtitle: 'The console handler. emit() writes self.format(record) + self.terminator in one write() call and then flushes, so lines appear immediately. The stream is fixed when the handler is created: StreamHandler() grabs whatever sys.stderr is at that moment, and setStream() (3.7+) swaps it later.',

  covers: ['StreamHandler', 'StreamHandler.terminator', 'StreamHandler.emit', 'StreamHandler.flush', 'StreamHandler.setStream'],

  cheat: {
    commonCall: 'logging.StreamHandler(sys.stdout)',
    returns:    '<StreamHandler <stdout> (NOTSET)>',
    replaces:   'print(..., file=sys.stderr) for diagnostics',
    watchOut:   'the default stream is sys.stderr, captured at creation time',
  },

  parameters: [
    { name: 'stream', type: 'file-like | None', required: false, default: 'None', desc: 'Anything with write() (and optionally flush()). None means sys.stderr as it is when the handler is created.' },
  ],

  attributes: [
    { name: 'stream',     type: 'file-like', meaning: 'Where lines are written; replace it with setStream()' },
    { name: 'terminator', type: 'str',       meaning: "Appended to every formatted record, '\\n' by default (class attribute, 3.2+)" },
  ],

  modes: [
    {
      id: 'terminator',
      label: 'terminator',
      blurb: 'Three records go through one handler. Change what is written after each of them.',
      params: [{ name: 'terminator', type: 'str', hint: "e.g. ' | '", input: 'text' }],
      template: "import io, logging\nlog = logging.getLogger('console')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.terminator = {$terminator}\nlog.addHandler(handler)\ntry:\n    for step in ('download', 'unpack', 'install'):\n        log.info('%s done', step)\nfinally:\n    log.removeHandler(handler)\nstream.getvalue()",
      cases: [
        { id: 'default', label: "'\\n' (default)", values: { terminator: '\n' } },
        { id: 'bar',     label: "' | '",          values: { terminator: ' | ' } },
        { id: 'none',    label: "''",             values: { terminator: '' } },
        { id: 'crlf',    label: "'\\r\\n'",       values: { terminator: '\r\n' } },
      ],
    },
    {
      id: 'switch',
      label: 'setStream',
      blurb: "The handler starts on streams['a']. After the first record, setStream switches it to the stream you name.",
      params: [{ name: 'target', type: 'str', hint: "'a' or 'b'", input: 'text' }],
      template: "import io, logging\nlog = logging.getLogger('console.switch')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstreams = {'a': io.StringIO(), 'b': io.StringIO()}\nhandler = logging.StreamHandler(streams['a'])\nlog.addHandler(handler)\ntry:\n    log.info('one')\n    old = handler.setStream(streams[{$target}])\n    log.info('two')\nfinally:\n    log.removeHandler(handler)\n(old is streams['a'], streams['a'].getvalue(), streams['b'].getvalue())",
      cases: [
        { id: 'other', label: "'b'", values: { target: 'b' } },
        { id: 'same',  label: "'a'", values: { target: 'a' } },
        { id: 'bad',   label: "'c'", values: { target: 'c' } },
      ],
    },
  ],
  demoExplainer: "The terminator is written straight after each formatted record, in the same write() call; with '' the lines run together, and a multi-character terminator is fine. In the setStream tab, switching to another stream returns the old one (old is streams['a'] is True) and later records go to the new stream. Passing the stream the handler already has changes nothing and returns None, which is why old is streams['a'] is then False.",

  patterns: [
    {
      name: 'Log to stdout',
      desc: 'Useful when a supervisor or container treats stderr as errors.',
      code: "import logging, sys\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(name)s: %(message)s'))\nlogging.getLogger().addHandler(handler)",
    },
    {
      name: 'Errors to stderr, the rest to stdout',
      desc: 'Two handlers, split by level with a filter on the stdout one.',
      code: "import logging, sys\nout = logging.StreamHandler(sys.stdout)\nout.addFilter(lambda record: record.levelno < logging.WARNING)\nerr = logging.StreamHandler(sys.stderr)\nerr.setLevel(logging.WARNING)\nroot = logging.getLogger()\nroot.setLevel(logging.INFO)\nroot.addHandler(out)\nroot.addHandler(err)",
    },
    {
      name: 'Capture log output in a test',
      desc: 'A StringIO handler collects exactly what would be printed.',
      code: "import io, logging\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nlog = logging.getLogger('app')\nlog.addHandler(handler)\ntry:\n    run_job()\nfinally:\n    log.removeHandler(handler)\nassert 'job finished' in stream.getvalue()",
    },
  ],

  examples: [
    { title: 'stderr by default',              code: 'import sys, logging\nlogging.StreamHandler().stream is sys.stderr', returns: 'True' },
    { title: 'Log to standard output',         code: "import sys, logging\nlog = logging.getLogger('console.out')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\nlog.info('to stdout')\nlog.removeHandler(handler)", returns: 'INFO to stdout' },
    { title: 'The default terminator',         code: 'import logging\nlogging.StreamHandler.terminator', returns: "'\\n'" },
    { title: 'One flush per record',           code: "import io, logging\nclass Counting(io.StringIO):\n    flushes = 0\n    def flush(self):\n        self.flushes += 1\nlog = logging.getLogger('console.flush')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nlog.addHandler(handler := logging.StreamHandler(stream := Counting()))\nlog.info('one')\nlog.info('two')\nlog.removeHandler(handler)\nstream.flushes", returns: '2' },
    { title: 'close() leaves the stream open', code: 'import io, logging\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.close()\nstream.closed', returns: 'False' },
    { title: 'repr shows the stream name',     code: "import logging\nf = open('app.log', 'w', encoding='utf-8')\nhandler = logging.StreamHandler(f)\nresult = repr(handler)\nf.close()\nresult", returns: "'<StreamHandler app.log (NOTSET)>'" },
  ],

  pitfalls: [
    {
      name: 'Redirecting the stream after creating the handler',
      desc: 'StreamHandler(sys.stdout) stores the object sys.stdout refers to at that moment. A later redirect (contextlib.redirect_stdout, a test runner capturing output) replaces sys.stdout, not the handler’s stream. Point the handler at the new stream with setStream().',
      wrong: { label: 'redirect only', code: "import io, sys, contextlib, logging\nlog = logging.getLogger('console.bound')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nlog.addHandler(handler)\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    log.info('captured?')\nlog.removeHandler(handler)\nbuf.getvalue()", output: "captured?\n''" },
      fix:   { label: 'setStream', code: "import io, sys, contextlib, logging\nlog = logging.getLogger('console.bound')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.StreamHandler(sys.stdout)\nlog.addHandler(handler)\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    handler.setStream(sys.stdout)\n    log.info('captured?')\nlog.removeHandler(handler)\nbuf.getvalue()", output: "'captured?\\n'" },
    },
    {
      name: 'Closing the stream while the handler is still attached',
      desc: 'The next record fails in write() and ends up as a "--- Logging error ---" report — a common sight at interpreter exit when a test framework has already closed a captured stream. Remove the handler first, then close the stream.',
      wrong: { label: 'close first', code: "import io, contextlib, logging\nlog = logging.getLogger('console.closed')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nstream.close()\nwith contextlib.redirect_stderr(io.StringIO()) as err:\n    log.info('shutting down')\nlog.removeHandler(handler)\n[line for line in err.getvalue().splitlines() if line.startswith(('---', 'ValueError'))]", output: "['--- Logging error ---', 'ValueError: I/O operation on closed file']" },
      fix:   { label: 'remove, then close', code: "import io, logging\nlog = logging.getLogger('console.closed')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nlog.info('shutting down')\nlog.removeHandler(handler)\ntext = stream.getvalue()\nstream.close()\ntext", output: "'shutting down\\n'" },
    },
  ],

  when: {
    use: [
      'Console output of a program or service (stderr, or stdout for containers)',
      'Capturing log lines into an io.StringIO in tests',
      'Any object with write() — a socket file, a pipe, a GUI text sink',
    ],
    avoid: [
      'Log files → FileHandler (it opens, reopens and closes the file for you)',
      'Growing files → logging.handlers.RotatingFileHandler / TimedRotatingFileHandler',
    ],
  },

  notes: {
    cpython:     'StreamHandler(Handler) in Lib/logging/__init__.py: emit() does stream.write(msg + self.terminator) then self.flush(); any exception except RecursionError goes to handleError()',
    'flush()':   'Calls stream.flush() if the stream has one; close() is inherited and does not close the stream',
    'setStream': 'Added in 3.7: flushes the old stream, installs the new one and returns the old one — or None if it is the same stream',
    'repr':      "<StreamHandler NAME (LEVEL)> with the stream's name attribute when it has one ('<stderr>', a file name)",
  },

  related: [
    { name: 'logging.Handler', slug: 'handler', when: 'Levels, formatter and filters it inherits' },
    { name: 'FileHandler', slug: 'filehandler', when: 'The subclass that opens a file' },
    { name: 'Handler.handleError', slug: 'handleerror', when: 'What emit() calls on failure' },
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'Creates a StreamHandler for you' },
    { name: 'sys module', slug: 'sys', when: 'sys.stdout and sys.stderr', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I make Python logging print to stdout instead of stderr?',
      a: 'Pass the stream: logging.StreamHandler(sys.stdout), or logging.basicConfig(stream=sys.stdout). StreamHandler() without an argument writes to sys.stderr.',
    },
    {
      q: 'How do I log without a newline at the end?',
      a: "Set handler.terminator = '' (it is '\\n' by default). Every record of that handler is then written without one, so you build line breaks yourself.",
    },
    {
      q: 'How do I capture log output into a string?',
      a: 'Attach logging.StreamHandler(io.StringIO()) to the logger (and remove it afterwards), then read stream.getvalue(). In tests, unittest’s assertLogs and pytest’s caplog do this for you.',
    },
    {
      q: 'Why does my log output not show up in captured stdout?',
      a: 'The handler holds the stream object it was given when it was created. Redirecting sys.stdout later does not affect it; call handler.setStream(sys.stdout) after the redirect, or create the handler inside it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.handlers.html#streamhandler',
    meta:  'StreamHandler',
  },

};
