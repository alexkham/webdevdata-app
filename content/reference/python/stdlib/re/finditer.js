// content/reference/python/stdlib/re/finditer.js

export const meta = {
  slug:        'finditer',
  name:        're.finditer',
  signature:   're.finditer(pattern, string, flags=0)',
  blurb:       'Iterate over every non-overlapping match as a Match object — positions, groups and named groups included.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're finditer python regex iterate matches iterator match objects positions start end span named groups Pattern.finditer lazy',
};

export const method = {
  slug:      'finditer',
  name:      're.finditer',
  signature: 're.finditer(pattern, string, flags=0)',
  returns:   { type: 'Iterator[re.Match]', desc: 'A lazy iterator yielding one Match object per match, left to right.' },

  category:    're function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'findall with the full story: each item is a Match, so you keep the positions, every group and groupdict() — and matches are produced one at a time. Also available as Pattern.finditer(string, pos, endpos).',

  covers: ['finditer', 'Pattern.finditer'],

  cheat: {
    commonCall: "for m in re.finditer(r'\\d+', text): ...",
    returns:    'an iterator of re.Match objects (not a list)',
    replaces:   'findall when you also need where each match is',
    watchOut:   'It is an iterator: it is used up after one loop — wrap in list() to reuse',
  },

  parameters: [
    { name: 'pattern', type: 'str | re.Pattern', required: true,  default: null, desc: 'The regular expression, as a raw string.' },
    { name: 'string',  type: 'str',              required: true,  default: null, desc: 'The text to scan.' },
    { name: 'flags',   type: 're.RegexFlag | int', required: false, default: '0', desc: 'Flags such as re.IGNORECASE. Not allowed with a compiled pattern.' },
  ],

  modes: [
    {
      id: 'spans',
      label: 'matches and spans',
      blurb: 'Each Match object knows its text and its (start, end) position.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to scan',         input: 'text' },
      ],
      template: 'import re\n[(m.group(), m.span()) for m in re.finditer({$pattern}, {$text})]',
      cases: [
        { id: 'words', label: 'words',        values: { pattern: '\\w+', text: 'to be or not' } },
        { id: 'nums',  label: 'numbers',      values: { pattern: '\\d+', text: 'v1.22.333' } },
        { id: 'empty', label: 'empty matches', values: { pattern: '-*', text: 'a--b' } },
      ],
    },
    {
      id: 'named',
      label: 'named groups',
      blurb: 'groupdict() turns each match into a dict — the cleanest way to parse repeated records.',
      params: [
        { name: 'pattern', type: 'str', hint: 'use (?P<name>...)', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to scan',      input: 'text' },
      ],
      template: 'import re\n[m.groupdict() for m in re.finditer({$pattern}, {$text})]',
      cases: [
        { id: 'kv',   label: 'key=value', values: { pattern: '(?P<key>\\w+)=(?P<value>\\w+)', text: 'host=db port=5432 user=ada' } },
        { id: 'opt',  label: 'optional part', values: { pattern: '(?P<num>\\d+)(?P<unit>px|em)?', text: '10px 2em 7' } },
      ],
    },
  ],
  demoExplainer: "span() is (start, end) with end exclusive, so text[start:end] is the match. With a pattern that can match nothing, like -*, you also get empty matches: one before a, the '--' run, then empty matches before b and at the end. A named group that did not participate shows as None in groupdict() — unlike findall, which would give ''.",

  patterns: [
    {
      name: 'Highlight or annotate matches by position',
      desc: 'Slices between matches come from m.start() and m.end().',
      code: "import re\nout, last = [], 0\nfor m in re.finditer(r'\\d+', text):\n    out.append(text[last:m.start()])\n    out.append(f'[{m.group()}]')\n    last = m.end()\nout.append(text[last:])\nresult = ''.join(out)",
    },
    {
      name: 'Parse records into dicts',
      desc: 'Named groups + groupdict().',
      code: "import re\nLINE = re.compile(r'(?P<level>[A-Z]+) (?P<msg>.*)')\nrecords = [m.groupdict() for m in LINE.finditer(log_text)]",
    },
    {
      name: 'Stop at the first N matches',
      desc: 'The iterator is lazy; itertools.islice stops scanning early.',
      code: "import re\nfrom itertools import islice\nfirst_three = [m.group() for m in islice(re.finditer(r'\\w+', huge_text), 3)]",
    },
  ],

  examples: [
    { title: 'Text and position',          code: "import re\n[(m.group(), m.start()) for m in re.finditer(r'\\d+', 'a1 b22 c333')]", returns: "[('1', 1), ('22', 4), ('333', 8)]" },
    { title: 'An iterator, not a list',    code: "import re\nit = re.finditer(r'\\d', 'a1b2')\nnext(it)", returns: "<re.Match object; span=(1, 2), match='1'>" },
    { title: 'Used up after one pass',     code: "import re\nit = re.finditer(r'\\d', 'a1b2')\n(len(list(it)), len(list(it)))", returns: '(2, 0)' },
    { title: 'Named groups as dicts',      code: "import re\n[m.groupdict() for m in re.finditer(r'(?P<k>\\w+)=(?P<v>\\d+)', 'x=1 y=2')]", returns: "[{'k': 'x', 'v': '1'}, {'k': 'y', 'v': '2'}]" },
    { title: 'Whole match despite groups', code: "import re\n[m.group(0) for m in re.finditer(r'(\\w)(\\d)', 'a1 b2')]", returns: "['a1', 'b2']" },
    { title: 'No match: empty iterator',   code: "import re\nlist(re.finditer(r'z', 'abc'))", returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'Iterating twice',
      desc: 'The second loop sees nothing. Materialize with list() if you need the matches more than once.',
      wrong: { label: 'reuse iterator', code: "import re\nms = re.finditer(r'\\d', 'a1b2')\nfirst = [m.group() for m in ms]\n[m.group() for m in ms]", output: '[]' },
      fix:   { label: 'list() once', code: "import re\nms = list(re.finditer(r'\\d', 'a1b2'))\nfirst = [m.group() for m in ms]\n[m.group() for m in ms]", output: "['1', '2']" },
    },
    {
      name: 'Treating the result like a list',
      desc: 'finditer returns an iterator object; printing it shows only its type and address, and it has no len() or indexing.',
      wrong: { label: 'the raw result', code: "import re\ntype(re.finditer(r'\\d', 'a1')).__name__", output: "'callable_iterator'" },
      fix:   { label: 'list(it)', code: "import re\nlist(re.finditer(r'\\d', 'a1'))", output: "[<re.Match object; span=(1, 2), match='1'>]" },
    },
  ],

  when: {
    use: [
      'You need positions (start, end, span) of each match',
      'Named groups per match — groupdict() records',
      'Large inputs where you may stop early (lazy)',
    ],
    avoid: [
      'Just the strings → re.findall is shorter',
      'Only the first match → re.search',
    ],
  },

  notes: {
    cpython:  'Implemented with an internal scanner object (Pattern.scanner): each next() calls its search() and resumes after the previous match',
    'Empty matches': 'An empty match is followed by a match attempt at the same position that must not be empty (Python 3.7+ rule)',
    'Laziness': 'Matches are found one at a time as you iterate, so breaking out of the loop early skips the rest of the scan',
  },

  related: [
    { name: 're.findall',  slug: 'findall',   when: 'Just the strings, as a list' },
    { name: 're.Match',    slug: 'match-object', when: 'What each item is' },
    { name: 'Match.span',  slug: 'match-span', when: 'start(), end(), span()' },
    { name: 'Match.groupdict', slug: 'match-groups', when: 'Named groups as a dict' },
    { name: 'next()',      slug: 'next',      when: 'Take one match from the iterator', category: 'functions' },
    { name: 'enumerate()', slug: 'enumerate', when: 'Number the matches', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between re.findall and re.finditer?',
      a: 'findall returns a list of strings (or group tuples); finditer returns an iterator of Match objects. Use finditer when you need positions, named groups, or to avoid building a big list.',
    },
    {
      q: 'How do I get the positions of all regex matches in Python?',
      a: "[m.span() for m in re.finditer(pattern, text)] — or m.start() / m.end() for one side.",
    },
    {
      q: 'Why is my finditer loop empty the second time?',
      a: 'finditer returns an iterator, which is exhausted after one pass. Call re.finditer again or store list(re.finditer(...)).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.finditer',
    meta:  're.finditer',
  },
};
