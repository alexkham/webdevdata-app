// content/reference/python/stdlib/struct/error.js

export const meta = {
  slug:        'error',
  name:        'struct.error',
  signature:   'struct.error(message)',
  blurb:       'The exception struct raises for a bad format string, a wrong number of values, a value out of range or of the wrong type, and a buffer of the wrong size.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'struct.error struct error python bad char in struct format format requires number unpack requires a buffer of bytes pack expected items for packing required argument is not an integer argument for s must be a bytes object char format requires a bytes object of length 1 required argument is not a float int too large to convert total struct size too long repeat count given without format specifier embedded null character',
};

export const method = {
  slug:      'error',
  name:      'struct.error',
  signature: 'struct.error(message)',

  category:    'struct exception',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'A direct subclass of Exception — not ValueError, not TypeError — with one string argument describing the problem. A few struct failures are NOT struct.error: a float too large for "e"/"f" (OverflowError), a str where a buffer is needed (TypeError) and a non-ASCII format string (UnicodeEncodeError).',

  covers: ['error'],

  chain: ['BaseException', 'Exception', 'error'],

  cheat: {
    raisedBy: 'pack, unpack, calcsize, pack_into, unpack_from, iter_unpack, Struct()',
    message:  "'h' format requires -32768 <= number <= 32767",
    quickFix: 'except struct.error as e: report str(e)',
    watchOut: "except ValueError does not catch it",
  },

  parameters: [
    { name: 'message', type: 'str', required: true, default: null, desc: 'What went wrong; struct always passes exactly one string. str(e) is the message, e.args the 1-tuple.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: "Pack values with a format and let the error through: the last line of the traceback is what you see. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt',    type: 'str', hint: "e.g. '<B'", input: 'text' },
        { name: 'values', type: 'str', hint: 'e.g. 300,', input: 'text' },
      ],
      template: 'import ast, struct\nstruct.pack({$fmt}, *ast.literal_eval({$values}))',
      cases: [
        { id: 'badchar', label: 'bad char',        values: { fmt: '<y',  values: '1,' } },
        { id: 'range',   label: 'out of range',    values: { fmt: '<B',  values: '300,' } },
        { id: 'count',   label: 'wrong count',     values: { fmt: '<hh', values: '1,' } },
        { id: 'notint',  label: 'not an integer',  values: { fmt: '<i',  values: '1.5,' } },
        { id: 'str',     label: 'str for s',       values: { fmt: '<4s', values: "'text'," } },
        { id: 'char',    label: '2 bytes for c',   values: { fmt: '<c',  values: "b'ab'," } },
        { id: 'float',   label: 'str for f',       values: { fmt: '<f',  values: "'1.5'," } },
        { id: 'half',    label: 'e overflow',      values: { fmt: '<e',  values: '70000.0,' } },
      ],
    },
    {
      id: 'unpack',
      label: 'Trigger (unpack)',
      blurb: "unpack fails when the buffer length is not exactly the format size. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt', type: 'str', hint: "e.g. '<I'", input: 'text' },
        { name: 'hex', type: 'str', hint: 'hex bytes', input: 'text' },
      ],
      template: 'import struct\nstruct.unpack({$fmt}, bytes.fromhex({$hex}))',
      cases: [
        { id: 'short', label: 'too short',  values: { fmt: '<I',  hex: '010203' } },
        { id: 'long',  label: 'too long',   values: { fmt: '<H',  hex: '010203' } },
        { id: 'count', label: 'dangling 3', values: { fmt: '<3',  hex: '' } },
        { id: 'ok',    label: 'just right', values: { fmt: '<HB', hex: '010203' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: "Catch struct.error and keep its message. The e-format overflow is an OverflowError, so it passes through this except clause. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt',    type: 'str', hint: "e.g. '<B'", input: 'text' },
        { name: 'values', type: 'str', hint: 'e.g. 300,', input: 'text' },
      ],
      template: "import ast, struct\ntry:\n    struct.pack({$fmt}, *ast.literal_eval({$values}))\nexcept struct.error as e:\n    result = f'struct.error: {e}'\nelse:\n    result = 'packed fine'\nresult",
      cases: [
        { id: 'bad',  label: '300 as B',   values: { fmt: '<B', values: '300,' } },
        { id: 'good', label: '200 as B',   values: { fmt: '<B', values: '200,' } },
        { id: 'over', label: 'e overflow', values: { fmt: '<e', values: '70000.0,' } },
      ],
    },
  ],
  demoExplainer: "The traceback names the class struct.error. Range errors spell out the C range of the code; type errors say which kind of value the code needs. The message for a wrong-sized buffer gives the required size — for '<H' it is 2 bytes, and a 3-byte buffer fails just like a 1-byte one.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'A 1-tuple holding the message string.' },
  ],

  patterns: [
    {
      name: 'Turn it into a parsing error of your own',
      desc: 'Keep the original as __cause__ with raise ... from.',
      code: "import struct\n\nclass CorruptFile(Exception):\n    pass\n\ndef read_header(data):\n    try:\n        return struct.unpack('<4sHI', data[:10])\n    except struct.error as e:\n        raise CorruptFile(f'bad header: {e}') from e",
    },
    {
      name: 'Catch every packing failure',
      desc: "struct.error plus OverflowError (float too large for 'e' or 'f').",
      code: "import struct\ntry:\n    payload = struct.pack('<Hf', count, value)\nexcept (struct.error, OverflowError) as e:\n    print('cannot pack:', e)",
    },
  ],

  examples: [
    { title: 'Out of range',                code: "import struct\nstruct.pack('<B', 300)",                    returns: "struct.error: 'B' format requires 0 <= number <= 255" },
    { title: 'Unknown format character',    code: "import struct\nstruct.calcsize('<hz')",                   returns: 'struct.error: bad char in struct format' },
    { title: "Native-only code in '<' mode", code: "import struct\nstruct.calcsize('<P')",                   returns: 'struct.error: bad char in struct format' },
    { title: 'Wrong buffer size',           code: "import struct\nstruct.unpack('<I', b'\\x01\\x02')",       returns: 'struct.error: unpack requires a buffer of 4 bytes' },
    { title: 'Read the message',            code: "import struct\ntry:\n    struct.pack('<B', 300)\nexcept struct.error as e:\n    info = e.args\ninfo", returns: `("'B' format requires 0 <= number <= 255",)` },
    { title: 'Not a ValueError',            code: "import struct\nissubclass(struct.error, ValueError)",      returns: 'False' },
    { title: 'Float overflow is different', code: "import struct\nstruct.pack('<e', 1e6)",                    returns: 'OverflowError: float too large to pack with e format' },
    { title: 'Too big for a pointer',       code: "import struct\nstruct.pack('@P', 2 ** 64)",                returns: 'struct.error: int too large to convert' },
  ],

  pitfalls: [
    {
      name: 'Catching ValueError',
      desc: 'Bad numbers feel like a ValueError, but struct.error derives directly from Exception, so except ValueError lets it through.',
      wrong: { label: 'except ValueError',  code: "import struct\ntry:\n    struct.pack('<B', 300)\nexcept ValueError:\n    result = 'caught'\nresult",  output: "struct.error: 'B' format requires 0 <= number <= 255" },
      fix:   { label: 'except struct.error', code: "import struct\ntry:\n    struct.pack('<B', 300)\nexcept struct.error:\n    result = 'caught'\nresult", output: "'caught'" },
    },
    {
      name: 'Expecting struct.error for every struct failure',
      desc: "A float too large for 'e' or 'f' raises OverflowError, a str buffer raises TypeError and a non-ASCII format raises UnicodeEncodeError.",
      wrong: { label: 'struct.error only', code: "import struct\ntry:\n    struct.pack('<f', 1e39)\nexcept struct.error:\n    result = 'caught'\nresult", output: 'OverflowError: float too large to pack with f format' },
      fix:   { label: 'add OverflowError', code: "import struct\ntry:\n    struct.pack('<f', 1e39)\nexcept (struct.error, OverflowError):\n    result = 'caught'\nresult", output: "'caught'" },
    },
  ],

  when: {
    use: [
      'Around unpack of data from files or the network, which may be truncated or corrupt',
      'Around pack of user-supplied numbers that may not fit the field',
    ],
    avoid: [
      'Catching it to hide a wrong format string — that is a bug to fix, not a runtime condition',
      'Parsing str(e) to find the bad field — validate ranges before packing instead',
    ],
  },

  notes: {
    cpython:      'Created in Modules/_struct.c as a new exception class with Exception as its base; struct.error and _struct.error are the same object, and its __module__ is "struct"',
    'Messages':   "bad char in struct format · repeat count given without format specifier · embedded null character · total struct size too long · pack expected N items for packing (got M) · 'X' format requires lo <= number <= hi · required argument is not an integer / a float · argument for 's' (or 'p') must be a bytes object · char format requires a bytes object of length 1 · int too large to convert · unpack requires a buffer of N bytes · unpack_from / pack_into requires a buffer of at least … · not enough data to unpack N bytes at offset -K · no space to pack N bytes at offset -K · offset -K out of range for N-byte buffer · iterative unpacking requires a buffer of a multiple of N bytes · cannot iteratively unpack with a struct of length 0",
    'Not struct.error': "OverflowError (float too large to pack with e/f format), TypeError (a bytes-like object is required; Struct() argument 1 must be a str or bytes object), UnicodeEncodeError (non-ASCII format string)",
  },

  related: [
    { name: 'struct.pack',   slug: 'pack',   when: 'Range and type errors' },
    { name: 'struct.unpack', slug: 'unpack', when: 'Buffer-size errors' },
    { name: 'format characters', slug: 'format-characters', when: 'The valid codes and ranges' },
    { name: 'OverflowError', slug: 'overflowerror', when: "Raised instead for floats too large for 'e'/'f'", category: 'exceptions' },
    { name: 'try',           slug: 'try',           when: 'try / except / else', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What does "struct.error: unpack requires a buffer of 4 bytes" mean?',
      a: 'The bytes you passed are not exactly calcsize(format) long — here the format needs 4. Read or slice exactly that many bytes, or use struct.unpack_from to read one record from a longer buffer.',
    },
    {
      q: 'What does "struct.error: bad char in struct format" mean?',
      a: "A character in the format is not a valid code for its mode: a typo, a space between a count and its code ('2 h'), a second byte-order character, or a native-only code ('n', 'N', 'P') after '<', '>', '!' or '='.",
    },
    {
      q: 'How do I catch struct.error?',
      a: "import struct, then except struct.error as e: — the class lives in the struct module and is not a builtin. It is not a subclass of ValueError, so except ValueError will not catch it.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#struct.error',
    meta:  'struct.error',
  },

};
