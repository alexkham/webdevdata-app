// content/reference/python/stdlib/contextlib/suppress.js

export const meta = {
  slug:        'suppress',
  name:        'contextlib.suppress',
  signature:   'contextlib.suppress(*exceptions)',
  blurb:       'Context manager that silently ends the with block when one of the listed exceptions is raised in it; execution continues after the with statement.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'contextlib suppress python ignore exception with suppress try except pass ignore FileNotFoundError ignore KeyError suppress multiple exceptions ExceptionGroup',
};

export const method = {
  slug:      'suppress',
  name:      'contextlib.suppress',
  signature: 'contextlib.suppress(*exceptions)',
  returns:   { type: 'suppress', desc: 'A reusable, re-entrant context manager; "as" binds None.' },

  category:    'contextlib class',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'The with-statement spelling of try / except X: pass. Subclasses of the listed types are suppressed too, everything else propagates, and since 3.12 matching exceptions are also removed from exception groups.',

  covers: ['suppress'],

  cheat: {
    commonCall: "with suppress(FileNotFoundError):\n    os.remove(path)",
    returns:    'None — the block just stops at the error',
    replaces:   'try: … except FileNotFoundError: pass',
    watchOut:   'everything after the failing line in the block is skipped',
  },

  parameters: [
    { name: '*exceptions', type: 'type[BaseException]', required: false, default: null, desc: 'Exception classes to ignore; their subclasses match too (issubclass). With no arguments nothing is suppressed.' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'KeyError',
      blurb: 'A missing key ends the block: print() is skipped and price keeps its old value.',
      params: [{ name: 'item', type: 'str', hint: 'tea, cake or anything else', input: 'text' }],
      template: "from contextlib import suppress\nprices = {'tea': 3, 'cake': 5}\nprice = None\nwith suppress(KeyError):\n    price = prices[{$item}]\n    print('found it')\nprice",
      cases: [
        { id: 'cake',   label: 'cake',   values: { item: 'cake' } },
        { id: 'coffee', label: 'coffee', values: { item: 'coffee' } },
      ],
    },
    {
      id: 'base',
      label: 'a base class',
      blurb: 'suppress(LookupError) covers both KeyError and IndexError — their common base class.',
      params: [
        { name: 'key', type: 'str', hint: "'items' or another key", input: 'text' },
        { name: 'i',   type: 'int', hint: 'list index', input: 'number' },
      ],
      template: "from contextlib import suppress\ndata = {'items': [10, 20, 30]}\nresult = None\nwith suppress(LookupError):\n    result = data[{$key}][{$i}]\nresult",
      cases: [
        { id: 'hit',   label: "'items'[1]",  values: { key: 'items', i: '1' } },
        { id: 'neg',   label: "'items'[-1]", values: { key: 'items', i: '-1' } },
        { id: 'index', label: 'index 5',     values: { key: 'items', i: '5' } },
        { id: 'key',   label: 'unknown key', values: { key: 'values', i: '0' } },
      ],
    },
  ],
  demoExplainer: "For a known item the block runs to the end and prints 'found it'; for an unknown one prices[item] raises KeyError, the rest of the block is skipped and price stays None. In the second tab both the IndexError of index 5 and the KeyError of an unknown key are LookupError subclasses, so both leave result as None — a huge number such as 1e+21 is a float index, and its TypeError is not suppressed.",

  patterns: [
    {
      name: 'Delete a file that may not exist',
      desc: 'The classic use. (Path.unlink(missing_ok=True) is the alternative since 3.8.)',
      code: "import os\nfrom contextlib import suppress\nwith suppress(FileNotFoundError):\n    os.remove('cache.tmp')",
    },
    {
      name: 'Skip bad items in a loop',
      desc: 'Each iteration gets its own with statement, so one failure does not stop the loop.',
      code: 'from contextlib import suppress\nnumbers = []\nfor text in fields:\n    with suppress(ValueError):\n        numbers.append(int(text))',
    },
    {
      name: 'Several exception types',
      desc: 'List them all; a tuple is not needed.',
      code: 'from contextlib import suppress\nwith suppress(KeyError, IndexError, TypeError):\n    value = payload["items"][0]["id"]',
    },
  ],

  examples: [
    { title: 'The rest of the block is skipped', code: "from contextlib import suppress\nwith suppress(ZeroDivisionError):\n    1 / 0\n    print('not reached')\nprint('continues')", returns: 'continues' },
    { title: 'Ignore a missing file',          code: "import os\nfrom contextlib import suppress\nopen('tmp.txt', 'w').close()\nos.remove('tmp.txt')\nwith suppress(FileNotFoundError):\n    os.remove('tmp.txt')\nos.path.exists('tmp.txt')", returns: 'False' },
    { title: 'A base class covers subclasses', code: "from contextlib import suppress\nwith suppress(LookupError):\n    {}['missing']\n'ok'", returns: "'ok'" },
    { title: 'One with per item in a loop',    code: "from contextlib import suppress\nresults = []\nfor x in ['1', 'two', '3']:\n    with suppress(ValueError):\n        results.append(int(x))\nresults", returns: '[1, 3]' },
    { title: 'Other exceptions propagate',     code: "from contextlib import suppress\nwith suppress(KeyError):\n    int('x')", returns: "ValueError: invalid literal for int() with base 10: 'x'" },
    { title: 'No arguments: nothing suppressed', code: 'from contextlib import suppress\nwith suppress():\n    1 / 0', returns: 'ZeroDivisionError: division by zero' },
    { title: 'Exception groups are filtered (3.12+)', code: "from contextlib import suppress\nwith suppress(ValueError):\n    raise ExceptionGroup('batch', [ValueError('a'), TypeError('b')])", returns: 'ExceptionGroup: batch (1 sub-exception)' },
    { title: 'as binds None',                  code: 'from contextlib import suppress\nwith suppress(ValueError) as cm:\n    pass\ncm is None', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'One with around a whole loop',
      desc: 'The first error ends the with block — and with it the loop. Put the with inside the loop.',
      wrong: { label: 'with outside', code: "from contextlib import suppress\nresults = []\nwith suppress(ValueError):\n    for x in ['1', 'two', '3']:\n        results.append(int(x))\nresults", output: '[1]' },
      fix:   { label: 'with inside', code: "from contextlib import suppress\nresults = []\nfor x in ['1', 'two', '3']:\n    with suppress(ValueError):\n        results.append(int(x))\nresults", output: '[1, 3]' },
    },
    {
      name: 'suppress(Exception) hides bugs',
      desc: 'A typo raises NameError, which is an Exception too — and disappears. Name the exact type you expect.',
      wrong: { label: 'Exception', code: "from contextlib import suppress\nwith suppress(Exception):\n    undefined_name\n'silently ignored'", output: "'silently ignored'" },
      fix:   { label: 'the real type', code: "from contextlib import suppress\nwith suppress(KeyError):\n    undefined_name", output: "NameError: name 'undefined_name' is not defined" },
    },
  ],

  when: {
    use: [
      'An exception that is expected and needs no handling — a file that may not exist, an optional key',
      'Skipping bad items in a loop, one with per item',
    ],
    avoid: [
      'You need to log, count or react to the error → try / except',
      'Broad classes like Exception → they hide real bugs',
      'Getting a default from a dict → dict.get(key, default) is clearer',
    ],
  },

  notes: {
    cpython:        "Lib/contextlib.py: __exit__ returns True when issubclass(exctype, self._exceptions); for a BaseExceptionGroup it calls excinst.split() and re-raises the unmatched rest",
    'BaseException': 'suppress(Exception) does not catch KeyboardInterrupt or SystemExit — they are not Exception subclasses',
    'Reentrant':    'One suppress object can be used in several (even nested) with statements',
  },

  related: [
    { name: 'try',            slug: 'try',        when: 'try / except when you need to handle the error', category: 'keywords' },
    { name: 'with',           slug: 'with',       when: 'How __exit__ returning True suppresses', category: 'keywords' },
    { name: 'ExceptionGroup', slug: 'exceptiongroup', when: 'Groups suppress can filter (3.12+)', category: 'exceptions' },
    { name: 'LookupError',    slug: 'lookuperror', when: 'Base class of KeyError and IndexError', category: 'exceptions' },
    { name: 'dict.get()',     slug: 'get',        when: 'Default value instead of suppressing KeyError', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does contextlib.suppress do?',
      a: 'It ignores the listed exception types (and their subclasses) raised inside the with block. The block stops at the line that raised, and the program continues after the with statement as if nothing happened.',
    },
    {
      q: 'Is suppress slower or faster than try/except/pass?',
      a: 'Slower: every with statement creates a suppress object and calls its __enter__ and __exit__. The cost is well under a microsecond per use on CPython 3.13, so it only matters in very tight loops. Choose it for readability, not speed.',
    },
    {
      q: 'Can suppress ignore more than one exception type?',
      a: 'Yes: suppress(KeyError, IndexError) — pass the classes as separate arguments. A base class such as LookupError covers all its subclasses.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.suppress',
    meta:  'contextlib.suppress',
  },
};
