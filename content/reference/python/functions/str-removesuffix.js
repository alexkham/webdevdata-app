// content/reference/python/functions/str-removesuffix.js
//
// Slug is type-prefixed: `removesuffix` is a str method (also on bytes).

export const meta = {
  slug:        'str-removesuffix',
  name:        'str.removesuffix',
  signature:   'str.removesuffix(suffix)',
  blurb:       'Remove an exact trailing substring — safer than rstrip for suffix stripping.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 3.9+',
  searchTerms: 'removesuffix remove suffix substring strip trailing exact intent safe modern extension',
};

export const method = {
  slug:      'str-removesuffix',
  name:      'str.removesuffix',
  signature: 'str.removesuffix(suffix)',
  returns:   { type: 'str', desc: 'A copy of the string with the exact SUBSTRING `suffix` removed from the end, IF the string ends with it. Otherwise the string is returned unchanged. Removes at most one occurrence.' },

  category:    'String method',
  version:     'Python 3.9+',
  hasLiveDemo: true,

  subtitle: 'Strip an exact suffix — the intent-preserving alternative to rstrip that does not surprise you with character-set semantics.',

  cheat: {
    commonCall: 'name.removesuffix(".py")',
    returns:    'new str — the original is unchanged',
    replaces:   'the classic `s[:-len(suffix)] if s.endswith(suffix) else s` idiom',
    watchOut:   'exact substring match — not a set of characters like rstrip',
  },

  parameters: [
    { name: 'suffix', type: 'str', required: true, default: null, desc: 'The exact substring to remove from the end. If the string does not end with this exact substring, the original is returned unchanged.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',   input: 'text' },
    { name: 'suffix', type: 'str', hint: 'exact suffix', input: 'text' },
  ],
  cases: [
    { id: 'basic',      label: 'basic',           values: { string: 'basename.py', suffix: '.py' } },
    { id: 'log',        label: 'log extension',   values: { string: 'access.log',  suffix: '.log' } },
    { id: 'no-match',   label: 'not a suffix',    values: { string: 'hello',       suffix: 'xy' } },
    { id: 'exact',      label: 'string == suffix',values: { string: 'hello',       suffix: 'hello' } },
    { id: 'once-only',  label: 'removes once',    values: { string: 'test.py.py',  suffix: '.py' } },
    { id: 'empty-suf',  label: 'empty suffix',    values: { string: 'hello',       suffix: '' } },
    { id: 'empty-str',  label: 'empty string',    values: { string: '',            suffix: 'x' } },
  ],
  demoExplainer: 'removesuffix strips an EXACT substring from the end — at most once. If the string does not end with the suffix, the original is returned unchanged. Unlike rstrip, the argument is a substring, not a character set — ".py" removes exactly ".py" once, not any trailing \".\", \"p\", or \"y\" characters in any order.',

  patterns: [
    {
      name: 'Strip a file extension',
      desc: 'The canonical use case — clean and unambiguous.',
      code: 'stem = filename.removesuffix(".py")',
    },
    {
      name: 'Drop a version suffix',
      desc: 'Trim exact known suffixes without slicing math.',
      code: 'name = package.removesuffix("-1.0.0")',
    },
    {
      name: 'Symmetric prefix + suffix strip',
      desc: 'Chain removeprefix and removesuffix for wrapped strings.',
      code: 'inner = s.removeprefix("(").removesuffix(")")',
    },
  ],

  examples: [
    { title: 'File extension',       code: '"basename.py".removesuffix(".py")',   returns: '"basename"' },
    { title: 'Log extension',        code: '"access.log".removesuffix(".log")',   returns: '"access"' },
    { title: 'Not a suffix',         code: '"hello".removesuffix("xy")',          returns: '"hello"  # unchanged' },
    { title: 'String == suffix',     code: '"hello".removesuffix("hello")',       returns: '""' },
    { title: 'Removes once only',    code: '"test.py.py".removesuffix(".py")',    returns: '"test.py"  # not "test"' },
    { title: 'Empty suffix is no-op', code: '"hello".removesuffix("")',            returns: '"hello"' },
  ],

  pitfalls: [
    {
      name: 'Removes AT MOST ONE occurrence',
      desc: 'removesuffix strips the suffix once and stops. Doubled suffixes (or triple, etc.) leave the rest in place. Loop or use a while for multi-removal.',
      wrong: { label: 'One shot',  code: '"test.py.py".removesuffix(".py")', output: '"test.py"  # still has ".py"' },
      fix:   { label: 'Loop for all', code: 's = "test.py.py"\nwhile s.endswith(".py"):\n    s = s.removesuffix(".py")', output: '"test"' },
    },
    {
      name: 'Empty suffix returns the original unchanged',
      desc: 'Passing "" is a no-op — every string trivially ends with the empty string, but removing 0 characters leaves the original alone.',
      wrong: { label: 'Empty is no-op', code: '"hello".removesuffix("")', output: '"hello"' },
      fix:   { label: 'Guard for empty', code: 'if suffix:\n    s = s.removesuffix(suffix)', output: 'explicit intent' },
    },
    {
      name: 'Different from rstrip — exact match, not character set',
      desc: 'This is the whole point of the method. rstrip(".py") strips any trailing \".\", \"p\", or \"y\" in any order and any repetition. removesuffix(".py") only matches the literal suffix \".py\".',
      wrong: { label: 'rstrip over-strips', code: '"happy.py".rstrip(".py")', output: '"ha"  # ate every trailing "y", "p", "."' },
      fix:   { label: 'removesuffix is precise', code: '"happy.py".removesuffix(".py")', output: '"happy"  # just the last three chars' },
    },
    {
      name: 'Not available before Python 3.9',
      desc: 'Added in 3.9. On older Pythons use the classic idiom.',
      wrong: { label: 'AttributeError on 3.8', code: '"basename.py".removesuffix(".py")   # 3.8', output: "AttributeError: 'str' object has no attribute 'removesuffix'" },
      fix:   { label: 'Portable idiom',         code: 'def removesuffix(s, x):\n    return s[:-len(x)] if x and s.endswith(x) else s', output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'Stripping a KNOWN, exact trailing substring',
      'File extension removal',
      'Version or namespace suffix trimming',
      'Any place rstrip would have been the wrong tool because of character-set semantics',
    ],
    avoid: [
      'Multi-occurrence removal → loop with while + endswith',
      'Character-set removal → str.rstrip is the correct tool',
      'Case-insensitive suffix removal → casefold both sides, or use regex',
      'Python 3.8 or earlier → use the s[:-len(x)] idiom instead',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan to test the suffix, then one slice',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: unicode_removesuffix — introduced with PEP 616',
    memory:     'Allocates one new string when the suffix matched; returns the original when not',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.removeprefix',  slug: 'str-removeprefix',  when: 'The mirror — exact prefix instead of suffix' },
    { name: 'rstrip',            slug: 'rstrip',            when: 'You wanted a CHARACTER SET, not an exact suffix' },
    { name: 'endswith',          slug: 'endswith',          when: 'Just checking a suffix, not removing' },
    { name: 'replace',           slug: 'replace',           when: 'Substitute anywhere in the string, not just at the end' },
  ],

  faq: [
    {
      q: 'Why not just use rstrip?',
      a: 'Because rstrip strips a CHARACTER SET, not a substring. "happy.py".rstrip(".py") strips trailing y, p, and dot in any combination — you end up with "ha", not "happy". removesuffix does exact-suffix removal, which is almost always what people meant when they reached for rstrip.',
    },
    {
      q: 'How do I remove ALL trailing occurrences of a suffix?',
      a: 'Loop with endswith and removesuffix, or use a regex.',
      code: 'while s.endswith(suffix):\n    s = s.removesuffix(suffix)\n\n# or:\nimport re\ns = re.sub(r"(" + re.escape(suffix) + r")+$", "", s)',
    },
    {
      q: 'Is there an equivalent for prefixes?',
      a: 'Yes — str.removeprefix, added in the same version (3.9).',
    },
  ],

  history: [
    { version: '3.9', note: 'removesuffix() introduced along with removeprefix() via PEP 616 — replacing hand-rolled slice idioms.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.removesuffix',
    meta:  'str.removesuffix',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};