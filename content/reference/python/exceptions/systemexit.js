// content/reference/python/exceptions/systemexit.js

export const meta = {
  slug:        'systemexit',
  name:        'SystemExit',
  signature:   'SystemExit([code])',
  blurb:       'Raised by sys.exit(); when it reaches the top level the interpreter exits quietly with the status derived from e.code.',
  category:    'control',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'systemexit system exit sys.exit exit code exit status return code e.code quit exit() os._exit argparse exit script terminate program',
};

export const method = {
  slug:      'systemexit',
  name:      'SystemExit',
  signature: 'SystemExit([code])',

  category:    'Control-flow exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'sys.exit() is just raise SystemExit(code): finally blocks run, it can be caught, and the code decides the exit status — None → 0, int → itself, anything else → printed, status 1.',

  chain: ['BaseException', 'SystemExit'],

  cheat: {
    raisedBy: 'sys.exit(code), exit()/quit() in the REPL, argparse on bad arguments (code 2)',
    message:  'no traceback printed; a non-int code is printed to stderr',
    quickFix: 'sys.exit(0) success, sys.exit(1) failure, sys.exit("msg") error + status 1',
    watchOut: 'a bare except: catches it and the program keeps running',
  },

  parameters: [
    { name: 'code', type: 'int | str | None', required: false, default: 'None', desc: 'The exit status or message, stored as e.code. None (or no argument) → status 0; an int → that status; any other object → printed to stderr, status 1. With several arguments, code is the whole args tuple.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Call sys.exit() and catch the SystemExit it raises. e.code is exactly the argument you passed.',
      params: [{ name: 'code', type: 'int | float | str', hint: 'numbers stay numbers', input: 'auto' }],
      template: 'import sys\ntry:\n    sys.exit({$code})\nexcept SystemExit as e:\n    r = e.code\nr',
      cases: [
        { id: 'int', label: 'status 3',  values: { code: '3' } },
        { id: 'str', label: 'message',   values: { code: 'config file missing' } },
        { id: 'zero', label: 'status 0', values: { code: '0' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Construct SystemExit directly with any number of arguments and compare code with args.',
      params: [{ name: 'args', type: 'list[str]', hint: 'comma-separated, empty for none', input: 'csv' }],
      template: 'e = SystemExit(*{$args})\n(e.code, e.args)',
      cases: [
        { id: 'none', label: 'no args',  values: { args: '' } },
        { id: 'one',  label: 'one arg',  values: { args: 'bye' } },
        { id: 'two',  label: 'two args', values: { args: 'bye, now' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Because it is an exception, finally blocks run on the way out — before any handler sees it.',
      params: [{ name: 'code', type: 'int | float | str', hint: 'numbers stay numbers', input: 'auto' }],
      template: "import sys\nlog = []\ntry:\n    try:\n        sys.exit({$code})\n    finally:\n        log.append('finally ran')\nexcept SystemExit as e:\n    log.append(f'exit code {e.code!r}')\nlog",
      cases: [
        { id: 'int', label: 'status 2', values: { code: '2' } },
        { id: 'str', label: 'message',  values: { code: 'aborted' } },
      ],
    },
  ],
  demoExplainer: "e.code is stored as-is — 3 stays an int, a message stays a string, and SystemExit() with no argument has code None. The interpreter converts it to a process status only at the very end: None → 0, int → that number, anything else is printed to stderr and becomes 1. The demo catches it on purpose; uncaught, the program would simply end without a traceback.",

  attributes: [
    { name: 'code', type: 'object', meaning: 'The exit status or message passed to the constructor / sys.exit(). None by default; the args tuple when there are several arguments.' },
    { name: 'args', type: 'tuple', meaning: 'Constructor arguments. sys.exit() with no argument gives an empty tuple.' },
  ],

  patterns: [
    {
      name: 'Script entry point with an exit status',
      desc: 'Return an int from main() and pass it to sys.exit — shells and CI read the status.',
      code: "import sys\n\ndef main() -> int:\n    if not check():\n        print('check failed', file=sys.stderr)\n        return 1\n    return 0\n\nif __name__ == '__main__':\n    sys.exit(main())",
    },
    {
      name: 'Exit with an error message',
      desc: 'A string code is printed to stderr and the status is 1 — the shortest correct way to fail.',
      code: "if not os.path.exists(path):\n    sys.exit(f'error: {path} not found')",
    },
    {
      name: 'Testing code that calls sys.exit',
      desc: 'Catch the SystemExit and assert on the code (pytest.raises(SystemExit) does the same).',
      code: "try:\n    cli(['--bad-flag'])\nexcept SystemExit as e:\n    assert e.code == 2",
    },
  ],

  examples: [
    { title: 'sys.exit() with no argument', code: 'import sys\ntry:\n    sys.exit()\nexcept SystemExit as e:\n    r = (e.code, e.args)\nr', returns: '(None, ())' },
    { title: 'Exit statuses the OS sees', code: "import subprocess, sys\ndef status(arg):\n    cmd = [sys.executable, '-c', f'import sys; sys.exit({arg})']\n    return subprocess.run(cmd, capture_output=True).returncode\n[status(a) for a in ['', 'None', '0', '3', 'True', \"'bye'\"]]", returns: '[0, 0, 0, 3, 1, 1]' },
    { title: 'A string code goes to stderr', code: "import subprocess, sys\ncmd = [sys.executable, '-c', \"import sys; sys.exit('fatal: no config')\"]\nr = subprocess.run(cmd, capture_output=True, text=True)\n(r.returncode, r.stderr)", returns: "(1, 'fatal: no config\\n')" },
    { title: 'except Exception does not catch it', code: "import sys\ntry:\n    try:\n        sys.exit(4)\n    except Exception:\n        r = 'swallowed'\nexcept SystemExit as e:\n    r = f'still exiting with {e.code}'\nr", returns: "'still exiting with 4'" },
    { title: 'Several arguments: code is the tuple', code: 'SystemExit(1, 2).code', returns: '(1, 2)' },
    { title: 'os._exit skips finally', code: "import subprocess, sys\nsrc = \"import os\\ntry:\\n    os._exit(4)\\nfinally:\\n    print('cleanup')\"\nr = subprocess.run([sys.executable, '-c', src], capture_output=True, text=True)\n(r.returncode, r.stdout)", returns: "(4, '')" },
    { title: 'argparse exits with code 2', code: "import argparse\np = argparse.ArgumentParser(prog='tool')\np.add_argument('--n', type=int)\ntry:\n    p.parse_args(['--n', 'x'])\nexcept SystemExit as e:\n    r = e.code\nr", returns: '2' },
  ],

  pitfalls: [
    {
      name: 'Passing the status as a string',
      desc: "sys.exit('0') is a message, not a status: it prints 0 to stderr and exits with 1. Convert to int.",
      wrong: { label: "sys.exit('0')", code: "import subprocess, sys\ncmd = [sys.executable, '-c', \"import sys; sys.exit('0')\"]\nr = subprocess.run(cmd, capture_output=True, text=True)\n(r.returncode, r.stderr)", output: "(1, '0\\n')" },
      fix:   { label: 'sys.exit(0)', code: "import subprocess, sys\ncmd = [sys.executable, '-c', \"import sys; sys.exit(0)\"]\nr = subprocess.run(cmd, capture_output=True, text=True)\n(r.returncode, r.stderr)", output: "(0, '')" },
    },
    {
      name: 'argparse errors are not Exceptions',
      desc: 'On bad arguments argparse prints usage and calls sys.exit(2), which sails past except Exception. Use exit_on_error=False to get argparse.ArgumentError instead.',
      wrong: { label: 'except Exception', code: "import argparse\np = argparse.ArgumentParser(prog='tool')\np.add_argument('--n', type=int)\ntry:\n    try:\n        p.parse_args(['--n', 'x'])\n    except Exception:\n        r = 'handled'\nexcept SystemExit as e:\n    r = f'exited with {e.code}'\nr", output: "'exited with 2'" },
      fix:   { label: 'exit_on_error=False', code: "import argparse\np = argparse.ArgumentParser(prog='tool', exit_on_error=False)\np.add_argument('--n', type=int)\ntry:\n    p.parse_args(['--n', 'x'])\nexcept argparse.ArgumentError as e:\n    r = str(e)\nr", output: "\"argument --n: invalid int value: 'x'\"" },
    },
    {
      name: 'A bare except cancels the exit',
      desc: 'except: catches SystemExit, so the "exit" becomes a no-op and the code after it runs.',
      wrong: { label: 'bare except', code: "import sys\nlog = []\ntry:\n    sys.exit(1)\nexcept:\n    log.append('error ignored')\nlog.append('still running')\nlog", output: "['error ignored', 'still running']" },
      fix:   { label: 'except Exception', code: "import sys\nlog = []\ntry:\n    try:\n        sys.exit(1)\n    except Exception:\n        log.append('error ignored')\n    log.append('still running')\nexcept SystemExit:\n    log.append('exited')\nlog", output: "['exited']" },
    },
  ],

  when: {
    use: [
      'Ending a script with a status code other programs can check',
      'Failing fast with a message: sys.exit("error: ...")',
      'Catching it in tests or in a host that runs user scripts',
    ],
    avoid: [
      'Signalling an error inside a library → raise a real exception; let the caller decide to exit',
      'Immediate exit that skips cleanup (after fork) → os._exit()',
      'exit() / quit() in scripts → they are REPL helpers added by site; use sys.exit()',
    ],
  },

  notes: {
    cpython:        'Python/pythonrun.c — handle_system_exit() turns e.code into the process status and prints non-int codes to stderr',
    'No traceback': 'An uncaught SystemExit ends the interpreter without printing a traceback',
    'Threads':      'sys.exit() in a non-main thread only ends that thread',
    'Status range': 'Most systems expect 0–127; on POSIX the status is truncated to 8 bits, so sys.exit(256) looks like success',
  },

  related: [
    { name: 'KeyboardInterrupt', slug: 'keyboardinterrupt', when: 'Ctrl+C — the other way a program is asked to stop' },
    { name: 'BaseException',     slug: 'baseexception',     when: 'Why except Exception does not catch it' },
    { name: 'Exception',         slug: 'exception',         when: 'Raise these in libraries instead of exiting' },
    { name: 'GeneratorExit',     slug: 'generatorexit',     when: 'Another BaseException that is not an error' },
    { name: 'print',             slug: 'print',             when: 'print(msg, file=sys.stderr) before exiting', category: 'functions' },
  ],

  faq: [
    {
      q: 'What exit code does sys.exit() use?',
      a: "sys.exit() and sys.exit(None) exit with 0. sys.exit(n) with an int exits with n. Any other value — sys.exit('message') — is printed to stderr and the status is 1. True counts as the int 1. A string that looks like a number is still a string: sys.exit('0') exits with 1.",
    },
    {
      q: 'Why does except Exception not catch sys.exit()?',
      a: 'sys.exit() raises SystemExit, which inherits from BaseException instead of Exception so that catch-all error handlers do not cancel a requested exit. Catch it explicitly with except SystemExit when you need to (tests, plugin hosts).',
    },
    {
      q: 'What is the difference between sys.exit(), exit() and os._exit()?',
      a: 'sys.exit() raises SystemExit: finally blocks and with statements run and atexit handlers fire. exit() and quit() do the same but are added by the site module for the interactive shell and should not be used in programs. os._exit(n) ends the process immediately without cleanup or flushing buffers — meant for child processes after os.fork().',
    },
    {
      q: 'How do I get the exit code from a SystemExit exception?',
      a: 'e.code. It holds the value passed to sys.exit() unchanged: None, an int, or a message. To compute the resulting status: 0 if code is None, code if it is an int, otherwise 1.',
    },
    {
      q: 'Does sys.exit() exit from a thread?',
      a: 'Only from that thread. SystemExit raised in a non-main thread ends the thread silently; the program keeps running until the main thread finishes. Use a flag, a queue message, or os._exit in exceptional cases.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#SystemExit',
    meta:  'Built-in exceptions',
  },
};
