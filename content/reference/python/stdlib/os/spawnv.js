// content/reference/python/stdlib/os/spawnv.js

export const meta = {
  slug:        'spawnv',
  name:        'os.spawnv',
  signature:   'os.spawnv(mode, path, args) / spawnve / spawnvp / spawnvpe / spawnl(mode, path, ...) / spawnle / spawnlp / spawnlpe / os.posix_spawn(path, argv, env, *, file_actions=None, ...) / posix_spawnp',
  blurb:       'Start a program in a new process: with P_WAIT you get its exit code, with P_NOWAIT its process id (a handle on Windows). posix_spawn/posix_spawnp are the Unix C posix_spawn() API. subprocess is the recommended replacement for all of them.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all versions); posix_spawn 3.8+, POSIX_SPAWN_CLOSEFROM 3.13+',
  searchTerms: 'os.spawnv spawnv os.spawnve spawnve os.spawnvp spawnvp os.spawnvpe spawnvpe os.spawnl spawnl os.spawnle spawnle os.spawnlp spawnlp os.spawnlpe spawnlpe P_WAIT os.P_WAIT P_NOWAIT os.P_NOWAIT P_NOWAITO P_DETACH P_OVERLAY os.posix_spawn posix_spawn os.posix_spawnp posix_spawnp POSIX_SPAWN_CLOSE POSIX_SPAWN_CLOSEFROM POSIX_SPAWN_DUP2 POSIX_SPAWN_OPEN file_actions start process python run program exit code',
};

