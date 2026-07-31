// content/reference/python/functions/len.js

export const meta = {
  slug:        'len',
  name:        'len',
  signature:   'len(obj)',
  blurb:       'Return the number of items in a container.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'len length size count items number of elements',
};

export const method = {
  slug:      'len',
  name:      'len',
  signature: 'len(obj)',
  returns:   { type: 'int', desc: 'The number of items: characters of a str, elements of a list/tuple, keys of a dict, members of a set.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The number of items in a container — characters, elements, keys or members.',

  cheat: {
    commonCall: 'len(items)',
    returns:    'int ≥ 0',
    replaces:   'O(1) for built-in containers — the size is stored, not counted',
    watchOut:   'numbers and generators have no len()',
  },

  parameters: [
    { name: 'obj', type: 'sized', required: true, default: null, desc: 'Any object implementing __len__: str, list, tuple, dict, set, bytes, range, and most containers.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'text to measure', input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default', values: { string: 'hello world' } },
    { id: 'empty',   label: 'empty',   values: { string: '' } },
    { id: 'unicode', label: 'unicode', values: { string: 'café' } },
    { id: 'spaces',  label: 'spaces',  values: { string: '  a  ' } },
  ],
  demoExplainer: 'For a string, len counts characters (Unicode code points) — spaces included. The same call works on lists, dicts, sets and every other sized container.',

  patterns: [
    {
      name: 'Emptiness — the idiomatic way',
      desc: 'Containers are falsy when empty; explicit len is for when the number matters.',
      code: 'if not items:      # idiomatic empty check\n    return\nif len(items) > 100:  # actual size logic\n    paginate()',
    },
    {
      name: 'Validation',
      desc: 'Length bounds on user input.',
      code: 'if not 3 <= len(username) <= 20:\n    raise ValueError("3-20 characters")',
    },
    {
      name: 'Progress denominators',
      desc: 'Total count for percentage displays.',
      code: 'print(f"{i}/{len(tasks)} done")',
    },
  ],

  examples: [
    { title: 'String length',   code: 'len("hello")',          returns: '5' },
    { title: 'List length',     code: 'len([1, 2, 3])',        returns: '3' },
    { title: 'Dict counts keys', code: 'len({"a": 1, "b": 2})', returns: '2' },
    { title: 'Empty container', code: 'len("")',               returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Numbers have no length',
      desc: 'len works on containers, not scalars — convert first if you mean digits.',
      wrong: { label: 'Raises', code: 'len(12345)', output: "TypeError: object of type 'int' has no len()" },
      fix:   { label: 'Fix', code: 'len(str(12345))', output: '5' },
    },
    {
      name: 'Generators have no length',
      desc: 'A generator does not know its size without being consumed.',
      wrong: { label: 'Raises', code: 'len(x*2 for x in nums)', output: "TypeError: object of type 'generator' has no len()" },
      fix:   { label: 'Count by consuming', code: 'sum(1 for _ in gen)', output: 'the count (generator is now exhausted)' },
    },
    {
      name: 'len counts code points, not bytes or glyphs',
      desc: 'Encoded size differs, and some emoji are several code points.',
      wrong: { label: 'Not bytes', code: 'len("café")', output: '4' },
      fix:   { label: 'Byte length', code: 'len("café".encode("utf-8"))', output: '5' },
    },
  ],

  when: {
    use: [
      'The actual count matters (limits, pagination, progress)',
      'Any sized container — one spelling for all of them',
    ],
    avoid: [
      'Just checking emptiness → if not items:',
      'Counting a generator → sum(1 for _ in gen)',
      'Byte size of text → len(s.encode())',
    ],
  },

  notes: {
    complexity: 'O(1) for built-in containers — size is stored',
    return:     'int ≥ 0',
    cpython:    'Python/bltinmodule.c → PyObject_Size → __len__ slot',
    memory:     'No allocation',
    threadSafe: 'Yes — a single read',
  },

  related: [
    { name: 'sorted',     slug: 'sorted',     when: 'Order the items you counted' },
    { name: 'list.count', slug: 'list-count', when: 'Count MATCHING items, not all' },
    { name: 'str.count',  slug: 'str-count',  when: 'Count substrings' },
  ],

  faq: [
    {
      q: 'Why is len a function and not a method like s.length?',
      a: 'Uniformity — one spelling works across every sized type. Under the hood len(x) calls type(x).__len__(x), so it is still customizable per class.',
    },
    {
      q: 'Is len(list) slow on big lists?',
      a: 'No — O(1). Built-in containers store their length; nothing is counted.',
    },
    {
      q: 'How do I get the length of my own class?',
      a: 'Implement __len__ returning a non-negative int.',
      code: 'class Deck:\n    def __len__(self):\n        return len(self.cards)',
    },
  ],

  history: [
    { version: '1.0', note: 'One of the original built-ins.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#len',
    meta:  'len',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect container sizes' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Compare text vs byte length' },
  ],
};
