// content/reference/python/functions/join.js

export const meta = {
  slug:        'join',
  name:        'str.join',
  signature:   'str.join(iterable)',
  blurb:       'Concatenate an iterable of strings with this string as the separator.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'join concatenate glue separator combine',
};

export const method = {
  slug:      'join',
  name:      'str.join',
  signature: 'str.join(iterable)',
  returns:   { type: 'str', desc: 'A new string: the items of the iterable concatenated with the separator between them.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Concatenate an iterable of strings, with the string you call it on as the separator.',

  cheat: {
    commonCall: '", ".join(["a", "b", "c"])',
    returns:    'new str',
    replaces:   'the separator goes BETWEEN items — not after each one',
    watchOut:   'every item must be a str — numbers raise TypeError',
  },

  parameters: [
    { name: 'iterable', type: 'iterable[str]', required: true, default: null, desc: 'Any iterable of strings: list, tuple, generator, dict (joins its keys). A single non-str item raises TypeError.' },
  ],

  demoParams: [
    { name: 'sep',   type: 'str',       hint: 'the separator (receiver)', input: 'text' },
    { name: 'items', type: 'list[str]', hint: 'comma-separated items',    input: 'csv' },
  ],
  cases: [
    { id: 'default', label: 'default',    values: { sep: ', ',  items: 'a,b,c' } },
    { id: 'empty',   label: 'empty sep',  values: { sep: '',    items: 'a,b,c' } },
    { id: 'newline', label: 'path',       values: { sep: '/',   items: 'usr,local,bin' } },
    { id: 'single',  label: 'one item',   values: { sep: ', ',  items: 'solo' } },
    { id: 'none',    label: 'no items',   values: { sep: ', ',  items: '' } },
  ],
  demoExplainer: 'The separator is the string you call join on; the items come from the iterable. With one item there is nothing to separate, and with an empty iterable the result is an empty string.',

  patterns: [
    {
      name: 'Build a path or URL segment',
      desc: 'Cleaner and faster than repeated + concatenation.',
      code: 'url = "/".join(["api", "v2", "users"])\n# \'api/v2/users\'',
    },
    {
      name: 'The split → transform → join round trip',
      desc: 'The idiomatic way to edit words in a sentence.',
      code: '" ".join(w.capitalize() for w in title.split())',
    },
    {
      name: 'Join non-strings',
      desc: 'Convert items first — join refuses anything that is not a str.',
      code: '", ".join(str(n) for n in [1, 2, 3])\n# \'1, 2, 3\'',
    },
  ],

  examples: [
    { title: 'Join with a comma',           code: '", ".join(["a", "b", "c"])', returns: "'a, b, c'" },
    { title: 'Join with empty separator',   code: '"".join(["a", "b", "c"])',   returns: "'abc'" },
    { title: 'Single item — no separator',  code: '", ".join(["solo"])',        returns: "'solo'" },
    { title: 'Empty iterable',              code: '", ".join([])',              returns: "''" },
  ],

  pitfalls: [
    {
      name: 'The separator is the receiver, not the argument',
      desc: 'Reading it backwards is the classic first-encounter mistake.',
      wrong: { label: 'Wrong way round', code: '["a", "b"].join(", ")', output: "AttributeError: 'list' object has no attribute 'join'" },
      fix:   { label: 'Fix', code: '", ".join(["a", "b"])', output: "'a, b'" },
    },
    {
      name: 'Non-string items raise TypeError',
      desc: 'join never calls str() for you.',
      wrong: { label: 'Raises', code: '", ".join([1, 2, 3])', output: 'TypeError: sequence item 0: expected str instance' },
      fix:   { label: 'Fix', code: '", ".join(str(n) for n in [1, 2, 3])', output: "'1, 2, 3'" },
    },
    {
      name: 'Joining a plain string iterates its characters',
      desc: 'A str is itself an iterable of 1-character strings.',
      wrong: { label: 'Surprising', code: '"-".join("abc")', output: "'a-b-c'" },
      fix:   { label: 'Wrap it if you meant one item', code: '"-".join(["abc"])', output: "'abc'" },
    },
  ],

  when: {
    use: [
      'Combining many pieces — one allocation instead of many',
      'Inverse of split in a transform pipeline',
      'Building delimited output (CSV-ish lines, paths, slugs)',
    ],
    avoid: [
      'Two or three known pieces → an f-string reads better',
      'Quoted/escaped CSV → csv module',
      'Filesystem paths → os.path.join / pathlib',
    ],
  },

  notes: {
    complexity: 'O(total length) — two passes: size, then copy',
    return:     'new str',
    cpython:    'Objects/unicodeobject.c :: PyUnicode_Join',
    memory:     'Single exact-size allocation — why it beats += in a loop',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.split',   slug: 'split',   when: 'The inverse — break apart' },
    { name: 'str.replace', slug: 'replace', when: 'Swap a separator without splitting' },
    { name: 'str.strip',   slug: 'strip',   when: 'Trim pieces before joining' },
  ],

  faq: [
    {
      q: 'Why is join a string method and not a list method?',
      a: 'Because it works on any iterable — lists, tuples, generators, dict keys — not just lists. Putting it on the separator string covers them all with one method.',
    },
    {
      q: 'Is join faster than += in a loop?',
      a: 'Yes, significantly for many pieces. += copies the growing string every iteration (quadratic); join measures once and copies once (linear).',
    },
    {
      q: 'What happens with a dict?',
      a: 'You join its keys — iteration order is insertion order.',
      code: '", ".join({"a": 1, "b": 2})  # \'a, b\'',
    },
  ],

  history: [
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.join',
    meta:  'str.join',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
