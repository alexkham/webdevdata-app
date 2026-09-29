// content/reference/python/stdlib/re/match-groups.js

export const meta = {
  slug:        'match-groups',
  name:        'Match.groups',
  signature:   'Match.groups(default=None) / Match.groupdict(default=None)',
  blurb:       'All capturing groups at once: groups() as a tuple, groupdict() as a {name: text} dict — with a default for groups that did not match.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'match groups groupdict python regex all groups tuple dict named groups default none unpack Match.groups Match.groupdict',
};

export const method = {
  slug:      'match-groups',
  name:      'Match.groups',
  signature: 'Match.groups(default=None) / Match.groupdict(default=None)',
  returns:   { type: 'tuple[str | None, ...] / dict[str, str | None]', desc: 'groups(): every group from 1 up. groupdict(): only the named groups. Unmatched groups get default.' },

  category:    're.Match method',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'groups() returns all numbered groups (not group 0) as a tuple, ready to unpack; groupdict() returns the named groups as a dict. Both take a default for groups that did not participate — None unless you say otherwise.',

  covers: ['Match.groups', 'Match.groupdict'],

  cheat: {
    commonCall: 'year, month, day = m.groups()',
    returns:    "('2026', '09', '29') / {'year': '2026', …}",
    replaces:   'm.group(1), m.group(2), … one by one',
    watchOut:   "groups() never includes group 0; groupdict() skips unnamed groups",
  },

  parameters: [
    { name: 'default', type: 'object', required: false, default: 'None', desc: "Value used for groups that did not take part in the match — often ''." },
  ],

  modes: [
    {
      id: 'groups',
      label: 'groups()',
      blurb: 'Every group, in order. Optional groups that were skipped show the default (None).',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression with groups', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                             input: 'text' },
      ],
      template: "import re\nm = re.search({$pattern}, {$text})\n(m.groups(), m.groups(''))",
      cases: [
        { id: 'date', label: 'a date',          values: { pattern: '(\\d{4})-(\\d\\d)-(\\d\\d)', text: 'due 2026-09-29' } },
        { id: 'opt',  label: 'optional parts',  values: { pattern: '(\\d+)(?:\\.(\\d+))?(%)?', text: 'rate 7 today' } },
        { id: 'none', label: 'no groups',       values: { pattern: '\\d+', text: 'a1' } },
      ],
    },
    {
      id: 'groupdict',
      label: 'groupdict()',
      blurb: 'Only the named groups, as a dict.',
      params: [
        { name: 'pattern', type: 'str', hint: 'use (?P<name>...)', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',              input: 'text' },
      ],
      template: "import re\nm = re.search({$pattern}, {$text})\nm.groupdict()",
      cases: [
        { id: 'url',   label: 'URL parts',    values: { pattern: '(?P<scheme>https?)://(?P<host>[\\w.-]+)(?::(?P<port>\\d+))?', text: 'see https://example.com/docs' } },
        { id: 'mixed', label: 'mixed groups', values: { pattern: '(?P<key>\\w+)(=)(\\w+)', text: 'mode=fast' } },
      ],
    },
  ],
  demoExplainer: "In the optional-parts case the fraction and percent groups did not match: groups() reports them as None, groups('') as empty strings. groupdict() contains only named groups — the (=) and (\\w+) groups of the mixed case are left out — and a skipped named group (port) appears with the value None.",

  patterns: [
    {
      name: 'Unpack straight into variables',
      desc: 'The tuple length equals the number of groups.',
      code: "import re\nif m := re.fullmatch(r'(\\d{4})-(\\d{2})-(\\d{2})', s):\n    year, month, day = map(int, m.groups())",
    },
    {
      name: 'Parse into keyword arguments',
      desc: 'groupdict() feeds a constructor directly.',
      code: "import re\nfrom datetime import date\nm = re.fullmatch(r'(?P<year>\\d{4})-(?P<month>\\d\\d)-(?P<day>\\d\\d)', s)\nd = date(**{k: int(v) for k, v in m.groupdict().items()})",
    },
    {
      name: 'Defaults for optional parts',
      desc: 'Fill missing groups with a value that suits the next step.',
      code: "import re\nm = re.match(r'(?P<host>[\\w.]+)(?::(?P<port>\\d+))?', addr)\nparts = m.groupdict(default='80')",
    },
  ],

  examples: [
    { title: 'All groups as a tuple',     code: "import re\nre.search(r'(\\d{4})-(\\d\\d)-(\\d\\d)', 'due 2026-09-29').groups()", returns: "('2026', '09', '29')" },
    { title: 'Unmatched → None',          code: "import re\nre.match(r'(a)(b)?', 'a').groups()", returns: "('a', None)" },
    { title: 'With a default',            code: "import re\nre.match(r'(a)(b)?', 'a').groups('')", returns: "('a', '')" },
    { title: 'No groups → empty tuple',   code: "import re\nre.match(r'\\d+', '42').groups()", returns: '()' },
    { title: 'Named groups as a dict',    code: "import re\nre.search(r'(?P<user>\\w+)@(?P<host>\\w+)', 'ada@home').groupdict()", returns: "{'user': 'ada', 'host': 'home'}" },
    { title: 'groupdict default',         code: "import re\nre.match(r'(?P<a>x)(?P<b>y)?', 'x').groupdict('-')", returns: "{'a': 'x', 'b': '-'}" },
  ],

  pitfalls: [
    {
      name: 'Expecting group 0 in groups()',
      desc: 'groups() starts at group 1. Use group() for the whole match.',
      wrong: { label: 'groups()[0]', code: "import re\nre.search(r'(\\w+)@\\w+', 'ada@home').groups()[0]", output: "'ada'" },
      fix:   { label: 'group(0)', code: "import re\nre.search(r'(\\w+)@\\w+', 'ada@home').group(0)", output: "'ada@home'" },
    },
    {
      name: 'Unpacking the wrong number of groups',
      desc: 'Every capturing group appears in the tuple — including an outer group you added around the others. Make it non-capturing.',
      wrong: { label: 'outer ( )', code: "import re\nhost, tld = re.match(r'((\\w+)\\.(com|org))', 'site.org').groups()", output: 'ValueError: too many values to unpack (expected 2)' },
      fix:   { label: 'outer (?: )', code: "import re\nhost, tld = re.match(r'(?:(\\w+)\\.(com|org))', 'site.org').groups()\n(host, tld)", output: "('site', 'org')" },
    },
  ],

  when: {
    use: [
      'Unpacking several groups into variables',
      'Turning a match into a dict of named fields',
    ],
    avoid: [
      'One group → group(n)',
      'Every match in a text → findall (tuples) or finditer + groupdict()',
    ],
  },

  notes: {
    cpython:   'match_groups / match_groupdict in Modules/_sre/_sre.c; groupdict iterates Pattern.groupindex, so keys come in the order the names appear in the pattern',
    'default': 'Applies only to groups that did not participate; a group that matched the empty string gives \'\' regardless',
  },

  related: [
    { name: 'Match.group', slug: 'match-group', when: 'One group at a time' },
    { name: 're.findall',  slug: 'findall',     when: 'Group tuples for every match' },
    { name: 're.finditer', slug: 'finditer',    when: 'groupdict() for every match' },
    { name: 'dict()',      slug: 'dict',        when: 'What groupdict returns', category: 'functions' },
    { name: 'ValueError',  slug: 'valueerror',  when: 'Unpacking the wrong number of groups', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between Match.group() and Match.groups()?',
      a: 'group() returns the whole match (or the groups you name); groups() returns a tuple of all capturing groups from 1 upward, without the whole match.',
    },
    {
      q: 'How do I get named groups as a dictionary?',
      a: 'm.groupdict() returns {name: text} for every (?P<name>...) group; pass a default for ones that did not match.',
    },
    {
      q: 'Why does groups() contain None?',
      a: "Those groups did not participate in the match — they were optional or in an alternative that was not taken. groups('') replaces None with empty strings.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.Match.groups',
    meta:  'Match.groups',
  },
};
