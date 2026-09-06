// content/reference/python/functions/float-hex.js
//
// Slug is type-prefixed: `hex` is already the built-in hex() for ints.

export const meta = {
  slug:        'float-hex',
  name:        'float.hex',
  signature:   'float.hex()',
  blurb:       'Exact hexadecimal form of a float — every bit preserved, unlike str().',
  category:    'float',
  type:        'float',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'float hex hexadecimal exact representation round trip binary precision serialize',
};

export const method = {
  slug:      'float-hex',
  name:      'float.hex',
  signature: 'float.hex()',
  returns:   { type: 'str', desc: "A hexadecimal string such as '0x1.8000000000000p+0'. Exact — float.fromhex reverses it with no loss." },

  category:    'Float method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The lossless text form. Decimal output has to round somewhere; hex output shows the stored bits exactly, which makes round trips and bug reports reliable.',

  cheat: {
    commonCall: 'x.hex()',
    returns:    "str like '0x1.8000000000000p+0' — mantissa, then a binary exponent",
    replaces:   'repr(x) when you need an exact, portable round trip',
    watchOut:   'the p exponent is a power of TWO, not of sixteen',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'float', hint: 'a number, e.g. 255.0 or 0.5', input: 'float' },
  ],
  demoTemplate: 'float({n}).hex()',
  cases: [
    { id: 'one',      label: 'one',          values: { n: 1.0 } },
    { id: 'half',     label: 'a half',       values: { n: 0.5 } },
    { id: 'byte',     label: '255',          values: { n: 255.0 } },
    { id: 'zero',     label: 'zero',         values: { n: 0.0 } },
    { id: 'negative', label: 'negative half', values: { n: -0.5 } },
    { id: 'tenth',    label: 'a tenth',      values: { n: 0.1 } },
  ],
  demoExplainer: 'The output reads as mantissa, then p, then a power of two. 0x1.8p+0 means 1.5 x 2**0, because the hex digits after the point are sixteenths: 8/16 is a half. 255.0 becomes 0x1.fe00000000000p+7, or 1.9921875 x 2**7. Zero is the special case, printing as 0x0.0p+0 with no leading one. Watch the 0.1 case — the long string of digits is exactly why 0.1 is not really a tenth.',

  patterns: [
    {
      name: 'Round-trip a float exactly',
      desc: 'fromhex reverses hex with no rounding, on any platform.',
      code: 'text = x.hex()\nassert float.fromhex(text) == x',
    },
    {
      name: 'Report a float precisely in a bug report',
      desc: 'Removes all doubt about which value is actually stored.',
      code: 'log.error("got %s (%s)", value, value.hex())',
    },
    {
      name: 'Compare two floats bit for bit',
      desc: 'Equal hex means identical bits; the printed decimals can match while the values differ.',
      code: 'same_bits = a.hex() == b.hex()',
    },
  ],

  examples: [
    { title: 'One',            code: '(1.0).hex()',    returns: "'0x1.0000000000000p+0'" },
    { title: 'A half',         code: '(0.5).hex()',    returns: "'0x1.0000000000000p-1'" },
    { title: '255',            code: '(255.0).hex()',  returns: "'0x1.fe00000000000p+7'" },
    { title: 'Zero',           code: '(0.0).hex()',    returns: "'0x0.0p+0'" },
    { title: 'Negative',       code: '(-0.5).hex()',   returns: "'-0x1.0000000000000p-1'" },
    { title: 'Infinity',       code: "float('inf').hex()", returns: "'inf'" },
  ],

  pitfalls: [
    {
      name: 'The p exponent counts powers of two',
      desc: 'The digits are hexadecimal but the exponent is binary. p+7 means times 2**7, not 16**7 — misreading it puts you off by a factor of millions.',
      wrong: { label: 'Read as base 16', code: "(255.0).hex()   # 0x1.fe...p+7", output: 'NOT 1.99 * 16**7' },
      fix:   { label: 'Read as base 2',  code: '1.9921875 * 2 ** 7', output: '255.0' },
    },
    {
      name: 'It is not the built-in hex()',
      desc: 'hex() takes an integer and rejects floats outright. float.hex is a method on the value, and the two produce completely different text.',
      wrong: { label: 'Builtin rejects floats', code: 'hex(255.0)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'Call the method',        code: '(255.0).hex()', output: "'0x1.fe00000000000p+7'" },
    },
    {
      name: 'Not meant to be human-readable',
      desc: 'It is an exact interchange format, not a display format. Showing it to users trades a familiar number for one almost nobody can read at a glance.',
      wrong: { label: 'Unreadable output', code: 'print(f"Total: {total.hex()}")', output: 'Total: 0x1.91eb851eb851fp+6' },
      fix:   { label: 'Format for humans', code: 'print(f"Total: {total:.2f}")', output: 'Total: 100.48' },
    },
  ],

  when: {
    use: [
      'Exact round trips through text, with fromhex',
      'Bug reports and test fixtures where the precise value matters',
      'Comparing floats bit for bit',
      'Storing floats in a text format without rounding',
    ],
    avoid: [
      'Anything a person will read → f-strings or format',
      'Integers → the built-in hex()',
      'Exact decimal arithmetic → decimal.Decimal',
    ],
  },

  notes: {
    complexity: 'O(1) — formats a fixed number of digits',
    return:     'A new str; always 13 mantissa digits for normal values',
    cpython:    'Objects/floatobject.c :: float_hex',
    memory:     'Allocates the result string',
    threadSafe: 'Yes — floats are immutable',
  },

  related: [
    { name: 'float.fromhex',          slug: 'float-fromhex',          when: 'Read the value back from this string' },
    { name: 'hex',                    slug: 'hex',                    when: 'Hexadecimal for integers instead' },
    { name: 'float.as_integer_ratio', slug: 'float-as_integer_ratio', when: 'The same exactness as a fraction' },
    { name: 'float',                  slug: 'float',                  when: 'Build the float in the first place' },
  ],

  faq: [
    {
      q: 'How do I read 0x1.8p+0?',
      a: 'The mantissa is 1 plus 8/16, so 1.5, and p+0 multiplies by 2**0. Hex digits after the point are sixteenths, then two-hundred-fifty-sixths, and so on — the same idea as decimal places, in base 16.',
      code: 'float.fromhex("0x1.8p+0")\n# 1.5',
    },
    {
      q: 'Why use hex instead of repr?',
      a: 'repr is exact on modern CPython, but hex is exact by construction everywhere, and it makes the binary structure visible. For interchange between languages or platforms, hex removes any doubt about decimal parsing.',
      code: 'assert float.fromhex(x.hex()) == x',
    },
    {
      q: 'Why does 0.1 look so messy?',
      a: 'Because a tenth cannot be written exactly in binary, so the stored value is slightly off. The decimal form rounds that away and shows 0.1; the hex form shows what is really there.',
      code: "(0.1).hex()\n# '0x1.999999999999ap-4'",
    },
  ],

  history: [
    { version: '2.6', note: 'float.hex and float.fromhex added together for exact round trips.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#float.hex',
    meta:  'float.hex',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Work with exact binary representations' },
  ],
};
