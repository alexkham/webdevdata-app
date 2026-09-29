// content/reference/python/stdlib/pathlib/open.js

export const meta = {
  slug:        'open',
  name:        'Path.open',
  signature:   "Path.open(mode='r', buffering=-1, encoding=None, errors=None, newline=None)",
  blurb:       'Open the file at this path and return a file object — exactly like the built-in open(path, …). Use it for streaming, appending and any mode read_text / write_text do not cover.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: false,
  version:     'Python 3.4+',
  searchTerms: 'Path.open open pathlib open file python with path.open append mode read lines stream file object encoding',
};

export const method = {
  slug:      'open',
  name:      'Path.open',
  signature: "Path.open(mode='r', buffering=-1, encoding=None, errors=None, newline=None)",
  returns:   { type: 'file object', desc: 'The same object open() returns (TextIOWrapper, BufferedReader, …).' },

  category:    'pathlib method',
  version:     'Python 3.4+',
  hasLiveDemo: false,

  subtitle: "p.open(...) is open(p, ...). Use it in a with block when you need more than one-shot I/O: appending ('a'), reading line by line, exclusive creation ('x'), or binary streaming.",

  covers: ['Path.open'],

  cheat: {
    commonCall: "with p.open('a', encoding='utf-8') as f:",
    returns:    'a file object',
    replaces:   'open(str(p), …)',
    watchOut:   'Close it — use with; pass encoding= in text mode',
  },

  parameters: [
    { name: 'mode',      type: 'str',        required: false, default: "'r'",  desc: "'r', 'w', 'a', 'x', plus 'b' for binary and '+' for update — as for open()." },
    { name: 'buffering', type: 'int',        required: false, default: '-1',   desc: 'Buffer policy, as for open().' },
    { name: 'encoding',  type: 'str | None', required: false, default: 'None', desc: 'Text mode only. None = locale encoding.' },
    { name: 'errors',    type: 'str | None', required: false, default: 'None', desc: 'Text mode only: decoding error handler.' },
    { name: 'newline',   type: 'str | None', required: false, default: 'None', desc: 'Text mode only: newline translation.' },
  ],

  patterns: [
    {
      name: 'Append to a log',
      desc: "Mode 'a' creates the file if needed and writes at the end.",
      code: "from pathlib import Path\nwith Path('app.log').open('a', encoding='utf-8') as f:\n    f.write('started\\n')",
    },
    {
      name: 'Stream a large file line by line',
      desc: 'Memory stays flat regardless of the file size.',
      code: "from pathlib import Path\nwith Path('access.log').open(encoding='utf-8') as f:\n    errors = sum(1 for line in f if ' 500 ' in line)",
    },
    {
      name: 'CSV with the csv module',
      desc: "The csv module wants newline='' so it can handle line endings itself.",
      code: "import csv\nfrom pathlib import Path\nwith Path('out.csv').open('w', newline='', encoding='utf-8') as f:\n    csv.writer(f).writerows(rows)",
    },
  ],

  examples: [
    { title: 'Write and read with open()',    code: "from pathlib import Path\np = Path('a.txt')\nwith p.open('w', encoding='utf-8') as f:\n    f.write('one\\ntwo\\n')\nwith p.open(encoding='utf-8') as f:\n    lines = [line.rstrip('\\n') for line in f]\nlines", returns: "['one', 'two']" },
    { title: 'Append mode',                   code: "from pathlib import Path\np = Path('log.txt')\nfor word in ['a', 'b']:\n    with p.open('a', encoding='utf-8') as f:\n        f.write(word)\np.read_text(encoding='utf-8')", returns: "'ab'" },
    { title: 'Exclusive creation',            code: "from pathlib import Path\np = Path('lock')\np.touch()\np.open('x')", returns: "FileExistsError: [Errno 17] File exists: 'lock'" },
    { title: 'Binary mode returns bytes',     code: "from pathlib import Path\np = Path('b.bin')\np.write_bytes(bytes([1, 2, 3]))\nwith p.open('rb') as f:\n    head = f.read(2)\nhead", returns: "b'\\x01\\x02'" },
    { title: 'Same as the built-in open()',   code: "from pathlib import Path\np = Path('c.txt')\np.write_text('x', encoding='utf-8')\nwith p.open(encoding='utf-8') as f1, open(p, encoding='utf-8') as f2:\n    same = type(f1) is type(f2)\nsame", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Forgetting to close the file',
      desc: 'Data written without closing may still be in the buffer. A with block closes the file even on errors.',
      wrong: { label: 'read before close', code: "from pathlib import Path\nf = Path('x.txt').open('w', encoding='utf-8')\nf.write('data')\nseen = Path('x.txt').read_text(encoding='utf-8')\nf.close()\nseen", output: "''" },
      fix:   { label: 'with block', code: "from pathlib import Path\nwith Path('x.txt').open('w', encoding='utf-8') as f:\n    f.write('data')\nPath('x.txt').read_text(encoding='utf-8')", output: "'data'" },
    },
    {
      name: 'Opening a missing file for reading',
      desc: "Mode 'r' requires the file to exist; 'a' and 'w' create it.",
      wrong: { label: "'r'", code: "from pathlib import Path\nPath('new.txt').open(encoding='utf-8')", output: "FileNotFoundError: [Errno 2] No such file or directory: 'new.txt'" },
      fix:   { label: "'a'", code: "from pathlib import Path\nwith Path('new.txt').open('a', encoding='utf-8') as f:\n    pass\nPath('new.txt').exists()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Appending, streaming, or modes x / r+ / binary',
      'Passing a file object to csv, json.dump, pickle …',
    ],
    avoid: [
      'Whole-file reads and writes → read_text / write_text / read_bytes / write_bytes',
    ],
  },

  notes: {
    cpython:   'Lib/pathlib/_local.py: io.open(self, mode, buffering, encoding, errors, newline) after io.text_encoding(encoding) in text mode',
    'Built-in': 'open() accepts a Path directly, so open(p) and p.open() are interchangeable',
  },

  related: [
    { name: 'open()', slug: 'open', when: 'All modes explained', category: 'functions' },
    { name: 'read_text / write_text', slug: 'read_text', when: 'One-call whole-file I/O' },
    { name: 'with', slug: 'with', when: 'Closes the file for you', category: 'keywords' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: "Mode 'x' on an existing file", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Is Path.open the same as open()?',
      a: 'Yes — it calls io.open with the path and the same arguments. Use whichever reads better; open(p) works because paths are os.PathLike.',
    },
    {
      q: 'How do I append to a file with pathlib?',
      a: "with p.open('a', encoding='utf-8') as f: f.write(text). write_text always overwrites.",
    },
    {
      q: 'How do I read a file line by line with pathlib?',
      a: "with p.open(encoding='utf-8') as f: for line in f: … — or p.read_text().splitlines() for small files.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.open',
    meta:  'Path.open',
  },
};
