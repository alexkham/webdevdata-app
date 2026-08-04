// content/reference/python/functions/str-partition.js
//
// Slug is type-prefixed: `partition` is a str method (also on bytes).

export const meta = {
  slug:        'str-partition',
  name:        'str.partition',
  signature:   'str.partition(sep)',
  blurb:       'Split at the first occurrence of sep — always into three pieces.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'partition split first occurrence separator triple tuple before after key value',
};

export const method = {
  slug:      'str-partition',
  name:      'str.partition',
  signature: 'str.partition(sep)',
  returns:   { type: 'tuple[str, str, str]', desc: 'Always a 3-tuple (before, sep, after). If sep is not found: (original_string, "", "").' },

  category:    'String method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Split the string at the FIRST occurrence of sep, returning a fixed-shape three-tuple: what came before, the separator itself, and what came after.',

  cheat: {
    commonCall: 'key, _, value = "a=1".partition("=")',
    returns:    '3-tuple, always — sep preserved in the middle',
    replaces:   'the split-then-check-length dance for key/value strings',
    watchOut:   'no match → (original, "", ""); empty sep raises ValueError',
  },

  parameters: [
    { name: 'sep', type: 'str', required: true, default: null, desc: 'Substring to split on. Empty string raises ValueError. First occurrence only.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',   input: 'text' },
    { name: 'sep',    type: 'str', hint: 'the separator', input: 'text' },
  ],
  cases: [
    { id: 'kv',       label: 'key=value',       values: { string: 'user=alice', sep: '=' } },
    { id: 'kv-with', label: 'value contains sep', values: { string: 'query=a=b', sep: '=' } },
    { id: 'missing',  label: 'sep missing',      values: { string: 'no-equals-here', sep: '=' } },
    { id: 'multi',    label: 'multi-char sep',   values: { string: 'a-&gt;b-&gt;c', sep: '-&gt;' } },
    { id: 'at-start', label: 'sep at start',     values: { string: '=alone', sep: '=' } },
    { id: 'empty-sep',label: 'empty sep',        values: { string: 'hello', sep: '' } },
  ],
  demoExplainer: 'partition always returns exactly three strings — no guessing at tuple length. When the separator is not found, before is the entire string and the other two slots are empty; when it IS found, the separator itself is preserved in the middle slot. Splitting a value that contains additional separators only splits at the first — the rest stays in the tail.',

  patterns: [
    {
      name: 'Parse key=value once',
      desc: 'Perfect for lines from a config or query string where the value may itself contain the separator.',
      code: 'key, _, value = line.partition("=")',
    },
    {
      name: 'Optional prefix stripping',
      desc: 'Strip only if present, leave the string alone otherwise — no branch.',
      code: 'before, sep, after = url.partition("://")\nrest = after if sep else before',
    },
    {
      name: 'First-token split',
      desc: 'Head + tail without materializing a full split.',
      code: 'first, _, rest = sentence.partition(" ")',
    },
  ],

  examples: [
    { title: 'Basic key/value',       code: '"user=alice".partition("=")',        returns: '("user", "=", "alice")' },
    { title: 'Multiple separators',   code: '"a=b=c".partition("=")',              returns: '("a", "=", "b=c")' },
    { title: 'Not found',             code: '"hello".partition("=")',              returns: '("hello", "", "")' },
    { title: 'Separator at start',    code: '"=alone".partition("=")',             returns: '("", "=", "alone")' },
    { title: 'Multi-char separator',  code: '"a-&gt;b".partition("-&gt;")',           returns: '("a", "-&gt;", "b")' },
    { title: 'Empty sep raises',      code: '"hello".partition("")',               returns: 'ValueError: empty separator' },
  ],

  pitfalls: [
    {
      name: 'Not-found returns the original — in the FIRST slot',
      desc: 'Newcomers expect (\"\", \"\", original) or an error. It is the other way: before = original, middle and after are empty. Fine once you know it — surprising until then.',
      wrong: { label: 'Wrong unpacking', code: '_, _, value = "no-eq-here".partition("=")\n# value is "" — the data went into slot 0', output: 'value = ""' },
      fix:   { label: 'Check sep',      code: 'before, sep, after = s.partition("=")\nif sep:\n    key, value = before, after', output: 'explicit fallback' },
    },
    {
      name: 'Empty separator raises ValueError',
      desc: 'Unlike split (which errors similarly), partition rejects an empty sep too — there is no sensible three-way split.',
      wrong: { label: 'Runtime error', code: '"hello".partition("")', output: 'ValueError: empty separator' },
      fix:   { label: 'Guard',         code: 'if sep:\n    a, s, b = text.partition(sep)', output: 'no-op when sep is empty' },
    },
    {
      name: 'Splits only at the FIRST occurrence',
      desc: 'The tail keeps any additional separators intact — useful for key=value where the value itself contains `=`, but wrong when you meant a full split.',
      wrong: { label: 'Not a full split', code: '"a=b=c".partition("=")', output: '("a", "=", "b=c")' },
      fix:   { label: 'Use split for all', code: '"a=b=c".split("=")', output: '["a", "b", "c"]' },
    },
  ],

  when: {
    use: [
      'Key-value strings where the value may contain the separator',
      '&quot;Split if present, keep original otherwise&quot; in one call',
      'Head + tail extraction without materializing an N-way split',
      'Getting a fixed-shape return you can always unpack into three names',
    ],
    avoid: [
      'Full N-way split → split',
      'Last-occurrence split → rpartition',
      'Regex-based splits → re.split',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan for the first match',
    return:     'A 3-tuple of strings; identity-shared with the original when the separator is absent',
    cpython:    'Objects/unicodeobject.c :: unicode_partition',
    memory:     'Two new substrings when the separator is found; no allocation otherwise',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'split',         slug: 'split',         when: 'Split into N pieces, not exactly 3' },
    { name: 'startswith',    slug: 'startswith',    when: 'Just checking for a prefix, not extracting' },
    { name: 'find',          slug: 'find',          when: 'Only the index of the separator is needed' },
  ],

  faq: [
    {
      q: 'What is the difference between partition and split?',
      a: 'partition splits at the FIRST occurrence only and always returns three items (before, sep, after). split can split every occurrence and does not preserve the separators. partition is safer for &quot;take one, leave the rest&quot; parsing.',
    },
    {
      q: 'Is there a right-hand version?',
      a: 'Yes — rpartition splits at the LAST occurrence instead, mirror-shape.',
      code: '"a.b.c".rpartition(".")\n# ("a.b", ".", "c")',
    },
    {
      q: 'Why does &quot;no match&quot; put the string in slot 0, not slot 2?',
      a: 'By design, so the &quot;before&quot; slot is always what you started with. Iterating along partition results is symmetric with what you had — including the not-found case.',
    },
  ],

  history: [
    { version: '2.5', note: 'partition() and rpartition() introduced.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.partition',
    meta:  'str.partition',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect key/value data' },
  ],
};