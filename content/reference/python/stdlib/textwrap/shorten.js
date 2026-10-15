// content/reference/python/stdlib/textwrap/shorten.js

export const meta = {
  slug:        'shorten',
  name:        'textwrap.shorten',
  signature:   "textwrap.shorten(text, width, *, fix_sentence_endings=False, break_long_words=True, break_on_hyphens=True, placeholder=' [...]')",
  blurb:       'Collapse all whitespace to single spaces and, if the result is still longer than width, keep as many whole words as fit and append a placeholder.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'textwrap shorten python truncate string at word boundary ellipsis shorten text to length without cutting words placeholder preview summary title truncate with dots',
};

export const method = {
  slug:      'shorten',
  name:      'textwrap.shorten',
  signature: "textwrap.shorten(text, width, *, fix_sentence_endings=False, break_long_words=True, break_on_hyphens=True, placeholder=' [...]')",
  returns:   { type: 'str', desc: 'The collapsed text if it fits, otherwise whole words plus the placeholder — never longer than width.' },

  category:    'textwrap function',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Truncation that respects words: "Hello world" never becomes "Hello wo...". The placeholder counts toward width, and all whitespace — newlines and tabs included — is collapsed first.',

  covers: ['shorten'],

  cheat: {
    commonCall: "textwrap.shorten(title, width=40, placeholder='...')",
    returns:    "'Whole words that fit...'",
    replaces:   "text[:n] + '...', which cuts words and ignores the dots' length",
    watchOut:   'a single word longer than width leaves only the placeholder',
  },

  parameters: [
    { name: 'text',        type: 'str', required: true, default: null, desc: 'Any text; runs of whitespace (spaces, tabs, newlines, other Unicode spaces) become one space and the ends are stripped.' },
    { name: 'width',       type: 'int', required: true, default: null, desc: 'Maximum length of the result, placeholder included.' },
    { name: 'placeholder', type: 'str', required: false, default: "' [...]'", desc: "Appended when words were dropped. Without its leading whitespace it must fit in width, else ValueError. With placeholder='' a word that does not fit is cut at width instead of dropped." },
    { name: 'fix_sentence_endings', type: 'bool', required: false, default: 'False', desc: 'Two spaces after sentence-ending punctuation (as in TextWrapper).' },
    { name: 'break_long_words', type: 'bool', required: false, default: 'True', desc: 'Passed to TextWrapper. With a non-empty placeholder a word too long for the line is still dropped: the piece cut at width leaves no room for the placeholder.' },
    { name: 'break_on_hyphens', type: 'bool', required: false, default: 'True', desc: 'Allow a cut after the hyphen of a compound word.' },
  ],

  modes: [
    {
      id: 'shorten',
      label: 'shorten',
      blurb: 'Whitespace is collapsed first; words are dropped from the end until the rest plus " [...]" fits.',
      params: [
        { name: 'text',  type: 'str', hint: 'any text', input: 'text' },
        { name: 'width', type: 'int', hint: 'maximum length', input: 'number' },
      ],
      template: 'import textwrap\ntextwrap.shorten({$text}, width={$width})',
      cases: [
        { id: 'fits', label: 'fits',          values: { text: 'Hello  world!', width: '12' } },
        { id: 'cut',  label: 'too long',      values: { text: 'Hello  world!', width: '11' } },
        { id: 'fox',  label: 'a sentence',    values: { text: 'The quick brown fox jumps over the lazy dog', width: '25' } },
        { id: 'word', label: 'one long word', values: { text: 'Supercalifragilistic', width: '10' } },
        { id: 'tiny', label: 'width=3',       values: { text: 'Hello world', width: '3' } },
      ],
    },
    {
      id: 'placeholder',
      label: 'placeholder',
      blurb: 'Your own marker for the cut. Its length counts toward width.',
      params: [
        { name: 'text',        type: 'str', hint: 'any text', input: 'text' },
        { name: 'width',       type: 'int', hint: 'maximum length', input: 'number' },
        { name: 'placeholder', type: 'str', hint: 'marker for the cut', input: 'text' },
      ],
      template: 'import textwrap\ntextwrap.shorten({$text}, width={$width}, placeholder={$placeholder})',
      cases: [
        { id: 'dots',  label: '...',      values: { text: 'Hello world', width: '10', placeholder: '...' } },
        { id: 'ell',   label: '…',        values: { text: 'Understanding Python context managers in depth', width: '21', placeholder: '…' } },
        { id: 'more',  label: ' (more)',  values: { text: 'The quick brown fox', width: '12', placeholder: ' (more)' } },
      ],
    },
  ],
  demoExplainer: "'Hello  world!' collapses to 'Hello world!', 12 characters, so width=12 returns it whole. At width=11 'world!' plus ' [...]' does not fit, leaving 'Hello [...]'. A single word longer than width is not kept partly — the piece that would fit leaves no room for the placeholder — so only '[...]' is left, and at width=3 even that does not fit: ValueError: placeholder too large for max width.",

  patterns: [
    {
      name: 'Titles and previews',
      desc: 'A one-line preview that never cuts a word.',
      code: "import textwrap\npreview = textwrap.shorten(post.body, width=140, placeholder='…')",
    },
    {
      name: 'Normalize whitespace only',
      desc: "With a width larger than the text, shorten is just ' '.join(text.split()).",
      code: "import textwrap\nclean = textwrap.shorten(text, width=len(text) + 1)",
    },
    {
      name: 'Table cells of fixed width',
      desc: 'Shorten, then pad, so columns line up.',
      code: "import textwrap\nprint(textwrap.shorten(name, width=20, placeholder='…').ljust(20), price)",
    },
  ],

  examples: [
    { title: 'Fits after collapsing whitespace', code: "import textwrap\ntextwrap.shorten('Hello  world!', width=12)", returns: "'Hello world!'" },
    { title: 'Words dropped, placeholder added', code: "import textwrap\ntextwrap.shorten('Hello  world!', width=11)", returns: "'Hello [...]'" },
    { title: 'Custom placeholder',               code: "import textwrap\ntextwrap.shorten('Hello world', width=10, placeholder='...')", returns: "'Hello...'" },
    { title: 'Newlines and tabs are collapsed',  code: "import textwrap\ntextwrap.shorten('  lots   of\\n\\twhitespace  ', width=40)", returns: "'lots of whitespace'" },
    { title: 'One word longer than width',       code: "import textwrap\ntextwrap.shorten('Supercalifragilistic', width=10)", returns: "'[...]'" },
    { title: "placeholder='' cuts the word instead", code: "import textwrap\ntextwrap.shorten('Supercalifragilistic', width=10, placeholder='')", returns: "'Supercalif'" },
    { title: 'The placeholder must fit',         code: "import textwrap\ntextwrap.shorten('Hello world', width=3)", returns: 'ValueError: placeholder too large for max width' },
    { title: 'max_lines is fixed at 1',          code: "import textwrap\ntextwrap.shorten('Hello world', width=11, max_lines=2)", returns: "TypeError: textwrap.TextWrapper() got multiple values for keyword argument 'max_lines'" },
  ],

  pitfalls: [
    {
      name: 'Slicing and adding dots',
      desc: 'text[:n] cuts in the middle of a word. shorten keeps whole words, and the placeholder is part of the width.',
      wrong: { label: 'slice', code: "title = 'Understanding Python context managers in depth'\ntitle[:18] + '...'", output: "'Understanding Pyth...'" },
      fix:   { label: 'shorten', code: "import textwrap\ntitle = 'Understanding Python context managers in depth'\ntextwrap.shorten(title, width=21, placeholder='...')", output: "'Understanding...'" },
    },
    {
      name: 'A width smaller than the placeholder',
      desc: "The default ' [...]' needs 5 characters (its leading space is dropped when it stands alone). Below that shorten raises; use a shorter placeholder.",
      wrong: { label: 'width=3', code: "import textwrap\ntextwrap.shorten('Hello world', width=3)", output: 'ValueError: placeholder too large for max width' },
      fix:   { label: "placeholder='…'", code: "import textwrap\ntextwrap.shorten('Hello world', width=3, placeholder='…')", output: "'…'" },
    },
    {
      name: 'Expecting part of a long word',
      desc: 'shorten drops the words it cannot fit together with the placeholder. When even the first word does not fit, the result is just the placeholder — slice explicitly if you want the beginning of the word.',
      wrong: { label: 'shorten', code: "import textwrap\ntextwrap.shorten('Supercalifragilistic', width=10, placeholder='…')", output: "'…'" },
      fix:   { label: 'slice', code: "word = 'Supercalifragilistic'\nword[:9] + '…'", output: "'Supercali…'" },
    },
  ],

  when: {
    use: [
      'Titles, previews, notifications and table cells with a length limit',
      'Collapsing messy whitespace in user input to single spaces',
    ],
    avoid: [
      'Several lines of output → textwrap.wrap with max_lines',
      'Byte limits (database columns, protocols) → measure the encoded length instead',
    ],
  },

  notes: {
    cpython:      "Lib/textwrap.py: TextWrapper(width=width, max_lines=1, **kwargs).fill(' '.join(text.strip().split()))",
    'Whitespace': 'str.split() splits on every Unicode whitespace character, so a no-break space is collapsed here too — unlike in wrap',
    'Ignored options': 'Because whitespace is collapsed before wrapping, tabsize, expand_tabs, drop_whitespace and replace_whitespace have no effect',
  },

  related: [
    { name: 'textwrap.wrap', slug: 'wrap',        when: 'max_lines and placeholder on several lines' },
    { name: 'TextWrapper',   slug: 'textwrapper', when: 'The class shorten uses' },
    { name: 'str.split()',   slug: 'split',       when: 'What collapses the whitespace', category: 'functions' },
    { name: 'str.ljust()',   slug: 'str-ljust',   when: 'Pad shortened text into columns', category: 'functions' },
    { name: 'textwrap module', slug: 'textwrap',  when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I truncate a string in Python without cutting words?',
      a: "textwrap.shorten(text, width=50, placeholder='...') keeps as many whole words as fit, including the placeholder in the 50 characters. If the text already fits it is returned with its whitespace collapsed.",
    },
    {
      q: 'Why does textwrap.shorten change my spaces and newlines?',
      a: "It always collapses whitespace first: ' '.join(text.strip().split()). Every run of spaces, tabs or newlines becomes one space, even when the text is short enough.",
    },
    {
      q: 'Why does textwrap.shorten return only [...]?',
      a: "The first word alone (plus the placeholder) is longer than width. shorten breaks only between words or after a hyphen; it does not cut a word anywhere else to make room for the placeholder. Increase width, use a shorter placeholder, or slice the text yourself. (With placeholder='' it does cut the word at width.)",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/textwrap.html#textwrap.shorten',
    meta:  'textwrap.shorten',
  },
};
