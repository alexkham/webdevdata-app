// content/reference/python/functions/str-isspace.js
//
// Slug is type-prefixed: `isspace` is a str method (also on bytes).

export const meta = {
  slug:        'str-isspace',
  name:        'str.isspace',
  signature:   'str.isspace()',
  blurb:       'True if every character is whitespace and the string is non-empty.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'isspace whitespace check tab newline space empty blank unicode nbsp',
};

export const method = {
  slug:      'str-isspace',
  name:      'str.isspace',
  signature: 'str.isspace()',
  returns:   { type: 'bool', desc: 'True if every character in the string is Unicode whitespace AND the string is non-empty. False otherwise — including for the empty string.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Check whether a string consists entirely of whitespace — Unicode-aware, and False on empty.',

  cheat: {
    commonCall: 'if line.isspace():',
    returns:    'True or False',
    replaces:   'a manual `if not ch.isspace(): return False` loop',
    watchOut:   'empty string → False; non-breaking space DOES count; zero-width chars do NOT',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'spaces',    label: 'plain spaces',    values: { string: '   ' } },
    { id: 'tab',       label: 'tabs',            values: { string: '\t\t' } },
    { id: 'newline',   label: 'newlines',        values: { string: '\n\n' } },
    { id: 'mixed-ws',  label: 'mixed whitespace',values: { string: ' \t\n ' } },
    { id: 'has-text',  label: 'has a letter',    values: { string: '  x  ' } },
    { id: 'empty',     label: 'empty',           values: { string: '' } },
    { id: 'nbsp',      label: 'non-breaking',    values: { string: '\u00a0\u00a0' } },
  ],
  demoExplainer: 'isspace() returns True when EVERY character is Unicode whitespace AND the string is non-empty. That includes tabs, newlines, carriage returns, form feeds, non-breaking space (U+00A0), and various exotic Unicode spaces. It does NOT include zero-width joiners or other invisible-but-non-space characters. The empty string returns False by convention.',

  patterns: [
    {
      name: 'Blank-line detection',
      desc: 'Simpler than stripping and comparing to empty — and more explicit.',
      code: 'if line.isspace():\n    skip_blank_line()',
    },
    {
      name: 'Guard against blank input',
      desc: 'Empty AND all-whitespace both signal &quot;nothing meaningful&quot;.',
      code: 'if not text or text.isspace():\n    return None',
    },
    {
      name: 'Preserve intentional blanks',
      desc: 'Distinguish &quot;blank line&quot; from &quot;end of input&quot; when parsing.',
      code: 'for line in lines:\n    if line.isspace():\n        emit("blank")\n    elif not line:\n        break\n    else:\n        emit(line.strip())',
    },
  ],

  examples: [
    { title: 'Plain spaces',        code: '"   ".isspace()',        returns: 'True' },
    { title: 'Tabs and newlines',   code: '"\\t\\n".isspace()',     returns: 'True' },
    { title: 'Contains a letter',   code: '"  x  ".isspace()',      returns: 'False' },
    { title: 'Empty is False',      code: '"".isspace()',           returns: 'False' },
    { title: 'Non-breaking space',  code: '"\\u00a0".isspace()',     returns: 'True' },
    { title: 'Zero-width joiner',   code: '"\\u200d".isspace()',     returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Empty string returns False, not True',
      desc: 'Same rule as isalpha, isdigit, isalnum — the empty case is False by convention. isspace requires at least one character.',
      wrong: { label: 'Wrong expectation', code: '"".isspace()', output: 'False' },
      fix:   { label: 'Combined check',     code: 'not s or s.isspace()', output: 'covers both blank and empty' },
    },
    {
      name: 'Non-breaking space DOES count as whitespace',
      desc: 'U+00A0 (from HTML `&amp;nbsp;` or Word processors) is Unicode whitespace, so isspace returns True on it. This surprises anyone who thinks &quot;only these characters look like spaces&quot;.',
      wrong: { label: 'Passes silently', code: '"\\u00a0".isspace()', output: 'True' },
      fix:   { label: 'Explicit filter',   code: 'if s and all(c in " \\t\\n\\r" for c in s):\n    ...', output: 'ASCII whitespace only' },
    },
    {
      name: 'Zero-width chars are NOT whitespace',
      desc: 'Zero-width joiner (U+200D), zero-width space (U+200B), and byte-order mark (U+FEFF) are invisible but not Unicode whitespace. isspace returns False on them.',
      wrong: { label: 'Invisible non-space', code: '"\\u200b".isspace()', output: 'False  # zero-width space is NOT whitespace category' },
      fix:   { label: 'Explicit strip',       code: 'import unicodedata\ns_clean = "".join(c for c in s if unicodedata.category(c) != "Cf")', output: 'strip format characters' },
    },
    {
      name: 'A single visible character mixed in flips the result',
      desc: 'One non-whitespace character makes the whole string non-whitespace. There is no &quot;mostly whitespace&quot; middle ground.',
      wrong: { label: 'Assumed True', code: '"  x  ".isspace()', output: 'False' },
      fix:   { label: 'Strip and re-check', code: 's.strip() == ""', output: 'True when only whitespace present' },
    },
  ],

  when: {
    use: [
      'Detecting blank lines in text processing pipelines',
      'Guarding against &quot;whitespace only&quot; user input',
      'Preserving the distinction between blank lines and empty input',
      'Combined with startswith / endswith for indentation checks',
    ],
    avoid: [
      'Empty-OR-whitespace check → `not s or s.isspace()`',
      'ASCII-only whitespace → explicit character check',
      'Stripping whitespace → str.strip / lstrip / rstrip',
      'Splitting on whitespace → str.split() (default handles this)',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_isspace',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'strip',       slug: 'strip',       when: 'Remove whitespace rather than check for it' },
    { name: 'rstrip',      slug: 'rstrip',      when: 'Trim from the right side only' },
    { name: 'split',       slug: 'split',       when: 'Split on whitespace — default behavior' },
    { name: 'str.isalpha', slug: 'str-isalpha', when: 'Same-shape letter check' },
  ],

  faq: [
    {
      q: 'What counts as whitespace?',
      a: 'Any character Unicode classifies with the White_Space property — spaces, tabs, newlines, carriage returns, form feeds, vertical tabs, non-breaking space, and a handful of exotic Unicode spaces. Zero-width and format characters do NOT count.',
    },
    {
      q: 'Why does &quot;&quot;.isspace() return False?',
      a: 'Python defines the empty case as False across the is* family — isspace requires at least one character. Use `not s or s.isspace()` for &quot;empty OR whitespace&quot;.',
    },
    {
      q: 'Does isspace recognize non-breaking space?',
      a: 'Yes. U+00A0 (non-breaking space) is Unicode whitespace, so isspace returns True on it. If you want ASCII whitespace only, filter explicitly with `c in " \\t\\n\\r"`.',
    },
  ],

  history: [
    { version: '1.0', note: 'isspace() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — accepts every character Unicode classifies as whitespace.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isspace',
    meta:  'str.isspace',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};