// content/reference/python/stdlib/difflib/sequencematcher-ratio.js — ratio / quick_ratio / real_quick_ratio

export const meta = {
  slug:        'sequencematcher-ratio',
  name:        'SequenceMatcher.ratio',
  signature:   'SequenceMatcher.ratio() · SequenceMatcher.quick_ratio() · SequenceMatcher.real_quick_ratio()',
  blurb:       'The similarity of the two sequences as a float in [0, 1] — 2*M/T — plus two cheaper upper bounds, quick_ratio and real_quick_ratio, for filtering before the full computation.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'difflib SequenceMatcher.ratio SequenceMatcher.quick_ratio SequenceMatcher.real_quick_ratio ratio quick_ratio real_quick_ratio similarity score percentage python string similarity 2*M/T upper bound fuzzy match symmetric',
};

export const method = {
  slug:      'sequencematcher-ratio',
  name:      'SequenceMatcher.ratio',
  signature: 'SequenceMatcher.ratio()',
  returns:   { type: 'float', desc: '2.0 * M / T, where M is the number of matched elements and T = len(a) + len(b); 1.0 when both are empty.' },

  category:    'SequenceMatcher method',
  version:     'Python 2.1+',
  hasLiveDemo: true,

  subtitle: 'ratio() runs the full matching (get_matching_blocks) and returns 2*M/T: 1.0 for equal sequences, 0.0 when nothing matches. quick_ratio() counts common elements ignoring order, real_quick_ratio() only looks at the lengths — both are upper bounds, never below ratio().',

  covers: ['SequenceMatcher.ratio', 'SequenceMatcher.quick_ratio', 'SequenceMatcher.real_quick_ratio'],

  cheat: {
    commonCall: 'difflib.SequenceMatcher(None, a, b).ratio()',
    returns:    '0.75 for "abcd" vs "bcde"',
    replaces:   'hand-rolled similarity percentages',
    watchOut:   'not symmetric: (a, b) and (b, a) can differ',
  },

  parameters: [],

  attributes: [
    { name: 'ratio()',            type: 'float', meaning: '2.0 * M / T with M = sum of the sizes of get_matching_blocks(). Expensive the first time, cached afterwards.' },
    { name: 'quick_ratio()',      type: 'float', meaning: 'Treats a and b as multisets: M = number of elements of a that also occur in b (respecting counts), in any order. An upper bound of ratio().' },
    { name: 'real_quick_ratio()', type: 'float', meaning: 'M = min(len(a), len(b)) — the best ratio the lengths allow. An upper bound of quick_ratio().' },
  ],

  modes: [
    {
      id: 'ratios',
      label: 'all three',
      blurb: 'ratio() <= quick_ratio() <= real_quick_ratio(), always.',
      params: [
        { name: 'a', type: 'str', hint: 'first string',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second string', input: 'text' },
      ],
      template: 'import difflib\ns = difflib.SequenceMatcher(None, {$a}, {$b})\n(s.ratio(), s.quick_ratio(), s.real_quick_ratio())',
      cases: [
        { id: 'docs',    label: 'abcd / bcde',     values: { a: 'abcd', b: 'bcde' } },
        { id: 'anagram', label: 'anagram',         values: { a: 'listen', b: 'silent' } },
        { id: 'kitten',  label: 'kitten / sitting', values: { a: 'kitten', b: 'sitting' } },
        { id: 'none',    label: 'nothing shared',  values: { a: 'abc', b: 'xyz' } },
      ],
    },
    {
      id: 'order',
      label: 'a, b vs b, a',
      blurb: 'The same two strings in both orders.',
      params: [
        { name: 'a', type: 'str', hint: 'first string',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second string', input: 'text' },
      ],
      template: 'import difflib\n(difflib.SequenceMatcher(None, {$a}, {$b}).ratio(),\n difflib.SequenceMatcher(None, {$b}, {$a}).ratio())',
      cases: [
        { id: 'tide',  label: 'tide / diet', values: { a: 'tide', b: 'diet' } },
        { id: 'same',  label: 'symmetric case', values: { a: 'abcd', b: 'bcde' } },
      ],
    },
  ],
  demoExplainer: '"listen" and "silent" contain the same letters, so quick_ratio() is 1.0, but in order only 3 of the 6 letters line up and ratio() is 0.5. For "abc" / "xyz", real_quick_ratio() still says 1.0 — it only knows both have 3 characters. kitten / sitting matches 4 characters of 13 in total: 2*4/13. In the second tab, "tide" vs "diet" matches only the t while "diet" vs "tide" matches the d and the e, so the ratios are 0.25 and 0.5.',

  patterns: [
    {
      name: 'Filter cheaply before computing the ratio',
      desc: 'The order get_close_matches uses: cheapest bound first.',
      code: "import difflib\ns = difflib.SequenceMatcher(None, a, b)\nsimilar = s.real_quick_ratio() >= 0.8 and s.quick_ratio() >= 0.8 and s.ratio() >= 0.8",
    },
    {
      name: 'A symmetric score',
      desc: 'When the order of the two inputs should not matter, take the larger of both directions.',
      code: 'import difflib\nscore = max(difflib.SequenceMatcher(None, a, b).ratio(), difflib.SequenceMatcher(None, b, a).ratio())',
    },
    {
      name: 'As a percentage',
      desc: 'Format the float directly.',
      code: "import difflib\nprint(f'{difflib.SequenceMatcher(None, a, b).ratio():.0%} similar')",
    },
  ],

  examples: [
    { title: 'The three methods', code: "import difflib\ns = difflib.SequenceMatcher(None, 'abcd', 'bcde')\n(s.ratio(), s.quick_ratio(), s.real_quick_ratio())", returns: '(0.75, 0.75, 1.0)' },
    { title: 'ratio is 2*M/T', code: "import difflib\ns = difflib.SequenceMatcher(None, 'abxcd', 'abcd')\nM = sum(block.size for block in s.get_matching_blocks())\n(M, 2 * M / (5 + 4), s.ratio())", returns: '(4, 0.8888888888888888, 0.8888888888888888)' },
    { title: 'quick_ratio ignores order', code: "import difflib\ns = difflib.SequenceMatcher(None, 'abc', 'cba')\n(s.ratio(), s.quick_ratio())", returns: '(0.3333333333333333, 1.0)' },
    { title: 'real_quick_ratio only sees the lengths', code: "import difflib\ndifflib.SequenceMatcher(None, 'abc', 'xyz').real_quick_ratio()", returns: '1.0' },
    { title: 'Edge cases: equal, disjoint, empty', code: "import difflib\nr = lambda a, b: difflib.SequenceMatcher(None, a, b).ratio()\n(r('abc', 'abc'), r('abc', 'xyz'), r('', ''), r('', 'x'))", returns: '(1.0, 0.0, 1.0, 0.0)' },
    { title: 'The order of a and b matters', code: "import difflib\n(difflib.SequenceMatcher(None, 'tide', 'diet').ratio(), difflib.SequenceMatcher(None, 'diet', 'tide').ratio())", returns: '(0.25, 0.5)' },
  ],

  pitfalls: [
    {
      name: 'Using quick_ratio as the similarity',
      desc: 'quick_ratio only checks which elements both sides contain. An anagram scores 1.0 although only 3 of its 6 letters line up in order.',
      wrong: { label: 'quick_ratio()', code: "import difflib\ndifflib.SequenceMatcher(None, 'listen', 'silent').quick_ratio()", output: '1.0' },
      fix:   { label: 'ratio()',       code: "import difflib\ndifflib.SequenceMatcher(None, 'listen', 'silent').ratio()", output: '0.5' },
    },
    {
      name: 'Assuming ratio(a, b) == ratio(b, a)',
      desc: 'The longest match found first decides how the rest is split, and ties go to the earliest position in a: for "tide" vs "diet" only the t matches, for "diet" vs "tide" the d and the e do. When the order should not matter, take the larger of both directions.',
      wrong: { label: 'one direction', code: "import difflib\nr = lambda a, b: difflib.SequenceMatcher(None, a, b).ratio()\nr('tide', 'diet') == r('diet', 'tide')", output: 'False' },
      fix:   { label: 'max of both',   code: "import difflib\nr = lambda a, b: difflib.SequenceMatcher(None, a, b).ratio()\nmax(r('tide', 'diet'), r('diet', 'tide'))", output: '0.5' },
    },
  ],

  when: {
    use: [
      'A quick similarity score between two strings or sequences',
      'Thresholds for "close enough" matches (0.6 is the get_close_matches default)',
      'quick_ratio / real_quick_ratio as cheap pre-filters in loops',
    ],
    avoid: [
      'Edit distance in operations (insertions, deletions, substitutions) → a Levenshtein implementation',
      'Comparing long texts character by character with the default autojunk — see SequenceMatcher',
    ],
  },

  notes: {
    cpython:   'Lib/difflib.py: ratio() sums the sizes of get_matching_blocks(); quick_ratio() builds a count of b once (fullbcount) and walks a; real_quick_ratio() uses min(len(a), len(b)). All three go through _calculate_ratio(matches, len(a) + len(b)), which returns 1.0 when both are empty',
    'Floats':  'The value is 2.0 * M / T computed in binary floating point, so 2/3 shows as 0.6666666666666666 — identical on every platform',
  },

  related: [
    { name: 'SequenceMatcher',                    slug: 'sequencematcher',                     when: 'isjunk, autojunk and set_seq1 / set_seq2' },
    { name: 'SequenceMatcher.get_matching_blocks', slug: 'sequencematcher-get_matching_blocks', when: 'The blocks M is summed from' },
    { name: 'difflib.get_close_matches',          slug: 'get_close_matches',                   when: 'ratio applied to a list of candidates' },
    { name: 'round()',                            slug: 'round',                               when: 'Round the score for display', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does SequenceMatcher.ratio() return?',
      a: 'A float between 0 and 1: twice the number of matching elements divided by the total number of elements in both sequences. 1.0 means identical, 0.0 means no element matched. As a rule of thumb from the difflib source, a value over 0.6 means the sequences are close matches.',
    },
    {
      q: 'Why is SequenceMatcher(None, a, b).ratio() different from SequenceMatcher(None, b, a).ratio()?',
      a: 'The algorithm takes the first longest matching block (earliest in a) and recurses on both sides of it; with the roles swapped a different block can be chosen, which changes what can still match. Junk handling also looks at b only.',
    },
    {
      q: 'What are quick_ratio and real_quick_ratio for?',
      a: 'They are fast upper bounds on ratio(). If real_quick_ratio() or quick_ratio() is already below your threshold, ratio() will be too, so you can skip the expensive call — get_close_matches does exactly that.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.SequenceMatcher.ratio',
    meta:  'SequenceMatcher.ratio',
  },
};
