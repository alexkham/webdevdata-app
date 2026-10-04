// content/reference/javascript/methods/set-difference.js
//
// symmetricDifference is consolidated here: it is the commutative sibling,
// and showing both directions of difference next to it is the clearest way
// to explain why the asymmetry matters.

export const meta = {
  slug:        'set-difference',
  name:        'Set.prototype.difference',
  signature:   'set.difference(other)',
  blurb:       'In A but not B — the ONE set operation where the order of operands changes the answer.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2025',
  searchTerms: 'Set difference symmetricDifference subtract remove exclude not in asymmetric set operations es2025 javascript',
};

export const method = {
  slug:      'set-difference',
  name:      'Set.prototype.difference',
  signature: 'set.difference(other)',
  returns:   { type: 'Set', desc: 'A NEW Set of the members in the receiver that are NOT in the argument. symmetricDifference returns those in exactly one of the two, in either direction.' },

  category:    'Set method',
  version:     'ES2025',
  hasLiveDemo: true,

  subtitle: 'Union and intersection give the same members whichever way round you write them. Difference does not — a.difference(b) and b.difference(a) are different answers, and mixing them up is the easiest mistake in this family.',

  cheat: {
    commonCall: 'a.difference(b)',
    returns:    'a new Set — members of A not in B',
    replaces:   'new Set([...a].filter(x => !b.has(x)))',
    watchOut:   'NOT commutative — check which side you meant',
  },

  parameters: [
    { name: 'other', type: 'Set-like', required: true, default: null, desc: 'An object with size, has and keys. A Set or Map qualifies; an array throws TypeError.' },
  ],

  demoParams: [
    { name: 'a', type: 'string', hint: 'JSON array, e.g. [1,2,3]', input: 'text' },
    { name: 'b', type: 'string', hint: 'JSON array, e.g. [2,3,4]', input: 'text' },
  ],
  demoTemplate: '(a => b => [[...a.difference(b)], [...b.difference(a)], [...a.symmetricDifference(b)]])(new Set(JSON.parse({a})))(new Set(JSON.parse({b})))',
  cases: [
    { id: 'overlap',  label: 'A−B, B−A, symmetric',  values: { a: '[1,2,3]', b: '[2,3,4]' } },
    { id: 'disjoint', label: 'nothing shared',       values: { a: '[1,2]',   b: '[3,4]' } },
    { id: 'subset',   label: 'B inside A',           values: { a: '[1,2,3]', b: '[2]' } },
    { id: 'same',     label: 'identical → all empty',values: { a: '[1,2]',   b: '[1,2]' } },
  ],
  demoExplainer: "The output is three arrays: A minus B, B minus A, and the symmetric difference. The first case makes the asymmetry unmissable — [1], then [4], then [1, 4]. Those first two are different answers to what people often assume is one question, which is why difference is the operation most worth reading carefully. The symmetric difference is the union of the two one-way differences, so unlike them it contains the same MEMBERS whichever way round you write it — though the order still follows the receiver. Identical sets give three empty results.",

  patterns: [
    {
      name: 'What is missing?',
      desc: 'Required minus granted.',
      code: 'const missing = required.difference(granted);',
    },
    {
      name: 'What changed?',
      desc: 'Symmetric difference for a two-way diff.',
      code: 'const changed = before.symmetricDifference(after);',
    },
    {
      name: 'Added and removed separately',
      desc: 'Two differences, one each way.',
      code: 'const added = after.difference(before);\nconst removed = before.difference(after);',
    },
  ],

  examples: [
    { title: 'A minus B',        code: '[...new Set([1, 2, 3]).difference(new Set([2, 3, 4]))]', returns: '[1]' },
    { title: 'B minus A',        code: '[...new Set([2, 3, 4]).difference(new Set([1, 2, 3]))]', returns: '[4]' },
    { title: 'Symmetric',        code: '[...new Set([1, 2, 3]).symmetricDifference(new Set([2, 3, 4]))]', returns: '[1, 4]' },
    { title: 'Identical sets',   code: 'new Set([1]).difference(new Set([1])).size', returns: '0' },
    { title: 'Neither changes',  code: 'const a = new Set([1, 2]);\na.difference(new Set([2]));\n[...a]', returns: '[1, 2]' },
    { title: 'An array throws',  code: 'new Set([1]).difference([1])', returns: 'TypeError: The .size property is NaN' },
  ],

  pitfalls: [
    {
      name: 'It is not commutative',
      desc: 'The only asymmetric operation in the family, and the one most often written the wrong way round. a.difference(b) asks what A has that B lacks; swapping the operands asks the opposite question and both answers look plausible in isolation.',
      wrong: { label: 'The other question', code: '[...new Set([1, 2]).difference(new Set([2, 3]))]', output: '[1]' },
      fix:   { label: 'Swapped',            code: '[...new Set([2, 3]).difference(new Set([1, 2]))]', output: '[3]' },
    },
    {
      name: 'symmetricDifference is not the same as difference',
      desc: 'It returns members in exactly ONE of the two sets — the union of both one-way differences. Reaching for it when you meant a one-way subtraction gives you extra members from the other side.',
      wrong: { label: 'Both directions', code: '[...new Set([1, 2]).symmetricDifference(new Set([2, 3]))]', output: '[1, 3]' },
      fix:   { label: 'One direction',   code: '[...new Set([1, 2]).difference(new Set([2, 3]))]', output: '[1]' },
    },
    {
      name: 'An array argument throws',
      desc: 'As with every ES2025 set operation. The argument needs size, has and keys — wrap arrays in a Set.',
      wrong: { label: 'Throws',  code: 'new Set([1, 2]).difference([2])', output: 'TypeError: The .size property is NaN' },
      fix:   { label: 'Wrap it', code: 'new Set([1, 2]).difference(new Set([2]))', output: 'Set(1) {1}' },
    },
    {
      name: 'It does not mutate, despite sounding like removal',
      desc: 'Reading "difference" as "remove these from me" is natural and wrong — the receiver is untouched and a new Set comes back. An unassigned call does nothing at all.',
      wrong: { label: 'Discarded', code: 'const a = new Set([1, 2]);\na.difference(new Set([2]));\na.size', output: '2' },
      fix:   { label: 'Assign it', code: 'const b = a.difference(new Set([2]));\nb.size', output: '1' },
    },
  ],

  when: {
    use: [
      'Finding what is missing — required minus available',
      'Diffing two states, one direction at a time',
      'Removing a whole set of members without a loop',
      'symmetricDifference for a two-way "what changed" comparison',
    ],
    avoid: [
      'You want members of both → intersection',
      'You want members of either → union',
      'You want to mutate in place → loop and delete',
      'One operand is an array → wrap it, or filter',
    ],
  },

  notes: {
    complexity: 'O(n) in the receiver size, or O(m) when the argument is smaller',
    return:     'A new Set; both operands are untouched',
    cpython:    'V8: Builtins-set-difference',
    memory:     'Allocates a new Set at most the size of the receiver',
    threadSafe: 'Single-threaded; both operands are only read',
  },

  related: [
    { name: 'Set.prototype.union',        slug: 'set-union',        when: 'Members of either set' },
    { name: 'Set.prototype.intersection', slug: 'set-intersection', when: 'Members of both' },
    { name: 'Set.prototype.isSubsetOf',   slug: 'set-predicates',   when: 'An empty difference means subset' },
    { name: 'Set.prototype.delete',       slug: 'set-delete',       when: 'Removing one member, in place' },
  ],

  faq: [
    {
      q: 'Which way round does difference work?',
      a: 'The receiver keeps its members, the argument removes them: a.difference(b) is "A without B". If you want the other direction, swap the operands — there is no flag for it.',
      code: 'required.difference(granted);   // what is still needed\ngranted.difference(required);   // what is extra',
    },
    {
      q: 'When would I use symmetricDifference?',
      a: 'When you want everything that differs, without caring which side it came from — comparing two snapshots to see whether anything changed at all. If you need to distinguish additions from removals, use two one-way differences instead.',
      code: 'const anyChange = before.symmetricDifference(after).size > 0;',
    },
    {
      q: 'How do I tell whether A is contained in B?',
      a: 'An empty difference means exactly that — but isSubsetOf says it directly and allocates nothing.',
      code: 'a.difference(b).size === 0;   // works\na.isSubsetOf(b);              // clearer and cheaper',
    },
  ],

  history: [
    { version: 'ES2025', note: 'difference and symmetricDifference added with the other five set operations.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference',
    meta:  'Set.prototype.difference',
  },

};
