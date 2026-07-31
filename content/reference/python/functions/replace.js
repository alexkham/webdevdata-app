// content/reference/python/functions/replace.js
//
// Content file for /reference/python/functions/replace.
// Two exports: `meta` (light — consumed by hub pages via the generated
// catalogs) and `method` (heavy — consumed only by [name].jsx at build time).
// The live-demo emulator lives separately in utils/emulators/python/replace.js.

export const meta = {
  slug:        'replace',
  name:        'str.replace',
  signature:   'str.replace(old, new, count=-1)',
  blurb:       'Return a copy with all occurrences of old replaced by new.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'replace substitute string swap',
};

export const method = {
  slug:      'replace',
  name:      'str.replace',
  signature: 'str.replace(old, new, count=-1)',
  returns:   { type: 'str', desc: 'A new string with the substitutions applied. If old is not found, the returned string equals the original.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Return a copy of the string with all occurrences of substring old replaced by new.',

  cheat: {
    commonCall: '"hello".replace("l", "L")',
    returns:    'new str — the original is unchanged',
    replaces:   'all occurrences unless count is given',
    watchOut:   'case-sensitive; no regex — use re.sub for either',
  },

  parameters: [
    { name: 'old',   type: 'str', required: true,  default: null, desc: 'The substring to search for. If empty, insertion behavior applies (see Pitfalls).' },
    { name: 'new',   type: 'str', required: true,  default: null, desc: 'The substring to substitute. May be empty to delete matches.' },
    { name: 'count', type: 'int', required: false, default: '-1', desc: 'Maximum number of replacements. Negative or omitted means replace all.' },
  ],

  // Seed inputs for the live demo. `string` is the receiver; the rest map to
  // parameters by name. Order matches the demo form.
  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',  input: 'text' },
    { name: 'old',    type: 'str', hint: 'to find',     input: 'text' },
    { name: 'new',    type: 'str', hint: 'replacement', input: 'text' },
    { name: 'count',  type: 'int', hint: '-1 = all',    input: 'number' },
  ],
  cases: [
    { id: 'default',  label: 'default',     values: { string: 'hello world', old: 'o',    new: '0', count: -1 } },
    { id: 'count1',   label: 'count=1',     values: { string: 'aaaa',        old: 'a',    new: 'b', count: 1 } },
    { id: 'count0',   label: 'count=0',     values: { string: 'aaaa',        old: 'a',    new: 'b', count: 0 } },
    { id: 'notfound', label: 'not found',   values: { string: 'hello',       old: 'z',    new: 'Z', count: -1 } },
    { id: 'empty',    label: 'empty old',   values: { string: 'abc',         old: '',     new: '-', count: -1 } },
    { id: 'unicode',  label: 'unicode',     values: { string: 'café',   old: 'é', new: 'e', count: -1 } },
    { id: 'overlap',  label: 'overlapping', values: { string: 'aaaa',        old: 'aa',   new: 'b', count: -1 } },
  ],
  demoExplainer: 'str.replace() returns a new string in which every occurrence of old has been replaced by new. The original string is unchanged. If count is given, only the first count occurrences are replaced.',

  patterns: [
    {
      name: 'Chained replacements',
      desc: 'Sanitize text by replacing several problematic characters in sequence.',
      code: '# normalize a slug\nslug = title.replace(" ", "-").replace("_", "-").lower()',
    },
    {
      name: 'Removal via empty new',
      desc: 'Passing an empty string as new deletes every occurrence of old.',
      code: 'phone.replace("-", "").replace(" ", "")\n# \'5551234567\' from \'555-123 4567\'',
    },
    {
      name: 'Templating without f-strings',
      desc: 'Useful when the template comes from a config file at runtime.',
      code: 'template = "Hello, {name}! You have {n} messages."\nmsg = template.replace("{name}", "Alex").replace("{n}", str(3))',
    },
  ],

  examples: [
    { title: 'Replace all occurrences',                       code: '"hello world".replace("o", "0")', returns: "'hell0 w0rld'" },
    { title: 'Replace only the first occurrence',             code: '"aaaa".replace("a", "b", 1)',     returns: "'baaa'" },
    { title: 'Delete substring by replacing with empty',      code: '"a-b-c".replace("-", "")',        returns: "'abc'" },
    { title: 'Substring not present — original returned',     code: '"hello".replace("z", "Z")',       returns: "'hello'" },
  ],

  pitfalls: [
    {
      name: 'The original string is not modified',
      desc: 'Strings are immutable. s.replace(...) returns a new string; if you don’t assign the result, nothing changes.',
      wrong: { label: 'Wrong', code: 's = "hello"\ns.replace("l", "L")\nprint(s)', output: 'hello' },
      fix:   { label: 'Fix',   code: 's = "hello"\ns = s.replace("l", "L")\nprint(s)', output: 'heLLo' },
    },
    {
      name: 'Empty old inserts between characters',
      desc: 'Passing "" for old doesn’t no-op — it inserts new at every position.',
      wrong: { label: 'Surprising', code: '"abc".replace("", "-")', output: "'-a-b-c-'" },
      fix:   { label: 'Guard',      code: 'if old:\n    s = s.replace(old, new)', output: "'abc' (guarded)" },
    },
    {
      name: 'Case-sensitive only',
      desc: 'No case-insensitive flag exists. Reach for re.sub with re.IGNORECASE.',
      wrong: { label: 'Misses "Hello"', code: '"Hello hello".replace("hello", "hi")', output: "'Hello hi'" },
      fix:   { label: 'Fix',            code: 'import re\nre.sub("hello", "hi", s, flags=re.I)', output: "'hi hi'" },
    },
  ],

  when: {
    use: [
      'Literal substring — no pattern needed',
      'Same case as source',
      'Small number of distinct replacements (chain them)',
      'Performance-critical hot loop — it’s the fastest option',
    ],
    avoid: [
      'Need regex → re.sub',
      'Case-insensitive → re.sub(..., flags=re.I)',
      'Many replacements at once → str.translate',
      'Unicode normalization → unicodedata.normalize first',
    ],
  },

  notes: {
    complexity: 'O(n) — single pass over the source',
    return:     'new str — source untouched',
    cpython:    'Objects/unicodeobject.c :: unicode_replace',
    memory:     'Allocates a fresh buffer sized to the result',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.split',        slug: 'split',        when: 'When you also need the pieces' },
    { name: 'str.translate',    slug: 'translate',    when: 'Many char-level replacements at once' },
    { name: 're.sub',           slug: 're-sub',       when: 'Regex or case-insensitive' },
    { name: 'str.removeprefix', slug: 'removeprefix', when: 'Strip a known start' },
    { name: 'str.removesuffix', slug: 'removesuffix', when: 'Strip a known end' },
    { name: 'str.format',       slug: 'format',       when: 'Template with named fields' },
  ],

  faq: [
    {
      q: 'How do I replace only the first occurrence?',
      a: 'Pass 1 as the third argument.',
      code: '"aaaa".replace("a", "b", 1)  # \'baaa\'',
    },
    {
      q: 'How do I do case-insensitive replace?',
      a: 'There is no built-in flag. Use re.sub with re.IGNORECASE.',
      code: 'import re\nre.sub("hello", "hi", s, flags=re.IGNORECASE)',
    },
    {
      q: 'Does str.replace modify the original string?',
      a: 'No. Strings are immutable. It returns a new string; you must assign the result to keep the change.',
    },
    {
      q: 'How do I replace multiple different substrings at once?',
      a: 'For short sequences, chain calls. For many single-character replacements, str.translate is faster.',
    },
    {
      q: 'Does it support regex?',
      a: 'No. Use re.sub for regex.',
    },
  ],

  history: [
    { version: '3.9', note: 'No changes to str.replace. Related: str.removeprefix and str.removesuffix added.' },
    { version: '2.0', note: 'Method introduced with the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.replace',
    meta:  'str.replace',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
