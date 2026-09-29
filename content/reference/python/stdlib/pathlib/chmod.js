// content/reference/python/stdlib/pathlib/chmod.js

export const meta = {
  slug:        'chmod',
  name:        'Path.chmod',
  signature:   'Path.chmod(mode, *, follow_symlinks=True) / .lchmod(mode)',
  blurb:       'Change permission bits, like os.chmod. lchmod() changes a symlink itself instead of its target. On Windows only the read-only flag is honoured.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: false,
  version:     'Python 3.4+ (follow_symlinks 3.10+)',
  searchTerms: 'Path.chmod chmod lchmod Path.lchmod change file permissions python pathlib make executable read only 0o755 0o644 stat S_IXUSR os.chmod',
};

export const method = {
  slug:      'chmod',
  name:      'Path.chmod',
  signature: 'Path.chmod(mode, *, follow_symlinks=True) / .lchmod(mode)',
  returns:   { type: 'None', desc: 'Changes the file in place.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (follow_symlinks 3.10+)',
  hasLiveDemo: false,

  subtitle: "chmod(0o755) sets the full mode; to add or remove one bit, read st_mode first and combine with the stat constants. Permissions are an OS feature: on Windows chmod can only toggle read-only (the write bits), everything else is ignored.",

  covers: ['Path.chmod'],

  cheat: {
    commonCall: 'p.chmod(p.stat().st_mode | stat.S_IXUSR)',
    returns:    'None',
    replaces:   'os.chmod(p, mode)',
    watchOut:   'Write mode numbers in octal: 0o644, not 644',
  },

  parameters: [
    { name: 'mode',            type: 'int',  required: true,  default: null,   desc: 'Permission bits, usually an octal literal (0o644) or stat.S_* flags OR-ed together.' },
    { name: 'follow_symlinks', type: 'bool', required: false, default: 'True', desc: 'chmod only (3.10+): False changes the link itself — the same as lchmod(), and not supported on every platform.' },
  ],

  patterns: [
    {
      name: 'Make a script executable (POSIX)',
      desc: 'Add the execute bits to the current mode.',
      code: "import stat\nfrom pathlib import Path\np = Path('deploy.sh')\np.chmod(p.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)",
    },
    {
      name: 'Private file (owner read/write only)',
      desc: 'Typical for keys and tokens on POSIX.',
      code: "from pathlib import Path\nPath('secret.key').chmod(0o600)",
    },
    {
      name: 'Make a file read-only (works on Windows too)',
      desc: 'Removing all write bits sets the read-only attribute on Windows.',
      code: "import stat\nfrom pathlib import Path\np = Path('frozen.txt')\np.chmod(p.stat().st_mode & ~(stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH))",
    },
  ],

  examples: [
    { title: 'Remove the write permission',   code: "import stat\nfrom pathlib import Path\np = Path('ro.txt')\np.touch()\np.chmod(0o444)\nwritable = bool(p.stat().st_mode & stat.S_IWUSR)\np.chmod(0o644)\nwritable", returns: 'False' },
    { title: 'Give it back',                  code: "import stat\nfrom pathlib import Path\np = Path('rw.txt')\np.touch()\np.chmod(0o444)\np.chmod(0o644)\nbool(p.stat().st_mode & stat.S_IWUSR)", returns: 'True' },
    { title: 'Octal vs decimal',              code: '(0o644, 644 == 0o644)', returns: '(420, False)' },
    { title: 'Readable as a permission string', code: "import stat\nfrom pathlib import Path\nPath('d').mkdir()\nstat.filemode(Path('d').stat().st_mode)[0]", returns: "'d'" },
    { title: 'Missing file',                  code: "from pathlib import Path\ntry:\n    Path('ghost').chmod(0o644)\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
  ],

  pitfalls: [
    {
      name: 'Writing the mode in decimal',
      desc: '644 is a decimal number (0o1204) and sets strange bits. Permission masks are octal.',
      wrong: { label: '644', code: 'oct(644)', output: "'0o1204'" },
      fix:   { label: '0o644', code: 'oct(0o644)', output: "'0o644'" },
    },
    {
      name: 'Replacing the mode when you meant to add a bit',
      desc: 'chmod sets the complete mode. Read st_mode and OR in the new bit to keep the others.',
      wrong: { label: 'set only S_IRUSR', code: "import stat\nfrom pathlib import Path\np = Path('f')\np.touch()\np.chmod(stat.S_IRUSR)\nwritable = bool(p.stat().st_mode & stat.S_IWUSR)\np.chmod(0o644)\nwritable", output: 'False' },
      fix:   { label: 'combine with st_mode', code: "import stat\nfrom pathlib import Path\np = Path('f')\np.touch()\np.chmod(p.stat().st_mode | stat.S_IRUSR)\nbool(p.stat().st_mode & stat.S_IWUSR)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Making scripts executable, keys private, files read-only',
    ],
    avoid: [
      'Windows ACLs → not reachable through chmod (use icacls or pywin32)',
      'Changing owner → os.chown / shutil.chown (POSIX)',
    ],
  },

  notes: {
    cpython:        'Path.chmod is os.chmod(self, mode, follow_symlinks=…) (Lib/pathlib/_local.py); lchmod is PathBase.lchmod = chmod(mode, follow_symlinks=False)',
    'Windows':      'Only the read-only attribute is affected (write bits on/off); execute and group/other bits are ignored',
    'lchmod':       "Changing a symlink's own mode is not supported on every OS; where it is not, the call raises instead of silently changing the target",
  },

  related: [
    { name: 'stat / lstat', slug: 'stat',   when: 'Read the current mode' },
    { name: 'mkdir / touch', slug: 'mkdir', when: 'mode= at creation time' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'What missing permissions cause', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I make a file executable in Python?',
      a: 'p.chmod(p.stat().st_mode | stat.S_IXUSR) adds the owner execute bit on Linux and macOS. Windows has no execute bit; it decides by file extension.',
    },
    {
      q: 'How do I make a file read-only with pathlib?',
      a: 'p.chmod(0o444) — or clear the write bits from st_mode. On Windows this sets the read-only attribute.',
    },
    {
      q: 'What does chmod 0o755 mean?',
      a: 'Owner read/write/execute (7), group and others read/execute (5 each) — the usual mode for scripts and folders.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.chmod',
    meta:  'Path.chmod / lchmod',
  },
};
