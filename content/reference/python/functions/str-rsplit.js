// content/reference/python/functions/str-rsplit.js
//
// Slug is type-prefixed: `rsplit` is a str method (also on bytes).

export const meta = {
  slug:        'str-rsplit',
  name:        'str.rsplit',
  signature:   'str.rsplit(sep=None, maxsplit=-1)',
  blurb:       'Split from the right — behaves like split unless maxsplit is set.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'rsplit reverse split right maxsplit from end delimiter separator whitespace tail',
};

export const method = {
  slug:      'str-rsplit',
  name:      'str.rsplit',
  signature: 'str.rsplit(sep=None, maxsplit=-1)',
  returns:   { type: 'list[str]', desc: 'A list of the parts. With no maxsplit (or -1), identical to split. With maxsplit set, splits at most maxsplit times FROM THE RIGHT — the last N pieces get their own slots, the head keeps everything else.' },

  category:    'String method',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Split from the right — only meaningfully different from split when maxsplit is used.',

  cheat: {
    commonCall: 'user, host = email.rsplit("@", 1)',
    returns:    'a list of strings, length ≤ maxsplit + 1',
    replaces:   'the rfind + slice pattern for \"keep the head intact, split the tail\"',
    watchOut:   'sep=None collapses runs of whitespace AND strips ends; sep="" raises ValueError',
  },

  parameters: [
    { name: 'sep',      type: 'str | None', required: false, default: 'None', desc: 'Delimiter. None (default) splits on any whitespace runs and strips leading/trailing whitespace. Empty string raises ValueError.' },
    { name: 'maxsplit', type: 'int',        required: false, default: '-1',   desc: 'Maximum number of splits from the RIGHT. -1 (default) means no limit. When set, the head keeps the un-split remainder as one piece.' },
  ],

  demoParams: [
    { name: 'string',   type: 'str', hint: 'the source',           input: 'text' },
    { name: 'sep',      type: 'str', hint: 'empty = whitespace',   input: 'text-or-none' },
    { name: 'maxsplit', type: 'int', hint: 'empty = unlimited',    input: 'number-or-none' },
  ],
  cases: [
    { id: 'basic',        label: 'basic',           values: { string: 'a,b,c,d', sep: ',',  maxsplit: '' } },
    { id: 'max-1',        label: 'maxsplit=1',      values: { string: 'a,b,c,d', sep: ',',  maxsplit: 1 } },
    { id: 'max-2',        label: 'maxsplit=2',      values: { string: 'a,b,c,d', sep: ',',  maxsplit: 2 } },
    { id: 'whitespace',   label: 'whitespace sep',  values: { string: 'first middle last', sep: '', maxsplit: 1 } },
    { id: 'email',        label: 'email host',      values: { string: 'user@corp@example.com', sep: '@', maxsplit: 1 } },
    { id: 'path',         label: 'file path',       values: { string: '/usr/local/bin', sep: '/', maxsplit: 1 } },
    { id: 'no-hit',       label: 'sep missing',     values: { string: 'no-hits',  sep: ',', maxsplit: '' } },
    { id: 'empty-sep',    label: 'empty sep',       values: { string: 'abc',     sep: ' ',  maxsplit: '' } },
  ],
  demoExplainer: 'rsplit only differs from split when maxsplit is set. With maxsplit=N, the LAST N delimiters produce splits — the head accumulates everything before those into a single piece. sep=None (the empty demo input) collapses whitespace runs AND trims ends, exactly like split. Empty sep string (only when specified explicitly) raises ValueError.',

  patterns: [
    {
      name: 'Email → user + host',
      desc: 'The last "@" separates the host, even if the local part contains "@" (rare but legal).',
      code: 'user, host = addr.rsplit("@", 1)',
    },
    {
      name: 'Directory + basename',
      desc: 'Slice off the final path component, keep the rest intact.',
      code: 'directory, name = path.rsplit("/", 1)',
    },
    {
      name: 'Last-N fields',
      desc: 'Grab the tail — say the last two CSV fields — without touching the head.',
      code: 'head, last_but_one, last = line.rsplit(",", 2)',
    },
  ],

  examples: [
    { title: 'No maxsplit = same as split', code: '"a,b,c,d".rsplit(",")',       returns: '["a", "b", "c", "d"]' },
    { title: 'maxsplit=1 keeps head',       code: '"a,b,c,d".rsplit(",", 1)',    returns: '["a,b,c", "d"]' },
    { title: 'maxsplit=2',                  code: '"a,b,c,d".rsplit(",", 2)',    returns: '["a,b", "c", "d"]' },
    { title: 'Whitespace sep',              code: '"first middle last".rsplit(None, 1)', returns: '["first middle", "last"]' },
    { title: 'Email split',                 code: '"user@corp@example.com".rsplit("@", 1)', returns: '["user@corp", "example.com"]' },
    { title: 'No match',                    code: '"nohits".rsplit(",")',        returns: '["nohits"]' },
  ],

  pitfalls: [
    {
      name: 'Without maxsplit, rsplit is a no-op vs split',
      desc: 'Reaching for rsplit \"because I want to split from the right\" without passing maxsplit gives you the same list as split. The value is in the maxsplit case.',
      wrong: { label: 'No difference', code: '"a,b,c".rsplit(",")\n"a,b,c".split(",")', output: '["a", "b", "c"]  # identical' },
      fix:   { label: 'With maxsplit', code: '"a,b,c".rsplit(",", 1)', output: '["a,b", "c"]  # tail split off' },
    },
    {
      name: 'Empty sep raises ValueError',
      desc: 'Same rule as split — cannot split by an empty separator. sep=None (default) is fine and means \"any whitespace runs\".',
      wrong: { label: 'Runtime error', code: '"hello".rsplit("")', output: 'ValueError: empty separator' },
      fix:   { label: 'Use None for whitespace', code: '"hello world".rsplit(None, 1)', output: '["hello", "world"]' },
    },
    {
      name: 'sep=None strips leading/trailing whitespace AND collapses runs',
      desc: 'sep=None is not the same as sep=" ". It collapses runs of any whitespace and trims the ends. sep=" " keeps empty strings from consecutive spaces and does not strip.',
      wrong: { label: 'sep=" "',   code: '"  a   b  ".rsplit(" ")', output: '["", "", "a", "", "", "b", "", ""]' },
      fix:   { label: 'sep=None',  code: '"  a   b  ".rsplit(None)', output: '["a", "b"]' },
    },
    {
      name: 'maxsplit counts SPLITS, not pieces',
      desc: 'maxsplit=N means at most N splits — producing at most N+1 pieces. Off-by-one bugs are common.',
      wrong: { label: 'Off by one', code: '"a,b,c,d".rsplit(",", 3)  # expected 3 pieces?', output: '["a", "b", "c", "d"]  # 4 pieces' },
      fix:   { label: 'For N pieces, split N-1 times', code: '"a,b,c,d".rsplit(",", 2)', output: '["a,b", "c", "d"]  # 3 pieces' },
    },
  ],

  when: {
    use: [
      'Splitting off the last N fields while keeping the head intact',
      'Splitting emails, URLs, or paths where the trailing part matters',
      'Any \"head + tail\" parsing where the delimiter appears earlier in the head too',
    ],
    avoid: [
      'No maxsplit → just use split, they are identical',
      'Two-piece split at the first occurrence → split(sep, 1) instead',
      'Fixed-shape three-piece result → rpartition',
      'Splitting on regex → re.split',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'A new list of strings; length is min(number-of-matches, maxsplit) + 1',
    cpython:    'Objects/unicodeobject.c :: unicode_rsplit',
    memory:     'One list plus one substring per piece',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'split',           slug: 'split',           when: 'Split from the LEFT — same result unless maxsplit is set' },
    { name: 'str.rpartition',  slug: 'str-rpartition',  when: 'Fixed-shape 3-tuple at the last occurrence' },
    { name: 'str.rfind',       slug: 'str-rfind',       when: 'Just the position of the last delimiter' },
    { name: 'join',            slug: 'join',            when: 'Reassemble the pieces afterward' },
  ],

  faq: [
    {
      q: 'When would I actually reach for rsplit over split?',
      a: 'When maxsplit is set and you want the LAST N pieces isolated, with the head kept as a single string. Classic cases: an email where the local part could contain "@", a path where the base name is at the end, a compound identifier where you only want the suffix.',
    },
    {
      q: 'Why does rsplit(None) work but rsplit("") fail?',
      a: 'None is a sentinel meaning \"split on any whitespace runs and strip ends\". An explicit empty string is a delimiter of length zero, which is undefined for splitting.',
    },
    {
      q: 'Is rsplit faster than split?',
      a: 'For no-maxsplit or a full split, they are identical in behavior and comparable in speed. With maxsplit, rsplit scans from the right and returns as soon as it has enough — a saving for very long strings.',
    },
  ],

  history: [
    { version: '2.4', note: 'rsplit() introduced.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.rsplit',
    meta:  'str.rsplit',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the resulting list' },
  ],
};