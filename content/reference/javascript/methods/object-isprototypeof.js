// content/reference/javascript/methods/object-isprototypeof.js

export const meta = {
  slug:        'object-isprototypeof',
  name:        'Object.prototype.isPrototypeOf',
  signature:   'proto.isPrototypeOf(object)',
  blurb:       'Is this object anywhere in that one prototype chain? Like instanceof, without needing a constructor.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'isPrototypeOf instanceof prototype chain inheritance ancestor getPrototypeOf realm constructor javascript',
};

export const method = {
  slug:      'object-isprototypeof',
  name:      'Object.prototype.isPrototypeOf',
  signature: 'proto.isPrototypeOf(object)',
  returns:   { type: 'boolean', desc: 'True if the receiver appears ANYWHERE in the argument prototype chain — not just as its immediate prototype.' },

  category:    'Object method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The chain-walking counterpart to getPrototypeOf. It asks the same question as instanceof but against a prototype object directly, which is what you need when there is no constructor to name.',

  cheat: {
    commonCall: 'proto.isPrototypeOf(obj)',
    returns:    'boolean',
    replaces:   'a manual getPrototypeOf loop',
    watchOut:   'the receiver is the PROTOTYPE, the argument is the object',
  },

  parameters: [
    { name: 'object', type: 'any', required: true, default: null, desc: 'The object whose chain is searched. A primitive or a null always returns false rather than throwing.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object or array', input: 'text' },
  ],
  demoTemplate: '(v => [Object.prototype.isPrototypeOf(v), Array.prototype.isPrototypeOf(v)])(JSON.parse({json}))',
  cases: [
    { id: 'object', label: 'plain object',       values: { json: '{"a":1}' } },
    { id: 'array',  label: 'array → BOTH true (!)',values: { json: '[1,2]' } },
    { id: 'empty',  label: 'empty object',       values: { json: '{}' } },
    { id: 'nested', label: 'nested object',      values: { json: '{"a":{"b":1}}' } },
  ],
  demoExplainer: "The array case is the one that teaches the method. It returns [true, true] — Array.prototype is its immediate prototype, AND Object.prototype is further up the same chain. isPrototypeOf walks the whole chain rather than checking one link, which is precisely how it differs from comparing getPrototypeOf. A plain object gives [true, false] because Array.prototype appears nowhere above it.",

  patterns: [
    {
      name: 'Check ancestry without a constructor',
      desc: 'Where instanceof needs a function to name.',
      code: 'if (basePrototype.isPrototypeOf(obj)) { }',
    },
    {
      name: 'Prefer instanceof when there is a class',
      desc: 'Clearer, and reads the way people expect.',
      code: 'if (obj instanceof Animal) { }',
    },
    {
      name: 'Check one link only',
      desc: 'A direct comparison, not a chain walk.',
      code: 'Object.getPrototypeOf(obj) === proto;',
    },
  ],

  examples: [
    { title: 'Immediate prototype', code: 'Array.prototype.isPrototypeOf([])',   returns: 'true' },
    { title: 'Further up the chain',code: 'Object.prototype.isPrototypeOf([])',  returns: 'true' },
    { title: 'Unrelated',           code: 'Array.prototype.isPrototypeOf({})',   returns: 'false' },
    { title: 'Agrees with instanceof', code: 'function F() {}\nF.prototype.isPrototypeOf(new F())', returns: 'true' },
    { title: 'Primitives are false',code: 'Object.prototype.isPrototypeOf(42)',  returns: 'false' },
    { title: 'null is false',       code: 'Object.prototype.isPrototypeOf(null)',returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'The receiver and the argument are easy to swap',
      desc: 'It reads as "A is the prototype of B", so the PROTOTYPE goes on the left and the instance in the parentheses. Written the other way round it silently returns false rather than complaining, which makes the mistake hard to spot.',
      wrong: { label: 'Backwards', code: '[].isPrototypeOf(Array.prototype)', output: 'false' },
      fix:   { label: 'Correct order', code: 'Array.prototype.isPrototypeOf([])', output: 'true' },
    },
    {
      name: 'It checks the whole chain, not one link',
      desc: 'Object.prototype is an ancestor of almost everything, so testing against it is nearly always true and tells you very little. For "is this its immediate prototype", compare getPrototypeOf directly.',
      wrong: { label: 'Almost always true', code: 'Object.prototype.isPrototypeOf([])', output: 'true' },
      fix:   { label: 'One link',           code: 'Object.getPrototypeOf([]) === Object.prototype', output: 'false' },
    },
    {
      name: 'It is an inherited method, so it can be shadowed',
      desc: 'The same weakness as hasOwnProperty. An object with its own isPrototypeOf property, or one built with Object.create(null), breaks a direct call — though here the receiver is usually a prototype you control, which makes it far less dangerous in practice.',
      wrong: { label: 'Missing on null-proto', code: 'Object.create(null).isPrototypeOf({})', output: 'TypeError: ...isPrototypeOf is not a function' },
      fix:   { label: 'Borrow it',             code: 'Object.prototype.isPrototypeOf.call(proto, obj)', output: 'works' },
    },
    {
      name: 'It is not the same question as instanceof',
      desc: 'instanceof takes a CONSTRUCTOR and checks its .prototype property against the chain; this takes the prototype object itself. They usually agree, but instanceof can be redirected by Symbol.hasInstance and by reassigning a constructor prototype, where isPrototypeOf cannot.',
      wrong: { label: 'Different inputs', code: 'Animal.isPrototypeOf(dog)', output: 'false — Animal is the constructor' },
      fix:   { label: 'Use its prototype', code: 'Animal.prototype.isPrototypeOf(dog)', output: 'true' },
    },
  ],

  when: {
    use: [
      'Testing ancestry against a prototype object you hold directly',
      'Code where no constructor function exists — objects built with Object.create',
      'Avoiding the Symbol.hasInstance indirection that instanceof allows',
    ],
    avoid: [
      'There is a class or constructor → instanceof reads better',
      'You want the immediate prototype only → compare getPrototypeOf',
      'You want to know if a property exists → in, or Object.hasOwn',
      'The receiver may lack the method → borrow it with call',
    ],
  },

  notes: {
    complexity: 'O(d) in the depth of the prototype chain',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-object-isprototypeof',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; only reads the chain',
  },

  related: [
    { name: 'Object.getPrototypeOf',       slug: 'object-getprototypeof',       when: 'The immediate prototype, one link up' },
    { name: 'Object.create',               slug: 'object-create',               when: 'Building the chain this inspects' },
    { name: 'Object.hasOwnProperty',       slug: 'object-hasownproperty',       when: 'The other shadowable inherited method' },
    { name: 'Object.propertyIsEnumerable', slug: 'object-propertyisenumerable', when: 'The third of the inherited introspection trio' },
  ],

  faq: [
    {
      q: 'isPrototypeOf or instanceof?',
      a: 'instanceof whenever a constructor or class exists — it is shorter and more familiar. isPrototypeOf when you have the prototype object but no constructor, which happens with Object.create-based code and with cross-realm objects.',
      code: 'obj instanceof Animal;\nAnimal.prototype.isPrototypeOf(obj);   // the same check',
    },
    {
      q: 'Why did my check return false?',
      a: 'Most often because the arguments are the wrong way round, or because a constructor was passed where its .prototype was meant. The prototype goes on the left of the dot; the object being tested goes inside the parentheses.',
      code: 'Animal.prototype.isPrototypeOf(dog);   // right\nAnimal.isPrototypeOf(dog);             // wrong — that is the function',
    },
    {
      q: 'Does it work across realms?',
      a: 'It compares object identity, so a prototype from another iframe or worker is a different object and the answer is false — the same limitation instanceof has. There is no cross-realm equivalent of Array.isArray for general objects.',
    },
  ],

  history: [
    { version: 'ES3', note: 'isPrototypeOf present from early JavaScript alongside hasOwnProperty and propertyIsEnumerable.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf',
    meta:  'Object.prototype.isPrototypeOf',
  },

  tryInTool: [],
};
