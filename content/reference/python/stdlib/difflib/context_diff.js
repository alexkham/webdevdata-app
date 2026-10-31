// content/reference/python/stdlib/difflib/context_diff.js

export const meta = {
  slug:        'context_diff',
  name:        'difflib.context_diff',
  signature:   "difflib.context_diff(a, b, fromfile='', tofile='', fromfiledate='', tofiledate='', n=3, lineterm='\\n')",
  blurb:       'Compare two lists of lines and generate the delta in context diff format — the before/after blocks of diff -c, with ! for changed, - for deleted and + for added lines.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'difflib context_diff context diff python diff -c before after blocks *** --- *************** changed lines exclamation mark patch format compare two files lineterm',
};

export const method = {
  slug:      'context_diff',
  name:      'difflib.context_diff',
  signature: "difflib.context_diff(a, b, fromfile='', tofile='', fromfiledate='', tofiledate='', n=3, lineterm='\\n')",
  returns:   { type: 'Iterator[str]', desc: 'A generator of diff lines: the *** and --- header lines, then per hunk a *************** separator, the old block and the new block. Nothing at all when a and b are equal.' },

  category:    'difflib function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The older patch format: each hunk shows the old lines (*** start,end ****) and then the new lines (--- start,end ----), with "! " on changed lines, "- " on deleted, "+ " on added and two spaces on context. A side with nothing to show prints only its range line.',

  covers: ['context_diff'],

  cheat: {
    commonCall: "difflib.context_diff(a, b, 'old', 'new', lineterm='')",
    returns:    "a generator of lines — list() or ''.join() it",
    replaces:   'shelling out to diff -c',
    watchOut:   'ranges are start,end — not start,count as in unified_diff',
  },

  parameters: [
    { name: 'a',            type: 'list[str]', required: true,  default: null,  desc: 'The old lines.' },
    { name: 'b',            type: 'list[str]', required: true,  default: null,  desc: 'The new lines.' },
    { name: 'fromfile',     type: 'str',       required: false, default: "''",  desc: 'Name on the *** header line.' },
    { name: 'tofile',       type: 'str',       required: false, default: "''",  desc: 'Name on the --- header line.' },
    { name: 'fromfiledate', type: 'str',       required: false, default: "''",  desc: 'Appended to the *** header after a tab, when not empty.' },
    { name: 'tofiledate',   type: 'str',       required: false, default: "''",  desc: 'Appended to the --- header after a tab, when not empty.' },
    { name: 'n',            type: 'int',       required: false, default: '3',   desc: 'Lines of context around each change; changes more than 2*n lines apart start a new hunk.' },
    { name: 'lineterm',     type: 'str',       required: false, default: "'\\n'", desc: "Appended to the header, separator and range lines only. Use '' for lines without newlines." },
  ],

  modes: [
    {
      id: 'diff',
      label: 'diff -c',
      blurb: 'Lines separated by |. Watch which block gets the lines: changes appear in both, deletions only in the old block, insertions only in the new one.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'n',   type: 'int', hint: 'context lines', input: 'number' },
      ],
      template: "import difflib\nold = {$old}.split('|')\nnew = {$new}.split('|')\nlist(difflib.context_diff(old, new, 'old.txt', 'new.txt', n={$n}, lineterm=''))",
      cases: [
        { id: 'docs',   label: 'docs example', values: { old: 'one|two|three|four', new: 'zero|one|tree|four', n: '3' } },
        { id: 'delete', label: 'only a deletion', values: { old: 'a|b|c', new: 'a|c', n: '1' } },
        { id: 'insert', label: 'only an insertion', values: { old: 'a|b', new: 'a|new|b', n: '1' } },
        { id: 'n0',     label: 'n=0', values: { old: 'a|b|c|d|e', new: 'a|b|X|d|e', n: '0' } },
      ],
    },
    {
      id: 'headers',
      label: 'headers',
      blurb: 'Names and a date on the header lines, and what lineterm is appended to.',
      params: [
        { name: 'fromfile', type: 'str', hint: 'old name', input: 'text' },
        { name: 'tofile',   type: 'str', hint: 'new name', input: 'text' },
        { name: 'fromdate', type: 'str', hint: 'old timestamp', input: 'text' },
        { name: 'lineterm', type: 'str', hint: 'added to control lines', input: 'text' },
      ],
      template: "import difflib\nlist(difflib.context_diff(['a', 'b', 'c'], ['a', 'B', 'c'], fromfile={$fromfile}, tofile={$tofile},\n                          fromfiledate={$fromdate}, lineterm={$lineterm}))",
      cases: [
        { id: 'names', label: 'names',        values: { fromfile: 'setup.cfg.orig', tofile: 'setup.cfg', fromdate: '', lineterm: '' } },
        { id: 'date',  label: 'with a date',  values: { fromfile: 'setup.cfg', tofile: 'setup.cfg', fromdate: '2026-10-01 09:00:00', lineterm: '' } },
        { id: 'term',  label: 'lineterm marker', values: { fromfile: 'a', tofile: 'b', fromdate: '', lineterm: ' <EOL>' } },
      ],
    },
  ],
  demoExplainer: 'In the docs example, "two" and "three" were replaced by "tree", so they carry ! in the old block and "tree" carries ! in the new block, while the inserted "zero" is a + line. When a hunk has only a deletion, the new block is just its range line (--- 1,2 ----); with only an insertion, the old block is. lineterm goes on the headers, the *************** separator and the range lines — never on the content lines.',

  patterns: [
    {
      name: 'Context diff of two files',
      desc: 'readlines() keeps the newlines, which matches the default lineterm.',
      code: "import difflib, sys\nwith open('a.txt', encoding='utf-8') as f1, open('b.txt', encoding='utf-8') as f2:\n    sys.stdout.writelines(difflib.context_diff(f1.readlines(), f2.readlines(), 'a.txt', 'b.txt'))",
    },
    {
      name: 'Context diff of two strings',
      desc: "Lines without newlines need lineterm=''.",
      code: "import difflib\nprint('\\n'.join(difflib.context_diff(old.splitlines(), new.splitlines(), 'old', 'new', lineterm='')))",
    },
  ],

  examples: [
    { title: 'The docs example', code: "import difflib, sys\nold = ['one\\n', 'two\\n', 'three\\n', 'four\\n']\nnew = ['zero\\n', 'one\\n', 'tree\\n', 'four\\n']\nsys.stdout.writelines(difflib.context_diff(old, new, 'Original', 'Current'))", returns: '*** Original\n--- Current\n***************\n*** 1,4 ****\n  one\n! two\n! three\n  four\n--- 1,4 ----\n+ zero\n  one\n! tree\n  four' },
    { title: 'A deletion: the new block has only its range', code: "import difflib\nlist(difflib.context_diff(['a', 'b', 'c'], ['a', 'c'], n=1, lineterm=''))", returns: "['*** ', '--- ', '***************', '*** 1,3 ****', '  a', '- b', '  c', '--- 1,2 ----']" },
    { title: 'An insertion: the old block has only its range', code: "import difflib\nlist(difflib.context_diff(['a', 'b'], ['a', 'new', 'b'], n=1, lineterm=''))", returns: "['*** ', '--- ', '***************', '*** 1,2 ****', '--- 1,3 ----', '  a', '+ new', '  b']" },
    { title: 'A new file: range 0 on the old side', code: "import difflib\nlist(difflib.context_diff([], ['a', 'b'], lineterm=''))", returns: "['*** ', '--- ', '***************', '*** 0 ****', '--- 1,2 ----', '+ a', '+ b']" },
    { title: 'Equal inputs produce nothing', code: "import difflib\nlist(difflib.context_diff(['x'], ['x']))", returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'Reading the ranges as start,count',
      desc: 'context_diff ranges are start,end (both inclusive). The same change in unified_diff is written start,count.',
      wrong: { label: 'unified: start,count', code: "import difflib\nold = ['1', '2', '3', '4', '5']\nnew = ['1', '2', 'three', '4', '5']\n[l for l in difflib.unified_diff(old, new, n=1, lineterm='') if l.startswith('@@')]", output: "['@@ -2,3 +2,3 @@']" },
      fix:   { label: 'context: start,end',  code: "import difflib\nold = ['1', '2', '3', '4', '5']\nnew = ['1', '2', 'three', '4', '5']\n[l for l in difflib.context_diff(old, new, n=1, lineterm='') if l.startswith(('*** ', '--- '))][2:]", output: "['*** 2,4 ****', '--- 2,4 ----']" },
    },
    {
      name: 'Lines without newlines and the default lineterm',
      desc: 'The header, separator and range lines get lineterm ("\\n" by default) while the content lines are passed through as they are. With splitlines() input only half the lines end in a newline, so joined output comes out ragged.',
      wrong: { label: 'default lineterm', code: "import difflib\nlist(difflib.context_diff(['a', 'b'], ['a', 'c']))", output: "['*** \\n', '--- \\n', '***************\\n', '*** 1,2 ****\\n', '  a', '! b', '--- 1,2 ----\\n', '  a', '! c']" },
      fix:   { label: "lineterm=''",      code: "import difflib\nlist(difflib.context_diff(['a', 'b'], ['a', 'c'], lineterm=''))", output: "['*** ', '--- ', '***************', '*** 1,2 ****', '  a', '! b', '--- 1,2 ----', '  a', '! c']" },
    },
  ],

  when: {
    use: [
      'Tools or reviewers that expect diff -c output',
      'Seeing the complete old and new version of a changed region as two separate blocks',
    ],
    avoid: [
      'Most modern tooling (git apply, code review tools) expects unified diffs → difflib.unified_diff, which is also more compact',
      'Every line of both inputs with character markers → difflib.ndiff',
    ],
  },

  notes: {
    cpython:   'Lib/difflib.py: SequenceMatcher(None, a, b).get_grouped_opcodes(n), then one *** block (equal, replace and delete lines) and one --- block (equal, replace and insert lines) per group. A block is printed only if its side has a change',
    'Ranges':  'start,end with 1-based lines; a single line is written as one number, an empty side as the line before it (0 for an empty file)',
    'Types':   'a and b must hold str — use difflib.diff_bytes for bytes. Python 3.14 raises TypeError when a or b is a plain str',
  },

  related: [
    { name: 'difflib.unified_diff', slug: 'unified_diff', when: 'The more compact -u format' },
    { name: 'difflib.ndiff',        slug: 'ndiff',        when: 'Every line, with ? markers' },
    { name: 'difflib.diff_bytes',   slug: 'diff_bytes',   when: 'context_diff for bytes lines' },
    { name: 'get_grouped_opcodes',  slug: 'sequencematcher-get_opcodes', when: 'How hunks are formed' },
  ],

  faq: [
    {
      q: 'What is the difference between a context diff and a unified diff?',
      a: 'A context diff prints each hunk twice — the old block and then the new block — and marks changed lines with !. A unified diff interleaves both into one block with - and + lines, which is shorter. Both carry n lines of context and the same file headers.',
    },
    {
      q: 'What does "*** 1,4 ****" mean in a context diff?',
      a: 'The old block covers lines 1 to 4 of the old file. The matching "--- 1,4 ----" line gives the range in the new file. A single line is written as one number, and an empty side as the line just before it.',
    },
    {
      q: 'Why is one block of a hunk empty?',
      a: 'context_diff prints the lines of a block only when that side has a change: a pure deletion shows no lines under --- and a pure insertion shows none under ***, only the range line.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.context_diff',
    meta:  'difflib.context_diff',
  },
};
