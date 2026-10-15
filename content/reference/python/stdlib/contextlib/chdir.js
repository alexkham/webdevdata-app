// content/reference/python/stdlib/contextlib/chdir.js

export const meta = {
  slug:        'chdir',
  name:        'contextlib.chdir',
  signature:   'contextlib.chdir(path)',
  blurb:       'Change the current working directory for the duration of a with block and change it back afterwards — even when the block raises.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.11+',
  searchTerms: 'contextlib chdir python change working directory temporarily with chdir cd context manager os.chdir restore cwd pushd popd',
};

export const method = {
  slug:      'chdir',
  name:      'contextlib.chdir',
  signature: 'contextlib.chdir(path)',
  returns:   { type: 'chdir', desc: 'A re-entrant context manager; __enter__ returns None, so "as" binds None.' },

  category:    'contextlib class',
  version:     'Python 3.11+',
  hasLiveDemo: false,

  subtitle: 'The pushd/popd of Python: os.chdir(path) on entry, os.chdir(previous) on exit. The working directory belongs to the whole process, so every thread and every other coroutine sees the change while the block runs.',

  covers: ['chdir'],

  cheat: {
    commonCall: "with chdir('build'):\n    run_build()",
    returns:    'None — the block runs with build/ as the current directory',
    replaces:   'old = os.getcwd(); os.chdir(p); try: … finally: os.chdir(old)',
    watchOut:   'process-wide: not safe with threads or async tasks',
  },

  parameters: [
    { name: 'path', type: 'str | bytes | os.PathLike', required: true, default: null, desc: 'Directory to switch to, relative to the current directory or absolute. It is resolved on entry, not when chdir() is called.' },
  ],

  examples: [
    { title: 'Run code in a subdirectory', code: "import os\nfrom contextlib import chdir\nos.mkdir('sub')\nstart = os.getcwd()\nwith chdir('sub'):\n    print(os.path.basename(os.getcwd()))\nos.getcwd() == start", returns: 'sub\nTrue' },
    { title: 'Relative paths resolve inside', code: "import os\nfrom contextlib import chdir\nos.mkdir('data')\nwith chdir('data'):\n    with open('notes.txt', 'w') as f:\n        f.write('saved inside data/')\nos.listdir('data')", returns: "['notes.txt']" },
    { title: 'Nested blocks restore step by step', code: "import os\nfrom contextlib import chdir\nstart = os.getcwd()\nos.makedirs('a/b')\nwith chdir('a'):\n    with chdir('b'):\n        print(os.path.basename(os.getcwd()))\n    print(os.path.basename(os.getcwd()))\nos.getcwd() == start", returns: 'b\na\nTrue' },
    { title: 'Restored after an exception', code: "import os\nfrom contextlib import chdir\nstart = os.getcwd()\nos.mkdir('work')\ntry:\n    with chdir('work'):\n        raise ValueError('failed inside')\nexcept ValueError:\n    pass\nos.getcwd() == start", returns: 'True' },
    { title: 'Path objects work',           code: "import os\nfrom contextlib import chdir\nfrom pathlib import Path\nPath('p').mkdir()\nwith chdir(Path('p')):\n    name = os.path.basename(os.getcwd())\nname", returns: "'p'" },
    { title: 'as binds None',               code: "import os\nfrom contextlib import chdir\nos.mkdir('x')\nwith chdir('x') as result:\n    pass\nresult is None", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Using the as target as the directory',
      desc: '__enter__ returns None, not the path. Keep the path in your own variable.',
      wrong: { label: 'as d', code: "import os\nfrom contextlib import chdir\nos.mkdir('out')\nwith chdir('out') as d:\n    target = d\nprint(target)", output: 'None' },
      fix:   { label: 'os.getcwd()', code: "import os\nfrom contextlib import chdir\nos.mkdir('out')\nwith chdir('out'):\n    target = os.path.basename(os.getcwd())\ntarget", output: "'out'" },
    },
    {
      name: 'A directory that does not exist',
      desc: 'The error comes from os.chdir when the block is entered; the body never runs. (The message text differs between Windows and Linux/macOS — the exception class and filename do not.)',
      wrong: { label: 'missing dir', code: "from contextlib import chdir\ntry:\n    with chdir('missing'):\n        print('never printed')\nexcept FileNotFoundError as e:\n    print(type(e).__name__, e.filename)", output: 'FileNotFoundError missing' },
      fix:   { label: 'create it first', code: "import os\nfrom contextlib import chdir\nos.makedirs('missing', exist_ok=True)\nwith chdir('missing'):\n    print('inside', os.path.basename(os.getcwd()))", output: 'inside missing' },
    },
  ],

  when: {
    use: [
      'Scripts and tests that must run a tool or code relative to a particular directory',
      'Code that writes files with relative names into a temporary directory',
    ],
    avoid: [
      'Threads and asyncio tasks — the change is global to the process (docs: "not suitable for use in most threaded or async contexts")',
      'Generators that yield inside the block — other code runs with the changed directory while they are suspended',
      'Just building paths → pass absolute paths or use pathlib (directory / name) instead of changing directory',
      'Child processes → subprocess.run(..., cwd=path) changes only the child\'s directory',
    ],
  },

  notes: {
    cpython:      'Lib/contextlib.py: __enter__ appends os.getcwd() to a list and calls os.chdir(self.path); __exit__ pops and calls os.chdir with it — the list makes one object re-entrant',
    'Doc-only':   'No live demo: changing directories cannot be reproduced in the browser. The examples are run by CPython inside a temporary directory',
    'Before 3.11': 'Write it yourself with @contextmanager: save os.getcwd(), os.chdir(path), yield, and os.chdir(saved) in finally',
  },

  related: [
    { name: 'os.getcwd', slug: 'getcwd', when: 'Read the current directory', category: 'stdlib/os' },
    { name: 'contextlib.contextmanager', slug: 'contextmanager', when: 'The same idea for older Python versions' },
    { name: 'subprocess module', slug: 'subprocess', when: 'cwd= runs a child in another directory', category: 'stdlib' },
    { name: 'pathlib module', slug: 'pathlib', when: 'Build absolute paths instead', category: 'stdlib' },
    { name: 'with', slug: 'with', when: 'The statement that restores the directory', category: 'keywords' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'contextlib.chdir changes the working directory of the whole process, and a browser has no file system or working directory to change, so there is nothing an in-page demo could show faithfully. The examples on this page were run by CPython inside a temporary directory, and their output is what you see.',
    },
    {
      q: 'How do I temporarily change the working directory in Python?',
      a: "On Python 3.11+, use \"with contextlib.chdir(path):\" — the previous directory is restored when the block ends, even after an exception. On older versions, save os.getcwd(), call os.chdir(path) and restore it in a finally block (or wrap that in a @contextmanager).",
    },
    {
      q: 'Is contextlib.chdir thread-safe?',
      a: 'No. The working directory is shared by the whole process, so other threads (and other asyncio tasks) see the change while the block is active. The docs call it "non parallel-safe".',
    },
    {
      q: 'What does "with chdir(path) as x" bind to x?',
      a: 'None — __enter__ does not return anything. Use os.getcwd() inside the block if you need the absolute path.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.chdir',
    meta:  'contextlib.chdir',
  },
};
