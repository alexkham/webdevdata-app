// content/reference/python/stdlib/re/flags.js

export const meta = {
  slug:        'flags',
  name:        're.RegexFlag',
  signature:   're.IGNORECASE | re.MULTILINE | re.DOTALL | re.VERBOSE | re.ASCII | re.UNICODE | re.LOCALE | re.NOFLAG',
  blurb:       'The re flags — IGNORECASE (I), MULTILINE (M), DOTALL (S), VERBOSE (X), ASCII (A), UNICODE (U), LOCALE (L), NOFLAG — what each changes, how to combine them, and their inline (?imsx) forms.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.6+ (RegexFlag)',
  searchTerms: 're flags RegexFlag IGNORECASE I MULTILINE M DOTALL S VERBOSE X ASCII A UNICODE U LOCALE L NOFLAG re.I re.M re.S re.X re.A re.U re.L case insensitive multiline dot matches newline inline flags (?i) (?m) (?s) (?x) combine flags',
};

export const method = {
  slug:      'flags',
  name:      're.RegexFlag',
  signature: 're.IGNORECASE | re.MULTILINE | re.DOTALL | re.VERBOSE | re.ASCII | re.UNICODE | re.LOCALE | re.NOFLAG',
  returns:   { type: 're.RegexFlag', desc: 'An enum.IntFlag; combine members with | and pass them as flags= (or put (?imsxa) at the start of the pattern).' },

  category:    're constants',
  version:     'Python 3.6+ (RegexFlag)',
  hasLiveDemo: true,

  subtitle: 'Five flags cover almost everything: I ignores case, M makes ^ and $ work per line, S lets . match newlines, X allows whitespace and comments, A restricts \\w \\d \\s to ASCII. Each has a one-letter alias and an inline form.',

  covers: ['A', 'I', 'L', 'M', 'S', 'X', 'U', 'ASCII', 'IGNORECASE', 'LOCALE', 'MULTILINE', 'DOTALL', 'VERBOSE', 'UNICODE', 'NOFLAG', 'RegexFlag'],

  cheat: {
    commonCall: "re.findall(r'^\\w+', text, flags=re.I | re.M)",
    returns:    're.IGNORECASE|re.MULTILINE — flags combine with |',
    replaces:   'lowercasing the text first, splitting into lines first',
    watchOut:   'Pass flags by keyword to sub/split: the 4th positional argument of re.sub is count, not flags',
  },

  parameters: [
    { name: 're.I / re.IGNORECASE', type: 'RegexFlag = 2',   required: false, default: null, desc: 'Case-insensitive matching (Unicode case folding for str patterns). Inline: (?i).' },
    { name: 're.M / re.MULTILINE',  type: 'RegexFlag = 8',   required: false, default: null, desc: '^ and $ also match at the start/end of every line. Inline: (?m).' },
    { name: 're.S / re.DOTALL',     type: 'RegexFlag = 16',  required: false, default: null, desc: '. also matches a newline. Inline: (?s).' },
    { name: 're.X / re.VERBOSE',    type: 'RegexFlag = 64',  required: false, default: null, desc: 'Whitespace in the pattern is ignored and # starts a comment (except inside [...] or when escaped). Inline: (?x).' },
    { name: 're.A / re.ASCII',      type: 'RegexFlag = 256', required: false, default: null, desc: '\\w \\W \\b \\B \\d \\D \\s \\S and case-insensitivity use ASCII only. Inline: (?a).' },
    { name: 're.U / re.UNICODE',    type: 'RegexFlag = 32',  required: false, default: null, desc: 'The default for str patterns; kept for compatibility. Incompatible with re.ASCII.' },
    { name: 're.L / re.LOCALE',     type: 'RegexFlag = 4',   required: false, default: null, desc: 'Locale-dependent matching — bytes patterns only; a ValueError with str.' },
    { name: 're.NOFLAG',            type: 'RegexFlag = 0',   required: false, default: null, desc: 'No flags (3.11+) — a readable default for code that adds flags conditionally.' },
  ],

  modes: [
    {
      id: 'ignorecase',
      label: 'IGNORECASE',
      blurb: 'Without and with re.IGNORECASE.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
      ],
      template: 'import re\n(re.findall({$pattern}, {$text}), re.findall({$pattern}, {$text}, re.IGNORECASE))',
      cases: [
        { id: 'word',  label: 'any case',    values: { pattern: 'python', text: 'Python PYTHON python' } },
        { id: 'uni',   label: 'Unicode',     values: { pattern: 'straße|ω', text: 'STRAßE Ω' } },
        { id: 'class', label: 'in a class',  values: { pattern: '[a-c]+', text: 'ABC abc' } },
      ],
    },
    {
      id: 'multiline',
      label: 'MULTILINE',
      blurb: '^ and $ per line instead of per string.',
      params: [
        { name: 'pattern', type: 'str', hint: 'use ^ or $', input: 'text' },
        { name: 'text',    type: 'str', hint: 'several lines', input: 'text' },
      ],
      template: 'import re\n(re.findall({$pattern}, {$text}), re.findall({$pattern}, {$text}, re.MULTILINE))',
      cases: [
        { id: 'starts', label: 'line starts', values: { pattern: '^\\w+', text: 'one fish\ntwo fish\nred fish' } },
        { id: 'ends',   label: 'line ends',   values: { pattern: '\\w+$', text: 'one fish\ntwo fish\nred fish' } },
      ],
    },
    {
      id: 'dotall',
      label: 'DOTALL',
      blurb: 'Whether . may cross a newline.',
      params: [
        { name: 'pattern', type: 'str', hint: 'use .', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text with newlines', input: 'text' },
      ],
      template: 'import re\n(re.findall({$pattern}, {$text}), re.findall({$pattern}, {$text}, re.DOTALL))',
      cases: [
        { id: 'block', label: 'a block', values: { pattern: '<p>(.*?)</p>', text: '<p>one</p><p>two\nlines</p>' } },
        { id: 'any',   label: 'dot run', values: { pattern: 'a.+', text: 'ab\ncd' } },
      ],
    },
    {
      id: 'verbose',
      label: 'VERBOSE',
      blurb: 'With re.VERBOSE the spaces in the pattern are layout, not characters to match.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a spaced-out pattern', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
      ],
      template: 'import re\n(re.findall({$pattern}, {$text}), re.findall({$pattern}, {$text}, re.VERBOSE))',
      cases: [
        { id: 'phone', label: 'spaced pattern', values: { pattern: '\\d{3} - \\d{4}', text: 'call 555-1234 or 555 - 9876' } },
        { id: 'space', label: 'escaped space',  values: { pattern: 'New\\ York | Paris', text: 'New York, Paris' } },
      ],
    },
    {
      id: 'ascii',
      label: 'ASCII',
      blurb: 'Unicode-aware \\w \\d (default) versus ASCII-only.',
      params: [
        { name: 'pattern', type: 'str', hint: 'use \\w, \\d or \\s', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text with non-ASCII', input: 'text' },
      ],
      template: 'import re\n(re.findall({$pattern}, {$text}), re.findall({$pattern}, {$text}, re.ASCII))',
      cases: [
        { id: 'words',  label: 'accented words', values: { pattern: '\\w+', text: 'café naïve Zürich' } },
        { id: 'digits', label: 'other digits',   values: { pattern: '\\d+', text: 'price ٣٥ or 35' } },
      ],
    },
  ],
  demoExplainer: "IGNORECASE uses Unicode case rules for str patterns, so straße matches STRAßE and ω matches Ω. MULTILINE only changes ^ and $; DOTALL only changes the dot — they are independent and are often used together. In VERBOSE mode a literal space must be escaped (\\ ) or written as [ ] — and 'New\\ York | Paris' shows alternation still works with the layout spaces removed.",

  patterns: [
    {
      name: 'Combine flags',
      desc: 'Flags are IntFlag members: | combines them.',
      code: "import re\npat = re.compile(r'^error:.*$', re.IGNORECASE | re.MULTILINE)",
    },
    {
      name: 'A documented pattern with VERBOSE',
      desc: 'Comments and line breaks make long patterns maintainable.',
      code: "import re\nDATE = re.compile(r'''\n    (?P<year>\\d{4})  -   # year\n    (?P<month>\\d{2}) -   # month\n    (?P<day>\\d{2})       # day\n''', re.VERBOSE)",
    },
    {
      name: 'Inline flags and scoped flags',
      desc: '(?i) at the very start applies to the whole pattern; (?i:...) only to the group (3.6+).',
      code: "import re\nre.compile(r'(?i)^subject:')\nre.compile(r'ID-(?i:[a-f0-9]+)')",
    },
    {
      name: 'Build flags conditionally',
      desc: 're.NOFLAG (3.11+) is a clear starting value.',
      code: "import re\nflags = re.NOFLAG\nif ignore_case:\n    flags |= re.IGNORECASE\npat = re.compile(needle, flags)",
    },
  ],

  examples: [
    { title: 'Case-insensitive',            code: "import re\nre.findall(r'python', 'Python PYTHON python', re.I)", returns: "['Python', 'PYTHON', 'python']" },
    { title: '^ on every line',             code: "import re\nre.findall(r'^\\w+', 'one\\ntwo\\nthree', re.M)", returns: "['one', 'two', 'three']" },
    { title: '. across a newline',          code: "import re\nre.search(r'a.b', 'a\\nb', re.S)", returns: "<re.Match object; span=(0, 3), match='a\\nb'>" },
    { title: 'ASCII-only \\w',              code: "import re\nre.findall(r'\\w+', 'café naïve', re.A)", returns: "['caf', 'na', 've']" },
    { title: 'Inline flag',                 code: "import re\nre.findall(r'(?i)python', 'Python')", returns: "['Python']" },
    { title: 'Combined flags repr',         code: 'import re\nre.I | re.M', returns: 're.IGNORECASE|re.MULTILINE' },
    { title: 'Flags are ints',              code: 'import re\n(int(re.I), int(re.M), int(re.S), int(re.X), int(re.A))', returns: '(2, 8, 16, 64, 256)' },
    { title: 'Unicode digits by default',   code: "import re\n(re.findall(r'\\d', '1٣'), re.findall(r'\\d', '1٣', re.A))", returns: "(['1', '٣'], ['1'])" },
  ],

  pitfalls: [
    {
      name: 'Flags passed positionally to re.sub',
      desc: "re.sub's fourth parameter is count. re.I is 2, so this means \"replace at most 2\" — and nothing is case-insensitive.",
      wrong: { label: 're.sub(p, r, s, re.I)', code: "import re\nre.sub('a', '-', 'AaAa', re.I)", output: "'A-A-'" },
      fix:   { label: 'flags=re.I', code: "import re\nre.sub('a', '-', 'AaAa', flags=re.I)", output: "'----'" },
    },
    {
      name: 'Inline global flags in the middle',
      desc: 'Since 3.11 a global (?i) must be at the start. Use a scoped group (?i:...) elsewhere.',
      wrong: { label: 'a(?i)b', code: "import re\nre.compile(r'a(?i)b')", output: 're.PatternError: global flags not at the start of the expression at position 1' },
      fix:   { label: 'a(?i:b)', code: "import re\nre.findall(r'a(?i:b)', 'ab aB Ab')", output: "['ab', 'aB']" },
    },
    {
      name: 'Expecting MULTILINE to make . cross lines',
      desc: 'MULTILINE is about ^ and $. The dot needs DOTALL.',
      wrong: { label: 're.M', code: "import re\nprint(re.search(r'start.*end', 'start\\nend', re.M))", output: 'None' },
      fix:   { label: 're.S', code: "import re\nre.search(r'start.*end', 'start\\nend', re.S)", output: "<re.Match object; span=(0, 9), match='start\\nend'>" },
    },
  ],

  when: {
    use: [
      'IGNORECASE for user-facing search; MULTILINE for line-oriented text',
      'DOTALL when a match may span lines; VERBOSE for any pattern longer than one line',
      'ASCII when \\w and \\d must mean [a-zA-Z0-9_] and [0-9] (identifiers, protocols)',
    ],
    avoid: [
      'LOCALE with str patterns — not allowed',
      'UNICODE — it is already the default for str',
      'IGNORECASE as a substitute for proper normalization (casefold, unicodedata)',
    ],
  },

  notes: {
    cpython:     're.RegexFlag is an enum.IntFlag defined in Lib/re/__init__.py; the bit values come from Lib/re/_constants.py (SRE_FLAG_*)',
    'Inline':    '(?aiLmsux) at the start of the pattern sets flags for the whole pattern; (?imsx-imsx:...) sets or clears them inside a group (a, L, u can only be set, not cleared)',
    'Versions':  'Flags became RegexFlag enum members in 3.6; NOFLAG was added in 3.11; since 3.11 global inline flags must be at the start',
    'Pattern.flags': 'A compiled str pattern reports re.UNICODE (32) as well, even when you did not pass it',
    'DEBUG':     're.DEBUG (128) prints the parsed pattern while compiling — a debugging aid, not part of __all__',
  },

  related: [
    { name: 're.compile', slug: 'compile', when: 'Where flags usually go' },
    { name: 're.Pattern', slug: 'pattern-object', when: 'Pattern.flags shows the effective flags' },
    { name: 're.search',  slug: 'search',  when: 'flags= on any module function' },
    { name: 'str.casefold()', slug: 'str-casefold', when: 'Case-insensitive comparison without regex', category: 'functions' },
    { name: '| operator', slug: 'bitwise-or', when: 'How flags combine', category: 'operators' },
  ],

  faq: [
    {
      q: 'How do I make a Python regex case-insensitive?',
      a: "Pass re.IGNORECASE (or re.I): re.search(r'python', text, re.I). Or start the pattern with (?i). For part of a pattern use a scoped group: (?i:python).",
    },
    {
      q: 'How do I use multiple flags in re?',
      a: 'Combine them with the | operator: re.compile(pattern, re.IGNORECASE | re.MULTILINE | re.DOTALL). Inline: (?ims) at the start.',
    },
    {
      q: 'What is the difference between re.MULTILINE and re.DOTALL?',
      a: 'MULTILINE makes ^ and $ match at line boundaries; DOTALL makes . match newline characters too. They are independent.',
    },
    {
      q: 'What does re.ASCII do?',
      a: "It makes \\w, \\d, \\s, \\b and case-insensitive matching ASCII-only. Without it, str patterns are Unicode-aware: \\w matches 'é' and \\d matches Arabic-Indic digits.",
    },
    {
      q: 'Why does re.sub ignore my re.IGNORECASE flag?',
      a: 'You passed it as the fourth positional argument, which is count. Use flags=re.IGNORECASE.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#flags',
    meta:  're flags',
  },
};
