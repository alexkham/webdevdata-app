// content/reference/python/functions/str-index.js
//
// Slug is type-prefixed: `index` collides with list.index and tuple.index.

export const meta = {
  slug:        'str-index',
  name:        'str.index',
  signature:   'str.index(sub[, start[, end]])',
  blurb:       'Position of the first occurrence — raises ValueError instead of returning -1.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'index find position locate substring search first occurrence valueerror str',
};

export const method = {
  slug:      'str-index',
  name:      'str.index',
  signature: 'str.index(sub[, start[, end]])',
  returns:   { type: 'int', desc: 'Lowest index where sub is found. Raises ValueError if it is absent — it never returns -1.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Identical to find, except for the failure mode: find returns -1, index raises. Pick the one whose failure you actually want to handle.',

  cheat: {
    commonCall: 's.index(sub)',
    returns:    'int — the first position, counting from 0',
    replaces:   'find() plus a manual "== -1" check you might forget',
    watchOut:   'raises ValueError on absence — wrap it or use find instead',
  },

  parameters: [
    { name: 'sub',   type: 'str', required: true,  default: null,  desc: 'Substring to look for. The empty string is found immediately at position start.' },
    { name: 'start', type: 'int', required: false, default: '0',   desc: 'Where to begin searching. The returned index is still absolute, not relative to start.' },
    { name: 'end',   type: 'int', required: false, default: 'len', desc: 'Where to stop. The slice searched is s[start:end].' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'string to search in',   input: 'text' },
    { name: 'sub',    type: 'str', hint: 'substring to find',     input: 'text' },
    { name: 'start',  type: 'int', hint: 'start position (blank = 0)', input: 'number-or-none' },
  ],
  cases: [
    { id: 'basic',     label: 'first match',      values: { string: 'hello', sub: 'l', start: '' } },
    { id: 'from',      label: 'search from 3',    values: { string: 'hello', sub: 'l', start: 3 } },
    { id: 'many',      label: 'first of many',    values: { string: 'abcabc', sub: 'b', start: '' } },
    { id: 'missing',   label: 'not found raises', values: { string: 'hello', sub: 'z', start: '' } },
    { id: 'empty-sub', label: 'empty substring',  values: { string: 'hello', sub: '', start: '' } },
  ],
  demoExplainer: 'index scans left to right and returns the first position where sub starts. With a start argument the search skips ahead, but the number you get back is still counted from the beginning of the string. The one real difference from find is the failure case: a missing substring raises ValueError rather than returning -1. The empty string is a curiosity — it is considered present everywhere, so it returns start immediately.',

  patterns: [
    {
      name: 'Split on the first separator',
      desc: 'When the separator is guaranteed present, index reads more directly than find.',
      code: 'i = line.index(":")\nkey, value = line[:i], line[i + 1:]',
    },
    {
      name: 'Let absence be an error',
      desc: 'If a missing marker means malformed input, the exception is the correct behaviour.',
      code: 'try:\n    start = doc.index("<body>")\nexcept ValueError:\n    raise ParseError("no body tag")',
    },
    {
      name: 'Walk every occurrence',
      desc: 'Advance past each hit; the loop ends when the exception fires.',
      code: 'i = 0\nwhile True:\n    try:\n        i = s.index(sub, i) + 1\n    except ValueError:\n        break',
    },
  ],

  examples: [
    { title: 'First match',      code: "'hello'.index('l')",     returns: '2' },
    { title: 'From a position',  code: "'hello'.index('l', 3)",  returns: '3' },
    { title: 'First of many',    code: "'abcabc'.index('b')",    returns: '1' },
    { title: 'Missing raises',   code: "'hello'.index('z')",     returns: 'ValueError: substring not found' },
    { title: 'Empty is at 0',    code: "'hello'.index('')",      returns: '0' },
    { title: 'find returns -1',  code: "'hello'.find('z')",      returns: '-1  # the alternative' },
  ],

  pitfalls: [
    {
      name: 'It raises where find returns -1',
      desc: 'Swapping find for index without adding a try block turns a quiet -1 into an uncaught exception. The two have identical signatures, which makes the swap look safe when it is not.',
      wrong: { label: 'Uncaught', code: "i = 'hello'.index('z')", output: 'ValueError: substring not found' },
      fix:   { label: 'Use find for optional', code: "i = 'hello'.find('z')\nif i == -1:\n    ...", output: '-1, handled' },
    },
    {
      name: 'The -1 from find is a valid index',
      desc: 'The reverse trap. Passing find\'s -1 straight into a slice silently means "last character" instead of "not found", which is why index exists at all.',
      wrong: { label: 'Silently wrong', code: "s = 'hello'\ns[:s.find('z')]", output: "'hell'  # sliced to -1, not empty" },
      fix:   { label: 'Check or use index', code: "i = s.find('z')\nresult = s[:i] if i != -1 else s", output: 'explicit' },
    },
    {
      name: 'start does not shift the result',
      desc: 'The returned index is absolute. Treating it as an offset from start double-counts, which shows up as an off-by-start bug in slicing.',
      wrong: { label: 'Assumed relative', code: "'hello'.index('l', 3)", output: '3  # absolute, not 0' },
      fix:   { label: 'Subtract if you need relative', code: "'hello'.index('l', 3) - 3", output: '0' },
    },
  ],

  when: {
    use: [
      'The substring is required, and absence is a genuine error',
      'You want the failure to stop the code rather than flow onward',
      'Parsing where a missing marker means malformed input',
    ],
    avoid: [
      'Absence is normal and expected → find, which returns -1',
      'You only need a yes/no answer → the in operator',
      'Searching from the right → rindex or rfind',
    ],
  },

  notes: {
    complexity: 'O(n * m) worst case; CPython uses a mix of Crochemore-Perrin and Bloom filters',
    return:     'A non-negative int; never -1, because absence raises instead',
    cpython:    'Objects/stringlib/find.h :: stringlib_index',
    memory:     'No allocation — scans in place',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'find',       slug: 'find',       when: 'Same search, but returns -1 instead of raising' },
    { name: 'str.rindex', slug: 'str-rindex', when: 'Search from the right-hand end' },
    { name: 'str.rfind',  slug: 'str-rfind',  when: 'Search from the right, returning -1 on absence' },
    { name: 'in',         slug: 'in',         when: 'Only need to know whether it is present', category: 'operators' },
  ],

  faq: [
    {
      q: 'When should I use index instead of find?',
      a: 'When absence is a bug rather than a case to handle. index turns a missing substring into an immediate, loud ValueError; find hands back -1 and trusts you to check. If you would write "if i == -1: raise" anyway, index already does it.',
      code: "i = line.index(':')   # a line without a colon is malformed",
    },
    {
      q: "Why does ''.index return 0 rather than raising?",
      a: 'The empty string is a substring of every string, at every position — including position 0 of the empty string itself. Returning start immediately is the consistent answer, and it matches find.',
      code: "'hello'.index('')   # 0\n''.index('')        # 0",
    },
    {
      q: 'Is it different from list.index?',
      a: 'The idea is the same — first position, ValueError on absence — but str.index matches a SUBSTRING while list.index matches one ELEMENT. str.index also accepts start and end, which is why searching a slice does not require copying it.',
    },
  ],

  history: [
    { version: '1.0', note: 'Present since the earliest string methods, alongside find.' },
    { version: '2.5', note: 'start and end accepted as None, making it easier to pass through optional arguments.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.index',
    meta:  'str.index',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'Inspect strings before searching them' },
  ],
};
