// content/reference/python/stdlib/pathlib/symlink_to.js

export const meta = {
  slug:        'symlink_to',
  name:        'Path.symlink_to',
  signature:   'Path.symlink_to(target, target_is_directory=False) / .hardlink_to(target) / .readlink()',
  blurb:       'Make this path a symbolic link (symlink_to) or a hard link (hardlink_to) to target, and read where a symlink points (readlink).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: false,
  version:     'Python 3.4+ (readlink 3.9+, hardlink_to 3.10+)',
  searchTerms: 'Path.symlink_to symlink_to hardlink_to readlink Path.hardlink_to Path.readlink create symlink python pathlib hard link symbolic link read link target os.symlink argument order windows developer mode',
};

export const method = {
  slug:      'symlink_to',
  name:      'Path.symlink_to',
  signature: 'Path.symlink_to(target, target_is_directory=False) / .hardlink_to(target) / .readlink()',
  returns:   { type: 'None | Path', desc: 'symlink_to / hardlink_to return None; readlink returns the stored target as a Path.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (readlink 3.9+, hardlink_to 3.10+)',
  hasLiveDemo: false,

  subtitle: "The path you call it on is the LINK; the argument is what it points to — the reverse of os.symlink(src, dst). Creating symlinks on Windows needs Developer Mode or admin rights, so this page shows hard links in its runnable examples.",

  covers: ['Path.symlink_to', 'Path.hardlink_to', 'Path.readlink'],

  cheat: {
    commonCall: "Path('current').symlink_to('releases/v2')",
    returns:    'None (readlink: the target Path)',
    replaces:   'os.symlink(target, link) / os.link / os.readlink',
    watchOut:   'argument order is link.symlink_to(target)',
  },

  parameters: [
    { name: 'target',              type: 'str | os.PathLike', required: true,  default: null,    desc: 'What the link points to. For symlinks it is stored as given — a relative target is relative to the link\'s folder, not the cwd.' },
    { name: 'target_is_directory', type: 'bool',              required: false, default: 'False', desc: 'symlink_to only: must be True on Windows when target is a folder; ignored elsewhere.' },
  ],

  patterns: [
    {
      name: '"current" release pointer',
      desc: 'Point a stable name at a versioned folder.',
      code: "from pathlib import Path\nlink = Path('current')\nlink.unlink(missing_ok=True)\nlink.symlink_to('releases/v2', target_is_directory=True)",
    },
    {
      name: 'Where does this link point?',
      desc: 'readlink gives the stored target; resolve() gives the final absolute path.',
      code: "from pathlib import Path\nlink = Path('/usr/bin/python3')\nif link.is_symlink():\n    print(link.readlink(), link.resolve())",
    },
    {
      name: 'Deduplicate with hard links',
      desc: 'Both names share the same data on disk.',
      code: "from pathlib import Path\nPath('copy.iso').hardlink_to('original.iso')",
    },
  ],

  examples: [
    { title: 'A hard link shares the content',  code: "from pathlib import Path\nPath('orig.txt').write_text('shared', encoding='utf-8')\nPath('link.txt').hardlink_to('orig.txt')\nPath('link.txt').read_text(encoding='utf-8')", returns: "'shared'" },
    { title: 'It is the same file',             code: "from pathlib import Path\nPath('orig.txt').touch()\nPath('link.txt').hardlink_to('orig.txt')\nPath('link.txt').samefile('orig.txt')", returns: 'True' },
    { title: 'Link count goes up',              code: "from pathlib import Path\nPath('orig.txt').touch()\nPath('link.txt').hardlink_to('orig.txt')\nPath('orig.txt').stat().st_nlink", returns: '2' },
    { title: 'A hard link is not a symlink',    code: "from pathlib import Path\nPath('orig.txt').touch()\nPath('link.txt').hardlink_to('orig.txt')\nPath('link.txt').is_symlink()", returns: 'False' },
    { title: 'The link name must be free',      code: "from pathlib import Path\nPath('a').touch()\nPath('b').touch()\ntry:\n    Path('b').hardlink_to('a')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileExistsError'" },
  ],

  pitfalls: [
    {
      name: 'Swapping link and target',
      desc: 'os.symlink(src, dst) and Path.symlink_to use opposite orders: the Path is the new link. The same holds for hardlink_to — swapped, it looks for a target that does not exist.',
      wrong: { label: 'target.hardlink_to(link)', code: "from pathlib import Path\nPath('data.txt').touch()\ntry:\n    Path('data.txt').hardlink_to('backup.txt')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'link.hardlink_to(target)', code: "from pathlib import Path\nPath('data.txt').touch()\nPath('backup.txt').hardlink_to('data.txt')\nPath('backup.txt').exists()", output: 'True' },
    },
    {
      name: 'Relative symlink targets',
      desc: "A symlink stores its target text as-is, and the OS interprets a relative target from the link's own folder. Build the target relative to the link, not to the cwd.",
      wrong: { label: 'relative to cwd', code: "from pathlib import PurePosixPath\nlink = PurePosixPath('links/app.log')\ntarget = PurePosixPath('logs/app.log')\n(link.parent / target).as_posix()", output: "'links/logs/app.log'" },
      fix:   { label: 'relative to the link', code: "from pathlib import PurePosixPath\nlink = PurePosixPath('links/app.log')\ntarget = PurePosixPath('logs/app.log')\nrel = target.relative_to(link.parent, walk_up=True)\n(rel.as_posix(), (link.parent / rel).as_posix())", output: "('../logs/app.log', 'links/../logs/app.log')" },
    },
  ],

  when: {
    use: [
      'Stable names pointing at versioned files or folders (symlink_to)',
      'Saving space for identical files on one file system (hardlink_to)',
      'Inspecting link targets (readlink)',
    ],
    avoid: [
      'Copying content → shutil.copy2',
      'Hard links across file systems or to folders → not possible; use a symlink',
    ],
  },

  notes: {
    cpython:          'Lib/pathlib/_local.py: symlink_to = os.symlink(target, self, target_is_directory); hardlink_to = os.link(target, self); readlink = with_segments(os.readlink(self)); each is only defined when os has the function, else UnsupportedOperation',
    'Windows':        'Creating symlinks needs Developer Mode or the SeCreateSymbolicLinkPrivilege (usually admin); hard links work on NTFS without it',
    'Changed in 3.13': 'Missing OS support raises UnsupportedOperation instead of NotImplementedError',
    'link_to':        'The old Path.link_to (with the reversed argument order) was removed in 3.12; use hardlink_to',
  },

  related: [
    { name: 'exists / is_symlink', slug: 'exists',  when: 'Detect links and broken links' },
    { name: 'resolve',             slug: 'resolve', when: 'Follow links to the final path' },
    { name: 'stat / samefile',     slug: 'stat',    when: 'Link counts and identity' },
    { name: 'UnsupportedOperation', slug: 'unsupportedoperation', when: 'Raised where links are unavailable' },
  ],

  faq: [
    {
      q: 'How do I create a symlink in Python?',
      a: "Path('link_name').symlink_to('target'). The Path is the link, the argument is what it points to. On Windows pass target_is_directory=True for folders and enable Developer Mode.",
    },
    {
      q: 'How do I read where a symlink points?',
      a: 'link.readlink() (3.9+) returns the stored target; link.resolve() follows every link and returns the final absolute path.',
    },
    {
      q: 'What is the difference between symlink_to and hardlink_to?',
      a: 'A symlink is a small file containing a path; it can point to folders, other drives, or nothing. A hard link is a second name for the same data on the same file system; deleting one name leaves the other intact.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.symlink_to',
    meta:  'Path.symlink_to / hardlink_to / readlink',
  },
};
