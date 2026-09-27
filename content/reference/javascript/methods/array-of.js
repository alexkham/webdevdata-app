// content/reference/javascript/methods/array-of.js

export const meta = {
  slug:        'array-of',
  name:        'Array.of',
  signature:   'Array.of(...values)',
  blurb:       'Array.of(3) is [3]; Array(3) is three empty slots. That inconsistency is why it exists.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Array.of constructor single argument length holes sparse Array(3) static es2015 javascript',
};

export const method = {
  slug:      'array-of',
  name:      'Array.of',
  signature: 'Array.of(...values)',
  returns:   { type: 'Array', desc: 'A new array containing exactly the arguments given — including when there is only one, and it is a number.' },

  category:    'Array static method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'A fix for one specific wart. The Array constructor treats a single numeric argument as a LENGTH rather than a value, and Array.of never does.',

  cheat: {
    commonCall: 'Array.of(3)',
    returns:    '[3] — always the values, never a length',
    replaces:   'the Array constructor when the count of arguments is dynamic',
    watchOut:   'rarely needed in practice; [x] is shorter and clearer',
  },

  parameters: [
    { name: '...values', type: 'any', required: false, default: 'none', desc: 'Any number of values, each becoming one element. With no arguments you get an empty array.' },
  ],

  demoParams: [
    { name: 'value', type: 'number', hint: 'a single number', input: 'number' },
  ],
  demoTemplate: 'Array.of({value})',
  cases: [
    { id: 'three', label: 'Array.of(3)', values: { value: 3 } },
    { id: 'one',   label: 'Array.of(1)', values: { value: 1 } },
    { id: 'zero',  label: 'Array.of(0)', values: { value: 0 } },
    { id: 'big',   label: 'Array.of(99)',values: { value: 99 } },
  ],
  demoExplainer: 'Every case gives a ONE-element array holding the number — Array.of(3) is [3]. Compare that with the Array constructor: Array(3) produces an array of LENGTH three containing nothing at all, three empty slots. Array.of removes that special case entirely, so a single numeric argument behaves like any other value.',

  patterns: [
    {
      name: 'Build from a dynamic argument list',
      desc: 'Where a single numeric value would break the constructor.',
      code: 'const wrapped = Array.of(...values);',
    },
    {
      name: 'Prefer a literal when you can',
      desc: 'For a known value, brackets are shorter and just as correct.',
      code: 'const one = [value];',
    },
    {
      name: 'The constructor trap it avoids',
      desc: 'Worth knowing even if you never call Array.of.',
      code: 'Array(3);      // three empty slots\nArray.of(3);   // [3]',
    },
  ],

  examples: [
    { title: 'A single number', code: 'Array.of(3)',       returns: '[3]' },
    { title: 'The constructor differs', code: 'Array(3)',  returns: '[ <3 empty items> ]' },
    { title: 'And its length', code: 'Array(3).length',    returns: '3' },
    { title: 'Several values', code: 'Array.of(1, 2, 3)',  returns: '[1, 2, 3]' },
    { title: 'Constructor agrees here', code: 'Array(1, 2, 3)', returns: '[1, 2, 3]' },
    { title: 'A literal is simpler', code: '[3]',           returns: '[3]' },
  ],

  pitfalls: [
    {
      name: 'It is rarely the right tool',
      desc: 'An array literal does the same job in fewer characters and reads better. Array.of only earns its place when the arguments are spread from something dynamic and a single numeric value would otherwise hit the constructor trap.',
      wrong: { label: 'Roundabout', code: 'const a = Array.of(value);', output: '[value]' },
      fix:   { label: 'Just a literal', code: 'const a = [value];', output: '[value]' },
    },
    {
      name: 'The trap it fixes belongs to Array(), not Array.of',
      desc: 'The surprising behaviour is the CONSTRUCTOR treating one number as a length. Array.of is the well-behaved version — if you never call Array(n) expecting a value, you will never miss it.',
      wrong: { label: 'Constructor', code: 'Array(3)', output: '[ <3 empty items> ]  — length 3, no values' },
      fix:   { label: 'of, or a literal', code: 'Array.of(3)', output: '[3]' },
    },
    {
      name: 'It is a static, not an instance method',
      desc: 'Array.of(...), never x.of(...). The same slip as with Array.from.',
      wrong: { label: 'Not on instances', code: '[1].of(2)', output: 'TypeError: [1].of is not a function' },
      fix:   { label: 'Call on Array',    code: 'Array.of(2)', output: '[2]' },
    },
  ],

  when: {
    use: [
      'Spreading a dynamic argument list where one numeric value is possible',
      'Writing generic code over array-like constructors',
    ],
    avoid: [
      'You know the values → an array literal is shorter and clearer',
      'You want an array of a given LENGTH → new Array(n).fill(...)',
      'You are converting an iterable → Array.from',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of arguments',
    return:     'A new dense array; no holes are ever created',
    cpython:    'V8: Builtins-array-of.tq',
    memory:     'Allocates one array sized to the argument count',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Array.from',           slug: 'array-from',    when: 'Build from an iterable or array-like source' },
    { name: 'Array.isArray',        slug: 'array-isarray', when: 'Test whether a value is an array' },
    { name: 'Array.prototype.fill', slug: 'array-fill',    when: 'Make new Array(n) dense and usable' },
    { name: 'Array.prototype.concat', slug: 'array-concat',when: 'Combine values into one array instead' },
  ],

  faq: [
    {
      q: 'Why does Array(3) not give [3]?',
      a: 'Because the Array constructor has a special case: exactly one numeric argument is read as a LENGTH, producing that many empty slots. With any other count, or any non-number, the arguments become the elements. Array.of removes the special case.',
      code: 'Array(3);        // [ <3 empty items> ]\nArray(3, 4);     // [3, 4]\nArray.of(3);     // [3]',
    },
    {
      q: 'Should I use Array.of in normal code?',
      a: 'Usually not — a literal is shorter and clearer. It matters when arguments are spread dynamically and one of them might be a lone number, which is exactly where the constructor would misbehave.',
    },
    {
      q: 'How do I make an array of a given length?',
      a: 'new Array(n).fill(value), or Array.from({length: n}, factory). Plain new Array(n) gives holes, which most array methods skip entirely.',
      code: 'new Array(3).fill(0);   // [0, 0, 0]',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Array.of added alongside Array.from, specifically to sidestep the single-numeric-argument constructor behaviour.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of',
    meta:  'Array.of',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
