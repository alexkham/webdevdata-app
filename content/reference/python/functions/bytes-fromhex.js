// content/reference/python/functions/bytes-fromhex.js
//
// Slug is type-prefixed: fromhex exists on float, bytes and bytearray.

export const meta = {
  slug:        'bytes-fromhex',
  name:        'bytes.fromhex',
  signature:   'bytes.fromhex(string)',
  blurb:       'Parse a hex string into bytes — spaces allowed, everything else rejected.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes fromhex parse hexadecimal string classmethod decode hex binary convert bytearray bytearray.fromhex',
};

export const method = {
  slug:      'bytes-fromhex',
  name:      'bytes.fromhex',
  signature: 'bytes.fromhex(string)',
  returns:   { type: 'bytes', desc: 'The bytes the hex digits represent. Raises ValueError, naming the exact position, for anything that is not a hex digit or a space.' },

  category:    'Bytes classmethod',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The inverse of bytes.hex. Unlike float.fromhex there is no 0x prefix and no ambiguity — but the digits must come in complete pairs.',

  cheat: {
    commonCall: "bytes.fromhex('616263')",
    returns:    'bytes — one byte per pair of digits',
    replaces:   'binascii.unhexlify, which is stricter about spaces',
    watchOut:   'an odd number of digits raises; spaces between bytes are fine',
  },

  parameters: [
    { name: 'string', type: 'str', required: true, default: null, desc: 'Hex digits in pairs. ASCII spaces between bytes are skipped. Upper and lower case both work. No 0x prefix is permitted.' },
  ],

  demoParams: [
    { name: 's', type: 'str', hint: 'hex digits, e.g. 616263', input: 'text' },
  ],
  demoTemplate: 'bytes.fromhex({s})',
  cases: [
    { id: 'plain',   label: 'plain digits',   values: { s: '616263' } },
    { id: 'spaced',  label: 'with spaces',    values: { s: '61 62 63' } },
    { id: 'empty',   label: 'empty',          values: { s: '' } },
    { id: 'odd',     label: 'odd length (!)', values: { s: '616' } },
    { id: 'invalid', label: 'not hex',        values: { s: 'zz' } },
  ],
  demoExplainer: 'Each pair of hex digits becomes one byte, so 616263 gives b\'abc\'. Spaces between bytes are skipped, which means output from hex(\' \') parses straight back. The two failure cases are worth reading closely, because the reported POSITION differs: "zz" fails at position 0, where the first bad character sits, while "616" fails at position 3 — the index where the missing fourth digit should have been.',

  patterns: [
    {
      name: 'Round-trip binary through text',
      desc: 'The exact inverse of hex, tolerant of the separator form.',
      code: "data = bytes.fromhex(text)\nassert data.hex() == text.replace(' ', '')",
    },
    {
      name: 'Binary literals in test fixtures',
      desc: 'Far easier to read and edit than a long escaped bytes literal.',
      code: "PACKET = bytes.fromhex('deadbeef')",
    },
    {
      name: 'Read a key or digest from config',
      desc: 'Hex is the usual text form for secrets and hashes.',
      code: "key = bytes.fromhex(os.environ['KEY_HEX'])",
    },
  ],

  examples: [
    { title: 'Plain digits',   code: "bytes.fromhex('616263')",   returns: "b'abc'" },
    { title: 'Spaces allowed', code: "bytes.fromhex('61 62 63')", returns: "b'abc'" },
    { title: 'Case-insensitive', code: "bytes.fromhex('DEADBEEF')", returns: "b'\\xde\\xad\\xbe\\xef'" },
    { title: 'Empty',          code: "bytes.fromhex('')",         returns: "b''" },
    { title: 'Odd length',     code: "bytes.fromhex('616')",      returns: 'ValueError: ... at position 3' },
    { title: 'Round trip',     code: "bytes.fromhex(b'abc'.hex())", returns: "b'abc'" },
  ],

  pitfalls: [
    {
      name: 'An odd number of digits raises',
      desc: 'Every byte needs exactly two digits, so a trailing lone digit is an error rather than an implied leading zero. Truncated input therefore fails loudly, which is the right behaviour but catches people slicing hex strings by hand.',
      wrong: { label: 'Incomplete pair', code: "bytes.fromhex('616')", output: 'ValueError: non-hexadecimal number found in fromhex() arg at position 3' },
      fix:   { label: 'Pad it',          code: "bytes.fromhex('0616')", output: "b'\\x06\\x16'" },
    },
    {
      name: 'No 0x prefix allowed',
      desc: 'Unlike float.fromhex, a prefix is a hard error — x is not a hex digit. Copying a value from a debugger or a C literal usually means stripping the prefix first.',
      wrong: { label: 'Prefix rejected', code: "bytes.fromhex('0x616263')", output: 'ValueError: non-hexadecimal number found in fromhex() arg at position 1' },
      fix:   { label: 'Strip it',        code: "bytes.fromhex('0x616263'.removeprefix('0x'))", output: "b'abc'" },
    },
    {
      name: 'Only ASCII spaces are skipped',
      desc: 'Spaces between bytes are fine, but colons, dashes and newlines are not. MAC addresses and colon-separated dumps need the separators removed first.',
      wrong: { label: 'Colons rejected', code: "bytes.fromhex('61:62:63')", output: 'ValueError: non-hexadecimal number found in fromhex() arg at position 2' },
      fix:   { label: 'Replace first',   code: "bytes.fromhex('61:62:63'.replace(':', ''))", output: "b'abc'" },
    },
    {
      name: 'It is a classmethod',
      desc: 'Call it on the type — bytes.fromhex(s). There is no bare fromhex function, and bytearray has its own version producing a mutable result.',
      wrong: { label: 'No such builtin', code: "fromhex('616263')", output: "NameError: name 'fromhex' is not defined" },
      fix:   { label: 'Call on the type', code: "bytes.fromhex('616263')", output: "b'abc'" },
    },
  ],

  when: {
    use: [
      'Reading back data written with bytes.hex',
      'Binary literals in tests, where hex beats escapes for readability',
      'Keys, digests and checksums arriving as text',
    ],
    avoid: [
      'Base64 input → base64.b64decode',
      'Separators other than spaces → strip them first',
      'The text is really text → encode it instead',
    ],
  },

  notes: {
    complexity: 'O(n) — a single pass over the digits',
    return:     'A new bytes object, half the length of the digit count',
    cpython:    'Objects/bytesobject.c :: bytes_fromhex',
    memory:     'Allocates a buffer half the size of the input string',
    threadSafe: 'Yes — bytes and str are immutable',
  },

  related: [
    { name: 'bytes.hex',     slug: 'bytes-hex',     when: 'Produce the string this method reads' },
    { name: 'bytes',         slug: 'bytes',         when: 'Build bytes from text or numbers instead' },
    { name: 'bytes.decode',  slug: 'bytes-decode',  when: 'The data is text rather than binary' },
    { name: 'float.fromhex', slug: 'float-fromhex', when: 'The float version, which DOES take a 0x prefix' },
  ],

  faq: [
    {
      q: 'Why does 616 fail at position 3 rather than 2?',
      a: 'Because position 3 is where the missing digit should have been. Python reports where parsing ran out, not where the last good pair ended — which makes the message point at what is absent rather than what is present.',
      code: "bytes.fromhex('616')\n# ValueError: ... at position 3",
    },
    {
      q: 'Does it accept colons, like a MAC address?',
      a: 'No — only ASCII spaces are skipped. Replace other separators first. Note that bytes.hex(sep) can produce them, so the two are not perfectly symmetrical unless you use a space.',
      code: "bytes.fromhex('de:ad'.replace(':', ''))",
    },
    {
      q: 'How is it different from float.fromhex?',
      a: 'Completely. This one reads pairs of digits into raw bytes and rejects a 0x prefix. float.fromhex reads a hexadecimal floating-point value, allows the prefix, and treats a bare "0.5" as hex — a trap this method does not have.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.fromhex added with the bytes type.' },
    { version: '3.7', note: 'Skipping of ASCII spaces extended to all whitespace positions between bytes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.fromhex',
    meta:  'bytes.fromhex',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Convert between binary encodings' },
  ],
};
