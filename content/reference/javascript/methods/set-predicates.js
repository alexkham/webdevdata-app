// content/reference/javascript/methods/set-predicates.js
//
// isSubsetOf, isSupersetOf and isDisjointFrom on one page: three booleans
// about the relationship between two sets, only comprehensible together.

export const meta = {
  slug:        'set-predicates',
  name:        'Set.prototype.isSubsetOf, isSupersetOf and isDisjointFrom',
  signature:   'set.isSubsetOf(other), set.isSupersetOf(other), set.isDisjointFrom(other)',
  blurb:       'Three relationship questions answered without building a new Set.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2025',
  searchTerms: 'Set isSubsetOf isSupersetOf isDisjointFrom subset superset disjoint overlap contains all permissions es2025 javascript',
};

export const method = {
  slug:      'set-predicates',
  name:      'Set.prototype.isSubsetOf, isSupersetOf and isDisjointFrom',
  signature: 'set.isSubsetOf(other), set.isSupersetOf(other), set.isDisjointFrom(other)',
  returns:   { type: 'boolean', desc: 'isSubsetOf — every member of the receiver is in the argument. isSupersetOf — the reverse. isDisjointFrom — they share nothing. None allocates a Set.' },

  category:    'Set methods',
  version:     'ES2025',
  hasLiveDemo: true,

  subtitle: 'The cheap half of the ES2025 set operations. Where union and intersection build a result, these short-circuit and return a boolean — use them whenever the answer you actually want is yes or no.',

  cheat: {
    commonCall: 'needed.isSubsetOf(available)',
    returns:    'boolean — no Set is allocated',
    replaces:   '[...a].every(x => b.has(x))',
    watchOut:   'a set is a subset and a superset OF ITSELF',
  },

  parameters: [
    { name: 'other', type: 'Set-like', required: true, default: null, desc: 'An object with size, has and keys. A Set or Map qualifies; an array throws TypeError, as with every set operation.' },
  ],

  demoParams: [
    { name: 'a', type: 'string', hint: 'JSON array, e.g. [1,2]',   input: 'text' },
    { name: 'b', type: 'string', hint: 'JSON array, e.g. [1,2,3]', input: 'text' },
  ],
  demoTemplate: '(a => b => [a.isSubsetOf(b), a.isSupersetOf(b), a.isDisjointFrom(b)])(new Set(JSON.parse({a})))(new Set(JSON.parse({b})))',
  cases: [
    { id: 'subset',   label: 'A inside B → subset',        values: { a: '[1,2]',   b: '[1,2,3]' } },
    { id: 'superset', label: 'B inside A → superset',      values: { a: '[1,2,3]', b: '[1,2]' } },
    { id: 'disjoint', label: 'nothing shared → disjoint',  values: { a: '[1,2]',   b: '[8,9]' } },
    { id: 'equal',    label: 'identical → BOTH (!)',       values: { a: '[1,2]',   b: '[1,2]' } },
    { id: 'partial',  label: 'partial overlap → all false',values: { a: '[1,2]',   b: '[2,3]' } },
  ],
  demoExplainer: "The three booleans are [isSubsetOf, isSupersetOf, isDisjointFrom]. The fourth case is the one to internalise: identical sets are BOTH a subset and a superset of each other, because the definitions are not strict. If you need proper containment — a subset that is genuinely smaller — combine the predicate with a size comparison. The last case shows partial overlap failing all three: A is not contained in B, B is not contained in A, and they do share a member, so nothing is true.",

  patterns: [
    {
      name: 'Does the user have every required permission?',
      desc: 'The clearest use of isSubsetOf.',
      code: 'const allowed = required.isSubsetOf(userPerms);',
    },
    {
      name: 'Do two sets overlap at all?',
      desc: 'Cheaper than building an intersection.',
      code: 'const overlaps = !a.isDisjointFrom(b);',
    },
    {
      name: 'Proper subset, strictly smaller',
      desc: 'The predicates are not strict on their own.',
      code: 'const proper = a.isSubsetOf(b) && a.size < b.size;',
    },
  ],

  examples: [
    { title: 'Subset',            code: 'new Set([1, 2]).isSubsetOf(new Set([1, 2, 3]))', returns: 'true' },
    { title: 'Superset',          code: 'new Set([1, 2, 3]).isSupersetOf(new Set([1, 2]))', returns: 'true' },
    { title: 'Disjoint',          code: 'new Set([1]).isDisjointFrom(new Set([2]))', returns: 'true' },
    { title: 'Subset of itself',  code: 'const a = new Set([1]);\na.isSubsetOf(a)', returns: 'true' },
    { title: 'Empty is a subset of everything', code: 'new Set().isSubsetOf(new Set([1]))', returns: 'true' },
    { title: 'An array throws',   code: 'new Set([1]).isSubsetOf([1])', returns: 'TypeError: The .size property is NaN' },
  ],

  pitfalls: [
    {
      name: 'They are not strict',
      desc: 'A set is both a subset and a superset of itself, so isSubsetOf alone cannot express "contained in, and smaller". That is the mathematical convention and it catches people writing a containment check that should have excluded equality.',
      wrong: { label: 'True for equal sets', code: 'const a = new Set([1]);\na.isSubsetOf(a)', output: 'true' },
      fix:   { label: 'Add a size check',    code: 'a.isSubsetOf(b) && a.size < b.size', output: 'proper subset' },
    },
    {
      name: 'The empty set is a subset of everything',
      desc: 'Vacuously true — there is no member to be missing. A permission check written as required.isSubsetOf(granted) therefore PASSES when required is empty, which may or may not be what you intended.',
      wrong: { label: 'Passes trivially', code: 'new Set().isSubsetOf(new Set())', output: 'true' },
      fix:   { label: 'Require something', code: 'required.size > 0 && required.isSubsetOf(granted)', output: 'false' },
    },
    {
      name: 'Getting subset and superset the wrong way round',
      desc: 'The receiver is the thing being tested for containment in isSubsetOf, and the container in isSupersetOf. Swapping them gives a confidently wrong answer rather than an error — and for equal sets both are true, which hides the mistake in tests.',
      wrong: { label: 'Backwards', code: 'new Set([1, 2, 3]).isSubsetOf(new Set([1, 2]))', output: 'false' },
      fix:   { label: 'Correct',   code: 'new Set([1, 2]).isSubsetOf(new Set([1, 2, 3]))', output: 'true' },
    },
    {
      name: 'An array argument throws',
      desc: 'Shared with union, intersection and difference — the argument must be set-like. Wrap arrays.',
      wrong: { label: 'Throws',  code: 'new Set([1]).isDisjointFrom([2])', output: 'TypeError: The .size property is NaN' },
      fix:   { label: 'Wrap it', code: 'new Set([1]).isDisjointFrom(new Set([2]))', output: 'true' },
    },
  ],

  when: {
    use: [
      'Permission and capability checks — are all required items present?',
      'Testing for any overlap, without building an intersection',
      'Validating that one collection is contained in another',
      'Anywhere an every-with-has loop appears',
    ],
    avoid: [
      'You need the shared members → intersection',
      'You need what is missing → difference',
      'You need strict containment → add a size comparison',
      'One operand is an array → wrap it, or use every',
    ],
  },

  notes: {
    complexity: 'O(min(n, m)) with early exit on the first counterexample',
    return:     'A boolean; no Set is allocated',
    cpython:    'V8: Builtins-set-issubsetof and siblings',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; both operands are only read',
  },

  related: [
    { name: 'Set.prototype.intersection', slug: 'set-intersection', when: 'You need the shared members, not a boolean' },
    { name: 'Set.prototype.difference',   slug: 'set-difference',   when: 'You need what is missing' },
    { name: 'Set.prototype.union',        slug: 'set-union',        when: 'Combining rather than comparing' },
    { name: 'Set.prototype.has',          slug: 'set-has',          when: 'Testing a single member' },
  ],

  faq: [
    {
      q: 'Why is a set a subset of itself?',
      a: 'Because the mathematical definition is "every member of A is also in B", which is satisfied when they are equal. Strict containment is a separate idea — express it by adding a size comparison.',
      code: 'a.isSubsetOf(b) && a.size < b.size;',
    },
    {
      q: 'isDisjointFrom or intersection?',
      a: 'isDisjointFrom when the answer is yes or no — it stops at the first shared member and allocates nothing. intersection when you need to know WHICH members are shared.',
      code: 'if (!a.isDisjointFrom(b)) { }        // do they overlap?\nfor (const x of a.intersection(b)) { }  // which ones?',
    },
    {
      q: 'How do I check that a user has at least one of several roles?',
      a: 'Negated isDisjointFrom — "not disjoint" means at least one is shared. For all of them, isSubsetOf.',
      code: 'const any = !userRoles.isDisjointFrom(acceptedRoles);\nconst all = acceptedRoles.isSubsetOf(userRoles);',
    },
  ],

  history: [
    { version: 'ES2025', note: 'isSubsetOf, isSupersetOf and isDisjointFrom added with the four Set-returning operations.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSubsetOf',
    meta:  'Set.prototype.isSubsetOf',
  },

  tryInTool: [],
};
