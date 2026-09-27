// content/reference/javascript/methods/string-tostring.js
//
// valueOf is consolidated here: on a string the two are indistinguishable,
// and the only thing that makes either interesting is the String WRAPPER
// object, which a text input cannot produce — hence doc-only.

export const meta = {
  slug:        'string-tostring',
  name:        'String.prototype.toString',
  signature:   'string.toString()',
  blurb:       'A no-op on a real string — and the reason new String() should never be used.',
  category:    'string',
  type:        'string',
  hasLiveDemo: false,
  version:     'ES1 (1997)',
  searchTerms: 'string toString valueOf primitive wrapper object new String boxing typeof strict equality autoboxing javascript',
};

export const method = {
  slug:      'string-tostring',
  name:      'String.prototype.toString',
  signature: 'string.toString()',
  returns:   { type: 'string', desc: 'The primitive string value. On a string primitive that is the string itself; on a String wrapper object it is the value inside. valueOf does exactly the same thing.' },

  category:    'String method',
  version:     'ES1 (1997)',
  hasLiveDemo: false,

  subtitle: 'Worth a page not for what it does — which is nothing — but for what it reveals: strings come in two forms, and only one of them behaves sensibly.',

  cheat: {
    commonCall: 'String(value)',
    returns:    'the primitive string',
    replaces:   'new String(x).toString(), which should not exist',
    watchOut:   'new String("a") is an OBJECT — typeof "object", and never === a string',
  },

  parameters: [],

  examples: [
    { title: 'A no-op on a primitive', code: "'abc'.toString()",           returns: "'abc'" },
    { title: 'valueOf is identical',   code: "'abc'.valueOf()",            returns: "'abc'" },
    { title: 'The wrapper is an object', code: "typeof new String('a')",   returns: "'object'" },
    { title: 'And never equal',        code: "new String('a') === 'a'",    returns: 'false' },
    { title: 'Unwrapped it is',        code: "new String('a').valueOf() === 'a'", returns: 'true' },
    { title: 'String() does not wrap', code: "typeof String('a')",         returns: "'string'" },
  ],

  pitfalls: [
    {
      name: 'new String() creates an object, not a string',
      desc: 'typeof reports "object", strict equality against any primitive is false, and a JSON round trip or a Map key behaves differently. It looks like a string in the console and fails every identity check, which makes it one of the more baffling bugs to track down.',
      wrong: { label: 'Not equal', code: "new String('a') === 'a'", output: 'false' },
      fix:   { label: 'No new',    code: "String('a') === 'a'", output: 'true' },
    },
    {
      name: 'A String object is always truthy',
      desc: 'Even wrapping an empty string. Code that tests a value for emptiness gets the wrong answer, because the object itself is truthy regardless of what is inside it.',
      wrong: { label: 'Truthy when empty', code: "Boolean(new String(''))", output: 'true' },
      fix:   { label: 'Primitive is falsy', code: "Boolean('')", output: 'false' },
    },
    {
      name: 'String(x) and x.toString() differ on null',
      desc: 'String() handles null and undefined, producing "null" and "undefined". Calling the method on them throws, because there is no object to call it on. This is the practical reason to prefer the String function.',
      wrong: { label: 'Throws', code: 'null.toString()', output: "TypeError: Cannot read properties of null (reading 'toString')" },
      fix:   { label: 'String() copes', code: 'String(null)', output: "'null'" },
    },
    {
      name: 'Autoboxing makes the wrapper mostly invisible',
      desc: 'Calling any method on a primitive temporarily wraps it, so "a".toUpperCase() works without you ever creating an object. That is why explicitly constructing one is both unnecessary and confusing — the language already does it, and then throws the wrapper away.',
      wrong: { label: 'Property is lost', code: "const s = 'a';\ns.custom = 1;\ns.custom", output: 'undefined' },
      fix:   { label: 'Use a real object', code: 'const s = {value: "a", custom: 1};', output: '1' },
    },
  ],

  when: {
    use: [
      'Rarely — the conversion happens implicitly almost everywhere',
      'Converting a value where you know it is not null or undefined',
    ],
    avoid: [
      'Converting anything that might be null → String(x)',
      'Building a string from parts → a template literal',
      'Creating strings → never use new String',
      'You want a number as text → String(n) or `${n}`',
    ],
  },

  notes: {
    complexity: 'O(1) — it returns the existing value',
    return:     'The primitive string; nothing is copied',
    cpython:    'V8: Builtins-string-tostring',
    memory:     'No allocation for a primitive receiver',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'String.prototype.concat',   slug: 'string-concat',   when: 'The other rarely-needed conversion helper' },
    { name: 'Array.prototype.toString',  slug: 'array-tostring',  when: 'The array version, which actually does something' },
    { name: 'String.prototype.trim',     slug: 'string-trim',     when: 'What you usually want after converting input' },
    { name: 'String.prototype.localeCompare', slug: 'string-localecompare', when: 'Comparing strings properly' },
  ],

  faq: [
    {
      q: 'What is the difference between toString and valueOf here?',
      a: 'On a string, none — both return the primitive value. They differ on other types, where valueOf returns a primitive of the natural type and toString returns text. For strings the natural type IS text, so the two collapse into the same thing.',
      code: "'a'.toString() === 'a'.valueOf();   // true",
    },
    {
      q: 'Why does new String() exist at all?',
      a: 'Because ES1 gave every primitive type a constructor for symmetry, and nothing can be removed. It has no legitimate use in modern code — String(x) converts, and the autoboxing that makes methods work on primitives happens automatically.',
      code: "String('a');       // 'a'      — a primitive\nnew String('a');   // [String: 'a'] — an object",
    },
    {
      q: 'How should I convert a value to a string?',
      a: 'String(x) for anything that might be null or undefined, or a template literal when you are assembling text anyway. Both are shorter than calling the method and neither can throw on a nullish value.',
      code: 'String(value);\n`${value}`;',
    },
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because on a string primitive the method returns its own input — a demo would show the same value going in and coming out, which teaches nothing. Everything interesting here involves new String(), and a text input cannot produce an object. The examples above are run against a real runtime.',
    },
  ],

  history: [
    { version: 'ES1', note: 'toString and valueOf present from the first version, along with the String constructor and its wrapper objects.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toString',
    meta:  'String.prototype.toString',
  },

  tryInTool: [],
};
