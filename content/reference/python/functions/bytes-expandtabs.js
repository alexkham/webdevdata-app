// content/reference/python/functions/bytes-expandtabs.js

export const meta = {
  slug:        'bytes-expandtabs',
  name:        'bytes.expandtabs',
  signature:   'bytes.expandtabs(tabsize=8)',
  blurb:       'Replace tabs with spaces — to the next tab STOP, not a fixed count.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes expandtabs tab spaces tabstop column align convert whitespace binary bytearray bytearray.expandtabs',
};

export const method = {
  slug:      'bytes-expandtabs',
  name:      'bytes.expandtabs',
  signature: 'bytes.expandtabs(tabsize=8)',
  returns:   { type: 'bytes', desc: 'A new bytes object with each tab replaced by enough spaces to reach the next multiple of tabsize. The column resets at each newline.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Not "tab becomes N spaces". Each tab advances to the next tab STOP, so the number of spaces depends on where the tab sits — which is what makes columns line up.',

  cheat: {
    commonCall: 'data.expandtabs(4)',
    returns:    'a new bytes object; the original is unchanged',
    replaces:   "data.replace(b'\\t', b'    '), which does NOT align columns",
    watchOut:   'a tab after 3 characters with tabsize 4 becomes ONE space, not four',
  },

  parameters: [
    { name: 'tabsize', type: 'int', required: false, default: '8', desc: 'Distance between tab stops in bytes. A tabsize of 0 removes tabs entirely.' },
  ],

  demoParams: [
    { name: 's',       type: 'str', hint: 'data with tabs (encoded as utf-8)', input: 'text' },
    { name: 'tabsize', type: 'int', hint: 'tab stop spacing',                  input: 'number' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').expandtabs({tabsize})",
  cases: [
    { id: 'start',   label: 'tab at column 1',   values: { s: 'a\tb',   tabsize: 4 } },
    { id: 'col3',    label: 'tab at column 3 (!)',values: { s: 'abc\td', tabsize: 4 } },
    { id: 'two',     label: 'two tabs',          values: { s: 'a\tb\tc', tabsize: 4 } },
    { id: 'eight',   label: 'default 8',         values: { s: 'a\tb',   tabsize: 8 } },
    { id: 'zero',    label: 'tabsize 0 removes', values: { s: 'a\tb',   tabsize: 0 } },
  ],
  demoExplainer: 'Compare the first two cases. After one character, a tab with tabsize 4 becomes three spaces, landing on column 4. After three characters the same tab becomes ONE space, because column 4 is only one step away. That is the tab-stop rule: the tab fills up to the next multiple of tabsize, however far that is. With tabsize 0 the tabs are simply deleted.',

  patterns: [
    {
      name: 'Normalise tabbed input before display',
      desc: 'Keeps columns aligned regardless of the viewer\'s tab width.',
      code: 'clean = line.expandtabs(4)',
    },
    {
      name: 'Prepare data for a fixed-width parser',
      desc: 'Parsers that count bytes cannot cope with tabs.',
      code: 'record = raw.expandtabs(8)',
    },
    {
      name: 'Strip tabs entirely',
      desc: 'A tabsize of 0 removes them without a replace call.',
      code: 'no_tabs = data.expandtabs(0)',
    },
  ],

  examples: [
    { title: 'Tab at column 1', code: "b'a\\tb'.expandtabs(4)",   returns: "b'a   b'" },
    { title: 'Tab at column 3', code: "b'abc\\td'.expandtabs(4)", returns: "b'abc d'" },
    { title: 'Default is 8',    code: "b'a\\tb'.expandtabs()",    returns: "b'a       b'" },
    { title: 'Resets at newline', code: "b'ab\\tc\\nd\\te'.expandtabs(4)", returns: "b'ab  c\\nd   e'" },
    { title: 'Tabsize 0 removes', code: "b'a\\tb'.expandtabs(0)", returns: "b'ab'" },
    { title: 'No tabs',         code: "b'abc'.expandtabs(4)",     returns: "b'abc'" },
  ],

  pitfalls: [
    {
      name: 'A tab is not a fixed number of spaces',
      desc: 'The single most common misunderstanding. Each tab advances to the next tab stop, so the same tabsize produces a different number of spaces depending on the column. Using replace instead breaks alignment.',
      wrong: { label: 'Fixed count', code: "b'abc\\td'.replace(b'\\t', b'    ')", output: "b'abc    d'  # misaligned" },
      fix:   { label: 'Tab stops',   code: "b'abc\\td'.expandtabs(4)", output: "b'abc d'  # lands on column 4" },
    },
    {
      name: 'Columns are counted in bytes',
      desc: 'A multi-byte character advances the column by its byte count, not by one, so tabbed text containing non-ASCII misaligns compared with how it displays.',
      wrong: { label: 'Byte columns', code: "'é\\tb'.encode().expandtabs(4)", output: "b'\\xc3\\xa9  b'  # 2 bytes, then 2 spaces" },
      fix:   { label: 'Expand text',  code: "'é\\tb'.expandtabs(4).encode()", output: 'character columns' },
    },
    {
      name: 'It returns a new object',
      desc: 'Bytes are immutable. The result must be assigned or it is lost.',
      wrong: { label: 'Result dropped', code: 'data.expandtabs(4)\ndata', output: 'unchanged' },
      fix:   { label: 'Assign it',      code: 'data = data.expandtabs(4)', output: 'expanded' },
    },
  ],

  when: {
    use: [
      'Aligning tabbed input for display or a fixed-width parser',
      'Normalising whitespace before comparing lines',
      'Removing tabs with tabsize 0',
    ],
    avoid: [
      'You want a fixed number of spaces per tab → replace',
      'Text with non-ASCII characters → decode first',
      'The data is binary — tab bytes may be meaningful',
    ],
  },

  notes: {
    complexity: 'O(n + inserted spaces) — one pass tracking the column',
    return:     'A new bytes object; longer than the input by the spaces added',
    cpython:    'Objects/bytesobject.c :: stringlib_expandtabs',
    memory:     'Allocates a buffer sized for the expanded result',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'str.expandtabs', slug: 'str-expandtabs', when: 'The str version, counting characters' },
    { name: 'bytes.replace',  slug: 'bytes-replace',  when: 'A fixed substitution with no column logic' },
    { name: 'bytes.split',    slug: 'bytes-split',    when: 'Split on tabs instead of expanding them' },
    { name: 'bytes.strip',    slug: 'bytes-strip',    when: 'Remove whitespace at the ends' },
  ],

  faq: [
    {
      q: 'Why did one tab become a single space?',
      a: 'Because the tab only needs to advance to the NEXT tab stop. If the data is already at column 3 and stops are every 4, one space reaches column 4. That is what keeps the following text aligned across lines with different prefixes.',
      code: "b'a\\tb'.expandtabs(4)     # b'a   b'\nb'abc\\tb'.expandtabs(4)   # b'abc b'",
    },
    {
      q: 'Does the column reset on a newline?',
      a: 'Yes — after \\n or \\r the column goes back to zero, so each line is expanded independently. That is what makes it usable on multi-line data.',
    },
    {
      q: 'Does bytearray have expandtabs?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.expandtabs arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.expandtabs',
    meta:  'bytes.expandtabs',
  },

};
