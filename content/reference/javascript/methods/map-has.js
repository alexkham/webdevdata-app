// content/reference/javascript/methods/map-has.js

export const meta = {
  slug:        'map-has',
  name:        'Map.prototype.has',
  signature:   'map.has(key)',
  blurb:       'Does this key exist? The only way to tell "absent" from "holds undefined".',
  category:    'map',
  type:        'map',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Map has key exists contains check undefined in operator hasOwn prototype pollution es2015 javascript',
};

export const method = {
  slug:      'map-has',
  name:      'Map.prototype.has',
  signature: 'map.has(key)',
  returns:   { type: 'boolean', desc: 'True if an entry with that key exists, whatever its value. Unaffected by the prototype chain, because a Map has no inherited entries.' },

  category:    'Map method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The clean existence check that objects never quite managed. There is no prototype to confuse it, no hasOwnProperty to be shadowed, and no __proto__ hazard.',

  cheat: {
    commonCall: 'map.has(key)',
    returns:    'boolean',
    replaces:   'Object.hasOwn, and the in operator',
    watchOut:   'same no-coercion rule — 1 is not "1"',
  },

  parameters: [
    { name: 'key', type: 'any', required: true, default: null, desc: 'The key to test, matched by SameValueZero. NaN is found; 0 and -0 are the same key.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON pairs, e.g. [["a",1]]', input: 'text' },
    { name: 'k',    type: 'string', hint: 'key to test',               input: 'text' },
  ],
  demoTemplate: 'new Map(JSON.parse({json})).has({k})',
  cases: [
    { id: 'yes',      label: 'key present',              values: { json: '[["a",1]]', k: 'a' } },
    { id: 'no',       label: 'key absent',               values: { json: '[["a",1]]', k: 'z' } },
    { id: 'nullval',  label: 'value null → still TRUE',  values: { json: '[["a",null]]', k: 'a' } },
    { id: 'tostring', label: 'toString → FALSE (!)',     values: { json: '[["a",1]]', k: 'toString' } },
    { id: 'proto',    label: '__proto__ → FALSE (!)',    values: { json: '[["a",1]]', k: '__proto__' } },
  ],
  demoExplainer: "A key holding null or undefined still counts as present — existence and value are separate questions here, which is exactly what get cannot tell you. The last two cases are where Map beats an object outright: 'toString' and '__proto__' are not special. On a plain object, 'toString' in obj is true before you set anything, and assigning __proto__ can replace the prototype. A Map has no prototype chain for its entries, so both are simply absent keys.",

  patterns: [
    {
      name: 'Existence without reading',
      desc: 'Works even when values may be undefined.',
      code: 'if (!map.has(id)) return notFound();',
    },
    {
      name: 'A safe dictionary for untrusted keys',
      desc: 'No key name is dangerous.',
      code: 'const counts = new Map();\ncounts.set(userInput, 1);',
    },
    {
      name: 'Get-or-create',
      desc: 'has, then set, then get.',
      code: 'if (!m.has(k)) m.set(k, []);\nm.get(k).push(x);',
    },
  ],

  examples: [
    { title: 'Present',        code: 'new Map([["a", 1]]).has("a")',        returns: 'true' },
    { title: 'Absent',         code: 'new Map().has("a")',                  returns: 'false' },
    { title: 'undefined value',code: 'new Map([["a", undefined]]).has("a")',returns: 'true' },
    { title: 'get cannot tell',code: 'new Map([["a", undefined]]).get("a")',returns: 'undefined' },
    { title: 'No inherited keys', code: 'new Map().has("toString")',        returns: 'false' },
    { title: 'An object has it',  code: '"toString" in {}',                 returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'No coercion, as everywhere in Map',
      desc: 'has(1) and has("1") ask about different keys. Ids that arrive as strings from a URL or JSON will not match a Map built with numbers, and the failure is a silent false rather than an error.',
      wrong: { label: 'Misses', code: 'new Map([[1, "x"]]).has("1")', output: 'false' },
      fix:   { label: 'Normalise', code: 'new Map([[1, "x"]]).has(Number("1"))', output: 'true' },
    },
    {
      name: 'It is not the in operator',
      desc: 'in on a Map instance tests for a PROPERTY of the Map object, not an entry. "a" in map is false even when the entry exists, and "size" in map is true — neither answer is about your data.',
      wrong: { label: 'Wrong question', code: 'const m = new Map([["a", 1]]);\n"a" in m', output: 'false' },
      fix:   { label: 'Use has',        code: 'm.has("a")', output: 'true' },
    },
    {
      name: 'Object keys still need the same reference',
      desc: 'has is subject to the identity rule like get. A structurally identical object is a different key, so has({id: 1}) on a Map keyed by an equal-looking object is false.',
      wrong: { label: 'Different object', code: 'new Map([[{id: 1}, "x"]]).has({id: 1})', output: 'false' },
      fix:   { label: 'Same reference',   code: 'const k = {id: 1};\nnew Map([[k, "x"]]).has(k)', output: 'true' },
    },
    {
      name: 'has-then-get is two lookups',
      desc: 'Correct and readable, and twice the hash work. Only worth avoiding in a genuinely hot loop, where a single get plus an undefined check does the job if you never store undefined.',
      wrong: { label: 'Two lookups', code: 'if (m.has(k)) use(m.get(k));', output: 'works' },
      fix:   { label: 'One',         code: 'const v = m.get(k);\nif (v !== undefined) use(v);', output: 'if undefined is not a value' },
    },
  ],

  when: {
    use: [
      'Testing existence when values may be undefined or null',
      'Dictionaries keyed by untrusted strings, where object keys would be unsafe',
      'The get-or-create accumulator pattern',
      'Replacing Object.hasOwn on data that is really a keyed collection',
    ],
    avoid: [
      'You need the value anyway → get, and check the result',
      'Keys are a fixed set of known strings → an object is simpler',
      'You want to know about inherited properties → that concept does not apply here',
    ],
  },

  notes: {
    complexity: 'O(1) average',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-map-has',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the Map is only read',
  },

  related: [
    { name: 'Map.prototype.get',    slug: 'map-get',    when: 'Reading the value once you know it is there' },
    { name: 'Map.prototype.set',    slug: 'map-set',    when: 'Adding the key you just found missing' },
    { name: 'Map.prototype.delete', slug: 'map-delete', when: 'Its boolean answers the same question' },
    { name: 'Object.hasOwn',        slug: 'object-hasown', when: 'The equivalent for plain objects' },
  ],

  faq: [
    {
      q: 'Why is has better than a plain object check?',
      a: 'Because a Map has no prototype chain for its entries. On an object you must use Object.hasOwn to avoid inherited properties, and a key named __proto__ can replace the prototype instead of storing a value. A Map treats every key as ordinary data.',
      code: 'new Map().has("toString");   // false\n"toString" in {};            // true',
    },
    {
      q: 'has or get?',
      a: 'get when you want the value, which is most of the time — check the result against undefined. has when undefined is a value you legitimately store, or when you only care about presence and do not want to read.',
    },
    {
      q: 'Does has work with NaN?',
      a: 'Yes. Keys are compared with SameValueZero, under which NaN equals itself — so unlike a === comparison, a NaN key can be found again.',
      code: 'new Map([[NaN, 1]]).has(NaN);   // true',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Map added with has alongside get, set and delete.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has',
    meta:  'Map.prototype.has',
  },

};
