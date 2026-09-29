// content/reference/python/stdlib/re/compile.js

export const meta = {
  slug:        'compile',
  name:        're.compile',
  signature:   're.compile(pattern, flags=0)',
  blurb:       'Compile a regular expression into a reusable Pattern object; re.purge clears the cache the module functions use.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're compile python regex compile pattern object precompile reuse performance cache purge re.purge clear cache flags compiled pattern',
};

export const method = {
  slug:      'compile',
  name:      're.compile',
  signature: 're.compile(pattern, flags=0)',
  returns:   { type: 're.Pattern', desc: 'A compiled pattern with search, match, fullmatch, findall, finditer, sub, subn and split methods.' },

  category:    're function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Turn a pattern string into a Pattern object once, then call its methods. Errors in the pattern surface here, at compile time. re.purge() empties the internal cache of patterns compiled by the module-level functions.',

  covers: ['compile', 'purge'],

  cheat: {
    commonCall: "WORD = re.compile(r'\\b\\w+\\b', re.IGNORECASE)",
    returns:    "re.compile('\\\\b\\\\w+\\\\b', re.IGNORECASE) — a re.Pattern",
    replaces:   'repeating the same pattern string (and flags) in many calls',
    watchOut:   'Flags go to compile(), not to the Pattern methods',
  },

  parameters: [
    { name: 'pattern', type: 'str | bytes', required: true,  default: null, desc: 'The regular expression. A str pattern matches str; a bytes pattern matches bytes.' },
    { name: 'flags',   type: 're.RegexFlag | int', required: false, default: '0', desc: 'Combine with |: re.IGNORECASE | re.MULTILINE. Inline flags like (?i) at the start work too.' },
  ],

  modes: [
    {
      id: 'compile',
      label: 'compile',
      blurb: 'The Pattern repr shows the pattern and any flags; .groups counts capturing groups.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
      ],
      template: 'import re\npat = re.compile({$pattern})\n(pat, pat.groups, pat.groupindex)',
      cases: [
        { id: 'simple', label: 'no groups',     values: { pattern: '\\d+' } },
        { id: 'groups', label: 'named groups',  values: { pattern: '(?P<user>\\w+)@(?P<host>[\\w.]+)' } },
        { id: 'inline', label: 'inline flags',  values: { pattern: '(?im)^todo:' } },
        { id: 'bad',    label: 'syntax error',  values: { pattern: '[a-z' } },
      ],
    },
    {
      id: 'reuse',
      label: 'compile once, test many',
      blurb: 'One compiled, case-insensitive pattern applied to a list of strings.',
      params: [
        { name: 'pattern', type: 'str',       hint: 'a regular expression', input: 'text' },
        { name: 'values',  type: 'list[str]', hint: 'comma-separated',      input: 'csv' },
      ],
      template: 'import re\npat = re.compile({$pattern}, re.IGNORECASE)\n[v for v in {$values} if pat.search(v)]',
      cases: [
        { id: 'err',  label: 'log levels', values: { pattern: '\\b(error|fatal)\\b', values: 'Error: disk full, all good, FATAL crash, errors=0' } },
        { id: 'ext',  label: 'image files', values: { pattern: '\\.(png|jpe?g)$', values: 'a.PNG, b.txt, c.jpeg, d.jpg.bak' } },
      ],
    },
  ],
  demoExplainer: "The repr repeats your pattern (backslashes doubled, as repr does) and lists flags; inline flags stay inside the pattern text. groupindex maps names to group numbers — it is an empty {} when there are no named groups. 'errors=0' is not a match for \\b(error|fatal)\\b because there is no word boundary between error and s.",

  patterns: [
    {
      name: 'Module-level constants',
      desc: 'Name the pattern once; compile errors show up at import time.',
      code: "import re\nEMAIL = re.compile(r'[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+')\nISO_DATE = re.compile(r'\\d{4}-\\d{2}-\\d{2}')",
    },
    {
      name: 'Flags in the pattern itself',
      desc: 'Inline flags travel with the pattern string (config files, databases).',
      code: "import re\npat = re.compile(r'(?i)^subject:\\s*(.*)$', re.MULTILINE)",
    },
    {
      name: 'Clearing the cache',
      desc: 'Rarely needed — e.g. in a long-running process that compiled many one-off patterns.',
      code: 'import re\nre.purge()',
    },
  ],

  examples: [
    { title: 'A Pattern object',              code: "import re\nre.compile(r'\\d+')", returns: "re.compile('\\\\d+')" },
    { title: 'Flags in the repr',             code: "import re\nre.compile(r'\\d+', re.I | re.M)", returns: "re.compile('\\\\d+', re.IGNORECASE|re.MULTILINE)" },
    { title: 'Same methods as the module',    code: "import re\npat = re.compile(r'\\d+')\n(pat.findall('a1b22'), pat.sub('#', 'a1b22'))", returns: "(['1', '22'], 'a#b#')" },
    { title: 'Counting groups',               code: "import re\nre.compile(r'(a)(?P<n>b)(?:c)').groups", returns: '2' },
    { title: 'str patterns get UNICODE',      code: "import re\nre.compile(r'\\d+').flags", returns: '32' },
    { title: 'Errors happen at compile time', code: "import re\nre.compile(r'a{2,1}')", returns: 're.PatternError: min repeat greater than max repeat at position 2' },
    { title: 'purge returns None',            code: 'import re\nprint(re.purge())', returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Flags on the method call',
      desc: "Pattern.search's second argument is pos, not flags — re.I (value 2) silently becomes a start position.",
      wrong: { label: 'pat.search(s, re.I)', code: "import re\npat = re.compile(r'hello')\nprint(pat.search('Hello hello', re.I))", output: "<re.Match object; span=(6, 11), match='hello'>" },
      fix:   { label: 'compile(..., re.I)', code: "import re\npat = re.compile(r'hello', re.I)\npat.search('Hello hello')", output: "<re.Match object; span=(0, 5), match='Hello'>" },
    },
    {
      name: 'Compiling inside a hot loop for speed',
      desc: 'The module functions already cache compiled patterns, so compile() in the loop body gains nothing. Hoist it out for clarity.',
      wrong: { label: 'compile per item', code: "import re\n[bool(re.compile(r'\\d').search(s)) for s in ['a1', 'b']]", output: '[True, False]' },
      fix:   { label: 'compile once', code: "import re\nDIGIT = re.compile(r'\\d')\n[bool(DIGIT.search(s)) for s in ['a1', 'b']]", output: '[True, False]' },
    },
  ],

  when: {
    use: [
      'A pattern used in several places or many times — give it a name',
      'Validating patterns early (at import) instead of at first use',
      'Pattern methods with pos/endpos, which the module functions lack',
    ],
    avoid: [
      'A one-off search — re.search(pattern, text) is fine and cached',
      'Expecting a big speed-up: the cache already avoids recompiling',
    ],
  },

  notes: {
    cpython:   'Lib/re/_parser.py builds a parse tree, Lib/re/_compiler.py emits opcodes for the C engine (_sre.compile). re.compile goes through the same cache as the module functions',
    'Cache':   'Compiled patterns are cached by (type, pattern, flags) — up to 512 of them — so repeated module-level calls do not recompile; re.purge() clears them and the replacement-template cache',
    'Flags':   'Pattern.flags includes re.UNICODE (32) for every str pattern without re.ASCII, plus inline flags from the pattern',
    'Types':   'The result is a re.Pattern; a str pattern cannot search bytes and vice versa (TypeError)',
  },

  related: [
    { name: 're.Pattern',  slug: 'pattern-object', when: 'What compile returns: attributes and methods' },
    { name: 'Flags',       slug: 'flags',  when: 'IGNORECASE, MULTILINE, DOTALL, VERBOSE, ASCII' },
    { name: 're.error',    slug: 'error',  when: 'What a bad pattern raises' },
    { name: 're.search',   slug: 'search', when: 'The most common method' },
    { name: 'compile()',   slug: 'compile', when: 'The built-in compile() compiles Python source — unrelated', category: 'functions' },
  ],

  faq: [
    {
      q: 'Is re.compile faster than calling re.search directly?',
      a: 'Only marginally: re.search and friends compile the pattern and keep it in a cache (512 entries), so repeated calls do not recompile. re.compile skips the cache lookup and makes the code clearer.',
    },
    {
      q: 'What does re.compile return?',
      a: "A re.Pattern object. Its repr looks like re.compile('\\\\d+', re.IGNORECASE); it has .pattern, .flags, .groups and .groupindex plus the matching methods.",
    },
    {
      q: 'What does re.purge do?',
      a: 'It clears the module-level caches of compiled patterns and replacement templates. Programs almost never need it.',
    },
    {
      q: 'How do I pass multiple flags to re.compile?',
      a: 'Combine them with |: re.compile(p, re.IGNORECASE | re.MULTILINE), or put them inline at the start of the pattern: (?im).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.compile',
    meta:  're.compile',
  },
};
