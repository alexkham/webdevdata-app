// content/reference/python/stdlib/difflib/unified_diff.js

export const meta = {
  slug:        'unified_diff',
  name:        'difflib.unified_diff',
  signature:   "difflib.unified_diff(a, b, fromfile='', tofile='', fromfiledate='', tofiledate='', n=3, lineterm='\\n')",
  blurb:       'Compare two lists of lines and generate the delta in unified diff format — the ---/+++/@@ patch format of diff -u and git diff.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'difflib unified_diff unified diff python diff -u git diff patch format compare two files compare two lists of lines hunk header @@ context lines lineterm fromfile tofile writelines',
};

export const method = {
  slug:      'unified_diff',
  name:      'difflib.unified_diff',
  signature: "difflib.unified_diff(a, b, fromfile='', tofile='', fromfiledate='', tofiledate='', n=3, lineterm='\\n')",
  returns:   { type: 'Iterator[str]', desc: 'A generator of diff lines: the two header lines, then for each hunk an @@ line and its " ", "-" and "+" lines. Nothing at all when a and b are equal.' },

  category:    'difflib function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The patch format everyone reads: a ---/+++ header, then one @@ -start,count +start,count @@ hunk per cluster of changes with n lines of context, and every line prefixed with a space, - or +. It is a generator of lines, not one string.',

  covers: ['unified_diff'],

  cheat: {
    commonCall: "difflib.unified_diff(a.splitlines(), b.splitlines(), 'old', 'new', lineterm='')",
    returns:    "a generator — wrap it in list() or '\\n'.join()",
    replaces:   'shelling out to diff -u',
    watchOut:   "lineterm='' when the lines have no newlines",
  },

  parameters: [
    { name: 'a',            type: 'list[str]', required: true,  default: null,  desc: 'The old lines. Usually from readlines() (with newlines) or splitlines() (without).' },
    { name: 'b',            type: 'list[str]', required: true,  default: null,  desc: 'The new lines.' },
    { name: 'fromfile',     type: 'str',       required: false, default: "''",  desc: 'Name shown on the --- line.' },
    { name: 'tofile',       type: 'str',       required: false, default: "''",  desc: 'Name shown on the +++ line.' },
    { name: 'fromfiledate', type: 'str',       required: false, default: "''",  desc: 'Appended to the --- line after a tab, when not empty. Usually an ISO 8601 timestamp.' },
    { name: 'tofiledate',   type: 'str',       required: false, default: "''",  desc: 'Appended to the +++ line after a tab, when not empty.' },
    { name: 'n',            type: 'int',       required: false, default: '3',   desc: 'Lines of unchanged context around each change. Changes separated by more than 2*n unchanged lines go into separate hunks.' },
    { name: 'lineterm',     type: 'str',       required: false, default: "'\\n'", desc: "Appended to the ---, +++ and @@ lines only. Use '' when the input lines have no trailing newline." },
  ],

  modes: [
    {
      id: 'diff',
      label: 'context n',
      blurb: 'Lines separated by |. Change n to see hunks grow, shrink, merge or split.',
      params: [
        { name: 'old',      type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new',      type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'n',        type: 'int', hint: 'context lines', input: 'number' },
        { name: 'lineterm', type: 'str', hint: 'added to header lines', input: 'text' },
      ],
      template: "import difflib\nold = {$old}.split('|')\nnew = {$new}.split('|')\nlist(difflib.unified_diff(old, new, 'old.txt', 'new.txt', n={$n}, lineterm={$lineterm}))",
      cases: [
        { id: 'n3',   label: 'n=3 (default)', values: { old: '1|2|3|4|5|6|7|8|9|10|11|12', new: '1|two|3|4|5|6|7|8|9|10|eleven|12', n: '3', lineterm: '' } },
        { id: 'n4',   label: 'n=4 merges',    values: { old: '1|2|3|4|5|6|7|8|9|10|11|12', new: '1|two|3|4|5|6|7|8|9|10|eleven|12', n: '4', lineterm: '' } },
        { id: 'n0',   label: 'n=0',           values: { old: 'a|b|c|d', new: 'a|B|c|d', n: '0', lineterm: '' } },
        { id: 'term', label: 'lineterm marker', values: { old: 'a|b|c', new: 'a|B|c', n: '3', lineterm: ' <EOL>' } },
      ],
    },
    {
      id: 'headers',
      label: 'file headers',
      blurb: 'The names and dates on the --- and +++ lines. A date is added after a tab only when it is not empty.',
      params: [
        { name: 'fromfile', type: 'str', hint: 'old name', input: 'text' },
        { name: 'tofile',   type: 'str', hint: 'new name', input: 'text' },
        { name: 'fromdate', type: 'str', hint: 'old timestamp', input: 'text' },
        { name: 'todate',   type: 'str', hint: 'new timestamp', input: 'text' },
      ],
      template: "import difflib\nlist(difflib.unified_diff(['a', 'b', 'c'], ['a', 'B', 'c'], fromfile={$fromfile}, tofile={$tofile},\n                          fromfiledate={$fromdate}, tofiledate={$todate}, lineterm=''))",
      cases: [
        { id: 'git',   label: 'git style',  values: { fromfile: 'a/config.ini', tofile: 'b/config.ini', fromdate: '', todate: '' } },
        { id: 'dates', label: 'with dates', values: { fromfile: 'config.ini', tofile: 'config.ini', fromdate: '2026-10-01 09:00:00', todate: '2026-10-25 18:30:00' } },
        { id: 'blank', label: 'all empty',  values: { fromfile: '', tofile: '', fromdate: '', todate: '' } },
      ],
    },
    {
      id: 'files',
      label: 'lines with newlines',
      blurb: 'Lines from readlines() keep their "\\n", so the default lineterm fits. Here | stands for a newline; leave off the final | to see a file without a trailing newline.',
      params: [
        { name: 'old', type: 'str', hint: 'text, | = newline', input: 'text' },
        { name: 'new', type: 'str', hint: 'text, | = newline', input: 'text' },
      ],
      template: "import difflib\nold = {$old}.replace('|', '\\n').splitlines(keepends=True)\nnew = {$new}.replace('|', '\\n').splitlines(keepends=True)\nlist(difflib.unified_diff(old, new, 'old.txt', 'new.txt'))",
      cases: [
        { id: 'ok',   label: 'trailing newline',    values: { old: 'one|two|three|', new: 'one|2|three|' } },
        { id: 'nonl', label: 'no trailing newline', values: { old: 'one|two|three', new: 'one|two|three|four' } },
      ],
    },
  ],
  demoExplainer: 'The two changes (lines 2 and 11) are 8 unchanged lines apart. With n=3 that is more than 2*n, so they get separate hunks, each with up to 3 lines of context; with n=4 it is not, and one hunk covers all 12 lines. lineterm is appended only to the ---, +++ and @@ lines, as the " <EOL>" marker shows. In "no trailing newline", the old last line "three" has no "\\n" while the new one does, so the diff reports it as changed even though the visible text is the same.',

  patterns: [
    {
      name: 'Diff two files',
      desc: 'readlines() keeps the newlines, so the output lines can be written as they are.',
      code: "import difflib, sys\nwith open('old.txt', encoding='utf-8') as f1, open('new.txt', encoding='utf-8') as f2:\n    diff = difflib.unified_diff(f1.readlines(), f2.readlines(), fromfile='old.txt', tofile='new.txt')\n    sys.stdout.writelines(diff)",
    },
    {
      name: 'Diff two strings',
      desc: "splitlines() drops the newlines: pass lineterm='' and join with '\\n'.",
      code: "import difflib\ntext = '\\n'.join(difflib.unified_diff(old.splitlines(), new.splitlines(), 'before', 'after', lineterm=''))",
    },
    {
      name: 'Show the whole file as context',
      desc: 'An n at least as large as the longer input puts every line into one hunk.',
      code: 'import difflib\nfull = difflib.unified_diff(a, b, n=max(len(a), len(b)), lineterm="")',
    },
    {
      name: 'Did anything change?',
      desc: 'Equal inputs produce no lines at all, not even the header.',
      code: "import difflib\nchanged = any(True for _ in difflib.unified_diff(a, b))",
    },
  ],

  examples: [
    { title: 'The docs example, with dates', code: "import difflib\nold = 'one two three four'.split()\nnew = 'zero one tree four'.split()\nfor line in difflib.unified_diff(old, new, 'Original', 'Current', '2005-01-26 23:30:50', '2010-04-02 10:20:52', lineterm=''):\n    print(line)", returns: '--- Original\t2005-01-26 23:30:50\n+++ Current\t2010-04-02 10:20:52\n@@ -1,4 +1,4 @@\n+zero\n one\n-two\n-three\n+tree\n four' },
    { title: 'Writing a patch from readlines()-style input', code: "import difflib, sys\nold = ['a\\n', 'b\\n']\nnew = ['a\\n', 'c\\n']\nsys.stdout.writelines(difflib.unified_diff(old, new, 'old', 'new'))", returns: '--- old\n+++ new\n@@ -1,2 +1,2 @@\n a\n-b\n+c' },
    { title: 'n=0: only the changed lines', code: "import difflib\nlist(difflib.unified_diff(['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'X', 'd', 'e'], n=0, lineterm=''))", returns: "['--- ', '+++ ', '@@ -3 +3 @@', '-c', '+X']" },
    { title: 'A pure insertion: count 0 on the old side', code: "import difflib\nlist(difflib.unified_diff(['a', 'b'], ['a', 'new', 'b'], n=0, lineterm=''))", returns: "['--- ', '+++ ', '@@ -1,0 +2 @@', '+new']" },
    { title: 'Diffing against an empty file', code: "import difflib\nlist(difflib.unified_diff([], ['a', 'b'], lineterm=''))", returns: "['--- ', '+++ ', '@@ -0,0 +1,2 @@', '+a', '+b']" },
    { title: 'Equal inputs: no output at all', code: "import difflib\nlist(difflib.unified_diff(['a', 'b'], ['a', 'b']))", returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'A last line without a newline',
      desc: 'readlines() gives the last line of a file without a trailing newline as-is. unified_diff does not add the "\\ No newline at end of file" marker that diff prints, so written out, that line runs straight into the next one.',
      wrong: { label: 'missing \\n',  code: "import difflib\nlist(difflib.unified_diff(['a\\n', 'b'], ['a\\n', 'c']))", output: "['--- \\n', '+++ \\n', '@@ -1,2 +1,2 @@\\n', ' a\\n', '-b', '+c']" },
      fix:   { label: 'normalize',     code: "import difflib\nold = ['a\\n', 'b']\nnew = ['a\\n', 'c']\nfix = lambda lines: [l if l.endswith('\\n') else l + '\\n' for l in lines]\nlist(difflib.unified_diff(fix(old), fix(new)))", output: "['--- \\n', '+++ \\n', '@@ -1,2 +1,2 @@\\n', ' a\\n', '-b\\n', '+c\\n']" },
    },
    {
      name: 'Printing the generator itself',
      desc: 'unified_diff returns a lazy generator. Printing it shows the object, and it can be consumed only once.',
      wrong: { label: 'used twice', code: "import difflib\nd = difflib.unified_diff(['a'], ['b'], lineterm='')\nfirst = list(d)\nlist(d)", output: '[]' },
      fix:   { label: 'list() once', code: "import difflib\nd = list(difflib.unified_diff(['a'], ['b'], lineterm=''))\nlen(d), d[-2:]", output: "(5, ['-a', '+b'])" },
    },
  ],

  when: {
    use: [
      'Patch-style output for people who read git diff every day',
      'Test failure messages and logs: only the changed region plus context',
      'Writing .patch / .diff files from Python',
    ],
    avoid: [
      'Showing every line of both inputs → difflib.ndiff',
      'The before/after block style of diff -c → difflib.context_diff',
      'A side-by-side HTML report → difflib.HtmlDiff',
    ],
  },

  notes: {
    cpython:       'Lib/difflib.py: runs SequenceMatcher(None, a, b).get_grouped_opcodes(n) and formats each group; the ranges follow the POSIX diff spec (an empty range starts at the line before it)',
    'Hunk header': '@@ -start,count +start,count @@ with 1-based starts; ",count" is left out when the count is 1, and an empty range is written as start,0',
    'Types':       'a and b must hold str; for bytes use difflib.diff_bytes. Python 3.14 also rejects a plain str for a or b (TypeError) instead of diffing its characters',
    'Color':       'Python 3.15 adds a keyword-only color=False parameter for git diff --color style output',
  },

  related: [
    { name: 'difflib.context_diff', slug: 'context_diff', when: 'The same changes in diff -c format' },
    { name: 'difflib.ndiff',        slug: 'ndiff',        when: 'Every line, with ? markers inside changed lines' },
    { name: 'difflib.diff_bytes',   slug: 'diff_bytes',   when: 'The same for bytes lines of unknown encoding' },
    { name: 'get_grouped_opcodes',  slug: 'sequencematcher-get_opcodes', when: 'The hunks unified_diff formats' },
    { name: 'str.splitlines()',     slug: 'str-splitlines', when: 'keepends=True keeps the newlines for the default lineterm', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I print a unified diff of two strings in Python?',
      a: "print('\\n'.join(difflib.unified_diff(a.splitlines(), b.splitlines(), 'a', 'b', lineterm=''))). splitlines() removes the newlines, lineterm='' keeps the header lines consistent with that, and join() turns the generator into one string.",
    },
    {
      q: 'What do the numbers in @@ -1,4 +1,5 @@ mean?',
      a: 'The hunk covers 4 lines of the old file starting at line 1, and 5 lines of the new file starting at line 1. Starts are 1-based; when a count is 1 it is omitted (@@ -3 +3 @@), and an empty side is written with count 0 and the line before it as start (@@ -0,0 +1,2 @@ for a new file).',
    },
    {
      q: 'Why does my diff have empty lines between every line?',
      a: "Your input lines already end with '\\n' (from readlines() or splitlines(keepends=True)) and you joined the output with '\\n' again — use ''.join() or sys.stdout.writelines() then. Or your lines have no newlines but lineterm was left at '\\n', which doubles only the header lines: pass lineterm=''.",
    },
    {
      q: 'Can unified_diff apply a patch?',
      a: 'No. difflib only produces diffs. To apply one use the patch tool or git apply; within Python, restore() can recover either input from an ndiff delta, but there is no equivalent for unified diffs.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.unified_diff',
    meta:  'difflib.unified_diff',
  },
};
