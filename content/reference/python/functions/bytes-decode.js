// content/reference/python/functions/bytes-decode.js

export const meta = {
  slug:        'bytes-decode',
  name:        'bytes.decode',
  signature:   "bytes.decode(encoding='utf-8', errors='strict')",
  blurb:       'Turn bytes into text — the step where the wrong encoding produces mojibake.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes decode utf-8 unicode text encoding mojibake latin-1 ascii unicodedecodeerror bytearray bytearray.decode',
};

export const method = {
  slug:      'bytes-decode',
  name:      'bytes.decode',
  signature: "bytes.decode(encoding='utf-8', errors='strict')",
  returns:   { type: 'str', desc: 'The text the bytes represent under the given encoding. Raises UnicodeDecodeError when the bytes are not valid for that encoding and errors is strict.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The boundary between bytes and text. Bytes carry no record of their own encoding, so decode is you asserting one — and the wrong assertion fails loudly or, worse, quietly.',

  cheat: {
    commonCall: "data.decode('utf-8')",
    returns:    'str — text, no longer bytes',
    replaces:   'str(data, encoding), which does the same thing',
    watchOut:   "str(data) without an encoding gives \"b'abc'\", not the text",
  },

  parameters: [
    { name: 'encoding', type: 'str', required: false, default: "'utf-8'", desc: "Codec name. 'utf-8' is the sane default; 'ascii' is strict; 'latin-1' accepts any byte and never raises." },
    { name: 'errors',   type: 'str', required: false, default: "'strict'", desc: "How to handle undecodable bytes: 'strict' raises, 'replace' inserts a replacement character, 'ignore' drops them." },
  ],

  demoParams: [
    { name: 's',        type: 'str', hint: 'text (encoded as utf-8 first)', input: 'text' },
    { name: 'encoding', type: 'str', hint: 'codec to decode with',          input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').decode({encoding})",
  cases: [
    { id: 'ascii-ok',   label: 'ascii text, utf-8',   values: { s: 'abc',   encoding: 'utf-8' } },
    { id: 'accent-ok',  label: 'accented, utf-8',     values: { s: 'héllo', encoding: 'utf-8' } },
    { id: 'accent-bad', label: 'accented, ascii (!)', values: { s: 'héllo', encoding: 'ascii' } },
    { id: 'mojibake',   label: 'accented, latin-1',   values: { s: 'héllo', encoding: 'latin-1' } },
    { id: 'empty',      label: 'empty',               values: { s: '',      encoding: 'utf-8' } },
  ],
  demoExplainer: 'The demo encodes your text as UTF-8, then decodes it with the codec you name — so the last three cases are the same bytes read three ways. Decoding as utf-8 gives the text back. Decoding as ascii RAISES, because the accented character needs a byte above 127. Decoding as latin-1 is the dangerous one: it succeeds and returns mojibake, because latin-1 maps every possible byte to some character and therefore can never fail.',

  patterns: [
    {
      name: 'Decode a network or file payload',
      desc: 'The standard boundary crossing, with the encoding stated explicitly.',
      code: "text = response.content.decode('utf-8')",
    },
    {
      name: 'Survive imperfect input',
      desc: 'replace keeps going and marks the damage rather than crashing.',
      code: "text = data.decode('utf-8', errors='replace')",
    },
    {
      name: 'Round-trip through bytes',
      desc: 'encode and decode are exact inverses when the codec matches.',
      code: "assert text.encode('utf-8').decode('utf-8') == text",
    },
  ],

  examples: [
    { title: 'ASCII',          code: "b'abc'.decode('utf-8')",       returns: "'abc'" },
    { title: 'Default is utf-8',code: "b'abc'.decode()",             returns: "'abc'" },
    { title: 'Wrong codec raises', code: "'é'.encode().decode('ascii')", returns: "UnicodeDecodeError: 'ascii' codec can't decode byte 0xc3 in position 0" },
    { title: 'latin-1 never fails', code: "'é'.encode().decode('latin-1')", returns: "'Ã©'  # mojibake" },
    { title: 'errors=replace',  code: "b'\\xff'.decode('utf-8', errors='replace')", returns: "'\\ufffd'" },
    { title: 'Empty',           code: "b''.decode()",                returns: "''" },
  ],

  pitfalls: [
    {
      name: 'latin-1 never raises, so it hides the bug',
      desc: 'Every one of the 256 byte values maps to a character in latin-1, so decoding always "works". People reach for it to silence a UnicodeDecodeError and end up storing mojibake, which surfaces much later and much further away.',
      wrong: { label: 'Silently wrong', code: "'héllo'.encode('utf-8').decode('latin-1')", output: "'hÃ©llo'" },
      fix:   { label: 'Match the codec', code: "'héllo'.encode('utf-8').decode('utf-8')", output: "'héllo'" },
    },
    {
      name: 'str(data) does not decode',
      desc: 'Calling str on bytes without an encoding gives you the REPR — the literal text b\'abc\', complete with the prefix and quotes. It is a common accident because it produces a plausible-looking string instead of an error.',
      wrong: { label: 'The repr', code: "str(b'abc')", output: "\"b'abc'\"" },
      fix:   { label: 'Decode properly', code: "b'abc'.decode('utf-8')", output: "'abc'" },
    },
    {
      name: 'Bytes carry no encoding information',
      desc: 'There is nothing in a bytes object recording how it was produced. decode is an assertion you are making, not a detection — and if the source and your assertion disagree, nothing checks it for you.',
      wrong: { label: 'Guessing', code: 'data.decode()   # hoping it is utf-8', output: 'right until it is not' },
      fix:   { label: 'Get it from the source', code: "charset = resp.headers.get_content_charset('utf-8')\ndata.decode(charset)", output: 'stated, not assumed' },
    },
    {
      name: 'errors=ignore deletes data',
      desc: 'It silently drops undecodable bytes, so the result is shorter than the input with nothing to indicate what went missing. replace at least leaves a visible marker.',
      wrong: { label: 'Data lost', code: "b'a\\xffb'.decode('utf-8', errors='ignore')", output: "'ab'  # the bad byte vanished" },
      fix:   { label: 'Mark the damage', code: "b'a\\xffb'.decode('utf-8', errors='replace')", output: "'a\\ufffdb'" },
    },
  ],

  when: {
    use: [
      'Converting a payload from a file, socket or subprocess into text',
      'Any boundary where bytes become something a person will read',
      'Round-tripping text through a byte-oriented channel',
    ],
    avoid: [
      'The data is genuinely binary — decoding an image is meaningless',
      'You only need a debug view → repr shows the bytes safely',
      'You do not know the encoding → find it out rather than guessing latin-1',
    ],
  },

  notes: {
    complexity: 'O(n) — every byte is examined',
    return:     'A new str; the bytes object is unchanged',
    cpython:    'Objects/bytesobject.c :: bytes_decode, dispatching to the codec registry',
    memory:     'Allocates a new string, which may be larger or smaller than the input',
    threadSafe: 'Yes — bytes and str are immutable',
  },

  related: [
    { name: 'str.encode',    slug: 'str-encode',    when: 'The inverse — text into bytes' },
    { name: 'bytes',         slug: 'bytes',         when: 'Create the bytes in the first place' },
    { name: 'str',           slug: 'str',           when: 'str(data, encoding) is the same operation' },
    { name: 'bytes.hex',     slug: 'bytes-hex',     when: 'Readable output for genuinely binary data' },
  ],

  faq: [
    {
      q: 'What is mojibake, and why does latin-1 cause it?',
      a: 'Mojibake is text decoded with the wrong codec — recognisable as sequences like Ã© where an accented character should be. latin-1 causes it because it maps all 256 byte values to characters, so it can never report an error; it just produces the wrong characters confidently.',
      code: "'é'.encode('utf-8').decode('latin-1')\n# 'Ã©'",
    },
    {
      q: 'How do I find out the right encoding?',
      a: 'From the source, not from the bytes. HTTP responses carry a charset header, files often have a documented encoding or a BOM, and databases have a connection encoding. Detection libraries like chardet only guess, and they guess wrong on short inputs.',
    },
    {
      q: 'Is decode the same as str(data, encoding)?',
      a: 'Yes, identical. The method form reads better in a pipeline. Be careful with str(data) and no encoding, though — that gives the repr rather than the decoded text.',
      code: "str(b'abc', 'utf-8') == b'abc'.decode('utf-8')\n# True",
    },
  ],

  history: [
    { version: '3.0', note: 'bytes and str split cleanly, making decode the required boundary crossing.' },
    { version: '3.1', note: "errors='surrogateescape' added, allowing lossless round trips of undecodable bytes." },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.decode',
    meta:  'bytes.decode',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect encoded byte data' },
  ],
};
