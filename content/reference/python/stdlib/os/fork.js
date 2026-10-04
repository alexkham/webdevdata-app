// content/reference/python/stdlib/os/fork.js

export const meta = {
  slug:        'fork',
  name:        'os.fork',
  signature:   'os.fork() / os.forkpty() / os.register_at_fork(*, before=None, after_in_parent=None, after_in_child=None)',
  blurb:       'Clone the running process (Unix only): fork() returns 0 in the child and the child pid in the parent. forkpty() adds a pseudo-terminal, register_at_fork() installs hooks around every fork.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all versions); register_at_fork 3.7+',
  searchTerms: 'os.fork fork os.forkpty forkpty os.register_at_fork register_at_fork fork child process python unix pid 0 child parent pseudo terminal pty fork hooks after_in_child multiprocessing start method spawn fork threads DeprecationWarning',
};

export const method = {
  slug:      'fork',
  name:      'os.fork',
  signature: 'os.fork() / os.forkpty() / os.register_at_fork(*, before=None, after_in_parent=None, after_in_child=None)',
  returns:   { type: 'int | tuple[int, int] | None', desc: 'fork(): 0 in the child, the child pid in the parent. forkpty(): (pid, fd) where fd is the master end of the pseudo-terminal. register_at_fork(): None.' },

  category:    'os function',
  version:     'Python 3 (all versions); register_at_fork 3.7+',
  hasLiveDemo: false,

  subtitle: 'One call, two processes: after fork() the parent and an exact copy of it both continue from the same line, told apart only by the return value. POSIX only - fork, forkpty and register_at_fork do not exist on Windows (nor on WASI, Android or iOS).',

  covers: ['fork', 'forkpty', 'register_at_fork'],

  cheat: {
    commonCall: 'pid = os.fork()',
    returns:    '0 in the child, child pid in the parent',
    replaces:   'subprocess / multiprocessing are the portable alternatives',
    watchOut:   'end the child with os._exit(), never by falling through',
  },

  parameters: [
    { name: 'before',          type: 'callable', required: false, default: 'None', desc: 'register_at_fork(): called in the parent just before forking. Before-hooks run in reverse registration order.' },
    { name: 'after_in_parent', type: 'callable', required: false, default: 'None', desc: 'register_at_fork(): called in the parent after the fork, in registration order.' },
    { name: 'after_in_child',  type: 'callable', required: false, default: 'None', desc: 'register_at_fork(): called in the child after the fork, in registration order - the place to reset locks, random seeds or connections.' },
  ],

  patterns: [
    {
      name: 'Classic fork, wait, exit',
      desc: 'The child does its work and leaves with os._exit; the parent reaps it with waitpid.',
      code: "import os\npid = os.fork()\nif pid == 0:\n    try:\n        print('child working', flush=True)\n    finally:\n        os._exit(0)\nelse:\n    _, status = os.waitpid(pid, 0)\n    print('child exit code', os.waitstatus_to_exitcode(status))",
    },
    {
      name: 'Reset state in every forked child',
      desc: 'register_at_fork hooks run for os.fork and for multiprocessing with the fork start method.',
      code: "import os, random\nos.register_at_fork(after_in_child=random.seed)",
    },
    {
      name: 'Run a child inside a pseudo-terminal',
      desc: 'forkpty gives the parent the master fd; the pty module wraps this more portably.',
      code: "import os\npid, fd = os.forkpty()\nif pid == 0:\n    os.execlp('ls', 'ls', '--color=auto')\nelse:\n    output = os.read(fd, 1024)\n    os.waitpid(pid, 0)",
    },
    {
      name: 'Portable: let multiprocessing pick',
      desc: 'An explicit spawn context works the same on Windows, macOS and Linux.',
      code: "import multiprocessing as mp\n\ndef work(n):\n    return n * n\n\nif __name__ == '__main__':\n    with mp.get_context('spawn').Pool(2) as pool:\n        print(pool.map(work, range(4)))",
    },
  ],

  examples: [
    { title: 'The portable start method',         code: "import multiprocessing as mp\n'spawn' in mp.get_all_start_methods()", returns: 'True' },
    { title: 'Choose it explicitly',              code: "import multiprocessing as mp\nmp.get_context('spawn').get_start_method()", returns: "'spawn'" },
    { title: 'Run code in a child process on any OS', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'print(\"hello from the child\")'], capture_output=True, text=True)\nr.stdout", returns: "'hello from the child\\n'" },
    { title: "The child's exit code",             code: "import subprocess, sys\nsubprocess.run([sys.executable, '-c', 'raise SystemExit(5)']).returncode", returns: '5' },
    { title: 'Reading the fork() return value',   code: "def role(pid):\n    return 'child' if pid == 0 else 'parent'\n[role(0), role(4242)]", returns: "['child', 'parent']" },
    { title: 'A pipe: how forked processes talk', code: "import os\nr, w = os.pipe()\nos.write(w, b'hello')\nos.close(w)\ndata = os.read(r, 100)\nos.close(r)\ndata", returns: "b'hello'" },
  ],

  pitfalls: [
    {
      name: 'Leaving a child with sys.exit',
      desc: 'sys.exit only raises SystemExit. Any try/except or finally in code the child inherited from the parent can catch it, and the child keeps running parent code. os._exit ends the process at once. Shown here in a child Python so it runs on every OS.',
      wrong: { label: 'sys.exit', code: "import subprocess, sys\ncode = 'import sys\\ntry:\\n    sys.exit(0)\\nexcept SystemExit:\\n    print(\"child kept running\")'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'child kept running\\n'" },
      fix:   { label: 'os._exit', code: "import subprocess, sys\ncode = 'import os\\ntry:\\n    os._exit(0)\\nexcept SystemExit:\\n    print(\"child kept running\")'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "''" },
    },
    {
      name: 'Losing the child output at os._exit',
      desc: 'os._exit does not flush stdio buffers. When stdout is a pipe or file it is block-buffered, so whatever the child printed without flushing is gone.',
      wrong: { label: 'print, then _exit', code: "import subprocess, sys\ncode = 'import os; print(\"result\", end=\"\"); os._exit(0)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "''" },
      fix:   { label: 'flush first', code: "import subprocess, sys\ncode = 'import os; print(\"result\", end=\"\", flush=True); os._exit(0)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'result'" },
    },
  ],

  when: {
    use: [
      'Unix daemons and servers that pre-fork workers',
      'fork followed directly by an exec* call (what subprocess does under the hood on many systems)',
      'register_at_fork: libraries that must reset locks, seeds or sockets in forked children',
    ],
    avoid: [
      'Code that must run on Windows → subprocess or multiprocessing',
      'Processes that already run threads → fork copies only the calling thread (3.12+ warns, see notes)',
      'macOS programs using system frameworks (including urllib.request) - the docs call fork unsafe there',
    ],
  },

  notes: {
    cpython:          'posix.fork (Modules/posixmodule.c) calls PyOS_BeforeFork, fork(), then PyOS_AfterFork_Parent / PyOS_AfterFork_Child - which run the register_at_fork hooks. Calling fork() in a subinterpreter raises RuntimeError (3.8+).',
    'Availability':   'fork: POSIX; forkpty and register_at_fork: Unix; none of them exist on Windows, WASI, Android or iOS.',
    'Threads':        'Since 3.12 fork() and forkpty() raise a DeprecationWarning when Python can detect that the process has more than one thread: only the calling thread survives in the child, and locks held by the others stay locked forever.',
    'Hook order':     'before-hooks run in reverse registration order, after_in_parent and after_in_child hooks in registration order. There is no way to unregister. Calling register_at_fork() with no argument raises TypeError.',
    'multiprocessing': "On Linux with Python 3.12 the default start method is 'fork'; on Windows it is 'spawn' (fork is not available there). get_context('spawn') behaves the same everywhere.",
  },

  related: [
    { name: 'os.waitpid',  slug: 'waitpid', when: 'Reap the forked child and read its status' },
    { name: 'os._exit',    slug: 'ex_ok',   when: 'How a forked child should end' },
    { name: 'os.execv',    slug: 'execv',   when: 'Load a new program into the child' },
    { name: 'os.spawnv',   slug: 'spawnv',  when: 'fork + exec in one call' },
    { name: 'os.pipe',     slug: 'pipe',    when: 'Talk between parent and child' },
    { name: 'os module',   slug: 'os',      when: 'Overview of the module', category: 'stdlib' },
    { name: 'DeprecationWarning', slug: 'deprecationwarning', when: 'What fork with threads emits (3.12+)', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and does os.fork work on Windows?',
      a: 'No. fork is POSIX only, and forkpty and register_at_fork are Unix only (none exist on Windows, WASI, Android or iOS), so on Windows os.fork raises AttributeError. Examples here never fork the page process; they show the portable alternatives - subprocess and multiprocessing with the spawn start method - and the child-process rules in a separate Python child.',
    },
    {
      q: 'What does os.fork() return?',
      a: 'It returns twice: 0 in the new child process and the child pid in the parent. If the fork fails, OSError is raised in the parent.',
    },
    {
      q: 'How should a forked child exit?',
      a: 'With os._exit(code). sys.exit raises SystemExit, which code inherited from the parent can catch, and normal interpreter shutdown would also run the parent atexit handlers and flush buffers a second time. Flush stdout yourself first if the child printed anything.',
    },
    {
      q: 'Is it safe to fork a process that has threads?',
      a: 'Not really: only the thread that called fork exists in the child, while locks held by other threads stay locked. Since Python 3.12 fork() raises a DeprecationWarning when it can detect several threads. Use the spawn start method or subprocess instead.',
    },
    {
      q: 'What is register_at_fork used for?',
      a: 'Registering callbacks around fork: before (in the parent), after_in_parent and after_in_child. Libraries use after_in_child to re-seed random generators, recreate locks or drop inherited connections. The hooks only run when the child continues in Python, not for a plain subprocess launch.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.fork',
    meta:  'os.fork / forkpty / register_at_fork',
  },
};
