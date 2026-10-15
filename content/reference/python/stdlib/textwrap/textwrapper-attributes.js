// content/reference/python/stdlib/textwrap/textwrapper-attributes.js — TextWrapper.wordsep_re / wordsep_simple_re / sentence_end_re / unicode_whitespace_trans

export const meta = {
  slug:        'textwrapper-attributes',
  name:        'TextWrapper.wordsep_re / wordsep_simple_re / sentence_end_re / unicode_whitespace_trans',
  signature:   'class W(TextWrapper): wordsep_re = … · wordsep_simple_re = … · sentence_end_re = … · unicode_whitespace_trans = …',
  blurb:       'The class attributes that decide how TextWrapper cuts text into chunks, which chunks end a sentence, and which whitespace becomes a space — override them in a subclass to change the splitting.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'textwrap TextWrapper.wordsep_re TextWrapper.wordsep_simple_re TextWrapper.sentence_end_re TextWrapper.unicode_whitespace_trans python textwrap regex chunks split words hyphen em-dash custom split subclass TextWrapper break after comma slash',
};

export const method = {
  slug:      'textwrapper-attributes',
  name:      'TextWrapper.wordsep_re / wordsep_simple_re / sentence_end_re / unicode_whitespace_trans',
  signature: 'class W(TextWrapper): wordsep_re = … · wordsep_simple_re = … · sentence_end_re = … · unicode_whitespace_trans = …',
  returns:   { type: 're.Pattern · re.Pattern · re.Pattern · dict', desc: 'Compiled once when textwrap is imported and shared by every TextWrapper; a subclass replaces them by assigning in its class body.' },

  category:    'TextWrapper attributes',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Wrapping happens on chunks, not characters: wordsep_re (used when break_on_hyphens is True) or wordsep_simple_re (otherwise) splits the text, and a line break can fall between any two chunks. They are not in the library reference, but they are plain class attributes, so a subclass can replace them.',

  covers: ['TextWrapper.wordsep_re', 'TextWrapper.wordsep_simple_re', 'TextWrapper.sentence_end_re', 'TextWrapper.unicode_whitespace_trans'],

  cheat: {
    commonCall: "class W(TextWrapper):\n    wordsep_simple_re = re.compile(r'(\\s+|(?<=,))')",
    returns:    'W(width=10, break_on_hyphens=False) may break after commas',
    replaces:   'post-processing wrapped lines by hand',
    watchOut:   'keep a capturing group, or the whitespace chunks are lost',
  },

  parameters: [],

  attributes: [
    { name: 'wordsep_re',               type: 're.Pattern', meaning: 'Verbose regex with one capturing group: whitespace runs, em-dashes (-- between words), and words — split after a hyphen only between letters (well-|known, state-|of-|the-|art). Used by _split when break_on_hyphens is True.' },
    { name: 'wordsep_simple_re',        type: 're.Pattern', meaning: "'([\\t\\n\\x0b\\x0c\\r ]+)' (each character escaped): split on runs of ASCII whitespace only. Used when break_on_hyphens is not True." },
    { name: 'sentence_end_re',          type: 're.Pattern', meaning: "'[a-z][.!?][\"\\']?\\Z' (escaped): a chunk ending in an ASCII lowercase letter, sentence punctuation and an optional quote. Used only by fix_sentence_endings." },
    { name: 'unicode_whitespace_trans', type: 'dict',       meaning: 'str.translate table {9: 32, 10: 32, 11: 32, 12: 32, 13: 32, 32: 32}: tab, newline, vertical tab, form feed and carriage return become spaces when replace_whitespace is True.' },
  ],

  modes: [
    {
      id: 'chunks',
      label: 'wordsep_re',
      blurb: 'The chunks wrap works with when break_on_hyphens=True (empty strings removed, as _split does).',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'from textwrap import TextWrapper\n[c for c in TextWrapper.wordsep_re.split({$text}) if c]',
      cases: [
        { id: 'goof',  label: 'goof-ball --', values: { text: 'Hello there -- you goof-ball' } },
        { id: 'art',   label: 'state-of-the-art', values: { text: 'state-of-the-art' } },
        { id: 'mixed', label: 'x--y a-b-c',   values: { text: 'well-known x--y a-b-c' } },
        { id: 'digit', label: 'digits',       values: { text: 'a1-b2 x-y' } },
      ],
    },
    {
      id: 'simple',
      label: 'wordsep_simple_re',
      blurb: 'With break_on_hyphens=False only ASCII whitespace separates chunks.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'from textwrap import TextWrapper\n[c for c in TextWrapper.wordsep_simple_re.split({$text}) if c]',
      cases: [
        { id: 'goof', label: 'goof-ball --', values: { text: 'Hello there -- you goof-ball' } },
        { id: 'nbsp', label: 'no-break space', values: { text: 'Pay 100\u00a0EUR now' } },
      ],
    },
    {
      id: 'sentence',
      label: 'sentence_end_re',
      blurb: 'Which chunks fix_sentence_endings treats as the end of a sentence.',
      params: [{ name: 'words', type: 'list[str]', hint: 'comma-separated chunks', input: 'csv' }],
      template: 'from textwrap import TextWrapper\n[bool(TextWrapper.sentence_end_re.search(w)) for w in {$words}]',
      cases: [
        { id: 'mix',   label: 'end. Dr. END.', values: { words: 'end., Dr., END., e.g., end?"' } },
        { id: 'accent', label: 'café.',        values: { words: 'café., cafe., 3.' } },
      ],
    },
  ],
  demoExplainer: "wordsep_re splits goof-ball after its hyphen and keeps -- as a chunk of its own; a hyphen is a break point only when letters surround it the right way, so 'a-b-c' and 'a1-b2' stay whole. wordsep_simple_re ignores hyphens, and the no-break space U+00A0 is not in its character class, so '100\\xa0EUR' is one chunk. sentence_end_re wants an ASCII lowercase letter before the punctuation: 'Dr.' and 'e.g.' match, 'END.', 'café.' and '3.' do not.",

  patterns: [
    {
      name: 'Allow breaks after commas',
      desc: 'Override wordsep_simple_re and turn break_on_hyphens off so it is used.',
      code: "import re\nfrom textwrap import TextWrapper\n\nclass CommaWrapper(TextWrapper):\n    wordsep_simple_re = re.compile(r'(\\s+|(?<=,))')\n\nCommaWrapper(width=10, break_on_hyphens=False).wrap('red,green,blue,yellow')",
    },
    {
      name: 'Break paths after slashes',
      desc: 'The same idea for long paths or URLs.',
      code: "import re\nfrom textwrap import TextWrapper\n\nclass PathWrapper(TextWrapper):\n    wordsep_simple_re = re.compile(r'(\\s+|(?<=/))')\n\nPathWrapper(width=30, break_on_hyphens=False, break_long_words=False).wrap(path)",
    },
    {
      name: 'Inspect the chunks of a text',
      desc: 'See where wrap is allowed to break.',
      code: 'from textwrap import TextWrapper\nchunks = [c for c in TextWrapper.wordsep_re.split(text) if c]',
    },
  ],

  examples: [
    { title: 'Chunks with break_on_hyphens=True', code: "from textwrap import TextWrapper\n[c for c in TextWrapper.wordsep_re.split('Look, goof-ball -- use the -b option!') if c]", returns: "['Look,', ' ', 'goof-', 'ball', ' ', '--', ' ', 'use', ' ', 'the', ' ', '-b', ' ', 'option!']" },
    { title: 'Chunks with break_on_hyphens=False', code: "from textwrap import TextWrapper\n[c for c in TextWrapper.wordsep_simple_re.split('Look, goof-ball -- use the -b option!') if c]", returns: "['Look,', ' ', 'goof-ball', ' ', '--', ' ', 'use', ' ', 'the', ' ', '-b', ' ', 'option!']" },
    { title: 'split() leaves empty strings', code: "from textwrap import TextWrapper\nTextWrapper.wordsep_re.split('a b')", returns: "['', 'a', '', ' ', '', 'b', '']" },
    { title: 'The whitespace table',          code: 'from textwrap import TextWrapper\nTextWrapper.unicode_whitespace_trans', returns: '{9: 32, 10: 32, 11: 32, 12: 32, 13: 32, 32: 32}' },
    { title: 'Applying it',                   code: "from textwrap import TextWrapper\n'a\\tb\\nc'.translate(TextWrapper.unicode_whitespace_trans)", returns: "'a b c'" },
    { title: 'What counts as a sentence end', code: "from textwrap import TextWrapper\n[bool(TextWrapper.sentence_end_re.search(w)) for w in ['end.', 'end.\"', 'Dr.', 'e.g.', 'END.', 'café.']]", returns: '[True, True, True, True, False, False]' },
    { title: 'Shared by all instances',       code: 'from textwrap import TextWrapper\nTextWrapper().wordsep_re is TextWrapper.wordsep_re', returns: 'True' },
    { title: 'Compiled with VERBOSE',         code: 'import re\nfrom textwrap import TextWrapper\nTextWrapper.wordsep_re.flags == re.VERBOSE | re.UNICODE', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Overriding wordsep_simple_re but keeping break_on_hyphens=True',
      desc: '_split uses wordsep_re whenever break_on_hyphens is True (the default), so the override is silently ignored.',
      wrong: { label: 'default', code: "import re\nfrom textwrap import TextWrapper\nclass CommaWrapper(TextWrapper):\n    wordsep_simple_re = re.compile(r'(\\s+|(?<=,))')\nCommaWrapper(width=10).wrap('red,green,blue,yellow')", output: "['red,green,', 'blue,yello', 'w']" },
      fix:   { label: 'break_on_hyphens=False', code: "import re\nfrom textwrap import TextWrapper\nclass CommaWrapper(TextWrapper):\n    wordsep_simple_re = re.compile(r'(\\s+|(?<=,))')\nCommaWrapper(width=10, break_on_hyphens=False).wrap('red,green,blue,yellow')", output: "['red,green,', 'blue,', 'yellow']" },
    },
    {
      name: 'A splitting regex without a capturing group',
      desc: 're.split only keeps the separators when they are captured. Without the group the spaces are gone and the words run together.',
      wrong: { label: "r'\\s+'", code: "import re\nfrom textwrap import TextWrapper\nclass NoGroup(TextWrapper):\n    wordsep_simple_re = re.compile(r'\\s+')\nNoGroup(width=20, break_on_hyphens=False).wrap('one two three')", output: "['onetwothree']" },
      fix:   { label: "r'(\\s+)'", code: "import re\nfrom textwrap import TextWrapper\nclass Group(TextWrapper):\n    wordsep_simple_re = re.compile(r'(\\s+)')\nGroup(width=20, break_on_hyphens=False).wrap('one two three')", output: "['one two three']" },
    },
  ],

  when: {
    use: [
      'Wrapping text whose natural break points are not spaces — comma lists, paths, URLs',
      'Understanding why wrap broke (or did not break) a line where it did',
    ],
    avoid: [
      'Assigning to TextWrapper.wordsep_re itself — that changes wrap, fill and shorten for the whole program; subclass instead',
      'Real hyphenation by syllables → a hyphenation library such as pyphen',
    ],
  },

  notes: {
    cpython:    'Lib/textwrap.py builds wordsep_re from small pieces: word_punct [\\w!"\\\'&.,?], letter [^\\d\\W] (any \\w character except decimal digits), whitespace [\\t\\n\\x0b\\x0c\\r ] — all deleted from the class after use',
    'Unicode':  'The patterns are str patterns, so \\w and [^\\d\\W] match Unicode letters: hyphenated words in any script are split the same way',
    'Docs':     'Not in the library reference (docs.python.org documents the options and methods only); they are plain class attributes of Lib/textwrap.py',
  },

  related: [
    { name: 'TextWrapper',   slug: 'textwrapper', when: 'The options, including break_on_hyphens' },
    { name: 'textwrap.wrap', slug: 'wrap',        when: 'What the chunks are wrapped into' },
    { name: 're.split',      slug: 'split',       when: 'How a capturing group keeps the separators', category: 'stdlib/re' },
    { name: 'str.translate()', slug: 'str-translate', when: 'Applies unicode_whitespace_trans', category: 'functions' },
    { name: 're module',     slug: 're',          when: 'Pattern objects and VERBOSE', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How does textwrap decide where it may break a line?',
      a: 'It splits the text into chunks with TextWrapper.wordsep_re (or wordsep_simple_re when break_on_hyphens is False) and only breaks between chunks — or inside a chunk that is longer than the line width, when break_long_words is True.',
    },
    {
      q: 'How can I make textwrap break after commas or slashes?',
      a: "Subclass TextWrapper, set wordsep_simple_re to a pattern with a capturing group such as re.compile(r'(\\s+|(?<=,))'), and create the wrapper with break_on_hyphens=False so that pattern is used.",
    },
    {
      q: 'Why does fix_sentence_endings treat "Dr." as the end of a sentence?',
      a: "sentence_end_re only looks at the end of a chunk: a lowercase ASCII letter, then . ! or ?, then an optional quote. 'Dr.' matches; 'USA.' and 'café.' do not. The rule is English-specific by design.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/textwrap.html#textwrap.TextWrapper',
    meta:  'textwrap.TextWrapper',
  },
};
