// content/reference/python/stdlib/os/access.js

export const meta = {
  slug:        'access',
  name:        'os.access',
  signature:   'os.access(path, mode, *, dir_fd=None, effective_ids=False, follow_symlinks=True)',
  blurb:       'Ask whether the current user may read, write or execute a path (or whether it exists) - with the mode flags F_OK, R_OK, W_OK and X_OK.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all) (dir_fd, effective_ids, follow_symlinks 3.3+)',
  searchTerms: 'os.access access os.F_OK F_OK os.R_OK R_OK os.W_OK W_OK os.X_OK X_OK check file permission python is file writable readable executable exists permission check eafp race condition',
};

export const method = {
  slug:      'access',
  name:      'os.access',
  signature: 'os.access(path, mode, *, dir_fd=None, effective_ids=False, follow_symlinks=True)',
  returns:   { type: 'bool', desc: 'True if every requested kind of access is allowed; False otherwise, including when the path does not exist.' },

  category:    'os function',
  version:     'Python 3 (all) (dir_fd, effective_ids, follow_symlinks 3.3+)',
  hasLiveDemo: false,

  subtitle: 'mode is F_OK (exists) or an OR of R_OK, W_OK and X_OK. access never raises for a missing path - it returns False. It checks with the REAL user id, and the answer can be stale a moment later, so for opening files the docs recommend just trying (EAFP). Available on Unix and Windows; on Windows it only sees existence and the read-only flag.',

  covers: ['access', 'F_OK', 'R_OK', 'W_OK', 'X_OK'],

  cheat: {
    commonCall: 'os.access(path, os.R_OK | os.W_OK)',
    returns:    'True / False (never raises for missing paths)',
    replaces:   'Parsing st_mode bits by hand',
    watchOut:   'Combine flags with |, not and',
  },

  parameters: [
    { name: 'path',            type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'The file or directory to test.' },
    { name: 'mode',            type: 'int',  required: true,  default: null,    desc: 'os.F_OK (0) to test existence, or R_OK (4), W_OK (2), X_OK (1) OR-ed together.' },
    { name: 'dir_fd',          type: 'int',  required: false, default: 'None',  desc: 'Resolve a relative path against this open directory (Unix).' },
    { name: 'effective_ids',   type: 'bool', required: false, default: 'False', desc: 'Check with the effective uid/gid instead of the real ones; NotImplementedError where os.supports_effective_ids does not contain os.access.' },
    { name: 'follow_symlinks', type: 'bool', required: false, default: 'True',  desc: 'False tests a symlink itself.' },
  ],

  patterns: [
    {
      name: 'EAFP instead of access + open',
      desc: 'The pattern the docs recommend: try the operation and handle the error.',
      code: "try:\n    f = open('config.ini')\nexcept FileNotFoundError:\n    data = DEFAULTS\nexcept PermissionError:\n    raise SystemExit('config.ini is not readable')\nelse:\n    with f:\n        data = f.read()",
    },
    {
      name: 'Pre-flight check for a friendlier message',
      desc: 'Fine for UI hints, as long as the real operation still handles errors.',
      code: "import os\nif not os.access(out_dir, os.W_OK):\n    print(f'warning: cannot write to {out_dir}')",
    },
    {
      name: 'Is this executable? (Unix)',
      desc: 'X_OK on a file; on a directory it means "may enter".',
      code: "import os\nis_exe = os.path.isfile(p) and os.access(p, os.X_OK)",
    },
  ],

  examples: [
    { title: 'F_OK: does it exist?',             code: "import os\n(os.access('.', os.F_OK), os.access('missing.txt', os.F_OK))", returns: '(True, False)' },
    { title: 'Read and write a new file',        code: "import os\nopen('notes.txt', 'w').close()\nos.access('notes.txt', os.R_OK | os.W_OK)", returns: 'True' },
    { title: 'A read-only file',                 code: "import os\nopen('ro.txt', 'w').close()\nos.chmod('ro.txt', 0o444)\nresult = (os.access('ro.txt', os.R_OK), os.access('ro.txt', os.W_OK))\nos.chmod('ro.txt', 0o644)\nresult", returns: '(True, False)' },
    { title: 'Missing path: False, not an error', code: "import os\nos.access('missing.txt', os.R_OK)", returns: 'False' },
    { title: 'The flag values',                  code: "import os\n(os.F_OK, os.R_OK, os.W_OK, os.X_OK)", returns: '(0, 4, 2, 1)' },
    { title: 'The EAFP alternative',             code: "try:\n    with open('config.ini') as f:\n        data = f.read()\nexcept FileNotFoundError:\n    data = 'defaults'\ndata", returns: "'defaults'" },
  ],

  pitfalls: [
    {
      name: 'Combining flags with and',
      desc: '`os.R_OK and os.W_OK` is just W_OK (and returns its second operand), so readability is never tested. Use the bitwise |.',
      wrong: { label: 'and', code: "import os\nos.R_OK and os.W_OK", output: '2' },
      fix:   { label: '|',   code: "import os\nos.R_OK | os.W_OK",   output: '6' },
    },
    {
      name: 'Check, then open (a race)',
      desc: 'Between access() and open() the file can be removed, replaced or have its permissions changed - the docs call this a security hole. Both versions print the same here; only the second one is safe when the file changes in between.',
      wrong: { label: 'access then open', code: "import os\nif os.access('cfg.ini', os.R_OK):\n    data = open('cfg.ini').read()\nelse:\n    data = 'defaults'\ndata", output: "'defaults'" },
      fix:   { label: 'try open',         code: "try:\n    with open('cfg.ini') as f:\n        data = f.read()\nexcept OSError:\n    data = 'defaults'\ndata", output: "'defaults'" },
    },
  ],

  when: {
    use: [
      'Friendly pre-flight messages ("output folder is not writable")',
      'setuid programs that must check what the REAL user may do',
      'Finding executables (X_OK) on Unix - or use shutil.which',
    ],
    avoid: [
      'Guarding open() → just open it and catch OSError',
      'Existence only → os.path.exists / Path.exists',
      'Windows ACL checks → access only sees the read-only flag',
    ],
  },

  notes: {
    cpython:        'access(2) / faccessat(2) on Unix; on Windows GetFileAttributesW: False when the path is missing, and False for W_OK only when the read-only attribute is set on a file',
    'Real vs effective ids': 'access() uses the real uid/gid (the setuid use case). effective_ids=True switches to the effective ids where supported',
    'Windows':      'X_OK is True for any existing file (verified: a fresh .txt file reports X_OK True on Windows and False on Linux)',
    'root':         'On Linux root gets W_OK True even for a 0o444 file (verified)',
    'Network filesystems': 'The docs warn that I/O can still fail when access() says it would succeed',
  },

  related: [
    { name: 'os.chmod / umask', slug: 'chmod', when: 'Change the permission bits' },
    { name: 'os.stat', slug: 'stat', when: 'Read the mode bits yourself' },
    { name: 'os.path.exists', slug: 'exists', when: 'Just existence', category: 'stdlib/os-path' },
    { name: 'open()', slug: 'open', when: 'Try the operation instead', category: 'functions' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'What a denied open raises', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: "Why does this page have no live demo?",
      a: "What access() answers depends on the permissions of the machine and on who runs the code (root, for example, gets True for writing almost anything), so a live result would describe our server, not your files. The examples create their own files and only show answers that are the same on Linux and Windows.",
    },
    {
      q: 'How do I check if a file is writable in Python?',
      a: 'os.access(path, os.W_OK) answers it for the current (real) user. For actually writing, open it inside try/except PermissionError instead - the answer from access can change before you open the file.',
    },
    {
      q: 'Does os.access raise if the file does not exist?',
      a: 'No. It returns False for any mode, including F_OK, so you cannot tell "missing" from "not permitted" without a second check.',
    },
    {
      q: 'What do F_OK, R_OK, W_OK and X_OK mean?',
      a: 'F_OK (0) tests existence; R_OK (4), W_OK (2) and X_OK (1) test read, write and execute permission. Combine them with |, e.g. os.R_OK | os.W_OK.',
    },
    {
      q: 'Why does os.access say True but open fails?',
      a: 'access checks the real user id while open uses the effective one, the file may have changed in between, and network filesystems or ACLs can deny what the mode bits allow.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.access',
    meta:  'os.access / F_OK R_OK W_OK X_OK',
  },
};
