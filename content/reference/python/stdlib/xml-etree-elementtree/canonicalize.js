// content/reference/python/stdlib/xml-etree-elementtree/canonicalize.js — canonicalize, C14NWriterTarget

export const meta = {
  slug:        'canonicalize',
  name:        'xml.etree.ElementTree.canonicalize',
  signature:   'xml.etree.ElementTree.canonicalize(xml_data=None, *, out=None, from_file=None, **options)',
  blurb:       'Rewrite XML in its C14N 2.0 canonical form — sorted attributes, no self-closing tags, normalised quotes and namespace declarations — so two documents can be compared byte for byte.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'xml.etree.ElementTree.canonicalize ET.canonicalize C14NWriterTarget c14n canonical xml c14n 2.0 compare two xml documents python ignore attribute order xml diff normalize xml with_comments strip_text rewrite_prefixes exclude_tags exclude_attrs',
};

export const method = {
  slug:      'canonicalize',
  name:      'xml.etree.ElementTree.canonicalize',
  signature: 'xml.etree.ElementTree.canonicalize(xml_data=None, *, out=None, from_file=None, **options)',
  returns:   { type: 'str | None', desc: 'The canonical XML as a str — or None when out is given (the text is written there instead).' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'canonicalize() parses XML and writes it back in C14N 2.0 form: attributes sorted, every element written with a start and an end tag, attribute values in double quotes, namespace declarations only where they are used, no XML declaration. C14NWriterTarget is the parser target that does the writing.',

  covers: ['canonicalize', 'C14NWriterTarget'],

  cheat: {
    commonCall: 'ET.canonicalize(a, strip_text=True) == ET.canonicalize(b, strip_text=True)',
    returns:    'the canonical form as a str',
    replaces:   'comparing XML strings that differ only in formatting',
    watchOut:   'Whitespace text is kept unless strip_text=True; comments are dropped unless with_comments=True',
  },

  parameters: [
    { name: 'xml_data',  type: 'str | bytes', required: false, default: 'None', desc: 'The XML document. Either this or from_file is required.' },
    { name: 'out',       type: 'text file',   required: false, default: 'None', desc: 'Where to write; open it in text mode with encoding="utf-8". With out, the function returns None.' },
    { name: 'from_file', type: 'str | file',  required: false, default: 'None', desc: 'A file name or file object to read instead of xml_data.' },
    { name: '**options', type: 'keywords',    required: false, default: null,   desc: 'with_comments, strip_text, rewrite_prefixes (bools, default False); qname_aware_tags, qname_aware_attrs, exclude_attrs, exclude_tags (collections of names, {uri}local for namespaced ones).' },
  ],

  modes: [
    {
      id: 'canon',
      label: 'canonicalize()',
      blurb: 'The canonical form of the XML you type, with default options.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import xml.etree.ElementTree as ET\nET.canonicalize({$xml})',
      cases: [
        { id: 'order',  label: 'attribute order',  values: { xml: '<user role="admin" id="7"><email/></user>' } },
        { id: 'quotes', label: 'quotes + refs',    values: { xml: "<?xml version='1.0'?><a title='say \"hi\"' v='&#60;&#62;'>x &gt; y</a>" } },
        { id: 'ns',     label: 'namespaces',       values: { xml: '<doc xmlns:unused="urn:u" xmlns:p="urn:p"><p:item/></doc>' } },
        { id: 'cdata',  label: 'CDATA + comment',  values: { xml: '<code><!-- note --><![CDATA[a < b]]></code>' } },
      ],
    },
    {
      id: 'compare',
      label: 'compare two documents',
      blurb: 'Are two documents the same XML? Compare their canonical forms, with whitespace-only text stripped.',
      params: [
        { name: 'a', type: 'str', hint: 'first document',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second document', input: 'text' },
      ],
      template: 'import xml.etree.ElementTree as ET\nET.canonicalize({$a}, strip_text=True) == ET.canonicalize({$b}, strip_text=True)',
      cases: [
        { id: 'attrs',  label: 'attribute order', values: { a: '<user id="7" role="admin"/>', b: "<user role='admin' id='7'></user>" } },
        { id: 'pretty', label: 'pretty-printed',  values: { a: '<a><b>1</b><c>2</c></a>', b: '<a>\n  <b>1</b>\n  <c>2</c>\n</a>' } },
        { id: 'text',   label: 'different text',  values: { a: '<a><b>1</b></a>', b: '<a><b>2</b></a>' } },
        { id: 'prefix', label: 'other prefix',    values: { a: '<p:a xmlns:p="urn:x"/>', b: '<q:a xmlns:q="urn:x"/>' } },
      ],
    },
    {
      id: 'exclude',
      label: 'exclude tags / attributes',
      blurb: 'Drop whole elements (exclude_tags) and attributes (exclude_attrs) from the output — comma-separated names.',
      params: [
        { name: 'xml',   type: 'str',       hint: 'an XML document',  input: 'text' },
        { name: 'tags',  type: 'list[str]', hint: 'tags to drop',     input: 'csv' },
        { name: 'attrs', type: 'list[str]', hint: 'attributes to drop', input: 'csv' },
      ],
      template: 'import xml.etree.ElementTree as ET\nET.canonicalize({$xml}, exclude_tags={$tags}, exclude_attrs={$attrs})',
      cases: [
        { id: 'sig',   label: 'drop a signature', values: { xml: '<msg id="1" ts="99"><body>hi</body><sig>abc</sig></msg>', tags: 'sig', attrs: 'ts' } },
        { id: 'none',  label: 'nothing excluded', values: { xml: '<msg id="1"><body>hi</body></msg>', tags: '', attrs: '' } },
      ],
    },
    {
      id: 'writer',
      label: 'C14NWriterTarget',
      blurb: 'The writer as an XMLParser target: every piece it writes, in order.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import xml.etree.ElementTree as ET\nchunks = []\nparser = ET.XMLParser(target=ET.C14NWriterTarget(chunks.append))\nparser.feed({$xml})\nparser.close()\nchunks',
      cases: [
        { id: 'small', label: 'small document', values: { xml: '<a x="1"><b>t</b></a>' } },
        { id: 'ns',    label: 'namespace',      values: { xml: '<r xmlns="urn:r"><c k="v"/></r>' } },
      ],
    },
  ],
  demoExplainer: 'C14N 2.0 sorts attributes, writes <email></email> for an empty element, uses double quotes, drops the XML declaration (and comments, unless with_comments=True) and turns a CDATA section into escaped text. Character references are resolved and characters are re-escaped only where needed (in attribute values the greater-than sign stays). Namespace declarations move to the element that first uses them; unused ones vanish. The prefix is part of the canonical form, so "other prefix" compares unequal — pass rewrite_prefixes=True to replace prefixes with n0, n1 ... The writer target calls write() for each piece of markup as the parser reports it; text is held back and written when the next tag, comment or processing instruction arrives.',

  patterns: [
    {
      name: 'Test that two XML documents are equivalent',
      desc: 'Strip formatting whitespace and ignore prefix choice.',
      code: "import xml.etree.ElementTree as ET\n\ndef same_xml(a, b):\n    opts = dict(strip_text=True, rewrite_prefixes=True)\n    return ET.canonicalize(a, **opts) == ET.canonicalize(b, **opts)",
    },
    {
      name: 'Canonicalize a file into another file',
      desc: 'out receives text: open it in text mode with UTF-8.',
      code: "import xml.etree.ElementTree as ET\nwith open('c14n.xml', 'w', encoding='utf-8') as out:\n    ET.canonicalize(from_file='input.xml', out=out)",
    },
    {
      name: 'Canonical form of an Element you built',
      desc: 'Serialize it first; canonicalize() takes XML text.',
      code: "import xml.etree.ElementTree as ET\ncanonical = ET.canonicalize(ET.tostring(root))",
    },
  ],

  examples: [
    { title: 'Sorted attributes, no self-closing tags', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<root z=\"1\" a=\"2\"><empty/></root>')", returns: "'<root a=\"2\" z=\"1\"><empty></empty></root>'" },
    { title: 'Namespace declarations move to where they are used', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a xmlns:unused=\"urn:u\" xmlns:p=\"urn:p\"><p:b/></a>')", returns: "'<a><p:b xmlns:p=\"urn:p\"></p:b></a>'" },
    { title: 'with_comments=True keeps comments', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a><!-- c --><b/></a>', with_comments=True)", returns: "'<a><!-- c --><b></b></a>'" },
    { title: 'strip_text=True trims text', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a>\\n  <b> x </b>\\n</a>', strip_text=True)", returns: "'<a><b>x</b></a>'" },
    { title: 'Comparing a compact and a pretty document', code: "import xml.etree.ElementTree as ET\na = '<user id=\"7\" role=\"admin\"><name>Ada</name></user>'\nb = \"<user role='admin' id='7'>\\n  <name>Ada</name>\\n</user>\"\n(ET.canonicalize(a) == ET.canonicalize(b), ET.canonicalize(a, strip_text=True) == ET.canonicalize(b, strip_text=True))", returns: '(False, True)' },
    { title: 'rewrite_prefixes=True ignores prefix choice', code: "import xml.etree.ElementTree as ET\na = '<p:doc xmlns:p=\"urn:d\"><p:x/></p:doc>'\nb = '<doc xmlns=\"urn:d\"><x/></doc>'\n(ET.canonicalize(a) == ET.canonicalize(b), ET.canonicalize(a, rewrite_prefixes=True) == ET.canonicalize(b, rewrite_prefixes=True))", returns: '(False, True)' },
    { title: 'Writing to a file with out=', code: "import xml.etree.ElementTree as ET\nwith open('out.xml', 'w', encoding='utf-8') as f:\n    ET.canonicalize('<a b=\"1\"/>', out=f)\nopen('out.xml', encoding='utf-8').read()", returns: "'<a b=\"1\"></a>'" },
    { title: 'C14NWriterTarget writes piece by piece', code: "import xml.etree.ElementTree as ET\nout = []\nparser = ET.XMLParser(target=ET.C14NWriterTarget(out.append))\nparser.feed('<a x=\"1\"><b>t</b></a>')\nparser.close()\nout", returns: "['<a', ' x=\"1\"', '>', '<b', '>', 't', '</b>', '</a>']" },
  ],

  pitfalls: [
    {
      name: 'Comparing without strip_text',
      desc: 'Indentation is text in XML, and the canonical form keeps it. Strip it when formatting should not matter (xml:space="preserve" still protects its elements).',
      wrong: { label: 'default options', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a><b>1</b></a>') == ET.canonicalize('<a>\\n  <b>1</b>\\n</a>')", output: 'False' },
      fix:   { label: 'strip_text=True', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a><b>1</b></a>', strip_text=True) == ET.canonicalize('<a>\\n  <b>1</b>\\n</a>', strip_text=True)", output: 'True' },
    },
    {
      name: 'An out file opened in binary mode',
      desc: 'The writer produces str. The docs: open the output in text mode with utf-8 encoding.',
      wrong: { label: "open(..., 'wb')", code: "import xml.etree.ElementTree as ET\nwith open('out.xml', 'wb') as f:\n    ET.canonicalize('<a/>', out=f)", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "open(..., 'w', encoding='utf-8')", code: "import xml.etree.ElementTree as ET\nwith open('out.xml', 'w', encoding='utf-8') as f:\n    ET.canonicalize('<a/>', out=f)\nopen('out.xml', encoding='utf-8').read()", output: "'<a></a>'" },
    },
    {
      name: 'A misspelled option',
      desc: 'Options are passed on to C14NWriterTarget, which rejects unknown names.',
      wrong: { label: 'with_comment=True', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a><!--x--></a>', with_comment=True)", output: "TypeError: C14NWriterTarget.__init__() got an unexpected keyword argument 'with_comment'. Did you mean 'with_comments'?" },
      fix:   { label: 'with_comments=True', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a><!--x--></a>', with_comments=True)", output: "'<a><!--x--></a>'" },
    },
    {
      name: 'Expecting entities to survive',
      desc: 'Canonical XML has no CDATA sections and resolves character references; the few characters that must be escaped come out as the standard references.',
      wrong: { label: 'CDATA and &#65;', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a>&#65;<![CDATA[<x>]]></a>') == '<a>&#65;<![CDATA[<x>]]></a>'", output: 'False' },
      fix:   { label: 'compare canonical forms', code: "import xml.etree.ElementTree as ET\nET.canonicalize('<a>&#65;<![CDATA[<x>]]></a>')", output: "'<a>A&lt;x&gt;</a>'" },
    },
  ],

  when: {
    use: [
      'Tests that compare generated XML with expected XML regardless of attribute order or quoting',
      'Normalising documents before hashing, signing or diffing them',
      'Removing volatile parts (exclude_tags / exclude_attrs) before comparing',
    ],
    avoid: [
      'Pretty-printing for humans → indent() and tostring()',
      'Comparing parsed trees field by field when you only care about some elements',
    ],
  },

  notes: {
    cpython:     'canonicalize() creates XMLParser(target=C14NWriterTarget(out.write, **options)) — writing to an io.StringIO when out is None — and feeds xml_data, or parses from_file. C14NWriterTarget is pure Python: it receives start / data / end / comment / pi / start_ns calls and writes each piece of markup right away (text is collected and written when the next event arrives)',
    'C14N 2.0':  'Attributes sorted by name ({uri}local form); namespace declarations sorted and placed on the first element that needs them; text escaped as &, <, > and CR; attribute values escaped as &, <, " , tab, LF and CR; comments and PIs outside the root are separated by line breaks; the DOCTYPE is not part of the output',
    'Options':   'qname_aware_tags / qname_aware_attrs name elements and attributes whose content is a prefixed name (like xsi:type) so its prefix is rewritten too. Both canonicalize() and C14NWriterTarget are 3.8+',
  },

  related: [
    { name: 'tostring',  slug: 'tostring',  when: 'Ordinary serialization of an Element' },
    { name: 'indent',    slug: 'indent',    when: 'Pretty-printing for humans' },
    { name: 'XMLParser', slug: 'xmlparser', when: 'Drives C14NWriterTarget' },
    { name: 'ElementTree.write', slug: 'elementtree-write', when: 'method="c14n" is not supported there — use canonicalize' },
  ],

  faq: [
    {
      q: 'How do I compare two XML documents in Python, ignoring formatting?',
      a: 'Compare canonical forms: ET.canonicalize(a, strip_text=True) == ET.canonicalize(b, strip_text=True). Attribute order, quote style, self-closing tags and indentation no longer matter. Add rewrite_prefixes=True if the same namespace may use different prefixes.',
    },
    {
      q: 'What is C14N?',
      a: 'Canonical XML: a W3C specification that defines one exact serialization for equivalent documents, so they can be compared byte by byte or signed. ElementTree implements C14N 2.0.',
    },
    {
      q: 'Does canonicalize keep comments?',
      a: 'Not by default. Pass with_comments=True to keep them.',
    },
    {
      q: 'What is C14NWriterTarget for?',
      a: 'It is the parser target canonicalize() uses. Create it yourself with a write function — ET.XMLParser(target=ET.C14NWriterTarget(file.write)) — to canonicalize a document you feed in chunks, without building a tree.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.canonicalize',
    meta:  'xml.etree.ElementTree.canonicalize',
  },
};
