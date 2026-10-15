// content/reference/python/stdlib/statistics/mode-multimode.js — statistics.mode / statistics.multimode

export const meta = {
  slug:        'mode-multimode',
  name:        'statistics.mode / statistics.multimode',
  signature:   'statistics.mode(data)  /  statistics.multimode(data)',
  blurb:       'The most common value — mode returns the first one found on a tie, multimode returns all of them. Works for numbers and for nominal data such as strings.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'mode 3.4+ (ties allowed since 3.8), multimode 3.8+',
  searchTerms: 'statistics.mode statistics.multimode mode multimode most common value most frequent element python mode of list no mode for empty data unhashable type list bimodal tie Counter most_common',
};

export const method = {
  slug:      'mode-multimode',
  name:      'statistics.mode / statistics.multimode',
  signature: 'statistics.mode(data)  /  statistics.multimode(data)',
  returns:   { type: 'value / list', desc: 'mode: the single most common value. multimode: every value tied for most common, in first-seen order ([] for no data).' },

  category:    'statistics functions',
  version:     'mode 3.4+ (ties allowed since 3.8), multimode 3.8+',
  hasLiveDemo: true,

  subtitle: 'Both count with collections.Counter, so the values must be hashable, and equal values count together — 1, 1.0 and True are the same value. On a tie, mode() picks whichever value appeared first in the data.',

  covers: ['mode', 'multimode'],

  cheat: {
    commonCall: 'statistics.mode(["red", "blue", "blue", "red", "red"])',
    returns:    "'red'",
    replaces:   'Counter(data).most_common(1)[0][0]',
    watchOut:   'mode([]) raises StatisticsError, multimode([]) returns []',
  },

  parameters: [
    { name: 'data', type: 'iterable of hashable values', required: true, default: null, desc: 'Numbers, strings, tuples… anything hashable. Lists and sets are not.' },
  ],

  modes: [
    {
      id: 'numbers',
      label: 'numbers',
      blurb: 'Comma-separated numbers.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\n(statistics.mode(data), statistics.multimode(data))',
      cases: [
        { id: 'docs',  label: '1, 1, 2, 3, 3, 3, 3, 4', values: { data: '1, 1, 2, 3, 3, 3, 3, 4' } },
        { id: 'tie',   label: '2, 1, 2, 1',             values: { data: '2, 1, 2, 1' } },
        { id: 'all',   label: '1, 2, 3',                values: { data: '1, 2, 3' } },
        { id: 'empty', label: 'empty',                  values: { data: '' } },
      ],
    },
    {
      id: 'words',
      label: 'nominal data',
      blurb: 'Comma-separated words — mode and multimode are the only statistics in the module for nominal (unordered, non-numeric) data.',
      params: [{ name: 'words', type: 'list', hint: 'comma-separated words', input: 'csv' }],
      template: 'import statistics\ndata = {$words}\n(statistics.mode(data), statistics.multimode(data))',
      cases: [
        { id: 'colors', label: 'colours', values: { words: 'red, blue, blue, red, green, red, red' } },
        { id: 'tie',    label: 'a tie',   values: { words: 'cat, dog, dog, cat, fish' } },
        { id: 'case',   label: 'case',    values: { words: 'Red, red, RED' } },
      ],
    },
  ],
  demoExplainer: 'With 2, 1, 2, 1 both values appear twice: mode() returns 2 because it was seen first, and multimode() returns [2, 1] in first-seen order. When every value is unique, all of them are modes. Strings are compared exactly, so "Red", "red" and "RED" are three different values and mode() returns the first, "Red". An empty list is an error for mode() and [] for multimode().',

  patterns: [
    {
      name: 'Pick the smallest of tied modes',
      desc: 'Not the first one seen.',
      code: 'import statistics\nsmallest = min(statistics.multimode(data))',
    },
    {
      name: 'Case-insensitive mode',
      desc: 'Normalise before counting.',
      code: 'import statistics\nstatistics.mode(answer.strip().lower() for answer in answers)',
    },
    {
      name: 'Counts as well',
      desc: 'mode gives only the value; Counter gives value and frequency.',
      code: 'from collections import Counter\nvalue, count = Counter(data).most_common(1)[0]',
    },
  ],

  examples: [
    { title: 'Docs example',            code: 'import statistics\nstatistics.mode([1, 1, 2, 3, 3, 3, 3, 4])',      returns: '3' },
    { title: 'Several modes',           code: "import statistics\nstatistics.multimode('aabbbbccddddeeffffgg')",  returns: "['b', 'd', 'f']" },
    { title: 'Empty: [] from multimode', code: "import statistics\nstatistics.multimode('')",                     returns: '[]' },
    { title: 'Equal values count together', code: 'import statistics\nstatistics.multimode([1, 1.0, True])',   returns: '[1]' },
    { title: 'Tuples are hashable',     code: 'import statistics\nstatistics.mode([(1, 2), (1, 2), (3,)])',       returns: '(1, 2)' },
    { title: 'Lists are not',           code: 'import statistics\nstatistics.mode([[1], [1]])',                    returns: "TypeError: unhashable type: 'list'" },
    { title: 'Any iterable',            code: "import statistics\nstatistics.mode(x.lower() for x in ['Red', 'red', 'RED', 'blue'])", returns: "'red'" },
  ],

  pitfalls: [
    {
      name: 'Expecting the smallest value on a tie',
      desc: 'mode() returns the first value encountered, not the smallest or largest.',
      wrong: { label: 'mode', code: 'import statistics\nstatistics.mode([3, 3, 1, 1, 2])', output: '3' },
      fix:   { label: 'min(multimode)', code: 'import statistics\nmin(statistics.multimode([3, 3, 1, 1, 2]))', output: '1' },
    },
    {
      name: 'Unhashable values',
      desc: 'Counter needs hashable items. Convert lists to tuples, or use the slower max(data, key=data.count) the docs suggest.',
      wrong: { label: 'lists', code: 'import statistics\nstatistics.mode([[1], [1], [2]])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'tuples', code: 'import statistics\nstatistics.mode([tuple(x) for x in [[1], [1], [2]]])', output: '(1,)' },
    },
  ],

  when: {
    use: ['Most common category, answer, size or label', 'Discrete numeric data (dice, counts, ratings)'],
    avoid: ['Continuous measurements — almost every value is unique; use kde() or histogram bins', 'Frequencies too → collections.Counter'],
  },

  notes: {
    cpython:    'Lib/statistics.py: mode is Counter(iter(data)).most_common(1)[0][0] (most_common(1) uses max(), which keeps the first maximal item); multimode collects every key whose count equals the maximum, in insertion order',
    'Versions': 'Before 3.8 mode() raised StatisticsError when there was more than one mode; multimode() was added in 3.8',
    'NaN':      'Each NaN object is a separate key, so NaNs do not group together',
  },

  related: [
    { name: 'median', slug: 'median-median_low-median_high', when: 'The middle value' },
    { name: 'mean', slug: 'mean', when: 'The average' },
    { name: 'collections module', slug: 'collections', when: 'Counter for full frequency tables', category: 'stdlib' },
    { name: 'max()', slug: 'max', when: 'max(data, key=data.count) for unhashable data', category: 'functions' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'mode() of empty data' },
  ],

  faq: [
    {
      q: 'How do I find the most common element in a list in Python?',
      a: 'statistics.mode(data) returns it (the first one on a tie). collections.Counter(data).most_common(1) also gives its count.',
    },
    {
      q: 'What happens with two modes?',
      a: 'Since Python 3.8 mode() returns the one that appears first in the data; earlier versions raised StatisticsError. multimode() returns all of them.',
    },
    {
      q: 'Why does multimode return every value?',
      a: 'If all values occur equally often (for example each once), every value is tied for most common, so all of them are modes.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.mode',
    meta:  'statistics.mode',
  },
};
