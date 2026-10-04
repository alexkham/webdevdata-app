// content/reference/python/stdlib/random/shuffle.js

export const meta = {
  slug:        'shuffle',
  name:        'random.shuffle',
  signature:   'random.shuffle(x)',
  blurb:       'Shuffle a list in place (Fisher-Yates) and return None. For a shuffled copy, or an immutable sequence, use sample(x, k=len(x)).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (random= parameter removed in 3.11)',
  searchTerms: 'random.shuffle shuffle python shuffle list randomize order shuffle returns none shuffle string shuffle tuple fisher yates in place Random.shuffle str object does not support item assignment',
};

export const method = {
  slug:      'shuffle',
  name:      'random.shuffle',
  signature: 'random.shuffle(x)',
  returns:   { type: 'None', desc: 'Always None: the list itself is reordered.' },

  category:    'random function',
  version:     'All Python 3 versions (random= parameter removed in 3.11)',
  hasLiveDemo: true,

  subtitle: 'The classic trap: shuffle() changes the list you pass and returns None, so x = random.shuffle(x) loses the list. Strings and tuples cannot be shuffled in place at all.',

  covers: ['shuffle', 'Random.shuffle'],

  cheat: {
    commonCall: 'random.shuffle(cards)',
    returns:    'None (cards is now reordered)',
    replaces:   'A hand-written Fisher-Yates loop',
    watchOut:   'Do not assign the result; use sample(x, k=len(x)) for a copy',
  },

  parameters: [
    { name: 'x', type: 'list (mutable sequence)', required: true, default: null, desc: 'Reordered in place. Needs len() and item assignment: a str or tuple raises TypeError.' },
  ],

  modes: [
    {
      id: 'inplace',
      label: 'in place',
      blurb: 'Keep the return value and the list side by side: one is None, the other is shuffled.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string',    input: 'auto' },
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
      ],
      template: 'import random\nrandom.seed({$seed})\nitems = {$items}\nresult = random.shuffle(items)\n(result, items)',
      cases: [
        { id: 'four', label: 'four items', values: { seed: '42', items: 'a, b, c, d' } },
        { id: 'six',  label: 'six items',  values: { seed: '7', items: 'a, b, c, d, e, f' } },
        { id: 'one',  label: 'one item',   values: { seed: '42', items: 'solo' } },
      ],
    },
    {
      id: 'copy',
      label: 'shuffled copy',
      blurb: 'sample(items, k=len(items)) returns a new shuffled list and leaves the original alone.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string',    input: 'auto' },
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
      ],
      template: 'import random\nrandom.seed({$seed})\nitems = {$items}\ncopy = random.sample(items, k=len(items))\n(items, copy)',
      cases: [
        { id: 'four', label: 'four items', values: { seed: '42', items: 'a, b, c, d' } },
        { id: 'six',  label: 'six items',  values: { seed: '7', items: 'a, b, c, d, e, f' } },
      ],
    },
  ],
  demoExplainer: 'shuffle() walks the list from the end: for each position i it draws j with _randbelow(i + 1) and swaps items i and j, so n items cost n - 1 calls to _randbelow. Same seed and same items, same order. Note that sample(items, k=len(items)) draws differently, so with seed 42 the copy is a, d, b, c while the in-place shuffle gives c, b, d, a.',

  patterns: [
    {
      name: 'Shuffle a deck and deal',
      desc: 'Shuffle once, then slice.',
      code: "import random\ndeck = [r + s for s in 'SHDC' for r in 'A23456789TJQK']\nrandom.shuffle(deck)\nhand, deck = deck[:5], deck[5:]",
    },
    {
      name: 'Shuffled copy, original untouched',
      desc: 'Works for tuples and strings too.',
      code: 'import random\nshuffled = random.sample(items, k=len(items))',
    },
    {
      name: 'Scramble a word',
      desc: 'Strings are immutable: shuffle a list of characters and join.',
      code: "import random\nletters = list(word)\nrandom.shuffle(letters)\nscrambled = ''.join(letters)",
    },
    {
      name: 'Permutation test',
      desc: 'Reshuffle the pooled data many times (from the random docs recipes).',
      code: 'import random\ncombined = drug + placebo\nfor _ in range(10_000):\n    random.shuffle(combined)\n    new_diff = mean(combined[:len(drug)]) - mean(combined[len(drug):])',
    },
  ],

  examples: [
    { title: 'Shuffle in place',             code: 'import random\nrandom.seed(42)\nx = [1, 2, 3, 4, 5]\nrandom.shuffle(x)\nx',                         returns: '[4, 2, 3, 5, 1]' },
    { title: 'The return value is None',     code: 'import random\nrandom.seed(42)\nx = [1, 2, 3, 4, 5]\nresult = random.shuffle(x)\n(result, x)',     returns: '(None, [4, 2, 3, 5, 1])' },
    { title: 'A shuffled copy with sample',  code: "import random\nrandom.seed(42)\nx = list('abcdef')\ny = random.sample(x, k=len(x))\n(x, y)",       returns: "(['a', 'b', 'c', 'd', 'e', 'f'], ['f', 'a', 'e', 'c', 'b', 'd'])" },
    { title: 'Scramble a word',              code: "import random\nrandom.seed(42)\nword = list('python')\nrandom.shuffle(word)\n''.join(word)",       returns: "'hytopn'" },
    { title: 'Same elements, new order',     code: 'import random\nrandom.seed(42)\nx = list(range(8))\nrandom.shuffle(x)\nsorted(x) == list(range(8))', returns: 'True' },
    { title: 'Every name for the list sees it', code: 'import random\nrandom.seed(42)\na = list(range(5))\nb = a\nrandom.shuffle(b)\na',                   returns: '[3, 1, 2, 4, 0]' },
    { title: 'A str cannot be shuffled',     code: "import random\nrandom.shuffle('abc')",                                                       returns: "TypeError: 'str' object does not support item assignment" },
  ],

  pitfalls: [
    {
      name: 'x = random.shuffle(x)',
      desc: 'shuffle() returns None, like list.sort(). Assigning its result replaces your list with None.',
      wrong: { label: 'assign the result', code: 'import random\nrandom.seed(42)\nx = [1, 2, 3, 4, 5]\nx = random.shuffle(x)\nprint(x)', output: 'None' },
      fix:   { label: 'just call it',      code: 'import random\nrandom.seed(42)\nx = [1, 2, 3, 4, 5]\nrandom.shuffle(x)\nx',          output: '[4, 2, 3, 5, 1]' },
    },
    {
      name: 'Shuffling a temporary copy',
      desc: 'shuffle(list(t)) shuffles a new list that is thrown away immediately; the tuple is unchanged. Keep the copy, or use sample().',
      wrong: { label: 'shuffle(list(t))', code: "import random\nrandom.seed(42)\nt = ('a', 'b', 'c')\nrandom.shuffle(list(t))\nt", output: "('a', 'b', 'c')" },
      fix:   { label: 'sample(t, k=len(t))', code: "import random\nrandom.seed(42)\nt = ('a', 'b', 'c')\nrandom.sample(t, k=len(t))", output: "['c', 'a', 'b']" },
    },
  ],

  when: {
    use: [
      'Randomizing the order of a list you own: decks, playlists, quiz questions',
      'Permutation tests and randomized algorithms',
    ],
    avoid: [
      'Keeping the original order → sample(x, k=len(x))',
      'Strings and tuples → sample() or a list copy',
      'Very long lists when every permutation must be possible: the Mersenne Twister period only covers all orderings up to 2080 items',
    ],
  },

  notes: {
    cpython: 'Lib/random.py: for i in reversed(range(1, len(x))): j = randbelow(i + 1); x[i], x[j] = x[j], x[i] — integer draws only, identical on every platform',
    'Removed':  'The optional random= argument (a custom float function) was removed in Python 3.11',
    'Period':   'The docs note that a sequence of length 2080 is the largest whose permutations can all be produced within the generator period',
  },

  related: [
    { name: 'random.sample', slug: 'sample', when: 'A shuffled copy, or a random subset' },
    { name: 'random.choice', slug: 'choice', when: 'Just one random item' },
    { name: 'list.sort()',   slug: 'list-sort', when: 'Also in place, also returns None', category: 'functions' },
    { name: 'list()',        slug: 'list',      when: 'Make a mutable copy to shuffle', category: 'functions' },
    { name: 'TypeError',     slug: 'typeerror', when: 'Raised for str and tuple', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does random.shuffle return None?',
      a: 'It works in place, like list.sort(): the list you passed is reordered and None is returned so that nobody mistakes it for a copy. Use the list itself afterwards, or random.sample(x, k=len(x)) for a new list.',
    },
    {
      q: 'How do I shuffle a string in Python?',
      a: "Strings are immutable. Use ''.join(random.sample(s, k=len(s))), or convert to a list, shuffle it and join.",
    },
    {
      q: 'How do I shuffle a list without changing the original?',
      a: 'random.sample(original, k=len(original)) returns a shuffled copy. Alternatively copy first (new = original[:]) and shuffle the copy.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.shuffle',
    meta:  'random.shuffle',
  },
};
