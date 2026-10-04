// content/reference/python/stdlib/os-path/expanduser.js — expanduser and expandvars

export const meta = {
  slug:        'expanduser',
  name:        'os.path.expanduser',
  signature:   'os.path.expanduser(path) / os.path.expandvars(path)',
  blurb:       'expanduser() replaces a leading ~ or ~user with a home directory; expandvars() replaces $name and ${name} (and %name% on Windows) with environment variable values. Both return a new string and never touch the disk.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (path-like arguments 3.6+, HOME ignored on Windows 3.8+)',
  searchTerms: 'os.path.expanduser expanduser os.path.expandvars expandvars tilde ~ home directory python expand home path HOME USERPROFILE environment variables $HOME ${VAR} %VAR% expand env vars in path ~user',
};

export const method = {
  slug:      'expanduser',
  name:      'os.path.expanduser',
  signature: 'os.path.expanduser(path) / os.path.expandvars(path)',
  returns:   { type: 'str | bytes', desc: 'The path with ~ (expanduser) or $variables (expandvars) replaced; unchanged when nothing could be expanded.' },

  category:    'os.path function',
  version:     'Python 3 (path-like arguments 3.6+, HOME ignored on Windows 3.8+)',
  hasLiveDemo: false,

  subtitle: "The shell expands ~ and $HOME for you; Python's open() does not. These two functions do the expansion yourself. Both read the environment of the running process, so their result is different on every machine: os.path is posixpath on Linux and macOS (HOME, $name) and ntpath on Windows (USERPROFILE, %name% as well).",

  covers: ['expanduser', 'expandvars'],

  cheat: {
    commonCall: "os.path.expanduser('~/.config/app.toml')",
    returns:    "'/home/ada/.config/app.toml' on Linux (your own home)",
    replaces:   "os.environ['HOME'] + path[1:] and hand-written $VAR substitution",
    watchOut:   'Only a LEADING ~ is expanded, and unknown $VARS stay in the string silently',
  },

  parameters: [
    { name: 'path', type: 'str | bytes | os.PathLike', required: true, default: null, desc: 'The path to expand. A path-like object (3.6+) is accepted; the result is always str or bytes, never a Path.' },
  ],

  patterns: [
    {
      name: 'Config file in the home directory',
      desc: 'The usual first line of a CLI tool that keeps settings under ~.',
      code: "import os\nconfig = os.path.expanduser('~/.config/myapp/config.toml')",
    },
    {
      name: 'Expand both ~ and $VARS from user input',
      desc: 'Run expandvars first, then expanduser, so a value like ~/$PROJECT becomes a full path.',
      code: "import os\n\ndef expand(path):\n    return os.path.expanduser(os.path.expandvars(path))",
    },
    {
      name: 'The pathlib way',
      desc: 'Path.expanduser() and Path.home() do the same lookup; there is no pathlib expandvars.',
      code: "from pathlib import Path\nconfig = Path('~/.config/myapp/config.toml').expanduser()\nhome = Path.home()",
    },
    {
      name: 'Detect that a variable was not set',
      desc: 'expandvars leaves unknown names in place, so check the result (or read os.environ directly).',
      code: "import os\nlog_dir = os.path.expandvars('$APP_LOG_DIR')\nif log_dir.startswith('$'):\n    raise SystemExit('APP_LOG_DIR is not set')",
    },
  ],

  examples: [
    {
      title: 'A leading ~ becomes HOME (posixpath)',
      code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'HOME': '/home/ada'}):\n    result = posixpath.expanduser('~/notes.txt')\nresult",
      returns: "'/home/ada/notes.txt'",
    },
    {
      title: 'Only a leading tilde counts',
      code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'HOME': '/home/ada'}):\n    result = [posixpath.expanduser(p) for p in ['~', 'a/~/b', '/tmp/~x', 'notes/~']]\nresult",
      returns: "['/home/ada', 'a/~/b', '/tmp/~x', 'notes/~']",
    },
    {
      title: 'Windows rules: USERPROFILE (ntpath)',
      code: "import os, ntpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'USERPROFILE': r'C:\\Users\\ada'}):\n    result = [ntpath.expanduser(p) for p in ['~', r'~\\notes.txt']]\nresult",
      returns: "['C:\\\\Users\\\\ada', 'C:\\\\Users\\\\ada\\\\notes.txt']",
    },
    {
      title: 'Windows ~user is a guess next to your own home',
      code: "import os, ntpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'USERPROFILE': r'C:\\Users\\ada', 'USERNAME': 'ada'}):\n    result = ntpath.expanduser('~bob')\nresult",
      returns: "'C:\\\\Users\\\\bob'",
    },
    {
      title: '$name and ${name} (posixpath)',
      code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'APP_DIR': '/srv/app'}):\n    result = [posixpath.expandvars(p) for p in ['$APP_DIR/logs', '${APP_DIR}/logs', '%APP_DIR%/logs']]\nresult",
      returns: "['/srv/app/logs', '/srv/app/logs', '%APP_DIR%/logs']",
    },
    {
      title: 'ntpath also understands %name%',
      code: "import os, ntpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'APP_DIR': r'D:\\app'}):\n    result = [ntpath.expandvars(p) for p in [r'%APP_DIR%\\logs', r'$APP_DIR\\logs', r'${APP_DIR}\\logs']]\nresult",
      returns: "['D:\\\\app\\\\logs', 'D:\\\\app\\\\logs', 'D:\\\\app\\\\logs']",
    },
    {
      title: 'Unknown variables are left alone',
      code: "import posixpath, ntpath\n(posixpath.expandvars('$NO_SUCH_VAR_Q7/x'), ntpath.expandvars('%NO_SUCH_VAR_Q7%'))",
      returns: "('$NO_SUCH_VAR_Q7/x', '%NO_SUCH_VAR_Q7%')",
    },
    {
      title: 'Path-like in, str out',
      code: "import os, posixpath\nfrom pathlib import PurePosixPath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'HOME': '/home/ada'}):\n    result = posixpath.expanduser(PurePosixPath('~/x'))\nresult",
      returns: "'/home/ada/x'",
    },
  ],

  pitfalls: [
    {
      name: 'Expecting open() to understand ~',
      desc: "~ is a shell feature. open('~/notes.txt') looks for a folder literally named ~ in the current directory. Expand it first.",
      wrong: { label: "open('~/...')", code: "try:\n    open('~/notes.txt')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'expanduser first', code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'HOME': '/home/ada'}):\n    result = posixpath.expanduser('~/notes.txt')\nresult", output: "'/home/ada/notes.txt'" },
    },
    {
      name: 'A variable name runs into the following text',
      desc: '$name takes every letter, digit and underscore that follows, so $NAME_backup looks up NAME_backup, which is not set, and stays as it is. Use braces.',
      wrong: { label: '$NAME_backup', code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'NAME': 'ada'}):\n    result = posixpath.expandvars('$NAME_backup')\nresult", output: "'$NAME_backup'" },
      fix:   { label: '${NAME}_backup', code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'NAME': 'ada'}):\n    result = posixpath.expandvars('${NAME}_backup')\nresult", output: "'ada_backup'" },
    },
    {
      name: 'Each function does only its own half',
      desc: 'expanduser ignores $HOME and expandvars ignores ~. Chain them when input can contain both.',
      wrong: { label: 'one call each', code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'HOME': '/home/ada'}):\n    result = posixpath.expanduser('$HOME/x'), posixpath.expandvars('~/x')\nresult", output: "('$HOME/x', '~/x')" },
      fix:   { label: 'chain them', code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'HOME': '/home/ada'}):\n    result = [posixpath.expanduser(posixpath.expandvars(p)) for p in ['$HOME/x', '~/x']]\nresult", output: "['/home/ada/x', '/home/ada/x']" },
    },
  ],

  when: {
    use: [
      'Turning user-typed or config-file paths like ~/data or $XDG_CONFIG_HOME/app into real paths',
      'Building per-user default locations for config, cache and history files',
    ],
    avoid: [
      'Reading one variable → os.environ.get(name) tells you when it is missing',
      'Untrusted input → expandvars can pull any environment value into the path',
      'Object-oriented code → Path.expanduser() / Path.home() (no expandvars equivalent)',
    ],
  },

  notes: {
    cpython:   'Pure Python in Lib/posixpath.py and Lib/ntpath.py; os.path is one of these two modules, chosen when os is imported',
    'Linux and macOS': 'posixpath: ~ uses HOME if set, otherwise the password database (pwd module); ~user is looked up in the password database. If the lookup fails the path comes back unchanged',
    'Windows': 'ntpath: ~ uses USERPROFILE, otherwise HOMEDRIVE + HOMEPATH. HOME is not used since 3.8. ~user only swaps the last folder of your own home for user (if your home ends in USERNAME), so it is a guess, not a lookup',
    expandvars: 'Unknown or malformed names are left unchanged, never an error. ntpath also expands %name% and leaves text inside single quotes alone',
  },

  related: [
    { name: 'os.environ', slug: 'environ', category: 'stdlib/os', when: 'Read and set the variables these functions use' },
    { name: 'Path.expanduser / resolve', slug: 'resolve', category: 'stdlib/pathlib', when: 'The pathlib equivalent' },
    { name: 'os.path.abspath', slug: 'abspath', when: 'Make the expanded path absolute' },
    { name: 'os.path.join', slug: 'join', when: 'Add folders after the home directory' },
    { name: 'os.path module', slug: 'os-path', category: 'stdlib', when: 'All os.path functions' },
  ],

  faq: [
    {
      q: 'Why does the page not show my real home directory?',
      a: 'Because it is different on every machine. The examples set HOME or USERPROFILE inside unittest.mock.patch.dict(os.environ, ...) and call posixpath or ntpath directly, so the output is the same everywhere. In your own code just call os.path.expanduser, which is posixpath.expanduser on Linux and macOS and ntpath.expanduser on Windows.',
    },
    {
      q: 'How do I get the home directory in Python?',
      a: "os.path.expanduser('~') or pathlib.Path.home(). On Linux and macOS that is HOME (or the password database entry), on Windows USERPROFILE.",
    },
    {
      q: 'Why does open("~/file.txt") raise FileNotFoundError?',
      a: 'Python does not expand ~; the shell does that for command lines. Pass the path through os.path.expanduser first.',
    },
    {
      q: 'How do I expand environment variables in a path string?',
      a: "os.path.expandvars('$HOME/logs') or '${HOME}/logs'. On Windows %USERPROFILE% works too. Variables that are not set are left in the string unchanged, without an error.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.expanduser',
    meta:  'os.path.expanduser / expandvars',
  },
};
