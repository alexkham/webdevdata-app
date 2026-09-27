// content/reference/javascript/methods/object-propertyisenumerable.js

export const meta = {
  slug:        'object-propertyisenumerable',
  name:        'Object.prototype.propertyIsEnumerable',
  signature:   'object.propertyIsEnumerable(key)',
  blurb:       'Own AND enumerable in one call — a stricter test than hasOwnProperty, and rarely the one you want.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'propertyIsEnumerable enumerable own property descriptor hidden for-in keys length javascript',
};

export const method = {
  slug:      'object-propertyisenumerable',
  name:      'Object.prototype.propertyIsEnumerable',
  signature: 'object.propertyIsEnumerable(key)',
  returns:   { type: 'boolean', desc: 'True only if the key is BOTH an own property and enumerable. Inherited properties and non-enumerable ones both give false, with no way to tell which.' },

  category:    'Object method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The least-used of the three inherited introspection methods. It answers a compound question, and because false covers two very different cases it is usually clearer to ask them separately.',

  cheat: {
    commonCall: 'o.propertyIsEnumerable(k)',
    returns:    'boolean — own AND enumerable',
    replaces:   'a hasOwnProperty check plus a descriptor lookup',
    watchOut:   'false means "not own" OR "not enumerable" — ambiguous',
  },

  parameters: [
    { name: 'key', type: 'string | symbol', required: true, default: null, desc: 'The property key to test. Non-symbols are coerced to strings.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object or array', input: 'text' },
    { name: 'key',  type: 'string', hint: 'property name',          input: 'text' },
  ],
  demoTemplate: 'JSON.parse({json}).propertyIsEnumerable({key})',
  cases: [
    { id: 'own',      label: 'own property → true',      values: { json: '{"a":1}', key: 'a' } },
    { id: 'absent',   label: 'absent → false',           values: { json: '{"a":1}', key: 'b' } },
    { id: 'inherited',label: 'toString → false',         values: { json: '{"a":1}', key: 'toString' } },
    { id: 'length',   label: 'array length → FALSE (!)', values: { json: '[10,20]', key: 'length' } },
    { id: 'index',    label: 'array index → true',       values: { json: '[10,20]', key: '0' } },
  ],
  demoExplainer: "The array cases show the two halves of the question. An index is an own enumerable property, so it is true — and that is why Object.keys lists it. length is a real own property of the array, but a non-enumerable one, so this returns false and Object.keys omits it. Note that the absent case and the inherited case both return false as well, which is the method weakness: a false answer cannot tell you whether the property is missing, inherited, or merely hidden.",

  patterns: [
    {
      name: 'Ask the two questions separately',
      desc: 'Clearer, and each answer is unambiguous.',
      code: 'Object.hasOwn(o, k);\nObject.getOwnPropertyDescriptor(o, k)?.enumerable;',
    },
    {
      name: 'Just use Object.keys',
      desc: 'Enumerable own keys are exactly what it returns.',
      code: 'Object.keys(o).includes(k);',
    },
    {
      name: 'Borrow it safely',
      desc: 'Same shadowing risk as hasOwnProperty.',
      code: 'Object.prototype.propertyIsEnumerable.call(o, k);',
    },
  ],

  examples: [
    { title: 'Own and enumerable', code: '({a: 1}).propertyIsEnumerable("a")',   returns: 'true' },
    { title: 'Inherited',          code: '({}).propertyIsEnumerable("toString")',returns: 'false' },
    { title: 'Array index',        code: '[1].propertyIsEnumerable("0")',        returns: 'true' },
    { title: 'Array length',       code: '[1].propertyIsEnumerable("length")',   returns: 'false' },
    { title: 'Defined property',   code: 'const o = {};\nObject.defineProperty(o, "h", {value: 1});\no.propertyIsEnumerable("h")', returns: 'false' },
    { title: 'But it is own',      code: 'Object.hasOwn(o, "h")',                returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'A false answer is ambiguous',
      desc: 'It conflates three situations — the property is absent, the property is inherited, or the property is own but non-enumerable. Code that branches on false cannot tell which, so the two questions are better asked separately.',
      wrong: { label: 'Same answer, different reasons', code: '({}).propertyIsEnumerable("toString")', output: 'false — inherited' },
      fix:   { label: 'Be specific', code: 'Object.hasOwn(o, k) && Object.getOwnPropertyDescriptor(o, k).enumerable', output: 'each part separately' },
    },
    {
      name: 'It is inherited, so it can be shadowed',
      desc: 'Identical to hasOwnProperty and isPrototypeOf. An object from untrusted data, or one with a null prototype, breaks a direct call. ESLint no-prototype-builtins flags it for the same reason.',
      wrong: { label: 'Missing', code: 'Object.create(null).propertyIsEnumerable("a")', output: 'TypeError: ...propertyIsEnumerable is not a function' },
      fix:   { label: 'Borrow it', code: 'Object.prototype.propertyIsEnumerable.call(o, "a")', output: 'false' },
    },
    {
      name: 'There is no static form — and the obvious guess fails SILENTLY',
      desc: 'Unlike hasOwnProperty, which gained Object.hasOwn in ES2022, this method has no static counterpart. Worse, writing Object.propertyIsEnumerable(o, k) does not throw: Object is itself an object, so it inherits the method, and the call runs with Object as the receiver and your object coerced to a string as the key. The answer is meaningless and always false.',
      wrong: { label: 'Silently wrong', code: 'Object.propertyIsEnumerable({a: 1}, "a")', output: 'false   // asks whether Object has "[object Object]"' },
      fix:   { label: 'Use a descriptor', code: 'Object.getOwnPropertyDescriptor(o, k)?.enumerable === true', output: 'works, and is unambiguous' },
    },
  ],

  when: {
    use: [
      'Rarely — a compact own-and-enumerable test in code you control',
      'Understanding why a property is missing from Object.keys',
    ],
    avoid: [
      'You want to know if a property exists → Object.hasOwn',
      'You want the enumerability specifically → getOwnPropertyDescriptor',
      'You are listing keys → Object.keys already filters on this',
      'Untrusted objects → the method may be shadowed or missing',
    ],
  },

  notes: {
    complexity: 'O(1) — one own-property lookup',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-object-propertyisenumerable',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the object is only read',
  },

  related: [
    { name: 'Object.hasOwn',                   slug: 'object-hasown',                   when: 'Own-ness alone, unambiguously' },
    { name: 'Object.getOwnPropertyDescriptor', slug: 'object-getownpropertydescriptor', when: 'Enumerability plus every other flag' },
    { name: 'Object.keys',                     slug: 'object-keys',                     when: 'Every key that would answer true here' },
    { name: 'Object.getOwnPropertyNames',      slug: 'object-getownpropertynames',      when: 'Including the keys that answer false' },
  ],

  faq: [
    {
      q: 'How is this different from hasOwnProperty?',
      a: 'It adds the enumerability requirement. A property defined with defineProperty, or a built-in like array length, is an own property — so hasOwnProperty is true — but it is not enumerable, so this returns false.',
      code: 'const o = {};\nObject.defineProperty(o, "h", {value: 1});\nObject.hasOwn(o, "h");              // true\no.propertyIsEnumerable("h");        // false',
    },
    {
      q: 'Is there an Object.propertyIsEnumerable static?',
      a: 'No — and the trap is that typing it does not fail. Object inherits the method from Object.prototype, so Object.propertyIsEnumerable(o, k) is a valid call that asks a nonsense question and returns false. Use getOwnPropertyDescriptor instead, which also tells you whether the property exists at all.',
      code: 'Object.propertyIsEnumerable({a: 1}, "a");                    // false — meaningless\nObject.getOwnPropertyDescriptor(o, k)?.enumerable === true;  // correct',
    },
    {
      q: 'Why is array length not enumerable?',
      a: 'So that it stays out of for...in loops and Object.keys, which would otherwise iterate it as if it were an element. Nearly every built-in property is non-enumerable for the same reason.',
    },
  ],

  history: [
    { version: 'ES3', note: 'propertyIsEnumerable present from early JavaScript with hasOwnProperty and isPrototypeOf.' },
    { version: 'ES5', note: 'The descriptor model made getOwnPropertyDescriptor a more informative alternative.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable',
    meta:  'Object.prototype.propertyIsEnumerable',
  },

  tryInTool: [],
};
