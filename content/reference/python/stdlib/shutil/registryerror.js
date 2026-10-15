// content/reference/python/stdlib/shutil/registryerror.js

export const meta = {
  slug:        'registryerror',
  name:        'shutil.RegistryError',
  signature:   'shutil.RegistryError(*args)',
  blurb:       'Raised by register_unpack_format when one of the extensions already belongs to another unpack format.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'shutil registryerror is already registered for register_unpack_format extension already registered unpack format registry error exception',
};

export const method = {
  slug:      'registryerror',
  name:      'shutil.RegistryError',
  signature: 'shutil.RegistryError(*args)',

  category:    'shutil exception',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Every file extension can select only one unpack format. register_unpack_format checks all extensions before changing anything and raises RegistryError for the first taken one. Unlike the other shutil exceptions it is not an OSError.',

  covers: [],

  chain: ['BaseException', 'Exception', 'RegistryError'],

  cheat: {
    raisedBy: 'shutil.register_unpack_format(name, extensions, function)',
    message:  '.zip is already registered for "zip"',
    quickFix: 'Use a new extension, or unregister_unpack_format(owner) first',
    watchOut: 'except OSError does not catch it',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: `The message: '<extension> is already registered for "<format>"'.` },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Register a do-nothing unpacker for the extensions you list (and remove it again if that worked), uncaught.',
      params: [{ name: 'extensions', type: 'list[str]', hint: 'extensions, comma-separated', input: 'csv' }],
      template: "import shutil\ndef noop(filename, extract_dir):\n    pass\nshutil.register_unpack_format('mine', {$extensions}, noop)\nshutil.unregister_unpack_format('mine')\n'registered and removed'",
      cases: [
        { id: 'zip',  label: '.zip',        values: { extensions: '.zip' } },
        { id: 'tbz2', label: '.tbz2',       values: { extensions: '.mine, .tbz2' } },
        { id: 'new',  label: 'new ones',    values: { extensions: '.mine, .min' } },
      ],
    },
    {
      id: 'catch',
      label: 'Handle',
      blurb: 'RegistryError is an Exception but not an OSError.',
      params: [{ name: 'extensions', type: 'list[str]', hint: 'extensions, comma-separated', input: 'csv' }],
      template: "import shutil\ntry:\n    shutil.register_unpack_format('mine', {$extensions}, print)\nexcept Exception as e:\n    result = (type(e).__name__, isinstance(e, OSError), str(e))\nelse:\n    shutil.unregister_unpack_format('mine')\n    result = 'registered'\nresult",
      cases: [
        { id: 'tgz', label: '.tgz', values: { extensions: '.tgz' } },
        { id: 'new', label: '.mine', values: { extensions: '.mine' } },
      ],
    },
  ],
  demoExplainer: 'The first taken extension in your list decides the message — .tbz2 belongs to bztar. Nothing is registered when the error is raised, so there is nothing to clean up. A list of fresh extensions registers fine (and the snippet removes it again, because the registry is shared by the whole process).',

  patterns: [
    {
      name: 'Take over an extension deliberately',
      desc: 'Remove the current owner first — for the whole process.',
      code: "import shutil\nshutil.unregister_unpack_format('zip')\nshutil.register_unpack_format('zip', ['.zip'], my_zip_unpacker, description='ZIP file (custom)')",
    },
    {
      name: 'Register once, tolerate repeats',
      desc: 'Module reloads or repeated setup code would otherwise fail the second time.',
      code: "import shutil\ntry:\n    shutil.register_unpack_format('lst', ['.lst'], unpack_lst)\nexcept shutil.RegistryError:\n    pass  # already registered",
    },
  ],

  examples: [
    { title: 'Claiming .zip', code: "import shutil\nshutil.register_unpack_format('mine', ['.zip'], print)", returns: 'shutil.RegistryError: .zip is already registered for "zip"' },
    { title: 'Registering the same format twice', code: "import shutil\nshutil.register_unpack_format('lst', ['.lst'], print)\ntry:\n    shutil.register_unpack_format('lst', ['.lst'], print)\nexcept shutil.RegistryError as e:\n    result = str(e)\nfinally:\n    shutil.unregister_unpack_format('lst')\nresult", returns: "'.lst is already registered for \"lst\"'" },
    { title: 'Not an OSError', code: 'import shutil\n[c.__name__ for c in shutil.RegistryError.__mro__]', returns: "['RegistryError', 'Exception', 'BaseException', 'object']" },
    { title: 'register_archive_format never raises it', code: "import shutil\nshutil.register_archive_format('zip2', print)\nshutil.register_archive_format('zip2', print)\nshutil.unregister_archive_format('zip2')\n'no error'", returns: "'no error'" },
  ],

  pitfalls: [
    {
      name: 'Catching it with except OSError',
      desc: 'RegistryError derives directly from Exception, unlike Error, SameFileError and ReadError.',
      wrong: { label: 'except OSError', code: "import shutil\ntry:\n    try:\n        shutil.register_unpack_format('mine', ['.tgz'], print)\n    except OSError:\n        result = 'handled'\nexcept Exception as e:\n    result = f'escaped: {type(e).__name__}'\nresult", output: "'escaped: RegistryError'" },
      fix:   { label: 'except shutil.RegistryError', code: "import shutil\ntry:\n    shutil.register_unpack_format('mine', ['.tgz'], print)\nexcept shutil.RegistryError as e:\n    result = f'handled: {e}'\nresult", output: "'handled: .tgz is already registered for \"gztar\"'" },
    },
  ],

  when: {
    use: [
      'except shutil.RegistryError around register_unpack_format in setup code that may run twice',
    ],
    avoid: [
      'Expecting it from register_archive_format — that one silently replaces existing names',
    ],
  },

  notes: {
    cpython:   `Lib/shutil.py: class RegistryError(Exception); raised by _check_unpack_options: '%s is already registered for "%s"' % (extension, existing_name)`,
    '__all__': 'Not exported by from shutil import *; use shutil.RegistryError',
  },

  related: [
    { name: 'get_unpack_formats',  slug: 'get_unpack_formats',  when: 'register_unpack_format raises it' },
    { name: 'get_archive_formats', slug: 'get_archive_formats', when: 'The archive registry, which never raises it' },
    { name: 'shutil.ReadError',    slug: 'readerror',           when: 'The other unpacking error' },
    { name: 'Exception',           slug: 'exception',           when: 'Its direct base class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "RegistryError: .zip is already registered for "zip"" mean?',
      a: 'register_unpack_format was asked to claim an extension that another format already owns. Each extension maps to exactly one unpacker; remove the owner with unregister_unpack_format or choose another extension.',
    },
    {
      q: 'Why is RegistryError not caught by except OSError?',
      a: 'It describes a programming problem with the registry, not a file system failure, so it subclasses Exception directly.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.register_unpack_format',
    meta:  'shutil.register_unpack_format (RegistryError)',
  },
};
