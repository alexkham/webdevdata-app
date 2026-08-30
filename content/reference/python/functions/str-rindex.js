// content/reference/python/functions/str-rindex.js
//
// Slug is type-prefixed: `rindex` belongs to str, mirroring str-rfind.

export const meta = {
  slug:        'str-rindex',
  name:        'str.rindex',
  signature:   'str.rindex(sub[, start[, end]])',
  blurb:       'Position of the LAST occurrence — raises ValueError instead of returning -1.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'rindex rfind last occurrence reverse search from right position substring str',
};

export const method = {
  slug:      'str-rindex',
  name:      'str.rindex',
  signature: 'str.rindex(sub[, start[, end]])',
  returns:   { type: 'int', desc: 'Highest index where sub is found. Raises ValueError if it is absent — it never returns -1.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The right-hand counterpart of index. It searches from the end, but the index it returns still counts from the start.',

  cheat: {
    commonCall: 's.rindex(sub)',
    returns:    'int — the LAST position, still counted from 0 at the left',
    replaces:   'rfind() plus a manual "== -1" check',
    watchOut:   'the search direction reverses, the numbering does not',
  },

  parameters: [
    { name: 'sub',   type: 'str', required: true,  default: null,  desc: 'Substring to look for. The empty string is found at the far end of the searched range.' },
    { name: 'start', type: 'int', required: false, default: '0',   desc: 'Left boundary of the range searched. Matches before it are ignored.' },
    { name: 'end',   type: 'int', required: false, default: 'len', desc: 'Right boundary. The slice searched is s[start:end].' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'string to search in',       input: 'text' },
    { name: 'sub',    type: 'str', hint: 'substring to find',         input: 'text' },
    { name: 'start',  type: 'int', hint: 'start position (blank = 0)', input: 'number-or-none' },
  ],
  cases: [
    { id: 'last',      label: 'last match',       values: { string: 'hello', sub: 'l', start: '' } },
    { id: 'many',      label: 'last of many',     values: { string: 'abcabc', sub: 'b', start: '' } },
    { id: 'bounded',   label: 'bounded start',    values: { string: 'abcabc', sub: 'b', start: 2 } },
    { id: 'missing',   label: 'not found raises', values: { string: 'hello', sub: 'z', start: '' } },
    { id: 'empty-sub', label: 'empty substring',  values: { string: 'hello', sub: '', start: '' } },
  ],
  demoExplainer: 'rindex finds the LAST place sub occurs. In "abcabc" the letter b sits at 1 and 4, so rindex returns 4 while index returns 1. Only the search direction is reversed — the number is still an ordinary left-counted index you can slice with directly. Absence raises ValueError, exactly as with index; use rfind if you would rather get -1.',

  patterns: [
    {
      name: 'Split on the last separator',
      desc: 'The classic use — file extensions and dotted paths split at the final dot.',
      code: 'i = name.rindex(".")\nstem, ext = name[:i], name[i + 1:]',
    },
    {
      name: 'Take the final path segment',
      desc: 'Everything after the last slash, with the separator dropped.',
      code: 'leaf = path[path.rindex("/") + 1:]',
    },
    {
      name: 'Require the separator',
      desc: 'When a missing separator means the input is malformed, let it raise.',
      code: 'try:\n    i = ref.rindex(":")\nexcept ValueError:\n    raise ValueError("expected host:port")',
    },
  ],

  examples: [
    { title: 'Last match',       code: "'hello'.rindex('l')",    returns: '3' },
    { title: 'Last of many',     code: "'abcabc'.rindex('b')",   returns: '4' },
    { title: 'index finds first',code: "'abcabc'.index('b')",    returns: '1  # the contrast' },
    { title: 'Missing raises',   code: "'hello'.rindex('z')",    returns: 'ValueError: substring not found' },
    { title: 'Empty substring',  code: "'hello'.rindex('')",     returns: '5' },
    { title: 'rfind returns -1', code: "'hello'.rfind('z')",     returns: '-1  # the alternative' },
  ],

  pitfalls: [
    {
      name: 'The result is not counted from the right',
      desc: 'Only the scan is reversed. People expect a distance from the end, or a negative index, and get an ordinary left-counted position instead.',
      wrong: { label: 'Expected from the end', code: "'hello'.rindex('l')", output: '3  # not 1, and not -2' },
      fix:   { label: 'Convert if you need it', code: "len(s) - s.rindex('l') - 1", output: '1  # distance from the end' },
    },
    {
      name: 'start still means the LEFT boundary',
      desc: 'Even searching backwards, start and end describe the slice s[start:end]. They do not swap roles, so start is not "where to begin scanning from the right".',
      wrong: { label: 'Read as a scan origin', code: "'abcabc'.rindex('b', 2)", output: '4  # searched s[2:], still the last hit' },
      fix:   { label: 'Bound with end instead', code: "'abcabc'.rindex('b', 0, 4)", output: '1' },
    },
    {
      name: 'Raises where rfind returns -1',
      desc: 'Same trap as index versus find. The signatures match, so swapping one for the other looks harmless until a missing substring reaches production.',
      wrong: { label: 'Uncaught', code: "'hello'.rindex('z')", output: 'ValueError: substring not found' },
      fix:   { label: 'rfind for optional', code: "i = 'hello'.rfind('z')\nif i == -1:\n    ...", output: '-1, handled' },
    },
  ],

  when: {
    use: [
      'Splitting on the LAST separator — extensions, paths, host:port',
      'The separator is required and absence is an error',
      'You want the final occurrence and a left-counted index to slice with',
    ],
    avoid: [
      'Absence is expected → rfind, which returns -1',
      'You want the FIRST occurrence → index or find',
      'Splitting a path → os.path or pathlib handles the edge cases for you',
    ],
  },

  notes: {
    complexity: 'O(n * m) worst case — the same algorithm as index, scanning backwards',
    return:     'A non-negative int; never -1, because absence raises instead',
    cpython:    'Objects/stringlib/find.h :: stringlib_rindex',
    memory:     'No allocation — scans in place, no reversed copy is made',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.rfind',   slug: 'str-rfind',  when: 'Same search, but returns -1 instead of raising' },
    { name: 'str.index',   slug: 'str-index',  when: 'Find the FIRST occurrence instead' },
    { name: 'find',        slug: 'find',       when: 'First occurrence, returning -1 on absence' },
    { name: 'str.rpartition', slug: 'str-rpartition', when: 'Split on the last separator in one call, without an index' },
  ],

  faq: [
    {
      q: 'Why is the answer not negative?',
      a: 'Because rindex returns a position, not a distance from the end. Positions in Python strings count from 0 at the left regardless of which direction you searched, which is what makes the result directly usable in a slice.',
      code: "s = 'hello'\ns[:s.rindex('l')]   # 'hel'",
    },
    {
      q: 'Is rpartition better for splitting?',
      a: 'Usually, yes. rpartition("." ) hands back the head, the separator and the tail in one call, and returns empty strings rather than raising when the separator is absent. Reach for rindex when you want the number itself.',
      code: "stem, dot, ext = name.rpartition('.')",
    },
    {
      q: "Why does 'hello'.rindex('') return 5?",
      a: 'The empty string matches at every position, so the LAST such position is the very end — index 5 in a five-character string. index returns 0 for the same reason, being the first such position.',
      code: "'hello'.index('')    # 0\n'hello'.rindex('')   # 5",
    },
  ],

  history: [
    { version: '1.0', note: 'Present since the earliest string methods, alongside rfind.' },
    { version: '2.5', note: 'start and end accepted as None, easing pass-through of optional arguments.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.rindex',
    meta:  'str.rindex',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'Inspect strings before searching them' },
  ],
};
