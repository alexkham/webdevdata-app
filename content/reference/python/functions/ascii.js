// content/reference/python/functions/ascii.js

export const meta = {
  slug:        'ascii',
  name:        'ascii',
  signature:   'ascii(object)',
  blurb:       'Like repr(), but escapes every non-ASCII character with \\x, \\u, or \\U.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'ascii repr escape non-ascii unicode debug safe log printable pure ascii representation',
};

export const method = {
  slug:      'ascii',
  name:      'ascii',
  signature: 'ascii(object)',
  returns:   { type: 'str', desc: 'A string like repr(object), but every character outside the ASCII range (codepoint >= 128) is replaced with an escape sequence: \\xHH for U+0080..U+00FF, \\uXXXX for U+0100..U+FFFF, \\U00XXXXXX for U+10000+.' },

  category:    'Built-in function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The ASCII-safe cousin of repr() — same format, but non-ASCII becomes escape sequences.',

  cheat: {
    commonCall: 'log.debug("got %s", ascii(value))',
    returns:    'a str containing only ASCII characters',
    replaces:   'repr() when the output must fit an ASCII-only environment',
    watchOut:   'the output is pure ASCII but often LESS READABLE than repr(); use repr in modern UTF-8 environments',
  },

  parameters: [
    { name: 'object', type: 'Any', required: true, default: null, desc: 'Any value. Python calls repr() on it, then escapes every non-ASCII codepoint.' },
  ],

  demoParams: [
    { name: 'x', type: 'str', hint: 'any value', input: 'text' },
  ],
  cases: [
    { id: 'ascii',      label: 'plain ASCII',    values: { x: 'hello' } },
    { id: 'accent',     label: 'accented',        values: { x: 'café' } },
    { id: 'emoji',      label: 'emoji',           values: { x: 'hi 😀' } },
    { id: 'cyrillic',   label: 'cyrillic',        values: { x: 'Привет' } },
    { id: 'newline',    label: 'has newline',     values: { x: 'line1\nline2' } },
    { id: 'tab',        label: 'has tab',         values: { x: 'a\tb' } },
    { id: 'quote',      label: 'has quote',       values: { x: "don't" } },
    { id: 'empty',      label: 'empty',           values: { x: '' } },
  ],
  demoExplainer: 'ascii() is repr() with a filter: every character with codepoint &gt;= 128 becomes an escape sequence (\\xHH, \\uXXXX, or \\UXXXXXXXX). This produces output that is safe for ASCII-only sinks — old log formats, some file systems, protocols that mangle non-ASCII. In modern UTF-8 environments repr() is usually more readable.',

  patterns: [
    {
      name: 'ASCII-safe logging',
      desc: 'When the log destination cannot handle UTF-8, ascii() guarantees safe output.',
      code: 'log.error("bad name: %s", ascii(name))',
    },
    {
      name: 'Round-trip via eval',
      desc: 'ascii(x) is designed so eval(ascii(x)) recreates x for simple types.',
      code: 's = ascii("café")\n# "\'caf\\xe9\'"\neval(s)   # "café"',
    },
    {
      name: 'Diagnose invisible characters',
      desc: 'When two strings look the same but compare unequal, ascii() reveals hidden characters.',
      code: 'print(ascii(mystery_string))\n# reveals BOM, zero-width joiners, etc.',
    },
  ],

  examples: [
    { title: 'Plain ASCII',       code: 'ascii("hello")',        returns: '"\'hello\'"' },
    { title: 'Accent',            code: 'ascii("café")',         returns: '"\'caf\\\\xe9\'"' },
    { title: 'Emoji',             code: 'ascii("hi 😀")',        returns: '"\'hi \\\\U0001f600\'"' },
    { title: 'Cyrillic',          code: 'ascii("Привет")',       returns: '"\'\\\\u041f\\\\u0440...\'"' },
    { title: 'Newline shown',     code: 'ascii("a\\nb")',        returns: '"\'a\\\\nb\'"' },
    { title: 'Compare with repr', code: 'repr("café")\nascii("café")', returns: "'café'  vs  'caf\\xe9'" },
  ],

  pitfalls: [
    {
      name: 'ascii vs repr — same escape rules for control chars, different for non-ASCII',
      desc: 'Both quote strings and escape newlines / tabs / backslashes. The difference is only above U+007F: repr keeps the character as-is; ascii escapes it.',
      wrong: { label: 'Assumed identical', code: 'repr("café") == ascii("café")', output: 'False' },
      fix:   { label: 'Different scopes',  code: 'repr shows Unicode as Unicode; ascii escapes it', output: '' },
    },
    {
      name: 'Emoji become long \\U escapes',
      desc: 'Emoji sit above U+FFFF, so they become 8-digit \\U escapes. Output can grow surprisingly long for otherwise-short strings.',
      wrong: { label: '10-character escape', code: 'ascii("😀")', output: "'\\\\U0001f600'  # 10 chars for one grapheme" },
      fix:   { label: 'Use repr in UTF-8',    code: 'repr("😀")', output: "'😀'" },
    },
    {
      name: 'Not the same as encode(&quot;ascii&quot;, errors=&quot;backslashreplace&quot;)',
      desc: 'ascii() returns a str — a repr-shaped string with escapes. encode(&quot;ascii&quot;, errors=&quot;backslashreplace&quot;) returns bytes and does NOT add the surrounding quotes.',
      wrong: { label: 'Wrong output type', code: '"café".encode("ascii", errors="backslashreplace")', output: "b'caf\\\\xe9'  # bytes, no quotes" },
      fix:   { label: 'ascii() for str',   code: 'ascii("café")', output: "'\\'caf\\\\xe9\\''  # str with quotes" },
    },
  ],

  when: {
    use: [
      'ASCII-only log destinations (older syslog, protocols with limited charsets)',
      'Diagnostic output where non-ASCII characters would mangle',
      'Detecting invisible zero-width or BOM characters',
      'Environments where the terminal cannot render UTF-8',
    ],
    avoid: [
      'Modern UTF-8 environment → repr() is more readable',
      'JSON serialization → json.dumps has its own ensure_ascii option',
      'Displaying user-facing text → str() and print()',
      'Debug output that a human will read → repr() shows Unicode as Unicode',
    ],
  },

  notes: {
    complexity: 'O(n) in the output length',
    return:     'str — always, with only ASCII characters',
    cpython:    'Python/bltinmodule.c :: builtin_ascii',
    memory:     'Allocates one string; may be longer than input for non-ASCII',
    threadSafe: 'Yes for immutable inputs',
  },

  related: [
    { name: 'repr',      slug: 'repr',      when: 'The Unicode-preserving debug representation' },
    { name: 'str',       slug: 'str',       when: 'Human-facing string form' },
    { name: 'str.encode',slug: 'str-encode',when: 'Convert to bytes with an error handler' },
    { name: 'str.isascii', slug: 'str-isascii', when: 'Check whether a string is already ASCII-only' },
  ],

  faq: [
    {
      q: 'What is the difference between ascii() and repr()?',
      a: 'Both quote strings and escape control chars. repr keeps non-ASCII characters as-is (utf-8 safe). ascii escapes non-ASCII into \\x, \\u, or \\U sequences. Use repr in UTF-8 environments; ascii when the sink cannot handle non-ASCII.',
    },
    {
      q: 'Is ascii(x) always eval-able?',
      a: 'For simple built-in types (str, int, list, ...), yes: eval(ascii(x)) recreates x. Same guarantee as repr — and with the same limits (not always eval-able for custom classes).',
    },
    {
      q: 'Why does emoji become such a long escape?',
      a: 'Emoji use codepoints above U+FFFF. Python escapes them with \\U followed by 8 hex digits, giving a 10-character sequence for one character of input.',
    },
  ],

  history: [
    { version: '3.0', note: 'ascii() introduced to fill the gap left by Python 2&apos;s bytes-oriented repr behavior.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#ascii',
    meta:  'ascii',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};