// content/reference/python/stdlib/difflib/ndiff.js

export const meta = {
  slug:        'ndiff',
  name:        'difflib.ndiff',
  signature:   'difflib.ndiff(a, b, linejunk=None, charjunk=IS_CHARACTER_JUNK)',
  blurb:       'A Differ-style delta of two lists of lines: every line prefixed with "- ", "+ " or "  ", plus "? " lines that point at the changed characters of similar lines.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'difflib ndiff python line by line diff question mark lines ? hint intraline changes caret ^ + - markers human readable delta charjunk linejunk IS_CHARACTER_JUNK compare lines show changed characters',
};

export const method = {
  slug:      'ndiff',
  name:      'difflib.ndiff',
  signature: 'difflib.ndiff(a, b, linejunk=None, charjunk=IS_CHARACTER_JUNK)',
  returns:   { type: 'Iterator[str]', desc: 'A generator of delta lines: "  " common, "- " only in a, "+ " only in b, "? " hint lines under similar changed lines (always ending in "\\n").' },

  category:    'difflib function',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'The most readable diff for short texts: nothing is left out, and when a removed line and an added line are similar, the ? lines underneath mark exactly which characters were changed (^), deleted (-) or inserted (+). It is Differ(linejunk, charjunk).compare(a, b).',

  covers: ['ndiff'],

  cheat: {
    commonCall: "difflib.ndiff(a.splitlines(keepends=True), b.splitlines(keepends=True))",
    returns:    "a generator — print(''.join(...), end='')",
    replaces:   'eyeballing two versions for a one-character change',
    watchOut:   'lines need their "\\n": ? lines always end with one',
  },

  parameters: [
    { name: 'a',        type: 'list[str]', required: true,  default: null,  desc: 'The old lines, each ending with "\\n" (readlines() or splitlines(keepends=True)).' },
    { name: 'b',        type: 'list[str]', required: true,  default: null,  desc: 'The new lines.' },
    { name: 'linejunk', type: 'callable | None', required: false, default: 'None', desc: 'line → true if the line is junk (not used to synchronize the two sequences). IS_LINE_JUNK treats blank and lone-# lines as junk; the docs note that the default None usually works better.' },
    { name: 'charjunk', type: 'callable | None', required: false, default: 'IS_CHARACTER_JUNK', desc: 'character → true if junk when comparing two similar lines. The default ignores spaces and tabs as synchronization points, which changes where the ? markers land.' },
  ],

  modes: [
    {
      id: 'delta',
      label: 'delta',
      blurb: 'Lines separated by | (a "\\n" is added to each). ? lines appear only under pairs of lines that are similar enough.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
      ],
      template: "import difflib\nold = [line + '\\n' for line in {$old}.split('|')]\nnew = [line + '\\n' for line in {$new}.split('|')]\nlist(difflib.ndiff(old, new))",
      cases: [
        { id: 'docs',   label: 'docs example', values: { old: 'one|two|three', new: 'ore|tree|emu' } },
        { id: 'config', label: 'config edit',  values: { old: 'host = localhost|port = 8080|debug = true', new: 'host = localhost|port = 8081|debug = false' } },
        { id: 'tabs',   label: 'leading tab',  values: { old: '\tif x:|\t\treturn 1', new: '\tif y:|\t\treturn 1' } },
        { id: 'insert', label: 'inserted line', values: { old: 'a|c', new: 'a|b|c' } },
      ],
    },
    {
      id: 'charjunk',
      label: 'charjunk',
      blurb: 'The ? lines of one changed line: with the default charjunk (spaces and tabs are junk) and with charjunk=None.',
      params: [
        { name: 'old', type: 'str', hint: 'old line', input: 'text' },
        { name: 'new', type: 'str', hint: 'new line', input: 'text' },
      ],
      template: "import difflib\nold = [{$old} + '\\n']\nnew = [{$new} + '\\n']\nhints = lambda delta: [line for line in delta if line.startswith('?')]\n(hints(difflib.ndiff(old, new)), hints(difflib.ndiff(old, new, charjunk=None)))",
      cases: [
        { id: 'volatile', label: 'inserted word', values: { old: 'private Thread currentThread;', new: 'private volatile Thread currentThread;' } },
        { id: 'space',    label: 'extra space',   values: { old: 'a b c', new: 'a  b c' } },
        { id: 'same',     label: 'same either way', values: { old: 'x = 1', new: 'x = 2' } },
      ],
    },
    {
      id: 'raw',
      label: 'without newlines',
      blurb: 'The same call on lines that have no "\\n": the ? lines still end with one, and similarity is computed without it.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
      ],
      template: "import difflib\nlist(difflib.ndiff({$old}.split('|'), {$new}.split('|')))",
      cases: [
        { id: 'abc', label: 'one character', values: { old: 'abcdefgh', new: 'abcdefgX' } },
        { id: 'one', label: 'one / ore',     values: { old: 'one|two', new: 'ore|two' } },
      ],
    },
  ],
  demoExplainer: 'In "config edit", the port lines are 0.92 similar and get ^ markers, but "debug = true" / "debug = false" stay a plain - / + pair: their ratio is 0.7407…, just under the 0.75 needed. With the default charjunk a space cannot start a matching block, so the inserted "volatile " is marked right after "private "; with charjunk=None the longest match starts at the e of "private", and the nine + signs cover "e volatil" instead. For "x = 1" / "x = 2" both settings agree. Without newlines in the input, "one" / "ore" is no longer similar enough for hints, and the hints that do appear still end with "\\n".',

  patterns: [
    {
      name: 'Print an ndiff of two texts',
      desc: 'keepends=True keeps the newlines, so the delta can be joined with an empty string.',
      code: "import difflib\ndelta = difflib.ndiff(old.splitlines(keepends=True), new.splitlines(keepends=True))\nprint(''.join(delta), end='')",
    },
    {
      name: 'Only the changes',
      desc: 'Drop the common lines ("  ") and keep -, + and ? lines.',
      code: "import difflib\nchanges = [line for line in difflib.ndiff(a, b) if not line.startswith('  ')]",
    },
    {
      name: 'Rebuild either input',
      desc: 'An ndiff delta contains both versions; restore() extracts one.',
      code: "import difflib\ndelta = list(difflib.ndiff(a, b))\nassert list(difflib.restore(delta, 1)) == a",
    },
  ],

  examples: [
    { title: 'The docs example', code: "import difflib\nold = 'one\\ntwo\\nthree\\n'.splitlines(keepends=True)\nnew = 'ore\\ntree\\nemu\\n'.splitlines(keepends=True)\nprint(''.join(difflib.ndiff(old, new)), end='')", returns: '- one\n?  ^\n+ ore\n?  ^\n- two\n- three\n?  -\n+ tree\n+ emu' },
    { title: 'A ? line is left out when it would be blank', code: "import difflib\nlist(difflib.ndiff(['a b c\\n'], ['a  b c\\n']))", returns: "['- a b c\\n', '+ a  b c\\n', '?   +\\n']" },
    { title: 'Tabs are kept so the markers line up', code: "import difflib\nlist(difflib.ndiff(['\\tif x:\\n'], ['\\tif y:\\n']))", returns: "['- \\tif x:\\n', '? \\t   ^\\n', '+ \\tif y:\\n', '? \\t   ^\\n']" },
    { title: 'Lines that are not similar: no ? lines', code: "import difflib\nlist(difflib.ndiff(['red\\n'], ['blue\\n']))", returns: "['- red\\n', '+ blue\\n']" },
    { title: 'charjunk changes where the markers go', code: "import difflib\nold = ['private Thread currentThread;\\n']\nnew = ['private volatile Thread currentThread;\\n']\n[list(difflib.ndiff(old, new))[-1], list(difflib.ndiff(old, new, charjunk=None))[-1]]", returns: "['?         +++++++++\\n', '?       +++++++++\\n']" },
    { title: 'Only the changed lines', code: "import difflib\nold = ['a\\n', 'b\\n', 'c\\n']\nnew = ['a\\n', 'B\\n', 'c\\n']\n[line for line in difflib.ndiff(old, new) if not line.startswith('  ')]", returns: "['- b\\n', '+ B\\n']" },
  ],

  pitfalls: [
    {
      name: 'Joining a delta of lines without newlines',
      desc: 'ndiff expects lines that end with "\\n". The ? lines are generated with their own "\\n", so with splitlines() input and "\\n".join() every hint is followed by an empty line.',
      wrong: { label: "'\\n'.join(...)", code: "import difflib\nprint('\\n'.join(difflib.ndiff(['abcdefgh'], ['abcdefgX'])))", output: '- abcdefgh\n?        ^\n\n+ abcdefgX\n?        ^' },
      fix:   { label: 'lines with \\n',  code: "import difflib\nprint(''.join(difflib.ndiff(['abcdefgh\\n'], ['abcdefgX\\n'])), end='')", output: '- abcdefgh\n?        ^\n+ abcdefgX\n?        ^' },
    },
    {
      name: 'Expecting ? lines for every changed line',
      desc: 'Hints appear only when a removed and an added line reach a similarity ratio of 0.75. The "\\n" counts: "one" vs "ore" is 2*2/6 without it, below the cutoff, but 2*3/8 = 0.75 with it.',
      wrong: { label: 'no newlines',   code: "import difflib\nlist(difflib.ndiff(['one'], ['ore']))", output: "['- one', '+ ore']" },
      fix:   { label: 'with newlines', code: "import difflib\nlist(difflib.ndiff(['one\\n'], ['ore\\n']))", output: "['- one\\n', '?  ^\\n', '+ ore\\n', '?  ^\\n']" },
    },
  ],

  when: {
    use: [
      'Short texts where seeing every line helps: config files, test expectations, generated code',
      'Pinpointing a one-character change inside a long line',
      'Keeping both versions in one delta (restore() can extract either)',
    ],
    avoid: [
      'Large files with few changes → difflib.unified_diff shows only the changed hunks',
      'Machine-readable patches → unified_diff / context_diff',
      'Tab-heavy text — the ? lines can be hard to read',
    ],
  },

  notes: {
    cpython:      'ndiff(a, b, linejunk, charjunk) is Differ(linejunk, charjunk).compare(a, b) — note the different default: Differ() uses charjunk=None, ndiff uses IS_CHARACTER_JUNK',
    'Pairing':    'In a replaced block, the most similar pair of lines (ratio above 0.74, and at least 0.75 for the best) is marked up with ? lines; the lines before and after it are handled the same way, recursively',
    'Versions':   'Python 3.14 replaced that pairing search with a faster windowed one (gh-119105), so for several changed lines in a row it can pair lines differently from 3.13; the demo follows 3.13 (3.12 is identical)',
  },

  related: [
    { name: 'difflib.Differ',       slug: 'differ',        when: 'The class ndiff wraps' },
    { name: 'difflib.restore',      slug: 'restore',       when: 'Get either input back from the delta' },
    { name: 'IS_CHARACTER_JUNK',    slug: 'is_line_junk',  when: 'The default charjunk filter' },
    { name: 'difflib.unified_diff', slug: 'unified_diff',  when: 'Only the changed hunks, in patch format' },
    { name: 'str.splitlines()',     slug: 'str-splitlines', when: 'keepends=True gives lines ending in "\\n"', category: 'functions' },
  ],

  faq: [
    {
      q: 'What do the ? lines in difflib.ndiff output mean?',
      a: 'They are hints, not part of either input. Under a "- " or "+ " line, ^ marks a changed character, - a character only in the old line and + a character only in the new line. They appear only for pairs of lines similar enough to be compared character by character.',
    },
    {
      q: 'Why do I get blank lines in my ndiff output?',
      a: "The ? lines always end with '\\n'. If your input lines have no newline (from splitlines()) and you join with '\\n', each hint is followed by an empty line. Use splitlines(keepends=True) and ''.join(), or strip the hints before joining.",
    },
    {
      q: 'What is the difference between ndiff and unified_diff?',
      a: 'ndiff lists every line of both inputs and adds intraline ? hints; unified_diff shows only the changed regions with n lines of context, in the patch format tools understand. Use ndiff for humans reading short texts, unified_diff for patches and long files.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.ndiff',
    meta:  'difflib.ndiff',
  },
};
