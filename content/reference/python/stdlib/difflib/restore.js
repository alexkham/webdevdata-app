// content/reference/python/stdlib/difflib/restore.js

export const meta = {
  slug:        'restore',
  name:        'difflib.restore',
  signature:   'difflib.restore(delta, which)',
  blurb:       'Extract one of the two original sequences from an ndiff or Differ delta: which=1 gives back a, which=2 gives back b.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'difflib restore python recover original from ndiff delta which 1 2 rebuild old new version from diff unknown delta choice must be 1 or 2',
};

export const method = {
  slug:      'restore',
  name:      'difflib.restore',
  signature: 'difflib.restore(delta, which)',
  returns:   { type: 'Iterator[str]', desc: 'A generator of the lines of input 1 or 2, with their two-character prefixes removed.' },

  category:    'difflib function',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'An ndiff delta contains both inputs: common lines start with "  ", lines of a with "- " and lines of b with "+ ". restore keeps the common lines plus one side and strips the prefixes; the "? " hint lines are dropped.',

  covers: ['restore'],

  cheat: {
    commonCall: 'list(difflib.restore(delta, 2))',
    returns:    'the lines of b (which=2) or a (which=1)',
    replaces:   'storing both versions next to their diff',
    watchOut:   'only ndiff/Differ deltas — not unified diffs',
  },

  parameters: [
    { name: 'delta', type: 'Iterable[str]', required: true, default: null, desc: 'The output of ndiff() or Differ.compare() — a list, or the generator itself (consumed once).' },
    { name: 'which', type: 'int',           required: true, default: null, desc: '1 for the first sequence, 2 for the second. Passed through int(), so 1.9 or "1" also select 1; a value whose int() is neither 1 nor 2 raises ValueError.' },
  ],

  modes: [
    {
      id: 'restore',
      label: 'restore',
      blurb: 'Build an ndiff delta of the two texts (| separates lines), then pull one side back out.',
      params: [
        { name: 'old',   type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new',   type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'which', type: 'int', hint: '1 = old, 2 = new', input: 'number' },
      ],
      template: "import difflib\nold = [line + '\\n' for line in {$old}.split('|')]\nnew = [line + '\\n' for line in {$new}.split('|')]\ndelta = list(difflib.ndiff(old, new))\nlist(difflib.restore(delta, {$which}))",
      cases: [
        { id: 'one', label: 'which=1', values: { old: 'one|two|three', new: 'ore|tree|emu', which: '1' } },
        { id: 'two', label: 'which=2', values: { old: 'one|two|three', new: 'ore|tree|emu', which: '2' } },
        { id: 'bad', label: 'which=3', values: { old: 'a|b', new: 'a|c', which: '3' } },
      ],
    },
  ],
  demoExplainer: 'which=1 keeps the "  " and "- " lines and gives back old exactly, which=2 keeps "  " and "+ " and gives back new; the "? " hint lines belong to neither. Any other number raises ValueError — here the list() call is what triggers it, since restore itself is a generator.',

  patterns: [
    {
      name: 'Store one delta instead of two versions',
      desc: 'Both sides can be rebuilt from the delta later.',
      code: "import difflib\ndelta = list(difflib.ndiff(before, after))\nassert list(difflib.restore(delta, 1)) == before\nassert list(difflib.restore(delta, 2)) == after",
    },
    {
      name: 'Rebuild the new text as one string',
      desc: 'With lines that end in "\\n", joining gives the original text back.',
      code: "import difflib\nnew_text = ''.join(difflib.restore(delta, 2))",
    },
  ],

  examples: [
    { title: 'Both sides of the docs example', code: "import difflib\ndelta = list(difflib.ndiff(['one\\n', 'two\\n', 'three\\n'], ['ore\\n', 'tree\\n', 'emu\\n']))\n(list(difflib.restore(delta, 1)), list(difflib.restore(delta, 2)))", returns: "(['one\\n', 'two\\n', 'three\\n'], ['ore\\n', 'tree\\n', 'emu\\n'])" },
    { title: 'The ? hint lines are skipped', code: "import difflib\ndelta = list(difflib.ndiff(['one\\n', 'two\\n'], ['one\\n', 'too\\n']))\n(delta, list(difflib.restore(delta, 2)))", returns: "(['  one\\n', '- two\\n', '?  ^\\n', '+ too\\n', '?  ^\\n'], ['one\\n', 'too\\n'])" },
    { title: 'which goes through int()', code: "import difflib\ndelta = list(difflib.ndiff(['a\\n'], ['b\\n']))\nlist(difflib.restore(delta, '2'))", returns: "['b\\n']" },
    { title: 'Any other value is a ValueError', code: "import difflib\nlist(difflib.restore([], 0))", returns: 'ValueError: unknown delta choice (must be 1 or 2): 0' },
    { title: 'The error waits for the first next()', code: "import difflib\ngen = difflib.restore([], 5)\ntype(gen).__name__", returns: "'generator'" },
  ],

  pitfalls: [
    {
      name: 'Restoring from a unified diff',
      desc: 'restore looks for the two-character prefixes "  ", "- " and "+ " of ndiff. Unified diff lines use one-character prefixes and only carry n lines of context, so nothing (or garbage) comes back.',
      wrong: { label: 'unified_diff', code: "import difflib\nlist(difflib.restore(difflib.unified_diff(['a', 'b'], ['a', 'c'], lineterm=''), 2))", output: '[]' },
      fix:   { label: 'ndiff',        code: "import difflib\nlist(difflib.restore(difflib.ndiff(['a', 'b'], ['a', 'c']), 2))", output: "['a', 'c']" },
    },
    {
      name: 'Reusing a delta generator',
      desc: 'ndiff returns a generator. restore consumes it, so the second restore gets nothing. Keep the delta in a list.',
      wrong: { label: 'generator twice', code: "import difflib\ndelta = difflib.ndiff(['a\\n'], ['b\\n'])\nfirst = list(difflib.restore(delta, 1))\nlist(difflib.restore(delta, 2))", output: '[]' },
      fix:   { label: 'list(delta)',     code: "import difflib\ndelta = list(difflib.ndiff(['a\\n'], ['b\\n']))\nfirst = list(difflib.restore(delta, 1))\nlist(difflib.restore(delta, 2))", output: "['b\\n']" },
    },
  ],

  when: {
    use: [
      'Keeping a single ndiff delta and recovering either version from it',
      'Checking that a delta is complete: restore(delta, 1) == a and restore(delta, 2) == b',
    ],
    avoid: [
      'Applying unified or context diffs → the patch tool or git apply',
      'Getting only the changes → filter the delta for "- " / "+ " lines instead',
    ],
  },

  notes: {
    cpython:    'Lib/difflib.py: tag = {1: "- ", 2: "+ "}[int(which)], then every line whose first two characters are "  " or the tag is yielded without them',
    'Laziness': 'restore is a generator function: even the ValueError for a bad which is raised only when the first item is requested',
  },

  related: [
    { name: 'difflib.ndiff',  slug: 'ndiff',  when: 'Produces the delta restore reads' },
    { name: 'difflib.Differ', slug: 'differ', when: 'Differ.compare deltas work too' },
    { name: 'difflib.unified_diff', slug: 'unified_diff', when: 'A format restore cannot read' },
  ],

  faq: [
    {
      q: 'How do I get the original text back from a difflib diff?',
      a: "If the diff came from ndiff() or Differ.compare(), call difflib.restore(delta, 1) for the first text or restore(delta, 2) for the second and join the lines. A unified or context diff does not contain the unchanged lines outside its context, so it cannot be turned back into either file by difflib.",
    },
    {
      q: 'What does "unknown delta choice (must be 1 or 2)" mean?',
      a: 'The which argument was not 1 or 2 after int(). Note that the error appears only when you iterate the result, because restore is a generator.',
    },
    {
      q: 'How do I apply a diff or patch in Python?',
      a: 'The standard library has no patch tool. difflib.restore only works on ndiff / Differ deltas, which contain every line of both inputs. To apply a unified diff use the patch command or git apply.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.restore',
    meta:  'difflib.restore',
  },
};
