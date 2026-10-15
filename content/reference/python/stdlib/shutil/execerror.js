// content/reference/python/stdlib/shutil/execerror.js

export const meta = {
  slug:        'execerror',
  name:        'shutil.ExecError',
  signature:   'shutil.ExecError(*args)',
  blurb:       'A leftover exception class: its docstring says "Raised when a command could not be executed" and it is exported in __all__, but nothing in the standard library raises it.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: false,
  version:     'Python 3.2+',
  searchTerms: 'shutil execerror exec error command could not be executed unused exception oserror subclass distutils spawn',
};

export const method = {
  slug:      'execerror',
  name:      'shutil.ExecError',
  signature: 'shutil.ExecError(*args)',

  category:    'shutil exception',
  version:     'Python 3.2+',
  hasLiveDemo: false,

  subtitle: 'shutil defines it and lists it in __all__, yet no shutil function — and no other module of the CPython 3.13 standard library — raises it. Running commands is subprocess’s job, and subprocess raises FileNotFoundError, CalledProcessError and friends instead.',

  covers: ['ExecError'],

  chain: ['BaseException', 'Exception', 'OSError', 'ExecError'],

  cheat: {
    raisedBy: 'Nothing in the standard library (only your own code, if you choose to)',
    message:  'Whatever you pass — its docstring: Raised when a command could not be executed',
    quickFix: 'Catch the subprocess exceptions instead: FileNotFoundError, subprocess.CalledProcessError',
    watchOut: 'Do not expect shutil.which or subprocess to raise it',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Any message, as for every exception.' },
  ],

  patterns: [
    {
      name: 'What to catch when a command cannot run',
      desc: 'A missing program is FileNotFoundError; a non-zero exit with check=True is CalledProcessError.',
      code: "import subprocess\ntry:\n    subprocess.run(['convert', 'in.png', 'out.jpg'], check=True)\nexcept FileNotFoundError:\n    print('convert is not installed')\nexcept subprocess.CalledProcessError as e:\n    print('convert failed with', e.returncode)",
    },
    {
      name: 'Check for a program before running it',
      desc: 'shutil.which returns None for a missing command — no exception.',
      code: "import shutil\nif shutil.which('git') is None:\n    raise SystemExit('git is required')",
    },
  ],

  examples: [
    { title: 'Where it sits in the hierarchy', code: 'import shutil\n[c.__name__ for c in shutil.ExecError.__mro__]', returns: "['ExecError', 'OSError', 'Exception', 'BaseException', 'object']" },
    { title: 'Its docstring', code: 'import shutil\nshutil.ExecError.__doc__', returns: "'Raised when a command could not be executed'" },
    { title: 'Part of the public API', code: "import shutil\n'ExecError' in shutil.__all__", returns: 'True' },
    { title: 'which() returns None instead of raising', code: "import shutil\nshutil.which('surely-not-a-real-command-xyz') is None", returns: 'True' },
    { title: 'Raising it yourself', code: "import shutil\nraise shutil.ExecError('ffmpeg could not be started')", returns: 'shutil.ExecError: ffmpeg could not be started' },
  ],

  pitfalls: [
    {
      name: 'Waiting for ExecError when a command is missing',
      desc: 'subprocess raises FileNotFoundError for a program that does not exist; an except shutil.ExecError clause never runs.',
      wrong: { label: 'except shutil.ExecError', code: "import shutil, subprocess\ntry:\n    try:\n        subprocess.run(['surely-not-a-real-command-xyz'])\n    except shutil.ExecError:\n        result = 'handled'\nexcept OSError as e:\n    result = f'escaped: {type(e).__name__}'\nresult", output: "'escaped: FileNotFoundError'" },
      fix:   { label: 'except FileNotFoundError', code: "import subprocess\ntry:\n    subprocess.run(['surely-not-a-real-command-xyz'])\nexcept FileNotFoundError:\n    result = 'not installed'\nresult", output: "'not installed'" },
    },
  ],

  when: {
    use: [
      'Rarely — as a ready-made OSError subclass for your own "could not run X" errors, if the name fits',
    ],
    avoid: [
      'Handling failures of subprocess or os.exec* → FileNotFoundError, PermissionError, subprocess.CalledProcessError',
    ],
  },

  notes: {
    cpython:    'Lib/shutil.py: class ExecError(OSError): """Raised when a command could not be executed""" — no raise statement anywhere in Lib/ (checked for 3.13 on Windows and 3.12 on Linux)',
    'Docs':     'The shutil documentation has no entry for it; it appears only in __all__ and the source',
  },

  related: [
    { name: 'shutil.which',  slug: 'which', when: 'Find a program before running it' },
    { name: 'shutil.Error',  slug: 'error', when: 'The exception shutil actually uses' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'What subprocess raises for a missing program', category: 'exceptions' },
    { name: 'OSError',       slug: 'oserror', when: 'Its base class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'When does shutil raise ExecError?',
      a: 'Never in current Python — the class is defined and exported but no code raises it. If a program cannot be started, subprocess raises FileNotFoundError or PermissionError. That is also why this page has no live demo: there is no shutil call that triggers it, only raising it yourself, as the examples do.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html',
    meta:  'shutil (ExecError is not documented separately)',
  },
};
