// content/reference/javascript/methods/number-isfinite.js

export const meta = {
  slug:        'number-isfinite',
  name:        'Number.isFinite',
  signature:   'Number.isFinite(value)',
  blurb:       'A real, usable number — not Infinity, not NaN, and not a string that looks like one.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Number.isFinite isFinite global Infinity NaN coercion validate numeric check overflow es2015 javascript',
};

export const method = {
  slug:      'number-isfinite',
  name:      'Number.isFinite',
  signature: 'Number.isFinite(value)',
  returns:   { type: 'boolean', desc: 'True only for a number that is neither infinite nor NaN. No coercion — a numeric string is false.' },

  category:    'Number static method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The single best "is this a usable number" check. It excludes the three values that break arithmetic — NaN and both infinities — and unlike the global version it does not convert its argument first.',

  cheat: {
    commonCall: 'Number.isFinite(x)',
    returns:    'boolean',
    replaces:   'typeof x === "number" && !isNaN(x) && x !== Infinity',
    watchOut:   'the global isFinite coerces; this does not',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: null, desc: 'Any value. Non-numbers are false without conversion, as are NaN, Infinity and -Infinity.' },
  ],

  demoParams: [
    { name: 'v', type: 'any', hint: 'any value', input: 'auto' },
  ],
  demoTemplate: '[Number.isFinite({v}), isFinite({v})]',
  cases: [
    { id: 'num',    label: 'a number — both agree',      values: { v: '42' } },
    { id: 'text',   label: 'a word — both false',        values: { v: 'abc' } },
    { id: 'float',  label: 'a float',                    values: { v: '1.5' } },
    { id: 'zero',   label: 'zero',                       values: { v: '0' } },
    { id: 'neg',    label: 'a negative number',          values: { v: '-7' } },
  ],
  demoExplainer: "The pair is [Number.isFinite(v), isFinite(v)]. For genuine numbers the two agree, and for non-numeric text both are false. The divergence appears with a numeric STRING: the global converts '5' to 5 and answers true, while the static answers false because a string is not a number. The auto input here turns numeric-looking text into a real number first, so see the examples below for the raw-string contrast. Neither form can be shown Infinity through a text box.",

  patterns: [
    {
      name: 'Validate a converted value',
      desc: 'Catches NaN and Infinity in one test.',
      code: 'const n = Number(input);\nif (!Number.isFinite(n)) reject();',
    },
    {
      name: 'Detect overflow after a computation',
      desc: 'Infinity is how doubles report overflow.',
      code: 'if (!Number.isFinite(result)) throw new Error("overflow");',
    },
    {
      name: 'Guard a division',
      desc: 'Division by zero gives Infinity, not an error.',
      code: 'const avg = count ? total / count : 0;',
    },
  ],

  examples: [
    { title: 'A number',        code: 'Number.isFinite(42)',    returns: 'true' },
    { title: 'A numeric string',code: "Number.isFinite('5')",   returns: 'false' },
    { title: 'The global coerces', code: "isFinite('5')",       returns: 'true' },
    { title: 'Infinity',        code: 'Number.isFinite(Infinity)', returns: 'false' },
    { title: 'Division by zero',code: 'Number.isFinite(1 / 0)', returns: 'false' },
    { title: 'NaN too',         code: 'Number.isFinite(NaN)',   returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'The global isFinite coerces first',
      desc: 'isFinite("5") is true, isFinite("") is true — the empty string converts to 0 — and isFinite(null) is true for the same reason. Used as a numeric-validity check it accepts values that are not numbers at all.',
      wrong: { label: 'Accepts non-numbers', code: "isFinite('')", output: 'true' },
      fix:   { label: 'Strict',              code: "Number.isFinite('')", output: 'false' },
    },
    {
      name: 'Division by zero gives Infinity rather than an error',
      desc: 'No exception is thrown, so a zero denominator produces Infinity that flows onward through the calculation. It then contaminates averages, percentages and chart scales in ways that surface far from the division.',
      wrong: { label: 'Silent', code: '10 / 0', output: 'Infinity' },
      fix:   { label: 'Guard it', code: 'denominator === 0 ? 0 : 10 / denominator', output: '0' },
    },
    {
      name: 'It is not a "this is numeric" test for strings',
      desc: 'Validating form input with it rejects everything, because input arrives as text. Convert with Number first — and remember that an empty string converts to 0 and therefore passes.',
      wrong: { label: 'Rejects valid text', code: "Number.isFinite('42')", output: 'false' },
      fix:   { label: 'Convert, and guard blank', code: "const s = '42';\ns.trim() !== '' && Number.isFinite(Number(s))", output: 'true' },
    },
    {
      name: 'Infinity survives many operations',
      desc: 'Infinity minus a number is still Infinity, and only Infinity minus Infinity becomes NaN. A single overflow therefore propagates quietly for a long time before it turns into the more obvious NaN.',
      wrong: { label: 'Still infinite', code: 'Number.isFinite(Infinity - 1000)', output: 'false' },
      fix:   { label: 'Check early',    code: 'if (!Number.isFinite(x)) handle();', output: 'caught at the source' },
    },
  ],

  when: {
    use: [
      'Validating that a converted value is usable in arithmetic',
      'Detecting overflow or division by zero',
      'Guarding values before they reach a chart, a layout calculation or a database',
      'Any check where NaN and Infinity should both fail',
    ],
    avoid: [
      'The value is a string → convert with Number first',
      'You only care about NaN → Number.isNaN',
      'You need a whole number → Number.isInteger',
      'The global isFinite → it coerces, and rarely helps',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A boolean; nothing is allocated or coerced',
    cpython:    'V8: Builtins-number-isfinite',
    memory:     'No allocation',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.isNaN',     slug: 'number-isnan',     when: 'The same global-versus-static split, for NaN' },
    { name: 'Number.isInteger', slug: 'number-isinteger', when: 'Whole numbers specifically' },
    { name: 'Number.constants', slug: 'number-constants', when: 'MAX_VALUE, past which everything is Infinity' },
    { name: 'Number.parseFloat',slug: 'number-parsefloat',when: 'Producing the number you are validating' },
  ],

  faq: [
    {
      q: 'Why not just use the global isFinite?',
      a: 'Because it converts its argument first, so it answers true for numeric strings, for the empty string and for null. That makes it a loose "could this be a number" test rather than a check on the value you actually hold.',
      code: "isFinite('');          // true  — '' converts to 0\nNumber.isFinite('');   // false",
    },
    {
      q: 'Is this the best general numeric validity check?',
      a: 'For a value that should already be a number, yes — it rejects NaN and both infinities in one call. For text input, convert with Number first and reject blank strings explicitly, since those convert to 0.',
      code: "const valid = s.trim() !== '' && Number.isFinite(Number(s));",
    },
    {
      q: 'Where does Infinity come from?',
      a: 'Division by zero, overflow past MAX_VALUE, and explicit use of the Infinity literal. None of them throws, so the value simply enters your data and propagates.',
      code: '1 / 0;                  // Infinity\nNumber.MAX_VALUE * 2;   // Infinity',
    },
  ],

  history: [
    { version: 'ES1',    note: 'The global isFinite present from the first version, with coercion.' },
    { version: 'ES2015', note: 'Number.isFinite added as the non-coercing version.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite',
    meta:  'Number.isFinite',
  },

};
