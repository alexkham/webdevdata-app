// content/reference/python/stdlib/difflib/index.js — the difflib module hub

export const meta = {
  slug:        'index',
  name:        'difflib',
  signature:   'import difflib',
  blurb:       'Compare sequences and report the differences: unified and context diffs like diff -u, ndiff with ? hint lines, a similarity ratio, close-match suggestions and side-by-side HTML tables.',
  category:    'text',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'difflib module python diff two strings compare two files text diff unified diff context diff ndiff similarity ratio fuzzy string matching get_close_matches did you mean SequenceMatcher Differ HtmlDiff patch git diff gestalt pattern matching Ratcliff Obershelp',
};

export const method = {
  slug: 'index',
  name: 'difflib',

  category:    'Text',
  version:     'Python 2.1+',
  hasLiveDemo: true,

  subtitle: 'One engine, several outputs. SequenceMatcher finds the longest matching blocks between two sequences; unified_diff and context_diff turn that into patch-style text, ndiff into a line-by-line delta with ? markers, ratio() into a similarity score and get_close_matches into "did you mean" suggestions.',

  // every public name these classes define themselves must have a member page
  coverClasses: ['SequenceMatcher', 'Differ', 'HtmlDiff'],

  imports: ['import difflib', 'from difflib import SequenceMatcher, unified_diff, get_close_matches'],
  facts: [
    { label: 'Public API', value: 'SequenceMatcher, Match, get_close_matches, unified_diff, context_diff, diff_bytes, ndiff, restore, Differ, HtmlDiff, IS_LINE_JUNK, IS_CHARACTER_JUNK' },
    { label: 'Input',      value: 'Sequences of hashable items: lists of lines for file diffs, plain strings to compare character by character' },
    { label: 'Algorithm',  value: 'Longest contiguous junk-free match, then the same recursively on each side (an extension of Ratcliff/Obershelp "gestalt pattern matching") — not a minimal edit script' },
    { label: 'Source',     value: 'Lib/difflib.py — pure Python, no C accelerator' },
  ],

  modes: [
    {
      id: 'unified',
      label: 'unified diff',
      blurb: 'The format of diff -u and git diff. Type the two versions with | between lines.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
      ],
      template: "import difflib\nold = {$old}.split('|')\nnew = {$new}.split('|')\nlist(difflib.unified_diff(old, new, 'old.txt', 'new.txt', lineterm=''))",
      cases: [
        { id: 'change', label: 'one line changed', values: { old: 'apple|banana|cherry', new: 'apple|blueberry|cherry' } },
        { id: 'insert', label: 'insert + delete',  values: { old: 'a|b|c|d', new: 'a|b|x|c' } },
        { id: 'hunks',  label: 'two hunks',        values: { old: '1|2|3|4|5|6|7|8|9|10|11|12', new: '1|two|3|4|5|6|7|8|9|10|eleven|12' } },
        { id: 'same',   label: 'identical',        values: { old: 'a|b', new: 'a|b' } },
      ],
    },
    {
      id: 'ndiff',
      label: 'ndiff',
      blurb: 'Every line, prefixed with "- ", "+ " or "  ", plus "? " lines that point at the changed characters of similar lines.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
      ],
      template: "import difflib\nold = [line + '\\n' for line in {$old}.split('|')]\nnew = [line + '\\n' for line in {$new}.split('|')]\nlist(difflib.ndiff(old, new))",
      cases: [
        { id: 'docs',  label: 'one / ore',     values: { old: 'one|two|three', new: 'ore|tree|emu' } },
        { id: 'typo',  label: 'fixed typo',    values: { old: 'def lenght(s):|    return len(s)', new: 'def length(s):|    return len(s)' } },
        { id: 'far',   label: 'not similar',   values: { old: 'red', new: 'blue' } },
      ],
    },
    {
      id: 'ratio',
      label: 'similarity',
      blurb: 'SequenceMatcher on two strings: the ratio 2*M/T and the edit operations that turn a into b.',
      params: [
        { name: 'a', type: 'str', hint: 'first string',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second string', input: 'text' },
      ],
      template: 'import difflib\ns = difflib.SequenceMatcher(None, {$a}, {$b})\n(s.ratio(), s.get_opcodes())',
      cases: [
        { id: 'docs',  label: 'qabxcd / abycdf', values: { a: 'qabxcd', b: 'abycdf' } },
        { id: 'typo',  label: 'typo',            values: { a: 'receive', b: 'recieve' } },
        { id: 'empty', label: 'two empty',       values: { a: '', b: '' } },
      ],
    },
    {
      id: 'close',
      label: 'close matches',
      blurb: 'The best "did you mean" candidates (up to 3, ratio at least 0.6). Edit the word list too.',
      params: [
        { name: 'word',  type: 'str',       hint: 'possibly misspelled', input: 'text' },
        { name: 'words', type: 'list[str]', hint: 'comma-separated',     input: 'csv' },
      ],
      template: 'import difflib\ndifflib.get_close_matches({$word}, {$words})',
      cases: [
        { id: 'appel',  label: 'appel',  values: { word: 'appel', words: 'ape, apple, peach, puppy' } },
        { id: 'lenght', label: 'lenght', values: { word: 'lenght', words: 'len, length, height, lent' } },
        { id: 'none',   label: 'no match', values: { word: 'xyz', words: 'apple, banana' } },
      ],
    },
  ],
  demoExplainer: 'In "two hunks" the changed lines 2 and 11 are separated by 8 unchanged lines — more than twice the default 3 lines of context — so the patch has two @@ hunks. ndiff adds ? lines only when a removed and an added line are similar enough (a ratio of at least 0.75): "one"/"ore" and "lenght"/"length" get them, "red"/"blue" do not. For qabxcd/abycdf, 4 characters of each 6-character string match (ab and cd), so the ratio is 2*4/12; two empty strings count as identical (1.0).',

  patterns: [
    {
      name: 'Diff two files like diff -u',
      desc: 'readlines() keeps the newlines, so the default lineterm fits and writelines() prints the patch as-is.',
      code: "import difflib, sys\nwith open('old.txt', encoding='utf-8') as f1, open('new.txt', encoding='utf-8') as f2:\n    sys.stdout.writelines(difflib.unified_diff(f1.readlines(), f2.readlines(), 'old.txt', 'new.txt'))",
    },
    {
      name: 'Diff two strings in a test failure message',
      desc: 'splitlines() drops the newlines, so pass lineterm="" and join with "\\n".',
      code: "import difflib\nprint('\\n'.join(difflib.unified_diff(expected.splitlines(), actual.splitlines(), 'expected', 'actual', lineterm='')))",
    },
    {
      name: '"Did you mean ...?" suggestions',
      desc: 'get_close_matches returns the best candidates above the cutoff, best first.',
      code: "import difflib\nmatches = difflib.get_close_matches(command, known_commands, n=1)\nif matches:\n    print(f'Unknown command {command!r}. Did you mean {matches[0]!r}?')",
    },
    {
      name: 'Similarity score between two strings',
      desc: 'ratio() is 2*M/T: 1.0 for equal sequences, 0.0 when nothing matches.',
      code: 'import difflib\nscore = difflib.SequenceMatcher(None, a, b).ratio()',
    },
  ],

  examples: [
    { title: 'A unified diff of two lists of lines', code: "import difflib\nold = ['apple', 'banana', 'cherry']\nnew = ['apple', 'blueberry', 'cherry']\nprint('\\n'.join(difflib.unified_diff(old, new, 'old.txt', 'new.txt', lineterm='')))", returns: '--- old.txt\n+++ new.txt\n@@ -1,3 +1,3 @@\n apple\n-banana\n+blueberry\n cherry' },
    { title: 'ndiff marks the changed characters', code: "import difflib\nold = ['one\\n', 'two\\n', 'three\\n']\nnew = ['ore\\n', 'tree\\n', 'emu\\n']\nprint(''.join(difflib.ndiff(old, new)), end='')", returns: '- one\n?  ^\n+ ore\n?  ^\n- two\n- three\n?  -\n+ tree\n+ emu' },
    { title: 'Similarity ratio', code: "import difflib\ndifflib.SequenceMatcher(None, 'abcd', 'bcde').ratio()", returns: '0.75' },
    { title: 'Edit operations from a to b', code: "import difflib\ndifflib.SequenceMatcher(None, 'qabxcd', 'abycdf').get_opcodes()", returns: "[('delete', 0, 1, 0, 0), ('equal', 1, 3, 0, 2), ('replace', 3, 4, 2, 3), ('equal', 4, 6, 3, 5), ('insert', 6, 6, 5, 6)]" },
    { title: 'Did you mean ...?', code: "import difflib\ndifflib.get_close_matches('appel', ['ape', 'apple', 'peach', 'puppy'])", returns: "['apple', 'ape']" },
    { title: 'Get either side back from an ndiff', code: "import difflib\ndelta = list(difflib.ndiff(['one\\n', 'two\\n'], ['one\\n', 'too\\n']))\nlist(difflib.restore(delta, 2))", returns: "['one\\n', 'too\\n']" },
  ],

  pitfalls: [
    {
      name: 'Passing strings instead of lists of lines',
      desc: 'A str is a sequence of characters, so in Python 3.13 unified_diff compares character by character and emits one output line per character — even the newline becomes a line of its own. Split the text into lines first. (Python 3.14 raises TypeError for str input instead.)',
      wrong: { label: 'two strings',   code: "import difflib\nlist(difflib.unified_diff('cat\\n', 'cut\\n', lineterm=''))", output: "['--- ', '+++ ', '@@ -1,4 +1,4 @@', ' c', '-a', '+u', ' t', ' \\n']" },
      fix:   { label: 'splitlines()',  code: "import difflib\nlist(difflib.unified_diff('cat\\n'.splitlines(), 'cut\\n'.splitlines(), lineterm=''))", output: "['--- ', '+++ ', '@@ -1 +1 @@', '-cat', '+cut']" },
    },
    {
      name: 'Forgetting lineterm="" with splitlines()',
      desc: 'The ---, +++ and @@ lines get lineterm appended ("\\n" by default) while the content lines keep whatever ending they had — none after splitlines(). Joining with "\\n" then prints blank lines after the headers.',
      wrong: { label: 'default lineterm', code: "import difflib\nlist(difflib.unified_diff(['a', 'b'], ['a', 'c']))", output: "['--- \\n', '+++ \\n', '@@ -1,2 +1,2 @@\\n', ' a', '-b', '+c']" },
      fix:   { label: "lineterm=''",      code: "import difflib\nlist(difflib.unified_diff(['a', 'b'], ['a', 'c'], lineterm=''))", output: "['--- ', '+++ ', '@@ -1,2 +1,2 @@', ' a', '-b', '+c']" },
    },
  ],

  when: {
    use: [
      'Showing what changed between two versions of a text: test failures, config drift, generated files',
      'Writing patch-style output (unified or context diff) from Python',
      'Fuzzy matching: "did you mean" suggestions and similarity scores for short strings',
      'Comparing any sequences of hashable items, not only text',
    ],
    avoid: [
      'Minimal edit distance (Levenshtein) — difflib optimizes for readable diffs, not for the fewest edits',
      'Applying patches — difflib only produces them; use the patch tool or git apply',
      'Large-scale fuzzy search over many strings — difflib is pure Python and quadratic in the worst case',
    ],
  },

  notes: {
    cpython:      'Lib/difflib.py — pure Python. Every function is built on SequenceMatcher; Differ and ndiff run it twice (once over lines, once over the characters of similar lines)',
    'Junk':       'Elements of b can be ignored as junk (isjunk), and with autojunk=True (the default), when b has 200 or more items, every item whose duplicates (after its first occurrence) make up more than 1% of b — more than len(b) // 100 + 1 occurrences — is treated as junk too',
    'Versions':   'Differ/ndiff/restore were added in 2.2, HtmlDiff in 2.4, diff_bytes in 3.5. Python 3.14 rewrote how Differ pairs similar lines (gh-119105), so ndiff output for several changed lines in a row can differ from 3.13; the demos reproduce 3.13 (3.12 is identical)',
  },

  related: [
    { name: 'str.splitlines()', slug: 'str-splitlines', when: 'Turn text into the list of lines a diff needs', category: 'functions' },
    { name: 'open()',           slug: 'open',           when: 'Read the files to compare (readlines keeps the newlines)', category: 'functions' },
    { name: 'pathlib module',   slug: 'pathlib',        when: 'Path.read_text().splitlines() for quick file diffs', category: 'stdlib' },
    { name: 'textwrap module',  slug: 'textwrap',       when: 'dedent() a triple-quoted expected text before diffing it against real output', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I compare two strings and show the differences in Python?',
      a: "For multi-line text, split both into lines and use difflib.unified_diff(a.splitlines(), b.splitlines(), lineterm='') for a diff -u style patch, or difflib.ndiff(...) for every line with + / - / ? markers. For a single line, SequenceMatcher(None, a, b).get_opcodes() lists the replace, delete, insert and equal ranges.",
    },
    {
      q: 'How do I get a similarity percentage between two strings?',
      a: 'difflib.SequenceMatcher(None, a, b).ratio() returns a float from 0.0 to 1.0, computed as 2*M/T where M is the number of matched elements and T the total length of both. Multiply by 100 for a percentage. It is not symmetric in every case: comparing b to a can give a different value.',
    },
    {
      q: 'What is the difference between unified_diff, context_diff and ndiff?',
      a: 'unified_diff and context_diff show only changed regions plus n lines of context, in the two patch formats (diff -u and diff -c). ndiff shows every line of both inputs and adds ? lines that point at the changed characters of lines that are similar.',
    },
    {
      q: 'Does difflib compute the minimal diff?',
      a: 'No. SequenceMatcher looks for the longest contiguous matching block, then recurses on both sides. That gives diffs that "look right" to people but are not guaranteed to be the shortest possible edit script.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html',
    meta:  'difflib — Helpers for computing deltas',
  },
};
