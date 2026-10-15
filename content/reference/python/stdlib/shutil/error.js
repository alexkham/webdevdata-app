// content/reference/python/stdlib/shutil/error.js

export const meta = {
  slug:        'error',
  name:        'shutil.Error',
  signature:   'shutil.Error(*args)',
  blurb:       'The OSError subclass shutil raises for its own multi-file problems: copytree’s collected per-file failures, and move’s "already exists" and "into itself" refusals.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil.error shutil error copytree error list destination path already exists cannot move a directory into itself errors args srcname dstname oserror subclass samefileerror',
};

export const method = {
  slug:      'error',
  name:      'shutil.Error',
  signature: 'shutil.Error(*args)',

  category:    'shutil exception',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'copytree keeps going when single files fail and raises one Error at the end whose args[0] is a list of (src, dst, reason) tuples. move raises it with a plain message. SameFileError is its only subclass; most other shutil failures are ordinary OSErrors.',

  covers: ['Error'],

  chain: ['BaseException', 'Exception', 'OSError', 'Error'],

  cheat: {
    raisedBy: 'copytree (collected failures), move (destination exists / folder into itself), copyfile & friends via SameFileError',
    message:  "Destination path 'archive/report.txt' already exists",
    quickFix: 'except shutil.Error as e: for src, dst, why in e.args[0]: … (copytree)',
    watchOut: 'FileNotFoundError, FileExistsError, PermissionError are not shutil.Error — catch OSError for everything',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'copytree passes one list of (srcname, dstname, str(exception)) tuples; move passes one message string.' },
  ],

  modes: [
    {
      id: 'move',
      label: 'from move',
      blurb: 'Move a file or folder; when move refuses, show the Error’s class, whether it is an OSError, and its message.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'what to move',                     input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'folder or new path',               input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    shutil.move({$src}, {$dst})\n    result = 'moved'\nexcept shutil.Error as e:\n    result = (type(e).__name__, isinstance(e, OSError), str(e).replace(os.sep, '/'))\nresult",
      cases: [
        { id: 'exists', label: 'name taken',  values: { files: 'report.txt, archive/report.txt', src: 'report.txt', dst: 'archive' } },
        { id: 'itself', label: 'into itself', values: { files: 'docs/a.md', src: 'docs', dst: 'docs/old' } },
        { id: 'ok',     label: 'no error',    values: { files: 'report.txt, archive/x.txt', src: 'report.txt', dst: 'archive' } },
      ],
    },
    {
      id: 'copytree',
      label: 'from copytree',
      blurb: 'Merge src/ into dst/. Where dst/ has a file in place of one of src’s folders, copytree records the failure and carries on; the list arrives in one Error.',
      params: [{ name: 'files', type: 'list[str]', hint: 'files under src/ and dst/', input: 'csv' }],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    shutil.copytree('src', 'dst', dirs_exist_ok=True)\n    result = 'copied'\nexcept shutil.Error as e:\n    result = sorted((s.replace(os.sep, '/'), d.replace(os.sep, '/')) for s, d, why in e.args[0])\nresult",
      cases: [
        { id: 'clash', label: 'file vs folder', values: { files: 'src/data/a.csv, src/logs/x.log, src/readme.md, dst/data, dst/logs' } },
        { id: 'one',   label: 'one clash',      values: { files: 'src/data/a.csv, src/readme.md, dst/data' } },
        { id: 'ok',    label: 'no clash',       values: { files: 'src/data/a.csv, dst/old.txt' } },
      ],
    },
  ],
  demoExplainer: "move's Error carries a plain message (the separator is normalized here for Windows). copytree's carries a list: each tuple names the source and destination that failed — here because dst/data is a file, so the folder src/data cannot be created there — while everything else (readme.md) was still copied. The third element of each tuple is str() of the original OSError, whose wording differs between Linux and Windows, so it is left out.",

  patterns: [
    {
      name: 'Report every file copytree could not copy',
      desc: 'args[0] is the list; each item is (srcname, dstname, reason).',
      code: "import shutil\ntry:\n    shutil.copytree(src, dst, dirs_exist_ok=True)\nexcept shutil.Error as e:\n    for s, d, why in e.args[0]:\n        print(f'skipped {s}: {why}')",
    },
    {
      name: 'Catch everything shutil can raise',
      desc: 'Error and all the file errors share OSError as base.',
      code: "import shutil\ntry:\n    shutil.move(src, dst)\nexcept OSError as e:\n    print(f'move failed: {e}')",
    },
  ],

  examples: [
    { title: 'Where it sits in the hierarchy', code: 'import shutil\n[c.__name__ for c in shutil.Error.__mro__]', returns: "['Error', 'OSError', 'Exception', 'BaseException', 'object']" },
    { title: 'SameFileError is a shutil.Error', code: 'import shutil\nissubclass(shutil.SameFileError, shutil.Error)', returns: 'True' },
    { title: 'SpecialFileError is not', code: 'import shutil\nissubclass(shutil.SpecialFileError, shutil.Error)', returns: 'False' },
    { title: 'The traceback line is module-qualified', code: "import shutil\nraise shutil.Error('something went wrong')", returns: 'shutil.Error: something went wrong' },
    { title: "A list argument is shown with str()", code: "import shutil\nstr(shutil.Error([('a', 'b', 'reason')]))", returns: "\"[('a', 'b', 'reason')]\"" },
    { title: 'move: destination exists', code: "import os, shutil\nos.makedirs('archive')\nopen('archive/a.txt', 'w').close()\nopen('a.txt', 'w').close()\ntry:\n    shutil.move('a.txt', 'archive')\nexcept shutil.Error as e:\n    result = str(e).replace(os.sep, '/')\nresult", returns: "\"Destination path 'archive/a.txt' already exists\"" },
  ],

  pitfalls: [
    {
      name: 'Catching shutil.Error to catch every shutil failure',
      desc: 'A missing source, an existing destination or a permission problem raise the built-in OSError subclasses, which shutil.Error does not catch.',
      wrong: { label: 'except shutil.Error', code: "import shutil\ntry:\n    try:\n        shutil.copytree('missing', 'dst')\n    except shutil.Error:\n        result = 'handled'\nexcept OSError as e:\n    result = f'escaped: {type(e).__name__}'\nresult", output: "'escaped: FileNotFoundError'" },
      fix:   { label: 'except OSError', code: "import shutil\ntry:\n    shutil.copytree('missing', 'dst')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
    },
    {
      name: 'Printing str(e) of a copytree Error',
      desc: 'The message is the repr of the whole list — fine for a log line, unreadable for users. Loop over e.args[0].',
      wrong: { label: 'str(e)', code: "import shutil\ne = shutil.Error([('src/a', 'dst/a', 'File exists'), ('src/b', 'dst/b', 'Permission denied')])\nstr(e)", output: "\"[('src/a', 'dst/a', 'File exists'), ('src/b', 'dst/b', 'Permission denied')]\"" },
      fix:   { label: 'e.args[0]', code: "import shutil\ne = shutil.Error([('src/a', 'dst/a', 'File exists'), ('src/b', 'dst/b', 'Permission denied')])\n[f'{s}: {why}' for s, d, why in e.args[0]]", output: "['src/a: File exists', 'src/b: Permission denied']" },
    },
  ],

  when: {
    use: [
      'except shutil.Error around copytree to collect partial failures',
      'Telling "move refused" apart from file system errors',
    ],
    avoid: [
      'Catching all copy/move/delete failures → except OSError',
      'Raising it from your own code for single-file errors → raise the matching OSError subclass',
    ],
  },

  notes: {
    cpython:        'Lib/shutil.py: class Error(OSError): pass',
    'copytree':     'Nested copytree calls extend the parent’s list with err.args[0], so the final Error holds the failures of the whole tree',
    'Linux oddity': 'copytree(d, d, dirs_exist_ok=True) on Linux and macOS collects a SameFileError for each file, and extending the list with its message string adds it character by character — args[0] becomes a list of single letters (on Windows copy2 fails earlier with WinError 32)',
  },

  related: [
    { name: 'SameFileError',   slug: 'samefileerror', when: 'Its subclass' },
    { name: 'shutil.copytree', slug: 'copytree',      when: 'Collects per-file failures into it' },
    { name: 'shutil.move',     slug: 'move',          when: 'Raises it with a message' },
    { name: 'OSError',         slug: 'oserror',       when: 'The base class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is shutil.Error?',
      a: 'An OSError subclass for problems specific to shutil’s multi-step operations: copytree raises it with a list of (src, dst, reason) tuples after copying everything it could, move raises it when the destination name is taken or a folder would move into itself, and SameFileError derives from it.',
    },
    {
      q: 'How do I get the list of failed files from shutil.Error?',
      a: 'It is the first argument: for src, dst, reason in e.args[0]. The reason is the str() of the original exception.',
    },
    {
      q: 'Does except OSError catch shutil.Error?',
      a: 'Yes — shutil.Error subclasses OSError (as do SameFileError, SpecialFileError and ReadError). RegistryError is the exception: it derives directly from Exception.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.Error',
    meta:  'shutil.Error',
  },
};