export const method = {
  slug:      'spawnv',
  name:      'os.spawnv',
  signature: 'os.spawnv(mode, path, args) / spawnve / spawnvp / spawnvpe / spawnl(mode, path, ...) / spawnle / spawnlp / spawnlpe / os.posix_spawn(path, argv, env, *, file_actions=None, ...) / posix_spawnp',
  returns:   { type: 'int', desc: 'spawn* with P_WAIT: the exit code, or -signal if a signal killed it (Unix). With P_NOWAIT: the process id (the process handle on Windows). posix_spawn/posix_spawnp: the child pid.' },

  category:    'os function',
  version:     'Python 3 (all versions); posix_spawn 3.8+, POSIX_SPAWN_CLOSEFROM 3.13+',
  hasLiveDemo: false,

  subtitle: 'The spawn family = fork + exec in one call. spawnl/spawnle/spawnv/spawnve and P_WAIT/P_NOWAIT/P_NOWAITO exist on Unix and Windows; the PATH-searching spawnlp/spawnlpe/spawnvp/spawnvpe are not available on Windows; P_DETACH and P_OVERLAY are Windows only; posix_spawn, posix_spawnp and the POSIX_SPAWN_* constants are Unix only.',

  covers: ['spawnl', 'spawnle', 'spawnlp', 'spawnlpe', 'spawnv', 'spawnve', 'spawnvp', 'spawnvpe', 'P_WAIT', 'P_NOWAIT', 'P_NOWAITO', 'P_DETACH', 'P_OVERLAY', 'posix_spawn', 'posix_spawnp', 'POSIX_SPAWN_CLOSE', 'POSIX_SPAWN_CLOSEFROM', 'POSIX_SPAWN_DUP2', 'POSIX_SPAWN_OPEN'],

  cheat: {
    commonCall: 'os.spawnv(os.P_WAIT, exe, [exe, arg1])',
    returns:    'exit code (P_WAIT) or pid / handle (P_NOWAIT)',
    replaces:   'subprocess.call / subprocess.Popen do the same, portably',
    watchOut:   'Windows does not quote arguments that contain spaces',
  },

  parameters: [
    { name: 'mode', type: 'int',  required: true, default: null, desc: 'P_WAIT (wait, return the exit code), P_NOWAIT / P_NOWAITO (return at once with the pid), Windows only: P_DETACH (no console) and P_OVERLAY (replace the current process, like exec).' },
    { name: 'path', type: 'str | PathLike', required: true, default: null, desc: 'The program. Only the p-variants search PATH; the others need an absolute or relative path.' },
    { name: 'args', type: 'list | tuple', required: true, default: null, desc: 'v-variants: the argv, starting with the program name (not empty). l-variants pass the same items as separate arguments.' },
    { name: 'env',  type: 'Mapping[str, str]', required: true, default: null, desc: 'e-variants: the complete environment of the new process; keys and values must be str.' },
    { name: 'file_actions', type: 'sequence of tuples', required: false, default: 'None', desc: 'posix_spawn: fd operations done in the child before exec - (POSIX_SPAWN_OPEN, fd, path, flags, mode), (POSIX_SPAWN_CLOSE, fd), (POSIX_SPAWN_DUP2, fd, new_fd), (POSIX_SPAWN_CLOSEFROM, fd).' },
  ],

  patterns: [
    {
      name: 'Run and wait (the docs example)',
      desc: 'spawnlp and spawnvpe here are equivalent; both search PATH, so Unix only.',
      code: "import os\nos.spawnlp(os.P_WAIT, 'cp', 'cp', 'index.html', '/dev/null')\nL = ['cp', 'index.html', '/dev/null']\nos.spawnvpe(os.P_WAIT, 'cp', L, os.environ)",
    },
    {
      name: 'Start in the background, wait later',
      desc: 'P_NOWAIT returns the pid (a handle on Windows) that waitpid accepts.',
      code: "import os, sys\npid = os.spawnv(os.P_NOWAIT, sys.executable, [sys.executable, 'worker.py'])\n# ... do other work ...\n_, status = os.waitpid(pid, 0)\nexit_code = os.waitstatus_to_exitcode(status)",
    },
    {
      name: 'posix_spawn with output redirected to a file',
      desc: 'file_actions open log.txt as fd 1 in the child before the program starts.',
      code: "import os\nactions = [(os.POSIX_SPAWN_OPEN, 1, 'log.txt', os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)]\npid = os.posix_spawnp('ls', ['ls', '-l'], os.environ, file_actions=actions)\nos.waitpid(pid, 0)",
    },
    {
      name: 'The modern replacement',
      desc: 'subprocess.run covers P_WAIT; subprocess.Popen covers P_NOWAIT.',
      code: "import subprocess, sys\nexit_code = subprocess.run([sys.executable, 'worker.py']).returncode\nproc = subprocess.Popen([sys.executable, 'worker.py'])\nproc.wait()",
    },
  ],

  examples: [
    { title: 'P_WAIT returns the exit code',  code: "import os, sys\nos.spawnv(os.P_WAIT, sys.executable, [sys.executable, '-c', 'raise(SystemExit(4))'])", returns: '4' },
    { title: 'The l form: arguments one by one', code: "import os, sys\nos.spawnl(os.P_WAIT, sys.executable, sys.executable, '-c', 'raise(SystemExit(4))')", returns: '4' },
    { title: 'P_NOWAIT, then waitpid',        code: "import os, sys\npid = os.spawnv(os.P_NOWAIT, sys.executable, [sys.executable, '-c', 'raise(SystemExit(7))'])\n_, status = os.waitpid(pid, 0)\nos.waitstatus_to_exitcode(status)", returns: '7' },
    { title: 'The portable mode values',      code: 'import os\n(os.P_WAIT, os.P_NOWAIT)', returns: '(0, 1)' },
    { title: 'args must not be empty',        code: "import os, sys\ntry:\n    os.spawnv(os.P_WAIT, sys.executable, [])\nexcept ValueError as e:\n    result = type(e).__name__\nresult", returns: "'ValueError'" },
    { title: 'args must be a list or tuple',  code: "import os, sys\ntry:\n    os.spawnv(os.P_WAIT, sys.executable, sys.executable)\nexcept TypeError as e:\n    result = type(e).__name__\nresult", returns: "'TypeError'" },
    { title: 'Same thing with subprocess',    code: "import subprocess, sys\nsubprocess.call([sys.executable, '-c', 'raise SystemExit(4)'])", returns: '4' },
  ],

  pitfalls: [
    {
      name: 'Arguments with spaces on Windows',
      desc: "On Windows spawn* builds the child's command line without quoting, so an argument containing a space arrives split in two (in our test, '-c', 'raise SystemExit(4)' made the child run just raise). subprocess quotes each argument properly. That is why the examples here use 'raise(SystemExit(4))'.",
      wrong: { label: 'joined as is', code: "' '.join(['-c', 'raise SystemExit(4)'])", output: "'-c raise SystemExit(4)'" },
      fix:   { label: 'quoted like subprocess', code: "import subprocess\nsubprocess.list2cmdline(['-c', 'raise SystemExit(4)'])", output: "'-c \"raise SystemExit(4)\"'" },
    },
    {
      name: 'Reading P_NOWAIT as an exit code',
      desc: 'With P_NOWAIT the return value is a process id (or handle), not a result. Wait for the process to get the exit code - on Unix an un-waited child also stays a zombie.',
      wrong: { label: 'compare the pid', code: "import os, sys\nrc = os.spawnv(os.P_NOWAIT, sys.executable, [sys.executable, '-c', 'raise(SystemExit(7))'])\nos.waitpid(rc, 0)\nrc == 7", output: 'False' },
      fix:   { label: 'waitpid', code: "import os, sys\npid = os.spawnv(os.P_NOWAIT, sys.executable, [sys.executable, '-c', 'raise(SystemExit(7))'])\n_, status = os.waitpid(pid, 0)\nos.waitstatus_to_exitcode(status) == 7", output: 'True' },
    },
  ],

  when: {
    use: [
      'Porting old code that already uses spawn*',
      'posix_spawn: a fast fork-free start of a program on Unix with simple fd setup',
    ],
    avoid: [
      'New code → subprocess.run / subprocess.Popen (the docs recommend it)',
      'Arguments with spaces on Windows → subprocess, which quotes them',
      'spawnle / spawnve on Windows → the docs call them not thread-safe there; use subprocess',
    ],
  },

  notes: {
    cpython:          'On Windows spawnv/spawnve are C functions (Modules/posixmodule.c, _wspawnv / _wspawnve). On Unix the whole spawn* family is Python code in Lib/os.py: fork(), then exec in the child, then waitpid + waitstatus_to_exitcode in the parent for P_WAIT.',
    'Availability':   'spawnl, spawnle, spawnv, spawnve, P_WAIT, P_NOWAIT, P_NOWAITO: Unix, Windows (not WASI, Android or iOS). spawnlp, spawnlpe, spawnvp, spawnvpe: not on Windows. P_DETACH, P_OVERLAY: Windows only. posix_spawn, posix_spawnp, POSIX_SPAWN_*: Unix only; POSIX_SPAWN_CLOSEFROM (3.13) only where the C library has posix_spawn_file_actions_addclosefrom_np().',
    'Missing program': 'On Unix a program that cannot be executed gives exit code 127 (the forked child fails to exec and calls os._exit(127)); on Windows spawnv raises FileNotFoundError instead.',
    'Constant values': 'P_WAIT is 0 and P_NOWAIT is 1 on Windows and Linux. P_NOWAITO is 3 on Windows but 1 (the same as P_NOWAIT) on Linux; P_DETACH is 4 and P_OVERLAY 2 on Windows.',
    'Windows crash':  'In our test on Windows CPython 3.13.3, os.spawnve and os.spawnle crashed the interpreter with an access violation. subprocess.run(..., env=...) does the same job safely.',
    'posix_spawn':    'env may be None (3.13+) to inherit the current environment. Keyword options setpgroup, resetids, setsid, setsigmask, setsigdef and scheduler map to the C POSIX_SPAWN_* flags.',
  },

  related: [
    { name: 'os.waitpid',  slug: 'waitpid', when: 'Wait for a P_NOWAIT child' },
    { name: 'os.execv',    slug: 'execv',   when: 'Replace the current process instead' },
    { name: 'os.fork',     slug: 'fork',    when: 'What spawn* does under the hood on Unix' },
    { name: 'os.system',   slug: 'system',  when: 'Run a shell command line' },
    { name: 'os.kill',     slug: 'kill',    when: 'Stop a spawned process' },
    { name: 'os module',   slug: 'os',      when: 'Overview of the module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'Starting real processes cannot run in the page, and the family is split by platform: spawnl/spawnv/spawnle/spawnve work on Unix and Windows, the PATH-searching p-variants are not available on Windows, P_DETACH/P_OVERLAY are Windows only and posix_spawn is Unix only. The examples use only the parts that behave the same on Windows and Linux, with a Python child.',
    },
    {
      q: 'What does os.spawnv return?',
      a: 'With P_WAIT the exit code of the program (or -signal on Unix if a signal killed it). With P_NOWAIT the process id - on Windows actually the process handle - which you pass to os.waitpid.',
    },
    {
      q: 'Should I use os.spawn or subprocess?',
      a: 'subprocess. The docs say so explicitly: subprocess.run replaces spawn with P_WAIT, subprocess.Popen replaces P_NOWAIT, and both quote arguments correctly on Windows, capture output and support timeouts.',
    },
    {
      q: 'What is the difference between spawnv and spawnvp?',
      a: 'The p-variants (spawnlp, spawnlpe, spawnvp, spawnvpe) look the program up in PATH, the others need a path to it. The p-variants do not exist on Windows.',
    },
    {
      q: 'When should I use os.posix_spawn?',
      a: 'Rarely directly - the docs recommend subprocess.run. posix_spawn is the thin wrapper around the C posix_spawn() call (Unix only), with file_actions tuples using POSIX_SPAWN_OPEN, POSIX_SPAWN_CLOSE, POSIX_SPAWN_DUP2 and POSIX_SPAWN_CLOSEFROM to set up file descriptors in the child.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.spawnv',
    meta:  'os.spawn* / P_* / posix_spawn',
  },
};
