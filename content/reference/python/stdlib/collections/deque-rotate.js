// content/reference/python/stdlib/collections/deque-rotate.js

export const meta = {
  slug:        'deque-rotate',
  name:        'deque rotate / reverse',
  signature:   'deque.rotate(n=1)  ·  deque.reverse()',
  blurb:       'Rotate a deque n steps to the right (negative n: to the left), or reverse it — both in place.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.4+ (reverse 3.2+)',
  searchTerms: 'deque rotate reverse deque.rotate deque.reverse rotate list circular shift round robin python collections',
};

export const method = {
  slug:      'deque-rotate',
  name:      'deque rotate / reverse',
  signature: 'deque.rotate(n=1)',
  returns:   { type: 'None', desc: 'Both change the deque in place.' },

  category:    'deque methods',
  version:     'Python 2.4+ (reverse 3.2+)',
  hasLiveDemo: true,

  subtitle: 'rotate(1) moves the last item to the front; rotate(-1) moves the first item to the end. n larger than the length wraps around. reverse() flips the order without building a new deque.',

  covers: ['deque.rotate', 'deque.reverse'],

  cheat: {
    commonCall: 'd.rotate(1) · d.rotate(-1) · d.reverse()',
    returns:    'None',
    replaces:   'lst[-n:] + lst[:-n]',
    watchOut:   'positive n rotates RIGHT (last item to the front)',
  },

  parameters: [
    { name: 'n', type: 'int', required: false, default: '1', desc: 'Steps to the right; negative for left. Equivalent to n pops from one end appended to the other.' },
  ],

  modes: [
    {
      id: 'rotate',
      label: 'rotate',
      blurb: 'Positive n: right. Negative n: left.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'items', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'steps', input: 'number' },
      ],
      template: 'from collections import deque\nd = deque({$items})\nd.rotate({$n})\nd',
      cases: [
        { id: 'right', label: 'n=1',  values: { items: 'a, b, c, d, e', n: '1' } },
        { id: 'left',  label: 'n=-2', values: { items: 'a, b, c, d, e', n: '-2' } },
        { id: 'wrap',  label: 'n=7',  values: { items: 'a, b, c, d, e', n: '7' } },
        { id: 'empty', label: 'empty', values: { items: '', n: '3' } },
      ],
    },
    {
      id: 'reverse',
      label: 'reverse',
      blurb: 'Reverse in place.',
      params: [{ name: 'items', type: 'list[str]', hint: 'items', input: 'csv' }],
      template: 'from collections import deque\nd = deque({$items})\nd.reverse()\nd',
      cases: [
        { id: 'abc', label: 'a, b, c', values: { items: 'a, b, c' } },
        { id: 'one', label: 'one',     values: { items: 'x' } },
      ],
    },
  ],
  demoExplainer: 'On a five-item deque rotate(7) gives the same result as rotate(2): the steps wrap around the length. Rotating an empty deque is allowed and does nothing.',

  patterns: [
    {
      name: 'Round-robin scheduling',
      desc: 'Serve the front item, then rotate it to the back.',
      code: 'from collections import deque\nworkers = deque(names)\ncurrent = workers[0]\nworkers.rotate(-1)',
    },
    {
      name: 'Delete the i-th item (docs recipe)',
      desc: 'Rotate it to the front, popleft, rotate back.',
      code: 'from collections import deque\nd.rotate(-i)\nd.popleft()\nd.rotate(i)',
    },
    {
      name: 'Reversed copy instead of in place',
      desc: 'reversed() gives an iterator and leaves d alone.',
      code: 'from collections import deque\nbackwards = deque(reversed(d))',
    },
  ],

  examples: [
    { title: 'Rotate right by one',      code: 'from collections import deque\nd = deque([1, 2, 3, 4])\nd.rotate()\nd', returns: 'deque([4, 1, 2, 3])' },
    { title: 'Rotate left by one',       code: 'from collections import deque\nd = deque([1, 2, 3, 4])\nd.rotate(-1)\nd', returns: 'deque([2, 3, 4, 1])' },
    { title: 'n wraps around',           code: 'from collections import deque\nd = deque([1, 2, 3])\nd.rotate(4)\nd', returns: 'deque([3, 1, 2])' },
    { title: 'reverse in place',         code: "from collections import deque\nd = deque('abc')\nd.reverse()\nd", returns: "deque(['c', 'b', 'a'])" },
    { title: 'Rotation keeps maxlen',    code: 'from collections import deque\nd = deque([1, 2, 3], maxlen=3)\nd.rotate(1)\nd', returns: 'deque([3, 1, 2], maxlen=3)' },
    { title: 'n must be an int',         code: 'from collections import deque\ndeque([1, 2]).rotate(1.5)', returns: "TypeError: 'float' object cannot be interpreted as an integer" },
  ],

  pitfalls: [
    {
      name: 'Rotating the wrong way',
      desc: 'Positive n moves items to the RIGHT (the end wraps to the front). To bring the next item to the front, rotate by -1.',
      wrong: { label: 'rotate(1)',  code: "from collections import deque\nd = deque(['a', 'b', 'c'])\nd.rotate(1)\nd[0]", output: "'c'" },
      fix:   { label: 'rotate(-1)', code: "from collections import deque\nd = deque(['a', 'b', 'c'])\nd.rotate(-1)\nd[0]", output: "'b'" },
    },
    {
      name: 'Using the return value',
      desc: 'rotate and reverse return None, like list.reverse.',
      wrong: { label: 'd = d.rotate()', code: 'from collections import deque\nd = deque([1, 2])\nd = d.rotate()\nprint(d)', output: 'None' },
      fix:   { label: 'call, keep d',   code: 'from collections import deque\nd = deque([1, 2])\nd.rotate()\nd', output: 'deque([2, 1])' },
    },
  ],

  when: {
    use: [
      'Round-robin and circular-buffer logic',
      'Shifting a sequence without building new lists',
    ],
    avoid: [
      'A rotated copy of a list you will index heavily → slicing lst[-n:] + lst[:-n]',
    ],
  },

  notes: {
    cpython:    '_deque_rotate in Modules/_collectionsmodule.c first maps n into the range -len/2 … len/2 (so it never moves more than half the items), then shifts them between blocks',
    'Versions': 'rotate since 2.4; reverse added in 3.2 (docs.python.org)',
  },

  related: [
    { name: 'deque',              slug: 'deque',        when: 'Create and index' },
    { name: 'deque append / pop', slug: 'deque-append', when: 'rotate(1) is pop + appendleft' },
    { name: 'list.reverse',       slug: 'list-reverse', when: 'The list equivalent', category: 'functions' },
    { name: 'reversed()',         slug: 'reversed',     when: 'A reversed iterator, no mutation', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I rotate a list in Python?',
      a: 'Put it in a deque and call rotate(n): positive n rotates right, negative left. For a plain list, lst[-n:] + lst[:-n] builds a rotated copy.',
    },
    {
      q: 'Which direction does deque.rotate go?',
      a: 'Right for positive n: d.rotate(1) is the same as d.appendleft(d.pop()). d.rotate(-1) is d.append(d.popleft()).',
    },
    {
      q: 'Does rotate work on a bounded deque?',
      a: 'Yes. Rotation never changes the length, so nothing is discarded and maxlen is kept.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.deque.rotate',
    meta:  'deque.rotate',
  },
};
