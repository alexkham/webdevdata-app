// content/reference/python/stdlib/re/escape.js

export const meta = {
  slug:        'escape',
  name:        're.escape',
  signature:   're.escape(pattern)',
  blurb:       'Backslash-escape every regex metacharacter in a string so it matches literally — for user input and fixed text inside patterns.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're escape python regex escape special characters literal string user input metacharacters dot plus parentheses quote pattern',
};

export const method = {
  slug:      'escape',
  name:      're.escape',
  signature: 're.escape(pattern)',
  returns:   { type: 'str | bytes', desc: 'The text with a backslash before every character that is special in a regular expression.' },

  category:    're function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Any text you did not write yourself — search terms, file names, prices — must go through re.escape before it becomes part of a pattern. Otherwise a dot matches anything and a stray ( is a syntax error.',

  covers: ['escape'],

  cheat: {
    commonCall: "re.escape('1+1=2?')",
    returns:    "'1\\\\+1=2\\\\?' — backslashes before + and ?",
    replaces:   'hand-escaping characters one by one',
    watchOut:   'Escape the text parts only — never the regex parts you add around them',
  },

  parameters: [
    { name: 'pattern', type: 'str | bytes', required: true, default: null, desc: 'Text to be matched literally.' },
  ],

  modes: [
    {
      id: 'escape',
      label: 'escape',
      blurb: 'What re.escape adds. Letters, digits and _ are never escaped.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import re\nre.escape({$text})',
      cases: [
        { id: 'math',  label: 'math',      values: { text: '1+1=2? (yes)' } },
        { id: 'file',  label: 'file name', values: { text: 'report [final].v2.txt' } },
        { id: 'price', label: 'price',     values: { text: '$9.99 | 50% off' } },
        { id: 'plain', label: 'plain word', values: { text: 'hello_world42' } },
      ],
    },
    {
      id: 'literal',
      label: 'with vs without',
      blurb: 'Search for the text as a pattern, then as escaped literal text.',
      params: [
        { name: 'needle', type: 'str', hint: 'text to find', input: 'text' },
        { name: 'text',   type: 'str', hint: 'haystack',     input: 'text' },
      ],
      template: 'import re\n(re.findall({$needle}, {$text}), re.findall(re.escape({$needle}), {$text}))',
      cases: [
        { id: 'dot',   label: 'a dot',      values: { needle: 'a.c', text: 'abc a.c a-c' } },
        { id: 'plus',  label: 'a plus',     values: { needle: '1+1', text: '1+1=2, 11, 111' } },
        { id: 'paren', label: 'a paren',    values: { needle: 'f(x', text: 'call f(x) now' } },
      ],
    },
  ],
  demoExplainer: "Unescaped, a.c is a pattern: the dot matches b and - as well. 1+1 means one or more 1s followed by a 1, so it finds 11 and 111 but not the text 1+1. A lone ( is not even a valid pattern — the whole expression fails with re.PatternError before the escaped version runs.",

  patterns: [
    {
      name: 'Search for user input',
      desc: 'Escape the term, then add your own regex around it.',
      code: "import re\nhits = re.findall(r'\\b' + re.escape(term) + r'\\b', text, re.IGNORECASE)",
    },
    {
      name: 'Match any of several literal words',
      desc: 'Escape each word, join with |. Put longer words first so they win.',
      code: "import re\nwords = sorted(keywords, key=len, reverse=True)\npat = re.compile('|'.join(map(re.escape, words)))",
    },
    {
      name: 'Escaping for the replacement side',
      desc: 're.escape is for patterns. For repl, pass a function instead.',
      code: "import re\nresult = re.sub(re.escape(old), lambda m: new, text)",
    },
  ],

  examples: [
    { title: 'Special characters escaped',  code: "import re\nre.escape('1+1=2? (yes)')", returns: "'1\\\\+1=2\\\\?\\\\ \\\\(yes\\\\)'" },
    { title: 'Letters, digits, _ unchanged', code: "import re\nre.escape('a_b-c d')", returns: "'a_b\\\\-c\\\\ d'" },
    { title: 'Slash and = are left alone',   code: "import re\nre.escape('path/to/file.txt')", returns: "'path/to/file\\\\.txt'" },
    { title: 'Literal search',               code: "import re\nre.findall(re.escape('a.c'), 'abc a.c')", returns: "['a.c']" },
    { title: 'Unescaped dot matches anything', code: "import re\nre.findall('a.c', 'abc a.c')", returns: "['abc', 'a.c']" },
    { title: 'Bytes work too',               code: "import re\nre.escape(b'a.b')", returns: "b'a\\\\.b'" },
  ],

  pitfalls: [
    {
      name: 'User text straight into a pattern',
      desc: 'An unbalanced parenthesis in the search term is a pattern error.',
      wrong: { label: 'raw input', code: "import re\nterm = 'f(x'\nre.search(term, 'call f(x) now')", output: 're.PatternError: missing ), unterminated subpattern at position 1' },
      fix:   { label: 're.escape', code: "import re\nterm = 'f(x'\nre.search(re.escape(term), 'call f(x) now')", output: "<re.Match object; span=(5, 8), match='f(x'>" },
    },
    {
      name: 'Escaping the whole pattern',
      desc: 'Only the literal part should be escaped — escaping \\d too turns it into a literal backslash + d.',
      wrong: { label: 'escape(all)', code: "import re\nprint(re.search(re.escape(r'v\\d'), 'v1'))", output: 'None' },
      fix:   { label: 'escape(part)', code: "import re\nre.search(re.escape('v') + r'\\d', 'v1')", output: "<re.Match object; span=(0, 2), match='v1'>" },
    },
  ],

  when: {
    use: [
      'Putting user-supplied or data-derived text inside a pattern',
      'Building an alternation from a list of literal words',
    ],
    avoid: [
      'Only literal search, no other regex parts → str.find / in / str.replace',
      'Escaping a replacement string → pass a function as repl instead',
    ],
  },

  notes: {
    cpython:  "str.translate with a map of the characters ()[]{}?*+-|^$\\.&~# and whitespace (space, \\t, \\n, \\r, \\v, \\f) — Lib/re/__init__.py",
    'Since 3.7': 'Only characters that can be special in a regex are escaped; before 3.7 characters such as ! , / : ; = @ were escaped too',
    'Since 3.3': 'The _ character is no longer escaped',
  },

  related: [
    { name: 're.search', slug: 'search', when: 'Use the escaped text in a search' },
    { name: 're.sub',    slug: 'sub',    when: 'Literal replacement via a function' },
    { name: 'str.find()', slug: 'find',  when: 'Literal search without regex', category: 'functions' },
    { name: 'str.replace()', slug: 'replace', when: 'Literal replacement without regex', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I match a literal dot or other special character in a regex?',
      a: "Escape it with a backslash in a raw string, r'\\.', or let re.escape do it for text you did not write: re.escape('3.14') gives '3\\\\.14'.",
    },
    {
      q: 'Which characters does re.escape escape?',
      a: 'Since Python 3.7 only those that can have a special meaning: ( ) [ ] { } ? * + - | ^ $ \\ . & ~ # and whitespace. Letters, digits, _ and characters like / = : , are left alone.',
    },
    {
      q: 'Why does my search term crash re.search?',
      a: 'It contains a metacharacter, such as an unbalanced ( or a leading *. Wrap it: re.search(re.escape(term), text).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.escape',
    meta:  're.escape',
  },
};
