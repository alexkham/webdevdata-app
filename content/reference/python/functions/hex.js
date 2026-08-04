// content/reference/python/functions/hex.js

export const meta = {
  slug:        'hex',
  name:        'hex',
  signature:   'hex(x)',
  blurb:       'Integer to lowercase hexadecimal string, with the "0x" prefix.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'hex hexadecimal base 16 convert integer string representation prefix 0x',
};

export const method = {
  slug:      'hex',
  name:      'hex',
  signature: 'hex(x)',
  returns:   { type: 'str', desc: 'A string in Python integer literal form: lowercase digits with a "0x" prefix, and "-0x" for negatives.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Convert an integer to its hexadecimal literal form — a string, not a number.',

  cheat: {
    commonCall: 'hex(255)  # "0xff"',
    returns:    'a str with "0x" prefix, lowercase digits',
    replaces:   'the format(n, "x") family when you also want the prefix',
    watchOut:   'floats are rejected — use int() first or float.hex() instead',
  },

  parameters: [
    { name: 'x', type: 'int', required: true, default: null, desc: 'Any integer (positive, negative, or zero). Objects with __index__ also accepted. Floats raise TypeError.' },
  ],

  demoParams: [
    { name: 'x', type: 'int', hint: 'the integer', input: 'number' },
  ],
  cases: [
    { id: 'small',    label: 'small',        values: { x: 255 } },
    { id: 'zero',     label: 'zero',         values: { x: 0 } },
    { id: 'negative', label: 'negative',     values: { x: -255 } },
    { id: 'big',      label: 'big',          values: { x: 1048576 } },
    { id: 'byte-max', label: 'byte max',     values: { x: 255 } },
    { id: 'word-max', label: 'word max',     values: { x: 65535 } },
  ],
  demoExplainer: 'hex returns a STRING in the same form you would type an integer literal: "0x" prefix, lowercase digits. Negatives get a leading "-". This is a formatter, not a math operation — the value does not change, only its representation.',

  patterns: [
    {
      name: 'Display bytes as hex',
      desc: 'Round-trippable literal form — useful in error messages and logs.',
      code: 'print(f"got byte {hex(b)}")',
    },
    {
      name: 'Hex without the prefix',
      desc: 'When you only want the digits, format is cleaner and lets you control padding.',
      code: 'digits = format(255, "x")            # "ff"\npadded = format(255, "04x")           # "00ff"',
    },
    {
      name: 'Round-trip via int',
      desc: 'hex → str, int with base=16 → back. The prefix is optional on parse.',
      code: 's = hex(255)         # "0xff"\nn = int(s, 16)       # 255',
    },
  ],

  examples: [
    { title: 'Small integer',    code: 'hex(255)',       returns: '"0xff"' },
    { title: 'Zero',             code: 'hex(0)',         returns: '"0x0"' },
    { title: 'Negative',         code: 'hex(-255)',      returns: '"-0xff"' },
    { title: 'Big number',       code: 'hex(16 ** 5)',   returns: '"0x100000"' },
    { title: 'Float raises',     code: 'hex(1.5)',       returns: 'TypeError: &apos;float&apos; object cannot be interpreted as an integer' },
  ],

  pitfalls: [
    {
      name: 'The output includes the "0x" prefix',
      desc: 'For humans reading Python literals, that is exactly right. When you are building a fixed-width dump or a hex color, the prefix is in the way.',
      wrong: { label: 'Prefix not wanted', code: 'color = "#" + hex(255)', output: '"#0xff"  # extra 0x' },
      fix:   { label: 'Use format', code: 'color = "#" + format(255, "02x")', output: '"#ff"' },
    },
    {
      name: 'Floats are rejected',
      desc: 'hex only accepts integers. For float bit-patterns there is float.hex, which returns a different (IEEE 754 hex) form.',
      wrong: { label: 'Type error', code: 'hex(1.5)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'Truncate first', code: 'hex(int(1.5))', output: '"0x1"' },
    },
    {
      name: 'Result is a str, not an int',
      desc: 'You cannot do arithmetic on a hex string — Python does not auto-convert.',
      wrong: { label: 'Type error',  code: 'hex(15) + 1', output: 'TypeError: can only concatenate str (not "int") to str' },
      fix:   { label: 'Parse back',  code: 'int(hex(15), 16) + 1', output: '16' },
    },
    {
      name: 'Confused with .hex() on bytes',
      desc: 'hex(x) is for INTEGERS. bytes.hex() is a method on bytes objects returning a hex string of the raw bytes — no prefix, all digits.',
      wrong: { label: 'Wrong tool',  code: 'hex(b"\\xff\\x00")', output: "TypeError: 'bytes' object cannot be interpreted as an integer" },
      fix:   { label: 'Method form', code: 'b"\\xff\\x00".hex()', output: '"ff00"' },
    },
  ],

  when: {
    use: [
      'Human-readable Python-literal display of an integer',
      'Round-trippable output that int(s, 16) can parse back',
      'Diagnostic messages and logs where the prefix aids reading',
    ],
    avoid: [
      'No prefix wanted → format(n, "x")',
      'Fixed width / padding → format(n, "0Nx")',
      'Bytes → bytes.hex()',
      'Floats → float.hex() (different format entirely)',
    ],
  },

  notes: {
    complexity: 'O(log n) in the number of digits',
    return:     'str — always lowercase, always prefixed with "0x" (or "-0x")',
    cpython:    'Python/bltinmodule.c :: builtin_hex — delegates to type&apos;s __index__ then formats',
    memory:     'Allocates one small string',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'int',    slug: 'int',    when: 'Parse the string back to an integer (base=16)' },
    { name: 'round',  slug: 'round',  when: 'Rounding before display' },
  ],

  faq: [
    {
      q: 'How do I get hex WITHOUT the &quot;0x&quot; prefix?',
      a: 'Use format() or f-string with the "x" spec — cleaner and lets you pad.',
      code: 'format(255, "x")     # "ff"\nformat(255, "04x")   # "00ff"\nf"{255:x}"           # "ff"',
    },
    {
      q: 'How do I get UPPERCASE hex?',
      a: 'hex() is always lowercase. Use format(n, "X") for uppercase — capital X in the spec.',
    },
    {
      q: 'Does hex(-15) return two&apos;s complement?',
      a: 'No. Python uses arbitrary-precision integers and represents negatives as sign-magnitude in text: "-0xf". If you want two&apos;s complement for a fixed width, mask first: `format(-15 &amp; 0xff, "02x")`.',
    },
  ],

  history: [
    { version: '1.0', note: 'hex() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'Long integers unified with int — no more "L" suffix.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#hex',
    meta:  'hex',
  },

  tryInTool: [
    { name: 'Base64', href: '/tools/base64', meta: 'Adjacent byte-encoding work' },
  ],
};