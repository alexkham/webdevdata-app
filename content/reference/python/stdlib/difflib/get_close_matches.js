// content/reference/python/stdlib/difflib/get_close_matches.js

export const meta = {
  slug:        'get_close_matches',
  name:        'difflib.get_close_matches',
  signature:   'difflib.get_close_matches(word, possibilities, n=3, cutoff=0.6)',
  blurb:       'The best "good enough" matches for a word from a list of candidates — up to n of them, each with a similarity ratio of at least cutoff, most similar first.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'difflib get_close_matches did you mean fuzzy string matching python closest match spelling suggestion typo correction similar words cutoff ratio n must be > 0 cutoff must be in [0.0, 1.0]',
};

export const method = {
  slug:      'get_close_matches',
  name:      'difflib.get_close_matches',
  signature: 'difflib.get_close_matches(word, possibilities, n=3, cutoff=0.6)',
  returns:   { type: 'list', desc: 'At most n items of possibilities whose SequenceMatcher ratio against word is at least cutoff, best first. [] when none qualifies.' },

  category:    'difflib function',
  version:     'Python 2.1+',
  hasLiveDemo: true,

  subtitle: 'The standard library\'s "did you mean": every candidate is scored with SequenceMatcher(None, candidate, word).ratio(), those below cutoff are dropped, and the n best are returned. Ties are broken by comparing the candidates themselves, larger first.',

  covers: ['get_close_matches'],

  cheat: {
    commonCall: "difflib.get_close_matches('appel', ['ape', 'apple', 'peach'])",
    returns:    "['apple', 'ape'] — best first",
    replaces:   'a hand-written edit-distance loop',
    watchOut:   'case-sensitive: lower() both sides first',
  },

  parameters: [
    { name: 'word',          type: 'str',       required: true,  default: null,  desc: 'The text to find matches for (any sequence works; strings are compared character by character).' },
    { name: 'possibilities', type: 'list[str]', required: true,  default: null,  desc: 'The candidates. Duplicates are kept and can both be returned.' },
    { name: 'n',             type: 'int',       required: false, default: '3',   desc: 'Maximum number of matches. Must be greater than 0, else ValueError.' },
    { name: 'cutoff',        type: 'float',     required: false, default: '0.6', desc: 'Minimum ratio, in [0.0, 1.0] (else ValueError). Lower it to get more, looser matches.' },
  ],

  modes: [
    {
      id: 'match',
      label: 'match',
      blurb: 'Edit the word, the candidate list (comma-separated), n and cutoff.',
      params: [
        { name: 'word',   type: 'str',       hint: 'possibly misspelled', input: 'text' },
        { name: 'words',  type: 'list[str]', hint: 'comma-separated',     input: 'csv' },
        { name: 'n',      type: 'int',       hint: 'max results',         input: 'number' },
        { name: 'cutoff', type: 'float',     hint: '0.0 – 1.0',           input: 'float' },
      ],
      template: 'import difflib\ndifflib.get_close_matches({$word}, {$words}, n={$n}, cutoff={$cutoff})',
      cases: [
        { id: 'appel',  label: 'appel',       values: { word: 'appel', words: 'ape, apple, peach, puppy', n: '3', cutoff: '0.6' } },
        { id: 'loose',  label: 'cutoff=0.4',  values: { word: 'appel', words: 'ape, apple, peach, puppy', n: '3', cutoff: '0.4' } },
        { id: 'one',    label: 'n=1',         values: { word: 'lenght', words: 'len, length, height, lent', n: '1', cutoff: '0.6' } },
        { id: 'case',   label: 'UPPER case',  values: { word: 'PRINT', words: 'print, input, int', n: '3', cutoff: '0.6' } },
        { id: 'badn',   label: 'n=0',         values: { word: 'x', words: 'x', n: '0', cutoff: '0.6' } },
        { id: 'badcut', label: 'cutoff=1.5',  values: { word: 'x', words: 'x', n: '3', cutoff: '1.5' } },
      ],
    },
    {
      id: 'scores',
      label: 'scores',
      blurb: 'The ratio each candidate gets — computed the way get_close_matches does it (candidate first, word second) — sorted best first.',
      params: [
        { name: 'word',  type: 'str',       hint: 'possibly misspelled', input: 'text' },
        { name: 'words', type: 'list[str]', hint: 'comma-separated',     input: 'csv' },
      ],
      template: 'import difflib\nsorted(((difflib.SequenceMatcher(None, w, {$word}).ratio(), w) for w in {$words}), reverse=True)',
      cases: [
        { id: 'appel',  label: 'appel',  values: { word: 'appel', words: 'ape, apple, peach, puppy' } },
        { id: 'lenght', label: 'lenght', values: { word: 'lenght', words: 'len, length, height, lent' } },
      ],
    },
  ],
  demoExplainer: 'The scores tab shows why: apple 0.8 and ape 0.75 pass the default cutoff of 0.6, peach and puppy (0.4 each) do not. With cutoff=0.4 both qualify but only 3 results fit, and the tie goes to the larger string, puppy. The same rule keeps len and drops height for "lenght". "PRINT" finds nothing because upper- and lowercase letters never match. n=0 and cutoff=1.5 are rejected with ValueError before any scoring.',

  patterns: [
    {
      name: '"Did you mean" for an unknown command',
      desc: 'n=1 gives the single best suggestion, or an empty list.',
      code: "import difflib\nmatch = difflib.get_close_matches(cmd, COMMANDS, n=1)\nhint = f' Did you mean {match[0]!r}?' if match else ''\nraise SystemExit(f'unknown command {cmd!r}.{hint}')",
    },
    {
      name: 'Case-insensitive matching',
      desc: 'Compare lowercased keys, return the original spelling.',
      code: "import difflib\nby_lower = {name.lower(): name for name in names}\nmatches = [by_lower[m] for m in difflib.get_close_matches(query.lower(), by_lower)]",
    },
    {
      name: 'Suggest a dict key on KeyError',
      desc: 'Iterating a dict gives its keys, so the dict itself can be the possibilities.',
      code: "import difflib\ntry:\n    value = settings[key]\nexcept KeyError:\n    close = difflib.get_close_matches(key, settings)\n    raise KeyError(f'{key!r} not found; close matches: {close}') from None",
    },
  ],

  examples: [
    { title: 'The docs example', code: "import difflib\ndifflib.get_close_matches('appel', ['ape', 'apple', 'peach', 'puppy'])", returns: "['apple', 'ape']" },
    { title: 'Against the keyword list', code: "import difflib, keyword\n(difflib.get_close_matches('wheel', keyword.kwlist), difflib.get_close_matches('accept', keyword.kwlist))", returns: "(['while'], ['except'])" },
    { title: 'Nothing close enough', code: "import difflib, keyword\ndifflib.get_close_matches('pineapple', keyword.kwlist)", returns: '[]' },
    { title: 'Equal scores: the larger string wins', code: "import difflib\ndifflib.get_close_matches('lenght', ['len', 'length', 'height', 'lent'])", returns: "['length', 'lent', 'len']" },
    { title: 'Duplicates are not removed', code: "import difflib\ndifflib.get_close_matches('aple', ['apple', 'apple', 'ample'])", returns: "['apple', 'apple', 'ample']" },
    { title: 'n must be positive', code: "import difflib\ndifflib.get_close_matches('a', ['a'], n=0)", returns: 'ValueError: n must be > 0: 0' },
    { title: 'cutoff must be within [0, 1]', code: "import difflib\ndifflib.get_close_matches('a', ['a'], cutoff=60)", returns: 'ValueError: cutoff must be in [0.0, 1.0]: 60' },
  ],

  pitfalls: [
    {
      name: 'Case differences count as different characters',
      desc: 'SequenceMatcher compares characters exactly, so "APPLE" and "Apple" share only the A — a ratio of 0.2. Lowercase both sides and map back to the original spelling.',
      wrong: { label: 'as typed',  code: "import difflib\ndifflib.get_close_matches('APPLE', ['Apple', 'Maple'])", output: '[]' },
      fix:   { label: 'lowercased', code: "import difflib\nby_lower = {w.lower(): w for w in ['Apple', 'Maple']}\n[by_lower[m] for m in difflib.get_close_matches('APPLE'.lower(), by_lower)]", output: "['Apple', 'Maple']" },
    },
    {
      name: 'Passing the cutoff as a percentage',
      desc: 'cutoff is a ratio between 0.0 and 1.0, not a percentage.',
      wrong: { label: 'cutoff=80',  code: "import difflib\ndifflib.get_close_matches('colour', ['color', 'cooler'], cutoff=80)", output: 'ValueError: cutoff must be in [0.0, 1.0]: 80' },
      fix:   { label: 'cutoff=0.8', code: "import difflib\ndifflib.get_close_matches('colour', ['color', 'cooler'], cutoff=0.8)", output: "['color']" },
    },
  ],

  when: {
    use: [
      '"Did you mean ...?" hints for commands, options, keys and identifiers',
      'Short candidate lists (hundreds to a few thousand words)',
      'Typos that keep most letters in order',
    ],
    avoid: [
      'Large vocabularies or many queries — every candidate gets a full SequenceMatcher pass in pure Python',
      'Phonetic or semantic similarity — ratio only sees characters in order',
      'A true edit distance (Levenshtein) — ratio is a different measure and is not symmetric',
    ],
  },

  notes: {
    cpython:   'Lib/difflib.py: one SequenceMatcher with set_seq2(word) and set_seq1(candidate) per candidate; real_quick_ratio() and quick_ratio() filter cheaply before ratio(), then heapq.nlargest(n, (score, candidate) pairs) picks the winners',
    'Order':   'Results are sorted by score, then by the candidate itself (larger first) — so among equal scores, "len" beats "height" and "puppy" beats "peach"',
    'Errors':  'ValueError: n must be > 0: … and ValueError: cutoff must be in [0.0, 1.0]: … are raised before any candidate is scored',
  },

  related: [
    { name: 'SequenceMatcher.ratio', slug: 'sequencematcher-ratio', when: 'The score behind every match' },
    { name: 'SequenceMatcher',       slug: 'sequencematcher',       when: 'Compare one pair in detail' },
    { name: 'heapq.nlargest',        slug: 'nlargest-nsmallest',    when: 'How the n best are picked', category: 'stdlib/heapq' },
    { name: 'sorted()',              slug: 'sorted',                when: 'Rank all candidates with their scores', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I find the closest matching string in a list in Python?',
      a: "difflib.get_close_matches(word, candidates, n=1) returns a list with the single best candidate whose similarity ratio is at least 0.6, or [] if none is. Lower cutoff (for example cutoff=0.4) to accept weaker matches.",
    },
    {
      q: 'How does get_close_matches score candidates?',
      a: 'With SequenceMatcher(None, candidate, word).ratio(): 2*M/T, where M counts the characters in matching blocks and T is the total length of both strings. The order matters — SequenceMatcher(None, word, candidate) can give a different value.',
    },
    {
      q: 'Why does get_close_matches return an empty list?',
      a: 'No candidate reached the cutoff (0.6 by default). Common causes are case differences, very short words (one changed letter in a 2-letter word leaves a ratio of 0.5) and candidates much longer than the word. Lower cutoff or normalize the strings.',
    },
    {
      q: 'Is get_close_matches fast enough for a big word list?',
      a: 'It scores every candidate in pure Python, with cheap upper bounds (real_quick_ratio, quick_ratio) to skip hopeless ones. That is fine for command names or a few thousand words; for large dictionaries use an index-based fuzzy matching library instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.get_close_matches',
    meta:  'difflib.get_close_matches',
  },
};
