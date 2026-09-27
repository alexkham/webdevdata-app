// content/reference/javascript/methods/number-tostring.js
//
// valueOf is consolidated here: on a number the two differ only in return
// type, and valueOf's real interest is as the coercion hook.

export const meta = {
  slug:        'number-tostring',
  name:        'Number.prototype.toString',
  signature:   'number.toString([radix])',
  blurb:       'Convert to any base from 2 to 36 — hex, binary, and the two-dot literal quirk.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Number toString radix base hex binary octal base36 valueOf convert string parseInt javascript',
};

export const method = {
  slug:      'number-tostring',
  name:      'Number.prototype.toString',
  signature: 'number.toString([radix])',
  returns:   { type: 'string', desc: 'The number written in the given base. Default base 10, which is also what implicit string coercion produces.' },

  category:    'Number method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Without an argument it is the ordinary conversion every template literal performs. With a radix it becomes the shortest way to produce hex, binary or any base up to 36.',

  cheat: {
    commonCall: 'n.toString(16)',
    returns:    'the number as a string in that base',
    replaces:   'manual digit arithmetic',
    watchOut:   'radix must be 2–36, and 255.toString() is a syntax error',
  },

  parameters: [
    { name: 'radix', type: 'number', required: false, default: '10', desc: 'The base, 2 to 36. Digits above 9 use lowercase letters. Anything outside the range throws RangeError.' },
  ],

  demoParams: [
    { name: 'n',     type: 'number', hint: 'a number',   input: 'number' },
    { name: 'radix', type: 'number', hint: 'base (2–36)', input: 'number' },
  ],
  demoTemplate: '({n}).toString({radix})',
  cases: [
    { id: 'hex',     label: 'hexadecimal',     values: { n: 255, radix: 16 } },
    { id: 'binary',  label: 'binary',          values: { n: 255, radix: 2 } },
    { id: 'octal',   label: 'octal',           values: { n: 255, radix: 8 } },
    { id: 'base36',  label: 'base 36',         values: { n: 123456, radix: 36 } },
    { id: 'decimal', label: 'plain decimal',   values: { n: 255, radix: 10 } },
  ],
  demoExplainer: "Digits above 9 are written as lowercase letters, so base 16 gives 'ff' and base 36 uses the whole alphabet — which is why base 36 is a popular way to shorten numeric ids. Negative numbers get a minus sign rather than a two's-complement representation, so (-255).toString(2) is '-11111111' and not a bit pattern. The inverse is parseInt with the same radix.",

  patterns: [
    {
      name: 'Hex colour components',
      desc: 'Pad, because single digits are common.',
      code: "const hex = n => n.toString(16).padStart(2, '0');",
    },
    {
      name: 'Short random ids',
      desc: 'Base 36 packs the most into the fewest characters.',
      code: 'Math.random().toString(36).slice(2, 10);',
    },
    {
      name: 'Round trip with parseInt',
      desc: 'Same radix both ways.',
      code: 'parseInt(n.toString(16), 16) === n;',
    },
  ],

  examples: [
    { title: 'Hexadecimal',      code: '(255).toString(16)',   returns: "'ff'" },
    { title: 'Binary',           code: '(255).toString(2)',    returns: "'11111111'" },
    { title: 'Negative',         code: '(-255).toString(16)',  returns: "'-ff'" },
    { title: 'Fractions work',   code: '(0.5).toString(2)',    returns: "'0.1'" },
    { title: 'Two dots parse',   code: '255..toString(16)',    returns: "'ff'" },
    { title: 'Bad radix',        code: '(255).toString(37)',   returns: 'RangeError: toString() radix argument must be between 2 and 36' },
  ],

  pitfalls: [
    {
      name: '255.toString(16) is a syntax error',
      desc: 'The parser reads the dot as the start of a decimal fraction, so the method name becomes invalid. Wrap the number in parentheses, or use two dots — the first ends the number, the second is the property access.',
      wrong: { label: 'Will not parse', code: '255.toString(16)', output: 'SyntaxError: Invalid or unexpected token' },
      fix:   { label: 'Parenthesise',   code: '(255).toString(16)', output: "'ff'" },
    },
    {
      name: 'Negatives get a minus sign, not a bit pattern',
      desc: 'You get a minus sign in front of the magnitude, which is not the bit pattern a negative integer actually has in memory. For a real 32-bit representation use an unsigned shift first.',
      wrong: { label: 'A minus sign', code: '(-255).toString(2)', output: "'-11111111'" },
      fix:   { label: 'Bit pattern',  code: '(-255 >>> 0).toString(2)', output: "'11111111111111111111111100000001'" },
    },
    {
      name: 'Non-decimal fractions are approximate',
      desc: 'Converting a fraction to another base has the same representation problem as decimal does — the digits may not terminate, and the output is the closest the double can express. Only use radix conversion on integers unless you have checked.',
      wrong: { label: 'Long expansion', code: '(0.1).toString(3)', output: 'a long non-terminating expansion' },
      fix:   { label: 'Integers only',  code: '(Math.round(0.1 * 1000)).toString(3)', output: "'10201'" },
    },
    {
      name: 'It is not zero-padded',
      desc: 'A byte below 16 produces a single hex digit, so joining colour components without padding silently produces a short, wrong string.',
      wrong: { label: 'One digit', code: '(5).toString(16)', output: "'5'" },
      fix:   { label: 'Pad it',    code: "(5).toString(16).padStart(2, '0')", output: "'05'" },
    },
  ],

  when: {
    use: [
      'Producing hex, binary or octal representations',
      'Compact ids via base 36',
      'Debugging bit patterns, with an unsigned shift first',
      'Explicit conversion where a template literal would be unclear',
    ],
    avoid: [
      'Formatting for a user → toLocaleString or Intl.NumberFormat',
      'A fixed number of decimals → toFixed',
      'Bit patterns of negatives → shift to unsigned first',
      'Ordinary coercion → a template literal is shorter',
    ],
  },

  notes: {
    complexity: 'O(d) in the number of output digits',
    return:     'A new string; the number is unchanged',
    cpython:    'V8: Builtins-number-tostring',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.parseInt',                 slug: 'number-parseint',       when: 'The inverse — string in any base back to a number' },
    { name: 'Number.prototype.toFixed',        slug: 'number-tofixed',        when: 'Fixed decimal places instead of a base' },
    { name: 'Number.prototype.toLocaleString', slug: 'number-tolocalestring', when: 'Formatting for people rather than machines' },
    { name: 'String.prototype.padStart',       slug: 'string-padstart',       when: 'Zero-padding the hex you just produced' },
  ],

  faq: [
    {
      q: 'Why does 255.toString(16) throw a syntax error?',
      a: 'Because the parser treats the dot as a decimal point and then finds a method name where it expected digits. Parentheses around the number fix it, and so does a second dot — 255..toString(16) works because the first dot completes the numeric literal.',
      code: '(255).toString(16);   // fine\n255..toString(16);    // also fine\n255 .toString(16);    // fine too, with a space',
    },
    {
      q: 'How do I get a binary representation of a negative number?',
      a: 'Convert to an unsigned 32-bit integer first with >>> 0. Without it you get a minus sign followed by the magnitude, which is not how the value is stored.',
      code: '(-255 >>> 0).toString(2);',
    },
    {
      q: 'What is the difference from valueOf?',
      a: 'valueOf returns the primitive NUMBER; toString returns a string. On a number primitive valueOf is effectively an identity function, and its real role is as the coercion hook that makes arithmetic work on wrapper objects.',
      code: '(5).valueOf();    // 5, a number\n(5).toString();   // "5", a string',
    },
    {
      q: 'Why base 36?',
      a: 'Because it uses every digit and every letter, making it the most compact base representable with alphanumerics. That makes it a common choice for shortening ids and for quick random strings.',
      code: 'Math.random().toString(36).slice(2, 10);',
    },
  ],

  history: [
    { version: 'ES1', note: 'toString with a radix and valueOf present from the first version.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString',
    meta:  'Number.prototype.toString',
  },

  tryInTool: [],
};
