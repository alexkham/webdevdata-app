// content/reference/python/stdlib/shutil/samefileerror.js

export const meta = {
  slug:        'samefileerror',
  name:        'shutil.SameFileError',
  signature:   'shutil.SameFileError(*args)',
  blurb:       'Raised by copyfile — and so by copy, copy2, copytree and move’s fallback — when source and destination are the same file, before anything is overwritten.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'shutil samefileerror same file error are the same file copyfile copy onto itself source and destination same os.path.samefile hard link shutil.error subclass',
};

export const method = {
  slug:      'samefileerror',
  name:      'shutil.SameFileError',
  signature: 'shutil.SameFileError(*args)',

  category:    'shutil exception',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Opening dst for writing would truncate src to zero bytes if both are the same file, so copyfile checks first with os.path.samefile — by device and inode, not by name — and raises this instead. The message shows both arguments exactly as you passed them.',

  covers: ['SameFileError'],

  chain: ['BaseException', 'Exception', 'OSError', 'Error', 'SameFileError'],

  cheat: {
    raisedBy: "shutil.copyfile(src, dst), and copy / copy2 / copytree, which call it",
    message:  "'a.txt' and './a.txt' are the same file",
    quickFix: 'Skip the copy when os.path.samefile(src, dst), or except shutil.SameFileError: pass',
    watchOut: 'Hard links and different spellings of one path count as the same file',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'copyfile passes one message: "{src!r} and {dst!r} are the same file".' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'a.txt exists. Copy it with copyfile, uncaught: either the destination path comes back, or the traceback’s last line.',
      params: [
        { name: 'src', type: 'str', hint: 'source', input: 'text' },
        { name: 'dst', type: 'str', hint: 'destination', input: 'text' },
      ],
      template: "import shutil\nwith open('a.txt', 'w') as f:\n    f.write('data')\nshutil.copyfile({$src}, {$dst})",
      cases: [
        { id: 'same',  label: 'same name',     values: { src: 'a.txt', dst: 'a.txt' } },
        { id: 'dot',   label: './a.txt',       values: { src: 'a.txt', dst: './a.txt' } },
        { id: 'other', label: 'another file',  values: { src: 'a.txt', dst: 'b.txt' } },
      ],
    },
    {
      id: 'catch',
      label: 'Handle',
      blurb: 'Catch it as shutil.Error or OSError — it is both.',
      params: [{ name: 'dst', type: 'str', hint: 'destination for a.txt', input: 'text' }],
      template: "import shutil\nopen('a.txt', 'w').close()\ntry:\n    shutil.copyfile('a.txt', {$dst})\n    result = 'copied'\nexcept shutil.Error as e:\n    result = (type(e).__name__, isinstance(e, OSError))\nresult",
      cases: [
        { id: 'same',  label: 'same file', values: { dst: 'a.txt' } },
        { id: 'other', label: 'other',     values: { dst: 'copy.txt' } },
      ],
    },
  ],
  demoExplainer: "'./a.txt' is a different string but the same file, so it is refused just like 'a.txt'; the message keeps your spelling. Any other name is simply copied and returned. In the second tab the exception is caught as shutil.Error — its base class — and is also an OSError.",

  patterns: [
    {
      name: 'Copy unless it is the same file',
      desc: 'Common in "install into place" scripts that may already run from the target.',
      code: "import shutil\ntry:\n    shutil.copy2(src, dst)\nexcept shutil.SameFileError:\n    pass  # already in place",
    },
    {
      name: 'Check up front',
      desc: 'os.path.samefile compares device and inode; it needs both paths to exist.',
      code: "import os, shutil\nif not (os.path.exists(dst) and os.path.samefile(src, dst)):\n    shutil.copyfile(src, dst)",
    },
  ],

  examples: [
    { title: 'Copy a file onto itself', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.copyfile('a.txt', 'a.txt')", returns: "shutil.SameFileError: 'a.txt' and 'a.txt' are the same file" },
    { title: 'Different spelling, same file', code: "import os, shutil\nos.mkdir('d')\nopen('d/a.txt', 'w').close()\nshutil.copyfile('d/a.txt', 'd/../d/a.txt')", returns: "shutil.SameFileError: 'd/a.txt' and 'd/../d/a.txt' are the same file" },
    { title: 'The data survives', code: "import shutil\nfrom pathlib import Path\nPath('a.txt').write_text('keep me')\ntry:\n    shutil.copyfile('a.txt', 'a.txt')\nexcept shutil.SameFileError:\n    pass\nPath('a.txt').read_text()", returns: "'keep me'" },
    { title: 'Hard links are the same file', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.link('a.txt', 'b.txt')\ntry:\n    shutil.copyfile('a.txt', 'b.txt')\nexcept shutil.SameFileError:\n    result = 'refused'\nresult", returns: "'refused'" },
    { title: 'Its place in the hierarchy', code: 'import shutil\n[c.__name__ for c in shutil.SameFileError.__mro__]', returns: "['SameFileError', 'Error', 'OSError', 'Exception', 'BaseException', 'object']" },
  ],

  pitfalls: [
    {
      name: 'Expecting the copy to be skipped silently',
      desc: 'Copying a file onto itself is an error, not a no-op. Decide explicitly — catch it or check samefile first.',
      wrong: { label: 'plain copyfile', code: "import shutil\nopen('config.ini', 'w').close()\nshutil.copyfile('config.ini', './config.ini')", output: "shutil.SameFileError: 'config.ini' and './config.ini' are the same file" },
      fix:   { label: 'except SameFileError', code: "import shutil\nopen('config.ini', 'w').close()\ntry:\n    shutil.copyfile('config.ini', './config.ini')\nexcept shutil.SameFileError:\n    status = 'already in place'\nstatus", output: "'already in place'" },
    },
    {
      name: 'Comparing path strings instead of files',
      desc: 'String equality misses ./a.txt, ../dir/a.txt, symlinks and hard links. Ask the file system with os.path.samefile.',
      wrong: { label: "src == dst", code: "src, dst = 'a.txt', './a.txt'\nopen(src, 'w').close()\nsrc == dst", output: 'False' },
      fix:   { label: 'os.path.samefile', code: "import os\nsrc, dst = 'a.txt', './a.txt'\nopen(src, 'w').close()\nos.path.samefile(src, dst)", output: 'True' },
    },
  ],

  when: {
    use: [
      'except shutil.SameFileError in install/deploy scripts that may copy a file onto itself',
    ],
    avoid: [
      'Catching every copy failure → except OSError',
    ],
  },

  notes: {
    cpython:       'Lib/shutil.py: class SameFileError(Error); copyfile: if _samefile(src, dst): raise SameFileError("{!r} and {!r} are the same file".format(src, dst))',
    'Added':       'Python 3.4 — earlier versions raised plain shutil.Error, which still catches it',
    'Windows':     'copy2(f, f) on Windows (3.12+) calls CopyFile2 before this check and fails with PermissionError [WinError 32] instead; copytree inherits that',
    'DirEntry':    `Inside copytree the source is an os.DirEntry, so the message reads "<DirEntry 'a.txt'> and 'src/a.txt' are the same file"`,
  },

  related: [
    { name: 'shutil.Error',    slug: 'error',    when: 'Its base class' },
    { name: 'shutil.copyfile', slug: 'copyfile', when: 'Where it is raised' },
    { name: 'os.path.samefile', slug: 'samefile', when: 'The check behind it', category: 'stdlib/os-path' },
    { name: 'OSError',         slug: 'oserror',  when: 'Catches it too', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "shutil.SameFileError: … are the same file" mean?',
      a: 'Source and destination resolve to the same file — the same name, another spelling of it (./a.txt, dir/../a.txt), a symlink to it or a hard link. Copying would destroy the data, so shutil refuses. Pick a different destination or skip the copy.',
    },
    {
      q: 'How do I ignore SameFileError?',
      a: 'try: shutil.copy(src, dst) except shutil.SameFileError: pass. Catch only this class, not OSError, so real failures still surface.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.SameFileError',
    meta:  'shutil.SameFileError',
  },
};
