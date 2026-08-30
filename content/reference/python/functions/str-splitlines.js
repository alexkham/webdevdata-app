// content/reference/python/functions/str-splitlines.js
//
// Slug is type-prefixed: `splitlines` is a str method (also on bytes).

export const meta = {
  slug:        'str-splitlines',
  name:        'str.splitlines',
  signature:   'str.splitlines(keepends=False)',
  blurb:       'Split at universal newlines — no trailing empty string.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'splitlines split newline crlf lines universal keepends line breaks text file',
};

export const method = {
  slug:      'str-splitlines',
  name:      'str.splitlines',
  signature: 'str.splitlines(keepends=False)',
  returns:   { type: 'list[str]', desc: 'A list of the lines. Line terminators are stripped by default; keepends=True keeps them attached. A trailing newline does NOT produce a final empty string.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Split a string into lines using universal newlines — the safer, cross-platform alternative to split("\\n").',

  cheat: {
    commonCall: 'for line in text.splitlines():',
    returns:    'a list of lines; no empty tail even if text ends with a newline',
    replaces:   'the split("\\n") pattern that leaves a stray empty string at the end',
    watchOut:   'universal newlines — recognizes \\n, \\r, \\r\\n, plus rare separators',
  },

  parameters: [
    { name: 'keepends', type: 'bool', required: false, default: 'False', desc: 'If True, keep the line terminator on each line. Useful for round-tripping — "".join(text.splitlines(True)) equals text.' },
  ],

  demoParams: [
    { name: 'string',   type: 'str', hint: 'the source', input: 'text' },
    { name: 'keepends', type: 'int', hint: '1 = keep terminators, empty = strip', input: 'number-or-none' },
  ],
  cases: [
    { id: 'basic',       label: 'lines',            values: { string: 'ab\ncd\nef',   keepends: '' } },
    { id: 'trailing',    label: 'trailing newline', values: { string: 'ab\ncd\n',     keepends: '' } },
    { id: 'crlf',        label: 'CRLF',             values: { string: 'ab\r\ncd\r\nef', keepends: '' } },
    { id: 'mixed',       label: 'mixed endings',    values: { string: 'a\nb\r\nc\rd', keepends: '' } },
    { id: 'keepends',    label: 'keep terminators', values: { string: 'ab\ncd\nef',   keepends: 1 } },
    { id: 'empty',       label: 'empty',            values: { string: '',                keepends: '' } },
    { id: 'one-line',    label: 'no newline',       values: { string: 'hello',           keepends: '' } },
  ],
  demoExplainer: 'splitlines recognizes many line separators — \\n, \\r, \\r\\n, plus rarer ones like \\x0b, \\x0c, \\x1c, \\x1d, \\x1e, \\x85, \\u2028, \\u2029. Unlike split("\\n"), a trailing newline does NOT produce a final empty string. When keepends=True, each line keeps the terminator that ended it — round-trippable back to the original.',

  patterns: [
    {
      name: 'Iterate lines from any text',
      desc: 'The safe way to walk lines regardless of the source\'s line-ending convention.',
      code: 'for line in text.splitlines():\n    process(line)',
    },
    {
      name: 'Round-trip preserving terminators',
      desc: 'keepends=True keeps each line ending — useful for filtering without changing separators.',
      code: 'kept = [ln for ln in text.splitlines(True) if not ln.startswith("#")]\nfiltered = "".join(kept)',
    },
    {
      name: 'Normalize line endings',
      desc: 'Split any convention, re-join with a single one.',
      code: 'normalized = "\\n".join(text.splitlines())',
    },
  ],

  examples: [
    { title: 'Basic',                 code: '"ab\\ncd\\nef".splitlines()',              returns: '["ab", "cd", "ef"]' },
    { title: 'Trailing newline',      code: '"ab\\ncd\\n".splitlines()',                 returns: '["ab", "cd"]  # no empty tail!' },
    { title: 'CRLF handled',          code: '"ab\\r\\ncd".splitlines()',                 returns: '["ab", "cd"]' },
    { title: 'Keep the terminators', code: '"ab\\ncd\\n".splitlines(True)',              returns: '["ab\\n", "cd\\n"]' },
    { title: 'Empty is empty',        code: '"".splitlines()',                            returns: '[]' },
    { title: 'No newline still gives one', code: '"hello".splitlines()',                    returns: '["hello"]' },
  ],

  pitfalls: [
    {
      name: 'Different from split("\\n") — no empty tail',
      desc: 'split leaves an empty string after a trailing newline; splitlines does not. When reading files this is almost always what you want.',
      wrong: { label: 'Empty at end', code: '"a\\nb\\n".split("\\n")', output: '["a", "b", ""]' },
      fix:   { label: 'Clean list',   code: '"a\\nb\\n".splitlines()', output: '["a", "b"]' },
    },
    {
      name: 'Recognizes MORE than \\n and \\r\\n',
      desc: 'Universal newlines includes some obscure separators (\\v, \\f, \\x1c-\\x1e, U+0085, U+2028, U+2029). If your text contains those characters as data, they will be misidentified as line breaks.',
      wrong: { label: 'Unexpected split', code: '"ab\\vcd".splitlines()', output: '["ab", "cd"]  # \\v splits!' },
      fix:   { label: 'Explicit split',   code: '"ab\\vcd".split("\\n")', output: '["ab\\vcd"]' },
    },
    {
      name: '\\r\\n is one separator, not two',
      desc: 'splitlines treats \\r\\n as a single line ending — no phantom empty lines on Windows-style text.',
      wrong: { label: 'Wrong via split', code: '"a\\r\\nb".split("\\n")', output: '["a\\r", "b"]  # stray \\r attached' },
      fix:   { label: 'Right via splitlines', code: '"a\\r\\nb".splitlines()', output: '["a", "b"]' },
    },
    {
      name: 'keepends round-trip needs join(""), not join("\\n")',
      desc: 'With keepends=True each line already carries its terminator; joining with "\\n" adds a second one.',
      wrong: { label: 'Doubled', code: '"\\n".join("a\\nb\\n".splitlines(True))', output: '"a\\n\\nb\\n"  # extra blank line' },
      fix:   { label: 'Empty join', code: '"".join("a\\nb\\n".splitlines(True))', output: '"a\\nb\\n"' },
    },
  ],

  when: {
    use: [
      'Reading lines from files or network text',
      'Any text where line endings might vary',
      'Round-trip-safe filtering (with keepends=True)',
      'Normalizing mixed line endings',
    ],
    avoid: [
      'You need the trailing empty string as a signal → split("\\n")',
      'You want to split on a DIFFERENT delimiter → split(delim)',
      'You have obscure control characters as data → split("\\n") is safer',
      'Streaming very large text without loading all of it → iterate the file object',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'A new list of strings',
    cpython:    'Objects/unicodeobject.c :: unicode_splitlines',
    memory:     'One list plus one substring per line',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'split',        slug: 'split',        when: 'Split by an arbitrary delimiter, not just line endings' },
    { name: 'join',         slug: 'join',         when: 'Reassemble the lines afterward' },
    { name: 'str.partition',slug: 'str-partition',when: 'Split just at the first occurrence' },
    { name: 'endswith',     slug: 'endswith',     when: 'Test a single line\'s trailing content' },
  ],

  faq: [
    {
      q: 'Why does splitlines drop the trailing empty string?',
      a: 'It treats a terminal line break as the terminator of the last line, not the start of a new empty line — matching how humans read text files. split("\\n") does the opposite: any newline creates a boundary, so a trailing one leaves an empty tail.',
    },
    {
      q: 'How do I round-trip a text file with splitlines?',
      a: 'Use keepends=True and join with "".',
      code: 'text == "".join(text.splitlines(True))\n# True for any text',
    },
    {
      q: 'What is the full list of universal newlines?',
      a: '\\n, \\r, \\r\\n, \\v (\\x0b), \\f (\\x0c), \\x1c, \\x1d, \\x1e, \\x85 (NEL), \\u2028 (line sep), \\u2029 (paragraph sep). The docs call this \"universal newlines\".',
    },
  ],

  history: [
    { version: '2.0', note: 'splitlines() introduced.' },
    { version: '3.0', note: 'Recognizes Unicode line separators U+2028 and U+2029 in addition to ASCII forms.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.splitlines',
    meta:  'str.splitlines',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect line-oriented data' },
  ],
};