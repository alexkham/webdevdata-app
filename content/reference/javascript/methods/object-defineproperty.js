// content/reference/javascript/methods/object-defineproperty.js
//
// defineProperties is consolidated here — it is the plural form with
// identical rules, and its only distinction is taking a map of descriptors.

export const meta = {
  slug:        'object-defineproperty',
  name:        'Object.defineProperty',
  signature:   'Object.defineProperty(object, key, descriptor)',
  blurb:       'Full control over a property — where every flag you omit defaults to FALSE.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Object.defineProperty defineProperties descriptor writable enumerable configurable getter setter hidden javascript',
};

export const method = {
  slug:      'object-defineproperty',
  name:      'Object.defineProperty',
  signature: 'Object.defineProperty(object, key, descriptor)',
  returns:   { type: 'object', desc: 'The same object, modified in place. The property is created or redefined according to the descriptor.' },

  category:    'Object static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The low-level way to add a property, and the one place in the language where omitting an option means "off". A property defined this way is invisible to Object.keys unless you say otherwise.',

  cheat: {
    commonCall: 'Object.defineProperty(o, "a", {value: 1, enumerable: true})',
    returns:    'the same object, mutated',
    replaces:   'plain assignment, when you need control over the flags',
    watchOut:   'writable, enumerable and configurable all default to FALSE',
  },

  parameters: [
    { name: 'object',     type: 'object', required: true, default: null, desc: 'The object to modify. It is mutated and returned.' },
    { name: 'key',        type: 'string | symbol', required: true, default: null, desc: 'The property key.' },
    { name: 'descriptor', type: 'object', required: true, default: null, desc: 'Either a DATA descriptor with value and writable, or an ACCESSOR descriptor with get and set. Never both. enumerable and configurable apply to either, and every omitted flag defaults to false.' },
  ],

  demoParams: [
    { name: 'v', type: 'number', hint: 'the property value',        input: 'number' },
    { name: 'e', type: 'number', hint: 'enumerable: 1 for yes, 0 for no', input: 'number' },
  ],
  demoTemplate: "(o => [Object.keys(o), o.a])(Object.defineProperty({}, 'a', { value: {v}, enumerable: Boolean({e}) }))",
  cases: [
    { id: 'hidden',  label: 'enumerable false → HIDDEN (!)', values: { v: 1, e: 0 } },
    { id: 'visible', label: 'enumerable true → listed',      values: { v: 1, e: 1 } },
    { id: 'zero',    label: 'value 0, hidden',               values: { v: 0, e: 0 } },
    { id: 'zerovis', label: 'value 0, listed',               values: { v: 0, e: 1 } },
  ],
  demoExplainer: "The pair is the object own keys and the value read back. With enumerable false — the DEFAULT if you leave it out — the keys array is empty while o.a still returns the value. The property genuinely exists and is readable; it is simply invisible to Object.keys, Object.entries, JSON.stringify, the spread operator and for...in. That asymmetry is the single most surprising thing about this method, and it is why a property added here can appear to vanish from serialised output while working perfectly in code.",

  patterns: [
    {
      name: 'Add a hidden internal property',
      desc: 'Present in code, absent from JSON.',
      code: 'Object.defineProperty(o, "_cache", {value: new Map(), writable: true});',
    },
    {
      name: 'Define a computed property',
      desc: 'An accessor descriptor instead of a data one.',
      code: 'Object.defineProperty(o, "full", {\n  get() { return `${this.first} ${this.last}`; },\n  enumerable: true,\n});',
    },
    {
      name: 'Copy properties with their flags intact',
      desc: 'What Object.assign cannot do.',
      code: 'Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));',
    },
  ],

  examples: [
    { title: 'Hidden by default',   code: 'const o = {};\nObject.defineProperty(o, "a", {value: 1});\nObject.keys(o)', returns: '[]' },
    { title: 'But readable',        code: 'o.a', returns: '1' },
    { title: 'A literal is visible',code: 'Object.keys({a: 1})', returns: "['a']" },
    { title: 'Read-only by default',code: '"use strict";\nconst o = {};\nObject.defineProperty(o, "a", {value: 1});\no.a = 2', returns: "TypeError: Cannot assign to read only property 'a'" },
    { title: 'And unredefinable',   code: 'Object.defineProperty(o, "a", {value: 2})', returns: 'TypeError: Cannot redefine property: a' },
    { title: 'A getter',            code: 'const o = {};\nObject.defineProperty(o, "a", {get: () => 7});\no.a', returns: '7' },
  ],

  pitfalls: [
    {
      name: 'Every flag defaults to false',
      desc: 'Unlike a property created by assignment, which is writable, enumerable and configurable, a defined property is none of those unless stated. The property then quietly disappears from JSON.stringify and from spread copies, which is usually discovered much later.',
      wrong: { label: 'Vanishes from JSON', code: 'const o = {};\nObject.defineProperty(o, "a", {value: 1});\nJSON.stringify(o)', output: "'{}'" },
      fix:   { label: 'Opt in explicitly',  code: 'Object.defineProperty(o, "a", {value: 1, enumerable: true, writable: true, configurable: true})', output: "'{\"a\":1}'" },
    },
    {
      name: 'configurable: false is permanent',
      desc: 'A non-configurable property cannot be redefined or deleted, ever, for the life of that object. Getting the descriptor wrong the first time means rebuilding the object — there is no way to undo it.',
      wrong: { label: 'Locked in', code: 'Object.defineProperty(o, "a", {value: 1});\nObject.defineProperty(o, "a", {value: 2})', output: 'TypeError: Cannot redefine property: a' },
      fix:   { label: 'Allow changes', code: 'Object.defineProperty(o, "a", {value: 1, configurable: true})', output: 'redefinable' },
    },
    {
      name: 'You cannot mix value and get',
      desc: 'A descriptor is either a data descriptor or an accessor descriptor. Supplying value alongside get — or writable alongside set — is a TypeError, which is easy to hit when building a descriptor programmatically.',
      wrong: { label: 'Both kinds', code: 'Object.defineProperty({}, "a", {value: 1, get: () => 2})', output: 'TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute' },
      fix:   { label: 'Pick one',   code: 'Object.defineProperty({}, "a", {get: () => 2})', output: 'an accessor' },
    },
    {
      name: 'It defines rather than assigns, which is sometimes the point',
      desc: 'Assignment runs an inherited setter; defineProperty does not. That makes it the correct tool for overriding a property whose prototype defines a setter — and a surprise if you expected the setter to run.',
      wrong: { label: 'Setter skipped', code: 'const p = {set a(v) { console.log("set"); }};\nconst o = Object.create(p);\nObject.defineProperty(o, "a", {value: 1})', output: 'nothing logged' },
      fix:   { label: 'Assign to trigger it', code: 'o.a = 1', output: '"set" logged' },
    },
  ],

  when: {
    use: [
      'Properties that should not appear in JSON or in Object.keys',
      'Read-only or non-deletable properties',
      'Getters and setters added after the object exists',
      'Copying properties with their descriptors intact',
    ],
    avoid: [
      'An ordinary property → plain assignment or an object literal',
      'Several properties at once → Object.defineProperties',
      'You want everything locked → Object.freeze is simpler',
      'Genuinely private state → a # private field in a class',
    ],
  },

  notes: {
    complexity: 'O(1) per property',
    return:     'The same object, mutated',
    cpython:    'V8: Builtins-object-defineproperty',
    memory:     'No allocation beyond the property slot',
    threadSafe: 'Single-threaded; a non-configurable definition is irreversible',
  },

  related: [
    { name: 'Object.getOwnPropertyDescriptor', slug: 'object-getownpropertydescriptor', when: 'Reading back what you defined' },
    { name: 'Object.getOwnPropertyNames',      slug: 'object-getownpropertynames',      when: 'Listing properties Object.keys hides' },
    { name: 'Object.create',                   slug: 'object-create',                   when: 'Defining descriptors at construction time' },
    { name: 'Object.freeze',                   slug: 'object-freeze',                   when: 'Locking every property at once' },
  ],

  faq: [
    {
      q: 'Why does my property not show up in JSON.stringify?',
      a: 'Because enumerable defaults to false. JSON.stringify, Object.keys, Object.entries, spread and for...in all skip non-enumerable properties. Add enumerable: true if the property is part of the object visible data.',
      code: 'Object.defineProperty(o, "a", {value: 1, enumerable: true});',
    },
    {
      q: 'Why can I not change the property afterwards?',
      a: 'Two separate defaults are biting. writable: false blocks assignment, and configurable: false blocks redefining or deleting. Both default to false, and configurable: false cannot be reversed.',
      code: 'Object.defineProperty(o, "a", {value: 1, writable: true, configurable: true});',
    },
    {
      q: 'defineProperty or defineProperties?',
      a: 'The plural form takes a map of key-to-descriptor and applies them all, following identical rules. Use it when you have several, and especially with getOwnPropertyDescriptors to copy an object faithfully.',
      code: 'Object.defineProperties(o, {a: {value: 1}, b: {value: 2}});',
    },
    {
      q: 'Is this how I make a property private?',
      a: 'No. Non-enumerable is not private — the property is still readable by anyone who knows its name, and getOwnPropertyNames lists it. For genuine privacy use a #field in a class, or a closure.',
      code: 'class C { #secret = 1; }',
    },
  ],

  history: [
    { version: 'ES5',    note: 'defineProperty, defineProperties and the descriptor model added, formalising property attributes.' },
    { version: 'ES2015', note: 'Symbols became valid keys, and get/set shorthand in class bodies covered most accessor uses.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty',
    meta:  'Object.defineProperty',
  },

  tryInTool: [],
};
