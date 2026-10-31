// content/reference/python/stdlib/tempfile/temporarydirectory.js

export const meta = {
  slug:        'temporarydirectory',
  name:        'tempfile.TemporaryDirectory',
  signature:   'tempfile.TemporaryDirectory(suffix=None, prefix=None, dir=None, ignore_cleanup_errors=False, *, delete=True)',
  blurb:       'A private temporary folder that is removed — with everything in it — at the end of its with block or when cleanup() is called.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'temporarydirectory tempfile.TemporaryDirectory python temporary directory temp folder scratch folder cleanup ignore_cleanup_errors delete=False context manager returns path string rmtree',
};

export const method = {
  slug:      'temporarydirectory',
  name:      'tempfile.TemporaryDirectory',
  signature: 'tempfile.TemporaryDirectory(suffix=None, prefix=None, dir=None, ignore_cleanup_errors=False, *, delete=True)',
  returns:   { type: 'TemporaryDirectory', desc: 'An object with .name and cleanup(); with ... as d binds the path string, not the object.' },

  category:    'tempfile class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'The directory is made by mkdtemp() (readable and writable only by you) and deleted with shutil.rmtree when the with block ends, after an exception too. Note that `with TemporaryDirectory() as d` gives you the path as a str. ignore_cleanup_errors (3.10) makes cleanup best-effort; delete=False (3.12) keeps the folder.',

  covers: ['TemporaryDirectory'],

  cheat: {
    commonCall: 'with tempfile.TemporaryDirectory() as tmp:',
    returns:    'tmp is the absolute path (str)',
    replaces:   'mkdtemp() + shutil.rmtree() in a finally block',
    watchOut:   'files still open on Windows make cleanup fail unless ignore_cleanup_errors=True',
  },

  parameters: [
    { name: 'suffix / prefix', type: 'str | bytes | None', required: false, default: 'None', desc: "Start and end of the folder name (default prefix 'tmp')." },
    { name: 'dir',             type: 'str | bytes | PathLike | None', required: false, default: 'None', desc: 'Parent folder; None means gettempdir().' },
    { name: 'ignore_cleanup_errors', type: 'bool', required: false, default: 'False', desc: 'Ignore errors while deleting and remove what can be removed (3.10+).' },
    { name: 'delete',          type: 'bool', required: false, default: 'True', desc: 'False: leaving the with block does not delete the folder; cleanup() still does (3.12+).' },
  ],

  attributes: [
    { name: 'name',      type: 'str | bytes', meaning: 'Absolute path of the directory.' },
    { name: 'cleanup()', type: 'method',      meaning: 'Delete the directory tree now; safe to call again.' },
  ],

  modes: [
    {
      id: 'scratch',
      label: 'files inside',
      blurb: 'Create files in a TemporaryDirectory with your prefix; list them; check the folder after the block.',
      params: [
        { name: 'prefix', type: 'str',       hint: 'folder name prefix',          input: 'text' },
        { name: 'files',  type: 'list[str]', hint: 'file names, comma-separated', input: 'csv' },
      ],
      template: "import os, tempfile\nwith tempfile.TemporaryDirectory(prefix={$prefix}, dir='.') as d:\n    for name in {$files}:\n        with open(os.path.join(d, name), 'w') as f:\n            f.write('data')\n    inside = sorted(os.listdir(d))\n    named = os.path.basename(d).startswith({$prefix})\n(inside, named, os.path.exists(d))",
      cases: [
        { id: 'build', label: 'build output',    values: { prefix: 'build-', files: 'app.js, app.css, index.html' } },
        { id: 'one',   label: 'one file',        values: { prefix: 'tmp', files: 'data.json' } },
        { id: 'none',  label: 'empty folder',    values: { prefix: 'scratch_', files: '' } },
      ],
    },
  ],
  demoExplainer: "The listing shows exactly the files written, sorted; the folder name starts with the prefix; and after the block the folder does not exist any more — it was removed together with its files. The demo accepts simple lowercase file names because names with upper case, path separators or Windows-reserved words such as con behave differently on Windows, macOS and Linux.",

  patterns: [
    {
      name: 'Work in a scratch folder with pathlib',
      desc: 'Wrap the path in Path for convenient joins.',
      code: "import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory(prefix='job-') as tmp:\n    out = Path(tmp) / 'result.csv'\n    export(out)\n    upload(out)",
    },
    {
      name: 'A fixture for tests',
      desc: 'Keep the object to call cleanup() later.',
      code: "import tempfile, unittest\nclass ExportTest(unittest.TestCase):\n    def setUp(self):\n        self.tmp = tempfile.TemporaryDirectory()\n        self.addCleanup(self.tmp.cleanup)",
    },
    {
      name: 'Keep the folder while debugging',
      desc: 'delete=False (3.12+) leaves it in place; print the path to inspect it.',
      code: "import tempfile\nwith tempfile.TemporaryDirectory(delete=not debug) as tmp:\n    run(tmp)\n    if debug:\n        print('kept', tmp)",
    },
  ],

  examples: [
    { title: 'as gives a str path',          code: "import tempfile\nwith tempfile.TemporaryDirectory(dir='.') as d:\n    kind = type(d).__name__\nkind", returns: "'str'" },
    { title: 'Contents are removed too',     code: "import os, tempfile\nwith tempfile.TemporaryDirectory(dir='.') as d:\n    os.makedirs(os.path.join(d, 'a', 'b'))\n    open(os.path.join(d, 'a', 'b', 'f.txt'), 'w').close()\nos.path.exists(d)", returns: 'False' },
    { title: 'cleanup() without with',       code: "import os, tempfile\ntd = tempfile.TemporaryDirectory(dir='.')\nexisted = os.path.isdir(td.name)\ntd.cleanup()\n(existed, os.path.exists(td.name))", returns: '(True, False)' },
    { title: 'cleanup() twice is fine',      code: "import tempfile\ntd = tempfile.TemporaryDirectory(dir='.')\ntd.cleanup()\ntd.cleanup() is None", returns: 'True' },
    { title: 'delete=False keeps it (3.12+)', code: "import os, tempfile\ntd = tempfile.TemporaryDirectory(dir='.', delete=False)\nwith td as d:\n    pass\nkept = os.path.isdir(d)\ntd.cleanup()\nkept", returns: 'True' },
    { title: 'An absolute path',             code: "import os, tempfile\nwith tempfile.TemporaryDirectory(dir='.') as d:\n    absolute = os.path.isabs(d)\nabsolute", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Treating the with target as the object',
      desc: '__enter__ returns the path string. Keep the object in a variable if you need .name or cleanup().',
      wrong: { label: 'd.name',        code: "import tempfile\nwith tempfile.TemporaryDirectory(dir='.') as d:\n    path = d.name", output: "AttributeError: 'str' object has no attribute 'name'" },
      fix:   { label: 'use d itself',  code: "import os, tempfile\nwith tempfile.TemporaryDirectory(dir='.') as d:\n    ok = os.path.isdir(d)\nok", output: 'True' },
    },
    {
      name: 'Returning a path into the folder',
      desc: 'Everything inside is deleted when the block ends. Copy what you need out first, or return the data rather than the path.',
      wrong: { label: 'return the path', code: "import os, tempfile\ndef make_report():\n    with tempfile.TemporaryDirectory(dir='.') as d:\n        path = os.path.join(d, 'report.txt')\n        with open(path, 'w') as f:\n            f.write('ok')\n        return path\nos.path.exists(make_report())", output: 'False' },
      fix:   { label: 'return the data', code: "import os, tempfile\ndef make_report():\n    with tempfile.TemporaryDirectory(dir='.') as d:\n        path = os.path.join(d, 'report.txt')\n        with open(path, 'w') as f:\n            f.write('ok')\n        with open(path) as f:\n            return f.read()\nmake_report()", output: "'ok'" },
    },
  ],

  when: {
    use: [
      'Several intermediate files for one job',
      'Tests that need a clean folder',
      'Unpacking archives before processing',
    ],
    avoid: [
      'A single file → TemporaryFile / NamedTemporaryFile',
      'A folder that must survive the program → mkdtemp() and your own cleanup',
    ],
  },

  notes: {
    cpython:       'Lib/tempfile.py: __init__ calls mkdtemp() and registers a weakref.finalize that removes the tree (with a ResourceWarning) if the object is garbage collected without cleanup(). Removal uses shutil.rmtree with a handler that resets permissions and retries',
    'Windows':     'Files still open inside the folder cannot be deleted on Windows; the docs give PermissionError as the example that ignore_cleanup_errors=True suppresses',
    'Changed':     '3.2: added; 3.10: ignore_cleanup_errors; 3.12: delete (docs)',
  },

  related: [
    { name: 'mkdtemp',        slug: 'mkdtemp',        when: 'The low-level version' },
    { name: 'NamedTemporaryFile', slug: 'namedtemporaryfile', when: 'One temporary file with a path' },
    { name: 'shutil.rmtree',  slug: 'rmtree',         when: 'What does the cleanup', category: 'stdlib/shutil' },
    { name: 'pathlib',        slug: 'pathlib',        when: 'Path(tmp) / "name"', category: 'stdlib' },
    { name: 'with',           slug: 'with',           when: 'Cleanup at the end of the block', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I create a temporary directory in Python?',
      a: "with tempfile.TemporaryDirectory() as tmp: — tmp is the path (a str). The folder and everything in it are deleted when the block ends. Without a with block, keep the object and call obj.cleanup().",
    },
    {
      q: 'Why does TemporaryDirectory fail to clean up on Windows?',
      a: 'A file inside is still open (by your code or another process), and Windows refuses to delete open files. Close everything first, or pass ignore_cleanup_errors=True (3.10+) to remove what can be removed and ignore the rest.',
    },
    {
      q: 'How do I keep a temporary directory for debugging?',
      a: 'Pass delete=False (3.12+): leaving the with block then leaves the folder in place, and cleanup() still removes it on request. On older versions use mkdtemp().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html#tempfile.TemporaryDirectory',
    meta:  'tempfile.TemporaryDirectory',
  },

};
