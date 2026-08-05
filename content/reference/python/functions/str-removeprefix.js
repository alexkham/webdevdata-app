// content/reference/python/functions/str-removeprefix.js
//
// Slug is type-prefixed: `removeprefix` is a str method (also on bytes).

export const meta = {
  slug:        'str-removeprefix',
  name:        'str.removeprefix',
  signature:   'str.removeprefix(prefix)',
  blurb:       'Remove an exact leading substring — safer than lstrip for prefix stripping.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 3.9+',
  searchTerms: 'removeprefix remove prefix substring strip leading intent exact safe modern',
};

export const method = {
  slug:      'str-removeprefix',
  name:      'str.removeprefix',
  signature: 'str.removeprefix(prefix)',
  returns:   { type: 'str', desc: 'A copy of the string with the exact SUBSTRING `prefix` removed from the start, IF the string starts with it. Otherwise the string is returned unchanged. Removes at most one occurrence.' },

  category:    'String method',
  version:     'Python 3.9+',
  hasLiveDemo: true,

  subtitle: 'Strip an exact prefix — the intent-preserving alternative to lstrip that does not surprise you with character-set semantics.',

  cheat: {
    commonCall: 'url.removeprefix("https://")',
    returns:    'new str — the original is unchanged',
    replaces:   'the classic `s[len(prefix):] if s.startswith(prefix) else s` idiom',
    watchOut:   'exact substring match — not a set of characters like lstrip',
  },

  parameters: [
    { name: 'prefix', type: 'str', required: true, default: null, desc: 'The exact substring to remove from the start. If the string does not start with this exact substring, the original is returned unchanged.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',   input: 'text' },
    { name: 'prefix', type: 'str', hint: 'exact prefix', input: 'text' },
  ],
  cases: [
    { id: 'basic',      label: 'basic',           values: { string: 'unhappy', prefix: 'un' } },
    { id: 'url',        label: 'URL scheme',      values: { string: 'https://python.org', prefix: 'https://' } },
    { id: 'no-match',   label: 'not a prefix',    values: { string: 'hello',   prefix: 'xy' } },
    { id: 'exact',      label: 'string == prefix',values: { string: 'hello',   prefix: 'hello' } },
    { id: 'once-only',  label: 'removes once',    values: { string: 'ununhappy', prefix: 'un' } },
    { id: 'empty-pref', label: 'empty prefix',    values: { string: 'hello',   prefix: '' } },
    { id: 'empty-str',  label: 'empty string',    values: { string: '',        prefix: 'x' } },
  ],
  demoExplainer: 'removeprefix strips an EXACT substring from the start — at most once. If the string does not start with the prefix, the original is returned unchanged. Unlike lstrip, the argument is a substring, not a character set — "un" removes exactly "un" once, not any leading &quot;u&quot; and &quot;n&quot; characters in any order.',

  patterns: [
    {
      name: 'Strip URL scheme',
      desc: 'The canonical use case — clean and unambiguous.',
      code: 'host_path = url.removeprefix("https://")',
    },
    {
      name: 'Drop a namespace prefix',
      desc: 'Trim exact known prefixes without slicing math.',
      code: 'name = symbol.removeprefix("my_module.")',
    },
    {
      name: 'Feature-flag toggle detection',
      desc: 'Detect and strip a marker prefix in one step.',
      code: 'if key.startswith("_"):\n    real_key = key.removeprefix("_")',
    },
  ],

  examples: [
    { title: 'Basic',                code: '"unhappy".removeprefix("un")',        returns: '"happy"' },
    { title: 'URL scheme',           code: '"https://python.org".removeprefix("https://")', returns: '"python.org"' },
    { title: 'Not a prefix',         code: '"hello".removeprefix("xy")',          returns: '"hello"  # unchanged' },
    { title: 'String == prefix',     code: '"hello".removeprefix("hello")',       returns: '""' },
    { title: 'Removes once only',    code: '"ununhappy".removeprefix("un")',      returns: '"unhappy"  # not "happy"' },
    { title: 'Empty prefix is no-op', code: '"hello".removeprefix("")',            returns: '"hello"' },
  ],

  pitfalls: [
    {
      name: 'Removes AT MOST ONE occurrence',
      desc: 'removeprefix strips the prefix once and stops. Doubled prefixes (or triple, etc.) leave the rest in place. Loop or use a while for multi-removal.',
      wrong: { label: 'One shot',  code: '"ununhappy".removeprefix("un")', output: '"unhappy"  # still has "un"' },
      fix:   { label: 'Loop for all', code: 's = "ununhappy"\nwhile s.startswith("un"):\n    s = s.removeprefix("un")', output: '"happy"' },
    },
    {
      name: 'Empty prefix returns the original unchanged',
      desc: 'Passing "" is a no-op — every string trivially starts with the empty string, but removing 0 characters leaves the original alone.',
      wrong: { label: 'Empty is no-op', code: '"hello".removeprefix("")', output: '"hello"' },
      fix:   { label: 'Guard for empty', code: 'if prefix:\n    s = s.removeprefix(prefix)', output: 'explicit intent' },
    },
    {
      name: 'Different from lstrip — exact match, not character set',
      desc: 'This is the whole point of the method. lstrip("un") strips any leading &quot;u&quot; and &quot;n&quot; in any order and any repetition. removeprefix("un") only matches the literal prefix &quot;un&quot;.',
      wrong: { label: 'lstrip over-strips', code: '"unnnnhappy".lstrip("un")', output: '"happy"  # ate every leading "u" and "n"' },
      fix:   { label: 'removeprefix is precise', code: '"unnnnhappy".removeprefix("un")', output: '"nnnnhappy"  # just the first two chars' },
    },
    {
      name: 'Not available before Python 3.9',
      desc: 'Added in 3.9. On older Pythons use the classic idiom.',
      wrong: { label: 'AttributeError on 3.8', code: '"unhappy".removeprefix("un")   # 3.8', output: "AttributeError: 'str' object has no attribute 'removeprefix'" },
      fix:   { label: 'Portable idiom',         code: 'def removeprefix(s, p):\n    return s[len(p):] if s.startswith(p) else s', output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'Stripping a KNOWN, exact leading substring',
      'URL/URI scheme removal',
      'Namespace or module-prefix trimming',
      'Any place lstrip would have been the wrong tool because of character-set semantics',
    ],
    avoid: [
      'Multi-occurrence removal → loop with while + startswith',
      'Character-set removal → str.lstrip is the correct tool',
      'Case-insensitive prefix removal → casefold both sides, or use regex',
      'Python 3.8 or earlier → use the s[len(p):] idiom instead',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan to test the prefix, then one slice',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: unicode_removeprefix — introduced with PEP 616',
    memory:     'Allocates one new string when the prefix matched; returns the original when not',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.lstrip',        slug: 'str-lstrip',        when: 'You wanted a CHARACTER SET, not an exact prefix' },
    { name: 'startswith',        slug: 'startswith',        when: 'Just checking a prefix, not removing' },
    { name: 'replace',           slug: 'replace',           when: 'Substitute anywhere in the string, not just at the start' },
  ],

  faq: [
    {
      q: 'Why not just use lstrip?',
      a: 'Because lstrip strips a CHARACTER SET, not a substring. "https://".lstrip("https://") strips leading h, t, p, s, colon, and slash in any combination, which is almost never what people want. removeprefix does exact-prefix removal, which is almost always what people meant when they reached for lstrip.',
    },
    {
      q: 'How do I remove ALL leading occurrences of a prefix?',
      a: 'Loop with startswith and removeprefix, or use a regex.',
      code: 'while s.startswith(prefix):\n    s = s.removeprefix(prefix)\n\n# or:\nimport re\ns = re.sub(r"^(" + re.escape(prefix) + ")+", "", s)',
    },
    {
      q: 'Is there an equivalent for suffixes?',
      a: 'Yes — str.removesuffix, added in the same version (3.9).',
    },
  ],

  history: [
    { version: '3.9', note: 'removeprefix() introduced along with removesuffix() via PEP 616 — replacing hand-rolled slice idioms.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.removeprefix',
    meta:  'str.removeprefix',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};