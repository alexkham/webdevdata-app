// content/reference/python/exceptions/indexerror.js

export const meta = {
  slug:        'indexerror',
  name:        'IndexError',
  signature:   'IndexError(*args)',
  blurb:       'Raised when a sequence index (list, tuple, str, range, bytes) is outside the valid range.',
  category:    'lookup',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'indexerror index error list index out of range string index out of range tuple pop from empty list sequence subscript off by one',
};

export const method = {
  slug:      'indexerror',
  name:      'IndexError',
  signature: 'IndexError(*args)',

  category:    'Lookup exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'seq[i] where i is not between -len(seq) and len(seq) - 1. Slices never raise it — only single-position access does.',

  chain: ['BaseException', 'Exception', 'LookupError', 'IndexError'],

  cheat: {
    raisedBy: 'seq[i], seq[i] = x, del seq[i], list.pop(), list.pop(i)',
    message:  "'<type> index out of range' / 'pop from empty list'",
    quickFix: 'check len(seq) first, or use seq[-1] / a slice',
    watchOut: 'last valid index is len(seq) - 1, not len(seq)',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string. Stored in e.args; str(e) is that message.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Index a 3-item list. Valid positions are 0..2 counting from the front and -1..-3 from the back.',
      params: [{ name: 'i', type: 'int', hint: 'index to read', input: 'number' }],
      template: "items = ['a', 'b', 'c']\nitems[{$i}]",
      cases: [
        { id: 'first', label: 'first (0)',    values: { i: '0' } },
        { id: 'last',  label: 'last (-1)',    values: { i: '-1' } },
        { id: 'len',   label: 'len(items)',   values: { i: '3' } },
        { id: 'neg',   label: 'too negative', values: { i: '-4' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'A custom sequence raises IndexError itself from __getitem__. This is also what ends a for loop over an object that only defines __getitem__.',
      params: [{ name: 'i', type: 'int', hint: 'index to read', input: 'number' }],
      template: "class Squares:\n    def __init__(self, n):\n        self.n = n\n    def __getitem__(self, i):\n        if not 0 <= i < self.n:\n            raise IndexError(f'Squares index {i} out of range')\n        return i * i\n\nsq = Squares(5)\nsq[{$i}]",
      cases: [
        { id: 'ok',   label: 'in range',   values: { i: '4' } },
        { id: 'over', label: 'past end',   values: { i: '5' } },
        { id: 'neg',  label: 'negative',   values: { i: '-1' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Pop from a stack that may be empty. Clear the input to see the empty-list message.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' }],
      template: "stack = {$items}\ntry:\n    top = stack.pop()\nexcept IndexError as e:\n    top = f'nothing to pop: {e}'\ntop",
      cases: [
        { id: 'full',  label: 'two items', values: { items: 'a, b' } },
        { id: 'empty', label: 'empty',     values: { items: '' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, 3 fails but -3 works: negative indexes count from the end, so the valid range is -len..len-1. The message names the type (list index out of range), and pop() on an empty list has its own wording. In Raise, note that the custom class rejects -1 — negative indexing is not automatic; a class only gets it if __getitem__ implements it.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: 'The constructor arguments — for built-in sequences, one message string. IndexError has no attribute holding the bad index.' },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised (implicit chaining).' },
    { name: '__cause__',   type: 'BaseException | None', meaning: 'Set by raise ... from ...' },
  ],

  patterns: [
    {
      name: 'Last item without counting',
      desc: 'seq[-1] is the last element — no len() arithmetic to get wrong. It still raises on an empty sequence.',
      code: "last = items[-1] if items else None",
    },
    {
      name: 'Optional field from split()',
      desc: 'Parsed lines often have fewer fields than expected. Check the length instead of indexing blindly.',
      code: "parts = line.split(',')\nemail = parts[2] if len(parts) > 2 else ''",
    },
    {
      name: 'Pad with a slice',
      desc: 'Slices clamp to the sequence bounds, so unpacking a padded slice never raises IndexError.',
      code: "first, second = (row + [None, None])[:2]",
    },
    {
      name: 'First item or default',
      desc: 'next() with a default avoids both IndexError on [] and building a list at all.',
      code: "first = next(iter(results), None)",
    },
  ],

  examples: [
    { title: 'One past the end',                code: "[1, 2, 3][3]",                    returns: 'IndexError: list index out of range' },
    { title: 'Too far negative',                code: "[1, 2, 3][-4]",                   returns: 'IndexError: list index out of range' },
    { title: 'Empty string, first character',   code: "line = ''\nline[0]",              returns: 'IndexError: string index out of range' },
    { title: 'Missing field after split()',     code: "'a,b'.split(',')[2]",             returns: 'IndexError: list index out of range' },
    { title: 'pop() on an empty list',          code: "[].pop()",                        returns: 'IndexError: pop from empty list' },
    { title: 'Tuples and ranges name themselves', code: "(1, 2)[2]",                     returns: 'IndexError: tuple index out of range' },
    { title: 'Slices never raise',              code: "[1, 2, 3][1:10]",                 returns: '[2, 3]' },
    { title: 'Caught as LookupError',           code: "try:\n    'abc'[10]\nexcept LookupError as e:\n    print(type(e).__name__)", returns: 'IndexError' },
  ],

  pitfalls: [
    {
      name: 'len(seq) is not a valid index',
      desc: 'Indexes start at 0, so a 3-item list ends at index 2. Use -1 for the last item.',
      wrong: { label: 'items[len(items)]', code: "items = ['a', 'b', 'c']\nitems[len(items)]", output: 'IndexError: list index out of range' },
      fix:   { label: 'items[-1]',         code: "items = ['a', 'b', 'c']\nitems[-1]",         output: "'c'" },
    },
    {
      name: 'Removing items while looping by index',
      desc: 'range(len(nums)) is computed once; every pop() shortens the list, so later indexes run off the end.',
      wrong: { label: 'pop inside range loop', code: "nums = [1, 2, 3, 4]\nfor i in range(len(nums)):\n    if nums[i] % 2 == 0:\n        nums.pop(i)", output: 'IndexError: list index out of range' },
      fix:   { label: 'Build a new list',      code: "nums = [1, 2, 3, 4]\nnums = [n for n in nums if n % 2]\nnums", output: '[1, 3]' },
    },
    {
      name: 'Assigning past the end does not grow a list',
      desc: 'Unlike JavaScript arrays or dicts, lists do not create slots on assignment. Append instead.',
      wrong: { label: 'nums[2] = 3', code: "nums = [1, 2]\nnums[2] = 3", output: 'IndexError: list assignment index out of range' },
      fix:   { label: 'append()',    code: "nums = [1, 2]\nnums.append(3)\nnums", output: '[1, 2, 3]' },
    },
  ],

  when: {
    use: [
      'Raising it from your own __getitem__ for an out-of-range position',
      'Catching it around a pop() on a stack or queue that may be empty',
      'EAFP access where an out-of-range index is genuinely exceptional',
    ],
    avoid: [
      'Reading the last item → seq[-1] (guarded by if seq)',
      'Optional trailing fields → check len() or pad with a slice',
      'Missing dict key → that is KeyError; catch LookupError for both',
    ],
  },

  notes: {
    'Per-type text': 'The message names the type: list, tuple, string, range object, bytearray, array index out of range; bytes says just "index out of range"',
    'Catch via': 'except LookupError catches IndexError and KeyError',
    'Huge index': "An index beyond the C ssize_t range raises IndexError: cannot fit 'int' into an index-sized integer",
    'Not an int': 'A str or float index raises TypeError (list indices must be integers or slices), not IndexError',
  },

  related: [
    { name: 'LookupError', slug: 'lookuperror', when: 'Base class for index and key misses' },
    { name: 'KeyError',    slug: 'keyerror',    when: 'The mapping counterpart' },
    { name: 'StopIteration', slug: 'stopiteration', when: 'How iterators signal the end instead' },
    { name: 'list.pop',    slug: 'list-pop',    when: 'Raises IndexError on an empty list', category: 'functions' },
    { name: 'len',         slug: 'len',         when: 'Check the bounds first', category: 'functions' },
    { name: 'next',        slug: 'next',        when: 'First item with a default', category: 'functions' },
    { name: 'enumerate',   slug: 'enumerate',   when: 'Loop with indexes without range(len())', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does "list index out of range" mean in Python?',
      a: 'You asked for a position the list does not have. A list of length n has indexes 0 to n - 1, and -1 to -n from the end. The most common causes are using len(items) as an index, reading items[0] from an empty list, and indexing a split() result that has fewer fields than expected.',
    },
    {
      q: 'Why does slicing not raise IndexError?',
      a: 'Slice bounds are clamped to the sequence: [1, 2, 3][1:10] is [2, 3] and [][5:] is []. Only single-position access (seq[i]) checks the range. The docs call this out: slice indices are silently truncated.',
    },
    {
      q: 'How do I get the last element safely?',
      a: 'seq[-1] gives the last element without len() arithmetic. It still raises IndexError on an empty sequence, so guard it: seq[-1] if seq else None.',
    },
    {
      q: 'IndexError vs KeyError — which one do I catch?',
      a: 'IndexError is for sequences (position lookup), KeyError for mappings and sets (key lookup). If code can hit either, catch their common base class LookupError.',
    },
    {
      q: 'Why is sys.argv[1] raising IndexError?',
      a: 'The script was started without command-line arguments, so sys.argv only contains the script name. Check len(sys.argv) first, or use argparse, which reports missing arguments with a proper usage message.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#IndexError',
    meta:  'Built-in exceptions',
  },
};
