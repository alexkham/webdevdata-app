// content/reference/python/stdlib/os/environ.js

export const meta = {
  slug:        'environ',
  name:        'os.environ',
  signature:   'os.environ / os.getenv(key, default=None) / os.putenv(key, value) / os.unsetenv(key)',
  blurb:       'The process environment as a str → str mapping. Read with os.environ[key] or os.getenv(key, default); set and delete through os.environ so child processes inherit the change.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.0+ (environb, getenvb, supports_bytes_environ 3.2+)',
  searchTerms: 'os.environ environ os.getenv getenv environment variables python read environment variable set environment variable putenv os.putenv unsetenv os.unsetenv environb os.environb getenvb os.getenvb supports_bytes_environ os.supports_bytes_environ env var default keyerror dotenv',
};

export const method = {
  slug:      'environ',
  name:      'os.environ',
  signature: 'os.environ / os.getenv(key, default=None) / os.putenv(key, value) / os.unsetenv(key)',
  returns:   { type: 'str | None', desc: 'os.environ[key] returns the str value (KeyError when unset); getenv returns the value, or default (None) when unset.' },

  category:    'os mapping',
  version:     'Python 3.0+ (environb, getenvb, supports_bytes_environ 3.2+)',
  hasLiveDemo: true,

  subtitle: 'os.environ is a dict-like snapshot of the environment taken when os is imported. Changing it also changes the real process environment, so subprocesses see the update. Values are always str: convert numbers and flags yourself.',

  covers: ['environ', 'environb', 'getenv', 'getenvb', 'putenv', 'unsetenv', 'supports_bytes_environ'],

  cheat: {
    commonCall: "os.environ.get('PORT', '8000')",
    returns:    "the value as str, or the default",
    replaces:   'Hard-coded secrets and settings in source code',
    watchOut:   "Missing keys raise KeyError with os.environ[...]; values are always str ('0' is truthy)",
  },

  parameters: [
    { name: 'key',     type: 'str', required: true,  default: null,   desc: 'The variable name. On Linux and macOS names are case-sensitive; on Windows os.environ upper-cases them, so lookups ignore case.' },
    { name: 'default', type: 'any', required: false, default: 'None', desc: 'getenv only: returned when the variable is not set. Not converted to str.' },
    { name: 'value',   type: 'str', required: true,  default: null,   desc: 'putenv / os.environ[key] = value: must be a str — anything else raises TypeError.' },
  ],

  modes: [
    {
      id: 'read',
      label: 'read a variable',
      blurb: "A fixed two-variable environment. Look up a name with [ ], getenv and getenv with a default.",
      params: [{ name: 'name', type: 'str', hint: 'variable name', input: 'text' }],
      template: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'HOME': '/home/ada', 'LANG': 'C.UTF-8'}, clear=True):\n    try:\n        item = os.environ[{$name}]\n    except KeyError as e:\n        item = f'KeyError: {e}'\n    result = (item, os.getenv({$name}), os.getenv({$name}, 'default'))\nresult",
      cases: [
        { id: 'set',   label: 'set',       values: { name: 'HOME' } },
        { id: 'unset', label: 'not set',   values: { name: 'API_TOKEN' } },
        { id: 'empty', label: 'empty name', values: { name: '' } },
      ],
    },
    {
      id: 'write',
      label: 'set a variable',
      blurb: 'Assign through os.environ inside a cleared, temporary environment. Digits are typed as an int.',
      params: [{ name: 'value', type: 'str', hint: 'value for LOG_LEVEL', input: 'auto' }],
      template: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, clear=True):\n    os.environ['LOG_LEVEL'] = {$value}\n    result = (os.environ['LOG_LEVEL'], 'LOG_LEVEL' in os.environ, len(os.environ))\nresult",
      cases: [
        { id: 'str',   label: 'text',     values: { value: 'debug' } },
        { id: 'int',   label: 'a number', values: { value: '10' } },
        { id: 'float', label: 'a float',  values: { value: '1.5' } },
      ],
    },
    {
      id: 'pop',
      label: 'remove a variable',
      blurb: 'pop(name, None) removes a variable if it is set — the safe form of del os.environ[name].',
      params: [{ name: 'name', type: 'str', hint: 'variable to remove', input: 'text' }],
      template: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'TOKEN': 'abc', 'HOME': '/home/ada'}, clear=True):\n    removed = os.environ.pop({$name}, None)\n    result = (removed, sorted(os.environ))\nresult",
      cases: [
        { id: 'there', label: 'set',     values: { name: 'TOKEN' } },
        { id: 'gone',  label: 'not set', values: { name: 'SECRET' } },
      ],
    },
  ],
  demoExplainer: "Each tab works on a temporary environment (mock.patch.dict(..., clear=True) restores the real one afterwards), so the result does not depend on your machine. A missing name: os.environ[name] raises KeyError, getenv returns None or your default. In the second tab text is stored as-is, while 10 and 1.5 arrive as an int and a float, and os.environ refuses them with TypeError: str expected, not int (or float). On Windows os.environ upper-cases names, so os.environ['home'] finds HOME there but raises KeyError on Linux and macOS.",

  patterns: [
    {
      name: 'Typed settings with defaults',
      desc: 'Read once, convert explicitly, fail early on bad values.',
      code: "import os\nPORT = int(os.environ.get('PORT', '8000'))\nDEBUG = os.environ.get('DEBUG', '0') in ('1', 'true', 'yes')\nDATABASE_URL = os.environ['DATABASE_URL']  # required: KeyError if missing",
    },
    {
      name: 'Run a child with an extra variable',
      desc: 'Pass a modified copy instead of changing your own environment.',
      code: "import os, subprocess\nsubprocess.run(['make', 'test'], env={**os.environ, 'CI': '1'}, check=True)",
    },
    {
      name: 'Temporarily set variables in a test',
      desc: 'patch.dict restores os.environ (and the real environment) on exit.',
      code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'APP_ENV': 'test'}):\n    run_app()",
    },
    {
      name: 'Bytes environment (POSIX)',
      desc: 'environb / getenvb give raw bytes where values are not valid in the file system encoding.',
      code: "import os\nif os.supports_bytes_environ:\n    raw = os.environb.get(b'LANG')",
    },
  ],

  examples: [
    { title: 'A mutable mapping',                code: 'import os\nfrom collections.abc import MutableMapping\nisinstance(os.environ, MutableMapping)', returns: 'True' },
    { title: 'Default for a missing variable',   code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, clear=True):\n    token = os.getenv('API_TOKEN', '')\ntoken", returns: "''" },
    { title: 'Child processes inherit the environment you pass', code: "import os, subprocess, sys\nchild = \"import os; print(os.environ['GREETING'])\"\nsubprocess.run([sys.executable, '-c', child], env={**os.environ, 'GREETING': 'hi'}, capture_output=True, text=True).stdout", returns: "'hi\\n'" },
    { title: 'Append to PATH portably',          code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'PATH': '/usr/bin'}, clear=True):\n    os.environ['PATH'] += os.pathsep + '/opt/tool/bin'\n    parts = os.environ['PATH'].split(os.pathsep)\nparts", returns: "['/usr/bin', '/opt/tool/bin']" },
    { title: 'putenv does not update os.environ', code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ):\n    os.putenv('ONLY_PUTENV_X1', '1')\n    seen = 'ONLY_PUTENV_X1' in os.environ\n    os.unsetenv('ONLY_PUTENV_X1')\nseen", returns: 'False' },
    { title: 'copy() gives a plain dict',        code: 'import os\ntype(os.environ.copy()).__name__', returns: "'dict'" },
    { title: 'Bytes environment: POSIX only',    code: "import os\n(os.supports_bytes_environ == (os.name != 'nt'), hasattr(os, 'environb') == os.supports_bytes_environ)", returns: '(True, True)' },
  ],

  pitfalls: [
    {
      name: 'Indexing a variable that may be unset',
      desc: 'os.environ[name] raises KeyError. Use getenv / environ.get with a default unless the variable is truly required.',
      wrong: { label: "os.environ['API_TOKEN']", code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, clear=True):\n    os.environ['API_TOKEN']", output: "KeyError: 'API_TOKEN'" },
      fix:   { label: 'getenv with default', code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, clear=True):\n    token = os.getenv('API_TOKEN', 'none')\ntoken", output: "'none'" },
    },
    {
      name: 'Treating the string "0" as False',
      desc: "Every non-empty string is truthy — DEBUG=0 is still True under bool(). Compare with the values you accept.",
      wrong: { label: 'bool(getenv(...))', code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'DEBUG': '0'}):\n    debug = bool(os.getenv('DEBUG'))\ndebug", output: 'True' },
      fix:   { label: "== '1'", code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'DEBUG': '0'}):\n    debug = os.getenv('DEBUG', '0') == '1'\ndebug", output: 'False' },
    },
    {
      name: 'Storing a number',
      desc: 'Environment values are strings in the OS itself, so os.environ only accepts str.',
      wrong: { label: 'int value', code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ):\n    os.environ['WORKERS'] = 4", output: 'TypeError: str expected, not int' },
      fix:   { label: 'str value', code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ):\n    os.environ['WORKERS'] = str(4)\n    workers = int(os.environ['WORKERS'])\nworkers", output: '4' },
    },
  ],

  when: {
    use: [
      'Configuration and secrets supplied by the deployment (12-factor style)',
      'Passing settings to child processes',
    ],
    avoid: [
      'Structured or large configuration → a config file (tomllib, json)',
      'Values shared between running processes — each process has its own copy',
      'Changing the environment for one subprocess → pass env= to subprocess.run instead',
    ],
  },

  notes: {
    cpython:        'os._Environ in Lib/os.py: a MutableMapping over a dict captured at import; __setitem__ calls putenv and __delitem__ calls unsetenv, so the real environment follows',
    'Snapshot':     'Changes made by putenv directly, or by C code, are not reflected in os.environ',
    'Windows':      'Keys are upper-cased (os.environ is case-insensitive there); supports_bytes_environ is False and environb / getenvb do not exist',
    'putenv / unsetenv': 'Always available since 3.9 (unsetenv on Windows too); getenvb and environb are Unix only',
  },

  related: [
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
    { name: 'os.path.expandvars', slug: 'expanduser', when: 'Substitute $VAR in a string', category: 'stdlib/os-path' },
    { name: 'os.pathsep', slug: 'sep', when: 'The PATH separator (: or ;)' },
    { name: 'KeyError', slug: 'keyerror', when: 'What a missing variable raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between os.environ.get and os.getenv?',
      a: 'None in practice: os.getenv(key, default) is os.environ.get(key, default). Both return None (or the default) for a missing variable, while os.environ[key] raises KeyError.',
    },
    {
      q: 'How do I set an environment variable in Python?',
      a: "os.environ['NAME'] = 'value' (a str). It affects this process and every child it starts afterwards — never the parent shell that launched Python.",
    },
    {
      q: 'Why does my environment variable change not show up in the terminal?',
      a: 'Each process has its own environment, copied from its parent at start. A Python script cannot change the environment of the shell that ran it; print the values and have the shell export them instead.',
    },
    {
      q: 'Are environment variable names case-sensitive?',
      a: 'On Linux and macOS, yes: HOME and home are different variables. On Windows os.environ upper-cases names, so lookups are case-insensitive.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.environ',
    meta:  'os.environ / getenv / putenv / unsetenv',
  },
};
