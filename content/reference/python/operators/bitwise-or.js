// content/reference/python/operators/bitwise-or.js

export const meta = {
  slug:        'bitwise-or',
  name:        '|',
  signature:   'a | b',
  blurb:       'Bitwise OR — set union, and dict merge since 3.9.',
  category:    'bitwise',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'pipe bitwise or flags union merge dict operator',
};

export const method = {
  slug:      'bitwise-or',
  name:      '|',
  signature: 'a | b',
  returns:   { type: 'int | set | dict', desc: 'Ints: a bit is set where EITHER operand has it. Sets: union. Dicts (3.9+): merge, right side winning on key clashes.' },

  category:    'Bitwise operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Bit-level OR — combining flags, uniting sets, and merging dicts.',

  cheat: {
    commonCall: 'perms = READ | WRITE',
    returns:    'int with all bits from both; set union; merged dict',
    replaces:   '12 | 10 == 14 (0b1100 | 0b1010 = 0b1110)',
    watchOut:   'dict merge: the RIGHT side wins duplicate keys',
  },

  parameters: [
    { name: 'a', type: 'int | set | dict', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'int | set | dict', required: true, default: null, desc: 'Right operand — wins key clashes in dict merges.' },
  ],

  demoParams: [
    { name: 'a', type: 'int', hint: 'left operand',  input: 'number' },
    { name: 'b', type: 'int', hint: 'right operand', input: 'number' },
  ],
  demoTemplate: '{a} | {b}',
  cases: [
    { id: 'default', label: 'default',       values: { a: 12, b: 10 } },
    { id: 'flags',   label: 'combine flags', values: { a: 1, b: 2 } },
    { id: 'same',    label: 'same bits',     values: { a: 5, b: 5 } },
  ],
  demoExplainer: '12 | 10: every bit set in either operand survives — 0b1110 = 14. Combining single-bit flags (1 | 2 = 3) is the bread-and-butter use.',

  patterns: [
    {
      name: 'Building flag sets',
      desc: 'OR the individual bits together.',
      code: 'mode = os.O_CREAT | os.O_WRONLY',
    },
    {
      name: 'Dict merge (3.9+)',
      desc: 'New dict, right operand wins clashes.',
      code: 'config = defaults | overrides',
    },
    {
      name: 'Set union',
      desc: 'All elements of both.',
      code: 'everyone = admins | editors',
    },
  ],

  examples: [
    { title: 'Bit OR',       code: '12 | 10',                     returns: '14' },
    { title: 'Flags',        code: '0b01 | 0b10',                 returns: '3' },
    { title: 'Set union',    code: '{1, 2} | {2, 3}',             returns: '{1, 2, 3}' },
    { title: 'Dict merge',   code: '{"a": 1} | {"a": 9, "b": 2}', returns: "{'a': 9, 'b': 2}" },
  ],

  pitfalls: [
    {
      name: 'Dict merge order matters',
      desc: 'Duplicate keys take the RIGHT operand’s value.',
      wrong: { label: 'Overrides lost', code: 'config = overrides | defaults', output: 'defaults win — backwards' },
      fix:   { label: 'Fix', code: 'config = defaults | overrides', output: 'overrides win' },
    },
    {
      name: '| is not `or`',
      desc: 'No truthiness, no short-circuit.',
      wrong: { label: 'Wrong tool', code: 'name = user_input | "default"', output: "TypeError: unsupported operand type(s) for |: 'str' and 'str'" },
      fix:   { label: 'Fix', code: 'name = user_input or "default"', output: 'the fallback idiom' },
    },
  ],

  when: {
    use: [
      'Combining bit flags',
      'Set union; dict merging (3.9+)',
      'Type unions in annotations: int | None (3.10+)',
    ],
    avoid: [
      'Logical disjunction → or',
      'In-place merge of a dict → dict.update',
    ],
  },

  notes: {
    complexity: 'O(bits) ints; O(len) sets/dicts',
    return:     'new value; operands untouched',
    cpython:    'Objects/longobject.c :: long_or → __or__',
    memory:     'Set/dict results allocate',
    threadSafe: 'Yes — operands are not mutated',
  },

  related: [
    { name: '&',  slug: 'bitwise-and', when: 'Mask instead of combine' },
    { name: '^',  slug: 'bitwise-xor', when: 'Exclusive OR' },
    { name: 'or', slug: 'or',          when: 'Logical disjunction' },
  ],

  faq: [
    {
      q: 'What is int | None in type hints?',
      a: 'PEP 604 (3.10+) overloads | on types to build unions — equivalent to Optional[int]. Same symbol, annotation context.',
    },
  ],

  history: [
    { version: '3.10', note: 'X | Y union syntax in type annotations (PEP 604).' },
    { version: '3.9',  note: 'dict | dict merge added (PEP 584).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#binary-bitwise-operations',
    meta:  'binary bitwise operations',
  },

  tryInTool: [
    { name: 'Base64',         href: '/tools/base64',         meta: 'Byte-level encoding' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect merged data' },
  ],
};
