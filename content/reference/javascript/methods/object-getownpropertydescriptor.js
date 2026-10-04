// content/reference/javascript/methods/object-getownpropertydescriptor.js
//
// getOwnPropertyDescriptors (plural) is consolidated here: same information
// for every property at once, and the half of the pair that matters most in
// practice because of the assign/copy idiom.

export const meta = {
  slug:        'object-getownpropertydescriptor',
  name:        'Object.getOwnPropertyDescriptor',
  signature:   'Object.getOwnPropertyDescriptor(object, key)',
  blurb:       'See a property real flags — and the only honest way to copy getters.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Object.getOwnPropertyDescriptor getOwnPropertyDescriptors writable enumerable configurable getter copy clone javascript',
};

export const method = {
  slug:      'object-getownpropertydescriptor',
  name:      'Object.getOwnPropertyDescriptor',
  signature: 'Object.getOwnPropertyDescriptor(object, key)',
  returns:   { type: 'object | undefined', desc: 'A descriptor object — value and writable for a data property, get and set for an accessor, plus enumerable and configurable. undefined if the property is not an OWN property.' },

  category:    'Object static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The inspection half of the descriptor system. Its plural form is the missing piece for copying an object faithfully, because Object.assign flattens getters into values.',

  cheat: {
    commonCall: 'Object.getOwnPropertyDescriptor(o, "a")',
    returns:    'a descriptor object, or undefined',
    replaces:   'guessing what flags a property has',
    watchOut:   'undefined for INHERITED properties, not just missing ones',
  },

  parameters: [
    { name: 'object', type: 'object', required: true, default: null, desc: 'The object to inspect. Primitives are coerced; null and undefined throw.' },
    { name: 'key',    type: 'string | symbol', required: true, default: null, desc: 'The property key. Only own properties are considered — the prototype chain is not searched.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object', input: 'text' },
    { name: 'key',  type: 'string', hint: 'property name', input: 'text' },
  ],
  demoTemplate: 'Object.getOwnPropertyDescriptor(JSON.parse({json}), {key})',
  cases: [
    { id: 'present',  label: 'an own property',      values: { json: '{"a":1}', key: 'a' } },
    { id: 'missing',  label: 'absent → undefined',   values: { json: '{"a":1}', key: 'b' } },
    { id: 'inherited',label: 'toString → undefined (!)', values: { json: '{"a":1}', key: 'toString' } },
    { id: 'array',    label: 'an array index',       values: { json: '[10,20]', key: '0' } },
    { id: 'length',   label: 'array length flags (!)',values: { json: '[10,20]', key: 'length' } },
  ],
  demoExplainer: "A property created by a literal or by JSON parsing comes back with all three flags true — writable, enumerable, configurable — which is what plain assignment always produces. The third case shows that inherited properties give undefined: toString exists on the prototype, not on this object, so there is no OWN descriptor to report. The last case is worth looking at: an array length is writable but NOT enumerable and NOT configurable, which is exactly why it never appears in Object.keys and cannot be deleted.",

  patterns: [
    {
      name: 'Copy an object faithfully',
      desc: 'The idiom Object.assign cannot manage.',
      code: 'Object.create(\n  Object.getPrototypeOf(src),\n  Object.getOwnPropertyDescriptors(src)\n);',
    },
    {
      name: 'Check whether a property is writable',
      desc: 'Before attempting an assignment that might throw.',
      code: 'const d = Object.getOwnPropertyDescriptor(o, k);\nif (d?.writable) o[k] = v;',
    },
    {
      name: 'Detect a getter',
      desc: 'An accessor descriptor has get instead of value.',
      code: 'const isAccessor = "get" in (Object.getOwnPropertyDescriptor(o, k) ?? {});',
    },
  ],

  examples: [
    { title: 'A literal property', code: 'Object.getOwnPropertyDescriptor({a: 1}, "a")', returns: '{value: 1, writable: true, enumerable: true, configurable: true}' },
    { title: 'Missing',            code: 'Object.getOwnPropertyDescriptor({}, "x")',     returns: 'undefined' },
    { title: 'Inherited too',      code: 'Object.getOwnPropertyDescriptor({}, "toString")', returns: 'undefined' },
    { title: 'A getter',           code: 'Object.getOwnPropertyDescriptor({get a() { return 1; }}, "a")', returns: '{get: f, set: undefined, enumerable: true, configurable: true}' },
    { title: 'Array length',       code: 'Object.getOwnPropertyDescriptor([1], "length")', returns: '{value: 1, writable: true, enumerable: false, configurable: false}' },
    { title: 'All at once',        code: 'Object.keys(Object.getOwnPropertyDescriptors({a: 1, b: 2}))', returns: "['a', 'b']" },
  ],

  pitfalls: [
    {
      name: 'undefined means "not an own property", not "no such property"',
      desc: 'Inherited properties return undefined exactly as missing ones do. A method on a class prototype, or anything from Object.prototype, has no own descriptor on the instance — so this cannot be used as an existence check.',
      wrong: { label: 'Looks absent', code: 'Object.getOwnPropertyDescriptor({}, "toString")', output: 'undefined' },
      fix:   { label: 'Ask the right question', code: '"toString" in {}', output: 'true' },
    },
    {
      name: 'Object.assign loses getters; this is the fix',
      desc: 'assign READS each source property, so a getter is invoked once and its result stored as a static value. Copying descriptors instead preserves the getter as a getter — the difference between a live computed property and a stale snapshot.',
      wrong: { label: 'Frozen snapshot', code: 'const s = {get now() { return Date.now(); }};\nObject.assign({}, s).now', output: 'a fixed number' },
      fix:   { label: 'Descriptors survive', code: 'Object.defineProperties({}, Object.getOwnPropertyDescriptors(s))', output: 'still a getter' },
    },
    {
      name: 'The returned descriptor is a copy',
      desc: 'Mutating it changes nothing on the original object. To apply a modified descriptor you have to pass it back through defineProperty — which will fail if the property was non-configurable.',
      wrong: { label: 'No effect', code: 'const d = Object.getOwnPropertyDescriptor(o, "a");\nd.value = 99;\no.a', output: 'unchanged' },
      fix:   { label: 'Write it back', code: 'Object.defineProperty(o, "a", d)', output: 'applied' },
    },
    {
      name: 'It does not see symbol keys unless you ask for them',
      desc: 'The singular form takes any key including a symbol, but if you are enumerating, remember getOwnPropertyNames omits symbols. getOwnPropertyDescriptors includes them, which is why it is the correct basis for a faithful copy.',
      wrong: { label: 'Symbols missed', code: 'Object.getOwnPropertyNames({[Symbol("s")]: 1})', output: '[]' },
      fix:   { label: 'Descriptors include them', code: 'Object.getOwnPropertySymbols({[Symbol("s")]: 1}).length', output: '1' },
    },
  ],

  when: {
    use: [
      'Copying an object with getters, setters and flags preserved',
      'Inspecting why a property is invisible or read-only',
      'Writing generic code that must respect property attributes',
      'Debugging an object that does not behave as its literal suggests',
    ],
    avoid: [
      'You only want the value → read the property',
      'You only want to know it exists → Object.hasOwn or in',
      'A shallow merge is enough → Object.assign or spread',
      'You want to list keys → Object.keys or getOwnPropertyNames',
    ],
  },

  notes: {
    complexity: 'O(1) for one property; O(n) for the plural form',
    return:     'A new descriptor object each call — mutating it does nothing',
    cpython:    'V8: Builtins-object-getownpropertydescriptor',
    memory:     'Allocates one descriptor object per property',
    threadSafe: 'Single-threaded; the object is only read',
  },

  related: [
    { name: 'Object.defineProperty',      slug: 'object-defineproperty',      when: 'Applying a descriptor rather than reading one' },
    { name: 'Object.getOwnPropertyNames', slug: 'object-getownpropertynames', when: 'Listing the keys to inspect' },
    { name: 'Object.create',              slug: 'object-create',              when: 'Building a copy from the descriptors' },
    { name: 'Object.assign',              slug: 'object-assign',              when: 'The shallow copy that loses this information' },
  ],

  faq: [
    {
      q: 'How do I copy an object exactly?',
      a: 'Combine the prototype with every descriptor. This preserves getters, setters, non-enumerable properties and symbol keys — all of which Object.assign and spread silently discard or flatten.',
      code: 'const copy = Object.create(\n  Object.getPrototypeOf(src),\n  Object.getOwnPropertyDescriptors(src)\n);',
    },
    {
      q: 'Why does it return undefined for a property I can clearly read?',
      a: 'Because that property is inherited. This method looks only at own properties — the prototype chain is not searched. Use the in operator if inherited properties should count.',
    },
    {
      q: 'What are the four flags?',
      a: 'value holds the data (or get and set hold the accessor functions); writable allows assignment; enumerable makes it visible to Object.keys, spread and JSON; configurable allows the property to be redefined or deleted. Assignment creates all three booleans as true; defineProperty defaults them to false.',
    },
  ],

  history: [
    { version: 'ES5',    note: 'getOwnPropertyDescriptor added with the descriptor model.' },
    { version: 'ES2017', note: 'getOwnPropertyDescriptors added specifically to make faithful object copying possible.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor',
    meta:  'Object.getOwnPropertyDescriptor',
  },

};
