// content/reference/python/functions/title.js

export const meta = {
  slug:        'title',
  name:        'str.title',
  signature:   'str.title()',
  blurb:       'Return a titlecased copy — every word starts uppercase.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'title titlecase capitalize words headline case',
};

export const method = {
  slug:      'title',
  name:      'str.title',
  signature: 'str.title()',
  returns:   { type: 'str', desc: 'A new string where each run of letters starts uppercase and continues lowercase.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Headline-style capitals: every word up — with a famous apostrophe quirk.',

  cheat: {
    commonCall: '"war and peace".title()',
    returns:    'new str — original unchanged',
    replaces:   'word boundary = any non-letter, so "don\'t" → "Don\'T"',
    watchOut:   'acronyms get flattened: "NASA" → "Nasa"',
  },

  parameters: [],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
  ],
  cases: [
    { id: 'default',    label: 'default',    values: { string: 'war and peace' } },
    { id: 'apostrophe', label: 'apostrophe', values: { string: "don't stop" } },
    { id: 'acronym',    label: 'acronym',    values: { string: 'NASA and ESA' } },
    { id: 'digits',     label: 'digits',     values: { string: '3rd place win' } },
  ],
  demoExplainer: 'Every run of letters starts uppercase and continues lowercase. Watch the apostrophe case: the letter after it counts as a new word — Python’s documented quirk, reproduced faithfully here.',

  patterns: [
    {
      name: 'Display names and headings',
      desc: 'Fine for simple ASCII headings; check the caveats for real names.',
      code: 'heading = topic.title()',
    },
    {
      name: 'Apostrophe-safe titlecasing',
      desc: 'The docs-recommended workaround using a regex on word starts.',
      code: 'import re\nre.sub(r"[A-Za-z]+(\'[A-Za-z]+)?",\n       lambda m: m.group(0).capitalize(), s)',
    },
  ],

  examples: [
    { title: 'Basic titlecasing',     code: '"war and peace".title()', returns: "'War And Peace'" },
    { title: 'The apostrophe quirk',  code: '"don\'t stop".title()',   returns: "\"Don'T Stop\"" },
    { title: 'Acronyms flatten',      code: '"NASA launch".title()',   returns: "'Nasa Launch'" },
    { title: 'Digits start words',    code: '"3rd place".title()',     returns: "'3Rd Place'" },
  ],

  pitfalls: [
    {
      name: 'Apostrophes split words',
      desc: 'Any non-letter is a boundary, so contractions get a capital mid-word.',
      wrong: { label: 'Quirk', code: '"they\'re here".title()', output: "\"They'Re Here\"" },
      fix:   { label: 'Regex workaround', code: 'import re\nre.sub(r"[A-Za-z]+(\'[A-Za-z]+)?",\n       lambda m: m.group(0).capitalize(), s)', output: "\"They're Here\"" },
    },
    {
      name: 'Acronyms and mixed case are destroyed',
      desc: 'title() lowercases everything after each first letter.',
      wrong: { label: 'Flattened', code: '"visit NASA HQ".title()', output: "'Visit Nasa Hq'" },
      fix:   { label: 'Capitalize selectively', code: '" ".join(w if w.isupper() else w.capitalize()\n         for w in s.split())', output: "'Visit NASA HQ'" },
    },
    {
      name: 'Small words get capitalized too',
      desc: 'Real headline style leaves "and", "of", "the" lowercase — title() has no such rules.',
      wrong: { label: 'Not editorial style', code: '"lord of the rings".title()', output: "'Lord Of The Rings'" },
      fix:   { label: 'Roll your own rules', code: 'SMALL = {"of", "the", "and"}\n" ".join(w if w in SMALL and i else w.capitalize()\n         for i, w in enumerate(s.split()))', output: "'Lord of the Rings'" },
    },
  ],

  when: {
    use: [
      'Quick headline casing of simple ASCII text',
      'Display formatting where the quirks cannot occur',
    ],
    avoid: [
      'Contractions or possessives present → regex workaround',
      'Acronyms must survive → custom per-word logic',
      'Sentence case → str.capitalize',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'new str — source untouched',
    cpython:    'Objects/unicodeobject.c :: do_title',
    memory:     'One new string',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.capitalize', slug: 'capitalize', when: 'First character of the whole string only' },
    { name: 'str.upper',      slug: 'upper',      when: 'Everything up' },
    { name: 'str.lower',      slug: 'lower',      when: 'Everything down' },
  ],

  faq: [
    {
      q: 'Why does "don\'t".title() give "Don\'T"?',
      a: 'title() defines a word as a run of letters. The apostrophe is not a letter, so "t" starts a new word and gets capitalized. The docs themselves show a regex workaround.',
    },
    {
      q: 'How do I check if a string is already titlecased?',
      a: 'str.istitle — with the same word-boundary rules.',
      code: '"War And Peace".istitle()  # True',
    },
  ],

  history: [
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.title',
    meta:  'str.title',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
