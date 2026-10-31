// content/reference/python/stdlib/difflib/sequencematcher-get_opcodes.js — get_opcodes / get_grouped_opcodes

export const meta = {
  slug:        'sequencematcher-get_opcodes',
  name:        'SequenceMatcher.get_opcodes',
  signature:   'SequenceMatcher.get_opcodes() · SequenceMatcher.get_grouped_opcodes(n=3)',
  blurb:       'How to turn a into b, as a list of (tag, i1, i2, j1, j2) tuples with the tags equal, replace, delete and insert — and the same edits grouped into hunks with n items of context.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'difflib SequenceMatcher.get_opcodes SequenceMatcher.get_grouped_opcodes get_opcodes get_grouped_opcodes opcodes edit operations replace delete insert equal tag i1 i2 j1 j2 hunks context custom diff highlight changes python',
};

export const method = {
  slug:      'sequencematcher-get_opcodes',
  name:      'SequenceMatcher.get_opcodes',
  signature: 'SequenceMatcher.get_opcodes()',
  returns:   { type: 'list[tuple[str, int, int, int, int]]', desc: "(tag, i1, i2, j1, j2) tuples covering both sequences end to end: a[i1:i2] becomes b[j1:j2]. tag is 'equal', 'replace', 'delete' (j1 == j2) or 'insert' (i1 == i2)." },

  category:    'SequenceMatcher method',
  version:     'Python 2.1+',
  hasLiveDemo: true,

  subtitle: 'The building block for any custom diff: walk the opcodes and render a[i1:i2] and b[j1:j2] however you like. get_grouped_opcodes(n) drops long unchanged stretches and yields the clusters of changes with n items of context — exactly the hunks unified_diff and context_diff print.',

  covers: ['SequenceMatcher.get_opcodes', 'SequenceMatcher.get_grouped_opcodes'],

  cheat: {
    commonCall: 'for tag, i1, i2, j1, j2 in s.get_opcodes(): ...',
    returns:    "[('equal', 0, 2, 0, 2), ('replace', 2, 3, 2, 3), ...]",
    replaces:   'computing edit scripts by hand',
    watchOut:   'get_grouped_opcodes() edits the cached get_opcodes() list',
  },

  parameters: [
    { name: 'n', type: 'int', required: false, default: '3', desc: 'get_grouped_opcodes only: items of context kept around each change. Equal runs longer than 2*n split the groups.' },
  ],

  attributes: [
    { name: "'equal'",   type: 'tag', meaning: 'a[i1:i2] == b[j1:j2]' },
    { name: "'replace'", type: 'tag', meaning: 'a[i1:i2] should be replaced by b[j1:j2]' },
    { name: "'delete'",  type: 'tag', meaning: 'a[i1:i2] should be deleted (j1 == j2)' },
    { name: "'insert'",  type: 'tag', meaning: 'b[j1:j2] should be inserted at a[i1:i1] (i1 == i2)' },
  ],

  modes: [
    {
      id: 'slices',
      label: 'opcodes as text',
      blurb: 'Each opcode with the slices of a and b it refers to.',
      params: [
        { name: 'a', type: 'str', hint: 'old string', input: 'text' },
        { name: 'b', type: 'str', hint: 'new string', input: 'text' },
      ],
      template: 'import difflib\na, b = {$a}, {$b}\n[(tag, a[i1:i2], b[j1:j2]) for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes()]',
      cases: [
        { id: 'docs',  label: 'qabxcd / abycdf', values: { a: 'qabxcd', b: 'abycdf' } },
        { id: 'typo',  label: 'typo fix',        values: { a: 'The quikc brown fox', b: 'The quick brown fox' } },
        { id: 'emoji', label: 'non-ASCII',       values: { a: 'café ☕', b: 'cafe ☕!' } },
      ],
    },
    {
      id: 'raw',
      label: 'tuples',
      blurb: 'The opcode tuples themselves: consecutive, starting at 0 and ending at len(a), len(b).',
      params: [
        { name: 'a', type: 'str', hint: 'old string', input: 'text' },
        { name: 'b', type: 'str', hint: 'new string', input: 'text' },
      ],
      template: 'import difflib\ndifflib.SequenceMatcher(None, {$a}, {$b}).get_opcodes()',
      cases: [
        { id: 'docs',  label: 'qabxcd / abycdf', values: { a: 'qabxcd', b: 'abycdf' } },
        { id: 'same',  label: 'equal',           values: { a: 'abc', b: 'abc' } },
        { id: 'empty', label: 'both empty',      values: { a: '', b: '' } },
      ],
    },
    {
      id: 'grouped',
      label: 'grouped',
      blurb: 'Lines separated by |, grouped into hunks with n lines of context.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'n',   type: 'int', hint: 'context lines', input: 'number' },
      ],
      template: "import difflib\ns = difflib.SequenceMatcher(None, {$old}.split('|'), {$new}.split('|'))\nlist(s.get_grouped_opcodes({$n}))",
      cases: [
        { id: 'two', label: 'two groups (n=1)', values: { old: 'a|b|c|d|e|f|g|h', new: 'a|B|c|d|e|f|G|h', n: '1' } },
        { id: 'one', label: 'one group (n=3)',  values: { old: 'a|b|c|d|e|f|g|h', new: 'a|B|c|d|e|f|G|h', n: '3' } },
        { id: 'none', label: 'no changes',      values: { old: 'a|b', new: 'a|b', n: '3' } },
      ],
    },
  ],
  demoExplainer: 'The swapped letters of "quikc" come out as an insert of c before the k and a delete of the c after it — SequenceMatcher reports insertions and deletions, never transpositions. Strings are compared by code point, so é and e simply differ. In the grouped tab, the changes at lines 2 and 7 are 4 equal lines apart: more than 2*n for n=1, so there are two groups with one line of context each, but not for n=3, so everything stays in one group. Equal inputs give no groups at all.',

  patterns: [
    {
      name: 'Highlight changes in HTML',
      desc: 'Render each opcode yourself — here as <del> and <ins>. Escape the text first.',
      code: "import difflib, html\nparts = []\nfor tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, old, new).get_opcodes():\n    if tag == 'equal':\n        parts.append(html.escape(old[i1:i2]))\n    if tag in ('delete', 'replace'):\n        parts.append(f'<del>{html.escape(old[i1:i2])}</del>')\n    if tag in ('insert', 'replace'):\n        parts.append(f'<ins>{html.escape(new[j1:j2])}</ins>')\nmarkup = ''.join(parts)",
    },
    {
      name: 'Word-level diff',
      desc: 'Split into words first; the opcodes then index the word lists.',
      code: "import difflib\na, b = old.split(), new.split()\nfor tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes():\n    if tag != 'equal':\n        print(tag, ' '.join(a[i1:i2]), '->', ' '.join(b[j1:j2]))",
    },
    {
      name: 'Your own hunk format',
      desc: 'get_grouped_opcodes gives the hunks; format the header however you like.',
      code: "import difflib\nfor group in difflib.SequenceMatcher(None, a, b).get_grouped_opcodes(2):\n    first, last = group[0], group[-1]\n    print(f'lines {first[1] + 1}-{last[2]} -> {first[3] + 1}-{last[4]}')",
    },
  ],

  examples: [
    { title: 'The docs example', code: "import difflib\na, b = 'qabxcd', 'abycdf'\nfor tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes():\n    print(f'{tag:7} a[{i1}:{i2}] --> b[{j1}:{j2}] {a[i1:i2]!r:>6} --> {b[j1:j2]!r}')", returns: "delete  a[0:1] --> b[0:0]    'q' --> ''\nequal   a[1:3] --> b[0:2]   'ab' --> 'ab'\nreplace a[3:4] --> b[2:3]    'x' --> 'y'\nequal   a[4:6] --> b[3:5]   'cd' --> 'cd'\ninsert  a[6:6] --> b[5:6]     '' --> 'f'" },
    { title: 'Equal sequences: one equal opcode', code: "import difflib\ndifflib.SequenceMatcher(None, 'abc', 'abc').get_opcodes()", returns: "[('equal', 0, 3, 0, 3)]" },
    { title: 'Two empty sequences: no opcodes', code: "import difflib\ndifflib.SequenceMatcher(None, '', '').get_opcodes()", returns: '[]' },
    { title: 'The docs example for get_grouped_opcodes', code: "import difflib\na = list(map(str, range(1, 40)))\nb = a[:]\nb[8:8] = ['i']\nb[20] += 'x'\nb[23:28] = []\nb[30] += 'y'\ngroups = list(difflib.SequenceMatcher(None, a, b).get_grouped_opcodes())\n[len(g) for g in groups], groups[0]", returns: "([3, 5, 3], [('equal', 5, 8, 5, 8), ('insert', 8, 8, 8, 9), ('equal', 8, 11, 9, 12)])" },
    { title: 'No changes: no groups', code: "import difflib\nlist(difflib.SequenceMatcher(None, 'abc', 'abc').get_grouped_opcodes())", returns: '[]' },
    { title: 'get_grouped_opcodes is a generator', code: "import difflib\ntype(difflib.SequenceMatcher(None, 'abc', 'abd').get_grouped_opcodes()).__name__", returns: "'generator'" },
  ],

  pitfalls: [
    {
      name: 'get_grouped_opcodes changes what get_opcodes returns',
      desc: 'get_opcodes() returns its cached list, and get_grouped_opcodes() trims the first and last equal opcodes of that same list in place. Call get_opcodes() first and copy it, or use separate matchers.',
      wrong: { label: 'after grouping', code: "import difflib\ns = difflib.SequenceMatcher(None, 'abcdefgh', 'abXdefgh')\nlist(s.get_grouped_opcodes(1))\ns.get_opcodes()", output: "[('equal', 1, 2, 1, 2), ('replace', 2, 3, 2, 3), ('equal', 3, 4, 3, 4)]" },
      fix:   { label: 'copy first',     code: "import difflib\ns = difflib.SequenceMatcher(None, 'abcdefgh', 'abXdefgh')\nopcodes = list(s.get_opcodes())\nlist(s.get_grouped_opcodes(1))\nopcodes", output: "[('equal', 0, 2, 0, 2), ('replace', 2, 3, 2, 3), ('equal', 3, 8, 3, 8)]" },
    },
    {
      name: 'Forgetting that i2 and j2 are exclusive',
      desc: 'Opcodes are slice bounds: a[i1:i2] is the affected part, a[i2] is already outside it.',
      wrong: { label: 'a[i2]',      code: "import difflib\na, b = 'abc', 'abd'\ntag, i1, i2, j1, j2 = difflib.SequenceMatcher(None, a, b).get_opcodes()[-1]\n(tag, a[i2])", output: 'IndexError: string index out of range' },
      fix:   { label: 'a[i1:i2]',   code: "import difflib\na, b = 'abc', 'abd'\ntag, i1, i2, j1, j2 = difflib.SequenceMatcher(None, a, b).get_opcodes()[-1]\n(tag, a[i1:i2], b[j1:j2])", output: "('replace', 'c', 'd')" },
    },
  ],

  when: {
    use: [
      'Rendering your own diff: HTML with <ins>/<del>, colored terminal output, word-level diffs',
      'Applying the same edits to a parallel structure (the indexes work on any sequence)',
      'Your own hunk-based output (get_grouped_opcodes)',
    ],
    avoid: [
      'Standard text output → unified_diff, context_diff or ndiff already format the opcodes',
      'Only a similarity score → ratio()',
    ],
  },

  notes: {
    cpython:      'Lib/difflib.py: get_opcodes() walks get_matching_blocks(); the gap before each block becomes replace, delete or insert, the block itself equal. The result is cached on the matcher (self.opcodes) and returned as the same list on later calls',
    'Grouping':   'get_grouped_opcodes(n) first cuts the leading and trailing equal opcodes down to n items, then splits at every equal run longer than 2*n, keeping n items on each side. Two empty sequences yield no group, and so do equal sequences. get_grouped_opcodes was added in Python 2.3, get_opcodes is as old as the module (2.1)',
    'Mutation':   'The trimming is done on the cached list itself, so get_opcodes() afterwards returns the shortened first and last equal ranges',
  },

  related: [
    { name: 'get_matching_blocks', slug: 'sequencematcher-get_matching_blocks', when: 'The matches the opcodes are derived from' },
    { name: 'SequenceMatcher',     slug: 'sequencematcher',                     when: 'Create and configure the matcher' },
    { name: 'difflib.unified_diff', slug: 'unified_diff',                       when: 'get_grouped_opcodes formatted as a patch' },
    { name: 'html.escape',         slug: 'escape',  when: 'Escape text before wrapping opcodes in HTML', category: 'stdlib/html' },
  ],

  faq: [
    {
      q: 'What do the numbers in a difflib opcode mean?',
      a: "(tag, i1, i2, j1, j2) says that a[i1:i2] corresponds to b[j1:j2]. The tag tells how: 'equal' (same content), 'replace', 'delete' (b side is empty, j1 == j2) or 'insert' (a side is empty, i1 == i2). Each opcode starts where the previous one ended.",
    },
    {
      q: 'How do I highlight the differences between two strings?',
      a: "Loop over SequenceMatcher(None, old, new).get_opcodes() and wrap old[i1:i2] for delete/replace and new[j1:j2] for insert/replace in your markup (for example <del> and <ins>), copying equal parts unchanged.",
    },
    {
      q: 'What is the difference between get_opcodes and get_grouped_opcodes?',
      a: 'get_opcodes() covers the whole of both sequences. get_grouped_opcodes(n) yields lists of opcodes for each cluster of changes only, with at most n equal items of context at either end — the hunks of a unified diff.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.SequenceMatcher.get_opcodes',
    meta:  'SequenceMatcher.get_opcodes',
  },
};
