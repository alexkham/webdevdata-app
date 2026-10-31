// content/reference/python/stdlib/io/stringio.js — io.StringIO

export const meta = {
  slug:        'stringio',
  name:        'io.StringIO',
  signature:   "io.StringIO(initial_value='', newline='\\n')",
  blurb:       'An in-memory text file: a str buffer with the full file interface — read, readline, write, seek, tell, getvalue — and optional newline translation.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'stringio io.StringIO python string as file in-memory text file file-like object StringIO.newlines StringIO.line_buffering newline translation universal newlines initial_value overwrite seek end string buffer',
};

export const method = {
  slug:      'stringio',
  name:      'io.StringIO',
  signature: "io.StringIO(initial_value='', newline='\\n')",
  returns:   { type: 'StringIO', desc: 'A text stream positioned at 0, holding initial_value (after newline translation).' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'StringIO behaves like a text file opened in w+ mode: it starts at position 0, so a write() overwrites the initial value instead of appending. Positions count characters. With newline=None or a carriage-return newline, line endings are translated as they go in.',

  covers: ['StringIO', 'StringIO.line_buffering', 'StringIO.newlines'],

  cheat: {
    commonCall: "f = io.StringIO('line 1\\nline 2\\n')",
    returns:    'a text stream at position 0',
    replaces:   'a temporary file when the data is a str you already have',
    watchOut:   'write() starts at position 0 — it overwrites initial_value',
  },

  parameters: [
    { name: 'initial_value', type: 'str | None', required: false, default: "''", desc: 'Starting contents. It is written through the newline translation, then the position goes back to 0.' },
    { name: 'newline',       type: 'str | None', required: false, default: "'\\n'", desc: "None: \\r\\n and \\r become \\n on the way in, lines end at \\n. '': nothing translated, lines end at \\n, \\r or \\r\\n. '\\n' (default): nothing translated, lines end at \\n. '\\r' / '\\r\\n': every \\n written becomes that string, and only it ends a line." },
  ],

  attributes: [
    { name: 'newlines',       type: 'None | str | tuple', meaning: "The kinds of line ending seen so far — only tracked with newline=None or ''; otherwise always None." },
    { name: 'line_buffering', type: 'bool',               meaning: 'Always False for StringIO (there is nothing to flush).' },
    { name: 'closed',         type: 'bool',               meaning: 'True after close(); the buffer is gone then.' },
    { name: 'encoding / errors', type: 'None',            meaning: 'Always None — a StringIO never encodes.' },
  ],

  modes: [
    {
      id: 'overwrite',
      label: 'initial value',
      blurb: 'Create a StringIO with some text, then write to it. The write starts at position 0.',
      params: [
        { name: 'init', type: 'str', hint: 'initial_value', input: 'text' },
        { name: 'text', type: 'str', hint: 'then write',    input: 'text' },
      ],
      template: "import io\nf = io.StringIO({$init})\nf.write({$text})\n(f.getvalue(), f.tell())",
      cases: [
        { id: 'jello',  label: 'hello + J',       values: { init: 'hello', text: 'J' } },
        { id: 'longer', label: 'longer write',    values: { init: 'log: ', text: 'started' } },
        { id: 'empty',  label: 'empty initial',   values: { init: '', text: 'fresh' } },
      ],
    },
    {
      id: 'stored',
      label: 'newline: what is stored',
      blurb: 'The same text given to all five newline settings. Type \\r and \\n for the control characters.',
      params: [{ name: 'text', type: 'str', hint: 'text with \\r and \\n', input: 'text' }],
      template: "import io\ntext = {$text}.replace('\\\\r', '\\r').replace('\\\\n', '\\n')\n{nl: io.StringIO(text, newline=nl).getvalue() for nl in (None, '', '\\n', '\\r', '\\r\\n')}",
      cases: [
        { id: 'mixed', label: 'mixed endings', values: { text: 'a\\r\\nb\\rc\\nd' } },
        { id: 'unix',  label: '\\n only',      values: { text: 'one\\ntwo\\n' } },
        { id: 'crlf',  label: 'Windows text',  values: { text: 'one\\r\\ntwo\\r\\n' } },
      ],
    },
    {
      id: 'lines',
      label: 'newline: lines',
      blurb: 'readlines() under each setting — which characters end a line.',
      params: [{ name: 'text', type: 'str', hint: 'text with \\r and \\n', input: 'text' }],
      template: "import io\ntext = {$text}.replace('\\\\r', '\\r').replace('\\\\n', '\\n')\n{nl: io.StringIO(text, newline=nl).readlines() for nl in (None, '', '\\n', '\\r', '\\r\\n')}",
      cases: [
        { id: 'mixed', label: 'mixed endings', values: { text: 'a\\r\\nb\\rc\\nd' } },
        { id: 'mac',   label: '\\r only',      values: { text: 'one\\rtwo\\r' } },
      ],
    },
    {
      id: 'seen',
      label: 'newlines attribute',
      blurb: 'With newline=None every write() is translated on its own, and .newlines collects the kinds of line ending it met.',
      params: [{ name: 'parts', type: 'list[str]', hint: 'pieces to write, comma-separated', input: 'csv' }],
      template: "import io\nf = io.StringIO(newline=None)\nfor part in {$parts}:\n    f.write(part.replace('\\\\r', '\\r').replace('\\\\n', '\\n'))\n(f.newlines, f.getvalue())",
      cases: [
        { id: 'all',   label: 'all three kinds', values: { parts: 'a\\r\\n, b\\n, c\\r' } },
        { id: 'split', label: '\\r\\n split in two', values: { parts: 'a\\r, \\nb' } },
        { id: 'none',  label: 'no line breaks', values: { parts: 'abc, def' } },
      ],
    },
  ],
  demoExplainer: "'hello' + 'J' gives 'Jello' with the position at 1: the write replaced the first character only. The newline tabs show the two directions: newline=None turns \\r\\n and \\r into \\n as text goes in; '\\r' and '\\r\\n' turn every \\n written into that string, so the \\n of an existing \\r\\n is translated too ('a\\r\\r\\nb' under '\\r\\n'). With '\\n' a bare \\r is just a character in the middle of a line. In the newlines tab a \\r\\n written in two pieces is not recognised as one: 'a\\r' then '\\nb' stores 'a\\n\\nb' and reports ('\\r', '\\n').",

  patterns: [
    {
      name: 'Open for appending',
      desc: 'The docs suggest seeking to the end to get a+ behaviour.',
      code: "import io\nf = io.StringIO(existing_text)\nf.seek(0, io.SEEK_END)\nf.write('more\\n')",
    },
    {
      name: 'Normalise line endings',
      desc: 'newline=None reads \\r\\n and \\r as \\n.',
      code: 'import io\nclean = io.StringIO(raw_text, newline=None).getvalue()',
    },
    {
      name: 'Build text with CRLF line endings',
      desc: "newline='\\r\\n' translates every \\n you write.",
      code: "import io\nout = io.StringIO(newline='\\r\\n')\nfor row in rows:\n    out.write(','.join(row) + '\\n')\npayload = out.getvalue()",
    },
  ],

  examples: [
    { title: 'Starts at position 0',          code: "import io\nf = io.StringIO('hello')\nf.tell()", returns: '0' },
    { title: 'A write overwrites',            code: "import io\nf = io.StringIO('hello')\nf.write('J')\nf.getvalue()", returns: "'Jello'" },
    { title: 'Seek to the end to append',     code: "import io\nf = io.StringIO('hello')\nf.seek(0, io.SEEK_END)\nf.write('!')\nf.getvalue()", returns: "'hello!'" },
    { title: 'Universal newlines going in',   code: "import io\nio.StringIO('a\\r\\nb\\rc', newline=None).getvalue()", returns: "'a\\nb\\nc'" },
    { title: 'newlines lists what was seen',  code: "import io\nio.StringIO('a\\r\\nb\\n', newline=None).newlines", returns: "('\\n', '\\r\\n')" },
    { title: 'Iterating yields lines',        code: "import io\nlist(io.StringIO('x\\ny\\n'))", returns: "['x\\n', 'y\\n']" },
    { title: 'line_buffering is always False', code: 'import io\nio.StringIO().line_buffering', returns: 'False' },
    { title: 'Only str goes in',              code: "import io\nio.StringIO(b'data')", returns: 'TypeError: initial_value must be str or None, not bytes' },
  ],

  pitfalls: [
    {
      name: 'Writing after an initial value',
      desc: 'The initial value does not move the position to the end. A longer write simply replaces it.',
      wrong: { label: 'write at 0',     code: "import io\nf = io.StringIO('log: ')\nf.write('started')\nf.getvalue()", output: "'started'" },
      fix:   { label: 'seek to the end', code: "import io\nf = io.StringIO('log: ')\nf.seek(0, io.SEEK_END)\nf.write('started')\nf.getvalue()", output: "'log: started'" },
    },
    {
      name: 'Expecting newline=None to write \\r\\n on Windows',
      desc: 'open() with newline=None writes os.linesep, but StringIO writes \\n on every platform. Ask for \\r\\n explicitly.',
      wrong: { label: 'newline=None',   code: "import io\nf = io.StringIO(newline=None)\nf.write('a\\nb')\nf.getvalue()", output: "'a\\nb'" },
      fix:   { label: "newline='\\r\\n'", code: "import io\nf = io.StringIO(newline='\\r\\n')\nf.write('a\\nb')\nf.getvalue()", output: "'a\\r\\nb'" },
    },
    {
      name: 'Counting the returned length as stored length',
      desc: 'write() returns the length of the str you passed, before translation.',
      wrong: { label: 'return value', code: "import io\nf = io.StringIO(newline='\\r\\n')\nf.write('a\\nb')", output: '3' },
      fix:   { label: 'tell()',       code: "import io\nf = io.StringIO(newline='\\r\\n')\nf.write('a\\nb')\nf.tell()", output: '4' },
    },
  ],

  when: {
    use: [
      'Passing a str to code that reads from a file object',
      'Collecting text written by code that writes to a file object',
      'Unit tests for parsers and writers without touching the disk',
    ],
    avoid: [
      'Binary data → io.BytesIO',
      'Simple concatenation → a list of parts and str.join',
      'Data that may not fit in memory → tempfile.SpooledTemporaryFile',
    ],
  },

  notes: {
    cpython:          'Modules/_io/stringio.c: the text lives in an array of code points, so seek() and tell() positions are character indexes (not bytes, not the opaque cookies of TextIOWrapper.tell())',
    'Closed message': 'StringIO says "I/O operation on closed file" with no final period; BytesIO and the inherited IOBase methods (readlines, writelines, isatty, iteration) add one',
    'Newline rule':   'Same as TextIOWrapper, except that newline=None writes \\n rather than os.linesep (per the docs)',
  },

  related: [
    { name: 'BytesIO',                 slug: 'bytesio',                  when: 'The same thing for bytes' },
    { name: 'read / readline / readlines', slug: 'read-readline-readlines', when: 'Reading from the buffer' },
    { name: 'getvalue / getbuffer',    slug: 'getvalue-getbuffer',       when: 'The whole contents at once' },
    { name: 'seek / tell / truncate',  slug: 'seek-tell-truncate',       when: 'Moving the position' },
    { name: 'TextIOWrapper',           slug: 'textiowrapper',            when: 'Text over real bytes, with an encoding' },
    { name: 'open()',                  slug: 'open',                     when: 'The same interface on a real file', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I turn a string into a file object in Python?',
      a: "io.StringIO(text) — it supports read(), readline(), iteration, seek() and everything else a text file does. For code that wants a binary file, use io.BytesIO(text.encode('utf-8')).",
    },
    {
      q: 'Why does StringIO overwrite my initial text?',
      a: 'The stream starts at position 0, like a file opened in w+ mode, and write() writes at the current position. Call f.seek(0, io.SEEK_END) first to append.',
    },
    {
      q: 'Does StringIO convert \\r\\n to \\n?',
      a: "Not by default: newline defaults to '\\n', which stores text unchanged. Pass newline=None to translate \\r\\n and \\r to \\n as text is written, or newline='' to keep everything but let readline() split on all three endings.",
    },
    {
      q: 'What is in StringIO.newlines?',
      a: "None until a line ending has been written with newline=None or newline=''; then '\\n', '\\r' or '\\r\\n', or a tuple of the kinds seen. With the other newline settings it stays None.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.StringIO',
    meta:  'io.StringIO',
  },

};
