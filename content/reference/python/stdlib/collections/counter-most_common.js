// content/reference/python/stdlib/collections/counter-most_common.js

export const meta = {
  slug:        'counter-most_common',
  name:        'Counter.most_common',
  signature:   'Counter.most_common(n=None)',
  blurb:       'The n most common elements and their counts, highest first — ties keep the order the elements were first seen.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'counter most_common most common top n frequent elements ranking least common tie order python collections Counter.most_common',
};

export const method = {
  slug:      'counter-most_common',
  name:      'Counter.most_common',
  signature: 'Counter.most_common(n=None)',
  returns:   { type: 'list[tuple[element, int]]', desc: '(element, count) pairs, highest count first. All of them when n is None.' },

  category:    'Counter method',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'A sorted list of (element, count) pairs. Equal counts are not sorted alphabetically — they stay in first-seen order — and the n least common are one slice away.',

  covers: ['Counter.most_common'],

  cheat: {
    commonCall: 'Counter(words).most_common(3)',
    returns:    "[('the', 4), ('and', 2), ('cat', 1)] — a list of tuples",
    replaces:   'sorted(d.items(), key=lambda kv: kv[1], reverse=True)[:n]',
    watchOut:   'ties are in insertion order, not alphabetical',
  },

  parameters: [
    { name: 'n', type: 'int | None', required: false, default: 'None', desc: 'How many pairs to return. None returns every element; 0 or a negative number returns [].' },
  ],

  modes: [
    {
      id: 'top',
      label: 'top n',
      blurb: 'Rank words by frequency. Leave n empty for None (every word).',
      params: [
        { name: 'text', type: 'str',        hint: 'some words',          input: 'text' },
        { name: 'n',    type: 'int | None', hint: 'how many (empty = None)', input: 'number-or-none' },
      ],
      template: 'from collections import Counter\nCounter({$text}.split()).most_common({$n})',
      cases: [
        { id: 'top2', label: 'top 2',   values: { text: 'red blue red green blue red', n: '2' } },
        { id: 'all',  label: 'n=None',  values: { text: 'red blue red green blue red', n: '' } },
        { id: 'zero', label: 'n=0',     values: { text: 'red blue', n: '0' } },
        { id: 'big',  label: 'n > size', values: { text: 'red blue', n: '10' } },
      ],
    },
    {
      id: 'ties',
      label: 'ties',
      blurb: 'Equal counts come out in the order the elements first appeared.',
      params: [{ name: 'text', type: 'str', hint: 'letters', input: 'text' }],
      template: 'from collections import Counter\nCounter({$text}).most_common()',
      cases: [
        { id: 'cab', label: 'c, a, b', values: { text: 'cabcab' } },
        { id: 'mix', label: 'mixed',   values: { text: 'zzyyyx' } },
      ],
    },
    {
      id: 'least',
      label: 'least common',
      blurb: 'The docs idiom for the n least common: slice the full list backwards.',
      params: [
        { name: 'text', type: 'str', hint: 'letters',  input: 'text' },
        { name: 'n',    type: 'int', hint: 'how many', input: 'number' },
      ],
      template: 'from collections import Counter\nc = Counter({$text})\nc.most_common()[:-{$n}-1:-1]',
      cases: [
        { id: 'two', label: '2 least', values: { text: 'aaabbc', n: '2' } },
        { id: 'one', label: '1 least', values: { text: 'hello world', n: '1' } },
      ],
    },
  ],
  demoExplainer: 'For "cabcab" every letter appears twice, so most_common() returns them in first-seen order: c, a, b. The least-common slice walks the ranked list from the end, which also reverses the tie order.',

  patterns: [
    {
      name: 'Top N report',
      desc: 'Unpack the pairs directly in the loop.',
      code: 'from collections import Counter\nfor word, count in Counter(words).most_common(10):\n    print(f"{word:<15}{count}")',
    },
    {
      name: 'The single most common element',
      desc: 'most_common(1) returns a one-item list — index into it.',
      code: 'from collections import Counter\nvalue, count = Counter(votes).most_common(1)[0]',
    },
    {
      name: 'Deterministic tie-break',
      desc: 'Sort yourself when ties must be alphabetical.',
      code: 'from collections import Counter\nranked = sorted(Counter(words).items(), key=lambda kv: (-kv[1], kv[0]))',
    },
  ],

  examples: [
    { title: 'Top 2 letters',                 code: "from collections import Counter\nCounter('abracadabra').most_common(2)", returns: "[('a', 5), ('b', 2)]" },
    { title: 'Ties keep first-seen order',    code: "from collections import Counter\nCounter('abracadabra').most_common(3)", returns: "[('a', 5), ('b', 2), ('r', 2)]" },
    { title: 'n=None returns everything',     code: "from collections import Counter\nCounter('aab').most_common()", returns: "[('a', 2), ('b', 1)]" },
    { title: 'Negative n returns an empty list', code: "from collections import Counter\nCounter('aab').most_common(-1)", returns: '[]' },
    { title: 'The single winner',             code: "from collections import Counter\nCounter(['yes', 'no', 'yes']).most_common(1)[0][0]", returns: "'yes'" },
    { title: 'Least common',                  code: "from collections import Counter\nCounter('aaabbc').most_common()[:-2-1:-1]", returns: "[('c', 1), ('b', 2)]" },
  ],

  pitfalls: [
    {
      name: 'Expecting a dict back',
      desc: 'most_common returns a list of tuples. Wrap it in dict() for key lookups.',
      wrong: { label: "result['a']",       code: "from collections import Counter\nCounter('aab').most_common(1)['a']", output: 'TypeError: list indices must be integers or slices, not str' },
      fix:   { label: 'dict(result)',      code: "from collections import Counter\ndict(Counter('aab').most_common(1))['a']", output: '2' },
    },
    {
      name: 'Assuming alphabetical ties',
      desc: 'Among equal counts the first-seen element wins, so the answer depends on input order.',
      wrong: { label: 'order-dependent',  code: "from collections import Counter\nCounter(['b', 'a']).most_common(1)", output: "[('b', 1)]" },
      fix:   { label: 'explicit tie-break', code: "from collections import Counter\nmin(Counter(['b', 'a']).items(), key=lambda kv: (-kv[1], kv[0]))", output: "('a', 1)" },
    },
  ],

  when: {
    use: [
      'Ranking by frequency',
      'Picking the mode (most frequent value) of a list',
    ],
    avoid: [
      'The mode of numeric data with a clear error on empty input → statistics.mode / multimode',
      'Ties that must break alphabetically → sorted() with a (-count, key) key',
    ],
  },

  notes: {
    cpython:   'sorted(self.items(), key=itemgetter(1), reverse=True) when n is None, heapq.nlargest(n, …) otherwise — both keep insertion order among ties',
    'Returns': 'A new list of (element, count) tuples; the Counter is not changed',
  },

  related: [
    { name: 'Counter',        slug: 'counter',       when: 'The class itself' },
    { name: 'Counter.total',  slug: 'counter-total', when: 'Divide by it for percentages' },
    { name: 'sorted()',       slug: 'sorted',        when: 'Custom ranking and tie-breaks', category: 'functions' },
    { name: 'max()',          slug: 'max',           when: 'max(c, key=c.get) for just the winner', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the most common element in a list?',
      a: "Counter(my_list).most_common(1)[0][0]. most_common(1) returns a one-element list like [('x', 3)], so [0] is the pair and [0][0] the element. It raises IndexError on an empty list.",
    },
    {
      q: 'How are ties ordered in most_common?',
      a: 'Elements with equal counts are listed in the order they were first inserted into the Counter — not alphabetically. Sort with key=lambda kv: (-kv[1], kv[0]) if you need a deterministic alphabetical tie-break.',
    },
    {
      q: 'How do I get the least common elements?',
      a: 'c.most_common()[:-n-1:-1] returns the n least common, lowest first. For just the minimum count use min(c.values()).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.Counter.most_common',
    meta:  'Counter.most_common',
  },
};
