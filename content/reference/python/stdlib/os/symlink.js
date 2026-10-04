// content/reference/python/stdlib/os/symlink.js

export const meta = {
  slug:        'symlink',
  name:        'os.symlink',
  signature:   'os.symlink(src, dst, target_is_directory=False, *, dir_fd=None) / os.link(src, dst) / os.readlink(path)',
  blurb:       'Create symbolic links (symlink) and hard links (link), and read where a symbolic link points (readlink).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all) (Windows support 3.2+)',
  searchTerms: 'os.symlink symlink os.link link os.readlink readlink create symbolic link python hard link soft link ln -s windows developer mode SeCreateSymbolicLinkPrivilege st_nlink junction',
};

export const method = {
  slug:      'symlink',
  name:      'os.symlink',
  signature: 'os.symlink(src, dst, target_is_directory=False, *, dir_fd=None) / os.link(src, dst) / os.readlink(path)',
  returns:   { type: 'None | str | bytes', desc: 'symlink and link return None; readlink returns the stored link target (bytes for a bytes path).' },

  category:    'os function',
  version:     'Python 3 (all) (Windows support 3.2+)',
  hasLiveDemo: false,

  subtitle: 'Argument order is like ln: the existing target first, the new name second. A symlink stores a path (it may dangle); a hard link is a second name for the same file data. All three are available on Unix and Windows - but creating symlinks on Windows needs Developer Mode or an administrator, which is why the examples here use hard links and never create a symlink.',

  covers: ['symlink', 'link', 'readlink'],

  cheat: {
    commonCall: "os.symlink('releases/v2', 'current')",
    returns:    'None (readlink → the target string)',
    replaces:   'subprocess.run(["ln", "-s", target, name])',
    watchOut:   'src is the TARGET, dst is the new link name',
  },

  parameters: [
    { name: 'src',                 type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'symlink/link: the existing target the link points to. For symlink it is stored as written and need not exist.' },
    { name: 'dst',                 type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'symlink/link: the name of the link to create; must not exist yet.' },
    { name: 'target_is_directory', type: 'bool', required: false, default: 'False', desc: 'symlink, Windows only: create a directory symlink when the target does not exist (yet). Ignored elsewhere.' },
    { name: 'path',                type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'readlink: the symbolic link to read.' },
    { name: 'dir_fd',              type: 'int',  required: false, default: 'None',  desc: 'Resolve relative paths against this open directory (Unix). os.link has src_dir_fd and dst_dir_fd instead.' },
  ],

  patterns: [
    {
      name: 'Atomically switch a "current" link (Unix)',
      desc: 'Create the new link under a temporary name, then rename over the old one.',
      code: "import os\nos.symlink('releases/v2', 'current.tmp')\nos.replace('current.tmp', 'current')",
    },
    {
      name: 'Resolve a relative link target',
      desc: 'readlink returns the path as stored; a relative one is relative to the link folder.',
      code: "import os\ntarget = os.readlink(link)\nif not os.path.isabs(target):\n    target = os.path.join(os.path.dirname(link), target)",
    },
    {
      name: 'Symlink with a fallback on Windows',
      desc: 'Without the privilege, symlink raises OSError; fall back to a copy.',
      code: "import os\nimport shutil\ntry:\n    os.symlink(src, dst)\nexcept OSError:\n    shutil.copy2(src, dst)",
    },
  ],

  examples: [
    { title: 'A hard link is a second name',      code: "import os\nwith open('a.txt', 'w') as f:\n    f.write('hi')\nos.link('a.txt', 'b.txt')\n(os.stat('a.txt').st_nlink, os.path.samefile('a.txt', 'b.txt'))", returns: '(2, True)' },
    { title: 'Both names share the data',         code: "import os\nwith open('a.txt', 'w') as f:\n    f.write('hi')\nos.link('a.txt', 'b.txt')\nwith open('b.txt', 'a') as f:\n    f.write('!')\nopen('a.txt').read()", returns: "'hi!'" },
    { title: 'Removing one name keeps the data',  code: "import os\nwith open('a.txt', 'w') as f:\n    f.write('hi')\nos.link('a.txt', 'b.txt')\nos.remove('a.txt')\n(open('b.txt').read(), os.stat('b.txt').st_nlink)", returns: "('hi', 1)" },
    { title: 'A hard link is not a symlink',      code: "import os\nopen('a.txt', 'w').close()\nos.link('a.txt', 'b.txt')\nos.path.islink('b.txt')", returns: 'False' },
    { title: 'readlink on a regular file',        code: "import os\nopen('a.txt', 'w').close()\ntry:\n    os.readlink('a.txt')\nexcept OSError as e:\n    result = (type(e).__name__, e.errno)\nresult", returns: "('OSError', 22)" },
    { title: 'The new name must not exist',       code: "import os\nopen('a.txt', 'w').close()\nopen('b.txt', 'w').close()\ntry:\n    os.link('a.txt', 'b.txt')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileExistsError'" },
    { title: 'No hard links to directories',      code: "import os\nos.mkdir('d')\ntry:\n    os.link('d', 'd2')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'PermissionError'" },
  ],

  pitfalls: [
    {
      name: 'Swapping the arguments',
      desc: 'The first argument is the existing file, the second the new name - the same order as ln and cp.',
      wrong: { label: 'link(new, old)', code: "import os\nopen('old.txt', 'w').close()\ntry:\n    os.link('new.txt', 'old.txt')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'link(old, new)', code: "import os\nopen('old.txt', 'w').close()\nos.link('old.txt', 'new.txt')\nos.path.samefile('old.txt', 'new.txt')", output: 'True' },
    },
    {
      name: 'Using a relative readlink result against the cwd',
      desc: 'A relative target is relative to the folder that holds the link, not to the current directory. Shown with posixpath and a fixed link so it runs anywhere.',
      wrong: { label: 'target as is', code: "import posixpath\nlink, target = '/srv/app/current', 'releases/v2'\nposixpath.normpath(target)", output: "'releases/v2'" },
      fix:   { label: 'join with dirname', code: "import posixpath\nlink, target = '/srv/app/current', 'releases/v2'\nposixpath.normpath(posixpath.join(posixpath.dirname(link), target))", output: "'/srv/app/releases/v2'" },
    },
  ],

  when: {
    use: [
      'Deploy layouts ("current" pointing at a release), shortcuts to config files (symlink)',
      'Space-free snapshots and backups of files that do not change in place (link)',
      'Inspecting where a link points without following it (readlink)',
    ],
    avoid: [
      'Fully resolving chains of links → os.path.realpath / Path.resolve',
      'Portable code that must run unprivileged on Windows → copy instead of symlink',
      'Linking directories with link → hard links to directories are not allowed',
    ],
  },

  notes: {
    cpython:       'Wrappers over the symlink, link and readlink system calls on Unix and the Win32 link APIs on Windows (Modules/posixmodule.c)',
    'Availability': 'symlink, link, readlink: Unix, Windows. symlink is limited on WASI',
    'Windows symlinks': 'Need Developer Mode (3.8+ uses unprivileged creation) or the SeCreateSymbolicLinkPrivilege / administrator rights; otherwise OSError. A Windows symlink is either a file or a directory link: matched to the target when it exists, else chosen by target_is_directory',
    'Windows readlink': 'Since 3.8 also reads directory junctions and returns the substitution path, which typically starts with \\\\?\\',
    'Hard links':  'Work on NTFS and on Linux filesystems (verified on both); st_nlink counts the names. Hard links to a directory raise PermissionError on both',
  },

  related: [
    { name: 'Path.symlink_to', slug: 'symlink_to', when: 'The pathlib version', category: 'stdlib/pathlib' },
    { name: 'Path.resolve', slug: 'resolve', when: 'Follow every link to the real path', category: 'stdlib/pathlib' },
    { name: 'os.stat / lstat', slug: 'stat', when: 'st_nlink, and lstat to look at the link itself' },
    { name: 'os.path.samefile', slug: 'samefile', when: 'Are two names the same file?', category: 'stdlib/os-path' },
    { name: 'os.remove / unlink', slug: 'remove', when: 'Delete a link (not its target)' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: "Why does this page have no live demo?",
      a: "Creating symbolic links on Windows needs administrator rights or Developer Mode, and link behaviour depends on the file system, so a live result would depend on the machine. The examples only show outcomes that are the same on Linux and Windows.",
    },
    {
      q: 'How do I create a symbolic link in Python?',
      a: "os.symlink(target, link_name) - target first, like ln -s. For example os.symlink('releases/v2', 'current') creates current pointing to releases/v2. Path(link_name).symlink_to(target) does the same with pathlib.",
    },
    {
      q: 'Why does os.symlink fail on Windows?',
      a: 'Creating symlinks requires Developer Mode (Windows 10+) or the SeCreateSymbolicLinkPrivilege, usually meaning an administrator prompt. Without it OSError is raised. os.link (hard links) does not need it.',
    },
    {
      q: 'What is the difference between os.link and os.symlink?',
      a: 'link adds a second name for the same file data (both names are equal; deleting one keeps the data). symlink creates a small file that stores a path; it breaks if the target moves and can point to directories and other filesystems.',
    },
    {
      q: 'What does os.readlink return?',
      a: 'The target exactly as stored in the link - often relative. Join it with the link folder or use os.path.realpath to get an absolute path. On a regular file it raises OSError (errno 22, EINVAL).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.symlink',
    meta:  'os.symlink / link / readlink',
  },
};
