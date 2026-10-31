// content/reference/python/stdlib/difflib/sequencematcher.js — SequenceMatcher, set_seqs / set_seq1 / set_seq2

export const meta = {
  slug:        'sequencematcher',
  name:        'difflib.SequenceMatcher',
  signature:   "difflib.SequenceMatcher(isjunk=None, a='', b='', autojunk=True) · set_seqs(a, b) · set_seq1(a) · set_seq2(b)",
  blurb:       'The engine of difflib: compares two sequences of hashable items by finding the longest junk-free matching blocks. isjunk, the autojunk heuristic, and set_seqs / set_seq1 / set_seq2 for reusing one matcher.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'difflib SequenceMatcher SequenceMatcher.set_seqs SequenceMatcher.set_seq1 SequenceMatcher.set_seq2 set_seqs set_seq1 set_seq2 isjunk autojunk junk heuristic popular elements 200 items 1% bjunk bpopular compare sequences python string similarity gestalt pattern matching Ratcliff Obershelp',
};

export const method = {
  slug:      'sequencematcher',
  name:      'difflib.SequenceMatcher',
  signature: "difflib.SequenceMatcher(isjunk=None, a='', b='', autojunk=True)",
  returns:   { type: 'SequenceMatcher', desc: 'A matcher for the pair (a, b); its methods compute matching blocks, opcodes and ratios, caching the results until a sequence changes.' },

  category:    'difflib class',
  version:     'Python 2.1+',
  hasLiveDemo: true,

  subtitle: 'Works on any two sequences of hashable items — characters of strings, lines of files, tokens, numbers. It answers "how do I turn a into b?" by matching the longest contiguous block first and recursing on both sides. Everything is computed about b first, so set_seq2 the fixed side once and set_seq1 each thing you compare against it.',

  covers: ['SequenceMatcher', 'SequenceMatcher.set_seqs', 'SequenceMatcher.set_seq1', 'SequenceMatcher.set_seq2'],

  cheat: {
    commonCall: 'difflib.SequenceMatcher(None, a, b).ratio()',
    returns:    'a matcher; ratio(), get_opcodes(), get_matching_blocks()',
    replaces:   'hand-written LCS / similarity code',
    watchOut:   'autojunk changes results once b has 200+ items',
  },

  parameters: [
    { name: 'isjunk',   type: 'callable | None', required: false, default: 'None', desc: 'element → true if the element is junk: it never starts a matching block, though it can extend one. Only elements of b are tested. None means no junk.' },
    { name: 'a',        type: 'Sequence',        required: false, default: "''",   desc: 'The first sequence ("from"). Elements must be hashable.' },
    { name: 'b',        type: 'Sequence',        required: false, default: "''",   desc: 'The second sequence ("to"). Indexed and junk-filtered once, when it is set.' },
    { name: 'autojunk', type: 'bool',            required: false, default: 'True', desc: 'When b has 200 or more items, every item that occurs more than len(b) // 100 + 1 times is treated as junk too ("popular"). False turns this heuristic off (parameter added in 3.2).' },
  ],

  attributes: [
    { name: 'set_seqs(a, b)', type: 'method',    meaning: 'Set both sequences: set_seq1(a) then set_seq2(b). Returns None.' },
    { name: 'set_seq1(a)',    type: 'method',    meaning: 'Replace a only; the index of b is kept. Cheap — use it in a loop over candidates.' },
    { name: 'set_seq2(b)',    type: 'method',    meaning: 'Replace b and rebuild its index (b2j), junk set and popular set. Skipped if b is the same object.' },
    { name: 'bjunk',          type: 'set',       meaning: 'Elements of b for which isjunk returned true (3.2+).' },
    { name: 'bpopular',       type: 'set',       meaning: 'Non-junk elements of b that the autojunk heuristic treats as junk (3.2+). Empty when b has fewer than 200 items.' },
    { name: 'a, b',           type: 'attribute', meaning: 'The current sequences.' },
  ],

  modes: [
    {
      id: 'isjunk',
      label: 'isjunk',
      blurb: 'The characters in junk may not start a match. Compare the longest match and the opcodes with and without junk.',
      params: [
        { name: 'a',    type: 'str', hint: 'first string',  input: 'text' },
        { name: 'b',    type: 'str', hint: 'second string', input: 'text' },
        { name: 'junk', type: 'str', hint: 'junk characters (empty = none)', input: 'text' },
      ],
      template: 'import difflib\ns = difflib.SequenceMatcher(lambda x: x in {$junk}, {$a}, {$b})\n(s.find_longest_match(), s.get_opcodes())',
      cases: [
        { id: 'nojunk', label: 'no junk',    values: { a: ' abcd', b: 'abcd abcd', junk: '' } },
        { id: 'space',  label: 'space junk', values: { a: ' abcd', b: 'abcd abcd', junk: ' ' } },
        { id: 'code',   label: 'code line',  values: { a: 'private Thread currentThread;', b: 'private volatile Thread currentThread;', junk: ' ' } },
      ],
    },
    {
      id: 'autojunk',
      label: 'autojunk',
      blurb: 'Repeat a text to get past 200 characters, change one word, and compare with and without the popularity heuristic.',
      params: [
        { name: 'text',  type: 'str', hint: 'text to repeat', input: 'text' },
        { name: 'times', type: 'int', hint: 'repetitions',    input: 'number' },
        { name: 'old',   type: 'str', hint: 'replace (once)', input: 'text' },
        { name: 'new',   type: 'str', hint: 'with',           input: 'text' },
      ],
      template: "import difflib\na = {$text} * {$times}\nb = a.replace({$old}, {$new}, 1)\n(len(b), difflib.SequenceMatcher(None, a, b).ratio(),\n         difflib.SequenceMatcher(None, a, b, autojunk=False).ratio())",
      cases: [
        { id: 'long',  label: '5 sentences (227 chars)', values: { text: 'The quick brown fox jumps over the lazy dog. ', times: '5', old: 'lazy', new: 'sleepy' } },
        { id: 'short', label: '4 sentences (182 chars)', values: { text: 'The quick brown fox jumps over the lazy dog. ', times: '4', old: 'lazy', new: 'sleepy' } },
        { id: 'abc',   label: "'abc' * 100", values: { text: 'abc', times: '100', old: 'b', new: 'B' } },
      ],
    },
    {
      id: 'reuse',
      label: 'set_seq2 once',
      blurb: 'One matcher, b fixed with set_seq2, a swapped with set_seq1 for every candidate — the pattern get_close_matches uses.',
      params: [
        { name: 'target', type: 'str',       hint: 'fixed b',         input: 'text' },
        { name: 'words',  type: 'list[str]', hint: 'comma-separated', input: 'csv' },
      ],
      template: 'import difflib\ns = difflib.SequenceMatcher()\ns.set_seq2({$target})\nscores = []\nfor w in {$words}:\n    s.set_seq1(w)\n    scores.append((w, s.ratio()))\nscores',
      cases: [
        { id: 'color', label: 'colour', values: { target: 'colour', words: 'color, colon, cooler, flavour' } },
        { id: 'empty', label: 'empty b', values: { target: '', words: ', x' } },
      ],
    },
  ],
  demoExplainer: 'Without junk, " abcd" matches the " abcd" at the end of "abcd abcd" in one block of 5. With the space as junk that block may not start on the blank, so the longest match is "abcd" at the very start of b instead. In "autojunk", the 227-character b passes the 200-item threshold: each character occurring more than 3 times (227 // 100 + 1) is "popular" and ignored, and the ratio drops from 0.987 to 0.155; at 182 characters the heuristic is off and both ratios are equal.',

  patterns: [
    {
      name: 'Compare one text against many',
      desc: 'set_seq2 indexes b once; set_seq1 is cheap.',
      code: "import difflib\ns = difflib.SequenceMatcher()\ns.set_seq2(reference)\nbest = max(candidates, key=lambda c: (s.set_seq1(c), s.ratio())[1])",
    },
    {
      name: 'Ignore whitespace when matching characters',
      desc: 'Spaces and tabs may still be matched next to real matches, but never anchor one.',
      code: "import difflib\ns = difflib.SequenceMatcher(lambda ch: ch in ' \\t', old_line, new_line)",
    },
    {
      name: 'Compare long sequences without the popularity heuristic',
      desc: 'For 200+ items with frequent elements (characters of prose, repeated lines), autojunk=False gives the intuitive result at some speed cost.',
      code: 'import difflib\nratio = difflib.SequenceMatcher(None, long_a, long_b, autojunk=False).ratio()',
    },
    {
      name: 'Compare token lists instead of characters',
      desc: 'Any sequence of hashable items works — here words.',
      code: 'import difflib\ns = difflib.SequenceMatcher(None, old_text.split(), new_text.split())\nfor tag, i1, i2, j1, j2 in s.get_opcodes():\n    print(tag, old_text.split()[i1:i2], new_text.split()[j1:j2])',
    },
  ],

  examples: [
    { title: 'The class docstring example (spaces are junk)', code: "import difflib\ns = difflib.SequenceMatcher(lambda x: x == ' ', 'private Thread currentThread;', 'private volatile Thread currentThread;')\nfor block in s.get_matching_blocks():\n    print('a[%d] and b[%d] match for %d elements' % block)", returns: 'a[0] and b[0] match for 8 elements\na[8] and b[17] match for 21 elements\na[29] and b[38] match for 0 elements' },
    { title: 'set_seqs, set_seq1, set_seq2', code: "import difflib\ns = difflib.SequenceMatcher(None, 'abcd', 'bcde')\nr1 = s.ratio()\ns.set_seq1('bcde')\nr2 = s.ratio()\ns.set_seqs('abcd', 'bcde')\n(r1, r2, s.ratio())", returns: '(0.75, 1.0, 0.75)' },
    { title: 'Any hashable items: lists of numbers', code: 'import difflib\ndifflib.SequenceMatcher(None, [1, 2, 3, 4], [1, 2, 4, 5]).get_opcodes()', returns: "[('equal', 0, 2, 0, 2), ('delete', 2, 3, 2, 2), ('equal', 3, 4, 2, 3), ('insert', 4, 4, 3, 4)]" },
    { title: 'Only the elements are compared, not the sequence type', code: "import difflib\ndifflib.SequenceMatcher(None, ('a', 'b'), ['a', 'b']).ratio()", returns: '1.0' },
    { title: 'bjunk and bpopular', code: "import difflib\na = 'The quick brown fox jumps over the lazy dog. ' * 5\ns = difflib.SequenceMatcher(lambda x: x == ' ', a, a)\n(s.bjunk, len(s.bpopular), ' ' in s.bpopular)", returns: "({' '}, 28, False)" },
    { title: 'Elements must be hashable', code: 'import difflib\ndifflib.SequenceMatcher(None, [[1]], [[1]])', returns: "TypeError: unhashable type: 'list'" },
  ],

  pitfalls: [
    {
      name: 'Long inputs and the autojunk heuristic',
      desc: 'Once b has 200 or more items, every item that appears more than len(b) // 100 + 1 times is ignored as "popular". For prose compared character by character that is nearly every letter, and the ratio collapses.',
      wrong: { label: 'autojunk=True', code: "import difflib\na = 'The quick brown fox jumps over the lazy dog. ' * 5\nb = a.replace('lazy', 'sleepy', 1)\ndifflib.SequenceMatcher(None, a, b).ratio()", output: '0.15486725663716813' },
      fix:   { label: 'autojunk=False', code: "import difflib\na = 'The quick brown fox jumps over the lazy dog. ' * 5\nb = a.replace('lazy', 'sleepy', 1)\ndifflib.SequenceMatcher(None, a, b, autojunk=False).ratio()", output: '0.9867256637168141' },
    },
    {
      name: 'Fixing the wrong side when reusing a matcher',
      desc: 'set_seq2 re-indexes b on every call, and the ratio depends on which side is a: "diet" against "tide" scores 0.25 one way and 0.5 the other. Keep the fixed text as b (indexed once) and vary a with set_seq1 — the same arrangement get_close_matches uses, so the scores agree with it.',
      wrong: { label: 'fixed text as a', code: "import difflib\ns = difflib.SequenceMatcher(None, 'tide')\nresult = []\nfor w in ['diet', 'tidy']:\n    s.set_seq2(w)\n    result.append(s.ratio())\nresult", output: '[0.25, 0.75]' },
      fix:   { label: 'fixed text as b', code: "import difflib\ns = difflib.SequenceMatcher(None, b='tide')\nresult = []\nfor w in ['diet', 'tidy']:\n    s.set_seq1(w)\n    result.append(s.ratio())\nresult", output: '[0.5, 0.75]' },
    },
  ],

  when: {
    use: [
      'Similarity scores and edit operations for strings or any sequences',
      'Building your own diff output on top of get_opcodes()',
      'Comparing one reference against many candidates (set_seq2 once)',
    ],
    avoid: [
      'Ready-made text diffs → unified_diff, context_diff, ndiff',
      'Minimal edit distance → a Levenshtein implementation',
      'Very long sequences with autojunk=False — the worst case is quadratic in pure Python',
    ],
  },

  notes: {
    cpython:     'Lib/difflib.py: set_seq2 builds b2j (element → list of indices in b) and removes junk and popular elements from it; find_longest_match scans a against b2j, so matches never start at junk; get_matching_blocks applies it recursively with an explicit queue',
    'Junk':      'Junk is decided on b only, so SequenceMatcher(None, a, b) and SequenceMatcher(None, b, a) can disagree. autojunk applies when len(b) >= 200: an element is popular if it occurs more than len(b) // 100 + 1 times',
    'Caching':   'get_matching_blocks() and get_opcodes() are cached until set_seq1 / set_seq2 changes a sequence; set_seq1 / set_seq2 do nothing when given the same object again',
    'Generics':  'SequenceMatcher[str] works as a type hint (PEP 585 __class_getitem__)',
  },

  related: [
    { name: 'SequenceMatcher.ratio',              slug: 'sequencematcher-ratio',               when: 'Similarity score and its fast upper bounds' },
    { name: 'SequenceMatcher.get_opcodes',        slug: 'sequencematcher-get_opcodes',         when: 'Edit operations from a to b' },
    { name: 'SequenceMatcher.get_matching_blocks', slug: 'sequencematcher-get_matching_blocks', when: 'Matching blocks and find_longest_match' },
    { name: 'difflib.get_close_matches',          slug: 'get_close_matches',                   when: 'SequenceMatcher applied to a list of candidates' },
    { name: 'IS_CHARACTER_JUNK',                  slug: 'is_line_junk',                        when: 'Ready-made isjunk functions' },
  ],

  faq: [
    {
      q: 'How does Python\'s SequenceMatcher work?',
      a: 'It finds the longest contiguous block that a and b have in common (not starting on junk), then repeats that on the parts to the left and to the right of it. The blocks found that way give get_matching_blocks(), the gaps between them give get_opcodes(), and their total size gives ratio() = 2*M/T.',
    },
    {
      q: 'What is the autojunk parameter of SequenceMatcher?',
      a: 'A speed heuristic: when b has 200 or more items, items whose duplicates (after the first occurrence) make up more than 1% of it — that is, items occurring more than len(b) // 100 + 1 times — are treated as junk. It helps with files full of repeated lines but can ruin character-level comparisons of long text. Pass autojunk=False to turn it off.',
    },
    {
      q: 'What is isjunk in SequenceMatcher?',
      a: 'An optional function called on the elements of b. Elements it returns true for cannot start a matching block, but can be absorbed at the edges of a match that starts elsewhere — so blanks or common filler do not pull the alignment in odd directions.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.SequenceMatcher',
    meta:  'difflib.SequenceMatcher',
  },
};
