// content/reference/python/functions/strip.js

export const meta = {
  slug:        'strip',
  name:        'str.strip',
  signature:   'str.strip(chars=None)',
  blurb:       'Return a copy with leading and trailing characters removed.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'strip trim whitespace remove clean',
};

export const method = {
  slug:      'strip',
  name:      'str.strip',
  signature: 'str.strip(chars=None)',
  returns:   { type: 'str', desc: 'A new string with leading and trailing characters removed. The middle is never touched.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Trim whitespace — or any set of characters — from both ends of the string.',

  cheat: {
    commonCall: '"  hi  ".strip()',
    returns:    'new str — original unchanged',
    replaces:   'chars is a SET of characters, not a substring',
    watchOut:   'only the ends are trimmed — inner whitespace stays',
  },

  parameters: [
    { name: 'chars', type: 'str | None', required: false, default: 'None', desc: 'The set of characters to remove from both ends, in any order and combination. None (the default) strips whitespace.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',          input: 'text' },
    { name: 'chars',  type: 'str', hint: 'empty = whitespace',  input: 'text-or-none' },
  ],
  cases: [
    { id: 'default', label: 'default',      values: { string: '   hello   ', chars: '' } },
    { id: 'chars',   label: 'char set',     values: { string: 'xxhelloyy',   chars: 'xy' } },
    { id: 'inner',   label: 'inner spaces', values: { string: '  a b  ',     chars: '' } },
    { id: 'all',     label: 'all stripped', values: { string: 'aaa',         chars: 'a' } },
  ],
  demoExplainer: 'strip removes characters from both ends until it meets one not in the set. chars is treated as a set — "xy" removes x\u2019s and y\u2019s in any order. Leave the field empty for the whitespace default.',

  patterns: [
    {
      name: 'Clean user input',
      desc: 'The near-universal first step before validating a form field.',
      code: 'username = raw.strip()',
    },
    {
      name: 'Trim punctuation',
      desc: 'Remove a known set of wrapper characters in one call.',
      code: '"\'quoted\'".strip("\'\\"")\n# \'quoted\'',
    },
    {
      name: 'Clean every line of a file',
      desc: 'Drops the trailing newline and any stray spaces per line.',
      code: 'lines = [ln.strip() for ln in f]',
    },
  ],

  examples: [
    { title: 'Strip whitespace (default)',   code: '"  hello  ".strip()',   returns: "'hello'" },
    { title: 'Strip a set of characters',    code: '"xxhelloyy".strip("xy")', returns: "'hello'" },
    { title: 'Inner whitespace survives',    code: '"  a b  ".strip()',     returns: "'a b'" },
    { title: 'Nothing to strip',             code: '"hello".strip()',       returns: "'hello'" },
  ],

  pitfalls: [
    {
      name: 'chars is a character set, not a substring',
      desc: 'strip("ab") does not remove the sequence "ab" — it removes every a and b from the ends.',
      wrong: { label: 'Surprising', code: '"banana".strip("ban")', output: "''" },
      fix:   { label: 'Remove a prefix instead', code: '"banana".removeprefix("ban")', output: "'ana'" },
    },
    {
      name: 'The result must be assigned',
      desc: 'Strings are immutable — strip returns a new string.',
      wrong: { label: 'Wrong', code: 's = " hi "\ns.strip()\nprint(repr(s))', output: "' hi '" },
      fix:   { label: 'Fix', code: 's = s.strip()\nprint(repr(s))', output: "'hi'" },
    },
    {
      name: 'Inner whitespace is not touched',
      desc: 'strip only works at the ends; collapsing inner runs needs split/join.',
      wrong: { label: 'Not enough', code: '"  a   b  ".strip()', output: "'a   b'" },
      fix:   { label: 'Collapse inner too', code: '" ".join("  a   b  ".split())', output: "'a b'" },
    },
  ],

  when: {
    use: [
      'Cleaning user input before validation',
      'Removing trailing newlines from file lines',
      'Trimming a known set of wrapper characters',
    ],
    avoid: [
      'Removing an exact prefix/suffix → str.removeprefix / str.removesuffix',
      'One side only → str.lstrip / str.rstrip',
      'Collapsing inner whitespace → " ".join(s.split())',
    ],
  },

  notes: {
    complexity: 'O(n) — scans from both ends',
    return:     'new str — source untouched',
    cpython:    'Objects/unicodeobject.c :: do_strip',
    memory:     'One new string sized to the kept slice',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.split',   slug: 'split',   when: 'Strip then tokenize' },
    { name: 'str.replace', slug: 'replace', when: 'Remove characters anywhere, not just ends' },
    { name: 'str.lower',   slug: 'lower',   when: 'Normalize case after trimming' },
  ],

  faq: [
    {
      q: 'How do I strip only the left or right side?',
      a: 'Use lstrip or rstrip — same semantics, one end.',
      code: '"  hi  ".rstrip()  # \'  hi\'',
    },
    {
      q: 'How do I remove an exact substring from the start?',
      a: 'str.removeprefix (Python 3.9+). strip would treat it as a character set.',
      code: '"test_name".removeprefix("test_")  # \'name\'',
    },
    {
      q: 'What counts as whitespace for the default?',
      a: 'Everything str.isspace() accepts: space, tab, newline, carriage return, vertical tab, form feed, and Unicode spaces.',
    },
  ],

  history: [
    { version: '3.9', note: 'Related: str.removeprefix / str.removesuffix added for exact-substring trimming.' },
    { version: '2.2', note: 'chars argument added — earlier versions stripped whitespace only.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.strip',
    meta:  'str.strip',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
