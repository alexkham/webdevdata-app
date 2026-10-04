// content/reference/javascript/methods/set-union.js

export const meta = {
  slug:        'set-union',
  name:        'Set.prototype.union',
  signature:   'set.union(other)',
  blurb:       'Everything in either Set — and the argument must be SET-LIKE, not just iterable.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2025',
  searchTerms: 'Set union combine merge set operations set-like size has keys array TypeError es2025 javascript',
};

export const method = {
  slug:      'set-union',
  name:      'Set.prototype.union',
  signature: 'set.union(other)',
  returns:   { type: 'Set', desc: 'A NEW Set containing every member of both. Neither operand is modified — all the ES2025 set operations are non-mutating.' },

  category:    'Set method',
  version:     'ES2025',
  hasLiveDemo: true,

  subtitle: 'The first of seven set operations added in ES2025. They replaced a decade of spread-and-filter idioms — and they all share one sharp requirement about their argument.',

  cheat: {
    commonCall: 'a.union(b)',
    returns:    'a new Set — neither input changes',
    replaces:   'new Set([...a, ...b])',
    watchOut:   'an ARRAY argument throws — it must be set-like',
  },

  parameters: [
    { name: 'other', type: 'Set-like', required: true, default: null, desc: 'Must be SET-LIKE: an object with a numeric size, a has method and a keys method. A Set or a Map qualifies. A plain array does NOT, and throws TypeError.' },
  ],

  demoParams: [
    { name: 'a', type: 'string', hint: 'JSON array, e.g. [1,2,3]', input: 'text' },
    { name: 'b', type: 'string', hint: 'JSON array, e.g. [2,3,4]', input: 'text' },
  ],
  demoTemplate: '[...new Set(JSON.parse({a})).union(new Set(JSON.parse({b})))]',
  cases: [
    { id: 'overlap',  label: 'partial overlap',     values: { a: '[1,2,3]', b: '[2,3,4]' } },
    { id: 'disjoint', label: 'no overlap',          values: { a: '[1,2]',   b: '[3,4]' } },
    { id: 'same',     label: 'identical sets',      values: { a: '[1,2]',   b: '[1,2]' } },
    { id: 'empty',    label: 'union with empty',    values: { a: '[1,2]',   b: '[]' } },
    { id: 'order',    label: 'order: A then new B', values: { a: '[3,1]',   b: '[2,1]' } },
  ],
  demoExplainer: "Members of both sets, with duplicates collapsed. The ordering rule is worth noting: every member of the receiver comes first in its own insertion order, then any member of the argument not already present — so the last case gives [3, 1, 2], not a sorted result. Union is commutative in CONTENT but not in order, so a.union(b) and b.union(a) contain the same members in different sequences.",

  patterns: [
    {
      name: 'Combine two sets',
      desc: 'Clearer than a spread, and it deduplicates.',
      code: 'const all = admins.union(editors);',
    },
    {
      name: 'Combine with an array',
      desc: 'Wrap it — an array is not set-like.',
      code: 'const all = permissions.union(new Set(extraList));',
    },
    {
      name: 'Union of many sets',
      desc: 'Reduce over the list.',
      code: 'const all = sets.reduce((acc, s) => acc.union(s), new Set());',
    },
  ],

  examples: [
    { title: 'Partial overlap',   code: '[...new Set([1, 2, 3]).union(new Set([2, 3, 4]))]', returns: '[1, 2, 3, 4]' },
    { title: 'Neither changes',   code: 'const a = new Set([1]);\na.union(new Set([2]));\n[...a]', returns: '[1]' },
    { title: 'An array throws',   code: 'new Set([1]).union([2])', returns: 'TypeError: The .size property is NaN' },
    { title: 'A Map works',       code: '[...new Set([1]).union(new Map([[9, "x"]]))]', returns: '[1, 9]' },
    { title: 'Order is receiver-first', code: '[...new Set([3, 1]).union(new Set([2, 1]))]', returns: '[3, 1, 2]' },
    { title: 'The old idiom',     code: '[...new Set([...[1, 2], ...[2, 3]])]', returns: '[1, 2, 3]' },
  ],

  pitfalls: [
    {
      name: 'An array argument throws',
      desc: 'The biggest surprise in the whole set-operations family. They require a SET-LIKE object — size, has and keys — and an array has none of those, so you get a TypeError about size being NaN rather than a helpful message. Every one of the seven behaves this way.',
      wrong: { label: 'Throws', code: 'new Set([1]).union([2, 3])', output: 'TypeError: The .size property is NaN' },
      fix:   { label: 'Wrap it', code: 'new Set([1]).union(new Set([2, 3]))', output: 'Set(3) {1, 2, 3}' },
    },
    {
      name: 'A Map is set-like, and contributes its KEYS',
      desc: 'A Map has size, has and keys, so it is accepted — and the keys are what get merged, not the values. Occasionally useful, and a silent surprise if you passed a Map by mistake.',
      wrong: { label: 'Keys, not values', code: '[...new Set([1]).union(new Map([[9, "x"]]))]', output: '[1, 9]' },
      fix:   { label: 'Be explicit',      code: '[...new Set([1]).union(new Set(map.values()))]', output: "[1, 'x']" },
    },
    {
      name: 'The result order is not symmetric',
      desc: 'Content is commutative; order is not. The receiver members come first, so a.union(b) and b.union(a) are equal as sets but iterate differently — which matters if you spread the result into an array and compare.',
      wrong: { label: 'Different arrays', code: 'JSON.stringify([...new Set([1]).union(new Set([2]))]) === JSON.stringify([...new Set([2]).union(new Set([1]))])', output: 'false' },
      fix:   { label: 'Compare as sets',  code: 'const eq = (x, y) => x.size === y.size && x.isSubsetOf(y);', output: 'true' },
    },
    {
      name: 'ES2025 — check your runtime',
      desc: 'Node 22+ and 2024-era browsers. The spread idiom works everywhere and is only slightly longer, so it remains the right fallback for older targets.',
      wrong: { label: 'Missing', code: 'a.union(b)', output: 'TypeError: a.union is not a function' },
      fix:   { label: 'Spread',  code: 'new Set([...a, ...b])', output: 'same result' },
    },
  ],

  when: {
    use: [
      'Combining two Sets of permissions, tags or ids',
      'Merging without writing a deduplication step',
      'Chaining with the other set operations',
    ],
    avoid: [
      'One operand is an array → wrap it in a Set, or use a spread',
      'You want to mutate in place → loop and add',
      'Targeting runtimes older than 2024 → the spread idiom',
      'You need the values of a Map → pass map.values() explicitly',
    ],
  },

  notes: {
    complexity: 'O(n + m) in the sizes of the two sets',
    return:     'A new Set; both operands are untouched',
    cpython:    'V8: Builtins-set-union',
    memory:     'Allocates a new Set sized to the combined membership',
    threadSafe: 'Single-threaded; both operands are only read',
  },

  related: [
    { name: 'Set.prototype.intersection', slug: 'set-intersection', when: 'Only the members in BOTH' },
    { name: 'Set.prototype.difference',   slug: 'set-difference',   when: 'Members in one but not the other' },
    { name: 'Set.prototype.isSubsetOf',   slug: 'set-predicates',   when: 'Testing a relationship rather than combining' },
    { name: 'Set.prototype.add',          slug: 'set-add',          when: 'Adding one member at a time' },
  ],

  faq: [
    {
      q: 'What exactly is "set-like"?',
      a: 'An object with a numeric size property, a has method and a keys method returning an iterator. Set and Map both qualify. Arrays, strings and plain iterables do not — which is why passing an array throws.',
      code: 'const setLike = {size: 1, has: v => v === 9, keys: () => [9][Symbol.iterator]()};\nnew Set([1]).union(setLike);   // works',
    },
    {
      q: 'Why not just accept any iterable?',
      a: 'Because the operations need to test membership efficiently, not only enumerate. intersection and isSubsetOf ask "does the other side contain this", which requires has — an iterable alone would force a linear scan and change the complexity.',
    },
    {
      q: 'union or a spread?',
      a: 'union when both operands are already Sets — it says what it means and avoids building an intermediate array. The spread form is still needed when one side is an array and you do not want to wrap it.',
      code: 'a.union(b);              // both Sets\nnew Set([...a, ...arr]);  // one is an array',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Set added without any set operations — combining meant spreading.' },
    { version: 'ES2025', note: 'union, intersection, difference, symmetricDifference, isSubsetOf, isSupersetOf and isDisjointFrom added together.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union',
    meta:  'Set.prototype.union',
  },

};
