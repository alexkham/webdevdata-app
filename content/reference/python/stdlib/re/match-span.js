// content/reference/python/stdlib/re/match-span.js

export const meta = {
  slug:        'match-span',
  name:        'Match.span',
  signature:   'Match.start([group]) / Match.end([group]) / Match.span([group])',
  blurb:       'Where the match — or one of its groups — is in the string: start index, end index (exclusive), or both as a tuple.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'match start end span python regex position index of match group position Match.start Match.end Match.span -1 unmatched group slice',
};

export const method = {
  slug:      'match-span',
  name:      'Match.span',
  signature: 'Match.start([group]) / Match.end([group]) / Match.span([group])',
  returns:   { type: 'int / int / tuple[int, int]', desc: 'Indexes into the original string; -1 (or (-1, -1)) for a group that did not participate.' },

  category:    're.Match method',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Positions, not text: m.start() and m.end() are the slice bounds of the match, so string[m.start():m.end()] == m.group(). Pass a group number or name for a group; an unmatched group reports -1.',

  covers: ['Match.start', 'Match.end', 'Match.span'],

  cheat: {
    commonCall: 'm.span(1)',
    returns:    '(4, 7) — start and end of group 1',
    replaces:   'str.find after the fact',
    watchOut:   'end is exclusive; unmatched groups give -1, which is a valid (wrong) slice index',
  },

  parameters: [
    { name: 'group', type: 'int | str', required: false, default: '0', desc: 'Group number or name; 0 (the default) is the whole match.' },
  ],

  modes: [
    {
      id: 'span',
      label: 'start / end / span',
      blurb: 'Positions of a group (0 = whole match). Type a number or a name.',
      params: [
        { name: 'pattern', type: 'str',       hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str',       hint: 'text',                 input: 'text' },
        { name: 'group',   type: 'int | str', hint: 'number or name',       input: 'auto' },
      ],
      template: 'import re\nm = re.search({$pattern}, {$text})\n(m.start({$group}), m.end({$group}), m.span({$group}))',
      cases: [
        { id: 'whole', label: 'whole match', values: { pattern: '(?P<key>\\w+)=(?P<val>\\w+)', text: 'set mode=fast now', group: '0' } },
        { id: 'named', label: 'named group', values: { pattern: '(?P<key>\\w+)=(?P<val>\\w+)', text: 'set mode=fast now', group: 'val' } },
        { id: 'unm',   label: 'did not match', values: { pattern: '(\\d+)(px)?', text: 'w: 40', group: '2' } },
        { id: 'empty', label: 'empty match', values: { pattern: '\\b', text: 'hi there', group: '0' } },
      ],
    },
    {
      id: 'slice',
      label: 'slice around matches',
      blurb: 'Use the positions to cut the string: text before, the match, text after.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
      ],
      template: 'import re\nm = re.search({$pattern}, {$text})\ns = {$text}\n(s[:m.start()], s[m.start():m.end()], s[m.end():])',
      cases: [
        { id: 'num',  label: 'a number',  values: { pattern: '\\d+', text: 'total: 1250 EUR' } },
        { id: 'word', label: 'a keyword', values: { pattern: '\\bTODO\\b', text: 'fix this TODO later' } },
      ],
    },
  ],
  demoExplainer: 'end() is exclusive, so text[start:end] is exactly the match and end - start its length. A group that did not participate gives -1 for both ends. The \\b case is an empty match: start and end are equal (0, 0).',

  patterns: [
    {
      name: 'Cut the string around a match',
      desc: 'Everything before and after the first match.',
      code: "import re\nm = re.search(r'\\s*#', line)\ncode = line[:m.start()] if m else line",
    },
    {
      name: 'Collect all positions',
      desc: 'finditer + span for every match.',
      code: "import re\npositions = [m.span() for m in re.finditer(r'\\bTODO\\b', source)]",
    },
    {
      name: 'Continue scanning after a match',
      desc: 'm.end() is the next pos for Pattern.match / Pattern.search.',
      code: "import re\npos = 0\nwhile m := WORD.search(text, pos):\n    handle(m.group())\n    pos = m.end()",
    },
  ],

  examples: [
    { title: 'Start and end',              code: "import re\nm = re.search(r'\\d+', 'order 66')\n(m.start(), m.end())", returns: '(6, 8)' },
    { title: 'span() is both',             code: "import re\nre.search(r'\\d+', 'order 66').span()", returns: '(6, 8)' },
    { title: 'Span of a group',            code: "import re\nre.search(r'(\\w+)@(\\w+)', 'mail ada@home').span(2)", returns: '(9, 13)' },
    { title: 'By group name',              code: "import re\nre.search(r'(?P<user>\\w+)@(?P<host>\\w+)', 'mail ada@home').start('host')", returns: '9' },
    { title: 'Unmatched group: -1',        code: "import re\nre.match(r'(a)(b)?', 'a').span(2)", returns: '(-1, -1)' },
    { title: 'Slicing reproduces the match', code: "import re\ns = 'order 66'\nm = re.search(r'\\d+', s)\ns[m.start():m.end()] == m.group()", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Slicing with the -1 of an unmatched group',
      desc: 'A skipped group reports -1, and s[:-1] is a valid slice — you silently get the wrong text. Check the group first.',
      wrong: { label: 's[:m.start(2)]', code: "import re\ns = 'w: 40'\nm = re.search(r'(\\d+)(px)?', s)\ns[:m.start(2)]", output: "'w: 4'" },
      fix:   { label: 'check for -1', code: "import re\ns = 'w: 40'\nm = re.search(r'(\\d+)(px)?', s)\ns[:m.start(2)] if m.start(2) != -1 else s", output: "'w: 40'" },
    },
    {
      name: 'Positions relative to pos',
      desc: 'With Pattern.search(text, pos) the positions are still indexes into the whole string, not into text[pos:].',
      wrong: { label: 'assume relative', code: "import re\nm = re.compile(r'\\d').search('ab12', 2)\n'ab12'[2:][m.start()]", output: 'IndexError: string index out of range' },
      fix:   { label: 'absolute index', code: "import re\nm = re.compile(r'\\d').search('ab12', 2)\n'ab12'[m.start()]", output: "'1'" },
    },
  ],

  when: {
    use: [
      'You need where a match is: to slice, highlight, or continue scanning',
      'Positions of individual groups',
    ],
    avoid: [
      'Just the text → group()',
      'Positions of every match → finditer + span()',
    ],
  },

  notes: {
    cpython:  'match_start / match_end / match_span in Modules/_sre/_sre.c read the stored marks; -1 means the group has no mark',
    'Empty matches': 'For an empty match start == end; for a group that matched the empty string too',
    'Indexes': 'Always indexes into Match.string (code points of the str), independent of pos',
  },

  related: [
    { name: 'Match.group', slug: 'match-group', when: 'The text instead of the position' },
    { name: 're.finditer', slug: 'finditer',    when: 'Spans of all matches' },
    { name: 're.Match',    slug: 'match-object', when: 'regs: every span at once' },
    { name: 'slice',       slug: 'slice',       when: 'Cut the string with the positions', category: 'functions' },
    { name: 'str.find()',  slug: 'find',        when: 'Index of fixed text', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the index of a regex match in Python?',
      a: 'm.start() gives the index of the first character, m.end() the index after the last one, m.span() both — where m = re.search(pattern, text).',
    },
    {
      q: 'Is Match.end() inclusive?',
      a: 'No. It is one past the last character, like a slice bound: text[m.start():m.end()] == m.group().',
    },
    {
      q: 'Why does m.start(1) return -1?',
      a: 'Group 1 did not participate in the match (optional or in an untaken alternative). span(1) is then (-1, -1).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.Match.span',
    meta:  'Match.span',
  },
};
