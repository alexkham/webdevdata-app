// content/reference/python/stdlib/os/chmod.js

export const meta = {
  slug:        'chmod',
  name:        'os.chmod',
  signature:   'os.chmod(path, mode, *, dir_fd=None, follow_symlinks=True) / fchmod / lchmod / chown / fchown / lchown / umask',
  blurb:       'Change permission bits (chmod, fchmod, lchmod), file owner and group (chown, fchown, lchown), and the default mask for new files (umask).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all) (fchmod/lchmod on Windows 3.13+)',
  searchTerms: 'os.chmod chmod os.fchmod fchmod os.lchmod lchmod os.chown chown os.fchown fchown os.lchown lchown os.umask umask change file permissions python make executable read only 0o755 0o644 owner group uid gid stat S_IWRITE S_IREAD shutil.chown',
};

export const method = {
  slug:      'chmod',
  name:      'os.chmod',
  signature: 'os.chmod(path, mode, *, dir_fd=None, follow_symlinks=True) / fchmod / lchmod / chown / fchown / lchown / umask',
  returns:   { type: 'None | int', desc: 'chmod/chown and their variants return None; umask returns the previous mask as an int.' },

  category:    'os function',
  version:     'Python 3 (all) (fchmod/lchmod on Windows 3.13+)',
  hasLiveDemo: false,

  subtitle: 'chmod sets the complete permission mode; umask decides which bits new files do NOT get. On Windows chmod only toggles the read-only flag (the write bits) and ignores everything else. chown, fchown and lchown are Unix only; lchmod exists on Windows (3.13+) and macOS/BSD but not on Linux.',

  covers: ['chmod', 'fchmod', 'lchmod', 'chown', 'fchown', 'lchown', 'umask'],

  cheat: {
    commonCall: 'os.chmod(path, os.stat(path).st_mode | stat.S_IXUSR)',
    returns:    'None (umask: the previous mask)',
    replaces:   'subprocess.run(["chmod", "+x", path])',
    watchOut:   'Octal literals: 0o644, not 644',
  },

  parameters: [
    { name: 'path',            type: 'str | bytes | PathLike | int', required: true,  default: null,   desc: 'The file. chmod and chown also accept an open file descriptor (on Windows since 3.13 for chmod).' },
    { name: 'mode',            type: 'int',  required: true,  default: null,   desc: 'chmod/fchmod/lchmod: permission bits, an octal literal (0o644) or stat.S_* flags OR-ed together.' },
    { name: 'uid',             type: 'int',  required: true,  default: null,   desc: 'chown family: numeric user id; -1 leaves it unchanged.' },
    { name: 'gid',             type: 'int',  required: true,  default: null,   desc: 'chown family: numeric group id; -1 leaves it unchanged.' },
    { name: 'mask',            type: 'int',  required: true,  default: null,   desc: 'umask: bits to remove from the mode of newly created files and directories.' },
    { name: 'dir_fd',          type: 'int',  required: false, default: 'None', desc: 'Resolve a relative path against this open directory (Unix).' },
    { name: 'follow_symlinks', type: 'bool', required: false, default: 'True', desc: 'False acts on a symlink itself (lchmod / lchown). The docs note the default is False on Windows.' },
  ],

  patterns: [
    {
      name: 'Make a script executable (Unix)',
      desc: 'Add the execute bit for owner, group and others to the current mode.',
      code: "import os\nimport stat\nmode = os.stat('deploy.sh').st_mode\nos.chmod('deploy.sh', mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)",
    },
    {
      name: 'Clear read-only before deleting (works on Windows)',
      desc: 'A read-only file cannot be deleted on Windows; give the write bit back first.',
      code: "import os\nimport stat\nos.chmod(path, stat.S_IWRITE)\nos.remove(path)",
    },
    {
      name: 'Create files with a private mask',
      desc: 'Set the umask around the code that creates files, and always restore it - it is process-wide.',
      code: "import os\nold = os.umask(0o077)\ntry:\n    with open('token.txt', 'w') as f:\n        f.write(token)\nfinally:\n    os.umask(old)",
    },
    {
      name: 'Change owner by name (Unix)',
      desc: 'shutil.chown accepts user and group names; os.chown wants numeric ids.',
      code: "import shutil\nshutil.chown('/srv/app/data', user='www-data', group='www-data')",
    },
  ],

  examples: [
    { title: 'Remove the write permission',     code: "import os\nimport stat\nopen('ro.txt', 'w').close()\nos.chmod('ro.txt', 0o444)\nwritable = bool(os.stat('ro.txt').st_mode & stat.S_IWUSR)\nos.chmod('ro.txt', 0o644)\nwritable", returns: 'False' },
    { title: 'Writing a read-only file fails',  code: "import os\nopen('ro.txt', 'w').close()\nos.chmod('ro.txt', 0o444)\ntry:\n    open('ro.txt', 'w')\nexcept OSError as e:\n    result = (type(e).__name__, e.errno)\nfinally:\n    os.chmod('ro.txt', 0o644)\nresult", returns: "('PermissionError', 13)" },
    { title: 'fchmod through a descriptor',     code: "import os\nimport stat\nopen('f.txt', 'w').close()\nfd = os.open('f.txt', os.O_RDWR)\ntry:\n    os.fchmod(fd, 0o444)\n    ro = not os.stat('f.txt').st_mode & stat.S_IWUSR\n    os.fchmod(fd, 0o644)\nfinally:\n    os.close(fd)\nro", returns: 'True' },
    { title: 'Read a mode as text',             code: "import stat\n(stat.filemode(stat.S_IFREG | 0o755), stat.filemode(stat.S_IFDIR | 0o700))", returns: "('-rwxr-xr-x', 'drwx------')" },
    { title: 'What a umask of 0o022 leaves',    code: "(oct(0o666 & ~0o022), oct(0o777 & ~0o022))", returns: "('0o644', '0o755')" },
    { title: 'umask returns the old mask',      code: "import os\nold = os.umask(0o077)\ntry:\n    pass\nfinally:\n    os.umask(old)\ntype(old).__name__", returns: "'int'" },
    { title: 'Missing file',                    code: "import os\ntry:\n    os.chmod('ghost.txt', 0o644)\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
  ],

  pitfalls: [
    {
      name: 'Writing the mode in decimal',
      desc: '644 is decimal (0o1204), which sets write-for-owner, read-for-others and the sticky bit. Permission modes are octal.',
      wrong: { label: '644',   code: "import stat\nstat.filemode(stat.S_IFREG | 644)",   output: "'--w----r-T'" },
      fix:   { label: '0o644', code: "import stat\nstat.filemode(stat.S_IFREG | 0o644)", output: "'-rw-r--r--'" },
    },
    {
      name: 'Replacing the mode when you meant to add a bit',
      desc: 'chmod sets the whole mode. Read st_mode and OR the new bit in to keep the others.',
      wrong: { label: 'only S_IRUSR',  code: "import os\nimport stat\nopen('f.txt', 'w').close()\nos.chmod('f.txt', stat.S_IRUSR)\nwritable = bool(os.stat('f.txt').st_mode & stat.S_IWUSR)\nos.chmod('f.txt', 0o644)\nwritable", output: 'False' },
      fix:   { label: 'OR with st_mode', code: "import os\nimport stat\nopen('f.txt', 'w').close()\nos.chmod('f.txt', os.stat('f.txt').st_mode | stat.S_IRUSR)\nbool(os.stat('f.txt').st_mode & stat.S_IWUSR)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Making scripts executable, keys private (0o600), files read-only',
      'Setting a private umask around code that creates sensitive files',
      'Changing ownership in install or deploy scripts running as root (Unix)',
    ],
    avoid: [
      'Windows ACLs → not reachable through chmod (icacls or pywin32)',
      'Owner by user name → shutil.chown',
      'Only the mode at creation time → os.open(path, flags, mode) / os.mkdir(path, mode)',
    ],
  },

  notes: {
    cpython:       'Modules/posixmodule.c. fchmod(fd, m) is chmod(fd, m), lchmod(p, m) is chmod(p, m, follow_symlinks=False), fchown and lchown likewise for chown',
    'Availability': 'chmod, umask: Unix and Windows. fchmod: Unix, Windows (3.13+). lchmod: Unix, Windows (3.13+), not Linux, not OpenBSD (it is in os.__all__ on Windows 3.13 and missing on Linux). chown, fchown, lchown: Unix only',
    'Windows chmod': 'Only the read-only flag is set or cleared (stat.S_IWRITE / S_IREAD); the mode then reads back as 0o444 or 0o666. Execute, group and other bits are ignored. fchmod needs a descriptor opened for writing there: on a read-only descriptor it raised PermissionError on Windows 3.13 but worked on Linux',
    'Windows umask': 'Only the 0o600 bits of the mask are kept: os.umask(0o022) stores 0 and os.umask(0o777) stores 0o600 (verified on Windows CPython 3.13)',
    'root':          'On Linux, root bypasses the permission bits, so a 0o444 file is still writable by root',
  },

  related: [
    { name: 'os.access', slug: 'access', when: 'Check what the current user may do' },
    { name: 'os.stat', slug: 'stat', when: 'Read st_mode, st_uid, st_gid' },
    { name: 'Path.chmod', slug: 'chmod', when: 'The pathlib method', category: 'stdlib/pathlib' },
    { name: 'os.makedirs / mkdir', slug: 'makedirs', when: 'mode= at creation time' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'What missing permissions raise', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: "Why does this page have no live demo?",
      a: "Permission bits are an OS feature: Windows only honours the read-only flag, and on Unix the result also depends on the owner and the umask. The examples only show changes that read back the same on Linux and Windows, and they restore what they change.",
    },
    {
      q: 'How do I make a file executable in Python?',
      a: 'os.chmod(p, os.stat(p).st_mode | stat.S_IXUSR) adds the owner execute bit on Linux and macOS (add S_IXGRP and S_IXOTH for everyone). Windows has no execute bit and ignores it.',
    },
    {
      q: 'Why does os.chmod not work on Windows?',
      a: 'It works, but Windows permissions are ACLs, not mode bits. chmod can only set or clear the read-only flag (through the write bits); all other bits are ignored.',
    },
    {
      q: 'How do I read the current umask?',
      a: 'There is no read-only call: os.umask(new) sets a mask and returns the old one. Set it and immediately put the old value back with a second os.umask(old).',
    },
    {
      q: 'What is the difference between os.chown and shutil.chown?',
      a: 'os.chown takes numeric uid and gid (-1 = unchanged); shutil.chown also accepts user and group names. Both are documented as Unix only.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.chmod',
    meta:  'os.chmod / chown / umask',
  },
};
