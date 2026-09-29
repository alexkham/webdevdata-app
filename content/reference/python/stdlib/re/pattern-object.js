// content/reference/python/stdlib/re/pattern-object.js

export const meta = {
  slug:        'pattern-object',
  name:        're.Pattern',
  signature:   'class re.Pattern',
  blurb:       'The compiled regular expression that re.compile returns — its attributes pattern, flags, groups, groupindex, the matching methods, and the undocumented scanner().',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're Pattern re.Pattern compiled pattern object Pattern.pattern Pattern.flags Pattern.groups Pattern.groupindex Pattern.scanner scanner type hint re.Pattern[str] attributes',
};

export const method = {
  slug:      'pattern-object',
  name:      're.Pattern',
  signature: 'class re.Pattern',
  returns:   { type: 're.Pattern', desc: 'Created by re.compile (not instantiable directly).' },

  category:    're class',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'What re.compile gives you. It carries the source pattern, the effective flags, the group count and the name → number map, and has the same search/match/fullmatch/findall/finditer/sub/subn/split methods as the module — with extra pos/endpos arguments.',

  covers: ['Pattern', 'Pattern.pattern', 'Pattern.flags', 'Pattern.groups', 'Pattern.groupindex', 'Pattern.scanner'],

  cheat: {
    commonCall: "pat = re.compile(r'(?P<key>\\w+)=(\\d+)')",
    returns:    'pat.pattern, pat.flags, pat.groups == 2, pat.groupindex == {"key": 1}',
    replaces:   'passing the same pattern string around',
    watchOut:   'Cannot be created with re.Pattern(...) — call re.compile',
  },

  attributes: [
    { name: 'pattern',    type: 'str | bytes',       meaning: 'The pattern string it was compiled from' },
    { name: 'flags',      type: 'int',               meaning: 'Effective flags: those passed, inline ones, and re.UNICODE (32) for str patterns' },
    { name: 'groups',     type: 'int',               meaning: 'Number of capturing groups' },
    { name: 'groupindex', type: 'mapping',           meaning: 'Named group → group number (a read-only mappingproxy; an empty dict when there are no names)' },
    { name: 'scanner(string, pos=0, endpos=…)', type: 'SRE_Scanner', meaning: 'Undocumented helper: an object whose match() / search() continue from the previous match — what finditer uses internally' },
  ],

  modes: [
    {
      id: 'attrs',
      label: 'attributes',
      blurb: 'pattern, flags, groups and groupindex of a compiled pattern.',
      params: [{ name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' }],
      template: 'import re\np = re.compile({$pattern})\n(p.pattern, p.flags, p.groups, p.groupindex)',
      cases: [
        { id: 'plain', label: 'no groups',    values: { pattern: '\\d+' } },
        { id: 'named', label: 'named groups', values: { pattern: '(?P<y>\\d{4})-(?P<m>\\d\\d)-(\\d\\d)' } },
        { id: 'flags', label: 'inline flags', values: { pattern: '(?ix) hello  world' } },
        { id: 'nc',    label: 'non-capturing', values: { pattern: '(?:ab)+(c)' } },
      ],
    },
    {
      id: 'scanner',
      label: 'scanner()',
      blurb: 'scanner().match() only accepts a match starting exactly where the last one ended — a tiny tokenizer. It stops (None) at the first gap.',
      params: [
        { name: 'pattern', type: 'str', hint: 'token pattern', input: 'text' },
        { name: 'text',    type: 'str', hint: 'input',         input: 'text' },
      ],
      template: 'import re\nsc = re.compile({$pattern}).scanner({$text})\n[m.group() for m in iter(sc.match, None)]',
      cases: [
        { id: 'tokens', label: 'tokens',        values: { pattern: '\\s*(\\d+|[-+*/])', text: '12 + 3*4' } },
        { id: 'gap',    label: 'stops at a gap', values: { pattern: '\\d+,?', text: '1,2,x,3' } },
      ],
    },
  ],
  demoExplainer: 'flags always includes 32 (re.UNICODE) for a str pattern; (?ix) adds 2 and 64, so the total is 98. Non-capturing (?:...) groups are not counted in groups. iter(sc.match, None) calls scanner.match() until it returns None — at the first character no token can start, so "1,2,x,3" stops before the x.',

  patterns: [
    {
      name: 'Type hints',
      desc: 're.Pattern is generic since 3.9.',
      code: 'import re\ndef find_ids(pat: re.Pattern[str], text: str) -> list[str]:\n    return pat.findall(text)',
    },
    {
      name: 'Accept a string or a compiled pattern',
      desc: 're.compile returns an already-compiled Pattern unchanged.',
      code: 'import re\ndef search_all(pattern, texts):\n    pat = re.compile(pattern)  # works for str and re.Pattern\n    return [pat.search(t) for t in texts]',
    },
    {
      name: 'Map a group name to its number',
      desc: 'groupindex is read-only; copy it with dict() if you need a dict.',
      code: 'import re\nnames = dict(pat.groupindex)\nnumber_of = names.get',
    },
  ],

  examples: [
    { title: 'The type of compile()',      code: "import re\ntype(re.compile('a'))", returns: "<class 're.Pattern'>" },
    { title: 'pattern and groups',         code: "import re\np = re.compile(r'(a)(?P<n>b)(?:c)')\n(p.pattern, p.groups)", returns: "('(a)(?P<n>b)(?:c)', 2)" },
    { title: 'groupindex',                 code: "import re\nre.compile(r'(a)(?P<n>b)').groupindex", returns: "mappingproxy({'n': 2})" },
    { title: 'No names: empty dict',       code: "import re\nre.compile(r'(a)').groupindex", returns: '{}' },
    { title: 'flags includes UNICODE',     code: "import re\n(re.compile('a').flags, re.compile('a', re.I).flags, re.compile('a', re.A).flags)", returns: '(32, 34, 256)' },
    { title: 'Methods take pos/endpos',    code: "import re\nre.compile(r'\\d').findall('0123456', 2, 5)", returns: "['2', '3', '4']" },
    { title: 'scanner().search()',         code: "import re\nsc = re.compile(r'\\d').scanner('a1b2')\n(sc.search(), sc.search(), sc.search())", returns: "(<re.Match object; span=(1, 2), match='1'>, <re.Match object; span=(3, 4), match='2'>, None)" },
  ],

  pitfalls: [
    {
      name: 'Trying to instantiate re.Pattern',
      desc: 'The class exists for isinstance checks and type hints only.',
      wrong: { label: 're.Pattern(...)', code: "import re\nre.Pattern(r'\\d+')", output: "TypeError: cannot create 're.Pattern' instances" },
      fix:   { label: 're.compile(...)', code: "import re\nisinstance(re.compile(r'\\d+'), re.Pattern)", output: 'True' },
    },
    {
      name: 'Modifying groupindex',
      desc: 'It is a read-only view.',
      wrong: { label: 'assign', code: "import re\np = re.compile(r'(?P<a>x)')\np.groupindex['b'] = 2", output: "TypeError: 'mappingproxy' object does not support item assignment" },
      fix:   { label: 'dict copy', code: "import re\np = re.compile(r'(?P<a>x)')\nd = dict(p.groupindex)\nd['b'] = 2\nd", output: "{'a': 1, 'b': 2}" },
    },
  ],

  when: {
    use: [
      'Inspecting a pattern: how many groups, which names, which flags',
      'Type hints (re.Pattern[str]) and isinstance checks',
      'pos/endpos arguments that the module functions do not have',
    ],
    avoid: [
      'Relying on scanner() in library code — it is undocumented',
      'Comparing Pattern objects to test for "same regex" — compare .pattern and .flags',
    ],
  },

  notes: {
    cpython:   'PatternObject in Modules/_sre/_sre.c; the attributes are read-only members, scanner() returns an SRE_Scanner used by finditer',
    'Equality': 'Two Pattern objects compare equal when they have the same pattern string and flags',
    'Generic': 're.Pattern[str] / re.Pattern[bytes] in annotations since Python 3.9',
    'Copy':    'copy.copy() and copy.deepcopy() return the same object (3.7+) — patterns are immutable',
  },

  related: [
    { name: 're.compile', slug: 'compile', when: 'How to get a Pattern' },
    { name: 're.Match',   slug: 'match-object', when: 'What its methods return' },
    { name: 'Flags',      slug: 'flags',   when: 'What the bits in .flags mean' },
    { name: 're.finditer', slug: 'finditer', when: 'The public face of scanner()' },
    { name: 'isinstance()', slug: 'isinstance', when: 'Check for a compiled pattern', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the pattern string back from a compiled regex?',
      a: "Read .pattern: re.compile(r'\\d+').pattern is '\\\\d+' (the backslash shown doubled in the repr).",
    },
    {
      q: 'Why is Pattern.flags 32 when I passed no flags?',
      a: 'For str patterns re.UNICODE (32) is always set unless you pass re.ASCII. Inline flags such as (?i) are included as well.',
    },
    {
      q: 'How do I type-hint a compiled regex?',
      a: 'Use re.Pattern[str] (Python 3.9+); on older versions typing.Pattern[str].',
    },
    {
      q: 'What is Pattern.scanner?',
      a: 'An undocumented method returning a scanner object whose match() and search() each continue after the previous match. finditer is built on it; for tokenizers it offers match() which refuses to skip characters.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.Pattern',
    meta:  're.Pattern',
  },
};
