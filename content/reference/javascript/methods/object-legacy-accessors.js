// content/reference/javascript/methods/object-legacy-accessors.js
//
// One combined page for the four Annex B accessor methods, in the same
// spirit as string-html-methods. They share an origin, a deprecation and a
// single modern replacement. The live demo uses __defineGetter__.

export const meta = {
  slug:        'object-legacy-accessors',
  name:        'Object legacy accessors (__defineGetter__ …)',
  signature:   '__defineGetter__, __defineSetter__, __lookupGetter__, __lookupSetter__',
  blurb:       'Four deprecated methods that predate defineProperty — and unlike it, they create ENUMERABLE properties.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'Annex B (legacy)',
  searchTerms: '__defineGetter__ __defineSetter__ __lookupGetter__ __lookupSetter__ legacy annex b deprecated accessor getter setter javascript',
};

export const method = {
  slug:      'object-legacy-accessors',
  name:      'Object legacy accessors (__defineGetter__ …)',
  signature: '__defineGetter__, __defineSetter__, __lookupGetter__, __lookupSetter__',
  returns:   { type: 'varies', desc: 'The define pair return undefined and modify the object. The lookup pair return the accessor function, or undefined if there is none.' },

  category:    'Object methods (Annex B)',
  version:     'Annex B (legacy)',
  hasLiveDemo: true,

  subtitle: 'Netscape shipped these before the language had a property-descriptor model. They still work everywhere, they are normatively optional, and defineProperty does all four jobs properly.',

  cheat: {
    commonCall: 'Object.defineProperty(o, k, {get})',
    returns:    'undefined, or the accessor function',
    replaces:   'nothing; defineProperty replaces THEM',
    watchOut:   'they create enumerable properties, unlike defineProperty',
  },

  parameters: [
    { name: 'key',      type: 'string | symbol', required: true, default: null, desc: 'The property key. All four take this as their first argument.' },
    { name: 'accessor', type: 'Function', required: false, default: 'none', desc: 'Only the define pair take a second argument — the getter or setter function. A non-callable value is a TypeError.' },
  ],

  demoParams: [
    { name: 'v', type: 'number', hint: 'the value the getter returns', input: 'number' },
  ],
  demoTemplate: "(o => { o.__defineGetter__('a', () => {v}); return [Object.keys(o), o.a]; })({})",
  cases: [
    { id: 'seven', label: 'getter returns 7',  values: { v: 7 } },
    { id: 'one',   label: 'getter returns 1',  values: { v: 1 } },
    { id: 'zero',  label: 'getter returns 0',  values: { v: 0 } },
  ],
  demoExplainer: "The pair is the object own keys and the value read back. Note that the key IS listed — these legacy methods create an enumerable property, which is the one behavioural difference from Object.defineProperty, whose enumerable flag defaults to false. Compare with the defineProperty demo, where the equivalent call produces an empty key list. That difference is the only practical reason to know these exist beyond recognising them in old code.",

  patterns: [
    {
      name: 'Use defineProperty',
      desc: 'The full descriptor model, explicitly.',
      code: 'Object.defineProperty(o, "a", {\n  get: () => 7,\n  enumerable: true,\n  configurable: true,\n});',
    },
    {
      name: 'Or a literal getter',
      desc: 'Clearest when the object is being created.',
      code: 'const o = { get a() { return 7; } };',
    },
    {
      name: 'Look one up',
      desc: 'The descriptor carries the getter.',
      code: 'Object.getOwnPropertyDescriptor(o, "a")?.get;',
    },
  ],

  examples: [
    { title: 'Defines a getter',    code: 'const o = {};\no.__defineGetter__("a", () => 7);\no.a', returns: '7' },
    { title: 'And it is enumerable',code: 'Object.keys(o)', returns: "['a']" },
    { title: 'defineProperty is not',code: 'const p = {};\nObject.defineProperty(p, "a", {get: () => 7});\nObject.keys(p)', returns: '[]' },
    { title: 'A setter',            code: 'const o = {};\nlet seen;\no.__defineSetter__("a", v => { seen = v; });\no.a = 5;\nseen', returns: '5' },
    { title: 'Looking one up',      code: 'typeof ({get a() { return 1; }}).__lookupGetter__("a")', returns: "'function'" },
    { title: 'None defined',        code: '({}).__lookupSetter__("a")', returns: 'undefined' },
  ],

  pitfalls: [
    {
      name: 'They are Annex B, not the core language',
      desc: 'Annex B is normatively optional — required only of web browsers. A conforming non-browser runtime may omit them entirely, so code using them is not portable even though every engine happens to ship them today.',
      wrong: { label: 'May be absent', code: 'o.__defineGetter__("a", f)', output: 'TypeError in a conforming non-browser host' },
      fix:   { label: 'Standard form', code: 'Object.defineProperty(o, "a", {get: f})', output: 'portable' },
    },
    {
      name: 'They differ from defineProperty on enumerability',
      desc: 'Not a bug in either — a genuine behavioural difference. These create enumerable, configurable properties; defineProperty defaults both to false. Porting old code across without specifying the flags silently changes what appears in Object.keys and JSON.',
      wrong: { label: 'Now hidden', code: 'Object.defineProperty(o, "a", {get: f})', output: 'absent from Object.keys' },
      fix:   { label: 'Match the old behaviour', code: 'Object.defineProperty(o, "a", {get: f, enumerable: true, configurable: true})', output: 'listed again' },
    },
    {
      name: 'They are inherited methods, so they can be shadowed',
      desc: 'The same weakness as hasOwnProperty. An object created with Object.create(null) does not have them, and untrusted data can replace them.',
      wrong: { label: 'Missing', code: 'Object.create(null).__defineGetter__("a", f)', output: 'TypeError: ...__defineGetter__ is not a function' },
      fix:   { label: 'Static form works', code: 'Object.defineProperty(Object.create(null), "a", {get: f})', output: 'fine' },
    },
    {
      name: 'The lookup pair search the prototype chain',
      desc: 'Unlike getOwnPropertyDescriptor, which is own-only, __lookupGetter__ walks up the chain to find an inherited accessor. That is occasionally useful and frequently surprising when you expected an own-property answer.',
      wrong: { label: 'Finds inherited', code: 'const p = {get a() { return 1; }};\nObject.create(p).__lookupGetter__("a")', output: 'the function' },
      fix:   { label: 'Own only',        code: 'Object.getOwnPropertyDescriptor(Object.create(p), "a")', output: 'undefined' },
    },
  ],

  when: {
    use: [
      'Never in new code',
      'Recognising them while reading something written before 2009',
    ],
    avoid: [
      'Defining an accessor → Object.defineProperty, or a get/set literal',
      'Reading an accessor → Object.getOwnPropertyDescriptor',
      'Portable code → Annex B is optional outside browsers',
      'Null-prototype objects → the methods are not there',
    ],
  },

  notes: {
    complexity: 'O(1) to define; O(d) for the lookup pair, which walk the chain',
    return:     'undefined from the define pair; the accessor function or undefined from the lookup pair',
    cpython:    'V8: Builtins-object — the Annex B section',
    memory:     'No allocation beyond the property slot',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Object.defineProperty',           slug: 'object-defineproperty',           when: 'The standard replacement for all four' },
    { name: 'Object.getOwnPropertyDescriptor', slug: 'object-getownpropertydescriptor', when: 'The standard way to read an accessor back' },
    { name: 'Object.create',                   slug: 'object-create',                   when: 'Objects that do not have these methods at all' },
    { name: 'Object.hasOwnProperty',           slug: 'object-hasownproperty',           when: 'Another inherited method with the same weakness' },
  ],

  faq: [
    {
      q: 'What exactly are the four?',
      a: '__defineGetter__ and __defineSetter__ attach an accessor to a property; __lookupGetter__ and __lookupSetter__ retrieve one. Object.defineProperty covers the first two and getOwnPropertyDescriptor covers the last two.',
      code: 'o.__defineGetter__("a", () => 1);\nObject.defineProperty(o, "a", {get: () => 1});   // the same thing',
    },
    {
      q: 'Will they be removed?',
      a: 'Almost certainly not. Annex B exists because too much of the web depends on these features to drop them. They will stay deprecated and working indefinitely.',
    },
    {
      q: 'Is there any behaviour defineProperty cannot reproduce?',
      a: 'No. The only difference is defaults — the legacy methods produce enumerable, configurable properties, which defineProperty will do too if you say so. Pass enumerable: true and configurable: true and the results are identical.',
    },
  ],

  history: [
    { version: 'Netscape 4', note: 'Added in the late 1990s, years before the language had any notion of property descriptors.' },
    { version: 'ES5',        note: 'Object.defineProperty introduced the descriptor model and made them redundant.' },
    { version: 'ES2015',     note: 'Formally documented in Annex B as normatively optional legacy features.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__defineGetter__',
    meta:  'Object.prototype.__defineGetter__',
  },

};
