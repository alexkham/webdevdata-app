// content/reference/python/stdlib/shutil/readerror.js

export const meta = {
  slug:        'readerror',
  name:        'shutil.ReadError',
  signature:   'shutil.ReadError(*args)',
  blurb:       'Raised by unpack_archive when no unpacker matches the file name, or when the file is not a valid zip / tar archive.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'shutil readerror unknown archive format is not a zip file is not a compressed or uncompressed tar file unpack_archive error corrupt archive wrong extension oserror',
};

export const method = {
  slug:      'readerror',
  name:      'shutil.ReadError',
  signature: 'shutil.ReadError(*args)',

  category:    'shutil exception',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: `Three messages, three causes: "Unknown archive format 'x'" (no registered extension matches the name), "x is not a zip file" and "x is not a compressed or uncompressed tar file" (the unpacker could not read it). It is an OSError, but not listed in shutil.__all__.`,

  covers: [],

  chain: ['BaseException', 'Exception', 'OSError', 'ReadError'],

  cheat: {
    raisedBy: 'shutil.unpack_archive(filename, …) — and custom unpackers that choose to raise it',
    message:  "Unknown archive format 'photos.7z'",
    quickFix: "Pass format='zip' / 'gztar' / … for odd names; check that the file really is an archive",
    watchOut: 'A missing .zip is reported as "is not a zip file", a missing .tar.gz as FileNotFoundError',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'The message.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Write some plain text under the name you choose, then try to unpack it, uncaught.',
      params: [{ name: 'filename', type: 'str', hint: 'file name', input: 'text' }],
      template: "import shutil\nwith open({$filename}, 'w') as f:\n    f.write('not an archive')\nshutil.unpack_archive({$filename}, 'out')",
      cases: [
        { id: 'zip', label: '.zip',    values: { filename: 'backup.zip' } },
        { id: 'tgz', label: '.tar.gz', values: { filename: 'backup.tar.gz' } },
        { id: '7z',  label: '.7z',     values: { filename: 'backup.7z' } },
        { id: 'tbz', label: '.tbz2',   values: { filename: 'backup.tbz2' } },
      ],
    },
    {
      id: 'catch',
      label: 'Handle',
      blurb: 'Catch it as OSError — its base class — and look at the class name.',
      params: [{ name: 'filename', type: 'str', hint: 'archive name (nothing exists)', input: 'text' }],
      template: "import shutil\ntry:\n    shutil.unpack_archive({$filename}, 'out')\n    result = 'unpacked'\nexcept OSError as e:\n    result = (type(e).__name__, isinstance(e, shutil.ReadError))\nresult",
      cases: [
        { id: 'rar', label: 'photos.rar', values: { filename: 'photos.rar' } },
        { id: 'zip', label: 'photos.zip', values: { filename: 'photos.zip' } },
        { id: 'tar', label: 'photos.tar', values: { filename: 'photos.tar' } },
      ],
    },
  ],
  demoExplainer: "The extension picks the unpacker first: .zip goes to the zip unpacker, .tar.gz and .tbz2 to tarfile, and .7z to nobody — that last one fails before the file is even opened. The zip unpacker asks zipfile.is_zipfile and raises ReadError for anything else, including a missing file; tarfile opens the file itself, so a missing .tar is a FileNotFoundError, not a ReadError.",

  patterns: [
    {
      name: 'Report a bad upload to the user',
      desc: 'ReadError covers both "unknown type" and "corrupt".',
      code: "import shutil\ndef extract_upload(upload, dest):\n    try:\n        shutil.unpack_archive(upload, dest, filter='data')\n    except shutil.ReadError as e:\n        return f'Not a supported archive: {e}'\n    return 'ok'",
    },
    {
      name: 'Raise it from a custom unpacker',
      desc: 'Do what the built-in unpackers do: unreadable input → shutil.ReadError, so callers’ except clauses keep working.',
      code: "import shutil\ndef unpack_lst(filename, extract_dir):\n    with open(filename) as f:\n        if f.readline() != 'LST1\\n':\n            raise shutil.ReadError(f'{filename} is not an LST archive')",
    },
  ],

  examples: [
    { title: 'Unknown extension', code: "import shutil\nshutil.unpack_archive('photos.rar', 'out')", returns: "shutil.ReadError: Unknown archive format 'photos.rar'" },
    { title: 'Not really a zip', code: "import shutil\nwith open('fake.zip', 'w') as f:\n    f.write('hello')\nshutil.unpack_archive('fake.zip', 'out')", returns: 'shutil.ReadError: fake.zip is not a zip file' },
    { title: 'Not really a tar', code: "import shutil\nwith open('fake.tar', 'w') as f:\n    f.write('hello')\nshutil.unpack_archive('fake.tar', 'out')", returns: 'shutil.ReadError: fake.tar is not a compressed or uncompressed tar file' },
    { title: 'It is an OSError', code: 'import shutil\nissubclass(shutil.ReadError, OSError)', returns: 'True' },
    { title: 'Not in __all__, but public', code: "import shutil\n('ReadError' in shutil.__all__, hasattr(shutil, 'ReadError'))", returns: '(False, True)' },
  ],

  pitfalls: [
    {
      name: 'Relying on the extension of a renamed file',
      desc: 'unpack_archive trusts the name. A zip saved as .bin (or a download without extension) needs format=.',
      wrong: { label: 'by name', code: "import os, shutil\nos.makedirs('src')\nopen('src/a.txt', 'w').close()\nos.rename(shutil.make_archive('pkg', 'zip', root_dir='src'), 'pkg.bin')\nshutil.unpack_archive('pkg.bin', 'out')", output: "shutil.ReadError: Unknown archive format 'pkg.bin'" },
      fix:   { label: "format='zip'", code: "import os, shutil\nos.makedirs('src')\nopen('src/a.txt', 'w').close()\nos.rename(shutil.make_archive('pkg', 'zip', root_dir='src'), 'pkg.bin')\nshutil.unpack_archive('pkg.bin', 'out', format='zip')\nos.listdir('out')", output: "['a.txt']" },
    },
    {
      name: 'Catching ReadError for a missing tar file',
      desc: 'For tar formats a missing file raises FileNotFoundError, which ReadError does not catch. Catch OSError to cover both.',
      wrong: { label: 'except ReadError', code: "import shutil\ntry:\n    try:\n        shutil.unpack_archive('missing.tar.gz', 'out')\n    except shutil.ReadError:\n        result = 'bad archive'\nexcept OSError as e:\n    result = f'escaped: {type(e).__name__}'\nresult", output: "'escaped: FileNotFoundError'" },
      fix:   { label: 'except OSError', code: "import shutil\ntry:\n    shutil.unpack_archive('missing.tar.gz', 'out')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
    },
  ],

  when: {
    use: [
      'except shutil.ReadError around unpack_archive for user-supplied files',
      'raise shutil.ReadError from your own registered unpackers',
    ],
    avoid: [
      'Treating it as "file missing" → that is FileNotFoundError (or ReadError for .zip)',
    ],
  },

  notes: {
    cpython:   'Lib/shutil.py: class ReadError(OSError): """Raised when an archive cannot be read"""',
    'Sources': "unpack_archive (no matching extension), _unpack_zipfile (zipfile.is_zipfile is false), _unpack_tarfile (tarfile.open raised tarfile.TarError)",
    '__all__': 'Not exported by from shutil import *; use shutil.ReadError',
  },

  related: [
    { name: 'shutil.unpack_archive', slug: 'unpack_archive',     when: 'Where it is raised' },
    { name: 'get_unpack_formats',    slug: 'get_unpack_formats', when: 'Which extensions are known' },
    { name: 'shutil.Error',          slug: 'error',              when: 'A sibling OSError subclass' },
    { name: 'OSError',               slug: 'oserror',            when: 'The base class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "shutil.ReadError: Unknown archive format" mean?',
      a: 'The file name does not end with an extension any registered unpacker claims (.zip, .tar, .tar.gz, .tgz, .tar.bz2, .tbz2, .tar.xz, .txz). Rename the file, pass format=, or register an unpacker.',
    },
    {
      q: 'Why does unpack_archive say my file "is not a zip file"?',
      a: 'The name ends with .zip but zipfile.is_zipfile is false: the file is missing, empty, truncated (an interrupted download) or something else entirely, such as an HTML error page saved under that name.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.unpack_archive',
    meta:  'shutil.unpack_archive (ReadError)',
  },
};
