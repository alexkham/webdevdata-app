// content/reference/python/stdlib/time/perf-counter.js
// the duration clocks: perf_counter, monotonic, process_time, thread_time
// and their _ns versions

export const meta = {
  slug:        'perf-counter',
  name:        'time.perf_counter',
  signature:   'time.perf_counter() / monotonic() / process_time() / thread_time()',
  blurb:       'Clocks for measuring durations: perf_counter() and monotonic() never go backwards, process_time() and thread_time() count CPU time only. Each has an _ns version returning int nanoseconds.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.3+; _ns versions 3.7+; thread_time 3.7+',
  searchTerms: 'time.perf_counter perf_counter perf_counter_ns time.monotonic monotonic monotonic_ns time.process_time process_time process_time_ns time.thread_time thread_time thread_time_ns python measure elapsed time execution time benchmark stopwatch cpu time timer',
};

export const method = {
  slug:      'perf-counter',
  name:      'time.perf_counter',
  signature: 'time.perf_counter() / monotonic() / process_time() / thread_time()',
  returns:   { type: 'float | int', desc: 'Fractional seconds as a float; the _ns versions return int nanoseconds. Only the difference between two readings is meaningful.' },

  category:    'time function',
  version:     'Python 3.3+; _ns versions 3.7+; thread_time 3.7+',
  hasLiveDemo: true,

  subtitle: 'Stopwatch clocks: read once before, once after, subtract. The starting point is undefined, so a single reading means nothing - and since Python 3.13 perf_counter and monotonic are the very same clock.',

  covers: ['perf_counter', 'perf_counter_ns', 'monotonic', 'monotonic_ns', 'process_time', 'process_time_ns', 'thread_time', 'thread_time_ns'],

  cheat: {
    commonCall: 'start = time.perf_counter()  ...  time.perf_counter() - start',
    returns:    'float seconds (int nanoseconds from the _ns versions)',
    replaces:   'time.time() differences, the removed time.clock()',
    watchOut:   'process_time() and thread_time() do not count sleeping or waiting',
  },

  attributes: [
    { name: 'perf_counter()', type: 'wall time, monotonic', meaning: 'Highest available resolution, includes time spent sleeping. In CPython 3.13 the same clock as monotonic().' },
    { name: 'monotonic()',    type: 'wall time, monotonic', meaning: 'Cannot go backwards and ignores system clock changes - the clock for timeouts and deadlines.' },
    { name: 'process_time()', type: 'CPU time, process',    meaning: 'User + system CPU time of the whole process. Sleep and I/O waits are not counted.' },
    { name: 'thread_time()',  type: 'CPU time, thread',     meaning: 'User + system CPU time of the calling thread only. Compare readings from the same thread.' },
    { name: '*_ns()',         type: 'int',                  meaning: 'perf_counter_ns, monotonic_ns, process_time_ns, thread_time_ns: the same clocks as int nanoseconds, without float rounding.' },
  ],

  modes: [
    {
      id: 'clock',
      label: 'two readings',
      blurb: 'Pick a clock function by name and read it twice. The values depend on your machine; what is fixed is the type and that the second reading is never smaller.',
      params: [{ name: 'name', type: 'str', hint: 'a clock function name', input: 'text' }],
      template: 'import time\nclock = getattr(time, {$name})\na = clock()\nb = clock()\n(type(a).__name__, b >= a)',
      cases: [
        { id: 'perf',    label: 'perf_counter',    values: { name: 'perf_counter' } },
        { id: 'perfns',  label: 'perf_counter_ns', values: { name: 'perf_counter_ns' } },
        { id: 'mono',    label: 'monotonic',       values: { name: 'monotonic' } },
        { id: 'cpu',     label: 'process_time_ns', values: { name: 'process_time_ns' } },
        { id: 'thread',  label: 'thread_time',     values: { name: 'thread_time' } },
      ],
    },
  ],
  demoExplainer: 'All eight functions are monotonic (get_clock_info reports monotonic=True for perf_counter, monotonic, process_time and thread_time, and each _ns version reads the same clock), so b >= a always holds; the _ns versions return int. time.time() is left out on purpose: it follows the adjustable system clock, so b >= a is usually but not always True.',

  patterns: [
    {
      name: 'Stopwatch',
      desc: 'The standard way to time a piece of code.',
      code: 'import time\nstart = time.perf_counter()\nrun_job()\nprint(f"run_job took {time.perf_counter() - start:.4f} s")',
    },
    {
      name: 'Timing context manager',
      desc: 'Reusable around any block; stores the result on the object.',
      code: 'import time\n\nclass Timer:\n    def __enter__(self):\n        self.start = time.perf_counter()\n        return self\n    def __exit__(self, *exc):\n        self.elapsed = time.perf_counter() - self.start\n\nwith Timer() as t:\n    run_job()\nprint(t.elapsed)',
    },
    {
      name: 'CPU time vs wall time',
      desc: 'A large gap means the code was waiting (I/O, locks, sleep) rather than computing.',
      code: 'import time\nwall0, cpu0 = time.perf_counter(), time.process_time()\nrun_job()\nwall, cpu = time.perf_counter() - wall0, time.process_time() - cpu0\nprint(f"wall {wall:.2f} s, cpu {cpu:.2f} s")',
    },
    {
      name: 'Timeout with monotonic',
      desc: 'Deadlines must not move when the system clock is corrected.',
      code: 'import time\ndeadline = time.monotonic() + 5.0\nwhile time.monotonic() < deadline:\n    if poll():\n        break\n    time.sleep(0.05)',
    },
  ],

  examples: [
    { title: 'Elapsed time is never negative',   code: 'import time\nstart = time.perf_counter()\ntotal = sum(range(1_000_000))\nelapsed = time.perf_counter() - start\n(total, elapsed >= 0)', returns: '(499999500000, True)' },
    { title: 'Nanoseconds as an int',            code: 'import time\ntype(time.perf_counter_ns()).__name__', returns: "'int'" },
    { title: 'perf_counter is monotonic (3.13)', code: "import time\ntime.get_clock_info('perf_counter').implementation == time.get_clock_info('monotonic').implementation", returns: 'True' },
    { title: 'Sleeping costs no CPU time',       code: 'import time\nstart_wall, start_cpu = time.perf_counter(), time.process_time()\ntime.sleep(0.05)\ncpu = time.process_time() - start_cpu\nwall = time.perf_counter() - start_wall\ncpu < wall', returns: 'True' },
    { title: 'thread_time in another thread',    code: 'import time, threading\ndef work():\n    global t\n    t = time.thread_time_ns()\nth = threading.Thread(target=work)\nth.start(); th.join()\ntype(t).__name__', returns: "'int'" },
    { title: 'Nanoseconds to seconds',           code: 'elapsed_ns = 1_234_567_890\nelapsed_ns / 1e9', returns: '1.23456789' },
    { title: 'No arguments',                     code: 'import time\ntime.perf_counter(1)', returns: 'TypeError: time.perf_counter() takes no arguments (1 given)' },
  ],

  pitfalls: [
    {
      name: 'Using a reading as a timestamp',
      desc: 'perf_counter and monotonic count from an undefined starting point (often the boot of the machine), not from 1970. Only differences are meaningful; use time.time() for "when".',
      wrong: { label: 'perf_counter()', code: 'import time\ntime.perf_counter() > 1_700_000_000', output: 'False' },
      fix:   { label: 'time()',         code: 'import time\ntime.time() > 1_700_000_000', output: 'True' },
    },
    {
      name: 'Timing I/O with process_time()',
      desc: 'process_time only counts CPU work. A 0.1 s sleep (or a network wait) barely registers; perf_counter sees the real elapsed time.',
      wrong: { label: 'process_time()', code: 'import time\nstart = time.process_time()\ntime.sleep(0.1)\ntime.process_time() - start < 0.05', output: 'True' },
      fix:   { label: 'perf_counter()', code: 'import time\nstart = time.perf_counter()\ntime.sleep(0.1)\ntime.perf_counter() - start >= 0.09', output: 'True' },
    },
  ],

  when: {
    use: [
      'perf_counter(): profiling and benchmarking a block of code',
      'monotonic(): timeouts, deadlines, rate limits, retry back-off',
      'process_time() / thread_time(): how much CPU a computation used',
      '_ns versions: integer arithmetic, sub-microsecond comparisons',
    ],
    avoid: [
      'Wall-clock timestamps ("when did this happen") → time.time()',
      'Micro-benchmarks of one-liners → timeit, which runs the statement many times',
      'Comparing readings taken in different processes or machines → undefined reference point',
    ],
  },

  notes: {
    cpython:          'Python/pytime.c: QueryPerformanceCounter() on Windows, mach_absolute_time() on macOS, clock_gettime(CLOCK_MONOTONIC) on Linux - for monotonic and, since 3.13, perf_counter too',
    'process_time':   'GetProcessTimes() on Windows, clock_gettime(CLOCK_PROCESS_CPUTIME_ID) on Linux - get_clock_info("process_time") names the one in use',
    'thread_time':    'Available on Linux, Unix and Windows (Unix systems supporting CLOCK_THREAD_CPUTIME_ID)',
    'Removed':        'time.clock() was deprecated in 3.3 and removed in Python 3.8; perf_counter() and process_time() replace it',
  },

  related: [
    { name: 'time.get_clock_info', slug: 'get-clock-info', when: 'Resolution and properties of each clock' },
    { name: 'time.time',           slug: 'time',           when: 'Wall-clock timestamps' },
    { name: 'time.sleep',          slug: 'sleep',          when: 'Pause between readings' },
    { name: 'clock_gettime',       slug: 'clock-gettime',  when: 'The Unix clocks behind them' },
    { name: 'time module',         slug: 'time',           when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between time.perf_counter() and time.time()?',
      a: 'time() is the wall clock: seconds since 1970, adjustable by NTP or the user. perf_counter() is a monotonic stopwatch with the best resolution available and an undefined starting point. Use time() for timestamps and perf_counter() for durations.',
    },
    {
      q: 'perf_counter vs monotonic - which one should I use?',
      a: 'In CPython 3.13 they read the same clock. By convention perf_counter() is for measuring code and monotonic() for timeouts and scheduling; both include time spent sleeping and neither jumps when the system clock is set.',
    },
    {
      q: 'What replaced time.clock()?',
      a: 'time.clock() was deprecated in Python 3.3 and removed in 3.8. Use time.perf_counter() for elapsed (wall) time or time.process_time() for CPU time.',
    },
    {
      q: 'Why are my perf_counter() values so small or so large?',
      a: 'The reference point is undefined - often the machine boot - so a single reading has no meaning. Subtract two readings taken in the same process.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.perf_counter',
    meta:  'time.perf_counter / monotonic / process_time / thread_time',
  },
};
