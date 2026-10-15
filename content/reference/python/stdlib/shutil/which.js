// content/reference/python/stdlib/shutil/which.js

export const meta = {
  slug:        'which',
  name:        'shutil.which',
  signature:   'shutil.which(cmd, mode=os.F_OK | os.X_OK, path=None)',
  blurb:       'Find the program that would run for a command name — searching PATH like a shell does — and return its path, or None if there is none.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'shutil which find executable python check if program installed command exists path lookup PATH PATHEXT where which command windows .exe x_ok returns none',
};

export const method = {
  slug:      'which',
  name:      'shutil.which',
  signature: 'shutil.which(cmd, mode=os.F_OK | os.X_OK, path=None)',
  returns:   { type: 'str | bytes | None', desc: 'The path of the first match (same type as cmd), or None.' },

  category:    'shutil function',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: 'The which command as a function. It splits PATH (or your path=), tries each folder in order and returns the first file that passes os.access(mode) and is not a folder. On Windows it also tries every PATHEXT extension. What it finds depends entirely on the machine, so this page has no live demo.',

  covers: ['which'],

  cheat: {
    commonCall: "shutil.which('git')",
    returns:    "'/usr/bin/git' — or None",
    replaces:   'subprocess.run(["which", …]) / where.exe',
    watchOut:   'Returns None instead of raising; check before you run the program',
  },

  parameters: [
    { name: 'cmd',  type: 'str | bytes', required: true,  default: null, desc: 'A command name (git) or a path with a folder part (./build.sh), which is checked directly without searching PATH.' },
    { name: 'mode', type: 'int',         required: false, default: 'os.F_OK | os.X_OK', desc: 'The os.access mask a candidate must pass — by default: exists and is executable.' },
    { name: 'path', type: 'str | None',  required: false, default: 'None', desc: 'An os.pathsep-separated folder list to search instead of the PATH environment variable. An empty string finds nothing.' },
  ],

  patterns: [
    {
      name: 'Fail early if a tool is missing',
      desc: 'Clearer than a FileNotFoundError from subprocess later.',
      code: "import shutil, subprocess\nffmpeg = shutil.which('ffmpeg')\nif ffmpeg is None:\n    raise SystemExit('Please install ffmpeg')\nsubprocess.run([ffmpeg, '-i', 'in.mov', 'out.mp4'], check=True)",
    },
    {
      name: 'Pick the first available program',
      desc: 'Fallbacks in order of preference.',
      code: "import shutil\neditor = next((p for p in map(shutil.which, ['code', 'vim', 'nano']) if p), None)",
    },
    {
      name: 'Search only a project folder',
      desc: 'path= replaces PATH entirely.',
      code: "import os, shutil\ntool = shutil.which('mytool', path=os.pathsep.join(['./bin', './scripts']))",
    },
  ],

  examples: [
    { title: 'A command that does not exist', code: "import shutil\nshutil.which('surely-not-a-real-command-xyz') is None", returns: 'True' },
    { title: 'An empty path finds nothing', code: "import shutil\nshutil.which('python', path='') is None", returns: 'True' },
    { title: 'A folder part skips the PATH search', code: "import shutil\nshutil.which('./missing-tool') is None", returns: 'True' },
    { title: 'bytes in, bytes (or None) out', code: "import shutil\nshutil.which(b'surely-not-a-real-command-xyz') is None", returns: 'True' },
    { title: 'Search a folder you control', code: "import os, shutil\nos.mkdir('bin')\nopen('bin/tool.bat', 'w').close()\nos.chmod('bin/tool.bat', 0o755)\nshutil.which('tool.bat', path='bin').replace(os.sep, '/')", returns: "'bin/tool.bat'" },
  ],

  pitfalls: [
    {
      name: 'Running a command without checking which() first',
      desc: 'subprocess raises FileNotFoundError for a missing program; which() lets you give a clear message instead.',
      wrong: { label: 'just run it', code: "import subprocess\ntry:\n    subprocess.run(['surely-not-a-real-command-xyz'])\nexcept FileNotFoundError:\n    result = 'crashed with FileNotFoundError'\nresult", output: "'crashed with FileNotFoundError'" },
      fix:   { label: 'which() first', code: "import shutil\nexe = shutil.which('surely-not-a-real-command-xyz')\n'please install it' if exe is None else exe", output: "'please install it'" },
    },
  ],

  when: {
    use: [
      'Checking whether a command-line tool is installed',
      'Getting the absolute path of a program before running it',
    ],
    avoid: [
      'Finding Python modules → importlib.util.find_spec',
      'Finding the running interpreter → sys.executable',
    ],
  },

  notes: {
    cpython:      'Lib/shutil.py: split the folder part of cmd; otherwise search os.environ["PATH"] (fallback: os.confstr("CS_PATH") or os.defpath); each candidate must exist, pass os.access(mode) and not be a folder',
    'Unix':       'X_OK means an execute bit: a plain file without one is skipped (checked on Linux: a non-executable bin/noexec.bat gives None)',
    'Windows':    'os.access has no execute bits, so every candidate that exists passes. With X_OK in mode (the default) the candidates are cmd plus each PATHEXT extension (default .COM;.EXE;.BAT;.CMD;.VBS;.JS;.WS;.MSC), and cmd on its own only if it already ends with one of them — checked on CPython 3.13: a file named plain in bin gave None, with mode=os.F_OK bin\\plain. The result uses backslashes (bin\\tool.bat)',
    '3.12':       'On Windows: PATHEXT is used even when cmd has a folder part or an extension, and the current folder is no longer searched first when NeedCurrentDirectoryForExePathW says not to',
  },

  related: [
    { name: 'os.access',   slug: 'access',  when: 'The mode check it performs', category: 'stdlib/os' },
    { name: 'os.environ',  slug: 'environ', when: 'Where PATH comes from', category: 'stdlib/os' },
    { name: 'ExecError',   slug: 'execerror', when: 'Not raised — which returns None instead' },
    { name: 'shutil module', slug: 'shutil', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if a program is installed in Python?',
      a: "shutil.which('name') returns its full path if it is on PATH and executable, otherwise None: if shutil.which('git') is None: … — no subprocess call needed. This page has no live demo because the answer depends on the programs installed and the PATH of the machine running the code; the examples only search for names that cannot exist or in a folder they create themselves.",
    },
    {
      q: 'Why does shutil.which return None for my script?',
      a: 'On Linux and macOS the file needs an execute bit (chmod +x) and must be in a PATH folder — or call it with a folder part like ./script.sh. On Windows its extension must be listed in PATHEXT, or pass the full name with extension.',
    },
    {
      q: 'Does shutil.which search the current folder?',
      a: 'Not on Linux and macOS (unless PATH contains it). On Windows the current folder is searched first when the Windows API says so, as cmd.exe does.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.which',
    meta:  'shutil.which',
  },

};
