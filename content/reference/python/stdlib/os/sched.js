// content/reference/python/stdlib/os/sched.js

export const meta = {
  slug:        'sched',
  name:        'os.sched_getaffinity',
  signature:   'os.sched_getaffinity(pid, /) / os.sched_setaffinity(pid, mask, /) / os.sched_setscheduler(pid, policy, param, /) / ...',
  blurb:       'The scheduler interface: which CPUs a process may run on (affinity), its scheduling policy (SCHED_OTHER, SCHED_BATCH, SCHED_IDLE, SCHED_FIFO, SCHED_RR) and priority (sched_param), and sched_yield(). Available only on some Unix platforms, mainly Linux.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'os.sched_getaffinity sched_getaffinity os.sched_setaffinity sched_setaffinity cpu affinity pin process to cpu core python taskset os.sched_get_priority_max sched_get_priority_max os.sched_get_priority_min sched_get_priority_min os.sched_getparam sched_getparam os.sched_setparam sched_setparam os.sched_getscheduler sched_getscheduler os.sched_setscheduler sched_setscheduler os.sched_param sched_param sched_priority os.sched_rr_get_interval sched_rr_get_interval os.sched_yield sched_yield os.SCHED_BATCH SCHED_BATCH os.SCHED_FIFO SCHED_FIFO os.SCHED_IDLE SCHED_IDLE os.SCHED_OTHER SCHED_OTHER os.SCHED_RESET_ON_FORK SCHED_RESET_ON_FORK os.SCHED_RR SCHED_RR real-time scheduling usable cpus',
};

