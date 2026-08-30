// content/reference/python/functions/set.js

export const meta = {
  slug:        'set',
  name:        'set',
  signature:   'set([iterable])',
  blurb:       'Build a mutable collection of unique elements — duplicates collapse, order is not kept.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'set constructor unique deduplicate distinct remove duplicates membership convert iterable',
};

export const method = {
  slug:      'set',
  name:      'set',
  signature: 'set([iterable])',
  returns:   { type: 'set', desc: 'A new set containing the unique elements of iterable. With no argument, an empty set.' },

  category:    'Built-in function / type',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'The deduplication tool, and the fastest membership test in Python. The price is that order is gone and elements must be hashable.',

  cheat: {
    commonCall: 'set(iterable)',
    returns:    'a new set — unique elements, arbitrary order',
    replaces:   'a list plus an "if x not in seen" loop',
    watchOut:   'the empty set is set(), not {} — {} is an empty dict',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: false, default: '()', desc: 'Any iterable of hashable elements. Omitted gives an empty set. Unhashable elements raise TypeError.' },
  ],

  demoParams: [
    { name: 'iterable', type: 'str', hint: 'a string to split into unique characters', input: 'text' },
  ],
  cases: [
    { id: 'dupes',  label: 'duplicates collapse', values: { iterable: 'hello' } },
    { id: 'unique', label: 'already unique',      values: { iterable: 'abc' } },
    { id: 'same',   label: 'all the same',        values: { iterable: 'aaa' } },
    { id: 'empty',  label: 'empty string',        values: { iterable: '' } },
  ],
  demoExplainer: 'set keeps one of each distinct element and discards the rest, so "hello" gives four characters rather than five — the second l is gone. The display order is arbitrary and carries no meaning; it reflects hash placement, not insertion. Note the empty case renders as set(), because {} already means an empty dict.',

  patterns: [
    {
      name: 'Deduplicate a sequence',
      desc: 'The most common use by far. Wrap in sorted or list if you need an order back.',
      code: 'unique = set(items)\nordered = sorted(set(items))',
    },
    {
      name: 'Fast membership tests',
      desc: 'O(1) instead of scanning a list — the win grows with size.',
      code: 'allowed = set(allowed_list)\nif user_id in allowed:\n    ...',
    },
    {
      name: 'Compare two collections',
      desc: 'Set algebra says what changed far more clearly than nested loops.',
      code: 'added   = set(new) - set(old)\nremoved = set(old) - set(new)',
    },
  ],

  examples: [
    { title: 'Duplicates collapse', code: "set('hello')",           returns: "{'h', 'e', 'l', 'o'}" },
    { title: 'From a list',         code: 'set([1, 2, 2, 3])',      returns: '{1, 2, 3}' },
    { title: 'Empty',               code: 'set()',                  returns: 'set()' },
    { title: 'Braces make a dict',  code: 'type({})',               returns: "<class 'dict'>" },
    { title: 'Deduplicate + order', code: 'sorted(set([3, 1, 3]))', returns: '[1, 3]' },
    { title: 'Unhashable rejected', code: 'set([[1], [2]])',        returns: "TypeError: unhashable type: 'list'" },
  ],

  pitfalls: [
    {
      name: 'The empty set is set(), not {}',
      desc: 'Braces were taken by dict first, so {} is an empty dict. Writing {} for an empty set gives a mapping, and the failure surfaces later at an unrelated line.',
      wrong: { label: 'Actually a dict', code: 's = {}\ntype(s)', output: "<class 'dict'>" },
      fix:   { label: 'Call the type',   code: 's = set()\ntype(s)', output: "<class 'set'>" },
    },
    {
      name: 'Order is not preserved and not stable',
      desc: 'Sets have no order. The display order can differ between types, between runs for strings, and between Python versions. Never rely on it, and never index a set.',
      wrong: { label: 'No indexing', code: "set('abc')[0]", output: "TypeError: 'set' object is not subscriptable" },
      fix:   { label: 'Sort for order', code: "sorted(set('abc'))[0]", output: "'a'" },
    },
    {
      name: 'Elements must be hashable',
      desc: 'Lists and dicts cannot go in a set. This bites when deduplicating rows — convert each row to a tuple first.',
      wrong: { label: 'Lists rejected', code: 'set([[1, 2], [3]])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Tuples work',    code: 'set([(1, 2), (3,)])', output: '{(1, 2), (3,)}' },
    },
    {
      name: 'True and 1 collapse into one element',
      desc: 'Set membership uses equality, and True == 1, so a set cannot hold both. Whichever arrived first is the one kept.',
      wrong: { label: 'Merged', code: 'set([1, True, 1.0])', output: '{1}' },
      fix:   { label: 'Keep types apart', code: "set([(int, 1), (bool, True)])", output: 'both survive' },
    },
  ],

  when: {
    use: [
      'Removing duplicates from a sequence',
      'Repeated membership tests against a fixed collection',
      'Comparing collections — added, removed, shared',
      'Any "have I seen this before" bookkeeping',
    ],
    avoid: [
      'Order matters → a list, or dict.fromkeys to dedupe while keeping order',
      'Elements are unhashable → convert to tuples first',
      'You need the value as a dict key → frozenset, which is hashable',
    ],
  },

  notes: {
    complexity: 'O(n) to build; O(1) average for membership tests afterwards',
    return:     'Always a new set; set(s) copies rather than returning s',
    cpython:    'Objects/setobject.c :: set_init',
    memory:     'A hash table — noticeably larger per element than a list',
    threadSafe: 'The construction is safe; the resulting set is not under concurrent mutation',
  },

  related: [
    { name: 'frozenset',    slug: 'frozenset',    when: 'You need the set itself to be hashable' },
    { name: 'list',         slug: 'list',         when: 'Order matters and duplicates should stay' },
    { name: 'dict.fromkeys',slug: 'dict-fromkeys',when: 'Deduplicate while PRESERVING insertion order' },
    { name: 'sorted',       slug: 'sorted',       when: 'Turn the set back into an ordered list' },
  ],

  faq: [
    {
      q: 'How do I deduplicate but keep the original order?',
      a: 'Use dict.fromkeys — dicts preserve insertion order since 3.7, so the keys come back in first-seen order. A set cannot do this because it has no order to preserve.',
      code: 'list(dict.fromkeys(items))',
    },
    {
      q: 'Why is the display order different from what I put in?',
      a: 'Elements sit wherever their hash lands, not where you inserted them. For strings the hash is randomised per process by default, so the order can even differ between runs of the same script. Sort if you need a stable order.',
      code: "sorted(set('hello'))\n# ['e', 'h', 'l', 'o']",
    },
    {
      q: 'Is set() faster than a list for lookups?',
      a: 'Dramatically, once the collection is more than a handful of items. Membership in a list scans element by element, O(n); in a set it is a single hash lookup, O(1) on average. Building the set costs one pass, so it pays off as soon as you test more than a few times.',
    },
  ],

  history: [
    { version: '2.3', note: 'Sets arrived in the standard library as the sets module.' },
    { version: '2.4', note: 'set and frozenset promoted to built-in types.' },
    { version: '2.7', note: 'Set comprehensions and the {1, 2, 3} literal syntax added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#set',
    meta:  'set',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect collections before deduplicating' },
  ],
};
