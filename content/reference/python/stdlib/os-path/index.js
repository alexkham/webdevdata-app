// content/reference/python/stdlib/os-path/index.js — the os.path module hub

export const meta = {
  slug:        'index',
  name:        'os.path',
  signature:   'import os.path',
  blurb:       'Path strings without objects: join, split, splitext, basename/dirname, normpath, abspath — plus exists, isfile, isdir and getsize for asking the file system.',
  category:    'files',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path module python os path join split splitext basename dirname exists isfile isdir abspath normpath relpath getsize posixpath ntpath path manipulation file extension',
};

export const method = {
  slug: 'index',
  name: 'os.path',

  category:    'Files and directories',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'os.path is not one module but two: posixpath on Linux and macOS, ntpath on Windows. Same function names, different rules for separators and drives. Paths are plain strings in, plain strings out — most functions never touch the disk.',

  imports: ['import os', 'import os.path', 'from os import path', 'import posixpath, ntpath'],
  facts: [
    { label: 'Really is',   value: "posixpath on Linux/macOS ('/' only), ntpath on Windows ('\\' and '/', drive letters, UNC shares)" },
    { label: 'Pure string functions', value: 'join, split, splitext, basename, dirname, normpath, normcase, isabs, splitdrive, splitroot, commonpath, commonprefix' },
    { label: 'Ask the disk', value: 'exists, lexists, isfile, isdir, islink, ismount, isjunction, getsize, getmtime, getatime, getctime, samefile' },
    { label: 'Also depend on the machine', value: 'abspath and relpath (current directory), realpath (symlinks), expanduser and expandvars (environment)' },
  ],

  modes: [
    {
      id: 'anatomy',
      label: 'anatomy',
      blurb: 'The folder, the file name and the extension of a POSIX path — the three functions you use most.',
      params: [{ name: 'path', type: 'str', hint: 'a POSIX path', input: 'text' }],
      template: 'import posixpath\np = {$path}\n(posixpath.dirname(p), posixpath.basename(p), posixpath.splitext(p)[1])',
      cases: [
        { id: 'file',  label: 'file',          values: { path: '/home/ada/report.pdf' } },
        { id: 'targz', label: 'double suffix', values: { path: 'backups/site.tar.gz' } },
        { id: 'dot',   label: 'dotfile',       values: { path: '/home/ada/.bashrc' } },
        { id: 'slash', label: 'trailing /',    values: { path: '/var/log/' } },
      ],
    },
    {
      id: 'join',
      label: 'join',
      blurb: 'Glue components with the separator. An absolute component throws away everything before it.',
      params: [{ name: 'parts', type: 'list[str]', hint: 'components, comma-separated', input: 'csv' }],
      template: 'import posixpath\nposixpath.join(*{$parts})',
      cases: [
        { id: 'plain', label: 'plain',          values: { parts: '/srv, app, static, logo.png' } },
        { id: 'abs',   label: 'absolute later', values: { parts: '/srv/app, /etc/passwd' } },
        { id: 'end',   label: 'empty last',     values: { parts: 'build, ' } },
      ],
    },
    {
      id: 'exists',
      label: 'exists / isfile / isdir',
      blurb: 'Create a few empty files (folders on the way), then ask the file system about one path.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'query', type: 'str',       hint: 'path to check',                    input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\n(os.path.exists({$query}), os.path.isfile({$query}), os.path.isdir({$query}))",
      cases: [
        { id: 'file', label: 'a file',   values: { files: 'setup.cfg, src/app.py', query: 'src/app.py' } },
        { id: 'dir',  label: 'a folder', values: { files: 'setup.cfg, src/app.py', query: 'src' } },
        { id: 'miss', label: 'missing',  values: { files: 'setup.cfg, src/app.py', query: 'src/main.py' } },
      ],
    },
  ],
  demoExplainer: "The first two tabs import posixpath directly so they print the same on every computer (on Windows, os.path.join would use '\\'). splitext keeps only the last extension — '.gz' for site.tar.gz — and a leading dot is not an extension, so '.bashrc' has none. A trailing slash makes the basename empty: dirname('/var/log/') is '/var/log'. In join, '/etc/passwd' is absolute, so '/srv/app' is discarded; an empty last component adds a trailing separator. The exists tab touches a real (virtual) folder: missing paths give False, never an error.",

  patterns: [
    {
      name: 'Build a path next to this script',
      desc: 'Resolve data files relative to the source file, not the current directory.',
      code: "import os\nHERE = os.path.dirname(os.path.abspath(__file__))\nconfig_path = os.path.join(HERE, 'config.toml')",
    },
    {
      name: 'Change a file extension',
      desc: 'splitext gives (root, ext); glue a new extension to the root.',
      code: "import os\nroot, ext = os.path.splitext(filename)\nout = root + '.json'",
    },
    {
      name: 'Process files only',
      desc: 'listdir returns names; join them with the folder before asking isfile.',
      code: "import os\nfiles = [n for n in os.listdir(folder) if os.path.isfile(os.path.join(folder, n))]",
    },
    {
      name: 'Show Windows paths from any OS',
      desc: 'ntpath and posixpath can be imported everywhere; they are pure string logic.',
      code: "import ntpath\nntpath.join('C:\\\\Users', 'ada', 'notes.txt')",
    },
  ],

  examples: [
    { title: 'Join POSIX components',          code: "import posixpath\nposixpath.join('/home/ada', 'docs', 'report.pdf')", returns: "'/home/ada/docs/report.pdf'" },
    { title: 'Folder, name and extension',     code: "import posixpath\np = '/home/ada/report.pdf'\n(posixpath.dirname(p), posixpath.basename(p), posixpath.splitext(p)[1])", returns: "('/home/ada', 'report.pdf', '.pdf')" },
    { title: 'Only the last extension',        code: "import posixpath\nposixpath.splitext('archive.tar.gz')", returns: "('archive.tar', '.gz')" },
    { title: 'Normalize . and ..',             code: "import posixpath\nposixpath.normpath('a//b/./c/../d')", returns: "'a/b/d'" },
    { title: 'os.path is one of the two',      code: "import os, posixpath, ntpath\nos.path is (ntpath if os.name == 'nt' else posixpath)", returns: 'True' },
    { title: 'Asking the file system',         code: "import os\nopen('notes.txt', 'w').close()\n(os.path.exists('notes.txt'), os.path.isfile('notes.txt'), os.path.isdir('notes.txt'))", returns: '(True, True, False)' },
    { title: 'Windows rules, on any OS',       code: "import ntpath\nntpath.join('C:\\\\Users\\\\ada', 'notes.txt')", returns: "'C:\\\\Users\\\\ada\\\\notes.txt'" },
  ],

  pitfalls: [
    {
      name: 'An absolute second argument wins',
      desc: 'join discards everything before an absolute component — dangerous with user-supplied names.',
      wrong: { label: 'join with /etc/passwd', code: "import posixpath\nposixpath.join('/srv/uploads', '/etc/passwd')", output: "'/etc/passwd'" },
      fix:   { label: 'check the result stays inside', code: "import posixpath\nbase = '/srv/uploads'\np = posixpath.normpath(posixpath.join(base, '/etc/passwd'))\nposixpath.commonpath([base, p]) == base", output: 'False' },
    },
    {
      name: 'Building paths with + and a hard-coded slash',
      desc: "String concatenation doubles or forgets separators; join inserts exactly one, and only when needed.",
      wrong: { label: "+ '/' +", code: "folder = 'logs/'\nfolder + '/' + 'app.log'", output: "'logs//app.log'" },
      fix:   { label: 'join', code: "import posixpath\nposixpath.join('logs/', 'app.log')", output: "'logs/app.log'" },
    },
  ],

  when: {
    use: [
      'Code that already passes str paths around (os.listdir, os.walk results, argv)',
      'Quick one-off string operations: extension, folder, file name',
    ],
    avoid: [
      'New code that does a lot with paths → pathlib.Path has all of this as methods and properties',
      'URLs → urllib.parse (and posixpath only for the path part)',
      'Checking before acting (exists then open) → just open and catch FileNotFoundError',
    ],
  },

  notes: {
    cpython:   'Lib/posixpath.py and Lib/ntpath.py, both built on Lib/genericpath.py (exists, isfile, isdir, getsize, commonprefix, samefile …). os.py picks one at import: sys.modules["os.path"] = posixpath or ntpath',
    'Speed':   'normpath, splitroot (and on Windows a few more) have C implementations in Modules/posixmodule.c',
    'Bytes':   'Every function also accepts bytes and then returns bytes; mixing str and bytes raises TypeError',
  },

  related: [
    { name: 'os module',  slug: 'os',      when: 'listdir, walk, makedirs, remove', category: 'stdlib' },
    { name: 'pathlib',    slug: 'pathlib', when: 'Object-oriented paths', category: 'stdlib' },
    { name: 'os.path.join', slug: 'join',  when: 'Combine components' },
    { name: 'os.path.exists', slug: 'exists', when: 'exists, isfile, isdir' },
  ],

  faq: [
    {
      q: 'Is os.path different on Windows?',
      a: "Yes — it is ntpath there and posixpath on Linux and macOS. ntpath accepts both \\ and /, knows drive letters and UNC shares, and joins with \\. To get the same result everywhere, import posixpath or ntpath explicitly.",
    },
    {
      q: 'Should I use os.path or pathlib?',
      a: "pathlib for new code: Path('a') / 'b', p.suffix, p.exists() read better and work with every os function. os.path is still everywhere in existing code and is fine for quick string operations.",
    },
    {
      q: 'Does os.path.join check that the path exists?',
      a: 'No. join, split, splitext, basename, dirname and normpath only manipulate the string. exists, isfile, isdir, getsize and friends are the ones that ask the file system.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html',
    meta:  'os.path — Common pathname manipulations',
  },
};