export const method = {
  slug:      'sched',
  name:      'os.sched_getaffinity',
  signature: 'os.sched_getaffinity(pid, /) / os.sched_setaffinity(pid, mask, /) / os.sched_setscheduler(pid, policy, param, /) / ...',
  returns:   { type: 'set[int]', desc: 'sched_getaffinity: the set of CPU numbers the process may run on. Others: an int policy/priority, a sched_param, a float interval, or None.' },

  category:    'os function',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: 'pid 0 always means "the calling process" (for affinity: the calling thread). The affinity mask is a set of CPU numbers; policies are int constants; priorities travel in an immutable sched_param. The docs say these functions exist "only on some Unix platforms": Linux has them all, Windows has none.',

  covers: ['sched_get_priority_max', 'sched_get_priority_min', 'sched_getaffinity', 'sched_getparam', 'sched_getscheduler', 'sched_param', 'sched_rr_get_interval', 'sched_setaffinity', 'sched_setparam', 'sched_setscheduler', 'sched_yield', 'SCHED_BATCH', 'SCHED_FIFO', 'SCHED_IDLE', 'SCHED_OTHER', 'SCHED_RESET_ON_FORK', 'SCHED_RR'],

  cheat: {
    commonCall: 'len(os.sched_getaffinity(0))',
    returns:    'number of CPUs this process may use',
    replaces:   'the taskset and chrt commands',
    watchOut:   'The mask is an iterable of CPU numbers, not a count or a bitmask int',
  },

  parameters: [
    { name: 'pid',    type: 'int', required: true, default: null, desc: 'The target process; 0 = the calling process (thread, for affinity).' },
    { name: 'mask',   type: 'iterable of int', required: true, default: null, desc: 'sched_setaffinity: CPU numbers the process may use, e.g. {0, 1}.' },
    { name: 'policy', type: 'int', required: true, default: null, desc: 'A SCHED_* constant, optionally OR-ed with SCHED_RESET_ON_FORK.' },
    { name: 'param',  type: 'os.sched_param', required: true, default: null, desc: 'sched_setscheduler / sched_setparam: os.sched_param(sched_priority).' },
  ],

  patterns: [
    {
      name: 'Usable CPUs (Linux)',
      desc: 'Respects taskset and container CPU sets, unlike cpu_count().',
      code: 'import os\nworkers = len(os.sched_getaffinity(0))',
    },
    {
      name: 'Pin the current process to two CPUs',
      desc: 'Any iterable of CPU numbers works.',
      code: 'import os\nos.sched_setaffinity(0, {0, 1})',
    },
    {
      name: 'Real-time FIFO scheduling (needs privileges)',
      desc: 'Priority must be within the policy range.',
      code: 'import os\nprio = os.sched_get_priority_min(os.SCHED_FIFO)\nos.sched_setscheduler(0, os.SCHED_FIFO, os.sched_param(prio))',
    },
    {
      name: 'Background batch policy',
      desc: 'SCHED_IDLE / SCHED_BATCH need no privileges and a priority of 0.',
      code: 'import os\nos.sched_setscheduler(0, os.SCHED_IDLE, os.sched_param(0))',
    },
  ],

  examples: [
    { title: 'Same availability for the whole family', code: "import os\nlen({hasattr(os, n) for n in ('sched_getaffinity', 'sched_setaffinity', 'sched_param', 'SCHED_FIFO')})", returns: '1' },
    { title: 'Usable CPUs never exceed the total', code: "import os\nusable = len(os.sched_getaffinity(0)) if hasattr(os, 'sched_getaffinity') else os.cpu_count()\n1 <= usable <= os.cpu_count()", returns: 'True' },
    { title: 'A mask is a set of CPU numbers',      code: 'all_cpus = set(range(8))\nall_cpus - {0}', returns: '{1, 2, 3, 4, 5, 6, 7}' },
    { title: 'SCHED_RESET_ON_FORK is a flag bit (Linux value)', code: 'SCHED_FIFO, SCHED_RESET_ON_FORK = 1, 0x40000000\npolicy = SCHED_FIFO | SCHED_RESET_ON_FORK\n(policy & ~SCHED_RESET_ON_FORK, bool(policy & SCHED_RESET_ON_FORK))', returns: '(1, True)' },
    { title: 'Clamp a requested priority into the FIFO range (1..99 on Linux)', code: 'lo, hi = 1, 99\n[max(lo, min(hi, p)) for p in (0, 50, 200)]', returns: '[1, 50, 99]' },
  ],

  pitfalls: [
    {
      name: 'Passing a CPU count as the mask',
      desc: 'sched_setaffinity wants the CPU numbers. On Linux, os.sched_setaffinity(0, 4) raises this same TypeError; pass range(4) for CPUs 0-3.',
      wrong: { label: 'mask = 4', code: 'mask = 4\nset(mask)', output: "TypeError: 'int' object is not iterable" },
      fix:   { label: 'mask = range(4)', code: 'mask = range(4)\nset(mask)', output: '{0, 1, 2, 3}' },
    },
    {
      name: 'Using a real-time priority with SCHED_OTHER',
      desc: 'The normal policies (OTHER, BATCH, IDLE) only accept priority 0; FIFO and RR use 1 to 99 on Linux. On Linux, sched_setscheduler(0, SCHED_OTHER, sched_param(50)) raises OSError with errno 22 (EINVAL). Ask sched_get_priority_min / max instead of hard-coding.',
      wrong: { label: 'priority 50 for OTHER', code: "ranges = {'SCHED_OTHER': (0, 0), 'SCHED_FIFO': (1, 99)}  # Linux values\nlo, hi = ranges['SCHED_OTHER']\nlo <= 50 <= hi", output: 'False' },
      fix:   { label: 'stay in the range', code: "ranges = {'SCHED_OTHER': (0, 0), 'SCHED_FIFO': (1, 99)}\nlo, hi = ranges['SCHED_FIFO']\nlo <= 50 <= hi", output: 'True' },
    },
  ],

  when: {
    use: [
      'Sizing worker pools by the CPUs actually available (Linux, before 3.13)',
      'Pinning latency-sensitive work to dedicated cores',
      'Real-time or idle-only scheduling of a process on Linux',
    ],
    avoid: [
      'Usable CPU count on 3.13+ → os.process_cpu_count() (portable)',
      'Simple "be nicer" → os.nice()',
      'Windows affinity → the third-party psutil (Process.cpu_affinity)',
    ],
  },

  notes: {
    cpython:        'Wrappers of the sched_* system calls; sched_param is an immutable struct sequence (setting sched_priority raises AttributeError: readonly attribute)',
    'Availability': 'Only on some Unix platforms (docs: "Interface to the scheduler"). All of these exist on Linux; none on Windows. SCHED_SPORADIC also exists on systems that support it',
    'Linux values': 'SCHED_OTHER 0, SCHED_FIFO 1, SCHED_RR 2, SCHED_BATCH 3, SCHED_IDLE 5, SCHED_RESET_ON_FORK 0x40000000. Priority range: FIFO and RR 1..99, OTHER 0..0',
    'Permissions':  'Switching to SCHED_FIFO / SCHED_RR raises PermissionError without root or CAP_SYS_NICE (checked on Linux)',
    'Return types': 'sched_getaffinity: set; sched_getscheduler: int; sched_getparam: sched_param; sched_rr_get_interval: float seconds; sched_yield and the setters: None',
  },

  related: [
    { name: 'os.cpu_count', slug: 'cpu_count', when: 'Total CPUs and process_cpu_count()' },
    { name: 'os.nice', slug: 'nice', when: 'Niceness for the normal policy' },
    { name: 'os.getpid', slug: 'getpid', when: 'Pids to pass instead of 0' },
    { name: 'TypeError', slug: 'typeerror', when: 'What a non-iterable mask raises', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is there no live demo, and why do the examples use plain numbers?',
      a: 'The scheduler functions exist only on some Unix platforms (Linux has them, Windows does not), and changing affinity or policy affects the whole process. The examples show the mask and policy arithmetic with the Linux values instead.',
    },
    {
      q: 'How do I get the number of usable CPUs in Python?',
      a: 'len(os.sched_getaffinity(0)) on Linux, or os.process_cpu_count() on Python 3.13+ (all platforms). os.cpu_count() counts every CPU of the machine, even the ones you may not use.',
    },
    {
      q: 'How do I pin a Python process to a CPU core?',
      a: 'os.sched_setaffinity(0, {2}) restricts the calling process to CPU 2 on Linux. On Windows use psutil.Process().cpu_affinity([2]).',
    },
    {
      q: 'Why does os.sched_setscheduler raise PermissionError?',
      a: 'Real-time policies (SCHED_FIFO, SCHED_RR) need root or CAP_SYS_NICE. SCHED_BATCH and SCHED_IDLE with priority 0 work without privileges.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.sched_getaffinity',
    meta:  'Interface to the scheduler',
  },
};
