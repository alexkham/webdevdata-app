// content/reference/javascript/methods/object-hasownproperty.js

export const meta = {
  slug:        'object-hasownproperty',
  name:        'Object.prototype.hasOwnProperty',
  signature:   'object.hasOwnProperty(key)',
  blurb:       'The original own-property test — and it can be broken by the very object you test.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'hasOwnProperty hasOwn own property for-in guard shadowed null prototype eslint no-prototype-builtins javascript',
};

export const method = {
  slug:      'object-hasownproperty',
  name:      'Object.prototype.hasOwnProperty',
  signature: 'object.hasOwnProperty(key)',
  returns:   { type: 'boolean', desc: 'True if the key is an own property. Inherited properties give false — which is the entire point of it.' },

  category:    'Object method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'Superseded by Object.hasOwn in ES2022, for one reason: being a method, it can be missing or replaced on the object you are asking about.',

  cheat: {
    commonCall: 'Object.hasOwn(o, key)',
    returns:    'boolean',
    replaces:   'nothing — Object.hasOwn replaces IT',
    watchOut:   'unsafe on parsed JSON and null-prototype objects',
  },

  parameters: [
    { name: 'key', type: 'string | symbol', required: true, default: null, desc: 'The property key. Non-symbols are coerced to strings, so 1 and "1" are the same key.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object', input: 'text' },
    { name: 'key',  type: 'string', hint: 'property name',  input: 'text' },
  ],
  demoTemplate: 'JSON.parse({json}).hasOwnProperty({key})',
  cases: [
    { id: 'own',      label: 'own property',          values: { json: '{"a":1}', key: 'a' } },
    { id: 'absent',   label: 'absent',                values: { json: '{"a":1}', key: 'b' } },
    { id: 'inherited',label: 'toString → FALSE',      values: { json: '{"a":1}', key: 'toString' } },
    { id: 'nullval',  label: 'value is null → TRUE',  values: { json: '{"a":null}', key: 'a' } },
    { id: 'array',    label: 'array index',           values: { json: '[10,20]', key: '0' } },
  ],
  demoExplainer: "The results match Object.hasOwn exactly — inherited properties are false, and a property whose value is null still counts as present. What the demo cannot show is the failure mode that made this method obsolete: it only works because the object inherits it from Object.prototype. Give the object a property of the same name, or create it with no prototype at all, and the call throws instead of answering.",

  patterns: [
    {
      name: 'Use the static form',
      desc: 'Cannot be shadowed or missing.',
      code: 'if (Object.hasOwn(o, key)) { }',
    },
    {
      name: 'The safe legacy form',
      desc: 'For runtimes before ES2022.',
      code: 'if (Object.prototype.hasOwnProperty.call(o, key)) { }',
    },
    {
      name: 'Guard a for...in loop',
      desc: 'The historical reason this method is everywhere.',
      code: 'for (const k in o) {\n  if (!Object.hasOwn(o, k)) continue;\n}',
    },
  ],

  examples: [
    { title: 'Own property',     code: '({a: 1}).hasOwnProperty("a")',      returns: 'true' },
    { title: 'Inherited',        code: '({}).hasOwnProperty("toString")',   returns: 'false' },
    { title: 'in disagrees',     code: '"toString" in {}',                  returns: 'true' },
    { title: 'Null-prototype throws', code: 'Object.create(null).hasOwnProperty("a")', returns: 'TypeError: ...hasOwnProperty is not a function' },
    { title: 'Shadowed throws',  code: 'JSON.parse(\'{"hasOwnProperty":1}\').hasOwnProperty("x")', returns: 'TypeError: ...hasOwnProperty is not a function' },
    { title: 'The static is fine', code: 'Object.hasOwn(Object.create(null), "a")', returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'It can be shadowed by the data',
      desc: 'Any object with its own hasOwnProperty property replaces the method. Parsed JSON, query strings and form data can all contain that key, so the call throws — or, if the value happens to be callable, returns whatever the attacker decided.',
      wrong: { label: 'Broken by data', code: 'JSON.parse(\'{"hasOwnProperty":1}\').hasOwnProperty("x")', output: 'TypeError: ...hasOwnProperty is not a function' },
      fix:   { label: 'Static form',    code: 'Object.hasOwn(JSON.parse(\'{"hasOwnProperty":1}\'), "x")', output: 'false' },
    },
    {
      name: 'It does not exist on null-prototype objects',
      desc: 'The method is inherited from Object.prototype, so an object created with Object.create(null) — the standard way to build a safe dictionary — simply does not have it.',
      wrong: { label: 'Not a function', code: 'Object.create(null).hasOwnProperty("a")', output: 'TypeError: ...hasOwnProperty is not a function' },
      fix:   { label: 'Object.hasOwn',  code: 'Object.hasOwn(Object.create(null), "a")', output: 'false' },
    },
    {
      name: 'Linters flag direct calls for exactly this reason',
      desc: 'The ESLint rule no-prototype-builtins exists because of the two problems above. The historical fix was the verbose borrowed call; the modern one is the static method.',
      wrong: { label: 'Rule violation', code: 'o.hasOwnProperty(k)', output: 'no-prototype-builtins' },
      fix:   { label: 'Either safe form', code: 'Object.hasOwn(o, k)', output: 'passes' },
    },
    {
      name: 'It is not the in operator',
      desc: 'in searches the whole prototype chain; this stops at own properties. Neither is wrong — they answer different questions — but swapping one for the other changes the behaviour for every inherited method.',
      wrong: { label: 'Misses inherited', code: 'class A { m() {} }\nnew A().hasOwnProperty("m")', output: 'false' },
      fix:   { label: 'in finds it',      code: '"m" in new A()', output: 'true' },
    },
  ],

  when: {
    use: [
      'Legacy code where it already appears and the objects are trusted',
      'Runtimes predating ES2022, via the borrowed-call form',
    ],
    avoid: [
      'New code → Object.hasOwn',
      'Objects from untrusted input → the static form, always',
      'Null-prototype dictionaries → the method does not exist there',
      'You want inherited properties too → the in operator',
    ],
  },

  notes: {
    complexity: 'O(1) — an own-property lookup with no chain walk',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-object-hasownproperty',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the object is only read',
  },

  related: [
    { name: 'Object.hasOwn',                slug: 'object-hasown',                when: 'The static replacement — use this instead' },
    { name: 'Object.keys',                  slug: 'object-keys',                  when: 'Listing own keys rather than testing one' },
    { name: 'Object.propertyIsEnumerable',  slug: 'object-propertyisenumerable',  when: 'Own AND enumerable, a stricter test' },
    { name: 'Object.isPrototypeOf',         slug: 'object-isprototypeof',         when: 'The other inherited introspection method' },
  ],

  faq: [
    {
      q: 'Should I still use hasOwnProperty?',
      a: 'Not in new code. Object.hasOwn does the same job, cannot be shadowed by the object being tested, and works on null-prototype objects. The only reason to keep the old form is a runtime older than 2021, and even then the borrowed call is safer than the direct one.',
      code: 'Object.hasOwn(o, k);                          // modern\nObject.prototype.hasOwnProperty.call(o, k);   // safe legacy',
    },
    {
      q: 'Why does calling it on parsed JSON sometimes throw?',
      a: 'Because the JSON contained a key called hasOwnProperty, which becomes an own property and shadows the inherited method. The value is a number, numbers are not callable, and the call fails.',
    },
    {
      q: 'What is no-prototype-builtins about?',
      a: 'An ESLint rule that flags calling Object.prototype methods directly on an object, because the object may shadow them or lack them entirely. It applies to hasOwnProperty, isPrototypeOf and propertyIsEnumerable alike.',
    },
  ],

  history: [
    { version: 'ES3',    note: 'hasOwnProperty present from early JavaScript as the for...in guard.' },
    { version: 'ES5',    note: 'Object.create(null) made prototype-less objects common, and this method unavailable on them.' },
    { version: 'ES2022', note: 'Object.hasOwn added as the static, un-shadowable replacement.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty',
    meta:  'Object.prototype.hasOwnProperty',
  },

};
