// content/reference/python/stdlib/difflib/is_line_junk.js — IS_LINE_JUNK / IS_CHARACTER_JUNK

export const meta = {
  slug:        'is_line_junk',
  name:        'difflib.IS_LINE_JUNK / IS_CHARACTER_JUNK',
  signature:   'difflib.IS_LINE_JUNK(line) · difflib.IS_CHARACTER_JUNK(ch)',
  blurb:       'The two ready-made junk filters: IS_LINE_JUNK is true for blank lines and lines holding only a "#"; IS_CHARACTER_JUNK is true for a space or a tab.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'difflib IS_LINE_JUNK IS_CHARACTER_JUNK is_line_junk is_character_junk junk filter blank lines hash comment whitespace space tab linejunk charjunk isjunk ignore whitespace diff',
};

export const method = {
  slug:      'is_line_junk',
  name:      'difflib.IS_LINE_JUNK / IS_CHARACTER_JUNK',
  signature: 'difflib.IS_LINE_JUNK(line) · difflib.IS_CHARACTER_JUNK(ch)',
  returns:   { type: 'bool', desc: 'True if the line (or character) should be treated as junk by SequenceMatcher, Differ or ndiff.' },

  category:    'difflib function',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'Junk filters do not remove anything from a diff — they only stop an element from anchoring a match. IS_CHARACTER_JUNK is ndiff\'s default charjunk; IS_LINE_JUNK used to be its default linejunk; today the default is None, which the docs say usually works better.',

  covers: ['IS_LINE_JUNK', 'IS_CHARACTER_JUNK'],

  cheat: {
    commonCall: 'difflib.ndiff(a, b, linejunk=difflib.IS_LINE_JUNK)',
    returns:    'True for "\\n", "  #  \\n", " " and "\\t"',
    replaces:   "lambda line: not line.strip() or line.strip() == '#'",
    watchOut:   'IS_CHARACTER_JUNK is a substring test: "" is junk too',
  },

  parameters: [
    { name: 'line', type: 'str', required: true, desc: 'IS_LINE_JUNK: a line. True when it is whitespace only, or whitespace around a single "#". "Whitespace" is everything str.isspace() accepts, the newline included.', default: null },
    { name: 'ch',   type: 'str', required: true, desc: 'IS_CHARACTER_JUNK: a character. True when ch in " \\t" — a space or a tab (a substring test, so "" and " \\t" also count).', default: null },
  ],

  modes: [
    {
      id: 'line',
      label: 'IS_LINE_JUNK',
      blurb: 'Which lines count as junk? Lines are separated by |; an empty part is an empty line.',
      params: [{ name: 'lines', type: 'str', hint: 'lines separated by |', input: 'text' }],
      template: "import difflib\n[difflib.IS_LINE_JUNK(line) for line in {$lines}.split('|')]",
      cases: [
        { id: 'mixed',   label: 'mixed',          values: { lines: '|   |#|  #  |# comment|##|x = 1' } },
        { id: 'unicode', label: 'Unicode spaces', values: { lines: '\u3000|\u00a0#\u00a0|\u200b' } },
      ],
    },
    {
      id: 'char',
      label: 'IS_CHARACTER_JUNK',
      blurb: 'Each character of a string and whether it is junk.',
      params: [{ name: 'text', type: 'str', hint: 'characters to test', input: 'text' }],
      template: 'import difflib\n[(ch, difflib.IS_CHARACTER_JUNK(ch)) for ch in {$text}]',
      cases: [
        { id: 'code', label: 'code',       values: { text: 'if x:\tpass' } },
        { id: 'nbsp', label: 'no-break space', values: { text: 'a\u00a0b c' } },
      ],
    },
    {
      id: 'substring',
      label: 'any string',
      blurb: 'IS_CHARACTER_JUNK(ch) is just ch in " \\t" — try longer strings.',
      params: [{ name: 's', type: 'str', hint: 'any string', input: 'text' }],
      template: 'import difflib\ndifflib.IS_CHARACTER_JUNK({$s})',
      cases: [
        { id: 'empty', label: 'empty string', values: { s: '' } },
        { id: 'two',   label: 'two spaces',   values: { s: '  ' } },
        { id: 'x',     label: 'letter',       values: { s: 'x' } },
      ],
    },
  ],
  demoExplainer: 'An empty line, a line of spaces, a lone # and a # surrounded by spaces are junk; "# comment", "##" and code are not. IS_LINE_JUNK uses Unicode whitespace, so an ideographic space (U+3000) or no-break spaces around # also count, while a zero-width space (U+200B) is not whitespace. IS_CHARACTER_JUNK is stricter: only " " and "\\t", so the no-break space is not junk. Because it is the test ch in " \\t", the empty string is junk, but two spaces are not (" \\t" does not contain "  ").',

  patterns: [
    {
      name: 'Blank lines may not anchor the alignment',
      desc: 'Junk lines still appear in the output; they only cannot start a match.',
      code: 'import difflib\ndelta = difflib.ndiff(old_lines, new_lines, linejunk=difflib.IS_LINE_JUNK)',
    },
    {
      name: 'A custom line filter',
      desc: 'Any callable works — here comment and blank lines of a config file.',
      code: "import difflib\nis_noise = lambda line: line.strip() == '' or line.lstrip().startswith(';')\ndelta = difflib.ndiff(old_lines, new_lines, linejunk=is_noise)",
    },
    {
      name: 'Whitespace as junk in SequenceMatcher',
      desc: 'IS_CHARACTER_JUNK works as isjunk for comparing characters.',
      code: 'import difflib\ns = difflib.SequenceMatcher(difflib.IS_CHARACTER_JUNK, old_line, new_line)',
    },
  ],

  examples: [
    { title: 'Blank and lone-# lines are junk', code: "import difflib\n[difflib.IS_LINE_JUNK(line) for line in ['\\n', '  #  \\n', '#', '', 'x = 1\\n', '# note\\n']]", returns: '[True, True, True, True, False, False]' },
    { title: 'Two # are not junk', code: "import difflib\ndifflib.IS_LINE_JUNK('##\\n')", returns: 'False' },
    { title: 'Spaces and tabs are junk characters', code: "import difflib\n[difflib.IS_CHARACTER_JUNK(ch) for ch in [' ', '\\t', '\\n', 'x']]", returns: '[True, True, False, False]' },
    { title: 'A no-break space is not', code: "import difflib\ndifflib.IS_CHARACTER_JUNK('\\xa0')", returns: 'False' },
    { title: 'IS_CHARACTER_JUNK is a substring test', code: "import difflib\n(difflib.IS_CHARACTER_JUNK(''), difflib.IS_CHARACTER_JUNK(' \\t'), difflib.IS_CHARACTER_JUNK('\\t '))", returns: '(True, True, False)' },
    { title: 'Junk lines still show up in the delta', code: "import difflib\nlist(difflib.ndiff(['a\\n', '\\n'], ['b\\n', '\\n'], linejunk=difflib.IS_LINE_JUNK))", returns: "['- a\\n', '+ b\\n', '  \\n']" },
  ],

  pitfalls: [
    {
      name: 'Expecting junk lines to be ignored',
      desc: 'A junk filter only affects which elements can anchor a match. Blank lines that were added or removed are still reported.',
      wrong: { label: 'linejunk', code: "import difflib\n[l for l in difflib.ndiff(['a\\n', 'b\\n'], ['a\\n', '\\n', 'b\\n'], linejunk=difflib.IS_LINE_JUNK) if l[0] != ' ']", output: "['+ \\n']" },
      fix:   { label: 'drop blank lines first', code: "import difflib\nkeep = lambda lines: [l for l in lines if not difflib.IS_LINE_JUNK(l)]\n[l for l in difflib.ndiff(keep(['a\\n', 'b\\n']), keep(['a\\n', '\\n', 'b\\n'])) if l[0] != ' ']", output: '[]' },
    },
    {
      name: 'Expecting comment lines to be junk',
      desc: 'IS_LINE_JUNK accepts a "#" only when nothing but whitespace surrounds it. A real comment line is not junk — write your own filter for that.',
      wrong: { label: 'IS_LINE_JUNK', code: "import difflib\nlines = ['x = 1\\n', '# set x\\n', '\\n']\n[difflib.IS_LINE_JUNK(l) for l in lines]", output: '[False, False, True]' },
      fix:   { label: 'own filter',   code: "import difflib\nis_noise = lambda line: line.strip() == '' or line.lstrip().startswith('#')\nlines = ['x = 1\\n', '# set x\\n', '\\n']\n[is_noise(l) for l in lines]", output: '[False, True, True]' },
    },
  ],

  when: {
    use: [
      'linejunk for texts whose blank lines would otherwise pull the alignment around',
      'charjunk / isjunk so that spaces and tabs do not anchor intraline matches',
      'As templates for your own filters (any callable that returns a bool works)',
    ],
    avoid: [
      'Ignoring whitespace changes altogether → normalize the lines (strip, collapse spaces) before diffing',
      'Ignoring comment lines → filter them out of both inputs first',
    ],
  },

  notes: {
    cpython:     'Lib/difflib.py (3.13): IS_LINE_JUNK(line, pat=re.compile(r"\\s*(?:#\\s*)?$").match) returns pat(line) is not None; IS_CHARACTER_JUNK(ch, ws=" \\t") returns ch in ws. Python 3.14 reimplemented IS_LINE_JUNK as line.strip() in "#" for speed, with the same results',
    'Defaults':  'ndiff and HtmlDiff use charjunk=IS_CHARACTER_JUNK; Differ() uses None. No function uses IS_LINE_JUNK by default any more — the docs call it the linejunk default "in older versions"',
    'Whitespace': 'IS_LINE_JUNK accepts any Unicode whitespace (str.isspace), such as U+3000; IS_CHARACTER_JUNK only the ASCII space and tab',
  },

  related: [
    { name: 'difflib.ndiff',   slug: 'ndiff',           when: 'Uses IS_CHARACTER_JUNK by default' },
    { name: 'difflib.Differ',  slug: 'differ',          when: 'linejunk and charjunk parameters' },
    { name: 'SequenceMatcher', slug: 'sequencematcher', when: 'isjunk: how junk changes matching' },
    { name: 're module',       slug: 're',              when: 'IS_LINE_JUNK is a regular expression match in 3.13 — write custom line filters the same way', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What counts as junk for difflib.IS_LINE_JUNK?',
      a: 'A line that contains only whitespace, or whitespace around a single "#". The newline counts as whitespace, so "\\n" and "  #  \\n" are junk; "##" and "# comment" are not.',
    },
    {
      q: 'Does linejunk=IS_LINE_JUNK hide blank-line changes from ndiff?',
      a: 'No. Junk elements are only prevented from starting a matching block, which changes how the two texts are lined up. Added or removed blank lines still appear as + and - lines. To ignore them, remove them from both inputs before diffing.',
    },
    {
      q: 'How do I treat other whitespace characters as junk in ndiff?',
      a: "Pass your own function as charjunk, for example charjunk=lambda ch: ch in ' \\t\\xa0' to add the no-break space. Any callable that takes one character and returns true or false works. Leave the newline out: the docs call including it a bad idea.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.IS_LINE_JUNK',
    meta:  'difflib.IS_LINE_JUNK',
  },
};
