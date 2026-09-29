// content/reference/python/stdlib/re/match-object.js

export const meta = {
  slug:        'match-object',
  name:        're.Match',
  signature:   'class re.Match',
  blurb:       'The result of a successful search/match — its repr, truthiness and attributes: pos, endpos, lastindex, lastgroup, re, string, regs.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're Match re.Match match object Match.pos Match.endpos Match.lastindex Match.lastgroup Match.re Match.string Match.regs attributes span repr truthy none type hint re.Match[str]',
};

export const method = {
  slug:      'match-object',
  name:      're.Match',
  signature: 'class re.Match',
  returns:   { type: 're.Match', desc: 'Returned by search, match, fullmatch and each item of finditer (never created directly).' },

  category:    're class',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: "One successful match. Its repr shows the span and the text; methods (group, groups, groupdict, start, end, span, expand) read the parts, and a handful of attributes describe how the search was run. It is always truthy — failure is None, not an empty Match.",

  covers: ['Match', 'Match.pos', 'Match.endpos', 'Match.lastindex', 'Match.lastgroup', 'Match.re', 'Match.string', 'Match.regs'],

  cheat: {
    commonCall: "m = re.search(r'(\\w+)@(\\w+)', text)",
    returns:    "<re.Match object; span=(5, 13), match='ada@home'>",
    replaces:   'tracking indexes by hand after str.find',
    watchOut:   'lastindex is the last group that CLOSED, not the highest-numbered group that matched',
  },

  attributes: [
    { name: 'pos',       type: 'int',        meaning: 'The pos passed to search()/match() — where scanning started (0 by default)' },
    { name: 'endpos',    type: 'int',        meaning: 'The endpos passed — the scan limit (len(string) by default)' },
    { name: 'lastindex', type: 'int | None', meaning: 'Number of the last group that was closed during the match; None if no group matched' },
    { name: 'lastgroup', type: 'str | None', meaning: 'Name of that last closed group; None if it has no name or no group matched' },
    { name: 're',        type: 're.Pattern', meaning: 'The compiled pattern that produced this match' },
    { name: 'string',    type: 'str',        meaning: 'The string that was searched (the whole string, not just the match)' },
    { name: 'regs',      type: 'tuple',      meaning: 'Undocumented: ((start, end), …) for group 0 and every group, (-1, -1) when unmatched — the same as span(i) for each i' },
  ],

  modes: [
    {
      id: 'attrs',
      label: 'lastindex & regs',
      blurb: 'Which group closed last, its name, and every span at once.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression with groups', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                             input: 'text' },
      ],
      template: 'import re\nm = re.search({$pattern}, {$text})\n(m.lastindex, m.lastgroup, m.regs)',
      cases: [
        { id: 'alt',    label: 'alternation',  values: { pattern: '(?P<num>\\d+)|(?P<word>[a-z]+)', text: '  hello 42' } },
        { id: 'nested', label: 'nested groups', values: { pattern: '((a)(b))', text: 'xab' } },
        { id: 'none',   label: 'no groups',    values: { pattern: '\\d+', text: 'a1' } },
        { id: 'nomatch', label: 'no match',    values: { pattern: '\\d+', text: 'abc' } },
      ],
    },
    {
      id: 'scan',
      label: 'pos, endpos, re, string',
      blurb: 'The attributes that record how the search was called.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
        { name: 'pos',     type: 'int', hint: 'start',                input: 'number' },
        { name: 'endpos',  type: 'int', hint: 'end',                  input: 'number' },
      ],
      template: 'import re\nm = re.compile({$pattern}).search({$text}, {$pos}, {$endpos})\n(m, m.pos, m.endpos, m.re, m.string)',
      cases: [
        { id: 'window', label: 'a window',  values: { pattern: '\\w+', text: 'one two three', pos: '4', endpos: '9' } },
        { id: 'clamp',  label: 'endpos too big', values: { pattern: '\\w+$', text: 'one two', pos: '0', endpos: '99' } },
      ],
    },
  ],
  demoExplainer: 'In the alternation case only the word branch matched, so lastindex is 2 and lastgroup is word; group 1 shows (-1, -1) in regs. For ((a)(b)) the outer group 1 closes last, so lastindex is 1 even though groups 2 and 3 matched. A failed search returns None, and reading .lastindex on it raises AttributeError. endpos is clamped to len(string).',

  patterns: [
    {
      name: 'Always test for None first',
      desc: 'search/match/fullmatch return None on failure.',
      code: "import re\ndef first_number(text):\n    m = re.search(r'\\d+', text)\n    if m is None:\n        return None\n    return int(m.group())",
    },
    {
      name: 'Which alternative matched?',
      desc: 'Name each branch and read lastgroup — a compact tokenizer.',
      code: "import re\nTOKEN = re.compile(r'(?P<NUM>\\d+)|(?P<NAME>[A-Za-z_]\\w*)|(?P<OP>[-+*/=])|(?P<WS>\\s+)')\ntokens = [(m.lastgroup, m.group()) for m in TOKEN.finditer(src) if m.lastgroup != 'WS']",
    },
    {
      name: 'Type hints',
      desc: 're.Match is generic since 3.9.',
      code: 'import re\ndef first_word(text: str) -> re.Match[str] | None:\n    return re.search(r"\\w+", text)',
    },
  ],

  examples: [
    { title: 'The repr',                  code: "import re\nre.search(r'\\d+', 'order 66')", returns: "<re.Match object; span=(6, 8), match='66'>" },
    { title: 'Always truthy',             code: "import re\nbool(re.search('', 'abc'))", returns: 'True' },
    { title: 'lastindex and lastgroup',   code: "import re\nm = re.search(r'(?P<user>\\w+)@(?P<host>[\\w.]+)', 'mail ada@example.com now')\n(m.lastindex, m.lastgroup)", returns: "(2, 'host')" },
    { title: 'Outer group closes last',   code: "import re\nre.match(r'(a(b))', 'ab').lastindex", returns: '1' },
    { title: 'pos and endpos',            code: "import re\nm = re.compile(r'\\d').search('ab12', 2)\n(m.pos, m.endpos)", returns: '(2, 4)' },
    { title: 're and string',             code: "import re\nm = re.search(r'b', 'abc')\n(m.re, m.string)", returns: "(re.compile('b'), 'abc')" },
    { title: 'regs: every span',          code: "import re\nre.match(r'(a)(b)?', 'a').regs", returns: '((0, 1), (0, 1), (-1, -1))' },
  ],

  pitfalls: [
    {
      name: 'Using lastindex as "number of groups matched"',
      desc: 'It is the index of the group that closed last. For the count of groups use m.re.groups; for which ones matched, check groups() for None.',
      wrong: { label: 'lastindex', code: "import re\nre.match(r'((a)(b))', 'ab').lastindex", output: '1' },
      fix:   { label: 'groups()', code: "import re\nm = re.match(r'((a)(b))', 'ab')\nsum(g is not None for g in m.groups())", output: '3' },
    },
    {
      name: 'Keeping Match objects of huge strings',
      desc: 'A Match holds a reference to the entire searched string (m.string). Keep m.group() instead if you store results.',
      wrong: { label: 'store m', code: "import re\ntext = 'x' * 1000 + '42'\nm = re.search(r'\\d+', text)\nlen(m.string)", output: '1002' },
      fix:   { label: 'store the text', code: "import re\ntext = 'x' * 1000 + '42'\nfound = re.search(r'\\d+', text).group()\nlen(found)", output: '2' },
    },
  ],

  when: {
    use: [
      'Getting positions, groups and the pattern behind a result',
      'Dispatching on which named alternative matched (lastgroup)',
    ],
    avoid: [
      'Testing for "empty match" with bool(m) — a Match is always True; compare m.group() == \'\'',
      'regs in new code — it is undocumented; use span(i)',
    ],
  },

  notes: {
    cpython:    'MatchObject in Modules/_sre/_sre.c. The repr is <re.Match object; span=(start, end), match=repr(text)> with the text repr cut to 50 characters',
    'Indexing': 'm[g] is the same as m.group(g) (Python 3.6+)',
    'Generic':  're.Match[str] / re.Match[bytes] in annotations since Python 3.9',
    'Copy':     'copy.copy() and copy.deepcopy() return the same object (3.7+)',
  },

  related: [
    { name: 'Match.group',  slug: 'match-group',  when: 'Read the matched text' },
    { name: 'Match.groups', slug: 'match-groups', when: 'All groups as a tuple or dict' },
    { name: 'Match.span',   slug: 'match-span',   when: 'start(), end(), span()' },
    { name: 'Match.expand', slug: 'match-expand', when: 'Fill a template from the match' },
    { name: 're.Pattern',   slug: 'pattern-object', when: 'm.re' },
    { name: 'AttributeError', slug: 'attributeerror', when: "Using a Match method on None", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is a re.Match object?',
      a: "The object search, match and fullmatch return on success (and finditer yields). It holds the matched text, its position and every group — its repr looks like <re.Match object; span=(6, 8), match='66'>.",
    },
    {
      q: 'How do I check whether a regex matched?',
      a: "Test the result against None: if m is not None (or simply if m). A Match object is always truthy, even when it matched the empty string.",
    },
    {
      q: 'What is Match.lastindex?',
      a: 'The number of the last capturing group that was closed, or None. With alternatives of named groups, lastgroup tells you which branch matched.',
    },
    {
      q: 'What does "AttributeError: \'NoneType\' object has no attribute \'group\'" mean?',
      a: 'The search found nothing and returned None; you then called .group() on it. Check the result before using it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#match-objects',
    meta:  're.Match',
  },
};
