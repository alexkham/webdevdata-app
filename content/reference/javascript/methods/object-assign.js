// content/reference/javascript/methods/object-assign.js

export const meta = {
  slug:        'object-assign',
  name:        'Object.assign',
  signature:   'Object.assign(target, ...sources)',
  blurb:       'Copy properties onto a target — it MUTATES that target, and the copy is shallow.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Object.assign merge copy clone shallow spread mutate target defaults extend setters es2015 javascript',
};

export const method = {
  slug:      'object-assign',
  name:      'Object.assign',
  signature: 'Object.assign(target, ...sources)',
  returns:   { type: 'object', desc: 'The TARGET object itself, modified in place — not a new object. Later sources overwrite earlier ones.' },

  category:    'Object static method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Merging, and the source of two persistent misunderstandings: the first argument is changed, and nested objects are shared rather than copied.',

  cheat: {
    commonCall: 'Object.assign({}, defaults, options)',
    returns:    'the target, mutated',
    replaces:   'a manual property-copying loop',
    watchOut:   'pass {} as the target unless you MEAN to mutate',
  },

  parameters: [
    { name: 'target',    type: 'object', required: true,  default: null,   desc: 'The object that receives the properties and is MODIFIED. It is also what gets returned.' },
    { name: '...sources',type: 'object', required: false, default: 'none', desc: 'Objects to copy from, left to right — later sources win. Only own enumerable properties are copied, including symbol keys. null and undefined sources are skipped silently.' },
  ],

  demoParams: [
    { name: 'a', type: 'string', hint: 'target JSON, e.g. {"a":1}', input: 'text' },
    { name: 'b', type: 'string', hint: 'source JSON, e.g. {"b":2}', input: 'text' },
  ],
  demoTemplate: 'Object.assign(JSON.parse({a}), JSON.parse({b}))',
  cases: [
    { id: 'merge',     label: 'disjoint keys merge',   values: { a: '{"a":1}', b: '{"b":2}' } },
    { id: 'overwrite', label: 'source WINS',           values: { a: '{"a":1}', b: '{"a":9}' } },
    { id: 'nested',    label: 'nested replaced whole (!)', values: { a: '{"n":{"x":1,"y":2}}', b: '{"n":{"x":9}}' } },
    { id: 'empty',     label: 'empty source',          values: { a: '{"a":1}', b: '{}' } },
    { id: 'undef',     label: 'null value copied',     values: { a: '{"a":1}', b: '{"a":null}' } },
  ],
  demoExplainer: "Disjoint keys merge and a repeated key takes the source value — straightforward. The third case is the one that catches people: assign is SHALLOW, so the nested object is not merged property by property. The whole of n is replaced by the source version, and the y that existed only in the target is gone. The last case shows there is no special treatment for null values either — null is a value like any other and overwrites what was there, which is why assign is a poor fit for options merging where absent means keep the default.",

  patterns: [
    {
      name: 'Merge into a fresh object',
      desc: 'The empty target is what keeps the inputs untouched.',
      code: 'const config = Object.assign({}, defaults, options);',
    },
    {
      name: 'Spread is usually clearer',
      desc: 'Same semantics, no mutable target to get wrong.',
      code: 'const config = {...defaults, ...options};',
    },
    {
      name: 'Copy while keeping the prototype',
      desc: 'Where spread would flatten to a plain object.',
      code: 'Object.assign(Object.create(Object.getPrototypeOf(src)), src);',
    },
  ],

  examples: [
    { title: 'Merge',            code: 'Object.assign({a: 1}, {b: 2})',        returns: '{a: 1, b: 2}' },
    { title: 'Source wins',      code: 'Object.assign({a: 1}, {a: 9})',        returns: '{a: 9}' },
    { title: 'Target is mutated',code: 'const t = {a: 1};\nObject.assign(t, {b: 2});\nt', returns: '{a: 1, b: 2}' },
    { title: 'It returns the target', code: 'const t = {};\nObject.assign(t, {a: 1}) === t', returns: 'true' },
    { title: 'Shallow',          code: 'const s = {n: {x: 1}};\nconst c = Object.assign({}, s);\nc.n === s.n', returns: 'true' },
    { title: 'Inherited skipped',code: 'const o = Object.create({x: 1});\no.y = 2;\nObject.assign({}, o)', returns: '{y: 2}' },
  ],

  pitfalls: [
    {
      name: 'It mutates the first argument',
      desc: 'The single most common misuse. Object.assign(defaults, options) modifies your defaults object permanently, so every later use of it is contaminated — and because the return value looks right, the bug shows up somewhere else entirely.',
      wrong: { label: 'Defaults destroyed', code: 'const d = {a: 1};\nObject.assign(d, {a: 9});\nd', output: '{a: 9}' },
      fix:   { label: 'Fresh target',       code: 'const d = {a: 1};\nconst merged = Object.assign({}, d, {a: 9});\nd', output: '{a: 1}' },
    },
    {
      name: 'The copy is shallow',
      desc: 'Nested objects are copied by reference, so the "copy" shares them with the original. Mutating a nested property through either one changes both, which defeats the entire purpose of having cloned.',
      wrong: { label: 'Shared nesting', code: 'const s = {n: {x: 1}};\nconst c = Object.assign({}, s);\nc.n.x = 9;\ns.n.x', output: '9' },
      fix:   { label: 'Deep clone',     code: 'const c = structuredClone(s);\nc.n.x = 9;\ns.n.x', output: '1' },
    },
    {
      name: 'It triggers setters on the target',
      desc: 'Properties are ASSIGNED, not defined, so a setter on the target runs and a read-only property throws in strict mode. Copying descriptors requires getOwnPropertyDescriptors with defineProperties instead.',
      wrong: { label: 'Setter runs', code: 'const t = {set a(v) { throw new Error("no"); }};\nObject.assign(t, {a: 1})', output: 'Error: no' },
      fix:   { label: 'Define instead', code: 'Object.defineProperties(t, Object.getOwnPropertyDescriptors(src))', output: 'no setter invoked' },
    },
    {
      name: 'Getters are evaluated, not copied',
      desc: 'A source getter is invoked once and its RESULT is stored as a plain value. The copy therefore freezes what was a live computed property, and it will never update again.',
      wrong: { label: 'Snapshot', code: 'const s = {get now() { return Date.now(); }};\nObject.assign({}, s).now', output: 'a fixed number' },
      fix:   { label: 'Copy the descriptor', code: 'Object.defineProperties({}, Object.getOwnPropertyDescriptors(s))', output: 'still a getter' },
    },
  ],

  when: {
    use: [
      'Merging several sources into one new object',
      'Deliberately updating an existing object in place',
      'Copying while preserving a prototype, with Object.create',
      'Copying symbol-keyed properties, which JSON round trips lose',
    ],
    avoid: [
      'You just want a merged literal → spread, which cannot mutate by accident',
      'Nested data must be independent → structuredClone',
      'Absent should mean "keep the default" → filter undefined first',
      'You need getters and setters preserved → getOwnPropertyDescriptors',
    ],
  },

  notes: {
    complexity: 'O(n) in the total number of own enumerable properties across sources',
    return:     'The target object, mutated — never a new object',
    cpython:    'V8: Builtins-object-assign',
    memory:     'No new object unless you pass a fresh target',
    threadSafe: 'Single-threaded; sources are read, target is written',
  },

  related: [
    { name: 'Object.fromEntries', slug: 'object-fromentries', when: 'Building an object from pairs instead of merging' },
    { name: 'Object.entries',     slug: 'object-entries',     when: 'Filtering properties before merging' },
    { name: 'Object.freeze',      slug: 'object-freeze',      when: 'Preventing the mutation assign performs' },
    { name: 'Object.keys',        slug: 'object-keys',        when: 'Seeing what was actually copied' },
  ],

  faq: [
    {
      q: 'Object.assign or spread?',
      a: 'Spread for building a new object — {...a, ...b} cannot accidentally mutate anything and reads better. Object.assign when you genuinely want to write into an existing object, or when you need symbol keys and a preserved prototype, which object spread also handles for symbols but flattens the prototype.',
      code: 'const merged = {...defaults, ...options};   // new object\nObject.assign(existing, patch);             // deliberate mutation',
    },
    {
      q: 'How do I deep merge?',
      a: 'Not with this — it replaces nested objects wholesale. structuredClone gives an independent copy but does not merge; a genuine deep merge needs a recursive function or a library, and you have to decide what should happen to arrays.',
      code: 'const copy = structuredClone(obj);   // deep copy, not a merge',
    },
    {
      q: 'Why did my defaults object change?',
      a: 'Because you passed it as the target. The first argument is written to and returned, so Object.assign(defaults, options) permanently alters defaults. Always pass a fresh {} first unless mutation is the point.',
      code: 'Object.assign({}, defaults, options);',
    },
    {
      q: 'Does it copy undefined values?',
      a: 'Yes — an explicit undefined in a source overwrites whatever the target had, because the property exists. Only null and undefined SOURCES are skipped, not undefined values inside a source.',
      code: 'Object.assign({a: 1}, {a: undefined});   // {a: undefined}',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Object.assign added, standardising the extend function every library shipped.' },
    { version: 'ES2018', note: 'Object spread syntax arrived and became the idiomatic form for building new objects.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign',
    meta:  'Object.assign',
  },

};
