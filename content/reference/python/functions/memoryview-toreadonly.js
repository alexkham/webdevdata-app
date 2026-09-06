// content/reference/python/functions/memoryview-toreadonly.js
//
// Doc-only page: the result is a memoryview whose repr is a memory ADDRESS
// that changes on every run, so no stable demo output exists.

export const meta = {
  slug:        'memoryview-toreadonly',
  name:        'memoryview.toreadonly',
  signature:   'memoryview.toreadonly()',
  blurb:       'A read-only view over the same memory — hand out data without handing out write access.',
  category:    'memoryview',
  type:        'memoryview',
  hasLiveDemo: false,
  version:     'Python 3.8+',
  searchTerms: 'memoryview toreadonly read only immutable protect write access share buffer safe',
};

export const method = {
  slug:      'memoryview-toreadonly',
  name:      'memoryview.toreadonly',
  signature: 'memoryview.toreadonly()',
  returns:   { type: 'memoryview', desc: 'A new view over the SAME memory with writes disabled. The original view keeps whatever access it had.' },

  category:    'Memoryview method',
  version:     'Python 3.8+',
  hasLiveDemo: false,

  subtitle: 'Zero-copy defence. Share a large buffer with code you do not fully trust, without copying it and without letting that code write to it.',

  cheat: {
    commonCall: 'safe = view.toreadonly()',
    returns:    'memoryview — same bytes, writes rejected',
    replaces:   'copying the buffer purely to stop someone modifying it',
    watchOut:   'it protects the VIEW, not the buffer — other writers still can',
  },

  parameters: [],

  examples: [
    { title: 'Writes are rejected', code: "ro = memoryview(bytearray(b'ab')).toreadonly()\nro[0] = 99", returns: 'TypeError: cannot modify read-only memory' },
    { title: 'Reading still works', code: 'ro.tolist()',            returns: '[97, 98]' },
    { title: 'The flag',            code: 'ro.readonly',            returns: 'True' },
    { title: 'Original unaffected', code: "m = memoryview(bytearray(b'ab'))\nm.toreadonly()\nm.readonly", returns: 'False' },
    { title: 'Already read-only',   code: "memoryview(b'ab').toreadonly().readonly", returns: 'True' },
    { title: 'No copying',          code: 'ro.nbytes',              returns: '2  # same memory, not a duplicate' },
  ],

  pitfalls: [
    {
      name: 'It protects the view, not the buffer',
      desc: 'The underlying bytearray is still mutable through any other reference. A read-only view stops the HOLDER of that view from writing; it does not freeze the data.',
      wrong: { label: 'Data still changes', code: "b = bytearray(b'ab')\nro = memoryview(b).toreadonly()\nb[0] = 99\nro.tolist()", output: '[99, 98]  # changed underneath' },
      fix:   { label: 'Copy to freeze',     code: 'frozen = bytes(memoryview(b))', output: 'an independent snapshot' },
    },
    {
      name: 'The original view keeps write access',
      desc: 'toreadonly returns a NEW view; it does not downgrade the one you called it on. Forgetting to use the returned object leaves the writable view in play.',
      wrong: { label: 'Return value ignored', code: 'm.toreadonly()\nm[0] = 99', output: 'succeeds — m was never restricted' },
      fix:   { label: 'Use what it returns',  code: 'ro = m.toreadonly()\nro[0] = 99', output: 'TypeError' },
    },
    {
      name: 'There is no way back',
      desc: 'No toWritable exists. Once you hold only the read-only view, regaining write access means going back to the original buffer or view — so do not discard those if you will need to write later.',
      wrong: { label: 'No reverse method', code: 'ro.towritable()', output: "AttributeError: 'memoryview' object has no attribute 'towritable'" },
      fix:   { label: 'Keep the original',  code: 'm = memoryview(b)\nro = m.toreadonly()   # keep m', output: 'm still writes' },
    },
    {
      name: 'Python 3.8 and newer only',
      desc: 'On older versions the method does not exist. The pre-3.8 way to hand out a non-writable view was to copy into bytes first, which costs the memory a view was meant to save.',
      wrong: { label: 'Fails on 3.7', code: 'view.toreadonly()', output: "AttributeError: 'memoryview' object has no attribute 'toreadonly'" },
      fix:   { label: 'Copy instead',  code: 'memoryview(bytes(view))', output: 'read-only, but copies' },
    },
  ],

  when: {
    use: [
      'Passing a large buffer to code that should only read it',
      'Public APIs exposing internal buffers without copying',
      'Enforcing an intent that a comment alone would not',
    ],
    avoid: [
      'You need a genuine immutable snapshot → copy to bytes',
      'The buffer is already immutable bytes — it is already read-only',
      'Supporting Python 3.7 or older without a fallback',
    ],
  },

  notes: {
    complexity: 'O(1) — new view metadata, no data touched',
    return:     'A new memoryview sharing the original memory',
    cpython:    'Objects/memoryobject.c :: memory_toreadonly',
    memory:     'No copying; the new view keeps the buffer alive and exported',
    threadSafe: 'Reading is safe; the source can still change under you via other references',
  },

  related: [
    { name: 'memoryview',         slug: 'memoryview',         when: 'Create the view in the first place' },
    { name: 'memoryview.tobytes', slug: 'memoryview-tobytes', when: 'A real immutable copy instead of a restricted view' },
    { name: 'bytes',              slug: 'bytes',              when: 'The genuinely immutable byte type' },
    { name: 'frozenset',          slug: 'frozenset',          when: 'The same read-only idea for sets' },
  ],

  faq: [
    {
      q: 'Does it make the data immutable?',
      a: 'No — only that view. Anyone holding the original bytearray or a writable view can still change the bytes, and your read-only view will see the change. For a genuine snapshot you have to copy.',
      code: 'frozen = bytes(view)   # independent',
    },
    {
      q: 'Why not just copy to bytes?',
      a: 'Because copying costs time and memory proportional to the buffer, which is exactly what memoryview exists to avoid. toreadonly gives the same protection against writes at no copying cost.',
      code: 'ro = view.toreadonly()   # O(1)\nro = bytes(view)         # O(n)',
    },
    {
      q: 'Can I make it writable again?',
      a: 'Not from the read-only view — there is no inverse method. Keep a reference to the original view or buffer if you will need to write later.',
    },
  ],

  history: [
    { version: '3.8', note: 'memoryview.toreadonly added, giving a zero-copy way to share buffers safely.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#memoryview.toreadonly',
    meta:  'memoryview.toreadonly',
  },

  tryInTool: [],
};
