// content/reference/python/functions/set-symmetric_difference.js
//
// Naming: one hyphen separates the type prefix from Python's exact method
// name — `set` + `-` + `symmetric_difference`. The internal underscore is
// preserved because it is part of the real Python identifier.

export const meta = {
  slug:        'set-symmetric_difference',
  name:        'set.symmetric_difference',
  signature:   'set.symmetric_difference(other)',
  blurb:       'A new set of elements in exactly one of the two sets — never both.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'symmetric difference xor either or exclusive set both not shared unique caret',
};

export const method = {
  slug:      'set-symmetric_difference',
  name:      'set.symmetric_difference',
  signature: 'set.symmetric_difference(other)',
  returns:   { type: 'set', desc: 'A NEW set of elements that appear in EITHER self OR other, but NOT in both — the exclusive-or of two sets. Commutative: swapping the arguments gives the same result.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Elements unique to one side or the other — the \"xor\" of set operations.',

  cheat: {
    commonCall: 's1 ^ s2',
    returns:    'a NEW set — self and other untouched',
    replaces:   '`(a | b) - (a & b)` in one call',
    watchOut:   'takes EXACTLY ONE other — no variadic form (unlike union/intersection/difference)',
  },

  parameters: [
    { name: 'other', type: 'iterable', required: true, default: null, desc: 'A single iterable — set, list, tuple, generator, string, dict (keys). Only one is accepted; symmetric difference is not defined for more than two sets in this method.' },
  ],

  demoParams: [
    { name: 'a', type: 'set', hint: 'first set (comma-separated)',  input: 'csv-set' },
    { name: 'b', type: 'set', hint: 'second set (comma-separated)', input: 'csv-set' },
  ],
  cases: [
    { id: 'overlap',  label: 'partial overlap',      values: { a: '1,2,3,4', b: '3,4,5,6' } },
    { id: 'disjoint', label: 'disjoint',             values: { a: '1,2,3',   b: '4,5,6' } },
    { id: 'same',     label: 'identical',            values: { a: 'a,b,c',   b: 'a,b,c' } },
    { id: 'subset',   label: 'b subset of a',        values: { a: '1,2,3,4', b: '2,3' } },
    { id: 'empty-b',  label: 'with empty',           values: { a: '1,2,3',   b: '' } },
    { id: 'both-emp', label: 'both empty',           values: { a: '',        b: '' } },
    { id: 'dup-in-a', label: 'duplicates in input', values: { a: 'a,a,b,b,c', b: 'a,c,d' } },
  ],
  demoExplainer: 'symmetric_difference returns a NEW set — self is untouched. An element is kept only if it appears in EXACTLY ONE of the two inputs. Unlike union/intersection/difference, this method takes ONE other only — variadic symmetric difference is not defined at the method level. Order shown is not meaningful; Python sets are unordered.',

  patterns: [
    {
      name: '\"What changed\" between two sets',
      desc: 'The operator form reads like \"a xor b\".',
      code: 'changes = old_tags ^ new_tags',
    },
    {
      name: 'Diff two configurations',
      desc: 'Show keys that appear in one config but not the other.',
      code: 'diff_keys = cfg_a.keys() ^ cfg_b.keys()',
    },
    {
      name: 'Toggle set membership',
      desc: 'XOR with a single-element set flips whether that element is in.',
      code: 'flags ^= {"debug"}   # add if absent, remove if present',
    },
  ],

  examples: [
    { title: 'Partial overlap',      code: '{1, 2, 3} ^ {2, 3, 4}',                    returns: '{1, 4}' },
    { title: 'Disjoint = union',     code: '{1, 2} ^ {3, 4}',                          returns: '{1, 2, 3, 4}' },
    { title: 'Identical = empty',    code: '{1, 2, 3} ^ {1, 2, 3}',                    returns: 'set()' },
    { title: 'Iterable other',       code: '{1, 2, 3}.symmetric_difference([2, 3, 4])',returns: '{1, 4}' },
    { title: 'Commutative',          code: '({1, 2} ^ {2, 3}) == ({2, 3} ^ {1, 2})',   returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Takes exactly ONE other — not variadic',
      desc: 'Unlike union, intersection, and difference (which all accept multiple iterables), symmetric_difference takes exactly one. Passing multiple raises TypeError.',
      wrong: { label: 'Wrong shape',    code: '{1, 2}.symmetric_difference({3}, {4})', output: 'TypeError: symmetric_difference() takes exactly 2 arguments (3 given)' },
      fix:   { label: 'Chain with `^`', code: '{1, 2} ^ {3} ^ {4}', output: '{1, 2, 3, 4}' },
    },
    {
      name: 'The `^` operator requires sets on both sides',
      desc: 'symmetric_difference() accepts any iterable. The `^` operator does NOT — it needs a set on both sides.',
      wrong: { label: 'Type error', code: '{1, 2, 3} ^ [2, 3]', output: "TypeError: unsupported operand type(s) for ^: 'set' and 'list'" },
      fix:   { label: 'Method form', code: '{1, 2, 3}.symmetric_difference([2, 3])', output: '{1}' },
    },
    {
      name: 'symmetric_difference() is NOT the update version',
      desc: 'symmetric_difference returns a fresh set. symmetric_difference_update mutates self in place and returns None.',
      wrong: { label: 'Original untouched', code: 'a = {1, 2}\na.symmetric_difference({2, 3})\na', output: '{1, 2}  # unchanged' },
      fix:   { label: 'Two options', code: 'a = a ^ {2, 3}                        # new set\n# or\na.symmetric_difference_update({2, 3})    # mutate', output: '{1, 3}' },
    },
    {
      name: 'String iterables explode into characters',
      desc: 'Same footgun as union/intersection/difference — a string passed as \"other\" is iterated as characters.',
      wrong: { label: 'Char explosion', code: '{"Ann", "Bob"}.symmetric_difference("Bob")', output: '{"Ann", "B", "o", "b"}' },
      fix:   { label: 'Wrap it',        code: '{"Ann", "Bob"}.symmetric_difference({"Bob"})', output: '{"Ann"}' },
    },
  ],

  when: {
    use: [
      'Comparing two collections for \"what differs\" without direction',
      'Flag toggling (XOR with a singleton set)',
      'Diff-style reports across two snapshots',
      'Composing exclusive-or logic with other pure set operations',
    ],
    avoid: [
      'You care WHICH side has the extras → use two directional differences (a - b, b - a)',
      'Combining more than two sets XOR-wise → chain the `^` operator',
      'You want to mutate in place → symmetric_difference_update or ^=',
      'Unhashable elements → use a list comprehension',
    ],
  },

  notes: {
    complexity: 'O(|a| + |b|)',
    return:     'A new set — same type as self (`set` or `frozenset`)',
    cpython:    'Objects/setobject.c :: set_symmetric_difference',
    memory:     'Allocates a new set sized for the exclusive elements',
    threadSafe: 'Safe against reads; not safe under concurrent writes to the input sets',
  },

  related: [
    { name: 'set.union',        slug: 'set-union',        when: 'Elements in either — including both' },
    { name: 'set.intersection', slug: 'set-intersection', when: 'Elements in BOTH sets' },
    { name: 'set.difference',   slug: 'set-difference',   when: 'One-sided remainder — a minus b' },
    { name: 'len',              slug: 'len',              when: 'Count the exclusive elements' },
  ],

  faq: [
    {
      q: 'What is the difference between `^` and `|`?',
      a: '`|` (union) keeps elements in EITHER OR BOTH. `^` (symmetric_difference) keeps elements in exactly ONE — never both. Symmetric difference is a strict subset of union.',
    },
    {
      q: 'Why can I chain `a ^ b ^ c` but not `a.symmetric_difference(b, c)`?',
      a: 'The operator applies pairwise: `a ^ b ^ c` = `(a ^ b) ^ c`, which is well-defined. The method insists on exactly two inputs — a design consistency choice. Chain the operator when you need a \"multi-way xor\".',
    },
    {
      q: 'Is symmetric_difference commutative?',
      a: 'Yes — `a ^ b == b ^ a` always. Order does not matter, unlike difference where `a - b` and `b - a` are generally different sets.',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; symmetric_difference available as `^` operator.' },
    { version: '2.6', note: 'symmetric_difference() method accepts any iterable (not just sets).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.symmetric_difference',
    meta:  'set.symmetric_difference',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};