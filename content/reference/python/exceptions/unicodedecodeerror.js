// content/reference/python/exceptions/unicodedecodeerror.js

export const meta = {
  slug:        'unicodedecodeerror',
  name:        'UnicodeDecodeError',
  signature:   'UnicodeDecodeError(encoding, object, start, end, reason)',
  blurb:       'Raised when bytes are not valid in the encoding they are decoded with.',
  category:    'type-value',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'unicodedecodeerror unicode decode error utf-8 codec can\'t decode byte invalid start byte invalid continuation byte unexpected end of data charmap position bytes decode encoding errors replace ignore backslashreplace latin-1 cp1252',
};

export const method = {
  slug:      'unicodedecodeerror',
  name:      'UnicodeDecodeError',
  signature: 'UnicodeDecodeError(encoding, object, start, end, reason)',

  category:    'Type / value exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The bytes are not valid in the codec you picked — almost always the data was written in a different encoding than you assumed. Positions are byte offsets, not character indexes.',

  chain: ['BaseException', 'Exception', 'ValueError', 'UnicodeError', 'UnicodeDecodeError'],

  cheat: {
    raisedBy: "b.decode('utf-8'), str(b, 'ascii'), open(p, encoding='utf-8').read()",
    message:  "'utf-8' codec can't decode byte 0xe9 in position 3: invalid continuation byte",
    quickFix: "decode with the real encoding, or errors='replace'",
    watchOut: 'position is a byte offset into e.object, not an index into the text',
  },

  parameters: [
    { name: 'encoding', type: 'str',   required: true, default: null, desc: "Codec name as shown in the message, e.g. 'utf-8'. Stored in e.encoding." },
    { name: 'object',   type: 'bytes', required: true, default: null, desc: 'The whole input being decoded (any bytes-like object is stored as bytes). Stored in e.object.' },
    { name: 'start',    type: 'int',   required: true, default: null, desc: 'Index of the first bad byte in object.' },
    { name: 'end',      type: 'int',   required: true, default: null, desc: 'Index just after the last bad byte. end - start == 1 gives the "byte 0x.. in position N" wording; a longer range gives "bytes in position S-E".' },
    { name: 'reason',   type: 'str',   required: true, default: null, desc: "Why decoding failed, e.g. 'invalid start byte'." },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'The classic wrong-codec bug: text saved as Latin-1 (one byte per accented letter) and read back as UTF-8.',
      params: [{ name: 'text', type: 'str', hint: 'text to round-trip', input: 'text' }],
      template: "{$text}.encode('latin-1').decode('utf-8')",
      cases: [
        { id: 'ascii', label: 'plain ASCII',   values: { text: 'hello' } },
        { id: 'end',   label: 'é at the end',  values: { text: 'café' } },
        { id: 'mid',   label: 'é mid-text',    values: { text: 'café au lait' } },
        { id: 'sz',    label: 'ß',             values: { text: 'Straße' } },
        { id: 'euro',  label: '€ (not Latin-1)', values: { text: '5 €' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Decode raw bytes (typed as hex) with three error handlers side by side. replace inserts U+FFFD per bad sequence, ignore drops it, backslashreplace keeps the byte values visible.',
      params: [{ name: 'hex', type: 'str', hint: 'bytes as hex, spaces allowed', input: 'text' }],
      template: "data = bytes.fromhex({$hex})\n(data.decode('utf-8', 'replace'),\n data.decode('utf-8', 'ignore'),\n data.decode('utf-8', 'backslashreplace'))",
      cases: [
        { id: 'valid',  label: 'valid café',      values: { hex: '63 61 66 c3 a9' } },
        { id: 'latin',  label: 'Latin-1 café',    values: { hex: '63 61 66 e9 21' } },
        { id: 'emoji',  label: 'cut-off emoji',   values: { hex: '68 69 f0 9f 98' } },
        { id: 'utf16',  label: 'UTF-16 BOM',      values: { hex: 'ff fe 68 00' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, é is the single byte 0xe9 in Latin-1. UTF-8 reads 0xe9 as the start of a 3-byte sequence: at the end of the data that is unexpected end of data, followed by a space it is an invalid continuation byte. '5 €' fails one step earlier — € does not exist in Latin-1, so encode() raises UnicodeEncodeError. In Handle, the cut-off emoji f0 9f 98 is one bad sequence: one U+FFFD, three escaped bytes.",

  attributes: [
    { name: 'encoding', type: 'str',   meaning: "The codec that failed, e.g. 'utf-8' — or 'charmap' for table-based codecs such as cp1252." },
    { name: 'object',   type: 'bytes', meaning: 'The complete input that was being decoded.' },
    { name: 'start',    type: 'int',   meaning: 'Byte offset of the first invalid byte. object[start:end] is the offending slice.' },
    { name: 'end',      type: 'int',   meaning: 'Byte offset just past the invalid sequence.' },
    { name: 'reason',   type: 'str',   meaning: "Short explanation: 'invalid start byte', 'invalid continuation byte', 'unexpected end of data', 'ordinal not in range(128)', …" },
    { name: 'args',     type: 'tuple', meaning: 'All five constructor arguments, in order.' },
  ],

  patterns: [
    {
      name: 'Always pass encoding= to open()',
      desc: "Without it, open() uses the platform's locale encoding (often cp1252 on Windows, UTF-8 elsewhere), so the same file can decode on one machine and fail on another.",
      code: "with open(path, encoding='utf-8') as f:\n    text = f.read()",
    },
    {
      name: 'Try UTF-8, fall back to a legacy codec',
      desc: 'Valid UTF-8 rarely happens by accident, so try it first. cp1252 accepts almost any byte, which makes it a reasonable fallback for Western European legacy files.',
      code: "def read_text(data: bytes) -> str:\n    try:\n        return data.decode('utf-8')\n    except UnicodeDecodeError:\n        return data.decode('cp1252', errors='replace')",
    },
    {
      name: 'Show where decoding failed',
      desc: 'The attributes pinpoint the bad bytes — print a little context around them.',
      code: "try:\n    text = data.decode('utf-8')\nexcept UnicodeDecodeError as e:\n    context = e.object[max(0, e.start - 10):e.end + 10]\n    raise ValueError(f'bad UTF-8 at byte {e.start}: {context!r}') from e",
    },
    {
      name: 'Round-trip unknown bytes with surrogateescape',
      desc: 'errors=surrogateescape decodes every invalid byte to a lone surrogate and encodes it back to the same byte — lossless for file names and pass-through data.',
      code: "text = data.decode('utf-8', errors='surrogateescape')\nassert text.encode('utf-8', errors='surrogateescape') == data",
    },
  ],

  examples: [
    { title: 'Latin-1 byte read as UTF-8',  code: "b'caf\\xe9'.decode('utf-8')",                        returns: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 3: unexpected end of data" },
    { title: 'Decode with the right codec', code: "b'caf\\xe9'.decode('latin-1')",                      returns: "'café'" },
    { title: 'Inspect the attributes',      code: "try:\n    b'ab\\xffcd'.decode('utf-8')\nexcept UnicodeDecodeError as e:\n    info = (e.encoding, e.start, e.end, e.reason, e.object[e.start:e.end])\ninfo", returns: "('utf-8', 2, 3, 'invalid start byte', b'\\xff')" },
    { title: 'Positions count bytes',       code: "data = 'día'.encode('utf-8') + b'\\xff'\ntry:\n    data.decode('utf-8')\nexcept UnicodeDecodeError as e:\n    pos = (len('día'), e.start)\npos", returns: '(3, 4)' },
    { title: 'Truncated multi-byte char',   code: "'😀'.encode('utf-8')[:3].decode('utf-8')",          returns: "UnicodeDecodeError: 'utf-8' codec can't decode bytes in position 0-2: unexpected end of data" },
    { title: 'UTF-16 data read as UTF-8',   code: "'\\ufeffhi'.encode('utf-16-le').decode('utf-8')",   returns: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xff in position 0: invalid start byte" },
    { title: 'Reading a file',              code: "with open('menu.txt', 'wb') as f:\n    f.write(b'caf\\xe9 au lait')\nwith open('menu.txt', encoding='utf-8') as f:\n    f.read()", returns: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 3: invalid continuation byte" },
    { title: "cp1252 has holes: 'charmap'", code: "b'\\x9d'.decode('cp1252')",                          returns: "UnicodeDecodeError: 'charmap' codec can't decode byte 0x9d in position 0: character maps to <undefined>\ndecoding with 'cp1252' codec failed" },
  ],

  pitfalls: [
    {
      name: "errors='ignore' silently loses letters",
      desc: 'Suppressing the error does not fix the encoding mismatch — it deletes the characters that proved it. Find the real codec instead.',
      wrong: { label: "errors='ignore'", code: "b'caf\\xe9'.decode('utf-8', errors='ignore')", output: "'caf'" },
      fix:   { label: 'The real codec', code: "b'caf\\xe9'.decode('cp1252')", output: "'café'" },
    },
    {
      name: 'Decoding a stream chunk by chunk',
      desc: 'A chunk boundary can split a multi-byte character; decoding each chunk separately then fails even though the data is valid. An incremental decoder keeps the partial bytes for the next call.',
      wrong: { label: 'chunk.decode()', code: "data = 'é'.encode('utf-8')\ndata[:1].decode('utf-8') + data[1:].decode('utf-8')", output: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xc3 in position 0: unexpected end of data" },
      fix:   { label: 'Incremental decoder', code: "import codecs\ndata = 'é'.encode('utf-8')\ndec = codecs.getincrementaldecoder('utf-8')()\ndec.decode(data[:1]) + dec.decode(data[1:])", output: "'é'" },
    },
    {
      name: 'str(bytes) does not decode',
      desc: "Trying to dodge the error with str() gives the repr of the bytes object — b'…' ends up inside your text.",
      wrong: { label: 'str(data)', code: "str(b'caf\\xc3\\xa9')", output: "\"b'caf\\\\xc3\\\\xa9'\"" },
      fix:   { label: 'data.decode()', code: "b'caf\\xc3\\xa9'.decode('utf-8')", output: "'café'" },
    },
  ],

  when: {
    use: [
      'Catch it where outside bytes (files, sockets, subprocess output) become text',
      'Use its start/end/object attributes to report exactly which bytes are bad',
      'Raise it from a custom codec (with all five arguments)',
    ],
    avoid: [
      "Hiding it with errors='ignore' when the real problem is the wrong codec",
      "Catching it just to retry with random encodings — latin-1 never fails, so it 'succeeds' with garbage",
      'Decoding at all when the data is binary (images, zip, pickle) — keep it as bytes',
    ],
  },

  notes: {
    cpython:       "Objects/unicodeobject.c + Objects/stringlib/codecs.h — the UTF-8 decoder reports the longest valid prefix of a broken sequence as one error (start..end)",
    'Catch via':   'except UnicodeError (all three unicode errors) or except ValueError',
    'charmap':     "Table-based codecs (cp1252, cp437, …) report their encoding as 'charmap' and the reason as 'character maps to <undefined>'; when called via bytes.decode() the traceback adds a note naming the real codec (decoding with 'cp1252' codec failed)",
    'BOM':         "Data starting with ff fe or fe ff is UTF-16; ef bb bf is a UTF-8 BOM — decode with 'utf-8-sig' to drop it",
  },

  related: [
    { name: 'UnicodeEncodeError', slug: 'unicodeencodeerror', when: 'The opposite direction: str → bytes' },
    { name: 'UnicodeError',       slug: 'unicodeerror',       when: 'Base class — catches decode and encode errors' },
    { name: 'ValueError',         slug: 'valueerror',         when: 'Grandparent class' },
    { name: 'bytes.decode',       slug: 'bytes-decode',       when: 'The method that raises it', category: 'functions' },
    { name: 'str.encode',         slug: 'str-encode',         when: 'Turn text back into bytes', category: 'functions' },
    { name: 'open',               slug: 'open',               when: 'Pass encoding= when reading text files', category: 'functions' },
  ],

  faq: [
    {
      q: "What does 'utf-8' codec can't decode byte 0x.. in position N mean?",
      a: "Byte number N (counting from 0) of the input is not valid UTF-8 at that point. The reason tells you more: invalid start byte means a byte that can never begin a character (0x80-0xc1, 0xf5-0xff — 0xff and 0xfe usually mean UTF-16 data); invalid continuation byte means a multi-byte sequence was cut short by an ordinary byte, the usual sign of Latin-1/cp1252 text; unexpected end of data means the input stops in the middle of a character.",
    },
    {
      q: 'How do I find out which encoding the data really uses?',
      a: "Look at the bad bytes: a single byte 0xe9, 0xe8 or 0xfc in otherwise ASCII text is Latin-1/cp1252 (é, è, ü); ff fe or fe ff at the start is UTF-16. If the source can tell you (HTTP Content-Type charset, XML declaration, file format spec), trust it over guessing. Third-party packages such as charset-normalizer can guess when nothing else helps.",
    },
    {
      q: "Why do I get 'charmap' codec can't decode byte on Windows?",
      a: "open() without encoding= uses the locale encoding, which on many Windows systems is cp1252. cp1252 leaves five byte values undefined (0x81, 0x8d, 0x8f, 0x90, 0x9d), and UTF-8 files often contain them, so reading a UTF-8 file fails with 'charmap' codec can't decode byte 0x9d. Pass encoding='utf-8' to open(), or run Python in UTF-8 mode (python -X utf8).",
    },
    {
      q: "What is the difference between errors='replace', 'ignore' and 'backslashreplace'?",
      a: "replace puts U+FFFD (�) in place of each bad sequence, ignore drops it, backslashreplace inserts the byte values as \\xNN text. errors='surrogateescape' maps each bad byte to a lone surrogate so the text can be encoded back to the identical bytes. The default, 'strict', raises UnicodeDecodeError.",
    },
    {
      q: 'Is UnicodeDecodeError a subclass of ValueError?',
      a: 'Yes: UnicodeDecodeError → UnicodeError → ValueError. except ValueError catches it, which also means a broad except ValueError around parsing code will swallow decoding problems — put except UnicodeDecodeError first if you need to treat it differently.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#UnicodeDecodeError',
    meta:  'Built-in exceptions',
  },
};
