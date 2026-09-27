// content/reference/javascript/methods/set-add.js

export const meta = {
  slug:        'set-add',
  name:        'Set.prototype.add',
  signature:   'set.add(value)',
  blurb:       'Adds a value unless it is already there — and objects are compared by reference.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Set add unique dedupe duplicate chainable SameValueZero NaN object reference insertion order es2015 javascript',
};

export const method = {
  slug:      'set-add',
  name:      'Set.prototype.add',
  signature: 'set.add(value)',
  returns:   { type: 'Set', desc: 'The SAME Set, so calls chain. Adding a value that is already present changes nothing — no error, no duplicate, and the original position is kept.' },

  category:    'Set method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Uniqueness without a membership check. The definition of "already there" is SameValueZero, which makes NaN behave sensibly and objects behave by identity.',

  cheat: {
    commonCall: 'set.add(value)',
    returns:    'the same Set — chainable',
    replaces:   'if (!arr.includes(v)) arr.push(v)',
    watchOut:   'two equal-looking objects are two different values',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: null, desc: 'Any value. Compared with existing members by SameValueZero — so NaN equals itself, 0 and -0 collapse to one member, and objects match only by reference.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON array, e.g. [1,2]', input: 'text' },
    { name: 'v',    type: 'number', hint: 'value to add',           input: 'number' },
  ],
  demoTemplate: 'new Set(JSON.parse({json})).add({v})',
  cases: [
    { id: 'new',    label: 'a new value',             values: { json: '[1,2]', v: 3 } },
    { id: 'dupe',   label: 'already present → no-op', values: { json: '[1,2]', v: 2 } },
    { id: 'empty',  label: 'into an empty Set',       values: { json: '[]', v: 1 } },
    { id: 'source', label: 'source had duplicates',   values: { json: '[1,1,2]', v: 3 } },
  ],
  demoExplainer: "The output is the Set itself, which is what add returns — hence the chainable style. Adding a value already present is a silent no-op rather than an error, which is what makes add safe to call unconditionally. The last case shows the constructor doing the same job: duplicates in the source array collapse on the way in, so a three-element array can produce a two-member Set.",

  patterns: [
    {
      name: 'Deduplicate an array',
      desc: 'The single most common use of Set.',
      code: 'const unique = [...new Set(values)];',
    },
    {
      name: 'Track what you have seen',
      desc: 'add unconditionally; has to test.',
      code: 'const seen = new Set();\nfor (const x of xs) {\n  if (seen.has(x)) continue;\n  seen.add(x);\n}',
    },
    {
      name: 'Chain several adds',
      desc: 'add returns the Set.',
      code: 'const s = new Set().add(1).add(2);',
    },
  ],

  examples: [
    { title: 'Chainable',        code: 'new Set().add(1).add(2).size', returns: '2' },
    { title: 'Duplicate is a no-op', code: 'new Set([1]).add(1).size', returns: '1' },
    { title: 'Deduplicates',     code: '[...new Set([1, 1, 2, 2, 3])]', returns: '[1, 2, 3]' },
    { title: 'NaN dedupes',      code: 'new Set([NaN, NaN]).size',     returns: '1' },
    { title: '0 and -0 collapse',code: 'new Set([0, -0]).size',        returns: '1' },
    { title: 'Objects do NOT',   code: 'new Set([{a: 1}, {a: 1}]).size', returns: '2' },
  ],

  pitfalls: [
    {
      name: 'Objects are compared by reference',
      desc: 'A Set of objects does not deduplicate by contents. Two structurally identical objects — from separate JSON parses, or created in a loop — are two distinct members, so a Set gives you no uniqueness at all for that data.',
      wrong: { label: 'Both kept', code: 'new Set([{id: 1}, {id: 1}]).size', output: '2' },
      fix:   { label: 'Key by a primitive', code: 'new Set([{id: 1}, {id: 1}].map(o => o.id)).size', output: '1' },
    },
    {
      name: 'It mutates — there is no non-mutating add',
      desc: 'add changes the Set and returns the same reference. A Set held in React state will not trigger a re-render, and a Set shared between modules can be changed by any of them. Copy first if you need a new value.',
      wrong: { label: 'Same reference', code: 'const next = s.add(1);\nnext === s', output: 'true' },
      fix:   { label: 'Copy first',     code: 'const next = new Set(s).add(1);', output: 'a new Set' },
    },
    {
      name: 'A Set does not serialise to JSON',
      desc: 'JSON.stringify produces {} — the members vanish silently, exactly as with a Map. Spread to an array before serialising.',
      wrong: { label: 'Data lost',  code: 'JSON.stringify(new Set([1, 2]))', output: "'{}'" },
      fix:   { label: 'Spread it',  code: 'JSON.stringify([...new Set([1, 2])])', output: "'[1,2]'" },
    },
    {
      name: 'Deduplicating strings is case- and whitespace-sensitive',
      desc: 'Membership is exact equality, so " a" and "a" and "A" are three different members. Normalise before adding if the values came from user input.',
      wrong: { label: 'Three members', code: 'new Set(["a", "A", " a"]).size', output: '3' },
      fix:   { label: 'Normalise first', code: 'new Set(["a", "A", " a"].map(s => s.trim().toLowerCase())).size', output: '1' },
    },
  ],

  when: {
    use: [
      'Deduplicating primitives',
      'Tracking membership — seen, visited, selected',
      'Replacing includes-then-push, which is O(n) per check',
      'Building the operand for the ES2025 set operations',
    ],
    avoid: [
      'Deduplicating objects by contents → map to a key first',
      'You need key-value pairs → a Map',
      'You need indexing or order-by-position → an array',
      'Objects that should be garbage collected → WeakSet',
    ],
  },

  notes: {
    complexity: 'O(1) average',
    return:     'The same Set, mutated',
    cpython:    'V8: Builtins-set / OrderedHashSet',
    memory:     'Holds members strongly — a long-lived Set of objects keeps them alive',
    threadSafe: 'Single-threaded; adding during iteration is visible to the iterator',
  },

  related: [
    { name: 'Set.prototype.has',    slug: 'set-has',    when: 'Testing membership' },
    { name: 'Set.prototype.delete', slug: 'set-delete', when: 'Removing a member' },
    { name: 'Set.size',             slug: 'set-size',   when: 'Counting members' },
    { name: 'Set.prototype.union',  slug: 'set-union',  when: 'Combining two Sets at once' },
  ],

  faq: [
    {
      q: 'Why do my objects not deduplicate?',
      a: 'Because membership is identity-based. Two object literals with the same properties are different values, so both are added. Map each object to a primitive key — an id, or a JSON string if you must — and deduplicate on that.',
      code: 'const seen = new Set();\nconst unique = items.filter(i => !seen.has(i.id) && seen.add(i.id));',
    },
    {
      q: 'Is a Set faster than array includes?',
      a: 'For membership testing, dramatically — has is constant time where includes scans the array. Building the Set costs one pass, so it pays off as soon as you test more than a handful of times.',
      code: 'const allowed = new Set(list);\nitems.filter(i => allowed.has(i));   // O(n) total',
    },
    {
      q: 'How do I deduplicate while keeping the first occurrence?',
      a: 'A Set already does — insertion order is preserved and a later duplicate is ignored, so spreading it gives you first occurrences in their original order.',
      code: '[...new Set([3, 1, 3, 2])];   // [3, 1, 2]',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Set added with add, has, delete and guaranteed insertion order.' },
    { version: 'ES2025', note: 'The set operations — union, intersection, difference and the predicates — added.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add',
    meta:  'Set.prototype.add',
  },

  tryInTool: [],
};
