// content/reference/python/stdlib/logging/filehandler.js

export const meta = {
  slug:        'filehandler',
  name:        'logging.FileHandler',
  signature:   "logging.FileHandler(filename, mode='a', encoding=None, delay=False, errors=None)",
  blurb:       'A StreamHandler that opens a file for you: appends by default, can postpone opening until the first record (delay=True), and closes the file in close().',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+ (errors 3.9+)',
  searchTerms: 'logging FileHandler python log to file write logs to a file FileHandler.close FileHandler.emit mode a w append overwrite delay encoding utf-8 baseFilename log file location FileNotFoundError log directory pathlib',
};

export const method = {
  slug:      'filehandler',
  name:      'logging.FileHandler',
  signature: "logging.FileHandler(filename, mode='a', encoding=None, delay=False, errors=None)",
  returns:   { type: 'logging.FileHandler', desc: 'A handler writing to the file at os.path.abspath(filename), opened now — or at the first record when delay is true.' },

  category:    'logging class',
  version:     'Python 2.3+ (errors 3.9+)',
  hasLiveDemo: true,

  subtitle: "The file is opened with open(baseFilename, mode, encoding=…, errors=…) and kept open; every record is written and flushed straight away. mode='a' (the default) keeps earlier runs, 'w' starts the file afresh. Always pass encoding='utf-8': without it the locale encoding is used, which on Windows is usually not UTF-8.",

  covers: ['FileHandler', 'FileHandler.emit', 'FileHandler.close'],

  cheat: {
    commonCall: "logging.FileHandler('app.log', encoding='utf-8')",
    returns:    'a handler appending formatted lines to app.log',
    replaces:   'open(…, "a") and write() calls sprinkled through the code',
    watchOut:   "mode='w' truncates the file every time the handler is created",
  },

  parameters: [
    { name: 'filename', type: 'str | PathLike', required: true,  default: null,    desc: 'Path of the log file, made absolute with the current directory at creation time (baseFilename). Path objects since 3.6. The directory must exist.' },
    { name: 'mode',     type: 'str',             required: false, default: "'a'",   desc: "Open mode: 'a' appends, 'w' truncates." },
    { name: 'encoding', type: 'str | None',      required: false, default: 'None',  desc: 'Text encoding; None means the locale encoding (io.text_encoding).' },
    { name: 'delay',    type: 'bool',            required: false, default: 'False', desc: 'Do not open (or create) the file until the first record is emitted.' },
    { name: 'errors',   type: 'str | None',      required: false, default: 'None',  desc: 'Encoding error handler passed to open() (3.9+).' },
  ],

  attributes: [
    { name: 'baseFilename', type: 'str',         meaning: 'The absolute path of the log file' },
    { name: 'mode',         type: 'str',         meaning: 'The open mode' },
    { name: 'encoding',     type: 'str | None',  meaning: "The encoding passed, or 'locale' when it was None (3.10+)" },
    { name: 'delay',        type: 'bool',        meaning: 'Whether opening was postponed' },
    { name: 'stream',       type: 'file | None', meaning: 'The open file; None before the first record with delay=True and after close()' },
  ],

  modes: [
    {
      id: 'mode',
      label: 'append or overwrite',
      blurb: "app.log already holds a line from the last run. Open it with a mode and log one INFO line; the result is the file's content.",
      params: [
        { name: 'mode', type: 'str', hint: "'a' or 'w'", input: 'text' },
        { name: 'msg',  type: 'str', hint: 'a message',  input: 'text' },
      ],
      template: "import logging\nwith open('app.log', 'w', encoding='utf-8') as f:\n    f.write('from the last run\\n')\nlog = logging.getLogger('files')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.FileHandler('app.log', mode={$mode}, encoding='utf-8')\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\nlog.addHandler(handler)\ntry:\n    log.info({$msg})\nfinally:\n    log.removeHandler(handler)\n    handler.close()\nopen('app.log', encoding='utf-8').read()",
      cases: [
        { id: 'append', label: "'a'",          values: { mode: 'a', msg: 'started' } },
        { id: 'write',  label: "'w'",          values: { mode: 'w', msg: 'started' } },
        { id: 'utf8',   label: "'a', non-ASCII", values: { mode: 'a', msg: 'Zoë signed in' } },
        { id: 'read',   label: "'r'",          values: { mode: 'r', msg: 'started' } },
      ],
    },
    {
      id: 'delay',
      label: 'delay',
      blurb: 'The logger is at WARNING. Does the file exist right after the handler is created, and after one log() call at your level? delay: 1 = True, 0 = False.',
      params: [
        { name: 'delay', type: 'int', hint: '1 or 0',     input: 'number' },
        { name: 'level', type: 'int', hint: '10, 30, 40', input: 'auto' },
      ],
      template: "import os, logging\nlog = logging.getLogger('files.lazy')\nlog.setLevel(logging.WARNING)\nlog.propagate = False\nhandler = logging.FileHandler('lazy.log', encoding='utf-8', delay=bool({$delay}))\ncreated_early = os.path.exists('lazy.log')\nlog.addHandler(handler)\ntry:\n    log.log({$level}, 'checked %d files', 12)\nfinally:\n    log.removeHandler(handler)\n    handler.close()\n(created_early, os.path.exists('lazy.log'))",
      cases: [
        { id: 'quiet', label: 'delay, DEBUG',      values: { delay: '1', level: '10' } },
        { id: 'warn',  label: 'delay, WARNING',    values: { delay: '1', level: '30' } },
        { id: 'eager', label: 'no delay, DEBUG',   values: { delay: '0', level: '10' } },
      ],
    },
  ],
  demoExplainer: "'a' keeps the old line and adds the new one; 'w' empties the file when the handler opens it. With encoding='utf-8' non-ASCII text is stored as UTF-8 and reads back unchanged. Mode 'r' opens the file read-only: the write in emit() fails with io.UnsupportedOperation: not writable, handleError reports it on stderr, and the file stays as it was. In the delay tab, delay=True postpones creating the file until a record is actually emitted — a program that never logs a WARNING never creates lazy.log; without delay the empty file exists from the start.",

  patterns: [
    {
      name: 'A log file next to the console',
      desc: 'Everything to the file, warnings and up to the console.',
      code: "import logging\nroot = logging.getLogger()\nroot.setLevel(logging.DEBUG)\nfile_handler = logging.FileHandler('app.log', encoding='utf-8')\nfile_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(name)s: %(message)s'))\nconsole = logging.StreamHandler()\nconsole.setLevel(logging.WARNING)\nroot.addHandler(file_handler)\nroot.addHandler(console)",
    },
    {
      name: 'Log next to the script, not the current directory',
      desc: 'A relative name is resolved against the working directory when the handler is created.',
      code: "import logging\nfrom pathlib import Path\nlog_dir = Path(__file__).resolve().parent / 'logs'\nlog_dir.mkdir(exist_ok=True)\nhandler = logging.FileHandler(log_dir / 'app.log', encoding='utf-8')",
    },
    {
      name: 'Rotate instead of growing forever',
      desc: 'Same interface, from logging.handlers.',
      code: "import logging.handlers\nhandler = logging.handlers.RotatingFileHandler(\n    'app.log', maxBytes=5_000_000, backupCount=3, encoding='utf-8')",
    },
  ],

  examples: [
    { title: 'Write lines to a file',        code: "import logging\nlog = logging.getLogger('files.ex1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.FileHandler('app.log', encoding='utf-8')\nhandler.setFormatter(logging.Formatter('%(levelname)s:%(name)s:%(message)s'))\nlog.addHandler(handler)\nlog.info('saved %d rows', 3)\nlog.warning('slow disk')\nlog.removeHandler(handler)\nhandler.close()\nopen('app.log', encoding='utf-8').read().splitlines()", returns: "['INFO:files.ex1:saved 3 rows', 'WARNING:files.ex1:slow disk']" },
    { title: 'baseFilename is absolute',     code: "import os, logging\nhandler = logging.FileHandler('app.log', encoding='utf-8')\nhandler.close()\n(os.path.isabs(handler.baseFilename), os.path.basename(handler.baseFilename))", returns: "(True, 'app.log')" },
    { title: 'The settings it keeps',        code: "import logging\nhandler = logging.FileHandler('app.log', encoding='utf-8')\nhandler.close()\n(handler.mode, handler.encoding, handler.delay, handler.errors)", returns: "('a', 'utf-8', False, None)" },
    { title: 'Path objects work',            code: "import logging\nfrom pathlib import Path\nhandler = logging.FileHandler(Path('app.log'), encoding='utf-8')\nhandler.close()\nhandler.mode", returns: "'a'" },
    { title: 'close() drops the stream',     code: "import logging\nhandler = logging.FileHandler('app.log', encoding='utf-8')\nhandler.close()\nhandler.stream is None", returns: 'True' },
    { title: 'In append mode, a record after close() reopens the file', code: "import logging\nlog = logging.getLogger('files.reopen')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.FileHandler('app.log', encoding='utf-8')\nlog.addHandler(handler)\nlog.info('before close')\nhandler.close()\nlog.info('after close')\nlog.removeHandler(handler)\nhandler.close()\nopen('app.log', encoding='utf-8').read()", returns: "'before close\\nafter close\\n'" },
    { title: "…but not in mode 'w'",          code: "import logging\nlog = logging.getLogger('files.reopen-w')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.FileHandler('app.log', mode='w', encoding='utf-8')\nlog.addHandler(handler)\nlog.info('before close')\nhandler.close()\nlog.info('after close')\nlog.removeHandler(handler)\nhandler.close()\nopen('app.log', encoding='utf-8').read()", returns: "'before close\\n'" },
  ],

  pitfalls: [
    {
      name: "mode='w' wipes the previous run",
      desc: 'Each new handler truncates the file, so only the latest run survives — and two handlers opened with "w" on one file erase each other. Use the default "a" (or a rotating handler).',
      wrong: { label: "mode='w'", code: "import logging\ndef run(n, mode):\n    log = logging.getLogger('files.runs')\n    log.setLevel(logging.INFO)\n    log.propagate = False\n    handler = logging.FileHandler('runs.log', mode=mode, encoding='utf-8')\n    log.addHandler(handler)\n    log.info('run %d', n)\n    log.removeHandler(handler)\n    handler.close()\nfor n in (1, 2):\n    run(n, 'w')\nopen('runs.log', encoding='utf-8').read()", output: "'run 2\\n'" },
      fix:   { label: "mode='a'", code: "import logging\ndef run(n, mode):\n    log = logging.getLogger('files.runs')\n    log.setLevel(logging.INFO)\n    log.propagate = False\n    handler = logging.FileHandler('runs.log', mode=mode, encoding='utf-8')\n    log.addHandler(handler)\n    log.info('run %d', n)\n    log.removeHandler(handler)\n    handler.close()\nfor n in (1, 2):\n    run(n, 'a')\nopen('runs.log', encoding='utf-8').read()", output: "'run 1\\nrun 2\\n'" },
    },
    {
      name: 'Logging into a directory that does not exist',
      desc: 'FileHandler opens the file but never creates directories, so the constructor raises FileNotFoundError. With delay=True the same error is raised later, by the first logging call that reaches the handler — the opening happens outside the try block that would hand it to handleError. Create the directory first.',
      wrong: { label: 'logs/ missing', code: "import logging\ntry:\n    logging.FileHandler('logs/app.log', encoding='utf-8')\nexcept FileNotFoundError as e:\n    result = (e.errno, e.strerror)\nresult", output: "(2, 'No such file or directory')" },
      fix:   { label: 'makedirs first', code: "import os, logging\nos.makedirs('logs', exist_ok=True)\nhandler = logging.FileHandler('logs/app.log', encoding='utf-8')\nhandler.close()\nos.path.exists('logs/app.log')", output: 'True' },
    },
  ],

  when: {
    use: [
      'One log file per program run or per service',
      'delay=True for handlers that may never be used (no empty files)',
    ],
    avoid: [
      'Files that grow without bound → RotatingFileHandler / TimedRotatingFileHandler (logging.handlers)',
      'Files rotated by logrotate on Linux → WatchedFileHandler (logging.handlers), which reopens them',
      'Several processes writing one file → a QueueHandler feeding a single writer',
    ],
  },

  notes: {
    cpython:     'FileHandler(StreamHandler) in Lib/logging/__init__.py: baseFilename = os.path.abspath(filename); _open() calls open(baseFilename, mode, encoding=…, errors=…)',
    'emit()':    "Opens the file first if self.stream is None — unless mode is 'w' and the handler was closed — then does StreamHandler.emit",
    'close()':   'Flushes and closes the file, sets stream to None, then Handler.close(); calling it twice is harmless',
    'Encoding':  "encoding=None becomes io.text_encoding(None): 'locale', i.e. the locale’s encoding — UTF-8 on most Linux and macOS systems, a code page such as cp1252 on Windows unless UTF-8 mode is on",
  },

  related: [
    { name: 'StreamHandler', slug: 'streamhandler', when: 'Its parent class: terminator, flush, setStream' },
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'filename= creates a FileHandler' },
    { name: 'logging.Handler', slug: 'handler', when: 'Levels and formatters' },
    { name: 'logging.shutdown', slug: 'shutdown', when: 'Closes file handlers at exit' },
    { name: 'open()', slug: 'open', when: 'How the file is opened', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I write Python logs to a file?',
      a: "Create logging.FileHandler('app.log', encoding='utf-8'), give it a Formatter, and add it to a logger (often the root logger). For a script, logging.basicConfig(filename='app.log', encoding='utf-8', level=logging.INFO) does the same in one call.",
    },
    {
      q: 'Does FileHandler overwrite or append?',
      a: "It appends: the default mode is 'a'. Pass mode='w' (or basicConfig(filemode='w')) to start each run with an empty file.",
    },
    {
      q: 'Where is my log file created?',
      a: 'A relative filename is resolved against the current working directory at the moment the handler is created — not the directory of the script. Check handler.baseFilename, or build an absolute path (for example from Path(__file__).parent).',
    },
    {
      q: 'Why is my log file empty or missing?',
      a: 'With delay=True the file is created only when the first record is emitted. Otherwise check the levels: the logger (and the handler) must allow the records, and the handler must be attached to a logger the records reach.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.handlers.html#filehandler',
    meta:  'FileHandler',
  },

};
