// content/reference/python/functions/str.js

export const meta = {
  slug:        'str',
  name:        'str',
  signature:   'str(object=&apos;&apos;, encoding=&apos;utf-8&apos;, errors=&apos;strict&apos;)',
  blurb:       'Convert any object to a string via __str__ (or decode bytes).',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'str string constructor convert cast decode bytes repr text format',
};

export const method = {
  slug:      'str',
  name:      'str',
  signature: 'str(object=&apos;&apos;, encoding=&apos;utf-8&apos;, errors=&apos;strict&apos;)',
  returns:   { type: 'str', desc: 'A string representation of object. For most types this calls __str__(); for bytes it decodes using the given encoding. No argument returns the empty string.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The str type constructor — turn any object into human-readable text, or decode bytes into a proper string.',

  cheat: {
    commonCall: 'str(value)',
    returns:    'always a str — safe on any input',
    replaces:   'the older `repr()` when human display is wanted, not debugging',
    watchOut:   'str(None) is "None"; str([1,2]) is "[1, 2]" — great for display, wrong for parsing',
  },

  parameters: [
    { name: 'object',   type: 'Any',   required: false, default: '""',       desc: 'Any value. No argument returns the empty string. For most types Python calls __str__(); if missing, falls back to __repr__().' },
    { name: 'encoding', type: 'str',   required: false, default: '"utf-8"',  desc: 'Only used when object is bytes or bytearray. Decodes the raw bytes as text.' },
    { name: 'errors',   type: 'str',   required: false, default: '"strict"', desc: 'Only used with bytes. Controls how decoding errors are handled — "strict" raises, "ignore" drops, "replace" substitutes.' },
  ],

  demoParams: [
    { name: 'x', type: 'str', hint: 'any value', input: 'text' },
  ],
  cases: [
    { id: 'text',       label: 'text',        values: { x: 'hello' } },
    { id: 'number',     label: 'number',      values: { x: '3.14' } },
    { id: 'integer',    label: 'integer',     values: { x: '42' } },
    { id: 'empty',      label: 'empty',       values: { x: '' } },
    { id: 'whitespace', label: 'whitespace',  values: { x: '   ' } },
    { id: 'unicode',    label: 'unicode',     values: { x: 'café' } },
    { id: 'emoji',      label: 'emoji',       values: { x: '🎉' } },
  ],
  demoExplainer: 'The demo takes a text input and passes it through str() — for text sources this is essentially the identity function. In real code the interesting cases are: str(number) → decimal notation, str(list) → "[1, 2, 3]", str(None) → "None", str(bytes, encoding) → decoded text. The demo cannot show every type, but it does confirm str() never raises on well-formed input.',

  patterns: [
    {
      name: 'Coerce for concatenation',
      desc: 'Python does not auto-convert; strings and numbers cannot be joined with `+`.',
      code: 'msg = "count = " + str(count)',
    },
    {
      name: 'Decode raw bytes',
      desc: 'Explicit encoding is safer than the implicit default.',
      code: 'text = str(payload, encoding="utf-8", errors="replace")',
    },
    {
      name: 'Human-readable dict / list',
      desc: 'str() on collections gives a Python-literal display — good for logs, wrong for JSON.',
      code: 'print("state:", str(config))   # {&apos;host&apos;: &apos;dev&apos;}',
    },
  ],

  examples: [
    { title: 'Empty default',       code: 'str()',                    returns: '""' },
    { title: 'Integer',             code: 'str(42)',                  returns: '"42"' },
    { title: 'Float',               code: 'str(3.14)',                returns: '"3.14"' },
    { title: 'None becomes text',   code: 'str(None)',                returns: '"None"' },
    { title: 'List looks like source', code: 'str([1, 2, 3])',           returns: '"[1, 2, 3]"' },
    { title: 'Dict looks like source', code: 'str({"a": 1})',            returns: '"{\'a\': 1}"' },
    { title: 'Decode bytes',        code: 'str(b"caf\\xc3\\xa9", "utf-8")',returns: '"café"' },
    { title: 'Bytes with no encoding', code: 'str(b"hi")',                returns: '"b\'hi\'"  # NOT decoded' },
  ],

  pitfalls: [
    {
      name: 'str(bytes) WITHOUT encoding gives the repr',
      desc: 'The single-arg form does not decode — it wraps the bytes as `b&apos;...&apos;` text. To decode, always pass encoding.',
      wrong: { label: 'Wrapped repr', code: 'str(b"hello")', output: '"b\'hello\'"  # not "hello"' },
      fix:   { label: 'Decode',       code: 'str(b"hello", "utf-8")', output: '"hello"' },
    },
    {
      name: 'str(None) is "None", not "" or an error',
      desc: 'Handy for logging, but confusing when a nullable field ends up rendered as the four-letter word &quot;None&quot; in your UI.',
      wrong: { label: 'Ugly UI', code: 'label = "user: " + str(user_id)   # user_id is None', output: '"user: None"' },
      fix:   { label: 'Guard first', code: 'label = "user: " + (str(user_id) if user_id is not None else "?")', output: '"user: ?"' },
    },
    {
      name: 'str() is NOT the JSON serializer',
      desc: 'str() on a dict uses Python single-quote repr — not valid JSON. Use json.dumps for interchange.',
      wrong: { label: 'Invalid JSON', code: 'str({"a": 1})', output: '"{\'a\': 1}"  # single quotes' },
      fix:   { label: 'Real JSON',    code: 'import json\njson.dumps({"a": 1})', output: '\'{"a": 1}\'  # double quotes' },
    },
    {
      name: 'str vs repr — different intents',
      desc: 'str is for humans, repr is for debugging. For most user-defined classes, only __repr__ is defined; str() falls back to it. Custom __str__ separates display from debug.',
      wrong: { label: 'Same output',  code: 'class Point:\n    def __repr__(self): return f"Point({self.x}, {self.y})"\n\nstr(Point(1, 2))', output: '"Point(1, 2)"  # repr fallback' },
      fix:   { label: 'Define __str__', code: 'class Point:\n    def __repr__(self): return f"Point({self.x}, {self.y})"\n    def __str__(self):  return f"({self.x}, {self.y})"', output: '"(1, 2)"' },
    },
  ],

  when: {
    use: [
      'Concatenating a value into a string message',
      'Converting between int/float/list and their text form',
      'Decoding bytes with an explicit encoding',
      'Building simple log lines or diagnostics',
    ],
    avoid: [
      'JSON output → json.dumps',
      'Number formatting with control (padding, precision) → f-string or format spec',
      'User-facing text where None should not appear as &quot;None&quot; → guard first',
      'Serializing objects for storage → pickle or json',
    ],
  },

  notes: {
    complexity: 'Depends on the type — usually O(n) in the resulting text length',
    return:     'str — always',
    cpython:    'Objects/unicodeobject.c :: unicode_new — dispatches to __str__ then __repr__',
    memory:     'Allocates one string',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'int',    slug: 'int',    when: 'Parse a numeric string back to an integer' },
    { name: 'float',  slug: 'float',  when: 'Parse a numeric string to a float' },
    { name: 'bool',   slug: 'bool',   when: 'Truthiness rather than text form' },
    { name: 'len',    slug: 'len',    when: 'Length of the resulting string' },
  ],

  faq: [
    {
      q: 'What is the difference between str() and repr()?',
      a: 'str() is for humans — clean, presentable output. repr() is for debugging — unambiguous, often eval-able. For built-in types like int and str they usually match; for containers and custom classes they typically differ.',
    },
    {
      q: 'How do I format numbers with control?',
      a: 'str() gives you the default decimal representation. For padding, precision, thousands separators, or scientific notation, reach for f-strings or the format spec.',
      code: 'f"{3.14159:.2f}"    # "3.14"\nf"{1_000_000:,}"    # "1,000,000"',
    },
    {
      q: 'Why does str(dict) use single quotes?',
      a: 'That is Python literal syntax — the same you would type. It is fine for logs but is not valid JSON. Use json.dumps when you need JSON.',
    },
  ],

  history: [
    { version: '1.0', note: 'str() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'str became Unicode by default; bytes became a separate type; decoding requires explicit encoding.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#func-str',
    meta:  'str',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Compare str vs JSON representation' },
  ],
};