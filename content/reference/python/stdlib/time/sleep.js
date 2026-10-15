// content/reference/python/stdlib/time/sleep.js

export const meta = {
  slug:        'sleep',
  name:        'time.sleep',
  signature:   'time.sleep(seconds, /)',
  blurb:       'Pause the calling thread for at least the given number of seconds - an int or a float for fractions of a second.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'time.sleep sleep python wait pause delay seconds milliseconds sleep for 1 second sleep length must be non-negative non blocking asyncio.sleep retry delay',
};

export const method = {
  slug:      'sleep',
  name:      'time.sleep',
  signature: 'time.sleep(seconds, /)',
  returns:   { type: 'None', desc: 'Returns after the delay; the thread does nothing in the meantime.' },

  category:    'time function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'Blocks the current thread for at least that long - possibly longer if the system is busy. Takes seconds, not milliseconds: time.sleep(0.5) is half a second.',

  covers: ['sleep'],

  cheat: {
    commonCall: 'time.sleep(0.5)',
    returns:    'None, after at least 0.5 s',
    replaces:   'busy-wait loops',
    watchOut:   'seconds, not milliseconds; blocks the whole event loop inside async code',
  },

  parameters: [
    { name: 'seconds', type: 'int | float', required: true, default: null, desc: 'How long to wait. 0 is allowed; negative values raise ValueError. Floats and ints (anything with __index__) are accepted; str, Decimal, Fraction and None raise TypeError.' },
  ],

  modes: [
    {
      id: 'check',
      label: 'what sleep accepts',
      blurb: 'Type a duration. The demo checks and converts it exactly as CPython does - then returns at once instead of really waiting.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds to wait', input: 'auto' }],
      template: 'import time\ntime.sleep({$seconds})',
      cases: [
        { id: 'fraction', label: '0.01',          values: { seconds: '0.01' } },
        { id: 'zero',     label: '0',             values: { seconds: '0' } },
        { id: 'negative', label: '-1',            values: { seconds: '-1' } },
        { id: 'tiny',     label: '-0.0000000001', values: { seconds: '-0.0000000001' } },
        { id: 'text',     label: 'text',          values: { seconds: 'one' } },
        { id: 'huge',     label: '10000000000',   values: { seconds: '10000000000' } },
      ],
    },
  ],
  demoExplainer: 'sleep converts the argument to whole nanoseconds, rounding away from zero, so even -1e-10 becomes -1 ns and is rejected as negative. An int is multiplied by 10**9 and must fit in a signed 64-bit count of nanoseconds - about 292 years - which is why 10000000000 seconds overflows. Strings are refused rather than parsed.',

  patterns: [
    {
      name: 'Poll until something is ready',
      desc: 'Short sleeps between checks keep the CPU idle.',
      code: 'import time\nwhile not job.done():\n    time.sleep(0.2)',
    },
    {
      name: 'Exponential back-off',
      desc: 'Wait longer after each failure, with a cap.',
      code: 'import time\n\ndef call_with_retries():\n    for attempt in range(6):\n        try:\n            return call_api()\n        except TimeoutError:\n            time.sleep(min(0.5 * 2 ** attempt, 30))\n    raise TimeoutError("gave up after 6 attempts")',
    },
    {
      name: 'Sleep until a deadline',
      desc: 'Clamp at 0 - the deadline may already have passed.',
      code: 'import time\ndeadline = time.monotonic() + 5\n...\ntime.sleep(max(0.0, deadline - time.monotonic()))',
    },
    {
      name: 'Inside async code',
      desc: 'time.sleep blocks every task on the loop; asyncio.sleep yields instead.',
      code: 'import asyncio\n\nasync def tick():\n    await asyncio.sleep(1)',
    },
  ],

  examples: [
    { title: 'sleep returns None',               code: 'import time\ntime.sleep(0) is None', returns: 'True' },
    { title: 'It waits at least that long',      code: 'import time\nstart = time.perf_counter()\ntime.sleep(0.05)\ntime.perf_counter() - start >= 0.05', returns: 'True' },
    { title: 'A tiny positive value is fine',    code: 'import time\ntime.sleep(1e-10) is None', returns: 'True' },
    { title: 'NaN is rejected',                  code: "import time\ntime.sleep(float('nan'))", returns: 'ValueError: Invalid value NaN (not a number)' },
    { title: 'Strings are not converted',        code: "import time\ntime.sleep('2')", returns: "TypeError: 'str' object cannot be interpreted as an integer" },
    { title: 'Decimal is not accepted either',   code: "import time\nfrom decimal import Decimal\ntime.sleep(Decimal('0.1'))", returns: "TypeError: 'decimal.Decimal' object cannot be interpreted as an integer" },
    { title: 'Too long to count in nanoseconds', code: 'import time\ntime.sleep(10**10)', returns: 'OverflowError: timestamp too large to convert to C PyTime_t' },
  ],

  pitfalls: [
    {
      name: 'A deadline that has already passed',
      desc: 'Computing the remaining time can give a negative number, and sleep refuses it. Clamp with max().',
      wrong: { label: 'raw difference', code: 'import time\ndeadline = time.monotonic() - 1\ntime.sleep(deadline - time.monotonic())', output: 'ValueError: sleep length must be non-negative' },
      fix:   { label: 'max(0.0, ...)',  code: "import time\ndeadline = time.monotonic() - 1\ntime.sleep(max(0.0, deadline - time.monotonic()))\n'done'", output: "'done'" },
    },
    {
      name: 'A delay read from config or argv',
      desc: 'Values from files, environment variables and the command line are strings. Convert them first.',
      wrong: { label: 'str',   code: "import time\ndelay = '0.02'\ntime.sleep(delay)", output: "TypeError: 'str' object cannot be interpreted as an integer" },
      fix:   { label: 'float', code: "import time\ndelay = '0.02'\ntime.sleep(float(delay))\n'slept'", output: "'slept'" },
    },
  ],

  when: {
    use: [
      'Scripts that poll, retry or pace requests (rate limits)',
      'Worker threads that should wait without burning CPU',
      'Demos and tests that need a short, real delay',
    ],
    avoid: [
      'async code → await asyncio.sleep(...)',
      'Waiting for an event from another thread → threading.Event().wait(timeout)',
      'Exact scheduling at a wall-clock time → sched or a job scheduler; sleep can oversleep',
      'Yielding the CPU for 0 seconds → the docs suggest os.sched_yield() with a real-time policy',
    ],
  },

  notes: {
    cpython:      'time_sleep in Modules/timemodule.c: on Unix clock_nanosleep() or nanosleep() (resolution 1 ns), on Windows a waitable timer since Python 3.11 - high-resolution (100 ns) on Windows 10 and newer',
    'Signals':    'Since 3.5 an interrupted sleep is restarted with the remaining time unless the signal handler raises (PEP 475) - Ctrl+C still stops it with KeyboardInterrupt',
    'Conversion': 'The argument becomes an integer number of nanoseconds, rounded away from zero; ints must fit in a signed 64-bit nanosecond count',
    'Audit':      'Raises the auditing event time.sleep with argument seconds (3.13+)',
  },

  related: [
    { name: 'time.monotonic', slug: 'perf-counter', when: 'Compute how long is left before sleeping' },
    { name: 'time.time',      slug: 'time',         when: 'Wall-clock timestamps' },
    { name: 'time module',    slug: 'time',         when: 'Overview', category: 'stdlib' },
    { name: 'ValueError',     slug: 'valueerror',   when: 'Negative or NaN durations', category: 'exceptions' },
    { name: 'KeyboardInterrupt', slug: 'keyboardinterrupt', when: 'Ctrl+C during a sleep', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Is time.sleep in seconds or milliseconds?',
      a: 'Seconds. time.sleep(1) waits one second; for 200 milliseconds write time.sleep(0.2). Floats are accepted, ints too.',
    },
    {
      q: 'How do I sleep in an async function?',
      a: 'await asyncio.sleep(seconds). time.sleep would block the whole event loop, so no other task could run during the pause.',
    },
    {
      q: 'Does time.sleep use CPU?',
      a: 'No. The thread is suspended by the operating system; time.process_time() barely moves during a sleep while time.perf_counter() advances by the full delay.',
    },
    {
      q: 'Why does time.sleep(-1) raise ValueError?',
      a: 'A negative duration is rejected with "sleep length must be non-negative". When the value comes from a computation such as deadline - now, clamp it: time.sleep(max(0.0, remaining)).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.sleep',
    meta:  'time.sleep',
  },
};
