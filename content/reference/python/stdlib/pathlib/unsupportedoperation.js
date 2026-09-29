// content/reference/python/stdlib/pathlib/unsupportedoperation.js

export const meta = {
  slug:        'unsupportedoperation',
  name:        'pathlib.UnsupportedOperation',
  signature:   'pathlib.UnsupportedOperation(*args)',
  blurb:       'Raised when a path operation is not available for this path type or on this OS — for example Path.owner() on Windows. A NotImplementedError subclass, new in 3.13.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: false,
  version:     'Python 3.13+',
  searchTerms: 'unsupportedoperation pathlib unsupported operation cannot instantiate posixpath on your system windowspath owner is unsupported on this system group notimplementederror pathlib._abc',
};

export const method = {
  slug:      'unsupportedoperation',
  name:      'pathlib.UnsupportedOperation',
  signature: 'pathlib.UnsupportedOperation(*args)',

  category:    'pathlib exception',
  version:     'Python 3.13+',
  hasLiveDemo: false,

  subtitle: 'pathlib raises it for things that cannot work here: creating a WindowsPath on Linux (or a PosixPath on Windows), owner() and group() without pwd/grp, symlink_to() or readlink() where the OS lacks them. It subclasses NotImplementedError, so older except clauses still catch it.',

  covers: ['UnsupportedOperation'],

  chain: ['BaseException', 'Exception', 'RuntimeError', 'NotImplementedError', 'UnsupportedOperation'],

  cheat: {
    raisedBy: "PosixPath('x') on Windows, WindowsPath('x') elsewhere, Path.owner() / group() on Windows",
    message:  "\"cannot instantiate 'PosixPath' on your system\" or \"WindowsPath.owner() is unsupported on this system\"",
    quickFix: 'Use Path(...) and the pure classes; guard OS-specific calls with os.name',
    watchOut: 'Defined in pathlib._abc — tracebacks show pathlib._abc.UnsupportedOperation',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'The message, as for any exception.' },
  ],

  patterns: [
    {
      name: 'Owner name where supported',
      desc: 'owner() needs the pwd module (POSIX only).',
      code: "from pathlib import Path, UnsupportedOperation\ntry:\n    who = Path('data.db').owner()\nexcept UnsupportedOperation:\n    who = None",
    },
    {
      name: 'Code that must also run on 3.12 and older',
      desc: 'Catch the base class — older versions raised a plain NotImplementedError.',
      code: "try:\n    target = link.readlink()\nexcept NotImplementedError:\n    target = None",
    },
  ],

  examples: [
    { title: 'Where it sits in the hierarchy', code: 'from pathlib import UnsupportedOperation\n[c.__name__ for c in UnsupportedOperation.__mro__]', returns: "['UnsupportedOperation', 'NotImplementedError', 'RuntimeError', 'Exception', 'BaseException', 'object']" },
    { title: 'Its real module',                code: 'from pathlib import UnsupportedOperation\nUnsupportedOperation.__module__', returns: "'pathlib._abc'" },
    { title: 'The foreign concrete class raises it', code: "import os\nfrom pathlib import PosixPath, WindowsPath, UnsupportedOperation\nforeign = PosixPath if os.name == 'nt' else WindowsPath\ntry:\n    foreign('x')\nexcept UnsupportedOperation as e:\n    result = str(e) == f\"cannot instantiate {foreign.__name__!r} on your system\"\nresult", returns: 'True' },
    { title: 'except NotImplementedError still catches it', code: "from pathlib import UnsupportedOperation\ntry:\n    raise UnsupportedOperation('not here')\nexcept NotImplementedError as e:\n    result = type(e).__name__\nresult", returns: "'UnsupportedOperation'" },
    { title: 'The traceback line is module-qualified', code: "from pathlib import UnsupportedOperation\nraise UnsupportedOperation('symlinks are unavailable')", returns: 'pathlib._abc.UnsupportedOperation: symlinks are unavailable' },
  ],

  pitfalls: [
    {
      name: 'Catching io.UnsupportedOperation instead',
      desc: 'io has an unrelated UnsupportedOperation (raised for unreadable/unwritable streams). It does not catch the pathlib one.',
      wrong: { label: 'io.UnsupportedOperation', code: "import io\nfrom pathlib import UnsupportedOperation\nissubclass(UnsupportedOperation, io.UnsupportedOperation)", output: 'False' },
      fix:   { label: 'pathlib.UnsupportedOperation', code: "import pathlib\nfrom pathlib import UnsupportedOperation\nUnsupportedOperation is pathlib.UnsupportedOperation", output: 'True' },
    },
    {
      name: 'Creating a foreign concrete path',
      desc: 'To work with a Linux path on Windows (or the reverse), use the pure class of that flavour.',
      wrong: { label: 'foreign Path class', code: "import os\nfrom pathlib import PosixPath, WindowsPath\nforeign = PosixPath if os.name == 'nt' else WindowsPath\ntry:\n    foreign('/srv/app')\nexcept NotImplementedError as e:\n    result = type(e).__name__\nresult", output: "'UnsupportedOperation'" },
      fix:   { label: 'pure flavour', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/app').name", output: "'app'" },
    },
  ],

  when: {
    use: [
      'except UnsupportedOperation around owner(), group(), symlink_to(), readlink() in portable code',
      'Raising it from your own PathBase-style classes for operations they cannot do',
    ],
    avoid: [
      'Supporting 3.12 or older → catch NotImplementedError, which covers both',
    ],
  },

  notes: {
    cpython:          'Lib/pathlib/_abc.py: class UnsupportedOperation(NotImplementedError); re-exported as pathlib.UnsupportedOperation',
    'Added in 3.13':  'PosixPath / WindowsPath on the wrong OS, owner(), group(), readlink(), symlink_to() and hardlink_to() raised NotImplementedError before',
    'Messages':       '"cannot instantiate \'WindowsPath\' on your system"; on Windows "WindowsPath.owner() is unsupported on this system"',
  },

  related: [
    { name: 'NotImplementedError', slug: 'notimplementederror', when: 'The base class', category: 'exceptions' },
    { name: 'PosixPath / WindowsPath', slug: 'posixpath', when: 'The classes that raise it on the wrong OS' },
    { name: 'stat / owner / group', slug: 'stat', when: 'owner() and group() are POSIX-only' },
    { name: 'symlink_to / readlink', slug: 'symlink_to', when: 'Unsupported where the OS lacks links' },
  ],

  faq: [
    {
      q: "What does \"cannot instantiate 'PosixPath' on your system\" mean?",
      a: 'Something created a PosixPath on Windows — typically by unpickling a path saved on Linux, or by naming the class directly. Only the class for the running OS can exist; use PurePosixPath for foreign paths or rebuild with Path(str(p)).',
    },
    {
      q: 'Is pathlib.UnsupportedOperation the same as io.UnsupportedOperation?',
      a: 'No. io.UnsupportedOperation is about streams (writing to a read-only file). pathlib.UnsupportedOperation, added in 3.13, subclasses NotImplementedError and is about path operations.',
    },
    {
      q: 'How do I get a file owner on Windows?',
      a: 'Path.owner() raises UnsupportedOperation on Windows because it relies on the POSIX pwd module; Windows ownership needs the Win32 security APIs (for example via pywin32).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.UnsupportedOperation',
    meta:  'pathlib.UnsupportedOperation',
  },
};
