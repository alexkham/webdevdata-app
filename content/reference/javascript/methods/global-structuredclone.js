// content/reference/javascript/methods/global-structuredclone.js

export const meta = {
  slug:        'global-structuredclone',
  name:        'structuredClone',
  signature:   'structuredClone(value)',
  blurb:       'A real deep copy — handles cycles and Maps, throws on functions, loses the prototype.',
  category:    'global',
  type:        'global',
  hasLiveDemo: true,
  version:     'ES2021 era (HTML standard)',
  searchTerms: 'structuredClone deep copy clone JSON.parse stringify cycles Map Set Date prototype DataCloneError javascript',
};

export const method = {
  slug:      'global-structuredclone',
  name:      'structuredClone',
  signature: 'structuredClone(value)',
  returns:   { type: 'any', desc: 'A deep copy. Handles cycles, Map, Set, Date, RegExp, ArrayBuffer and typed arrays. Throws DataCloneError for functions, symbols and DOM nodes.' },

  category:    'Global function',
  version:     'ES2021 era (HTML standard)',
  hasLiveDemo: true,

  subtitle: 'The deep copy the language lacked for twenty years. It replaces the JSON round trip and is better in almost every way — but it drops class prototypes and refuses anything it cannot serialise.',

  cheat: {
    commonCall: 'const copy = structuredClone(value)',
    returns:    'an independent deep copy',
    replaces:   'JSON.parse(JSON.stringify(value))',
    watchOut:   'throws on functions; class instances become plain objects',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: null, desc: 'Anything supported by the structured clone algorithm. Functions, symbols, DOM nodes and Error subclass details are not, and throw DataCloneError.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON with a nested "n" object', input: 'text' },
  ],
  demoTemplate: '(o => { const c = structuredClone(o); c.n.x = 99; return [o.n.x, c.n.x]; })(JSON.parse({json}))',
  cases: [
    { id: 'deep',    label: 'nested stays INDEPENDENT', values: { json: '{"n":{"x":1}}' } },
    { id: 'more',    label: 'other properties too',     values: { json: '{"a":5,"n":{"x":1}}' } },
    { id: 'deeper',  label: 'deeply nested',            values: { json: '{"n":{"x":1,"y":{"z":2}}}' } },
  ],
  demoExplainer: "The pair is [original.n.x, copy.n.x] after writing 99 into the COPY nested object. The original still reads 1, which is what makes this a genuine deep copy — do the same with Object.assign or a spread and both would read 99, because those copy the nested reference rather than the nested object. What the demo cannot show through JSON input is everything else structuredClone handles that JSON cannot: cycles, Maps, Sets, Dates and typed arrays.",

  patterns: [
    {
      name: 'Deep copy before mutating',
      desc: 'The everyday use.',
      code: 'const draft = structuredClone(state);\ndraft.items.push(item);',
    },
    {
      name: 'Copy a Map or Set',
      desc: 'JSON loses these entirely.',
      code: 'const copy = structuredClone(new Map([["a", 1]]));',
    },
    {
      name: 'Keep the prototype',
      desc: 'structuredClone does not.',
      code: 'Object.assign(Object.create(Object.getPrototypeOf(o)), structuredClone({...o}));',
    },
  ],

  examples: [
    { title: 'Genuinely deep',    code: 'const o = {a: {b: 1}};\nconst c = structuredClone(o);\nc.a.b = 9;\no.a.b', returns: '1' },
    { title: 'Clones a Map',      code: 'structuredClone(new Map([["a", 1]]))', returns: "Map(1) {'a' => 1}" },
    { title: 'Clones a Date',     code: 'structuredClone(new Date(0)).toISOString()', returns: "'1970-01-01T00:00:00.000Z'" },
    { title: 'Handles cycles',    code: 'const o = {};\no.self = o;\nstructuredClone(o).self === structuredClone(o)', returns: 'false, but the copy self-reference is intact' },
    { title: 'Functions throw',   code: 'structuredClone({fn: () => 1})', returns: 'DataCloneError: () => 1 could not be cloned' },
    { title: 'Prototype is lost', code: 'class C {}\nstructuredClone(new C()) instanceof C', returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'Functions and symbols throw',
      desc: 'DataCloneError, not a silent omission — which is a real difference from the JSON round trip, where a function property simply disappears. An object carrying a callback cannot be cloned at all, so state holding handlers needs them stripped first.',
      wrong: { label: 'Throws', code: 'structuredClone({onDone: () => {}})', output: 'DataCloneError' },
      fix:   { label: 'Strip them', code: 'const {onDone, ...data} = obj;\nstructuredClone(data)', output: 'clones' },
    },
    {
      name: 'Class instances become plain objects',
      desc: 'The prototype is not part of the clone, so methods and instanceof are gone while the data survives. A cloned Date is still a Date — the algorithm special-cases the built-ins — but your own classes are not special-cased.',
      wrong: { label: 'No longer an instance', code: 'class C { hi() {} }\nstructuredClone(new C()).hi', output: 'undefined' },
      fix:   { label: 'Reconstruct',            code: 'Object.assign(new C(), structuredClone({...instance}))', output: 'methods back' },
    },
    {
      name: 'Getters are flattened to values',
      desc: 'A computed property is invoked once and its result stored, so the copy has a static value where the original had live behaviour. The same thing Object.assign does, and worth knowing before cloning a config object full of getters.',
      wrong: { label: 'Frozen value', code: 'structuredClone({get n() { return Date.now(); }})', output: '{n: a fixed number}' },
      fix:   { label: 'Copy descriptors', code: 'Object.defineProperties({}, Object.getOwnPropertyDescriptors(o))', output: 'still a getter' },
    },
    {
      name: 'It is not free',
      desc: 'A deep copy walks the whole structure, so cloning large state on every update is a real cost. It is still generally faster than the JSON round trip, but the right fix for hot paths is usually to copy only the branch you are changing.',
      wrong: { label: 'Clones everything', code: 'structuredClone(hugeState)', output: 'O(size of state)' },
      fix:   { label: 'Copy one branch',  code: '({...state, items: [...state.items, item]})', output: 'shallow where it can be' },
    },
  ],

  when: {
    use: [
      'Deep-copying plain data before mutating it',
      'Data containing Maps, Sets, Dates, RegExps or typed arrays',
      'Structures with cycles, which JSON cannot handle',
      'Anywhere JSON.parse(JSON.stringify(x)) currently appears',
    ],
    avoid: [
      'The data contains functions → strip them, or copy manually',
      'You need the prototype preserved → reconstruct after cloning',
      'A shallow copy is enough → spread, which is far cheaper',
      'Very large state on a hot path → copy only what changes',
    ],
  },

  notes: {
    complexity: 'O(n) in the total size of the structure',
    return:     'A new, fully independent value',
    cpython:    'Not V8 — the structured clone algorithm is defined by the HTML standard',
    memory:     'Allocates a full copy',
    threadSafe: 'Single-threaded; the same algorithm underlies postMessage between workers',
  },

  related: [
    { name: 'Object.assign',               slug: 'object-assign',               when: 'The shallow copy this replaces for nested data' },
    { name: 'Object.getOwnPropertyDescriptor', slug: 'object-getownpropertydescriptor', when: 'Copying getters as getters' },
    { name: 'Object.getPrototypeOf',       slug: 'object-getprototypeof',       when: 'Restoring the prototype afterwards' },
    { name: 'Map.prototype.set',           slug: 'map-set',                     when: 'One of the types JSON cannot clone' },
  ],

  faq: [
    {
      q: 'structuredClone or JSON.parse(JSON.stringify(x))?',
      a: 'structuredClone, in almost every case. The JSON round trip silently drops undefined, functions and symbols, turns Dates into strings, loses Maps and Sets entirely, and throws on cycles. structuredClone handles all of those correctly or fails loudly.',
      code: 'structuredClone(new Map([["a", 1]]));              // a Map\nJSON.parse(JSON.stringify(new Map([["a", 1]])));   // {}',
    },
    {
      q: 'Why did it throw DataCloneError?',
      a: 'Because the value contains something the algorithm cannot represent — a function, a symbol, a DOM node, or a class with unclonable internals. The error message names the offending value, which is usually enough to find it.',
    },
    {
      q: 'Why are my methods gone?',
      a: 'Because the clone carries data, not prototypes. The built-in types are special-cased, so a Date stays a Date, but your own class instance comes back as a plain object with the same properties. Reconstruct with Object.assign onto a fresh instance if you need the methods.',
      code: 'Object.assign(new C(), structuredClone({...instance}));',
    },
    {
      q: 'Is it available everywhere?',
      a: 'Node 17+ and all current browsers. It is defined by the HTML standard rather than ECMAScript, which is why it is a bare global with no namespace — the same algorithm postMessage has always used internally.',
    },
  ],

  history: [
    { version: 'HTML5', note: 'The structured clone algorithm defined for postMessage, but not exposed directly.' },
    { version: '2021',  note: 'structuredClone exposed as a global in browsers and Node 17, finally giving JavaScript a built-in deep copy.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone',
    meta:  'structuredClone',
  },

};
