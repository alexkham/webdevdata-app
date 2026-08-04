// content/reference/python/functions/str-isidentifier.js
//
// Slug is type-prefixed: `isidentifier` is a str method.

export const meta = {
  slug:        'str-isidentifier',
  name:        'str.isidentifier',
  signature:   'str.isidentifier()',
  blurb:       'True if the string could be a valid Python identifier — reserved keywords also pass.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'isidentifier identifier variable name valid python check keyword reserved underscore',
};

export const method = {
  slug:      'str-isidentifier',
  name:      'str.isidentifier',
  signature: 'str.isidentifier()',
  returns:   { type: 'bool', desc: 'True if the string is a syntactically valid Python identifier: starts with a letter or underscore (any Unicode letter, not just ASCII), followed by letters, digits, or underscores. Reserved keywords like `for` and `class` PASS this check — it is syntactic form, not usable-as-a-variable-name.' },

  category:    'String method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Test whether a string has the SHAPE of a Python identifier — not whether you can use it as a variable name.',

  cheat: {
    commonCall: 'if name.isidentifier():',
    returns:    'True or False',
    replaces:   'a manual regex like `^[a-zA-Z_][a-zA-Z0-9_]*$` — but the method is Unicode-aware',
    watchOut:   'reserved keywords (for, class, def, if, ...) return True — use keyword.iskeyword to filter them out',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'basic',       label: 'basic name',       values: { string: 'foo' } },
    { id: 'underscore',  label: 'with underscore',  values: { string: 'user_name' } },
    { id: 'private',     label: 'private (leading _)', values: { string: '_hidden' } },
    { id: 'with-digit',  label: 'name123',          values: { string: 'name123' } },
    { id: 'starts-digit',label: 'starts with digit', values: { string: '1abc' } },
    { id: 'has-space',   label: 'with space',       values: { string: 'user name' } },
    { id: 'has-dash',    label: 'with dash',        values: { string: 'my-name' } },
    { id: 'keyword',     label: 'keyword (True!)',  values: { string: 'for' } },
    { id: 'unicode',     label: 'unicode letters',  values: { string: 'café' } },
    { id: 'empty',       label: 'empty',            values: { string: '' } },
  ],
  demoExplainer: 'isidentifier() checks the SHAPE of a Python identifier: starts with a Unicode letter or underscore, followed by letters, digits, or underscores. Empty returns False. THE surprise: reserved keywords like &quot;for&quot;, &quot;class&quot;, &quot;def&quot; all pass because they have identifier shape — but assigning to them would be a SyntaxError. For a full &quot;can I use this as a variable name&quot; test, combine with keyword.iskeyword().',

  patterns: [
    {
      name: 'Validate a Python-name-shaped input',
      desc: 'The idiomatic check when accepting user-defined field names.',
      code: 'if not name.isidentifier():\n    raise ValueError("must be a valid Python identifier")',
    },
    {
      name: 'Full &quot;can I use this as a variable?&quot; check',
      desc: 'Combine with keyword.iskeyword to exclude reserved words.',
      code: 'import keyword\ndef is_usable_name(s):\n    return s.isidentifier() and not keyword.iskeyword(s)',
    },
    {
      name: 'Safe attribute access',
      desc: 'setattr can succeed even with non-identifier names — validate first for clean code.',
      code: 'if attr.isidentifier():\n    setattr(obj, attr, value)\nelse:\n    obj.__dict__[attr] = value',
    },
  ],

  examples: [
    { title: 'Basic',              code: '"foo".isidentifier()',           returns: 'True' },
    { title: 'With underscore',    code: '"user_name".isidentifier()',      returns: 'True' },
    { title: 'Leading underscore', code: '"_hidden".isidentifier()',        returns: 'True' },
    { title: 'With digit',         code: '"name123".isidentifier()',        returns: 'True' },
    { title: 'Starts with digit',  code: '"1abc".isidentifier()',           returns: 'False' },
    { title: 'Contains space',     code: '"user name".isidentifier()',      returns: 'False' },
    { title: 'Contains dash',      code: '"my-name".isidentifier()',        returns: 'False' },
    { title: 'Keyword is True',    code: '"for".isidentifier()',            returns: 'True  # surprising but correct' },
    { title: 'Unicode',            code: '"café".isidentifier()',           returns: 'True' },
    { title: 'Empty is False',     code: '"".isidentifier()',              returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Reserved keywords PASS isidentifier',
      desc: 'The most common surprise. `"for".isidentifier()` returns True — the string HAS identifier shape. Python enforces the keyword restriction at parse time, not at method call. For a &quot;could I use this as a variable name&quot; check, combine with keyword.iskeyword().',
      wrong: { label: 'Accepts keyword', code: '"class".isidentifier()', output: 'True' },
      fix:   { label: 'Filter keywords', code: 'import keyword\n"class".isidentifier() and not keyword.iskeyword("class")', output: 'False' },
    },
    {
      name: 'Dashes are NOT allowed — even in HTML-style attributes',
      desc: 'Python identifiers use underscores, not dashes. `"my-name"` is not a valid Python identifier. This bites people converting HTML attribute names or CSS variable names.',
      wrong: { label: 'Dash rejected', code: '"my-name".isidentifier()', output: 'False' },
      fix:   { label: 'Underscore instead', code: '"my_name".isidentifier()', output: 'True' },
    },
    {
      name: 'First character rules are STRICTER',
      desc: 'The first character must be a Unicode letter or underscore. Digits and most punctuation cannot start an identifier. This is why leading-digit strings fail even if they contain otherwise-valid characters.',
      wrong: { label: 'Digit start rejected', code: '"1st".isidentifier()', output: 'False' },
      fix:   { label: 'Prefix underscore',    code: '"_1st".isidentifier()', output: 'True' },
    },
    {
      name: 'Unicode identifiers are allowed — sometimes surprisingly',
      desc: 'Python 3 allows Unicode letters in identifiers. Names like &quot;café&quot; and &quot;π&quot; are valid identifiers. This can be a security or readability concern in shared codebases.',
      wrong: { label: 'Unicode passes', code: '"π".isidentifier()', output: 'True' },
      fix:   { label: 'ASCII-only check', code: 'name.isascii() and name.isidentifier()', output: 'False on non-ASCII' },
    },
  ],

  when: {
    use: [
      'Validating user-provided field or attribute names',
      'Safety check before dynamic attribute access',
      'Config-file key validation',
      'Combining with keyword.iskeyword for full &quot;usable name&quot; check',
    ],
    avoid: [
      'You need to reject reserved words → also check keyword.iskeyword',
      'You need ASCII-only names → combine with str.isascii',
      'You want lowercase snake_case only → regex or a custom validator',
      'Rich Unicode restrictions → third-party library or explicit character set',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_isidentifier — uses the same rules as the parser',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.isalpha', slug: 'str-isalpha', when: 'Letters-only check (no digits, underscores)' },
    { name: 'str.isalnum', slug: 'str-isalnum', when: 'Letters and digits, no underscore or leading-char rule' },
    { name: 'str.isascii', slug: 'str-isascii', when: 'Combine to restrict to ASCII identifiers' },
  ],

  faq: [
    {
      q: 'Why does &quot;for&quot;.isidentifier() return True?',
      a: 'Because isidentifier tests the SHAPE — starts with a letter or underscore, followed by letters, digits, or underscores. &quot;for&quot; matches that shape. Python rejects it as a variable name at parse time, not at method-call time. For a &quot;usable as a variable name&quot; check, add `keyword.iskeyword` to the test.',
    },
    {
      q: 'How do I check for &quot;could be a variable name in real code&quot;?',
      a: 'Combine with keyword.iskeyword.',
      code: 'import keyword\ndef is_usable(s):\n    return s.isidentifier() and not keyword.iskeyword(s)',
    },
    {
      q: 'Are Unicode identifiers really allowed?',
      a: 'Yes since Python 3.0 — the identifier grammar accepts Unicode letters. `café = 1` is legal Python. Whether you SHOULD use non-ASCII identifiers is a style question — most codebases stick to ASCII.',
    },
  ],

  history: [
    { version: '3.0', note: 'isidentifier() introduced along with Unicode-aware identifier rules (PEP 3131).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isidentifier',
    meta:  'str.isidentifier',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};