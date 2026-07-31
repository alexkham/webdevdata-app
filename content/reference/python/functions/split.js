// content/reference/python/functions/split.js

export const meta = {
  slug:        'split',
  name:        'str.split',
  signature:   'str.split(sep=None, maxsplit=-1)',
  blurb:       'Break a string into a list of substrings on a delimiter.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'split break tokenize delimiter list',
};

export const method = {
  slug:      'split',
  name:      'str.split',
  signature: 'str.split(sep=None, maxsplit=-1)',
  returns:   { type: 'list[str]', desc: 'A new list of the substrings between separators. The original string is unchanged.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Break the string into a list of substrings on a delimiter — or on any whitespace when no delimiter is given.',

  cheat: {
    commonCall: '"a,b,c".split(",")',
    returns:    'list of str — original unchanged',
    replaces:   'sep=None splits on whitespace runs and drops empties',
    watchOut:   '"a,,b".split(",") keeps the empty piece; split() does not',
  },

  parameters: [
    { name: 'sep',      type: 'str | None', required: false, default: 'None', desc: 'The delimiter. None (the default) means split on runs of whitespace and drop empty strings. An empty string raises ValueError.' },
    { name: 'maxsplit', type: 'int',        required: false, default: '-1',   desc: 'Maximum number of splits. Negative or omitted means no limit; the last list item holds the remainder.' },
  ],

  demoParams: [
    { name: 'string',   type: 'str', hint: 'the source',        input: 'text' },
    { name: 'sep',      type: 'str', hint: 'empty = whitespace', input: 'text-or-none' },
    { name: 'maxsplit', type: 'int', hint: '-1 = no limit',      input: 'number' },
  ],
  cases: [
    { id: 'default',    label: 'default',     values: { string: 'a,b,c',        sep: ',', maxsplit: -1 } },
    { id: 'whitespace', label: 'whitespace',  values: { string: '  one   two ', sep: '',  maxsplit: -1 } },
    { id: 'maxsplit',   label: 'maxsplit=1',  values: { string: 'a,b,c',        sep: ',', maxsplit: 1 } },
    { id: 'empties',    label: 'empty pieces', values: { string: 'a,,b',        sep: ',', maxsplit: -1 } },
    { id: 'notfound',   label: 'not found',   values: { string: 'abc',          sep: '-', maxsplit: -1 } },
  ],
  demoExplainer: 'str.split() returns a new list of substrings. With an explicit sep, adjacent separators produce empty strings. With sep omitted (leave the field empty here), runs of whitespace act as one separator and empty strings are dropped.',

  patterns: [
    {
      name: 'Words from a sentence',
      desc: 'The no-argument form handles any amount of whitespace, including tabs and newlines.',
      code: 'words = "the  quick\\tbrown fox".split()\n# [\'the\', \'quick\', \'brown\', \'fox\']',
    },
    {
      name: 'Key-value pair with maxsplit',
      desc: 'Limit splitting so values containing the delimiter survive intact.',
      code: 'key, value = "PATH=/usr/bin:/bin".split("=", 1)\n# key=\'PATH\', value=\'/usr/bin:/bin\'',
    },
    {
      name: 'CSV line (simple cases)',
      desc: 'Fine for trusted simple data — reach for the csv module when fields can be quoted.',
      code: 'fields = line.split(",")',
    },
  ],

  examples: [
    { title: 'Split on a delimiter',            code: '"a,b,c".split(",")',        returns: "['a', 'b', 'c']" },
    { title: 'Split on whitespace (default)',   code: '"  one   two ".split()',    returns: "['one', 'two']" },
    { title: 'Limit the number of splits',      code: '"a,b,c".split(",", 1)',     returns: "['a', 'b,c']" },
    { title: 'Delimiter not present',           code: '"abc".split("-")',          returns: "['abc']" },
  ],

  pitfalls: [
    {
      name: 'split(",") and split() treat empties differently',
      desc: 'An explicit separator keeps empty pieces between adjacent delimiters; the whitespace form drops them.',
      wrong: { label: 'Surprising', code: '"a,,b".split(",")', output: "['a', '', 'b']" },
      fix:   { label: 'Filter if unwanted', code: '[p for p in s.split(",") if p]', output: "['a', 'b']" },
    },
    {
      name: 'Empty separator raises',
      desc: 'Unlike str.replace, split does not accept an empty sep. Use list(s) to get characters.',
      wrong: { label: 'Raises', code: '"abc".split("")', output: 'ValueError: empty separator' },
      fix:   { label: 'Fix', code: 'list("abc")', output: "['a', 'b', 'c']" },
    },
    {
      name: 'Unpacking can fail on unexpected input',
      desc: 'Tuple-unpacking the result assumes an exact piece count. Cap it with maxsplit.',
      wrong: { label: 'Fragile', code: 'key, value = "a=b=c".split("=")', output: 'ValueError: too many values to unpack' },
      fix:   { label: 'Fix', code: 'key, value = "a=b=c".split("=", 1)', output: "('a', 'b=c')" },
    },
  ],

  when: {
    use: [
      'Tokenizing on a literal delimiter',
      'Whitespace word-splitting — the no-arg form is built for it',
      'Peeling one prefix off with maxsplit=1',
    ],
    avoid: [
      'Pattern-based splitting → re.split',
      'Quoted CSV data → csv module',
      'Only need the two ends → str.partition',
      'Splitting into characters → list(s)',
    ],
  },

  notes: {
    complexity: 'O(n) — single pass over the source',
    return:     'new list[str] — source untouched',
    cpython:    'Objects/unicodeobject.c :: unicode_split',
    memory:     'Allocates the list plus one new str per piece',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.join',    slug: 'join',      when: 'The inverse — glue pieces back together' },
    { name: 'str.replace', slug: 'replace',   when: 'Substitute instead of splitting' },
    { name: 'str.strip',   slug: 'strip',     when: 'Clean ends before splitting' },
    { name: 'str.count',   slug: 'str-count', when: 'Count separators without splitting' },
  ],

  faq: [
    {
      q: 'What is the difference between split() and split(" ")?',
      a: 'split() treats any run of whitespace as one separator and drops empty results; split(" ") splits on every single space, producing empty strings for doubled spaces.',
      code: '"a  b".split()      # [\'a\', \'b\']\n"a  b".split(" ")   # [\'a\', \'\', \'b\']',
    },
    {
      q: 'How do I split from the right?',
      a: 'Use str.rsplit with maxsplit — useful for peeling off a file extension or the last path segment.',
      code: '"a.b.c".rsplit(".", 1)  # [\'a.b\', \'c\']',
    },
    {
      q: 'Can I split on multiple delimiters at once?',
      a: 'Not with str.split. Use re.split with a character class.',
      code: 'import re\nre.split(r"[,;]", "a,b;c")  # [\'a\', \'b\', \'c\']',
    },
    {
      q: 'Does split modify the original string?',
      a: 'No. Strings are immutable; split returns a new list of new strings.',
    },
  ],

  history: [
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.split',
    meta:  'str.split',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
