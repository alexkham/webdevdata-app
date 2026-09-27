// content/reference/javascript/methods/map-get.js

export const meta = {
  slug:        'map-get',
  name:        'Map.prototype.get',
  signature:   'map.get(key)',
  blurb:       'Read a value, or undefined — which cannot be told from a stored undefined.',
  category:    'map',
  type:        'map',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Map get read value key undefined missing has default lookup es2015 javascript',
};

export const method = {
  slug:      'map-get',
  name:      'Map.prototype.get',
  signature: 'map.get(key)',
  returns:   { type: 'any', desc: 'The stored value, or undefined when the key is absent. Those two cases are indistinguishable if you ever store undefined.' },

  category:    'Map method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Straightforward reading, with one gap: undefined means both "not there" and "there, holding undefined". has() is how you tell them apart.',

  cheat: {
    commonCall: 'map.get(key)',
    returns:    'the value, or undefined',
    replaces:   'obj[key], for non-string keys',
    watchOut:   'undefined is ambiguous — use has() if it matters',
  },

  parameters: [
    { name: 'key', type: 'any', required: true, default: null, desc: 'The key to look up, matched by SameValueZero. No coercion happens — 1 and "1" are different keys.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON pairs, e.g. [["a",1]]', input: 'text' },
    { name: 'k',    type: 'string', hint: 'key to look up',            input: 'text' },
  ],
  demoTemplate: 'new Map(JSON.parse({json})).get({k})',
  cases: [
    { id: 'found',   label: 'key present',             values: { json: '[["a",1],["b",2]]', k: 'a' } },
    { id: 'missing', label: 'key absent → undefined',  values: { json: '[["a",1]]', k: 'z' } },
    { id: 'nullval', label: 'value is null',           values: { json: '[["a",null]]', k: 'a' } },
    { id: 'numkey',  label: 'numeric key as text (!)', values: { json: '[[1,"x"]]', k: '1' } },
    { id: 'empty',   label: 'empty Map',               values: { json: '[]', k: 'a' } },
  ],
  demoExplainer: "Present keys return their value; absent keys return undefined. The third case shows null is returned as null — only a genuinely missing key gives undefined. The fourth is the one to watch: the Map was built with the NUMBER 1 as its key, and looking up the STRING '1' misses entirely. A plain object would have found it, because object keys are always strings. Map does no coercion, which is a feature and a trap in equal measure.",

  patterns: [
    {
      name: 'Default for a missing key',
      desc: 'Nullish coalescing handles the undefined.',
      code: 'const count = map.get(key) ?? 0;',
    },
    {
      name: 'Get-or-create',
      desc: 'The standard accumulator idiom.',
      code: 'if (!map.has(key)) map.set(key, []);\nmap.get(key).push(item);',
    },
    {
      name: 'Distinguish absent from undefined',
      desc: 'Only has() can tell you.',
      code: 'const present = map.has(key);\nconst value = map.get(key);',
    },
  ],

  examples: [
    { title: 'Present',          code: 'new Map([["a", 1]]).get("a")', returns: '1' },
    { title: 'Absent',           code: 'new Map().get("a")',           returns: 'undefined' },
    { title: 'Stored undefined', code: 'new Map([["a", undefined]]).get("a")', returns: 'undefined' },
    { title: 'has disambiguates',code: 'new Map([["a", undefined]]).has("a")',  returns: 'true' },
    { title: 'No coercion',      code: 'new Map([[1, "x"]]).get("1")', returns: 'undefined' },
    { title: 'Objects by reference', code: 'const k = {};\nnew Map([[k, 1]]).get(k)', returns: '1' },
  ],

  pitfalls: [
    {
      name: 'undefined is ambiguous',
      desc: 'A missing key and a key holding undefined both return undefined. If your values can legitimately be undefined — a cache of results where "computed, but no answer" is meaningful — get alone cannot tell you whether work has been done.',
      wrong: { label: 'Indistinguishable', code: 'new Map([["a", undefined]]).get("a")', output: 'undefined' },
      fix:   { label: 'Ask has()',         code: 'new Map([["a", undefined]]).has("a")', output: 'true' },
    },
    {
      name: 'No key coercion, unlike an object',
      desc: 'obj[1] and obj["1"] are the same property; map.get(1) and map.get("1") are not. Data whose keys arrive as strings from JSON will not match a Map built with numbers, and nothing warns you.',
      wrong: { label: 'Misses', code: 'new Map([[1, "x"]]).get("1")', output: 'undefined' },
      fix:   { label: 'Normalise the key', code: 'new Map([[1, "x"]]).get(Number("1"))', output: "'x'" },
    },
    {
      name: 'Double lookup in the get-or-create pattern',
      desc: 'has-then-get-then-set walks the hash three times. Fine for most code; in a hot loop, get once and check the result instead.',
      wrong: { label: 'Three lookups', code: 'if (!m.has(k)) m.set(k, []);\nm.get(k).push(x);', output: 'works' },
      fix:   { label: 'Two',           code: 'let a = m.get(k);\nif (!a) m.set(k, a = []);\na.push(x);', output: 'same result' },
    },
    {
      name: 'It is a method, not bracket access',
      desc: 'map["a"] does not read an entry — it looks for a property named "a" on the Map object itself, which does not exist. The entry is invisible to bracket syntax, and to spread and JSON.',
      wrong: { label: 'Property access', code: 'const m = new Map([["a", 1]]);\nm["a"]', output: 'undefined' },
      fix:   { label: 'Use get',        code: 'm.get("a")', output: '1' },
    },
  ],

  when: {
    use: [
      'Reading a value by a key of any type',
      'Lookups where keys must not be coerced to strings',
      'Caches and indexes keyed by objects or numbers',
    ],
    avoid: [
      'You only need to know whether the key exists → has',
      'Values may be undefined and that matters → pair with has',
      'The data is a fixed record → an object, with property access',
      'You want a default without a check → Object.groupBy, or ?? at the call site',
    ],
  },

  notes: {
    complexity: 'O(1) average',
    return:     'The stored value by reference; nothing is copied',
    cpython:    'V8: Builtins-map-get',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the Map is only read',
  },

  related: [
    { name: 'Map.prototype.set',       slug: 'map-set',       when: 'Storing the value first' },
    { name: 'Map.prototype.has',       slug: 'map-has',       when: 'Distinguishing absent from undefined' },
    { name: 'Map.prototype.keys',      slug: 'map-iterators', when: 'Reading everything rather than one key' },
    { name: 'Map.prototype.delete',    slug: 'map-delete',    when: 'Removing what you read' },
  ],

  faq: [
    {
      q: 'How do I give a default for a missing key?',
      a: 'Nullish coalescing on the result. Use ?? rather than || so that a legitimately stored 0, empty string or false is not replaced by the default.',
      code: 'const n = map.get(key) ?? 0;   // keeps a stored 0\nconst bad = map.get(key) || 0; // replaces it',
    },
    {
      q: 'Why does map["key"] not work?',
      a: 'Because a Map stores its entries internally, not as object properties. Bracket syntax looks for a property on the Map instance and finds nothing. The same reason JSON.stringify and spread-into-object see an empty Map.',
    },
    {
      q: 'Can I tell whether a key exists without two lookups?',
      a: 'Not directly — but in practice get is enough unless undefined is a value you store. If it is, has is the only way, and two lookups is the cost of the distinction.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Map added with get, set, has, delete and the iteration methods.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get',
    meta:  'Map.prototype.get',
  },

  tryInTool: [],
};
