// content/reference/python/stdlib/os/eventfd.js

export const meta = {
  slug:        'eventfd',
  name:        'os.eventfd',
  signature:   'os.eventfd(initval[, flags=os.EFD_CLOEXEC]) -> int',
  blurb:       'Linux special file descriptors: eventfd (a 64-bit counter you can select/poll on), memfd_create (an anonymous in-memory file) and timerfd (a timer that becomes readable when it fires, 3.13+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.8+ (memfd_create), 3.10+ (eventfd), 3.13+ (timerfd)',
  searchTerms: 'os.eventfd eventfd os.eventfd_read eventfd_read os.eventfd_write eventfd_write EFD_CLOEXEC EFD_NONBLOCK EFD_SEMAPHORE os.memfd_create memfd_create anonymous file in memory MFD_CLOEXEC MFD_ALLOW_SEALING MFD_HUGETLB MFD_HUGE_SHIFT MFD_HUGE_MASK MFD_HUGE_64KB MFD_HUGE_512KB MFD_HUGE_1MB MFD_HUGE_2MB MFD_HUGE_8MB MFD_HUGE_16MB MFD_HUGE_32MB MFD_HUGE_256MB MFD_HUGE_512MB MFD_HUGE_1GB MFD_HUGE_2GB MFD_HUGE_16GB os.timerfd_create timerfd_create timerfd_settime timerfd_settime_ns timerfd_gettime timerfd_gettime_ns TFD_CLOEXEC TFD_NONBLOCK TFD_TIMER_ABSTIME TFD_TIMER_CANCEL_ON_SET linux event notification fd python',
};

