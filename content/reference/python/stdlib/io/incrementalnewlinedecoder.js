// content/reference/python/stdlib/io/incrementalnewlinedecoder.js

export const meta = {
  slug:        'incrementalnewlinedecoder',
  name:        'io.IncrementalNewlineDecoder',
  signature:   "io.IncrementalNewlineDecoder(decoder, translate, errors='strict')",
  blurb:       'The universal-newlines helper behind text files and StringIO: decodes chunk by chunk, holds back a trailing \\r so a \\r\\n split across chunks is not broken, optionally translates endings to \\n, and records which endings it saw.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'incrementalnewlinedecoder io.IncrementalNewlineDecoder python universal newlines decoder translate crlf chunks streaming decode newlines attribute pending carriage return getstate setstate reset codecs incremental decoder',
};

export const method = {
  slug:      'incrementalnewlinedecoder',
  name:      'io.IncrementalNewlineDecoder',
  signature: "io.IncrementalNewlineDecoder(decoder, translate, errors='strict')",
  returns:   { type: 'IncrementalNewlineDecoder', desc: 'A codecs.IncrementalDecoder-style object with decode(input, final=False).' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Feed it pieces of text (or bytes, if you give it a real decoder) and it returns text ready for line splitting. A \\r at the end of a piece is kept back until the next piece shows whether a \\n follows; final=True releases it. TextIOWrapper and StringIO use it for newline=None and newline=\'\'.',

  covers: ['IncrementalNewlineDecoder'],

  cheat: {
    commonCall: 'd = io.IncrementalNewlineDecoder(None, translate=True)',
    returns:    'd.decode(chunk) → text with \\r\\n and \\r turned into \\n',
    replaces:   'hand-written \\r\\n handling across chunk boundaries',
    watchOut:   'call decode(\'\', final=True) at the end or a last \\r is lost',
  },

  parameters: [
    { name: 'decoder',   type: 'IncrementalDecoder | None', required: true,  default: null,      desc: 'None: input is already str. Otherwise a codecs incremental decoder (e.g. for UTF-8) whose decode() output is processed.' },
    { name: 'translate', type: 'bool',                       required: true,  default: null,      desc: 'True: \\r\\n and \\r become \\n. False: text is unchanged, only newlines is updated.' },
    { name: 'errors',    type: 'str',                        required: false, default: "'strict'", desc: 'Stored for the codecs interface.' },
  ],

  attributes: [
    { name: 'decode(input, final=False)', type: 'method', meaning: 'Process one piece; final=True flushes a pending \\r.' },
    { name: 'newlines',   type: 'None | str | tuple', meaning: "Endings seen so far: '\\r', '\\n', '\\r\\n', or a tuple of them." },
    { name: 'getstate() / setstate(state)', type: 'methods', meaning: 'State as (bytes, flag); the lowest flag bit means "a \\r is pending".' },
    { name: 'reset()',    type: 'method', meaning: 'Forget the pending \\r and the endings seen.' },
  ],

  modes: [
    {
      id: 'translate',
      label: 'translate=True',
      blurb: 'Decode each chunk, then a final empty chunk. Type \\r and \\n for the control characters.',
      params: [{ name: 'chunks', type: 'list[str]', hint: 'chunks, comma-separated', input: 'csv' }],
      template: "import io\nd = io.IncrementalNewlineDecoder(None, translate=True)\nchunks = [c.replace('\\\\r', '\\r').replace('\\\\n', '\\n') for c in {$chunks}]\nout = [d.decode(c) for c in chunks] + [d.decode('', final=True)]\n(out, d.newlines)",
      cases: [
        { id: 'split', label: '\\r\\n split in two', values: { chunks: 'one\\r, \\ntwo' } },
        { id: 'end',   label: '\\r at the very end', values: { chunks: 'a\\rb\\r' } },
        { id: 'mixed', label: 'all endings',         values: { chunks: 'a\\r\\nb, c\\rd\\n' } },
      ],
    },
    {
      id: 'keep',
      label: 'translate=False',
      blurb: 'The same, without translation: the text comes back unchanged, but the pending \\r is still held back.',
      params: [{ name: 'chunks', type: 'list[str]', hint: 'chunks, comma-separated', input: 'csv' }],
      template: "import io\nd = io.IncrementalNewlineDecoder(None, translate=False)\nchunks = [c.replace('\\\\r', '\\r').replace('\\\\n', '\\n') for c in {$chunks}]\nout = [d.decode(c) for c in chunks] + [d.decode('', final=True)]\n(out, d.newlines)",
      cases: [
        { id: 'split', label: '\\r\\n split in two', values: { chunks: 'one\\r, \\ntwo' } },
        { id: 'plain', label: 'no endings',          values: { chunks: 'abc, def' } },
      ],
    },
  ],
  demoExplainer: "With 'one\\r' then '\\ntwo' the first call returns just 'one': the \\r waits. The second call gets '\\r\\ntwo', sees one \\r\\n and returns '\\ntwo' (translated) or '\\r\\ntwo' (not translated), and newlines is '\\r\\n' — not a \\r plus a \\n. Without final=True a \\r at the very end would never come out; the last decode('', final=True) returns it (as '\\n' when translating).",

  patterns: [
    {
      name: 'Normalise line endings in a stream of chunks',
      desc: 'For text arriving in pieces (sockets, generators).',
      code: "import io\nd = io.IncrementalNewlineDecoder(None, translate=True)\nfor chunk in chunks:\n    emit(d.decode(chunk))\nemit(d.decode('', final=True))",
    },
    {
      name: 'Decode bytes and newlines together',
      desc: 'Wrap a codecs incremental decoder; split multi-byte characters are handled too.',
      code: "import codecs, io\nd = io.IncrementalNewlineDecoder(codecs.getincrementaldecoder('utf-8')(), translate=True)\ntext = ''.join(d.decode(block) for block in blocks) + d.decode(b'', final=True)",
    },
  ],

  examples: [
    { title: 'Translate \\r\\n and \\r',       code: "import io\nd = io.IncrementalNewlineDecoder(None, translate=True)\nd.decode('a\\r\\nb\\rc')", returns: "'a\\nb\\nc'" },
    { title: 'A trailing \\r waits',            code: "import io\nd = io.IncrementalNewlineDecoder(None, translate=True)\n(d.decode('a\\r'), d.decode('\\nb'))", returns: "('a', '\\nb')" },
    { title: 'final=True releases it',          code: "import io\nd = io.IncrementalNewlineDecoder(None, translate=True)\n(d.decode('a\\r'), d.decode('', final=True))", returns: "('a', '\\n')" },
    { title: 'newlines without translating',    code: "import io\nd = io.IncrementalNewlineDecoder(None, translate=False)\nd.decode('x\\r\\ny\\n')\nd.newlines", returns: "('\\n', '\\r\\n')" },
    { title: 'The pending \\r is in the state', code: "import io\nd = io.IncrementalNewlineDecoder(None, translate=True)\nd.decode('a\\r')\nd.getstate()", returns: "(b'', 1)" },
    { title: 'With a UTF-8 decoder',            code: "import codecs, io\nd = io.IncrementalNewlineDecoder(codecs.getincrementaldecoder('utf-8')(), translate=True)\nd.decode(b'caf\\xc3') + d.decode(b'\\xa9\\r\\n', final=True)", returns: "'café\\n'" },
    { title: 'Without a decoder, str only',     code: "import io\nio.IncrementalNewlineDecoder(None, translate=True).decode(b'x')", returns: "TypeError: decoder should return a string result, not 'bytes'" },
  ],

  pitfalls: [
    {
      name: 'Forgetting the final call',
      desc: 'A \\r at the end of the last chunk stays pending until decode(..., final=True).',
      wrong: { label: 'no final', code: "import io\nd = io.IncrementalNewlineDecoder(None, translate=True)\n''.join(d.decode(c) for c in ['a\\r', 'b\\r'])", output: "'a\\nb'" },
      fix:   { label: 'final=True', code: "import io\nd = io.IncrementalNewlineDecoder(None, translate=True)\n''.join(d.decode(c) for c in ['a\\r', 'b\\r']) + d.decode('', final=True)", output: "'a\\nb\\n'" },
    },
  ],

  when: {
    use: [
      'Universal newlines for text that arrives in chunks',
      'Building a custom text reader on top of a codecs incremental decoder',
    ],
    avoid: [
      'Whole strings → str.splitlines() or StringIO(text, newline=None)',
      'Files and binary streams → TextIOWrapper, which already uses it',
    ],
  },

  notes: {
    cpython:       'Modules/_io/textio.c. StringIO calls it with final=True on every write, which is why a \\r\\n written in two pieces to StringIO(newline=None) becomes two line breaks',
    'Bases':       'The docs say it inherits from codecs.IncrementalDecoder; in C it is a separate class with the same interface',
    'Endings':     'newlines reports in the order \\r, \\n, \\r\\n regardless of the order they were seen',
  },

  related: [
    { name: 'TextIOWrapper', slug: 'textiowrapper', when: 'Uses it for reading' },
    { name: 'StringIO',      slug: 'stringio',      when: 'Uses it for newline=None and \'\'' },
    { name: 'str.splitlines', slug: 'str-splitlines', when: 'Line splitting for a whole string', category: 'functions' },
    { name: 'bytes.decode',  slug: 'bytes-decode',  when: 'Decoding all at once', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I handle \\r\\n split across chunks when reading a stream?',
      a: "Use io.IncrementalNewlineDecoder(None, translate=True) and call decode() on each chunk: it holds back a trailing \\r until it knows whether a \\n follows. Finish with decode('', final=True).",
    },
    {
      q: 'What are universal newlines?',
      a: 'Treating \\n, \\r and \\r\\n all as line endings. With newline=None (the default for files) they are also translated to \\n when reading; with newline=\'\' lines are split on all three but returned unchanged.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.IncrementalNewlineDecoder',
    meta:  'io.IncrementalNewlineDecoder',
  },

};
