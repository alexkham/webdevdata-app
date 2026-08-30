// content/reference/python/functions/str-encode.js
//
// Slug is type-prefixed: `encode` is a str method.

export const meta = {
  slug:        'str-encode',
  name:        'str.encode',
  signature:   'str.encode(encoding="utf-8", errors="strict")',
  blurb:       'Convert a string to bytes using the given encoding — the string-to-bytes boundary.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'encode bytes utf-8 ascii latin-1 encoding decode charset unicode error strict',
};

export const method = {
  slug:      'str-encode',
  name:      'str.encode',
  signature: 'str.encode(encoding="utf-8", errors="strict")',
  returns:   { type: 'bytes', desc: 'A bytes object representing the string in the given encoding. Raises UnicodeEncodeError when the string contains characters not representable in that encoding, unless errors is set to "ignore", "replace", or another handler.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Cross the string→bytes boundary — the counterpart to bytes.decode(). Pick your encoding carefully.',

  cheat: {
    commonCall: 'name.encode("utf-8")',
    returns:    'a bytes object',
    replaces:   'the older `codecs.encode(s, encoding)` pattern',
    watchOut:   'default is utf-8 in Python 3 (ASCII in Python 2!); UnicodeEncodeError on out-of-range characters',
  },

  parameters: [
    { name: 'encoding', type: 'str', required: false, default: '"utf-8"', desc: 'The target encoding. Common: "utf-8" (universal), "ascii" (7-bit only), "latin-1" (Latin-1 / ISO-8859-1, single-byte), "utf-16", "cp1252" (Windows).' },
    { name: 'errors',   type: 'str', required: false, default: '"strict"', desc: 'Error handler. "strict" (default) raises UnicodeEncodeError. "ignore" drops unmappable chars. "replace" substitutes "?" (or "\\ufffd" for utf-8). "xmlcharrefreplace" and "backslashreplace" are also available.' },
  ],

  demoParams: [
    { name: 'string',   type: 'str', hint: 'the source string',           input: 'text' },
    { name: 'encoding', type: 'str', hint: 'utf-8 / ascii / latin-1',      input: 'text' },
  ],
  cases: [
    { id: 'utf8-basic',  label: 'basic utf-8',     values: { string: 'hello',    encoding: 'utf-8' } },
    { id: 'utf8-emoji',  label: 'utf-8 emoji',     values: { string: 'hi 😀',    encoding: 'utf-8' } },
    { id: 'utf8-accent', label: 'utf-8 accented',  values: { string: 'café',     encoding: 'utf-8' } },
    { id: 'ascii-ok',    label: 'ascii ok',        values: { string: 'hello',    encoding: 'ascii' } },
    { id: 'ascii-fail',  label: 'ascii fails on é', values: { string: 'café',     encoding: 'ascii' } },
    { id: 'latin1-ok',   label: 'latin-1 handles é', values: { string: 'café',    encoding: 'latin-1' } },
    { id: 'latin1-fail', label: 'latin-1 fails emoji', values: { string: 'hi 😀', encoding: 'latin-1' } },
    { id: 'empty',       label: 'empty string',    values: { string: '',         encoding: 'utf-8' } },
  ],
  demoExplainer: 'encode() converts str → bytes using the named encoding. UTF-8 handles ALL Unicode — the safe default. ASCII only handles codepoints 0..127 — any accented letter or emoji raises UnicodeEncodeError. Latin-1 handles the first 256 codepoints (adds Western European letters), still not enough for emoji. The demo uses errors=\"strict\", so mismatches raise the error message you would see in real code.',

  patterns: [
    {
      name: 'Convert for network transmission',
      desc: 'HTTP bodies, socket writes, and file IO in binary mode all expect bytes.',
      code: 'payload = json.dumps(data).encode("utf-8")\nsocket.send(payload)',
    },
    {
      name: 'Write to a binary file',
      desc: 'Files opened in binary mode expect bytes, not str.',
      code: 'with open("out.bin", "wb") as f:\n    f.write(text.encode("utf-8"))',
    },
    {
      name: 'Encode with error handler',
      desc: 'When a lossy conversion is acceptable, use "ignore" or "replace".',
      code: 'ascii_only = text.encode("ascii", errors="ignore")',
    },
    {
      name: 'Round-trip with decode',
      desc: 'encode then decode with the same encoding is an identity for successful cases.',
      code: 's == s.encode("utf-8").decode("utf-8")   # True for valid Unicode',
    },
  ],

  examples: [
    { title: 'Basic UTF-8',        code: '"hello".encode()',                       returns: "b'hello'" },
    { title: 'Emoji in UTF-8',     code: '"hi 😀".encode()',                       returns: "b'hi \\xf0\\x9f\\x98\\x80'" },
    { title: 'Accented in UTF-8',  code: '"café".encode("utf-8")',                 returns: "b'caf\\xc3\\xa9'" },
    { title: 'ASCII ok',           code: '"hello".encode("ascii")',                returns: "b'hello'" },
    { title: 'ASCII strict fails', code: '"café".encode("ascii")',                 returns: "UnicodeEncodeError" },
    { title: 'ASCII with ignore',  code: '"café".encode("ascii", errors="ignore")', returns: "b'caf'" },
    { title: 'ASCII with replace', code: '"café".encode("ascii", errors="replace")', returns: "b'caf?'" },
    { title: 'Latin-1 handles é',  code: '"café".encode("latin-1")',               returns: "b'caf\\xe9'" },
  ],

  pitfalls: [
    {
      name: 'ASCII cannot handle non-ASCII characters',
      desc: 'The most common encode error. ASCII is a 7-bit encoding — anything above codepoint 127 (accents, emoji, non-Latin scripts) raises UnicodeEncodeError. If you know you might have non-ASCII, use UTF-8 or an error handler.',
      wrong: { label: 'ASCII strict fails', code: '"café".encode("ascii")', output: "UnicodeEncodeError: 'ascii' codec can't encode character '\\xe9'" },
      fix:   { label: 'UTF-8 handles it',     code: '"café".encode("utf-8")', output: "b'caf\\xc3\\xa9'" },
    },
    {
      name: 'Default is UTF-8 in Python 3 (was ASCII in Python 2)',
      desc: 'A porting trap. Python 2\'s str.encode() defaulted to ASCII and often silently produced weird bytes. Python 3\'s default is UTF-8 and behavior is different — be explicit about encoding for portable code.',
      wrong: { label: 'Assumed ASCII', code: 'text.encode()   # Python 2 default was ASCII', output: 'behavior differed by version' },
      fix:   { label: 'Explicit encoding', code: 'text.encode("utf-8")', output: 'unambiguous everywhere' },
    },
    {
      name: 'errors="ignore" silently DROPS characters',
      desc: 'Convenient but dangerous. A field like \"José\" becomes \"Jos\" with ignore + ASCII — silent data loss. If the data matters, log or reject; do not just ignore.',
      wrong: { label: 'Silent loss', code: '"José".encode("ascii", errors="ignore")', output: "b'Jos'  # lost é" },
      fix:   { label: 'Log or fail',   code: 'try:\n    text.encode("ascii")\nexcept UnicodeEncodeError as e:\n    log.warning(...)', output: 'error visible' },
    },
    {
      name: 'UTF-8 byte count is NOT character count',
      desc: 'One character can be 1-4 bytes in UTF-8. `len(s)` counts characters; `len(s.encode("utf-8"))` counts BYTES. Confusing them causes off-by-one bugs in length limits.',
      wrong: { label: 'Miscounted length', code: 'len("café")\nlen("café".encode("utf-8"))', output: '4\n5  # é is 2 bytes' },
      fix:   { label: 'Pick which one',    code: '# character limit: use len(s)\n# byte limit: use len(s.encode("utf-8"))', output: 'clear intent' },
    },
  ],

  when: {
    use: [
      'Preparing text for network transmission (sockets, HTTP bodies)',
      'Writing to a binary-mode file',
      'Interfacing with libraries that take bytes',
      'Explicit conversion when the target encoding matters',
    ],
    avoid: [
      'Working in memory in Python only → str is more convenient than bytes',
      'You do not know what encoding to use → default to UTF-8',
      'Silent data loss is unacceptable → use errors="strict" and handle failures',
      'Byte-level manipulation — that is what bytes objects are for',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'A new bytes object; the string is unchanged',
    cpython:    'Objects/unicodeobject.c :: unicode_encode',
    memory:     'Allocates one bytes object of variable size (depends on encoding)',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.maketrans', slug: 'str-maketrans', when: 'Character-level translation before encoding' },
    { name: 'chr',           slug: 'chr',           when: 'Convert codepoint to character' },
    { name: 'ord',           slug: 'ord',           when: 'Convert character to codepoint' },
    { name: 'format',        slug: 'format',        when: 'Apply a spec before encoding' },
  ],

  faq: [
    {
      q: 'What encoding should I use?',
      a: 'UTF-8 is the default answer — it handles every Unicode character and is the universal internet standard. Use another encoding only when interfacing with a legacy system that requires it.',
    },
    {
      q: 'What is the difference between encode and decode?',
      a: 'encode: str → bytes. decode: bytes → str. Both need an encoding name. They are inverses when the encoding is valid and the data round-trips cleanly.',
    },
    {
      q: 'Why does \"café\".encode(\"utf-8\") give \"b\'caf\\xc3\\xa9\'\"?',
      a: 'Because \"é\" (codepoint U+00E9) is encoded as two bytes in UTF-8: 0xC3 0xA9. The escapes are how bytes are displayed. Latin-1 would give a single byte (0xE9) for the same character.',
    },
  ],

  history: [
    { version: '2.0', note: 'encode() introduced along with Unicode strings.' },
    { version: '3.0', note: 'Default encoding changed from ASCII to UTF-8; str is now Unicode by default.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.encode',
    meta:  'str.encode',
  },

  tryInTool: [
    { name: 'Base64 Encoder',  href: '/tools/base64',         meta: 'Encode bytes to base64' },
    { name: 'JSON Formatter',  href: '/tools/json-formatter', meta: 'Inspect string / byte data' },
  ],
};