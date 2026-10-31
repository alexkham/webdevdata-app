// content/reference/python/stdlib/tempfile/index.js — the tempfile module hub

export const meta = {
  slug:        'index',
  name:        'tempfile',
  signature:   'import tempfile',
  blurb:       'Create temporary files and directories safely — with unique random names, private permissions, and automatic cleanup when used with a with block.',
  category:    'files',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'tempfile module python temporary file temporary directory temp folder TemporaryFile NamedTemporaryFile SpooledTemporaryFile TemporaryDirectory mkstemp mkdtemp mktemp gettempdir delete_on_close cleanup tmp',
};

export const method = {
  slug: 'index',
  name: 'tempfile',

  category:    'Files and directories',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Four context managers do almost all the work: TemporaryFile and NamedTemporaryFile for files, SpooledTemporaryFile for data that may stay in memory, TemporaryDirectory for whole folders — each removed when its with block ends. mkstemp and mkdtemp are the low-level versions you clean up yourself.',

  imports: ['import tempfile', 'from tempfile import NamedTemporaryFile, TemporaryDirectory'],
  facts: [
    { label: 'Names',       value: "prefix + 8 random characters from a–z, 0–9 and _ + suffix; the default prefix is 'tmp'" },
    { label: 'Location',    value: 'gettempdir(): TMPDIR, TEMP or TMP if set, otherwise a platform default such as /tmp — pass dir= to choose' },
    { label: 'Safety',      value: 'Files are created with O_EXCL and mode 0o600, so no other user can open or pre-create them' },
    { label: 'Deprecated',  value: 'mktemp() only returns a name — another process can take it first; use mkstemp() or NamedTemporaryFile(delete=False)' },
  ],

  modes: [
    {
      id: 'scratch',
      label: 'scratch folder',
      blurb: 'Create files inside a TemporaryDirectory, list them, and check the folder after the with block.',
      params: [{ name: 'files', type: 'list[str]', hint: 'file names, comma-separated', input: 'csv' }],
      template: "import os, tempfile\nwith tempfile.TemporaryDirectory(dir='.') as d:\n    for name in {$files}:\n        with open(os.path.join(d, name), 'w') as f:\n            f.write('data')\n    inside = sorted(os.listdir(d))\n(inside, os.path.exists(d))",
      cases: [
        { id: 'three', label: 'three files', values: { files: 'report.csv, chart.png, notes.txt' } },
        { id: 'dupe',  label: 'same name twice', values: { files: 'a.txt, a.txt' } },
        { id: 'none',  label: 'nothing',     values: { files: '' } },
      ],
    },
    {
      id: 'spool',
      label: 'memory, then disk',
      blurb: 'SpooledTemporaryFile keeps data in a BytesIO until it grows past max_size, then moves it to a real temporary file.',
      params: [
        { name: 'max_size', type: 'int',       hint: 'max_size in bytes (0 = never roll over)', input: 'number' },
        { name: 'chunks',   type: 'list[str]', hint: 'chunks to write, comma-separated',        input: 'csv' },
      ],
      template: "import io, tempfile\nwith tempfile.SpooledTemporaryFile(max_size={$max_size}, dir='.') as f:\n    in_memory = []\n    for chunk in {$chunks}:\n        f.write(chunk.encode())\n        in_memory.append(isinstance(f._file, io.BytesIO))\n    f.seek(0)\n    data = f.read()\n(in_memory, data)",
      cases: [
        { id: 'roll', label: 'rolls over',   values: { max_size: '8', chunks: 'abcd, efgh, ijkl' } },
        { id: 'zero', label: 'max_size=0',   values: { max_size: '0', chunks: 'abcd, efgh, ijkl' } },
        { id: 'edge', label: 'exactly max',  values: { max_size: '4', chunks: 'abcd, e' } },
      ],
    },
    {
      id: 'names',
      label: 'name anatomy',
      blurb: 'A NamedTemporaryFile with your prefix and suffix: what its file name is made of, and whether it still exists after the with block.',
      params: [
        { name: 'prefix', type: 'str', hint: 'prefix', input: 'text' },
        { name: 'suffix', type: 'str', hint: 'suffix', input: 'text' },
      ],
      template: "import os, tempfile\nwith tempfile.NamedTemporaryFile(prefix={$prefix}, suffix={$suffix}, dir='.') as f:\n    name = os.path.basename(f.name)\n    shape = (name.startswith({$prefix}), name.endswith({$suffix}), len(name) - len({$prefix}) - len({$suffix}))\n(shape, os.path.exists(f.name))",
      cases: [
        { id: 'csv',   label: 'report- / .csv', values: { prefix: 'report-', suffix: '.csv' } },
        { id: 'plain', label: 'no suffix',     values: { prefix: 'tmp', suffix: '' } },
      ],
    },
  ],
  demoExplainer: "The folder held exactly the files written to it and is gone after the block, contents and all; writing a.txt twice still makes one file. With max_size=8 the third write pushes the size to 12 and the data moves to disk — the earlier contents move with it, so read() still returns everything. A size equal to max_size does not roll over: it has to exceed it. max_size=0 never rolls over. Every temporary name is prefix + 8 random characters + suffix. The demos pass dir='.' to keep files in the working folder; without dir= they go to gettempdir().",

  patterns: [
    {
      name: 'A scratch folder for a job',
      desc: 'Everything inside is deleted at the end of the block, even after an exception.',
      code: "import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as tmp:\n    work = Path(tmp)\n    (work / 'input.txt').write_text(data, encoding='utf-8')\n    run_tool(work)",
    },
    {
      name: 'Write a file, then hand its name to another program',
      desc: 'delete_on_close=False (3.12+) keeps the file until the with block ends, so it can be closed and reopened by name on every OS.',
      code: "import subprocess, tempfile\nwith tempfile.NamedTemporaryFile('w', suffix='.json', delete_on_close=False, encoding='utf-8') as f:\n    f.write(payload)\n    f.close()\n    subprocess.run(['tool', f.name], check=True)",
    },
    {
      name: 'Replace a file atomically',
      desc: 'Write to a temporary file in the same folder, then os.replace it over the target.',
      code: "import os, tempfile\nfd, tmp_path = tempfile.mkstemp(dir=os.path.dirname(target) or '.', suffix='.tmp')\nwith os.fdopen(fd, 'w', encoding='utf-8') as f:\n    f.write(new_text)\nos.replace(tmp_path, target)",
    },
  ],

  examples: [
    { title: 'A file that removes itself',     code: "import tempfile\nwith tempfile.TemporaryFile(dir='.') as f:\n    f.write(b'Hello world!')\n    f.seek(0)\n    data = f.read()\ndata", returns: "b'Hello world!'" },
    { title: 'Close, reopen by name (3.12+)',  code: "import tempfile\nwith tempfile.NamedTemporaryFile(dir='.', delete_on_close=False) as fp:\n    fp.write(b'Hello world!')\n    fp.close()\n    with open(fp.name, 'rb') as f:\n        data = f.read()\ndata", returns: "b'Hello world!'" },
    { title: 'The folder is gone afterwards',  code: "import os, tempfile\nwith tempfile.TemporaryDirectory(dir='.') as d:\n    inside = os.path.isdir(d)\n(inside, os.path.exists(d))", returns: '(True, False)' },
    { title: 'mkstemp: you clean up',          code: "import os, tempfile\nfd, path = tempfile.mkstemp(suffix='.txt', dir='.')\nos.write(fd, b'x')\nos.close(fd)\nresult = (path.endswith('.txt'), os.path.isabs(path), os.path.getsize(path))\nos.remove(path)\nresult", returns: '(True, True, 1)' },
    { title: 'The default prefix',             code: 'import tempfile\ntempfile.gettempprefix()', returns: "'tmp'" },
    { title: 'gettempdir() is absolute',       code: 'import os, tempfile\nos.path.isabs(tempfile.gettempdir())', returns: 'True' },
    { title: 'str and bytes do not mix',       code: "import tempfile\ntempfile.mkstemp(prefix='a', suffix=b'b', dir='.')", returns: "TypeError: Can't mix bytes and non-bytes in path components." },
  ],

  pitfalls: [
    {
      name: 'Using the name after the with block',
      desc: 'NamedTemporaryFile deletes the file when it closes. Pass delete=False to keep it — and remove it yourself.',
      wrong: { label: 'default',      code: "import os, tempfile\nwith tempfile.NamedTemporaryFile(suffix='.csv', dir='.') as f:\n    f.write(b'a,b\\n')\n    name = f.name\nos.path.exists(name)", output: 'False' },
      fix:   { label: 'delete=False', code: "import os, tempfile\nwith tempfile.NamedTemporaryFile(suffix='.csv', dir='.', delete=False) as f:\n    f.write(b'a,b\\n')\n    name = f.name\nkept = os.path.exists(name)\nos.remove(name)\nkept", output: 'True' },
    },
    {
      name: 'Forgetting to clean up after mkstemp',
      desc: 'mkstemp and mkdtemp create the file or folder and leave it there. Wrap them in try/finally, or use the context-manager classes.',
      wrong: { label: 'mkstemp only',   code: "import os, tempfile\nfd, path = tempfile.mkstemp(dir='.')\nos.close(fd)\nleft_behind = os.path.exists(path)\nos.remove(path)\nleft_behind", output: 'True' },
      fix:   { label: 'TemporaryFile',  code: "import tempfile\nwith tempfile.TemporaryFile(dir='.') as f:\n    f.write(b'scratch')\nf.closed", output: 'True' },
    },
  ],

  when: {
    use: [
      'Intermediate files for tools, tests and builds',
      'Data too large to keep in memory (SpooledTemporaryFile picks for you)',
      'A private scratch folder that must disappear afterwards',
      'Atomic file replacement (mkstemp in the target folder + os.replace)',
    ],
    avoid: [
      'Data that fits in memory and never needs a real file → io.BytesIO / io.StringIO',
      'Files that must survive the program → a normal path (delete=False only when you clean up yourself)',
      'mktemp() → mkstemp() or NamedTemporaryFile',
    ],
  },

  notes: {
    cpython:          'Lib/tempfile.py — pure Python over os.open (O_EXCL | O_CREAT, mode 0o600), os.mkdir(mode 0o700) and shutil.rmtree',
    'Platforms':      'On Linux TemporaryFile uses O_TMPFILE where it works, so the file never has a name; on Windows TemporaryFile is NamedTemporaryFile, and a NamedTemporaryFile with delete=True and delete_on_close=True cannot be opened a second time by name while it is open (PermissionError)',
    'Text mode':      "mode='w+' and friends use the locale encoding unless you pass encoding= — pass encoding='utf-8' for portable text",
    'Global state':   'tempfile.tempdir caches the chosen directory for the whole process; prefer the dir= argument to changing it',
  },

  history: [
    { version: '3.2',  note: 'TemporaryDirectory' },
    { version: '3.5',  note: 'bytes prefix / suffix / dir give bytes names; gettempdirb() and gettempprefixb(); TemporaryFile uses O_TMPFILE on Linux' },
    { version: '3.8',  note: 'errors= parameter for the file classes' },
    { version: '3.10', note: 'TemporaryDirectory(ignore_cleanup_errors=); gettempdir() always returns str' },
    { version: '3.12', note: 'NamedTemporaryFile(delete_on_close=); TemporaryDirectory(delete=); mkdtemp() always returns an absolute path' },
  ],

  related: [
    { name: 'io module',  slug: 'io',      when: 'BytesIO / StringIO when no real file is needed', category: 'stdlib' },
    { name: 'os module',  slug: 'os',      when: 'os.replace, os.remove and file descriptors', category: 'stdlib' },
    { name: 'shutil',     slug: 'shutil',  when: 'rmtree — what TemporaryDirectory uses to clean up', category: 'stdlib' },
    { name: 'pathlib',    slug: 'pathlib', when: 'Path(tmpdir) / "file.txt"', category: 'stdlib' },
    { name: 'with',       slug: 'with',    when: 'Every class here is a context manager', category: 'keywords' },
  ],

  faq: [
    {
      q: 'Why do the tempfile demos not show file names or paths?',
      a: 'Because they are different on every run and every machine: the 8-character part is random and gettempdir() depends on the OS and environment variables. The demos show what is always true instead — the prefix and suffix you chose, the 8 random characters, whether the file exists — and pass dir=\'.\' so nothing lands outside the working folder.',
    },
    {
      q: 'How do I create a temporary file in Python?',
      a: "with tempfile.TemporaryFile() as f: gives an anonymous file that is deleted when closed. If another program needs the path, use NamedTemporaryFile (with delete_on_close=False on 3.12+ so you can close and reopen it); for a folder use TemporaryDirectory.",
    },
    {
      q: 'Where are temporary files stored?',
      a: 'In tempfile.gettempdir(): the first usable directory from the TMPDIR, TEMP and TMP environment variables, then platform defaults (/tmp, /var/tmp, /usr/tmp on Unix; the user temp folder and C:\\TEMP style folders on Windows), and finally the current directory. Any function accepts dir= to override it.',
    },
    {
      q: 'Why is tempfile.mktemp deprecated?',
      a: 'It returns a name that did not exist when it was checked, but does not create the file. Another process can create a file with that name in between, which is a security hole. mkstemp() and NamedTemporaryFile create the file atomically instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html',
    meta:  'tempfile — Generate temporary files and directories',
  },

};
