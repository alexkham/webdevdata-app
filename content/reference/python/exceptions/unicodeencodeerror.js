// content/reference/python/exceptions/unicodeencodeerror.js
//
// NOTE: literals containing ${"\\"}u… are deliberate. Next 14.2.4's SWC
// compiles the TEXT "\\uDCE9" into a real lone surrogate, which breaks
// hydration. Injecting the backslash through a template expression is the
// only form verified to survive both its transform and its minifier.

export const meta = {
  slug:        'unicodeencodeerror',
  name:        'UnicodeEncodeError',
  signature:   'UnicodeEncodeError(encoding, object, start, end, reason)',
  blurb:       'Raised when a str contains characters the target encoding cannot represent.',
  category:    'type-value',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'unicodeencodeerror unicode encode error ascii codec can\'t encode character ordinal not in range 128 256 charmap character maps to undefined latin-1 cp1252 windows console print emoji surrogates not allowed str encode errors replace ignore xmlcharrefreplace',
};

export const method = {
  slug:      'unicodeencodeerror',
  name:      'UnicodeEncodeError',
  signature: 'UnicodeEncodeError(encoding, object, start, end, reason)',

  category:    'Type / value exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The text has a character the target encoding has no byte for — é in ASCII, € in Latin-1, an emoji in a cp1252 console. Positions are character indexes into the str.',

  chain: ['BaseException', 'Exception', 'ValueError', 'UnicodeError', 'UnicodeEncodeError'],

  cheat: {
    raisedBy: "s.encode('ascii'), print() to a cp1252 console, open(p, 'w', encoding='ascii')",
    message:  "'ascii' codec can't encode character '\\xe9' in position 3: ordinal not in range(128)",
    quickFix: "encode as 'utf-8', or pick an errors= handler",
    watchOut: 'a run of bad characters is reported as one range: position 0-2',
  },

  parameters: [
    { name: 'encoding', type: 'str', required: true, default: null, desc: "Codec name as shown in the message, e.g. 'ascii'. Stored in e.encoding." },
    { name: 'object',   type: 'str', required: true, default: null, desc: 'The whole str being encoded. Stored in e.object.' },
    { name: 'start',    type: 'int', required: true, default: null, desc: 'Index of the first character that cannot be encoded.' },
    { name: 'end',      type: 'int', required: true, default: null, desc: 'Index just after the last one. end - start == 1 shows the character itself in the message; a longer range shows "characters in position S-E".' },
    { name: 'reason',   type: 'str', required: true, default: null, desc: "Why encoding failed, e.g. 'ordinal not in range(128)'." },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Encode text as ASCII — only code points 0-127 fit. Consecutive non-ASCII characters are reported together as one range.',
      params: [{ name: 'text', type: 'str', hint: 'text to encode', input: 'text' }],
      template: "{$text}.encode('ascii')",
      cases: [
        { id: 'ascii',  label: 'plain ASCII', values: { text: 'hello' } },
        { id: 'accent', label: 'café',        values: { text: 'café' } },
        { id: 'run',    label: '日本語',       values: { text: '日本語 text' } },
        { id: 'emoji',  label: 'emoji',       values: { text: 'ok 👍' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'The same encode with four errors= handlers. Each one substitutes per character, never raising.',
      params: [{ name: 'text', type: 'str', hint: 'text to encode', input: 'text' }],
      template: "s = {$text}\n(s.encode('ascii', 'replace'),\n s.encode('ascii', 'ignore'),\n s.encode('ascii', 'xmlcharrefreplace'),\n s.encode('ascii', 'backslashreplace'))",
      cases: [
        { id: 'accent', label: 'naïve café', values: { text: 'naïve café' } },
        { id: 'emoji',  label: 'emoji',      values: { text: 'hi 😀' } },
        { id: 'cjk',    label: '日本',        values: { text: '日本' } },
      ],
    },
  ],
  demoExplainer: "Positions count characters, not bytes: the emoji in 'ok 👍' is position 3 even though it is 4 bytes in UTF-8. The character in the message is always an escape — \\xe9 for é, \\u65e5 for 日, \\U0001f44d for the emoji — so the message stays ASCII-safe. In Handle, xmlcharrefreplace gives &#233; for é, ready for HTML or XML.",

  attributes: [
    { name: 'encoding', type: 'str', meaning: "The codec that failed: 'ascii', 'latin-1', 'utf-8', or 'charmap' for table codecs such as cp1252." },
    { name: 'object',   type: 'str', meaning: 'The complete str that was being encoded.' },
    { name: 'start',    type: 'int', meaning: 'Character index of the first unencodable character. object[start:end] is the offending text.' },
    { name: 'end',      type: 'int', meaning: 'Character index just past the unencodable run.' },
    { name: 'reason',   type: 'str', meaning: "'ordinal not in range(128)' (ascii), 'ordinal not in range(256)' (latin-1), 'character maps to <undefined>' (charmap), 'surrogates not allowed' (utf-8)." },
    { name: 'args',     type: 'tuple', meaning: 'All five constructor arguments, in order.' },
  ],

  patterns: [
    {
      name: 'Write text files as UTF-8',
      desc: 'UTF-8 can encode every character except lone surrogates. Always pass encoding= so the platform default cannot bite.',
      code: "with open('report.txt', 'w', encoding='utf-8') as f:\n    f.write(text)",
    },
    {
      name: 'Make a console safe for any text',
      desc: "On a console whose encoding cannot show every character, switch stdout's error handler instead of crashing on the first emoji (Python 3.7+).",
      code: "import sys\nsys.stdout.reconfigure(errors='backslashreplace')\nprint('ok 👍')",
    },
    {
      name: 'ASCII-fold for slugs and identifiers',
      desc: 'Decompose accented letters first, then drop the combining marks — é becomes e instead of vanishing.',
      code: "import unicodedata\n\ndef ascii_fold(s):\n    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')",
    },
    {
      name: 'Report the offending characters',
      desc: 'object[start:end] is exactly the text that could not be encoded.',
      code: "try:\n    data = name.encode('latin-1')\nexcept UnicodeEncodeError as e:\n    bad = e.object[e.start:e.end]\n    raise ValueError(f'unsupported characters {bad!r} at {e.start}') from e",
    },
  ],

  examples: [
    { title: 'Non-ASCII to ASCII',          code: "'café'.encode('ascii')",               returns: "UnicodeEncodeError: 'ascii' codec can't encode character '\\xe9' in position 3: ordinal not in range(128)" },
    { title: 'UTF-8 encodes everything',    code: "'café'.encode('utf-8')",               returns: "b'caf\\xc3\\xa9'" },
    { title: 'A run is one error',          code: "'日本語'.encode('ascii')",              returns: "UnicodeEncodeError: 'ascii' codec can't encode characters in position 0-2: ordinal not in range(128)" },
    { title: '€ is not in Latin-1',         code: "'€5'.encode('latin-1')",               returns: "UnicodeEncodeError: 'latin-1' codec can't encode character '\\u20ac' in position 0: ordinal not in range(256)" },
    { title: 'Inspect the attributes',      code: "try:\n    'naïve'.encode('ascii')\nexcept UnicodeEncodeError as e:\n    info = (e.start, e.end, e.object[e.start:e.end], e.reason)\ninfo", returns: "(2, 3, 'ï', 'ordinal not in range(128)')" },
    { title: 'The Windows-console error',   code: "import io\nout = io.TextIOWrapper(io.BytesIO(), encoding='cp1252')\nout.write('ok 👍')", returns: "UnicodeEncodeError: 'charmap' codec can't encode character '\\U0001f44d' in position 3: character maps to <undefined>" },
    { title: 'HTML-safe fallback',          code: "'café'.encode('ascii', 'xmlcharrefreplace')", returns: "b'caf&#233;'" },
    { title: 'Lone surrogates never encode', code: "b'caf\\xe9'.decode('utf-8', 'surrogateescape').encode('utf-8')", returns: `UnicodeEncodeError: 'utf-8' codec can't encode character '${"\\"}udce9' in position 3: surrogates not allowed` },
  ],

  pitfalls: [
    {
      name: 'Writing a file with a narrow encoding',
      desc: 'The encoding argument of open() applies to every write(). A single non-ASCII character anywhere in the output fails the write.',
      wrong: { label: "encoding='ascii'", code: "with open('out.txt', 'w', encoding='ascii') as f:\n    f.write('Zoë')", output: "UnicodeEncodeError: 'ascii' codec can't encode character '\\xeb' in position 2: ordinal not in range(128)" },
      fix:   { label: "encoding='utf-8'", code: "with open('out.txt', 'w', encoding='utf-8') as f:\n    n = f.write('Zoë')\nn", output: '3' },
    },
    {
      name: "errors='ignore' deletes letters",
      desc: "Dropping unencodable characters turns Zoë into Zo. Normalize to NFKD first so the base letter survives.",
      wrong: { label: "encode(…, 'ignore')", code: "'Zoë'.encode('ascii', 'ignore')", output: "b'Zo'" },
      fix:   { label: 'NFKD, then ignore', code: "import unicodedata\nunicodedata.normalize('NFKD', 'Zoë').encode('ascii', 'ignore')", output: "b'Zoe'" },
    },
    {
      name: 'Undoing surrogateescape with the wrong handler',
      desc: 'Text decoded with errors=surrogateescape holds lone surrogates in place of bad bytes. Encode it with the same handler to get the original bytes back.',
      wrong: { label: 'plain encode', code: "text = b'caf\\xe9'.decode('utf-8', 'surrogateescape')\ntext.encode('utf-8')", output: `UnicodeEncodeError: 'utf-8' codec can't encode character '${"\\"}udce9' in position 3: surrogates not allowed` },
      fix:   { label: 'same handler', code: "text = b'caf\\xe9'.decode('utf-8', 'surrogateescape')\ntext.encode('utf-8', 'surrogateescape')", output: "b'caf\\xe9'" },
    },
  ],

  when: {
    use: [
      'Catch it where text leaves your program for a restricted encoding (legacy protocol, ASCII-only header)',
      'Use start/end/object to tell the user exactly which characters are not supported',
      'Raise it from a custom codec (with all five arguments)',
    ],
    avoid: [
      "Encoding to ASCII or Latin-1 when UTF-8 is allowed — use 'utf-8' and the error disappears",
      "errors='ignore' on user-visible text — it silently removes characters",
      'Catching it around print() — fix the stream encoding instead (PYTHONIOENCODING, -X utf8, reconfigure)',
    ],
  },

  notes: {
    cpython:        'Objects/unicodeobject.c — the ASCII/Latin-1 encoder extends the error to every consecutive unencodable character before raising',
    'Catch via':    'except UnicodeError (all three unicode errors) or except ValueError',
    'Message escapes': "The character is always printed as \\xNN, \\uNNNN or \\UNNNNNNNN, never literally — so the message itself can be printed anywhere",
    'charmap':      "Table-based codecs (cp1252, cp437, …) report their encoding as 'charmap' and the reason as 'character maps to <undefined>'",
  },

  related: [
    { name: 'UnicodeDecodeError', slug: 'unicodedecodeerror', when: 'The opposite direction: bytes → str' },
    { name: 'UnicodeError',       slug: 'unicodeerror',       when: 'Base class — catches encode and decode errors' },
    { name: 'str.encode',         slug: 'str-encode',         when: 'The method that raises it', category: 'functions' },
    { name: 'bytes.decode',       slug: 'bytes-decode',       when: 'Turn bytes back into text', category: 'functions' },
    { name: 'open',               slug: 'open',               when: "Pass encoding='utf-8' when writing", category: 'functions' },
    { name: 'print',              slug: 'print',              when: 'Encodes with the console encoding', category: 'functions' },
  ],

  faq: [
    {
      q: "How do I fix 'ascii' codec can't encode character?",
      a: "Something encoded your text as ASCII, which only covers code points 0-127. If you called .encode('ascii') yourself, use 'utf-8'. If it came from open(), pass encoding='utf-8'. If it came from print() or logging, the output stream's encoding (sys.stdout.encoding) cannot represent the character; set PYTHONIOENCODING=utf-8 or run python -X utf8.",
    },
    {
      q: "Why does print() raise 'charmap' codec can't encode character on Windows?",
      a: "print() encodes text with sys.stdout.encoding. When output is redirected to a file or pipe on Windows, that is often a legacy code page such as cp1252, which has no bytes for emoji or most non-Latin scripts. Set PYTHONIOENCODING=utf-8, run python -X utf8, or call sys.stdout.reconfigure(encoding='utf-8').",
    },
    {
      q: 'Is the position in the message a byte offset?',
      a: "No. For encode errors, start and end index the str being encoded — an emoji counts as one position. (UnicodeDecodeError is the other way round: its positions are byte offsets into the input bytes.)",
    },
    {
      q: 'What does "surrogates not allowed" mean?',
      a: "The str contains a lone surrogate (U+D800-U+DFFF), which is not a real character and cannot be encoded as UTF-8. It usually comes from decoding with errors='surrogateescape' (Python does this for undecodable file names and os.environ values on POSIX) — encode with errors='surrogateescape' to get the original bytes back.",
    },
    {
      q: 'Which errors= handlers are available for encoding?',
      a: "strict (default, raises), replace (? per character), ignore (drops it), xmlcharrefreplace (&#233;), backslashreplace (\\xe9), namereplace (\\N{LATIN SMALL LETTER E WITH ACUTE}) and surrogateescape / surrogatepass for round-tripping surrogates. You can register your own with codecs.register_error().",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#UnicodeEncodeError',
    meta:  'Built-in exceptions',
  },
};
