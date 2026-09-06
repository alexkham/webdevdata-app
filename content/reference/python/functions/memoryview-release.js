// content/reference/python/functions/memoryview-release.js
//
// Doc-only page: release() returns None, and everything interesting about it
// happens to the buffer AFTERWARDS — not expressible in a single-expression
// demo.

export const meta = {
  slug:        'memoryview-release',
  name:        'memoryview.release',
  signature:   'memoryview.release()',
  blurb:       'Let go of the buffer early — an open view blocks its bytearray from being resized.',
  category:    'memoryview',
  type:        'memoryview',
  hasLiveDemo: false,
  version:     'Python 3.2+',
  searchTerms: 'memoryview release free buffer export context manager with bufferror resize',
};

export const method = {
  slug:      'memoryview-release',
  name:      'memoryview.release',
  signature: 'memoryview.release()',
  returns:   { type: 'None', desc: 'Returns None. Afterwards the view is dead — every operation on it raises ValueError — and the underlying buffer is free to be resized again.' },

  category:    'Memoryview method',
  version:     'Python 3.2+',
  hasLiveDemo: false,

  subtitle: 'An open view LOCKS its buffer against resizing. release is how you let go early, rather than waiting for garbage collection to do it.',

  cheat: {
    commonCall: 'view.release()',
    returns:    'None — the view becomes unusable',
    replaces:   'del view, which only works if nothing else refers to it',
    watchOut:   'a live view makes bytearray.append raise BufferError',
  },

  parameters: [],

  examples: [
    { title: 'Releases the lock',  code: "b = bytearray(b'abc')\nm = memoryview(b)\nm.release()\nb.append(100)", returns: "bytearray(b'abcd')" },
    { title: 'Without release',    code: "b = bytearray(b'abc')\nm = memoryview(b)\nb.append(100)", returns: 'BufferError: Existing exports of data: object cannot be re-sized' },
    { title: 'View is dead after', code: 'm.release()\nm.tolist()', returns: 'ValueError: operation forbidden on released memoryview object' },
    { title: 'Releasing twice is fine', code: 'm.release()\nm.release()', returns: 'None' },
    { title: 'Context manager',    code: "with memoryview(b'xy') as v:\n    print(len(v))", returns: '2, then released automatically' },
    { title: 'Returns None',       code: "memoryview(b'abc').release()", returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'A live view blocks resizing',
      desc: 'This is the problem release exists to solve. While any view is open, the bytearray behind it cannot grow or shrink, and append raises BufferError rather than waiting.',
      wrong: { label: 'Blocked', code: "b = bytearray(b'abc')\nm = memoryview(b)\nb.append(100)", output: 'BufferError: Existing exports of data: object cannot be re-sized' },
      fix:   { label: 'Release first', code: 'm.release()\nb.append(100)', output: 'works' },
    },
    {
      name: 'Every operation fails afterwards',
      desc: 'The view is not merely detached, it is unusable. Reading, slicing or even calling len raises ValueError, so a released view must not be kept around and used later.',
      wrong: { label: 'Dead view', code: 'm.release()\nlen(m)', output: 'ValueError: operation forbidden on released memoryview object' },
      fix:   { label: 'Release last', code: 'data = m.tobytes()\nm.release()', output: 'copy taken before releasing' },
    },
    {
      name: 'Slices of a view are separate exports',
      desc: 'Releasing the parent does not release views you sliced from it. Every one holds its own lock on the buffer, so all of them must go before it can be resized.',
      wrong: { label: 'Child still holds it', code: 'm = memoryview(b)\ns = m[:2]\nm.release()\nb.append(1)', output: 'BufferError — s is still open' },
      fix:   { label: 'Release both',         code: 's.release()\nm.release()\nb.append(1)', output: 'works' },
    },
    {
      name: 'Not needed for immutable sources',
      desc: 'A view over bytes locks nothing meaningful, because bytes cannot be resized anyway. release is only worth reaching for with bytearray, array or mmap.',
      wrong: { label: 'Pointless ceremony', code: "m = memoryview(b'abc')\nm.release()", output: 'no lock was ever a problem' },
      fix:   { label: 'Let it be collected', code: "m = memoryview(b'abc')", output: 'nothing to manage' },
    },
  ],

  when: {
    use: [
      'Freeing a bytearray, array or mmap for resizing before the view goes out of scope',
      'Deterministic cleanup rather than relying on garbage collection',
      'Long-lived buffers where holding an export would block later growth',
    ],
    avoid: [
      'Views over immutable bytes, which lock nothing that matters',
      'Short-lived views — a with block does this for you',
      'After taking the copy you needed → the view is disposable anyway',
    ],
  },

  notes: {
    complexity: 'O(1) — releases the buffer export',
    return:     'Always None; calling it again is harmless',
    cpython:    'Objects/memoryobject.c :: memory_release',
    memory:     'Drops the reference keeping the source buffer pinned',
    threadSafe: 'Releasing while another thread reads the view raises there',
  },

  related: [
    { name: 'memoryview',         slug: 'memoryview',         when: 'Create the view in the first place' },
    { name: 'memoryview.tobytes', slug: 'memoryview-tobytes', when: 'Take a copy before releasing' },
    { name: 'bytearray',          slug: 'bytearray',          when: 'The resizable buffer a view usually locks' },
    { name: 'open',               slug: 'open',               when: 'The other common with-statement resource' },
  ],

  faq: [
    {
      q: 'Why does appending to a bytearray raise BufferError?',
      a: 'Because an open memoryview is an "export" of that buffer, and resizing could move the memory the view points at. Python refuses rather than leaving a dangling view — release the view and the append succeeds.',
      code: 'm.release()\nb.append(100)',
    },
    {
      q: 'Do I need to call release explicitly?',
      a: 'Usually not. A view released when it is garbage collected, and a with block releases it at the end. Call it explicitly when you need the buffer freed at a precise moment rather than whenever collection happens.',
      code: "with memoryview(buf) as v:\n    process(v)",
    },
    {
      q: 'Is it safe to release twice?',
      a: 'Yes. The second call does nothing and raises nothing, which makes release safe to put in a finally block without guarding it.',
      code: 'm.release()\nm.release()   # fine',
    },
  ],

  history: [
    { version: '3.2', note: 'release added, along with memoryview support for the with statement.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#memoryview.release',
    meta:  'memoryview.release',
  },

  tryInTool: [],
};
