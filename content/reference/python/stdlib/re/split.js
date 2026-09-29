// content/reference/python/stdlib/re/split.js

export const meta = {
  slug:        'split',
  name:        're.split',
  signature:   're.split(pattern, string, maxsplit=0, flags=0)',
  blurb:       'Split a string wherever a pattern matches — several separators at once, keep the separators with a group, limit with maxsplit.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're split python regex split string multiple delimiters separators keep delimiters capturing group maxsplit empty strings Pattern.split split on whitespace',
};

export const method = {
  slug:      'split',
  name:      're.split',
  signature: 're.split(pattern, string, maxsplit=0, flags=0)',
  returns:   { type: 'list[str | None]', desc: 'The pieces between matches; with capturing groups, the group texts are inserted between them (None for groups that did not match).' },

  category:    're function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'str.split for patterns. Capturing groups in the separator are kept in the result, and a separator at either end produces an empty string there. Also available as Pattern.split(string, maxsplit=0).',

  covers: ['split', 'Pattern.split'],

  cheat: {
    commonCall: "re.split(r'[,;]\\s*', 'a, b;c')",
    returns:    "['a', 'b', 'c']",
    replaces:   'several str.split / str.replace passes for mixed separators',
    watchOut:   'Separators at the start or end give empty strings; groups insert extra items',
  },

  parameters: [
    { name: 'pattern',  type: 'str | re.Pattern', required: true,  default: null, desc: 'The separator, as a raw-string regular expression.' },
    { name: 'string',   type: 'str',              required: true,  default: null, desc: 'The text to split.' },
    { name: 'maxsplit', type: 'int',              required: false, default: '0', desc: 'At most this many splits; the rest stays in the last item. 0 = no limit. Pass by keyword (positional is deprecated since 3.13).' },
    { name: 'flags',    type: 're.RegexFlag | int', required: false, default: '0', desc: 'Flags such as re.IGNORECASE. Pass by keyword.' },
  ],

  modes: [
    {
      id: 'split',
      label: 'split',
      blurb: 'Text between the matches, in order.',
      params: [
        { name: 'pattern', type: 'str', hint: 'the separator pattern', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to split',         input: 'text' },
      ],
      template: 'import re\nre.split({$pattern}, {$text})',
      cases: [
        { id: 'mixed', label: 'mixed separators', values: { pattern: '\\s*[,;|]\\s*', text: 'red , green;blue| alpha' } },
        { id: 'keep',  label: 'keep separators',  values: { pattern: '([+-])', text: '3+4-10+2' } },
        { id: 'ends',  label: 'separator at the ends', values: { pattern: ',', text: ',a,,b,' } },
        { id: 'words', label: 'non-word runs',    values: { pattern: '\\W+', text: "Hello, world! It's 2026." } },
        { id: 'chars', label: 'empty pattern',    values: { pattern: '', text: 'abc' } },
      ],
    },
    {
      id: 'maxsplit',
      label: 'maxsplit',
      blurb: 'Stop after maxsplit splits; the remainder stays together.',
      params: [
        { name: 'pattern',  type: 'str', hint: 'the separator pattern', input: 'text' },
        { name: 'text',     type: 'str', hint: 'text to split',         input: 'text' },
        { name: 'maxsplit', type: 'int', hint: '0 = no limit',          input: 'number' },
      ],
      template: 'import re\nre.split({$pattern}, {$text}, maxsplit={$maxsplit})',
      cases: [
        { id: 'one',  label: 'key: value',  values: { pattern: ':\\s*', text: 'time: 12:30:00', maxsplit: '1' } },
        { id: 'two',  label: 'maxsplit=2',  values: { pattern: '\\s+', text: 'GET /index.html HTTP/1.1 extra', maxsplit: '2' } },
        { id: 'zero', label: 'maxsplit=0',  values: { pattern: '\\s+', text: 'a b c', maxsplit: '0' } },
      ],
    },
    {
      id: 'vs',
      label: 're.split vs str.split',
      blurb: 'Whitespace splitting: str.split() with no argument drops empty ends, re.split does not.',
      params: [
        { name: 'text', type: 'str', hint: 'text with spaces', input: 'text' },
      ],
      template: "import re\n(re.split(r'\\s+', {$text}), {$text}.split())",
      cases: [
        { id: 'pad',   label: 'padded',     values: { text: '  two  words ' } },
        { id: 'plain', label: 'no padding', values: { text: 'two words' } },
      ],
    },
  ],
  demoExplainer: "Leading or trailing separators produce empty strings — ',a,,b,' splits into five items, three of them empty. With a group, ([+-]), each operator appears between the numbers. The empty pattern matches between every character, so it splits 'abc' into single letters with an empty string at each end (allowed since Python 3.7).",

  patterns: [
    {
      name: 'Split on several separators',
      desc: 'A character class of separators, eating the surrounding spaces.',
      code: "import re\nparts = re.split(r'\\s*[,;]\\s*', line.strip())",
    },
    {
      name: 'Tokenize and keep operators',
      desc: 'Capture the separator, drop empty pieces.',
      code: "import re\ntokens = [t for t in re.split(r'\\s*([-+*/()])\\s*', expr) if t]",
    },
    {
      name: 'Split into lines, any line ending',
      desc: 'str.splitlines already does this — prefer it; the regex shows the idea.',
      code: "import re\nlines = re.split(r'\\r\\n|\\r|\\n', text)",
    },
  ],

  examples: [
    { title: 'Several separators',           code: "import re\nre.split(r'[,;]\\s*', 'a, b;c,  d')", returns: "['a', 'b', 'c', 'd']" },
    { title: 'A group keeps the separators', code: "import re\nre.split(r'([,;])\\s*', 'a, b;c')", returns: "['a', ',', 'b', ';', 'c']" },
    { title: 'maxsplit',                     code: "import re\nre.split(r',', 'a,b,c,d', maxsplit=2)", returns: "['a', 'b', 'c,d']" },
    { title: 'Empty strings at the ends',    code: "import re\nre.split(r',', ',a,')", returns: "['', 'a', '']" },
    { title: 'Unmatched group gives None',   code: "import re\nre.split(r'(,)|;', 'a,b;c')", returns: "['a', ',', 'b', None, 'c']" },
    { title: 'Empty matches split too',      code: "import re\nre.split(r'x*', 'axb')", returns: "['', 'a', '', 'b', '']" },
    { title: 'Compiled: Pattern.split',      code: "import re\nre.compile(r'\\d+').split('a1b22c')", returns: "['a', 'b', 'c']" },
  ],

  pitfalls: [
    {
      name: 'Splitting padded text on whitespace',
      desc: 'Leading/trailing whitespace becomes empty strings. For plain whitespace splitting, str.split() with no argument is simpler.',
      wrong: { label: "re.split(r'\\s+')", code: "import re\nre.split(r'\\s+', '  a b  ')", output: "['', 'a', 'b', '']" },
      fix:   { label: 'str.split()', code: "'  a b  '.split()", output: "['a', 'b']" },
    },
    {
      name: 'A group you did not mean to keep',
      desc: 'Parentheses used only for alternation also capture, so the separators show up in the result. Use (?:...).',
      wrong: { label: '(and|or)', code: "import re\nre.split(r'\\s(and|or)\\s', 'tea and cake or pie')", output: "['tea', 'and', 'cake', 'or', 'pie']" },
      fix:   { label: '(?:and|or)', code: "import re\nre.split(r'\\s(?:and|or)\\s', 'tea and cake or pie')", output: "['tea', 'cake', 'pie']" },
    },
    {
      name: 'maxsplit passed positionally',
      desc: 'Python 3.13 deprecates it (a DeprecationWarning), and it is easy to confuse with flags. Name it.',
      wrong: { label: 're.I as 3rd arg', code: "import re\nre.split(r'x', 'aXbxc', re.I)", output: "['aXb', 'c']" },
      fix:   { label: 'flags=re.I', code: "import re\nre.split(r'x', 'aXbxc', flags=re.I)", output: "['a', 'b', 'c']" },
    },
  ],

  when: {
    use: [
      'Separators that vary (several characters, optional spaces, words)',
      'Tokenizing while keeping the delimiters (capturing group)',
    ],
    avoid: [
      'One fixed separator → str.split(sep)',
      'Whitespace → str.split() with no argument',
      'Lines → str.splitlines()',
      'CSV with quoted fields → the csv module',
    ],
  },

  notes: {
    cpython:   'pattern_split in Modules/_sre/_sre.c: after each match the text before it is appended, then every group (None if it did not participate)',
    'Empty matches': 'Splitting on a pattern that can match the empty string is allowed since Python 3.7',
    'maxsplit': 'Positional maxsplit (and flags) is deprecated since 3.13; negative maxsplit means no splits at all',
  },

  related: [
    { name: 're.findall', slug: 'findall', when: 'Collect the matches, not the gaps' },
    { name: 're.sub',     slug: 'sub',     when: 'Replace the separators instead' },
    { name: 'str.split()', slug: 'split',  when: 'Fixed separator or whitespace', category: 'functions' },
    { name: 'str.splitlines()', slug: 'str-splitlines', when: 'Split text into lines', category: 'functions' },
    { name: 'str.partition()', slug: 'str-partition', when: 'Split once into three parts', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I split a string on multiple delimiters in Python?',
      a: "re.split(r'[,;|]', text) — a character class lists single-character separators; use alternation for longer ones: re.split(r'\\s*(?:and|or)\\s*', text).",
    },
    {
      q: 'How do I keep the delimiters with re.split?',
      a: "Put the separator in a capturing group: re.split(r'([+-])', '3+4-1') gives ['3', '+', '4', '-', '1'].",
    },
    {
      q: 'Why does re.split return empty strings?',
      a: 'A separator at the start or end of the string (or two in a row) leaves an empty piece. Filter them with [p for p in parts if p], or use str.split() for whitespace.',
    },
    {
      q: 'Why is there None in my re.split result?',
      a: 'The pattern has a capturing group that did not take part in that particular match (for example the other side of an alternation). re.split inserts None for it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.split',
    meta:  're.split',
  },
};
