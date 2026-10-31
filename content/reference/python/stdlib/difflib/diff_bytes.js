// content/reference/python/stdlib/difflib/diff_bytes.js

export const meta = {
  slug:        'diff_bytes',
  name:        'difflib.diff_bytes',
  signature:   "difflib.diff_bytes(dfunc, a, b, fromfile=b'', tofile=b'', fromfiledate=b'', tofiledate=b'', n=3, lineterm=b'\\n')",
  blurb:       'Run unified_diff or context_diff on lists of bytes lines — for files whose encoding is unknown or mixed — and get the diff lines back as bytes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'difflib diff_bytes bytes diff binary lines unknown encoding mixed encoding latin-1 utf-8 surrogateescape unified_diff context_diff dfunc all arguments must be bytes lines to compare must be str',
};

export const method = {
  slug:      'diff_bytes',
  name:      'difflib.diff_bytes',
  signature: "difflib.diff_bytes(dfunc, a, b, fromfile=b'', tofile=b'', fromfiledate=b'', tofiledate=b'', n=3, lineterm=b'\\n')",
  returns:   { type: 'Iterator[bytes]', desc: 'The lines dfunc produces, encoded back to bytes byte for byte.' },

  category:    'difflib function',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'unified_diff and context_diff accept only str. diff_bytes decodes every bytes argument losslessly (ASCII with surrogateescape), calls dfunc, and encodes each output line back — so bytes that are not valid in any one encoding come out exactly as they went in.',

  covers: ['diff_bytes'],

  cheat: {
    commonCall: "difflib.diff_bytes(difflib.unified_diff, a_lines, b_lines, b'a', b'b')",
    returns:    'a generator of bytes lines',
    replaces:   'guessing an encoding before diffing',
    watchOut:   'lines, names, dates and lineterm must all be bytes',
  },

  parameters: [
    { name: 'dfunc',        type: 'callable',    required: true,  default: null,    desc: 'unified_diff or context_diff (any function with their signature). It is called with all eight arguments positionally, so ndiff does not fit.' },
    { name: 'a',            type: 'list[bytes]', required: true,  default: null,    desc: 'The old lines, as bytes.' },
    { name: 'b',            type: 'list[bytes]', required: true,  default: null,    desc: 'The new lines, as bytes.' },
    { name: 'fromfile',     type: 'bytes',       required: false, default: "b''",   desc: 'Old file name for the header.' },
    { name: 'tofile',       type: 'bytes',       required: false, default: "b''",   desc: 'New file name for the header.' },
    { name: 'fromfiledate', type: 'bytes',       required: false, default: "b''",   desc: 'Old timestamp for the header.' },
    { name: 'tofiledate',   type: 'bytes',       required: false, default: "b''",   desc: 'New timestamp for the header.' },
    { name: 'n',            type: 'int',         required: false, default: '3',     desc: 'Context lines, passed through unchanged.' },
    { name: 'lineterm',     type: 'bytes',       required: false, default: "b'\\n'", desc: "Appended to the control lines; b'' for lines without newlines." },
  ],

  modes: [
    {
      id: 'unified',
      label: 'unified',
      blurb: 'Your text is encoded as UTF-8 and split at | into bytes lines. Non-ASCII characters appear as \\x escapes in the bytes repr.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
      ],
      template: "import difflib\nold = {$old}.encode().split(b'|')\nnew = {$new}.encode().split(b'|')\nlist(difflib.diff_bytes(difflib.unified_diff, old, new, b'old.txt', b'new.txt', lineterm=b''))",
      cases: [
        { id: 'ascii', label: 'ASCII',     values: { old: 'name = demo|version = 1.0', new: 'name = demo|version = 1.1' } },
        { id: 'utf8',  label: 'non-ASCII', values: { old: 'Zürich|Genf', new: 'Zürich|Genève' } },
      ],
    },
    {
      id: 'mixed',
      label: 'mixed encodings',
      blurb: 'The old text is encoded as Latin-1, the new one as UTF-8 — the same word becomes different bytes.',
      params: [
        { name: 'old', type: 'str', hint: 'Latin-1 text, | = newline', input: 'text' },
        { name: 'new', type: 'str', hint: 'UTF-8 text, | = newline',   input: 'text' },
      ],
      template: "import difflib\nold = {$old}.encode('latin-1').split(b'|')\nnew = {$new}.encode('utf-8').split(b'|')\nlist(difflib.diff_bytes(difflib.unified_diff, old, new, lineterm=b''))",
      cases: [
        { id: 'cafe', label: 'café',            values: { old: 'café|tea', new: 'café|tea' } },
        { id: 'euro', label: 'not in Latin-1',  values: { old: 'price: 5 €', new: 'price: 5 €' } },
      ],
    },
    {
      id: 'context',
      label: 'context',
      blurb: 'The same with context_diff as dfunc.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
      ],
      template: "import difflib\nold = {$old}.encode().split(b'|')\nnew = {$new}.encode().split(b'|')\nlist(difflib.diff_bytes(difflib.context_diff, old, new, lineterm=b''))",
      cases: [
        { id: 'one', label: 'one change', values: { old: 'a|b|c', new: 'a|B|c' } },
      ],
    },
  ],
  demoExplainer: 'Encoded as UTF-8, ü becomes the two bytes \\xc3\\xbc and è becomes \\xc3\\xa8 — the diff works on those bytes and hands them back unchanged. In "mixed encodings", "café" is b\'caf\\xe9\' in Latin-1 but b\'caf\\xc3\\xa9\' in UTF-8, so the two lines differ although they read the same. The euro sign has no Latin-1 byte, so encoding the old text already fails with UnicodeEncodeError — before diff_bytes is called.',

  patterns: [
    {
      name: 'Diff two files of unknown encoding',
      desc: "Open in binary mode: readlines() then returns bytes lines that keep their b'\\n'.",
      code: "import difflib, sys\nwith open('old.txt', 'rb') as f1, open('new.txt', 'rb') as f2:\n    diff = difflib.diff_bytes(difflib.unified_diff, f1.readlines(), f2.readlines(), b'old.txt', b'new.txt')\n    sys.stdout.buffer.writelines(diff)",
    },
    {
      name: 'Context diff of bytes',
      desc: 'Pass context_diff as dfunc; everything else stays the same.',
      code: "import difflib\ndiff = list(difflib.diff_bytes(difflib.context_diff, a_lines, b_lines, b'a', b'b'))",
    },
  ],

  examples: [
    { title: 'Bytes in, bytes out', code: "import difflib\nlist(difflib.diff_bytes(difflib.unified_diff, [b'a\\n', b'b\\n'], [b'a\\n', b'c\\n'], b'old', b'new'))", returns: "[b'--- old\\n', b'+++ new\\n', b'@@ -1,2 +1,2 @@\\n', b' a\\n', b'-b\\n', b'+c\\n']" },
    { title: 'The same text in two encodings', code: "import difflib\nold = [b'caf\\xe9']        # Latin-1\nnew = [b'caf\\xc3\\xa9']    # UTF-8\nlist(difflib.diff_bytes(difflib.unified_diff, old, new, lineterm=b''))", returns: "[b'--- ', b'+++ ', b'@@ -1 +1 @@', b'-caf\\xe9', b'+caf\\xc3\\xa9']" },
    { title: 'With context_diff', code: "import difflib\nlist(difflib.diff_bytes(difflib.context_diff, [b'a\\n', b'b\\n'], [b'a\\n', b'c\\n']))", returns: "[b'*** \\n', b'--- \\n', b'***************\\n', b'*** 1,2 ****\\n', b'  a\\n', b'! b\\n', b'--- 1,2 ----\\n', b'  a\\n', b'! c\\n']" },
    { title: 'Every argument but n must be bytes', code: "import difflib\nlist(difflib.diff_bytes(difflib.unified_diff, [b'a'], [b'b'], 'old.txt'))", returns: "TypeError: all arguments must be bytes, not str ('old.txt')" },
    { title: 'unified_diff itself rejects bytes', code: "import difflib\nlist(difflib.unified_diff([b'a'], [b'b']))", returns: "TypeError: lines to compare must be str, not bytes (b'a')" },
  ],

  pitfalls: [
    {
      name: 'Decoding with a guessed encoding first',
      desc: 'Decoding Latin-1 bytes as UTF-8 fails (or, with errors="replace", silently changes the text). diff_bytes never decodes for real, so every byte survives.',
      wrong: { label: 'decode()',   code: "import difflib\nold = [b'caf\\xe9']\nnew = [b'caf\\xc3\\xa9']\nlist(difflib.unified_diff([l.decode() for l in old], [l.decode() for l in new], lineterm=''))", output: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 3: unexpected end of data" },
      fix:   { label: 'diff_bytes', code: "import difflib\nold = [b'caf\\xe9']\nnew = [b'caf\\xc3\\xa9']\nlist(difflib.diff_bytes(difflib.unified_diff, old, new, lineterm=b''))[-2:]", output: "[b'-caf\\xe9', b'+caf\\xc3\\xa9']" },
    },
    {
      name: 'Passing ndiff as dfunc',
      desc: 'diff_bytes calls dfunc with eight positional arguments (a, b, the four header values, n, lineterm). Only functions with the unified_diff / context_diff signature work.',
      wrong: { label: 'ndiff',        code: "import difflib\nlist(difflib.diff_bytes(difflib.ndiff, [b'a'], [b'b']))", output: 'TypeError: ndiff() takes from 2 to 4 positional arguments but 8 were given' },
      fix:   { label: 'unified_diff', code: "import difflib\nlist(difflib.diff_bytes(difflib.unified_diff, [b'a'], [b'b'], lineterm=b''))", output: "[b'--- ', b'+++ ', b'@@ -1 +1 @@', b'-a', b'+b']" },
    },
  ],

  when: {
    use: [
      'Files whose encoding you do not know, or that mix encodings',
      'Byte-exact patches: the output can be written back with a binary file or sys.stdout.buffer',
    ],
    avoid: [
      'Text you can decode reliably → decode it and use unified_diff / context_diff on str',
      'Binary formats without lines (images, archives) — a line diff is meaningless there',
    ],
  },

  notes: {
    cpython:     "Lib/difflib.py: every bytes argument goes through s.decode('ascii', 'surrogateescape') — bytes 0x80-0xFF become lone surrogates U+DC80-U+DCFF — and each output line through line.encode('ascii', 'surrogateescape'), the exact inverse",
    'Errors':    "A str argument raises TypeError: all arguments must be bytes, not str (...); unified_diff given bytes raises TypeError: lines to compare must be str, not bytes (...)",
    'Added':     'Python 3.5 — it restored the ability to diff bytes that Python 2 had',
  },

  related: [
    { name: 'difflib.unified_diff', slug: 'unified_diff', when: 'The usual dfunc' },
    { name: 'difflib.context_diff', slug: 'context_diff', when: 'The other dfunc' },
    { name: 'bytes',                slug: 'bytes',        when: 'The type of every argument here', category: 'functions' },
    { name: 'str.encode()',         slug: 'str-encode',   when: 'How the demo turns text into bytes', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I diff files with an unknown encoding in Python?',
      a: "Read them in binary mode ('rb'), so readlines() returns bytes, and call difflib.diff_bytes(difflib.unified_diff, a_lines, b_lines, b'a.txt', b'b.txt'). The result is bytes lines; write them with sys.stdout.buffer.writelines() or to a file opened in 'wb' mode.",
    },
    {
      q: 'Why does unified_diff raise "lines to compare must be str, not bytes"?',
      a: 'unified_diff and context_diff check that their inputs are str, so that bytes are not silently formatted as b\'...\' in the output. For bytes lines wrap the call: diff_bytes(unified_diff, a, b, ...), and pass the file names and lineterm as bytes too.',
    },
    {
      q: 'Can I use diff_bytes with ndiff?',
      a: "No — diff_bytes calls dfunc with eight positional arguments, which ndiff does not accept (TypeError). Do the same trick by hand: decode every line with line.decode('ascii', 'surrogateescape'), run ndiff on the result, and encode each output line back with .encode('ascii', 'surrogateescape').",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.diff_bytes',
    meta:  'difflib.diff_bytes',
  },
};
