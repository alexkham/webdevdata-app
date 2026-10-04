// content/reference/python/functions/bytes-title.js

export const meta = {
  slug:        'bytes-title',
  name:        'bytes.title',
  signature:   'bytes.title()',
  blurb:       'Capitalise the first letter of every word — with a loose definition of "word".',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes title case headline capitalise words apostrophe ascii binary bytearray bytearray.title',
};

export const method = {
  slug:      'bytes-title',
  name:      'bytes.title',
  signature: 'bytes.title()',
  returns:   { type: 'bytes', desc: 'A new bytes object where each ASCII letter that follows a non-letter is uppercased and every other ASCII letter is lowercased.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Headline case, where a "word" starts after ANY non-letter. That rule is what turns it\'s into It\'S and makes title unsuitable for real names.',

  cheat: {
    commonCall: 'data.title()',
    returns:    'a new bytes object; the original is unchanged',
    replaces:   'splitting on spaces and capitalising each piece',
    watchOut:   "an apostrophe starts a new word: b\"it's\" becomes b\"It'S\"",
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').title()",
  cases: [
    { id: 'basic',   label: 'two words',        values: { s: 'hello world' } },
    { id: 'shout',   label: 'uppercase input',  values: { s: 'HELLO WORLD' } },
    { id: 'hyphen',  label: 'hyphenated',       values: { s: 'well-known' } },
    { id: 'digits',  label: 'digit starts word',values: { s: 'abc1def' } },
    { id: 'empty',   label: 'empty',            values: { s: '' } },
  ],
  demoExplainer: 'A letter is uppercased whenever the byte before it is not a letter — so the start of the data, a space, a hyphen and a digit all begin a new word. That is why well-known becomes Well-Known and abc1def becomes Abc1Def. Everything else is lowercased, which is why uppercase input comes out as Hello World rather than staying shouted. The apostrophe case is the famous one: it\'s becomes It\'S, because the apostrophe is not a letter.',

  patterns: [
    {
      name: 'Headline-case an ASCII label',
      desc: 'Fine for simple space-separated words.',
      code: 'heading = raw.title()',
    },
    {
      name: 'Check whether data is already title case',
      desc: 'istitle answers the question without rebuilding the buffer.',
      code: 'if data.istitle():\n    ...',
    },
    {
      name: 'Title-case real text properly',
      desc: 'Decode, then use string.capwords, which splits on whitespace only.',
      code: "import string\nstring.capwords(data.decode('utf-8'))",
    },
  ],

  examples: [
    { title: 'Two words',     code: "b'hello world'.title()", returns: "b'Hello World'" },
    { title: 'Uppercase in',  code: "b'HELLO WORLD'.title()", returns: "b'Hello World'" },
    { title: 'Hyphen',        code: "b'well-known'.title()",  returns: "b'Well-Known'" },
    { title: 'Digit boundary',code: "b'abc1def'.title()",     returns: "b'Abc1Def'" },
    { title: 'Apostrophe',    code: "b\"it's\".title()",      returns: "b\"It'S\"" },
    { title: 'Empty',         code: "b''.title()",            returns: "b''" },
  ],

  pitfalls: [
    {
      name: 'Apostrophes start new words',
      desc: 'The classic failure. Because an apostrophe is not a letter, the letter after it is treated as the start of a word and uppercased, mangling contractions and possessives.',
      wrong: { label: 'Mangled', code: "b\"it's\".title()", output: "b\"It'S\"" },
      fix:   { label: 'capwords on text', code: "import string\nstring.capwords(\"it's\")", output: "\"It's\"" },
    },
    {
      name: 'It lowercases everything else',
      desc: 'Like capitalize, title flattens any existing capitals that are not at a word start. Acronyms and mixed-case names lose their casing.',
      wrong: { label: 'Acronym flattened', code: "b'NASA launch'.title()", output: "b'Nasa Launch'" },
      fix:   { label: 'Handle it yourself', code: "b' '.join(w if w.isupper() else w.title() for w in data.split())", output: 'keeps NASA' },
    },
    {
      name: 'Non-ASCII bytes break words in the wrong place',
      desc: 'Worse than being ignored: an accented letter is non-letter bytes to the bytes method, so it neither gets capitalised NOR counts as part of the word — the letter AFTER it is treated as a new word start and uppercased. élan becomes éLan.',
      wrong: { label: 'Capital in the middle', code: "'élan vital'.encode().title()", output: "b'\\xc3\\xa9Lan Vital'" },
      fix:   { label: 'Work on text',         code: "'élan vital'.title().encode()", output: "b'\\xc3\\x89lan Vital'" },
    },
  ],

  when: {
    use: [
      'Headline-casing simple ASCII labels with plain spaces',
      'Quick normalisation of consistently formatted input',
    ],
    avoid: [
      'Anything with apostrophes, hyphens or digits inside words',
      'Names and acronyms that must keep their own casing',
      'Real text → decode and use string.capwords',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass over the bytes',
    return:     'A new bytes object of the same length',
    cpython:    'Objects/bytesobject.c :: stringlib_title',
    memory:     'Allocates a buffer the same size as the input',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.capitalize', slug: 'bytes-capitalize', when: 'Capitalise only the first word' },
    { name: 'bytes.upper',      slug: 'bytes-upper',      when: 'Uppercase everything' },
    { name: 'title',            slug: 'title',            when: 'The str version, with the same word rule' },
    { name: 'bytes.isalpha and the is* family', slug: 'bytes-is-methods', when: 'istitle tests without rebuilding' },
  ],

  faq: [
    {
      q: "Why does it's become It'S?",
      a: 'Because title starts a new word after any byte that is not a letter, and an apostrophe is not a letter. The s is therefore the first letter of a "word" and gets uppercased. There is no option to change this rule; use string.capwords on decoded text instead.',
      code: "import string\nstring.capwords(\"it's here\")\n# \"It's Here\"",
    },
    {
      q: 'What counts as a word boundary?',
      a: 'Any non-letter byte: space, punctuation, digits, the start of the data. Hyphens and digits therefore split words too, which is why well-known becomes Well-Known.',
    },
    {
      q: 'Does bytearray have title?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.title arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.title',
    meta:  'bytes.title',
  },

};
