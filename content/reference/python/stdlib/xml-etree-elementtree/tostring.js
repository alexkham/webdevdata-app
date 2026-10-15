// content/reference/python/stdlib/xml-etree-elementtree/tostring.js — tostring, tostringlist

export const meta = {
  slug:        'tostring',
  name:        'xml.etree.ElementTree.tostring',
  signature:   "xml.etree.ElementTree.tostring(element, encoding='us-ascii', method='xml', *, xml_declaration=None, default_namespace=None, short_empty_elements=True)",
  blurb:       'Serialize an element and everything under it to XML: bytes by default (US-ASCII with character references), a str with encoding="unicode". tostringlist() returns the pieces.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+ (tostringlist 3.2+, short_empty_elements 3.4+, xml_declaration and default_namespace 3.8+)',
  searchTerms: 'xml.etree.ElementTree.tostring ET.tostring tostringlist element to string python xml to string bytes encoding unicode utf-8 xml declaration short_empty_elements method html text default_namespace ns0 prefix serialize',
};

export const method = {
  slug:      'tostring',
  name:      'xml.etree.ElementTree.tostring',
  signature: "xml.etree.ElementTree.tostring(element, encoding='us-ascii', method='xml', *, xml_declaration=None, default_namespace=None, short_empty_elements=True)",
  returns:   { type: 'bytes | str', desc: 'str when encoding="unicode", otherwise bytes in that encoding. tostringlist returns a list of such pieces.' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 2.5+ (tostringlist 3.2+, short_empty_elements 3.4+, xml_declaration and default_namespace 3.8+)',
  hasLiveDemo: true,

  subtitle: 'tostring(elem) writes elem, its descendants — and its own tail — as XML. The default encoding is US-ASCII, so you get bytes with &#NNN; for non-ASCII characters; encoding="unicode" gives a str. Namespaces are declared on the element with ns0, ns1… prefixes unless a known or registered prefix exists.',

  covers: ['tostring', 'tostringlist'],

  cheat: {
    commonCall: "ET.tostring(root, encoding='unicode')",
    returns:    "'<root><a /></root>' — a str with encoding='unicode', bytes otherwise",
    replaces:   'hand-built XML strings (and their escaping bugs)',
    watchOut:   'Pass an Element, not an ElementTree (use tree.getroot())',
  },

  parameters: [
    { name: 'element',              type: 'Element',    required: true,  default: null,        desc: 'The element to serialize, with its children and its tail.' },
    { name: 'encoding',             type: 'str',        required: false, default: "'us-ascii'", desc: '"unicode" returns str. Any other codec returns bytes; characters it cannot encode become &#NNN;. An XML declaration is added unless the encoding is utf-8 or us-ascii (any case).' },
    { name: 'method',               type: 'str',        required: false, default: "'xml'",     desc: '"xml", "html" (void elements such as br have no end tag; script/style text is not escaped) or "text" (only the text content).' },
    { name: 'xml_declaration',      type: 'bool | None', required: false, default: 'None',     desc: 'True always writes <?xml version=\'1.0\' encoding=\'…\'?>, False never, None as described for encoding (3.8+).' },
    { name: 'default_namespace',    type: 'str | None', required: false, default: 'None',      desc: 'URI written as xmlns="…" so tags in it need no prefix; any tag without a namespace then raises ValueError (3.8+).' },
    { name: 'short_empty_elements', type: 'bool',       required: false, default: 'True',      desc: 'True writes <a />, False writes <a></a> for elements with no text and no children (3.4+).' },
  ],

  modes: [
    {
      id: 'encoding',
      label: 'encoding',
      blurb: 'The same element in different encodings. Leave encoding empty for the default (None → US-ASCII bytes).',
      params: [
        { name: 'text',     type: 'str',        hint: 'element text', input: 'text' },
        { name: 'encoding', type: 'str | None', hint: 'empty = None', input: 'text-or-none' },
      ],
      template: "import xml.etree.ElementTree as ET\ne = ET.Element('note')\ne.text = {$text}\nET.tostring(e, encoding={$encoding})",
      cases: [
        { id: 'default', label: 'default',   values: { text: 'Café ☕', encoding: '' } },
        { id: 'unicode', label: 'unicode',   values: { text: 'Café ☕', encoding: 'unicode' } },
        { id: 'utf8',    label: 'utf-8',     values: { text: 'Café ☕', encoding: 'utf-8' } },
        { id: 'latin1',  label: 'latin-1',   values: { text: 'Café ☕', encoding: 'latin-1' } },
        { id: 'utf8x',   label: 'utf8',      values: { text: 'Café ☕', encoding: 'utf8' } },
        { id: 'bogus',   label: 'unknown',   values: { text: 'Café ☕', encoding: 'utf-9' } },
      ],
    },
    {
      id: 'method',
      label: 'method',
      blurb: 'xml, html or text output of one parsed document (encoding="unicode" so it reads as a str).',
      params: [
        { name: 'xml',    type: 'str',        hint: 'an XML document', input: 'text' },
        { name: 'method', type: 'str | None', hint: 'xml / html / text', input: 'text-or-none' },
      ],
      template: "import xml.etree.ElementTree as ET\nET.tostring(ET.fromstring({$xml}), encoding='unicode', method={$method})",
      cases: [
        { id: 'xml',  label: 'xml',  values: { xml: '<div><br/><script>if (a &lt; b) go()</script><p>x &amp; y</p></div>', method: 'xml' } },
        { id: 'html', label: 'html', values: { xml: '<div><br/><script>if (a &lt; b) go()</script><p>x &amp; y</p></div>', method: 'html' } },
        { id: 'text', label: 'text', values: { xml: '<div><br/><script>if (a &lt; b) go()</script><p>x &amp; y</p></div>', method: 'text' } },
        { id: 'c14n', label: 'c14n', values: { xml: '<div/>', method: 'c14n' } },
      ],
    },
    {
      id: 'defaultns',
      label: 'default_namespace',
      blurb: 'By default namespaced tags get ns0-style prefixes; default_namespace writes one namespace as xmlns="…" instead.',
      params: [
        { name: 'xml', type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'uri', type: 'str', hint: 'namespace URI',   input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nET.tostring(ET.fromstring({$xml}), encoding='unicode', default_namespace={$uri})",
      cases: [
        { id: 'match', label: 'all in uri',       values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><entry/></feed>', uri: 'http://www.w3.org/2005/Atom' } },
        { id: 'none',  label: "'' (off)",         values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><entry/></feed>', uri: '' } },
        { id: 'mixed', label: 'unqualified tag',  values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><entry xmlns=""/></feed>', uri: 'http://www.w3.org/2005/Atom' } },
      ],
    },
    {
      id: 'list',
      label: 'tostringlist()',
      blurb: 'With encoding="unicode" you see every piece the serializer writes.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\nET.tostringlist(ET.fromstring({$xml}), encoding='unicode')",
      cases: [
        { id: 'small', label: 'small tree', values: { xml: '<a x="1"><b>t</b></a>' } },
        { id: 'ns',    label: 'namespace',  values: { xml: '<p:a xmlns:p="urn:p"/>' } },
      ],
    },
  ],
  demoExplainer: 'Without an encoding you get US-ASCII bytes: é and ☕ become &#233; and &#9749;. latin-1 can encode é (byte \\xe9) but not ☕, and — like utf8 written without the hyphen — it is not one of utf-8/us-ascii, so an XML declaration is added. An unknown codec name raises LookupError. method="html" leaves <br> unclosed and the script text unescaped; "c14n" is not accepted here (ValueError: unknown method \'c14n\') — use canonicalize(). default_namespace fails with ValueError as soon as one tag has no namespace.',

  patterns: [
    {
      name: 'A str for logs, tests and APIs',
      desc: 'encoding="unicode" skips the bytes round trip.',
      code: "import xml.etree.ElementTree as ET\nxml_text = ET.tostring(root, encoding='unicode')",
    },
    {
      name: 'UTF-8 bytes with a declaration',
      desc: 'For HTTP bodies or files you write yourself.',
      code: "import xml.etree.ElementTree as ET\nbody = ET.tostring(root, encoding='utf-8', xml_declaration=True)",
    },
    {
      name: 'Pretty output',
      desc: 'indent() first (3.9+), then serialize.',
      code: "import xml.etree.ElementTree as ET\nET.indent(root)\nprint(ET.tostring(root, encoding='unicode'))",
    },
    {
      name: 'Serialize a whole parsed file',
      desc: 'tostring needs the root element of an ElementTree.',
      code: "import xml.etree.ElementTree as ET\ntree = ET.parse('in.xml')\ntext = ET.tostring(tree.getroot(), encoding='unicode')",
    },
  ],

  examples: [
    { title: 'Default: US-ASCII bytes', code: "import xml.etree.ElementTree as ET\ne = ET.Element('note')\ne.text = 'Café'\nET.tostring(e)", returns: "b'<note>Caf&#233;</note>'" },
    { title: 'encoding="unicode" gives a str', code: "import xml.etree.ElementTree as ET\ne = ET.Element('note')\ne.text = 'Café'\nET.tostring(e, encoding='unicode')", returns: "'<note>Café</note>'" },
    { title: 'UTF-8 bytes, no declaration', code: "import xml.etree.ElementTree as ET\ne = ET.Element('note')\ne.text = 'Café'\nET.tostring(e, encoding='utf-8')", returns: "b'<note>Caf\\xc3\\xa9</note>'" },
    { title: 'Forcing the declaration', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a'), encoding='unicode', xml_declaration=True)", returns: "\"<?xml version='1.0' encoding='utf-8'?>\\n<a />\"" },
    { title: 'short_empty_elements=False', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a'), short_empty_elements=False)", returns: "b'<a></a>'" },
    { title: 'method="text"', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.fromstring('<p>Hi <b>there</b>!</p>'), method='text')", returns: "b'Hi there!'" },
    { title: 'tostringlist pieces join to tostring', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\nb''.join(ET.tostringlist(root)) == ET.tostring(root)", returns: 'True' },
    { title: 'Namespaces get ns0 prefixes', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.fromstring('<feed xmlns=\"urn:a\"><e/></feed>'), encoding='unicode')", returns: "'<ns0:feed xmlns:ns0=\"urn:a\"><ns0:e /></ns0:feed>'" },
  ],

  pitfalls: [
    {
      name: 'Treating the result as a str',
      desc: 'Without encoding="unicode" the result is bytes, and str methods with str arguments fail.',
      wrong: { label: "startswith('<a')", code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a')).startswith('<a')", output: 'TypeError: startswith first arg must be bytes or a tuple of bytes, not str' },
      fix:   { label: "encoding='unicode'", code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a'), encoding='unicode').startswith('<a')", output: 'True' },
    },
    {
      name: 'Passing an ElementTree',
      desc: 'parse() returns an ElementTree; tostring() wants an Element.',
      wrong: { label: 'tostring(tree)', code: "import xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.Element('a'))\nET.tostring(tree)", output: "AttributeError: 'ElementTree' object has no attribute 'tag'" },
      fix:   { label: 'tostring(tree.getroot())', code: "import xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.Element('a'))\nET.tostring(tree.getroot())", output: "b'<a />'" },
    },
    {
      name: 'Writing "utf8" without the hyphen',
      desc: 'Only utf-8 and us-ascii (in any case) skip the declaration; the declared name is copied as given — and the docs note "UTF8" is not a valid name in XML.',
      wrong: { label: "encoding='utf8'", code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a'), encoding='utf8')", output: "b\"<?xml version='1.0' encoding='utf8'?>\\n<a />\"" },
      fix:   { label: "encoding='utf-8'", code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a'), encoding='utf-8')", output: "b'<a />'" },
    },
  ],

  when: {
    use: [
      'XML text in memory: an HTTP request body, a log line, a test assertion',
      'tostringlist() when you stream pieces somewhere (b"".join gives the same bytes)',
    ],
    avoid: [
      'Writing files → ElementTree(root).write(path, encoding=..., xml_declaration=...)',
      'Byte-for-byte comparable output → canonicalize()',
      'Debug printing → dump(elem) writes to stdout',
    ],
  },

  notes: {
    cpython:      'tostring() runs ElementTree(element).write() into an io.StringIO (encoding="unicode") or io.BytesIO wrapped in a TextIOWrapper with errors="xmlcharrefreplace"',
    'Escaping':   'Text: & < > become &amp; &lt; &gt;. Attribute values: also " → &quot; and \\r \\n \\t → &#13; &#10; &#09;. Comments and PIs are written as-is',
    'Namespaces': 'All xmlns declarations go on the serialized element itself; known URIs use their registered prefix (xml, html, rdf, wsdl, xs, xsi, dc, plus register_namespace()), others ns0, ns1, …',
    'Tail':       'The element\'s own tail is written after its end tag',
  },

  related: [
    { name: 'ElementTree.write', slug: 'elementtree-write', when: 'The same output to a file' },
    { name: 'indent',            slug: 'indent',            when: 'Pretty-print before serializing' },
    { name: 'register_namespace', slug: 'register_namespace', when: 'Choose prefixes instead of ns0' },
    { name: 'canonicalize',      slug: 'canonicalize',      when: 'C14N 2.0 output' },
    { name: 'fromstring',        slug: 'fromstring',        when: 'The reverse direction' },
    { name: 'json.dumps',        slug: 'dumps',             when: 'The JSON counterpart', category: 'stdlib/json' },
  ],

  faq: [
    {
      q: 'How do I convert an Element to a string in Python?',
      a: "ET.tostring(elem, encoding='unicode') returns a str. Without encoding you get bytes in US-ASCII (non-ASCII characters as &#NNN; references); .decode() works on those too.",
    },
    {
      q: 'Why does ET.tostring return bytes?',
      a: 'The default encoding is US-ASCII, and any encoding other than the special name "unicode" produces encoded bytes. Pass encoding="unicode" for a str.',
    },
    {
      q: 'How do I get rid of ns0 prefixes in the output?',
      a: 'Register a prefix for the URI with ET.register_namespace(prefix, uri) before serializing, or pass default_namespace=uri if every tag is in that one namespace.',
    },
    {
      q: 'How do I include the <?xml ...?> declaration?',
      a: "Pass xml_declaration=True (3.8+), e.g. ET.tostring(root, encoding='utf-8', xml_declaration=True). With the default None it is only added for encodings other than utf-8, us-ascii and unicode.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.tostring',
    meta:  'xml.etree.ElementTree.tostring',
  },
};
