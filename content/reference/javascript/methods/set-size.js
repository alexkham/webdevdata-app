// content/reference/javascript/methods/set-size.js

export const meta = {
  slug:        'set-size',
  name:        'Set.prototype.size',
  signature:   'set.size',
  blurb:       'How many unique values — the shortest way to count distinct items.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Set size count unique distinct length duplicates all equal accessor getter es2015 javascript',
};

export const method = {
  slug:      'set-size',
  name:      'Set.prototype.size',
  signature: 'set.size',
  returns:   { type: 'number', desc: 'The number of unique members. A read-only getter, not a method.' },

  category:    'Set accessor',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Because a Set deduplicates on the way in, its size is a count of DISTINCT values — which makes it the idiomatic way to ask "how many different things are in this list".',

  cheat: {
    commonCall: 'new Set(values).size',
    returns:    'the count of unique values',
    replaces:   'a manual distinct-counting loop',
    watchOut:   'no parentheses, and not writable',
  },

  parameters: [],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON array, e.g. [1,1,2]', input: 'text' },
  ],
  demoTemplate: 'new Set(JSON.parse({json})).size',
  cases: [
    { id: 'dupes',  label: 'duplicates collapse',   values: { json: '[1,1,2,2,3]' } },
    { id: 'unique', label: 'all distinct',          values: { json: '[1,2,3]' } },
    { id: 'same',   label: 'all the same → 1',      values: { json: '[5,5,5]' } },
    { id: 'objs',   label: 'objects do NOT dedupe (!)', values: { json: '[{"a":1},{"a":1}]' } },
    { id: 'empty',  label: 'empty',                 values: { json: '[]' } },
  ],
  demoExplainer: "Five input values giving a size of three is the whole idea — the constructor deduplicates and size counts what survived. The third case reduces to 1, which is the basis of the common all-equal check. The object case is the important exception: two structurally identical objects are distinct members, so the size is 2 and a Set gives you no deduplication for that data at all.",

  patterns: [
    {
      name: 'Count distinct values',
      desc: 'The canonical use.',
      code: 'const distinct = new Set(values).size;',
    },
    {
      name: 'Are all values equal?',
      desc: 'One distinct value means they all match.',
      code: 'const allSame = new Set(values).size <= 1;',
    },
    {
      name: 'Does an array contain duplicates?',
      desc: 'Compare against the array length.',
      code: 'const hasDupes = new Set(values).size !== values.length;',
    },
  ],

  examples: [
    { title: 'Duplicates collapse', code: 'new Set([1, 1, 2]).size',  returns: '2' },
    { title: 'All distinct',        code: 'new Set([1, 2, 3]).size',  returns: '3' },
    { title: 'All the same',        code: 'new Set([5, 5, 5]).size',  returns: '1' },
    { title: 'Empty',               code: 'new Set().size',           returns: '0' },
    { title: 'Objects do not dedupe', code: 'new Set([{}, {}]).size', returns: '2' },
    { title: 'Not writable',        code: 'const s = new Set([1]);\ns.size = 0;\ns.size', returns: '1' },
  ],

  pitfalls: [
    {
      name: 'It is a property, not a method',
      desc: 'set.size() throws, because the number is not callable. The same slip as with Map.size, and the opposite of the DOM collections that do use methods.',
      wrong: { label: 'Not callable', code: 'const s = new Set();\ns.size()', output: 'TypeError: s.size is not a function' },
      fix:   { label: 'No parentheses', code: 'new Set().size', output: '0' },
    },
    {
      name: 'Objects are counted separately',
      desc: 'The duplicate-detection idiom silently fails for arrays of objects — every element is distinct, so size always equals length and the check reports no duplicates however many equal-looking objects there are.',
      wrong: { label: 'Reports no duplicates', code: 'const a = [{id: 1}, {id: 1}];\nnew Set(a).size !== a.length', output: 'false' },
      fix:   { label: 'Compare a key',         code: 'new Set(a.map(o => o.id)).size !== a.length', output: 'true' },
    },
    {
      name: 'Assigning to it does nothing',
      desc: 'There is no setter — ignored in sloppy mode, a TypeError in strict. You cannot truncate a Set by setting size, unlike an array with length.',
      wrong: { label: 'Ignored', code: 'const s = new Set([1, 2]);\ns.size = 0;\ns.size', output: '2' },
      fix:   { label: 'Use clear', code: 's.clear();\ns.size', output: '0' },
    },
    {
      name: 'It counts members, not nested contents',
      desc: 'A Set holding arrays has a size equal to the number of arrays, not the total elements inside them. Flatten first if you meant the latter.',
      wrong: { label: 'Counts the arrays', code: 'new Set([[1, 2], [3]]).size', output: '2' },
      fix:   { label: 'Flatten first',     code: 'new Set([[1, 2], [3]].flat()).size', output: '3' },
    },
  ],

  when: {
    use: [
      'Counting distinct values in a list',
      'Detecting whether an array contains duplicates',
      'Checking whether every value is the same',
      'Emptiness checks on a Set',
    ],
    avoid: [
      'Counting objects by contents → map to a key first',
      'You need the distinct values too → spread the Set',
      'The collection is a WeakSet → it has no size, by design',
      'You want to truncate → clear, or rebuild',
    ],
  },

  notes: {
    complexity: 'O(1) to read; O(n) to build the Set in the first place',
    return:     'A number; nothing is allocated by the read',
    cpython:    'V8: the Set size accessor',
    memory:     'No allocation for the read',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Set.prototype.add',    slug: 'set-add',    when: 'Adding members, which updates the count' },
    { name: 'Set.prototype.delete', slug: 'set-delete', when: 'Removing members, and clear' },
    { name: 'Map.size',             slug: 'map-size',   when: 'The same accessor on Map' },
    { name: 'Set.prototype.values', slug: 'set-iterators', when: 'Getting the distinct values, not just the count' },
  ],

  faq: [
    {
      q: 'How do I check an array for duplicates?',
      a: 'Compare the Set size against the array length. It works for primitives; for objects you must map to a comparable key first, or every element counts as distinct.',
      code: 'const hasDupes = new Set(a).size !== a.length;',
    },
    {
      q: 'Why does a Set of objects have the size I did not expect?',
      a: 'Because membership is by reference. Two objects with identical properties are two members. Deduplicating object data means choosing a key — an id, or a serialised form — and building the Set from that.',
    },
    {
      q: 'Why size and not length?',
      a: 'length belongs to indexable things. Set and Map are keyed collections without positional access, so the specification uses size for both — which also keeps them visually distinct from arrays in code.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Set and its size accessor added.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/size',
    meta:  'Set.prototype.size',
  },

  tryInTool: [],
};
