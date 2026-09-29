// content/reference/python/exceptions/memoryerror.js

export const meta = {
  slug:        'memoryerror',
  name:        'MemoryError',
  signature:   'MemoryError(*args)',
  blurb:       'Raised when an allocation fails because the process is out of memory — but the situation may still be recoverable.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: false,
  version:     'Python 3 (all)',
  searchTerms: 'memoryerror memory error out of memory oom unable to allocate large list read whole file pandas numpy 32-bit python killed',
};

export const method = {
  slug:      'memoryerror',
  name:      'MemoryError',
  signature: 'MemoryError(*args)',

  category:    'Runtime exception',
  version:     'Python 3 (all)',
  hasLiveDemo: false,

  subtitle: 'The data does not fit: stream it, chunk it, or store it more compactly — catching MemoryError is a last resort, not a fix.',

  chain: ['BaseException', 'Exception', 'MemoryError'],

  cheat: {
    raisedBy: 'building huge lists/strings, f.read() of a giant file, loading big datasets whole',
    message:  'usually empty — just MemoryError',
    quickFix: 'process in chunks / generators instead of all at once',
    watchOut: 'on Linux the OS may kill the process ("Killed") before Python can raise',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Optional message. Allocation failures inside CPython usually raise it with no arguments.' },
  ],

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'Usually () — the interpreter rarely attaches a message. Libraries (NumPy, pandas) raise their own subclasses with a size in the message.' },
  ],

  patterns: [
    {
      name: 'Stream a file line by line',
      desc: 'Iterating a file keeps one line in memory at a time, whatever the file size.',
      code: "total = 0\nwith open('huge.log', encoding='utf-8') as f:\n    for line in f:\n        if 'ERROR' in line:\n            total += 1",
    },
    {
      name: 'Fixed-size chunks for binary data',
      desc: 'Hash or copy files of any size with a small, constant buffer.',
      code: "import hashlib\nh = hashlib.sha256()\nwith open('disk.img', 'rb') as f:\n    for chunk in iter(lambda: f.read(1 << 20), b''):\n        h.update(chunk)",
    },
    {
      name: 'Generator instead of list',
      desc: 'A generator expression produces items on demand; sum() never needs the whole sequence.',
      code: 'total = sum(x * x for x in range(10**9))',
    },
    {
      name: 'Last-resort handler',
      desc: 'Free the big object first, then report. Keep the handler tiny — it may itself need memory.',
      code: "try:\n    table = build_table(rows)\nexcept MemoryError:\n    table = None\n    raise SystemExit('not enough memory for this input; try --chunked')",
    },
  ],

  examples: [
    { title: 'Raise it',                  code: 'raise MemoryError', returns: 'MemoryError' },
    { title: 'Usually no message',        code: 'str(MemoryError())', returns: "''" },
    { title: 'Catch it like any Exception', code: "try:\n    raise MemoryError\nexcept MemoryError as e:\n    caught = repr(e)\ncaught", returns: "'MemoryError()'" },
    { title: 'Absurd sizes fail earlier — as OverflowError', code: '[None] * 10**20', returns: "OverflowError: cannot fit 'int' into an index-sized integer" },
    { title: 'A generator holds nothing up front', code: 'sum(x for x in range(10**6))', returns: '499999500000' },
    { title: 'Not a RuntimeError', code: 'issubclass(MemoryError, RuntimeError), issubclass(MemoryError, Exception)', returns: '(False, True)' },
  ],

  pitfalls: [
    {
      name: 'Materialising a list you only iterate once',
      desc: 'A list comprehension builds every element before sum() starts; a generator expression builds one at a time. Same answer, a tiny fraction of the memory for large ranges.',
      wrong: { label: 'List first', code: 'sum([x * x for x in range(1000)])', output: '332833500' },
      fix:   { label: 'Generator', code: 'sum(x * x for x in range(1000))', output: '332833500' },
    },
    {
      name: 'read() on a file of unknown size',
      desc: 'f.read() loads the entire file into one string. Iterate the file instead so memory use stays flat.',
      wrong: { label: 'read() everything', code: "with open('log.txt', 'w') as f:\n    f.write('ok\\nERROR x\\nok\\n')\nwith open('log.txt') as f:\n    n = f.read().count('ERROR')\nn", output: '1' },
      fix:   { label: 'Stream lines', code: "with open('log.txt', 'w') as f:\n    f.write('ok\\nERROR x\\nok\\n')\nwith open('log.txt') as f:\n    n = sum('ERROR' in line for line in f)\nn", output: '1' },
    },
  ],

  when: {
    use: [
      'A last-resort handler that frees memory and reports a clear error',
      'Raising it from a C extension or custom allocator when allocation fails',
    ],
    avoid: [
      'Treating it as normal control flow — the process may be too starved to recover',
      'Growing a structure until MemoryError to "find the limit"',
    ],
  },

  notes: {
    'Linux OOM killer': 'With memory overcommit, allocations may succeed and the kernel kills the process later ("Killed", exit code 137) — no exception at all',
    '32-bit Python':   'A 32-bit interpreter hits MemoryError around 2–4 GB regardless of installed RAM; check with struct.calcsize("P") * 8',
    'NumPy':           'Raises a private MemoryError subclass (_ArrayMemoryError) with "Unable to allocate … for an array with shape …" — except MemoryError catches it',
  },

  related: [
    { name: 'OverflowError',  slug: 'overflowerror',  when: 'Sizes too large to even attempt' },
    { name: 'RecursionError', slug: 'recursionerror', when: 'Running out of stack rather than heap' },
    { name: 'range()',        slug: 'range',          when: 'Lazy: range(10**9) costs no memory', category: 'functions' },
    { name: 'sum()',          slug: 'sum',            when: 'Accepts a generator, no list needed', category: 'functions' },
    { name: 'open()',         slug: 'open',           when: 'Iterate the file instead of read()', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Triggering a real MemoryError means actually exhausting memory, which would freeze your browser tab or a reader\'s machine, and the point where it happens depends on RAM, the OS and other processes. The examples raise and catch it directly instead, and show the safe patterns that prevent it.',
    },
    {
      q: 'How do I fix MemoryError in Python?',
      a: 'Hold less data at once. Iterate files instead of read(); use generators instead of lists; process data in chunks (pandas read_csv(chunksize=…), database cursors fetchmany()); use compact types (array, NumPy dtypes like float32/int32, categoricals); delete large objects you no longer need. If you are on 32-bit Python, switch to 64-bit. Buying RAM is the last option, not the first.',
    },
    {
      q: 'Why does my program just print "Killed" instead of MemoryError?',
      a: 'On Linux the kernel usually lets allocations succeed (overcommit) and later kills the biggest process when memory really runs out. Python never gets the chance to raise MemoryError; the shell prints Killed and the exit code is 137. Containers with memory limits behave the same way.',
    },
    {
      q: 'Can I catch MemoryError and continue?',
      a: 'Sometimes. It is an ordinary Exception subclass, and the docs note the situation "may still be rescued" by deleting objects. In practice, free the large object in the handler, avoid allocating more there, and fail with a clear message — continuing normal work after it is fragile.',
    },
    {
      q: 'Why do I get OverflowError instead of MemoryError for a huge list?',
      a: "When the requested size cannot even be represented as a C index (for example [None] * 10**20), Python fails before trying to allocate and raises OverflowError: cannot fit 'int' into an index-sized integer. MemoryError is for sizes that are representable but cannot be allocated.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#MemoryError',
    meta:  'Built-in exceptions',
  },
};
