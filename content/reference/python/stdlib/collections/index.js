// content/reference/python/stdlib/collections/index.js — the collections module hub

export const meta = {
  slug:        'index',
  name:        'collections',
  signature:   'import collections',
  blurb:       'Specialized containers beyond dict, list and tuple — Counter, deque, defaultdict, OrderedDict, namedtuple and ChainMap.',
  category:    'functional',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'collections module python counter deque defaultdict ordereddict namedtuple chainmap userdict userlist userstring container datatypes count frequency queue stack double ended queue grouping default dictionary',
};

export const method = {
  slug: 'index',
  name: 'collections',

  category:    'Iterators & containers',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Six ready-made containers that replace the loops everyone writes by hand: counting (Counter), grouping (defaultdict), queues and sliding windows (deque), records (namedtuple), ordered-dict tricks (OrderedDict) and layered lookups (ChainMap).',

  // every public name these classes define themselves must have a member page
  coverClasses: ['Counter', 'deque', 'OrderedDict', 'defaultdict', 'ChainMap'],

  imports: ['from collections import Counter, deque, defaultdict', 'import collections'],
  facts: [
    { label: 'Public API', value: 'Counter, deque, defaultdict, OrderedDict, namedtuple, ChainMap, UserDict, UserList, UserString' },
    { label: 'Speed',      value: 'deque and defaultdict are written in C (Modules/_collectionsmodule.c); Counter counting uses a C helper too' },
    { label: 'Dict family', value: 'Counter, defaultdict and OrderedDict are dict subclasses — every dict method works on them' },
    { label: 'Abstract base classes', value: 'Iterable, Mapping, Sequence … live in collections.abc (the old aliases in collections were removed in 3.10)' },
  ],

  modes: [
    {
      id: 'count',
      label: 'Counter',
      blurb: 'Count words and ask for the most common ones.',
      params: [
        { name: 'text', type: 'str', hint: 'some words', input: 'text' },
        { name: 'n',    type: 'int', hint: 'how many',   input: 'number' },
      ],
      template: 'from collections import Counter\nCounter({$text}.split()).most_common({$n})',
      cases: [
        { id: 'words', label: 'word count', values: { text: 'the cat and the hat and the bat', n: '2' } },
        { id: 'ties',  label: 'ties',       values: { text: 'b a b a c', n: '3' } },
        { id: 'empty', label: 'no words',   values: { text: '', n: '3' } },
      ],
    },
    {
      id: 'window',
      label: 'deque',
      blurb: 'A deque with maxlen keeps only the newest items — a sliding window.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'size',  type: 'int',       hint: 'maxlen',                input: 'number' },
      ],
      template: 'from collections import deque\nd = deque(maxlen={$size})\nfor x in {$items}:\n    d.append(x)\nd',
      cases: [
        { id: 'last3', label: 'last 3',   values: { items: 'a, b, c, d, e', size: '3' } },
        { id: 'room',  label: 'fits',     values: { items: 'a, b', size: '5' } },
        { id: 'neg',   label: 'maxlen -1', values: { items: 'a', size: '-1' } },
      ],
    },
    {
      id: 'group',
      label: 'defaultdict',
      blurb: 'Group words by their first letter, without checking whether the key exists.',
      params: [{ name: 'words', type: 'list[str]', hint: 'comma-separated words', input: 'csv' }],
      template: 'from collections import defaultdict\ngroups = defaultdict(list)\nfor word in {$words}:\n    groups[word[0]].append(word)\ngroups',
      cases: [
        { id: 'fruit', label: 'fruit',       values: { words: 'apple, banana, avocado, blueberry, cherry' } },
        { id: 'blank', label: 'empty word',  values: { words: 'apple, , cherry' } },
      ],
    },
  ],
  demoExplainer: 'most_common orders by count and keeps the first-seen order among equal counts, so in "ties" b beats a only because it appeared first. The deque drops items from the left once maxlen is reached, and a negative maxlen is a ValueError. In the grouping tab an empty word has no first letter: word[0] raises IndexError before defaultdict is even asked.',

  patterns: [
    {
      name: 'Count anything hashable',
      desc: 'Counter takes any iterable; most_common gives the ranking.',
      code: 'from collections import Counter\ncounts = Counter(words)\ncounts.most_common(10)',
    },
    {
      name: 'Group rows by a key',
      desc: 'defaultdict(list) creates the empty list the first time a key is used.',
      code: 'from collections import defaultdict\nby_city = defaultdict(list)\nfor row in rows:\n    by_city[row["city"]].append(row)',
    },
    {
      name: 'FIFO queue',
      desc: 'append on the right, popleft from the left — both O(1).',
      code: 'from collections import deque\nqueue = deque()\nqueue.append(job)\nnext_job = queue.popleft()',
    },
    {
      name: 'Keep the last N items',
      desc: 'A bounded deque discards from the opposite end automatically.',
      code: 'from collections import deque\nrecent = deque(maxlen=100)\nfor event in events:\n    recent.append(event)',
    },
    {
      name: 'A lightweight record type',
      desc: 'namedtuple gives a tuple with field names and a readable repr.',
      code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\np = Point(3, 4)\np.x + p.y",
    },
  ],

  examples: [
    { title: 'Count letters',                 code: "from collections import Counter\nCounter('mississippi')", returns: "Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})" },
    { title: 'Missing keys count as zero',    code: "from collections import Counter\nCounter('abc')['z']", returns: '0' },
    { title: 'Queue from both ends',          code: "from collections import deque\nd = deque([1, 2, 3])\nd.appendleft(0)\nd.pop()\nd", returns: 'deque([0, 1, 2])' },
    { title: 'Group with defaultdict',        code: "from collections import defaultdict\nd = defaultdict(list)\nd['fruit'].append('apple')\nd", returns: "defaultdict(<class 'list'>, {'fruit': ['apple']})" },
    { title: 'Named fields on a tuple',       code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\nPoint(3, 4)", returns: 'Point(x=3, y=4)' },
    { title: 'Layered settings',              code: "from collections import ChainMap\nChainMap({'color': 'red'}, {'color': 'blue', 'size': 'M'})['color']", returns: "'red'" },
    { title: 'OrderedDict equality is order-sensitive', code: "from collections import OrderedDict\nOrderedDict(a=1, b=2) == OrderedDict(b=2, a=1)", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Importing the abstract base classes from collections',
      desc: 'Mapping, Iterable, Sequence and friends moved to collections.abc; the old aliases were removed in Python 3.10.',
      wrong: { label: 'collections.Mapping', code: 'import collections\ncollections.Mapping', output: "AttributeError: module 'collections' has no attribute 'Mapping'" },
      fix:   { label: 'collections.abc',     code: 'import collections.abc\nisinstance({}, collections.abc.Mapping)', output: 'True' },
    },
    {
      name: 'Reading a defaultdict creates keys',
      desc: 'd[key] on a missing key inserts the default. Use "in" or .get() to look without inserting.',
      wrong: { label: 'd[key] to check', code: "from collections import defaultdict\nd = defaultdict(list)\nif d['ghost']:\n    pass\nd", output: "defaultdict(<class 'list'>, {'ghost': []})" },
      fix:   { label: "'in' to check",   code: "from collections import defaultdict\nd = defaultdict(list)\nif 'ghost' in d:\n    pass\nd", output: "defaultdict(<class 'list'>, {})" },
    },
    {
      name: 'Using a list as a queue',
      desc: 'list.pop(0) shifts every remaining item; deque.popleft() does not. The results are the same, the cost is not.',
      wrong: { label: 'list.pop(0)',     code: 'queue = [1, 2, 3]\nqueue.pop(0)', output: '1' },
      fix:   { label: 'deque.popleft()', code: 'from collections import deque\nqueue = deque([1, 2, 3])\nqueue.popleft()', output: '1' },
    },
  ],

  when: {
    use: [
      'Counting and ranking things → Counter',
      'Building dicts of lists or sets → defaultdict',
      'Queues, stacks and "last N" buffers → deque',
      'Small immutable records → namedtuple',
      'Layered configuration or scopes → ChainMap',
    ],
    avoid: [
      'Records that need defaults, type hints and methods → dataclasses (or typing.NamedTuple)',
      'Random access into the middle of a long sequence → list (deque indexing is O(n) in the middle)',
      'Priority queues → heapq; thread-to-thread queues → queue.Queue',
    ],
  },

  notes: {
    cpython:      'Lib/collections/__init__.py (Counter, OrderedDict, namedtuple, ChainMap, UserDict/List/String) plus the C module Modules/_collectionsmodule.c (deque, defaultdict, the Counter counting helper)',
    'dict subclasses': 'Counter, defaultdict and OrderedDict are dict subclasses; ChainMap is a MutableMapping that wraps several dicts',
    'collections.abc': 'The abstract base classes (Mapping, Sequence, Iterable …) live in collections.abc',
  },

  related: [
    { name: 'dict',       slug: 'dict',       when: 'The base type of Counter, defaultdict and OrderedDict', category: 'functions' },
    { name: 'list',       slug: 'list',       when: 'The alternative to deque for random access',          category: 'functions' },
    { name: 'tuple',      slug: 'tuple',      when: 'What a namedtuple is underneath',                     category: 'functions' },
    { name: 'sorted()',   slug: 'sorted',     when: 'Rank items by any key',                                category: 'functions' },
    { name: 'json module', slug: 'json',      when: 'Serialize these containers (most become dicts/lists)', category: 'stdlib' },
    { name: 'KeyError',   slug: 'keyerror',   when: 'What defaultdict and Counter avoid',                   category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the collections module in Python?',
      a: 'A standard-library module of specialized container types: Counter (counting), deque (fast double-ended queue), defaultdict (dict with automatic default values), OrderedDict (dict with reordering methods), namedtuple (tuples with named fields), ChainMap (several dicts searched as one) and UserDict/UserList/UserString (base classes for custom containers).',
    },
    {
      q: 'Do I still need OrderedDict now that dict keeps insertion order?',
      a: 'Rarely. Since Python 3.7 a plain dict keeps insertion order. OrderedDict is still the right tool when you need move_to_end(), popitem(last=False) or equality that compares order — an LRU cache is the classic case.',
    },
    {
      q: 'When should I use deque instead of list?',
      a: 'When you add or remove at the left end: deque.appendleft and popleft are O(1), while list.insert(0, x) and list.pop(0) move every element. Keep list for indexing into the middle and for slicing (deques do not support slices).',
    },
    {
      q: 'What is the difference between defaultdict and dict.setdefault?',
      a: 'Both supply a value for a missing key. defaultdict does it automatically on every d[key] lookup with its factory; setdefault(key, default) does it only where you call it, and builds the default object every time even when the key exists.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html',
    meta:  'collections — Container datatypes',
  },
};
