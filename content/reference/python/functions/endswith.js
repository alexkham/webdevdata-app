// content/reference/python/functions/endswith.js

export const meta = {
  slug:        'endswith',
  name:        'str.endswith',
  signature:   'str.endswith(suffix, start=0, end=len(s))',
  blurb:       'Test whether the string ends with a suffix.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'endswith suffix extension ends with check boolean',
};

export const method = {
  slug:      'endswith',
  name:      'str.endswith',
  signature: 'str.endswith(suffix, start=0, end=len(s))',
  returns:   { type: 'bool', desc: 'True when the (optionally sliced) string ends with suffix. Also accepts a tuple of suffixes — True if any matches.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Does the string end with this suffix? The file-extension check, done right.',

  cheat: {
    commonCall: 'name.endswith(".py")',
    returns:    'bool',
    replaces:   'accepts a tuple: name.endswith((".jpg", ".png"))',
    watchOut:   'case-sensitive — ".JPG" is not ".jpg"',
  },

  parameters: [
    { name: 'suffix', type: 'str | tuple[str]', required: true,  default: null,     desc: 'The suffix to test — or a tuple of suffixes, any of which may match.' },
    { name: 'start',  type: 'int',              required: false, default: '0',      desc: 'Test within the slice starting here.' },
    { name: 'end',    type: 'int',              required: false, default: 'len(s)', desc: 'Test as if the string ended here (exclusive).' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
    { name: 'suffix', type: 'str', hint: 'the suffix', input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default',  values: { string: 'report.pdf', suffix: '.pdf' } },
    { id: 'no',      label: 'no match', values: { string: 'report.pdf', suffix: '.doc' } },
    { id: 'case',    label: 'case',     values: { string: 'IMG.JPG',    suffix: '.jpg' } },
    { id: 'empty',   label: 'empty suffix', values: { string: 'abc',    suffix: '' } },
  ],
  demoExplainer: 'The mirror of startswith: an exact, case-sensitive check at the end of the string. The empty suffix matches everything.',

  patterns: [
    {
      name: 'File-extension filter',
      desc: 'The tuple form covers several extensions in one call.',
      code: 'images = [f for f in files\n          if f.lower().endswith((".jpg", ".png", ".gif"))]',
    },
    {
      name: 'Trailing punctuation checks',
      desc: 'Normalize sentence ends before further processing.',
      code: 'if not line.endswith("."):\n    line += "."',
    },
  ],

  examples: [
    { title: 'Basic suffix test',   code: '"report.pdf".endswith(".pdf")', returns: 'True' },
    { title: 'No match',            code: '"report.pdf".endswith(".doc")', returns: 'False' },
    { title: 'Tuple of suffixes',   code: '"photo.png".endswith((".jpg", ".png"))', returns: 'True' },
    { title: 'Empty suffix',        code: '"abc".endswith("")',            returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Case-sensitive',
      desc: 'Real-world filenames mix cases — normalize first.',
      wrong: { label: 'Misses', code: '"IMG.JPG".endswith(".jpg")', output: 'False' },
      fix:   { label: 'Fix', code: '"IMG.JPG".lower().endswith(".jpg")', output: 'True' },
    },
    {
      name: 'A list of suffixes raises',
      desc: 'The multi-suffix form requires a tuple specifically.',
      wrong: { label: 'Raises', code: 'f.endswith([".jpg", ".png"])', output: 'TypeError: endswith first arg must be str or a tuple of str' },
      fix:   { label: 'Fix', code: 'f.endswith((".jpg", ".png"))', output: 'works — tuple, not list' },
    },
  ],

  when: {
    use: [
      'File-extension checks',
      'Any suffix test — clearer than s[-n:] slicing',
      'Several acceptable suffixes → the tuple form',
    ],
    avoid: [
      'Remove the suffix too → str.removesuffix',
      'Real path handling → pathlib.Path.suffix',
      'Prefix instead → str.startswith',
    ],
  },

  notes: {
    complexity: 'O(len(suffix))',
    return:     'bool',
    cpython:    'Objects/unicodeobject.c :: unicode_endswith',
    memory:     'No allocation',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.startswith', slug: 'startswith', when: 'The other end' },
    { name: 'str.rstrip',     slug: 'rstrip',     when: 'Trim trailing characters' },
    { name: 'str.lower',      slug: 'lower',      when: 'Case-insensitive suffix checks' },
  ],

  faq: [
    {
      q: 'How do I get the extension itself?',
      a: 'For real paths use pathlib; for quick string work, rsplit or rfind.',
      code: 'from pathlib import Path\nPath("a/report.pdf").suffix  # \'.pdf\'',
    },
    {
      q: 'How do I remove the suffix after checking?',
      a: 'Python 3.9+ has removesuffix, which no-ops when absent.',
      code: 'name.removesuffix(".pdf")',
    },
  ],

  history: [
    { version: '2.5', note: 'Tuple-of-suffixes form added.' },
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.endswith',
    meta:  'str.endswith',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
