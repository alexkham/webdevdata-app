// content/reference/python/functions/str-count.js
//
// Slug is type-prefixed: `count` exists on str, list and tuple.

export const meta = {
  slug:        'str-count',
  name:        'str.count',
  signature:   'str.count(sub, start=0, end=len(s))',
  blurb:       'Count non-overlapping occurrences of a substring.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'count occurrences substring frequency how many',
};

export const method = {
  slug:      'str-count',
  name:      'str.count',
  signature: 'str.count(sub, start=0, end=len(s))',
  returns:   { type: 'int', desc: 'The number of non-overlapping occurrences of sub in the (optionally sliced) string. Zero if not found.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Count how many times a substring occurs — non-overlapping, case-sensitive.',

  cheat: {
    commonCall: '"banana".count("an")',
    returns:    'int — 0 when absent',
    replaces:   'matches never overlap: "aaaa".count("aa") is 2, not 3',
    watchOut:   'case-sensitive; counting an empty sub returns len(s) + 1',
  },

  parameters: [
    { name: 'sub',   type: 'str', required: true,  default: null,      desc: 'The substring to count. Empty string counts the gaps: len(s) + 1.' },
    { name: 'start', type: 'int', required: false, default: '0',       desc: 'Slice start, supports negative indexing.' },
    { name: 'end',   type: 'int', required: false, default: 'len(s)',  desc: 'Slice end (exclusive), supports negative indexing.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
    { name: 'sub',    type: 'str', hint: 'to count',   input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default',     values: { string: 'banana',      sub: 'an' } },
    { id: 'overlap', label: 'overlapping', values: { string: 'aaaa',        sub: 'aa' } },
    { id: 'none',    label: 'not found',   values: { string: 'hello',       sub: 'z' } },
    { id: 'case',    label: 'case',        values: { string: 'Aa aA',       sub: 'a' } },
    { id: 'empty',   label: 'empty sub',   values: { string: 'abc',         sub: '' } },
  ],
  demoExplainer: 'Counting scans left to right and jumps past each match, so occurrences never overlap. The comparison is exact — case matters.',

  patterns: [
    {
      name: 'Quick sanity checks',
      desc: 'Count a delimiter before splitting on it.',
      code: 'if line.count(",") != 2:\n    raise ValueError("expected 3 fields")',
    },
    {
      name: 'Character frequency',
      desc: 'For a handful of characters count is fine; for full histograms use Counter.',
      code: 'vowels = sum(s.count(v) for v in "aeiou")',
    },
  ],

  examples: [
    { title: 'Count a substring',              code: '"banana".count("an")', returns: '2' },
    { title: 'Non-overlapping only',           code: '"aaaa".count("aa")',   returns: '2' },
    { title: 'Absent substring',               code: '"hello".count("z")',   returns: '0' },
    { title: 'Within a slice',                 code: '"banana".count("a", 2)', returns: '2' },
  ],

  pitfalls: [
    {
      name: 'Overlapping matches are not counted',
      desc: 'After a match, scanning resumes past it.',
      wrong: { label: 'Expected 3?', code: '"aaaa".count("aa")', output: '2' },
      fix:   { label: 'Overlapping count', code: 'sum("aaaa".startswith("aa", i)\n    for i in range(len("aaaa")))', output: '3' },
    },
    {
      name: 'Case-sensitive',
      desc: 'Normalize first for case-insensitive counting.',
      wrong: { label: 'Misses "A"', code: '"Aa".count("a")', output: '1' },
      fix:   { label: 'Fix', code: '"Aa".lower().count("a")', output: '2' },
    },
    {
      name: 'Empty substring counts gaps',
      desc: 'Every position between characters (plus both ends) matches the empty string.',
      wrong: { label: 'Surprising', code: '"abc".count("")', output: '4' },
      fix:   { label: 'Guard', code: 'if sub:\n    n = s.count(sub)', output: 'counted only when sub is non-empty' },
    },
  ],

  when: {
    use: [
      'How many times does this literal substring occur',
      'Validating an expected number of delimiters',
      'Cheap containment-with-frequency checks',
    ],
    avoid: [
      'Pattern counting → len(re.findall(...))',
      'Full character histogram → collections.Counter',
      'Just existence → "sub" in s (faster, clearer)',
    ],
  },

  notes: {
    complexity: 'O(n·m) worst case, fast in practice (CPython uses a tuned search)',
    return:     'int',
    cpython:    'Objects/unicodeobject.c :: unicode_count',
    memory:     'No allocation beyond the result',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'list.count',  slug: 'list-count', when: 'Count equal items in a list' },
    { name: 'str.split',   slug: 'split',      when: 'You need the pieces, not the number' },
    { name: 'str.replace', slug: 'replace',    when: 'Change the occurrences instead' },
  ],

  faq: [
    {
      q: 'Is count case-insensitive?',
      a: 'No. Lowercase both sides first, or use a regex with re.IGNORECASE.',
      code: 's.lower().count(sub.lower())',
    },
    {
      q: 'How do I count overlapping occurrences?',
      a: 'There is no built-in flag; scan positions manually or use a lookahead regex.',
      code: 'import re\nlen(re.findall("(?=aa)", "aaaa"))  # 3',
    },
    {
      q: 'Why does "abc".count("") return 4?',
      a: 'The empty string matches at every boundary: before a, between each pair, and after c — that is len(s) + 1 positions.',
    },
  ],

  history: [
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.count',
    meta:  'str.count',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
