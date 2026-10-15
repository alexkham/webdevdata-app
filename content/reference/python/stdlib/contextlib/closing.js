// content/reference/python/stdlib/contextlib/closing.js — closing / aclosing

export const meta = {
  slug:        'closing',
  name:        'contextlib.closing / aclosing',
  signature:   'contextlib.closing(thing) · contextlib.aclosing(thing)',
  blurb:       'Wrap any object that has a close() method (or aclose() for aclosing) so a with statement calls it at the end of the block — even when the block raises.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+ (aclosing 3.10+)',
  searchTerms: 'contextlib closing aclosing python close object with statement call close automatically generator close async generator aclose cleanup legacy object without context manager',
};

export const method = {
  slug:      'closing',
  name:      'contextlib.closing / aclosing',
  signature: 'contextlib.closing(thing) · contextlib.aclosing(thing)',
  returns:   { type: 'closing · aclosing', desc: 'A context manager whose __enter__ returns thing itself and whose exit calls thing.close() (aclosing: await thing.aclose()).' },

  category:    'contextlib class',
  version:     'Python 2.5+ (aclosing 3.10+)',
  hasLiveDemo: true,

  subtitle: 'For objects that have close() but no __enter__/__exit__ — third-party handles, generators, old APIs. aclosing does the same for async generators, whose cleanup otherwise waits for garbage collection.',

  covers: ['closing', 'aclosing'],

  cheat: {
    commonCall: 'with closing(make_resource()) as r:\n    r.use()',
    returns:    'r is the object itself; r.close() runs at the end',
    replaces:   'try: … finally: r.close()',
    watchOut:   'only close() is called — exceptions are never suppressed',
  },

  parameters: [
    { name: 'thing', type: 'object', required: true, default: null, desc: 'closing: any object with a close() method. aclosing: any object with an awaitable aclose(), typically an async generator.' },
  ],

  modes: [
    {
      id: 'close',
      label: 'closing',
      blurb: 'Connection has close() but is not a context manager. closing() calls it — also when the block fails. Try n = 0.',
      params: [
        { name: 'name', type: 'str', hint: 'connection name', input: 'text' },
        { name: 'n',    type: 'int', hint: 'divisor in the body', input: 'number' },
      ],
      template: "from contextlib import closing\nlog = []\nclass Connection:\n    def __init__(self, name):\n        self.name = name\n    def close(self):\n        log.append('closed ' + self.name)\ntry:\n    with closing(Connection({$name})) as conn:\n        log.append('query on ' + conn.name)\n        log.append(100 // {$n})\nexcept ZeroDivisionError:\n    log.append('error escaped')\nlog",
      cases: [
        { id: 'ok',   label: 'n = 2', values: { name: 'db', n: '2' } },
        { id: 'zero', label: 'n = 0', values: { name: 'db', n: '0' } },
      ],
    },
  ],
  demoExplainer: "The value bound by as is the Connection itself, not a wrapper. With n = 0 close() runs first and the ZeroDivisionError then continues to the except clause: closing never swallows exceptions.",

  patterns: [
    {
      name: 'Stop a generator early, deterministically',
      desc: "Its finally blocks run as soon as the with ends, not when the generator is garbage collected.",
      code: 'from contextlib import closing\nwith closing(read_records(path)) as records:\n    for rec in records:\n        if rec.done:\n            break',
    },
    {
      name: 'Async generator with an early exit (3.10+)',
      desc: 'aclosing runs the generator\'s cleanup inside the same task.',
      code: 'from contextlib import aclosing\n\nasync def first_last_event():\n    async with aclosing(stream_events()) as events:\n        async for event in events:\n            if event.last:\n                return event',
    },
    {
      name: 'Third-party objects without with support',
      desc: 'Anything with close() works.',
      code: 'from contextlib import closing\nwith closing(legacy_client.connect()) as conn:\n    conn.send(data)',
    },
  ],

  examples: [
    { title: 'close() at the end',              code: "from contextlib import closing\nclass Resource:\n    def close(self):\n        print('closed')\nwith closing(Resource()) as r:\n    print('using', type(r).__name__)", returns: 'using Resource\nclosed' },
    { title: 'Also when the block raises',      code: "from contextlib import closing\nclass Resource:\n    def close(self):\n        print('closed')\ntry:\n    with closing(Resource()):\n        raise ValueError('boom')\nexcept ValueError as e:\n    print('caught', e)", returns: 'closed\ncaught boom' },
    { title: 'as binds the object itself',      code: "from contextlib import closing\nclass Resource:\n    def close(self):\n        print('closed')\nr = Resource()\nwith closing(r) as same:\n    pass\nsame is r", returns: 'closed\nTrue' },
    { title: 'Closing a generator after break', code: "from contextlib import closing\ndef numbers():\n    try:\n        yield 1\n        yield 2\n    finally:\n        print('generator cleaned up')\nwith closing(numbers()) as gen:\n    for n in gen:\n        print(n)\n        break", returns: '1\ngenerator cleaned up' },
    { title: 'aclosing an async generator',    code: "import asyncio\nfrom contextlib import aclosing\nasync def ticker():\n    try:\n        for i in range(10):\n            yield i\n    finally:\n        print('ticker closed')\nasync def main():\n    async with aclosing(ticker()) as t:\n        async for i in t:\n            if i == 2:\n                break\n    print('after the loop')\nasyncio.run(main())", returns: 'ticker closed\nafter the loop' },
    { title: 'Works on files too (but with open() is enough)', code: "from contextlib import closing\nwith closing(open('notes.txt', 'w')) as f:\n    f.write('x')\nf.closed", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Passing an object without close()',
      desc: 'closing does not check its argument; the error appears only at the end of the block.',
      wrong: { label: 'closing(42)', code: 'from contextlib import closing\nwith closing(42):\n    pass', output: "AttributeError: 'int' object has no attribute 'close'" },
      fix:   { label: 'nullcontext', code: 'from contextlib import nullcontext\nwith nullcontext(42) as value:\n    pass\nvalue', output: '42' },
    },
    {
      name: 'Wrapping something that is already a context manager',
      desc: 'Files, sockets and most library objects support with directly. closing works but adds nothing — and it skips any extra logic of the object\'s own __exit__.',
      wrong: { label: 'closing(open())', code: "from contextlib import closing\nwith closing(open('a.txt', 'w')) as f:\n    f.write('x')\nf.closed", output: 'True' },
      fix:   { label: 'with open()', code: "with open('a.txt', 'w') as f:\n    f.write('x')\nf.closed", output: 'True' },
    },
  ],

  when: {
    use: [
      'Objects with close() that do not implement the context manager protocol',
      'Generators you may abandon early — their finally blocks run right away',
      'Async generators left early with break — aclosing',
    ],
    avoid: [
      'Files, sockets, locks and other context managers → use them in with directly',
      'Cleanup that is not a close() call → contextlib.contextmanager or ExitStack.callback',
    ],
  },

  notes: {
    cpython:     'Lib/contextlib.py: closing.__enter__ returns self.thing, __exit__ calls self.thing.close() and returns None; aclosing awaits self.thing.aclose()',
    'Generators': 'gen.close() raises GeneratorExit inside a suspended generator, which runs its finally blocks; closing(gen) makes that happen at a known point',
    'aclosing':  'Added in 3.10. Without it an abandoned async generator is finalized later by the event loop, outside the code that used it',
  },

  related: [
    { name: 'contextlib.nullcontext', slug: 'nullcontext', when: 'A context manager that does nothing at all' },
    { name: 'ExitStack.callback',     slug: 'exitstack',   when: 'Any cleanup function, not only close()' },
    { name: 'contextlib.contextmanager', slug: 'contextmanager', when: 'Custom cleanup logic' },
    { name: 'GeneratorExit', slug: 'generatorexit', when: 'What close() raises inside a generator', category: 'exceptions' },
    { name: 'with',          slug: 'with',          when: 'The statement closing plugs into', category: 'keywords' },
  ],

  faq: [
    {
      q: 'When should I use contextlib.closing?',
      a: 'When an object has a close() method but cannot be used in a with statement itself — older libraries, custom classes, generators. For files and other objects that already support with, closing is unnecessary.',
    },
    {
      q: 'Does contextlib.closing suppress exceptions?',
      a: 'No. Its __exit__ calls close() and returns None, so any exception from the block continues after close() has run.',
    },
    {
      q: 'What is aclosing for?',
      a: 'aclosing (3.10+) is closing for async code: it awaits thing.aclose() at the end of an async with block. Use it around async generators you might leave early, so their cleanup runs immediately and in the right task.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.closing',
    meta:  'contextlib.closing',
  },
};
