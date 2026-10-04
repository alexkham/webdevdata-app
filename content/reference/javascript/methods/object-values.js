// content/reference/javascript/methods/object-values.js

export const meta = {
  slug:        'object-values',
  name:        'Object.values',
  signature:   'Object.values(object)',
  blurb:       'The values, in the same reordered sequence as the keys — sum them, filter them, count them.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES2017',
  searchTerms: 'Object.values properties own enumerable iterate sum reduce order array from object es2017 javascript',
};

export const method = {
  slug:      'object-values',
  name:      'Object.values',
  signature: 'Object.values(object)',
  returns:   { type: 'any[]', desc: 'The object own enumerable property values, in exactly the order Object.keys would list their keys.' },

  category:    'Object static method',
  version:     'ES2017',
  hasLiveDemo: true,

  subtitle: 'The half of the keys/values/entries trio you want when the keys are irrelevant — totalling a record of amounts, or checking whether any field is set.',

  cheat: {
    commonCall: 'Object.values(obj)',
    returns:    'an array of own enumerable values',
    replaces:   'Object.keys(obj).map(k => obj[k])',
    watchOut:   'same integer-key reordering as Object.keys',
  },

  parameters: [
    { name: 'object', type: 'object', required: true, default: null, desc: 'Any object. Primitives are coerced; null and undefined throw TypeError.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object, e.g. {"a":1}', input: 'text' },
  ],
  demoTemplate: 'Object.values(JSON.parse({json}))',
  cases: [
    { id: 'simple',  label: 'two properties',      values: { json: '{"a":1,"b":2}' } },
    { id: 'order',   label: 'numeric keys reorder (!)', values: { json: '{"b":"first","1":"second"}' } },
    { id: 'mixed',   label: 'mixed value types',   values: { json: '{"a":1,"b":"x","c":null}' } },
    { id: 'nested',  label: 'nested objects kept', values: { json: '{"a":{"b":1}}' } },
    { id: 'empty',   label: 'empty object',        values: { json: '{}' } },
  ],
  demoExplainer: "Values come back in key order, which is why the second case matters: the property written first is returned SECOND, because its sibling has an integer-like key and those are always listed first. If you are pairing values against a separately-computed list of keys, that reordering will silently misalign them — use Object.entries, which keeps each key attached to its value. Nested objects are returned as references, not copied or flattened.",

  patterns: [
    {
      name: 'Total a record of numbers',
      desc: 'The keys carry no information here.',
      code: 'const total = Object.values(amounts).reduce((a, b) => a + b, 0);',
    },
    {
      name: 'Check whether any field is set',
      desc: 'Array methods become available.',
      code: 'const anyFilled = Object.values(form).some(Boolean);',
    },
    {
      name: 'Turn a keyed store into a list',
      desc: 'Common when normalising state for rendering.',
      code: 'const list = Object.values(byId);',
    },
  ],

  examples: [
    { title: 'Own values',       code: 'Object.values({a: 1, b: 2})',     returns: '[1, 2]' },
    { title: 'Key order applies',code: "Object.values({b: 'x', 1: 'y'})", returns: "['y', 'x']" },
    { title: 'An array',         code: 'Object.values([10, 20])',         returns: '[10, 20]' },
    { title: 'A string',         code: "Object.values('ab')",             returns: "['a', 'b']" },
    { title: 'null throws',      code: 'Object.values(null)',             returns: 'TypeError: Cannot convert undefined or null to object' },
    { title: 'Empty object',     code: 'Object.values({})',               returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'The order is key order, not insertion order',
      desc: 'Exactly the same reordering as Object.keys — integer-like keys first, numerically. Zipping these values against an independently built key list, or assuming the first property comes first, breaks as soon as any key looks like a number.',
      wrong: { label: 'Reordered', code: "Object.values({b: 'first', 1: 'second'})", output: "['second', 'first']" },
      fix:   { label: 'Keep pairs together', code: "Object.entries({b: 'first', 1: 'second'})", output: "[['1', 'second'], ['b', 'first']]" },
    },
    {
      name: 'Nested values are references',
      desc: 'The array is new; the values in it are not copies. Mutating an object taken from the result changes it inside the original too, which surprises people who think of this as a snapshot.',
      wrong: { label: 'Shared', code: 'const src = {a: {x: 1}};\nObject.values(src)[0].x = 9;\nsrc.a.x', output: '9' },
      fix:   { label: 'Copy deliberately', code: 'structuredClone(src)', output: 'independent' },
    },
    {
      name: 'null and undefined throw',
      desc: 'Same as the rest of the family. Any object that might be absent needs a fallback before the call.',
      wrong: { label: 'Throws', code: 'Object.values(maybeNull)', output: 'TypeError: Cannot convert undefined or null to object' },
      fix:   { label: 'Fallback', code: 'Object.values(maybeNull ?? {})', output: '[]' },
    },
    {
      name: 'Non-enumerable and symbol-keyed values are omitted',
      desc: 'As with keys. A class instance with properties defined via defineProperty, or a library object using symbol keys, will look emptier than it is.',
      wrong: { label: 'Missing', code: "const o = {};\nObject.defineProperty(o, 'h', {value: 1});\nObject.values(o)", output: '[]' },
      fix:   { label: 'Descriptors show all', code: 'Object.getOwnPropertyDescriptors(o)', output: 'includes h' },
    },
  ],

  when: {
    use: [
      'Aggregating — sums, averages, maxima over a keyed record',
      'Testing whether any or every value satisfies a condition',
      'Converting a keyed store into a list for rendering',
    ],
    avoid: [
      'You need the keys too → Object.entries',
      'You need only the keys → Object.keys',
      'The order must be insertion order → a Map',
      'You want a deep copy → structuredClone',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of own enumerable properties',
    return:     'A new array; the values inside are references, not copies',
    cpython:    'V8: Builtins-object-values',
    memory:     'Allocates the array only',
    threadSafe: 'Single-threaded; the object is only read',
  },

  related: [
    { name: 'Object.keys',    slug: 'object-keys',    when: 'The keys instead' },
    { name: 'Object.entries', slug: 'object-entries', when: 'Keys and values together' },
    { name: 'Object.groupBy', slug: 'object-groupby', when: 'Building a keyed record in the first place' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce', when: 'Aggregating the values you just extracted' },
  ],

  faq: [
    {
      q: 'Is the order guaranteed to match Object.keys?',
      a: 'Yes. All three of keys, values and entries use the same ordering algorithm, so the nth value corresponds to the nth key. What is not guaranteed is that the order matches how you wrote the object — integer-like keys jump to the front.',
    },
    {
      q: 'How do I sum the values of an object?',
      a: 'Object.values then reduce with an explicit initial value, so an empty object gives 0 rather than throwing.',
      code: 'Object.values(obj).reduce((a, b) => a + b, 0);',
    },
    {
      q: 'Why does Object.values(array) work?',
      a: 'Because an array IS an object whose own enumerable keys are its indices. You get the elements back, which makes it a slow no-op — use the array directly, or spread it if you need a copy.',
      code: 'Object.values([1, 2]);   // [1, 2] — just use the array',
    },
  ],

  history: [
    { version: 'ES2017', note: 'Object.values and Object.entries added, completing the trio begun by Object.keys in ES5.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values',
    meta:  'Object.values',
  },

};
