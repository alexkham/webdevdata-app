// content/reference/javascript/methods/object-seal.js
//
// isSealed, preventExtensions, isExtensible are consolidated here: the four
// form one ladder of restriction and only make sense compared with each
// other and with freeze.

export const meta = {
  slug:        'object-seal',
  name:        'Object.seal',
  signature:   'Object.seal(object)',
  blurb:       'Lock the SHAPE but not the values — the middle rung between preventExtensions and freeze.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Object.seal isSealed preventExtensions isExtensible freeze shape lock add delete properties javascript',
};

export const method = {
  slug:      'object-seal',
  name:      'Object.seal',
  signature: 'Object.seal(object)',
  returns:   { type: 'object', desc: 'The SAME object, sealed — no properties can be added or deleted, but existing ones can still be written to.' },

  category:    'Object static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'One of three levels of lock-down. preventExtensions blocks additions; seal also blocks deletions; freeze also blocks writes. Seal is the one people reach for least and confuse most.',

  cheat: {
    commonCall: 'Object.seal(obj)',
    returns:    'the same object, sealed',
    replaces:   'nothing; it sits between preventExtensions and freeze',
    watchOut:   'values are still writable — sealed is NOT frozen',
  },

  parameters: [
    { name: 'object', type: 'any', required: true, default: null, desc: 'The object to seal. Primitives are returned unchanged and report as sealed, as with freeze.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object', input: 'text' },
  ],
  demoTemplate: '(o => [Object.isSealed(o), Object.isFrozen(o)])(Object.seal(JSON.parse({json})))',
  cases: [
    { id: 'props',  label: 'has properties → not frozen', values: { json: '{"a":1,"n":{"x":1}}' } },
    { id: 'one',    label: 'one property',                values: { json: '{"a":1}' } },
    { id: 'empty',  label: 'EMPTY → also frozen (!)',     values: { json: '{}' } },
    { id: 'array',  label: 'an array',                    values: { json: '[1,2]' } },
  ],
  demoExplainer: "The pair shows sealed and frozen side by side. For an object with properties the answer is [true, false] — sealed, because nothing can be added or removed, but not frozen, because those properties can still be assigned to. The empty-object case returns [true, true], which looks like a bug and is not: an object with no properties has no writable properties, so sealing it satisfies the definition of frozen vacuously. Any predicate you write over possibly-empty objects has to account for that.",

  patterns: [
    {
      name: 'Fix the shape, allow updates',
      desc: 'Typos become errors; legitimate writes still work.',
      code: 'const state = Object.seal({count: 0, name: ""});',
    },
    {
      name: 'Block additions only',
      desc: 'The weakest of the three — deletes still allowed.',
      code: 'Object.preventExtensions(obj);',
    },
    {
      name: 'Choose the right rung',
      desc: 'Each adds a restriction to the previous one.',
      code: 'Object.preventExtensions(o);  // no adds\nObject.seal(o);               // no adds, no deletes\nObject.freeze(o);             // no adds, deletes or writes',
    },
  ],

  examples: [
    { title: 'Write still allowed', code: 'const o = Object.seal({a: 1});\no.a = 2;\no.a', returns: '2' },
    { title: 'Add blocked (strict)',code: '"use strict";\nconst o = Object.seal({a: 1});\no.b = 2', returns: 'TypeError: Cannot add property b, object is not extensible' },
    { title: 'Sealed is not frozen',code: 'Object.isFrozen(Object.seal({a: 1}))', returns: 'false' },
    { title: 'Frozen IS sealed',    code: 'Object.isSealed(Object.freeze({a: 1}))', returns: 'true' },
    { title: 'Empty sealed is frozen', code: 'Object.isFrozen(Object.seal({}))', returns: 'true' },
    { title: 'preventExtensions allows writes', code: 'const o = Object.preventExtensions({a: 1});\no.a = 2;\no.a', returns: '2' },
  ],

  pitfalls: [
    {
      name: 'Sealed does not mean read-only',
      desc: 'The most common confusion with freeze. Every existing property stays writable, so a sealed configuration object can have all its values changed — only its set of keys is fixed.',
      wrong: { label: 'Value changed', code: 'const o = Object.seal({a: 1});\no.a = 99;\no.a', output: '99' },
      fix:   { label: 'Freeze for read-only', code: 'const o = Object.freeze({a: 1});', output: 'writes blocked' },
    },
    {
      name: 'An empty sealed object reports as frozen',
      desc: 'Vacuously true — there is nothing writable to block. A guard like isFrozen(x) to decide whether an object is safely immutable answers yes for {} regardless of what you actually did to it.',
      wrong: { label: 'Misleading true', code: 'Object.isFrozen(Object.seal({}))', output: 'true' },
      fix:   { label: 'Ask what you mean', code: 'Object.isSealed(o) && Object.keys(o).length > 0', output: 'explicit' },
    },
    {
      name: 'Silent failure outside strict mode',
      desc: 'Identical to freeze — adding a property to a sealed object in sloppy mode does nothing and reports nothing. Modules and classes are strict, so this mostly appears in scripts and consoles.',
      wrong: { label: 'Silent', code: 'const o = Object.seal({a: 1});\no.b = 2;\no.b', output: 'undefined' },
      fix:   { label: 'Strict throws', code: '"use strict";\nObject.seal({}).b = 2', output: 'TypeError' },
    },
    {
      name: 'It is shallow, like freeze',
      desc: 'Nested objects are neither sealed nor frozen. Sealing the top level of a config says nothing about anything below it.',
      wrong: { label: 'Nested open', code: 'const o = Object.seal({n: {}});\no.n.added = 1;\no.n', output: '{added: 1}' },
      fix:   { label: 'Seal recursively', code: 'Object.values(o).forEach(v => typeof v === "object" && Object.seal(v));', output: 'one more level' },
    },
  ],

  when: {
    use: [
      'Fixing an object shape while allowing values to change — state containers',
      'Catching typo-ed property names, which would otherwise silently create a new key',
      'A middle ground where freeze would be too strict',
    ],
    avoid: [
      'You want read-only → freeze',
      'You only need to block additions → preventExtensions',
      'Nested data matters → neither is deep',
      'You want immutable updates → build new objects instead',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of own properties',
    return:     'The same object reference, non-extensible with every property non-configurable',
    cpython:    'V8: Builtins-object-seal',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; sealing is permanent',
  },

  related: [
    { name: 'Object.freeze',  slug: 'object-freeze',  when: 'The stricter level — values locked too' },
    { name: 'Object.assign',  slug: 'object-assign',  when: 'Writing into a sealed object, which still works' },
    { name: 'Object.keys',    slug: 'object-keys',    when: 'The key set that sealing fixes' },
    { name: 'Object.hasOwn',  slug: 'object-hasown',  when: 'Checking a property exists before writing' },
  ],

  faq: [
    {
      q: 'What is the difference between seal, freeze and preventExtensions?',
      a: 'A ladder. preventExtensions blocks new properties but allows deleting and writing. seal adds a block on deletion. freeze adds a block on writing. Every frozen object is sealed and non-extensible; the reverse does not hold.',
      code: 'Object.preventExtensions(o);  // no adds\nObject.seal(o);               // + no deletes\nObject.freeze(o);             // + no writes',
    },
    {
      q: 'Why is an empty sealed object frozen?',
      a: 'Because frozen means non-extensible with no writable, configurable properties — and an empty object trivially has none. The predicate is answering the letter of the definition, which is worth knowing before you rely on it as a guard.',
    },
    {
      q: 'Is sealing useful in practice?',
      a: 'Less often than freeze. Its real niche is catching typos: on a sealed state object, obj.cuont = 1 throws in strict mode instead of quietly creating a property nobody reads. Beyond that, most code either wants full immutability or no restriction at all.',
    },
  ],

  history: [
    { version: 'ES5', note: 'seal, freeze, preventExtensions and the three predicates added together.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal',
    meta:  'Object.seal',
  },

  tryInTool: [],
};
