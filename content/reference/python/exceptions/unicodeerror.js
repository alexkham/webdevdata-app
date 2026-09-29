// content/reference/python/exceptions/unicodeerror.js

export const meta = {
  slug:        'unicodeerror',
  name:        'UnicodeError',
  signature:   'UnicodeError(*args)',
  blurb:       'Base class for encoding and decoding errors; also covers UnicodeTranslateError.',
  category:    'type-value',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'unicodeerror unicode error unicodetranslateerror unicode translate error unicodedecodeerror unicodeencodeerror encoding decoding codec error handler catch all text bytes',
};

export const method = {
  slug:      'unicodeerror',
  name:      'UnicodeError',
  signature: 'UnicodeError(*args)',

  category:    'Type / value exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The class to catch when any text/bytes conversion fails — you almost never see it raised bare, but except UnicodeError handles decode, encode and translate errors alike.',

  chain: ['BaseException', 'Exception', 'ValueError', 'UnicodeError'],

  cheat: {
    raisedBy: 'its subclasses: UnicodeDecodeError, UnicodeEncodeError, UnicodeTranslateError',
    message:  "codec name, position and reason: 'ascii' codec can't decode byte 0xc3 in position 2",
    quickFix: 'except UnicodeError catches all three',
    watchOut: 'decode positions are bytes, encode/translate positions are characters',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'A bare UnicodeError takes any arguments, like Exception. The subclasses require theirs: (encoding, object, start, end, reason) for decode/encode, (object, start, end, reason) for UnicodeTranslateError.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Encode text to UTF-8 bytes, then decode those bytes as ASCII. The failing position is a byte offset — count the bytes, not the letters.',
      params: [{ name: 'text', type: 'str', hint: 'text to round-trip', input: 'text' }],
      template: "{$text}.encode('utf-8').decode('ascii')",
      cases: [
        { id: 'ascii', label: 'plain ASCII', values: { text: 'hello' } },
        { id: 'naive', label: 'naïve',       values: { text: 'naïve' } },
        { id: 'late',  label: 'año',         values: { text: 'año' } },
        { id: 'cjk',   label: '日本',         values: { text: '日本' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catch the family with except UnicodeError and read the attributes every subclass shares: start, end and the offending slice of object.',
      params: [{ name: 'text', type: 'str', hint: 'text to round-trip', input: 'text' }],
      template: "data = {$text}.encode('utf-8')\ntry:\n    out = data.decode('ascii')\nexcept UnicodeError as e:\n    out = (type(e).__name__, e.start, e.end, e.object[e.start:e.end])\nout",
      cases: [
        { id: 'ascii', label: 'plain ASCII', values: { text: 'plain' } },
        { id: 'accent', label: 'crème',      values: { text: 'crème' } },
        { id: 'emoji', label: 'emoji',       values: { text: 'go 🚀' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'UnicodeTranslateError has no encoding — just the str, a start/end range and a reason. With end = start + 1 the message shows the character (as an escape), otherwise the range.',
      params: [
        { name: 'text',  type: 'str', hint: 'the object',       input: 'text' },
        { name: 'start', type: 'int', hint: 'first bad index',  input: 'number' },
        { name: 'end',   type: 'int', hint: 'one past the last', input: 'number' },
      ],
      template: "raise UnicodeTranslateError({$text}, {$start}, {$end}, 'not allowed here')",
      cases: [
        { id: 'one',   label: 'one char',  values: { text: 'a-b', start: '1', end: '2' } },
        { id: 'range', label: 'a range',   values: { text: 'a--b', start: '1', end: '3' } },
        { id: 'uni',   label: 'non-ASCII', values: { text: 'a→b', start: '1', end: '2' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, the position is the first non-ASCII BYTE: 'año' fails at 1 and 'naïve' at 2, both on 0xc3 — the first of the two bytes UTF-8 uses for ñ and ï. In Handle, the rocket in 'go 🚀' is four bytes, but ASCII decoding rejects bytes one at a time, so start/end cover only the first one. In Raise, even a plain '-' prints as '\\x2d': the translate message always escapes the character.",

  attributes: [
    { name: 'args',     type: 'tuple', meaning: 'Constructor arguments. A bare UnicodeError has only this — the attributes below exist on the three subclasses.' },
    { name: 'encoding', type: 'str | None', meaning: "Codec name on decode/encode errors; always None on UnicodeTranslateError." },
    { name: 'object',   type: 'bytes | str', meaning: 'The input being processed: bytes for UnicodeDecodeError, str for encode and translate errors.' },
    { name: 'start',    type: 'int', meaning: 'First bad index into object — a byte offset for decode, a character index otherwise.' },
    { name: 'end',      type: 'int', meaning: 'Index just past the bad range.' },
    { name: 'reason',   type: 'str', meaning: "Codec-specific explanation, e.g. 'ordinal not in range(128)'." },
  ],

  patterns: [
    {
      name: 'One handler for both directions',
      desc: 'Code that decodes input and encodes output can treat every conversion failure the same way.',
      code: "def convert(data, src='utf-8', dst='latin-1'):\n    try:\n        return data.decode(src).encode(dst)\n    except UnicodeError as e:\n        raise ValueError(f'cannot convert: {e}') from e",
    },
    {
      name: 'Custom error handler',
      desc: 'codecs.register_error() receives the UnicodeError subclass instance and returns (replacement, resume_position). Check the type to support the directions you want.',
      code: "import codecs\n\ndef dash(e):\n    if isinstance(e, UnicodeEncodeError):\n        return ('-' * (e.end - e.start), e.end)\n    raise e\n\ncodecs.register_error('dash', dash)\nsafe = 'naïve'.encode('ascii', 'dash')",
    },
    {
      name: 'Specific before general',
      desc: 'UnicodeError is a ValueError, so order the except clauses from narrow to broad.',
      code: "try:\n    value = int(raw.decode('utf-8'))\nexcept UnicodeError:\n    value = None  # undecodable bytes\nexcept ValueError:\n    value = 0     # decodable, but not a number",
    },
  ],

  examples: [
    { title: 'Catches encode errors',        code: "try:\n    'é'.encode('ascii')\nexcept UnicodeError as e:\n    kind = type(e).__name__\nkind", returns: "'UnicodeEncodeError'" },
    { title: 'Catches decode errors',        code: "try:\n    b'\\xff'.decode('utf-8')\nexcept UnicodeError as e:\n    kind = type(e).__name__\nkind", returns: "'UnicodeDecodeError'" },
    { title: 'It is a ValueError',           code: 'issubclass(UnicodeError, ValueError)', returns: 'True' },
    { title: 'Bare UnicodeError has no start', code: "UnicodeError('bad text').start",    returns: "AttributeError: 'UnicodeError' object has no attribute 'start'" },
    { title: 'UnicodeTranslateError message', code: "str(UnicodeTranslateError('abc', 1, 2, 'bad'))", returns: "\"can't translate character '\\\\x62' in position 1: bad\"" },
    { title: 'Translate error has no encoding', code: "e = UnicodeTranslateError('abc', 0, 3, 'bad')\n(e.encoding, e.object, str(e))", returns: "(None, 'abc', \"can't translate characters in position 0-2: bad\")" },
    { title: 'Error handlers accept it',     code: "import codecs\ncodecs.replace_errors(UnicodeTranslateError('abc', 1, 2, 'bad'))", returns: "('�', 2)" },
  ],

  pitfalls: [
    {
      name: 'except ValueError first swallows UnicodeError',
      desc: 'Clauses are tried in order and UnicodeError is a ValueError subclass, so a ValueError clause placed first catches encoding problems too.',
      wrong: { label: 'General first', code: "try:\n    b'\\xff'.decode('utf-8')\nexcept ValueError:\n    kind = 'bad number'\nexcept UnicodeError:\n    kind = 'bad text'\nkind", output: "'bad number'" },
      fix:   { label: 'Specific first', code: "try:\n    b'\\xff'.decode('utf-8')\nexcept UnicodeError:\n    kind = 'bad text'\nexcept ValueError:\n    kind = 'bad number'\nkind", output: "'bad text'" },
    },
    {
      name: 'Slicing text with a decode position',
      desc: 'A decode error\'s start is an offset into the bytes (e.object). Using it on the decoded text misses whenever earlier characters took more than one byte.',
      wrong: { label: 'text[:e.start]', code: "data = 'día 1'.encode('utf-8') + b'\\xff'\ntry:\n    data.decode('utf-8')\nexcept UnicodeError as e:\n    good = data.decode('utf-8', 'replace')[:e.start]\ngood", output: "'día 1�'" },
      fix:   { label: 'data[:e.start]', code: "data = 'día 1'.encode('utf-8') + b'\\xff'\ntry:\n    data.decode('utf-8')\nexcept UnicodeError as e:\n    good = data[:e.start].decode('utf-8')\ngood", output: "'día 1'" },
    },
  ],

  when: {
    use: [
      'Catching any encode/decode failure with one except clause',
      'Type-checking the instance passed to a custom codecs error handler',
      'UnicodeTranslateError: raising it from a custom translation codec',
    ],
    avoid: [
      'Raising a bare UnicodeError — raise the specific subclass with its five (or four) arguments',
      'Catching it when only one direction can fail — name UnicodeDecodeError or UnicodeEncodeError directly',
      "str.translate() problems — it never raises UnicodeTranslateError; unmapped characters are kept as-is",
    ],
  },

  notes: {
    cpython:          'Objects/exceptions.c — UnicodeError is a plain ValueError subclass; the three subclasses add encoding/object/start/end/reason and their own __str__',
    'Subclasses':     'UnicodeDecodeError (bytes → str), UnicodeEncodeError (str → bytes), UnicodeTranslateError (str → str)',
    'Catch via':      'except UnicodeError, or except ValueError for the broader family',
    'Translate error': "Handlers like replace and backslashreplace accept it; xmlcharrefreplace raises TypeError: don't know how to handle UnicodeTranslateError in error callback",
  },

  related: [
    { name: 'UnicodeDecodeError', slug: 'unicodedecodeerror', when: 'bytes → str failed' },
    { name: 'UnicodeEncodeError', slug: 'unicodeencodeerror', when: 'str → bytes failed' },
    { name: 'ValueError',         slug: 'valueerror',         when: 'Parent class' },
    { name: 'str.encode',         slug: 'str-encode',         when: 'Text to bytes', category: 'functions' },
    { name: 'bytes.decode',       slug: 'bytes-decode',       when: 'Bytes to text', category: 'functions' },
    { name: 'str.translate',      slug: 'str-translate',      when: 'Character mapping — never raises UnicodeTranslateError', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between UnicodeError, UnicodeDecodeError and UnicodeEncodeError?',
      a: 'UnicodeError is the common base class. UnicodeDecodeError is raised when bytes cannot be turned into text (bytes.decode, reading a file), UnicodeEncodeError when text cannot be turned into bytes (str.encode, writing or printing). In real code you almost always see one of the subclasses; catch UnicodeError when you want to handle both.',
    },
    {
      q: 'When is UnicodeTranslateError raised?',
      a: "Rarely. It describes a failure while translating str to str inside the codec machinery and takes (object, start, end, reason) — no encoding, so e.encoding is None. str.translate() never raises it: unmapped characters are simply left alone. You mainly meet it in custom codecs and codecs error handlers, which receive it like the other two subclasses.",
    },
    {
      q: 'Why does the position in a decode error not match the character index?',
      a: "Decode errors count bytes of the input; everything before the error may contain multi-byte characters (UTF-8 uses 2-4 bytes for anything outside ASCII). Encode and translate errors count characters of the str. Slice e.object[e.start:e.end] to see the offending part instead of indexing other strings with it.",
    },
    {
      q: 'Should I catch UnicodeError or ValueError?',
      a: 'UnicodeError, when you mean encoding problems. except ValueError also catches int() failures, unpacking errors and json.JSONDecodeError — too broad if you want to report "bad text encoding" specifically.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#UnicodeError',
    meta:  'Built-in exceptions',
  },
};
