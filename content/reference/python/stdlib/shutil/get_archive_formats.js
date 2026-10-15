// content/reference/python/stdlib/shutil/get_archive_formats.js

export const meta = {
  slug:        'get_archive_formats',
  name:        'shutil.get_archive_formats',
  signature:   'shutil.get_archive_formats() / shutil.register_archive_format(name, function, extra_args=None, description="") / shutil.unregister_archive_format(name)',
  blurb:       'The registry make_archive looks formats up in: list the available archive formats, add your own archiver under a name, or remove one.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'shutil get_archive_formats register_archive_format unregister_archive_format list archive formats custom archiver make_archive format zip tar gztar bztar xztar supports_root_dir extra_args description',
};

export const method = {
  slug:      'get_archive_formats',
  name:      'shutil.get_archive_formats',
  signature: 'shutil.get_archive_formats() / shutil.register_archive_format(name, function, extra_args=None, description="") / shutil.unregister_archive_format(name)',
  returns:   { type: 'list[tuple[str, str]]', desc: 'get_archive_formats: sorted (name, description) pairs. The other two return None.' },

  category:    'shutil function',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'make_archive(base_name, format) is a dictionary lookup: format → (function, extra keyword arguments, description). These three functions read and change that dictionary — process-wide, for every caller.',

  covers: ['get_archive_formats', 'register_archive_format', 'unregister_archive_format'],

  cheat: {
    commonCall: 'shutil.get_archive_formats()',
    returns:    "[('bztar', \"bzip2'ed tar-file\"), ('gztar', …), ('tar', …), ('xztar', …), ('zip', 'ZIP file')]",
    replaces:   'Hard-coding the list of formats',
    watchOut:   'Registering a name that exists (e.g. zip) silently replaces it for the whole process',
  },

  parameters: [
    { name: 'name',        type: 'str',      required: true,  default: null, desc: 'The format name used as make_archive(…, format=name).' },
    { name: 'function',    type: 'callable', required: true,  default: null, desc: 'Called as function(base_name, base_dir, owner=…, group=…, dry_run=…, logger=…, **extra_args); returns the archive name. Set function.supports_root_dir = True to receive root_dir instead of a chdir (3.12+).' },
    { name: 'extra_args',  type: 'sequence of (name, value)', required: false, default: 'None', desc: 'Extra keyword arguments passed on every call.' },
    { name: 'description', type: 'str',      required: false, default: "''", desc: 'Shown by get_archive_formats.' },
  ],

  modes: [
    {
      id: 'register',
      label: 'register an archiver',
      blurb: 'Register a toy archiver that only reports how it was called, run make_archive with it, and unregister it again in finally.',
      params: [
        { name: 'name', type: 'str', hint: 'format name',  input: 'text' },
        { name: 'desc', type: 'str', hint: 'description',  input: 'text' },
      ],
      template: "import shutil\ndef report(base_name, base_dir, **kwargs):\n    return f'{base_name}.txt from {base_dir!r}, kwargs {sorted(kwargs)}'\nshutil.register_archive_format({$name}, report, description={$desc})\ntry:\n    formats = dict(shutil.get_archive_formats())\n    result = (sorted(formats), formats[{$name}], shutil.make_archive('out', {$name}))\nfinally:\n    shutil.unregister_archive_format({$name})\nresult",
      cases: [
        { id: 'listing', label: 'listing',  values: { name: 'listing', desc: 'plain text file list' } },
        { id: 'upper',   label: 'Report',   values: { name: 'Report', desc: '' } },
      ],
    },
    {
      id: 'lookup',
      label: 'look up a format',
      blurb: 'The built-in registry as a dict: description for a name, or a default.',
      params: [{ name: 'name', type: 'str', hint: 'format name', input: 'text' }],
      template: "import shutil\ndict(shutil.get_archive_formats()).get({$name}, 'not registered')",
      cases: [
        { id: 'gztar', label: 'gztar', values: { name: 'gztar' } },
        { id: 'zip',   label: 'zip',   values: { name: 'zip' } },
        { id: 'rar',   label: 'rar',   values: { name: 'rar' } },
      ],
    },
  ],
  demoExplainer: "The list is sorted by name, so a capitalized 'Report' sorts before every built-in format. make_archive passes base_name, base_dir (default '.') and four keyword arguments — dry_run, group, logger, owner — and returns whatever the archiver returns. The finally clause matters: the registry is global, so a format registered and never removed is visible to every later make_archive call in the process.",

  patterns: [
    {
      name: 'An archiver that understands root_dir',
      desc: 'Without supports_root_dir, make_archive changes the working directory around your call (not thread-safe).',
      code: "import shutil\ndef make_listing(base_name, base_dir, root_dir=None, **kwargs):\n    ...\n    return base_name + '.txt'\nmake_listing.supports_root_dir = True\nshutil.register_archive_format('listing', make_listing, description='file list')",
    },
    {
      name: 'A preset with extra arguments',
      desc: 'extra_args become keyword arguments on every call.',
      code: "import shutil\nshutil.register_archive_format('fast-zip', my_zipper, extra_args=[('level', 1)], description='zip, fast compression')",
    },
    {
      name: 'Check before you rely on a format',
      desc: 'Formats depend on optional modules (zlib, bz2, lzma; zstd in 3.14).',
      code: "import shutil\nfmt = 'xztar' if 'xztar' in dict(shutil.get_archive_formats()) else 'gztar'",
    },
  ],

  examples: [
    { title: 'The built-in formats', code: 'import shutil\nshutil.get_archive_formats()', returns: "[('bztar', \"bzip2'ed tar-file\"), ('gztar', \"gzip'ed tar-file\"), ('tar', 'uncompressed tar file'), ('xztar', \"xz'ed tar-file\"), ('zip', 'ZIP file')]" },
    { title: 'Register, use, unregister', code: "import shutil\nshutil.register_archive_format('noop', lambda base_name, base_dir, **kw: base_name + '.noop')\ntry:\n    result = shutil.make_archive('out', 'noop')\nfinally:\n    shutil.unregister_archive_format('noop')\nresult", returns: "'out.noop'" },
    { title: 'The function must be callable', code: "import shutil\nshutil.register_archive_format('bad', 42)", returns: 'TypeError: The 42 object is not callable' },
    { title: 'extra_args must be (name, value) pairs', code: "import shutil\nshutil.register_archive_format('bad', print, extra_args=[('level',)])", returns: 'TypeError: extra_args elements are : (arg_name, value)' },
    { title: 'Unregistering an unknown name', code: "import shutil\nshutil.unregister_archive_format('rar')", returns: "KeyError: 'rar'" },
  ],

  pitfalls: [
    {
      name: 'Registering over a built-in name',
      desc: "register_archive_format('zip', …) replaces the real zip archiver for the whole process, and unregistering it afterwards removes zip entirely. Pick a new name.",
      wrong: { label: "reuse 'zip'", code: "import shutil, zipfile\nsaved = shutil._ARCHIVE_FORMATS['zip']\ntry:\n    shutil.register_archive_format('zip', lambda b, d, **kw: 'not a zip')\n    result = shutil.make_archive('out', 'zip')\nfinally:\n    shutil._ARCHIVE_FORMATS['zip'] = saved\nresult", output: "'not a zip'" },
      fix:   { label: 'a new name', code: "import shutil\nshutil.register_archive_format('myzip', lambda b, d, **kw: b + '.myzip')\ntry:\n    result = shutil.make_archive('out', 'myzip')\nfinally:\n    shutil.unregister_archive_format('myzip')\nresult", output: "'out.myzip'" },
    },
    {
      name: 'Forgetting to unregister in tests',
      desc: 'The registry outlives your test. Use try/finally (or a fixture) so the next test sees the default list.',
      wrong: { label: 'cleanup skipped by an error', code: "import shutil\ndef test():\n    shutil.register_archive_format('tmpfmt', lambda b, d, **kw: b)\n    raise AssertionError('test failed')\n    shutil.unregister_archive_format('tmpfmt')\ntry:\n    test()\nexcept AssertionError:\n    pass\nleaked = 'tmpfmt' in dict(shutil.get_archive_formats())\nshutil.unregister_archive_format('tmpfmt')  # tidy up after the demo\nleaked", output: 'True' },
      fix:   { label: 'try/finally', code: "import shutil\ndef test():\n    shutil.register_archive_format('tmpfmt', lambda b, d, **kw: b)\n    try:\n        raise AssertionError('test failed')\n    finally:\n        shutil.unregister_archive_format('tmpfmt')\ntry:\n    test()\nexcept AssertionError:\n    pass\n'tmpfmt' in dict(shutil.get_archive_formats())", output: 'False' },
    },
  ],

  when: {
    use: [
      'Listing what make_archive supports on this interpreter',
      'Plugging a custom archive format (7z via a library, a manifest file, …) into code that calls make_archive',
    ],
    avoid: [
      'One-off custom archives → call your function directly',
      'Changing behaviour for one call only → the registry is global; pass a different format name instead',
    ],
  },

  notes: {
    cpython:       'Lib/shutil.py: _ARCHIVE_FORMATS = {name: (function, extra_args, description)}; get_archive_formats returns sorted (name, description) pairs',
    'Validation':  'register_archive_format checks callable(function), that extra_args is a tuple or list, and that every element is a 2-item tuple or list',
    'Unpacking':   'make_archive formats and unpack_archive formats are separate registries — see get_unpack_formats',
  },

  related: [
    { name: 'shutil.make_archive', slug: 'make_archive',       when: 'Where the formats are used' },
    { name: 'get_unpack_formats',  slug: 'get_unpack_formats', when: 'The unpacking registry' },
    { name: 'KeyError',            slug: 'keyerror',           when: 'Unregistering an unknown name', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Which archive formats does shutil support?',
      a: "tar always; zip and gztar (.tar.gz) when zlib is available, bztar (.tar.bz2) with bz2 and xztar (.tar.xz) with lzma — plus zstdtar from Python 3.14. shutil.get_archive_formats() lists what this interpreter has.",
    },
    {
      q: 'How do I add a custom format to make_archive?',
      a: "shutil.register_archive_format('name', function, description='…'). The function receives base_name and base_dir positionally and owner, group, dry_run and logger as keyword arguments, and returns the archive's file name. make_archive(base, 'name') then calls it.",
    },
    {
      q: 'Can I create a 7z or rar archive with shutil?',
      a: "Not out of the box: make_archive raises ValueError: unknown archive format '7z'. Register an archiver that calls a third-party library (or an external tool) under that name.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.get_archive_formats',
    meta:  'shutil.get_archive_formats / register_archive_format / unregister_archive_format',
  },

};
