// content/reference/python/stdlib/pprint/saferepr.js

export const meta = {
  slug:        'saferepr',
  name:        'pprint.saferepr',
  signature:   'pprint.saferepr(object)',
  blurb:       'A one-line repr() with dict keys sorted and recursive references written as <Recursion on list with id=…> — never split over lines.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'pprint.saferepr python saferepr recursion safe repr Recursion on list with id sorted dict repr one line repr recursive data structure repr self reference',
};

export const method = {
  slug:      'saferepr',
  name:      'pprint.saferepr',
  signature: 'pprint.saferepr(object)',
  returns:   { type: 'str', desc: 'The one-line text; for values without recursion and without dicts it equals repr(object).' },

  category:    'pprint function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'The text pprint builds before it decides on a layout: like repr(), but dicts at every level come out with sorted keys, and a dict, list or tuple that contains itself is named with its type and id() instead of repr\'s [...].',

  covers: ['saferepr'],

  cheat: {
    commonCall: 'pprint.saferepr(obj)',
    returns:    "\"{'a': 2, 'b': 1}\" — one line, keys sorted",
    replaces:   'repr() when you want sorted, comparable dict text',
    watchOut:   'Recursion markers contain id() — not stable, not eval()-able',
  },

  parameters: [
    { name: 'object', type: 'any', required: true, default: null, desc: 'The value to describe. dict, list and tuple (and subclasses that keep the built-in __repr__) are walked; everything else is repr()ed.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'repr vs saferepr',
      blurb: 'The same value through repr() and saferepr(). Look at the dict key order.',
      params: [{ name: 'data', type: 'str', hint: 'a Python literal', input: 'text' }],
      template: 'import ast, pprint\ndata = ast.literal_eval({$data})\n(repr(data), pprint.saferepr(data))',
      cases: [
        { id: 'dict',   label: 'dict',           values: { data: "{'b': 1, 'a': 2}" } },
        { id: 'nested', label: 'nested',         values: { data: "[{'z': 1, 'y': 2}, ({'b': None, 'a': True},)]" } },
        { id: 'long',   label: 'long list',      values: { data: '[1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000]' } },
        { id: 'mixed',  label: 'mixed keys',     values: { data: "{'x': 1, 2: 'two', (1, 2): 'pair'}" } },
      ],
    },
    {
      id: 'recursive',
      label: 'self-reference',
      blurb: 'Append a list to itself, then compare repr() and saferepr(). The snippet replaces the real id number with ID, because it changes on every run.',
      params: [{ name: 'data', type: 'str', hint: 'a list literal', input: 'text' }],
      template: "import ast, pprint\nbox = ast.literal_eval({$data})\nbox.append(box)\n(repr(box), pprint.saferepr(box).replace(f'id={id(box)}', 'id=ID'))",
      cases: [
        { id: 'list',   label: 'list',            values: { data: '[1, 2]' } },
        { id: 'nested', label: 'inside a dict',   values: { data: "[{'k': 'v'}, (3, 4)]" } },
        { id: 'empty',  label: 'empty list',      values: { data: '[]' } },
        { id: 'tuple',  label: 'a tuple',         values: { data: '(1, 2)' } },
      ],
    },
  ],
  demoExplainer: "For a plain list the two texts are identical — saferepr never adds line breaks, however long the line. Dicts differ: repr keeps insertion order, saferepr sorts the keys, and keys that cannot be compared with each other are ordered by type name — int, then str, then tuple. A list that contains itself is [...] in repr() and an explicit <Recursion on list with id=…> in saferepr(). A tuple cannot be appended to, so the last case fails before anything is printed.",

  patterns: [
    {
      name: 'Stable text for a dict',
      desc: 'Sorted keys make equal dicts give equal text.',
      code: 'import pprint\nkey = pprint.saferepr(params)',
    },
    {
      name: 'Debug output that cannot loop',
      desc: 'Self-referencing structures are named, not expanded.',
      code: "import pprint\nprint('state =', pprint.saferepr(state))",
    },
  ],

  examples: [
    { title: 'Keys sorted, one line',       code: "import pprint\npprint.saferepr({'b': 1, 'a': 2})", returns: `"{'a': 2, 'b': 1}"` },
    { title: 'Sorted at every level',       code: "import pprint\npprint.saferepr({'z': {'y': 1, 'x': 2}, 'a': (3,)})", returns: `"{'a': (3,), 'z': {'x': 2, 'y': 1}}"` },
    { title: 'Never split into lines',      code: "import pprint\nlen(pprint.saferepr(list(range(30))).splitlines())", returns: '1' },
    { title: 'Recursion named with its id', code: "import pprint\na = [1, 2]\na.append(a)\npprint.saferepr(a).replace(str(id(a)), 'ID')", returns: "'[1, 2, <Recursion on list with id=ID>]'" },
    { title: 'What repr() does instead',    code: "a = [1, 2]\na.append(a)\nrepr(a)", returns: "'[1, 2, [...]]'" },
    { title: 'A dict that contains itself', code: "import pprint\nd = {}\nd['self'] = d\npprint.saferepr(d).replace(str(id(d)), 'ID')", returns: `"{'self': <Recursion on dict with id=ID>}"` },
    { title: 'Same as repr for scalars',    code: "import pprint\npprint.saferepr('text') == repr('text')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Feeding saferepr output back to eval()',
      desc: 'For recursive data the marker is not Python syntax. Check pprint.isreadable() before relying on eval() — and prefer ast.literal_eval for data.',
      wrong: { label: 'eval(saferepr(a))', code: "import pprint\na = [1, 2]\na.append(a)\neval(pprint.saferepr(a))", output: 'SyntaxError: invalid syntax' },
      fix:   { label: 'isreadable first',  code: "import pprint\na = [1, 2]\na.append(a)\npprint.isreadable(a)",       output: 'False' },
    },
    {
      name: 'Expecting saferepr to keep dict order',
      desc: 'saferepr is built on a default PrettyPrinter, so it sorts keys. repr() keeps insertion order and also copes with self-reference (it writes [...]).',
      wrong: { label: 'saferepr', code: "import pprint\npprint.saferepr({'b': 1, 'a': 2})", output: `"{'a': 2, 'b': 1}"` },
      fix:   { label: 'repr',     code: "repr({'b': 1, 'a': 2})",                     output: `"{'b': 1, 'a': 2}"` },
    },
  ],

  when: {
    use: [
      'A one-line, key-sorted description of nested data (log lines, cache keys for debugging, comparisons in tests)',
      'Showing self-referencing structures with an explicit marker',
    ],
    avoid: [
      'Insertion order matters → repr()',
      'Large values → pprint.pformat, which splits lines',
      'Long or deep values in logs → reprlib.repr, which truncates',
    ],
  },

  notes: {
    cpython:      'Lib/pprint.py: return PrettyPrinter()._safe_repr(object, {}, None, 0)[0] — a default printer (sort_dicts=True, no depth limit, no underscores)',
    'Recursion':  'Only dict, list and tuple (and subclasses whose __repr__ is the built-in one) are walked and checked for recursion; any other object is repr()ed as it is',
    'Format':     '<Recursion on TYPENAME with id=NUMBER>, where NUMBER is id() of the object — different on every run',
  },

  related: [
    { name: 'repr()',                 slug: 'repr',        when: 'Insertion order, [...] for recursion', category: 'functions' },
    { name: 'pprint.isreadable / isrecursive', slug: 'isreadable-isrecursive', when: 'The two flags computed with the same text' },
    { name: 'pprint.pformat',         slug: 'pformat',     when: 'The same text, split into lines when too wide' },
    { name: 'PrettyPrinter.format',   slug: 'format',      when: 'Override to change the text' },
    { name: 'id()',                   slug: 'id',          when: 'The number in the recursion marker', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between repr and pprint.saferepr?',
      a: 'saferepr sorts dict keys at every level and writes a self-reference as <Recursion on list with id=…> where repr writes [...]. For values without dicts and without recursion the two give the same text.',
    },
    {
      q: 'Is repr() unsafe for recursive lists?',
      a: 'No. The built-in containers detect self-reference in repr() and print [...] or {...}. saferepr just names the recursion explicitly, with the type and id().',
    },
    {
      q: "What does \"<Recursion on list with id=...>\" mean in pprint output?",
      a: 'The list contains itself (directly or through other containers). pprint stops there and prints this marker instead of looping; the number is id() of that list.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pprint.html#pprint.saferepr',
    meta:  'pprint.saferepr',
  },

};
