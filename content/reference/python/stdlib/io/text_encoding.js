// content/reference/python/stdlib/io/text_encoding.js — io.text_encoding

export const meta = {
  slug:        'text_encoding',
  name:        'io.text_encoding',
  signature:   'io.text_encoding(encoding, stacklevel=2, /)',
  blurb:       'For functions with an encoding=None parameter: returns the encoding to pass on to open() — the given one, or "locale" ("utf-8" in UTF-8 Mode) — and emits the opt-in EncodingWarning on behalf of your caller.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.10+',
  searchTerms: 'text_encoding io.text_encoding python EncodingWarning warn_default_encoding locale encoding utf-8 mode PEP 597 PEP 686 encoding=None default encoding open',
};

export const method = {
  slug:      'text_encoding',
  name:      'io.text_encoding',
  signature: 'io.text_encoding(encoding, stacklevel=2, /)',
  returns:   { type: 'str', desc: 'encoding unchanged if it is not None; otherwise "locale", or "utf-8" when UTF-8 Mode is on.' },

  category:    'io function',
  version:     'Python 3.10+',
  hasLiveDemo: false,

  subtitle: 'A small helper from PEP 597. If your function takes encoding=None and passes it to open(), calling io.text_encoding(encoding) first makes the warning about the implicit locale encoding point at your caller — the code that forgot to choose an encoding — instead of at your own open() call.',

  covers: ['text_encoding'],

  cheat: {
    commonCall: 'encoding = io.text_encoding(encoding)',
    returns:    "the encoding, or 'locale' / 'utf-8'",
    replaces:   'passing encoding=None straight through to open()',
    watchOut:   'warns only when Python runs with -X warn_default_encoding',
  },

  parameters: [
    { name: 'encoding',   type: 'str | None', required: true,  default: null, desc: 'Your function\'s encoding argument. Returned unchanged unless it is None (it is not validated).' },
    { name: 'stacklevel', type: 'int',        required: false, default: '2',  desc: 'Which frame the EncodingWarning is attributed to: 2 is the caller of the function that calls text_encoding().' },
  ],

  patterns: [
    {
      name: 'An API with an optional encoding',
      desc: 'The pattern from the docs.',
      code: "import io\ndef read_text(path, encoding=None):\n    encoding = io.text_encoding(encoding)\n    with open(path, encoding=encoding) as f:\n        return f.read()",
    },
    {
      name: 'Find implicit encodings in your code base',
      desc: 'Turn the warning on for a test run.',
      code: '# shell:\n# python -X warn_default_encoding -m pytest\n# or: PYTHONWARNDEFAULTENCODING=1 python app.py',
    },
  ],

  examples: [
    { title: 'An explicit encoding is returned',    code: "import io\nio.text_encoding('utf-8')", returns: "'utf-8'" },
    { title: 'None becomes locale (or utf-8)',      code: "import io, sys\nio.text_encoding(None) == ('utf-8' if sys.flags.utf8_mode else 'locale')", returns: 'True' },
    { title: 'Any name passes through unchecked',   code: "import io\nio.text_encoding('no-such-codec')", returns: "'no-such-codec'" },
    { title: '"locale" is a valid open() encoding', code: "with open('a.txt', 'w', encoding='locale') as f:\n    ok = isinstance(f.encoding, str)\nok", returns: 'True' },
    { title: 'stacklevel only matters for warnings', code: "import io\nio.text_encoding('latin-1', 5)", returns: "'latin-1'" },
  ],

  pitfalls: [
    {
      name: 'Calling it with your own default already filled in',
      desc: 'Once encoding is not None there is nothing to warn about, so callers never learn they relied on a default. Keep None as the default and let text_encoding() resolve it.',
      wrong: { label: "encoding='utf-8' default", code: "import io\ndef load(path, encoding='utf-8'):\n    return io.text_encoding(encoding)\nload('a.txt')", output: "'utf-8'" },
      fix:   { label: 'None default',             code: "import io, sys\ndef load(path, encoding=None):\n    return io.text_encoding(encoding)\nload('a.txt') == ('utf-8' if sys.flags.utf8_mode else 'locale')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Library functions that accept encoding=None and open text files',
    ],
    avoid: [
      'Application code → just pass encoding="utf-8" (or another explicit codec) to open()',
      'New APIs → the docs suggest defaulting to UTF-8 instead',
    ],
  },

  notes: {
    cpython:         'Modules/_io/_iomodule.c. The EncodingWarning is emitted only when sys.flags.warn_default_encoding is set (-X warn_default_encoding or PYTHONWARNDEFAULTENCODING)',
    'Versions':      '3.10: added (with encoding="locale" and EncodingWarning, PEP 597). 3.11: returns "utf-8" when UTF-8 Mode is on (docs)',
    'Default ahead': 'The docs note that PEP 686 makes UTF-8 Mode the default in Python 3.15, which changes what encoding=None means',
  },

  related: [
    { name: 'TextIOWrapper', slug: 'textiowrapper', when: 'Where encoding=None is finally resolved' },
    { name: 'io.open',       slug: 'open',          when: 'Takes encoding="locale" since 3.10' },
    { name: 'open()',        slug: 'open',          when: 'Always pass encoding=', category: 'functions' },
    { name: 'sys.flags',     slug: 'flags',         when: 'utf8_mode and warn_default_encoding', category: 'stdlib/sys' },
  ],

  faq: [
    {
      q: 'What is EncodingWarning in Python?',
      a: 'A warning (3.10+, PEP 597) emitted when a text file is opened without an explicit encoding — only if you enable it with -X warn_default_encoding or PYTHONWARNDEFAULTENCODING. io.text_encoding() lets library code redirect the warning to its caller.',
    },
    {
      q: 'What does encoding="locale" mean?',
      a: 'Use the current locale encoding (locale.getencoding()) explicitly — the same as the old implicit default, but without an EncodingWarning. Supported by open() and TextIOWrapper since 3.10.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.text_encoding',
    meta:  'io.text_encoding',
  },

};
