// content/reference/python/stdlib/sys/audit.js — audit events and hooks

export const meta = {
  slug:        'audit',
  name:        'sys.audit / sys.addaudithook',
  signature:   'sys.audit(event, *args) · sys.addaudithook(hook)',
  blurb:       'Runtime audit events (PEP 578): CPython raises named events for sensitive actions — open, exec, socket.connect, import … — and every hook added with addaudithook sees them. sys.audit raises your own events.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.8+',
  searchTerms: 'sys.audit audit sys.addaudithook addaudithook audit hooks pep 578 audit events python security monitoring log file opens subprocess events sandbox runtimeerror',
};

export const method = {
  slug:      'audit',
  name:      'sys.audit / sys.addaudithook',
  signature: 'sys.audit(event, *args) · sys.addaudithook(hook)',
  returns:   { type: 'None', desc: 'audit returns None (or re-raises the first exception from a hook); addaudithook returns None.' },

  category:    'sys function',
  version:     'Python 3.8+',
  hasLiveDemo: false,

  subtitle: 'A hook is called as hook(event, args) for every event, from then on, for the whole process — hooks cannot be removed. That is why the examples install them in a child Python. A hook may log, or raise to block the action; it is an observation tool, not a sandbox.',

  covers: ['audit', 'addaudithook'],

  cheat: {
    commonCall: "sys.addaudithook(lambda event, args: event == 'open' and print(args[:2]))",
    returns:    'None — the hook stays installed until the process ends',
    replaces:   'Monkey-patching open, subprocess, socket … to watch them',
    watchOut:   'Hooks run for every event in the process: keep them fast and filter by name',
  },

  parameters: [
    { name: 'event', type: 'str', required: true,  default: null, desc: "audit: the event name, e.g. 'myapp.login'. Use a dotted prefix for your own events." },
    { name: '*args', type: 'object', required: false, default: null, desc: 'audit: event arguments, passed to hooks as one tuple.' },
    { name: 'hook',  type: 'callable', required: true, default: null, desc: 'addaudithook: called as hook(event: str, args: tuple).' },
  ],

  patterns: [
    {
      name: 'Log file opens and subprocesses',
      desc: 'Filter on the event names you care about; the argument layout of each event is documented in the audit events table.',
      code: "import sys\ndef audit_log(event, args):\n    if event in ('open', 'subprocess.Popen'):\n        print(f'[audit] {event}: {args[:2]}', file=sys.stderr)\nsys.addaudithook(audit_log)",
    },
    {
      name: 'Raise your own events',
      desc: 'Libraries can expose security-relevant actions for operators to watch.',
      code: "import sys\ndef login(user):\n    sys.audit('myapp.login', user)\n    ...",
    },
    {
      name: 'Block an action',
      desc: 'Raising from a hook aborts the operation that raised the event.',
      code: "import sys\ndef no_shell(event, args):\n    if event == 'os.system':\n        raise PermissionError('os.system is disabled')\nsys.addaudithook(no_shell)",
    },
  ],

  examples: [
    { title: 'A hook sees your own events', code: "import subprocess, sys\ncode = '''import sys\ndef hook(event, args):\n    if event == 'myapp.login':\n        print(event, args)\nsys.addaudithook(hook)\nsys.audit('myapp.login', 'ada', 3)\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "\"myapp.login ('ada', 3)\\n\"" },
    { title: "CPython's own 'open' event", code: "import subprocess, sys\ncode = '''import sys\ndef hook(event, args):\n    if event == 'open' and args[0] == 'notes.txt':\n        print(args[:2])\nsys.addaudithook(hook)\nopen('notes.txt', 'w').close()\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "\"('notes.txt', 'w')\\n\"" },
    { title: 'A hook can block the action',  code: "import subprocess, sys\ncode = '''import os, sys\ndef hook(event, args):\n    if event == 'os.remove':\n        raise PermissionError('deleting is disabled')\nsys.addaudithook(hook)\nopen('keep.txt', 'w').close()\ntry:\n    os.remove('keep.txt')\nexcept PermissionError as e:\n    print(e, os.path.exists('keep.txt'))\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "'deleting is disabled True\\n'" },
    { title: 'Adding a hook is itself an event', code: "import subprocess, sys\ncode = '''import sys\nseen = []\nsys.addaudithook(lambda e, a: seen.append(e))\nsys.addaudithook(lambda e, a: None)\nprint(seen)\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "\"['sys.addaudithook']\\n\"" },
    { title: 'Without hooks, audit() returns at once', code: 'import sys\nsys.audit(42) is None  # not even the argument is checked', returns: 'True' },
    { title: 'With a hook, the event name must be a str', code: "import subprocess, sys\ncode = '''import sys\nsys.addaudithook(lambda e, a: None)\ntry:\n    sys.audit(42)\nexcept TypeError as e:\n    print(e)\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "\"expected str for argument 'event', not int\\n\"" },
  ],

  pitfalls: [
    {
      name: 'Adding the same hook twice',
      desc: 'Hooks accumulate and can never be removed, so code that installs a hook on every call (or every test) multiplies the work. Install once, guarded by a flag.',
      wrong: { label: 'install per call', code: "import subprocess, sys\ncode = '''import sys\ndef setup():\n    sys.addaudithook(lambda e, a: e == 'demo.ping' and print('ping'))\nsetup()\nsetup()\nsys.audit('demo.ping')\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'ping\\nping\\n'" },
      fix:   { label: 'install once', code: "import subprocess, sys\ncode = '''import sys\n_installed = False\ndef setup():\n    global _installed\n    if not _installed:\n        sys.addaudithook(lambda e, a: e == 'demo.ping' and print('ping'))\n        _installed = True\nsetup()\nsetup()\nsys.audit('demo.ping')\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'ping\\n'" },
    },
    {
      name: 'A hook that raises on broad events',
      desc: "Every import raises an 'import' event, so a hook that rejects too much breaks the program itself. Match exact event names and arguments.",
      wrong: { label: 'reject all imports', code: "import subprocess, sys\ncode = '''import sys\ndef hook(event, args):\n    if event == 'import':\n        raise RuntimeError('imports are disabled')\nsys.addaudithook(hook)\nimport json\n'''\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\np.stderr.splitlines()[-1]", output: "'RuntimeError: imports are disabled'" },
      fix:   { label: 'one module only', code: "import subprocess, sys\ncode = '''import sys\ndef hook(event, args):\n    if event == 'import' and args[0] == 'ctypes':\n        raise RuntimeError('ctypes is disabled')\nsys.addaudithook(hook)\nimport json\nprint(json.dumps([1]))\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", output: "'[1]\\n'" },
    },
  ],

  when: {
    use: [
      'Security monitoring and logging of sensitive operations in production',
      'Debugging which files, sockets or processes a program touches',
      'Exposing security-relevant events of your own library (sys.audit)',
    ],
    avoid: [
      'Sandboxing untrusted code → hooks can be bypassed; use OS-level isolation',
      'Tests that need to undo the hook → hooks cannot be removed; run in a subprocess',
      'General tracing of Python calls → sys.settrace / sys.monitoring',
    ],
  },

  notes: {
    cpython:          'Python/sysmodule.c (PySys_Audit, sys_addaudithook); the C API PySys_AddAuditHook installs hooks before the runtime starts, which is the only way to see every event',
    'Event table':    'docs.python.org lists every event CPython raises and its arguments ("Audit events table")',
    'Exceptions':     'If a hook raises, sys.audit re-raises the first exception; when adding a hook, existing hooks that raise RuntimeError subclasses silently prevent it from being added',
    'Not a sandbox':  'Malicious code can disable or bypass Python-level hooks (the docs say so explicitly)',
  },

  related: [
    { name: 'sys.settrace', slug: 'settrace', when: 'Hooks on code execution instead of events' },
    { name: 'sys.excepthook', slug: 'excepthook', when: 'Hooks for uncaught exceptions' },
    { name: 'open()',      slug: 'open',      when: "Raises the 'open' audit event", category: 'functions' },
    { name: 'RuntimeError', slug: 'runtimeerror', when: 'Special-cased when adding hooks', category: 'exceptions' },
    { name: 'sys module',  slug: 'sys',       when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What are Python audit hooks?',
      a: "A PEP 578 mechanism (Python 3.8+): CPython raises named events for actions like opening files, starting processes or importing modules, and functions registered with sys.addaudithook() receive (event, args) for each one.",
    },
    {
      q: 'Can I remove an audit hook?',
      a: 'No. Once added, a hook stays for the life of the process — by design, so code cannot silently switch off monitoring. Make the hook itself configurable if you need to turn it off.',
    },
    {
      q: 'Are audit hooks a security sandbox?',
      a: 'No. The documentation warns that malicious code can trivially disable or bypass hooks added from Python. They are for observing and logging; isolation needs the operating system.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.addaudithook',
    meta:  'sys.addaudithook',
  },
};
