// content/reference/python/stdlib/re/fullmatch.js

export const meta = {
  slug:        'fullmatch',
  name:        're.fullmatch',
  signature:   're.fullmatch(pattern, string, flags=0)',
  blurb:       'Succeed only if the whole string matches the pattern — the right tool for validating input.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 're fullmatch python regex validate entire string whole string match exact match anchors ^ $ \\Z Pattern.fullmatch input validation',
};

export const method = {
  slug:      'fullmatch',
  name:      're.fullmatch',
  signature: 're.fullmatch(pattern, string, flags=0)',
  returns:   { type: 're.Match | None', desc: 'A match covering the entire string (from pos to endpos for Pattern.fullmatch), or None.' },

  category:    're function',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Both ends anchored: the pattern has to account for every character. Cleaner and stricter than wrapping a pattern in ^…$ — $ lets a trailing newline slip through. Also available as Pattern.fullmatch(string, pos, endpos).',

  covers: ['fullmatch', 'Pattern.fullmatch'],

  cheat: {
    commonCall: "re.fullmatch(r'\\d{5}', zip_code)",
    returns:    'a Match for the entire string, or None',
    replaces:   "re.match(r'^...$') and re.search(r'\\A...\\Z')",
    watchOut:   'Whole value only — to find the value inside longer text use re.search',
  },

  parameters: [
    { name: 'pattern', type: 'str | re.Pattern', required: true,  default: null, desc: 'The regular expression, as a raw string.' },
    { name: 'string',  type: 'str',              required: true,  default: null, desc: 'The value to validate; all of it must match.' },
    { name: 'flags',   type: 're.RegexFlag | int', required: false, default: '0', desc: 'Flags such as re.IGNORECASE. Not allowed with a compiled pattern.' },
  ],

  modes: [
    {
      id: 'fullmatch',
      label: 'fullmatch',
      blurb: 'None unless the pattern can cover the text from the first character to the last.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'value to validate',    input: 'text' },
      ],
      template: 'import re\nre.fullmatch({$pattern}, {$text})',
      cases: [
        { id: 'ok',     label: 'valid ZIP',       values: { pattern: '\\d{5}(-\\d{4})?', text: '90210-1234' } },
        { id: 'extra',  label: 'extra character', values: { pattern: '\\d{5}(-\\d{4})?', text: '90210x' } },
        { id: 'hex',    label: 'hex color',       values: { pattern: '#[0-9a-fA-F]{6}', text: '#1B50EE' } },
        { id: 'newline', label: 'trailing newline', values: { pattern: '\\d+', text: '123\n' } },
      ],
    },
    {
      id: 'compare',
      label: 'search vs match vs fullmatch',
      blurb: 'The same pattern and text through all three functions.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
      ],
      template: 'import re\np, s = {$pattern}, {$text}\n(re.search(p, s), re.match(p, s), re.fullmatch(p, s))',
      cases: [
        { id: 'dollar', label: '$ vs newline', values: { pattern: '\\d+$', text: '42\n' } },
        { id: 'lazy',   label: 'lazy quantifier', values: { pattern: '.+?', text: 'abc' } },
        { id: 'alt',    label: 'alternation',  values: { pattern: 'cat|category', text: 'category' } },
      ],
    },
    {
      id: 'validate',
      label: 'filter a list',
      blurb: 'Keep only the values that match completely.',
      params: [
        { name: 'pattern', type: 'str',       hint: 'a regular expression', input: 'text' },
        { name: 'values',  type: 'list[str]', hint: 'comma-separated',      input: 'csv' },
      ],
      template: 'import re\n[v for v in {$values} if re.fullmatch({$pattern}, v)]',
      cases: [
        { id: 'ids',  label: 'IDs',       values: { pattern: '[A-Z]{2}\\d{4}', values: 'AB1234, ab1234, AB12345, XY0001' } },
        { id: 'ints', label: 'integers',  values: { pattern: '[+-]?\\d+', values: '42, -7, 3.5, +10, 1e3' } },
      ],
    },
  ],
  demoExplainer: "fullmatch backtracks until the match covers everything: .+? is lazy, yet fullmatch still returns all of 'abc', and with cat|category it moves on to the second alternative after 'cat' leaves text over. In the $ tab, \\d+$ matches '42\\n' in search and match because $ also matches just before a final newline; fullmatch rejects it.",

  patterns: [
    {
      name: 'A validator function',
      desc: 'Compile once; return a bool.',
      code: "import re\nUSERNAME = re.compile(r'[a-z][a-z0-9_]{2,15}')\ndef valid_username(name):\n    return USERNAME.fullmatch(name) is not None",
    },
    {
      name: 'Validate and parse at once',
      desc: 'The groups of a full match are the parsed fields.',
      code: "import re\nif m := re.fullmatch(r'(\\d{1,2}):(\\d{2})', value):\n    hours, minutes = int(m[1]), int(m[2])",
    },
  ],

  examples: [
    { title: 'The whole string matches', code: "import re\nre.fullmatch(r'\\d+', '12345')", returns: "<re.Match object; span=(0, 5), match='12345'>" },
    { title: 'Anything extra fails',     code: "import re\nprint(re.fullmatch(r'\\d+', '12345a'))", returns: 'None' },
    { title: 'Stricter than $',          code: "import re\n(bool(re.match(r'\\d+$', '123\\n')), bool(re.fullmatch(r'\\d+', '123\\n')))", returns: '(True, False)' },
    { title: 'Backtracks to cover all',  code: "import re\nre.fullmatch(r'cat|category', 'category')", returns: "<re.Match object; span=(0, 8), match='category'>" },
    { title: 'Case-insensitive check',   code: "import re\nbool(re.fullmatch(r'yes|y', 'YES', re.IGNORECASE))", returns: 'True' },
    { title: 'Pattern.fullmatch with endpos', code: "import re\nre.compile(r'\\d+').fullmatch('123abc', 0, 3)", returns: "<re.Match object; span=(0, 3), match='123'>" },
  ],

  pitfalls: [
    {
      name: 'Trusting ^...$ to validate',
      desc: '$ also matches before a trailing newline, so a value ending in \\n passes. fullmatch (or \\Z) does not.',
      wrong: { label: "r'^\\d+$'", code: "import re\nbool(re.match(r'^\\d+$', '42\\n'))", output: 'True' },
      fix:   { label: 'fullmatch', code: "import re\nbool(re.fullmatch(r'\\d+', '42\\n'))", output: 'False' },
    },
    {
      name: 'Anchors around an alternation',
      desc: 'In ^cat|dog$ the anchors bind to one alternative each. fullmatch applies to the whole pattern, so no anchors or extra group are needed.',
      wrong: { label: "r'^cat|dog$'", code: "import re\nbool(re.match(r'^cat|dog$', 'catalog'))", output: 'True' },
      fix:   { label: 'fullmatch', code: "import re\nbool(re.fullmatch(r'cat|dog', 'catalog'))", output: 'False' },
    },
  ],

  when: {
    use: [
      'Validating a complete value: IDs, codes, numbers, usernames',
      'Parsing a string that has exactly one expected shape',
    ],
    avoid: [
      'Looking for the pattern inside longer text → re.search',
      'Checking just a prefix → re.match',
      'Numbers you will convert anyway → try int(value) / float(value)',
    ],
  },

  notes: {
    cpython:   'The matcher runs once at pos with a "match all" flag: a match only counts if it ends exactly at endpos, so the engine keeps backtracking for longer alternatives',
    'Added':   'Python 3.4 (re.fullmatch and Pattern.fullmatch)',
    'endpos':  'Pattern.fullmatch(string, pos, endpos) requires the match to cover exactly string[pos:endpos]',
  },

  related: [
    { name: 're.match',  slug: 'match',  when: 'Only the start is anchored' },
    { name: 're.search', slug: 'search', when: 'Anywhere in the text' },
    { name: 're.escape', slug: 'escape', when: 'Validate against literal user text' },
    { name: 'str.isdigit()', slug: 'isdigit', when: 'All-digit check without regex', category: 'functions' },
    { name: 'int()',     slug: 'int', when: 'Convert instead of validating the digits', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I check that a whole string matches a regex in Python?',
      a: "re.fullmatch(pattern, s) — it returns a Match only if the entire string matches. For example re.fullmatch(r'\\d{5}', '90210') matches but '90210x' does not.",
    },
    {
      q: 'What is the difference between fullmatch and ^ and $?',
      a: "$ also matches just before a newline at the end of the string, so re.match(r'^\\d+$', '42\\n') succeeds. fullmatch requires the match to end at the very end. \\A and \\Z are the strict anchors if you need them inside search.",
    },
    {
      q: 'When was re.fullmatch added?',
      a: 'In Python 3.4. On older code bases you will see re.match(pattern + r"\\Z", s) instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.fullmatch',
    meta:  're.fullmatch',
  },
};
