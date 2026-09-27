// content/reference/javascript/methods/set-intersection.js

export const meta = {
  slug:        'set-intersection',
  name:        'Set.prototype.intersection',
  signature:   'set.intersection(other)',
  blurb:       'Only the members in both — the permission check, done declaratively.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2025',
  searchTerms: 'Set intersection common members both overlap filter has permissions tags set operations es2025 javascript',
};

export const method = {
  slug:      'set-intersection',
  name:      'Set.prototype.intersection',
  signature: 'set.intersection(other)',
  returns:   { type: 'Set', desc: 'A NEW Set of the members present in BOTH. Empty when they share nothing. Neither operand is modified.' },

  category:    'Set method',
  version:     'ES2025',
  hasLiveDemo: true,

  subtitle: 'What a filter-with-has used to express. It also takes the smaller side into account, so the work scales with the smaller Set rather than the receiver.',

  cheat: {
    commonCall: 'a.intersection(b)',
    returns:    'a new Set of shared members',
    replaces:   'new Set([...a].filter(x => b.has(x)))',
    watchOut:   'the argument must be set-like, not an array',
  },

  parameters: [
    { name: 'other', type: 'Set-like', required: true, default: null, desc: 'An object with size, has and keys. A Set or Map qualifies; an array throws TypeError.' },
  ],

  demoParams: [
    { name: 'a', type: 'string', hint: 'JSON array, e.g. [1,2,3]', input: 'text' },
    { name: 'b', type: 'string', hint: 'JSON array, e.g. [2,3,4]', input: 'text' },
  ],
  demoTemplate: '[...new Set(JSON.parse({a})).intersection(new Set(JSON.parse({b})))]',
  cases: [
    { id: 'overlap',  label: 'partial overlap',       values: { a: '[1,2,3]', b: '[2,3,4]' } },
    { id: 'disjoint', label: 'nothing shared → []',   values: { a: '[1,2]',   b: '[3,4]' } },
    { id: 'subset',   label: 'B inside A',            values: { a: '[1,2,3]', b: '[2]' } },
    { id: 'same',     label: 'identical',             values: { a: '[1,2]',   b: '[1,2]' } },
    { id: 'empty',    label: 'with empty → []',       values: { a: '[1,2]',   b: '[]' } },
  ],
  demoExplainer: "Only members present on both sides survive. Two sets sharing nothing give an empty Set rather than null, which makes the result safe to spread or iterate without a guard — a welcome contrast to String.match. Order follows the receiver. Intersection is genuinely commutative in content, and like union its result order follows whichever set you called the method on.",

  patterns: [
    {
      name: 'Which permissions does the user actually have?',
      desc: 'The canonical use.',
      code: 'const granted = required.intersection(userPerms);',
    },
    {
      name: 'Do two sets overlap at all?',
      desc: 'isDisjointFrom says it without building a Set.',
      code: 'const overlaps = !a.isDisjointFrom(b);',
    },
    {
      name: 'Common tags across many items',
      desc: 'Reduce, starting from the first.',
      code: 'const shared = tagSets.reduce((acc, s) => acc.intersection(s));',
    },
  ],

  examples: [
    { title: 'Shared members',    code: '[...new Set([1, 2, 3]).intersection(new Set([2, 3, 4]))]', returns: '[2, 3]' },
    { title: 'Nothing shared',    code: '[...new Set([1]).intersection(new Set([2]))]', returns: '[]' },
    { title: 'Empty, not null',   code: 'new Set([1]).intersection(new Set([2])).size', returns: '0' },
    { title: 'Neither changes',   code: 'const a = new Set([1, 2]);\na.intersection(new Set([2]));\n[...a]', returns: '[1, 2]' },
    { title: 'An array throws',   code: 'new Set([1]).intersection([1])', returns: 'TypeError: The .size property is NaN' },
    { title: 'The old idiom',     code: 'new Set([...new Set([1, 2])].filter(x => new Set([2]).has(x))).size', returns: '1' },
  ],

  pitfalls: [
    {
      name: 'An array argument throws',
      desc: 'Shared with every ES2025 set operation. The argument must be set-like — size, has, keys — and an array satisfies none of them. Wrap it.',
      wrong: { label: 'Throws',  code: 'new Set([1, 2]).intersection([2])', output: 'TypeError: The .size property is NaN' },
      fix:   { label: 'Wrap it', code: 'new Set([1, 2]).intersection(new Set([2]))', output: 'Set(1) {2}' },
    },
    {
      name: 'It builds a Set even when you only wanted a yes or no',
      desc: 'Checking whether two sets overlap by testing the intersection size allocates a whole Set to throw away. isDisjointFrom answers the same question without building anything.',
      wrong: { label: 'Allocates', code: 'if (a.intersection(b).size > 0) { }', output: 'works, wasteful' },
      fix:   { label: 'Predicate', code: 'if (!a.isDisjointFrom(b)) { }', output: 'no allocation' },
    },
    {
      name: 'Objects intersect by reference',
      desc: 'Two Sets of structurally identical objects intersect to nothing, because no member of one is the same reference as any member of the other. Intersect on primitive keys instead.',
      wrong: { label: 'Empty', code: 'new Set([{id: 1}]).intersection(new Set([{id: 1}])).size', output: '0' },
      fix:   { label: 'Primitive keys', code: 'new Set([1]).intersection(new Set([1])).size', output: '1' },
    },
    {
      name: 'ES2025 — check your runtime',
      desc: 'Node 22+ and 2024-era browsers. The filter idiom works everywhere; note it should filter the SMALLER set for the same complexity the built-in achieves.',
      wrong: { label: 'Missing', code: 'a.intersection(b)', output: 'TypeError: a.intersection is not a function' },
      fix:   { label: 'Filter',  code: 'new Set([...a].filter(x => b.has(x)))', output: 'same result' },
    },
  ],

  when: {
    use: [
      'Finding shared permissions, tags, ids or features',
      'Narrowing one collection by membership in another',
      'Chaining with union and difference to express set algebra',
    ],
    avoid: [
      'You only need a yes/no answer → isDisjointFrom',
      'One operand is an array → wrap it, or filter',
      'Comparing objects by contents → intersect on keys',
      'Targeting runtimes older than 2024 → the filter idiom',
    ],
  },

  notes: {
    complexity: 'O(min(n, m)) — it iterates the smaller side and tests the larger',
    return:     'A new Set; both operands are untouched',
    cpython:    'V8: Builtins-set-intersection',
    memory:     'Allocates a new Set, at most the size of the smaller operand',
    threadSafe: 'Single-threaded; both operands are only read',
  },

  related: [
    { name: 'Set.prototype.union',          slug: 'set-union',      when: 'Members of either set' },
    { name: 'Set.prototype.difference',     slug: 'set-difference', when: 'Members of one but not the other' },
    { name: 'Set.prototype.isDisjointFrom', slug: 'set-predicates', when: 'Whether they overlap at all, without allocating' },
    { name: 'Set.prototype.has',            slug: 'set-has',        when: 'Testing a single member' },
  ],

  faq: [
    {
      q: 'Is it faster than filtering with has?',
      a: 'Usually, because it iterates whichever side is smaller and tests the other — the hand-written filter iterates whatever you spread, which may be the larger one. Write the filter over the smaller set if you need the fallback.',
      code: 'const [small, big] = a.size < b.size ? [a, b] : [b, a];\nnew Set([...small].filter(x => big.has(x)));',
    },
    {
      q: 'How do I check for any overlap?',
      a: 'isDisjointFrom, negated. It short-circuits on the first shared member and allocates nothing, where taking the intersection builds a Set you immediately discard.',
      code: 'const overlaps = !a.isDisjointFrom(b);',
    },
    {
      q: 'Does it return null when there is no overlap?',
      a: 'No — an empty Set. All the set operations return a Set, so the result is always safe to spread, iterate or chain without a null check.',
    },
  ],

  history: [
    { version: 'ES2025', note: 'Added with the other six set operations.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection',
    meta:  'Set.prototype.intersection',
  },

  tryInTool: [],
};
