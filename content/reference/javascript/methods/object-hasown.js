// content/reference/javascript/methods/object-hasown.js

export const meta = {
  slug:        'object-hasown',
  name:        'Object.hasOwn',
  signature:   'Object.hasOwn(object, key)',
  blurb:       'The safe hasOwnProperty — it works on objects that have no prototype at all.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES2022',
  searchTerms: 'Object.hasOwn hasOwnProperty own property exists check in operator null prototype shadowed es2022 javascript',
};

export const method = {
  slug:      'object-hasown',
  name:      'Object.hasOwn',
  signature: 'Object.hasOwn(object, key)',
  returns:   { type: 'boolean', desc: 'True if the key is an OWN property of the object — inherited properties do not count. Works even when the object has a null prototype or a shadowed hasOwnProperty.' },

  category:    'Object static method',
  version:     'ES2022',
  hasLiveDemo: true,

  subtitle: 'A static replacement for a method call that could always be broken by the object being tested. That is the whole reason it exists.',

  cheat: {
    commonCall: 'Object.hasOwn(obj, key)',
    returns:    'boolean',
    replaces:   'Object.prototype.hasOwnProperty.call(obj, key)',
    watchOut:   'own properties ONLY — inherited ones return false',
  },

  parameters: [
    { name: 'object', type: 'object', required: true, default: null, desc: 'The object to inspect. null and undefined throw TypeError.' },
    { name: 'key',    type: 'string | symbol', required: true, default: null, desc: 'The property key. Non-symbol values are coerced to strings, so 1 and "1" are the same key.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object', input: 'text' },
    { name: 'key',  type: 'string', hint: 'property name',  input: 'text' },
  ],
  demoTemplate: 'Object.hasOwn(JSON.parse({json}), {key})',
  cases: [
    { id: 'present',  label: 'property present',      values: { json: '{"a":1}', key: 'a' } },
    { id: 'absent',   label: 'property absent',       values: { json: '{"a":1}', key: 'b' } },
    { id: 'inherited',label: 'toString → FALSE (!)',  values: { json: '{"a":1}', key: 'toString' } },
    { id: 'undef',    label: 'value is null',         values: { json: '{"a":null}', key: 'a' } },
    { id: 'numeric',  label: 'numeric key as string', values: { json: '{"1":"x"}', key: '1' } },
  ],
  demoExplainer: "The third case is the point of the method: toString exists on every object via the prototype chain, and hasOwn reports FALSE because it is not an OWN property. The `in` operator would say true. The fourth case shows why this beats a truthiness check — the property exists but its value is null, so obj.a would be falsy while hasOwn correctly reports that the key is there. That distinction matters whenever null or 0 or empty string are legitimate values.",

  patterns: [
    {
      name: 'Check before reading',
      desc: 'Distinguishes "absent" from "present but falsy".',
      code: 'if (Object.hasOwn(config, "retries")) use(config.retries);',
    },
    {
      name: 'Safe iteration over untrusted data',
      desc: 'Works on parsed JSON with any keys at all.',
      code: 'for (const k in data) {\n  if (!Object.hasOwn(data, k)) continue;\n}',
    },
    {
      name: 'Include inherited properties deliberately',
      desc: 'The in operator walks the chain.',
      code: 'if ("toString" in obj) { }',
    },
  ],

  examples: [
    { title: 'Own property',       code: 'Object.hasOwn({a: 1}, "a")',   returns: 'true' },
    { title: 'Absent',             code: 'Object.hasOwn({a: 1}, "b")',   returns: 'false' },
    { title: 'Inherited is false', code: 'Object.hasOwn({}, "toString")',returns: 'false' },
    { title: 'in says true',       code: '"toString" in {}',             returns: 'true' },
    { title: 'Null-prototype object', code: 'Object.hasOwn(Object.create(null), "a")', returns: 'false' },
    { title: 'The method would throw', code: 'Object.create(null).hasOwnProperty("a")', returns: 'TypeError: ...hasOwnProperty is not a function' },
  ],

  pitfalls: [
    {
      name: 'hasOwnProperty is not safe on arbitrary objects',
      desc: 'This is why hasOwn was added. An object created with Object.create(null) has no prototype, so it has no hasOwnProperty method and calling one throws. Parsed JSON and dictionary objects are routinely built that way.',
      wrong: { label: 'Throws', code: 'Object.create(null).hasOwnProperty("a")', output: 'TypeError: ...hasOwnProperty is not a function' },
      fix:   { label: 'Static form', code: 'Object.hasOwn(Object.create(null), "a")', output: 'false' },
    },
    {
      name: 'A property named hasOwnProperty shadows the method',
      desc: 'Untrusted data — a parsed JSON payload, a query string — can contain a key called hasOwnProperty, replacing the method with a value. The call then fails or, worse, returns whatever the attacker chose.',
      wrong: { label: 'Shadowed', code: 'const o = JSON.parse(\'{"hasOwnProperty": 1}\');\no.hasOwnProperty("x")', output: 'TypeError: o.hasOwnProperty is not a function' },
      fix:   { label: 'Cannot be shadowed', code: 'Object.hasOwn(o, "x")', output: 'false' },
    },
    {
      name: 'It is not the in operator',
      desc: 'in walks the whole prototype chain; hasOwn stops at the object itself. For a class instance, a method defined on the class is found by in and not by hasOwn — which is usually what you want, but not always.',
      wrong: { label: 'Misses inherited', code: 'class A { m() {} }\nObject.hasOwn(new A(), "m")', output: 'false' },
      fix:   { label: 'in finds it',      code: '"m" in new A()', output: 'true' },
    },
    {
      name: 'ES2022 — check your runtime',
      desc: 'Node 16.9+ and 2021-era browsers. The safe pre-2022 form is the borrowed call, which is verbose enough that most codebases wrapped it in a helper.',
      wrong: { label: 'Missing', code: 'Object.hasOwn(o, k)', output: 'TypeError: Object.hasOwn is not a function' },
      fix:   { label: 'Borrow the method', code: 'Object.prototype.hasOwnProperty.call(o, k)', output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'Testing whether a key exists, including when its value is falsy',
      'Any object from untrusted input — parsed JSON, query strings',
      'Objects created with Object.create(null)',
      'Guarding a for...in loop',
    ],
    avoid: [
      'You want inherited properties too → the in operator',
      'You only care whether the value is set → a truthiness or != null check',
      'You are listing every key → Object.keys',
      'Targeting runtimes older than 2021 → the borrowed-call form',
    ],
  },

  notes: {
    complexity: 'O(1) — one own-property lookup, no chain walk',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-object-hasown',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the object is only read',
  },

  related: [
    { name: 'Object.keys',        slug: 'object-keys',        when: 'Listing every own key instead of testing one' },
    { name: 'Object.entries',     slug: 'object-entries',     when: 'Iterating own properties with values' },
    { name: 'Object.freeze',      slug: 'object-freeze',      when: 'Preventing the key set from changing' },
    { name: 'Object.fromEntries', slug: 'object-fromentries', when: 'Building objects from untrusted pairs safely' },
  ],

  faq: [
    {
      q: 'hasOwn or the in operator?',
      a: 'hasOwn for own properties, which is what data objects usually mean. in when inherited properties should count — checking for a method on a class instance, or feature-detecting on a DOM node.',
      code: 'Object.hasOwn(o, "toString");   // false\n"toString" in o;                // true',
    },
    {
      q: 'Why not just obj.key !== undefined?',
      a: 'Because it cannot distinguish a missing property from one explicitly set to undefined, and it walks the prototype chain. For configuration objects where "explicitly set to undefined" is meaningful, only hasOwn gives the right answer.',
      code: 'const o = {a: undefined};\no.a !== undefined;        // false\nObject.hasOwn(o, "a");    // true',
    },
    {
      q: 'What was wrong with hasOwnProperty?',
      a: 'Nothing, when you could rely on it being there. The problem is that it lives on Object.prototype, so an object with a null prototype does not have it and an object with a property of that name replaces it. The static form cannot be interfered with by the object being tested.',
      code: 'Object.prototype.hasOwnProperty.call(o, k);   // the old safe form',
    },
  ],

  history: [
    { version: 'ES5',    note: 'Object.create(null) made prototype-less objects easy to build, and hasOwnProperty unsafe on them.' },
    { version: 'ES2022', note: 'Object.hasOwn added as the static, un-shadowable replacement.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn',
    meta:  'Object.hasOwn',
  },

  tryInTool: [],
};
