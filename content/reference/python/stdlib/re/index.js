// content/reference/python/stdlib/re/index.js — the re module hub

export const meta = {
  slug:        'index',
  name:        're',
  signature:   'import re',
  blurb:       'Regular expressions: search text for patterns, extract parts with groups, replace and split by pattern — search, findall, sub, split, compile.',
  category:    'text',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're module python regex regular expression pattern match search findall sub replace split compile raw string backslash groups named groups lookahead lookbehind greedy lazy catastrophic backtracking',
};

export const method = {
  slug: 'index',
  name: 're',

  category:    'Text',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  coverClasses: ['Pattern', 'Match'],

  subtitle: "A pattern language for text. search finds the first match, findall collects them all, sub replaces, split cuts — and every pattern belongs in a raw string: r'\\d+', not '\\d+'.",

  imports: ['import re', "pattern = re.compile(r'\\d+')"],
  facts: [
    { label: 'Workhorses', value: 'search, match, fullmatch, findall, finditer, sub, subn, split, compile, escape' },
    { label: 'Objects',    value: 're.Pattern (a compiled pattern) and re.Match (one successful match); no match returns None' },
    { label: 'Engine',     value: 'Backtracking matcher in C (Modules/_sre), Perl-style syntax; str patterns are Unicode-aware by default' },
    { label: 'Errors',     value: 're.PatternError (alias re.error) for a bad pattern — with the position of the problem' },
  ],

  modes: [
    {
      id: 'search',
      label: 'search',
      blurb: 'The first place in the text where the pattern matches — or None.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to search',       input: 'text' },
      ],
      template: 'import re\nm = re.search({$pattern}, {$text})\nm.group() if m else None',
      cases: [
        { id: 'date',   label: 'a date',       values: { pattern: '\\d{4}-\\d{2}-\\d{2}', text: 'Invoice due 2026-09-29, paid 2026-10-02' } },
        { id: 'email',  label: 'an email',     values: { pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.]+', text: 'Contact: ada.lovelace@example.org (office)' } },
        { id: 'word',   label: 'whole word',   values: { pattern: '\\bcat\\b', text: 'concatenate the cat' } },
        { id: 'none',   label: 'no match',     values: { pattern: '\\d+', text: 'no digits here' } },
        { id: 'broken', label: 'broken pattern', values: { pattern: '(\\d+', text: 'abc 123' } },
      ],
    },
    {
      id: 'findall',
      label: 'findall',
      blurb: 'Every non-overlapping match, left to right. Add a group and you get the groups instead.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to scan',         input: 'text' },
      ],
      template: 'import re\nre.findall({$pattern}, {$text})',
      cases: [
        { id: 'nums',   label: 'numbers',          values: { pattern: '\\d+', text: 'Order 66 shipped 3 boxes, 120 kg' } },
        { id: 'group',  label: 'one group',        values: { pattern: '(\\w+)@', text: 'ada@example.org, bob@test.io' } },
        { id: 'groups', label: 'two groups',       values: { pattern: '(\\w+)=(\\d+)', text: 'x=1, y=22, z=333' } },
        { id: 'words',  label: 'Unicode words',    values: { pattern: '\\w+', text: 'Grüße aus Zürich!' } },
      ],
    },
    {
      id: 'sub',
      label: 'sub',
      blurb: 'Replace every match. In the replacement, \\1 or \\g<name> inserts what a group matched.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'repl',    type: 'str', hint: 'replacement template', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to change',       input: 'text' },
      ],
      template: 'import re\nre.sub({$pattern}, {$repl}, {$text})',
      cases: [
        { id: 'spaces', label: 'squeeze spaces', values: { pattern: '\\s+', repl: ' ', text: 'too    many   \t spaces' } },
        { id: 'date',   label: 'reorder a date', values: { pattern: '(\\d{4})-(\\d{2})-(\\d{2})', repl: '\\3.\\2.\\1', text: 'due 2026-09-29' } },
        { id: 'mask',   label: 'mask digits',    values: { pattern: '\\d(?=\\d{4})', repl: '*', text: 'card 4111111111111111' } },
        { id: 'badref', label: 'bad group ref',  values: { pattern: '(\\w+)', repl: '\\2', text: 'hello' } },
      ],
    },
    {
      id: 'split',
      label: 'split',
      blurb: 'Cut the text wherever the pattern matches. A capturing group keeps the separators in the result.',
      params: [
        { name: 'pattern', type: 'str', hint: 'the separator pattern', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to split',         input: 'text' },
      ],
      template: 'import re\nre.split({$pattern}, {$text})',
      cases: [
        { id: 'mixed', label: 'mixed separators', values: { pattern: '[,;]\\s*', text: 'red, green;blue,  alpha' } },
        { id: 'keep',  label: 'keep separators',  values: { pattern: '([+-])', text: '3+4-10+2' } },
        { id: 'ws',    label: 'whitespace',       values: { pattern: '\\s+', text: '  leading and trailing  ' } },
      ],
    },
  ],
  demoExplainer: "The code shows each pattern the way Python's repr() writes it, so every backslash appears doubled: '\\\\d+' in the box is exactly the string you would type as r'\\d+'. Two results worth a second look: findall with groups returns the groups, not the whole match, and splitting on whitespace leaves an empty string at each end when the text starts or ends with a separator.",

  patterns: [
    {
      name: 'Compile once, reuse many times',
      desc: 'A Pattern object has the same methods as the module functions.',
      code: "import re\nDATE = re.compile(r'(\\d{4})-(\\d{2})-(\\d{2})')\nfor line in lines:\n    if m := DATE.search(line):\n        year, month, day = m.groups()",
    },
    {
      name: 'Validate a whole string',
      desc: 'fullmatch anchors both ends — no ^ and $ needed, and no trailing-newline surprise.',
      code: "import re\ndef is_zip(s):\n    return re.fullmatch(r'\\d{5}(-\\d{4})?', s) is not None",
    },
    {
      name: 'Named groups for readable extraction',
      desc: '(?P<name>...) plus groupdict() gives you a dict.',
      code: "import re\nm = re.search(r'(?P<user>[\\w.]+)@(?P<host>[\\w.-]+)', text)\nif m:\n    info = m.groupdict()  # {'user': ..., 'host': ...}",
    },
    {
      name: 'Defuse catastrophic backtracking',
      desc: 'A quantified group containing a quantifier can try exponentially many splits before failing. Simplify it, or forbid giving characters back (3.11+).',
      code: "import re\nBAD  = re.compile(r'^(a+)+$')     # near-misses like 'aaaa…ab' take exponential time\nGOOD = re.compile(r'^a+$')        # same strings, linear\nALSO = re.compile(r'^(?:a+)++$')  # possessive: no backtracking into the group",
    },
    {
      name: 'A readable pattern with VERBOSE',
      desc: 'Whitespace is ignored and # starts a comment.',
      code: "import re\nPHONE = re.compile(r'''\n    (\\d{3})   # area code\n    [-.\\s]?\n    (\\d{4})   # number\n''', re.VERBOSE)",
    },
  ],

  examples: [
    { title: 'search returns a Match object',  code: "import re\nre.search(r'\\d+', 'abc123def45')", returns: "<re.Match object; span=(3, 6), match='123'>" },
    { title: 'findall returns strings',        code: "import re\nre.findall(r'\\d+', 'a1 b22 c333')", returns: "['1', '22', '333']" },
    { title: 'Groups change what findall returns', code: "import re\nre.findall(r'(\\w)(\\d+)', 'a1 b22 c333')", returns: "[('a', '1'), ('b', '22'), ('c', '333')]" },
    { title: 'sub with group references',      code: "import re\nre.sub(r'(\\d{4})-(\\d{2})-(\\d{2})', r'\\3/\\2/\\1', 'due 2026-09-29')", returns: "'due 29/09/2026'" },
    { title: 'split on several separators',    code: "import re\nre.split(r'[,;]\\s*', 'a, b;c,  d')", returns: "['a', 'b', 'c', 'd']" },
    { title: 'A compiled pattern',             code: "import re\nre.compile(r'\\d+', re.IGNORECASE | re.MULTILINE)", returns: "re.compile('\\\\d+', re.IGNORECASE|re.MULTILINE)" },
    { title: 'Possessive a++ never gives back (3.11+)', code: "import re\n(re.match(r'a+a', 'aaaa'), re.match(r'a++a', 'aaaa'))", returns: "(<re.Match object; span=(0, 4), match='aaaa'>, None)" },
    { title: 'A broken pattern says where',    code: "import re\nre.compile(r'(\\d+')", returns: 're.PatternError: missing ), unterminated subpattern at position 0' },
  ],

  pitfalls: [
    {
      name: 'Forgetting the r prefix',
      desc: "In a normal string '\\b' is a backspace character, so the regex engine never sees \\b (word boundary). The raw string passes the backslash through untouched.",
      wrong: { label: "'\\bcat\\b'",  code: "import re\nprint(re.search('\\bcat\\b', 'a cat here'))", output: 'None' },
      fix:   { label: "r'\\bcat\\b'", code: "import re\nre.search(r'\\bcat\\b', 'a cat here')", output: "<re.Match object; span=(2, 5), match='cat'>" },
    },
    {
      name: 'Using match when you meant search',
      desc: 'match only tries position 0. The digits are there — just not at the start.',
      wrong: { label: 're.match',  code: "import re\nre.match(r'\\d+', 'order 66') is None", output: 'True' },
      fix:   { label: 're.search', code: "import re\nre.search(r'\\d+', 'order 66').group()", output: "'66'" },
    },
    {
      name: 'Calling .group() on None',
      desc: 'No match is None, not an empty match. Check before you use it.',
      wrong: { label: 'no check', code: "import re\nre.search(r'\\d+', 'none here').group()", output: "AttributeError: 'NoneType' object has no attribute 'group'" },
      fix:   { label: 'check first', code: "import re\nm = re.search(r'\\d+', 'none here')\nm.group() if m else 'no number'", output: "'no number'" },
    },
  ],

  when: {
    use: [
      'Finding text by shape rather than exact content: dates, IDs, emails, log fields',
      'Replacing or splitting with rules str.replace and str.split cannot express',
      'Extracting several parts at once with groups',
    ],
    avoid: [
      'A fixed substring → in, str.find, str.replace, str.startswith (faster and clearer)',
      'Splitting on runs of whitespace → str.split() with no argument (drops the empty ends)',
      'HTML, JSON, CSV or other nested/quoted formats → a real parser (html.parser, json, csv)',
    ],
  },

  notes: {
    cpython:        'Lib/re/_parser.py parses the pattern, Lib/re/_compiler.py turns it into opcodes, and the C engine in Modules/_sre runs them with backtracking',
    'Raw strings':  "Python string escapes are processed before re sees the pattern. r'\\d' is backslash + d; '\\d' only works by accident (and warns since 3.12), '\\b' silently becomes a backspace",
    'Cache':        'Module-level functions compile and cache patterns (up to 512), so compile() is about clarity and reuse, not a big speed-up',
    'Backtracking': 'Nested quantifiers such as (a+)+ can take exponential time on a near-miss. Use possessive quantifiers (a++) or atomic groups (?>...) (3.11+), or rewrite the pattern',
    'Unicode':      'For str patterns \\d, \\w, \\s and case-insensitive matching follow Unicode; pass re.ASCII to restrict them to ASCII',
  },

  related: [
    { name: 're.search',  slug: 'search',  when: 'The first match anywhere' },
    { name: 're.sub',     slug: 'sub',     when: 'Replace by pattern' },
    { name: 're.findall', slug: 'findall', when: 'All matches as a list' },
    { name: 'Flags',      slug: 'flags',   when: 'IGNORECASE, MULTILINE, DOTALL, VERBOSE, ASCII' },
    { name: 'str.replace()', slug: 'replace', when: 'Fixed-text replacement, no regex needed', category: 'functions' },
    { name: 'str.split()',   slug: 'split',   when: 'Split on a fixed separator or whitespace', category: 'functions' },
    { name: 'match statement', slug: 'match', when: 'Structural pattern matching — not regex', category: 'keywords' },
    { name: 'json module', slug: 'json', when: 'Parse JSON instead of regex-scraping it', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why should regex patterns be raw strings in Python?',
      a: "Because Python processes backslash escapes in normal strings first. '\\b' becomes a backspace, '\\1' becomes the character with code 1, and unknown escapes like '\\d' raise a SyntaxWarning since Python 3.12. In r'\\b\\d+' every backslash reaches the regex engine unchanged.",
    },
    {
      q: 'What is the difference between re.search and re.match?',
      a: 'search scans the whole string and returns the first match anywhere; match only tries at the beginning. fullmatch goes one step further and requires the pattern to match the entire string.',
    },
    {
      q: 'Why does re.findall return tuples (or only part of my match)?',
      a: 'If the pattern has capturing groups, findall returns the groups instead of the whole match: one group gives a list of strings, several give a list of tuples. Use (?:...) for grouping without capturing, or finditer when you need both.',
    },
    {
      q: 'Should I use re.compile?',
      a: 'It is optional: the module functions compile and cache patterns for you. Compile when a pattern is reused in many places or you want to name it — a module-level constant like DATE = re.compile(...) documents intent.',
    },
    {
      q: 'Why is my regex so slow?',
      a: 'Usually catastrophic backtracking: nested or overlapping quantifiers like (a+)+ or (\\w+\\s?)+ can try exponentially many ways to split the text before failing. Make the alternatives mutually exclusive, or use possessive quantifiers and atomic groups (Python 3.11+).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html',
    meta:  're — Regular expression operations',
  },
};
