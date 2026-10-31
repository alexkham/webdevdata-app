// content/reference/python/stdlib/tempfile/namedtemporaryfile.js

export const meta = {
  slug:        'namedtemporaryfile',
  name:        'tempfile.NamedTemporaryFile',
  signature:   "tempfile.NamedTemporaryFile(mode='w+b', buffering=-1, encoding=None, newline=None, suffix=None, prefix=None, dir=None, delete=True, *, errors=None, delete_on_close=True)",
  blurb:       'A temporary file with a real path in .name, deleted on close by default. delete=False keeps it; delete_on_close=False (3.12+) deletes it at the end of the with block instead, so you can close and reopen it by name.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'namedtemporaryfile tempfile.NamedTemporaryFile python temporary file with name delete=False delete_on_close reopen temporary file windows permission denied suffix prefix .name path',
};

export const method = {
  slug:      'namedtemporaryfile',
  name:      'tempfile.NamedTemporaryFile',
  signature: "tempfile.NamedTemporaryFile(mode='w+b', buffering=-1, encoding=None, newline=None, suffix=None, prefix=None, dir=None, delete=True, *, errors=None, delete_on_close=True)",
  returns:   { type: '_TemporaryFileWrapper', desc: 'A file-like wrapper: .name is the absolute path, .file the real file object.' },

  category:    'tempfile function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "The name is dir / prefix + 8 random characters + suffix, created atomically. Three deletion modes: delete=True with delete_on_close=True (the default) removes the file when it is closed; delete_on_close=False waits for the end of the with block; delete=False never deletes it. Only the last two let you close the file and open it again by name on Windows.",

  covers: ['NamedTemporaryFile'],

  cheat: {
    commonCall: "with tempfile.NamedTemporaryFile(suffix='.csv', delete_on_close=False) as f:",
    returns:    'a file whose f.name you can hand to other programs',
    replaces:   'mktemp() + open() (unsafe)',
    watchOut:   'on Windows, the default settings forbid reopening the file by name while it is open',
  },

  parameters: [
    { name: 'mode',            type: 'str',  required: false, default: "'w+b'", desc: "As for open(). Text modes should get encoding=." },
    { name: 'suffix / prefix', type: 'str | bytes | None', required: false, default: "None ('' / 'tmp')", desc: 'Start and end of the file name; no dot is added — include it in suffix.' },
    { name: 'dir',             type: 'str | bytes | PathLike | None', required: false, default: 'None', desc: 'Where to create the file; None means gettempdir().' },
    { name: 'delete',          type: 'bool', required: false, default: 'True', desc: 'False: never delete automatically (you remove f.name yourself).' },
    { name: 'delete_on_close', type: 'bool', required: false, default: 'True', desc: 'With delete=True: True deletes on close(); False deletes when the with block exits (or when the object is finalized). 3.12+.' },
  ],

  attributes: [
    { name: 'name',  type: 'str | bytes', meaning: 'Absolute path of the file (bytes when prefix/suffix/dir were bytes).' },
    { name: 'file',  type: 'file object', meaning: 'The underlying file returned by open(); other attributes are forwarded to it.' },
    { name: 'close()', type: 'method',    meaning: 'Closes the file — and deletes it when delete and delete_on_close are both true.' },
  ],

  modes: [
    {
      id: 'names',
      label: 'name anatomy',
      blurb: 'Your prefix and suffix around 8 random characters. Names change every run, so the demo shows the parts, not the name.',
      params: [
        { name: 'prefix', type: 'str', hint: 'prefix', input: 'text' },
        { name: 'suffix', type: 'str', hint: 'suffix (include the dot)', input: 'text' },
      ],
      template: "import os, tempfile\nwith tempfile.NamedTemporaryFile(prefix={$prefix}, suffix={$suffix}, dir='.') as f:\n    name = os.path.basename(f.name)\n    shape = (name.startswith({$prefix}), name.endswith({$suffix}), len(name) - len({$prefix}) - len({$suffix}))\n    exists = os.path.exists(f.name)\n(shape, exists, os.path.exists(f.name))",
      cases: [
        { id: 'csv',   label: "prefix 'report_', suffix '.csv'", values: { prefix: 'report_', suffix: '.csv' } },
        { id: 'empty', label: 'empty prefix and suffix',         values: { prefix: '', suffix: '' } },
        { id: 'dots',  label: "prefix 'backup.', suffix '.tar.gz'", values: { prefix: 'backup.', suffix: '.tar.gz' } },
      ],
    },
    {
      id: 'reopen',
      label: 'close and reopen',
      blurb: 'The documented pattern: write, close, open the same path again — then see that the file is gone after the with block.',
      params: [{ name: 'text', type: 'str', hint: 'text to write (UTF-8)', input: 'text' }],
      template: "import os, tempfile\nwith tempfile.NamedTemporaryFile(dir='.', delete_on_close=False) as f:\n    f.write({$text}.encode())\n    f.close()\n    with open(f.name, 'rb') as g:\n        data = g.read()\n(data, os.path.exists(f.name))",
      cases: [
        { id: 'hello', label: 'Hello world!', values: { text: 'Hello world!' } },
        { id: 'utf',   label: 'non-ASCII',    values: { text: 'größe' } },
      ],
    },
  ],
  demoExplainer: "The name always starts with the prefix, ends with the suffix and has exactly 8 random characters in between; the file exists inside the block and not after it. A prefix containing a path separator is not reproduced here: tempfile joins it to dir as is, so 'logs/' points into a sub-folder (FileNotFoundError if it does not exist), and Windows also treats \\ as a separator. In the second tab the reopened file returns exactly the bytes written, and the file is deleted when the with block ends, not at close().",

  patterns: [
    {
      name: 'Pass a file to an external program',
      desc: 'Close it first so the data is flushed and Windows allows the second open.',
      code: "import subprocess, tempfile\nwith tempfile.NamedTemporaryFile('w', suffix='.txt', delete_on_close=False, encoding='utf-8') as f:\n    f.write(text)\n    f.close()\n    subprocess.run(['wc', '-l', f.name], check=True)",
    },
    {
      name: 'Keep the file (manual cleanup)',
      desc: 'delete=False works on every version; remove the file when done.',
      code: "import os, tempfile\nf = tempfile.NamedTemporaryFile(delete=False, suffix='.log')\ntry:\n    f.write(data)\n    f.close()\n    upload(f.name)\nfinally:\n    os.remove(f.name)",
    },
  ],

  examples: [
    { title: 'An absolute path in .name',     code: "import os, tempfile\nwith tempfile.NamedTemporaryFile(dir='.') as f:\n    absolute = os.path.isabs(f.name)\nabsolute", returns: 'True' },
    { title: 'Deleted on close by default',   code: "import os, tempfile\nf = tempfile.NamedTemporaryFile(dir='.')\nname = f.name\nf.close()\nos.path.exists(name)", returns: 'False' },
    { title: 'delete_on_close=False (3.12+)', code: "import os, tempfile\nwith tempfile.NamedTemporaryFile(dir='.', delete_on_close=False) as f:\n    f.close()\n    after_close = os.path.exists(f.name)\n(after_close, os.path.exists(f.name))", returns: '(True, False)' },
    { title: 'delete=False keeps it',         code: "import os, tempfile\nwith tempfile.NamedTemporaryFile(dir='.', delete=False) as f:\n    name = f.name\nkept = os.path.exists(name)\nos.remove(name)\nkept", returns: 'True' },
    { title: 'The real file object',          code: "import tempfile\nwith tempfile.NamedTemporaryFile(dir='.') as f:\n    kinds = (type(f).__name__, type(f.file).__name__)\nkinds", returns: "('_TemporaryFileWrapper', 'BufferedRandom')" },
    { title: 'Text mode',                     code: "import tempfile\nwith tempfile.NamedTemporaryFile('w+', encoding='utf-8', dir='.') as f:\n    info = (type(f.file).__name__, f.mode, f.encoding)\ninfo", returns: "('TextIOWrapper', 'w+', 'utf-8')" },
  ],

  pitfalls: [
    {
      name: 'Closing, then trying to reopen with the defaults',
      desc: 'With delete=True and delete_on_close=True, close() deletes the file — there is nothing to reopen. Use delete_on_close=False.',
      wrong: { label: 'defaults',              code: "import os, tempfile\nwith tempfile.NamedTemporaryFile(dir='.') as f:\n    f.write(b'data')\n    f.close()\n    still_there = os.path.exists(f.name)\nstill_there", output: 'False' },
      fix:   { label: 'delete_on_close=False', code: "import os, tempfile\nwith tempfile.NamedTemporaryFile(dir='.', delete_on_close=False) as f:\n    f.write(b'data')\n    f.close()\n    still_there = os.path.exists(f.name)\nstill_there", output: 'True' },
    },
    {
      name: 'Expecting a dot before the suffix',
      desc: "suffix is appended as is: pass '.txt', not 'txt'.",
      wrong: { label: "suffix='txt'",  code: "import tempfile\nwith tempfile.NamedTemporaryFile(suffix='txt', dir='.') as f:\n    has_dot = f.name.endswith('.txt')\nhas_dot", output: 'False' },
      fix:   { label: "suffix='.txt'", code: "import tempfile\nwith tempfile.NamedTemporaryFile(suffix='.txt', dir='.') as f:\n    has_dot = f.name.endswith('.txt')\nhas_dot", output: 'True' },
    },
  ],

  when: {
    use: [
      'A temporary file another program or library must open by path',
      'Tests that need a real file on disk',
    ],
    avoid: [
      'Only this process uses the file → TemporaryFile',
      'A whole folder of files → TemporaryDirectory',
      'Supporting Windows on Python 3.11 or older while reopening → delete=False and remove it yourself',
    ],
  },

  notes: {
    cpython:      'Lib/tempfile.py: _mkstemp_inner runs inside open()\'s opener; on Windows with delete and delete_on_close it adds os.O_TEMPORARY, so the OS deletes the file when the handle closes',
    'Reopening':  'POSIX: the file can always be opened again by name. Windows (docs): only if delete is false, if the extra open shares delete access (os.O_TEMPORARY), or if delete is true but delete_on_close is false — and such extra opens must be closed before the with block ends, or the final os.unlink raises PermissionError',
    'Crashes':    'On POSIX a process killed with SIGKILL cannot delete its NamedTemporaryFiles (docs)',
    'Changed':    '3.8: errors parameter; 3.12: delete_on_close parameter (docs)',
  },

  related: [
    { name: 'TemporaryFile',      slug: 'temporaryfile',      when: 'No name needed' },
    { name: 'mkstemp',            slug: 'mkstemp',            when: 'Same naming, low-level' },
    { name: 'mktemp',             slug: 'mktemp',             when: 'The unsafe predecessor' },
    { name: 'TemporaryDirectory', slug: 'temporarydirectory', when: 'Several temporary files' },
    { name: 'os.remove',          slug: 'remove',             when: 'Cleanup after delete=False', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Why do I get "PermissionError: [Errno 13] Permission denied" when opening a NamedTemporaryFile on Windows?',
      a: 'With the default delete=True and delete_on_close=True, Windows opens the file with delete-on-close sharing that ordinary open() calls cannot join. Create it with delete_on_close=False (3.12+) and close it before reopening, or use delete=False and remove it yourself.',
    },
    {
      q: 'How do I get the path of a temporary file?',
      a: 'f.name on a NamedTemporaryFile is the absolute path (os.path.abspath of dir joined with the generated name). TemporaryFile does not guarantee a usable name.',
    },
    {
      q: 'How do I keep a NamedTemporaryFile after closing it?',
      a: 'delete=False. The file then stays until you call os.remove(f.name). If you only need it until the end of the with block, delete_on_close=False (3.12+) is the tidier choice.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html#tempfile.NamedTemporaryFile',
    meta:  'tempfile.NamedTemporaryFile',
  },

};
