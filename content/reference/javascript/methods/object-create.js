// content/reference/javascript/methods/object-create.js

export const meta = {
  slug:        'object-create',
  name:        'Object.create',
  signature:   'Object.create(proto[, descriptors])',
  blurb:       'Build an object with a chosen prototype — or with none at all, which is the real use.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Object.create prototype null dictionary inherit descriptors prototypal inheritance map clean object javascript',
};

export const method = {
  slug:      'object-create',
  name:      'Object.create',
  signature: 'Object.create(proto[, descriptors])',
  returns:   { type: 'object', desc: 'A new object with NO own properties, whose prototype is the object you passed. Passing null gives an object that inherits nothing at all.' },

  category:    'Object static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'Classes replaced it for inheritance. What survives is Object.create(null) — the way to build a dictionary that cannot collide with anything on Object.prototype.',

  cheat: {
    commonCall: 'Object.create(null)',
    returns:    'a new object with the given prototype',
    replaces:   'the constructor-and-prototype dance, for inheritance',
    watchOut:   'a null-prototype object has no toString or hasOwnProperty',
  },

  parameters: [
    { name: 'proto',       type: 'object | null', required: true,  default: null,   desc: 'The prototype for the new object. null creates an object with no prototype chain whatsoever. Any other primitive throws TypeError.' },
    { name: 'descriptors', type: 'object',        required: false, default: 'none', desc: 'Property descriptors in the same shape Object.defineProperties takes — so properties added here are non-enumerable by default, exactly as with defineProperty.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object to use as prototype', input: 'text' },
  ],
  demoTemplate: '(o => [Object.keys(o), o.x])(Object.create(JSON.parse({json})))',
  cases: [
    { id: 'inherit', label: 'inherits x, owns nothing', values: { json: '{"x":1}' } },
    { id: 'other',   label: 'a different value',        values: { json: '{"x":"hi"}' } },
    { id: 'noX',     label: 'prototype without x',      values: { json: '{"y":1}' } },
    { id: 'empty',   label: 'empty prototype',          values: { json: '{}' } },
  ],
  demoExplainer: "The pair shows the new object own keys and the value it reads for x. In the first case the keys array is EMPTY while o.x is 1 — the value is found on the prototype, not on the object itself. That is the entire mechanism: create gives you a blank object that delegates lookups upward. It is also why Object.keys, Object.entries and JSON.stringify all see nothing here, while a plain property read succeeds. When the prototype has no x at all, the read is undefined rather than an error.",

  patterns: [
    {
      name: 'A dictionary with no inherited keys',
      desc: 'The one use that modern code still needs.',
      code: 'const counts = Object.create(null);\ncounts[userKey] = 1;',
    },
    {
      name: 'Copy an object with its prototype',
      desc: 'Where spread would flatten to a plain object.',
      code: 'Object.assign(Object.create(Object.getPrototypeOf(src)), src);',
    },
    {
      name: 'Use a class for inheritance',
      desc: 'What create used to be for.',
      code: 'class Dog extends Animal { }',
    },
  ],

  examples: [
    { title: 'No own properties',   code: 'Object.keys(Object.create({x: 1}))', returns: '[]' },
    { title: 'But x is readable',   code: 'Object.create({x: 1}).x',            returns: '1' },
    { title: 'Null prototype',      code: 'Object.getPrototypeOf(Object.create(null))', returns: 'null' },
    { title: 'No inherited methods',code: '"toString" in Object.create(null)',  returns: 'false' },
    { title: 'So coercion throws',  code: '`${Object.create(null)}`',           returns: 'TypeError: Cannot convert object to primitive value' },
    { title: 'With descriptors',    code: 'Object.create(null, {a: {value: 1, enumerable: true}})', returns: '{a: 1}' },
  ],

  pitfalls: [
    {
      name: 'A null-prototype object has no methods at all',
      desc: 'No toString, no hasOwnProperty, no valueOf. String conversion throws rather than producing "[object Object]", so a stray template literal or a console.log in some libraries will fail on it.',
      wrong: { label: 'Coercion throws', code: '`${Object.create(null)}`', output: 'TypeError: Cannot convert object to primitive value' },
      fix:   { label: 'Use the statics', code: 'JSON.stringify(dict);\nObject.hasOwn(dict, k);', output: 'work regardless of prototype' },
    },
    {
      name: 'Properties added via descriptors are non-enumerable',
      desc: 'The second argument is Object.defineProperties, not an object literal, so it inherits the same default of enumerable: false. Properties you add this way silently vanish from Object.keys and JSON.stringify.',
      wrong: { label: 'Invisible', code: 'Object.keys(Object.create(null, {a: {value: 1}}))', output: '[]' },
      fix:   { label: 'Say enumerable', code: 'Object.keys(Object.create(null, {a: {value: 1, enumerable: true}}))', output: "['a']" },
    },
    {
      name: 'It is not a copy',
      desc: 'Object.create(src) does not clone src — it creates an empty object that DELEGATES to it. Changing the original afterwards changes what the new object appears to contain, and writing to the new object shadows rather than updates.',
      wrong: { label: 'Linked, not copied', code: 'const src = {x: 1};\nconst o = Object.create(src);\nsrc.x = 9;\no.x', output: '9' },
      fix:   { label: 'Actually copy',      code: 'const o = {...src};\nsrc.x = 9;\no.x', output: '1' },
    },
    {
      name: 'A primitive prototype throws',
      desc: 'Only an object or null is accepted. Passing a number or a string — easy when the value came from data — is a TypeError rather than a silent coercion.',
      wrong: { label: 'Throws', code: 'Object.create(42)', output: 'TypeError: Object prototype may only be an Object or null: 42' },
      fix:   { label: 'Guard it', code: 'Object.create(typeof p === "object" ? p : null)', output: 'safe' },
    },
  ],

  when: {
    use: [
      'Dictionaries keyed by untrusted strings — Object.create(null)',
      'Copying an object while preserving its prototype',
      'Setting up a prototype chain without a constructor',
      'Creating an object with precisely specified descriptors',
    ],
    avoid: [
      'Class-style inheritance → class and extends',
      'You want a copy → spread, Object.assign or structuredClone',
      'A keyed collection → a Map, which needs no prototype tricks',
      'The result will be string-coerced → a null prototype will throw',
    ],
  },

  notes: {
    complexity: 'O(1), or O(n) with a descriptors argument',
    return:     'A new object; no properties are copied from the prototype',
    cpython:    'V8: Builtins-object-create',
    memory:     'Allocates one empty object',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Object.getPrototypeOf',  slug: 'object-getprototypeof',  when: 'Reading back the prototype you set' },
    { name: 'Object.defineProperty',  slug: 'object-defineproperty',  when: 'The descriptor rules the second argument follows' },
    { name: 'Object.hasOwn',          slug: 'object-hasown',          when: 'Safe property checks on null-prototype objects' },
    { name: 'Object.assign',          slug: 'object-assign',          when: 'Copying properties into the object you created' },
  ],

  faq: [
    {
      q: 'Why use Object.create(null) for a dictionary?',
      a: 'Because a plain object inherits from Object.prototype, so keys like "toString" or "constructor" appear to exist before you set them, and a key of "__proto__" can change the prototype instead of storing a value. A null-prototype object has nothing to collide with. A Map avoids the problem entirely and is usually the better answer.',
      code: 'const d = Object.create(null);\nd.toString;   // undefined, not a function',
    },
    {
      q: 'Object.create or class?',
      a: 'class for anything resembling object-oriented code — it is clearer, handles the constructor and super correctly, and is what other developers expect. Object.create survives for null prototypes and for the rare case where you want to set a prototype without a constructor at all.',
    },
    {
      q: 'Does it copy the prototype properties?',
      a: 'No. Nothing is copied — the new object is empty and looks up missing properties on the prototype at read time. That is why Object.keys returns an empty array while a direct property read succeeds.',
      code: 'const o = Object.create({x: 1});\nObject.keys(o);   // []\no.x;              // 1',
    },
  ],

  history: [
    { version: 'ES5',    note: 'Object.create added, giving direct control over prototypes for the first time.' },
    { version: 'ES2015', note: 'class syntax arrived and took over inheritance, leaving the null-prototype case as the main remaining use.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create',
    meta:  'Object.create',
  },

  tryInTool: [],
};
