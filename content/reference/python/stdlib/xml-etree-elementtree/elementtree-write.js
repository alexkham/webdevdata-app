// content/reference/python/stdlib/xml-etree-elementtree/elementtree-write.js — ElementTree.write, ElementTree.write_c14n

export const meta = {
  slug:        'elementtree-write',
  name:        'ElementTree.write',
  signature:   "ElementTree.write(file, encoding='us-ascii', xml_declaration=None, default_namespace=None, method='xml', *, short_empty_elements=True)",
  blurb:       'Save a tree as XML to a file name or a file object, choosing the encoding, the XML declaration and the output method.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+ (short_empty_elements 3.4+)',
  searchTerms: 'ElementTree.write ElementTree.write_c14n tree.write save xml file python write xml file encoding utf-8 xml_declaration bytesio stringio unicode string argument expected got bytes c14n',
};

export const method = {
  slug:      'elementtree-write',
  name:      'ElementTree.write',
  signature: "ElementTree.write(file, encoding='us-ascii', xml_declaration=None, default_namespace=None, method='xml', *, short_empty_elements=True)",
  returns:   { type: 'None', desc: 'The XML is written to file.' },

  category:    'xml.etree.ElementTree method',
  version:     'Python 2.5+ (short_empty_elements 3.4+)',
  hasLiveDemo: true,

  subtitle: 'write() is tostring() aimed at a file. With a file name it opens the file itself; with a file object, encoding="unicode" needs a text stream and every other encoding needs a binary one. The default is US-ASCII — pass encoding="utf-8" for readable non-ASCII text.',

  covers: ['ElementTree.write', 'ElementTree.write_c14n'],

  cheat: {
    commonCall: "tree.write('out.xml', encoding='utf-8', xml_declaration=True)",
    returns:    'None',
    replaces:   'open(...).write(ET.tostring(...))',
    watchOut:   'encoding="unicode" only for text streams; write_c14n() raises ValueError — use canonicalize()',
  },

  parameters: [
    { name: 'file',                 type: 'str | path | file object', required: true,  default: null,        desc: 'A file name (opened in text mode with your encoding and errors="xmlcharrefreplace") or an object with write().' },
    { name: 'encoding',             type: 'str',                      required: false, default: "'us-ascii'", desc: '"unicode" writes str (text streams only); any codec name writes bytes in it, unencodable characters as &#NNN;.' },
    { name: 'xml_declaration',      type: 'bool | None',              required: false, default: 'None',      desc: 'True always, False never, None only when the encoding is not utf-8, us-ascii or unicode.' },
    { name: 'default_namespace',    type: 'str | None',               required: false, default: 'None',      desc: 'Namespace written as xmlns="…" instead of a prefix.' },
    { name: 'method',               type: 'str',                      required: false, default: "'xml'",     desc: '"xml", "html" or "text" — as in tostring().' },
    { name: 'short_empty_elements', type: 'bool',                     required: false, default: 'True',      desc: 'False writes <a></a> instead of <a /> for empty elements.' },
  ],

  modes: [
    {
      id: 'bytesio',
      label: 'binary stream',
      blurb: 'Write into an io.BytesIO with xml_declaration=True and your encoding (empty = None, the default).',
      params: [
        { name: 'xml',      type: 'str',        hint: 'an XML document', input: 'text' },
        { name: 'encoding', type: 'str | None', hint: 'empty = None',    input: 'text-or-none' },
      ],
      template: 'import io\nimport xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.fromstring({$xml}))\nout = io.BytesIO()\ntree.write(out, encoding={$encoding}, xml_declaration=True)\nout.getvalue()',
      cases: [
        { id: 'default', label: 'default',   values: { xml: '<name>José</name>', encoding: '' } },
        { id: 'utf8',    label: 'utf-8',     values: { xml: '<name>José</name>', encoding: 'utf-8' } },
        { id: 'latin',   label: 'latin-1',   values: { xml: '<name>José</name>', encoding: 'latin-1' } },
        { id: 'unicode', label: 'unicode',   values: { xml: '<name>José</name>', encoding: 'unicode' } },
      ],
    },
    {
      id: 'stringio',
      label: 'text stream',
      blurb: 'Write a str into an io.StringIO — that needs encoding="unicode". Try the html and text methods.',
      params: [
        { name: 'xml',    type: 'str',        hint: 'an XML document',  input: 'text' },
        { name: 'method', type: 'str | None', hint: 'xml / html / text', input: 'text-or-none' },
      ],
      template: "import io\nimport xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.fromstring({$xml}))\nout = io.StringIO()\ntree.write(out, encoding='unicode', method={$method})\nout.getvalue()",
      cases: [
        { id: 'xml',  label: 'xml',  values: { xml: '<p>Hi<br/><img src="a.png"/></p>', method: 'xml' } },
        { id: 'html', label: 'html', values: { xml: '<p>Hi<br/><img src="a.png"/></p>', method: 'html' } },
        { id: 'text', label: 'text', values: { xml: '<p>Hi<br/><img src="a.png"/></p>', method: 'text' } },
      ],
    },
  ],
  demoExplainer: 'The declaration names the encoding exactly as you passed it (us-ascii for the default None). With US-ASCII, é cannot be encoded and becomes &#233;; latin-1 writes the single byte \\xe9. encoding="unicode" produces str, which a BytesIO rejects: TypeError: a bytes-like object is required, not \'str\'.',

  patterns: [
    {
      name: 'Save as UTF-8 with a declaration',
      desc: 'The usual choice for files other programs read.',
      code: "import xml.etree.ElementTree as ET\ntree.write('out.xml', encoding='utf-8', xml_declaration=True)",
    },
    {
      name: 'Save a tree you built',
      desc: 'Wrap the root first; indent() for readability (3.9+).',
      code: "import xml.etree.ElementTree as ET\nET.indent(root)\nET.ElementTree(root).write('out.xml', encoding='utf-8')",
    },
    {
      name: 'Write into an open binary file',
      desc: 'Any encoding except "unicode".',
      code: "import xml.etree.ElementTree as ET\nwith open('out.xml', 'wb') as f:\n    tree.write(f, encoding='utf-8', xml_declaration=True)",
    },
    {
      name: 'Canonical output',
      desc: 'write_c14n() is a leftover that fails; canonicalize() is the C14N 2.0 API.',
      code: "import xml.etree.ElementTree as ET\nwith open('c14n.xml', 'w', encoding='utf-8') as f:\n    ET.canonicalize(ET.tostring(tree.getroot()), out=f)",
    },
  ],

  examples: [
    { title: 'Default: US-ASCII, no declaration', code: "import io\nimport xml.etree.ElementTree as ET\nout = io.BytesIO()\nET.ElementTree(ET.fromstring('<a>José</a>')).write(out)\nout.getvalue()", returns: "b'<a>Jos&#233;</a>'" },
    { title: 'UTF-8 with a declaration', code: "import io\nimport xml.etree.ElementTree as ET\nout = io.BytesIO()\nET.ElementTree(ET.fromstring('<a>José</a>')).write(out, encoding='utf-8', xml_declaration=True)\nout.getvalue()", returns: "b\"<?xml version='1.0' encoding='utf-8'?>\\n<a>Jos\\xc3\\xa9</a>\"" },
    { title: 'A str into a StringIO', code: "import io\nimport xml.etree.ElementTree as ET\nout = io.StringIO()\nET.ElementTree(ET.fromstring('<a>José</a>')).write(out, encoding='unicode')\nout.getvalue()", returns: "'<a>José</a>'" },
    { title: 'To a file by name', code: "import xml.etree.ElementTree as ET\nET.ElementTree(ET.fromstring('<a>José</a>')).write('a.xml', encoding='utf-8')\nopen('a.xml', encoding='utf-8').read()", returns: "'<a>José</a>'" },
    { title: 'method="text"', code: "import io\nimport xml.etree.ElementTree as ET\nout = io.BytesIO()\nET.ElementTree(ET.fromstring('<p>Hi <b>you</b></p>')).write(out, encoding='utf-8', method='text')\nout.getvalue()", returns: "b'Hi you'" },
    { title: 'write_c14n() is not implemented', code: "import xml.etree.ElementTree as ET\nET.ElementTree(ET.Element('a')).write_c14n('c.xml')", returns: "ValueError: unknown method 'c14n'" },
  ],

  pitfalls: [
    {
      name: 'A text stream with a byte encoding',
      desc: 'Without encoding="unicode", write() produces bytes, which a StringIO (or a file opened in text mode) refuses.',
      wrong: { label: 'StringIO, default encoding', code: "import io\nimport xml.etree.ElementTree as ET\nout = io.StringIO()\nET.ElementTree(ET.Element('a')).write(out)", output: "TypeError: string argument expected, got 'bytes'" },
      fix:   { label: "encoding='unicode'", code: "import io\nimport xml.etree.ElementTree as ET\nout = io.StringIO()\nET.ElementTree(ET.Element('a')).write(out, encoding='unicode')\nout.getvalue()", output: "'<a />'" },
    },
    {
      name: 'Relying on the default encoding',
      desc: 'US-ASCII keeps the file valid but turns every non-ASCII character into a reference.',
      wrong: { label: 'write(path)', code: "import xml.etree.ElementTree as ET\nET.ElementTree(ET.fromstring('<a>Zoë</a>')).write('z.xml')\nopen('z.xml', encoding='utf-8').read()", output: "'<a>Zo&#235;</a>'" },
      fix:   { label: "encoding='utf-8'", code: "import xml.etree.ElementTree as ET\nET.ElementTree(ET.fromstring('<a>Zoë</a>')).write('z.xml', encoding='utf-8')\nopen('z.xml', encoding='utf-8').read()", output: "'<a>Zoë</a>'" },
    },
  ],

  when: {
    use: [
      'Saving a parsed and modified document',
      'Writing a document you built (wrap it with ElementTree(root))',
      'Streaming into any binary file object: sockets, zip entries, gzip files',
    ],
    avoid: [
      'Getting the XML as a value → tostring()',
      'Canonical XML → canonicalize() (write_c14n() raises ValueError)',
    ],
  },

  notes: {
    cpython:      'write() picks a writer in _get_writer(): a file name is opened with open(name, "w", encoding=..., errors="xmlcharrefreplace"); a binary object is wrapped in io.TextIOWrapper(..., errors="xmlcharrefreplace", newline="\\n")',
    'Line ends':  'Writing to a file name uses text mode, so on Windows the "\\n" after the XML declaration (and newlines from indent()) become "\\r\\n" in the file; binary file objects get "\\n"',
    'write_c14n': 'Kept for lxml compatibility; it calls write(file, method="c14n"), which raises ValueError: unknown method \'c14n\' in Python 3.13',
  },

  related: [
    { name: 'tostring',     slug: 'tostring',     when: 'The same serializer, returning the result' },
    { name: 'ElementTree',  slug: 'elementtree',  when: 'The object that has write()' },
    { name: 'indent',       slug: 'indent',       when: 'Pretty-print before writing' },
    { name: 'canonicalize', slug: 'canonicalize', when: 'C14N 2.0 output' },
    { name: 'parse',        slug: 'parse',        when: 'Read it back' },
    { name: 'open()',       slug: 'open',         when: 'Text vs binary file objects', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I write an XML file with ElementTree?',
      a: "ET.ElementTree(root).write('out.xml', encoding='utf-8', xml_declaration=True). If you got the tree from ET.parse(), call write() on it directly.",
    },
    {
      q: "Why do I get \"TypeError: string argument expected, got 'bytes'\"?",
      a: 'You passed a text stream (io.StringIO or a file opened in text mode) without encoding="unicode". Either pass encoding="unicode" or give write() a binary stream / a file name.',
    },
    {
      q: 'Why is my XML file full of &#233; references?',
      a: "write() defaults to US-ASCII, where é cannot be stored as a byte. Pass encoding='utf-8'.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.ElementTree.write',
    meta:  'ElementTree.write',
  },
};
