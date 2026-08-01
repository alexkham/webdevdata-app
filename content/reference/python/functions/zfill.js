// content/reference/python/functions/zfill.js

export const meta = {
  slug:        'zfill',
  name:        'str.zfill',
  signature:   'str.zfill(width)',
  blurb:       'Left-pad with zeros to a given width, sign-aware.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'zfill zero pad leading zeros width fill numeric',
};

export const method = {
  slug:      'zfill',
  name:      'str.zfill',
  signature: 'str.zfill(width)',
  returns:   { type: 'str', desc: 'A copy left-padded with ASCII zeros to at least width characters. A leading sign stays in front of the padding.' },

  category:    'String method',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'Zero-pad numbers-as-strings: IDs, timestamps, sortable filenames.',

  cheat: {
    commonCall: '"42".zfill(5)',
    returns:    'new str, length ≥ width',
    replaces:   'sign-aware: "-42".zfill(5) → "-0042"',
    watchOut:   'already-long strings come back unchanged — never truncated',
  },

  parameters: [
    { name: 'width', type: 'int', required: true, default: null, desc: 'Target minimum length. Shorter strings are padded; longer ones returned unchanged.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',   input: 'text' },
    { name: 'width',  type: 'int', hint: 'target width', input: 'number' },
  ],
  cases: [
    { id: 'default', label: 'default',   values: { string: '42',   width: 5 } },
    { id: 'sign',    label: 'signed',    values: { string: '-42',  width: 5 } },
    { id: 'long',    label: 'too long',  values: { string: '123456', width: 3 } },
    { id: 'text',    label: 'non-digits', values: { string: 'ab',  width: 4 } },
  ],
  demoExplainer: 'Zeros are inserted after any leading sign, before the rest. A string already at or past the width is returned untouched — zfill never truncates. It pads any string, not just digits.',

  patterns: [
    {
      name: 'Sortable numeric filenames',
      desc: 'Zero-padding makes lexicographic order match numeric order.',
      code: 'name = f"img_{str(i).zfill(4)}.png"\n# img_0001.png … img_0042.png',
    },
    {
      name: 'Fixed-width IDs and codes',
      desc: 'Invoice numbers, ZIP codes read from ints, etc.',
      code: 'invoice = str(n).zfill(8)',
    },
    {
      name: 'The f-string alternative',
      desc: 'For numbers you are formatting anyway, :0Nd does it inline.',
      code: 'f"{i:04d}"   # \'0042\' — same result, no str() call',
    },
  ],

  examples: [
    { title: 'Basic zero-padding',       code: '"42".zfill(5)',   returns: "'00042'" },
    { title: 'Sign stays in front',      code: '"-42".zfill(5)',  returns: "'-0042'" },
    { title: 'Longer than width',        code: '"123456".zfill(3)', returns: "'123456'" },
    { title: 'Works on any string',      code: '"ab".zfill(4)',   returns: "'00ab'" },
  ],

  pitfalls: [
    {
      name: 'zfill pads — it never truncates',
      desc: 'Fixed-width output needs an explicit slice for the overflow case.',
      wrong: { label: 'Still 6 chars', code: '"123456".zfill(3)', output: "'123456'" },
      fix:   { label: 'If truncation is wanted', code: 's.zfill(3)[-3:]', output: "'456' — explicit choice" },
    },
    {
      name: 'Only zfill is sign-aware — rjust is not',
      desc: 'Padding with rjust(5, "0") puts zeros BEFORE the minus sign.',
      wrong: { label: 'Broken number', code: '"-42".rjust(5, "0")', output: "'00-42'" },
      fix:   { label: 'Fix', code: '"-42".zfill(5)', output: "'-0042'" },
    },
  ],

  when: {
    use: [
      'Zero-padding strings you already have',
      'Sortable numeric filenames and IDs',
    ],
    avoid: [
      'Formatting a number directly → f"{n:04d}"',
      'Padding with other characters → str.rjust(width, char)',
      'Centering → str.center',
    ],
  },

  notes: {
    complexity: 'O(width)',
    return:     'new str — source untouched',
    cpython:    'Objects/unicodeobject.c :: unicode_zfill',
    memory:     'One new string of max(len, width)',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.isdigit', slug: 'isdigit', when: 'Validate digits before padding' },
    { name: 'int',         slug: 'int',     when: 'Parse the padded value back' },
    { name: 'str.rstrip',  slug: 'rstrip',  when: 'Trim instead of pad' },
  ],

  faq: [
    {
      q: 'zfill vs f-string :0Nd — which should I use?',
      a: 'If you have a number, format it directly with f"{n:04d}". zfill earns its keep when you already have a string (IDs read from files, user input).',
    },
    {
      q: 'How do I strip the zeros back off?',
      a: 'lstrip("0") — but guard the all-zeros case, which strips to empty.',
      code: 's.lstrip("0") or "0"',
    },
  ],

  history: [
    { version: '2.2', note: 'Method added to str.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.zfill',
    meta:  'str.zfill',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
