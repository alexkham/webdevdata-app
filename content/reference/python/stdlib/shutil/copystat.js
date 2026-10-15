// content/reference/python/stdlib/shutil/copystat.js

export const meta = {
  slug:        'copystat',
  name:        'shutil.copystat',
  signature:   'shutil.copystat(src, dst, *, follow_symlinks=True) / shutil.copymode(src, dst, *, follow_symlinks=True)',
  blurb:       'Copy metadata — not data — from one existing path to another: copymode copies the permission bits, copystat the permission bits, access and modification times, flags and extended attributes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil copystat copymode copy permissions copy timestamps python copy file metadata mode bits chmod utime mtime atime extended attributes xattr follow_symlinks',
};

export const method = {
  slug:      'copystat',
  name:      'shutil.copystat',
  signature: 'shutil.copystat(src, dst, *, follow_symlinks=True) / shutil.copymode(src, dst, *, follow_symlinks=True)',
  returns:   { type: 'None', desc: 'Both change dst in place and return nothing.' },

  category:    'shutil function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The metadata halves of copy and copy2. Both leave the contents of dst alone, and dst must already exist. copymode is stat + chmod; copystat is stat + utime + (on Linux) xattrs + chmod (+ chflags where the OS has it).',

  covers: ['copymode', 'copystat'],

  cheat: {
    commonCall: "shutil.copystat('template.txt', 'generated.txt')",
    returns:    'None',
    replaces:   'os.chmod(dst, stat.S_IMODE(os.stat(src).st_mode)) and os.utime(dst, …) by hand',
    watchOut:   'dst must exist — these never create files',
  },

  parameters: [
    { name: 'src',             type: 'str | PathLike', required: true,  default: null,   desc: 'Where the metadata comes from (file or folder).' },
    { name: 'dst',             type: 'str | PathLike', required: true,  default: null,   desc: 'Where it goes. Must exist; its contents are not touched.' },
    { name: 'follow_symlinks', type: 'bool',           required: false, default: 'True', desc: 'False and both are symlinks: change the links themselves where the OS supports it (silently skipped where it does not).' },
  ],

  modes: [
    {
      id: 'meta',
      label: 'copymode vs copystat',
      blurb: 'src.txt is read-only with a 2001 timestamp. Each function copies onto a file that you fill: (function, content afterwards, still writable?, mtime copied?).',
      params: [{ name: 'text', type: 'str', hint: 'content of the destination files', input: 'text' }],
      template: "import os, shutil, stat\nwith open('src.txt', 'w') as f:\n    f.write('source')\nos.utime('src.txt', (1000000000, 1000000000))\nos.chmod('src.txt', stat.S_IREAD)\nrows = []\nfor fn in (shutil.copymode, shutil.copystat):\n    dst = fn.__name__ + '.txt'\n    with open(dst, 'w') as f:\n        f.write({$text})\n    fn('src.txt', dst)\n    st = os.stat(dst)\n    with open(dst) as f:\n        rows.append((fn.__name__, f.read(), bool(st.st_mode & stat.S_IWRITE), st.st_mtime == 1000000000))\nrows",
      cases: [
        { id: 'text',  label: 'some text', values: { text: 'my own content' } },
        { id: 'empty', label: 'empty',     values: { text: '' } },
      ],
    },
    {
      id: 'missing',
      label: 'dst must exist',
      blurb: 'Create some files, then copystat from one path to another — or see which OSError you get.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'metadata source',                  input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'metadata target',                  input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    shutil.copystat({$src}, {$dst})\n    result = 'copied'\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'ok',     label: 'both exist',    values: { files: 'a.txt, b.txt', src: 'a.txt', dst: 'b.txt' } },
        { id: 'nodst',  label: 'missing dst',   values: { files: 'a.txt', src: 'a.txt', dst: 'new.txt' } },
        { id: 'nosrc',  label: 'missing src',   values: { files: 'b.txt', src: 'a.txt', dst: 'b.txt' } },
      ],
    },
  ],
  demoExplainer: 'Your text survives in both files: neither function touches contents. Both copied the read-only bit; only copystat also copied the 2001 modification time. In the second tab a missing dst is a FileNotFoundError — on Linux its message has no file name at all, because os.utime reports errors without one.',

  patterns: [
    {
      name: 'Give a generated file the template’s permissions',
      desc: 'Write the new content, then copy the mode bits.',
      code: "import shutil\nwith open('run.sh', 'w') as f:\n    f.write(script)\nshutil.copymode('run.template.sh', 'run.sh')",
    },
    {
      name: 'Restore timestamps after rewriting a file',
      desc: 'Keep the original mtime by copying it from a backup.',
      code: "import shutil\nshutil.copy2('data.csv', 'data.csv.orig')\nrewrite('data.csv')\nshutil.copystat('data.csv.orig', 'data.csv')",
    },
    {
      name: 'Folders too',
      desc: 'copytree calls copystat on every folder after filling it.',
      code: "import shutil\nshutil.copystat('src_dir', 'dst_dir')",
    },
  ],

  examples: [
    { title: 'copymode copies the read-only bit', code: "import os, shutil, stat\nopen('a.txt', 'w').close()\nopen('b.txt', 'w').close()\nos.chmod('a.txt', stat.S_IREAD)\nshutil.copymode('a.txt', 'b.txt')\nbool(os.stat('b.txt').st_mode & stat.S_IWRITE)", returns: 'False' },
    { title: 'copystat copies the modification time', code: "import os, shutil\nopen('a.txt', 'w').close()\nopen('b.txt', 'w').close()\nos.utime('a.txt', (1000000000, 1000000000))\nshutil.copystat('a.txt', 'b.txt')\nos.path.getmtime('b.txt')", returns: '1000000000.0' },
    { title: 'copymode leaves the time alone', code: "import os, shutil\nopen('a.txt', 'w').close()\nopen('b.txt', 'w').close()\nos.utime('a.txt', (1000000000, 1000000000))\nshutil.copymode('a.txt', 'b.txt')\nos.path.getmtime('b.txt') == 1000000000", returns: 'False' },
    { title: 'Contents are never touched', code: "import shutil\nfrom pathlib import Path\nPath('a.txt').write_text('aaa')\nPath('b.txt').write_text('bbb')\nshutil.copystat('a.txt', 'b.txt')\nPath('b.txt').read_text()", returns: "'bbb'" },
    { title: 'Both return None', code: "import shutil\nopen('a.txt', 'w').close()\nopen('b.txt', 'w').close()\n(shutil.copymode('a.txt', 'b.txt'), shutil.copystat('a.txt', 'b.txt'))", returns: '(None, None)' },
    { title: 'A missing source names itself', code: "import shutil\nopen('b.txt', 'w').close()\ntry:\n    shutil.copymode('missing.txt', 'b.txt')\nexcept FileNotFoundError as e:\n    result = e.filename\nresult", returns: "'missing.txt'" },
  ],

  pitfalls: [
    {
      name: 'Expecting copystat to create the destination',
      desc: 'copystat copies metadata onto an existing path. To create a copy with metadata, use copy2 (which is copyfile + copystat).',
      wrong: { label: 'copystat to a new name', code: "import shutil\nopen('a.txt', 'w').close()\ntry:\n    shutil.copystat('a.txt', 'new.txt')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'copy2', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.copy2('a.txt', 'new.txt')", output: "'new.txt'" },
    },
    {
      name: 'Copying a read-only mode before writing the file',
      desc: 'Once dst is read-only you cannot open it for writing any more (as a normal user). Write first, copy the mode last.',
      wrong: { label: 'copymode, then write', code: "import os, shutil, stat\nopen('tpl.txt', 'w').close()\nos.chmod('tpl.txt', stat.S_IREAD)\nopen('out.txt', 'w').close()\nshutil.copymode('tpl.txt', 'out.txt')\ntry:\n    with open('out.txt', 'w') as f:\n        f.write('data')\n    result = 'written'\nexcept PermissionError:\n    result = 'PermissionError'\nresult", output: "'PermissionError'" },
      fix:   { label: 'write, then copymode', code: "import os, shutil, stat\nopen('tpl.txt', 'w').close()\nos.chmod('tpl.txt', stat.S_IREAD)\nwith open('out.txt', 'w') as f:\n    f.write('data')\nshutil.copymode('tpl.txt', 'out.txt')\nopen('out.txt').read()", output: "'data'" },
    },
  ],

  when: {
    use: [
      'A file was written by your code and should get another file’s permissions or times',
      'Restoring metadata after editing a file in place',
    ],
    avoid: [
      'Creating a copy → copy (data + mode) or copy2 (data + all metadata)',
      'Setting specific values → os.chmod / os.utime directly',
    ],
  },

  notes: {
    cpython:       'Lib/shutil.py: copymode = chmod(dst, stat.S_IMODE(stat(src).st_mode)); copystat = utime(dst, ns=…), _copyxattr, chmod, chflags',
    'Order':       'copystat copies extended attributes before chmod, so a read-only mode cannot block setxattr',
    'Windows':     'The only mode bit is the read-only flag; there are no xattrs or chflags',
  },

  related: [
    { name: 'shutil.copy',  slug: 'copy',  when: 'copyfile + copymode' },
    { name: 'shutil.copy2', slug: 'copy2', when: 'copyfile + copystat' },
    { name: 'os.chmod',     slug: 'chmod', when: 'Set mode bits directly', category: 'stdlib/os' },
    { name: 'os.stat / os.utime', slug: 'stat', when: 'Read and set the times yourself', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I copy file permissions in Python?',
      a: "shutil.copymode('src', 'dst') copies the permission bits (on Windows: the read-only flag). shutil.copystat copies them plus the access and modification times. Neither touches the contents or the owner.",
    },
    {
      q: 'Does copystat copy the owner and group?',
      a: 'No. The documentation says the file contents, owner and group are unaffected. Use shutil.chown or os.chown for ownership (Unix only, usually needs privileges).',
    },
    {
      q: 'What does follow_symlinks=False do in copystat?',
      a: 'If both src and dst are symbolic links, copystat reads and changes the links themselves rather than their targets — as far as the OS supports it. Where it does not (lchmod is missing on Linux), copystat copies what it can and never fails because of it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.copystat',
    meta:  'shutil.copystat / shutil.copymode',
  },

};
