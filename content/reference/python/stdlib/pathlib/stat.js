// content/reference/python/stdlib/pathlib/stat.js

export const meta = {
  slug:        'stat',
  name:        'Path.stat',
  signature:   'Path.stat(*, follow_symlinks=True) / .lstat() / .owner() / .group() / .samefile(other)',
  blurb:       'File metadata: stat() returns an os.stat_result (size, times, mode bits, inode …), lstat() does not follow symlinks, owner() and group() give names (POSIX only), samefile() compares two paths by identity.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: false,
  version:     'Python 3.4+ (samefile 3.5+, follow_symlinks 3.10+)',
  searchTerms: 'Path.stat stat lstat owner group samefile Path.lstat Path.owner Path.group Path.samefile file size python pathlib st_size st_mtime modification time file owner same file inode',
};

export const method = {
  slug:      'stat',
  name:      'Path.stat',
  signature: 'Path.stat(*, follow_symlinks=True) / .lstat() / .owner(*, follow_symlinks=True) / .group(*, follow_symlinks=True) / .samefile(other_path)',
  returns:   { type: 'os.stat_result | str | bool', desc: 'stat/lstat: os.stat_result; owner/group: a user or group name; samefile: bool.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (samefile 3.5+, follow_symlinks 3.10+)',
  hasLiveDemo: false,

  subtitle: 'p.stat().st_size is the file size in bytes, st_mtime the modification time as a Unix timestamp. Most fields are machine-specific, so this page has no live demo; the examples use only portable facts.',

  covers: ['Path.stat'],

  cheat: {
    commonCall: 'p.stat().st_size',
    returns:    'os.stat_result (st_size, st_mtime, st_mode, …)',
    replaces:   'os.stat(p), os.path.getsize(p), os.path.getmtime(p)',
    watchOut:   'owner() / group() raise UnsupportedOperation on Windows',
  },

  parameters: [
    { name: 'follow_symlinks', type: 'bool', required: false, default: 'True', desc: 'stat (3.10+), owner / group (3.13+): with False, describe a symlink itself (stat(follow_symlinks=False) is lstat()).' },
    { name: 'other_path', type: 'str | os.PathLike', required: true, default: null, desc: 'samefile only: the path to compare with.' },
  ],

  patterns: [
    {
      name: 'Human-readable size',
      desc: 'st_size is bytes.',
      code: "from pathlib import Path\nsize_mb = Path('video.mp4').stat().st_size / 1024 ** 2",
    },
    {
      name: 'Modification time as a datetime',
      desc: 'st_mtime is seconds since the epoch.',
      code: "from datetime import datetime, timezone\nfrom pathlib import Path\nmodified = datetime.fromtimestamp(Path('report.pdf').stat().st_mtime, tz=timezone.utc)",
    },
    {
      name: 'Files changed since a timestamp',
      desc: 'Compare mtimes while globbing.',
      code: "from pathlib import Path\nchanged = [p for p in Path('src').rglob('*.py') if p.stat().st_mtime > last_build]",
    },
    {
      name: 'Is it executable? (POSIX)',
      desc: 'Test the mode bits with the stat module.',
      code: "import stat\nfrom pathlib import Path\nis_exec = bool(Path('run.sh').stat().st_mode & stat.S_IXUSR)",
    },
  ],

  examples: [
    { title: 'Size in bytes',                  code: "from pathlib import Path\np = Path('data.bin')\np.write_bytes(b'12345')\np.stat().st_size", returns: '5' },
    { title: 'An empty file',                  code: "from pathlib import Path\nPath('empty').touch()\nPath('empty').stat().st_size", returns: '0' },
    { title: 'Mode bits say file or folder',   code: "import stat\nfrom pathlib import Path\nPath('d').mkdir()\nPath('f').touch()\n(stat.S_ISDIR(Path('d').stat().st_mode), stat.S_ISREG(Path('f').stat().st_mode))", returns: '(True, True)' },
    { title: 'lstat of a regular file equals stat', code: "from pathlib import Path\np = Path('x')\np.touch()\np.lstat().st_size == p.stat().st_size", returns: 'True' },
    { title: 'samefile ignores spelling',      code: "from pathlib import Path\nPath('sub').mkdir()\nPath('f.txt').touch()\nPath('sub/../f.txt').samefile('f.txt')", returns: 'True' },
    { title: 'Missing file',                   code: "from pathlib import Path\ntry:\n    Path('ghost').stat()\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
  ],

  pitfalls: [
    {
      name: 'Measuring text files written with write_text',
      desc: "write_text translates '\\n' to os.linesep, so the byte size of the same text differs between Windows and Linux. Compare characters, or write bytes.",
      wrong: { label: 'size after write_text', code: "import os\nfrom pathlib import Path\np = Path('t.txt')\np.write_text('a\\nb\\n', encoding='utf-8')\np.stat().st_size == 4 + 2 * (len(os.linesep) - 1)", output: 'True' },
      fix:   { label: 'newline=""', code: "from pathlib import Path\np = Path('t.txt')\np.write_text('a\\nb\\n', encoding='utf-8', newline='')\np.stat().st_size", output: '4' },
    },
    {
      name: 'Calling owner() on Windows',
      desc: 'owner() and group() need the POSIX pwd / grp modules. Guard them in portable code.',
      wrong: { label: 'unguarded', code: "import os\nfrom pathlib import Path, UnsupportedOperation\nPath('f').touch()\ntry:\n    Path('f').owner()\n    result = 'name'\nexcept UnsupportedOperation:\n    result = 'unsupported'\nresult == ('unsupported' if os.name == 'nt' else 'name')", output: 'True' },
      fix:   { label: 'guarded', code: "import os\nfrom pathlib import Path\nPath('f').touch()\nowner = Path('f').owner() if os.name != 'nt' else None\nowner is None or isinstance(owner, str)", output: 'True' },
    },
  ],

  when: {
    use: [
      'File size, modification time, mode bits',
      'Checking whether two paths are the same file (samefile)',
    ],
    avoid: [
      'Only need "does it exist / is it a file" → exists() / is_file()',
      'Many files in one folder → os.scandir entries cache stat data',
    ],
  },

  notes: {
    cpython:          'stat is os.stat(self, follow_symlinks=…) (Lib/pathlib/_local.py); lstat, owner, group and samefile come from PathBase in _abc.py; owner/group are only defined when pwd / grp import',
    'Portable fields': 'st_size, st_mtime, st_atime, st_mode (file type bits) are meaningful everywhere; st_ino, st_dev, st_uid, st_gid, st_ctime differ by OS',
    'st_ctime':       'Means different things per OS (metadata change time on POSIX) — do not use it as a portable creation time',
    'samefile':       'Compares st_ino and st_dev of both paths, so hard links and different spellings of one file are the same',
  },

  related: [
    { name: 'exists / is_file / is_dir', slug: 'exists', when: 'Simple type checks' },
    { name: 'chmod / lchmod',   slug: 'chmod',   when: 'Change the mode bits' },
    { name: 'UnsupportedOperation', slug: 'unsupportedoperation', when: 'owner() / group() on Windows' },
    { name: 'glob / rglob', slug: 'glob', when: 'Combine with stat for sizes and times' },
  ],

  faq: [
    {
      q: 'How do I get the size of a file in Python?',
      a: "Path('file').stat().st_size — the size in bytes. os.path.getsize(p) is the same number.",
    },
    {
      q: 'How do I get the last modified time with pathlib?',
      a: "Path('file').stat().st_mtime is a Unix timestamp (float seconds); convert with datetime.fromtimestamp(..., tz=timezone.utc).",
    },
    {
      q: 'How do I find the owner of a file?',
      a: 'Path(p).owner() on Linux and macOS. On Windows it raises UnsupportedOperation (3.13+; NotImplementedError before).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.stat',
    meta:  'Path.stat / lstat / owner / group / samefile',
  },
};
