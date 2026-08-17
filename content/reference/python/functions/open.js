// content/reference/python/functions/open.js

export const meta = {
  slug:        'open',
  name:        'open',
  signature:   'open(file, mode=&apos;r&apos;, encoding=None, ...)',
  blurb:       'Open a file — the standard entry point for reading and writing.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'open file read write text binary mode encoding context manager with utf-8 close',
};

export const method = {
  slug:      'open',
  name:      'open',
  signature: 'open(file, mode=&apos;r&apos;, buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)',
  returns:   { type: 'file object', desc: 'A file object supporting read / write / iteration / seek. In TEXT mode returns a TextIOWrapper (str); in BINARY mode returns a BufferedReader / BufferedWriter (bytes). Always use `with open(...) as f:` so the file is closed on exit.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'Open a file. Almost always use it with `with` — Python will close for you.',

  cheat: {
    commonCall: 'with open(path, "r", encoding="utf-8") as f:\n    text = f.read()',
    returns:    'a file object — str in text mode, bytes in binary mode',
    replaces:   'the older os.open + os.read + os.close low-level API',
    watchOut:   'use `with` to guarantee close; specify encoding on text mode; &quot;w&quot; truncates',
  },

  parameters: [
    { name: 'file',      type: 'str | Path | int', required: true,  default: null,   desc: 'The path to open, or an integer file descriptor. Accepts str, bytes, os.PathLike, or an fd.' },
    { name: 'mode',      type: 'str',              required: false, default: '"r"',  desc: 'Mode string. Combinations of r (read) / w (write, truncates) / a (append) / x (create-exclusive) / + (read AND write) and b (binary) / t (text, default).' },
    { name: 'encoding',  type: 'str',              required: false, default: 'None', desc: 'Text mode only. utf-8 is a good default; None uses the locale-dependent default which is fragile.' },
    { name: 'errors',    type: 'str',              required: false, default: 'None', desc: 'How to handle encoding errors: strict (default), ignore, replace, backslashreplace, ...' },
    { name: 'newline',   type: 'str',              required: false, default: 'None', desc: 'Newline handling. None enables universal newlines; &quot;&quot; disables translation.' },
    { name: 'buffering', type: 'int',              required: false, default: '-1',   desc: 'Buffering policy. -1 uses the default; 0 for unbuffered (binary only); 1 for line-buffered.' },
  ],

  demoParams: [
    { name: 'mode', type: 'str', hint: 'mode: r / w / a / rb / r+ / x', input: 'text' },
  ],
  cases: [
    { id: 'read',    label: 'r — read text',        values: { mode: 'r' } },
    { id: 'write',   label: 'w — write (truncate)', values: { mode: 'w' } },
    { id: 'append',  label: 'a — append',            values: { mode: 'a' } },
    { id: 'read-bin',label: 'rb — read binary',      values: { mode: 'rb' } },
    { id: 'read-write',label: 'r+ — read AND write', values: { mode: 'r+' } },
    { id: 'exclusive',label: 'x — create exclusive',  values: { mode: 'x' } },
  ],
  demoExplainer: 'The demo describes what each mode does. `r` (default): read-only, file must exist. `w`: write-only, TRUNCATES the file on open (data loss if you forget). `a`: append, seeks to end on open. `rb` / `wb`: binary versions returning bytes. `r+`: read AND write, file must exist. `x`: create-exclusive, raises FileExistsError if the file already exists. Combine `b` or `t` for binary or text explicit mode.',

  patterns: [
    {
      name: 'Read a text file (utf-8)',
      desc: 'Always specify encoding — the default is locale-dependent.',
      code: 'with open("data.txt", "r", encoding="utf-8") as f:\n    text = f.read()',
    },
    {
      name: 'Write a text file',
      desc: '&quot;w&quot; TRUNCATES on open — be sure you meant it.',
      code: 'with open("out.txt", "w", encoding="utf-8") as f:\n    f.write("hello\\n")',
    },
    {
      name: 'Append (do not truncate)',
      desc: 'Add lines without erasing the existing content.',
      code: 'with open("log.txt", "a", encoding="utf-8") as f:\n    f.write(line + "\\n")',
    },
    {
      name: 'Read binary',
      desc: 'For images, protocols, anything not text.',
      code: 'with open("photo.jpg", "rb") as f:\n    data = f.read()',
    },
    {
      name: 'Iterate line by line',
      desc: 'File objects are iterators of lines — memory-friendly for large files.',
      code: 'with open("big.log", "r", encoding="utf-8") as f:\n    for line in f:\n        process(line)',
    },
    {
      name: 'Create-if-missing, refuse-if-exists',
      desc: '&quot;x&quot; mode — safer than &quot;w&quot; when you must not overwrite.',
      code: 'with open("unique.txt", "x", encoding="utf-8") as f:\n    ...',
    },
  ],

  examples: [
    { title: 'Read all',           code: 'with open("f.txt", encoding="utf-8") as f:\n    text = f.read()', returns: 'file contents as str' },
    { title: 'Read lines',         code: 'with open("f.txt", encoding="utf-8") as f:\n    lines = f.readlines()', returns: 'list of str' },
    { title: 'Write',              code: 'with open("f.txt", "w", encoding="utf-8") as f:\n    f.write("hi")', returns: 'file created / overwritten' },
    { title: 'Append',             code: 'with open("f.txt", "a", encoding="utf-8") as f:\n    f.write("more\\n")', returns: 'appended' },
    { title: 'Read binary',        code: 'with open("img.png", "rb") as f:\n    data = f.read()', returns: 'bytes' },
    { title: 'Missing file',       code: 'open("nope.txt", "r")', returns: 'FileNotFoundError' },
    { title: 'Existing + x',       code: 'open("existing.txt", "x")', returns: 'FileExistsError' },
  ],

  pitfalls: [
    {
      name: 'Not using `with` — file may leak until GC',
      desc: 'A raw `open()` without `with` relies on the garbage collector to close the file. CPython usually closes promptly, but the exact timing is implementation-dependent (PyPy and some patterns delay it). Always use `with`.',
      wrong: { label: 'Leaked',   code: 'f = open("data.txt")\ntext = f.read()   # forgot to close', output: 'file stays open' },
      fix:   { label: 'Use with', code: 'with open("data.txt") as f:\n    text = f.read()', output: 'closed on exit' },
    },
    {
      name: '&quot;w&quot; TRUNCATES on open — before you write anything',
      desc: 'The truncation happens the moment open() returns. Even if your subsequent write fails, the original data is gone. Use &quot;a&quot; for append, &quot;r+&quot; for read-then-modify, &quot;x&quot; to refuse-if-exists.',
      wrong: { label: 'Data loss',    code: 'with open("valuable.txt", "w") as f:\n    raise SomeError()   # file now empty', output: 'file truncated' },
      fix:   { label: 'Match intent', code: 'open(path, "a")   # or "r+" or "x"', output: 'preserves data' },
    },
    {
      name: 'Text mode uses the LOCALE encoding by default — fragile',
      desc: 'On some systems the default is cp1252 or ANSI; on Linux it is often UTF-8. If you don&apos;t specify encoding, the same code reads differently on different machines. ALWAYS pass encoding.',
      wrong: { label: 'Locale-dependent', code: 'open("data.txt")   # what encoding?', output: 'varies by OS/locale' },
      fix:   { label: 'Explicit UTF-8',    code: 'open("data.txt", encoding="utf-8")', output: 'portable' },
    },
    {
      name: 'Binary mode returns BYTES, text mode returns STR',
      desc: 'Mixing them causes TypeErrors. Reading a text file in &quot;rb&quot; gives bytes; writing str to a &quot;wb&quot; file fails. Pick the mode that matches the data.',
      wrong: { label: 'Type mismatch', code: 'with open("f", "wb") as f:\n    f.write("hi")', output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'Match the mode', code: 'f.write(b"hi")', output: 'or open in text mode' },
    },
  ],

  when: {
    use: [
      'Reading and writing files — always through `with`',
      'Iterating lines of a large file without loading it all',
      'Binary I/O for images, protocols, non-text data',
      'Any file operation — this is the canonical builtin',
    ],
    avoid: [
      'Complex path manipulation → pair with pathlib.Path',
      'Very high-throughput I/O → consider mmap or lower-level APIs',
      'Reading structured data → prefer csv / json / a real parser',
      'Network I/O disguised as file I/O → use the right module (urllib, requests, ...)',
    ],
  },

  notes: {
    complexity: 'O(1) to open; O(n) to read',
    return:     'A file object; use as a context manager',
    cpython:    'Python/bltinmodule.c :: builtin_open — dispatches to io.open',
    memory:     'Allocates buffered wrapper objects',
    threadSafe: 'File objects are not safe for concurrent access',
  },

  related: [
    { name: 'input',  slug: 'input',  when: 'Read a line from stdin (not a file)' },
    { name: 'print',  slug: 'print',  when: 'Write to a file object with the file= arg' },
    { name: 'str.encode', slug: 'str-encode', when: 'Manual text-to-bytes for binary I/O' },
    { name: 'bytes',  slug: 'bytes',  when: 'Bytes literal for binary writes' },
  ],

  faq: [
    {
      q: 'Why do I need `with` when using open?',
      a: 'To guarantee the file is closed as soon as the block exits — even on exceptions. Without `with`, you rely on the garbage collector, whose timing is implementation-dependent.',
    },
    {
      q: 'What is the default encoding?',
      a: 'On Python &lt; 3.15, the &quot;locale-preferred&quot; encoding — varies by OS. This is a portability trap: always pass `encoding=&quot;utf-8&quot;` (or whatever your data actually uses). PEP 686 makes UTF-8 the default in newer Python versions.',
    },
    {
      q: 'What is the difference between &quot;r&quot; and &quot;rb&quot;?',
      a: '&quot;r&quot; is TEXT mode — returns str, applies encoding, and does newline translation. &quot;rb&quot; is BINARY mode — returns bytes, no encoding, no translation. Use binary for anything not text.',
    },
  ],

  history: [
    { version: '1.0', note: 'open() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'Text vs binary mode enforced; text returns str, binary returns bytes.' },
    { version: '3.3', note: '&quot;x&quot; mode added for exclusive creation.' },
    { version: '3.15', note: 'PEP 686 — UTF-8 becomes the default encoding.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#open',
    meta:  'open',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect file contents' },
  ],
};