// content/reference/python/stdlib/base64/encode-decode.js
// encode / decode (file objects)

export const meta = {
  slug:        'encode-decode',
  name:        'base64.encode / decode',
  signature:   'base64.encode(input, output)',
  blurb:       'Stream Base64 between binary file objects: encode writes 76-character lines, decode reads a line at a time.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'encode decode base64.encode base64.decode base64 encode file python decode base64 file binary file objects rb wb io.BytesIO stream large file python -m base64',
};

export const method = {
  slug:      'encode-decode',
  name:      'base64.encode / decode',
  signature: 'base64.encode(input, output)',
  returns:   { type: 'None', desc: 'Both write to output and return None.' },

  category:    'base64 function',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'The file-to-file interface behind python -m base64. Both arguments are binary file objects (open(..., "rb") / "wb", or io.BytesIO); nothing is returned.',

  covers: ['encode', 'decode'],

  cheat: {
    commonCall: "base64.encode(open('in.bin', 'rb'), open('out.b64', 'wb'))",
    returns:    'None — the result is in the output file',
    replaces:   'Reading a whole file into memory just to Base64 it',
    watchOut:   'Text-mode files fail; decode checks padding line by line',
  },

  parameters: [
    { name: 'input',  type: 'binary file', required: true, default: null, desc: 'Readable binary file object: encode calls read(57) on it, decode calls readline().' },
    { name: 'output', type: 'binary file', required: true, default: null, desc: 'Writable binary file object; receives bytes.' },
  ],

  modes: [
    {
      id: 'encode',
      label: 'encode',
      blurb: 'Encode text (as UTF-8) from one BytesIO into another and read the output buffer.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import base64, io\nout = io.BytesIO()\nbase64.encode(io.BytesIO({$text}.encode()), out)\nout.getvalue()',
      cases: [
        { id: 'hello', label: 'hello world', values: { text: 'hello world' } },
        { id: 'empty', label: 'empty',       values: { text: '' } },
        { id: 'long',  label: 'long line',   values: { text: 'The quick brown fox jumps over the lazy dog, twice: the quick brown fox.' } },
      ],
    },
    {
      id: 'decode',
      label: 'decode lines',
      blurb: 'Decode Base64 lines (comma-separated here, joined with newlines). Each line is decoded on its own.',
      params: [{ name: 'lines', type: 'list[str]', hint: 'Base64 lines, comma-separated', input: 'csv' }],
      template: "import base64, binascii, io\nsrc = io.BytesIO('\\n'.join({$lines}).encode())\nout = io.BytesIO()\ntry:\n    base64.decode(src, out)\n    result = out.getvalue()\nexcept binascii.Error as e:\n    result = (f'binascii.Error: {e}', out.getvalue())\nresult",
      cases: [
        { id: 'ok',    label: 'whole groups',   values: { lines: 'aGVs, bG8=' } },
        { id: 'split', label: 'group split',    values: { lines: 'aGVsbG, 8=' } },
        { id: 'late',  label: 'error on line 2', values: { lines: 'aGVsbG8=, aG' } },
      ],
    },
  ],
  demoExplainer: 'encode reads 57 bytes at a time and writes each chunk as one 76-character line plus a newline, so even short input ends in b"\\n" and empty input writes nothing. decode runs a2b_base64 on every line separately: a 4-character group split across two lines is "Incorrect padding", and when line 2 fails, line 1 has already been written to the output.',

  patterns: [
    {
      name: 'Encode a file',
      desc: 'Both files in binary mode; memory use stays small even for huge files.',
      code: "import base64\nwith open('photo.jpg', 'rb') as src, open('photo.b64', 'wb') as dst:\n    base64.encode(src, dst)",
    },
    {
      name: 'Decode a file',
      desc: 'The input must be line-based Base64 (as produced by encode or encodebytes).',
      code: "import base64\nwith open('photo.b64', 'rb') as src, open('photo.jpg', 'wb') as dst:\n    base64.decode(src, dst)",
    },
    {
      name: 'From the shell',
      desc: 'The module script calls these two functions.',
      code: '# shell:\n# python -m base64 photo.jpg > photo.b64\n# python -m base64 -d photo.b64 > photo.jpg',
    },
  ],

  examples: [
    { title: 'Encode into a buffer', code: "import base64, io\nout = io.BytesIO()\nbase64.encode(io.BytesIO(b'hi'), out)\nout.getvalue()",              returns: "b'aGk=\\n'" },
    { title: 'Decode from a buffer', code: "import base64, io\nout = io.BytesIO()\nbase64.decode(io.BytesIO(b'aGVs\\nbG8=\\n'), out)\nout.getvalue()", returns: "b'hello'" },
    { title: 'Returns None',         code: "import base64, io\nbase64.encode(io.BytesIO(b'hi'), io.BytesIO()) is None",                                   returns: 'True' },
    { title: 'Needs file objects',   code: "import base64, io\nbase64.encode(b'hi', io.BytesIO())",                                                       returns: "AttributeError: 'bytes' object has no attribute 'read'" },
    { title: 'A real file',          code: "import base64\nwith open('data.bin', 'wb') as f:\n    f.write(bytes(range(5)))\nwith open('data.bin', 'rb') as src, open('data.b64', 'wb') as dst:\n    base64.encode(src, dst)\nopen('data.b64', 'rb').read()", returns: "b'AAECAwQ=\\n'" },
  ],

  pitfalls: [
    {
      name: 'Opening files in text mode',
      desc: 'encode needs bytes from read(); a text-mode file gives str.',
      wrong: { label: "open('rb') missing", code: "import base64, io\nbase64.encode(io.StringIO('hi'), io.BytesIO())", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'binary input',       code: "import base64, io\nout = io.BytesIO()\nbase64.encode(io.BytesIO('hi'.encode()), out)\nout.getvalue()", output: "b'aGk=\\n'" },
    },
    {
      name: 'Hard-wrapped Base64 that splits groups',
      desc: 'decode decodes line by line, so each line must hold whole 4-character groups. b64decode on the full text skips the newlines instead.',
      wrong: { label: 'base64.decode',  code: "import base64, io\nbase64.decode(io.BytesIO(b'aGVsbG\\n8='), io.BytesIO())", output: 'binascii.Error: Incorrect padding' },
      fix:   { label: 'b64decode(all)', code: "import base64\nbase64.b64decode(b'aGVsbG\\n8=')",                          output: "b'hello'" },
    },
  ],

  when: {
    use: [
      'Large files: both functions stream in small chunks',
      'Producing or consuming the format of python -m base64 and MIME bodies',
    ],
    avoid: [
      'Data already in memory → b64encode / encodebytes',
      'Base64 text wrapped at arbitrary positions → b64decode on the whole text',
    ],
  },

  notes: {
    cpython:   'encode: read(57) in a loop (topping up short reads), binascii.b2a_base64 per chunk. decode: for every readline(), binascii.a2b_base64(line)',
    'Lines':   'MAXLINESIZE = 76 characters, MAXBINSIZE = 57 bytes per line',
  },

  related: [
    { name: 'encodebytes / decodebytes', slug: 'encodebytes-decodebytes', when: 'The same format on in-memory bytes' },
    { name: 'base64.b64decode',          slug: 'b64decode',               when: 'Decode wrapped text in one go' },
    { name: 'open()',                    slug: 'open',                    when: "Binary file objects: 'rb' and 'wb'", category: 'functions' },
    { name: 'base64 module',             slug: 'base64',                  when: 'All encodings at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I Base64-encode a whole file in Python?',
      a: "For small files: base64.b64encode(open(path, 'rb').read()). For large ones stream it: with open(src, 'rb') as i, open(dst, 'wb') as o: base64.encode(i, o) — the output is in 76-character lines.",
    },
    {
      q: 'Why does base64.encode give TypeError about str?',
      a: "The input file was opened in text mode. Open it with 'rb' (and the output with 'wb'); both functions work only with bytes.",
    },
    {
      q: 'Can base64.decode read Base64 without line breaks?',
      a: 'Yes — a single long line is decoded as one unit. Problems only arise when line breaks fall inside a 4-character group.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.encode',
    meta:  'base64.encode',
  },

};
