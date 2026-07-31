// content/reference/python/functions/capitalize.js

export const meta = {
  slug:        'capitalize',
  name:        'str.capitalize',
  signature:   'str.capitalize()',
  blurb:       'Return a copy with the first character titlecased and the rest lowercased.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'capitalize first letter sentence case title',
};

export const method = {
  slug:      'capitalize',
  name:      'str.capitalize',
  signature: 'str.capitalize()',
  returns:   { type: 'str', desc: 'A new string: first character titlecased, every other character lowercased.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Sentence case: first character up, everything else down — including characters that were already uppercase.',

  cheat: {
    commonCall: '"hello world".capitalize()',
    returns:    'new str — original unchanged',
    replaces:   'the REST is lowercased too — acronyms get flattened',
    watchOut:   'per-word capitals is str.title, not capitalize',
  },

  parameters: [],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default',  values: { string: 'hello world' } },
    { id: 'caps',    label: 'all caps', values: { string: 'HELLO WORLD' } },
    { id: 'acronym', label: 'acronym',  values: { string: 'NASA launched' } },
    { id: 'digit',   label: 'digit first', values: { string: '3rd place' } },
  ],
  demoExplainer: 'Only the first character is raised — and note what happens to the rest: it is actively lowercased, which flattens acronyms and mid-string capitals. A leading digit stays as is, and the rest still lowercases.',

  patterns: [
    {
      name: 'Sentence-case user input',
      desc: 'Normalize free-text answers for display.',
      code: 'display = answer.strip().capitalize()',
    },
    {
      name: 'Per-word capitals',
      desc: 'That is title(), or capitalize per word via split/join for more control.',
      code: '" ".join(w.capitalize() for w in name.split())',
    },
  ],

  examples: [
    { title: 'Basic sentence case',     code: '"hello world".capitalize()', returns: "'Hello world'" },
    { title: 'All caps get flattened',  code: '"HELLO".capitalize()',       returns: "'Hello'" },
    { title: 'Leading digit',           code: '"3rd place".capitalize()',   returns: "'3rd place'" },
    { title: 'Empty string',            code: '"".capitalize()',            returns: "''" },
  ],

  pitfalls: [
    {
      name: 'It lowercases the rest',
      desc: 'capitalize is not "raise the first letter" — it is full sentence-casing.',
      wrong: { label: 'Acronym lost', code: '"NASA launched".capitalize()', output: "'Nasa launched'" },
      fix:   { label: 'First letter only', code: 's[:1].upper() + s[1:]', output: "'NASA launched'" },
    },
    {
      name: 'Not per-word',
      desc: 'For headline-style capitals use title() — with its own apostrophe caveats.',
      wrong: { label: 'One word only', code: '"hello world".capitalize()', output: "'Hello world'" },
      fix:   { label: 'Per word', code: '"hello world".title()', output: "'Hello World'" },
    },
  ],

  when: {
    use: [
      'Sentence-casing display text',
      'Normalizing shouty ALL-CAPS input',
    ],
    avoid: [
      'Preserve the rest of the string → s[:1].upper() + s[1:]',
      'Per-word capitals → str.title',
      'Locale-aware casing → not built in; consider PyICU',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'new str — source untouched',
    cpython:    'Objects/unicodeobject.c :: do_capitalize',
    memory:     'One new string',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.upper', slug: 'upper', when: 'Everything up' },
    { name: 'str.lower', slug: 'lower', when: 'Everything down' },
    { name: 'str.strip', slug: 'strip', when: 'Trim before casing' },
  ],

  faq: [
    {
      q: 'How do I capitalize without lowercasing the rest?',
      a: 'Slice it manually — there is no built-in for that.',
      code: 's[:1].upper() + s[1:]',
    },
    {
      q: 'What is the difference between capitalize and title?',
      a: 'capitalize raises only the first character of the whole string; title raises the first letter of every word (and lowercases the rest of each word).',
      code: '"a tale of cities".capitalize()  # \'A tale of cities\'\n"a tale of cities".title()       # \'A Tale Of Cities\'',
    },
    {
      q: 'Why did "3rd".capitalize() not change anything?',
      a: 'The first character has no uppercase form (it is a digit), and the rest was already lowercase.',
    },
  ],

  history: [
    { version: '3.8', note: 'First character now titlecased (affects some ligatures/digraphs) rather than uppercased.' },
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.capitalize',
    meta:  'str.capitalize',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
