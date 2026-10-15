// content/reference/python/stdlib/subprocess/subprocesserror.js

export const meta = {
  slug:        'subprocesserror',
  name:        'subprocess.SubprocessError',
  signature:   'subprocess.SubprocessError(*args)',
  blurb:       'Base class of the subprocess exceptions: CalledProcessError and TimeoutExpired. A program that cannot be started raises OSError instead, which this does not catch.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'subprocess.SubprocessError SubprocessError subprocesserror base exception subprocess catch all subprocess errors CalledProcessError TimeoutExpired FileNotFoundError OSError cannot disambiguate text universal_newlines python',
};

export const method = {
  slug:      'subprocesserror',
  name:      'subprocess.SubprocessError',
  signature: 'subprocess.SubprocessError(*args)',

  category:    'subprocess exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'except subprocess.SubprocessError catches a failed exit code (CalledProcessError) and a timeout (TimeoutExpired) in one clause — but not FileNotFoundError or PermissionError for a program that could not be started. Catch OSError alongside it.',

  covers: ['SubprocessError'],

  chain: ['BaseException', 'Exception', 'SubprocessError'],

  cheat: {
    raisedBy: 'Its subclasses; directly by Popen for text=… and universal_newlines=… that disagree',
    message:  'Cannot disambiguate when both text and universal_newlines are supplied but different. Pass one or the other.',
    quickFix: 'except (subprocess.SubprocessError, OSError) to cover every way a command can fail',
    watchOut: 'Not an OSError — a missing program slips past it',
  },

  parameters: [
    { name: '*args', type: 'any', required: false, default: null, desc: 'Plain Exception arguments; str(e) is the single argument or the tuple of them.' },
  ],

  modes: [
    {
      id: 'catch',
      label: 'Handle',
      blurb: 'Raise one of three typical failures and see which handler catches it.',
      params: [{ name: 'what', type: 'str', hint: "'exit status', 'timeout' or 'missing program'", input: 'text' }],
      template: "import subprocess\nerrors = {\n    'exit status': subprocess.CalledProcessError(1, ['grep', 'TODO', 'notes.txt']),\n    'timeout': subprocess.TimeoutExpired(['sleep', '60'], 5),\n    'missing program': FileNotFoundError(2, 'No such file or directory'),\n}\ntry:\n    raise errors[{$what}]\nexcept subprocess.SubprocessError as e:\n    result = ('except SubprocessError', type(e).__name__, str(e))\nexcept OSError as e:\n    result = ('except OSError', type(e).__name__, str(e))\nresult",
      cases: [
        { id: 'exit',    label: 'exit status',     values: { what: 'exit status' } },
        { id: 'timeout', label: 'timeout',         values: { what: 'timeout' } },
        { id: 'missing', label: 'missing program', values: { what: 'missing program' } },
      ],
    },
  ],
  demoExplainer: 'CalledProcessError and TimeoutExpired land in the SubprocessError handler; FileNotFoundError, which is what Popen raises when the executable does not exist, is an OSError and needs its own clause. Any other key is a KeyError raised inside the try — caught by neither handler.',

  patterns: [
    {
      name: 'One handler for every failure',
      desc: 'Exit code, timeout, missing program, permission denied.',
      code: "import subprocess\ntry:\n    subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=60)\nexcept (subprocess.SubprocessError, OSError) as e:\n    print(f'{cmd[0]} failed: {e}')",
    },
    {
      name: 'Specific first, general last',
      desc: 'Handle the cases you can act on, then the rest.',
      code: "import subprocess\ntry:\n    subprocess.run(cmd, check=True, timeout=60)\nexcept subprocess.TimeoutExpired:\n    retry_later()\nexcept subprocess.SubprocessError as e:\n    report(e)",
    },
  ],

  examples: [
    { title: 'Its place in the hierarchy',   code: 'import subprocess\n[c.__name__ for c in subprocess.SubprocessError.__mro__]', returns: "['SubprocessError', 'Exception', 'BaseException', 'object']" },
    { title: 'Its two subclasses',           code: 'import subprocess\nsorted(c.__name__ for c in subprocess.SubprocessError.__subclasses__())', returns: "['CalledProcessError', 'TimeoutExpired']" },
    { title: 'Catches a failed exit code',   code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'], check=True)\n    result = 'no exception at all'\nexcept subprocess.SubprocessError as e:\n    result = type(e).__name__\nresult", returns: "'CalledProcessError'" },
    { title: 'Catches a timeout',            code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import time; time.sleep(10)'], capture_output=True, timeout=0.3)\nexcept subprocess.SubprocessError as e:\n    result = type(e).__name__\nresult", returns: "'TimeoutExpired'" },
    { title: 'A missing program is an OSError', code: "import subprocess\ntry:\n    subprocess.run(['no-such-program-xyz'], check=True)\nexcept subprocess.SubprocessError:\n    result = 'SubprocessError'\nexcept OSError as e:\n    result = f'OSError ({type(e).__name__})'\nresult", returns: "'OSError (FileNotFoundError)'" },
    { title: 'Raised directly for conflicting text flags', code: "import subprocess\nsubprocess.Popen(['git', 'status'], text=True, universal_newlines=False)", returns: 'subprocess.SubprocessError: Cannot disambiguate when both text and universal_newlines are supplied but different. Pass one or the other.' },
    { title: 'Not related to OSError',       code: 'import subprocess\nissubclass(subprocess.SubprocessError, OSError)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Expecting it to cover a missing program',
      desc: 'Popen raises FileNotFoundError (an OSError) when the executable does not exist, and it escapes a SubprocessError handler.',
      wrong: { label: 'SubprocessError only', code: "import subprocess\ndef start():\n    try:\n        subprocess.run(['no-such-program-xyz'])\n    except subprocess.SubprocessError:\n        return 'handled'\ntry:\n    result = start()\nexcept OSError as e:\n    result = f'escaped: {type(e).__name__}'\nresult", output: "'escaped: FileNotFoundError'" },
      fix:   { label: 'add OSError', code: "import subprocess\ndef start():\n    try:\n        subprocess.run(['no-such-program-xyz'])\n    except (subprocess.SubprocessError, OSError) as e:\n        return f'handled {type(e).__name__}'\nstart()", output: "'handled FileNotFoundError'" },
    },
    {
      name: 'Expecting it for a failing exit code without check',
      desc: 'run() reports a non-zero exit in returncode and raises nothing unless check=True.',
      wrong: { label: 'no check', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'])\n    result = 'no exception at all'\nexcept subprocess.SubprocessError as e:\n    result = type(e).__name__\nresult", output: "'no exception at all'" },
      fix:   { label: 'check=True', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'], check=True)\n    result = 'no exception at all'\nexcept subprocess.SubprocessError as e:\n    result = type(e).__name__\nresult", output: "'CalledProcessError'" },
    },
  ],

  when: {
    use: [
      'One except clause for "the command failed or took too long"',
      'Base class for your own errors in a wrapper around subprocess',
    ],
    avoid: [
      'Catching a program that cannot be started → OSError (FileNotFoundError, PermissionError)',
      'Reacting differently to timeouts and exit codes → catch the subclasses',
    ],
  },

  notes: {
    cpython:       'class SubprocessError(Exception): pass — the first class in Lib/subprocess.py',
    'Raised directly': 'Popen raises a bare SubprocessError when text and universal_newlines are both given and disagree',
    'Not OSError': 'Errors from starting the child are OSError subclasses raised by Popen, not SubprocessError. A missing cwd, for example, gave FileNotFoundError on Linux but NotADirectoryError ([WinError 267]) on Windows — catch OSError, not one subclass',
  },

  related: [
    { name: 'CalledProcessError', slug: 'calledprocesserror', when: 'Non-zero exit with check' },
    { name: 'TimeoutExpired', slug: 'timeoutexpired', when: 'timeout= ran out' },
    { name: 'subprocess.run', slug: 'run', when: 'Raises both subclasses' },
    { name: 'OSError', slug: 'oserror', when: 'What a failed start raises', category: 'exceptions' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'The usual OSError: program not found', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I catch all subprocess errors?',
      a: 'except (subprocess.SubprocessError, OSError). SubprocessError covers CalledProcessError and TimeoutExpired; OSError covers a program that could not be started (FileNotFoundError, PermissionError).',
    },
    {
      q: 'What is the difference between SubprocessError and CalledProcessError?',
      a: 'SubprocessError is the base class; CalledProcessError is the subclass raised for a non-zero exit code (with check=True, check_call or check_output). TimeoutExpired is the other subclass.',
    },
    {
      q: 'What does "Cannot disambiguate when both text and universal_newlines are supplied but different" mean?',
      a: 'universal_newlines is the old name of text. Passing both with different truth values (text=True, universal_newlines=False) is contradictory, so Popen raises SubprocessError before starting anything. Pass only text=.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.SubprocessError',
    meta:  'subprocess.SubprocessError',
  },

};
