// content/reference/python/stdlib/sys/exit.js

export const meta = {
  slug:        'exit',
  name:        'sys.exit',
  signature:   'sys.exit(status=None, /)',
  blurb:       'End the program by raising SystemExit: an int is the exit status, None means 0, anything else is printed to stderr and exits with status 1.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All versions',
  searchTerms: 'sys.exit exit python script exit code exit status systemexit sys.exit(0) sys.exit(1) quit program stop script error message return code finally',
};

export const method = {
  slug:      'exit',
  name:      'sys.exit',
  signature: 'sys.exit(status=None, /)',
  returns:   { type: 'NoReturn', desc: 'Never returns: it raises SystemExit(status).' },

  category:    'sys function',
  version:     'All versions',
  hasLiveDemo: true,

  subtitle: 'sys.exit does not stop anything by itself — it raises SystemExit, which unwinds the stack (running finally blocks and with exits) and ends the process only if nothing catches it on the way out.',

  covers: ['exit'],

  cheat: {
    commonCall: "sys.exit('error: config.toml not found')",
    returns:    'never — raises SystemExit',
    replaces:   'os._exit (which skips cleanup) for normal exits',
    watchOut:   'A bare except: swallows it; in a thread it only ends that thread',
  },

  parameters: [
    { name: 'status', type: 'int | str | None | object', required: false, default: 'None', desc: 'int: the exit status (0 = success). None: status 0. Anything else: printed to stderr, status 1.' },
  ],

  modes: [
    {
      id: 'exit',
      label: 'exit',
      blurb: 'Call sys.exit with a value: the inner finally still runs, and the outer handler reads the value back as e.code.',
      params: [{ name: 'arg', type: 'int | str', hint: 'a number or a message', input: 'auto' }],
      template: "import sys\nlog = []\ntry:\n    try:\n        sys.exit({$arg})\n    finally:\n        log.append('finally ran')\nexcept SystemExit as e:\n    log.append(f'caught SystemExit, code={e.code!r}')\nlog",
      cases: [
        { id: 'zero',  label: '0',       values: { arg: '0' } },
        { id: 'two',   label: '2',       values: { arg: '2' } },
        { id: 'msg',   label: 'message', values: { arg: 'config file missing' } },
        { id: 'float', label: '1.5',     values: { arg: '1.5' } },
      ],
    },
  ],
  demoExplainer: 'e.code is exactly the argument you passed. What the process reports afterwards depends on its type: an int becomes the exit status, None becomes 0, and anything else — a message, 1.5 — is printed to stderr and the status is 1. On Linux the shell sees the int modulo 256 (256 becomes 0, -1 becomes 255); Windows keeps 32 bits (-1 becomes 4294967295).',

  patterns: [
    {
      name: 'Exit with a message',
      desc: 'The message goes to stderr and the status is 1 — the usual "fatal error" exit.',
      code: "import sys\nif not config_path.exists():\n    sys.exit(f'error: {config_path} not found')",
    },
    {
      name: 'main() returns the status',
      desc: 'Keep sys.exit at the edge; main stays testable.',
      code: "import sys\n\ndef main() -> int:\n    ...\n    return 0\n\nif __name__ == '__main__':\n    sys.exit(main())",
    },
    {
      name: 'Cleanup that always runs',
      desc: 'finally and with blocks run while SystemExit unwinds the stack.',
      code: "import sys\nwith open('log.txt', 'a', encoding='utf-8') as log:\n    log.write('starting\\n')\n    sys.exit(3)  # the file is still closed properly",
    },
  ],

  examples: [
    { title: 'It raises SystemExit',     code: "import sys\ntry:\n    sys.exit(2)\nexcept SystemExit as e:\n    result = e.code\nresult", returns: '2' },
    { title: 'No argument: code is None', code: "import sys\ntry:\n    sys.exit()\nexcept SystemExit as e:\n    result = (e.code, e.args)\nresult", returns: '(None, ())' },
    { title: 'A message is kept as code', code: "import sys\ntry:\n    sys.exit('disk full')\nexcept SystemExit as e:\n    result = (e.code, str(e))\nresult", returns: "('disk full', 'disk full')" },
    { title: 'Uncaught, it ends the program', code: 'import sys\nsys.exit(3)', returns: 'SystemExit: 3' },
    { title: 'What the parent process sees', code: "import subprocess, sys\np = subprocess.run([sys.executable, '-c', 'import sys; sys.exit(\"bye\")'], capture_output=True, text=True)\n(p.returncode, p.stderr)", returns: "(1, 'bye\\n')" },
    { title: 'Status 0 and None both mean success', code: "import subprocess, sys\ncodes = []\nfor arg in ['0', 'None', '4']:\n    p = subprocess.run([sys.executable, '-c', f'import sys; sys.exit({arg})'])\n    codes.append(p.returncode)\ncodes", returns: '[0, 0, 4]' },
    { title: 'Not an Exception subclass', code: 'issubclass(SystemExit, Exception)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'A bare except swallows the exit',
      desc: 'except: (or except BaseException:) catches SystemExit too, so the program keeps running. Catch Exception — SystemExit is not one.',
      wrong: { label: 'bare except', code: "import sys\ntry:\n    sys.exit(1)\nexcept:\n    result = 'still running'\nresult", output: "'still running'" },
      fix:   { label: 'except Exception', code: "import sys\ntry:\n    try:\n        sys.exit(1)\n    except Exception:\n        result = 'still running'\nexcept SystemExit as e:\n    result = f'exiting with {e.code}'\nresult", output: "'exiting with 1'" },
    },
    {
      name: 'sys.exit in a thread',
      desc: 'SystemExit only ends the thread that raised it; the main thread carries on. Report the status back and exit from the main thread.',
      wrong: { label: 'exit in thread', code: "import sys, threading\nt = threading.Thread(target=sys.exit, args=(1,))\nt.start()\nt.join()\n'main thread still running'", output: "'main thread still running'" },
      fix:   { label: 'exit in main', code: "import sys, threading\nstatus = []\nt = threading.Thread(target=lambda: status.append(1))\nt.start()\nt.join()\ntry:\n    sys.exit(status[0])\nexcept SystemExit as e:\n    result = f'main thread exits with {e.code}'\nresult", output: "'main thread exits with 1'" },
    },
  ],

  when: {
    use: [
      'Ending a script with a status code or a fatal-error message',
      'sys.exit(main()) at the bottom of a command-line program',
    ],
    avoid: [
      'Signalling an error inside a library → raise an exception and let the caller decide',
      'Ending immediately without cleanup (child after os.fork) → os._exit',
      'Stopping a thread → return from its function',
    ],
  },

  notes: {
    cpython:        'sys_exit in Python/sysmodule.c simply raises SystemExit(status); the interpreter turns an uncaught SystemExit into the process exit status (Python/pythonrun.c, handle_system_exit)',
    'Exit status':  'Keep ints in 0–127 for portable meaning; on Linux the status is taken modulo 256, on Windows -1 is reported as 4294967295',
    'Cleanup':      'finally blocks, with exits and atexit handlers run; if flushing stdout/stderr fails during cleanup the status becomes 120',
    'exit() vs sys.exit()': 'exit() and quit() come from the site module for the interactive prompt; use sys.exit() in programs',
  },

  related: [
    { name: 'SystemExit',  slug: 'systemexit',  when: 'The exception sys.exit raises', category: 'exceptions' },
    { name: 'BaseException', slug: 'baseexception', when: 'Why except Exception does not catch it', category: 'exceptions' },
    { name: 'try / finally', slug: 'try', when: 'Cleanup that runs on exit', category: 'keywords' },
    { name: 'sys.argv',    slug: 'argv',  when: 'Arguments to validate before exiting' },
    { name: 'sys.stderr',  slug: 'stdout', when: 'Where an exit message is printed' },
  ],

  faq: [
    {
      q: 'What is the difference between sys.exit(0) and sys.exit(1)?',
      a: '0 means success and any other int means failure to the shell or parent process. By convention 1 is a general error and 2 a command-line usage error. sys.exit() with no argument is the same as sys.exit(0).',
    },
    {
      q: 'Why does sys.exit() not exit my program?',
      a: 'It raises SystemExit, and something caught it: a bare except:, except BaseException:, or a framework that handles it. Or it ran in a thread other than the main thread, where it only ends that thread.',
    },
    {
      q: 'Should I use sys.exit(), exit() or os._exit()?',
      a: 'sys.exit() in programs. exit()/quit() are conveniences for the interactive prompt. os._exit() ends the process immediately without finally blocks, atexit handlers or flushing buffers — only for special cases such as a child process after os.fork().',
    },
    {
      q: 'How do I exit with an error message?',
      a: "sys.exit('error: something went wrong') prints the message to stderr and exits with status 1.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.exit',
    meta:  'sys.exit',
  },
};
