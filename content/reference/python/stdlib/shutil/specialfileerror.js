// content/reference/python/stdlib/shutil/specialfileerror.js

export const meta = {
  slug:        'specialfileerror',
  name:        'shutil.SpecialFileError',
  signature:   'shutil.SpecialFileError(*args)',
  blurb:       'Raised when copyfile (and so copy, copy2, copytree, move) meets a named pipe (FIFO) as source or destination, instead of blocking on it forever.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: false,
  version:     'Python 3.1+',
  searchTerms: 'shutil specialfileerror is a named pipe fifo mkfifo copy named pipe copytree fifo special file device socket oserror',
};

export const method = {
  slug:      'specialfileerror',
  name:      'shutil.SpecialFileError',
  signature: 'shutil.SpecialFileError(*args)',

  category:    'shutil exception',
  version:     'Python 3.1+',
  hasLiveDemo: false,

  subtitle: 'Reading a FIFO waits for a writer, so copying one would hang. copyfile stats both paths first and raises SpecialFileError("`name` is a named pipe") when either is a FIFO. Named pipes are a Unix feature — on Windows this never happens.',

  covers: ['SpecialFileError'],

  chain: ['BaseException', 'Exception', 'OSError', 'SpecialFileError'],

  cheat: {
    raisedBy: 'shutil.copyfile (src or dst is a FIFO); copytree collects it into shutil.Error',
    message:  '`pipe` is a named pipe',
    quickFix: 'Skip FIFOs: check stat.S_ISFIFO first, or give copytree an ignore= function that drops them',
    watchOut: 'It is an OSError, but not a shutil.Error',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'copyfile passes one message: "`<path>` is a named pipe" (with backticks).' },
  ],

  patterns: [
    {
      name: 'Skip named pipes in copytree',
      desc: 'An ignore function that drops FIFOs (Unix).',
      code: "import os, shutil, stat\ndef no_fifos(path, names):\n    return {n for n in names if stat.S_ISFIFO(os.lstat(os.path.join(path, n)).st_mode)}\nshutil.copytree('src', 'dst', ignore=no_fifos)",
    },
    {
      name: 'Handle it on its own',
      desc: 'Copy what you can, report special files.',
      code: "import shutil\ntry:\n    shutil.copy2(src, dst)\nexcept shutil.SpecialFileError as e:\n    print('skipped:', e)",
    },
  ],

  examples: [
    { title: 'Where it sits in the hierarchy', code: 'import shutil\n[c.__name__ for c in shutil.SpecialFileError.__mro__]', returns: "['SpecialFileError', 'OSError', 'Exception', 'BaseException', 'object']" },
    { title: 'Not a shutil.Error', code: 'import shutil\nissubclass(shutil.SpecialFileError, shutil.Error)', returns: 'False' },
    { title: 'The message format', code: "import shutil\nraise shutil.SpecialFileError('`pipe` is a named pipe')", returns: 'shutil.SpecialFileError: `pipe` is a named pipe' },
    { title: 'except OSError catches it', code: "import shutil\ntry:\n    raise shutil.SpecialFileError('`pipe` is a named pipe')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'SpecialFileError'" },
    { title: 'Exported in __all__', code: "import shutil\n'SpecialFileError' in shutil.__all__", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Catching it with except shutil.Error',
      desc: 'SpecialFileError derives from OSError directly. Catch it by name, or OSError.',
      wrong: { label: 'except shutil.Error', code: "import shutil\ntry:\n    try:\n        raise shutil.SpecialFileError('`fifo` is a named pipe')\n    except shutil.Error:\n        result = 'handled'\nexcept OSError as e:\n    result = f'escaped: {type(e).__name__}'\nresult", output: "'escaped: SpecialFileError'" },
      fix:   { label: 'except SpecialFileError', code: "import shutil\ntry:\n    raise shutil.SpecialFileError('`fifo` is a named pipe')\nexcept shutil.SpecialFileError as e:\n    result = f'handled: {e}'\nresult", output: "'handled: `fifo` is a named pipe'" },
    },
  ],

  when: {
    use: [
      'except shutil.SpecialFileError when copying from folders that may contain FIFOs (/tmp, /run, build sandboxes)',
    ],
    avoid: [
      'Windows-only code — named pipes there are not files in a folder',
    ],
  },

  notes: {
    cpython:      'Lib/shutil.py: copyfile stats src and dst; if stat.S_ISFIFO(st.st_mode): raise SpecialFileError("`%s` is a named pipe" % fn)',
    'Checked on Linux': "copyfile('pipe', 'copy') and copyfile('plain.txt', 'pipe') both raise SpecialFileError: `pipe` is a named pipe; copytree of a folder with a FIFO copies the rest and raises shutil.Error with ('src/fifo', 'dst/fifo', '`src/fifo` is a named pipe')",
    'Other types': 'Only FIFOs are checked. A Unix socket fails when opened with an ordinary OSError ([Errno 6] No such device or address on Linux); device files are opened and read like regular files (copying /dev/null gives an empty file)',
  },

  related: [
    { name: 'shutil.copyfile', slug: 'copyfile', when: 'Where it is raised' },
    { name: 'shutil.Error',    slug: 'error',    when: 'What copytree wraps it in' },
    { name: 'os.mkfifo / os.mknod', slug: 'mknod', when: 'How named pipes are created', category: 'stdlib/os' },
    { name: 'OSError',         slug: 'oserror',  when: 'Its base class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "shutil.SpecialFileError: `x` is a named pipe" mean?',
      a: 'The source or destination is a FIFO (created with mkfifo). Copying it would block until another process writes to it, so shutil refuses. Skip the file or copy its data from the producing process instead. This page has no live demo because named pipes exist only on Unix (os.mkfifo); the examples raise the exception directly, and the notes record what Linux printed.',
    },
    {
      q: 'Can shutil copy device files or sockets?',
      a: 'There is no special check for them: copyfile opens the path and reads it like a regular file. Opening a Unix socket fails with an ordinary OSError; a device is read until it reports end of file, which some devices never do. Filter them out with stat.S_ISSOCK / S_ISCHR / S_ISBLK.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.SpecialFileError',
    meta:  'shutil.SpecialFileError',
  },
};
