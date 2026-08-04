// content/reference/python/functions/str-rfind.js
//
// Slug is type-prefixed: `rfind` is a str method (also on bytes).

export const meta = {
  slug:        'str-rfind',
  name:        'str.rfind',
  signature:   'str.rfind(sub, start=0, end=len(s))',
  blurb:       'Return the highest index of a substring, or -1 if absent.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'rfind reverse find last index position locate search substring right file extension',
};

export const method = {
  slug:      'str-rfind',
  name:      'str.rfind',
  signature: 'str.rfind(sub, start=0, end=len(s))',
  returns:   { type: 'int', desc: 'The highest index where sub is found, or -1 when it does not occur. Never raises for a missing substring — the non-raising sibling of str.rindex.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Locate a substring&apos;s LAST occurrence: highest index, or -1 when absent. The right-scanning mirror of str.find.',

  cheat: {
    commonCall: 'filename.rfind(".")',
    returns:    'int index, or -1 when absent',
    replaces:   'str.rindex raises ValueError instead of returning -1',
    watchOut:   '-1 is truthy — `if s.rfind(x):` is a classic bug',
  },

  parameters: [
    { name: 'sub',   type: 'str', required: true,  default: null,     desc: 'The substring to locate.' },
    { name: 'start', type: 'int', required: false, default: '0',      desc: 'Slice start, supports negative indexing. The search is bounded to s[start:end].' },
    { name: 'end',   type: 'int', required: false, default: 'len(s)', desc: 'Slice end (exclusive), supports negative indexing.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
    { name: 'sub',    type: 'str', hint: 'to locate',  input: 'text' },
    { name: 'start',  type: 'int', hint: 'search from', input: 'number-or-none' },
  ],
  cases: [
    { id: 'default',   label: 'last occurrence', values: { string: 'hello world', sub: 'o',  start: '' } },
    { id: 'missing',   label: 'not found',       values: { string: 'hello',       sub: 'z',  start: '' } },
    { id: 'multi',     label: 'multiple hits',   values: { string: 'abcabc',      sub: 'bc', start: '' } },
    { id: 'ext',       label: 'file extension',  values: { string: 'archive.tar.gz', sub: '.', start: '' } },
    { id: 'bounded',   label: 'bounded search',  values: { string: 'hello world', sub: 'o', start: 5 } },
    { id: 'empty-sub', label: 'empty substring', values: { string: 'hello',       sub: '',  start: '' } },
  ],
  demoExplainer: 'rfind scans from the RIGHT: it returns the HIGHEST index where sub appears in the substring s[start:end], or -1 when there is no occurrence. The start / end bounds are applied first, then the search runs backward. An empty sub is found at every position — rfind returns end (or len when end is default).',

  patterns: [
    {
      name: 'File extension via last dot',
      desc: 'rfind is the classical way to split a filename at its final dot.',
      code: 'i = name.rfind(".")\next = name[i+1:] if i != -1 else ""',
    },
    {
      name: 'Last URL segment',
      desc: 'Trim everything up to the last slash.',
      code: 'i = url.rfind("/")\ntail = url[i+1:] if i != -1 else url',
    },
    {
      name: 'Bounded rfind',
      desc: 'Use start / end to search a slice without materializing it.',
      code: 'i = s.rfind(sub, 0, cutoff)   # search only in s[:cutoff]',
    },
  ],

  examples: [
    { title: 'Last occurrence',     code: '"hello world".rfind("o")',       returns: '7' },
    { title: 'Not found',           code: '"hello".rfind("z")',              returns: '-1' },
    { title: 'Multiple hits',       code: '"abcabc".rfind("bc")',            returns: '4' },
    { title: 'File extension',      code: '"archive.tar.gz".rfind(".")',     returns: '11' },
    { title: 'Bounded search',      code: '"hello world".rfind("o", 0, 5)',  returns: '4' },
    { title: 'Empty sub is len',    code: '"hello".rfind("")',               returns: '5' },
  ],

  pitfalls: [
    {
      name: 'The -1 sentinel is TRUTHY',
      desc: 'A missing substring returns -1 — which is truthy in Python. `if s.rfind(x):` treats &quot;not found&quot; as a positive signal. Same bug as find.',
      wrong: { label: 'Wrong branch', code: 'if line.rfind("ERROR"):\n    log_error()  # runs on -1 too', output: 'runs even when ERROR is missing' },
      fix:   { label: 'Compare explicitly', code: 'if line.rfind("ERROR") != -1:\n    log_error()', output: 'runs only on hit' },
    },
    {
      name: 'rfind vs rindex — one returns -1, one raises',
      desc: 'rindex is the raising sibling: it raises ValueError instead of returning -1 for a missing substring. Same pair as find/index.',
      wrong: { label: 'Blows up',    code: '"hello".rindex("z")', output: 'ValueError: substring not found' },
      fix:   { label: 'Silent -1',   code: '"hello".rfind("z")',  output: '-1' },
    },
    {
      name: 'start / end are applied FIRST — then search runs backward',
      desc: 'You are not asking &quot;search backward from end&quot;, you are asking &quot;search the slice s[start:end] and return the highest index in the original string&quot;. If you slice out the target, rfind returns -1.',
      wrong: { label: 'Assumed direction', code: '"hello world".rfind("o", 8, 11)', output: '-1  # &quot;o&quot; not in "orl"' },
      fix:   { label: 'Full slice',        code: '"hello world".rfind("o", 0, 11)', output: '7' },
    },
    {
      name: 'Empty substring returns end (or len)',
      desc: 'Every position matches the empty string, and rfind returns the highest one — which is the slice&apos;s end. Handy for &quot;no-op&quot; edge cases; surprising if you were probing for real content.',
      wrong: { label: 'Assumed -1', code: '"hello".rfind("")', output: '5  # not -1' },
      fix:   { label: 'Guard against empty', code: 'if sub and s.rfind(sub) != -1:\n    ...', output: 'safer intent' },
    },
  ],

  when: {
    use: [
      'Splitting a filename at the last dot',
      'Extracting the tail after the last delimiter',
      'Finding the last occurrence of any substring in a search-and-replace tool',
      'When &quot;not found&quot; should be handled silently, not with an exception',
    ],
    avoid: [
      'You want an exception on missing → str.rindex',
      'You need the first occurrence → str.find',
      'You need to know how many matches → str.count',
      'You need every match position → a loop with find or re.finditer',
    ],
  },

  notes: {
    complexity: 'O(n * m) worst case for pattern length m in string length n; typically O(n)',
    return:     'int in [start, end] on hit; -1 on miss; end (or len) for empty sub',
    cpython:    'Objects/unicodeobject.c :: unicode_rfind',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'find',           slug: 'find',           when: 'The first occurrence, not the last' },
    { name: 'str.rpartition', slug: 'str-partition',  when: 'Split at the last occurrence, get before/sep/after' },
    { name: 'endswith',       slug: 'endswith',       when: 'Just checking a suffix, not extracting' },
    { name: 'str.count',      slug: 'str-count',      when: 'Total count of matches' },
  ],

  faq: [
    {
      q: 'What is the difference between rfind and rindex?',
      a: 'rfind returns -1 on a missing substring; rindex raises ValueError. Same pair as find/index. Pick rfind when absence is expected and cheap; pick rindex when absence is a hard error you want to trip.',
    },
    {
      q: 'Why does rfind return end when sub is empty?',
      a: 'By convention: every position &quot;contains&quot; the empty string, and rfind returns the highest such position — which is end (or len when end is default). It mirrors find, which returns start for the empty case.',
    },
    {
      q: 'Does rfind search backward or forward?',
      a: 'Conceptually backward — it returns the last (highest-index) match. Internally the CPython implementation scans efficiently; the direction only affects which match wins on multiple hits.',
    },
  ],

  history: [
    { version: '2.0', note: 'rfind() has been part of str since Python 2.0.' },
    { version: '2.5', note: 'start / end arguments accept negative indexes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.rfind',
    meta:  'str.rfind',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};