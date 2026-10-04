// content/reference/python/stdlib/os/kill.js

export const meta = {
  slug:        'kill',
  name:        'os.kill',
  signature:   'os.kill(pid, sig, /) / os.killpg(pgid, sig, /) / os.abort()',
  blurb:       'Send a signal to a process (kill) or a whole process group (killpg, Unix), or abort the current process at once with SIGABRT. On Windows os.kill terminates the process unless the signal is CTRL_C_EVENT or CTRL_BREAK_EVENT.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all versions); os.kill on Windows 3.2+',
  searchTerms: 'os.kill kill os.killpg killpg os.abort abort send signal to process python kill process by pid SIGTERM SIGKILL SIGINT terminate process check if process exists os.kill pid 0 process group SIGABRT core dump CTRL_C_EVENT TerminateProcess',
};

export const method = {
  slug:      'kill',
  name:      'os.kill',
  signature: 'os.kill(pid, sig, /) / os.killpg(pgid, sig, /) / os.abort()',
  returns:   { type: 'None', desc: 'kill and killpg return None once the signal is sent (they do not wait for the process to end). abort never returns.' },

  category:    'os function',
  version:     'Python 3 (all versions); os.kill on Windows 3.2+',
  hasLiveDemo: false,

  subtitle: 'Signals, not killing: os.kill(pid, signal.SIGTERM) asks a process to stop; the process decides what to do unless the signal is SIGKILL. os.kill works on Unix and Windows (not WASI or iOS) but means different things there, killpg is Unix only, and abort ends the calling process without cleanup.',

  covers: ['kill', 'killpg', 'abort'],

  cheat: {
    commonCall: 'os.kill(pid, signal.SIGTERM)',
    returns:    'None - then wait for the process',
    replaces:   'Popen.terminate() / Popen.kill() for processes you started',
    watchOut:   'Windows: every signal except CTRL_C/CTRL_BREAK events terminates',
  },

  parameters: [
    { name: 'pid',  type: 'int', required: true, default: null, desc: 'kill: the target process id. On Unix 0 and negative values address process groups (see kill(2)).' },
    { name: 'pgid', type: 'int', required: true, default: null, desc: 'killpg: the process group id (Unix only).' },
    { name: 'sig',  type: 'int | signal.Signals', required: true, default: null, desc: 'A signal number, best taken from the signal module (signal.SIGTERM, signal.SIGKILL on Unix). On Unix 0 sends nothing and only checks that the process exists.' },
  ],

  patterns: [
    {
      name: 'Stop politely, then force (Unix)',
      desc: 'SIGTERM lets the process clean up; SIGKILL cannot be caught.',
      code: "import os, signal, time\nos.kill(pid, signal.SIGTERM)\ntime.sleep(5)\ntry:\n    os.kill(pid, signal.SIGKILL)\nexcept ProcessLookupError:\n    pass  # already gone",
    },
    {
      name: 'Does this pid exist? (Unix only)',
      desc: 'Signal 0 checks without sending anything. Do not do this on Windows - see the FAQ.',
      code: "import os\ndef pid_exists(pid):\n    try:\n        os.kill(pid, 0)\n    except ProcessLookupError:\n        return False\n    except PermissionError:\n        return True  # exists, owned by someone else\n    return True",
    },
    {
      name: 'Stop a whole process tree (Unix)',
      desc: 'Start the child in its own session, then signal its group.',
      code: "import os, signal, subprocess\np = subprocess.Popen(['./server.sh'], start_new_session=True)\nos.killpg(os.getpgid(p.pid), signal.SIGTERM)\np.wait()",
    },
    {
      name: 'Processes you started: use Popen',
      desc: 'terminate()/kill() are portable and do nothing if the process already ended.',
      code: "import subprocess\np = subprocess.Popen(['long_job'])\np.terminate()\ntry:\n    p.wait(timeout=5)\nexcept subprocess.TimeoutExpired:\n    p.kill()\n    p.wait()",
    },
  ],

  examples: [
    { title: 'Send SIGTERM to a child you started', code: "import os, signal, subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; sys.stdin.read()'], stdin=subprocess.PIPE)\nos.kill(p.pid, signal.SIGTERM)\np.wait()\np.stdin.close()\n(p.returncode != 0, abs(p.returncode) == signal.SIGTERM)", returns: '(True, True)' },
    { title: 'Signals are an IntEnum',            code: 'import signal\n(int(signal.SIGTERM), signal.SIGTERM.name, signal.Signals(15))', returns: "(15, 'SIGTERM', <Signals.SIGTERM: 15>)" },
    { title: 'SIGINT is 2 on Windows and Linux',code: 'import signal\nint(signal.SIGINT)', returns: '2' },
    { title: 'The portable way: Popen.terminate', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; sys.stdin.read()'], stdin=subprocess.PIPE)\np.terminate()\nrc = p.wait()\np.stdin.close()\nrc != 0", returns: 'True' },
    { title: 'terminate() after exit does nothing', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'pass'])\np.wait()\np.terminate()\np.returncode", returns: '0' },
    { title: 'os.kill after exit raises OSError', code: "import os, signal, subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'pass'])\np.wait()\ntry:\n    os.kill(p.pid, signal.SIGTERM)\nexcept OSError as e:\n    result = isinstance(e, OSError)\nresult", returns: 'True' },
    { title: 'os.abort in a child: no cleanup, no flush', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import os; print(\"lost\"); os.abort()'], capture_output=True, text=True)\n(r.returncode != 0, r.stdout)", returns: "(True, '')" },
  ],

  pitfalls: [
    {
      name: 'Reading returncode right after the signal',
      desc: 'os.kill only sends the signal. Until you wait (or poll), Popen.returncode stays None - and on Unix the dead child stays a zombie.',
      wrong: { label: 'no wait', code: "import os, signal, subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; sys.stdin.read()'], stdin=subprocess.PIPE)\nos.kill(p.pid, signal.SIGTERM)\nrc = p.returncode\np.wait()\np.stdin.close()\nrc is None", output: 'True' },
      fix:   { label: 'wait()', code: "import os, signal, subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; sys.stdin.read()'], stdin=subprocess.PIPE)\nos.kill(p.pid, signal.SIGTERM)\nrc = p.wait()\np.stdin.close()\nrc != 0", output: 'True' },
    },
    {
      name: 'Passing the Popen object instead of its pid',
      desc: 'os.kill needs the integer pid. For a Popen object, use p.pid - or simply p.terminate() / p.send_signal(sig).',
      wrong: { label: 'os.kill(p, ...)', code: "import os, signal, subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'pass'])\np.wait()\ntry:\n    os.kill(p, signal.SIGTERM)\nexcept TypeError as e:\n    result = str(e)\nresult", output: "\"'Popen' object cannot be interpreted as an integer\"" },
      fix:   { label: 'p.terminate()', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'pass'])\np.wait()\np.terminate()\np.returncode", output: '0' },
    },
  ],

  when: {
    use: [
      'Signalling a process you only know by pid (from a pid file, ps, psutil)',
      'killpg: stopping a child together with everything it started (Unix)',
      'abort: crash on purpose to get a core dump for debugging (Unix)',
    ],
    avoid: [
      'Processes you started with subprocess → Popen.terminate() / kill() / send_signal()',
      'Checking whether a pid exists on Windows - os.kill(pid, 0) is not a test there',
      'Ending your own program normally → sys.exit()',
    ],
  },

  notes: {
    cpython:          'os.kill calls kill(2) on Unix; on Windows it calls GenerateConsoleCtrlEvent for CTRL_C_EVENT / CTRL_BREAK_EVENT and TerminateProcess (exit code = sig) for any other value. os.abort calls the C abort() and does not run Python signal handlers for SIGABRT.',
    'Availability':   'kill: Unix, Windows (not WASI or iOS). killpg: Unix only (not WASI or iOS). abort: everywhere.',
    'Exit codes':     'A child stopped by os.kill(pid, signal.SIGTERM) had returncode -15 on Linux and 15 on Windows in our test; Popen.kill() gave -9 on Linux and 1 on Windows. Portable code checks returncode != 0.',
    'Signal numbers': 'signal.SIGTERM is 15 and SIGINT 2 on both, but SIGABRT is 6 on Linux and 22 on Windows, and SIGKILL does not exist on Windows. Always use the names.',
    'abort on Windows': 'The docs say the process returns exit code 3; in our test with Windows CPython 3.13.3 a child calling os.abort() ended with 3221226505 instead. On Linux the child was killed by SIGABRT (returncode -6).',
  },

  related: [
    { name: 'os.waitpid', slug: 'waitpid', when: 'Reap the process after signalling it' },
    { name: 'os._exit',   slug: 'ex_ok',   when: 'End your own process immediately, with a code' },
    { name: 'os.getpid',  slug: 'getpid',  when: 'Your own pid and process group' },
    { name: 'os.spawnv',  slug: 'spawnv',  when: 'Start the process you will signal' },
    { name: 'os module',  slug: 'os',      when: 'Overview of the module', category: 'stdlib' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'Signalling a process you do not own (Unix)', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and does os.kill work on Windows?',
      a: 'Killing processes cannot run inside the page, and the semantics differ: os.kill exists on Unix and Windows (not WASI or iOS), killpg is Unix only. On Windows only signal.CTRL_C_EVENT and CTRL_BREAK_EVENT are delivered as signals (to console processes sharing a console); any other value terminates the process with that number as exit code. The examples only signal a Python child they started and print results that are the same on both systems.',
    },
    {
      q: 'How do I check if a process exists with os.kill(pid, 0)?',
      a: 'On Unix, signal 0 sends nothing: no error means the process exists, ProcessLookupError means it does not, PermissionError means it exists but belongs to another user. Do not do this on Windows: there 0 is signal.CTRL_C_EVENT, and in our test os.kill(child_pid, 0) ended the child.',
    },
    {
      q: 'What is the difference between SIGTERM and SIGKILL?',
      a: 'SIGTERM (15) asks the process to exit; it can catch the signal and clean up. SIGKILL (9 on Linux) cannot be caught or ignored and ends the process immediately. Send SIGTERM first. Windows has no signal.SIGKILL.',
    },
    {
      q: 'How do I kill a process and all its children?',
      a: 'On Unix, start it in a new session (subprocess.Popen(..., start_new_session=True)) and send the signal to its process group with os.killpg(os.getpgid(pid), sig). killpg does not exist on Windows.',
    },
    {
      q: 'What does os.abort() do?',
      a: 'It raises SIGABRT in the current process without running cleanup, flushing buffers or Python SIGABRT handlers. On Unix the default action produces a core dump. Use sys.exit for a normal exit, os._exit for an immediate one.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.kill',
    meta:  'os.kill / killpg / abort',
  },
};
