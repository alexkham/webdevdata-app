// content/reference/python/stdlib/re/match-group.js

export const meta = {
  slug:        'match-group',
  name:        'Match.group',
  signature:   'Match.group([group1, ...])',
  blurb:       'Get the text of the whole match (group 0) or of capturing groups by number or name; m[g] is the same thing.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'match group python regex m.group() group(0) group(1) group by name named group m[1] __getitem__ no such group indexerror none unmatched group Match.group',
};

export const method = {
  slug:      'match-group',
  name:      'Match.group',
  signature: 'Match.group([group1, ...])',
  returns:   { type: 'str | None | tuple', desc: 'One group: its text (None if it did not participate). Several groups: a tuple. No argument: the whole match.' },

  category:    're.Match method',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The way to read what matched. group() or group(0) is the whole match, group(1) the first parenthesized group, group("name") a named one — and m[1] / m["name"] is shorthand since Python 3.6.',

  covers: ['Match.group'],

  cheat: {
    commonCall: 'm.group(1)',
    returns:    "'ada' — the text of group 1",
    replaces:   'slicing the string with start/end indexes',
    watchOut:   'A group that did not take part returns None; a group that does not exist raises IndexError',
  },

  parameters: [
    { name: 'group1, ...', type: 'int | str', required: false, default: '0', desc: 'Group numbers (0 = whole match) or group names. With several arguments you get a tuple.' },
  ],

  modes: [
    {
      id: 'group',
      label: 'group()',
      blurb: 'Type a group number or a group name.',
      params: [
        { name: 'pattern', type: 'str',       hint: 'a regular expression',  input: 'text' },
        { name: 'text',    type: 'str',       hint: 'text',                  input: 'text' },
        { name: 'group',   type: 'int | str', hint: 'number or name',        input: 'auto' },
      ],
      template: 'import re\nm = re.search({$pattern}, {$text})\nm.group({$group})',
      cases: [
        { id: 'whole', label: 'group 0',       values: { pattern: '(?P<user>[\\w.]+)@(?P<host>[\\w.]+)', text: 'mail ada@example.com now', group: '0' } },
        { id: 'num',   label: 'group 1',       values: { pattern: '(?P<user>[\\w.]+)@(?P<host>[\\w.]+)', text: 'mail ada@example.com now', group: '1' } },
        { id: 'name',  label: 'by name',       values: { pattern: '(?P<user>[\\w.]+)@(?P<host>[\\w.]+)', text: 'mail ada@example.com now', group: 'host' } },
        { id: 'unm',   label: 'did not match', values: { pattern: '(\\d+)(px)?', text: 'width 40', group: '2' } },
        { id: 'bad',   label: 'no such group', values: { pattern: '(\\d+)', text: 'width 40', group: '2' } },
      ],
    },
    {
      id: 'many',
      label: 'several groups',
      blurb: 'Several arguments return a tuple — here groups 1 and 2, and the same with m[...].',
      params: [
        { name: 'pattern', type: 'str', hint: 'two or more groups', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',               input: 'text' },
      ],
      template: 'import re\nm = re.search({$pattern}, {$text})\n(m.group(1, 2), m[1], m[0])',
      cases: [
        { id: 'kv',   label: 'key=value', values: { pattern: '(\\w+)=(\\w+)', text: 'mode=fast' } },
        { id: 'time', label: 'time',      values: { pattern: '(\\d\\d):(\\d\\d)', text: 'at 09:45 sharp' } },
      ],
    },
  ],
  demoExplainer: "The demo passes the group as a number when you type digits and as a string otherwise — both work. An optional group that was skipped gives None (the (px)? case), while asking for a group the pattern does not have raises IndexError: no such group.",

  patterns: [
    {
      name: 'Unpack several groups',
      desc: 'group(1, 2) returns a tuple; so does groups().',
      code: "import re\nif m := re.search(r'(\\d+)x(\\d+)', size):\n    width, height = map(int, m.group(1, 2))",
    },
    {
      name: 'Default for an optional group',
      desc: 'or supplies a fallback when the group is None.',
      code: "import re\nm = re.match(r'(\\d+)(px|em)?', css_value)\nunit = m.group(2) or 'px'",
    },
    {
      name: 'Index syntax',
      desc: 'm[1] and m["name"] read like a sequence/dict lookup.',
      code: "import re\nm = re.search(r'(?P<key>\\w+)=(?P<value>\\w+)', line)\nkey, value = m['key'], m['value']",
    },
  ],

  examples: [
    { title: 'Whole match',            code: "import re\nre.search(r'\\d+', 'order 66').group()", returns: "'66'" },
    { title: 'By number',              code: "import re\nre.search(r'(\\w+)@(\\w+)', 'ada@home').group(2)", returns: "'home'" },
    { title: 'By name',                code: "import re\nre.search(r'(?P<user>\\w+)@(?P<host>\\w+)', 'ada@home').group('user')", returns: "'ada'" },
    { title: 'Several at once',        code: "import re\nre.search(r'(\\w+)@(\\w+)', 'ada@home').group(0, 1, 2)", returns: "('ada@home', 'ada', 'home')" },
    { title: 'Index syntax',           code: "import re\nm = re.search(r'(?P<user>\\w+)@(\\w+)', 'ada@home')\n(m[0], m[1], m['user'])", returns: "('ada@home', 'ada', 'ada')" },
    { title: 'Unmatched group is None', code: "import re\nprint(re.match(r'(a)(b)?', 'a').group(2))", returns: 'None' },
    { title: 'A repeated group keeps the last', code: "import re\nre.match(r'(\\w)+', 'abc').group(1)", returns: "'c'" },
  ],

  pitfalls: [
    {
      name: 'Asking for a group the pattern does not have',
      desc: 'Groups are counted by opening parentheses; (?:...) does not count.',
      wrong: { label: 'group(2)', code: "import re\nre.search(r'(?:\\w+)@(\\w+)', 'ada@home').group(2)", output: 'IndexError: no such group' },
      fix:   { label: 'group(1)', code: "import re\nre.search(r'(?:\\w+)@(\\w+)', 'ada@home').group(1)", output: "'home'" },
    },
    {
      name: 'Expecting all repetitions of a group',
      desc: 'A quantified group only remembers its last iteration. Use findall on the repeated part instead.',
      wrong: { label: '(\\d+,?)+', code: "import re\nre.match(r'(\\d+,?)+', '1,22,333').group(1)", output: "'333'" },
      fix:   { label: 'findall', code: "import re\nre.findall(r'\\d+', '1,22,333')", output: "['1', '22', '333']" },
    },
    {
      name: 'Calling group() on a failed search',
      desc: 'There is no Match to read.',
      wrong: { label: 'no check', code: "import re\nre.search(r'(\\d+)', 'none').group(1)", output: "AttributeError: 'NoneType' object has no attribute 'group'" },
      fix:   { label: 'check first', code: "import re\nm = re.search(r'(\\d+)', 'none')\nm.group(1) if m else 'no number'", output: "'no number'" },
    },
  ],

  when: {
    use: [
      'Reading the whole match or one specific group',
      'Several groups at once as a tuple: group(1, 2)',
    ],
    avoid: [
      'All groups → groups() or groupdict()',
      'Positions → start(), end(), span()',
    ],
  },

  notes: {
    cpython:    'match_group in Modules/_sre/_sre.c; a group number is any integer-like index, a name is looked up in Pattern.groupindex',
    'Indexing': 'm[g] (Match.__getitem__, Python 3.6+) accepts one group, same rules as group(g)',
    'Repeats':  'For a group inside a repetition the last iteration wins — (\\w)+ on "abc" gives "c"',
  },

  related: [
    { name: 'Match.groups', slug: 'match-groups', when: 'All groups as a tuple / dict' },
    { name: 'Match.span',   slug: 'match-span',   when: 'Where a group matched' },
    { name: 're.Match',     slug: 'match-object', when: 'lastindex, lastgroup, pos, …' },
    { name: 're.search',    slug: 'search',       when: 'Get a Match to begin with' },
    { name: 'IndexError',   slug: 'indexerror',   when: '"no such group"', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between group(), group(0) and group(1)?',
      a: 'group() and group(0) are the entire match; group(1) is the text of the first capturing group, counted by opening parentheses from the left.',
    },
    {
      q: 'How do I get a named group from a regex match?',
      a: "Define it with (?P<name>...) and read m.group('name') or m['name']. m.groupdict() returns all named groups as a dict.",
    },
    {
      q: 'Why does m.group(1) return None?',
      a: 'Group 1 exists but did not take part in this match — it was optional or in an alternative that was not taken.',
    },
    {
      q: 'What does "IndexError: no such group" mean?',
      a: 'You asked for a group number or name the pattern does not define. Remember that (?:...) groups are not numbered.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.Match.group',
    meta:  'Match.group',
  },
};
