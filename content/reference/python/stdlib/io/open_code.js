// content/reference/python/stdlib/io/open_code.js — io.open_code

export const meta = {
  slug:        'open_code',
  name:        'io.open_code',
  signature:   'io.open_code(path)',
  blurb:       "Open a file that will be executed as code, in mode 'rb'. Behaves like open(path, 'rb') unless an embedding application installed a hook to validate such files.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.8+',
  searchTerms: 'open_code io.open_code python open file as code import hook PyFile_SetOpenCodeHook audit security rb executable code loader',
};

export const method = {
  slug:      'open_code',
  name:      'io.open_code',
  signature: 'io.open_code(path)',
  returns:   { type: 'BufferedReader', desc: "The same kind of object as open(path, 'rb') (unless a hook returns something else)." },

  category:    'io function',
  version:     'Python 3.8+',
  hasLiveDemo: false,

  subtitle: "Python's own import system reads source and bytecode through open_code(). The point is the hook: an application embedding Python can call PyFile_SetOpenCodeHook() to verify or decrypt every file that is about to run. Tools that execute files (custom importers, runpy-like loaders) should call it too, with a str absolute path.",

  covers: ['open_code'],

  cheat: {
    commonCall: 'with io.open_code(os.path.abspath(path)) as f: source = f.read()',
    returns:    "a binary file object, like open(path, 'rb')",
    replaces:   "open(path, 'rb') when the file is going to be executed",
    watchOut:   'path must be a str (bytes and Path objects are refused)',
  },

  parameters: [
    { name: 'path', type: 'str', required: true, default: null, desc: 'The file to open; the docs ask for an absolute path.' },
  ],

  patterns: [
    {
      name: 'A loader that respects the hook',
      desc: 'Read the code through open_code, then compile it.',
      code: "import io, os\ndef load_plugin(path):\n    path = os.path.abspath(path)\n    with io.open_code(path) as f:\n        code = compile(f.read(), path, 'exec')\n    namespace = {}\n    exec(code, namespace)\n    return namespace",
    },
  ],

  examples: [
    { title: 'Reads bytes',                  code: "import io, os\nwith open('script.py', 'w', encoding='utf-8') as f:\n    f.write('print(1)')\nwith io.open_code(os.path.abspath('script.py')) as f:\n    data = f.read()\ndata", returns: "b'print(1)'" },
    { title: 'A BufferedReader',             code: "import io, os\nopen('script.py', 'w').close()\nwith io.open_code(os.path.abspath('script.py')) as f:\n    name = type(f).__name__\nname", returns: "'BufferedReader'" },
    { title: 'str paths only',               code: "import io\nio.open_code(b'script.py')", returns: "TypeError: open_code() argument 'path' must be str, not bytes" },
    { title: 'Missing files raise as usual', code: "import io\nio.open_code('missing.py')", returns: "FileNotFoundError: [Errno 2] No such file or directory: 'missing.py'" },
  ],

  pitfalls: [
    {
      name: 'Passing a Path object',
      desc: 'Unlike open(), open_code() takes only str. Convert with str() or os.fspath(). (A plain Path gives the same error, naming PosixPath or WindowsPath.)',
      wrong: { label: 'path object', code: "import io\nfrom pathlib import PurePosixPath\nio.open_code(PurePosixPath('script.py'))", output: "TypeError: open_code() argument 'path' must be str, not PurePosixPath" },
      fix:   { label: 'str(path)',   code: "import io\nfrom pathlib import Path\nPath('script.py').write_text('x = 1')\nwith io.open_code(str(Path('script.py').resolve())) as f:\n    data = f.read()\ndata", output: "b'x = 1'" },
    },
  ],

  when: {
    use: [
      'Custom importers, plugin loaders, anything that executes file contents',
    ],
    avoid: [
      'Reading data files → open()',
    ],
  },

  notes: {
    cpython:       'Modules/_io/_iomodule.c. Without a hook it calls open(path, "rb"); with one, PyFile_OpenCode passes the path to the hook (C API, see PEP 578 audit hooks)',
    'Path type':   'The error names the concrete class — WindowsPath on Windows, PosixPath elsewhere',
    'Added':       '3.8 (docs)',
  },

  related: [
    { name: 'io.open', slug: 'open', when: "open(path, 'rb') — what it does without a hook" },
    { name: 'BufferedReader', slug: 'bufferedreader', when: 'What it returns' },
    { name: 'compile()', slug: 'compile', when: 'Turn the bytes into a code object', category: 'functions' },
    { name: 'exec()', slug: 'exec', when: 'Run the compiled code', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is io.open_code for?',
      a: "It is open(path, 'rb') for files that are about to be executed. Embedding applications can register a hook (PyFile_SetOpenCodeHook) to check or transform such files; importlib uses open_code, and your own loaders should too.",
    },
    {
      q: 'Why does open_code reject my Path object?',
      a: 'Its argument must be a str. Pass str(path) or os.fspath(path), ideally of an absolute path as the docs request.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.open_code',
    meta:  'io.open_code',
  },

};
