// content/reference/python/stdlib/sys/getsizeof.js — memory introspection

export const meta = {
  slug:        'getsizeof',
  name:        'sys.getsizeof / getrefcount / getallocatedblocks',
  signature:   'sys.getsizeof(object[, default]) · sys.getrefcount(object) · sys.getallocatedblocks()',
  blurb:       'Memory introspection: the size in bytes of one object (not what it contains), its reference count, and the number of memory blocks the interpreter has allocated.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'getsizeof 2.6+ · getrefcount all versions · getallocatedblocks 3.4+',
  searchTerms: 'sys.getsizeof getsizeof sys.getrefcount getrefcount sys.getallocatedblocks getallocatedblocks size of object in bytes python memory usage of list reference count memory leak __sizeof__ deep size immortal objects',
};

export const method = {
  slug:      'getsizeof',
  name:      'sys.getsizeof / getrefcount / getallocatedblocks',
  signature: 'sys.getsizeof(object[, default]) · sys.getrefcount(object) · sys.getallocatedblocks()',
  returns:   { type: 'int', desc: 'getsizeof: bytes used by the object itself. getrefcount: its reference count (plus one for the argument). getallocatedblocks: blocks currently allocated.' },

  category:    'sys function',
  version:     'getsizeof 2.6+ · getrefcount all versions · getallocatedblocks 3.4+',
  hasLiveDemo: false,

  subtitle: 'getsizeof is shallow: a list reports its own header and pointer array, not the objects it points to. The numbers depend on the Python version and on 32- vs 64-bit builds (sys.getsizeof(0) is 28 on 64-bit CPython 3.12 and 3.13), so the examples compare sizes instead of printing them.',

  covers: ['getsizeof', 'getrefcount', 'getallocatedblocks'],

  cheat: {
    commonCall: 'sys.getsizeof([1, 2, 3])',
    returns:    'int — bytes of the list object only',
    replaces:   'Guessing memory use; for real profiling use tracemalloc',
    watchOut:   'Contents are not included — sum them yourself',
  },

  parameters: [
    { name: 'object',  type: 'object', required: true,  default: null, desc: 'Any object. getsizeof calls its __sizeof__() and adds the garbage-collector header for tracked objects.' },
    { name: 'default', type: 'object', required: false, default: null, desc: 'getsizeof only: returned when the size cannot be determined (__sizeof__ raises TypeError) instead of raising.' },
  ],

  patterns: [
    {
      name: 'Deep size of nested containers',
      desc: 'Walk the contents once each (ids avoid double counting shared objects).',
      code: 'import sys\ndef deep_sizeof(obj, seen=None):\n    seen = set() if seen is None else seen\n    if id(obj) in seen:\n        return 0\n    seen.add(id(obj))\n    size = sys.getsizeof(obj)\n    if isinstance(obj, dict):\n        size += sum(deep_sizeof(k, seen) + deep_sizeof(v, seen) for k, v in obj.items())\n    elif isinstance(obj, (list, tuple, set, frozenset)):\n        size += sum(deep_sizeof(x, seen) for x in obj)\n    return size',
    },
    {
      name: 'Where is the memory going? → tracemalloc',
      desc: 'Allocation tracking by source line, far more useful than single sizes.',
      code: "import tracemalloc\ntracemalloc.start()\nbuild_cache()\nfor stat in tracemalloc.take_snapshot().statistics('lineno')[:5]:\n    print(stat)",
    },
    {
      name: 'Leak check in a test loop',
      desc: 'A steadily growing block count across iterations hints at a leak.',
      code: 'import gc, sys\nfor _ in range(3):\n    run_once()\n    gc.collect()\n    print(sys.getallocatedblocks())',
    },
  ],

  examples: [
    { title: 'Bigger list, bigger object',     code: 'import sys\nsys.getsizeof([1, 2, 3]) > sys.getsizeof([])', returns: 'True' },
    { title: 'Contents are not counted',       code: 'import sys\nsys.getsizeof([10 ** 100]) == sys.getsizeof([1])', returns: 'True' },
    { title: 'ASCII strings: one byte per character', code: "import sys\nsys.getsizeof('ab') - sys.getsizeof('a')", returns: '1' },
    { title: 'Non-ASCII text costs more',      code: "import sys\nsys.getsizeof('é') > sys.getsizeof('e')", returns: 'True' },
    { title: 'default when there is no size',  code: "import sys\nclass Opaque:\n    def __sizeof__(self):\n        raise TypeError('size unknown')\nsys.getsizeof(Opaque(), 'n/a')", returns: "'n/a'" },
    { title: 'A new object has two references here', code: 'import sys\nx = object()\nsys.getrefcount(x) >= 2', returns: 'True' },
    { title: 'Allocated blocks is a plain int', code: 'import sys\nisinstance(sys.getallocatedblocks(), int)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Measuring a container with getsizeof alone',
      desc: 'A list holding a 1 MB string reports well under 100 bytes. Add the items (or use a deep-size helper).',
      wrong: { label: 'shallow', code: "import sys\ndata = ['x' * 1_000_000]\nsys.getsizeof(data) < 100", output: 'True' },
      fix:   { label: 'list + items', code: "import sys\ndata = ['x' * 1_000_000]\nsys.getsizeof(data) + sum(sys.getsizeof(s) for s in data) > 1_000_000", output: 'True' },
    },
    {
      name: 'Measuring an instance without its attributes',
      desc: 'An instance stores its attributes in a separate __dict__ and the values are separate objects again.',
      wrong: { label: 'instance only', code: "import sys\nclass Doc:\n    def __init__(self):\n        self.text = 'x' * 10_000\nsys.getsizeof(Doc()) < 1000", output: 'True' },
      fix:   { label: 'include vars()', code: "import sys\nclass Doc:\n    def __init__(self):\n        self.text = 'x' * 10_000\nd = Doc()\nsys.getsizeof(d) + sum(sys.getsizeof(v) for v in vars(d).values()) > 10_000", output: 'True' },
    },
  ],

  when: {
    use: [
      'Comparing the overhead of data structures (list vs tuple vs array)',
      'Quick checks while hunting a leak (getrefcount, getallocatedblocks)',
    ],
    avoid: [
      'Real memory profiling → tracemalloc, or a tool like memray',
      'Process memory → resource / psutil, the OS view',
    ],
  },

  notes: {
    cpython:          'getsizeof calls type(obj).__sizeof__ and adds the GC header size for GC-tracked objects (Python/sysmodule.c, _PySys_GetSizeOf)',
    'getrefcount':    'Includes the temporary reference held by the call itself. Since 3.12 immortal objects (None, True, False, small ints …) report a huge fixed count that does not track real references',
    'getallocatedblocks': 'Counts blocks from the interpreter allocator; caches make it vary between calls — gc.collect() first for steadier numbers. Builds that cannot compute it return 0',
    'Versions':       'Sizes change between versions as objects get more compact — compare within one interpreter only',
  },

  related: [
    { name: 'sys.intern', slug: 'intern', when: 'Sharing one copy of repeated strings' },
    { name: 'id()',       slug: 'id',     when: 'Object identity, used to avoid double counting', category: 'functions' },
    { name: 'MemoryError', slug: 'memoryerror', when: 'When allocation fails', category: 'exceptions' },
    { name: 'sys module', slug: 'sys',    when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the size of an object in Python?',
      a: 'sys.getsizeof(obj) returns the bytes used by the object itself. For containers this excludes the contained objects, so add their sizes (recursively) to get the full footprint.',
    },
    {
      q: 'Why does sys.getsizeof of a list not change when the items get bigger?',
      a: 'A list only stores pointers to its items. getsizeof([10**100]) equals getsizeof([1]) because both hold one pointer; the big int is a separate object with its own size.',
    },
    {
      q: 'Why is sys.getrefcount(None) so large?',
      a: 'Since Python 3.12 None, True, False, small ints and some other objects are immortal: their reference count is fixed at a very large value and is no longer updated, so it says nothing about how many references exist.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.getsizeof',
    meta:  'sys.getsizeof',
  },
};
