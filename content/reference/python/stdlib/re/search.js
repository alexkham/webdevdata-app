// content/reference/python/stdlib/re/search.js

export const meta = {
  slug:        'search',
  name:        're.search',
  signature:   're.search(pattern, string, flags=0)',
  blurb:       'Scan a string for the first place a regular expression matches; returns a Match object or None.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're search python regex find first match anywhere in string search vs match Pattern.search pos endpos match object none',
};

export const method = {
  slug:      'search',
  name:      're.search',
  signature: 're.search(pattern, string, flags=0)',
  returns:   { type: 're.Match | None', desc: 'The first match (leftmost position), or None when the pattern matches nowhere.' },

  category:    're function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The one you usually want: tries every position from left to right and stops at the first match. Also available as Pattern.search(string, pos, endpos) on a compiled pattern.',

  covers: ['search', 'Pattern.search'],

  cheat: {
    commonCall: "re.search(r'\\d+', 'order 66')",
    returns:    "<re.Match object; span=(6, 8), match='66'> or None",
    replaces:   'str.find / the in operator when the target is a pattern, not fixed text',
    watchOut:   'None when nothing matches — check before calling .group()',
  },

  parameters: [
    { name: 'pattern', type: 'str | re.Pattern', required: true,  default: null, desc: "The regular expression — write it as a raw string, r'...'." },
    { name: 'string',  type: 'str',              required: true,  default: null, desc: 'The text to scan.' },
    { name: 'flags',   type: 're.RegexFlag | int', required: false, default: '0', desc: 're.IGNORECASE, re.MULTILINE, … combined with |. Not allowed when pattern is already compiled.' },
  ],

  modes: [
    {
      id: 'search',
      label: 'search',
      blurb: 'The Match object shows where the first match is (span) and what it matched.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to scan',         input: 'text' },
      ],
      template: 'import re\nre.search({$pattern}, {$text})',
      cases: [
        { id: 'num',    label: 'first number', values: { pattern: '\\d+', text: 'order 66, then 3' } },
        { id: 'word',   label: 'whole word',   values: { pattern: '\\bis\\b', text: 'This island is big' } },
        { id: 'end',    label: 'at the end',   values: { pattern: '\\w+$', text: 'last word wins' } },
        { id: 'none',   label: 'no match',     values: { pattern: 'x+', text: 'abc' } },
        { id: 'empty',  label: 'empty match',  values: { pattern: 'x*', text: 'abc' } },
      ],
    },
    {
      id: 'compare',
      label: 'search vs match vs fullmatch',
      blurb: 'The same pattern and text through all three: anywhere, at the start only, the whole string only.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
      ],
      template: 'import re\np, s = {$pattern}, {$text}\n(re.search(p, s), re.match(p, s), re.fullmatch(p, s))',
      cases: [
        { id: 'middle', label: 'digits in the middle', values: { pattern: '\\d+', text: 'abc123def' } },
        { id: 'start',  label: 'digits at the start',  values: { pattern: '\\d+', text: '123def' } },
        { id: 'all',    label: 'only digits',          values: { pattern: '\\d+', text: '12345' } },
      ],
    },
    {
      id: 'pos',
      label: 'Pattern.search(pos)',
      blurb: 'A compiled pattern can start scanning at pos. Note that ^ still means the real start of the string.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text',                 input: 'text' },
        { name: 'pos',     type: 'int', hint: 'where to start',       input: 'number' },
      ],
      template: 'import re\npat = re.compile({$pattern})\npat.search({$text}, {$pos})',
      cases: [
        { id: 'skip',  label: 'skip the first', values: { pattern: '\\d+', text: '10 20 30', pos: '2' } },
        { id: 'caret', label: '^ with pos',     values: { pattern: '^\\d+', text: '10 20 30', pos: '3' } },
        { id: 'past',  label: 'pos past the end', values: { pattern: '\\d*', text: '10', pos: '9' } },
      ],
    },
  ],
  demoExplainer: 'span=(start, end) is a half-open range: text[start:end] is the match. An empty match is still a match — x* finds zero x at position 0, so search returns a Match (truthy) with span=(0, 0). In the pos tab, ^\\d+ fails at pos 3 because ^ only matches at the true beginning of the string; pos past the end is clamped to the end.',

  patterns: [
    {
      name: 'Test and use in one step',
      desc: 'The walrus operator keeps the Match object for the body.',
      code: "import re\nif m := re.search(r'(\\d+) items?', line):\n    count = int(m.group(1))",
    },
    {
      name: 'Does the text contain the pattern?',
      desc: 'A Match is truthy, None is falsy.',
      code: "import re\nhas_digit = re.search(r'\\d', password) is not None",
    },
    {
      name: 'Compiled pattern in a loop',
      desc: 'Pattern.search takes optional pos and endpos to limit the scan.',
      code: "import re\nERR = re.compile(r'\\bERROR\\b')\nerrors = [ln for ln in log_lines if ERR.search(ln)]",
    },
  ],

  examples: [
    { title: 'The first match wins',        code: "import re\nre.search(r'\\d+', 'order 66, then 3')", returns: "<re.Match object; span=(6, 8), match='66'>" },
    { title: 'Get the matched text',        code: "import re\nre.search(r'\\d+', 'order 66').group()", returns: "'66'" },
    { title: 'No match is None',            code: "import re\nre.search(r'\\d+', 'no digits') is None", returns: 'True' },
    { title: 'Groups inside the match',     code: "import re\nm = re.search(r'(\\w+)@(\\w+)\\.com', 'mail ada@example.com')\nm.groups()", returns: "('ada', 'example')" },
    { title: 'Case-insensitive',            code: "import re\nre.search(r'error', 'Disk ERROR', re.IGNORECASE)", returns: "<re.Match object; span=(5, 10), match='ERROR'>" },
    { title: 'Pattern.search with pos',     code: "import re\nre.compile(r'\\d').search('ab12', 2)", returns: "<re.Match object; span=(2, 3), match='1'>" },
    { title: '^ ignores pos',               code: "import re\nprint(re.compile(r'^\\d').search('ab12', 2))", returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'An empty match is not "no match"',
      desc: 'A pattern that can match nothing (x*, \\d?) always succeeds, at position 0. Require at least one character with + instead of *.',
      wrong: { label: "r'\\d*'", code: "import re\nre.search(r'\\d*', 'abc 42')", output: "<re.Match object; span=(0, 0), match=''>" },
      fix:   { label: "r'\\d+'", code: "import re\nre.search(r'\\d+', 'abc 42')", output: "<re.Match object; span=(4, 6), match='42'>" },
    },
    {
      name: 'Passing flags to a compiled pattern',
      desc: 'Flags belong to compile(). re.search with a Pattern object and flags raises ValueError.',
      wrong: { label: 'flags twice', code: "import re\npat = re.compile(r'abc')\nre.search(pat, 'ABC', re.I)", output: 'ValueError: cannot process flags argument with a compiled pattern' },
      fix:   { label: 'flags at compile', code: "import re\npat = re.compile(r'abc', re.I)\npat.search('ABC')", output: "<re.Match object; span=(0, 3), match='ABC'>" },
    },
  ],

  when: {
    use: [
      'Finding whether and where a pattern occurs anywhere in a string',
      'Extracting the first occurrence with its groups',
    ],
    avoid: [
      'Must match at the start → re.match; the whole string → re.fullmatch',
      'Need every occurrence → re.findall or re.finditer',
      'Fixed text → the in operator or str.find',
    ],
  },

  notes: {
    cpython:     'Pattern.search runs the matcher at each position from pos to endpos (SRE search in Modules/_sre/sre_lib.h), with shortcuts when the pattern starts with literal text',
    'pos/endpos': "Pattern.search(string, pos=0, endpos=len): endpos behaves like slicing the string, but pos does not — ^ and lookbehind still see the characters before pos",
    'Truthiness': 'A Match object is always true, even for an empty match; test with is None / is not None',
  },

  related: [
    { name: 're.match',     slug: 'match',     when: 'Anchored at the start' },
    { name: 're.fullmatch', slug: 'fullmatch', when: 'The whole string must match' },
    { name: 're.finditer',  slug: 'finditer',  when: 'Every match, one Match object each' },
    { name: 'Match.group',  slug: 'match-group', when: 'Read the matched text and groups' },
    { name: 'str.find()',   slug: 'find',      when: 'Position of fixed text', category: 'functions' },
    { name: 'AttributeError', slug: 'attributeerror', when: "What .group() on None raises", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does re.search return?',
      a: "A re.Match object for the first match, or None. The Match gives the text (m.group()), its position (m.start(), m.end(), m.span()) and the groups. Its repr looks like <re.Match object; span=(6, 8), match='66'>.",
    },
    {
      q: 'What is the difference between re.search and re.match?',
      a: 're.match only tries at position 0; re.search tries 0, 1, 2 … and returns the first success. Starting a search pattern with \\A gives the same effect as match. Neither needs the pattern to reach the end of the string — that is re.fullmatch.',
    },
    {
      q: 'How do I find all matches instead of the first?',
      a: 'Use re.findall for a list of strings (or group tuples), or re.finditer for an iterator of Match objects with positions.',
    },
    {
      q: 'Why does re.search return a match with an empty string?',
      a: 'The pattern can match zero characters (for example \\d* or (abc)?), and zero characters at position 0 is a valid match. Use + or a required character so the pattern must consume something.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.search',
    meta:  're.search',
  },
};
