// content/reference/python/stdlib/fnmatch/translate.js — fnmatch.translate

export const meta = {
  slug:        'translate',
  name:        'fnmatch.translate',
  signature:   'fnmatch.translate(pat)',
  blurb:       'Convert a shell-style wildcard pattern into the regular expression fnmatch uses — for re.match, re.IGNORECASE, or joining many patterns with |.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'fnmatch translate fnmatch.translate python convert wildcard to regex glob pattern to regular expression (?s: \\Z atomic group re.match ignorecase combine patterns',
};

export const method = {
  slug:      'translate',
  name:      'fnmatch.translate',
  signature: 'fnmatch.translate(pat)',
  returns:   { type: 'str', desc: 'A regular expression string, (?s:...)\\Z around the converted pattern. Not compiled.' },

  category:    'fnmatch function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'What fnmatch does under the hood, exposed: * becomes .*, ? becomes ., [!x] becomes [^x], everything else is escaped. Use it with re.match — the regex already ends in \\Z, so the whole name must match.',

  covers: ['translate'],

  cheat: {
    commonCall: "re.compile(fnmatch.translate('*.txt'), re.IGNORECASE)",
    returns:    "'(?s:.*\\\\.txt)\\\\Z' — a str, compile it yourself",
    replaces:   'hand-converting wildcards to regex',
    watchOut:   'the exact text changes between Python versions; match with it, do not compare it',
  },

  parameters: [
    { name: 'pat', type: 'str', required: true, default: null, desc: 'Shell-style pattern. The documentation says it is expected to be a str (fnmatch itself decodes bytes patterns as Latin-1 before calling it).' },
  ],

  modes: [
    {
      id: 'translate',
      label: 'translate',
      blurb: 'The regex text CPython 3.13 returns.',
      params: [{ name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' }],
      template: 'import fnmatch\nfnmatch.translate({$pattern})',
      cases: [
        { id: 'txt',   label: '*.txt',      values: { pattern: '*.txt' } },
        { id: 'stars', label: 'a*b*c',      values: { pattern: 'a*b*c' } },
        { id: 'neg',   label: '[!a-c]x',    values: { pattern: '[!a-c]x' } },
        { id: 'open',  label: 'unclosed [', values: { pattern: 'file[1.txt' } },
        { id: 'rev',   label: '[z-a]',      values: { pattern: '[z-a]' } },
        { id: 'lit',   label: 'a.b c',      values: { pattern: 'a.b c' } },
      ],
    },
    {
      id: 'match',
      label: 're.match',
      blurb: 'Compile the result and test names — the same answers as fnmatchcase.',
      params: [
        { name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' },
        { name: 'names',   type: 'list[str]', hint: 'names, comma-separated', input: 'csv' },
      ],
      template: 'import fnmatch, re\nregex = fnmatch.translate({$pattern})\n[n for n in {$names} if re.match(regex, n)]',
      cases: [
        { id: 'txt',  label: '*.txt',     values: { pattern: '*.txt', names: 'notes.txt, notes.txt.bak, TODO.TXT' } },
        { id: 'qq',   label: 'IMG_??.*',  values: { pattern: 'IMG_??.*', names: 'IMG_01.png, IMG_1.png, IMG_123.jpg' } },
      ],
    },
    {
      id: 'join',
      label: 'many patterns',
      blurb: 'Join several translations with | and match once.',
      params: [
        { name: 'patterns', type: 'list[str]', hint: 'patterns, comma-separated', input: 'csv' },
        { name: 'names',    type: 'list[str]', hint: 'names, comma-separated', input: 'csv' },
      ],
      template: "import fnmatch, re\nregex = '|'.join(fnmatch.translate(p) for p in {$patterns})\n[n for n in {$names} if re.match(regex, n)]",
      cases: [
        { id: 'junk', label: 'junk files', values: { patterns: '*.tmp, *.log, core.*', names: 'a.tmp, b.txt, app.log, core.1234, score.txt' } },
      ],
    },
  ],
  demoExplainer: "Every translation is wrapped in (?s:...)\\Z: s lets . match a newline, \\Z forces the match to reach the end. A * between fixed parts becomes an atomic group (?>.*?b) — it takes the first b and never backtracks into it, so patterns like *a*a*a*b cannot cause catastrophic backtracking. An unclosed [ is escaped as \\[, a reversed range like [z-a] becomes (?!), which can never match, and literal characters go through re.escape (the space becomes \\ followed by a space).",

  patterns: [
    {
      name: 'Case-insensitive wildcard on any OS',
      desc: 'Add re.IGNORECASE when compiling.',
      code: "import fnmatch, re\nis_image = re.compile(fnmatch.translate('*.jpg'), re.IGNORECASE).match\nis_image('PHOTO.JPG')",
    },
    {
      name: 'One regex for an ignore list',
      desc: 'Each translation is a self-contained group ending in \\Z, so they can be joined with |. The docs do not promise it, but a comment in Lib/fnmatch.py says people rely on it and the code keeps it working.',
      code: "import fnmatch, re\nIGNORE = re.compile('|'.join(fnmatch.translate(p) for p in ['*.pyc', '__pycache__', '.git']))\nkeep = [n for n in names if not IGNORE.match(n)]",
    },
  ],

  examples: [
    { title: 'A simple pattern',              code: "import fnmatch\nfnmatch.translate('*.txt')", returns: "'(?s:.*\\\\.txt)\\\\Z'" },
    { title: 'Stars between fixed parts',     code: "import fnmatch\nfnmatch.translate('a*b*c')", returns: "'(?s:a(?>.*?b).*c)\\\\Z'" },
    { title: 'Negated range',                 code: "import fnmatch\nfnmatch.translate('[!a-c]x')", returns: "'(?s:[^a-c]x)\\\\Z'" },
    { title: 'An unclosed bracket is literal', code: "import fnmatch\nfnmatch.translate('[')", returns: "'(?s:\\\\[)\\\\Z'" },
    { title: 'Use it with re.match',          code: "import fnmatch, re\nre.match(fnmatch.translate('*.txt'), 'notes.txt')", returns: "<re.Match object; span=(0, 9), match='notes.txt'>" },
    { title: 'Case-insensitive',              code: "import fnmatch, re\nre.compile(fnmatch.translate('*.TXT'), re.IGNORECASE).match('a.txt') is not None", returns: 'True' },
    { title: 'Consecutive stars collapse',    code: "import fnmatch\nfnmatch.translate('**')", returns: "'(?s:.*)\\\\Z'" },
  ],

  pitfalls: [
    {
      name: 'Using re.search instead of re.match',
      desc: 'The regex is anchored at the end (\\Z) but not at the start: re.search finds it in the middle of a longer name. fnmatch itself uses match.',
      wrong: { label: 're.search', code: "import fnmatch, re\nbool(re.search(fnmatch.translate('a?c'), 'xxabc'))", output: 'True' },
      fix:   { label: 're.match', code: "import fnmatch, re\nbool(re.match(fnmatch.translate('a?c'), 'xxabc'))", output: 'False' },
    },
    {
      name: 'Expecting * to stay inside one folder',
      desc: "fnmatch's * becomes .*, which happily crosses /. glob.translate (3.13+) builds path-aware regexes.",
      wrong: { label: 'fnmatch.translate', code: "import fnmatch, re\nbool(re.match(fnmatch.translate('src/*.py'), 'src/sub/app.py'))", output: 'True' },
      fix:   { label: 'glob.translate', code: "import glob, re\nbool(re.match(glob.translate('src/*.py', seps='/'), 'src/sub/app.py'))", output: 'False' },
    },
  ],

  when: {
    use: [
      'Case-insensitive or otherwise customised matching (compile with flags)',
      'One compiled regex for a whole list of patterns',
      'Showing users what their wildcard means',
    ],
    avoid: [
      'Plain matching → fnmatch / fnmatchcase (they cache the compiled regex for you)',
      'Path patterns with folders, ** and hidden-file rules → glob.translate (3.13+)',
      'Storing or comparing the regex text — it differs between Python versions',
    ],
  },

  notes: {
    cpython:          'Lib/fnmatch.py: _translate turns the pattern into pieces (STAR, ., [...] sets, re.escape(c) literals) and _join_translated_parts builds the string; consecutive * collapse into one',
    'Version':        'The text shown here is CPython 3.13 (3.12 produces the same). The current documentation shows the regex ending in \\z instead of \\Z and uses re.prefixmatch() in its example',
    'Brackets':       'Backslashes inside [...] are doubled, hyphens that do not form a range are escaped, & ~ | are escaped so they never act as set operations, and reversed ranges are removed',
  },

  related: [
    { name: 'fnmatch.fnmatchcase', slug: 'fnmatchcase', when: 'Uses this regex directly' },
    { name: 'glob.translate',      slug: 'translate',   when: 'Path-aware version (3.13+)', category: 'stdlib/glob' },
    { name: 're.match',            slug: 'match',       when: 'Run the regex', category: 'stdlib/re' },
    { name: 're.compile',          slug: 'compile',     when: 'Compile once with flags', category: 'stdlib/re' },
    { name: 're.escape',           slug: 'escape',      when: 'How literal characters are escaped', category: 'stdlib/re' },
  ],

  faq: [
    {
      q: 'How do I convert a glob pattern to a regex in Python?',
      a: "fnmatch.translate('*.txt') returns '(?s:.*\\\\.txt)\\\\Z' (Python 3.13). Compile it with re.compile and test names with .match(). For patterns with folders, use glob.translate(pattern, seps='/') (3.13+), where * stops at a separator.",
    },
    {
      q: 'What do (?s: and \\Z mean in the translated pattern?',
      a: '(?s:...) is an inline DOTALL group, so . also matches a newline; \\Z matches only at the very end of the string. Together with re.match (anchored at the start) the whole name has to match.',
    },
    {
      q: 'What is (?>.*?b) in the output?',
      a: 'An atomic group (supported by re since Python 3.11). It matches the shortest run up to the first b and then never backtracks into it, so a pattern with many * cannot trigger catastrophic backtracking. For a yes/no answer this is safe: whatever follows starts with another .*, so the first b is always a valid choice.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fnmatch.html#fnmatch.translate',
    meta:  'fnmatch.translate',
  },
};
