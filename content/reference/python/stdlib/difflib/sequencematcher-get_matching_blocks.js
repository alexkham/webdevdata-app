// content/reference/python/stdlib/difflib/sequencematcher-get_matching_blocks.js — get_matching_blocks / find_longest_match / Match

export const meta = {
  slug:        'sequencematcher-get_matching_blocks',
  name:        'SequenceMatcher.get_matching_blocks',
  signature:   'SequenceMatcher.get_matching_blocks() · SequenceMatcher.find_longest_match(alo=0, ahi=None, blo=0, bhi=None) · difflib.Match(a, b, size)',
  blurb:       'The matching blocks between a and b as Match(a, b, size) named tuples, and find_longest_match, the single step the whole algorithm repeats: the longest junk-free block in a range.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'difflib SequenceMatcher.get_matching_blocks SequenceMatcher.find_longest_match get_matching_blocks find_longest_match Match difflib.Match named tuple a b size longest common substring matching blocks python common parts of two strings',
};

export const method = {
  slug:      'sequencematcher-get_matching_blocks',
  name:      'SequenceMatcher.get_matching_blocks',
  signature: 'SequenceMatcher.get_matching_blocks()',
  returns:   { type: 'list[Match]', desc: 'Match(a=i, b=j, size=n) blocks with a[i:i+n] == b[j:j+n], increasing in i and j, ending with the dummy Match(a=len(a), b=len(b), size=0).' },

  category:    'SequenceMatcher method',
  version:     'Python 2.1+',
  hasLiveDemo: true,

  subtitle: 'find_longest_match(alo, ahi, blo, bhi) returns the longest block of a[alo:ahi] that also appears in b[blo:bhi] — earliest in a, then earliest in b, on ties. get_matching_blocks() applies it to the whole sequences and recursively to the parts left and right of each match. Both return Match named tuples.',

  covers: ['SequenceMatcher.get_matching_blocks', 'SequenceMatcher.find_longest_match', 'Match'],

  cheat: {
    commonCall: "difflib.SequenceMatcher(None, 'abxcd', 'abcd').get_matching_blocks()",
    returns:    '[Match(a=0, b=0, size=2), Match(a=3, b=2, size=2), Match(a=5, b=4, size=0)]',
    replaces:   'longest-common-substring code',
    watchOut:   'the last block is always a size-0 dummy',
  },

  parameters: [
    { name: 'alo', type: 'int',        required: false, default: '0',    desc: 'find_longest_match: start of the range in a.' },
    { name: 'ahi', type: 'int | None', required: false, default: 'None', desc: 'find_longest_match: end of the range in a (exclusive); None means len(a). Defaults for all four were added in 3.9.' },
    { name: 'blo', type: 'int',        required: false, default: '0',    desc: 'find_longest_match: start of the range in b.' },
    { name: 'bhi', type: 'int | None', required: false, default: 'None', desc: 'find_longest_match: end of the range in b (exclusive); None means len(b).' },
  ],

  attributes: [
    { name: 'Match.a',    type: 'int', meaning: 'Start of the block in a (field 0).' },
    { name: 'Match.b',    type: 'int', meaning: 'Start of the block in b (field 1).' },
    { name: 'Match.size', type: 'int', meaning: 'Length of the block (field 2); 0 for "no match" and for the final dummy block.' },
  ],

  modes: [
    {
      id: 'blocks',
      label: 'matching blocks',
      blurb: 'All matching blocks of two strings.',
      params: [
        { name: 'a', type: 'str', hint: 'first string',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second string', input: 'text' },
      ],
      template: 'import difflib\ndifflib.SequenceMatcher(None, {$a}, {$b}).get_matching_blocks()',
      cases: [
        { id: 'docs',  label: 'abxcd / abcd',   values: { a: 'abxcd', b: 'abcd' } },
        { id: 'words', label: 'sentence',       values: { a: 'the cat sat on the mat', b: 'the dog sat on a mat' } },
        { id: 'none',  label: 'nothing shared', values: { a: 'abc', b: 'xyz' } },
      ],
    },
    {
      id: 'longest',
      label: 'find_longest_match',
      blurb: 'The longest block inside a[alo:ahi] and b[blo:bhi].',
      params: [
        { name: 'a',   type: 'str', hint: 'first string',  input: 'text' },
        { name: 'b',   type: 'str', hint: 'second string', input: 'text' },
        { name: 'alo', type: 'int', hint: 'a from', input: 'number' },
        { name: 'ahi', type: 'int', hint: 'a to',   input: 'number' },
        { name: 'blo', type: 'int', hint: 'b from', input: 'number' },
        { name: 'bhi', type: 'int', hint: 'b to',   input: 'number' },
      ],
      template: 'import difflib\ndifflib.SequenceMatcher(None, {$a}, {$b}).find_longest_match({$alo}, {$ahi}, {$blo}, {$bhi})',
      cases: [
        { id: 'docs',  label: 'docs example',  values: { a: ' abcd', b: 'abcd abcd', alo: '0', ahi: '5', blo: '0', bhi: '9' } },
        { id: 'range', label: 'restricted b',  values: { a: ' abcd', b: 'abcd abcd', alo: '0', ahi: '5', blo: '0', bhi: '4' } },
        { id: 'none',  label: 'no match',      values: { a: 'ab', b: 'c', alo: '0', ahi: '2', blo: '0', bhi: '1' } },
        { id: 'past',  label: 'ahi too large', values: { a: 'ab', b: 'ab', alo: '0', ahi: '5', blo: '0', bhi: '2' } },
      ],
    },
    {
      id: 'match',
      label: 'Match fields',
      blurb: 'Use the fields of the Match to slice out the common text.',
      params: [
        { name: 'a', type: 'str', hint: 'first string',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second string', input: 'text' },
      ],
      template: 'import difflib\nm = difflib.SequenceMatcher(None, {$a}, {$b}).find_longest_match()\n(m, {$a}[m.a:m.a + m.size])',
      cases: [
        { id: 'url',  label: 'common part', values: { a: 'https://example.com/docs/intro', b: 'http://example.com/docs/setup' } },
        { id: 'none', label: 'no match',    values: { a: 'abc', b: 'xyz' } },
      ],
    },
  ],
  demoExplainer: 'For " abcd" and "abcd abcd" the longest block is the whole of a, found at b[4]. Restricting b to b[0:4] ("abcd") leaves "abcd" as the best match, starting at a[1]. A range end past the string is not clipped like a slice: find_longest_match reads a[2] of "ab" and raises IndexError. In the URL case the longest shared block is "://example.com/docs/", 20 characters.',

  patterns: [
    {
      name: 'Longest common substring',
      desc: 'With the 3.9+ defaults the whole of both strings is searched.',
      code: 'import difflib\nm = difflib.SequenceMatcher(None, a, b).find_longest_match()\ncommon = a[m.a:m.a + m.size]',
    },
    {
      name: 'All common parts of two strings',
      desc: 'Skip the final size-0 block.',
      code: 'import difflib\nparts = [a[m.a:m.a + m.size] for m in difflib.SequenceMatcher(None, a, b).get_matching_blocks() if m.size]',
    },
    {
      name: 'Unpack blocks like plain tuples',
      desc: 'Match is a named tuple, so tuple unpacking and % formatting work.',
      code: "import difflib\nfor i, j, n in difflib.SequenceMatcher(None, a, b).get_matching_blocks():\n    print(f'a[{i}:{i + n}] == b[{j}:{j + n}]')",
    },
  ],

  examples: [
    { title: 'The docs example', code: "import difflib\ndifflib.SequenceMatcher(None, 'abxcd', 'abcd').get_matching_blocks()", returns: '[Match(a=0, b=0, size=2), Match(a=3, b=2, size=2), Match(a=5, b=4, size=0)]' },
    { title: 'find_longest_match: earliest in a wins', code: "import difflib\ndifflib.SequenceMatcher(None, ' abcd', 'abcd abcd').find_longest_match(0, 5, 0, 9)", returns: 'Match(a=0, b=4, size=5)' },
    { title: 'With junk, a match cannot start on a blank', code: "import difflib\ndifflib.SequenceMatcher(lambda x: x == ' ', ' abcd', 'abcd abcd').find_longest_match(0, 5, 0, 9)", returns: 'Match(a=1, b=0, size=4)' },
    { title: 'No match: size 0 at (alo, blo)', code: "import difflib\ndifflib.SequenceMatcher(None, 'ab', 'c').find_longest_match(0, 2, 0, 1)", returns: 'Match(a=0, b=0, size=0)' },
    { title: 'Match is a named tuple', code: "import difflib\nm = difflib.SequenceMatcher(None, 'abxcd', 'abcd').find_longest_match()\n(m.a, m.size, m._asdict(), isinstance(m, tuple))", returns: "(0, 2, {'a': 0, 'b': 0, 'size': 2}, True)" },
    { title: 'difflib.Match itself', code: 'import difflib\n(difflib.Match(1, 2, 3), difflib.Match._fields)', returns: "(Match(a=1, b=2, size=3), ('a', 'b', 'size'))" },
  ],

  pitfalls: [
    {
      name: 'Treating the final dummy block as a match',
      desc: 'get_matching_blocks always ends with Match(len(a), len(b), 0), so code that slices every block gets an empty string at the end.',
      wrong: { label: 'every block', code: "import difflib\na = 'abxcd'\n[a[m.a:m.a + m.size] for m in difflib.SequenceMatcher(None, a, 'abcd').get_matching_blocks()]", output: "['ab', 'cd', '']" },
      fix:   { label: 'if m.size',   code: "import difflib\na = 'abxcd'\n[a[m.a:m.a + m.size] for m in difflib.SequenceMatcher(None, a, 'abcd').get_matching_blocks() if m.size]", output: "['ab', 'cd']" },
    },
    {
      name: 'Passing an end index past the sequence',
      desc: 'find_longest_match indexes a[i] for every i in range(alo, ahi) instead of slicing, so an ahi larger than len(a) raises IndexError. Leave ahi and bhi as None (3.9+) or pass len().',
      wrong: { label: 'ahi=10',   code: "import difflib\ndifflib.SequenceMatcher(None, 'ab', 'ab').find_longest_match(0, 10, 0, 2)", output: 'IndexError: string index out of range' },
      fix:   { label: 'defaults', code: "import difflib\ndifflib.SequenceMatcher(None, 'ab', 'ab').find_longest_match()", output: 'Match(a=0, b=0, size=2)' },
    },
  ],

  when: {
    use: [
      'Finding the longest common substring of two strings (find_longest_match)',
      'Listing every shared part of two sequences (get_matching_blocks)',
      'Building alignment views, where opcodes would be too detailed',
    ],
    avoid: [
      'Edit operations → get_opcodes',
      'A similarity score → ratio(), which sums these blocks for you',
    ],
  },

  notes: {
    cpython:      'Lib/difflib.py: find_longest_match scans a[alo:ahi] against b2j (positions of each element in b), extends the best block with equal non-junk neighbours (popular elements are not in b2j), then absorbs equal junk on both sides. get_matching_blocks runs it with an explicit queue instead of recursion, sorts the blocks and merges adjacent ones',
    'Guarantee':  'Since Python 2.5 adjacent blocks never touch: if (i, j, n) and (i2, j2, n2) follow each other, i + n != i2 or j + n != j2. Match became a named tuple in 2.6',
    'Indexes':    'The range arguments are used as plain indexes: an ahi beyond len(a) raises IndexError once the scan reaches it',
  },

  related: [
    { name: 'SequenceMatcher.get_opcodes', slug: 'sequencematcher-get_opcodes', when: 'The edits between the blocks' },
    { name: 'SequenceMatcher.ratio',       slug: 'sequencematcher-ratio',       when: 'Sums the block sizes into a score' },
    { name: 'SequenceMatcher',             slug: 'sequencematcher',             when: 'isjunk and autojunk shape the blocks' },
    { name: 'collections.namedtuple',      slug: 'namedtuple', when: 'What Match is built with', category: 'stdlib/collections' },
  ],

  faq: [
    {
      q: 'How do I find the longest common substring of two strings in Python?',
      a: 'difflib.SequenceMatcher(None, a, b).find_longest_match() returns Match(a=i, b=j, size=n); the substring is a[i:i+n]. Before Python 3.9 pass the range explicitly: find_longest_match(0, len(a), 0, len(b)). With the default autojunk, very frequent items of a b with 200+ elements are skipped as starting points, so for long inputs pass autojunk=False to get the true longest block.',
    },
    {
      q: 'Why does get_matching_blocks end with a size-0 block?',
      a: 'It is a sentinel, Match(a=len(a), b=len(b), size=0), and the only block with size 0. It makes it easy to process the gap after the last real match — get_opcodes relies on it.',
    },
    {
      q: 'Does get_matching_blocks find the longest common subsequence?',
      a: "No. It takes the longest contiguous block first and only looks left and right of it. For 'tide' and 'diet' every block has length 1; the first one found, the t at the start of 'tide', matches the t at the end of 'diet' and leaves nothing on either side, so only 1 element matches although 'ie' would give 2.",
    },
    {
      q: 'What is difflib.Match?',
      a: "A named tuple with the fields a, b and size, created by collections.namedtuple('Match', 'a b size'). It is what find_longest_match and get_matching_blocks return, and it unpacks like a plain 3-tuple.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.SequenceMatcher.get_matching_blocks',
    meta:  'SequenceMatcher.get_matching_blocks',
  },
};
