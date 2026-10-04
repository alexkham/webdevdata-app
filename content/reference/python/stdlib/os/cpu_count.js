// content/reference/python/stdlib/os/cpu_count.js

export const meta = {
  slug:        'cpu_count',
  name:        'os.cpu_count',
  signature:   'os.cpu_count() / os.process_cpu_count() / os.getloadavg() / os.times()',
  blurb:       'How much CPU there is and how much you used: logical CPU count (or None), the CPUs this process may use (3.13+), the Unix load average, and user/system/elapsed process times.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.4+ (process_cpu_count 3.13+)',
  searchTerms: 'os.cpu_count cpu_count number of cpus cores python os.process_cpu_count process_cpu_count usable cpus affinity PYTHON_CPU_COUNT -X cpu_count os.getloadavg getloadavg load average os.times times times_result os.times_result user system children_user children_system elapsed cpu time multiprocessing pool size',
};

export const method = {
  slug:      'cpu_count',
  name:      'os.cpu_count',
  signature: 'os.cpu_count() / os.process_cpu_count() / os.getloadavg() / os.times()',
  returns:   { type: 'int | None', desc: 'cpu_count: number of logical CPUs in the system, or None if it cannot be determined.' },

  category:    'os function',
  version:     'Python 3.4+ (process_cpu_count 3.13+)',
  hasLiveDemo: false,

  subtitle: 'cpu_count() counts the logical CPUs of the machine; process_cpu_count() (new in 3.13) counts the ones this process may actually run on, which can be fewer under CPU affinity. Both can return None. getloadavg() is Unix only; times() works on Unix and Windows, but on Windows only user and system are filled in.',

  covers: ['cpu_count', 'getloadavg', 'times', 'times_result'],

  cheat: {
    commonCall: 'workers = os.process_cpu_count() or 1',
    returns:    'int, or None when undetermined',
    replaces:   'multiprocessing.cpu_count() (which raises instead of returning None)',
    watchOut:   'None is a possible result: always add "or 1"',
  },

  parameters: [],

  patterns: [
    {
      name: 'Pool size that works on 3.12 and 3.13',
      desc: 'Prefer the usable-CPU count; fall back to the machine count; never None.',
      code: "import os\ncount = getattr(os, 'process_cpu_count', os.cpu_count)() or 1\nworkers = max(1, count - 1)",
    },
    {
      name: 'Usable CPUs before 3.13 on Linux',
      desc: 'sched_getaffinity(0) is the set of CPUs this process may run on.',
      code: 'import os\nusable = len(os.sched_getaffinity(0))',
    },
    {
      name: 'Load average per CPU (Unix)',
      desc: 'A 1-minute load above the CPU count means work is queueing.',
      code: 'import os\none, five, fifteen = os.getloadavg()\nbusy = one / (os.cpu_count() or 1) > 1.0',
    },
    {
      name: 'CPU time spent by a block',
      desc: 'user + system is CPU time; elapsed is wall-clock time.',
      code: 'import os\nt0 = os.times()\nwork()\nt1 = os.times()\ncpu = (t1.user - t0.user) + (t1.system - t0.system)\nwall = t1.elapsed - t0.elapsed',
    },
  ],

  examples: [
    { title: 'An int or None, never 0',            code: 'import os\nc = os.cpu_count()\nc is None or (isinstance(c, int) and c >= 1)', returns: 'True' },
    { title: 'Usable CPUs never exceed the total',  code: "import os\nusable = len(os.sched_getaffinity(0)) if hasattr(os, 'sched_getaffinity') else os.cpu_count()\n1 <= usable <= os.cpu_count()", returns: 'True' },
    { title: 'times() is a 5-field struct sequence', code: 'import os\nt = os.times()\n(type(t).__name__, len(t), os.times_result.n_fields)', returns: "('times_result', 5, 5)" },
    { title: 'Fields by name or by position',       code: 'import os\nt = os.times()\nt.user == t[0] and t.elapsed == t[4]', returns: 'True' },
    { title: 'Building a times_result by hand',     code: 'import os\nt = os.times_result((1.5, 0.25, 0.0, 0.0, 100.0))\nt.user + t.system', returns: '1.75' },
    { title: 'elapsed only moves forward',          code: 'import os\nt0 = os.times()\nsum(i * i for i in range(100000))\nt1 = os.times()\nt1.elapsed >= t0.elapsed', returns: 'True' },
    { title: 'getloadavg exists only on Unix',      code: "import os\nhasattr(os, 'getloadavg') == (os.name == 'posix')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Doing arithmetic on a None CPU count',
      desc: 'cpu_count() returns None when the count is undetermined. The typical "cores minus one" line then crashes; "or 1" makes it safe.',
      wrong: { label: 'count - 1', code: 'count = None  # what os.cpu_count() returns when undetermined\ncount - 1', output: "TypeError: unsupported operand type(s) for -: 'NoneType' and 'int'" },
      fix:   { label: '(count or 1)', code: 'count = None\nmax(1, (count or 1) - 1)', output: '1' },
    },
    {
      name: 'Sizing a pool by the machine instead of the process',
      desc: 'In a container or under taskset the process may be limited to a few CPUs while cpu_count() still reports all of them. Ask for the usable set.',
      wrong: { label: 'cpu_count()', code: 'import os\nisinstance(os.cpu_count(), int)', output: 'True' },
      fix:   { label: 'usable CPUs', code: "import os\nusable = (getattr(os, 'process_cpu_count', None) or os.cpu_count)()\nusable <= os.cpu_count()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Choosing a default worker count for a thread or process pool',
      'Measuring CPU time (user + system) of your own process with times()',
      'Quick load checks on Unix servers with getloadavg()',
    ],
    avoid: [
      'Timing code precisely → time.perf_counter() or time.process_time()',
      'Per-process CPU and memory of other processes → the third-party psutil package',
    ],
  },

  notes: {
    cpython:          'cpu_count and process_cpu_count honour the -X cpu_count=n option and the PYTHON_CPU_COUNT environment variable (3.13+), which override the detected value',
    'Availability':   'cpu_count, times: Unix, Windows. getloadavg: Unix only (raises OSError if the load average is unobtainable). process_cpu_count: added in 3.13, not listed in os.__all__',
    'Windows times()': 'Only user and system are known; children_user, children_system and elapsed are 0',
    'times_result':   'A tuple-like struct sequence: user, system, children_user, children_system, elapsed (named attributes since 3.3)',
  },

  related: [
    { name: 'os.sched_getaffinity', slug: 'sched', when: 'Which CPUs this process may use' },
    { name: 'os.nice', slug: 'nice', when: 'Lower your own priority instead of using fewer CPUs' },
    { name: 'os.uname', slug: 'uname', when: 'Other information about the system' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and why do the examples print only True?',
      a: 'CPU counts, load averages and CPU times are properties of the machine running the code, so they differ for every reader. The examples check types and relations that hold everywhere. getloadavg is Unix only and does not exist on Windows.',
    },
    {
      q: 'What is the difference between os.cpu_count() and os.process_cpu_count()?',
      a: 'cpu_count() is the number of logical CPUs in the system. process_cpu_count() (Python 3.13+) is the number the calling thread may use, which is smaller when CPU affinity restricts the process. On older versions use len(os.sched_getaffinity(0)) on Linux.',
    },
    {
      q: 'Why does os.cpu_count() return None?',
      a: 'When the OS cannot report the number of CPUs. It is rare, but the documented contract allows it, so write os.cpu_count() or 1.',
    },
    {
      q: 'How do I get the CPU time used by my program?',
      a: 'os.times().user + os.times().system, or time.process_time(). elapsed is wall-clock time since a fixed point in the past, not CPU time.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.cpu_count',
    meta:  'os.cpu_count / process_cpu_count / getloadavg / times',
  },
};
