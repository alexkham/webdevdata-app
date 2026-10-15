// content/reference/python/stdlib/xml-etree-elementtree/parseerror.js

export const meta = {
  slug:        'parseerror',
  name:        'xml.etree.ElementTree.ParseError',
  signature:   'xml.etree.ElementTree.ParseError',
  blurb:       'Raised when XML is not well-formed. A SyntaxError subclass carrying expat\'s error code and the (line, column) where parsing stopped.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 2.7+ / 3.2+',
  searchTerms: 'xml.etree.ElementTree.ParseError parseerror et parseerror mismatched tag not well-formed invalid token junk after document element no element found undefined entity syntax error line column position code expat syntaxerror',
};

export const method = {
  slug:      'parseerror',
  name:      'xml.etree.ElementTree.ParseError',
  signature: 'xml.etree.ElementTree.ParseError',

  category:    'xml.etree.ElementTree exception',
  version:     'Python 2.7+ / 3.2+',
  hasLiveDemo: true,

  subtitle: 'Every parsing function of the module — fromstring, parse, iterparse, XMLParser.feed/close — raises it for malformed XML. str(e) is expat\'s message plus "line L, column C"; e.code and e.position hold the same facts as values.',

  covers: ['ParseError'],

  chain: ['BaseException', 'Exception', 'SyntaxError', 'ParseError'],

  cheat: {
    raisedBy: 'fromstring / XML, parse, iterparse, XMLParser.feed() and close(), XMLPullParser.read_events()',
    message:  'mismatched tag: line 1, column 8',
    quickFix: 'except ET.ParseError as e: line, column = e.position',
    watchOut: 'Lines count from 1 but columns from 0 — in characters, not bytes',
  },

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Parse your text without catching anything — the last line of the traceback.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import xml.etree.ElementTree as ET\nET.fromstring({$xml}).tag',
      cases: [
        { id: 'mismatch', label: 'mismatched tag',  values: { xml: '<a><b></a>' } },
        { id: 'amp',      label: 'bare &',          values: { xml: '<q>Fish & Chips</q>' } },
        { id: 'dup',      label: 'duplicate attr',  values: { xml: '<a x="1" x="2"/>' } },
        { id: 'prefix',   label: 'unbound prefix',  values: { xml: '<svg:rect/>' } },
        { id: 'open',     label: 'unclosed',        values: { xml: '<a><b/>' } },
        { id: 'valid',    label: 'valid',           values: { xml: '<a><b/></a>' } },
      ],
    },
    {
      id: 'attributes',
      label: 'Attributes',
      blurb: 'Catch it and read e.code (expat\'s error number) and e.position, a (line, column) tuple.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring({$xml})\nexcept ET.ParseError as e:\n    result = (e.code, e.position)\nelse:\n    result = 'parsed fine'\nresult",
      cases: [
        { id: 'mismatch', label: 'mismatched tag', values: { xml: '<root><item></root>' } },
        { id: 'entity',   label: '&copy;',         values: { xml: '<p>&copy; 2026</p>' } },
        { id: 'charref',  label: '&#0;',           values: { xml: '<p>&#0;</p>' } },
        { id: 'cdata',    label: 'open CDATA',     values: { xml: '<a><![CDATA[x</a>' } },
        { id: 'ok',       label: 'valid',          values: { xml: '<root/>' } },
      ],
    },
    {
      id: 'lines',
      label: 'Line and column',
      blurb: 'A two-line document: the position points into the second line; slicing that line from the column shows where expat stopped.',
      params: [
        { name: 'line1', type: 'str', hint: 'first line',  input: 'text' },
        { name: 'line2', type: 'str', hint: 'second line', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nxml = {$line1} + '\\n' + {$line2}\ntry:\n    ET.fromstring(xml)\nexcept ET.ParseError as e:\n    line, column = e.position\n    result = (line, column, xml.splitlines()[line - 1][column:])\nelse:\n    result = 'parsed fine'\nresult",
      cases: [
        { id: 'end',   label: 'wrong end tag',   values: { line1: '<order>', line2: '  <qty>3</amount></order>' } },
        { id: 'attr',  label: 'unquoted value',  values: { line1: '<order>', line2: '  <qty unit=kg>3</qty></order>' } },
        { id: 'first', label: 'error on line 1', values: { line1: '<order <qty>', line2: '</order>' } },
        { id: 'ok',    label: 'valid',           values: { line1: '<order>', line2: '</order>' } },
      ],
    },
    {
      id: 'catch',
      label: 'Handle',
      blurb: 'It is a SyntaxError, so except SyntaxError catches it too — but except ValueError does not.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring({$xml})\nexcept SyntaxError as e:\n    caught = (type(e).__name__, isinstance(e, ET.ParseError))\nelse:\n    caught = 'parsed fine'\ncaught",
      cases: [
        { id: 'bad',  label: 'not XML', values: { xml: 'hello' } },
        { id: 'good', label: 'valid',   values: { xml: '<hello/>' } },
      ],
    },
  ],
  demoExplainer: 'The position is where expat stopped: for a mismatched tag it points at the name inside the end tag, for an unquoted attribute value at the first character after =, for an undefined entity at its &. Columns count characters from 0 (lines from 1), so xml.splitlines()[line - 1][column:] starts exactly at the problem. Codes are expat\'s XML_Error numbers: 4 is "not well-formed (invalid token)", 7 "mismatched tag", 11 "undefined entity", 14 "reference to invalid character number", 20 "unclosed CDATA section".',

  attributes: [
    { name: 'code',     type: 'int',   meaning: 'Expat\'s error number; xml.parsers.expat.errors.messages[code] gives its message.' },
    { name: 'position', type: 'tuple', meaning: '(line, column): line counted from 1, column from 0, both in characters.' },
    { name: 'msg',      type: 'str',   meaning: 'The full message — the same text as str(e), position included.' },
    { name: 'args',     type: 'tuple', meaning: 'One item: the message.' },
    { name: 'lineno, offset, filename, text', type: 'None', meaning: 'Inherited from SyntaxError and left unset — use position instead.' },
  ],

  patterns: [
    {
      name: 'Report the position',
      desc: 'Unpack e.position rather than parsing the message.',
      code: "import xml.etree.ElementTree as ET\ntry:\n    root = ET.fromstring(text)\nexcept ET.ParseError as e:\n    line, column = e.position\n    print(f'invalid XML at line {line}, column {column + 1}: {e}')",
    },
    {
      name: 'Point at the offending character',
      desc: 'Column is 0-based, so it is exactly the number of characters before the problem.',
      code: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring(text)\nexcept ET.ParseError as e:\n    line, column = e.position\n    print(text.splitlines()[line - 1])\n    print(' ' * column + '^')",
    },
    {
      name: 'Branch on the kind of error',
      desc: 'Compare e.code with expat\'s named codes.',
      code: "import xml.etree.ElementTree as ET\nfrom xml.parsers.expat import errors\ntry:\n    ET.fromstring(text)\nexcept ET.ParseError as e:\n    if errors.messages[e.code] == errors.XML_ERROR_UNDEFINED_ENTITY:\n        print('uses an entity XML does not define (HTML &nbsp;?)')",
    },
  ],

  examples: [
    { title: 'Code and position', code: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring('<a><b></a>')\nexcept ET.ParseError as e:\n    info = (e.code, e.position)\ninfo", returns: '(7, (1, 8))' },
    { title: 'str(e) is the full message', code: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring('<a><b></a>')\nexcept ET.ParseError as e:\n    text = str(e)\ntext", returns: "'mismatched tag: line 1, column 8'" },
    { title: 'Code → expat message', code: "from xml.parsers.expat import errors\nerrors.messages[7]", returns: "'mismatched tag'" },
    { title: 'It is a SyntaxError', code: 'import xml.etree.ElementTree as ET\nissubclass(ET.ParseError, SyntaxError)', returns: 'True' },
    { title: 'SyntaxError fields stay None', code: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring('<a>')\nexcept ET.ParseError as e:\n    fields = (e.lineno, e.offset)\nfields", returns: '(None, None)' },
    { title: 'Positions on a later line', code: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring('<a>\\n  <b>\\n</a>')\nexcept ET.ParseError as e:\n    where = e.position\nwhere", returns: '(3, 2)' },
    { title: 'Raised by fromstring itself', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a>')", returns: 'xml.etree.ElementTree.ParseError: no element found: line 1, column 3' },
  ],

  pitfalls: [
    {
      name: 'Catching ValueError',
      desc: 'Unlike json.JSONDecodeError, ParseError is not a ValueError — it derives from SyntaxError.',
      wrong: { label: 'except ValueError', code: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring('<a>')\nexcept ValueError:\n    result = 'bad XML'", output: 'xml.etree.ElementTree.ParseError: no element found: line 1, column 3' },
      fix:   { label: 'except ET.ParseError', code: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring('<a>')\nexcept ET.ParseError:\n    result = 'bad XML'\nresult", output: "'bad XML'" },
    },
    {
      name: 'Catching the expat exception',
      desc: 'ElementTree converts expat errors into its own ParseError; xml.parsers.expat.ExpatError is a different class.',
      wrong: { label: 'except ExpatError', code: "import xml.etree.ElementTree as ET\nfrom xml.parsers.expat import ExpatError\ntry:\n    ET.fromstring('<a><b></a>')\nexcept ExpatError:\n    result = 'bad XML'", output: 'xml.etree.ElementTree.ParseError: mismatched tag: line 1, column 8' },
      fix:   { label: 'except ET.ParseError', code: "import xml.etree.ElementTree as ET\ntry:\n    ET.fromstring('<a><b></a>')\nexcept ET.ParseError as e:\n    result = e.code\nresult", output: '7' },
    },
    {
      name: 'Treating the column as 1-based',
      desc: 'The column counts from 0. Slicing from column - 1 starts one character too early.',
      wrong: { label: 'line[column - 1:]', code: "import xml.etree.ElementTree as ET\ntext = '<a><b></a>'\ntry:\n    ET.fromstring(text)\nexcept ET.ParseError as e:\n    near = text[e.position[1] - 1:]\nnear", output: "'/a>'" },
      fix:   { label: 'line[column:]', code: "import xml.etree.ElementTree as ET\ntext = '<a><b></a>'\ntry:\n    ET.fromstring(text)\nexcept ET.ParseError as e:\n    near = text[e.position[1]:]\nnear", output: "'a>'" },
    },
  ],

  when: {
    use: [
      'Around fromstring / parse when the XML comes from outside your program',
      'To tell users exactly where their XML file is broken (position)',
      'To react differently to different problems (code)',
    ],
    avoid: [
      'except Exception for XML errors — it also hides bugs in your own code',
      'Parsing str(e) — read code and position instead',
      'Expecting it for missing files: parse() raises FileNotFoundError for those',
    ],
  },

  notes: {
    cpython:      'Defined in Lib/xml/etree/ElementTree.py as class ParseError(SyntaxError); the C accelerator raises it with message "<expat message>: line L, column C" and sets .code and .position (expat_set_error in Modules/_elementtree.c)',
    'Positions':  'expat\'s XML_GetErrorLineNumber / XML_GetErrorColumnNumber: lines from 1 (LF, CR and CR LF each end a line), columns from 0 in characters',
    'Construction': 'ET.ParseError("text") can be raised by your own code, but then it has no code or position attribute',
  },

  related: [
    { name: 'fromstring',   slug: 'fromstring', when: 'The usual way to get one' },
    { name: 'parse',        slug: 'parse',      when: 'Raises it for a malformed file' },
    { name: 'iterparse',    slug: 'iterparse',  when: 'Raises it while you iterate' },
    { name: 'SyntaxError',  slug: 'syntaxerror', when: 'Its parent class', category: 'exceptions' },
    { name: 'JSONDecodeError', slug: 'jsondecodeerror', when: 'The json module\'s equivalent (a ValueError)', category: 'stdlib/json' },
    { name: 'try',          slug: 'try',        when: 'try / except / else', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What does "xml.etree.ElementTree.ParseError: not well-formed (invalid token)" mean?',
      a: 'Expat met a character that cannot appear at that point: a bare & or < in text, an unquoted attribute value, a stray character after a name. The column (counting from 0) points at the offending spot — for a bare & followed by a space, at the space: "<q>Fish & Chips</q>" fails at column 9.',
    },
    {
      q: 'What does "junk after document element" mean?',
      a: 'The document continues after the root element closed: a second top-level element or stray text. XML allows only one root; wrap several elements in a container element.',
    },
    {
      q: 'Is the column in ParseError 0-based or 1-based?',
      a: 'The line is 1-based and the column is 0-based (expat\'s convention), counted in characters. "line 1, column 8" means nine characters into the first line, i.e. text[8].',
    },
    {
      q: 'How do I catch an XML parsing error in Python?',
      a: 'except xml.etree.ElementTree.ParseError as e (or ET.ParseError with the usual import alias). Because it subclasses SyntaxError, except SyntaxError works too; except ValueError does not.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.ParseError',
    meta:  'xml.etree.ElementTree.ParseError',
  },
};
