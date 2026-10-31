// content/reference/python/stdlib/fnmatch/fnmatchcase.js — fnmatch.fnmatchcase

export const meta = {
  slug:        'fnmatchcase',
  name:        'fnmatch.fnmatchcase',
  signature:   'fnmatch.fnmatchcase(name, pat)',
  blurb:       'Test a name against a shell-style pattern, always case-sensitively and without os.path.normcase — the same answer on every operating system.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'fnmatchcase fnmatch.fnmatchcase python case sensitive wildcard match pattern portable same result windows linux uppercase lowercase extension',
};

export const method = {
  slug:      'fnmatchcase',
  name:      'fnmatch.fnmatchcase',
  signature: 'fnmatch.fnmatchcase(name, pat)',
  returns:   { type: 'bool', desc: 'True if the regex from translate(pat) matches the whole name.' },

  category:    'fnmatch function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'The portable one: no normcase, so A.TXT never matches *.txt and a \\ in the pattern is just a backslash, on Windows too. fnmatch() is this function plus os.path.normcase on both arguments.',

  covers: ['fnmatchcase'],

  cheat: {
    commonCall: "fnmatch.fnmatchcase(name, 'IMG_*.JPG')",
    returns:    'True or False',
    replaces:   'fnmatch() when results must not depend on the OS',
    watchOut:   "case-sensitive even on Windows: 'photo.jpg' does not match '*.JPG'",
  },

  parameters: [
    { name: 'name', type: 'str | bytes', required: true, default: null, desc: 'The string to test, used exactly as given.' },
    { name: 'pat',  type: 'str | bytes', required: true, default: null, desc: 'Shell-style pattern; same type as name. Compiled once and cached (lru_cache, 32768 patterns).' },
  ],

  modes: [
    {
      id: 'match',
      label: 'match',
      blurb: 'Case counts, and / is an ordinary character.',
      params: [
        { name: 'name',    type: 'str', hint: 'a file name', input: 'text' },
        { name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' },
      ],
      template: 'import fnmatch\nfnmatch.fnmatchcase({$name}, {$pattern})',
      cases: [
        { id: 'upper', label: 'A.TXT vs *.txt',  values: { name: 'A.TXT', pattern: '*.txt' } },
        { id: 'img',   label: 'IMG_????.JPG',    values: { name: 'IMG_0042.JPG', pattern: 'IMG_????.JPG' } },
        { id: 'cap',   label: '[A-Z]*',          values: { name: 'Readme.md', pattern: '[A-Z]*' } },
        { id: 'path',  label: '*.py on a path',  values: { name: 'src/app/main.py', pattern: '*.py' } },
        { id: 'empty', label: 'empty range',     values: { name: 'b', pattern: '[z-a]' } },
      ],
    },
    {
      id: 'select',
      label: 'pick names',
      blurb: 'Case-sensitive selection from a list.',
      params: [
        { name: 'names',   type: 'list[str]', hint: 'names, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' },
      ],
      template: 'import fnmatch\n[n for n in {$names} if fnmatch.fnmatchcase(n, {$pattern})]',
      cases: [
        { id: 'jpg',  label: '*.jpg',        values: { names: 'a.jpg, b.JPG, c.jpeg, d.Jpg', pattern: '*.jpg' } },
        { id: 'both', label: '*.[jJ][pP][gG]', values: { names: 'a.jpg, b.JPG, c.jpeg, d.Jpg', pattern: '*.[jJ][pP][gG]' } },
      ],
    },
  ],
  demoExplainer: "Every character outside the wildcards must match exactly, case included — '*.[jJ][pP][gG]' is how you spell a case-insensitive extension with fnmatchcase alone. A range whose ends are reversed, such as [z-a], is dropped by translate and never matches anything.",

  patterns: [
    {
      name: 'Portable case-insensitive match',
      desc: 'Lower-case both sides; the result is the same on Windows, Linux and macOS.',
      code: "import fnmatch\ndef imatch(name, pattern):\n    return fnmatch.fnmatchcase(name.lower(), pattern.lower())",
    },
    {
      name: 'Match keys, not files',
      desc: 'fnmatchcase works on any strings: config keys, logger names, URL paths.',
      code: "import fnmatch\nselected = {k: v for k, v in settings.items() if fnmatch.fnmatchcase(k, 'db.*')}",
    },
  ],

  examples: [
    { title: 'Case counts',               code: "import fnmatch\nfnmatch.fnmatchcase('A.TXT', '*.txt')", returns: 'False' },
    { title: 'Exact case matches',        code: "import fnmatch\nfnmatch.fnmatchcase('IMG_0042.JPG', 'IMG_????.JPG')", returns: 'True' },
    { title: 'Upper-case first letter',   code: "import fnmatch\n[fnmatch.fnmatchcase(n, '[A-Z]*') for n in ['Readme.md', 'readme.md']]", returns: '[True, False]' },
    { title: '/ is an ordinary character', code: "import fnmatch\nfnmatch.fnmatchcase('src/app/main.py', 'src/*.py')", returns: 'True' },
    { title: 'Backslash is literal',      code: "import fnmatch\nfnmatch.fnmatchcase('a\\\\b', 'a\\\\b'), fnmatch.fnmatchcase('a/b', 'a\\\\b')", returns: '(True, False)' },
    { title: '? counts code points',      code: "import fnmatch\nfnmatch.fnmatchcase('é.txt', '?.txt')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Forgetting that fnmatchcase is strict about case',
      desc: 'Camera files often use upper-case extensions. A lower-case pattern silently skips them.',
      wrong: { label: '*.jpg', code: "import fnmatch\n[n for n in ['a.jpg', 'B.JPG'] if fnmatch.fnmatchcase(n, '*.jpg')]", output: "['a.jpg']" },
      fix:   { label: 'compare lower()', code: "import fnmatch\n[n for n in ['a.jpg', 'B.JPG'] if fnmatch.fnmatchcase(n.lower(), '*.jpg')]", output: "['a.jpg', 'B.JPG']" },
    },
    {
      name: 'Passing something that is not a string',
      desc: 'fnmatchcase hands name straight to a compiled regex, so an int or a Path fails. Convert with str() (or os.fspath) first.',
      wrong: { label: 'int', code: "import fnmatch\nfnmatch.fnmatchcase(2024, '20*')", output: "TypeError: expected string or bytes-like object, got 'int'" },
      fix:   { label: 'str()', code: "import fnmatch\nfnmatch.fnmatchcase(str(2024), '20*')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Results that must be identical on every platform (tests, build tools, config matching)',
      'Matching strings that are not file names — keys, tags, logger names',
    ],
    avoid: [
      'Following the local file system case rule → fnmatch',
      'Patterns that need alternation or repetition → re',
    ],
  },

  notes: {
    cpython:   'def fnmatchcase(name, pat): match = _compile_pattern(pat); return match(name) is not None — _compile_pattern is re.compile(translate(pat)).match, cached',
    'Regex':   'The match uses re.match with a pattern that ends in \\Z, so the entire name must match; (?s:...) lets * and ? match newlines too',
    'bytes':   'A bytes pattern is decoded as Latin-1, translated, and re-encoded, so bytes and str patterns behave the same byte for byte',
  },

  related: [
    { name: 'fnmatch.fnmatch',   slug: 'fnmatch',   when: 'With os.path.normcase' },
    { name: 'fnmatch.translate', slug: 'translate', when: 'See the regex' },
    { name: 'fnmatch.filter',    slug: 'filter',    when: 'Many names at once' },
    { name: 'str.casefold()',    slug: 'str-casefold', when: 'Aggressive lower-casing for comparisons', category: 'functions' },
    { name: 'fnmatch module',    slug: 'fnmatch',   when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between fnmatch and fnmatchcase?',
      a: 'fnmatch(name, pat) is fnmatchcase(os.path.normcase(name), os.path.normcase(pat)). On Linux and macOS normcase does nothing, so the two are identical there; on Windows fnmatch ignores case and treats / and \\ alike, while fnmatchcase does neither.',
    },
    {
      q: 'How do I do a case-insensitive wildcard match that works on every OS?',
      a: "Lower-case both strings and call fnmatchcase: fnmatch.fnmatchcase(name.lower(), pattern.lower()). Alternatively compile fnmatch.translate(pattern) with re.IGNORECASE.",
    },
    {
      q: 'Can fnmatchcase match a newline?',
      a: "Yes. The translated regex is wrapped in (?s:...), so * and ? match \\n like any other character: fnmatchcase('a\\nb', 'a?b') is True.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fnmatch.html#fnmatch.fnmatchcase',
    meta:  'fnmatch.fnmatchcase',
  },
};
