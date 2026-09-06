// content/reference/python/functions/float-fromhex.js
//
// Slug is type-prefixed: fromhex exists on float, bytes and bytearray.

export const meta = {
  slug:        'float-fromhex',
  name:        'float.fromhex',
  signature:   'float.fromhex(string)',
  blurb:       'Read a float back from its exact hexadecimal form — the inverse of float.hex.',
  category:    'float',
  type:        'float',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'float fromhex parse hexadecimal exact round trip classmethod convert string',
};

export const method = {
  slug:      'float-fromhex',
  name:      'float.fromhex',
  signature: 'float.fromhex(string)',
  returns:   { type: 'float', desc: 'The float the string represents. Raises ValueError if the string is not a valid hexadecimal float.' },

  category:    'Float classmethod',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'A classmethod, called on the type. The 0x prefix is optional, which is the source of its one genuinely nasty surprise.',

  cheat: {
    commonCall: "float.fromhex('0x1.8p+0')",
    returns:    'float — exact, with no rounding',
    replaces:   'float(s) when the text is hexadecimal rather than decimal',
    watchOut:   "'0.5' parses as HEX and gives 0.3125, not one half",
  },

  parameters: [
    { name: 'string', type: 'str', required: true, default: null, desc: "A hexadecimal float such as '0x1.8p+0'. The 0x prefix and the p exponent are both optional. Also accepts 'inf', '-inf' and 'nan'. Leading and trailing whitespace is ignored." },
  ],

  demoParams: [
    { name: 's', type: 'str', hint: "hex float, e.g. 0x1.8p+0", input: 'text' },
  ],
  demoTemplate: 'float.fromhex({s})',
  cases: [
    { id: 'one-half',  label: 'one and a half',   values: { s: '0x1.8p+0' } },
    { id: 'power',     label: 'power of two',     values: { s: '0x1p+8' } },
    { id: 'no-prefix', label: 'no 0x prefix (!)', values: { s: '0.5' } },
    { id: 'one',       label: 'exactly one',      values: { s: '0x1.0p+0' } },
    { id: 'round',     label: 'round trip of 255',values: { s: '0x1.fe00000000000p+7' } },
    { id: 'invalid',   label: 'invalid raises',   values: { s: 'zz' } },
  ],
  demoExplainer: 'fromhex reads the format float.hex produces: a hex mantissa, then p and a power of two. Look hard at the third case. Because the 0x prefix is optional, the string "0.5" is parsed as HEXADECIMAL — the digit after the point is sixteenths, so it means 5/16, or 0.3125. It does not mean one half, and nothing warns you. Anything that is not a valid hex float raises ValueError.',

  patterns: [
    {
      name: 'Round-trip a float exactly',
      desc: 'The pairing fromhex is built for — no rounding in either direction.',
      code: 'assert float.fromhex(x.hex()) == x',
    },
    {
      name: 'Read exact constants from a config',
      desc: 'Stores a float in text without trusting decimal parsing.',
      code: 'epsilon = float.fromhex(config["epsilon_hex"])',
    },
    {
      name: 'Reproduce a value from a bug report',
      desc: 'Recreates the exact bits someone else saw.',
      code: 'value = float.fromhex("0x1.91eb851eb851fp+1")',
    },
  ],

  examples: [
    { title: 'One and a half',   code: "float.fromhex('0x1.8p+0')",  returns: '1.5' },
    { title: 'Power of two',     code: "float.fromhex('0x1p+8')",    returns: '256.0' },
    { title: 'No prefix is hex', code: "float.fromhex('0.5')",       returns: '0.3125  # NOT 0.5' },
    { title: 'Round trip',       code: "float.fromhex((255.0).hex())", returns: '255.0' },
    { title: 'Infinity',         code: "float.fromhex('inf')",       returns: 'inf' },
    { title: 'Invalid raises',   code: "float.fromhex('zz')",        returns: 'ValueError: invalid hexadecimal floating-point string' },
  ],

  pitfalls: [
    {
      name: "'0.5' means 0.3125",
      desc: 'The worst trap here by a distance. The 0x prefix is optional, so a decimal-looking string is still read as hexadecimal — 0.5 becomes 5/16. It parses cleanly and returns a plausible number, so nothing flags the mistake.',
      wrong: { label: 'Silently wrong', code: "float.fromhex('0.5')", output: '0.3125' },
      fix:   { label: 'Use float() for decimal', code: "float('0.5')", output: '0.5' },
    },
    {
      name: 'It is a classmethod, not a builtin',
      desc: 'Call it on the type — float.fromhex(s). There is no bare fromhex() function, and calling it on an instance works but reads as though the instance mattered.',
      wrong: { label: 'No such builtin', code: "fromhex('0x1p+0')", output: "NameError: name 'fromhex' is not defined" },
      fix:   { label: 'Call on the type', code: "float.fromhex('0x1p+0')", output: '1.0' },
    },
    {
      name: 'The p exponent is a power of two',
      desc: 'Same trap as float.hex in reverse. p+8 multiplies by 2**8, so 0x1p+8 is 256 — not 16**8, and not 108.',
      wrong: { label: 'Read as base 16', code: "float.fromhex('0x1p+8')   # expected 16**8?", output: '256.0' },
      fix:   { label: 'It is 2**8',      code: '1 * 2 ** 8', output: '256' },
    },
    {
      name: 'It does not accept Python float literals',
      desc: 'Decimal exponent notation like 1e5 is not part of the grammar — e is a valid hex DIGIT, so the string is read as digits instead and the meaning changes completely.',
      wrong: { label: 'Not what you meant', code: "float.fromhex('1e5')", output: '485.0  # 0x1e5, not 100000.0' },
      fix:   { label: 'Use float()',        code: "float('1e5')", output: '100000.0' },
    },
  ],

  when: {
    use: [
      'Reading back a value written with float.hex',
      'Exact constants in config files or test fixtures',
      'Reproducing a precise float from a bug report',
    ],
    avoid: [
      'Ordinary decimal text → float(s)',
      'User input of any kind → the hex-by-default rule will bite',
      'Exact decimal arithmetic → decimal.Decimal',
    ],
  },

  notes: {
    complexity: 'O(len(string)) — a single parse',
    return:     'A new float; exact for any string float.hex produced',
    cpython:    'Objects/floatobject.c :: float_fromhex',
    memory:     'No allocation beyond the float itself',
    threadSafe: 'Yes — floats and strings are immutable',
  },

  related: [
    { name: 'float.hex',              slug: 'float-hex',              when: 'Produce the string this method reads' },
    { name: 'float',                  slug: 'float',                  when: 'Parse ordinary decimal text instead' },
    { name: 'int',                    slug: 'int',                    when: 'Parse an integer, with an explicit base' },
    { name: 'float.as_integer_ratio', slug: 'float-as_integer_ratio', when: 'Exactness expressed as a fraction' },
  ],

  faq: [
    {
      q: "Why does float.fromhex('0.5') give 0.3125?",
      a: 'Because the whole string is hexadecimal, prefix or not. The digit after the point is a count of sixteenths, so 5 means 5/16 = 0.3125. If you meant ordinary decimal text, float() is the function you want.',
      code: "float.fromhex('0.5')   # 0.3125\nfloat('0.5')           # 0.5",
    },
    {
      q: 'Does it round-trip every float?',
      a: 'Yes. float.fromhex(x.hex()) == x holds for every finite float, and for inf and nan the strings round-trip too (though nan is never equal to itself). That guarantee is the reason the pair exists.',
      code: 'assert float.fromhex(x.hex()) == x',
    },
    {
      q: 'Can it read C or Java hex float literals?',
      a: 'Generally yes — the format follows C99 hexadecimal floating constants, so strings from printf %a and Java\'s Double.toHexString parse correctly. That makes it a practical exchange format across languages.',
      code: "float.fromhex('0x1.91eb851eb851fp+1')\n# 3.14",
    },
  ],

  history: [
    { version: '2.6', note: 'float.fromhex and float.hex added together for exact round trips.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#float.fromhex',
    meta:  'float.fromhex',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Work with exact binary representations' },
  ],
};
