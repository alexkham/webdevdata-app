// content/reference/python/functions/repr.js

export const meta = {
  slug:        'repr',
  name:        'repr',
  signature:   'repr(x)',
  blurb:       'The unambiguous, eval-friendly string representation — for debugging, not display.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'repr representation debug eval quoted string unambiguous string display print',
};

export const method = {
  slug:      'repr',
  name:      'repr',
  signature: 'repr(x)',
  returns:   { type: 'str', desc: 'The \"official\" string representation of the object, produced by calling __repr__(). For built-in types this is typically a valid Python literal that would recreate the object when passed to eval(). Never falls back to __str__.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The debug representation — unambiguous, quoted, and often eval-able. The str/repr split lets one object display two ways.',

  cheat: {
    commonCall: 'print(f"got x={x!r}")',
    returns:    'always a str — with quotes for strings, brackets for containers, and unambiguous marker chars',
    replaces:   'the older `xml.sax.saxutils.escape`-style hand escaping when you just want to SEE what a value is',
    watchOut:   'for user-defined classes, only __repr__ is usually defined; str() falls back to __repr__ but not the reverse',
  },

  parameters: [
    { name: 'x', type: 'Any', required: true, default: null, desc: 'Any value. Python calls __repr__() on it — every object has one, so repr never raises AttributeError on missing method.' },
  ],

  demoParams: [
    { name: 'x', type: 'str', hint: 'any value', input: 'text' },
  ],
  cases: [
    { id: 'text',       label: 'text',        values: { x: 'hello' } },
    { id: 'has-quote',  label: 'has a quote',  values: { x: "don't" } },
    { id: 'has-newline',label: 'has newline',  values: { x: 'line1\nline2' } },
    { id: 'has-tab',    label: 'has tab',      values: { x: 'a\tb' } },
    { id: 'empty',      label: 'empty',        values: { x: '' } },
    { id: 'unicode',    label: 'unicode',      values: { x: 'café' } },
    { id: 'number-like',label: 'number-like',  values: { x: '3.14' } },
  ],
  demoExplainer: 'repr wraps strings in quotes and escapes special characters — a newline becomes "\\n" in the output, a tab becomes "\\t", and internal quotes get escaped or the outer quote choice switches. That is by design: the output should be a valid Python literal you could paste back into code. str() would show the raw value; repr() shows how to type the same value.',

  patterns: [
    {
      name: 'Debug output',
      desc: 'The `!r` format spec calls repr — the idiomatic way to include diagnostic data.',
      code: 'logger.debug(f"received user={user!r} action={action!r}")',
    },
    {
      name: 'Custom __repr__ for your class',
      desc: 'A good __repr__ is unambiguous and, ideally, eval-able.',
      code: 'class Point:\n    def __repr__(self):\n        return f"Point({self.x!r}, {self.y!r})"',
    },
    {
      name: 'See through \"which quote\" ambiguity',
      desc: 'When a string could contain either kind of quote, repr picks and escapes.',
      code: 'print(repr("say \"hi\""))\n# "say \"hi\""  or  \'say "hi"\'',
    },
  ],

  examples: [
    { title: 'String gets quotes',  code: 'repr("hello")',     returns: '"\'hello\'"' },
    { title: 'Newline shown',       code: 'repr("a\\nb")',     returns: '"\'a\\\\nb\'"  # backslash + n' },
    { title: 'Tab escaped',         code: 'repr("a\\tb")',     returns: '"\'a\\\\tb\'"' },
    { title: 'Contains a quote',    code: 'repr("don\\\'t")', returns: '\'"don\\\'t"\'  # switches to double quotes' },
    { title: 'Integer',             code: 'repr(42)',          returns: '"42"' },
    { title: 'None',                code: 'repr(None)',        returns: '"None"' },
    { title: 'List',                code: 'repr([1, 2])',      returns: '"[1, 2]"' },
    { title: 'Empty is quoted',     code: 'repr("")',           returns: '"\'\'"' },
  ],

  pitfalls: [
    {
      name: 'repr is NOT the same as str',
      desc: 'str is for humans — clean, unambiguous only when it needs to be. repr is for debugging — unambiguous ALWAYS, including quoting strings and escaping newlines. Confusing them leads to logs that read like the string vanished or was truncated.',
      wrong: { label: 'Log shows raw', code: 'log.info(f"got {value}")   # value is "5\\t"\n# logs: got 5<TAB>', output: 'invisible tab in output' },
      fix:   { label: 'Log with repr', code: 'log.info(f"got {value!r}")', output: "got '5\\t'" },
    },
    {
      name: 'repr() is NOT always eval-able',
      desc: 'For built-in scalar types and simple containers it usually is. For objects, class instances, and file handles it typically is not — the docstring says \"typically\", and CPython honors that phrase.',
      wrong: { label: 'Assumed round-trip', code: 'eval(repr(user))', output: 'NameError: name User is not defined  # or worse' },
      fix:   { label: 'Never eval untrusted repr', code: '# repr is for HUMANS to read, not for machines to parse', output: '' },
    },
    {
      name: 'For your classes, define __repr__ FIRST',
      desc: 'If __str__ is missing, Python falls back to __repr__. The reverse is not true — no __repr__ and you get the default `<Foo object at 0x...>` from object. Define __repr__ once for both purposes; add __str__ only when human display differs.',
      wrong: { label: 'Missing repr', code: 'class Point: pass\nrepr(Point())', output: '<__main__.Point object at 0x7f...>' },
      fix:   { label: 'Define repr',  code: 'class Point:\n    def __repr__(self):\n        return f"Point(...)"', output: '"Point(...)"' },
    },
    {
      name: 'repr on a huge collection can be huge',
      desc: 'repr walks nested structures. Logging repr() of a 10 MB dict prints 10 MB of text. Truncate first if the object could be large.',
      wrong: { label: 'Log floods', code: 'log.debug(repr(giant_state))', output: '10 MB log line' },
      fix:   { label: 'Truncate',   code: 'log.debug(repr(giant_state)[:200] + "...")', output: 'bounded' },
    },
  ],

  when: {
    use: [
      'Debug / diagnostic output — logs, error messages, assertions',
      'f-string with !r spec for logging user-provided values',
      'Round-trippable data output for simple built-in types',
      'Defining __repr__ on your own classes',
    ],
    avoid: [
      'User-facing text → str is the correct tool',
      'JSON output → json.dumps',
      'Parsing objects — never eval a repr from untrusted input',
      'Very large collections — truncate first',
    ],
  },

  notes: {
    complexity: 'Depends on the object — usually O(size) of the resulting text',
    return:     'str — always',
    cpython:    'Python/bltinmodule.c :: builtin_repr — calls Py_TYPE(x)->tp_repr',
    memory:     'Allocates one string; for nested structures, may allocate substrings recursively',
    threadSafe: 'Yes for immutable inputs; not safe if the underlying object mutates during __repr__',
  },

  related: [
    { name: 'str',    slug: 'str',    when: 'Human-facing display of the same value' },
    { name: 'format', slug: 'format', when: 'Rich formatting with padding, precision, alignment' },
    { name: 'len',    slug: 'len',    when: 'Size before deciding whether to log the repr' },
  ],

  faq: [
    {
      q: 'What is the difference between str() and repr()?',
      a: 'str is for humans — clean, presentable, may lose information. repr is for debugging — unambiguous, includes quotes for strings and escapes for special characters. For simple built-in types they usually differ; for containers repr shows how you would type it, str is essentially the same as repr.',
    },
    {
      q: 'When would I use `!r` in an f-string?',
      a: 'Whenever the value should be shown as debuggable output — log messages, error messages, and diagnostic prints. `!r` calls repr on the value, which quotes strings and reveals hidden characters like tabs and newlines.',
    },
    {
      q: 'Should I define __repr__ or __str__ on my class?',
      a: 'Define __repr__ first — Python falls back to it for str() if __str__ is missing. Add __str__ only when human display differs from debug display. A good __repr__ is unambiguous and would ideally recreate the object if eval\'d.',
    },
  ],

  history: [
    { version: '1.0', note: 'repr() has been a builtin since Python 1.0.' },
    { version: '2.6', note: '`!r` format spec added for f-strings via PEP 3101 (later inherited by f-strings in 3.6).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#repr',
    meta:  'repr',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Compare repr vs JSON representation' },
  ],
};