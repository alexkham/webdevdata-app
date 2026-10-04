// content/reference/javascript/methods/object-freeze.js
//
// isFrozen is consolidated here — it exists only to answer the question
// this method poses, and the demo uses it to expose the shallowness.

export const meta = {
  slug:        'object-freeze',
  name:        'Object.freeze',
  signature:   'Object.freeze(object)',
  blurb:       'Make an object read-only — one level deep, and silently in sloppy mode.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Object.freeze isFrozen immutable readonly const shallow deep freeze seal strict mode silent failure javascript',
};

export const method = {
  slug:      'object-freeze',
  name:      'Object.freeze',
  signature: 'Object.freeze(object)',
  returns:   { type: 'object', desc: 'The SAME object, now frozen — not a frozen copy. Properties cannot be added, removed, reordered or changed.' },

  category:    'Object static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'Genuine immutability, with two large caveats: it reaches only one level down, and outside strict mode a blocked write fails without saying anything.',

  cheat: {
    commonCall: 'Object.freeze(config)',
    returns:    'the same object, frozen',
    replaces:   'a convention that nobody will mutate it',
    watchOut:   'SHALLOW — nested objects stay fully mutable',
  },

  parameters: [
    { name: 'object', type: 'any', required: true, default: null, desc: 'The object to freeze. Primitives are returned unchanged and count as already frozen, so freezing one is a silent no-op rather than an error.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON with an "n" property', input: 'text' },
  ],
  demoTemplate: '(o => [Object.isFrozen(o), Object.isFrozen(o.n)])(Object.freeze(JSON.parse({json})))',
  cases: [
    { id: 'nested',    label: 'nested object NOT frozen (!)', values: { json: '{"a":1,"n":{"x":1}}' } },
    { id: 'primitive', label: 'primitive value',              values: { json: '{"a":1,"n":2}' } },
    { id: 'string',    label: 'string value',                 values: { json: '{"n":"hi"}' } },
    { id: 'array',     label: 'nested array NOT frozen (!)',  values: { json: '{"n":[1,2]}' } },
  ],
  demoExplainer: "The output is a pair: whether the object itself is frozen, and whether its n property is. The first case is the whole lesson — the outer object reports true while the nested object reports FALSE. Freezing protects only the top level, so config.n.x = 99 still succeeds on a frozen config. The second and third cases return true for n because primitives are immutable by definition and count as frozen; that makes the predicate look reassuring on flat objects and useless on nested ones. The array case behaves like the object case: arrays are objects, and they are left mutable.",

  patterns: [
    {
      name: 'Freeze a constant',
      desc: 'const stops reassignment, not mutation.',
      code: 'export const COLORS = Object.freeze({red: "#f00"});',
    },
    {
      name: 'Freeze deeply',
      desc: 'Recurse yourself; there is no built-in.',
      code: 'const deepFreeze = o => {\n  Object.values(o).forEach(v => {\n    if (v && typeof v === "object") deepFreeze(v);\n  });\n  return Object.freeze(o);\n};',
    },
    {
      name: 'Prefer copying to freezing',
      desc: 'Immutable UPDATES rather than enforced immutability.',
      code: 'const next = {...state, count: state.count + 1};',
    },
  ],

  examples: [
    { title: 'Write blocked (strict)', code: '"use strict";\nconst o = Object.freeze({a: 1});\no.a = 2', returns: "TypeError: Cannot assign to read only property 'a'" },
    { title: 'Write ignored (sloppy)', code: 'const o = Object.freeze({a: 1});\no.a = 2;\no.a', returns: '1   // no error at all' },
    { title: 'Shallow',                code: 'const o = Object.freeze({n: {x: 1}});\no.n.x = 9;\no.n.x', returns: '9' },
    { title: 'Same object back',       code: 'const o = {a: 1};\nObject.freeze(o) === o', returns: 'true' },
    { title: 'Arrays too',             code: '"use strict";\nObject.freeze([1]).push(2)', returns: 'TypeError: Cannot add property 1, object is not extensible' },
    { title: 'Primitives are frozen',  code: 'Object.isFrozen(42)', returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'It is shallow',
      desc: 'Only the object own properties become read-only. Every nested object and array stays fully mutable, so a frozen configuration object gives no protection at all to the interesting parts of a nested config.',
      wrong: { label: 'Nested still writable', code: 'const c = Object.freeze({db: {host: "x"}});\nc.db.host = "y";\nc.db.host', output: "'y'" },
      fix:   { label: 'Freeze recursively',    code: 'deepFreeze(c);', output: 'TypeError on write' },
    },
    {
      name: 'It fails silently outside strict mode',
      desc: 'A blocked assignment in sloppy mode does nothing and reports nothing — the value simply stays as it was. ES modules and class bodies are strict automatically, so this mostly bites in plain scripts and in the console.',
      wrong: { label: 'Silent no-op', code: 'const o = Object.freeze({a: 1});\no.a = 2;\no.a', output: '1' },
      fix:   { label: 'Strict throws', code: '"use strict";\nconst o = Object.freeze({a: 1});\no.a = 2', output: 'TypeError' },
    },
    {
      name: 'const and freeze solve different problems',
      desc: 'const prevents REBINDING the variable; freeze prevents MUTATING the value. A const object can have its properties changed freely, and a frozen object can still be replaced if it was declared with let.',
      wrong: { label: 'const is not immutable', code: 'const o = {a: 1};\no.a = 2;\no.a', output: '2' },
      fix:   { label: 'Freeze the value',       code: 'const o = Object.freeze({a: 1});', output: 'mutation blocked' },
    },
    {
      name: 'Freezing a primitive is a silent no-op',
      desc: 'Passing a number or a string returns it unchanged and isFrozen reports true, so a defensive freeze on a value that turned out not to be an object gives false confidence rather than an error.',
      wrong: { label: 'Looks protected', code: 'Object.isFrozen(Object.freeze(42))', output: 'true' },
      fix:   { label: 'Check the type first', code: 'typeof v === "object" && v !== null', output: 'explicit' },
    },
  ],

  when: {
    use: [
      'Exported constants and lookup tables',
      'Catching accidental mutation during development',
      'Enforcing that a shared object is not modified by consumers',
    ],
    avoid: [
      'Nested data → freeze recursively, or do not rely on it',
      'You want immutable UPDATES → spread into a new object',
      'Hot paths — some engines deoptimise frozen objects in polymorphic code',
      'You only want to block adding properties → seal or preventExtensions',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of own properties',
    return:     'The same object reference, now non-extensible with every property non-writable and non-configurable',
    cpython:    'V8: Builtins-object-freeze',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; freezing is permanent and cannot be undone',
  },

  related: [
    { name: 'Object.seal',    slug: 'object-seal',    when: 'Block adding and removing, but still allow writes' },
    { name: 'Object.assign',  slug: 'object-assign',  when: 'The mutation this prevents' },
    { name: 'Object.keys',    slug: 'object-keys',    when: 'Enumerating what got frozen' },
    { name: 'Object.is',      slug: 'object-is',      when: 'Comparing values rather than protecting them' },
  ],

  faq: [
    {
      q: 'How do I deep freeze?',
      a: 'Recurse over the values yourself — there is no built-in. Watch for cycles, which will otherwise recurse forever, and remember that freezing is irreversible.',
      code: 'const deepFreeze = o => {\n  Object.values(o).forEach(v => {\n    if (v && typeof v === "object" && !Object.isFrozen(v)) deepFreeze(v);\n  });\n  return Object.freeze(o);\n};',
    },
    {
      q: 'Can I unfreeze an object?',
      a: 'No. Freezing is permanent for that object. The way forward is to build a new object from its contents — spread it, change what you need, and the copy is unfrozen.',
      code: 'const thawed = {...frozen, a: 2};',
    },
    {
      q: 'Is it the same as const?',
      a: 'No, and they compose. const is about the binding — you cannot point the variable at something else. freeze is about the value — you cannot change what is inside it. A const object is freely mutable unless you also freeze it.',
    },
    {
      q: 'Does freezing help performance?',
      a: 'Not reliably. It was once suggested as a hint to engines, but in practice modern V8 can deoptimise frozen objects in some polymorphic patterns. Freeze for correctness and for catching bugs, not for speed.',
    },
  ],

  history: [
    { version: 'ES5',    note: 'freeze, seal, preventExtensions and their predicates added together.' },
    { version: 'ES2015', note: 'Strict mode became the default inside modules and classes, making blocked writes throw far more often.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze',
    meta:  'Object.freeze',
  },

};
