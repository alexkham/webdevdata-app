// content/reference/python/stdlib/sys/asyncgen-hooks.js — event-loop support hooks

export const meta = {
  slug:        'asyncgen-hooks',
  name:        'sys.set_asyncgen_hooks / set_coroutine_origin_tracking_depth',
  signature:   'sys.set_asyncgen_hooks(firstiter=…, finalizer=…) · sys.get_asyncgen_hooks() · sys.set_coroutine_origin_tracking_depth(depth) · sys.get_coroutine_origin_tracking_depth()',
  blurb:       'Two low-level hooks for async frameworks: asyncgen hooks let an event loop see every async generator start and finalize it on its own loop; coroutine origin tracking records where each coroutine object was created.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'asyncgen hooks 3.6+ · origin tracking 3.7+ (both provisional)',
  searchTerms: 'sys.set_asyncgen_hooks set_asyncgen_hooks sys.get_asyncgen_hooks get_asyncgen_hooks sys.set_coroutine_origin_tracking_depth set_coroutine_origin_tracking_depth sys.get_coroutine_origin_tracking_depth get_coroutine_origin_tracking_depth async generator finalizer firstiter cr_origin coroutine was never awaited asyncio debug',
};

export const method = {
  slug:      'asyncgen-hooks',
  name:      'sys.set_asyncgen_hooks / set_coroutine_origin_tracking_depth',
  signature: 'sys.set_asyncgen_hooks(firstiter=…, finalizer=…) · sys.get_asyncgen_hooks() · sys.set_coroutine_origin_tracking_depth(depth) · sys.get_coroutine_origin_tracking_depth()',
  returns:   { type: 'None · asyncgen_hooks · None · int', desc: 'get_asyncgen_hooks returns (firstiter, finalizer); get_coroutine_origin_tracking_depth the current depth (0 = off).' },

  category:    'sys function',
  version:     'asyncgen hooks 3.6+ · origin tracking 3.7+ (both provisional)',
  hasLiveDemo: false,

  subtitle: 'You rarely call these yourself: asyncio installs the asyncgen hooks while a loop runs (so loop.shutdown_asyncgens() can close forgotten async generators), and its debug mode turns on origin tracking so "coroutine was never awaited" warnings say where the coroutine came from. Both settings are per thread.',

  covers: ['set_asyncgen_hooks', 'get_asyncgen_hooks', 'set_coroutine_origin_tracking_depth', 'get_coroutine_origin_tracking_depth'],

  cheat: {
    commonCall: 'sys.set_coroutine_origin_tracking_depth(10)',
    returns:    'None — new coroutines record up to 10 frames in cr_origin',
    replaces:   'Guessing where an un-awaited coroutine was created',
    watchOut:   'Restore the previous hooks: event loops rely on them',
  },

  parameters: [
    { name: 'firstiter', type: 'callable | None', required: false, default: null, desc: 'Called with an async generator when it is iterated for the first time.' },
    { name: 'finalizer', type: 'callable | None', required: false, default: null, desc: 'Called with an async generator that is about to be garbage collected without being exhausted.' },
    { name: 'depth', type: 'int', required: true, default: null, desc: 'Number of frames recorded in each new coroutine\'s cr_origin; 0 disables tracking.' },
  ],

  patterns: [
    {
      name: 'Where was this coroutine created?',
      desc: 'Enable while debugging; asyncio debug mode (PYTHONASYNCIODEBUG=1) does this for you.',
      code: 'import sys\nsys.set_coroutine_origin_tracking_depth(10)\n# ... later, for a suspicious coroutine object:\nprint(coro.cr_origin)',
    },
    {
      name: 'An event loop installing its hooks',
      desc: 'Save the old hooks and put them back when the loop stops (what asyncio does).',
      code: "import sys\nold = sys.get_asyncgen_hooks()\nsys.set_asyncgen_hooks(firstiter=self._track_agen, finalizer=self._finalize_agen)\ntry:\n    self._run_forever()\nfinally:\n    sys.set_asyncgen_hooks(*old)",
    },
  ],

  examples: [
    { title: 'No hooks outside an event loop', code: 'import sys\nsys.get_asyncgen_hooks()', returns: 'asyncgen_hooks(firstiter=None, finalizer=None)' },
    { title: 'asyncio installs both while running', code: 'import asyncio, sys\nasync def main():\n    h = sys.get_asyncgen_hooks()\n    return (h.firstiter is not None, h.finalizer is not None)\nasyncio.run(main())', returns: '(True, True)' },
    { title: 'firstiter sees each async generator start', code: "import sys\nseen = []\nold = sys.get_asyncgen_hooks()\nsys.set_asyncgen_hooks(firstiter=lambda agen: seen.append(agen.__name__))\ntry:\n    async def ticker():\n        yield 1\n    g = ticker()\n    try:\n        g.asend(None).send(None)\n    except StopIteration as e:\n        first = e.value\n    try:\n        g.aclose().send(None)\n    except StopIteration:\n        pass\nfinally:\n    sys.set_asyncgen_hooks(*old)\n(seen, first)", returns: "(['ticker'], 1)" },
    { title: 'Origin tracking is off by default', code: 'import sys\nasync def job():\n    pass\nc = job()\nresult = (sys.get_coroutine_origin_tracking_depth(), c.cr_origin)\nc.close()\nresult', returns: '(0, None)' },
    { title: 'With depth 1: one (file, line, function) entry', code: 'import sys\nold = sys.get_coroutine_origin_tracking_depth()\nsys.set_coroutine_origin_tracking_depth(1)\ntry:\n    async def job():\n        pass\n    c = job()\n    origin = c.cr_origin\n    c.close()\nfinally:\n    sys.set_coroutine_origin_tracking_depth(old)\n(len(origin), origin[0][2])', returns: "(1, '<module>')" },
  ],

  pitfalls: [
    {
      name: 'Passing something that is not callable',
      desc: 'Both hooks must be callables or None.',
      wrong: { label: 'firstiter=1', code: 'import sys\nsys.set_asyncgen_hooks(firstiter=1)', output: 'TypeError: callable firstiter expected, got int' },
      fix:   { label: 'a function', code: 'import sys\nold = sys.get_asyncgen_hooks()\nsys.set_asyncgen_hooks(firstiter=print)\ntry:\n    result = sys.get_asyncgen_hooks().firstiter is print\nfinally:\n    sys.set_asyncgen_hooks(*old)\nresult', output: 'True' },
    },
    {
      name: 'A negative tracking depth',
      desc: 'Use 0 to switch tracking off.',
      wrong: { label: '-1', code: 'import sys\nsys.set_coroutine_origin_tracking_depth(-1)', output: 'ValueError: depth must be >= 0' },
      fix:   { label: '0', code: 'import sys\nsys.set_coroutine_origin_tracking_depth(0)\nsys.get_coroutine_origin_tracking_depth()', output: '0' },
    },
  ],

  when: {
    use: [
      'Writing an event loop or async framework (asyncgen hooks)',
      'Debugging "coroutine ... was never awaited" warnings (origin tracking)',
    ],
    avoid: [
      'Application code on asyncio → asyncio handles both; use asyncio.run(..., debug=True) for origin info',
      'Closing async generators yourself → contextlib.aclosing() (3.10+)',
    ],
  },

  notes: {
    cpython:          'Stored per thread state (Python/sysmodule.c, Objects/genobject.c); the hooks are read when an async generator is first iterated',
    'asyncio':        'BaseEventLoop.run_forever installs firstiter/finalizer and restores the old ones on exit; shutdown_asyncgens() then closes tracked generators',
    'Provisional':    'Both APIs were added provisionally (PEP 411) and are meant for frameworks and debugging',
  },

  related: [
    { name: 'sys.settrace', slug: 'settrace', when: 'Lower-level execution hooks' },
    { name: 'async / await', slug: 'async-await', when: 'The coroutines and async generators involved', category: 'keywords' },
    { name: 'yield',        slug: 'yield',    when: 'yield inside async def makes an async generator', category: 'keywords' },
    { name: 'sys module',   slug: 'sys',      when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What are sys.set_asyncgen_hooks used for?',
      a: 'An event loop registers a firstiter hook to track every async generator started on it and a finalizer to close generators that are garbage collected unfinished — on the loop, where their cleanup code can await. asyncio does this automatically.',
    },
    {
      q: 'How do I find where an un-awaited coroutine was created?',
      a: 'Turn on origin tracking with sys.set_coroutine_origin_tracking_depth(n), or run asyncio in debug mode. The RuntimeWarning then includes the creation traceback, and coro.cr_origin holds (filename, line, function) tuples.',
    },
    {
      q: 'Why is cr_origin None?',
      a: 'Origin tracking is off by default (depth 0). It is recorded only for coroutines created after sys.set_coroutine_origin_tracking_depth() was given a positive depth, in the same thread.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.set_asyncgen_hooks',
    meta:  'sys.set_asyncgen_hooks',
  },
};
