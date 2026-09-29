// content/reference/python/stdlib/re/sub.js

export const meta = {
  slug:        'sub',
  name:        're.sub',
  signature:   're.sub(pattern, repl, string, count=0, flags=0)',
  blurb:       'Replace every match of a pattern — with a template that can reuse groups (\\1, \\g<name>) or with a function. subn also returns the count.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're sub subn python regex replace substitute replacement string backreference \\1 \\g<name> \\g<0> function callable count Pattern.sub Pattern.subn invalid group reference bad escape',
};

export const method = {
  slug:      'sub',
  name:      're.sub',
  signature: 're.sub(pattern, repl, string, count=0, flags=0)',
  returns:   { type: 'str', desc: 'A new string with the matches replaced (subn returns a (new_string, number_of_replacements) tuple).' },

  category:    're function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'str.replace with patterns. The replacement is a small template language — \\1 and \\g<name> insert groups — or a function that computes each replacement. re.subn does the same and also returns how many replacements were made; both exist as Pattern.sub / Pattern.subn.',

  covers: ['sub', 'subn', 'Pattern.sub', 'Pattern.subn'],

  cheat: {
    commonCall: "re.sub(r'\\s+', ' ', text)",
    returns:    'a new str (subn: a (str, count) tuple)',
    replaces:   'chains of str.replace calls, manual rebuilding with slices',
    watchOut:   "Backslashes in repl are special too: write it as a raw string, and \\d there is an error",
  },

  parameters: [
    { name: 'pattern', type: 'str | re.Pattern', required: true,  default: null, desc: 'What to replace, as a raw-string regular expression.' },
    { name: 'repl',    type: 'str | callable',   required: true,  default: null, desc: 'Template string (\\1, \\g<name>, \\g<0>, \\n …) or a function taking the Match and returning a str.' },
    { name: 'string',  type: 'str',              required: true,  default: null, desc: 'The input text (not modified — strings are immutable).' },
    { name: 'count',   type: 'int',              required: false, default: '0', desc: 'Maximum number of replacements; 0 means all. Pass it by keyword (positional is deprecated since 3.13).' },
    { name: 'flags',   type: 're.RegexFlag | int', required: false, default: '0', desc: 'Flags such as re.IGNORECASE. Pass by keyword.' },
  ],

  modes: [
    {
      id: 'sub',
      label: 'sub',
      blurb: 'Every match replaced. In repl, \\1 is group 1, \\g<name> a named group, \\g<0> the whole match.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'repl',    type: 'str', hint: 'replacement template', input: 'text' },
        { name: 'text',    type: 'str', hint: 'input text',           input: 'text' },
      ],
      template: 'import re\nre.sub({$pattern}, {$repl}, {$text})',
      cases: [
        { id: 'swap',   label: 'swap names',      values: { pattern: '(\\w+), (\\w+)', repl: '\\2 \\1', text: 'Lovelace, Ada' } },
        { id: 'named',  label: 'named groups',    values: { pattern: '(?P<y>\\d{4})-(?P<m>\\d\\d)-(?P<d>\\d\\d)', repl: '\\g<d>/\\g<m>/\\g<y>', text: 'from 2026-09-29 to 2026-10-03' } },
        { id: 'wrap',   label: 'wrap each match', values: { pattern: '\\d+', repl: '<\\g<0>>', text: 'a1 b22' } },
        { id: 'digit',  label: '\\g<1> then a digit', values: { pattern: '(\\d)', repl: '\\g<1>0', text: 'x1 y2' } },
        { id: 'strip',  label: 'trim spaces',     values: { pattern: '^\\s+|\\s+$', repl: '', text: '   padded   ' } },
      ],
    },
    {
      id: 'errors',
      label: 'template errors',
      blurb: 'The replacement template is parsed before anything is replaced — mistakes raise errors with a position in repl.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'repl',    type: 'str', hint: 'replacement template', input: 'text' },
        { name: 'text',    type: 'str', hint: 'input text',           input: 'text' },
      ],
      template: 'import re\nre.sub({$pattern}, {$repl}, {$text})',
      cases: [
        { id: 'noGroup', label: 'group that does not exist', values: { pattern: '(\\w+)', repl: '[\\2]', text: 'hi' } },
        { id: 'escape',  label: '\\d in repl',     values: { pattern: 'x', repl: '\\d', text: 'x' } },
        { id: 'name',    label: 'unknown name',     values: { pattern: '(?P<word>\\w+)', repl: '\\g<wrod>', text: 'hi' } },
        { id: 'bslash',  label: 'a literal backslash', values: { pattern: '/', repl: '\\\\', text: 'C:/Users/ada' } },
        { id: 'unmatched', label: 'group that did not match', values: { pattern: '(a)|b', repl: '[\\1]', text: 'ab' } },
      ],
    },
    {
      id: 'subn',
      label: 'subn + count',
      blurb: 'subn returns (new_string, number_of_replacements); count limits the replacements, 0 = all.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'repl',    type: 'str', hint: 'replacement',          input: 'text' },
        { name: 'text',    type: 'str', hint: 'input text',           input: 'text' },
        { name: 'count',   type: 'int', hint: '0 = all',              input: 'number' },
      ],
      template: 'import re\nre.subn({$pattern}, {$repl}, {$text}, count={$count})',
      cases: [
        { id: 'all',   label: 'count=0',      values: { pattern: 'a', repl: 'o', text: 'banana', count: '0' } },
        { id: 'two',   label: 'count=2',      values: { pattern: 'a', repl: 'o', text: 'banana', count: '2' } },
        { id: 'empty', label: 'empty matches', values: { pattern: 'x*', repl: '-', text: 'abc', count: '0' } },
      ],
    },
    {
      id: 'func',
      label: 'repl as a function',
      blurb: 'A callable gets each Match and returns the replacement text.',
      params: [
        { name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',    type: 'str', hint: 'input text',           input: 'text' },
      ],
      template: 'import re\nre.sub({$pattern}, lambda m: m.group().upper(), {$text})',
      cases: [
        { id: 'first',  label: 'capitalize words', values: { pattern: '\\b\\w', text: 'hello big world' } },
        { id: 'acro',   label: 'shout keywords',   values: { pattern: '\\b(?:todo|fixme)\\b', text: 'todo: fix this, fixme later' } },
      ],
    },
  ],
  demoExplainer: "\\g<1>0 is the way to write \"group 1, then the digit 0\" — \\10 would mean group 10. A group that did not take part in a match is replaced by an empty string (since Python 3.5). In the empty-match subn case, x* matches the empty string at every position, so a dash lands between every character and at both ends. Errors report positions inside repl, counted from 0.",

  patterns: [
    {
      name: 'Normalize whitespace',
      desc: 'Collapse every run of spaces, tabs and newlines into one space.',
      code: "import re\nclean = re.sub(r'\\s+', ' ', text).strip()",
    },
    {
      name: 'Replace from a dict',
      desc: 'Escape the keys, join them into one alternation, look each match up.',
      code: "import re\nrepl = {'cat': 'dog', 'red': 'blue'}\npat = re.compile('|'.join(map(re.escape, repl)))\nresult = pat.sub(lambda m: repl[m.group()], text)",
    },
    {
      name: 'Insert user text literally',
      desc: 'A function return value is not parsed as a template — safe for backslashes.',
      code: "import re\nresult = re.sub(r'\\{name\\}', lambda m: user_input, template)",
    },
    {
      name: 'Count replacements',
      desc: 'subn tells you whether anything changed.',
      code: "import re\nnew_text, n = re.subn(r'\\bcolour\\b', 'color', text)\nif n:\n    print(f'fixed {n} spellings')",
    },
  ],

  examples: [
    { title: 'Reorder with groups',          code: "import re\nre.sub(r'(\\d{4})-(\\d{2})-(\\d{2})', r'\\3/\\2/\\1', 'due 2026-09-29')", returns: "'due 29/09/2026'" },
    { title: 'Named groups in repl',         code: "import re\nre.sub(r'(?P<y>\\d{4})-(?P<m>\\d{2})', r'\\g<m>/\\g<y>', '2026-09')", returns: "'09/2026'" },
    { title: 'The whole match: \\g<0>',      code: "import re\nre.sub(r'\\d+', r'<\\g<0>>', 'a1b22')", returns: "'a<1>b<22>'" },
    { title: 'A function as repl',           code: "import re\nre.sub(r'\\d+', lambda m: str(int(m.group()) * 2), 'a1b22')", returns: "'a2b44'" },
    { title: 'Limit with count',             code: "import re\nre.sub(r'a', 'x', 'aaaa', count=2)", returns: "'xxaa'" },
    { title: 'subn counts',                  code: "import re\nre.subn(r'a', 'x', 'banana')", returns: "('bxnxnx', 3)" },
    { title: 'Unmatched group becomes empty', code: "import re\nre.sub(r'(a)|b', r'[\\1]', 'ab')", returns: "'[a][]'" },
    { title: 'Compiled: Pattern.sub',        code: "import re\nre.compile(r'\\s+').sub('_', 'a  b\\tc')", returns: "'a_b_c'" },
  ],

  pitfalls: [
    {
      name: 'Referring to a group that does not exist',
      desc: 'The template is checked against the pattern: \\2 needs two groups. The position counts inside repl.',
      wrong: { label: "r'\\2'", code: "import re\nre.sub(r'(a)', r'\\2', 'a')", output: 're.PatternError: invalid group reference 2 at position 1' },
      fix:   { label: "r'\\1'", code: "import re\nre.sub(r'(a)', r'\\1\\1', 'a')", output: "'aa'" },
    },
    {
      name: 'Backslashes from data in repl',
      desc: 'A string repl is a template, so a Windows path or user text with \\d breaks. Return it from a function (not parsed) or escape backslashes.',
      wrong: { label: 'path as repl', code: "import re\npath = r'C:\\data'\nre.sub(r'DIR', path, 'cd DIR')", output: 're.PatternError: bad escape \\d at position 2' },
      fix:   { label: 'lambda', code: "import re\npath = r'C:\\data'\nre.sub(r'DIR', lambda m: path, 'cd DIR')", output: "'cd C:\\\\data'" },
    },
    {
      name: 'Group number followed by a digit',
      desc: '\\10 means group 10, not group 1 then 0. \\g<1> ends the reference explicitly.',
      wrong: { label: "r'\\10'", code: "import re\nre.sub(r'(a)', r'\\10', 'a')", output: 're.PatternError: invalid group reference 10 at position 1' },
      fix:   { label: "r'\\g<1>0'", code: "import re\nre.sub(r'(a)', r'\\g<1>0', 'a')", output: "'a0'" },
    },
    {
      name: 'An unknown group name',
      desc: 'A misspelled \\g<name> raises IndexError, not re.error.',
      wrong: { label: 'typo', code: "import re\nre.sub(r'(?P<word>\\w+)', r'\\g<wrod>', 'hi')", output: "IndexError: unknown group name 'wrod'" },
      fix:   { label: 'real name', code: "import re\nre.sub(r'(?P<word>\\w+)', r'<\\g<word>>', 'hi')", output: "'<hi>'" },
    },
  ],

  when: {
    use: [
      'Replacing text that varies: numbers, whitespace runs, dates, names',
      'Rearranging parts of each match with groups',
      'Computing each replacement with a function',
    ],
    avoid: [
      'Fixed text → str.replace (faster, no escaping rules)',
      'Character-for-character mapping → str.translate',
      'Several unrelated fixed replacements → one compiled alternation + dict lookup (see patterns)',
    ],
  },

  notes: {
    cpython:        'pattern_subx in Modules/_sre/_sre.c. A repl string without any backslash is used as-is; otherwise re._compile_template parses it once (cached) into literal parts and group indexes',
    'Template escapes': 'In repl: \\n \\t \\r \\f \\v \\a \\b \\\\ are processed, \\0 and three-digit octal escapes give characters, other escaped non-letters stay as written, an escaped ASCII letter is an error (3.7+)',
    'Empty matches': 'Since 3.7 empty matches adjacent to a previous non-empty match are replaced too: re.sub("x*", "-", "abxd") gives "-a-b--d-"',
    'Arguments':    'Passing count or flags positionally emits a DeprecationWarning since 3.13 — use count= and flags=',
  },

  related: [
    { name: 're.split',   slug: 'split',   when: 'Cut at the matches instead' },
    { name: 'Match.expand', slug: 'match-expand', when: 'The same template language on one Match' },
    { name: 're.escape',  slug: 'escape',  when: 'Match user text literally' },
    { name: 'str.replace()', slug: 'replace', when: 'Fixed-text replacement', category: 'functions' },
    { name: 'str.translate()', slug: 'str-translate', when: 'Per-character mapping', category: 'functions' },
    { name: 'IndexError', slug: 'indexerror', when: 'Unknown group name in repl', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I use a captured group in the replacement of re.sub?',
      a: "Write \\1, \\2 … or \\g<name> for named groups in a raw-string repl: re.sub(r'(\\w+) (\\w+)', r'\\2 \\1', 'Ada Lovelace') gives 'Lovelace Ada'. \\g<0> is the whole match.",
    },
    {
      q: 'Why does re.sub raise "bad escape" for my replacement?',
      a: 'The replacement is a template: a backslash followed by an ASCII letter it does not know (\\d, \\w, \\p …) is an error since Python 3.7. Double the backslash, or pass a function: re.sub(pattern, lambda m: text, s) inserts text verbatim.',
    },
    {
      q: 'How do I replace only the first match?',
      a: 're.sub(pattern, repl, text, count=1). count=0 (the default) replaces all.',
    },
    {
      q: 'How do I know how many replacements re.sub made?',
      a: 'Use re.subn — it returns (new_string, count).',
    },
    {
      q: 'How do I make the replacement depend on the match?',
      a: "Pass a function as repl. It receives the Match object and returns the replacement string, e.g. re.sub(r'\\d+', lambda m: str(int(m.group()) + 1), s).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.sub',
    meta:  're.sub',
  },
};
