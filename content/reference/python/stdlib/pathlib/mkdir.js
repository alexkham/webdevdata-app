// content/reference/python/stdlib/pathlib/mkdir.js

export const meta = {
  slug:        'mkdir',
  name:        'Path.mkdir',
  signature:   'Path.mkdir(mode=0o777, parents=False, exist_ok=False) / .touch(mode=0o666, exist_ok=True) / .unlink(missing_ok=False) / .rmdir()',
  blurb:       'Create and remove: mkdir makes a folder (parents=True for the whole chain), touch creates an empty file, unlink deletes a file, rmdir deletes an empty folder.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (exist_ok 3.5+, missing_ok 3.8+)',
  searchTerms: 'Path.mkdir mkdir touch unlink rmdir Path.touch Path.unlink Path.rmdir create directory python pathlib makedirs parents=True exist_ok=True create folder if not exists delete file remove empty directory missing_ok FileExistsError',
};

export const method = {
  slug:      'mkdir',
  name:      'Path.mkdir',
  signature: 'Path.mkdir(mode=0o777, parents=False, exist_ok=False) / .touch(mode=0o666, exist_ok=True) / .unlink(missing_ok=False) / .rmdir()',
  returns:   { type: 'None', desc: 'All four act on the file system and return None.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (exist_ok 3.5+, missing_ok 3.8+)',
  hasLiveDemo: true,

  subtitle: "p.mkdir(parents=True, exist_ok=True) is the 'make sure this folder exists' idiom — it is os.makedirs(p, exist_ok=True). touch, unlink and rmdir cover the rest of the create/delete basics; for non-empty folders use shutil.rmtree.",

  covers: ['Path.mkdir', 'Path.touch', 'Path.unlink', 'Path.rmdir'],

  cheat: {
    commonCall: 'out.mkdir(parents=True, exist_ok=True)',
    returns:    'None',
    replaces:   'os.makedirs(out, exist_ok=True) / os.remove / os.rmdir',
    watchOut:   'rmdir only removes EMPTY folders; unlink refuses folders',
  },

  parameters: [
    { name: 'parents',    type: 'bool', required: false, default: 'False',  desc: 'mkdir: also create missing parent folders (they get the default mode).' },
    { name: 'exist_ok',   type: 'bool', required: false, default: 'False / True', desc: 'mkdir (default False): no error if the folder already exists. touch (default True): no error if the file exists — it just updates the modification time.' },
    { name: 'mode',       type: 'int',  required: false, default: '0o777 / 0o666', desc: 'Permission bits, combined with the process umask (POSIX).' },
    { name: 'missing_ok', type: 'bool', required: false, default: 'False',  desc: 'unlink (3.8+): no error if the file does not exist.' },
  ],

  modes: [
    {
      id: 'nested',
      label: 'parents + exist_ok',
      blurb: 'The idiom runs twice here without an error, and creates every missing level.',
      params: [{ name: 'path', type: 'str', hint: 'folder to create', input: 'text' }],
      template: "from pathlib import Path\np = Path({$path})\np.mkdir(parents=True, exist_ok=True)\np.mkdir(parents=True, exist_ok=True)\n(p.is_dir(), sorted(q.as_posix() for q in Path('.').rglob('*')))",
      cases: [
        { id: 'deep',  label: 'nested', values: { path: 'build/reports/2026' } },
        { id: 'one',   label: 'single', values: { path: 'out' } },
        { id: 'dot',   label: "'.'",    values: { path: '.' } },
      ],
    },
    {
      id: 'plain',
      label: 'plain mkdir()',
      blurb: "Without the flags, mkdir fails on an existing folder or a missing parent. A folder called 'existing' is created first.",
      params: [{ name: 'path', type: 'str', hint: 'folder to create', input: 'text' }],
      template: "from pathlib import Path\nPath('existing').mkdir()\ntry:\n    Path({$path}).mkdir()\nexcept OSError as e:\n    result = type(e).__name__\nelse:\n    result = 'created'\nresult",
      cases: [
        { id: 'new',     label: 'new folder',     values: { path: 'logs' } },
        { id: 'exists',  label: 'already exists', values: { path: 'existing' } },
        { id: 'parents', label: 'missing parent', values: { path: 'a/b/c' } },
        { id: 'inside',  label: 'inside existing', values: { path: 'existing/sub' } },
      ],
    },
    {
      id: 'cleanup',
      label: 'touch / unlink / rmdir',
      blurb: 'Create folder/name, then remove the file and the (now empty) folder.',
      params: [
        { name: 'folder', type: 'str', hint: 'folder name', input: 'text' },
        { name: 'name',   type: 'str', hint: 'file name',   input: 'text' },
      ],
      template: "from pathlib import Path\nd = Path({$folder})\nd.mkdir()\nf = d / {$name}\nf.touch()\nbefore = f.exists()\nf.unlink()\nd.rmdir()\n(before, f.exists(), d.exists())",
      cases: [
        { id: 'tmp', label: 'tmp/scratch.txt', values: { folder: 'tmp', name: 'scratch.txt' } },
      ],
    },
  ],
  demoExplainer: "With parents=True every missing level is created, and exist_ok=True turns the second call into a no-op — so the idiom is safe to run on every start-up. Path('.') always exists, so mkdir(exist_ok=True) on it does nothing. The plain tab shows the error types only, because their messages differ by OS ([Errno 17] on Linux, [WinError 183] on Windows for the same FileExistsError).",

  patterns: [
    {
      name: 'Ensure the parent folder of an output file',
      desc: 'Create the folder, then write the file.',
      code: "from pathlib import Path\nout = Path('reports/2026/q3.csv')\nout.parent.mkdir(parents=True, exist_ok=True)\nout.write_text(csv_text, encoding='utf-8')",
    },
    {
      name: 'Delete a file if it is there',
      desc: 'missing_ok=True replaces exists() + unlink(), without the race.',
      code: "from pathlib import Path\nPath('app.pid').unlink(missing_ok=True)",
    },
    {
      name: 'Remove a non-empty folder',
      desc: 'rmdir refuses; shutil.rmtree deletes the whole tree.',
      code: "import shutil\nfrom pathlib import Path\nshutil.rmtree(Path('build'), ignore_errors=True)",
    },
    {
      name: 'Create a marker file only once',
      desc: 'touch(exist_ok=False) fails if another process created it first.',
      code: "from pathlib import Path\ntry:\n    Path('setup.done').touch(exist_ok=False)\nexcept FileExistsError:\n    print('already set up')",
    },
  ],

  examples: [
    { title: 'Create nested folders',        code: "from pathlib import Path\nPath('a/b/c').mkdir(parents=True)\nPath('a/b/c').is_dir()", returns: 'True' },
    { title: 'Idempotent with exist_ok',     code: "from pathlib import Path\nfor _ in range(2):\n    Path('cache').mkdir(exist_ok=True)\nPath('cache').is_dir()", returns: 'True' },
    { title: 'touch creates an empty file',  code: "from pathlib import Path\np = Path('empty.txt')\np.touch()\n(p.is_file(), p.stat().st_size)", returns: '(True, 0)' },
    { title: 'touch(exist_ok=False) on an existing file', code: "from pathlib import Path\nPath('lock').touch()\nPath('lock').touch(exist_ok=False)", returns: "FileExistsError: [Errno 17] File exists: 'lock'" },
    { title: 'unlink deletes a file',        code: "from pathlib import Path\np = Path('old.log')\np.touch()\np.unlink()\np.exists()", returns: 'False' },
    { title: 'unlink(missing_ok=True)',      code: "from pathlib import Path\nPath('never-existed.txt').unlink(missing_ok=True)\n'no error'", returns: "'no error'" },
    { title: 'rmdir refuses non-empty folders', code: "from pathlib import Path\nPath('full').mkdir()\nPath('full/x').touch()\ntry:\n    Path('full').rmdir()\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'OSError'" },
  ],

  pitfalls: [
    {
      name: 'mkdir() without exist_ok in re-runnable code',
      desc: 'The second run fails because the folder is already there.',
      wrong: { label: 'plain mkdir', code: "from pathlib import Path\nPath('out').mkdir()\ntry:\n    Path('out').mkdir()\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileExistsError'" },
      fix:   { label: 'exist_ok=True', code: "from pathlib import Path\nPath('out').mkdir()\nPath('out').mkdir(exist_ok=True)\nPath('out').is_dir()", output: 'True' },
    },
    {
      name: 'exist_ok=True when a FILE has that name',
      desc: 'exist_ok only forgives an existing directory. A file in the way still raises FileExistsError.',
      wrong: { label: 'file in the way', code: "from pathlib import Path\nPath('data').touch()\ntry:\n    Path('data').mkdir(exist_ok=True)\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileExistsError'" },
      fix:   { label: 'check first', code: "from pathlib import Path\nPath('data').touch()\np = Path('data')\n'use another name' if p.exists() and not p.is_dir() else p.mkdir(exist_ok=True)", output: "'use another name'" },
    },
    {
      name: 'Checking exists() before unlink()',
      desc: 'Between the check and the delete another process may remove the file. missing_ok=True does both atomically.',
      wrong: { label: 'check then delete', code: "from pathlib import Path\np = Path('tmp.lock')\nif p.exists():\n    p.unlink()\np.exists()", output: 'False' },
      fix:   { label: 'missing_ok=True', code: "from pathlib import Path\np = Path('tmp.lock')\np.unlink(missing_ok=True)\np.exists()", output: 'False' },
    },
  ],

  when: {
    use: [
      'Making output folders (mkdir(parents=True, exist_ok=True))',
      'Creating empty marker files (touch) and removing files (unlink)',
      'Removing folders you have emptied (rmdir)',
    ],
    avoid: [
      'Deleting a folder with content → shutil.rmtree',
      'Temporary folders → tempfile.TemporaryDirectory',
    ],
  },

  notes: {
    cpython:          'Lib/pathlib/_local.py: mkdir calls os.mkdir; on FileNotFoundError with parents=True it creates self.parent recursively and retries; any other OSError is re-raised unless exist_ok and the path is a directory',
    'Messages differ by OS': "FileExistsError reads '[Errno 17] File exists' on Linux but '[WinError 183] Cannot create a file when that file already exists' on Windows for mkdir; touch(exist_ok=False) goes through os.open and reads '[Errno 17] File exists' on both",
    'unlink on a folder': 'Raises an OSError subclass that depends on the OS (PermissionError on Windows) — use rmdir()',
    'rmdir non-empty': "OSError on every OS; on Windows the message is '[WinError 145] The directory is not empty'",
  },

  related: [
    { name: 'exists / is_dir', slug: 'exists', when: 'Test before or after' },
    { name: 'rename / replace', slug: 'rename', when: 'Move instead of delete' },
    { name: 'read_text / write_text', slug: 'read_text', when: 'Write into the new folder' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: 'mkdir on an existing path', category: 'exceptions' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'Missing parent or missing file', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I create a directory if it does not exist in Python?',
      a: "Path('folder').mkdir(parents=True, exist_ok=True). parents creates missing parent folders, exist_ok skips the error if it is already there.",
    },
    {
      q: 'How do I delete a file with pathlib?',
      a: 'Path(p).unlink(). Add missing_ok=True (3.8+) to ignore a missing file. For folders use rmdir() (empty) or shutil.rmtree (non-empty).',
    },
    {
      q: 'What is the pathlib equivalent of os.makedirs?',
      a: 'Path.mkdir(parents=True). os.makedirs(p, exist_ok=True) is Path(p).mkdir(parents=True, exist_ok=True).',
    },
    {
      q: 'Does touch() change an existing file?',
      a: 'It updates the modification time and leaves the content alone. With exist_ok=False it raises FileExistsError instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.mkdir',
    meta:  'Path.mkdir / touch / unlink / rmdir',
  },
};
