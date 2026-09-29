// content/reference/python/stdlib/re/match.js

export const meta = {
  slug:        'match',
  name:        're.match',
  signature:   're.match(pattern, string, flags=0)',
  blurb:       'Try the pattern at the beginning of the string only; returns a Match object or None.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're match python regex match at start of string beginning re.match vs re.search Pattern.match anchored prefix',
};

export const method = {
  slug:      'match',
  name:      're.match',
  signature: 're.match(pattern, string, flags=0)',
  returns:   { type: 're.Match | None', desc: 'A match that starts at position 0 (it need not reach the end), or None.' },

  category:    're function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Anchored at the start, open at the end: re.match succeeds when the string BEGINS with the pattern. Also available as Pattern.match(string, pos, endpos), which anchors at pos instead.',

  covers: ['match', 'Pattern.match'],

  cheat: {
    commonCall: "re.match(r'\\d+', '42 apples')",
    returns:    "<re.Match object; span=(0, 2), match='42'> or None",
    replaces:   'str.startswith when the prefix is a pattern',
    watchOut:   'Only position 0 — even with re.MULTILINE. Anywhere → re.search',
  },

  parameters: [
    { name: 'pattern', type: 'str | re.Pattern', required: true,  default: null, desc: 'The regular expression, as a raw string.' },
    { name: 'string',  type: 'str',              required: true,  default: null, desc: 'The text; matching is tried at its first character only.' },
    { name: 'flags',   type: 're.RegexFlag | int', required: false, default: '0', desc: 'Flags such as re.IGNORECASE. Not allowed with a compiled pattern.' },
  ],

  modes: [
    {
      id: 'match',
      label: 'match',
      blurb: 'Succeeds only if the text starts with something the pattern matches.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
      ],
      template: 'import re\nre.match({$pattern}, {$text})',
      cases: [
        { id: 'prefix', label: 'starts with digits', values: { pattern: '\\d+', text: '42 apples' } },
        { id: 'later',  label: 'digits later',       values: { pattern: '\\d+', text: 'apples: 42' } },
        { id: 'cmd',    label: 'command word',       values: { pattern: '(get|set) (\\w+)', text: 'set volume 11' } },
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
        { id: 'start',  label: 'prefix only', values: { pattern: '[a-z]+', text: 'abc123' } },
        { id: 'middle', label: 'in the middle', values: { pattern: '[a-z]+', text: '123abc' } },
        { id: 'all',    label: 'the whole text', values: { pattern: '[a-z]+', text: 'abc' } },
      ],
    },
    {
      id: 'multiline',
      label: 'with MULTILINE',
      blurb: 're.MULTILINE changes what ^ means, but re.match still only tries position 0.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'several lines (\\n)',  input: 'text' },
      ],
      template: 'import re\n(re.match({$pattern}, {$text}, re.MULTILINE), re.findall({$pattern}, {$text}, re.MULTILINE))',
      cases: [
        { id: 'second', label: 'second line', values: { pattern: '^b\\w*', text: 'alpha\nbeta' } },
        { id: 'first',  label: 'first line',  values: { pattern: '^a\\w*', text: 'alpha\nbeta' } },
      ],
    },
  ],
  demoExplainer: "match wants the pattern at position 0 but does not care what follows: '[a-z]+' matches 'abc123' (span 0 to 3) — fullmatch does not. In the MULTILINE tab findall shows that ^ does match after the newline; match simply never looks there.",

  patterns: [
    {
      name: 'Parse a line that starts with a known shape',
      desc: 'Groups pull the fields out of the prefix; the rest of the line is ignored.',
      code: "import re\nif m := re.match(r'(\\d{4})-(\\d{2})-(\\d{2}) ', line):\n    year, month, day = map(int, m.groups())",
    },
    {
      name: 'A tokenizer loop with pos',
      desc: 'Pattern.match(string, pos) anchors at pos — step through a string token by token.',
      code: "import re\nTOKEN = re.compile(r'\\s*(\\d+|[-+*/()])')\npos = 0\nwhile m := TOKEN.match(expr, pos):\n    tokens.append(m.group(1))\n    pos = m.end()",
    },
  ],

  examples: [
    { title: 'Matches at the start',      code: "import re\nre.match(r'\\d+', '42 apples')", returns: "<re.Match object; span=(0, 2), match='42'>" },
    { title: 'Not at the start: None',    code: "import re\nprint(re.match(r'\\d+', 'apples: 42'))", returns: 'None' },
    { title: 'Does not need the end',     code: "import re\nre.match(r'[a-z]+', 'abc123').group()", returns: "'abc'" },
    { title: 'Groups from the prefix',    code: "import re\nre.match(r'(get|set) (\\w+)', 'set volume 11').groups()", returns: "('set', 'volume')" },
    { title: 'MULTILINE does not help',   code: "import re\nprint(re.match(r'^b', 'a\\nb', re.MULTILINE))", returns: 'None' },
    { title: 'Pattern.match anchors at pos', code: "import re\nre.compile(r'\\d+').match('ab12', 2)", returns: "<re.Match object; span=(2, 4), match='12'>" },
  ],

  pitfalls: [
    {
      name: 'Validating input with match',
      desc: 'match accepts anything that merely starts right. Use fullmatch (or \\Z) to require the whole string.',
      wrong: { label: 're.match', code: "import re\nbool(re.match(r'\\d{3}', '1234567'))", output: 'True' },
      fix:   { label: 're.fullmatch', code: "import re\nbool(re.fullmatch(r'\\d{3}', '1234567'))", output: 'False' },
    },
    {
      name: 'Expecting match to search',
      desc: 'The text contains a number, but not at position 0.',
      wrong: { label: 're.match', code: "import re\nprint(re.match(r'\\d+', 'total: 42'))", output: 'None' },
      fix:   { label: 're.search', code: "import re\nre.search(r'\\d+', 'total: 42')", output: "<re.Match object; span=(7, 9), match='42'>" },
    },
  ],

  when: {
    use: [
      'The text must begin with the pattern (a prefix, a command, a line header)',
      'Tokenizing with Pattern.match(string, pos) step by step',
    ],
    avoid: [
      'Pattern can occur anywhere → re.search',
      'Validating a whole value → re.fullmatch',
      'Fixed prefix → str.startswith',
    ],
  },

  notes: {
    cpython:  'Pattern.match runs the matcher once, at pos (sre_match in Modules/_sre/_sre.c); no scanning',
    'pos':    'Pattern.match(string, pos) anchors at pos, but ^ still means the start of the string, so r"^a" with pos > 0 never matches',
    'vs ^':   'In search, ^ with re.MULTILINE can match after every newline; re.match only ever tries position 0 (or pos)',
  },

  related: [
    { name: 're.search',    slug: 'search',    when: 'First match anywhere' },
    { name: 're.fullmatch', slug: 'fullmatch', when: 'The whole string must match' },
    { name: 'Match.span',   slug: 'match-span', when: 'Where the match ended — for the next pos' },
    { name: 'str.startswith()', slug: 'startswith', when: 'Fixed prefix, no regex', category: 'functions' },
    { name: 'match statement', slug: 'match', when: 'Structural pattern matching — a different feature', category: 'keywords' },
  ],

  faq: [
    {
      q: 'Why does re.match return None when the text contains the pattern?',
      a: 're.match only tries at the beginning of the string. If the pattern occurs later, use re.search.',
    },
    {
      q: 'Does re.match check the whole string?',
      a: "No — it only requires the match to start at position 0. re.match(r'\\d+', '42 apples') succeeds. To require the entire string, use re.fullmatch.",
    },
    {
      q: 'Is re.match the same as the match statement?',
      a: 'No. match/case (Python 3.10+) is structural pattern matching on values like tuples and dicts; re.match applies a regular expression to a string.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.match',
    meta:  're.match',
  },
};
