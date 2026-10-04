// content/reference/python/stdlib/sys/getdefaultencoding.js — the encodings Python uses

export const meta = {
  slug:        'getdefaultencoding',
  name:        'sys.getdefaultencoding / getfilesystemencoding',
  signature:   'sys.getdefaultencoding() · sys.getfilesystemencoding() · sys.getfilesystemencodeerrors()',
  blurb:       "getdefaultencoding() is always 'utf-8' (the default of str.encode/bytes.decode). getfilesystemencoding() and getfilesystemencodeerrors() say how file names convert between str and bytes.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'All versions (getfilesystemencodeerrors 3.6+)',
  searchTerms: 'sys.getdefaultencoding getdefaultencoding sys.getfilesystemencoding getfilesystemencoding sys.getfilesystemencodeerrors getfilesystemencodeerrors default encoding python utf-8 file name encoding surrogateescape surrogatepass os.fsencode os.fsdecode setdefaultencoding locale encoding open encoding',
};

export const method = {
  slug:      'getdefaultencoding',
  name:      'sys.getdefaultencoding / getfilesystemencoding',
  signature: 'sys.getdefaultencoding() · sys.getfilesystemencoding() · sys.getfilesystemencodeerrors()',
  returns:   { type: 'str', desc: "getdefaultencoding: 'utf-8'. getfilesystemencoding: usually 'utf-8'. getfilesystemencodeerrors: 'surrogateescape' on Unix, 'surrogatepass' on Windows." },

  category:    'sys function',
  version:     'All versions (getfilesystemencodeerrors 3.6+)',
  hasLiveDemo: false,

  subtitle: "Python has several encodings, and these functions cover two of them. The one that surprises people — the default for open() without encoding= — is neither: it is the locale encoding (a Windows code page such as cp1252 unless UTF-8 mode is on). Always pass encoding= to open().",

  covers: ['getdefaultencoding', 'getfilesystemencoding', 'getfilesystemencodeerrors'],

  cheat: {
    commonCall: 'sys.getfilesystemencoding()',
    returns:    "'utf-8' on modern systems",
    replaces:   'Guessing how os functions encode str paths',
    watchOut:   'open() does not use getdefaultencoding()',
  },

  parameters: [],

  patterns: [
    {
      name: 'Convert file names the way os does',
      desc: 'os.fsencode/os.fsdecode use exactly the filesystem encoding and error handler.',
      code: "import os\nraw = os.fsencode('report.txt')     # b'report.txt'\nname = os.fsdecode(raw)",
    },
    {
      name: 'Text files: always say the encoding',
      desc: 'Independent of the locale, the same on every machine.',
      code: "with open('notes.txt', 'w', encoding='utf-8') as f:\n    f.write('café')",
    },
    {
      name: 'Make UTF-8 the default everywhere',
      desc: 'UTF-8 mode switches open(), the standard streams and the filesystem encoding to UTF-8.',
      code: '# shell:\n# python -X utf8 app.py\n# PYTHONUTF8=1 python app.py',
    },
  ],

  examples: [
    { title: 'The default str encoding',  code: 'import sys\nsys.getdefaultencoding()', returns: "'utf-8'" },
    { title: 'What str.encode() uses',    code: "import sys\n'é'.encode() == 'é'.encode(sys.getdefaultencoding())", returns: 'True' },
    { title: 'Filesystem encoding in UTF-8 mode', code: "import subprocess, sys\np = subprocess.run([sys.executable, '-E', '-X', 'utf8', '-c', 'import sys; print(sys.getfilesystemencoding())'], capture_output=True, text=True)\np.stdout.strip()", returns: "'utf-8'" },
    { title: 'A known error handler',     code: "import sys\nsys.getfilesystemencodeerrors() in ('surrogateescape', 'surrogatepass', 'strict')", returns: 'True' },
    { title: 'os.fsencode applies them',  code: "import os\nos.fsencode('data.csv')", returns: "b'data.csv'" },
  ],

  pitfalls: [
    {
      name: 'Assuming open() uses UTF-8',
      desc: "Without encoding=, open() uses the locale encoding — io.text_encoding(None) reports 'locale' unless UTF-8 mode is on. Pass encoding='utf-8'.",
      wrong: { label: 'no encoding=', code: "import subprocess, sys\np = subprocess.run([sys.executable, '-E', '-c', 'import io; print(io.text_encoding(None))'], capture_output=True, text=True)\np.stdout.strip()", output: "'locale'" },
      fix:   { label: "encoding='utf-8'", code: "from pathlib import Path\nPath('f.txt').write_text('é', encoding='utf-8')\nPath('f.txt').read_bytes()", output: "b'\\xc3\\xa9'" },
    },
    {
      name: 'Looking for sys.setdefaultencoding',
      desc: 'It was a Python 2 hack and does not exist in Python 3. Encode and decode explicitly where needed.',
      wrong: { label: 'setdefaultencoding', code: "import sys\nsys.setdefaultencoding('latin-1')", output: "AttributeError: module 'sys' has no attribute 'setdefaultencoding'. Did you mean: 'getdefaultencoding'?" },
      fix:   { label: 'explicit codec', code: "'é'.encode('latin-1')", output: "b'\\xe9'" },
    },
  ],

  when: {
    use: [
      'Low-level code converting file names between str and bytes',
      'Diagnosing UnicodeEncodeError / UnicodeDecodeError in file name handling',
    ],
    avoid: [
      'Choosing the encoding of file contents → pass encoding= to open()',
      'The terminal encoding → sys.stdout.encoding',
      'The locale encoding → locale.getpreferredencoding(False) / locale.getencoding() (3.11+)',
    ],
  },

  notes: {
    cpython:          "getdefaultencoding returns the constant 'utf-8'; the filesystem encoding and error handler come from PyConfig.filesystem_encoding / filesystem_errors at startup (Python/sysmodule.c)",
    'Windows':        "Since 3.6 (PEP 529) the filesystem encoding on Windows is 'utf-8' with 'surrogatepass'; PYTHONLEGACYWINDOWSFSENCODING restores 'mbcs'",
    'Unix':           "The locale encoding with 'surrogateescape', so undecodable bytes in file names survive a round trip; 'utf-8' in UTF-8 mode",
    'Python 3.15':    'UTF-8 mode is planned to become the default (PEP 686), making open() default to UTF-8 too',
  },

  related: [
    { name: 'sys.stdout',  slug: 'stdout', when: 'stdout.encoding is yet another encoding' },
    { name: 'open()',      slug: 'open',   when: 'Pass encoding= explicitly', category: 'functions' },
    { name: 'str.encode()', slug: 'str-encode', when: 'Uses UTF-8 by default', category: 'functions' },
    { name: 'UnicodeDecodeError', slug: 'unicodedecodeerror', when: 'What a wrong encoding raises', category: 'exceptions' },
    { name: 'sys module',  slug: 'sys',    when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the default encoding in Python 3?',
      a: "sys.getdefaultencoding() is always 'utf-8': str.encode() and bytes.decode() use UTF-8 by default. open() is different — without encoding= it uses the locale encoding, which is not UTF-8 on many Windows systems.",
    },
    {
      q: 'How do I change the default encoding in Python?',
      a: 'You cannot change getdefaultencoding() (setdefaultencoding is gone). To make UTF-8 the default for files and streams, enable UTF-8 mode: python -X utf8 or PYTHONUTF8=1. Or pass encoding= explicitly, which is the portable fix.',
    },
    {
      q: 'What is getfilesystemencoding used for?',
      a: 'It is the encoding Python uses to turn str file names into bytes for the OS and back (os.fsencode/os.fsdecode). Together with getfilesystemencodeerrors() it decides what happens with names that are not valid in that encoding.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.getfilesystemencoding',
    meta:  'sys.getfilesystemencoding',
  },
};
