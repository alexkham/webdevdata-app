// content/reference/javascript/methods/object-getprototypeof.js
//
// setPrototypeOf is consolidated here: the write half of the same pair, and
// the one you are told never to use.

export const meta = {
  slug:        'object-getprototypeof',
  name:        'Object.getPrototypeOf',
  signature:   'Object.getPrototypeOf(object)',
  blurb:       'Walk one link up the prototype chain — and why setPrototypeOf is a performance trap.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Object.getPrototypeOf setPrototypeOf __proto__ prototype chain inheritance instanceof null deoptimise javascript',
};

export const method = {
  slug:      'object-getprototypeof',
  name:      'Object.getPrototypeOf',
  signature: 'Object.getPrototypeOf(object)',
  returns:   { type: 'object | null', desc: 'The object prototype — one link up the chain. null for an object created with Object.create(null), and for Object.prototype itself.' },

  category:    'Object static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The standard replacement for the __proto__ accessor. Its companion setPrototypeOf exists too, and every engine documentation entry for it amounts to a warning not to call it.',

  cheat: {
    commonCall: 'Object.getPrototypeOf(o)',
    returns:    'the prototype object, or null',
    replaces:   'the legacy __proto__ accessor',
    watchOut:   'setPrototypeOf deoptimises the object permanently',
  },

  parameters: [
    { name: 'object', type: 'object', required: true, default: null, desc: 'The object to inspect. Primitives are coerced to their wrapper, so a number yields Number.prototype. null and undefined throw TypeError.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object or array', input: 'text' },
  ],
  demoTemplate: '(p => [p === Object.prototype, p === Array.prototype])(Object.getPrototypeOf(JSON.parse({json})))',
  cases: [
    { id: 'object', label: 'plain object',      values: { json: '{"a":1}' } },
    { id: 'array',  label: 'an array',          values: { json: '[1,2]' } },
    { id: 'nested', label: 'nested object',     values: { json: '{"a":1,"b":2}' } },
    { id: 'empty',  label: 'empty array',       values: { json: '[]' } },
  ],
  demoExplainer: "A prototype object cannot be printed usefully, so the demo reports which well-known prototype was found. A plain object gives [true, false] — its prototype is Object.prototype. An array gives [false, true], because its prototype is Array.prototype, which is where every array method lives. Array.prototype in turn has Object.prototype above it, which is how an array ends up with both push and hasOwnProperty. That two-step chain is exactly what instanceof walks.",

  patterns: [
    {
      name: 'Copy an object with its prototype',
      desc: 'Spread and assign both flatten to a plain object.',
      code: 'Object.assign(Object.create(Object.getPrototypeOf(src)), src);',
    },
    {
      name: 'Detect a plain object',
      desc: 'More precise than typeof.',
      code: 'const isPlain = o != null &&\n  (Object.getPrototypeOf(o) === Object.prototype ||\n   Object.getPrototypeOf(o) === null);',
    },
    {
      name: 'Set the prototype at creation, not after',
      desc: 'Avoids the deoptimisation entirely.',
      code: 'const o = Object.create(proto);',
    },
  ],

  examples: [
    { title: 'Plain object',      code: 'Object.getPrototypeOf({}) === Object.prototype', returns: 'true' },
    { title: 'Array',             code: 'Object.getPrototypeOf([]) === Array.prototype',  returns: 'true' },
    { title: 'Null prototype',    code: 'Object.getPrototypeOf(Object.create(null))',     returns: 'null' },
    { title: 'Top of the chain',  code: 'Object.getPrototypeOf(Object.prototype)',        returns: 'null' },
    { title: 'Primitives coerce', code: 'Object.getPrototypeOf(42) === Number.prototype', returns: 'true' },
    { title: 'null throws',       code: 'Object.getPrototypeOf(null)',                    returns: 'TypeError: Cannot convert undefined or null to object' },
  ],

  pitfalls: [
    {
      name: 'setPrototypeOf is genuinely slow',
      desc: 'Changing an object prototype after creation invalidates every inline cache that has ever seen it, and engines deoptimise the object permanently. It is one of the few operations that engine maintainers actively advise against. Build the object with the right prototype instead.',
      wrong: { label: 'Deoptimises', code: 'const o = {};\nObject.setPrototypeOf(o, proto);', output: 'works, but the object is now slow' },
      fix:   { label: 'Create it correctly', code: 'const o = Object.create(proto);', output: 'no penalty' },
    },
    {
      name: 'It returns null at the top of the chain',
      desc: 'Object.prototype has no prototype, and neither does an Object.create(null) object. Code that walks the chain must stop on null or it throws on the next iteration.',
      wrong: { label: 'Throws eventually', code: 'let p = o;\nwhile (true) p = Object.getPrototypeOf(p);', output: 'TypeError once p is null' },
      fix:   { label: 'Stop at null',      code: 'let p = o;\nwhile ((p = Object.getPrototypeOf(p)) !== null) { }', output: 'terminates' },
    },
    {
      name: 'It is one link, not the whole chain',
      desc: 'A single call goes up exactly one level. Finding whether a method is reachable means looping, or using instanceof or isPrototypeOf, both of which walk the chain for you.',
      wrong: { label: 'One level only', code: 'Object.getPrototypeOf([]) === Object.prototype', output: 'false — it is Array.prototype' },
      fix:   { label: 'Walk it',        code: 'Object.prototype.isPrototypeOf([])', output: 'true' },
    },
    {
      name: '__proto__ is the legacy form, and a hazard in data',
      desc: 'The accessor still works but is Annex B. Worse, assigning a key named __proto__ on a plain object CHANGES its prototype rather than storing a value, which is the basis of prototype-pollution attacks on parsed JSON.',
      wrong: { label: 'Changes the prototype', code: 'const o = {};\no.__proto__ = {polluted: 1};\nObject.getPrototypeOf(o).polluted', output: '1' },
      fix:   { label: 'Null-prototype dictionary', code: 'const d = Object.create(null);\nd.__proto__ = {x: 1};', output: 'stored as a normal key' },
    },
  ],

  when: {
    use: [
      'Copying an object while preserving its prototype',
      'Distinguishing a plain object from a class instance',
      'Introspection and debugging of a prototype chain',
      'Reaching a prototype to list its methods',
    ],
    avoid: [
      'Changing a prototype after creation → Object.create, or a class',
      'Checking a chain relationship → instanceof or isPrototypeOf',
      'Reading __proto__ → this is its standard replacement',
      'Building a dictionary → Object.create(null) or a Map',
    ],
  },

  notes: {
    complexity: 'O(1) to read; setPrototypeOf is O(1) but triggers deoptimisation',
    return:     'The prototype object, or null; nothing is allocated',
    cpython:    'V8: Builtins-object-getprototypeof',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; reading is always safe',
  },

  related: [
    { name: 'Object.create',                   slug: 'object-create',                   when: 'Setting the prototype at construction' },
    { name: 'Object.isPrototypeOf',            slug: 'object-isprototypeof',            when: 'Testing the whole chain rather than one link' },
    { name: 'Object.getOwnPropertyNames',      slug: 'object-getownpropertynames',      when: 'Listing what lives on the prototype' },
    { name: 'Object.getOwnPropertyDescriptor', slug: 'object-getownpropertydescriptor', when: 'Inspecting a prototype property in detail' },
  ],

  faq: [
    {
      q: 'getPrototypeOf or __proto__?',
      a: 'getPrototypeOf. The __proto__ accessor is Annex B — normatively optional, kept only for web compatibility — and it is the vector for prototype pollution when it appears as a key in untrusted data. The static method has neither problem.',
      code: 'Object.getPrototypeOf(o);   // standard\no.__proto__;                // legacy',
    },
    {
      q: 'Why is setPrototypeOf discouraged?',
      a: 'Because engines optimise property access by assuming an object shape is stable, and changing the prototype invalidates that assumption for every site that has touched the object. The object becomes permanently slower. Object.create sets the prototype before any optimisation exists to break.',
    },
    {
      q: 'How do I check whether something is a plain object?',
      a: 'Compare its prototype against Object.prototype, and allow null for dictionaries. typeof is useless here — it says "object" for arrays, dates and null alike.',
      code: 'const p = Object.getPrototypeOf(o);\nconst isPlain = p === Object.prototype || p === null;',
    },
    {
      q: 'What is at the top of every chain?',
      a: 'null. Object.prototype is the last real link, and its own prototype is null. That is the loop termination condition for any chain walk, and the reason Object.create(null) produces an object with no inherited anything.',
    },
  ],

  history: [
    { version: 'ES5',    note: 'getPrototypeOf added as the standard alternative to __proto__.' },
    { version: 'ES2015', note: 'setPrototypeOf standardised, and __proto__ documented in Annex B as legacy.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf',
    meta:  'Object.getPrototypeOf',
  },

  tryInTool: [],
};