export const method = {
  slug:      'eventfd',
  name:      'os.eventfd',
  signature: 'os.eventfd(initval[, flags=os.EFD_CLOEXEC]) -> int',
  returns:   { type: 'int', desc: 'A new, non-inheritable file descriptor. Close it with os.close().' },

  category:    'os function',
  version:     'Python 3.8+ (memfd_create), 3.10+ (eventfd), 3.13+ (timerfd)',
  hasLiveDemo: false,

  subtitle: 'Linux only. eventfd: Linux 2.6.27+ with glibc 2.8+ (Python 3.10+). memfd_create: Linux 3.17+ with glibc 2.27+ (3.8+; MFD_HUGE_* need Linux 4.14+). timerfd_*: Linux 2.6.27+ with glibc 2.8+, new in Python 3.13. All three give you an ordinary fd that works with select, poll and selectors.',

  covers: ['eventfd', 'eventfd_read', 'eventfd_write', 'memfd_create', 'EFD_CLOEXEC', 'EFD_NONBLOCK', 'EFD_SEMAPHORE', 'MFD_ALLOW_SEALING', 'MFD_CLOEXEC', 'MFD_HUGETLB', 'MFD_HUGE_16GB', 'MFD_HUGE_16MB', 'MFD_HUGE_1GB', 'MFD_HUGE_1MB', 'MFD_HUGE_256MB', 'MFD_HUGE_2GB', 'MFD_HUGE_2MB', 'MFD_HUGE_32MB', 'MFD_HUGE_512KB', 'MFD_HUGE_512MB', 'MFD_HUGE_64KB', 'MFD_HUGE_8MB', 'MFD_HUGE_MASK', 'MFD_HUGE_SHIFT', 'timerfd_create', 'timerfd_gettime', 'timerfd_gettime_ns', 'timerfd_settime', 'timerfd_settime_ns', 'TFD_CLOEXEC', 'TFD_NONBLOCK', 'TFD_TIMER_ABSTIME', 'TFD_TIMER_CANCEL_ON_SET'],

  cheat: {
    commonCall: 'fd = os.eventfd(0)',
    returns:    'int fd (non-inheritable)',
    replaces:   'a self-pipe used only to wake up a select loop',
    watchOut:   'Linux only; os.close(fd) when done',
  },

  parameters: [
    { name: 'initval',  type: 'int',      required: true,  default: null,              desc: 'eventfd: starting value of the counter; must fit in 32 bits (the counter itself is 64-bit).' },
    { name: 'flags',    type: 'int',      required: false, default: 'os.EFD_CLOEXEC',  desc: 'eventfd: EFD_CLOEXEC, EFD_NONBLOCK, EFD_SEMAPHORE OR-ed together. memfd_create: MFD_* flags (default MFD_CLOEXEC). timerfd_create: TFD_NONBLOCK, TFD_CLOEXEC (default 0).' },
    { name: 'name',     type: 'str',      required: true,  default: null,              desc: 'memfd_create: a debugging label, shown prefixed with memfd: in the /proc/self/fd/<fd> link; it does not have to be unique.' },
    { name: 'clockid',  type: 'int',      required: true,  default: null,              desc: 'timerfd_create: time.CLOCK_REALTIME, time.CLOCK_MONOTONIC or time.CLOCK_BOOTTIME.' },
    { name: 'initial, interval', type: 'float', required: false, default: '0.0',       desc: 'timerfd_settime: seconds to the first expiry (0 disarms) and the repeat period (0 = fire once). The _ns variants take integer nanoseconds.' },
  ],

  patterns: [
    {
      name: 'Wake a selector from another thread',
      desc: 'eventfd_write makes the fd readable; the loop drains it with eventfd_read.',
      code: "import os, selectors\nwake = os.eventfd(0, os.EFD_NONBLOCK | os.EFD_CLOEXEC)\nsel = selectors.DefaultSelector()\nsel.register(wake, selectors.EVENT_READ)\n# other thread: os.eventfd_write(wake, 1)\nfor key, _ in sel.select():\n    if key.fd == wake:\n        os.eventfd_read(wake)",
    },
    {
      name: 'Semaphore from the docs',
      desc: 'With EFD_SEMAPHORE each read takes 1 from the counter.',
      code: "import os\nfd = os.eventfd(1, os.EFD_SEMAPHORE | os.EFD_CLOEXEC)\ntry:\n    v = os.eventfd_read(fd)\n    try:\n        do_work()\n    finally:\n        os.eventfd_write(fd, v)\nfinally:\n    os.close(fd)",
    },
    {
      name: 'An in-memory file with a real fd',
      desc: 'memfd_create gives a file that lives in RAM, can be passed to subprocesses or mmap-ed.',
      code: "import os\nfd = os.memfd_create('scratch')\nwith os.fdopen(fd, 'w+b') as f:\n    f.write(b'hello')\n    f.seek(0)\n    data = f.read()",
    },
    {
      name: 'Periodic timer you can select on (Python 3.13+)',
      desc: 'Fire after 1 s, then every 0.5 s; read returns the expiration count.',
      code: "import os, sys, time\nfd = os.timerfd_create(time.CLOCK_MONOTONIC)\ntry:\n    os.timerfd_settime(fd, initial=1.0, interval=0.5)\n    expirations = int.from_bytes(os.read(fd, 8), sys.byteorder)\nfinally:\n    os.close(fd)",
    },
  ],

  examples: [
    {
      title: 'How an eventfd counter behaves (pure Python model)',
      code: "class EventCounter:\n    def __init__(self, initval=0, semaphore=False):\n        self.value, self.semaphore = initval, semaphore\n    def write(self, n):\n        self.value += n\n    def read(self):\n        if self.value == 0:\n            raise BlockingIOError\n        if self.semaphore:\n            self.value -= 1\n            return 1\n        n, self.value = self.value, 0\n        return n\nc = EventCounter()\nc.write(3)\nc.write(4)\n(c.read(), c.value)",
      returns: '(7, 0)',
    },
    {
      title: 'EFD_SEMAPHORE: each read takes 1',
      code: "class Sem:\n    def __init__(self, n):\n        self.value = n\n    def read(self):\n        if self.value == 0:\n            raise BlockingIOError\n        self.value -= 1\n        return 1\ns = Sem(2)\nreads = [s.read(), s.read()]\ntry:\n    s.read()\nexcept BlockingIOError:\n    reads.append('would block')\nreads",
      returns: "[1, 1, 'would block']",
    },
    {
      title: 'The counter travels as 8 bytes in host byte order',
      code: 'import sys\nraw = (7).to_bytes(8, sys.byteorder)\n(len(raw), int.from_bytes(raw, sys.byteorder))',
      returns: '(8, 7)',
    },
    {
      title: 'Largest value the counter can hold',
      code: '2 ** 64 - 2',
      returns: '18446744073709551614',
    },
    {
      title: 'MFD_HUGE_2MB = log2(page size) << MFD_HUGE_SHIFT',
      code: 'MFD_HUGE_SHIFT = 26\n((2 * 1024 * 1024).bit_length() - 1) << MFD_HUGE_SHIFT',
      returns: '1409286144',
    },
    {
      title: 'Decode the page size back out of a flag',
      code: 'MFD_HUGE_SHIFT, MFD_HUGE_MASK = 26, 63\nflag = 1409286144\n1 << ((flag >> MFD_HUGE_SHIFT) & MFD_HUGE_MASK)',
      returns: '2097152',
    },
    {
      title: 'Portable cousin of memfd: an unnamed temporary file',
      code: "import tempfile\nwith tempfile.TemporaryFile() as f:\n    f.write(b'hello')\n    f.seek(0)\n    data = f.read()\ndata",
      returns: "b'hello'",
    },
  ],

  pitfalls: [
    {
      name: 'Decoding the 8 raw bytes with a fixed byte order',
      desc: 'os.read on an eventfd or timerfd returns the count in the host byte order (little-endian on x86-64). Use sys.byteorder — or eventfd_read, which decodes for you.',
      wrong: { label: "'big'", code: "raw = (1).to_bytes(8, 'little')  # what x86 Linux returns for a count of 1\nint.from_bytes(raw, 'big')", output: '72057594037927936' },
      fix:   { label: 'sys.byteorder', code: 'import sys\nraw = (1).to_bytes(8, sys.byteorder)\nint.from_bytes(raw, sys.byteorder)', output: '1' },
    },
    {
      name: 'Reading MFD_HUGE_* as a size',
      desc: 'The MFD_HUGE_* constants encode log2 of the huge page size in bits 26 and up; their numeric value is not a byte count. Combine them with MFD_HUGETLB as flags, and decode with MFD_HUGE_SHIFT / MFD_HUGE_MASK if you need the size.',
      wrong: { label: 'divide', code: 'flag = 1409286144  # os.MFD_HUGE_2MB on Linux\nflag // (1024 * 1024)', output: '1344' },
      fix:   { label: 'decode', code: 'flag = 1409286144  # os.MFD_HUGE_2MB on Linux\n(1 << ((flag >> 26) & 63)) // (1024 * 1024)', output: '2' },
    },
  ],

  when: {
    use: [
      'Waking an event loop or selector from another thread (eventfd)',
      'Counting events or a cross-process semaphore on Linux (eventfd with EFD_SEMAPHORE)',
      'A file that never touches disk but still has an fd for subprocesses, mmap or sealing (memfd_create)',
      'Timers that integrate with select / poll / epoll (timerfd, 3.13+)',
    ],
    avoid: [
      'Portable code → os.pipe for wake-ups, tempfile.TemporaryFile or io.BytesIO for scratch data, threading.Timer or asyncio for timers',
      'Python-level signalling between threads → threading.Event / queue.Queue',
    ],
  },

  notes: {
    cpython:          'Thin wrappers in Modules/posixmodule.c. eventfd_read / eventfd_write do not check that the fd really is an eventfd',
    'Availability':   'eventfd, eventfd_read, eventfd_write, EFD_CLOEXEC, EFD_NONBLOCK: Linux 2.6.27+ (EFD_SEMAPHORE 2.6.30+), Python 3.10+. memfd_create and MFD_*: Linux 3.17+ with glibc 2.27+, Python 3.8+; MFD_HUGE_* since Linux 4.14. timerfd_* and TFD_*: Linux 2.6.27+ with glibc 2.8+, Python 3.13+ (not in 3.12)',
    'eventfd reads':  'Without EFD_SEMAPHORE a read returns the whole counter and resets it to 0; with it, a read returns 1 and decrements. A read on a zero counter blocks, or raises BlockingIOError with EFD_NONBLOCK. Raw os.read needs an 8-byte buffer: a 4-byte read fails with OSError (EINVAL)',
    'Defaults':       'eventfd and memfd_create add EFD_CLOEXEC / MFD_CLOEXEC by default, and Python always sets TFD_CLOEXEC on timerfds; the fds are non-inheritable',
    'Values on Linux': 'EFD_SEMAPHORE 1, EFD_NONBLOCK 2048 (= O_NONBLOCK), EFD_CLOEXEC 524288 (= O_CLOEXEC); MFD_CLOEXEC 1, MFD_ALLOW_SEALING 2, MFD_HUGETLB 4, MFD_HUGE_SHIFT 26, MFD_HUGE_MASK 63',
    'timerfd':        'timerfd_settime(fd, *, flags=0, initial=0.0, interval=0.0) returns the previous (next_expiration, interval); timerfd_gettime returns the current pair as floats, the _ns variants use integer nanoseconds. TFD_TIMER_ABSTIME makes initial an absolute clock value; TFD_TIMER_CANCEL_ON_SET (with ABSTIME on CLOCK_REALTIME) aborts reads with ECANCELED when the system clock jumps',
  },

  related: [
    { name: 'os.pipe', slug: 'pipe', when: 'The portable wake-up fd' },
    { name: 'os.open / read / close', slug: 'open', when: 'Raw reads of the 8-byte counter, closing the fd' },
    { name: 'os.fsync / ftruncate', slug: 'fsync', when: 'Size a memfd with ftruncate' },
    { name: 'int.from_bytes', slug: 'int-from_bytes', when: 'Decode the raw 8-byte count', category: 'functions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is os.eventfd available on Windows or macOS?',
      a: 'No. eventfd, memfd_create and timerfd are Linux system calls; the os module only has them on Linux (eventfd since Python 3.10, memfd_create since 3.8, timerfd since 3.13). This page has no live demo for that reason; the examples model the behaviour in plain Python and use portable stand-ins such as os.pipe and tempfile.TemporaryFile.',
    },
    {
      q: 'What is the difference between eventfd and a pipe for waking up a select loop?',
      a: 'Both make an fd readable. A pipe needs two fds and its buffer fills if nobody drains it; an eventfd is one fd holding a 64-bit counter, so repeated writes just add up and one read collects them. Use os.pipe when the code must also run on macOS or Windows.',
    },
    {
      q: 'What is memfd_create used for?',
      a: 'Creating a file that lives only in memory but behaves like a real file: it has an fd you can write, mmap, truncate, pass to a child process or seal (with MFD_ALLOW_SEALING). The name is only a debugging label: it shows up, prefixed with memfd:, as the target of the /proc/self/fd/<fd> link, and several memfds may share it.',
    },
    {
      q: 'Why is os.timerfd_create missing in my Python?',
      a: 'It was added in Python 3.13 and only exists on Linux. On 3.12 and earlier, or on other systems, use threading.Timer, asyncio loop.call_later, or signal.setitimer for a timer.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.eventfd',
    meta:  'os.eventfd / memfd_create / timerfd_create',
  },
};
