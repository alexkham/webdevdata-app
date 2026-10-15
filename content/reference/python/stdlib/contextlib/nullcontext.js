// content/reference/python/stdlib/contextlib/nullcontext.js

export const meta = {
  slug:        'nullcontext',
  name:        'contextlib.nullcontext',
  signature:   'contextlib.nullcontext(enter_result=None)',
  blurb:       'A context manager that does nothing: __enter__ returns enter_result and __exit__ suppresses nothing. A stand-in where a real context manager is only sometimes needed.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'contextlib nullcontext python optional context manager do nothing context manager conditional with statement dummy context manager no-op enter_result file or path',
};

export const method = {
  slug:      'nullcontext',
  name:      'contextlib.nullcontext',
  signature: 'contextlib.nullcontext(enter_result=None)',
  returns:   { type: 'nullcontext', desc: 'A context manager for both with and async with (3.10+); "as" binds enter_result.' },

  category:    'contextlib class',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'Lets one with statement serve two cases: "cm = real_cm() if needed else nullcontext()". With enter_result it also passes through an object the caller owns — a file you must not close.',

  covers: ['nullcontext'],

  cheat: {
    commonCall: 'cm = lock if lock is not None else nullcontext()\nwith cm:\n    ...',
    returns:    'enter_result (None by default) from __enter__',
    replaces:   'duplicated code paths with and without a with statement',
    watchOut:   'it never closes or suppresses anything — by design',
  },

  parameters: [
    { name: 'enter_result', type: 'object', required: false, default: 'None', desc: 'Returned unchanged by __enter__ / __aenter__, so "as" binds it.' },
  ],

  modes: [
    {
      id: 'standin',
      label: 'file or path',
      blurb: 'A str would be opened (and closed); a file object you pass in is wrapped in nullcontext, so it is read but left open.',
      params: [{ name: 'text', type: 'str', hint: 'file content', input: 'text' }],
      template: "import io\nfrom contextlib import nullcontext\ndef read_all(source):\n    cm = open(source) if isinstance(source, str) else nullcontext(source)\n    with cm as f:\n        return f.read()\nbuf = io.StringIO({$text})\nread_all(buf), buf.closed",
      cases: [
        { id: 'data',  label: 'some text', values: { text: 'data' } },
        { id: 'empty', label: 'empty',     values: { text: '' } },
      ],
    },
    {
      id: 'optional',
      label: 'optional suppress',
      blurb: 'The same lookup, once with suppress(KeyError) and once with nullcontext() in its place.',
      params: [{ name: 'item', type: 'str', hint: 'tea, cake or anything else', input: 'text' }],
      template: "from contextlib import nullcontext, suppress\nprices = {'tea': 3, 'cake': 5}\ndef price(item, lenient):\n    with suppress(KeyError) if lenient else nullcontext():\n        return prices[item]\n    return None\nresults = []\nfor lenient in (True, False):\n    try:\n        results.append(price({$item}, lenient))\n    except KeyError as e:\n        results.append(f'KeyError: {e}')\nresults",
      cases: [
        { id: 'tea',    label: 'tea',    values: { item: 'tea' } },
        { id: 'coffee', label: 'coffee', values: { item: 'coffee' } },
      ],
    },
  ],
  demoExplainer: "read_all returns the text and buf.closed is False: nullcontext handed the caller's buffer through without closing it. In the second tab a known item gives the price both times; an unknown one gives None when suppress is in place and the KeyError when nullcontext stands in for it.",

  patterns: [
    {
      name: 'Optional lock',
      desc: 'One code path for both cases.',
      code: 'from contextlib import nullcontext\n\ndef update(data, lock=None):\n    with lock if lock is not None else nullcontext():\n        data.append(1)',
    },
    {
      name: 'Accept a path or an open file',
      desc: 'Open (and close) what you were given by name; leave caller-owned files open.',
      code: 'from contextlib import nullcontext\n\ndef process(file_or_path):\n    cm = open(file_or_path) if isinstance(file_or_path, str) else nullcontext(file_or_path)\n    with cm as f:\n        return f.read()',
    },
    {
      name: 'Optional async session (3.10+)',
      desc: 'nullcontext also works with async with.',
      code: 'from contextlib import nullcontext\n\nasync def fetch(url, session=None):\n    cm = make_session() if session is None else nullcontext(session)\n    async with cm as s:\n        return await s.get(url)',
    },
  ],

  examples: [
    { title: 'as binds enter_result',      code: "from contextlib import nullcontext\nwith nullcontext('value') as v:\n    pass\nv", returns: "'value'" },
    { title: 'Default enter_result is None', code: 'from contextlib import nullcontext\nwith nullcontext() as v:\n    pass\nv is None', returns: 'True' },
    { title: 'Caller-owned file stays open', code: "import io\nfrom contextlib import nullcontext\ndef read_all(source):\n    cm = open(source) if isinstance(source, str) else nullcontext(source)\n    with cm as f:\n        return f.read()\nbuf = io.StringIO('data')\nread_all(buf), buf.closed", returns: "('data', False)" },
    { title: 'A path is opened and closed', code: "from contextlib import nullcontext\ndef read_all(source):\n    cm = open(source) if isinstance(source, str) else nullcontext(source)\n    with cm as f:\n        return f.read()\nwith open('in.txt', 'w') as f:\n    f.write('from file')\nread_all('in.txt')", returns: "'from file'" },
    { title: 'Exceptions pass through',     code: "from contextlib import nullcontext\ntry:\n    with nullcontext():\n        raise ValueError('not swallowed')\nexcept ValueError as e:\n    print('still raised:', e)", returns: 'still raised: not swallowed' },
    { title: 'Optional lock',               code: 'import threading\nfrom contextlib import nullcontext\ndef update(data, lock=None):\n    with lock if lock is not None else nullcontext():\n        data.append(1)\nd = []\nupdate(d)\nupdate(d, threading.Lock())\nd', returns: '[1, 1]' },
    { title: 'async with too (3.10+)',      code: 'import asyncio\nfrom contextlib import nullcontext\nasync def main():\n    async with nullcontext(7) as v:\n        return v\nasyncio.run(main())', returns: '7' },
  ],

  pitfalls: [
    {
      name: 'Using the caller\'s file as the context manager',
      desc: 'A file object is its own context manager — and closes itself on exit. The caller\'s buffer is unusable afterwards. Wrap it in nullcontext instead.',
      wrong: { label: 'with source', code: "import io\ndef read_all(source):\n    with source if hasattr(source, 'read') else open(source) as f:\n        return f.read()\nbuf = io.StringIO('data')\nread_all(buf), buf.closed", output: "('data', True)" },
      fix:   { label: 'nullcontext(source)', code: "import io\nfrom contextlib import nullcontext\ndef read_all(source):\n    with nullcontext(source) if hasattr(source, 'read') else open(source) as f:\n        return f.read()\nbuf = io.StringIO('data')\nread_all(buf), buf.closed", output: "('data', False)" },
    },
    {
      name: 'Expecting a "do nothing" context to ignore errors',
      desc: 'nullcontext does nothing on exit — including nothing about exceptions. To ignore one, use suppress.',
      wrong: { label: 'nullcontext()', code: "from contextlib import nullcontext\nwith nullcontext():\n    {}['missing']", output: "KeyError: 'missing'" },
      fix:   { label: 'suppress(KeyError)', code: "from contextlib import suppress\nwith suppress(KeyError):\n    {}['missing']\n'ignored'", output: "'ignored'" },
    },
  ],

  when: {
    use: [
      'A context manager that is optional — a lock, a transaction, suppress — with one shared code path',
      'Functions that accept either a path (open and close it) or an open file (leave it open)',
    ],
    avoid: [
      'Always-on behaviour → use the real context manager directly',
      'Suppressing errors → contextlib.suppress; nullcontext never suppresses',
    ],
  },

  notes: {
    cpython:   'Lib/contextlib.py: __enter__ returns self.enter_result, __exit__ does nothing (returns None); __aenter__ / __aexit__ the same since 3.10',
    'Reusable': 'One nullcontext object can be entered any number of times, even nested',
  },

  related: [
    { name: 'contextlib.suppress', slug: 'suppress', when: 'A common optional context manager' },
    { name: 'contextlib.closing',  slug: 'closing',  when: 'When the object should be closed' },
    { name: 'ExitStack',           slug: 'exitstack', when: 'Several optional context managers' },
    { name: 'open()',              slug: 'open',     when: 'The path branch of the pattern', category: 'functions' },
    { name: 'with',                slug: 'with',     when: 'The statement nullcontext stands in for', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What is contextlib.nullcontext used for?',
      a: 'As a do-nothing placeholder when a with statement needs a context manager only in some cases: cm = suppress(Error) if lenient else nullcontext(). It returns its argument from __enter__ and never closes or suppresses anything.',
    },
    {
      q: 'How do I make a with statement optional in Python?',
      a: 'Choose the context manager in an expression and fall back to contextlib.nullcontext(): "with lock if lock else nullcontext():". For several optional context managers, use ExitStack and enter only the ones you need.',
    },
    {
      q: 'Does nullcontext work with async with?',
      a: 'Yes, since Python 3.10 it also has __aenter__ and __aexit__, so it can stand in for an asynchronous context manager such as an optional client session.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.nullcontext',
    meta:  'contextlib.nullcontext',
  },
};
