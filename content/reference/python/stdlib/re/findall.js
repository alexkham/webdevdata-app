// content/reference/python/stdlib/re/findall.js

export const meta = {
  slug:        'findall',
  name:        're.findall',
  signature:   're.findall(pattern, string, flags=0)',
  blurb:       'Return every non-overlapping match as a list — of strings, or of group tuples when the pattern has groups.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're findall python regex find all matches list of strings tuples capturing groups non-capturing (?:) Pattern.findall extract all numbers emails',
};

export const method = {
  slug:      'findall',
  name:      're.findall',
  signature: 're.findall(pattern, string, flags=0)',
  returns:   { type: 'list[str] | list[tuple[str, ...]]', desc: 'Whole matches (no groups), group 1 (one group), or tuples of all groups (two or more). Unmatched groups give empty strings.' },

  category:    're function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The quickest way to pull every occurrence out of a text. Read the return type rule first: capturing groups change what you get back. Also available as Pattern.findall(string, pos, endpos).',

  covers: ['findall', 'Pattern.findall'],

  cheat: {
    commonCall: "re.findall(r'\\d+', 'a1 b22 c333')",
    returns:    "['1', '22', '333'] — or groups, if the pattern has any",
    replaces:   'a loop of search() calls, advancing by hand',
    watchOut:   '1 group → list of that group; 2+ groups → list of tuples. Use (?:...) to group without capturing',
  },

  parameters: [
    { name: 'pattern', type: 'str | re.Pattern', required: true,  default: null, desc: 'The regular expression, as a raw string.' },
    { name: 'string',  type: 'str',              required: true,  default: null, desc: 'The text to scan, left to right.' },
    { name: 'flags',   type: 're.RegexFlag | int', required: false, default: '0', desc: 'Flags such as re.IGNORECASE. Not allowed with a compiled pattern.' },
  ],

  modes: [
    {
      id: 'findall',
      label: 'findall',
      blurb: 'All matches, left to right, never overlapping.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to scan',         input: 'text' },
      ],
      template: 'import re\nre.findall({$pattern}, {$text})',
      cases: [
        { id: 'nums',    label: 'numbers',        values: { pattern: '\\d+', text: 'Order 66 shipped 3 boxes, 120 kg' } },
        { id: 'tags',    label: 'hashtags',       values: { pattern: '#\\w+', text: 'Loving #python and #regex!' } },
        { id: 'overlap', label: 'no overlaps',    values: { pattern: 'aa', text: 'aaaaa' } },
        { id: 'empty',   label: 'empty matches',  values: { pattern: '\\d*', text: 'a1b' } },
      ],
    },
    {
      id: 'groups',
      label: 'groups change the type',
      blurb: 'The same text through different patterns — and the type of each item.',
      params: [
        { name: 'pattern', type: 'str', hint: 'try adding or removing ( )', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to scan',               input: 'text' },
      ],
      template: 'import re\nfound = re.findall({$pattern}, {$text})\n(found, [type(x).__name__ for x in found])',
      cases: [
        { id: 'none',  label: 'no group',        values: { pattern: '\\w+=\\d+',       text: 'x=1, y=22' } },
        { id: 'one',   label: 'one group',       values: { pattern: '(\\w+)=\\d+',     text: 'x=1, y=22' } },
        { id: 'two',   label: 'two groups',      values: { pattern: '(\\w+)=(\\d+)',   text: 'x=1, y=22' } },
        { id: 'nc',    label: 'non-capturing',   values: { pattern: '(?:\\w+)=\\d+',   text: 'x=1, y=22' } },
        { id: 'opt',   label: 'optional group',  values: { pattern: '(\\d+)(px)?',     text: '10px 20' } },
      ],
    },
    {
      id: 'pos',
      label: 'Pattern.findall(pos, endpos)',
      blurb: 'A compiled pattern can limit the scan to string[pos:endpos].',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
        { name: 'pos',     type: 'int', hint: 'start',                input: 'number' },
        { name: 'endpos',  type: 'int', hint: 'end (exclusive)',      input: 'number' },
      ],
      template: 'import re\nre.compile({$pattern}).findall({$text}, {$pos}, {$endpos})',
      cases: [
        { id: 'window', label: 'a window', values: { pattern: '\\d', text: '0123456789', pos: '3', endpos: '7' } },
        { id: 'dollar', label: '$ at endpos', values: { pattern: '\\d$', text: '0123456789', pos: '0', endpos: '4' } },
      ],
    },
  ],
  demoExplainer: "The type rule in action: no group gives the whole matches, one group gives just that group's text, two groups give tuples — and (?:...) groups without capturing, so it behaves like no group. An optional group that did not take part becomes '' (not None). Empty matches are included: \\d* on 'a1b' yields ['', '1', '', ''] — an empty match before a, the 1, then empty matches before b and at the very end.",

  patterns: [
    {
      name: 'Numbers as ints',
      desc: 'findall gives strings; convert in a comprehension.',
      code: "import re\nnumbers = [int(n) for n in re.findall(r'-?\\d+', text)]",
    },
    {
      name: 'Key/value pairs into a dict',
      desc: 'Two groups → tuples → dict() takes them directly.',
      code: "import re\nsettings = dict(re.findall(r'(\\w+)\\s*=\\s*(\\S+)', config_text))",
    },
    {
      name: 'Count occurrences',
      desc: 'len() of the list, or sum(1 for _ in finditer(...)) to avoid building it.',
      code: "import re\nword_count = len(re.findall(r'\\b\\w+\\b', text))",
    },
  ],

  examples: [
    { title: 'All numbers',                   code: "import re\nre.findall(r'\\d+', 'a1 b22 c333')", returns: "['1', '22', '333']" },
    { title: 'One group: only its text',      code: "import re\nre.findall(r'(\\w)\\d+', 'a1 b22 c333')", returns: "['a', 'b', 'c']" },
    { title: 'Two groups: tuples',            code: "import re\nre.findall(r'(\\w)(\\d+)', 'a1 b22 c333')", returns: "[('a', '1'), ('b', '22'), ('c', '333')]" },
    { title: 'Unmatched group is empty',      code: "import re\nre.findall(r'(\\w)(\\d)?', 'a1 b')", returns: "[('a', '1'), ('b', '')]" },
    { title: 'Pairs straight into a dict',    code: "import re\ndict(re.findall(r'(\\w+)=(\\d+)', 'x=1, y=22'))", returns: "{'x': '1', 'y': '22'}" },
    { title: 'Empty matches are included',    code: "import re\nre.findall(r'x*', 'axb')", returns: "['', 'x', '', '']" },
    { title: 'Case-insensitive',              code: "import re\nre.findall(r'python', 'Python PYTHON python', re.I)", returns: "['Python', 'PYTHON', 'python']" },
  ],

  pitfalls: [
    {
      name: 'A group used only for alternation',
      desc: 'The parentheses around the alternatives capture, so findall returns just that part. Make the group non-capturing.',
      wrong: { label: '(com|org)', code: "import re\nre.findall(r'\\w+\\.(com|org)', 'a.com b.org')", output: "['com', 'org']" },
      fix:   { label: '(?:com|org)', code: "import re\nre.findall(r'\\w+\\.(?:com|org)', 'a.com b.org')", output: "['a.com', 'b.org']" },
    },
    {
      name: 'Expecting overlapping matches',
      desc: 'Scanning resumes after each match. A lookahead with a group finds overlapping occurrences.',
      wrong: { label: "r'aa'", code: "import re\nre.findall(r'aa', 'aaaa')", output: "['aa', 'aa']" },
      fix:   { label: "r'(?=(aa))'", code: "import re\nre.findall(r'(?=(aa))', 'aaaa')", output: "['aa', 'aa', 'aa']" },
    },
    {
      name: 'Needing positions from findall',
      desc: 'findall throws the positions away. finditer yields Match objects with start() and end().',
      wrong: { label: 'findall', code: "import re\nre.findall(r'\\d+', 'a1 b22')", output: "['1', '22']" },
      fix:   { label: 'finditer', code: "import re\n[(m.group(), m.span()) for m in re.finditer(r'\\d+', 'a1 b22')]", output: "[('1', (1, 2)), ('22', (4, 6))]" },
    },
  ],

  when: {
    use: [
      'Extracting every occurrence as plain strings (or group tuples)',
      'Quick counts and dict-building from key/value text',
    ],
    avoid: [
      'Need positions or named groups → re.finditer',
      'Huge text where you stop early → re.finditer (lazy) instead of a full list',
      'Only the first occurrence → re.search',
    ],
  },

  notes: {
    cpython:   'pattern_findall in Modules/_sre/_sre.c builds the list directly — no Match objects are created, which makes it faster than finditer when you only need the text',
    'Empty matches': 'Since Python 3.7 a non-empty match may start right where the previous empty match was',
    'Groups':  'The rule depends on the number of groups in the pattern (Pattern.groups), not on which ones matched',
  },

  related: [
    { name: 're.finditer', slug: 'finditer', when: 'Match objects with positions' },
    { name: 're.search',   slug: 'search',   when: 'Only the first match' },
    { name: 'Match.groups', slug: 'match-groups', when: 'The same tuple, from one Match' },
    { name: 're.sub',      slug: 'sub',      when: 'Replace the matches instead' },
    { name: 'str.count()', slug: 'str-count', when: 'Count fixed substrings', category: 'functions' },
    { name: 'dict()',      slug: 'dict',     when: 'Build a dict from two-group results', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does re.findall return tuples?',
      a: 'Your pattern has two or more capturing groups, so each item is a tuple of the groups. With exactly one group you get a list of that group\'s strings. Replace grouping-only parentheses with (?:...).',
    },
    {
      q: 'How do I get the whole match from findall when the pattern has groups?',
      a: 'Wrap the whole pattern in an extra group and take item[0], make the other groups non-capturing, or use finditer and call m.group(0).',
    },
    {
      q: 'Does re.findall find overlapping matches?',
      a: "No; after a match the scan continues at its end. For overlapping matches put the pattern in a lookahead with a group: re.findall(r'(?=(aa))', 'aaaa') gives three results.",
    },
    {
      q: 'What is the difference between findall and finditer?',
      a: 'findall returns a list of strings or tuples; finditer returns an iterator of Match objects, which carry positions and named groups and are produced lazily.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.findall',
    meta:  're.findall',
  },
};
