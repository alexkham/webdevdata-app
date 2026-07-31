// content/reference/python/functions/find.js

export const meta = {
  slug:        'find',
  name:        'str.find',
  signature:   'str.find(sub, start=0, end=len(s))',
  blurb:       'Return the lowest index of a substring, or -1 if absent.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'find index position locate search substring where',
};

export const method = {
  slug:      'find',
  name:      'str.find',
  signature: 'str.find(sub, start=0, end=len(s))',
  returns:   { type: 'int', desc: 'The lowest index where sub is found, or -1 when it does not occur. Never raises for a missing substring.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Locate a substring: its first index, or -1 when absent — the non-raising sibling of str.index.',

  cheat: {
    commonCall: '"hello".find("l")',
    returns:    'int index, or -1 when absent',
    replaces:   'str.index raises ValueError instead of returning -1',
    watchOut:   '-1 is truthy — "if s.find(x):" is a classic bug',
  },

  parameters: [
    { name: 'sub',   type: 'str', required: true,  default: null,     desc: 'The substring to locate.' },
    { name: 'start', type: 'int', required: false, default: '0',      desc: 'Slice start, supports negative indexing.' },
    { name: 'end',   type: 'int', required: false, default: 'len(s)', desc: 'Slice end (exclusive), supports negative indexing.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',      input: 'text' },
    { name: 'sub',    type: 'str', hint: 'to locate',       input: 'text' },
    { name: 'start',  type: 'int', hint: 'search from',     input: 'number-or-none' },
  ],
  cases: [
    { id: 'default', label: 'default',   values: { string: 'hello world', sub: 'o',  start: '' } },
    { id: 'missing', label: 'not found', values: { string: 'hello',       sub: 'z',  start: '' } },
    { id: 'start',   label: 'with start', values: { string: 'hello world', sub: 'o', start: 5 } },
    { id: 'multi',   label: 'first wins', values: { string: 'abcabc',     sub: 'bc', start: '' } },
  ],
  demoExplainer: 'find scans left to right and reports the FIRST match. A missing substring returns -1 — no exception. The optional start restricts where the search begins.',

  patterns: [
    {
      name: 'Check-then-slice',
      desc: 'Find a marker and slice relative to it.',
      code: 'i = s.find(":")\nif i != -1:\n    value = s[i + 1:]',
    },
    {
      name: 'Existence check — prefer "in"',
      desc: 'When you only need yes/no, the in operator says it better.',
      code: 'if "@" in email:   # not: email.find("@") != -1\n    ...',
    },
    {
      name: 'Search from the right',
      desc: 'rfind reports the LAST occurrence.',
      code: 'ext = path[path.rfind(".") + 1:]',
    },
  ],

  examples: [
    { title: 'First occurrence',      code: '"hello".find("l")',        returns: '2' },
    { title: 'Missing substring',     code: '"hello".find("z")',        returns: '-1' },
    { title: 'Search from an index',  code: '"hello world".find("o", 5)', returns: '7' },
    { title: 'Empty sub matches at 0', code: '"abc".find("")',          returns: '0' },
  ],

  pitfalls: [
    {
      name: '-1 is truthy',
      desc: 'Testing find() directly as a boolean inverts the logic: 0 (found at start) is falsy, -1 (absent) is truthy.',
      wrong: { label: 'Backwards', code: 'if "hello".find("h"):\n    print("found")', output: 'nothing — index 0 is falsy' },
      fix:   { label: 'Fix', code: 'if "hello".find("h") != -1:\n    print("found")', output: 'found' },
    },
    {
      name: 'find vs index',
      desc: 'Same search, different failure mode — pick by whether absence is an error.',
      wrong: { label: 'Silent -1 travels', code: 'pos = s.find(marker)\nvalue = s[pos:]  # pos may be -1!', output: 'slice from -1 = last char — silently wrong' },
      fix:   { label: 'Fail fast', code: 'pos = s.index(marker)  # raises if absent\nvalue = s[pos:]', output: 'ValueError at the real problem site' },
    },
  ],

  when: {
    use: [
      'You need the position, and absence is a normal case',
      'Slicing around a found marker',
    ],
    avoid: [
      'Existence only → "sub" in s',
      'Absence is a bug → str.index (raises)',
      'Last occurrence → str.rfind',
      'Pattern matching → re.search',
    ],
  },

  notes: {
    complexity: 'O(n·m) worst case; tuned two-way search in practice',
    return:     'int (or -1)',
    cpython:    'Objects/unicodeobject.c :: unicode_find',
    memory:     'No allocation',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.count',   slug: 'str-count', when: 'How many, not where' },
    { name: 'str.split',   slug: 'split',     when: 'Cut at every occurrence' },
    { name: 'str.replace', slug: 'replace',   when: 'Change what you found' },
    { name: 'str.startswith', slug: 'startswith', when: 'Anchored at the start' },
  ],

  faq: [
    {
      q: 'What is the difference between find and index?',
      a: 'Identical search; find returns -1 for a missing substring while index raises ValueError. Use index when absence means a bug.',
    },
    {
      q: 'How do I find the last occurrence?',
      a: 'str.rfind (or rindex) — same contract, scanning for the rightmost match.',
      code: '"a.b.c".rfind(".")  # 3',
    },
    {
      q: 'How do I find all occurrences?',
      a: 'Loop with the start parameter, or use re.finditer.',
      code: 'i = s.find(sub)\nwhile i != -1:\n    positions.append(i)\n    i = s.find(sub, i + 1)',
    },
  ],

  history: [
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.find',
    meta:  'str.find',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
