// content/reference/python/stdlib/sys/flags.js — command-line flags and related settings

export const meta = {
  slug:        'flags',
  name:        'sys.flags / dont_write_bytecode / pycache_prefix / warnoptions',
  signature:   'sys.flags · sys.dont_write_bytecode: bool · sys.pycache_prefix: str | None · sys.warnoptions: list[str]',
  blurb:       'How the interpreter was started: sys.flags is a read-only named tuple of the command-line options (-O, -B, -I, -X dev …); dont_write_bytecode and pycache_prefix control .pyc files; warnoptions holds the -W filters.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'flags 2.6+ · dont_write_bytecode 2.6+ · pycache_prefix 3.8+ · warnoptions 2.1+',
  searchTerms: 'sys.flags flags sys.dont_write_bytecode dont_write_bytecode sys.pycache_prefix pycache_prefix sys.warnoptions warnoptions command line options python -O optimize -B no pyc files -W error dev mode utf8 mode isolated safe_path PYTHONDONTWRITEBYTECODE PYTHONPYCACHEPREFIX __pycache__',
};

export const method = {
  slug:      'flags',
  name:      'sys.flags / dont_write_bytecode / pycache_prefix / warnoptions',
  signature: 'sys.flags · sys.dont_write_bytecode: bool · sys.pycache_prefix: str | None · sys.warnoptions: list[str]',
  returns:   { type: 'named tuple · bool · str | None · list[str]', desc: 'flags: optimize, dont_write_bytecode, isolated, dev_mode, utf8_mode, safe_path, int_max_str_digits …' },

  category:    'sys attribute',
  version:     'flags 2.6+ · dont_write_bytecode 2.6+ · pycache_prefix 3.8+ · warnoptions 2.1+',
  hasLiveDemo: false,

  subtitle: 'Options and environment variables (PYTHONOPTIMIZE, PYTHONDONTWRITEBYTECODE …) both end up here, so the values describe this particular run. The examples start child interpreters with -E (ignore PYTHON* variables) to get the same answer on every machine.',

  covers: ['flags', 'dont_write_bytecode', 'pycache_prefix', 'warnoptions'],

  cheat: {
    commonCall: 'sys.flags.optimize',
    returns:    '0 normally, 1 with -O, 2 with -OO',
    replaces:   'Parsing sys.orig_argv for interpreter options',
    watchOut:   'sys.flags is read-only; sys.dont_write_bytecode is the one you may set',
  },

  parameters: [],

  patterns: [
    {
      name: 'Asserts are gone under -O',
      desc: 'Never rely on assert for checks that must run in production.',
      code: "import sys\nif sys.flags.optimize:\n    print('assert statements are disabled', file=sys.stderr)",
    },
    {
      name: 'No .pyc files from this process on',
      desc: 'Useful for read-only installs or test runs.',
      code: 'import sys\nsys.dont_write_bytecode = True',
    },
    {
      name: 'Keep .pyc files out of the source tree',
      desc: 'A parallel cache directory (3.8+).',
      code: '# shell:\n# PYTHONPYCACHEPREFIX=/tmp/pycache python app.py\n# python -X pycache_prefix=/tmp/pycache app.py',
    },
    {
      name: 'Turn warnings into errors in CI',
      desc: '-W error ends up in sys.warnoptions and the warnings filters.',
      code: '# shell:\n# python -W error -m pytest',
    },
  ],

  examples: [
    { title: 'A named tuple of options',   code: "import sys\n(type(sys.flags).__name__, hasattr(sys.flags, 'optimize'))", returns: "('flags', True)" },
    { title: '-O and -OO',                 code: "import subprocess, sys\nshow = 'import sys; print(sys.flags.optimize)'\n[subprocess.run([sys.executable, '-E', *opt, '-c', show], capture_output=True, text=True).stdout.strip() for opt in ([], ['-O'], ['-OO'])]", returns: "['0', '1', '2']" },
    { title: '-B sets dont_write_bytecode', code: "import subprocess, sys\nshow = 'import sys; print(sys.dont_write_bytecode, sys.flags.dont_write_bytecode)'\n[subprocess.run([sys.executable, '-E', *opt, '-c', show], capture_output=True, text=True).stdout.strip() for opt in ([], ['-B'])]", returns: "['False 0', 'True 1']" },
    { title: '-W options land in warnoptions', code: "import subprocess, sys\np = subprocess.run([sys.executable, '-E', '-W', 'error', '-c', 'import sys; print(sys.warnoptions)'], capture_output=True, text=True)\np.stdout.strip()", returns: "\"['error']\"" },
    { title: 'Development mode',           code: "import subprocess, sys\np = subprocess.run([sys.executable, '-E', '-X', 'dev', '-c', 'import sys; print(sys.flags.dev_mode, sys.warnoptions)'], capture_output=True, text=True)\np.stdout.strip()", returns: "\"True ['default']\"" },
    { title: 'pycache_prefix from -X',     code: "import subprocess, sys\np = subprocess.run([sys.executable, '-E', '-X', 'pycache_prefix=cache', '-c', 'import sys; print(sys.pycache_prefix)'], capture_output=True, text=True)\np.stdout.strip()", returns: "'cache'" },
    { title: 'sys.flags cannot be changed', code: 'import sys\nsys.flags.optimize = 2', returns: 'AttributeError: readonly attribute' },
  ],

  pitfalls: [
    {
      name: 'Validating with assert',
      desc: 'python -O removes assert statements, so the check silently disappears. Raise an exception instead.',
      wrong: { label: 'assert under -O', code: "import subprocess, sys\ncode = 'n = -1\\nassert n >= 0, \"negative\"\\nprint(\"no error\")'\np = subprocess.run([sys.executable, '-E', '-O', '-c', code], capture_output=True, text=True)\np.stdout.strip()", output: "'no error'" },
      fix:   { label: 'raise', code: "import subprocess, sys\ncode = 'n = -1\\nif n < 0:\\n    raise ValueError(\"negative\")'\np = subprocess.run([sys.executable, '-E', '-O', '-c', code], capture_output=True, text=True)\np.stderr.splitlines()[-1]", output: "'ValueError: negative'" },
    },
    {
      name: 'Trying to change an option through sys.flags',
      desc: 'The named tuple only reports. Settings that can change at run time have their own attribute or API (dont_write_bytecode, warnings.simplefilter).',
      wrong: { label: 'sys.flags.…', code: 'import sys\nsys.flags.dont_write_bytecode = 1', output: 'AttributeError: readonly attribute' },
      fix:   { label: 'sys.dont_write_bytecode', code: 'import sys\nold = sys.dont_write_bytecode\nsys.dont_write_bytecode = True\ntry:\n    result = sys.dont_write_bytecode\nfinally:\n    sys.dont_write_bytecode = old\nresult', output: 'True' },
    },
  ],

  when: {
    use: [
      'Adapting behaviour to -O, -I, dev mode or UTF-8 mode',
      'Diagnostics: logging the interpreter options of a run',
      'Controlling .pyc writing (dont_write_bytecode, pycache_prefix)',
    ],
    avoid: [
      'Your own program options → argparse on sys.argv',
      'Changing warning filters → the warnings module',
      'The raw -X options → sys._xoptions (CPython detail)',
    ],
  },

  notes: {
    cpython:          'Filled from PyConfig at startup (Python/sysmodule.c, set_flags_from_config); environment variables such as PYTHONOPTIMIZE and PYTHONDONTWRITEBYTECODE set the same fields as the options',
    'Fields (3.13)':  'debug, inspect, interactive, optimize, dont_write_bytecode, no_user_site, no_site, ignore_environment, verbose, bytes_warning, quiet, hash_randomization, isolated, dev_mode, utf8_mode, warn_default_encoding, safe_path, int_max_str_digits — plus gil (-X gil), an attribute outside the tuple that is 1 on standard builds',
    'warnoptions':    'An implementation detail of the warnings framework — read it, do not modify it',
    'dev mode':       "-X dev enables extra runtime checks and adds 'default' to warnoptions so warnings are shown",
  },

  related: [
    { name: 'sys.argv / orig_argv', slug: 'argv', when: 'The command line itself' },
    { name: 'sys.prefix / executable', slug: 'prefix', when: 'Where the interpreter lives' },
    { name: 'sys.set_int_max_str_digits', slug: 'set_int_max_str_digits', when: 'flags.int_max_str_digits at run time' },
    { name: 'assert', slug: 'assert', when: 'Removed by -O', category: 'keywords' },
    { name: 'sys module', slug: 'sys', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if Python was started with -O?',
      a: 'sys.flags.optimize is 1 for -O and 2 for -OO (0 otherwise). The PYTHONOPTIMIZE environment variable sets it too. Under -O, assert statements and if __debug__: blocks are removed.',
    },
    {
      q: 'How do I stop Python from writing .pyc files?',
      a: 'Start it with -B or set PYTHONDONTWRITEBYTECODE=1; from inside the program set sys.dont_write_bytecode = True before the imports. To keep them but elsewhere, use PYTHONPYCACHEPREFIX (3.8+).',
    },
    {
      q: 'What is in sys.flags?',
      a: 'One field per interpreter option: optimize (-O), dont_write_bytecode (-B), isolated (-I), dev_mode (-X dev), utf8_mode (-X utf8), safe_path (-P), int_max_str_digits and more. It reflects the current run and cannot be modified.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.flags',
    meta:  'sys.flags',
  },
};
