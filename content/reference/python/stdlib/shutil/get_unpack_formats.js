// content/reference/python/stdlib/shutil/get_unpack_formats.js

export const meta = {
  slug:        'get_unpack_formats',
  name:        'shutil.get_unpack_formats',
  signature:   'shutil.get_unpack_formats() / shutil.register_unpack_format(name, extensions, function, extra_args=None, description="") / shutil.unregister_unpack_format(name)',
  blurb:       'The registry unpack_archive uses: which formats exist and which file extensions select them, plus registering your own unpacker for new extensions.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'shutil get_unpack_formats register_unpack_format unregister_unpack_format unpack formats extensions custom unpacker registryerror already registered for unpack_archive jar whl extension',
};

export const method = {
  slug:      'get_unpack_formats',
  name:      'shutil.get_unpack_formats',
  signature: 'shutil.get_unpack_formats() / shutil.register_unpack_format(name, extensions, function, extra_args=None, description="") / shutil.unregister_unpack_format(name)',
  returns:   { type: 'list[tuple[str, list[str], str]]', desc: 'get_unpack_formats: sorted (name, extensions, description) triples. The other two return None.' },

  category:    'shutil function',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'unpack_archive walks this registry in insertion order and picks the first format with an extension the file name ends with. Each extension may belong to only one format — registering a taken one raises shutil.RegistryError.',

  covers: ['get_unpack_formats', 'register_unpack_format', 'unregister_unpack_format'],

  cheat: {
    commonCall: "shutil.register_unpack_format('jar', ['.jar'], unpack_jar)",
    returns:    'None',
    replaces:   'An if/elif chain over file extensions',
    watchOut:   'extensions must be a list; a plain str is treated as a sequence of one-letter extensions',
  },

  parameters: [
    { name: 'name',        type: 'str',            required: true,  default: null, desc: 'Format name, usable as unpack_archive(…, format=name).' },
    { name: 'extensions',  type: 'list[str]',      required: true,  default: null, desc: "File name endings that select this format, e.g. ['.jar', '.war']. Each must not be registered yet." },
    { name: 'function',    type: 'callable',       required: true,  default: null, desc: 'Called as function(filename, extract_dir, **extra_args) — plus filter=… if the caller passed one. The built-in unpackers raise shutil.ReadError for files they cannot read; doing the same keeps callers’ except clauses working.' },
    { name: 'extra_args',  type: 'sequence of (name, value)', required: false, default: 'None', desc: 'Extra keyword arguments for every call.' },
    { name: 'description', type: 'str',            required: false, default: "''", desc: 'Shown by get_unpack_formats.' },
  ],

  modes: [
    {
      id: 'register',
      label: 'register extensions',
      blurb: 'Try to register an unpacker for some extensions. On success, list every (name, extensions) pair and unregister again.',
      params: [
        { name: 'name',       type: 'str',       hint: 'format name',                input: 'text' },
        { name: 'extensions', type: 'list[str]', hint: 'extensions, comma-separated', input: 'csv' },
      ],
      template: "import shutil\ndef unpack_custom(filename, extract_dir):\n    pass\ntry:\n    shutil.register_unpack_format({$name}, {$extensions}, unpack_custom)\nexcept shutil.RegistryError as e:\n    result = f'RegistryError: {e}'\nelse:\n    result = [(name, exts) for name, exts, desc in shutil.get_unpack_formats()]\n    shutil.unregister_unpack_format({$name})\nresult",
      cases: [
        { id: 'jar',   label: 'jar',        values: { name: 'jar', extensions: '.jar, .war' } },
        { id: 'taken', label: '.tgz taken', values: { name: 'mytar', extensions: '.tgz' } },
        { id: 'zip',   label: '.zip taken', values: { name: 'zip2', extensions: '.zip' } },
      ],
    },
    {
      id: 'detect',
      label: 'who unpacks this name?',
      blurb: "A spy unpacker is registered for .spy and .dat. No file exists — only the name decides which unpacker runs.",
      params: [{ name: 'filename', type: 'str', hint: 'archive name', input: 'text' }],
      template: "import shutil\ncalls = []\ndef spy(filename, extract_dir):\n    calls.append(filename)\nshutil.register_unpack_format('spy', ['.spy', '.dat'], spy)\ntry:\n    shutil.unpack_archive({$filename}, 'out')\n    result = f'spy got {calls[0]!r}'\nexcept shutil.ReadError as e:\n    result = f'ReadError: {e}'\nfinally:\n    shutil.unregister_unpack_format('spy')\nresult",
      cases: [
        { id: 'spy',  label: 'data.spy',    values: { filename: 'data.spy' } },
        { id: 'dat',  label: 'old.dat',     values: { filename: 'old.dat' } },
        { id: 'zip',  label: 'photos.zip',  values: { filename: 'photos.zip' } },
        { id: 'none', label: 'notes.txt',   values: { filename: 'notes.txt' } },
      ],
    },
  ],
  demoExplainer: "Extensions are owned exclusively: .tgz already belongs to gztar and .zip to zip, so those registrations fail with RegistryError before anything changes. In the second tab the unpacker is chosen by name alone — the spy is called for data.spy without the file existing, photos.zip goes to the built-in zip unpacker (which finds no zip file), and an unknown extension is a ReadError.",

  patterns: [
    {
      name: 'Treat .jar and .whl files as zips',
      desc: 'Reuse the zip machinery for zip-based formats.',
      code: "import shutil, zipfile\ndef unpack_zip_based(filename, extract_dir):\n    with zipfile.ZipFile(filename) as z:\n        z.extractall(extract_dir)\nshutil.register_unpack_format('zipbased', ['.jar', '.whl'], unpack_zip_based, description='zip-based archive')",
    },
    {
      name: 'Accept filter= in a custom unpacker',
      desc: 'unpack_archive passes filter=… to your function when the caller gives one.',
      code: "def unpack_custom(filename, extract_dir, *, filter=None):\n    ...",
    },
    {
      name: 'Which extensions are known?',
      desc: 'Flatten the registry into an extension → format map.',
      code: "import shutil\nby_ext = {ext: name for name, exts, desc in shutil.get_unpack_formats() for ext in exts}",
    },
  ],

  examples: [
    { title: 'The built-in unpack formats', code: 'import shutil\nshutil.get_unpack_formats()', returns: "[('bztar', ['.tar.bz2', '.tbz2'], \"bzip2'ed tar-file\"), ('gztar', ['.tar.gz', '.tgz'], \"gzip'ed tar-file\"), ('tar', ['.tar'], 'uncompressed tar file'), ('xztar', ['.tar.xz', '.txz'], \"xz'ed tar-file\"), ('zip', ['.zip'], 'ZIP file')]" },
    { title: 'Extensions of one format', code: "import shutil\n{name: exts for name, exts, desc in shutil.get_unpack_formats()}['gztar']", returns: "['.tar.gz', '.tgz']" },
    { title: 'An extension can have one owner', code: "import shutil\nshutil.register_unpack_format('mine', ['.zip'], print)", returns: 'shutil.RegistryError: .zip is already registered for "zip"' },
    { title: 'Even re-registering the same format', code: "import shutil\nshutil.register_unpack_format('zip', ['.zip'], print)", returns: 'shutil.RegistryError: .zip is already registered for "zip"' },
    { title: 'The function must be callable', code: "import shutil\nshutil.register_unpack_format('mine', ['.mine'], 'not a function')", returns: 'TypeError: The registered function must be a callable' },
    { title: 'Unregistering an unknown name', code: "import shutil\nshutil.unregister_unpack_format('rar')", returns: "KeyError: 'rar'" },
  ],

  pitfalls: [
    {
      name: 'Passing one extension as a str',
      desc: "The registry iterates over extensions, so '.lst' becomes the four one-letter endings '.', 'l', 's', 't' — and notes.txt (ending in t) is sent to your unpacker.",
      wrong: { label: "'.lst'", code: "import shutil\nseen = []\ndef unpack_lst(filename, extract_dir):\n    seen.append(filename)\nshutil.register_unpack_format('lst', '.lst', unpack_lst)\ntry:\n    shutil.unpack_archive('notes.txt', 'out')\nfinally:\n    shutil.unregister_unpack_format('lst')\nseen", output: "['notes.txt']" },
      fix:   { label: "['.lst']", code: "import shutil\nseen = []\ndef unpack_lst(filename, extract_dir):\n    seen.append(filename)\nshutil.register_unpack_format('lst', ['.lst'], unpack_lst)\ntry:\n    shutil.unpack_archive('notes.txt', 'out')\nfinally:\n    shutil.unregister_unpack_format('lst')\nseen", output: "shutil.ReadError: Unknown archive format 'notes.txt'" },
    },
    {
      name: 'An unpacker without a filter parameter',
      desc: "Callers who follow the tar advice pass filter='data'; unpack_archive forwards it to your function.",
      wrong: { label: '(filename, extract_dir)', code: "import shutil\ndef unpack_lst(filename, extract_dir):\n    pass\nshutil.register_unpack_format('lst', ['.lst'], unpack_lst)\ntry:\n    shutil.unpack_archive('a.lst', 'out', filter='data')\nfinally:\n    shutil.unregister_unpack_format('lst')", output: "TypeError: unpack_lst() got an unexpected keyword argument 'filter'" },
      fix:   { label: 'accept filter=None', code: "import shutil\ndef unpack_lst(filename, extract_dir, filter=None):\n    pass\nshutil.register_unpack_format('lst', ['.lst'], unpack_lst)\ntry:\n    result = shutil.unpack_archive('a.lst', 'out', filter='data')\nfinally:\n    shutil.unregister_unpack_format('lst')\nresult is None", output: 'True' },
    },
  ],

  when: {
    use: [
      'Teaching unpack_archive new extensions (.jar, .whl, a company format)',
      'Listing which extensions this interpreter can unpack',
    ],
    avoid: [
      'Unpacking one known file once → call zipfile / tarfile or your function directly',
      'Changing behaviour for one call → the registry is process-wide; pass format= instead',
    ],
  },

  notes: {
    cpython:      'Lib/shutil.py: _UNPACK_FORMATS = {name: (extensions, function, extra_args, description)}; _find_unpack_format returns the first name whose extension filename.endswith()',
    'Order':      'tar, zip, gztar, bztar, xztar, then your formats in registration order — the first match wins',
    'RegistryError': 'Defined in shutil but not listed in shutil.__all__; catch it as shutil.RegistryError',
  },

  related: [
    { name: 'shutil.unpack_archive', slug: 'unpack_archive',      when: 'Uses this registry' },
    { name: 'RegistryError',         slug: 'registryerror',       when: 'An extension that is already taken' },
    { name: 'get_archive_formats',   slug: 'get_archive_formats', when: 'The registry for creating archives' },
    { name: 'ReadError',             slug: 'readerror',           when: 'No format matches the file name' },
  ],

  faq: [
    {
      q: 'Which file extensions can shutil.unpack_archive handle?',
      a: '.zip, .tar, .tar.gz and .tgz, .tar.bz2 and .tbz2, .tar.xz and .txz — each compressed one only if its module (zlib, bz2, lzma) is available; Python 3.14 adds zstdtar. shutil.get_unpack_formats() shows the exact list.',
    },
    {
      q: 'What does "RegistryError: .zip is already registered" mean?',
      a: 'Every extension can belong to only one unpack format. Unregister the existing format first (shutil.unregister_unpack_format(name)) or use a different extension.',
    },
    {
      q: 'How do I make unpack_archive handle .jar files?',
      a: "Register an unpacker: shutil.register_unpack_format('jar', ['.jar'], func), where func(filename, extract_dir) extracts it — for example with zipfile.ZipFile(filename).extractall(extract_dir). Or skip the registry and call unpack_archive(path, dst, format='zip').",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.get_unpack_formats',
    meta:  'shutil.get_unpack_formats / register_unpack_format / unregister_unpack_format',
  },

};
