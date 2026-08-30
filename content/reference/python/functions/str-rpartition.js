// content/reference/python/functions/str-rpartition.js
//
// Slug is type-prefixed: `rpartition` is a str method (also on bytes).

export const meta = {
  slug:        'str-rpartition',
  name:        'str.rpartition',
  signature:   'str.rpartition(sep)',
  blurb:       'Split at the LAST occurrence of sep — always into three pieces.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'rpartition split last occurrence separator triple tuple before after file extension right',
};

export const method = {
  slug:      'str-rpartition',
  name:      'str.rpartition',
  signature: 'str.rpartition(sep)',
  returns:   { type: 'tuple[str, str, str]', desc: 'Always a 3-tuple (before, sep, after). If sep is not found: ("", "", original_string) — note the original is in slot 2, unlike partition where it lands in slot 0.' },

  category:    'String method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Split the string at the LAST occurrence of sep, returning a fixed-shape three-tuple. The mirror of str.partition.',

  cheat: {
    commonCall: 'name, _, ext = "archive.tar.gz".rpartition(".")',
    returns:    '3-tuple, always — sep preserved in the middle',
    replaces:   'the rfind + slice + guard pattern for \"split at last delimiter\"',
    watchOut:   'not-found puts the original in slot 2 (not slot 0 like partition!); empty sep raises ValueError',
  },

  parameters: [
    { name: 'sep', type: 'str', required: true, default: null, desc: 'Substring to split on. Empty string raises ValueError. Last occurrence only.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',   input: 'text' },
    { name: 'sep',    type: 'str', hint: 'the separator', input: 'text' },
  ],
  cases: [
    { id: 'last-dot',   label: 'last dot',        values: { string: 'archive.tar.gz', sep: '.' } },
    { id: 'kv',         label: 'key=value',       values: { string: 'user=alice',     sep: '=' } },
    { id: 'kv-eq',      label: 'value has sep',   values: { string: 'query=a=b',      sep: '=' } },
    { id: 'missing',    label: 'sep missing',     values: { string: 'no-dot-here',    sep: '.' } },
    { id: 'multi',      label: 'multi-char sep',  values: { string: 'a->b->c',   sep: '->' } },
    { id: 'at-end',     label: 'sep at end',      values: { string: 'trail=',         sep: '=' } },
    { id: 'empty-sep',  label: 'empty sep',       values: { string: 'hello',          sep: '' } },
  ],
  demoExplainer: 'rpartition splits at the LAST occurrence of sep — the mirror of partition. Always returns exactly three strings. When the separator is not found, the \"original\" slot moves: partition puts it at index 0, rpartition puts it at index 2. That asymmetry matches the direction each method scans from.',

  patterns: [
    {
      name: 'File name + extension',
      desc: 'The last dot separates the base name from the extension.',
      code: 'stem, _, ext = filename.rpartition(".")',
    },
    {
      name: 'Directory + basename',
      desc: 'Split a path at its last slash.',
      code: 'dir_, _, base = path.rpartition("/")',
    },
    {
      name: 'Optional suffix strip',
      desc: 'Strip only if present, leave the string alone otherwise — no branch.',
      code: 'head, sep, tail = s.rpartition(":")\ntag = tail if sep else "default"',
    },
  ],

  examples: [
    { title: 'Last dot',              code: '"archive.tar.gz".rpartition(".")',   returns: '("archive.tar", ".", "gz")' },
    { title: 'Key=value (only one)',  code: '"user=alice".rpartition("=")',       returns: '("user", "=", "alice")' },
    { title: 'Last of many',          code: '"a=b=c".rpartition("=")',            returns: '("a=b", "=", "c")' },
    { title: 'Not found → slot 2',    code: '"hello".rpartition(".")',            returns: '("", "", "hello")' },
    { title: 'Separator at end',      code: '"trail=".rpartition("=")',           returns: '("trail", "=", "")' },
    { title: 'Multi-char separator',  code: '"a->b".rpartition("->")',      returns: '("a", "->", "b")' },
    { title: 'Empty sep raises',      code: '"hello".rpartition("")',             returns: 'ValueError: empty separator' },
  ],

  pitfalls: [
    {
      name: 'Not-found puts the original in slot 2 — the OPPOSITE of partition',
      desc: 'partition and rpartition both return 3-tuples with the original when nothing matches, but they put it in different slots. Wired backwards, an rpartition user reading the \"before\" slot will always get an empty string on misses.',
      wrong: { label: 'Wrong slot', code: 'before, _, _ = "hello".rpartition("=")\n# before is ""', output: 'before = ""' },
      fix:   { label: 'Check sep',  code: 'before, sep, after = s.rpartition("=")\nvalue = after if sep else before', output: 'explicit fallback' },
    },
    {
      name: 'Splits only at the LAST occurrence',
      desc: 'Everything before the last sep stays in the head slot — useful when the value comes at the end, wrong when you meant to split every occurrence.',
      wrong: { label: 'Not a full split', code: '"a=b=c".rpartition("=")', output: '("a=b", "=", "c")' },
      fix:   { label: 'Use split for all', code: '"a=b=c".split("=")', output: '["a", "b", "c"]' },
    },
    {
      name: 'Empty separator raises ValueError',
      desc: 'Same rule as partition — no sensible three-way split of an empty separator.',
      wrong: { label: 'Runtime error', code: '"hello".rpartition("")', output: 'ValueError: empty separator' },
      fix:   { label: 'Guard',         code: 'if sep:\n    a, s, b = text.rpartition(sep)', output: 'no-op when sep is empty' },
    },
    {
      name: 'Splitting a filename with rpartition eats the dot',
      desc: 'rpartition returns (stem, sep, ext) — the extension is WITHOUT the leading dot. If you need \".gz\" not \"gz\", add it back.',
      wrong: { label: 'No leading dot', code: '"a.tar.gz".rpartition(".")[2]', output: '"gz"  # no leading "."' },
      fix:   { label: 'Rebuild',        code: 'stem, sep, ext = s.rpartition(".")\nfull_ext = sep + ext  # ".gz"', output: '".gz"' },
    },
  ],

  when: {
    use: [
      'Splitting a filename at its final dot',
      'Extracting basename from a path (rpartition("/") or ("\\\\"))',
      '\"Take the tail\" parsing where the delimiter may appear multiple times',
      'Getting a fixed-shape return you can always unpack into three names',
    ],
    avoid: [
      'Full N-way split → split',
      'First-occurrence split → partition',
      'Regex-based splits → re.split',
      'Filename splits where you care about ".tar.gz" as a compound → use pathlib\'s suffixes',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan for the last match',
    return:     'A 3-tuple of strings',
    cpython:    'Objects/unicodeobject.c :: unicode_rpartition',
    memory:     'Two new substrings when the separator is found; no allocation otherwise',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.partition', slug: 'str-partition', when: 'Split at the FIRST occurrence — mirror direction' },
    { name: 'str.rfind',     slug: 'str-rfind',     when: 'Only the position of the last separator is needed' },
    { name: 'split',         slug: 'split',         when: 'Split every occurrence, not just one' },
    { name: 'endswith',      slug: 'endswith',      when: 'Just checking for a suffix, not extracting' },
  ],

  faq: [
    {
      q: 'What is the difference between partition and rpartition?',
      a: 'They scan from opposite directions. partition splits at the FIRST occurrence and puts the original in slot 0 when missing. rpartition splits at the LAST occurrence and puts the original in slot 2 when missing. Pick based on where the delimiter of interest sits.',
    },
    {
      q: 'Why does rpartition put the original in the LAST slot on a miss?',
      a: 'By design, so the \"after\" slot is always what would follow the separator — including the not-found case where the entire input is \"after\" a hypothetical separator at position 0.',
    },
    {
      q: 'Which is faster, rpartition or rfind + slicing?',
      a: 'About the same. rpartition scans once and packages the pieces; rfind + slice scans once and builds two slices. Prefer rpartition for readability — the intent is clearer.',
    },
  ],

  history: [
    { version: '2.5', note: 'partition() and rpartition() introduced together.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.rpartition',
    meta:  'str.rpartition',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};