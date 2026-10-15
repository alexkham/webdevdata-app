// content/reference/python/stdlib/logging/shutdown.js

export const meta = {
  slug:        'shutdown',
  name:        'logging.shutdown',
  signature:   'logging.shutdown()',
  blurb:       'Flush and close every handler, newest first. import logging registers it with atexit, so it runs by itself at a normal exit — call it only when the process will end without atexit (os._exit) or you are truly done with logging.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging shutdown python flush logs at exit close all handlers atexit logging lost log messages at exit os._exit logging MemoryHandler flushOnClose flush buffered logs logging after shutdown close log file handler.close',
};

export const method = {
  slug:      'shutdown',
  name:      'logging.shutdown',
  signature: 'logging.shutdown()',
  returns:   { type: 'None', desc: 'Every handler has been flushed (unless its flushOnClose is false) and closed. OSError and ValueError from a handler are ignored; other errors propagate while logging.raiseExceptions is true.' },

  category:    'logging function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "Walks logging's list of every handler ever created, from the newest to the oldest, and calls flush() then close() on each. It matters for handlers that hold records back — logging.handlers.MemoryHandler, or your own buffering handler — whose last records would otherwise be lost. Logging is not switched off afterwards: a StreamHandler keeps writing, and a FileHandler reopens its file for the next record (except in mode 'w').",

  covers: ['shutdown'],

  cheat: {
    commonCall: 'logging.shutdown()',
    returns:    'None — all handlers flushed and closed',
    replaces:   'closing each handler by hand at the end of the program',
    watchOut:   'already runs at exit; os._exit() and fatal signals skip it',
  },

  parameters: [],

  modes: [
    {
      id: 'memory',
      label: 'buffered records',
      blurb: 'A MemoryHandler holds the records and passes them to a StreamHandler when its buffer is full, on an ERROR, or when it is flushed. Three INFO records, then shutdown.',
      params: [
        { name: 'capacity', type: 'int', hint: 'records held before a flush', input: 'number' },
        { name: 'flush',    type: 'int', hint: '1 = flushOnClose=True, 0 = False', input: 'number' },
      ],
      template: "import io, logging, logging.handlers, weakref\nlog = logging.getLogger('batch')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\ntarget = logging.StreamHandler(stream)\nmemory = logging.handlers.MemoryHandler({$capacity}, target=target, flushOnClose=bool({$flush}))\nlog.addHandler(memory)\ntry:\n    for row in range(1, 4):\n        log.info('row %d imported', row)\n    before = stream.getvalue().splitlines()\n    logging.shutdown([weakref.ref(target), weakref.ref(memory)])\nfinally:\n    log.removeHandler(memory)\n(before, stream.getvalue().splitlines())",
      cases: [
        { id: 'big',      label: '100, 1',  values: { capacity: '100', flush: '1' } },
        { id: 'noflush',  label: '100, 0',  values: { capacity: '100', flush: '0' } },
        { id: 'small',    label: '2, 1',    values: { capacity: '2', flush: '1' } },
        { id: 'small0',   label: '2, 0',    values: { capacity: '2', flush: '0' } },
        { id: 'one',      label: '1, 0',    values: { capacity: '1', flush: '0' } },
      ],
    },
    {
      id: 'after',
      label: 'logging after shutdown',
      blurb: 'A FileHandler writes one line, shutdown closes it, and the logger is used again. Pick the file mode.',
      params: [{ name: 'mode', type: 'str', hint: "'a', 'w', 'w+', 'a+' …", input: 'text' }],
      template: "import logging, weakref\nlog = logging.getLogger('batch.file')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.FileHandler('batch.log', mode={$mode}, encoding='utf-8')\nlog.addHandler(handler)\ntry:\n    log.info('before shutdown')\n    logging.shutdown([weakref.ref(handler)])\n    log.info('after shutdown')\nfinally:\n    log.removeHandler(handler)\n    handler.close()\nopen('batch.log', encoding='utf-8').read().splitlines()",
      cases: [
        { id: 'a',    label: "'a'",  values: { mode: 'a' } },
        { id: 'w',    label: "'w'",  values: { mode: 'w' } },
        { id: 'wplus', label: "'w+'", values: { mode: 'w+' } },
        { id: 'wt',   label: "'wt'", values: { mode: 'wt' } },
        { id: 'bad',  label: "'q'",  values: { mode: 'q' } },
      ],
    },
  ],
  demoExplainer: "logging.shutdown() normally walks every handler of the program; the demo passes a list of weak references to just its own two handlers (the same form logging keeps internally, oldest first) so it does not close anything else. With capacity 100 nothing reaches the stream before shutdown: flushOnClose=True delivers the three rows, False drops them. With capacity 2 the second record fills the buffer and both rows are written at once; the third waits for shutdown. Capacity 1 flushes on every record, so flushOnClose no longer matters. In the second tab the closed FileHandler is used again: mode 'a' reopens the file and appends, 'w' is the one mode that is not reopened (the record is silently dropped), and 'w+' or 'wt' reopen with truncation, so only the second line survives. An invalid mode fails in FileHandler itself: ValueError: invalid mode: 'q'.",

  patterns: [
    {
      name: 'Flush before os._exit',
      desc: 'os._exit skips atexit handlers, so shut logging down yourself first (common in forked workers).',
      code: "import logging, os\n\ndef child_main():\n    try:\n        run_job()\n    finally:\n        logging.shutdown()\n        os._exit(0)",
    },
    {
      name: 'Close one handler, not all of them',
      desc: 'To finish a single log file early, close that handler and detach it; leave shutdown() to the exit.',
      code: "import logging\nlog = logging.getLogger('export')\nhandler = logging.FileHandler('export.log', encoding='utf-8')\nlog.addHandler(handler)\n...\nlog.removeHandler(handler)\nhandler.close()",
    },
    {
      name: 'Buffer debug context until an error',
      desc: 'MemoryHandler keeps recent records and writes them only when an ERROR arrives (or at shutdown, with flushOnClose).',
      code: "import logging, logging.handlers\nfile_handler = logging.FileHandler('errors.log', encoding='utf-8')\nbuffer = logging.handlers.MemoryHandler(\n    capacity=500, flushLevel=logging.ERROR, target=file_handler, flushOnClose=False)\nlogging.getLogger().addHandler(buffer)",
    },
  ],

  examples: [
    { title: 'Newest handler first: flush, then close', code: "import logging, weakref\ncalls = []\nclass Tracked(logging.Handler):\n    def __init__(self, tag):\n        super().__init__()\n        self.tag = tag\n    def emit(self, record):\n        pass\n    def flush(self):\n        calls.append('flush ' + self.tag)\n    def close(self):\n        calls.append('close ' + self.tag)\n        super().close()\nhandlers = [Tracked('first'), Tracked('second')]\nlogging.shutdown([weakref.ref(h) for h in handlers])\ncalls", returns: "['flush second', 'close second', 'flush first', 'close first']" },
    { title: 'flushOnClose = False skips the flush', code: "import logging, weakref\ncalls = []\nclass Tracked(logging.Handler):\n    def emit(self, record):\n        pass\n    def flush(self):\n        calls.append('flush')\n    def close(self):\n        calls.append('close')\n        super().close()\nhandler = Tracked()\nhandler.flushOnClose = False\nlogging.shutdown([weakref.ref(handler)])\ncalls", returns: "['close']" },
    { title: 'It already runs at exit', code: "import subprocess, sys\ncode = '''\nimport logging, logging.handlers, sys\ntarget = logging.StreamHandler(sys.stdout)\nlog = logging.getLogger('batch')\nlog.addHandler(logging.handlers.MemoryHandler(100, target=target))\nlog.warning('buffered until exit')\nprint('end of script')\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "'end of script\\nbuffered until exit\\n'" },
    { title: 'A StreamHandler keeps writing after shutdown', code: "import io, logging, weakref\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nlog = logging.getLogger('batch.after')\nlog.propagate = False\nlog.addHandler(handler)\nlogging.shutdown([weakref.ref(handler)])\nlog.warning('still written')\nlog.removeHandler(handler)\nstream.getvalue()", returns: "'still written\\n'" },
    { title: 'FileHandler output is on disk after every record', code: "import logging\nlog = logging.getLogger('batch.disk')\nlog.propagate = False\nhandler = logging.FileHandler('job.log', encoding='utf-8')\nlog.addHandler(handler)\nlog.warning('step 1 done')\ntext = open('job.log', encoding='utf-8').read()\nlog.removeHandler(handler)\nhandler.close()\ntext", returns: "'step 1 done\\n'" },
    { title: 'Errors from already-closed streams are ignored', code: "import io, logging, weakref\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nstream.close()\n(logging.shutdown([weakref.ref(handler)]), stream.closed)", returns: '(None, True)' },
  ],

  pitfalls: [
    {
      name: 'Ending the process with os._exit()',
      desc: 'os._exit() leaves immediately: atexit handlers do not run, so shutdown() never flushes the MemoryHandler and its records are lost. Call logging.shutdown() yourself right before os._exit().',
      wrong: { label: 'os._exit only', code: "import subprocess, sys\ncode = '''\nimport logging, logging.handlers, os, sys\nlog = logging.getLogger('worker')\nlog.addHandler(logging.handlers.MemoryHandler(100, target=logging.StreamHandler(sys.stdout)))\nlog.warning('job finished')\nos._exit(0)\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "''" },
      fix:   { label: 'shutdown() first', code: "import subprocess, sys\ncode = '''\nimport logging, logging.handlers, os, sys\nlog = logging.getLogger('worker')\nlog.addHandler(logging.handlers.MemoryHandler(100, target=logging.StreamHandler(sys.stdout)))\nlog.warning('job finished')\nlogging.shutdown()\nos._exit(0)\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'job finished\\n'" },
    },
    {
      name: 'Calling shutdown() in the middle of the program',
      desc: "shutdown() is meant for the end. Called earlier — in a request handler, a test, a finished phase — it closes every handler; a FileHandler opened with mode 'w' is then never reopened and later records are silently dropped. To make sure a file is complete, flush (or close) that one handler.",
      wrong: { label: 'shutdown() early', code: "import logging, weakref\nlog = logging.getLogger('batch.phase')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.FileHandler('phase.log', mode='w', encoding='utf-8')\nlog.addHandler(handler)\ntry:\n    log.info('phase 1 done')\n    logging.shutdown([weakref.ref(handler)])\n    log.info('phase 2 done')\nfinally:\n    log.removeHandler(handler)\n    handler.close()\nopen('phase.log', encoding='utf-8').read().splitlines()", output: "['phase 1 done']" },
      fix:   { label: 'flush the handler', code: "import logging\nlog = logging.getLogger('batch.phase')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nhandler = logging.FileHandler('phase.log', mode='w', encoding='utf-8')\nlog.addHandler(handler)\ntry:\n    log.info('phase 1 done')\n    handler.flush()\n    log.info('phase 2 done')\nfinally:\n    log.removeHandler(handler)\n    handler.close()\nopen('phase.log', encoding='utf-8').read().splitlines()", output: "['phase 1 done', 'phase 2 done']" },
    },
  ],

  when: {
    use: [
      'Right before os._exit() — forked workers, daemons that exit hard',
      'Embedding or test harnesses that tear the interpreter down without a normal exit',
      'A custom buffering handler that must deliver its records before the process ends',
    ],
    avoid: [
      'A normal script or service exit → it already runs through atexit',
      'Finishing one log file early → handler.flush() / handler.close() on that handler',
      'Silencing logging → logging.disable(), or remove the handlers',
    ],
  },

  notes: {
    cpython:       "shutdown(handlerList=_handlerList): for each weak reference in reversed(handlerList[:]): h = wr(); if h: h.acquire(); if getattr(h, 'flushOnClose', True): h.flush(); h.close(); except (OSError, ValueError): pass; finally h.release(). Anything else is re-raised if raiseExceptions is true. At import: atexit.register(shutdown)",
    'Handler list': 'logging._handlerList holds a weak reference to every Handler, added in Handler.__init__ — handlers that were garbage-collected are skipped',
    'multiprocessing': "With the 'fork' start method the child ends with os._exit (Lib/multiprocessing/popen_fork.py); since 3.13 it first replaces the atexit handlers it inherited with multiprocessing's own and runs only those, before that it skipped atexit altogether — either way logging.shutdown() does not run in it",
    'MemoryHandler': 'flushOnClose was added in 3.6; MemoryHandler.flush() sends records to target.handle(), which applies the target\'s filters but not its level',
  },

  related: [
    { name: 'logging.Handler', slug: 'handler', when: 'flush() and close() are Handler methods' },
    { name: 'logging.FileHandler', slug: 'filehandler', when: 'Reopens its file when used after close()' },
    { name: 'logging.StreamHandler', slug: 'streamhandler', when: 'flush() calls the stream\'s flush()' },
    { name: 'logging.disable', slug: 'disable', when: 'Turn logging off without closing anything' },
    { name: 'logging.raiseExceptions', slug: 'handleerror', when: 'Decides whether unexpected errors in shutdown propagate' },
    { name: 'sys module', slug: 'sys', when: 'sys.exit runs atexit handlers; os._exit does not', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Do I need to call logging.shutdown() at the end of my program?',
      a: 'No. The logging module registers shutdown() with atexit when it is imported, so it runs on a normal exit (end of the script, sys.exit(), an uncaught exception). It does not run after os._exit() or when the process is killed by a signal Python does not handle.',
    },
    {
      q: 'Why are my last log messages missing when the program exits?',
      a: 'A buffering handler (such as logging.handlers.MemoryHandler) only writes when its buffer fills, when a record reaches its flush level, or when it is flushed at shutdown. If the process ends with os._exit() or is killed, shutdown never runs. Call logging.shutdown() before os._exit(), and check flushOnClose.',
    },
    {
      q: 'Can I keep logging after logging.shutdown()?',
      a: "The docs say not to. In practice a StreamHandler keeps writing, and a FileHandler reopens its file for the next record — except in mode 'w', where the record is dropped. Don't rely on either; shut down at the very end.",
    },
    {
      q: 'How do I close a single log file instead of all handlers?',
      a: 'Call logger.removeHandler(handler) and then handler.close() on that FileHandler. shutdown() closes every handler in the program.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.shutdown',
    meta:  'logging.shutdown',
  },

};
