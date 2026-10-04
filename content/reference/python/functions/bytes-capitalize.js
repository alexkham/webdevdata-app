// content/reference/python/functions/bytes-capitalize.js

export const meta = {
  slug:        'bytes-capitalize',
  name:        'bytes.capitalize',
  signature:   'bytes.capitalize()',
  blurb:       'First byte uppercased, everything else lowercased — ASCII only.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes capitalize capitalise first letter sentence case ascii binary bytearray bytearray.capitalize',
};

export const method = {
  slug:      'bytes-capitalize',
  name:      'bytes.capitalize',
  signature: 'bytes.capitalize()',
  returns:   { type: 'bytes', desc: 'A new bytes object with the first byte uppercased if it is an ASCII letter and every other ASCII letter lowercased.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Sentence case for ASCII. The part people miss is the second half — it does not just uppercase the first byte, it lowercases all the rest.',

  cheat: {
    commonCall: 'data.capitalize()',
    returns:    'a new bytes object; the original is unchanged',
    replaces:   'data[:1].upper() + data[1:].lower()',
    watchOut:   'it LOWERCASES the rest — HELLO WORLD becomes Hello world',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').capitalize()",
  cases: [
    { id: 'lower',   label: 'lowercase',          values: { s: 'hello world' } },
    { id: 'shout',   label: 'uppercase (!)',      values: { s: 'HELLO WORLD' } },
    { id: 'mixed',   label: 'mixed',              values: { s: 'hELLO wORLD' } },
    { id: 'digit',   label: 'starts with digit',  values: { s: '1abc' } },
    { id: 'empty',   label: 'empty',              values: { s: '' } },
  ],
  demoExplainer: 'Watch the uppercase case: HELLO WORLD becomes Hello world, not HELLO WORLD with a capital H. capitalize uppercases the first byte and LOWERCASES every other letter — it is sentence case, not "make the first letter a capital". When the first byte is not a letter it is left alone and the rest are still lowercased.',

  patterns: [
    {
      name: 'Sentence-case an ASCII label',
      desc: 'One call instead of slicing and two case conversions.',
      code: 'label = raw_label.capitalize()',
    },
    {
      name: 'Normalise inconsistent input',
      desc: 'Shouted or mixed input all lands on the same form.',
      code: "assert b'hELLO'.capitalize() == b'HELLO'.capitalize()",
    },
    {
      name: 'Capitalise real text',
      desc: 'Decode first so non-ASCII letters take part.',
      code: "data.decode('utf-8').capitalize().encode('utf-8')",
    },
  ],

  examples: [
    { title: 'Lowercase',   code: "b'hello world'.capitalize()", returns: "b'Hello world'" },
    { title: 'Uppercase',   code: "b'HELLO WORLD'.capitalize()", returns: "b'Hello world'" },
    { title: 'Mixed',       code: "b'hELLO'.capitalize()",       returns: "b'Hello'" },
    { title: 'Digit first', code: "b'1abc'.capitalize()",        returns: "b'1abc'" },
    { title: 'Only first word', code: "b'hello world'.capitalize()", returns: "b'Hello world'  # not Hello World" },
    { title: 'Empty',       code: "b''.capitalize()",            returns: "b''" },
  ],

  pitfalls: [
    {
      name: 'It lowercases everything after the first byte',
      desc: 'The half people forget. Acronyms, proper nouns and anything else uppercase in the rest of the data get flattened.',
      wrong: { label: 'Acronym flattened', code: "b'hello NASA'.capitalize()", output: "b'Hello nasa'" },
      fix:   { label: 'Just the first',    code: "b'hello NASA'[:1].upper() + b'hello NASA'[1:]", output: "b'Hello NASA'" },
    },
    {
      name: 'Only the first WORD is capitalised',
      desc: 'capitalize is sentence case; title is word case. Expecting every word capitalised is the other common misread.',
      wrong: { label: 'One capital', code: "b'hello world'.capitalize()", output: "b'Hello world'" },
      fix:   { label: 'Use title',   code: "b'hello world'.title()", output: "b'Hello World'" },
    },
    {
      name: 'Non-ASCII letters are not touched',
      desc: 'A leading accented letter stays as it is, and accented letters later in the data are not lowercased either.',
      wrong: { label: 'Accent ignored', code: "'élan'.encode().capitalize()", output: "b'\\xc3\\xa9lan'" },
      fix:   { label: 'Work on text',   code: "'élan'.capitalize().encode()", output: "b'\\xc3\\x89lan'" },
    },
  ],

  when: {
    use: [
      'Sentence-casing ASCII labels and messages',
      'Normalising inconsistently cased ASCII input',
    ],
    avoid: [
      'Data with acronyms or proper nouns that must keep their case',
      'Capitalising every word → title',
      'Real text with non-ASCII letters → decode first',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass over the bytes',
    return:     'A new bytes object of the same length',
    cpython:    'Objects/bytesobject.c :: stringlib_capitalize',
    memory:     'Allocates a buffer the same size as the input',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.title', slug: 'bytes-title', when: 'Capitalise every word rather than just the first' },
    { name: 'bytes.upper', slug: 'bytes-upper', when: 'Uppercase everything' },
    { name: 'bytes.lower', slug: 'bytes-lower', when: 'Lowercase everything' },
    { name: 'capitalize',  slug: 'capitalize',  when: 'The str version, which handles all of Unicode' },
  ],

  faq: [
    {
      q: 'Why did my acronym get lowercased?',
      a: 'Because capitalize is sentence case: it uppercases the first byte and lowercases every other letter. To uppercase only the first byte and leave the rest alone, slice and use upper on the first byte.',
      code: "data[:1].upper() + data[1:]",
    },
    {
      q: 'capitalize or title?',
      a: 'capitalize gives one capital at the start of the whole buffer. title gives a capital at the start of every word. Sentence case versus headline case.',
      code: "b'a b'.capitalize()   # b'A b'\nb'a b'.title()        # b'A B'",
    },
    {
      q: 'Does bytearray have capitalize?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.capitalize arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.capitalize',
    meta:  'bytes.capitalize',
  },

};
