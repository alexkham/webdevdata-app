// content/reference/python/stdlib/pathlib/exists.js

export const meta = {
  slug:        'exists',
  name:        'Path.exists',
  signature:   'Path.exists(*, follow_symlinks=True) / .is_file() / .is_dir() / .is_symlink() / .is_junction() / .is_mount() / …',
  blurb:       'Ask what is at a path: anything at all (exists), a regular file, a directory, a symlink, a mount point, a junction, a socket, FIFO or device. All return False instead of raising when the path is missing.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (is_junction 3.12+)',
  searchTerms: 'Path.exists exists is_file is_dir is_symlink is_junction is_mount is_socket is_fifo is_block_device is_char_device Path.is_junction Path.is_mount check if file exists python pathlib check directory exists follow_symlinks',
};

export const method = {
  slug:      'exists',
  name:      'Path.exists',
  signature: 'Path.exists(*, follow_symlinks=True) / .is_file() / .is_dir() / .is_symlink() / .is_junction() / .is_mount() / …',
  returns:   { type: 'bool', desc: 'True or False — a missing path is False, not an exception.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (is_junction 3.12+)',
  hasLiveDemo: true,

  subtitle: 'exists() is True for anything; is_file() only for regular files; is_dir() only for folders. They follow symlinks unless you pass follow_symlinks=False (exists 3.12+, is_file / is_dir 3.13+). is_symlink, is_junction and is_mount inspect the link or the mount itself.',

  covers: ['Path.is_junction', 'Path.is_mount'],

  cheat: {
    commonCall: 'if p.is_file():',
    returns:    'bool',
    replaces:   'os.path.exists / isfile / isdir / islink / ismount / isjunction',
    watchOut:   'checking then acting is racy — try the operation and catch the error',
  },

  parameters: [
    { name: 'follow_symlinks', type: 'bool', required: false, default: 'True', desc: 'exists (3.12+), is_file and is_dir (3.13+): with False, a symlink is judged by itself rather than its target.' },
  ],

  modes: [
    {
      id: 'check',
      label: 'exists / is_file / is_dir',
      blurb: 'Create a few files, then ask about one path.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'query', type: 'str',       hint: 'path to check',                    input: 'text' },
      ],
      template: "from pathlib import Path\nfor f in {$files}:\n    Path(f).parent.mkdir(parents=True, exist_ok=True)\n    Path(f).touch()\np = Path({$query})\n(p.exists(), p.is_file(), p.is_dir())",
      cases: [
        { id: 'file',   label: 'a file',    values: { files: 'config.toml, src/app.py', query: 'config.toml' } },
        { id: 'dir',    label: 'a folder',  values: { files: 'config.toml, src/app.py', query: 'src' } },
        { id: 'miss',   label: 'missing',   values: { files: 'config.toml, src/app.py', query: 'setup.cfg' } },
        { id: 'dot',    label: "'.'",       values: { files: 'config.toml', query: '.' } },
      ],
    },
  ],
  demoExplainer: "A missing path gives (False, False, False) — no exception. '.' is the (existing) current folder. is_file() and is_dir() are never both True; both are False for missing paths and for special files such as sockets or devices.",

  patterns: [
    {
      name: 'Load a config file if present',
      desc: 'The simple check is fine when nothing else changes the file.',
      code: "from pathlib import Path\ncfg = Path('settings.toml')\ntext = cfg.read_text(encoding='utf-8') if cfg.is_file() else ''",
    },
    {
      name: 'EAFP instead of check-then-act',
      desc: 'Try it and handle the error — no race between check and use.',
      code: "from pathlib import Path\ntry:\n    text = Path('settings.toml').read_text(encoding='utf-8')\nexcept FileNotFoundError:\n    text = ''",
    },
    {
      name: 'Detect a dangling symlink',
      desc: 'The link exists but its target does not.',
      code: "from pathlib import Path\ndef is_broken_link(p):\n    return p.is_symlink() and not p.exists()",
    },
  ],

  examples: [
    { title: 'A file',                     code: "from pathlib import Path\nPath('a.txt').touch()\np = Path('a.txt')\n(p.exists(), p.is_file(), p.is_dir())", returns: '(True, True, False)' },
    { title: 'A folder',                   code: "from pathlib import Path\nPath('docs').mkdir()\np = Path('docs')\n(p.exists(), p.is_file(), p.is_dir())", returns: '(True, False, True)' },
    { title: 'Missing: False, not an error', code: "from pathlib import Path\np = Path('nope')\n(p.exists(), p.is_file(), p.is_dir(), p.is_symlink())", returns: '(False, False, False, False)' },
    { title: 'A plain file is not a symlink', code: "from pathlib import Path\nPath('real.txt').touch()\nPath('real.txt').is_symlink()", returns: 'False' },
    { title: 'An ordinary sub-folder is not a mount point', code: "from pathlib import Path\nPath('sub').mkdir()\nPath('sub').is_mount()", returns: 'False' },
    { title: 'Junctions exist only on Windows', code: "from pathlib import Path\nPath('d').mkdir()\nPath('d').is_junction()", returns: 'False' },
    { title: 'Special files',              code: "from pathlib import Path\np = Path('x.txt')\np.touch()\n(p.is_socket(), p.is_fifo(), p.is_block_device(), p.is_char_device())", returns: '(False, False, False, False)' },
  ],

  pitfalls: [
    {
      name: 'Check, then act',
      desc: 'Another process can create or delete the file between exists() and the operation. Prefer doing it and catching the error — or flags like exist_ok / missing_ok.',
      wrong: { label: 'exists() then mkdir()', code: "from pathlib import Path\np = Path('out')\nif not p.exists():\n    p.mkdir()\np.is_dir()", output: 'True' },
      fix:   { label: 'mkdir(exist_ok=True)', code: "from pathlib import Path\nPath('out').mkdir(exist_ok=True)\nPath('out').is_dir()", output: 'True' },
    },
    {
      name: 'Using exists() when you need a file',
      desc: 'exists() is True for folders too. If you are about to read the path, ask is_file().',
      wrong: { label: 'exists()', code: "from pathlib import Path\nPath('data.csv').mkdir()\nPath('data.csv').exists()", output: 'True' },
      fix:   { label: 'is_file()', code: "from pathlib import Path\nPath('data.csv').mkdir()\nPath('data.csv').is_file()", output: 'False' },
    },
  ],

  when: {
    use: [
      'Branching on what kind of thing a path is',
      'Filtering iterdir / glob results (is_file, is_dir)',
    ],
    avoid: [
      'Guarding an operation that might race → just try it and catch FileNotFoundError / FileExistsError',
      'File size, times, permissions → stat()',
    ],
  },

  notes: {
    cpython:          'exists, is_file, is_dir, is_symlink, is_socket, is_fifo, is_block_device, is_char_device come from PathBase (Lib/pathlib/_abc.py) and read stat().st_mode; Path overrides is_mount (os.path.ismount) and is_junction (os.path.isjunction)',
    'Errors':         'A missing path, a path through a file ("file.txt/x") and some other OSErrors give False; permission problems may still raise',
    'is_junction':    'Added in 3.12. Only Windows has junctions; always False elsewhere',
    'is_mount':       'Windows support added in 3.12',
    'Changed in 3.14': 'All these checks return False for any OSError from the OS',
  },

  related: [
    { name: 'stat / lstat', slug: 'stat', when: 'Size, times and mode bits' },
    { name: 'iterdir', slug: 'iterdir', when: 'Filter a listing' },
    { name: 'mkdir / unlink', slug: 'mkdir', when: 'exist_ok and missing_ok instead of checks' },
    { name: 'symlink_to / readlink', slug: 'symlink_to', when: 'Create and inspect links' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'The EAFP alternative', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I check if a file exists in Python?',
      a: "Path('file.txt').is_file() — True only for an existing regular file. Path(p).exists() is True for folders as well.",
    },
    {
      q: 'How do I check if a directory exists?',
      a: "Path('folder').is_dir(). To create it when missing, skip the check and call mkdir(parents=True, exist_ok=True).",
    },
    {
      q: 'Does exists() follow symlinks?',
      a: 'Yes: a symlink to a missing target gives False. Pass follow_symlinks=False (3.12+) to test the link itself, or use is_symlink().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.exists',
    meta:  'Path.exists / is_file / is_dir / is_symlink / is_junction / is_mount',
  },
};
