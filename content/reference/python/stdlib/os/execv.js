// content/reference/python/stdlib/os/execv.js

export const meta = {
  slug:        'execv',
  name:        'os.execv',
  signature:   'os.execv(path, args) / execve(path, args, env) / execvp(file, args) / execvpe(file, args, env) / execl(path, arg0, ...) / execle / execlp / execlpe / os.get_exec_path(env=None)',
  blurb:       'Replace the running Python process with another program - the exec family never returns. l/v say how arguments are passed, p searches PATH, e supplies a new environment. get_exec_path() lists the directories a p-variant searches.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all versions); get_exec_path 3.2+, path-like objects 3.6+',
  searchTerms: 'os.execv execv os.execve execve os.execvp execvp os.execvpe execvpe os.execl execl os.execle execle os.execlp execlp os.execlpe execlpe os.get_exec_path get_exec_path exec replace current process python run program and exit restart script argv[0] PATH search environment',
};

export const method = {
  slug:      'execv',
  name:      'os.execv',
  signature: 'os.execv(path, args) / execve(path, args, env) / execvp(file, args) / execvpe(file, args, env) / execl(path, arg0, ...) / execle / execlp / execlpe / os.get_exec_path(env=None)',
  returns:   { type: 'never returns | list[str]', desc: 'The exec* functions do not return - the new program takes over (errors raise OSError instead). get_exec_path() returns the list of PATH directories.' },

  category:    'os function',
  version:     'Python 3 (all versions); get_exec_path 3.2+, path-like objects 3.6+',
  hasLiveDemo: false,

  subtitle: 'exec does not start a child - it swaps the current program for a new one, so no line after a successful exec ever runs. Available on Unix and Windows (not WASI, Android or iOS); on Unix the new program keeps the same process id, on Windows it runs as a new process.',

  covers: ['execl', 'execle', 'execlp', 'execlpe', 'execv', 'execve', 'execvp', 'execvpe', 'get_exec_path'],

  cheat: {
    commonCall: 'os.execv(sys.executable, [sys.executable] + sys.argv)',
    returns:    'never returns on success',
    replaces:   'subprocess.run when you want to come back',
    watchOut:   'args[0] is the program name, not the first argument',
  },

  parameters: [
    { name: 'path',  type: 'str | PathLike', required: true,  default: null, desc: 'execv/execve/execl/execle: the program file. PATH is not searched; a relative path needs at least one slash, even on Windows.' },
    { name: 'file',  type: 'str | PathLike', required: true,  default: null, desc: 'The p-variants: a program name looked up in PATH (from env when one is given).' },
    { name: 'args',  type: 'list | tuple',   required: true,  default: null, desc: 'v-variants: the full argv. args[0] is passed as the program name; it must not be empty.' },
    { name: 'arg0, arg1, ...', type: 'str', required: true, default: null, desc: 'l-variants: the same argv written as separate arguments.' },
    { name: 'env',   type: 'Mapping[str, str]', required: true, default: null, desc: 'e-variants: the complete environment of the new program (it does not inherit os.environ). Keys and values must be str.' },
  ],

  patterns: [
    {
      name: 'Restart the current script',
      desc: 'Typical after a self-update: same interpreter, same arguments. Flush first - buffers are not flushed.',
      code: "import os, sys\nsys.stdout.flush()\nos.execv(sys.executable, [sys.executable] + sys.argv)",
    },
    {
      name: 'Hand over to another program (shell-style exec)',
      desc: 'A launcher that sets things up and then becomes the real program.',
      code: "import os\nenv = {**os.environ, 'APP_MODE': 'production'}\nos.execvpe('gunicorn', ['gunicorn', 'app:server'], env)",
    },
    {
      name: 'Where would execvp look?',
      desc: 'get_exec_path splits PATH the same way the p-variants do.',
      code: "import os\nfor folder in os.get_exec_path():\n    print(folder)",
    },
    {
      name: 'fork + exec (Unix)',
      desc: 'The classic way to start a child program; subprocess does this for you.',
      code: "import os\npid = os.fork()\nif pid == 0:\n    try:\n        os.execlp('ls', 'ls', '-l')\n    finally:\n        os._exit(127)\nos.waitpid(pid, 0)",
    },
  ],

  examples: [
    { title: 'Directories a p-variant searches', code: "import os\nos.get_exec_path({'PATH': os.pathsep.join(['tools', 'bin'])})", returns: "['tools', 'bin']" },
    { title: 'Empty PATH',                       code: "import os\nos.get_exec_path({'PATH': ''})", returns: "['']" },
    { title: 'Missing program: OSError, and exec returns', code: "import subprocess, sys\ncode = 'import os\\ntry:\\n    os.execv(\"no_such_program\", [\"no_such_program\"])\\nexcept OSError as e:\\n    print(type(e).__name__, e.errno)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "'FileNotFoundError 2\\n'" },
    { title: 'execvp searches PATH, same error', code: "import subprocess, sys\ncode = 'import os\\ntry:\\n    os.execvp(\"no_such_program_xyz\", [\"no_such_program_xyz\"])\\nexcept OSError as e:\\n    print(type(e).__name__, e.errno)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "'FileNotFoundError 2\\n'" },
    { title: 'args must not be empty',           code: "import subprocess, sys\ncode = 'import os, sys\\ntry:\\n    os.execv(sys.executable, [])\\nexcept ValueError as e:\\n    print(e)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "'execv() arg 2 must not be empty\\n'" },
    { title: 'args[0] must not be empty either', code: "import subprocess, sys\ncode = 'import os, sys\\ntry:\\n    os.execv(sys.executable, [\"\"])\\nexcept ValueError as e:\\n    print(e)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "'execv() arg 2 first element cannot be empty\\n'" },
    { title: 'Run and come back: subprocess with env', code: "import os, subprocess, sys\nenv = {**os.environ, 'GREETING': 'hi'}\nr = subprocess.run([sys.executable, '-c', 'import os; print(os.environ[\"GREETING\"])'], env=env, capture_output=True, text=True)\nr.stdout", returns: "'hi\\n'" },
  ],

  pitfalls: [
    {
      name: 'Passing the command line as one string',
      desc: 'The v-variants want a list or tuple of separate arguments; a string is rejected. Split it first (shlex.split follows POSIX shell rules).',
      wrong: { label: 'a string', code: "import subprocess, sys\ncode = 'import os, sys\\ntry:\\n    os.execv(sys.executable, \"python -V\")\\nexcept TypeError as e:\\n    print(e)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'execv() arg 2 must be a tuple or list\\n'" },
      fix:   { label: 'shlex.split', code: "import shlex\nshlex.split('python -V')", output: "['python', '-V']" },
    },
    {
      name: 'Non-string values in env',
      desc: 'Every key and value in the env mapping of execve/execle/execvpe/execlpe must be a string.',
      wrong: { label: 'int value', code: "import subprocess, sys\ncode = 'import os, sys\\ntry:\\n    os.execve(sys.executable, [sys.executable], {\"DEBUG\": 1})\\nexcept TypeError as e:\\n    print(e)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'expected str, bytes or os.PathLike object, not int\\n'" },
      fix:   { label: 'convert to str', code: "settings = {'DEBUG': 1, 'WORKERS': 4}\n{k: str(v) for k, v in settings.items()}", output: "{'DEBUG': '1', 'WORKERS': '4'}" },
    },
  ],

  when: {
    use: [
      'A launcher or wrapper script whose last step is to become the real program',
      'Restarting the current Python program in place (Unix keeps the pid)',
      'The exec half of a manual fork + exec',
    ],
    avoid: [
      'Running a program and continuing afterwards → subprocess.run',
      'Windows, if anything waits for your process: the original process ends and the program continues as a new one',
      'Arguments with spaces on Windows: they are not quoted for you',
    ],
  },

  notes: {
    cpython:          'execv/execve live in Modules/posixmodule.c (execv() / execve() on Unix, _wexecv / _wexecve on Windows). The l-, p- and pe-variants are Python wrappers in Lib/os.py; execvp/execvpe walk get_exec_path() and call execv/execve per directory.',
    'Availability':   'exec*: Unix, Windows, not WASI, Android or iOS. get_exec_path: everywhere.',
    'Naming':         'l = arguments listed one by one, v = arguments in a list (vector), p = search PATH, e = pass an explicit environment. The letters combine: execvpe = list + PATH + env.',
    'Buffers':        'The process is replaced immediately: open files and stdout are not flushed. Call sys.stdout.flush() (or os.fsync on files) before exec.',
    'Windows':        "In our test on Windows CPython 3.13 the exec'd program got a different process id and a parent waiting with subprocess.run returned at once, while on Linux the pid stayed the same and the wait lasted until the new program ended. Arguments containing spaces were split, because they are not quoted.",
    'execve with fd': 'On some platforms execve accepts an open file descriptor as path (see os.supports_fd); elsewhere that raises NotImplementedError.',
  },

  related: [
    { name: 'os.fork',    slug: 'fork',    when: 'Make the child that then calls exec' },
    { name: 'os.spawnv',  slug: 'spawnv',  when: 'Start a program and keep running' },
    { name: 'os.system',  slug: 'system',  when: 'Run a shell command and come back' },
    { name: 'os._exit',   slug: 'ex_ok',   when: 'End a child whose exec failed' },
    { name: 'os.environ', slug: 'environ', when: 'The environment the non-e variants pass on' },
    { name: 'os module',  slug: 'os',      when: 'Overview of the module', category: 'stdlib' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'What a missing program raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'A successful exec replaces the process that calls it, so it cannot run inside the page. The exec functions exist on Unix and Windows (not WASI, Android or iOS), but behave differently: Unix keeps the process id, Windows starts a new process. The examples therefore only run exec calls that fail before replacing anything, inside a separate Python child.',
    },
    {
      q: 'What is the difference between execv, execl, execvp and execve?',
      a: 'They differ only in how you pass things. l: arguments one by one (execl(path, arg0, arg1)); v: a list (execv(path, [arg0, arg1])); p: look the program up in PATH; e: give the new program an explicit environment instead of os.environ.',
    },
    {
      q: 'Why is the first argument ignored by os.execv?',
      a: "args[0] is the program's own name (argv[0]), not a real argument. os.execv('/bin/echo', ['foo', 'bar']) prints only bar. Repeat the program name as the first list item.",
    },
    {
      q: 'Why does nothing after os.execv run?',
      a: 'Because exec does not return: the new program has replaced Python. If you want to run a program and continue, use subprocess.run instead.',
    },
    {
      q: 'How do I restart a Python script from itself?',
      a: 'os.execv(sys.executable, [sys.executable] + sys.argv). Flush output first. On Windows the restarted program runs as a new process, so a console or service manager may see the original one exit.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.execv',
    meta:  'os.exec* / get_exec_path',
  },
};
