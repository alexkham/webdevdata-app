// content/reference/python/stdlib/json/jsondecodeerror.js

export const meta = {
  slug:        'jsondecodeerror',
  name:        'json.JSONDecodeError',
  signature:   'json.JSONDecodeError(msg, doc, pos)',
  blurb:       'Raised when text is not valid JSON. A ValueError subclass that knows the exact line, column and character where parsing stopped.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'jsondecodeerror json decode error json.decoder.jsondecodeerror expecting value line 1 column 1 char 0 expecting property name enclosed in double quotes extra data msg doc pos lineno colno valueerror',
};

export const method = {
  slug:      'jsondecodeerror',
  name:      'json.JSONDecodeError',
  signature: 'json.JSONDecodeError(msg, doc, pos)',

  category:    'json exception',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'What json.loads and json.load raise for text that is not JSON. Catch it as json.JSONDecodeError — tracebacks call it json.decoder.JSONDecodeError, the module where it is defined — and read .lineno and .colno for the position.',

  covers: ['JSONDecodeError'],

  chain: ['BaseException', 'Exception', 'ValueError', 'JSONDecodeError'],

  cheat: {
    raisedBy: 'json.loads(s), json.load(f), JSONDecoder().decode(s) / raw_decode(s)',
    message:  'Expecting value: line 1 column 1 (char 0)',
    quickFix: 'except json.JSONDecodeError as e: report e.msg, e.lineno, e.colno',
    watchOut: 'pos counts characters of the str, not bytes of the file',
  },

  parameters: [
    { name: 'msg', type: 'str', required: true, default: null, desc: 'The bare error message, e.g. "Expecting value". Stored in e.msg.' },
    { name: 'doc', type: 'str', required: true, default: null, desc: 'The whole document being parsed. Stored in e.doc.' },
    { name: 'pos', type: 'int', required: true, default: null, desc: 'Index into doc where parsing failed. lineno and colno are computed from it.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Parse your text without catching anything: the last line of the traceback is what you see.',
      params: [{ name: 'text', type: 'str', hint: 'a JSON document', input: 'text' }],
      template: 'import json\njson.loads({$text})',
      cases: [
        { id: 'comma',   label: 'trailing comma',     values: { text: '[1, 2,]' } },
        { id: 'python',  label: 'Python literal',     values: { text: "{'a': True}" } },
        { id: 'unterm',  label: 'unterminated string', values: { text: '["abc]' } },
        { id: 'valid',   label: 'valid',              values: { text: '{"a": [1, 2]}' } },
      ],
    },
    {
      id: 'attributes',
      label: 'Attributes',
      blurb: 'Catch it and read msg, lineno and colno — plus the eight characters of doc starting at pos, i.e. where the parser stopped.',
      params: [{ name: 'text', type: 'str', hint: 'a JSON document', input: 'text' }],
      template: "import json\ntry:\n    json.loads({$text})\nexcept json.JSONDecodeError as e:\n    result = (e.msg, e.lineno, e.colno, e.doc[e.pos:e.pos + 8])\nelse:\n    result = 'no error'\nresult",
      cases: [
        { id: 'missing', label: 'missing value', values: { text: '{"a": 1, "b": }' } },
        { id: 'extra',   label: 'two documents', values: { text: '[1, 2] [3]' } },
        { id: 'escape',  label: 'bad escape',    values: { text: '"C:\\new\\data"' } },
        { id: 'ok',      label: 'valid',         values: { text: '[]' } },
      ],
    },
    {
      id: 'catch',
      label: 'Handle',
      blurb: 'except ValueError catches it too — it is a subclass.',
      params: [{ name: 'text', type: 'str', hint: 'a JSON document', input: 'text' }],
      template: "import json\ntry:\n    json.loads({$text})\nexcept ValueError as e:\n    caught = (type(e).__name__, isinstance(e, json.JSONDecodeError))\nelse:\n    caught = 'parsed fine'\ncaught",
      cases: [
        { id: 'bad',  label: 'not JSON', values: { text: 'nope' } },
        { id: 'good', label: 'valid',    values: { text: '{"ok": true}' } },
      ],
    },
    {
      id: 'build',
      label: 'Raise',
      blurb: 'Construct one yourself from a two-line doc and a position: lineno and colno are computed from pos.',
      params: [
        { name: 'line1', type: 'str', hint: 'first line of doc',  input: 'text' },
        { name: 'line2', type: 'str', hint: 'second line of doc', input: 'text' },
        { name: 'pos',   type: 'int', hint: 'index into doc',     input: 'number' },
      ],
      template: "import json\ndoc = {$line1} + '\\n' + {$line2}\ne = json.JSONDecodeError('Bad value', doc, {$pos})\n(e.lineno, e.colno, str(e))",
      cases: [
        { id: 'second', label: 'on line 2',     values: { line1: '{"a": 1,', line2: '"b" 2}', pos: '13' } },
        { id: 'start',  label: 'pos 0',         values: { line1: '{"a": 1,', line2: '"b" 2}', pos: '0' } },
        { id: 'nl',     label: 'on the newline', values: { line1: '{"a": 1,', line2: '"b" 2}', pos: '8' } },
        { id: 'neg',    label: 'negative pos',  values: { line1: '{"a": 1,', line2: '"b" 2}', pos: '-1' } },
      ],
    },
  ],
  demoExplainer: 'The traceback names the class by the module that defines it, json.decoder; json.JSONDecodeError is the same class re-exported. In Raise, lineno is 1 plus the number of newlines before pos and colno is pos minus the index of the last newline before it — so pos 8, the newline itself, is still line 1, column 9. The constructor never checks pos: a negative value is used as a slice bound from the end, which gives line 2 with a negative column.',

  attributes: [
    { name: 'msg',    type: 'str', meaning: 'The message without the position, e.g. "Expecting \',\' delimiter".' },
    { name: 'doc',    type: 'str', meaning: 'The complete text that was being parsed (for load: everything read from the file).' },
    { name: 'pos',    type: 'int', meaning: 'Index into doc where parsing failed, counting from 0 — characters, not bytes.' },
    { name: 'lineno', type: 'int', meaning: 'Line of pos, counting from 1.' },
    { name: 'colno',  type: 'int', meaning: 'Column of pos within its line, counting from 1.' },
    { name: 'args',   type: 'tuple', meaning: 'One item: the full message with the position, the same as str(e).' },
  ],

  patterns: [
    {
      name: 'Report the position',
      desc: 'All the information is on the exception — no need to parse the message.',
      code: "import json\ntry:\n    data = json.loads(text)\nexcept json.JSONDecodeError as e:\n    print(f'invalid JSON at line {e.lineno}, column {e.colno}: {e.msg}')",
    },
    {
      name: 'Show the offending line',
      desc: 'Point at the column with a caret, like a compiler would.',
      code: "import json\ntry:\n    json.loads(text)\nexcept json.JSONDecodeError as e:\n    line = e.doc.splitlines()[e.lineno - 1] if e.doc else ''\n    print(line)\n    print(' ' * (e.colno - 1) + '^', e.msg)",
    },
    {
      name: 'Translate to your own error',
      desc: 'Keep the original as __cause__ with raise ... from.',
      code: "import json\n\nclass BadPayload(Exception):\n    pass\n\ndef parse(body):\n    try:\n        return json.loads(body)\n    except json.JSONDecodeError as e:\n        raise BadPayload(f'body is not JSON ({e.msg})') from e",
    },
  ],

  examples: [
    { title: 'Read the attributes',          code: "import json\ntry:\n    json.loads('{\"a\": }')\nexcept json.JSONDecodeError as e:\n    info = (e.msg, e.lineno, e.colno, e.pos)\ninfo", returns: "('Expecting value', 1, 7, 6)" },
    { title: 'Traceback shows json.decoder', code: "import json\njson.loads('[1, 2')", returns: "json.decoder.JSONDecodeError: Expecting ',' delimiter: line 1 column 6 (char 5)" },
    { title: 'Line and column across lines', code: "import json\ntext = '{\\n  \"a\": 1,\\n  \"b\": 2,\\n}'\ntry:\n    json.loads(text)\nexcept json.JSONDecodeError as e:\n    where = (e.lineno, e.colno, e.msg)\nwhere", returns: "(3, 9, 'Illegal trailing comma before end of object')" },
    { title: 'It is a ValueError',           code: 'import json\nissubclass(json.JSONDecodeError, ValueError)', returns: 'True' },
    { title: 'except ValueError catches it', code: "import json\ntry:\n    json.loads('nope')\nexcept ValueError as e:\n    caught = type(e).__name__\ncaught", returns: "'JSONDecodeError'" },
    { title: 'Two names, one class',         code: 'import json\njson.JSONDecodeError is json.decoder.JSONDecodeError', returns: 'True' },
    { title: 'msg, str() and args',          code: "import json\ne = json.JSONDecodeError('Bad value', '[1, x]', 4)\n(e.msg, str(e), e.args)", returns: "('Bad value', 'Bad value: line 1 column 5 (char 4)', ('Bad value: line 1 column 5 (char 4)',))" },
    { title: 'Raise it from your own parser', code: "import json\nraise json.JSONDecodeError('Custom check failed', 'abc\\ndef', 5)", returns: 'json.decoder.JSONDecodeError: Custom check failed: line 2 column 2 (char 5)' },
  ],

  pitfalls: [
    {
      name: 'The bare name is not defined',
      desc: 'import json does not put JSONDecodeError in your namespace. The except clause is only evaluated when an error happens — so the typo surfaces as a NameError at the worst moment.',
      wrong: { label: 'except JSONDecodeError', code: "import json\ntry:\n    json.loads('{\"a\": }')\nexcept JSONDecodeError:\n    result = 'bad'", output: "NameError: name 'JSONDecodeError' is not defined" },
      fix:   { label: 'json.JSONDecodeError',   code: "import json\ntry:\n    json.loads('{\"a\": }')\nexcept json.JSONDecodeError:\n    result = 'bad'\nresult", output: "'bad'" },
    },
    {
      name: 'except ValueError hides unrelated bugs',
      desc: 'Catching the parent class also catches every other ValueError in the block — here a valid document with a bad value is reported as invalid JSON.',
      wrong: { label: 'except ValueError', code: "import json\ndef parse(text):\n    try:\n        return int(json.loads(text)['count'])\n    except ValueError:\n        return 'invalid JSON'\nparse('{\"count\": \"ten\"}')", output: "'invalid JSON'" },
      fix:   { label: 'except json.JSONDecodeError', code: "import json\ndef parse(text):\n    try:\n        return int(json.loads(text)['count'])\n    except json.JSONDecodeError:\n        return 'invalid JSON'\nparse('{\"count\": \"ten\"}')", output: "ValueError: invalid literal for int() with base 10: 'ten'" },
    },
    {
      name: 'Using pos as a byte offset',
      desc: 'pos indexes the decoded str. In the UTF-8 bytes every non-ASCII character before it takes more than one byte, so the same offset lands somewhere else.',
      wrong: { label: 'bytes[pos:]', code: "import json\ndata = '{\"name\": \"Zoë\" \"age\": 3}'\ntry:\n    json.loads(data)\nexcept json.JSONDecodeError as e:\n    near = data.encode('utf-8')[e.pos:e.pos + 6]\nnear", output: `b' "age"'` },
      fix:   { label: 'str[pos:]',   code: "import json\ndata = '{\"name\": \"Zoë\" \"age\": 3}'\ntry:\n    json.loads(data)\nexcept json.JSONDecodeError as e:\n    near = data[e.pos:e.pos + 6]\nnear", output: `'"age":'` },
    },
  ],

  when: {
    use: [
      'Catch it around json.loads / json.load when the input comes from outside',
      'Raise it from your own JSON-like parser so callers can handle both the same way',
      'Use lineno/colno to point users at the broken spot in a config file',
    ],
    avoid: [
      'Catching ValueError when you mean only bad JSON — it hides other errors',
      'Parsing str(e) for the position — use the attributes',
      'Expecting it for wrong input types: json.loads(None) raises TypeError',
    ],
  },

  notes: {
    cpython:      'Lib/json/decoder.py — class JSONDecodeError(ValueError); __init__ computes lineno and colno from doc and pos and passes the formatted message to ValueError',
    'Module path': 'Defined in json.decoder and re-exported as json.JSONDecodeError; tracebacks show json.decoder.JSONDecodeError',
    'Message format': '"<msg>: line L column C (char P)" — P counts from 0, L and C from 1',
    'Pickling':   '__reduce__ returns (msg, doc, pos), so it pickles and unpickles with all attributes',
  },

  related: [
    { name: 'json.loads',  slug: 'loads',       when: 'Raises it for invalid text' },
    { name: 'json.load',   slug: 'load',        when: 'Raises it for an invalid file' },
    { name: 'JSONDecoder', slug: 'jsondecoder', when: 'decode and raw_decode raise it too' },
    { name: 'json module', slug: 'json',        when: 'Overview', category: 'stdlib' },
    { name: 'ValueError',  slug: 'valueerror',  when: 'Its parent class', category: 'exceptions' },
    { name: 'try',         slug: 'try',         when: 'try / except / else', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What does "json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)" mean?',
      a: 'The parser found no JSON value at the very start. Usually the text is empty (an empty HTTP response or file), is an HTML error page, or you passed a file name to json.loads instead of the content.',
    },
    {
      q: 'Should I catch json.JSONDecodeError or json.decoder.JSONDecodeError?',
      a: 'They are the same class. json.JSONDecodeError is the documented public name; the traceback shows json.decoder.JSONDecodeError because that is the module that defines it.',
    },
    {
      q: 'Is JSONDecodeError a subclass of ValueError?',
      a: 'Yes, so except ValueError catches it (code written before Python 3.5 relied on that). Catch json.JSONDecodeError when you only want JSON syntax errors.',
    },
    {
      q: 'How do I find where the JSON is broken?',
      a: 'Read e.lineno and e.colno (both from 1) or e.pos (from 0) on the exception. e.doc is the whole text, so e.doc[e.pos:] shows what the parser choked on.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/json.html#json.JSONDecodeError',
    meta:  'json.JSONDecodeError',
  },

};
