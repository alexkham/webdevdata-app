// content/reference/python/functions/rstrip.js

export const meta = {
  slug:        'rstrip',
  name:        'str.rstrip',
  signature:   'str.rstrip(chars=None)',
  blurb:       'Return a copy with trailing characters removed.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'rstrip trim right trailing whitespace newline chomp',
};

export const method = {
  slug:      'rstrip',
  name:      'str.rstrip',
  signature: 'str.rstrip(chars=None)',
  returns:   { type: 'str', desc: 'A new string with trailing characters removed. The start of the string is never touched.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Trim the right end — the go-to for removing trailing newlines from file lines.',

  cheat: {
    commonCall: 'line.rstrip("\\n")',
    returns:    'new str — original unchanged',
    replaces:   'chars is a SET of characters, not a suffix',
    watchOut:   'rstrip("suffix") is the classic misuse — use removesuffix',
  },

  parameters: [
    { name: 'chars', type: 'str | None', required: false, default: 'None', desc: 'The set of characters to remove from the right end. None (the default) strips whitespace, including \\n.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',         input: 'text' },
    { name: 'chars',  type: 'str', hint: 'empty = whitespace', input: 'text-or-none' },
  ],
  cases: [
    { id: 'default', label: 'default',   values: { string: 'hello   ',   chars: '' } },
    { id: 'chars',   label: 'char set',  values: { string: 'file.txt...', chars: '.' } },
    { id: 'left',    label: 'left kept', values: { string: '  both  ',   chars: '' } },
    { id: 'setmisuse', label: 'set, not suffix', values: { string: 'banana', chars: 'an' } },
  ],
  demoExplainer: 'Only the right end is trimmed. Note the last case: chars is a character SET — rstrip("an") keeps removing a\u2019s and n\u2019s, eating far more than the literal suffix "an".',

  patterns: [
    {
      name: 'Chomp line endings',
      desc: 'The standard way to clean lines read from a file.',
      code: 'for line in f:\n    process(line.rstrip("\\n"))',
    },
    {
      name: 'Trim trailing slashes from URLs',
      desc: 'Normalize before joining paths.',
      code: 'base = url.rstrip("/")',
    },
  ],

  examples: [
    { title: 'Trailing whitespace (default)', code: '"hello   ".rstrip()',   returns: "'hello'" },
    { title: 'A set of characters',           code: '"a/b///".rstrip("/")',  returns: "'a/b'" },
    { title: 'Left side untouched',           code: '"  x  ".rstrip()',      returns: "'  x'" },
  ],

  pitfalls: [
    {
      name: 'chars is a set — not a suffix',
      desc: 'The most-reported str "bug" on trackers: rstrip removes characters, not a substring.',
      wrong: { label: 'Eats too much', code: '"banana".rstrip("an")', output: "'b'" },
      fix:   { label: 'Suffix removal', code: '"banana".removesuffix("an")', output: "'banan'" },
    },
    {
      name: 'The result must be assigned',
      desc: 'Strings are immutable — rstrip returns a new string.',
      wrong: { label: 'Wrong', code: 'line.rstrip()\nprocess(line)', output: 'still has the newline' },
      fix:   { label: 'Fix', code: 'line = line.rstrip()\nprocess(line)', output: 'clean' },
    },
  ],

  when: {
    use: [
      'Removing trailing newlines/whitespace from lines',
      'Trimming trailing separators (/, ., -)',
    ],
    avoid: [
      'Exact suffix removal → str.removesuffix',
      'Both ends → str.strip',
      'Left end → str.lstrip',
    ],
  },

  notes: {
    complexity: 'O(n) worst case — scans from the right',
    return:     'new str — source untouched',
    cpython:    'Objects/unicodeobject.c :: do_strip (RIGHTSTRIP)',
    memory:     'One new string sized to the kept slice',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.strip',    slug: 'strip',    when: 'Both ends' },
    { name: 'str.endswith', slug: 'endswith', when: 'Check before trimming' },
    { name: 'str.split',    slug: 'split',    when: 'Clean lines before tokenizing' },
  ],

  faq: [
    {
      q: 'How do I remove exactly one trailing newline?',
      a: 'rstrip("\\n") removes ALL trailing newlines. For exactly one, use removesuffix.',
      code: 'line.removesuffix("\\n")  # at most one',
    },
    {
      q: 'Does rstrip() remove \\r\\n line endings?',
      a: 'Yes — both \\r and \\n are whitespace, so the default strips Windows endings too.',
    },
  ],

  history: [
    { version: '3.9', note: 'Related: str.removesuffix added — the fix for the set-vs-suffix confusion.' },
    { version: '2.2', note: 'chars argument added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.rstrip',
    meta:  'str.rstrip',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
