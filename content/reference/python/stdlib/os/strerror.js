// content/reference/python/stdlib/os/strerror.js

export const meta = {
  slug:        'strerror',
  name:        'os.strerror',
  signature:   'os.strerror(code, /) / os.error',
  blurb:       "Turn an errno number into the C library's error message, and os.error - the old alias of the built-in OSError.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all)',
  searchTerms: 'os.strerror strerror os.error error errno message python error code to string No such file or directory Permission denied OSError alias errno.errorcode ENOENT EACCES',
};

export const method = {
  slug:      'strerror',
  name:      'os.strerror',
  signature: 'os.strerror(code, /) / os.error',
  returns:   { type: 'str', desc: "The message for that error number, e.g. 'No such file or directory' for 2." },

  category:    'os function',
  version:     'Python 3 (all)',
  hasLiveDemo: false,

  subtitle: "strerror asks the C library, so the text is platform-dependent: the common codes read the same on Linux and Windows, but 0 is 'Success' on Linux and 'No error' on Windows, and unknown codes differ too. os.error IS OSError (the same class object), kept for old code; available everywhere.",

  covers: ['error', 'strerror'],

  cheat: {
    commonCall: 'os.strerror(errno.ENOENT)',
    returns:    "'No such file or directory'",
    replaces:   'Hard-coded error message tables',
    watchOut:   'Compare e.errno with errno.* constants, never the message text',
  },

  parameters: [
    { name: 'code', type: 'int', required: true, default: null, desc: 'An errno number (errno.ENOENT, e.errno ...). Positional only; a non-int raises TypeError.' },
  ],

  patterns: [
    {
      name: 'Raise a proper OSError subclass',
      desc: 'With errno as the first argument OSError picks the matching subclass and formats the message.',
      code: "import errno\nimport os\nraise OSError(errno.ENOENT, os.strerror(errno.ENOENT), path)",
    },
    {
      name: 'Branch on the error number',
      desc: 'Stable across platforms and locales, unlike the message.',
      code: "import errno\ntry:\n    os.rmdir(path)\nexcept OSError as e:\n    if e.errno != errno.ENOTEMPTY:\n        raise",
    },
    {
      name: 'Message for an exit status or C return code',
      desc: 'When a tool reports a bare errno number.',
      code: "import os\nprint(f'failed: {os.strerror(code)} (errno {code})')",
    },
  ],

  examples: [
    { title: 'os.error is OSError',          code: "import os\nos.error is OSError", returns: 'True' },
    { title: 'Message for ENOENT',           code: "import errno\nimport os\nos.strerror(errno.ENOENT)", returns: "'No such file or directory'" },
    { title: 'A few common codes',           code: "import errno\nimport os\n[os.strerror(c) for c in (errno.EACCES, errno.EEXIST, errno.ENOTDIR)]", returns: "['Permission denied', 'File exists', 'Not a directory']" },
    { title: 'Number to name',               code: "import errno\nerrno.errorcode[2]", returns: "'ENOENT'" },
    { title: 'Building a full OSError',      code: "import errno\nimport os\ne = OSError(errno.ENOENT, os.strerror(errno.ENOENT), 'cfg.ini')\n(type(e).__name__, str(e))", returns: "('FileNotFoundError', \"[Errno 2] No such file or directory: 'cfg.ini'\")" },
    { title: 'except os.error still works',  code: "import os\ntry:\n    open('missing.txt')\nexcept os.error as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
    { title: 'The code must be an int',      code: "import os\nos.strerror('2')", returns: "TypeError: 'str' object cannot be interpreted as an integer" },
  ],

  pitfalls: [
    {
      name: 'OSError with only a message',
      desc: 'A single argument keeps errno None and the class plain OSError, so callers cannot catch FileNotFoundError. Pass the errno first.',
      wrong: { label: 'message only',  code: "e = OSError('No such file or directory: cfg.ini')\n(type(e).__name__, e.errno)", output: "('OSError', None)" },
      fix:   { label: 'errno, strerror', code: "import errno\nimport os\ne = OSError(errno.ENOENT, os.strerror(errno.ENOENT), 'cfg.ini')\n(type(e).__name__, e.errno)", output: "('FileNotFoundError', 2)" },
    },
    {
      name: 'Passing the exception instead of its errno',
      desc: 'strerror wants the number. The exception already carries its message in e.strerror.',
      wrong: { label: 'strerror(e)',       code: "import os\ntry:\n    open('missing.txt')\nexcept OSError as e:\n    os.strerror(e)", output: "TypeError: 'FileNotFoundError' object cannot be interpreted as an integer" },
      fix:   { label: 'strerror(e.errno)', code: "import os\ntry:\n    open('missing.txt')\nexcept OSError as e:\n    msg = os.strerror(e.errno)\nmsg", output: "'No such file or directory'" },
    },
  ],

  when: {
    use: [
      'Formatting messages for raw errno values from C extensions, ctypes or exit codes',
      'Raising OSError subclasses yourself with the standard message',
    ],
    avoid: [
      'Deciding what happened → compare e.errno with errno.* or catch the subclass (FileNotFoundError ...)',
      'New code: os.error → write OSError',
      'Windows API error codes (WinError) → they are not errno values; e.winerror and e.strerror already hold the message',
    ],
  },

  notes: {
    cpython:      "os.strerror calls the C strerror(); the docs say ValueError is raised on platforms where it returns NULL for an unknown code. os.error = OSError, the same object (os.error is OSError)",
    'Platforms':  "Verified identical on Linux CPython 3.12 and Windows CPython 3.13 for errno 1, 2, 13, 17, 20, 21, 22, 28. Different: 0 ('Success' vs 'No error'), and unknown codes such as 9999 ('Unknown error 9999' vs 'Unknown error')",
    'History':    'Since Python 3.3 IOError, EnvironmentError, socket.error, select.error and os.error are all aliases of OSError (PEP 3151)',
  },

  related: [
    { name: 'OSError', slug: 'oserror', when: 'The exception os.error refers to', category: 'exceptions' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'Subclass picked for ENOENT', category: 'exceptions' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'Subclass picked for EACCES / EPERM', category: 'exceptions' },
    { name: 'os.access', slug: 'access', when: 'Check before an operation' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: "Why does this page have no live demo?",
      a: "strerror asks the C library, and some messages differ between platforms (errno 0 is 'Success' on Linux but 'No error' on Windows). The examples only use codes whose text is the same on Linux and Windows.",
    },
    {
      q: 'What is os.error in Python?',
      a: 'An alias of the built-in OSError - os.error is OSError is True. except os.error: catches the same errors as except OSError:. New code should write OSError.',
    },
    {
      q: 'How do I get the error message for an errno number?',
      a: "os.strerror(n), e.g. os.strerror(2) is 'No such file or directory'. For the symbolic name use errno.errorcode[n] ('ENOENT').",
    },
    {
      q: 'Is os.strerror text the same on every OS?',
      a: "No - it comes from the C library. Common codes matched on Linux and Windows, but 0 reads 'Success' on Linux and 'No error' on Windows, and unknown codes differ. Compare numbers, not text.",
    },
    {
      q: 'Why does my Windows error say [WinError 2] instead of [Errno 2]?',
      a: 'Windows API failures carry a Windows error code in e.winerror and a Windows message; Python maps it to an errno (here 2, so the type is still FileNotFoundError). The message text then differs from os.strerror(2).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.strerror',
    meta:  'os.strerror / os.error',
  },
};
