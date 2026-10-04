// content/reference/python/stdlib/os/ex_ok.js

export const meta = {
  slug:        'ex_ok',
  name:        'os._exit',
  signature:   'os._exit(n) / os.EX_OK, os.EX_USAGE, os.EX_DATAERR, ... (sysexits exit codes)',
  blurb:       'Exit the process immediately with status n - no finally blocks, no atexit handlers, no flushing of stdio buffers. The EX_* constants are the conventional exit codes from sysexits.h (EX_OK = 0).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all versions)',
  searchTerms: 'os._exit _exit exit immediately python os._exit vs sys.exit exit without cleanup forked child exit code EX_OK os.EX_OK EX_USAGE EX_DATAERR EX_NOINPUT EX_NOUSER EX_NOHOST EX_UNAVAILABLE EX_SOFTWARE EX_OSERR EX_OSFILE EX_CANTCREAT EX_IOERR EX_TEMPFAIL EX_PROTOCOL EX_NOPERM EX_CONFIG sysexits exit status codes 64 78 atexit not called',
};

export const method = {
  slug:      'ex_ok',
  name:      'os._exit',
  signature: 'os._exit(n) / os.EX_OK, os.EX_USAGE, os.EX_DATAERR, ... (sysexits exit codes)',
  returns:   { type: 'never returns', desc: 'The process ends with exit status n. The EX_* names are plain int constants.' },

  category:    'os function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: false,

  subtitle: 'sys.exit raises SystemExit and lets Python clean up; os._exit ends the process on the spot. Use it in a forked child, almost nowhere else. os._exit and os.EX_OK exist on Unix and Windows; the other EX_* codes are Unix only.',

  covers: ['_exit', 'EX_OK', 'EX_CANTCREAT', 'EX_CONFIG', 'EX_DATAERR', 'EX_IOERR', 'EX_NOHOST', 'EX_NOINPUT', 'EX_NOPERM', 'EX_NOUSER', 'EX_OSERR', 'EX_OSFILE', 'EX_PROTOCOL', 'EX_SOFTWARE', 'EX_TEMPFAIL', 'EX_UNAVAILABLE', 'EX_USAGE'],

  cheat: {
    commonCall: 'os._exit(0)',
    returns:    'never returns',
    replaces:   'sys.exit(n) is the normal way out',
    watchOut:   'unflushed print() output is lost',
  },

  parameters: [
    { name: 'n', type: 'int', required: true, default: null, desc: 'The exit status. Unix keeps only the low 8 bits (0-255); 0 (EX_OK) means success.' },
  ],

  patterns: [
    {
      name: 'End a forked child (Unix)',
      desc: 'Flush, then _exit, so the child never runs the parent code or its atexit handlers.',
      code: "import os, sys\npid = os.fork()\nif pid == 0:\n    try:\n        do_child_work()\n        code = os.EX_OK\n    except Exception:\n        code = os.EX_SOFTWARE\n    finally:\n        sys.stdout.flush()\n        os._exit(code)",
    },
    {
      name: 'Command-line tool with sysexits codes',
      desc: 'EX_USAGE for bad arguments, EX_NOINPUT for a missing input file. getattr keeps it working on Windows.',
      code: "import os, sys\nEX_USAGE = getattr(os, 'EX_USAGE', 64)\nEX_NOINPUT = getattr(os, 'EX_NOINPUT', 66)\nif len(sys.argv) != 2:\n    print('usage: tool FILE', file=sys.stderr)\n    sys.exit(EX_USAGE)\nif not os.path.exists(sys.argv[1]):\n    sys.exit(EX_NOINPUT)",
    },
    {
      name: 'Hard stop from a watchdog thread',
      desc: 'sys.exit in a thread only ends that thread; os._exit ends the whole process.',
      code: "import os, sys, threading\ndef watchdog():\n    if not finished.wait(timeout=60):\n        print('timed out', file=sys.stderr, flush=True)\n        os._exit(1)\nfinished = threading.Event()\nthreading.Thread(target=watchdog, daemon=True).start()",
    },
  ],

  examples: [
    { title: 'EX_OK is 0',                    code: 'import os\nos.EX_OK', returns: '0' },
    { title: '_exit sets the exit code',      code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import os; os._exit(5)'])\nr.returncode", returns: '5' },
    { title: 'finally blocks are skipped',    code: "import subprocess, sys\ncode = 'import os\\ntry:\\n    os._exit(3)\\nfinally:\\n    print(\"finally ran\")'\nr = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\n(r.returncode, r.stdout)", returns: "(3, '')" },
    { title: 'sys.exit runs them',            code: "import subprocess, sys\ncode = 'import sys\\ntry:\\n    sys.exit(3)\\nfinally:\\n    print(\"finally ran\")'\nr = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\n(r.returncode, r.stdout)", returns: "(3, 'finally ran\\n')" },
    { title: 'sys.exit is just an exception', code: "import sys\ntry:\n    sys.exit(3)\nexcept SystemExit as e:\n    result = ('caught', e.code)\nresult", returns: "('caught', 3)" },
    { title: 'sys.exit with a message: stderr and code 1', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.exit(\"bye\")'], capture_output=True, text=True)\n(r.returncode, r.stderr)", returns: "(1, 'bye\\n')" },
    { title: 'EX_* with a fallback for Windows', code: "import os\ngetattr(os, 'EX_USAGE', 64)", returns: '64' },
  ],

  pitfalls: [
    {
      name: 'Expecting cleanup after os._exit',
      desc: 'atexit handlers, finally blocks and object finalizers do not run. If cleanup matters, use sys.exit - or do the cleanup yourself before calling _exit.',
      wrong: { label: 'os._exit', code: "import subprocess, sys\ncode = 'import atexit, os\\natexit.register(print, \"cleanup ran\")\\nos._exit(0)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "''" },
      fix:   { label: 'sys.exit', code: "import subprocess, sys\ncode = 'import atexit, sys\\natexit.register(print, \"cleanup ran\")\\nsys.exit(0)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'cleanup ran\\n'" },
    },
    {
      name: 'Losing printed output',
      desc: 'stdout to a pipe or file is block-buffered and _exit does not flush it. Flush (print(..., flush=True) or sys.stdout.flush()) before _exit.',
      wrong: { label: 'no flush', code: "import subprocess, sys\ncode = 'import os; print(\"saved?\", end=\"\"); os._exit(0)'\nr = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\nr.stdout", output: "''" },
      fix:   { label: 'flush=True', code: "import subprocess, sys\ncode = 'import os; print(\"saved\", end=\"\", flush=True); os._exit(0)'\nr = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\nr.stdout", output: "'saved'" },
    },
  ],

  when: {
    use: [
      'The child process after os.fork() - the docs name this as the normal use',
      'Ending the whole process from a thread or after a fatal state where cleanup could hang',
      'EX_* codes: Unix command-line tools that want conventional, documented exit codes',
    ],
    avoid: [
      'Normal program exit → sys.exit(n) (or just return from main)',
      'Any exit where files, buffers or atexit handlers must be flushed',
      'EX_* names other than EX_OK in code that must run on Windows - they do not exist there',
    ],
  },

  notes: {
    cpython:          'os._exit calls the C _exit() directly (Modules/posixmodule.c). sys.exit raises SystemExit, which unwinds the stack, then interpreter shutdown runs atexit handlers and flushes stdio.',
    'Availability':   '_exit: everywhere. EX_OK: Unix, Windows. EX_USAGE ... EX_CONFIG: Unix only (not WASI), and only where the platform defines them.',
    'Values on Linux': 'EX_OK 0, EX_USAGE 64, EX_DATAERR 65, EX_NOINPUT 66, EX_NOUSER 67, EX_NOHOST 68, EX_UNAVAILABLE 69, EX_SOFTWARE 70, EX_OSERR 71, EX_OSFILE 72, EX_CANTCREAT 73, EX_IOERR 74, EX_TEMPFAIL 75, EX_PROTOCOL 76, EX_NOPERM 77, EX_CONFIG 78.',
    'Range':          'Unix keeps only the low 8 bits: in our test os._exit(256) gave exit code 0 and os._exit(-1) gave 255 on Linux, but 256 and 4294967295 on Windows. Stay within 0-255.',
    'Meanings':       'EX_USAGE wrong usage/arguments, EX_DATAERR bad input data, EX_NOINPUT input file missing or unreadable, EX_NOUSER / EX_NOHOST unknown user / host, EX_UNAVAILABLE service unavailable, EX_SOFTWARE internal error, EX_OSERR OS error (e.g. cannot fork), EX_OSFILE system file problem, EX_CANTCREAT cannot create output file, EX_IOERR I/O error, EX_TEMPFAIL temporary failure (retry later), EX_PROTOCOL protocol error, EX_NOPERM insufficient permission, EX_CONFIG configuration error.',
  },

  related: [
    { name: 'os.fork',     slug: 'fork',    when: 'Where os._exit belongs' },
    { name: 'os.waitpid',  slug: 'waitpid', when: 'Read the exit code from the parent' },
    { name: 'os.kill / abort', slug: 'kill', when: 'End a process with a signal instead' },
    { name: 'os.system',   slug: 'system',  when: 'Get the exit status of a command' },
    { name: 'os module',   slug: 'os',      when: 'Overview of the module', category: 'stdlib' },
    { name: 'SystemExit',  slug: 'systemexit', when: 'What sys.exit raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and do the EX_* constants exist on Windows?',
      a: 'os._exit would end the page process itself, so the examples call it only in a separate Python child. os._exit and os.EX_OK work on Unix and Windows; EX_USAGE, EX_DATAERR and the other EX_* codes are Unix only (not WASI), so on Windows os.EX_USAGE raises AttributeError - use getattr(os, "EX_USAGE", 64) for portable code.',
    },
    {
      q: 'What is the difference between os._exit and sys.exit?',
      a: 'sys.exit(n) raises SystemExit: try/except can catch it, finally blocks and atexit handlers run, buffers are flushed. os._exit(n) ends the process immediately with none of that. Use sys.exit normally and os._exit in a forked child.',
    },
    {
      q: 'Why did my print output disappear when I used os._exit?',
      a: 'When stdout goes to a pipe or file it is buffered, and os._exit does not flush it. Use print(..., flush=True) or call sys.stdout.flush() before os._exit.',
    },
    {
      q: 'What exit code should a Python script return?',
      a: '0 (os.EX_OK) for success, non-zero for failure; 1 is the common generic error and what sys.exit("message") uses. Unix tools often use the sysexits codes 64-78 (os.EX_USAGE to os.EX_CONFIG) to say why they failed. Keep codes within 0-255.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os._exit',
    meta:  'os._exit / EX_*',
  },
};
