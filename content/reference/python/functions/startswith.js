// content/reference/python/functions/startswith.js

export const meta = {
  slug:        'startswith',
  name:        'str.startswith',
  signature:   'str.startswith(prefix, start=0, end=len(s))',
  blurb:       'Test whether the string begins with a prefix.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'startswith prefix begins with check test boolean',
};

export const method = {
  slug:      'startswith',
  name:      'str.startswith',
  signature: 'str.startswith(prefix, start=0, end=len(s))',
  returns:   { type: 'bool', desc: 'True when the (optionally sliced) string begins with prefix. Also accepts a tuple of prefixes — True if any matches.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Does the string begin with this prefix? Clearer and safer than slicing.',

  cheat: {
    commonCall: 'url.startswith("https://")',
    returns:    'bool',
    replaces:   'accepts a tuple: s.startswith(("http://", "https://"))',
    watchOut:   'case-sensitive; every string startswith ""',
  },

  parameters: [
    { name: 'prefix', type: 'str | tuple[str]', required: true,  default: null,     desc: 'The prefix to test — or a tuple of prefixes, any of which may match.' },
    { name: 'start',  type: 'int',              required: false, default: '0',      desc: 'Test as if the string began at this index.' },
    { name: 'end',    type: 'int',              required: false, default: 'len(s)', desc: 'Test within the slice ending here (exclusive).' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',  input: 'text' },
    { name: 'prefix', type: 'str', hint: 'the prefix',  input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default',   values: { string: 'https://example.com', prefix: 'https://' } },
    { id: 'no',      label: 'no match',  values: { string: 'http://example.com',  prefix: 'https://' } },
    { id: 'case',    label: 'case',      values: { string: 'Hello',               prefix: 'hello' } },
    { id: 'empty',   label: 'empty prefix', values: { string: 'abc',              prefix: '' } },
  ],
  demoExplainer: 'A straightforward boolean: does the string begin with exactly this prefix? Case matters, and the empty prefix matches everything.',

  patterns: [
    {
      name: 'Protocol / scheme checks',
      desc: 'The tuple form covers alternatives in one call.',
      code: 'if url.startswith(("http://", "https://")):\n    fetch(url)',
    },
    {
      name: 'Skip comment lines',
      desc: 'A classic file-parsing filter.',
      code: 'lines = [ln for ln in f if not ln.startswith("#")]',
    },
    {
      name: 'Dispatch on a command prefix',
      desc: 'Cheap routing before real parsing.',
      code: 'if cmd.startswith("git "):\n    handle_git(cmd)',
    },
  ],

  examples: [
    { title: 'Basic prefix test',        code: '"hello".startswith("he")', returns: 'True' },
    { title: 'No match',                 code: '"hello".startswith("lo")', returns: 'False' },
    { title: 'Tuple of prefixes',        code: '"https://x".startswith(("http://", "https://"))', returns: 'True' },
    { title: 'Empty prefix',             code: '"abc".startswith("")',     returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Case-sensitive',
      desc: 'Normalize first for case-insensitive prefix checks.',
      wrong: { label: 'Misses', code: '"Hello".startswith("hello")', output: 'False' },
      fix:   { label: 'Fix', code: '"Hello".lower().startswith("hello")', output: 'True' },
    },
    {
      name: 'A list of prefixes raises',
      desc: 'The multi-prefix form requires a tuple specifically.',
      wrong: { label: 'Raises', code: 's.startswith(["a", "b"])', output: 'TypeError: startswith first arg must be str or a tuple of str' },
      fix:   { label: 'Fix', code: 's.startswith(("a", "b"))', output: 'works — tuple, not list' },
    },
    {
      name: 'Slicing comparisons are the fragile alternative',
      desc: 's[:8] == "https://" breaks silently if the literal and length drift apart.',
      wrong: { label: 'Fragile', code: 'if s[:7] == "https://":  # length is 8!', output: 'never True' },
      fix:   { label: 'Fix', code: 'if s.startswith("https://"):', output: 'no length to keep in sync' },
    },
  ],

  when: {
    use: [
      'Prefix checks of any kind — clearer than slicing',
      'Several acceptable prefixes → the tuple form',
      'Filtering lines / paths / identifiers by their start',
    ],
    avoid: [
      'Remove the prefix too → str.removeprefix',
      'Pattern anchors → re.match',
      'Suffix instead → str.endswith',
    ],
  },

  notes: {
    complexity: 'O(len(prefix))',
    return:     'bool',
    cpython:    'Objects/unicodeobject.c :: unicode_startswith',
    memory:     'No allocation',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.find',  slug: 'find',  when: 'Position anywhere, not just the start' },
    { name: 'str.strip', slug: 'strip', when: 'Trim before testing' },
    { name: 'str.lower', slug: 'lower', when: 'Case-insensitive prefix checks' },
  ],

  faq: [
    {
      q: 'How do I check a suffix?',
      a: 'str.endswith — identical contract at the other end, including the tuple form.',
      code: 'name.endswith((".jpg", ".png"))',
    },
    {
      q: 'How do I remove the prefix after checking?',
      a: 'Python 3.9+ has removeprefix, which safely no-ops when the prefix is absent.',
      code: 'url.removeprefix("https://")',
    },
    {
      q: 'Why does startswith("") return True?',
      a: 'Every string trivially begins with the empty string — same convention as "" in s.',
    },
  ],

  history: [
    { version: '2.5', note: 'Tuple-of-prefixes form added.' },
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.startswith',
    meta:  'str.startswith',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
